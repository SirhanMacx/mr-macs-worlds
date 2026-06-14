// loader.js — the Mind Atlas STORY-PACK loader. Registers every pack in
// packs/index.js into the live world, DEFENSIVELY: each pack's wiring is wrapped
// in try/catch so one broken pack can NEVER crash the world — it is logged and
// skipped, and every other pack still loads. This is the world controller's job
// (game.js calls registerPacks(...) once at boot); kept here so game.js stays
// surgical and CONTRACT.md authors have one place to read the contract behavior.
//
// Registration per pack:
//   - pack.npcs[]      → added at their region's station with dialogue + a
//                        "Speak with" marker, exactly like the built-in denizens.
//   - pack.triggers[]  → installed so pack.cutscenes fire ONCE at the right
//                        moment (region visit / story flag).
//   - pack.keystones[] → made reachable: from the pack NPC's dialogue ("answer
//                        the Fog") AND as a debug jump target. On success the
//                        keystone records its Codex entry, lifts Clarity (the
//                        standing meter), sets its flag, and unlocks any
//                        achievement.
//   - pack.codex[] / pack.achievements[] → no-op here; they are referenced by id
//                        from keystones (the loader validates the references).
//
// Depends only on ui.js + sfx.js + cutscene.js + dialogue.js (all shared). Never
// throws out of registerPacks.
import * as THREE from 'three';
import * as UI from '../../../ui.js';
import * as Sfx from '../../../sfx.js';
import { playCutscene } from '../../../cutscene.js';
import { openDialogue } from '../../../dialogue.js';

const esc = UI.esc;

