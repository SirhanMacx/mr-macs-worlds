// game.js — TRADE WINDS controller: turns the Global 9 walking world into a
// trading-empire game. Cities with live markets, real-figure NPCs with quest
// chains, travel events on the routes, guild exams off the real bank, era
// progression with map fog, a pack animal at your heels and juice on every
// transaction. Saves on every action.
import * as THREE from 'three';
import * as Panels from '../../../learn/panels.js';
import * as Audio from '../../../engine/audio.js';
import { buildStationMeshes } from '../../../engine/structures.js';
import { makeLabel } from '../../../engine/geo-kit.js';

import { createSave } from '../../save.js';
import { createStory } from '../../story.js';
import { playCutscene } from '../../cutscene.js';
import { createEconomy, priceAt } from '../../econ.js';
import { createXP } from '../../xp.js';
import { createQuests } from '../../quests.js';
import { createNPCSystem, createPackAnimal } from '../../npc.js';
import { createParticles } from '../../particles.js';
import { createTravelEvents } from '../../events.js';
import { createGameMap } from '../../gmap.js';
import { createGameHUD } from '../../gamehud.js';
import { openDialogue } from '../../dialogue.js';
import { openMarket } from '../../vendor.js';
import { openGuild, RANKS } from '../../guild.js';
import * as UI from '../../ui.js';
import * as Sfx from '../../sfx.js';

import {
  ERAS, ERA_GATES, GOODS, CITIES, TRANSPORTS, PERKS, QUESTS, NPCS,
  ZONES, EVENTS, AMBIENT_PER_CITY, topicsForEra, COLD_OPEN,
  ERA2_OPEN, ERA3_OPEN, ERA4_OPEN, CHANGAN_MOTHER, CALICUT_MOTHER, VELL_RESOLVE,
} from './content.js';

// Story-beat cutscene registry — each plays once, gated by a story flag. The
// whole game's narrative spine (era legs of the mother's road, the mother
// mystery, the Vell resolution) is driven through this one table so beats can
// fire from the era gate, from city arrival, or from dialogue uniformly.
const STORY_BEATS = {
  ERA2_OPEN, ERA3_OPEN, ERA4_OPEN, CHANGAN_MOTHER, CALICUT_MOTHER, VELL_RESOLVE,
};
const HOUSE_MAX = 28; // arc-wide cap so the meter climbs tastefully over 4 eras

const DEFAULTS = {
  v: 2, // bumped for the story rebuild — old pre-story saves reset so the cold open plays
  coins: 30, cargo: {}, capacity: 6, transport: 'donkey',
  xp: 0, level: 1, perkPts: 0, perks: {},
  era: 1, rank: 0,
  quests: {}, flags: {}, visited: ['byblos'],
  // narrative spine — chapter/beat/flags migrate cleanly onto old saves;
  // House Standing is the family's name rising in the markets of the world.
  story: { chapter: 0, beat: 'coldopen', flags: {} },
  house: { standing: 0 },
  pos: null,
};

