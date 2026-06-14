// game.js — MIND ATLAS controller: turns the AP Psychology world into a
// mind-delver action-puzzle adventure. Five unit-regions to RESTORE (a concept-
// mechanic puzzle + a Misconception Wraith each), psych-themed ABILITIES that
// gate progression, Case File investigations (AAQ/EBQ) at the Observatory, and
// an optional Trial of the Self off the 175-question bank. Reuses the shared
// game systems; saves on every action. 2024 CED scope throughout.
import * as THREE from 'three';
import * as Panels from '../../../learn/panels.js';
import * as Audio from '../../../engine/audio.js';

import { createSave } from '../../save.js';
import { createStory } from '../../story.js';
import { playCutscene } from '../../cutscene.js';
import { playOpeningShot, OPENING_SHOTS } from '../../../engine/cinematic.js';
import { createXP } from '../../xp.js';
import { createNPCSystem } from '../../npc.js';
import { createParticles } from '../../particles.js';
import { openDialogue } from '../../dialogue.js';
import { createCodex } from '../../codex.js';
import { createAchievements } from '../../achievements.js';
import * as UI from '../../ui.js';
import * as Sfx from '../../sfx.js';

// PROOF-OF-LEARNING SPINE (purely additive — see GAME_PROOF_OF_LEARNING_SPEC.md).
// Standards crosswalk + mastery read model + Leitner retrieval + the in-character
// "remember when…" beat + the printable study sheet + the exam-bridge capstone
// artifact + the PII-free teacher export code. None of these touch the frozen
// files; they read the Codex (the only evidence of learning) and ride the save.
import * as STANDARDS from './standards.js';
import { createMastery, openCoveragePanel } from '../../mastery.js';
import { createRetrieval } from '../../retrieval.js';
import { openRetrievalBeat } from '../../retrieval-beat.js';
import { openStudySheet } from '../../studysheet.js';
import { buildArtifact, openArtifactPanel } from '../../capstone-artifact.js';
import { encode as encodePoL } from '../../../teacher/export-code.js';

// ADDITIVE story-pack system — dozens of curriculum content packs can plug in.
import { STORY_PACKS } from './packs/index.js';
import { registerPacks, makePackHostState } from './packs/loader.js';

import {
  EXAM, ABILITIES, REGIONS, ORDER, CASE_REGION, DENIZENS,
  CASE_FILES, WRAITHS, REINFORCEMENT,
  COLD_OPEN, ATLAS_VOICE, FOG,
} from './content.js';
import { PUZZLES, openReinforcement } from './puzzles.js';
import { openWraith } from './wraith.js';
import { openCase } from './casefile.js';
import { openTrial } from './trial.js';

const esc = UI.esc;
const REGION_BY = {}; REGIONS.forEach(r => { REGION_BY[r.id] = r; });

const DEFAULTS = {
  v: 2, // bumped for the story rebuild — old pre-story saves reset so the cold open plays
  insight: 0, xp: 0, level: 1, perkPts: 0,
  confidence: 100,
  regions: {},          // id -> { puzzle, wraith, restored, reinforcement }
  abilities: {},        // id -> true
  gates: {},            // regionId -> true (gate attuned/passed)
  scrolls: 0,           // 0..3 evidence scrolls gathered (Case Files gate)
  cases: {},            // caseId -> solved bool
  flags: {},
  // narrative spine — chapter/beat/flags migrate cleanly onto old saves.
  // CLARITY is the emotional meter: it rises as the Fog recedes / regions
  // are restored (the inverse of the Fog's grip on the mind).
  story: { chapter: 0, beat: 'coldopen', flags: {} },
  clarity: 0,
  pos: null,
};

const MAXCONF = 100;