// host = {
//   scene, field, player, stations, npcSys, particles,
//   S, story, save,
//   codex, ach,
//   raiseClarity(n,title,sub), insight(n,label), hurt(n,label), confidence(),
//   regionsRestored(),
//   regionStation(regionId)  -> the station object (has .pos),
//   isMobile,
// }
export function registerPacks(STORY_PACKS, host) {
  const registered = [];   // { id, unit, title, keystones:[ids], pack }
  const keystoneIndex = {}; // keystoneId -> { pack, ks }
  const npcByPackNpc = {}; // (packId+':'+npcId) -> { npc, spec }
  const firedTriggers = ensureSet(host.S, 'packTriggersFired');

  if (!Array.isArray(STORY_PACKS)) {
    warn('STORY_PACKS is not an array; no packs loaded.');
    return api();
  }

  const seenIds = new Set();
  for (const pack of STORY_PACKS) {
    try {
      if (!pack || !pack.id) { warn('skipped a pack with no id'); continue; }
      if (seenIds.has(pack.id)) { warn(`duplicate pack id "${pack.id}" — skipping the second`); continue; }
      seenIds.add(pack.id);

      const ksIds = registerOnePack(pack);
      registered.push({ id: pack.id, unit: pack.unit || '', title: pack.title || pack.id, keystones: ksIds, pack });
    } catch (e) {
      // a broken pack must NEVER take down the world.
      warn(`pack "${pack && pack.id}" failed to register — skipped`, e);
    }
  }
  return api();

  // ---------------------------------------------------------------------------
  function registerOnePack(pack) {
    // 1) NPCs — each is wrapped so one bad NPC doesn't sink the whole pack.
    (pack.npcs || []).forEach(spec => {
      try { addPackNPC(pack, spec); }
      catch (e) { warn(`pack "${pack.id}" npc "${spec && spec.id}" failed`, e); }
    });

    // 2) validate codex/achievement references the keystones rely on (warn only)
    const codexIds = new Set((pack.codex || []).map(c => c && c.id).filter(Boolean));
    const achIds = new Set((pack.achievements || []).map(a => a && a.id).filter(Boolean));

    // 3) keystones — make each reachable + index for the debug hook
    const ksIds = [];
    (pack.keystones || []).forEach(ks => {
      try {
        if (!ks || !ks.id) { warn(`pack "${pack.id}" has a keystone with no id`); return; }
        if (ks.recordCodex && !codexIds.has(ks.recordCodex)) warn(`pack "${pack.id}" keystone "${ks.id}" recordCodex "${ks.recordCodex}" has no matching codex[] entry`);
        if (ks.achievement && !achIds.has(ks.achievement)) warn(`pack "${pack.id}" keystone "${ks.id}" achievement "${ks.achievement}" has no matching achievements[] entry`);
        keystoneIndex[ks.id] = { pack, ks };
        ksIds.push(ks.id);
      } catch (e) { warn(`pack "${pack.id}" keystone register failed`, e); }
    });

    // 4) triggers — install once-fired cutscene hooks
    (pack.triggers || []).forEach((trig, i) => {
      try { installTrigger(pack, trig, i); }
      catch (e) { warn(`pack "${pack.id}" trigger #${i} failed`, e); }
    });

    return ksIds;
  }

  // --- NPC wiring (mirrors game.js' denizen loop) ----------------------------
  function addPackNPC(pack, spec) {
    const st = host.regionStation(spec.region);
    if (!st) { warn(`pack "${pack.id}" npc "${spec.id}": region "${spec.region}" has no station`); return; }
    const off = spec.offset || [6, 6];
    const x = st.pos.x + off[0];
    const z = st.pos.z + off[1];
    const npc = host.npcSys.addNPC({
      ...spec, x, z,
      face: Math.atan2(st.pos.x - x, st.pos.z - z) + Math.PI,
      labelColor: '#a9b8ff', wander: 4,
    });
    npcByPackNpc[pack.id + ':' + spec.id] = { npc, spec };
    host.stations.addExtra({
      id: 'pack-npc-' + pack.id + '-' + spec.id, type: 'npc', verb: 'Speak with', label: spec.name,
      pos: npc.group.position, interactR: 5,
      onInteract() { talkToPackNPC(pack, spec); },
    });
  }

  // The pack NPC's dialogue tree, then a bridge: a "FACE THE FOG" affordance that
  // launches any keystone this NPC delivers (the keystone path). We add it as a
  // synthetic terminal choice on the start/sendin node by intercepting close.
  function talkToPackNPC(pack, spec) {
    const ctx = dialogueCtx();
    // launch the keystone(s) this NPC owns once the conversation closes IF the
    // player asked for it. We expose a flag on ctx the dialogue can flip.
    ctx.faceTheFog = () => {
      const ks = (pack.keystones || []).find(k => k.npc === spec.id);
      if (ks) runKeystone(pack, ks);
    };
    // Patch the NPC's dialogue so the terminal "send me in" node offers the
    // keystone without the author having to wire the runner. We do this by
    // wrapping: if a node has zero choices AND a keystone exists for this NPC
    // that is not yet cleared, append a single say-style launcher.
    const ks = (pack.keystones || []).find(k => k.npc === spec.id);
    const tree = ks && !(ks.flag && host.story.is(ks.flag))
      ? withKeystoneLauncher(spec.dialogue, ks)
      : spec.dialogue;
    openDialogue(npcFor(pack, spec), tree, ctx);
  }

  function npcFor(pack, spec) {
    const r = npcByPackNpc[pack.id + ':' + spec.id];
    return r ? r.npc : { name: spec.name, title: spec.title, palette: spec.palette, talking: false };
  }

  // append a launcher choice to any terminal node (no choices) so the player can
  // walk from lore straight into the keystone.
  function withKeystoneLauncher(dialogue, ks) {
    const clone = { start: dialogue.start, nodes: {} };
    for (const id in dialogue.nodes) {
      const node = dialogue.nodes[id];
      const choices = (node.choices || []).slice();
      if (choices.length === 0) {
        choices.push({
          label: 'Take me to the Fog. I will answer it.',
          effect: (ctx) => { if (ctx.faceTheFog) setTimeout(ctx.faceTheFog, 60); },
          next: '@close',
        });
      }
      clone.nodes[id] = { ...node, choices };
    }
    return clone;
  }

  // --- TRIGGERS --------------------------------------------------------------
  function installTrigger(pack, trig, i) {
    const key = `${pack.id}:${i}`;
    const fire = () => {
      if (firedTriggers.has(key)) return;
      const beats = (pack.cutscenes || {})[trig.play];
      if (!Array.isArray(beats) || !beats.length) { warn(`pack "${pack.id}" trigger #${i}: cutscene "${trig.play}" missing`); return; }
      firedTriggers.add(key); persistSet(host.S, 'packTriggersFired', firedTriggers); host.save();
      // don't stomp an open overlay; defer until the stage is clear
      const play = () => playCutscene(beats).then(() => applyReward(trig.reward));
      if (UI.isOpen()) setTimeout(play, 400); else play();
    };

    if (trig.on === 'flag') {
      host._packFlagWatchers.push({ flag: trig.value, fire });
      if (host.story.is(trig.value)) fire(); // already true on load
    } else { // 'visit' / 'enter'
      host._packVisitWatchers.push({ region: trig.value, fire });
    }
  }

  function applyReward(reward) {
    if (!reward) return;
    try {
      if (reward.clarity) host.raiseClarity(reward.clarity, null, null);
      if (reward.insight) host.insight(reward.insight, 'the Fog records a memory');
      if (reward.xp && host.xp) host.xp(reward.xp);
    } catch (e) { /* reward must never break a cutscene */ }
  }

  // --- KEYSTONE RUNNER (the wraith/Nin-Banda pattern, generic) ---------------
  // taunt → ask → say-choices. WRONG = Fog thickens (confidence cost) + mentor
  // coach (consequence, not a red X) → loop back to the SAME ask. RIGHT = world
  // changes: Codex record + Clarity lift + flag + achievement + payoff line.
  function runKeystone(pack, ks) {
    injectKsStyleOnce();
    let coaching = null; // a coach string while the mentor is talking
    let card = null;
    UI.push({
      className: 'gui-ma mmw-ks',
      html: '<div class="ma-card"></div>',
      onMount(el) { card = el.querySelector('.ma-card'); renderTaunt(); },
    });

    function head(kicker, title, bad) {
      return `<div class="ma-head"><div><div class="ma-kicker ${bad ? 'bad' : ''}">${esc(kicker)}</div>
        <div class="ma-title">${esc(title)}</div></div>
        <button class="dlg-x" data-gui-close>WITHDRAW</button></div>`;
    }
    function fogSvg() {
      return `<svg viewBox="0 0 120 96" class="mmw-ksfog" aria-hidden="true">
        <defs><radialGradient id="ksf" cx="50%" cy="42%" r="62%">
          <stop offset="0%" stop-color="#b07cff"/><stop offset="65%" stop-color="#3a2466"/><stop offset="100%" stop-color="#1a1030"/></radialGradient></defs>
        <path d="M60 8 C30 6 16 30 22 54 C24 72 14 80 10 92 C28 88 34 94 48 90 C54 94 66 94 72 90 C86 94 92 88 110 92 C106 80 96 72 98 54 C104 30 90 6 60 8 Z" fill="url(#ksf)" opacity="0.86"/>
        <circle cx="46" cy="44" r="6" fill="#ece9ff"/><circle cx="74" cy="44" r="6" fill="#ece9ff"/>
        <circle cx="46" cy="45" r="2.4" fill="#1a0f2e"/><circle cx="74" cy="45" r="2.4" fill="#1a0f2e"/></svg>`;
    }
    function atlasSvg() {
      return `<svg viewBox="0 0 100 88" class="mmw-ksatlas" aria-hidden="true">
        <defs><radialGradient id="ksa" cx="50%" cy="42%" r="60%">
          <stop offset="0%" stop-color="#ffe7b0"/><stop offset="100%" stop-color="#163a4a"/></radialGradient></defs>
        <circle cx="50" cy="44" r="30" fill="url(#ksa)" opacity="0.95"/><circle cx="50" cy="44" r="13" fill="#fff3d0"/></svg>`;
    }

    function renderTaunt() {
      card.innerHTML = `
        ${head(ks.kicker || 'THE FOG', ks.title || pack.title, true)}
        <div class="mmw-ksbody">${fogSvg()}</div>
        <div class="mmw-ksclaim">${esc(ks.taunt || 'The Fog offers you a comfortable, familiar belief.')}</div>
        <p class="mmw-ksask">${esc(ks.ask || 'Answer the Fog with the truth.')}</p>
        <div class="ma-actions"><button class="ma-go prim" id="mmw-faceit">Answer the Fog with the science</button></div>`;
      const b = card.querySelector('#mmw-faceit');
      if (b) b.addEventListener('click', () => { Sfx.click(); renderChoices(); });
    }

    function renderChoices() {
      if (coaching) return renderCoach();
      // shuffle so the correct line isn't always first
      const choices = (ks.choices || []).map((c, idx) => ({ ...c, _i: idx })).sort(() => Math.random() - 0.5);
      card.innerHTML = `
        ${head(ks.kicker || 'THE FOG', ks.title || pack.title, true)}
        <div class="mmw-ksbody">${fogSvg()}</div>
        <div class="mmw-ksclaim">${esc(ks.ask || 'The Fog presses its belief on you.')}</div>
        <p class="mmw-ksask">You answer:</p>
        <div class="mmw-ksreframes">${choices.map(c =>
          `<button class="ma-reframe say" data-ok="${c.correct ? 1 : 0}" data-i="${c._i}">${esc(c.label)}</button>`).join('')}</div>`;
      card.querySelectorAll('.ma-reframe').forEach(b => b.addEventListener('click', () => {
        const i = +b.dataset.i;
        strike(ks.choices[i], b);
      }));
    }

    function strike(choice, btn) {
      if (!choice) return;
      if (choice.correct) { win(); return; }
      // WRONG = consequence, not a red X. The Fog thickens (confidence bite) and
      // the mentor coaches, then we loop back to the same ask.
      Sfx.bad();
      try { if (Sfx.storyMiss) Sfx.storyMiss(); } catch (e) { /* ok */ }
      const cost = typeof ks.confidenceCost === 'number' ? ks.confidenceCost : 12;
      try { host.hurt(cost, 'the Fog feeds on the easy belief'); } catch (e) { /* ok */ }
      if (btn) btn.classList.add('wrong');
      coaching = choice.coach || 'Atlas’s light steadies you. "The Fog thickened because you reached for the comfortable belief. Look at what is actually true here, then answer it again."';
      renderCoach();
    }

    function renderCoach() {
      card.innerHTML = `
        ${head('YOUR GUIDE', 'The Fog thickened — look again', false)}
        <div class="mmw-ksbody">${atlasSvg()}</div>
        <p class="mmw-kscoach">${esc(coaching)}</p>
        <div class="ma-actions"><button class="ma-go prim" id="mmw-retry">I understand now — face the Fog again</button></div>`;
      const b = card.querySelector('#mmw-retry');
      if (b) b.addEventListener('click', () => { Sfx.click(); coaching = null; renderChoices(); });
    }

    function win() {
      // THE WORLD CHANGES. Record the Codex entry, lift Clarity, set the flag,
      // unlock the achievement, then show the payoff. All guarded so a journal
      // write can never break the beat.
      try {
        if (ks.recordCodex) {
          const entry = (pack.codex || []).find(c => c.id === ks.recordCodex);
          if (entry && host.codex) host.codex.record(entry);
        }
      } catch (e) { /* never break the beat over a codex write */ }
      try { if (ks.flag) host.story.flag(ks.flag); } catch (e) { /* ok */ }
      try {
        if (ks.achievement && host.ach) {
          const a = (pack.achievements || []).find(x => x.id === ks.achievement);
          if (a) host.ach.unlock(a.id, { title: a.title, desc: a.desc });
        }
      } catch (e) { /* ok */ }
      try {
        const lift = typeof ks.clarity === 'number' ? ks.clarity : 8;
        host.raiseClarity(lift, 'The Fog recedes', `${esc(pack.unit || pack.title)} — a turning point understood.`);
      } catch (e) { /* ok */ }
      try { Sfx.examPass(); } catch (e) { /* ok */ }

      card.innerHTML = `
        ${head('THE FOG RECEDES', (ks.title || pack.title) + ' can’t hold here', false)}
        <div class="mmw-ksbody">${fogSvg()}</div>
        <p class="mmw-kswin">${esc(ks.win || 'The Fog loses its hold here, thinning to almost nothing.')}</p>
        <div class="ma-actions"><button class="ma-go" data-gui-close>CONTINUE</button></div>`;
    }
  }

  // --- dialogue context handed to pack NPC trees -----------------------------
  function dialogueCtx() {
    return {
      state: host.S, story: host.story,
      is: (k) => host.story.is(k),
      flag: (k, v = true) => host.story.flag(k, v),
      regionsRestored: host.regionsRestored,
      hasAbility: (id) => !!host.S.abilities[id],
      raiseClarity: (n, t, s) => host.raiseClarity(n, t, s),
      insight: (n, l) => host.insight(n, l),
    };
  }

  // --- the api the world keeps (for the frame loop + debug hook) --------------
  function api() {
    return {
      list() { return registered.map(r => ({ id: r.id, unit: r.unit, title: r.title, keystones: r.keystones.slice() })); },
      count() { return registered.length; },
      keystoneIds() { return Object.keys(keystoneIndex); },
      // jump straight into a keystone's encounter (debug/verify)
      runKeystone(keystoneId) {
        const e = keystoneIndex[keystoneId];
        if (!e) return false;
        runKeystone(e.pack, e.ks);
        return true;
      },
      keystoneInfo(keystoneId) {
        const e = keystoneIndex[keystoneId];
        return e ? { pack: e.pack.id, region: e.ks.region, flag: e.ks.flag, codex: e.ks.recordCodex } : null;
      },
    };
  }
}