export async function initGame(api) {
  const { scene, field, player, stations, camera, def, isMobile } = api;

  // ---------- state ----------
  const store = createSave('trade-winds', DEFAULTS);
  const S = store.state;
  const save = () => store.save();
  if (!S.house) S.house = { standing: 0 }; // defensive for pre-story saves
  const story = createStory({ state: S, save });

  // ---------- systems ----------
  UI.init(api);
  const particles = createParticles(scene);
  const npcSys = createNPCSystem(scene, field, camera);
  const pack = createPackAnimal(scene, field);
  const econ = createEconomy({ state: S, goods: GOODS, save });

  const xp = createXP({
    state: S, save,
    onLevelUp(level) {
      Sfx.levelUp();
      UI.banner(`Level ${level}`, 'A perk point waits in your JOURNAL');
      particles.burst('confetti', player.pos.x, player.pos.y, player.pos.z, 22);
      refreshHud();
    },
  });

  function gainXP(n, label) {
    if (label) UI.floatText(`+${n} XP ${label}`, 'xp');
    xp.add(n);
    refreshHud();
  }
  function gainCoins(n, label) {
    econ.addCoins(n);
    if (n > 0) {
      Sfx.coin();
      particles.burst('coin', player.pos.x, player.pos.y, player.pos.z, Math.min(20, 6 + Math.round(n / 8)));
      UI.floatText(`+${n} shekels${label ? ' — ' + label : ''}`, 'gain');
    } else if (n < 0) {
      UI.floatText(`${n} shekels${label ? ' — ' + label : ''}`, 'loss');
    }
    refreshHud();
  }

  const quests = createQuests({
    state: S, save, defs: QUESTS,
    hooks: {
      onAccept(q) {
        Sfx.questAccept();
        UI.banner('Quest accepted', q.name);
        updateTracker();
      },
      onStage(q, st) {
        Sfx.good();
        UI.floatText(`${q.name}: ${st.objective}`, 'xp');
        updateTracker();
      },
      onProgress(q) { Sfx.good(); updateTracker(); },
      onDone(q) {
        Sfx.questDone();
        particles.burst('confetti', player.pos.x, player.pos.y, player.pos.z, 26);
        UI.banner('Quest complete — ' + q.name, `+${q.rewards.coins} shekels, +${q.rewards.xp} XP`);
        econ.addCoins(q.rewards.coins);
        xp.add(q.rewards.xp);
        updateTracker();
        checkEra();
        checkWin();
        refreshHud();
      },
    },
  });

  // ---------- perks / derived stats ----------
  function capacityNow() {
    const t = TRANSPORTS.find(t => t.id === S.transport) || TRANSPORTS[0];
    return t.cap + xp.perkRank('packmule') * 3;
  }
  function discountNow() {
    return (RANKS[S.rank || 0].discount || 0) + xp.perkRank('haggler') * 0.03;
  }
  function applySpeed() {
    const t = TRANSPORTS.find(t => t.id === S.transport) || TRANSPORTS[0];
    player.speedMul = t.speed * (1 + xp.perkRank('swift') * 0.07);
  }
  function syncDerived() {
    S.capacity = capacityNow();
    pack.setKind(S.transport === 'donkey' ? 'donkey' : S.transport === 'camel' ? 'camel' : 'cart');
    applySpeed();
  }
  syncDerived();

  // ---------- HUD ----------
  const hud = createGameHUD({ isMobile, onJournal: openJournal, onMap: () => gmap.open() });
  function refreshHud() {
    const pr = xp.progress();
    hud.set({
      coins: S.coins, cargo: econ.cargoCount(), cap: S.capacity,
      rank: RANKS[S.rank || 0].name,
      era: S.era, eraName: ERAS[S.era].name,
      level: pr.level, xpFrac: pr.frac, perkPts: S.perkPts,
    });
    // House Standing appears once the story has begun, at near-zero, climbing
    // toward the arc-wide cap over the whole game.
    hud.setHouse(story.chapter >= 1 ? (S.house.standing || 0) : null, HOUSE_MAX);
  }

  // raise the family's name — the emotional payoff of a story win. A satisfying
  // sting + a coin/sparkle burst + a banner, so the player FEELS they did
  // something in the story (not "got a point").
  function raiseHouse(n, title, sub) {
    S.house.standing = (S.house.standing || 0) + n;
    save();
    Sfx.houseRise();
    particles.burst('confetti', player.pos.x, player.pos.y + 1.5, player.pos.z, 28);
    particles.burst('coin', player.pos.x, player.pos.y, player.pos.z, 12);
    if (title) UI.banner(title, sub || '', 3400);
    refreshHud();
  }

  // Play a one-time story cutscene, gated by a story flag, then optionally lift
  // House Standing on the emotional beat. The whole narrative spine (era legs,
  // the mother mystery, the Vell resolution) flows through this single helper so
  // beats fire identically from the era gate, from a city arrival, or from
  // dialogue. Returns true if it played, false if the flag was already set.
  function playStoryBeat(flagKey, beatsName, houseRaise = 0, houseTitle = '', houseSub = '') {
    if (!beatsName) return false;
    if (story.is(flagKey)) return false;
    const beats = STORY_BEATS[beatsName];
    if (!beats) return false;
    story.flag(flagKey);
    // playCutscene pushes a UI overlay; the engine pauses under it via the
    // Panels handler wiring and resumes on close. The House lift lands AFTER the
    // beats so the meter pulse is the last thing the player sees.
    playCutscene(beats).then(() => {
      if (houseRaise > 0) raiseHouse(houseRaise, houseTitle, houseSub);
    });
    return true;
  }

  function currentQuestEntry() {
    const list = quests.activeList();
    return list.length ? list[0] : null;
  }
  function updateTracker() {
    const cur = currentQuestEntry();
    hud.setQuest(cur ? { name: cur.quest.name, objective: cur.stage.objective } : null);
    updateBeacon();
    refreshMarkers();
  }
  function updateBeacon() {
    const cur = currentQuestEntry();
    if (!cur) { stations.setBeacon(null); return; }
    const city = cityById[cur.stage.targetCity];
    if (!city) { stations.setBeacon(null); return; }
    const st = city.stationId && stations.list.find(s => s.id === city.stationId);
    stations.setBeacon(st || { pos: new THREE.Vector3(city.x, field.height(city.x, city.z), city.z) });
  }

  // ---------- map ----------
  const cityById = {};
  CITIES.forEach(c => { cityById[c.id] = c; });
  const gmap = createGameMap({
    def, field, cities: CITIES, paths: def.paths,
    getEra: () => S.era,
    getQuestTarget: () => { const c = currentQuestEntry(); return c ? c.stage.targetCity : null; },
    getPlayer: () => ({ x: player.pos.x, z: player.pos.z, yaw: player.camYaw }),
  });

  // ---------- cities: structures, station overrides, market ----------
  // Byblos is new — give it a home structure on the road south of spawn.
  {
    const c = cityById.byblos;
    const solid = new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.85, metalness: 0.04, flatShading: true });
    const { group } = buildStationMeshes('caravanserai', c.color, solid);
    const y = field.height(c.x, c.z);
    group.position.set(c.x, y, c.z);
    group.rotation.y = Math.PI;
    group.scale.setScalar(0.85);
    scene.add(group);
    const label = makeLabel('Byblos', 'Home harbor — your market', '#46d3e0');
    label.position.set(c.x, y + 9, c.z);
    scene.add(label);
  }

  function cityLocked(city) { return city.era > S.era; }

  function openCity(city) {
    if (cityLocked(city)) {
      Sfx.denied();
      Panels.toast(`${city.name} lies beyond your trade license — reach Era ${['I', 'II', 'III', 'IV'][city.era - 1]} to unlock these roads.`);
      return;
    }
    const idx = CITIES.indexOf(city);
    openMarket({
      city, econ,
      cargo: () => S.cargo,
      goodsHere() {
        const t = performance.now() / 1000;
        const rows = [];
        for (const gid in city.market) {
          const good = econ.goodById[gid];
          if (!good || good.era > S.era) continue;
          const mult = city.market[gid];
          rows.push({
            good,
            price: priceAt(good, mult, t, idx, discountNow()),
            spread: xp.perkRank('ledger') ? `fair world price ${good.base} — ${mult < 0.95 ? 'CHEAP here' : mult > 1.25 ? 'DEAR here' : 'fair here'}` : null,
          });
        }
        rows.sort((a, b) => a.price - b.price);
        return rows;
      },
      onBuy(good, price, n) {
        save();
        refreshHud();
      },
      onSell(good, price, n, total) {
        particles.burst('coin', player.pos.x, player.pos.y, player.pos.z, Math.min(18, 6 + n * 3));
        UI.floatText(`+${total} shekels`, 'gain');
        gainXP(Math.max(2, Math.round(total / 7)));
        save();
        checkEra();
        refreshHud();
      },
      footer: city.stationId
        ? `<button class="mkt-story">HEAR THE CITY'S STORY — study & practice</button>`
        : `<span class="mkt-home">${UI.esc(city.blurb)}</span>`,
      onRender(card) {
        const b = card.querySelector('.mkt-story');
        if (b) b.addEventListener('click', () => {
          Sfx.click();
          const node = (api.content[def.key].nodes || []).find(n => n.id === city.stationId);
          const region = def.regions.find(r => r.id === city.stationId);
          if (node && region) Panels.openUnitStation(def.key, region, node);
        });
      },
    });
  }

  // override the region stations into city markets
  for (const city of CITIES) {
    if (!city.stationId) continue;
    const st = stations.list.find(s => s.id === city.stationId);
    if (!st) continue;
    st.label = city.name;
    st.sub = city.tag;
    st.verb = 'Trade in';
    st.onInteract = () => openCity(city);
  }
  // Byblos interactable (no station entry)
  stations.addExtra({
    id: 'city-byblos', type: 'city', verb: 'Trade in', label: 'Byblos',
    pos: new THREE.Vector3(cityById.byblos.x, field.height(cityById.byblos.x, cityById.byblos.z), cityById.byblos.z),
    interactR: 9,
    onInteract: () => openCity(cityById.byblos),
  });

  // the Grand Stoa becomes the Merchants' Guild Hall
  {
    const st = stations.list.find(s => s.id === 'mcq');
    if (st) {
      st.label = "Merchants' Guild Hall";
      st.sub = 'Sit ranked exams — rank pays';
      st.verb = 'Enter';
      st.onInteract = () => openGuild({
        course: def.key, state: S, save, topicsForEra,
        getEra: () => S.era,
        onReward(rankDef) {
          gainCoins(rankDef.purse, 'guild purse');
          gainXP(50, 'guild rank');
          UI.banner('The guild names you ' + rankDef.name, `Purse of ${rankDef.purse} shekels — prices ${Math.round(rankDef.discount * 100)}% better everywhere`);
          refreshHud();
        },
      });
    }
  }

  // ---------- NPCs ----------
  const questGivers = {};
  QUESTS.forEach(q => { questGivers[q.giver] = q.id; });
  const markerGeo = new THREE.OctahedronGeometry(0.16);
  const markerMatNew = new THREE.MeshBasicMaterial({ color: 0xffd166 });
  const markerMatReady = new THREE.MeshBasicMaterial({ color: 0x7df29b });
  const npcRecs = [];

  for (const spec of NPCS) {
    const city = cityById[spec.city];
    const x = city.x + spec.offset[0];
    const z = city.z + spec.offset[1];
    const npc = npcSys.addNPC({
      ...spec, x, z,
      face: Math.atan2(city.x - x, city.z - z) + Math.PI,
      labelColor: '#ffd9a0',
    });
    const marker = new THREE.Mesh(markerGeo, markerMatNew);
    marker.position.y = 2.15;
    marker.visible = false;
    npc.group.add(marker);

    const ex = stations.addExtra({
      id: 'npc-' + spec.id, type: 'npc', verb: 'Talk to', label: spec.name,
      pos: npc.group.position, interactR: 5,
      onInteract() {
        openDialogue(npc, spec.dialogue, dialogueCtx(spec));
      },
    });
    npcRecs.push({ spec, npc, ex, marker });
  }

  // ambient villagers (procedural, wander, no dialogue)
  const ambients = [];
  for (const city of CITIES) {
    for (let i = 0; i < AMBIENT_PER_CITY; i++) {
      const a = Math.random() * Math.PI * 2;
      const hues = [0x7a6a4f, 0x5d6e8a, 0x8a5d5d, 0x5d8a6e, 0x8a7a3c, 0x6e5d8a];
      const n = npcSys.addNPC({
        id: `amb-${city.id}-${i}`,
        x: city.x + Math.cos(a) * 9, z: city.z + Math.sin(a) * 9,
        palette: { robe: hues[(i * 3 + CITIES.indexOf(city)) % hues.length], trim: 0x3c3428, skin: [0xd9a066, 0xb97f4e, 0x8a5a33, 0xd9b07c][i % 4] },
        hatKind: ['none', 'cap', 'turban', 'hood'][Math.floor(Math.random() * 4)],
        wander: 8,
      });
      ambients.push({ city, npc: n });
    }
  }

  function refreshNPCVisibility() {
    for (const { spec, npc, ex } of npcRecs) {
      const locked = cityById[spec.city].era > S.era || (spec.era > S.era);
      npc.hidden = locked;
      ex.hidden = locked;
    }
    for (const { city, npc } of ambients) npc.hidden = city.era > S.era;
  }

  function refreshMarkers() {
    for (const { spec, marker } of npcRecs) {
      const qid = questGivers[spec.id];
      let mode = null;
      // turn-in ready for ANY active quest pointing at this npc?
      for (const id in S.quests) {
        if (quests.turnInReady(id, spec.id, econ)) { mode = 'ready'; break; }
      }
      if (!mode && qid && quests.isAvailable(qid, S.era)) mode = 'new';
      marker.visible = !!mode;
      marker.material = mode === 'ready' ? markerMatReady : markerMatNew;
    }
  }

  function dialogueCtx(spec) {
    return {
      state: S, econ, quests, story,
      era: () => S.era,
      bonus(n, label) { gainCoins(n, label); gainXP(Math.round(n / 2)); },
      // story hooks the keystone beat uses: raise the house's name; the rest
      // (flags, is) are read straight off `story` in dialogue effects.
      raiseHouse(n, title, sub) { raiseHouse(n, title, sub); },
      // let a dialogue effect fire a story cutscene (e.g. the Vell resolution).
      // The dialogue overlay closes first, then the cutscene plays over the
      // paused world. flagKey gates it so it plays exactly once.
      playStory(flagKey, beatsName, houseRaise = 0, houseTitle = '', houseSub = '') {
        setTimeout(() => playStoryBeat(flagKey, beatsName, houseRaise, houseTitle, houseSub), 60);
      },
    };
  }

  // ---------- travel events ----------
  const travel = createTravelEvents({
    zones: ZONES, events: EVENTS, state: S, save,
    getEra: () => S.era,
    hasCargo: () => econ.cargoCount() > 0,
    onOutcome(ev, choice, out) {
      if (out.coins) gainCoins(out.coins);
      if (out.coinsPct) gainCoins(Math.round(S.coins * out.coinsPct));
      if (out.loseCargo) {
        const lost = econ.loseRandomCargo(out.loseCargo);
        const names = Object.keys(lost).map(k => `${lost[k]} ${econ.goodById[k].name}`).join(', ');
        if (names) UI.floatText('Lost: ' + names, 'loss');
      }
      if (out.gainGood) { econ.addGood(out.gainGood, 1); UI.floatText('+1 ' + econ.goodById[out.gainGood].name, 'gain'); }
      if (out.xp) gainXP(out.xp, out.good ? '(good judgment)' : '');
      save();
      refreshHud();
    },
  });

  // scout perk: annotate event hints
  const origEvents = EVENTS; // hints are shown only when the perk is owned
  for (const ev of origEvents) {
    for (const c of ev.choices) {
      if (c.hint) {
        const baseHint = c.hint;
        Object.defineProperty(c, 'hint', { get: () => (xp.perkRank('scout') ? 'Scout\'s tip: ' + baseHint : null) });
      }
    }
  }

  // ---------- journal (quests + perks + caravan) ----------
  function openJournal(tab = 'quests') {
    UI.push({
      className: 'gui-journal',
      html: '<div class="jrn-card"></div>',
      onMount(el) { renderJournal(el.querySelector('.jrn-card'), tab); },
    });
  }

  function renderJournal(card, tab) {
    const tabs = [['quests', 'QUESTS'], ['perks', `PERKS${S.perkPts ? ' (+' + S.perkPts + ')' : ''}`], ['caravan', 'CARAVAN']];
    let body = '';
    if (tab === 'quests') {
      const active = quests.activeList();
      const done = QUESTS.filter(q => quests.isDone(q.id));
      const avail = QUESTS.filter(q => quests.isAvailable(q.id, S.era));
      body = `
        ${active.length ? '<h3>In progress</h3>' + active.map(({ quest, stage, rec }) => `
          <div class="jrn-q active"><b>${UI.esc(quest.name)}</b>
            <span>${UI.esc(stage.objective)}${stage.type === 'visit' && (stage.cities || []).length > 1 ? ` (${rec.visited.length}/${stage.cities.length})` : ''}</span>
            <i>Head for ${UI.esc(cityById[stage.targetCity] ? cityById[stage.targetCity].name : '')}</i></div>`).join('') : ''}
        ${avail.length ? '<h3>Word on the road</h3>' + avail.map(q => `
          <div class="jrn-q avail"><b>${UI.esc(q.name)}</b><span>${UI.esc(q.summary)}</span>
          <i>Speak to ${UI.esc((NPCS.find(n => n.id === q.giver) || {}).name || '')} in ${UI.esc(cityById[(NPCS.find(n => n.id === q.giver) || {}).city].name)}</i></div>`).join('') : ''}
        ${done.length ? '<h3>Completed</h3>' + done.map(q => `<div class="jrn-q done"><b>${UI.esc(q.name)}</b></div>`).join('') : ''}
        ${!active.length && !avail.length && !done.length ? '<p class="jrn-empty">Talk to people in the cities — work finds a willing trader.</p>' : ''}`;
    } else if (tab === 'perks') {
      body = `<p class="jrn-tip">You hold <b>${S.perkPts}</b> perk point${S.perkPts === 1 ? '' : 's'}. Earn more by leveling up.</p>` +
        PERKS.map(p => {
          const r = xp.perkRank(p.id);
          return `<div class="jrn-perk ${r >= p.max ? 'maxed' : ''}">
            <div><b>${UI.esc(p.name)}</b> <span class="jrn-rank">${r}/${p.max}</span><span>${UI.esc(p.desc)}</span></div>
            <button data-perk="${p.id}" ${S.perkPts < 1 || r >= p.max ? 'disabled' : ''}>${r >= p.max ? 'MAX' : 'LEARN'}</button>
          </div>`;
        }).join('');
    } else {
      body = `<p class="jrn-tip">Your caravan sets how much you carry and how fast you move.</p>` +
        TRANSPORTS.map(t => {
          const owned = S.transport === t.id;
          const reachable = t.era <= S.era;
          return `<div class="jrn-perk ${owned ? 'maxed' : ''}">
            <div><b>${UI.esc(t.name)}</b> <span class="jrn-rank">${t.cap} packs · ${Math.round((t.speed - 1) * 100)}% faster</span><span>${UI.esc(t.note)}</span></div>
            <button data-tr="${t.id}" ${owned || !reachable || S.coins < t.cost ? 'disabled' : ''}>${owned ? 'YOURS' : !reachable ? 'ERA ' + ['I', 'II', 'III', 'IV'][t.era - 1] : t.cost + ' SHEKELS'}</button>
          </div>`;
        }).join('');
    }
    card.innerHTML = `
      <div class="jrn-head">
        <div class="jrn-tabs">${tabs.map(([id, lab]) => `<button class="jrn-tab ${id === tab ? 'on' : ''}" data-tab="${id}">${lab}</button>`).join('')}</div>
        <button class="dlg-x" data-gui-close>CLOSE</button>
      </div>
      <div class="jrn-body">${body}</div>`;
    card.querySelectorAll('.jrn-tab').forEach(b => b.addEventListener('click', () => { Sfx.click(); renderJournal(card, b.dataset.tab); }));
    card.querySelectorAll('[data-perk]').forEach(b => b.addEventListener('click', () => {
      const p = PERKS.find(p => p.id === b.dataset.perk);
      const r = xp.buyPerk(p);
      if (r.ok) {
        Sfx.questAccept();
        UI.floatText(`${p.name} — rank ${r.rank}`, 'xp');
        S.capacity = capacityNow();
        applySpeed();
        save();
        refreshHud();
      } else Sfx.denied();
      renderJournal(card, 'perks');
    }));
    card.querySelectorAll('[data-tr]').forEach(b => b.addEventListener('click', () => {
      const t = TRANSPORTS.find(t => t.id === b.dataset.tr);
      if (S.coins < t.cost) { Sfx.denied(); return; }
      econ.addCoins(-t.cost);
      S.transport = t.id;
      syncDerived();
      save();
      Sfx.sell();
      UI.banner('The caravan grows', `${t.name} — ${t.cap} packs, ${Math.round((t.speed - 1) * 100)}% faster`);
      particles.burst('confetti', player.pos.x, player.pos.y, player.pos.z, 18);
      refreshHud();
      renderJournal(card, 'caravan');
    }));
  }

  // ---------- era progression + win ----------
  function netWorth() {
    return econ.netWorth(gid => econ.goodById[gid].base);
  }
  function checkEra() {
    const gate = ERA_GATES[S.era + 1];
    if (!gate) return;
    if (quests.isDone(gate.quest) && netWorth() >= gate.worth) {
      S.era += 1;
      save();
      Sfx.eraUnlock();
      const era = ERAS[S.era];
      const newCities = CITIES.filter(c => c.era === S.era).map(c => c.name).join(' and ');
      UI.banner(`Era ${['I', 'II', 'III', 'IV'][S.era - 1]} — ${era.name}`, `Generations pass. The roads to ${newCities} open. (${era.span})`);
      particles.burst('confetti', player.pos.x, player.pos.y + 2, player.pos.z, 40);
      refreshNPCVisibility();
      refreshMarkers();
      refreshHud();
      // Each new era is the next leg of your mother's road east, and a Vell
      // escalation — a 2-beat story cutscene that plays once. +1 House for
      // committing the house to the longer road.
      const eraBeat = { 2: ['era2opened', 'ERA2_OPEN'], 3: ['era3opened', 'ERA3_OPEN'], 4: ['era4opened', 'ERA4_OPEN'] }[S.era];
      if (eraBeat) playStoryBeat(eraBeat[0], eraBeat[1], 1, 'The house commits to the road', 'You take up the next leg of your mother\'s line east.');
    }
  }
  function checkWin() {
    if (S.flags.won) return;
    if (quests.isDone('treasurefleet') && quests.isDone('patron')) {
      S.flags.won = true;
      save();
      Sfx.eraUnlock();
      UI.banner('MASTER OF THE TRADE WINDS', 'From one donkey at Byblos to the ledgers of a world — the guild drinks to your house. The roads stay open; the game goes on.', 6000);
    }
  }

  // ---------- city visit detection ----------
  let nearCity = null;
  function checkVisits() {
    let inCity = null;
    for (const c of CITIES) {
      if (c.era > S.era) continue;
      const dx = player.pos.x - c.x, dz = player.pos.z - c.z;
      if (dx * dx + dz * dz < 20 * 20) { inCity = c; break; }
    }
    if (inCity && nearCity !== inCity.id) {
      nearCity = inCity.id;
      if (!S.visited.includes(inCity.id)) {
        S.visited.push(inCity.id);
        save();
        gainXP(20, '— first time in ' + inCity.name);
        Panels.toast(`${inCity.name} — ${inCity.tag}`);
      }
      quests.notifyVisit(inCity.id);
      refreshMarkers();
      maybeMotherBeat(inCity.id);
    } else if (!inCity) nearCity = null;
  }

  // The mother mystery pays off at the far ends of her line. Reaching Chang'an
  // (the word she underlined) and, later, Calicut (the far shore) each triggers
  // a one-time story cutscene that resolves what became of her last caravan —
  // real-history-plausible (the eastern road that became the Silk Road's reach)
  // and emotionally satisfying — with a big House Standing rise after.
  function maybeMotherBeat(cityId) {
    if (story.chapter < 1) return;
    if (cityId === 'changan') {
      playStoryBeat('motherChangan', 'CHANGAN_MOTHER', 4, 'You found her road', 'Chang\'an speaks your mother\'s name — she paid the debt the honest way, to the end.');
    } else if (cityId === 'calicut') {
      playStoryBeat('motherCalicut', 'CALICUT_MOTHER', 4, 'The book is closed', 'Her last page comes home — the House of the Open Road owes no one.');
    }
  }

  // ---------- panels coexistence (re-register engine handlers) ----------
  Panels.setHandlers({
    onOpen() { api.setPaused(true); },
    onClose() {
      if (!UI.isOpen()) api.setPaused(false);
      stations.refreshVisuals();
      updateBeacon();
    },
    onStationCleared() { stations.refreshVisuals(); updateBeacon(); },
    chime: Audio.chime,
  });

  // ---------- frame loop ----------
  let stepT = 0, saveT = 0, visitT = 0;
  api.onFrame((dt, t) => {
    npcSys.update(dt, t, player.pos);
    particles.update(dt);
    pack.update(dt, player.pos, player.heading, player.speedNow, econ.cargoCount());

    // footsteps + run dust
    if (!api.isPaused() && player.grounded && player.speedNow > 1.2) {
      stepT -= dt * player.speedNow;
      if (stepT <= 0) {
        stepT = 3.4;
        Sfx.footstep(player.speedNow > 9);
        if (player.speedNow > 9) particles.burst('dust', player.pos.x, player.pos.y, player.pos.z, 2);
      }
    }

    // quest-giver markers bob + pulse (turn-in-ready markers beat faster/wider)
    if (!isMobile || (t % 0.1 < 0.05)) {
      for (const { marker } of npcRecs) {
        if (marker.visible) {
          marker.position.y = 2.15 + Math.sin(t * 2.4) * 0.08;
          marker.rotation.y = t * 1.4;
          marker.scale.setScalar(marker.material === markerMatReady
            ? 1 + Math.sin(t * 4.6) * 0.22
            : 1 + Math.sin(t * 2.4) * 0.1);
        }
      }
    }

    if (!api.isPaused() && !UI.isOpen()) travel.update(dt, player.pos.x, player.pos.z);

    visitT -= dt;
    if (visitT <= 0) { visitT = 0.5; checkVisits(); }

    saveT -= dt;
    if (saveT <= 0) {
      saveT = 5;
      S.pos = [Math.round(player.pos.x * 10) / 10, Math.round(player.pos.z * 10) / 10];
      save();
    }
  });

  // ---------- boot ----------
  refreshNPCVisibility();
  refreshMarkers();
  updateTracker();
  refreshHud();
  if (S.pos) { player.teleport(S.pos[0], S.pos[1]); pack.teleportBehind(); }
  Sfx.startAmbient();

  // ---------- cold open ----------
  // New Game opens on the inciting incident, not a menu: the candle, the
  // unfinished ledger, the Vell's notice, and Anath getting you up. The story
  // begins (chapter 1) and Old Anath's quest marker waits at the quay.
  if (!S.flags.intro) {
    S.flags.intro = true;
    if (story.chapter < 1) story.chapter = 1;
    refreshHud(); // House Standing appears now, at zero, ready to climb
    const controlsBeat = {
      tint: 'stone', kicker: 'Byblos — the cedar harbor',
      text: (isMobile
        ? 'Left stick to move, drag the right side to look. TAP a glowing prompt to act. The marker over Old Anath is your first road.'
        : 'WASD to move, mouse to look, SHIFT to run, E to talk and trade. J — journal, M — map. The marker over Old Anath is your first road.'),
      cta: 'Begin at the quay',
    };
    playCutscene([...COLD_OPEN, controlsBeat]);
  }

  // ---------- debug / verification hook ----------
  const game = {
    S, econ, xp, quests, story, openCity, cityById, gmap, travel,
    save: () => save(),
    netWorth,
    checkEra, raiseHouse,
    debug: {
      buy(gid, n = 1) { const c = cityById[nearCity || 'byblos']; const idx = CITIES.indexOf(c); for (let i = 0; i < n; i++) econ.buy(gid, priceAt(econ.goodById[gid], c.market[gid] || 1, performance.now() / 1000, idx, discountNow())); refreshHud(); },
      sell(gid, n = 1) { const c = cityById[nearCity || 'byblos']; const idx = CITIES.indexOf(c); for (let i = 0; i < n; i++) econ.sell(gid, priceAt(econ.goodById[gid], c.market[gid] || 1, performance.now() / 1000, idx, -discountNow())); refreshHud(); },
      goto(cityId) { const c = cityById[cityId]; player.teleport(c.x, c.z + 6); pack.teleportBehind(); },
      giveCedar() { econ.addGood('cedar', 2); refreshHud(); refreshMarkers(); },
      talk(npcId) { const r = npcRecs.find(x => x.spec.id === npcId); if (r) openDialogue(r.npc, r.spec.dialogue, dialogueCtx(r.spec)); },
      // story verification: list the registered cutscene beat names, force-play
      // one ignoring its gate, raise the house, and inspect/raise the era.
      beats() { return Object.keys(STORY_BEATS); },
      playBeat(name) { const b = STORY_BEATS[name]; if (b) return playCutscene(b); },
      house(n = 1) { raiseHouse(n, 'Standing rises', ''); return S.house.standing; },
      setEra(n) { S.era = n; save(); refreshNPCVisibility(); refreshMarkers(); refreshHud(); },
      reset() { store.reset(); location.reload(); },
    },
  };
  window.TW = game;
  return game;
}