export async function initGame(api) {
  const { scene, field, player, stations, camera, def, isMobile } = api;

  // ---------- state ----------
  const store = createSave('mind-atlas', DEFAULTS);
  const S = store.state;
  const save = () => store.save();
  if (typeof S.clarity !== 'number') S.clarity = 0; // defensive for pre-story saves
  const story = createStory({ state: S, save });
  // shared Codex + Achievements (the growing 'Clarity'/correct-science record).
  // state.codex / state.achievements ride the existing per-world save (save.js
  // merges new fields over defaults) so they appear on old saves as empty arrays.
  const codex = createCodex({ state: S, save });
  const ach = createAchievements({ state: S, save });
  function rec(id) { if (!S.regions[id]) S.regions[id] = { puzzle: false, wraith: false, restored: false, reinforcement: false }; return S.regions[id]; }

  // ---------- Proof-of-Learning spine (additive) ----------
  // mastery: a pure read model over Codex + this world's standards map (AP Psych
  // CED). retrieval: the Leitner schedule riding state.retrieval (lazily inited;
  // pre-spine saves load untouched). ensureCards backfills a box-1 card for every
  // Codex id already earned on this save. None of this throws on a bad shape.
  const mastery = createMastery({ codex, standards: STANDARDS });
  const retrieval = createRetrieval({ state: S, save, codex });
  try { retrieval.ensureCards(); } catch (e) { /* private mode / no clock — never block boot */ }
  // session rate-limit for the gentle retrieval beat (~1 surfacing per session).
  let retrievalBeatShown = false;
  // edge-detect the capstone win flag so the exam-bridge artifact opens exactly
  // once when the Exam of the Self is passed (the loader sets the flag + records
  // the codex; we observe the transition without touching the loader/pack).
  let capstoneArtifactShown = false;

  // ---------- systems ----------
  UI.init(api);
  const particles = createParticles(scene);
  const npcSys = createNPCSystem(scene, field, camera);
  const xp = createXP({
    state: S, save,
    onLevelUp(level) {
      Sfx.levelUp();
      UI.banner(`Cartographer Level ${level}`, 'Your map of the mind sharpens');
      particles.burst('confetti', player.pos.x, player.pos.y, player.pos.z, 22);
      refreshHud();
    },
  });

  // ---------- g: the interface puzzles/wraiths/cases use ----------
  const g = {
    S, story,
    // the Fog escalates region to region — wraith.js reads this to pick its line
    regionsRestored() { return regionsRestored(); },
    fx(kind, n) { particles.burst(kind, player.pos.x, player.pos.y, player.pos.z, n || (kind === 'confetti' ? 30 : 14)); },
    hasAbility(id) { return !!S.abilities[id]; },
    confidence() { return S.confidence; },
    hurt(n, label) {
      S.confidence = Math.max(0, S.confidence - n);
      UI.floatText(`-${n} confidence${label ? ' — ' + label : ''}`, 'loss');
      save(); refreshHud();
    },
    recover() { S.confidence = Math.max(40, S.confidence); save(); refreshHud(); },
    insight(n, label) {
      if (n) {
        S.insight += n; Sfx.coin();
        UI.floatText(`+${n} insight${label ? ' — ' + label : ''}`, 'gain');
        particles.burst('sparkle', player.pos.x, player.pos.y, player.pos.z, 8);
      }
      save(); refreshHud();
    },
    xp(n, label) { if (label) UI.floatText(`+${n} XP ${label}`, 'xp'); xp.add(n); refreshHud(); },
  };

  // ---------- HUD ----------
  // namespaced inline style for the Clarity meter + Atlas-speaks button (no
  // edits to css/game.css — these reuse the .mb-* idiom of the existing HUD).
  if (!document.getElementById('ma-story-style')) {
    const st = document.createElement('style');
    st.id = 'ma-story-style';
    st.textContent = `
      #mind-bar .mb-clarity .mb-clarbar{display:inline-block;width:74px;height:8px;border-radius:5px;
        background:rgba(20,16,40,0.85);box-shadow:inset 0 0 0 1px rgba(176,124,255,0.35);overflow:hidden;vertical-align:middle;margin-left:5px;}
      #mind-bar .mb-clarity .mb-clarbar i{display:block;height:100%;width:0%;
        background:linear-gradient(90deg,#7df2e0,#ffd27f);transition:width .5s ease;}
      #mind-bar .mb-clarity{color:#cde8ff;}
      #mind-bar #mb-atlasvoice{margin-left:6px;}`;
    document.head.appendChild(st);
  }

  const bar = document.createElement('div');
  bar.id = 'mind-bar';
  bar.innerHTML = `
    <div class="mb-block mb-ins" title="Insight — earned by solving the mind"><span class="mb-dot"></span><b id="mb-ins">0</b></div>
    <div class="mb-block mb-clarity" title="Clarity — the mind knowing itself again as the Fog recedes">
      <span class="mb-lab">CLARITY</span><span class="mb-clarbar"><i id="mb-clarfill"></i></span></div>
    <div class="mb-block mb-conf" title="Confidence — your strength when you face the Fog">
      <span class="mb-lab">CONF</span><span class="mb-confbar"><i id="mb-conffill"></i></span></div>
    <div class="mb-block mb-lvl" title="Cartographer level"><span class="mb-lab">LV</span> <b id="mb-level">1</b>
      <span class="mb-xpbar"><i id="mb-xpfill"></i></span></div>
    <div class="mb-block mb-reg" title="Regions restored — the Fog driven back"><span class="mb-lab">RESTORED</span> <b id="mb-reg">0/5</b></div>
    <div class="mb-block mb-exam" title="The in-world exam date"><span class="mb-lab">EXAM</span> <b>${esc(EXAM.label)}</b></div>
    <div class="mb-block mb-abil" id="mb-abil" title="Abilities earned"></div>
    <button id="mb-atlas" class="mb-btn" title="The atlas of the mind — regions, abilities, cases">ATLAS</button>
    <button id="mb-atlasvoice" class="mb-btn" title="Speak with Atlas, the mind's guide">ATLAS SPEAKS</button>
    <button id="mb-codex" class="mb-btn" title="Field Journal — what you have come to understand (the growing record of Clarity)">CODEX</button>
    <button id="mb-coverage" class="mb-btn" title="Standards Coverage — what you understand mapped to the AP Psychology exam, with PRINT and a no-name SHARE code">COVERAGE</button>
    <button id="mb-ach" class="mb-btn" title="Milestones you carried through">MEDALS</button>`;
  document.body.appendChild(bar);
  bar.querySelector('#mb-atlas').addEventListener('click', () => { Sfx.click(); openAtlas(); });
  bar.querySelector('#mb-atlasvoice').addEventListener('click', () => { Sfx.click(); speakWithAtlas(); });
  bar.querySelector('#mb-codex').addEventListener('click', () => { Sfx.click(); codex.open(); });
  bar.querySelector('#mb-coverage').addEventListener('click', () => { Sfx.click(); openCoverage(); });
  bar.querySelector('#mb-ach').addEventListener('click', () => { Sfx.click(); ach.open(); });
  window.addEventListener('keydown', (e) => {
    if (e.target.tagName === 'TEXTAREA' || e.target.tagName === 'INPUT') return;
    if (e.code === 'KeyM') { e.stopImmediatePropagation(); openAtlas(); }
    if (e.code === 'KeyJ') { e.stopImmediatePropagation(); codex.open(); }
  }, true);

  function regionsRestored() { return ORDER.filter(id => rec(id).restored).length; }
  // CLARITY: emotional spine. The mind knows itself again as the Fog recedes.
  // Driven primarily by regions restored (each = 20%), nudged by clarity bumps
  // from story beats, capped at 100. Inverse of the Fog's grip.
  function clarityNow() {
    const base = regionsRestored() * 20;
    return Math.max(0, Math.min(100, base + (S.clarity || 0)));
  }
  function refreshHud() {
    bar.querySelector('#mb-ins').textContent = S.insight;
    const clar = bar.querySelector('#mb-clarfill');
    if (clar) clar.style.width = clarityNow() + '%';
    bar.querySelector('#mb-conffill').style.width = Math.round((S.confidence / MAXCONF) * 100) + '%';
    bar.querySelector('#mb-conffill').className = S.confidence < 30 ? 'low' : '';
    const pr = xp.progress();
    bar.querySelector('#mb-level').textContent = pr.level;
    bar.querySelector('#mb-xpfill').style.width = Math.round(pr.frac * 100) + '%';
    bar.querySelector('#mb-reg').textContent = regionsRestored() + '/5';
    const ab = ORDER.map(id => REGION_BY[id]).filter(r => S.abilities[r.grants]).map(r => ABILITIES[r.grants]);
    bar.querySelector('#mb-abil').innerHTML = ab.length
      ? ab.map(a => `<span class="mb-ab" title="${esc(a.name)} — ${esc(a.desc)}">${esc(a.icon)}</span>`).join('')
      : '<span class="mb-abnone">no abilities yet</span>';
  }

  // ---------- region display names + station overrides ----------
  for (const region of REGIONS) {
    const st = stations.list.find(s => s.id === region.id);
    if (!st) continue;
    st.label = region.name;
    st.sub = region.unit;
    st.verb = 'Enter';
    st.onInteract = () => openRegionHub(region);
  }
  // Observatory → Case Files
  {
    const st = stations.list.find(s => s.id === CASE_REGION);
    if (st) { st.label = 'The Observatory'; st.sub = 'Case Files — AAQ & EBQ'; st.verb = 'Investigate'; st.onInteract = openCaseMenu; }
  }
  // FRQ pavilion → also Case Files
  {
    const st = stations.list.find(s => s.id === 'frq');
    if (st) { st.label = 'Free-Response Pavilion'; st.sub = 'Case Files lab'; st.verb = 'Enter'; st.onInteract = openCaseMenu; }
  }
  // MCQ exam gate → Trial of the Self
  {
    const st = stations.list.find(s => s.id === 'mcq');
    if (st) {
      st.label = 'The Examination Gate'; st.sub = 'Face the Fog — Trial of the Self'; st.verb = 'Approach';
      st.onInteract = () => {
        if (regionsRestored() < 5) {
          Sfx.denied();
          Panels.toast('The gate is sealed while the Fog still holds a region. Restore all five, then come face it here.');
          return;
        }
        const startTrial = () => openTrial(g, (c, n) => {
          UI.banner('The Self is whole', `${c} of ${n} — the mind answered itself, and the Fog has nowhere left to hide.`);
          g.xp(60, 'Trial of the Self'); S.flags.trial = true; save();
        });
        // first approach with all five restored = the Fog's final confrontation
        fogFinale(startTrial);
      };
    }
  }

  // ---------- ability gates (3D barriers, metroidvania) ----------
  const gateMeshes = {};
  const gateExtras = {};
  function buildGate(region) {
    const st = stations.list.find(s => s.id === region.id);
    if (!st) return;
    // place the gate on the approach (toward world center) from the region
    const cx = st.pos.x, cz = st.pos.z;
    const len = Math.hypot(cx, cz) || 1;
    const gx = cx - (cx / len) * 16;
    const gz = cz - (cz / len) * 16;
    const gy = field.height(gx, gz);
    const grp = new THREE.Group();
    const col = new THREE.Color(region.color);
    const wall = new THREE.Mesh(
      new THREE.PlaneGeometry(7, 8, 1, 1),
      new THREE.MeshBasicMaterial({ color: col, transparent: true, opacity: 0.26, side: THREE.DoubleSide, depthWrite: false, blending: THREE.AdditiveBlending })
    );
    wall.position.y = 4;
    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(3.4, 0.18, 8, 24),
      new THREE.MeshBasicMaterial({ color: col, transparent: true, opacity: 0.8, depthWrite: false })
    );
    ring.position.y = 4;
    grp.add(wall, ring);
    grp.position.set(gx, gy, gz);
    grp.lookAt(0, gy + 4, 0);
    scene.add(grp);
    gateMeshes[region.id] = { grp, wall, ring };

    if (S.gates[region.id]) { grp.visible = false; }
    gateExtras[region.id] = stations.addExtra({
      id: 'gate-' + region.id, type: 'gate', verb: 'Attune', label: region.name + ' Gate',
      pos: new THREE.Vector3(gx, gy, gz), interactR: 6,
      hidden: !!S.gates[region.id],
      onInteract() { tryGate(region); },
    });
  }
  function tryGate(region) {
    if (S.gates[region.id]) { Panels.toast(`The ${region.name} gate already stands open.`); return; }
    if (g.hasAbility(region.gateReq)) {
      S.gates[region.id] = true; save();
      Sfx.eraUnlock();
      const gm = gateMeshes[region.id];
      if (gm) { gm.grp.visible = false; }
      if (gateExtras[region.id]) gateExtras[region.id].hidden = true;
      UI.banner(`${region.name} gate attuned`, `${ABILITIES[region.gateReq].name} resonates — the way is open`);
      particles.burst('confetti', player.pos.x, player.pos.y, player.pos.z, 24);
    } else {
      Sfx.denied();
      const need = ABILITIES[region.gateReq];
      const src = REGIONS.find(r => r.grants === region.gateReq);
      Panels.toast(`A barrier of ${need.name.toLowerCase()}. Restore ${src ? src.name : 'the prior region'} to earn ${need.name}, then return.`);
    }
  }
  REGIONS.filter(r => r.gateReq).forEach(buildGate);
  function refreshExtras() {
    // hide gate interactables once passed
    REGIONS.filter(r => r.gateReq).forEach(r => {
      const ex = stations.list ? null : null; // gates are extras; toggle via stored ref
    });
  }

  // dialogue context (mirrors Trade Winds' dialogueCtx): denizens + Atlas can
  // touch story flags, the Clarity meter, and ability checks from their effects.
  function dialogueCtx(spec) {
    return {
      state: S, story,
      regionsRestored,
      hasAbility(id) { return !!S.abilities[id]; },
      raiseClarity(n, title, sub) { raiseClarity(n, title, sub); },
      insight(n, label) { g.insight(n, label); },
    };
  }

  // ---------- denizens (mind NPCs) ----------
  for (const key in DENIZENS) {
    const spec = DENIZENS[key];
    const st = stations.list.find(s => s.id === spec.region);
    if (!st) continue;
    const x = st.pos.x + spec.offset[0];
    const z = st.pos.z + spec.offset[1];
    const npc = npcSys.addNPC({
      ...spec, x, z,
      face: Math.atan2(st.pos.x - x, st.pos.z - z) + Math.PI,
      labelColor: '#a9b8ff', wander: 4,
    });
    stations.addExtra({
      id: 'denizen-' + spec.id, type: 'npc', verb: 'Speak with', label: spec.name,
      pos: npc.group.position, interactR: 5,
      onInteract() { openDialogue(npc, spec.dialogue, dialogueCtx(spec)); },
    });
  }

  // ---------- ATLAS, the mentor voice ----------
  // Atlas has no body — it is the mind's own sense of itself. We speak with it
  // through the standard dialogue overlay using a synthetic NPC + the lighthouse
  // palette. The start node is story-flag-aware (frames the first move, reacts
  // as regions return). Summon it from the HUD or after key story moments.
  const atlasNpc = { name: ATLAS_VOICE.name, title: ATLAS_VOICE.title, palette: ATLAS_VOICE.palette, talking: false };
  function speakWithAtlas() {
    openDialogue(atlasNpc, ATLAS_VOICE.dialogue, dialogueCtx({}));
  }

  // raise CLARITY — the emotional spine. A satisfying sting + a sparkle/confetti
  // burst + a banner, so a story win FEELS like the mind clearing, not a score.
  function raiseClarity(n, title, sub) {
    S.clarity = Math.max(0, (S.clarity || 0) + n);
    save();
    try { Sfx.houseRise(); } catch (e) { Sfx.good(); }
    particles.burst('sparkle', player.pos.x, player.pos.y + 1.5, player.pos.z, 22);
    if (title) UI.banner(title, sub || '', 3400);
    refreshHud();
  }

  // ---------- evidence scrolls (Case Files gather step) ----------
  const scrollExtras = [];
  function buildScrolls() {
    const st = stations.list.find(s => s.id === CASE_REGION);
    if (!st) return;
    const spots = [[14, 8], [-12, 12], [10, -14]];
    spots.forEach((o, i) => {
      if (i < S.scrolls) return; // already gathered
      const x = st.pos.x + o[0], z = st.pos.z + o[1], y = field.height(x, z);
      const m = new THREE.Mesh(
        new THREE.CylinderGeometry(0.22, 0.22, 1.1, 8),
        new THREE.MeshStandardMaterial({ color: 0xf0e6c8, emissive: 0x6b5e2c, emissiveIntensity: 0.5, roughness: 0.6 })
      );
      m.position.set(x, y + 1.0, z);
      m.rotation.z = 0.5;
      scene.add(m);
      const ex = stations.addExtra({
        id: 'scroll-' + i, type: 'scroll', verb: 'Take', label: 'Evidence Scroll',
        pos: new THREE.Vector3(x, y, z), interactR: 4,
        onInteract() {
          S.scrolls = Math.min(3, S.scrolls + 1); save();
          Sfx.questAccept(); particles.burst('sparkle', x, y + 1, z, 10);
          scene.remove(m); stations.removeExtra(ex);
          UI.floatText('Evidence scroll gathered', 'gain');
          if (S.scrolls >= 3) UI.banner('Evidence complete', 'The Case Files at the Observatory are ready to open');
          else Panels.toast(`Evidence scroll ${S.scrolls}/3 — find the rest near the Observatory.`);
        },
      });
      scrollExtras.push({ ex, m });
    });
  }
  buildScrolls();

  // ---------- STORY-PACK SYSTEM (additive) ----------
  // Register every pack in packs/index.js into the live world DEFENSIVELY (the
  // loader wraps each pack's wiring in try/catch — one broken pack can NEVER
  // crash the world). Pack NPCs join the world at existing region stations with
  // dialogue + markers; pack triggers fire their cutscenes once at region-visit
  // or story-flag; pack keystones become reachable (from the pack NPC and as a
  // debug jump). On a keystone win the loader records the Codex entry, lifts
  // Clarity (the standing meter), sets the flag, and unlocks any achievement.
  const packHostState = makePackHostState();
  const packHost = {
    scene, field, player, stations, npcSys, particles,
    S, story, save, codex, ach, isMobile,
    xp: (n) => g.xp(n),
    raiseClarity: (n, t, s) => raiseClarity(n, t, s),
    insight: (n, l) => g.insight(n, l),
    hurt: (n, l) => g.hurt(n, l),
    confidence: () => S.confidence,
    regionsRestored,
    regionStation: (id) => stations.list.find(s => s.id === id),
    _packVisitWatchers: packHostState._packVisitWatchers,
    _packFlagWatchers: packHostState._packFlagWatchers,
  };
  let packs = { list: () => [], count: () => 0, keystoneIds: () => [], runKeystone: () => false, keystoneInfo: () => null };
  try {
    packs = registerPacks(STORY_PACKS, packHost);
  } catch (e) {
    try { console.warn('[mmw packs] registerPacks failed; world continues without packs', e); } catch (x) { /* no console */ }
  }
  // pack trigger pumps: a region-visit pump (frame loop) + a flag pump (polled).
  // Both are driven below in the frame loop so triggers fire at the right beat
  // without touching the shared story.js module.
  let packPrevRegion = null;
  function pumpPackVisit() {
    const wl = packHost._packVisitWatchers;
    if (!wl.length) return;
    // reuse the ambience region detection: which region am I standing in?
    let inId = null;
    for (const r of def.regions) {
      const dx = player.pos.x - r.center[0], dz = player.pos.z - r.center[1];
      if (dx * dx + dz * dz < (r.r * 1.05) * (r.r * 1.05)) { inId = r.id; break; }
    }
    if (inId && inId !== packPrevRegion) {
      packPrevRegion = inId;
      for (const w of wl) if (w.region === inId) { try { w.fire(); } catch (e) { /* trigger never crashes */ } }
    } else if (!inId) {
      packPrevRegion = null;
    }
  }
  function pumpPackFlags() {
    const wl = packHost._packFlagWatchers;
    for (const w of wl) { try { if (story.is(w.flag)) w.fire(); } catch (e) { /* ok */ } }
  }

  // ---------- region hub ----------
  function openRegionHub(region) {
    UI.push({
      className: 'gui-ma ma-hub',
      html: '<div class="ma-card"></div>',
      onMount(el) { renderHub(el.querySelector('.ma-card'), region); },
    });
  }
  function renderHub(card, region) {
    const r = rec(region.id);
    const gated = !!region.gateReq && !S.gates[region.id];
    const wraith = WRAITHS[region.id];
    const puzLabel = {
      neuron: 'Route the neural signals', memory: 'Carry the memory orbs',
      conditioning: 'Condition your companion', attribution: 'Judge the attributions',
      restructure: 'Restructure the thoughts',
    }[region.puzzle];
    card.innerHTML = `
      <div class="ma-head"><div><div class="ma-kicker" style="color:#${region.color.toString(16).padStart(6, '0')}">${esc(region.unit)}</div>
        <div class="ma-title">${esc(region.name)}${r.restored ? ' · RESTORED' : ''}</div></div>
        <button class="dlg-x" data-gui-close>LEAVE</button></div>
      <p class="ma-clue">${esc(region.blurb)}</p>
      ${gated ? `<div class="ma-gatewarn">The region's signals are scrambled. Attune the <b>${esc(region.name)} Gate</b> nearby using <b>${esc(ABILITIES[region.gateReq].name)}</b> (earned by restoring ${esc((REGIONS.find(x => x.grants === region.gateReq) || {}).name || 'the prior region')}).</div>` : ''}
      <div class="ma-hubrow">
        <button class="ma-go ${r.puzzle ? 'done' : 'prim'}" id="hub-puzzle" ${gated || r.puzzle ? 'disabled' : ''}>${r.puzzle ? 'Concept solved ✓' : puzLabel}</button>
        <button class="ma-go ${r.wraith ? 'done' : ''}" id="hub-wraith" ${(!r.puzzle || r.wraith) ? 'disabled' : ''}>${r.wraith ? 'Wraith dispelled ✓' : 'Confront ' + esc(wraith ? wraith.name : 'the wraith')}</button>
      </div>
      ${region.puzzle === 'conditioning' ? `<button class="ma-go ${r.reinforcement ? 'done' : ''}" id="hub-reinf" ${r.reinforcement ? 'disabled' : ''}>${r.reinforcement ? 'Reinforcement read ✓' : 'Reinforcement-schedule machines (+insight)'}</button>` : ''}
      ${region.sensitive ? `<div class="ma-support">${esc(region.support)}</div>` : ''}
      <div class="ma-fb" id="ma-fb">${r.restored ? 'This region of the mind is whole. Its ability is yours.' : 'Solve the concept, then dispel its Misconception Wraith to restore the region.'}</div>`;
    const pb = card.querySelector('#hub-puzzle');
    if (pb && !pb.disabled) pb.addEventListener('click', () => { UI.pop(); startPuzzle(region); });
    const wb = card.querySelector('#hub-wraith');
    if (wb && !wb.disabled) wb.addEventListener('click', () => { UI.pop(); startWraith(region); });
    const rb = card.querySelector('#hub-reinf');
    if (rb && !rb.disabled) rb.addEventListener('click', () => {
      UI.pop();
      currentPuzzle = openReinforcement(g, () => { rec(region.id).reinforcement = true; g.insight(30, 'reinforcement schedules'); g.xp(20); save(); });
    });
  }

  // ---------- puzzle / wraith / restore flow ----------
  let currentPuzzle = null;
  function startPuzzle(region) {
    const open = PUZZLES[region.puzzle];
    if (!open) return;
    currentPuzzle = open(g, () => {
      rec(region.id).puzzle = true; save();
      g.xp(40, region.name + ' concept'); g.insight(25, region.name);
      checkRestore(region);
    });
  }
  function startWraith(region) {
    currentPuzzle = openWraith(region.id, g, () => {
      rec(region.id).wraith = true; save();
      g.xp(40, 'wraith dispelled');
      checkRestore(region);
    });
  }
  function checkRestore(region) {
    const r = rec(region.id);
    if (r.restored) return;
    if (r.puzzle && r.wraith) {
      r.restored = true;
      // grant ability — Atlas gets a piece of itself back, which opens the next
      S.abilities[region.grants] = true;
      if (story.chapter < 1) story.chapter = 1;
      story.advance(); // a chapter per region restored
      story.flag('fog_cleared_' + region.id);
      save();
      applyAbilities();
      const ab = ABILITIES[region.grants];
      Sfx.eraUnlock();
      UI.banner(`${region.name} restored — the Fog recedes`, `Atlas returns ${ab.name} to you: ${ab.desc}`, 4400);
      particles.burst('confetti', player.pos.x, player.pos.y + 2, player.pos.z, 40);
      g.insight(50, region.name + ' restored');
      raiseClarity(0, null, null); // refresh the Clarity meter (regions drive it)
      refreshHud();
      updateBeacon();
      // Atlas reacts to the restored region (the recurring mentor beat)
      setTimeout(() => { if (!UI.isOpen() && !S.flags.won) speakWithAtlas(); }, 1200);
      checkWin();
    } else {
      // re-open hub so the next step is obvious
      openRegionHub(region);
    }
  }
  function applyAbilities() {
    player.speedMul = 1 + (g.hasAbility('saltatory') ? 0.18 : 0);
  }
  applyAbilities();

  function checkWin() {
    if (S.flags.won) return;
    if (regionsRestored() >= 5) {
      S.flags.won = true;
      story.flag('atlas_whole');
      save();
      Sfx.examPass();
      UI.banner('THE MIND ATLAS IS WHOLE', `All five regions restored before ${EXAM.long}. The Fog has fled to its core — the Examination Gate now opens to face it.`, 6000);
      particles.burst('confetti', player.pos.x, player.pos.y + 2, player.pos.z, 50);
    }
  }

  // THE FOG'S FINAL CONFRONTATION — played as a cutscene at the Examination
  // Gate the first time it is approached with all five regions restored.
  function fogFinale(then) {
    if (S.flags.fogFinale) { then && then(); return; }
    S.flags.fogFinale = true; save();
    playCutscene(FOG.finale).then(() => {
      raiseClarity(100, 'The Fog is gone', 'The mind knows itself, end to end. Clarity is total.');
      then && then();
    });
  }

  // ---------- case files ----------
  function openCaseMenu() {
    if (S.scrolls < 3) {
      Sfx.denied();
      Panels.toast(`Gather the 3 evidence scrolls scattered near the Observatory first (${S.scrolls}/3).`);
      return;
    }
    UI.push({
      className: 'gui-ma ma-hub',
      html: '<div class="ma-card"></div>',
      onMount(el) { renderCaseMenu(el.querySelector('.ma-card')); },
    });
  }
  function renderCaseMenu(card) {
    card.innerHTML = `
      <div class="ma-head"><div><div class="ma-kicker">THE OBSERVATORY</div>
        <div class="ma-title">Case Files</div></div>
        <button class="dlg-x" data-gui-close>LEAVE</button></div>
      <p class="ma-clue">Two open investigations. Reconstruct each from the evidence — the same skill the AAQ and EBQ test on the exam.</p>
      <div class="ma-caselist">${CASE_FILES.map(c =>
        `<button class="ma-go ${S.cases[c.id] ? 'done' : 'prim'}" data-case="${c.id}">${esc(c.name)} <small>(${esc(c.type)})${S.cases[c.id] ? ' ✓' : ''}</small></button>`).join('')}</div>`;
    card.querySelectorAll('[data-case]').forEach(b => b.addEventListener('click', () => {
      const cdef = CASE_FILES.find(c => c.id === b.dataset.case);
      const frqItem = (api.content[def.key].frq.items || [])[cdef.frqIndex];
      UI.pop();
      currentPuzzle = openCase(cdef, frqItem, g, (passed, score, total) => {
        if (passed && !S.cases[cdef.id]) { S.cases[cdef.id] = true; g.xp(45, cdef.type); g.insight(40, cdef.name); save(); }
      });
    }));
  }

  // ---------- Atlas panel (regions / abilities / cases) ----------
  function openAtlas() {
    UI.push({
      className: 'gui-ma ma-atlas',
      html: '<div class="ma-card"></div>',
      onMount(el) { renderAtlas(el.querySelector('.ma-card')); },
    });
  }
  function renderAtlas(card) {
    const regs = REGIONS.map(r => {
      const rc = rec(r.id);
      const status = rc.restored ? 'restored' : rc.puzzle ? 'wraith next' : 'unsolved';
      return `<div class="ma-arow ${rc.restored ? 'on' : ''}">
        <span class="ma-adot" style="background:#${r.color.toString(16).padStart(6, '0')}"></span>
        <b>${esc(r.name)}</b><span class="ma-aunit">${esc(r.unit)}</span>
        <i>${status}${r.gateReq && !S.gates[r.id] ? ' · gate sealed' : ''}</i>
        <button class="ma-abeacon" data-go="${r.id}">guide</button></div>`;
    }).join('');
    const ab = ORDER.map(id => REGION_BY[id]).filter(r => S.abilities[r.grants]).map(r => ABILITIES[r.grants]);
    card.innerHTML = `
      <div class="ma-head"><div><div class="ma-kicker">ATLAS OF THE MIND</div>
        <div class="ma-title">${regionsRestored()}/5 regions restored · Exam ${esc(EXAM.label)}</div></div>
        <button class="dlg-x" data-gui-close>CLOSE</button></div>
      <div class="ma-arows">${regs}</div>
      <h4 class="ma-h4">Abilities</h4>
      <div class="ma-ablist">${ab.length ? ab.map(a => `<div class="ma-ab2"><b>${esc(a.icon)} ${esc(a.name)}</b><span>${esc(a.desc)}</span></div>`).join('') : '<p class="ma-fb">None yet — restore a region to earn your first ability.</p>'}</div>
      <h4 class="ma-h4">Case Files</h4>
      <div class="ma-ablist">${CASE_FILES.map(c => `<div class="ma-ab2"><b>${esc(c.name)}</b><span>${S.cases[c.id] ? 'solved' : (S.scrolls >= 3 ? 'ready at the Observatory' : 'gather evidence (' + S.scrolls + '/3)')}</span></div>`).join('')}</div>
      <h4 class="ma-h4">Standards Coverage</h4>
      <p class="ma-fb">See what you understand mapped to the AP Psychology exam — and PRINT a study sheet or SHARE a no-name progress code.</p>
      <div class="ma-actions"><button class="ma-go prim" id="ma-open-coverage">Open Standards Coverage</button></div>`;
    card.querySelectorAll('[data-go]').forEach(b => b.addEventListener('click', () => {
      const st = stations.list.find(s => s.id === b.dataset.go);
      if (st) { stations.setBeacon(st); UI.closeAll(); Panels.toast('A beacon marks the way.'); }
    }));
    const covBtn = card.querySelector('#ma-open-coverage');
    if (covBtn) covBtn.addEventListener('click', () => { Sfx.click(); openCoverage(); });
  }

  // ---------- PROOF-OF-LEARNING: coverage panel + retrieval beat + capstone ----
  // The COVERAGE matrix: what the player understands mapped to the AP Psychology
  // CED, with PRINT (the codex-derived study sheet) and SHARE (the PII-free PoL
  // export code). All three read the live Codex; nothing here records or quizzes.
  function openCoverage() {
    openCoveragePanel({
      codex, standards: STANDARDS, mastery,
      onPrint() {
        try { openStudySheet({ codex, standards: STANDARDS }); }
        catch (e) { try { Panels.toast('The study sheet could not open here.'); } catch (x) {} }
      },
      onShare() { openShareCode(); },
    });
  }

  // SHARE MY PROGRESS (NO NAME): mint the PoL export code (bits only, no name /
  // free text / device id) and show it with a copy button. PII-free by
  // construction (the encoder draws only from [A-Za-z0-9._-]).
  function openShareCode() {
    let code = '';
    try {
      code = encodePoL({
        worldKey: 'mind-atlas',
        standardsMap: STANDARDS.STANDARDS_MAP,
        codex,
        retrieval: (S && S.retrieval) ? S.retrieval : null,
      }) || '';
    } catch (e) { code = ''; }

    if (!document.getElementById('ma-share-style')) {
      const ss = document.createElement('style');
      ss.id = 'ma-share-style';
      ss.textContent = `
        .gui-ma.ma-share .ma-card{max-width:560px;}
        .ma-share .ma-sharelead{font:500 13.5px/1.6 Georgia,serif;color:#cde8ff;margin:6px 0 10px;}
        .ma-share .ma-codebox{font:700 13px/1.5 ui-monospace,Menlo,Consolas,monospace;color:#ffe9c0;
          background:rgba(120,80,180,.16);border:1px solid rgba(176,124,255,.4);border-radius:8px;
          padding:11px 13px;word-break:break-all;user-select:all;}
        .ma-share .ma-sharenote{font:500 11.5px/1.5 system-ui,sans-serif;color:#a9b8ff;margin:10px 0 0;}
        .ma-share .ma-shareacts{display:flex;gap:9px;margin-top:14px;flex-wrap:wrap;}`;
      document.head.appendChild(ss);
    }

    UI.push({
      className: 'gui-ma ma-share',
      html: '<div class="ma-card"></div>',
      onMount(el, ctx) {
        const card = el.querySelector('.ma-card');
        const body = code
          ? `<p class="ma-sharelead">Hand this code to your teacher to share what you understand — no name, no message, nothing personal. It carries only which turning points you have lit on the AP Psychology map.</p>
             <div class="ma-codebox" id="ma-pol-code">${esc(code)}</div>
             <p class="ma-sharenote">Privacy-safe by design: this code is only letters, numbers, and dots — never your name, your words, or your device.</p>
             <div class="ma-shareacts">
               <button class="ma-go prim" id="ma-pol-copy">COPY CODE</button>
               <button class="ma-go" data-gui-close>DONE</button>
             </div>`
          : `<p class="ma-sharelead">Light a turning point on the road first — once the Codex holds something, a no-name progress code will appear here to share.</p>
             <div class="ma-shareacts"><button class="ma-go" data-gui-close>CLOSE</button></div>`;
        card.innerHTML = `
          <div class="ma-head"><div><div class="ma-kicker">SHARE MY PROGRESS</div>
            <div class="ma-title">No-name proof code</div></div>
            <button class="dlg-x" data-gui-close>CLOSE</button></div>
          ${body}`;
        const copyBtn = card.querySelector('#ma-pol-copy');
        if (copyBtn) copyBtn.addEventListener('click', () => {
          try {
            if (navigator.clipboard && navigator.clipboard.writeText) {
              navigator.clipboard.writeText(code).then(() => UI.floatText('Code copied', 'xp')).catch(() => selectCode(card));
            } else { selectCode(card); }
          } catch (e) { selectCode(card); }
        });
      },
    });
  }
  function selectCode(card) {
    try {
      const box = card.querySelector('#ma-pol-code');
      if (box && window.getSelection && document.createRange) {
        const r = document.createRange(); r.selectNodeContents(box);
        const sel = window.getSelection(); sel.removeAllRanges(); sel.addRange(r);
        UI.floatText('Selected — press Cmd/Ctrl+C', 'gain');
      }
    } catch (e) { /* selection unavailable */ }
  }

  // GENTLE RETRIEVAL BEAT: at the world's natural visit moment, surface ONE due
  // Codex card as an in-character "remember when…" from Atlas — never a quiz.
  // Rate-limited to ~1 per session, only fires when nothing else is open and a
  // due card with an idea to re-pose actually exists. ensureCards() first so a
  // just-recorded keystone has a schedule. Affirm = grade true; "remind me" =
  // grade false + re-teach the keystone's OWN idea (handled by retrieval-beat).
  function maybeRetrievalBeat() {
    if (retrievalBeatShown) return;
    if (UI.isOpen()) return;
    let card = null;
    try { retrieval.ensureCards(); card = retrieval.pickOne(); }
    catch (e) { card = null; }
    if (!card || !card.entry || !card.entry.idea) return;
    retrievalBeatShown = true;
    const bound = { ...card, grade(ok) { return retrieval.grade(card.id, ok); } };
    try {
      openRetrievalBeat(bound, {
        mentorName: ATLAS_VOICE.name || 'Atlas',
        mentorTitle: ATLAS_VOICE.title || 'the mind\'s guide',
        intro: 'Atlas\'s light turns toward you, unhurried, the way the mind drifts back to something it already knows. A memory surfaces.',
        palette: (ATLAS_VOICE.palette) || { robe: 0x163a4a, trim: 0xffd27f, skin: 0xbfe8ff, hat: 0x0e2733 },
        affirmFx() { try { particles.burst('sparkle', player.pos.x, player.pos.y + 1.4, player.pos.z, 14); } catch (e) {} try { Sfx.good(); } catch (e) {} },
        missFx() { try { Sfx.click(); } catch (e) {} },
      });
    } catch (e) {
      // a beat must never break the world — undo the rate-limit so it can retry.
      retrievalBeatShown = false;
    }
  }

  // EXAM BRIDGE: when the capstone (the Exam of the Self) is passed, the loader
  // sets story flag 'exam_self_cleared' and records cx_exam_self. We observe that
  // transition (without touching the loader/pack) and build + open the standards-
  // stamped AAQ/EBQ artifact so the student leaves with a claim + cited evidence
  // + a rubric self-check drawn ONLY from what they actually earned.
  function maybeCapstoneArtifact() {
    if (capstoneArtifactShown) return;
    let cleared = false;
    try { cleared = !!(story && story.is && story.is('exam_self_cleared')); } catch (e) { cleared = false; }
    if (!cleared) return;
    capstoneArtifactShown = true;
    try {
      const artifact = buildArtifact({ codex, standards: STANDARDS, kind: 'aaq_ebq' });
      // open the panel; if the loader's win overlay / cutscene is still up, wait
      // for the stage to clear (poll up to ~12s) so the artifact lands cleanly on
      // top of a quiet screen rather than stacking under the win card.
      const open = () => {
        try {
          openArtifactPanel(artifact, {
            onPrint() { try { openStudySheet({ codex, standards: STANDARDS }); } catch (e) {} },
          });
        } catch (e) { /* artifact panel must never break the win */ }
      };
      if (!UI.isOpen()) { open(); return; }
      let tries = 0;
      const waitIdle = () => {
        try {
          if (!UI.isOpen()) { open(); return; }
        } catch (e) { open(); return; }
        if (++tries > 60) { open(); return; } // ~12s safety: open regardless
        setTimeout(waitIdle, 200);
      };
      setTimeout(waitIdle, 200);
    } catch (e) { /* never block the capstone win over the bridge */ }
  }

  // ---------- beacon ----------
  function updateBeacon() {
    const next = ORDER.map(id => ({ id, st: stations.list.find(s => s.id === id) })).find(o => o.st && !rec(o.id).restored);
    stations.setBeacon(next ? next.st : (stations.list.find(s => s.id === 'mcq') || null));
  }

  // ---------- panels coexistence ----------
  Panels.setHandlers({
    onOpen() { api.setPaused(true); },
    onClose() { if (!UI.isOpen()) api.setPaused(false); stations.refreshVisuals(); updateBeacon(); },
    onStationCleared() { stations.refreshVisuals(); updateBeacon(); },
    chime: Audio.chime,
  });

  // ---------- region ambience ----------
  // Standing inside a region tints the hemisphere light toward its palette
  // (a cheap whole-scene filter) and keys the particle bursts to the same
  // hue — Neural Caverns sparkle cyan, Social Plaza crimson, and so on.
  let hemiLight = null;
  scene.traverse(o => { if (o.isHemisphereLight) hemiLight = o; });
  const hemiBase = hemiLight ? hemiLight.color.clone() : null;
  const hemiGoal = new THREE.Color();
  const regionTint = new THREE.Color();
  let ambRegion = null;

  function updateAmbience(dt, frame) {
    if (frame % 12 === 0) {
      let found = null;
      for (const r of def.regions) {
        const dx = player.pos.x - r.center[0], dz = player.pos.z - r.center[1];
        if (dx * dx + dz * dz < (r.r * 1.15) * (r.r * 1.15)) { found = r; break; }
      }
      if (found !== ambRegion) {
        ambRegion = found;
        particles.setPalette(found ? found.color : null);
      }
    }
    if (!hemiLight) return;
    if (ambRegion) {
      regionTint.set(ambRegion.color);
      hemiGoal.copy(hemiBase).lerp(regionTint, 0.3);
    } else {
      hemiGoal.copy(hemiBase);
    }
    hemiLight.color.lerp(hemiGoal, Math.min(1, dt * 1.6));
  }

  // ---------- frame loop ----------
  let stepT = 0, saveT = 0;
  api.onFrame((dt, t, frame) => {
    npcSys.update(dt, t, player.pos);
    particles.update(dt);
    updateAmbience(dt, frame);
    // story-pack triggers: poll region-visit + flag watchers (cheap, throttled)
    if (frame % 10 === 0 && !api.isPaused()) {
      pumpPackVisit(); pumpPackFlags();
      // PROOF-OF-LEARNING: at the same natural visit moment, watch for the
      // capstone win (open the exam-bridge artifact once) and offer the gentle
      // retrieval beat (Atlas re-poses a due idea, ~1/session, only when idle).
      maybeCapstoneArtifact();
      maybeRetrievalBeat();
    }

    // confidence slowly recovers as you walk the mind
    if (!api.isPaused() && S.confidence < MAXCONF) {
      const move = player.speedNow > 1.2 ? 5 : 2;
      S.confidence = Math.min(MAXCONF, S.confidence + dt * move);
      if (Math.random() < 0.02) refreshHud();
    }

    // gate shimmer
    for (const id in gateMeshes) {
      const gm = gateMeshes[id];
      if (gm.grp.visible) { gm.ring.rotation.z = t * 0.6; gm.wall.material.opacity = 0.2 + Math.sin(t * 2) * 0.08; }
    }

    if (!api.isPaused() && player.grounded && player.speedNow > 1.2) {
      stepT -= dt * player.speedNow;
      if (stepT <= 0) { stepT = 3.4; Sfx.footstep(player.speedNow > 9); }
    }

    saveT -= dt;
    if (saveT <= 0) { saveT = 5; S.pos = [Math.round(player.pos.x * 10) / 10, Math.round(player.pos.z * 10) / 10]; save(); }
  });

  // ---------- boot ----------
  refreshHud();
  updateBeacon();
  if (S.pos) player.teleport(S.pos[0], S.pos[1]);
  Sfx.startAmbient();

  // ---------- cold open ----------
  // New Game opens on the inciting incident, not a menu: the mind gone dark,
  // Atlas's fading light, the Fog that scattered the regions, the Exam that
  // looms. The story begins (chapter 1). Replaces the old text intro card.
  if (!S.flags.intro) {
    S.flags.intro = true;
    if (story.chapter < 1) story.chapter = 1;
    save();
    refreshHud();
    const controlsBeat = {
      tint: 'dusk', kicker: 'The inner world',
      text: (isMobile
        ? 'Left stick to move, drag the right side to look. TAP a glowing prompt to act. M — the atlas; ATLAS SPEAKS — your guide. Begin at the Neural Caverns, where the mind is wired.'
        : 'WASD to move, mouse to look, SHIFT to run, E to interact. M — the atlas; the ATLAS SPEAKS button summons your guide. Begin at the Neural Caverns, where the mind is wired.'),
      cta: 'Enter the mind',
    };
    // AWE: a low skim across the mind-sea toward the retrieval lighthouse, the fog
    // parting, the cinePad swelling to a cineHit as the light pulses — then the
    // cold open (one pad spans both), then Atlas frames the first move.
    (async () => {
      let cine = null;
      try { cine = await playOpeningShot(api, OPENING_SHOTS['mind-atlas']); } catch (e) {}
      try { await playCutscene([...COLD_OPEN, controlsBeat], { pad: false }); }
      finally {
        try { cine && cine.stopPad && cine.stopPad(); } catch (e) {}
        try { api.setPaused(false); } catch (e) {}
      }
      // hand off to the mentor: Atlas frames the first move.
      if (!UI.isOpen()) speakWithAtlas();
    })();
  } else {
    // Returning delver: a short golden-hour establishing shot of the mind-sea.
    (async () => {
      let cine = null;
      try { cine = await playOpeningShot(api, OPENING_SHOTS['mind-atlas'], { returning: true }); } catch (e) {}
      try { cine && cine.stopPad && cine.stopPad(); } catch (e) {}
      try { api.setPaused(false); } catch (e) {}
    })();
  }

  // ---------- debug / verification hook ----------
  const game = {
    S, xp, story, save: () => save(),
    regionsRestored, rec, codex, ach, packs,
    // Proof-of-Learning spine (additive) exposed for wiring/composition.
    mastery, retrieval, standards: STANDARDS,
    openCoverage, openShareCode, maybeRetrievalBeat, maybeCapstoneArtifact,
    openRegionHub, openCaseMenu, openAtlas, speakWithAtlas, raiseClarity,
    debug: {
      goto(id) { const st = stations.list.find(s => s.id === id); if (st) player.teleport(st.pos.x, st.pos.z - 6); },
      coldOpen() { return Array.isArray(COLD_OPEN) && COLD_OPEN.length > 0; },
      atlasSpeaks() { speakWithAtlas(); return true; },
      fogFinale() { fogFinale(() => {}); return true; },
      // ----- STORY-PACK debug surface (verification) -----
      packs() { return packs.list(); },                 // [{id,unit,title,keystones[]}]
      packCount() { return packs.count(); },
      keystones() { return packs.keystoneIds(); },        // all loaded keystone ids
      keystoneInfo(id) { return packs.keystoneInfo(id); },
      // jump straight into a pack keystone's encounter (opens the overlay)
      runKeystone(id) { return packs.runKeystone(id); },
      // open the shared Field Journal / Achievements panels
      openCodex() { codex.open(); return true; },
      openAchievements() { ach.open(); return true; },
      codexCount() { return codex.count(); },
      codexEntries() { return codex.entries(); },
      hasCodex(id) { return codex.has(id); },
      achList() { return ach.list(); },
      // ----- PROOF-OF-LEARNING spine debug surface (verification) -----
      openCoverage() { openCoverage(); return true; },
      masterySummary() { try { return mastery.summary(); } catch (e) { return null; } },
      retrievalCards() { try { return retrieval.cardsFor(); } catch (e) { return null; } },
      ensureRetrievalCards() { try { return Object.keys(retrieval.ensureCards() || {}).length; } catch (e) { return 0; } },
      // mint the PII-free export code (string only — no panel) for a grep test.
      exportCode() {
        try {
          return encodePoL({ worldKey: 'mind-atlas', standardsMap: STANDARDS.STANDARDS_MAP, codex, retrieval: (S && S.retrieval) ? S.retrieval : null }) || '';
        } catch (e) { return ''; }
      },
      // build the capstone artifact data (no UI) so a test can inspect it.
      capstoneArtifact() { try { return buildArtifact({ codex, standards: STANDARDS, kind: 'aaq_ebq' }); } catch (e) { return null; } },
      // drive a region's concept puzzle to completion through the real logic
      solvePuzzle(regionId) {
        const region = REGION_BY[regionId];
        if (!region) return false;
        startPuzzle(region);
        if (currentPuzzle && currentPuzzle.auto) currentPuzzle.auto();
        UI.closeAll();
        return rec(regionId).puzzle;
      },
      solveWraith(regionId) {
        startWraith(REGION_BY[regionId]);
        if (currentPuzzle && currentPuzzle.auto) currentPuzzle.auto();
        UI.closeAll();
        return rec(regionId).wraith;
      },
      // face the Fog and answer WRONG once: proves the Fog THICKENS + Atlas
      // coaches you back to the truth (a consequence + re-teach, NOT a red X).
      wraithWrong(regionId) {
        const before = S.confidence;
        startWraith(REGION_BY[regionId]);
        // step past the Fog's taunt into the fight
        const faceIt = document.querySelector('.ma-wraith #ma-faceit');
        if (faceIt) faceIt.click();
        // click a wrong in-character answer
        const btns = document.querySelectorAll('.ma-wraith .ma-reframe');
        const wrong = Array.from(btns).find(b => b.dataset.ok === '0');
        if (wrong) wrong.click();
        // the Atlas coaching beat (mentor consequence) should now be showing
        const coached = !!document.querySelector('.ma-wraith #ma-retry');
        return { before, after: S.confidence, coached };
      },
      restore(regionId) { this.solvePuzzle(regionId); this.solveWraith(regionId); return rec(regionId).restored; },
      passGate(regionId) { tryGate(REGION_BY[regionId]); return !!S.gates[regionId]; },
      gatherScrolls() { S.scrolls = 3; save(); return S.scrolls; },
      caseFile(caseId) {
        const cdef = CASE_FILES.find(c => c.id === caseId);
        const frqItem = (api.content[def.key].frq.items || [])[cdef.frqIndex];
        const c = openCase(cdef, frqItem, g, (passed) => { if (passed) { S.cases[cdef.id] = true; save(); } });
        if (c.auto) c.auto();
        UI.closeAll();
        return !!S.cases[caseId];
      },
      // open a memory puzzle and load past capacity to prove the 7±2 limit bites
      memLimit() {
        const c = PUZZLES.memory(g, () => {});
        const cap = c.info().cap;
        for (let k = 0; k <= cap; k++) c.load();  // cap+1 loads → one overflow
        const info = c.info();
        UI.closeAll();
        return info;  // { cap, tray, vault, overflowed, done }
      },
      reset() { store.reset(); location.reload(); },
      state: () => JSON.parse(JSON.stringify(S)),
    },
  };
  window.MA = game;
  return game;
}