// store the visit/flag watcher arrays on host so the controller's frame loop +
// flag() can drive them. The controller seeds these before calling registerPacks.
export function makePackHostState() {
  return { _packVisitWatchers: [], _packFlagWatchers: [] };
}

// ---------- helpers ----------
function ensureSet(S, field) {
  if (!S) return new Set();
  if (!Array.isArray(S[field])) S[field] = [];
  return new Set(S[field]);
}
function persistSet(S, field, set) { if (S) S[field] = Array.from(set); }
function warn(msg, e) { try { console.warn('[mmw packs] ' + msg, e || ''); } catch (x) { /* no console */ } }

// ---------- scoped CSS for the keystone overlay (does NOT touch css/game.css) --
function injectKsStyleOnce() {
  if (typeof document === 'undefined') return;
  if (document.getElementById('mmw-ks-style')) return;
  const s = document.createElement('style');
  s.id = 'mmw-ks-style';
  s.textContent = `
.gui-ma.mmw-ks .ma-card{max-width:640px;}
.mmw-ks .mmw-ksbody{display:flex;justify-content:center;margin:6px 0 10px;}
.mmw-ks .mmw-ksfog,.mmw-ks .mmw-ksatlas{width:120px;height:auto;filter:drop-shadow(0 6px 18px rgba(0,0,0,.5));}
.mmw-ks .mmw-ksclaim{font:600 14.5px/1.55 Georgia,serif;color:#e7dcff;background:rgba(120,80,180,.16);
  border-left:3px solid #b07cff;border-radius:7px;padding:11px 13px;}
.mmw-ks .mmw-ksask{font:600 13px/1.5 system-ui,sans-serif;color:#cde8ff;margin:11px 0 8px;}
.mmw-ks .mmw-ksreframes{display:flex;flex-direction:column;gap:8px;}
.mmw-ks .ma-reframe.say{text-align:left;font:500 13.5px/1.5 Georgia,serif;}
.mmw-ks .ma-reframe.wrong{outline:2px solid rgba(176,124,255,.6);opacity:.7;}
.mmw-ks .mmw-kscoach{font:500 13.5px/1.6 Georgia,serif;color:#ffe9c0;background:rgba(255,209,102,.08);
  border-left:3px solid #ffd27f;border-radius:7px;padding:11px 13px;}
.mmw-ks .mmw-kswin{font:600 14px/1.6 Georgia,serif;color:#bdf5e6;background:rgba(45,212,191,.1);
  border-left:3px solid #2dd4bf;border-radius:7px;padding:11px 13px;}
`;
  document.head.appendChild(s);
}
