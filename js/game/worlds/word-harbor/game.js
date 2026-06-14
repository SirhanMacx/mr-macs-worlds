// game.js — WORD HARBOR controller: turns the Global 9 ENL world into a
// gentle builder-collector. Word-gems (the 244-term trilingual glossary) are
// the loot AND the currency; sentence-bridges span the fords; nine town
// buildings rise one word-family at a time; story quests retell the units in
// simple English; festival games are MODS-style practice with no fail states.
// Tuning is kind everywhere: slower walk, huge interact radii, big text,
// no timers, no death, and words are never lost.
import * as THREE from 'three';
import * as Panels from '../../../learn/panels.js';
import * as Audio from '../../../engine/audio.js';
import { buildStationMeshes } from '../../../engine/structures.js';
import { makeLabel, bakeParts } from '../../../engine/geo-kit.js';
import { loadBank } from '../../../learn/content-loader.js';
import * as Read from '../../../learn/read-aloud.js';
import { ISLES } from '../../../worlds/word-harbor.js';

import { createSave } from '../../save.js';
import { createStory } from '../../story.js';
import { createCodex } from '../../codex.js';
import { createAchievements } from '../../achievements.js';
import { playCutscene } from '../../cutscene.js';
import { createNPCSystem } from '../../npc.js';
import { createParticles } from '../../particles.js';
import { openDialogue } from '../../dialogue.js';
import * as UI from '../../ui.js';
import * as Sfx from '../../sfx.js';

import { ISLANDS, BUILDINGS, BRIDGES, STORIES, COMPASS, COLD_OPEN, MIRA, KEYSTONE, QUIET_STAGES } from './content.js';
import { STORY_PACKS } from './packs/index.js';
import { openGemCard, openBook, findTerm } from './book.js';
import { openBridgePuzzle, buildBridgeMesh, buildBridgeSite } from './bridge.js';
import { openPictureMatch, openWordSort, openListenFind, openLanterns, openTimeTravel } from './festival.js';
import { openStory } from './storybook.js';
import { paintPic } from './pics.js';

const esc = UI.esc;
const ISLE_OF = {
  home: 'home', 'wh-geo': 'geo', 'wh-paleo': 'paleo', 'wh-river': 'river',
  'wh-classical': 'classical', 'wh-caravan': 'caravan', 'wh-ren': 'ren', 'wh-explore': 'explore',
};
const WAVE = 12;        // uncollected gems visible per island at once
const GEM_CAP = 140;    // instanced mesh capacity

const DEFAULTS = {
  v: 2, // bumped for the story rebuild — old pre-story saves reset so the cold open plays
  gems: {},        // termEn -> 1
  bridges: {},     // bridgeId -> 1
  builds: {},      // buildingId -> 1
  stories: {},     // storyId -> 1
  sentences: [],   // sentences built on bridges (for the Time Travel Festival)
  compass: false,
  played: {},      // festival stall -> times
  won: false,
  flags: {},
  // narrative spine — chapter/beat/flags migrate cleanly onto old saves.
  // story flags this world reads: firstWord, helpedBula, townLit.
  story: { chapter: 0, beat: 'coldopen', flags: {} },
  helped: {},      // neighborId -> 1 (gentle keystone progress)
  pos: null,
};

function hashStr(s) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); }
  return h >>> 0;
}
function prng(seed) {
  let t = seed >>> 0;
  return () => {
    t += 0x6D2B79F5;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r = (r + Math.imul(r ^ (r >>> 7), 61 | r)) ^ r;
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

export async function initGame(api) {
  const { scene, field, player, stations, camera, def, isMobile } = api;

  // ---------- state + content ----------
  const store = createSave('word-harbor', DEFAULTS);
  const S = store.state;
  const save = () => store.save();
  if (!S.helped) S.helped = {};           // defensive for pre-story saves
  const story = createStory({ state: S, save });
  // shared spine: the Field Journal of understanding (codex) + sparse milestones
  // (achievements). Both ride the per-world save (save.js merges state.codex /
  // state.achievements over defaults, so they appear on old saves as []), and
  // both are defensive — a journal/achievement write can never break a beat.
  const codex = createCodex({ state: S, save });
  const ach = createAchievements({ state: S, save });
  let miraNpc = null, miraLamp = null, bulaMarker = null; // story-NPC refs

  const gloss = await (await fetch(def.glossary)).json();

  // term lookups: en -> term, en -> category, en -> island id
  const termMap = {}, catOf = {};
  for (const cat of gloss.categories) for (const t of cat.terms) { termMap[t.en] = t; catOf[t.en] = cat.name; }

  const islandOfTerm = {};
  for (const isl of ISLANDS) {
    for (const en of (isl.pick || [])) if (termMap[en]) islandOfTerm[en] = isl.id;
  }
  for (const isl of ISLANDS) {
    for (const catName of (isl.cats || [])) {
      const cat = gloss.categories.find(c => c.name === catName);
      if (!cat) continue;
      for (const t of cat.terms) if (!islandOfTerm[t.en]) islandOfTerm[t.en] = isl.id;
    }
  }
  // safety net: anything unmapped washes ashore at home
  for (const en in termMap) if (!islandOfTerm[en]) islandOfTerm[en] = 'home';

  const islandName = id => (ISLANDS.find(i => i.id === id) || {}).name || 'an island';
  const islandTerms = {}; // islandId -> [en...] (stable glossary order)
  for (const cat of gloss.categories) for (const t of cat.terms) {
    const id = islandOfTerm[t.en];
    (islandTerms[id] = islandTerms[id] || []).push(t.en);
  }

  // ---------- gentle tuning ----------
  document.body.classList.add('wh-world');
  player.speedMul = 0.85; // slower, calmer walk (camera follows the player)

  // ---------- systems ----------
  UI.init(api);
  const particles = createParticles(scene);
  const npcSys = createNPCSystem(scene, field, camera);
  const solidMat = new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.85, metalness: 0.04, flatShading: true });

  // ---------- the word-gem field (ONE InstancedMesh, one draw call) ----------
  const gemGeo = new THREE.OctahedronGeometry(0.55);
  const gemMat = new THREE.MeshStandardMaterial({ roughness: 0.25, metalness: 0.15, flatShading: true, emissive: 0x222222 });
  const gems = new THREE.InstancedMesh(gemGeo, gemMat, GEM_CAP);
  gems.frustumCulled = false;
  gems.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
  scene.add(gems);
  {
    // every slot starts hidden (default instance matrices sit at the origin)
    const hide = new THREE.Object3D();
    hide.position.set(0, -50, 0);
    hide.scale.setScalar(0.0001);
    hide.updateMatrix();
    for (let i = 0; i < GEM_CAP; i++) gems.setMatrixAt(i, hide.matrix);
    gems.instanceMatrix.needsUpdate = true;
  }

  const CAT_COLORS = {};
  BUILDINGS.forEach(b => { CAT_COLORS[b.cat] = b.color; });

  const dummy = new THREE.Object3D();
  const colC = new THREE.Color();
  const freeSlots = [];
  for (let i = GEM_CAP - 1; i >= 0; i--) freeSlots.push(i);
  const active = []; // {en, islandId, x, y, z, slot, extra, phase}

  // keep gems clear of stations, NPCs and plots so prompts never fight
  const GEM_KEEPOUT = [
    ...def.regions.map(r => ({ x: r.center[0], z: r.center[1], r: 12 })),
    ...def.skills.map(s => ({ x: s.pos[0], z: s.pos[1], r: 12 })),
    ...STORIES.map(s => ({ x: s.npcPos[0], z: s.npcPos[1], r: 8 })),
    ...BUILDINGS.map(b => ({ x: b.plot[0], z: b.plot[1], r: 8 })),
  ];
  function clearOfKeepout(x, z) {
    for (const k of GEM_KEEPOUT) {
      const dx = x - k.x, dz = z - k.z;
      if (dx * dx + dz * dz < k.r * k.r) return false;
    }
    return true;
  }

  function gemPos(en, islandId) {
    const isl = ISLES[ISLE_OF[islandId]];
    const rnd = prng(hashStr(en) ^ def.seed);
    for (let tries = 0; tries < 24; tries++) {
      const a = rnd() * Math.PI * 2;
      const r = 9 + rnd() * (isl.r * 0.66);
      const x = isl.c[0] + Math.cos(a) * r;
      const z = isl.c[1] + Math.sin(a) * r;
      const h = field.height(x, z);
      if (h > 1.1 && clearOfKeepout(x, z)) return [x, h, z];
    }
    return [isl.c[0] + 14, Math.max(field.height(isl.c[0] + 14, isl.c[1] + 14), 1.2), isl.c[1] + 14];
  }

  function spawnGem(en) {
    if (!freeSlots.length) return;
    const islandId = islandOfTerm[en];
    const [x, y, z] = gemPos(en, islandId);
    const slot = freeSlots.pop();
    const rec = { en, islandId, x, y: y + 1.0, z, slot, phase: hashStr(en) % 100 };
    colC.set(CAT_COLORS[catOf[en]] || 0xb78ee8);
    gems.setColorAt(slot, colC);
    if (gems.instanceColor) gems.instanceColor.needsUpdate = true;
    rec.extra = stations.addExtra({
      id: 'gem-' + en, type: 'gem', verb: 'Collect word', label: en,
      pos: new THREE.Vector3(x, y, z), interactR: 7.5,
      onInteract: () => collect(en),
    });
    active.push(rec);
  }

  function despawnGem(rec) {
    dummy.position.set(0, -50, 0); dummy.scale.setScalar(0.0001);
    dummy.updateMatrix();
    gems.setMatrixAt(rec.slot, dummy.matrix);
    gems.instanceMatrix.needsUpdate = true;
    freeSlots.push(rec.slot);
    stations.removeExtra(rec.extra);
    const i = active.indexOf(rec);
    if (i >= 0) active.splice(i, 1);
  }

  function refillIsland(islandId) {
    const list = islandTerms[islandId] || [];
    const visible = active.filter(r => r.islandId === islandId).length;
    let need = WAVE - visible;
    for (const en of list) {
      if (need <= 0) break;
      if (S.gems[en]) continue;
      if (active.some(r => r.en === en)) continue;
      spawnGem(en);
      need--;
    }
  }
  function refillAll() { for (const isl of ISLANDS) refillIsland(isl.id); gems.instanceMatrix.needsUpdate = true; }

  function collect(en) {
    if (S.gems[en]) return;
    const rec = active.find(r => r.en === en);
    S.gems[en] = 1;
    save();
    if (rec) {
      particles.burst('sparkle', rec.x, rec.y, rec.z, 16);
      despawnGem(rec);
      refillIsland(rec.islandId);
    }
    Sfx.coin();
    const term = termMap[en];
    openGemCard(term, { isNew: true });
    refreshHud();
    updateGoal();
  }

  const wordCount = () => Object.keys(S.gems).length;
  const catCount = cat => {
    const c = gloss.categories.find(x => x.name === cat);
    return c ? c.terms.filter(t => S.gems[t.en]).length : 0;
  };

  // ---------- bridges ----------
  const bridgeMeshes = {}; // id -> {site, mesh, extra}
  function placeBridge(br) {
    const rec = bridgeMeshes[br.id] = bridgeMeshes[br.id] || {};
    if (S.bridges[br.id]) {
      if (rec.site) { scene.remove(rec.site); rec.site = null; }
      if (rec.extra) { stations.removeExtra(rec.extra); rec.extra = null; }
      if (!rec.mesh) { rec.mesh = buildBridgeMesh(field, br.a, br.b); scene.add(rec.mesh); }
      return;
    }
    if (!rec.site) {
      rec.site = buildBridgeSite(field, br.a, br.b);
      scene.add(rec.site);
      const label = makeLabel(br.name, 'A sentence can span this water', '#ffd9a0', 0.024);
      const y0 = Math.max(field.height(br.a[0], br.a[1]), 0.4);
      label.position.set(br.a[0], y0 + 3.6, br.a[1]);
      rec.site.add(label);
    }
    if (!rec.extra) {
      const mx = (br.a[0] + br.b[0]) / 2, mz = (br.a[1] + br.b[1]) / 2;
      rec.extra = stations.addExtra({
        id: 'bridge-' + br.id, type: 'bridge', verb: 'Build', label: br.name,
        pos: new THREE.Vector3(mx, Math.max(field.height(mx, mz), 0.4), mz), interactR: 14,
        onInteract: () => openBridgePuzzle(br, {
          hasGem: en => !!S.gems[en],
          whereIs: en => islandName(islandOfTerm[en]),
          onBuilt() {
            S.bridges[br.id] = 1;
            const sentence = br.words.join(' ') + '.';
            if (!S.sentences.includes(sentence)) S.sentences.push(sentence);
            save();
            placeBridge(br);
            const my = Math.max(field.height(mx, mz), 0.4);
            particles.burst('confetti', mx, my + 2, mz, 30);
            UI.banner('Bridge built — ' + br.name, sentence);
            refreshHud();
            updateGoal();
            checkTown();
          },
        }),
      });
    }
  }
  BRIDGES.forEach(placeBridge);

  // ---------- town buildings ----------
  const buildMeshes = {}; // id -> {plot, mesh, extra, villager}
  const VILLAGER_HUES = [0x7a6a4f, 0x5d6e8a, 0x8a5d5d, 0x5d8a6e, 0x8a7a3c, 0x6e5d8a, 0x4d8f86, 0xb97f4e, 0x9a6a3f];

  function plotMarker(b) {
    const y = field.height(b.plot[0], b.plot[1]);
    const parts = [
      { geo: new THREE.CylinderGeometry(0.12, 0.15, 1.6, 6), color: 0x8a5a33, x: 0, y: 0.8, z: 0 },
      { geo: new THREE.BoxGeometry(1.5, 0.85, 0.1), color: 0xe8d9b0, x: 0, y: 1.55, z: 0 },
    ];
    // a little ring of stones marking the plot
    for (let i = 0; i < 7; i++) {
      const a = (i / 7) * Math.PI * 2;
      parts.push({ geo: new THREE.DodecahedronGeometry(0.22), color: 0x9a8f7a, x: Math.cos(a) * 2.6, y: 0.15, z: Math.sin(a) * 2.6 });
    }
    const mesh = new THREE.Mesh(bakeParts(parts), solidMat);
    mesh.position.set(b.plot[0], y, b.plot[1]);
    return mesh;
  }

  function spawnVillager(b, ix) {
    return npcSys.addNPC({
      id: 'vil-' + b.id,
      x: b.plot[0] + 2.5, z: b.plot[1] + 2.5,
      palette: { robe: VILLAGER_HUES[ix % VILLAGER_HUES.length], trim: 0x3c3428, skin: [0xd9a066, 0xb97f4e, 0x8a5a33, 0xd9b07c][ix % 4] },
      hatKind: ['cap', 'brim', 'none', 'hood'][ix % 4],
      wander: 7,
    });
  }

  function placeBuilding(b, ix, fresh = false) {
    const rec = buildMeshes[b.id] = buildMeshes[b.id] || {};
    const y = field.height(b.plot[0], b.plot[1]);
    if (S.builds[b.id]) {
      if (rec.plot) { scene.remove(rec.plot); rec.plot = null; }
      if (rec.extra) { stations.removeExtra(rec.extra); rec.extra = null; }
      if (!rec.mesh) {
        const { group } = buildStationMeshes(b.kind, b.color, solidMat);
        group.position.set(b.plot[0], y, b.plot[1]);
        group.scale.setScalar(0.62);
        group.rotation.y = Math.atan2(b.plot[0], b.plot[1] - 95) + Math.PI;
        scene.add(group);
        rec.mesh = group;
        const label = makeLabel(b.name, b.cat, '#' + b.color.toString(16).padStart(6, '0'), 0.022);
        label.position.set(b.plot[0], y + 7.2, b.plot[1]);
        scene.add(label);
        rec.label = label;
        // draw-call budget: a villager moves in at every OTHER building (each
        // procedural humanoid costs ~8 draw calls; a full 9-building town with
        // 9 villagers + 9 always-on labels blew the 120-call budget up close)
        rec.villager = ix % 2 === 0 ? spawnVillager(b, ix) : null;
        rec.bExtra = stations.addExtra({
          id: 'built-' + b.id, type: 'building', verb: 'Visit', label: b.name,
          pos: new THREE.Vector3(b.plot[0], y, b.plot[1]), interactR: 7,
          onInteract: () => openBuildPanel(b),
        });
      }
      if (fresh) {
        particles.burst('confetti', b.plot[0], y + 3, b.plot[1], 34);
        particles.burst('sparkle', b.plot[0], y + 1, b.plot[1], 18);
      }
      return;
    }
    if (!rec.plot) {
      rec.plot = plotMarker(b);
      scene.add(rec.plot);
    }
    if (!rec.extra) {
      rec.extra = stations.addExtra({
        id: 'plot-' + b.id, type: 'plot', verb: 'Plan', label: b.name,
        pos: new THREE.Vector3(b.plot[0], y, b.plot[1]), interactR: 7,
        onInteract: () => openBuildPanel(b),
      });
    }
  }
  BUILDINGS.forEach((b, ix) => placeBuilding(b, ix));

  function speakTerms(cat, n = 5) {
    const c = gloss.categories.find(x => x.name === cat);
    if (!c) return;
    const got = c.terms.filter(t => S.gems[t.en]).slice(0, n);
    got.forEach((t, i) => setTimeout(() => Read.speak(t.en, { lang: 'en-US', rate: 0.85 }), 350 + i * 1500));
  }

  function openBuildPanel(b) {
    const built = !!S.builds[b.id];
    const have = catCount(b.cat);
    const catObj = gloss.categories.find(x => x.name === b.cat);
    const totalCat = catObj ? catObj.terms.length : 0;
    const missing = built ? [] : (catObj ? catObj.terms.filter(t => !S.gems[t.en]).slice(0, 3) : []);
    UI.push({
      className: 'wh-build-layer',
      html: `<div class="wh-build-card">
        <div class="wh-bridge-head"><b>${esc(b.name)}</b>
          <span class="wh-bridge-sub">${esc(b.cat)}</span>
          <button class="dlg-x" data-gui-close>CLOSE</button></div>
        <p class="wh-build-blurb">${esc(b.blurb)}</p>
        <p class="wh-build-progress">Words of this family found: <b>${have}</b> / ${totalCat}
          ${built ? ' · the words live here now (still yours, see your BOOK)' : ` · need <b>${b.cost}</b> to build`}</p>
        ${!built && have < b.cost && missing.length ? `<p class="wh-build-hint">Look for
          ${missing.map(t => `<b>${esc(t.en)}</b> (${esc(islandName(islandOfTerm[t.en]))})`).join(' · ')}</p>` : ''}
        <div class="wh-story-nav">
          ${built
            ? `<button class="wh-btn wh-hear-house">HEAR ITS WORDS</button>`
            : `<button class="wh-btn wh-construct" ${have >= b.cost ? '' : 'disabled'}>CONSTRUCT — ${b.cost} WORDS</button>`}
        </div>
      </div>`,
      dismissible: true,
      onMount(el, { close }) {
        const cBtn = el.querySelector('.wh-construct');
        if (cBtn) cBtn.addEventListener('click', () => {
          S.builds[b.id] = 1;
          save();
          close();
          Sfx.eraUnlock();
          placeBuilding(b, BUILDINGS.indexOf(b), true);
          UI.banner('You built the ' + b.name, 'Listen — its words are moving in. They stay in your BOOK forever.');
          speakTerms(b.cat, 5);
          refreshHud();
          updateGoal();
          checkTown();
        });
        const hBtn = el.querySelector('.wh-hear-house');
        if (hBtn) hBtn.addEventListener('click', () => { Sfx.click(); speakTerms(b.cat, 5); });
      },
    });
  }

  // ---------- the arrival boat (a warm landmark at the quay) ----------
  {
    const y = 0.1;
    const parts = [
      { geo: new THREE.BoxGeometry(3.0, 1.1, 7.5), color: 0x8a5a33, x: 0, y: 0.7, z: 0 },
      { geo: new THREE.BoxGeometry(2.2, 0.5, 5.8), color: 0x9a6a3f, x: 0, y: 1.35, z: 0 },
      { geo: new THREE.CylinderGeometry(0.12, 0.16, 5.4, 6), color: 0x7a5230, x: 0, y: 3.6, z: 0.4 },
      { geo: new THREE.BoxGeometry(0.14, 2.6, 1.9), color: 0xefe7d4, x: 0.5, y: 4.1, z: 0.4, rz: -0.06 },
    ];
    const boat = new THREE.Mesh(bakeParts(parts), solidMat);
    boat.position.set(7, y, 128);
    boat.rotation.y = 0.5;
    scene.add(boat);
    const label = makeLabel('Your Boat', 'It brought you here', '#ffd9a0', 0.02);
    label.position.set(7, y + 6.4, 128);
    scene.add(label);
  }

  // ---------- story NPCs ----------
  for (const st of STORIES) {
    const x = st.npcPos[0], z = st.npcPos[1];
    const npc = npcSys.addNPC({
      id: 'story-' + st.id, name: st.npc, title: st.title,
      x, z, palette: st.palette, hatKind: st.hatKind,
      face: Math.atan2(player.pos.x - x, player.pos.z - z),
      labelColor: '#ffe9b0',
    });
    stations.addExtra({
      id: 'npc-' + st.id, type: 'npc', verb: 'Talk to', label: st.npc,
      pos: npc.group.position, interactR: 7,
      onInteract() {
        openStory({
          title: st.title, npc: st.npc, lines: st.lines,
          onDone() {
            if (!S.stories[st.id]) {
              S.stories[st.id] = 1;
              save();
              Sfx.questDone();
              particles.burst('confetti', npc.group.position.x, npc.group.position.y + 2, npc.group.position.z, 20);
              UI.banner('Story heard — ' + st.title, 'Stories make the words easier to keep.');
              refreshHud();
              updateGoal();
              try { notifyPackQuestDone(st.id); } catch (e) { /* additive: never break a story */ }
            }
          },
        });
      },
    });
  }

  // ---------- THE QUIET → town light (the gentle feedback meter) ----------
  // Not a score and never scary: a soft 0..100 measure of how much of the
  // harbor is lit. Words, bridges, buildings and helped neighbors each add a
  // little light, so the Quiet visibly RECEDES as you play. Read off live.
  function townLight() {
    const wordFrac = Math.min(1, wordCount() / 40);              // up to ~55
    const bridgeFrac = Object.keys(S.bridges).length / BRIDGES.length; // up to 18
    const buildFrac = Object.keys(S.builds).length / BUILDINGS.length; // up to 18
    const helpFrac = Math.min(1, Object.keys(S.helped).length / 1);    // up to 9
    return Math.round(wordFrac * 55 + bridgeFrac * 18 + buildFrac * 18 + helpFrac * 9);
  }
  function quietLine() {
    const v = townLight();
    for (const s of QUIET_STAGES) if (v < s.upTo) return s.light;
    return QUIET_STAGES[QUIET_STAGES.length - 1].light;
  }

  // lightLamp — the warm payoff of a story win: a soft chime, a confetti +
  // sparkle puff at your feet, a gentle banner. The emotional equivalent of
  // Trade Winds' raiseHouse, but kind: you "light a lamp", you never "score".
  function lightLamp(sub) {
    Sfx.questDone();
    particles.burst('confetti', player.pos.x, player.pos.y + 1.6, player.pos.z, 22);
    particles.burst('sparkle', player.pos.x, player.pos.y + 0.8, player.pos.z, 14);
    UI.banner('A lamp lights', sub || quietLine(), 3200);
    refreshHud();
    updateGoal();
  }

  // ---------- Mira: the warm recurring mentor (openDialogue + portrait) ------
  // ctx exposes the gentle story hooks her dialogue needs: flag/is/wordCount +
  // lightLamp. She greets you, gives the first word, and recurs as the town
  // wakes (her start() reads the story flags).
  function dialogueCtx() {
    return {
      story,
      flag: (k, v = true) => story.flag(k, v),
      is: (k) => story.is(k),
      wordCount,
      lightLamp: (sub) => lightLamp(sub),
    };
  }
  {
    const x = MIRA.npcPos[0], z = MIRA.npcPos[1];
    const mira = npcSys.addNPC({
      id: 'mira', name: MIRA.name, title: MIRA.title,
      x, z, palette: MIRA.palette, hatKind: MIRA.hatKind,
      face: Math.atan2(player.pos.x - x, player.pos.z - z),
      labelColor: '#ffe1a0',
    });
    // a soft lamp-glow marker so the mentor reads as "the warm light" of town
    const lampGeo = new THREE.OctahedronGeometry(0.22);
    const lampMat = new THREE.MeshBasicMaterial({ color: 0xffd27a });
    const lamp = new THREE.Mesh(lampGeo, lampMat);
    lamp.position.y = 2.4;
    mira.group.add(lamp);
    miraLamp = lamp;
    stations.addExtra({
      id: 'npc-mira', type: 'npc', verb: 'Talk to', label: MIRA.name,
      pos: mira.group.position, interactR: 8,
      onInteract() {
        // when the town is fully lit, let Mira reflect that
        if (townDone() && S.won && !story.is('townLit')) story.flag('townLit');
        openDialogue(mira, MIRA.dialogue, dialogueCtx());
      },
    });
    miraNpc = mira;
  }

  // ---------- Bula: the gentle keystone neighbor (help with the RIGHT word) --
  // The whole point, gentle version: you advance the warm story by GIVING the
  // word whose MEANING matches what your neighbor needs. A not-quite-right word
  // never fails — Bula re-teaches kindly (picture-first) and you try again.
  {
    const x = KEYSTONE.npcPos[0], z = KEYSTONE.npcPos[1];
    const bula = npcSys.addNPC({
      id: 'bula', name: KEYSTONE.name, title: KEYSTONE.title,
      x, z, palette: KEYSTONE.palette, hatKind: KEYSTONE.hatKind,
      face: Math.atan2(player.pos.x - x, player.pos.z - z),
      labelColor: '#cdeec0',
    });
    const marker = new THREE.Mesh(new THREE.OctahedronGeometry(0.18), new THREE.MeshBasicMaterial({ color: 0x9bd47e }));
    marker.position.y = 2.2;
    bula.group.add(marker);
    bulaMarker = marker;
    stations.addExtra({
      id: 'npc-bula', type: 'npc', verb: 'Help', label: KEYSTONE.name,
      pos: bula.group.position, interactR: 8,
      onInteract() { openKeystone(bula); },
    });
  }

  // the gentle keystone overlay — picture-first, no timer, no fail, TTS-able
  function openKeystone() {
    const helped = !!S.helped[KEYSTONE.id];
    let hintsOn = false;
    try { hintsOn = localStorage.getItem('mmw-wh-hints') === '1'; } catch (e) { /* fresh */ }
    UI.push({
      className: 'wh-fest-layer',
      html: '<div class="wh-fest-card wh-keystone-card"></div>',
      dismissible: true,
      onClose() { Read.stop(); },
      onMount(el, { close }) { render(el.querySelector('.wh-keystone-card'), close); },
    });

    function render(card, close, reteach) {
      // already-helped: a warm "thank you" replay, no challenge
      if (helped) {
        card.innerHTML = `
          <div class="wh-bridge-head"><b>${esc(KEYSTONE.name)}</b>
            <span class="wh-bridge-sub">${esc(KEYSTONE.title)}</span>
            <button class="dlg-x" data-gui-close>LEAVE</button></div>
          <canvas class="wh-story-pic wh-ks-pic" aria-hidden="true"></canvas>
          <p class="wh-story-en">${esc(KEYSTONE.win.en)}
            ${Read.buttonHTML(KEYSTONE.win.en, { lang: 'en-US', label: 'Read aloud' })}</p>
          <div class="wh-story-nav"><button class="wh-btn" data-gui-close>YOU ARE WELCOME</button></div>`;
        requestAnimationFrame(() => paintPic(KEYSTONE.win.pic || 'compass', card.querySelector('.wh-ks-pic')));
        Read.speak(KEYSTONE.win.en, { lang: 'en-US', rate: 0.85 });
        return;
      }
      const q = KEYSTONE.prompt;
      card.innerHTML = `
        <div class="wh-bridge-head"><b>${esc(KEYSTONE.name)} needs a word</b>
          <span class="wh-bridge-sub">Give the RIGHT word — wrong is never a problem</span>
          <button class="dlg-x" data-gui-close>LEAVE</button></div>
        <canvas class="wh-story-pic wh-ks-pic" aria-hidden="true"></canvas>
        <p class="wh-story-en">${esc(q.en)}
          ${Read.buttonHTML(q.en, { lang: 'en-US', label: 'Read the question aloud' })}</p>
        ${reteach ? `<p class="wh-bridge-tryagain">${esc(reteach.en)}
          ${Read.buttonHTML(reteach.en, { lang: 'en-US', label: 'Read aloud' })}</p>` : ''}
        <div class="wh-ks-choices">
          ${KEYSTONE.choices.map((c, i) => `
            <button class="wh-ks-choice" data-i="${i}">
              <canvas class="wh-ks-thumb" aria-hidden="true"></canvas>
              <span>${esc(c.label)}</span>
            </button>`).join('')}
        </div>
        <div class="wh-story-hints" style="display:${hintsOn ? 'block' : 'none'}">
          <p lang="zh-Hans"><span class="wh-hint-lab">中文</span> ${esc(q.zh)}</p>
          <p lang="es"><span class="wh-hint-lab">Español</span> ${esc(q.es)}</p>
        </div>
        <div class="wh-story-nav">
          <button class="wh-btn wh-hint-toggle ${hintsOn ? 'on' : ''}">${hintsOn ? 'HIDE HINTS' : '中文 / ESPAÑOL'}</button>
          <span class="wh-fest-tip">Take all the tries you need</span>
        </div>`;
      requestAnimationFrame(() => {
        paintPic(KEYSTONE.pic || 'compass', card.querySelector('.wh-ks-pic'));
        card.querySelectorAll('.wh-ks-choice').forEach((b, i) => paintPic(KEYSTONE.choices[i].pic, b.querySelector('.wh-ks-thumb')));
      });
      Read.speak(q.en, { lang: 'en-US', rate: 0.82 });
      card.querySelector('.wh-hint-toggle').addEventListener('click', () => {
        Sfx.click(); hintsOn = !hintsOn;
        try { localStorage.setItem('mmw-wh-hints', hintsOn ? '1' : '0'); } catch (e) { /* no-op */ }
        render(card, close, reteach);
      });
      card.querySelectorAll('.wh-ks-choice').forEach(b => b.addEventListener('click', () => {
        const c = KEYSTONE.choices[+b.dataset.i];
        if (c.right) {
          // CORRECT — the world visibly changes: a warm scene opens, a lamp
          // lights, the Quiet recedes one more step.
          Sfx.good();
          S.helped[KEYSTONE.id] = 1;
          story.flag('helpedBula');
          save();
          close();
          openStory({
            title: KEYSTONE.name, npc: KEYSTONE.title,
            lines: [{ pic: KEYSTONE.win.pic || 'compass', en: KEYSTONE.win.en, zh: KEYSTONE.win.zh, es: KEYSTONE.win.es }],
            doneLabel: 'A LAMP LIGHTS',
            onDone() { lightLamp('You used the right word, and the town has water again.'); },
          });
        } else {
          // NOT-QUITE-RIGHT — never a red X. Bula re-teaches gently (picture +
          // why) and you simply try again from understanding.
          Sfx.bad();
          b.classList.remove('wobble'); void b.offsetWidth; b.classList.add('wobble');
          if (c.reteach) Read.speak(c.reteach.en, { lang: 'en-US', rate: 0.85 });
          render(card, close, c.reteach);
        }
      }));
    }
  }

  // ===================================================================
  //  STORY-PACK SYSTEM (additive) — dozens of curriculum packs plug in
  //  here without touching the shipped story. A pack adds NPCs, one-time
  //  cutscenes, triggers and gentle keystones; on a keystone win it writes
  //  a Codex entry, lifts the town-light meter and may unlock an
  //  achievement. EVERY pack is registered DEFENSIVELY in its own try/catch
  //  so one broken pack can never crash Word Harbor — it is logged + skipped.
  //  See packs/CONTRACT.md (the spec) and packs/geography-isle.sample.js
  //  (the gold-standard example Workflow-2 authors copy).
  // ===================================================================
  const loadedPacks = [];           // {id, unit, title, pack, npcRecs:[...]}
  const packKeystones = {};         // keystoneId -> { pack, ks, openFn }
  const packTriggers = [];          // {on, value, play, reward, pack, fired}

  // a generic keystone overlay — the SAME picture-first, no-fail, TTS-able
  // flow as Bula, but parametric so any pack keystone reuses it with zero new
  // UI. Wrong choice re-teaches + loops; right choice opens the warm scene,
  // records the Codex entry, lifts the meter and unlocks any achievement.
  function openPackKeystone(pack, ks) {
    const helpedKey = 'ks-' + ks.id;
    const helped = !!S.helped[helpedKey];
    let hintsOn = false;
    try { hintsOn = localStorage.getItem('mmw-wh-hints') === '1'; } catch (e) { /* fresh */ }
    UI.push({
      className: 'wh-fest-layer',
      html: '<div class="wh-fest-card wh-keystone-card"></div>',
      dismissible: true,
      onClose() { Read.stop(); },
      onMount(el, { close }) { render(el.querySelector('.wh-keystone-card'), close); },
    });

    function render(card, close, reteach) {
      if (helped) {
        card.innerHTML = `
          <div class="wh-bridge-head"><b>${esc(ks.npcName || pack.title)}</b>
            <span class="wh-bridge-sub">${esc(ks.npcTitle || pack.unit)}</span>
            <button class="dlg-x" data-gui-close>LEAVE</button></div>
          <canvas class="wh-story-pic wh-ks-pic" aria-hidden="true"></canvas>
          <p class="wh-story-en">${esc(ks.win.en)}
            ${Read.buttonHTML(ks.win.en, { lang: 'en-US', label: 'Read aloud' })}</p>
          <div class="wh-story-nav"><button class="wh-btn" data-gui-close>YOU ARE WELCOME</button></div>`;
        requestAnimationFrame(() => paintPic(ks.win.pic || ks.pic || 'gem', card.querySelector('.wh-ks-pic')));
        Read.speak(ks.win.en, { lang: 'en-US', rate: 0.85 });
        return;
      }
      const q = ks.prompt;
      card.innerHTML = `
        <div class="wh-bridge-head"><b>${esc(ks.npcName || pack.title)} needs a word</b>
          <span class="wh-bridge-sub">Give the RIGHT word — wrong is never a problem</span>
          <button class="dlg-x" data-gui-close>LEAVE</button></div>
        <canvas class="wh-story-pic wh-ks-pic" aria-hidden="true"></canvas>
        <p class="wh-story-en">${esc(q.en)}
          ${Read.buttonHTML(q.en, { lang: 'en-US', label: 'Read the question aloud' })}</p>
        ${reteach ? `<p class="wh-bridge-tryagain">${esc(reteach.en)}
          ${Read.buttonHTML(reteach.en, { lang: 'en-US', label: 'Read aloud' })}</p>` : ''}
        <div class="wh-ks-choices">
          ${ks.choices.map((c, i) => `
            <button class="wh-ks-choice" data-i="${i}">
              <canvas class="wh-ks-thumb" aria-hidden="true"></canvas>
              <span>${esc(c.label)}</span>
            </button>`).join('')}
        </div>
        <div class="wh-story-hints" style="display:${hintsOn ? 'block' : 'none'}">
          <p lang="zh-Hans"><span class="wh-hint-lab">中文</span> ${esc(q.zh || '')}</p>
          <p lang="es"><span class="wh-hint-lab">Español</span> ${esc(q.es || '')}</p>
        </div>
        <div class="wh-story-nav">
          <button class="wh-btn wh-hint-toggle ${hintsOn ? 'on' : ''}">${hintsOn ? 'HIDE HINTS' : '中文 / ESPAÑOL'}</button>
          <span class="wh-fest-tip">Take all the tries you need</span>
        </div>`;
      requestAnimationFrame(() => {
        paintPic(ks.pic || 'gem', card.querySelector('.wh-ks-pic'));
        card.querySelectorAll('.wh-ks-choice').forEach((b, i) => paintPic(ks.choices[i].pic, b.querySelector('.wh-ks-thumb')));
      });
      Read.speak(q.en, { lang: 'en-US', rate: 0.82 });
      card.querySelector('.wh-hint-toggle').addEventListener('click', () => {
        Sfx.click(); hintsOn = !hintsOn;
        try { localStorage.setItem('mmw-wh-hints', hintsOn ? '1' : '0'); } catch (e) { /* no-op */ }
        render(card, close, reteach);
      });
      card.querySelectorAll('.wh-ks-choice').forEach(b => b.addEventListener('click', () => {
        const c = ks.choices[+b.dataset.i];
        if (c.right) {
          // CORRECT — the world visibly changes: a warm scene opens, the Codex
          // remembers the idea, a lamp lights, the Quiet recedes one more step.
          Sfx.good();
          S.helped[helpedKey] = 1;
          if (ks.flag) story.flag(ks.flag);
          save();
          // record the real idea into the shared Field Journal (idempotent +
          // guarded — a journal write can never break the beat).
          if (ks.codex) codex.record(ks.codex);
          if (ks.achievement) {
            const meta = (pack.achievements || []).find(a => a.id === ks.achievement) || { title: ks.achievement };
            ach.unlock(ks.achievement, meta);
          }
          close();
          openStory({
            title: ks.npcName || pack.title, npc: ks.npcTitle || pack.unit,
            lines: [{ pic: ks.win.pic || ks.pic || 'gem', en: ks.win.en, zh: ks.win.zh, es: ks.win.es }],
            doneLabel: 'A LAMP LIGHTS',
            onDone() {
              refreshPackMarkers();
              lightLamp(ks.light || 'You gave the right word, and the harbor is brighter.');
            },
          });
        } else {
          // NOT-QUITE-RIGHT — never a red X. The neighbor re-teaches gently
          // (picture + why) and you simply try again from understanding.
          Sfx.bad();
          b.classList.remove('wobble'); void b.offsetWidth; b.classList.add('wobble');
          if (c.reteach) Read.speak(c.reteach.en, { lang: 'en-US', rate: 0.85 });
          render(card, close, c.reteach);
        }
      }));
    }
  }

  // marker refresh for pack NPCs that own an un-helped keystone (green bob,
  // goes dark once understood). Called at boot, on a keystone win, and per
  // frame for the gentle bob (cheap: only iterates pack NPCs with markers).
  function refreshPackMarkers() {
    for (const lp of loadedPacks) {
      for (const r of lp.npcRecs) {
        if (!r.marker) continue;
        const open = r.keystoneId && !S.helped['ks-' + r.keystoneId];
        r.marker.visible = !!open;
      }
    }
  }

  // play a pack cutscene once, then optionally lift the meter. Mirrors the
  // shipped playStoryBeat shape but lives on a per-pack flag so it fires once.
  function playPackCutscene(pack, beatsName, reward) {
    const beats = (pack.cutscenes || {})[beatsName];
    if (!Array.isArray(beats) || !beats.length) return false;
    playCutscene(beats).then(() => {
      if (reward && typeof reward.light === 'string') lightLamp(reward.light);
    });
    return true;
  }

  // register ONE pack — defensively. Adds its NPCs (each with dialogue or a
  // keystone + a marker), indexes its keystones, and queues its triggers.
  function registerPack(pack) {
    if (!pack || !pack.id) { console.warn('[Word Harbor] skipped a pack with no id'); return; }
    if (loadedPacks.some(lp => lp.id === pack.id)) { console.warn('[Word Harbor] duplicate pack id, skipped:', pack.id); return; }
    const lp = { id: pack.id, unit: pack.unit || '', title: pack.title || pack.id, pack, npcRecs: [] };
    const ksById = {};
    for (const ks of (pack.keystones || [])) if (ks && ks.id) ksById[ks.id] = ks;

    for (const spec of (pack.npcs || [])) {
      if (!spec || !spec.id || !Array.isArray(spec.pos)) continue;
      const x = spec.pos[0], z = spec.pos[1];
      const npc = npcSys.addNPC({
        id: 'pack-' + pack.id + '-' + spec.id, name: spec.name || spec.id, title: spec.title || pack.unit,
        x, z, palette: spec.palette || { robe: 0x6e5d8a, trim: 0x3c3428, skin: 0xd9a066 },
        hatKind: spec.hatKind || 'cap',
        face: Math.atan2(player.pos.x - x, player.pos.z - z),
        labelColor: '#cdeec0',
      });
      const ks = spec.keystone ? ksById[spec.keystone] : null;
      let marker = null;
      if (ks) {
        // carry the NPC's display fields onto the keystone for the overlay
        ks.npcName = spec.name || spec.id; ks.npcTitle = spec.title || pack.unit;
        packKeystones[ks.id] = { pack, ks };
        marker = new THREE.Mesh(new THREE.OctahedronGeometry(0.18), new THREE.MeshBasicMaterial({ color: 0x9bd47e }));
        marker.position.y = 2.2;
        npc.group.add(marker);
      }
      stations.addExtra({
        id: 'pack-npc-' + pack.id + '-' + spec.id,
        type: 'npc', verb: ks ? 'Help' : 'Talk to', label: spec.name || spec.id,
        pos: npc.group.position, interactR: 8,
        onInteract() {
          if (ks) { openPackKeystone(pack, ks); return; }
          if (spec.dialogue) {
            openDialogue(npc, spec.dialogue, dialogueCtx());
            return;
          }
          Panels.toast((spec.name || 'A neighbor') + ' smiles, but has no words yet.');
        },
      });
      lp.npcRecs.push({ spec, npc, marker, keystoneId: ks ? ks.id : null });
    }

    for (const tr of (pack.triggers || [])) {
      if (!tr || !tr.play) continue;
      packTriggers.push({ on: tr.on || 'visit', value: tr.value, play: tr.play, reward: tr.reward, pack, fired: false });
    }
    loadedPacks.push(lp);
  }

  // boot the loader: register every pack in its own try/catch, then prime the
  // markers and fire any 'enter'/'boot' triggers once.
  for (const pack of (STORY_PACKS || [])) {
    try { registerPack(pack); }
    catch (e) { console.warn('[Word Harbor] pack failed to register and was skipped:', pack && pack.id, e); }
  }
  refreshPackMarkers();

  // fire a trigger key once (flag-keyed so it survives reloads via story flags)
  function firePackTrigger(t) {
    if (t.fired) return;
    const flagKey = 'pk-' + t.pack.id + '-' + t.play;
    if (story.is(flagKey)) { t.fired = true; return; }
    story.flag(flagKey);
    t.fired = true;
    try { playPackCutscene(t.pack, t.play, t.reward); }
    catch (e) { console.warn('[Word Harbor] pack cutscene failed:', t.pack.id, t.play, e); }
  }
  function notifyPackVisit(islandId) {
    for (const t of packTriggers) if (!t.fired && t.on === 'visit' && t.value === islandId) firePackTrigger(t);
  }
  function notifyPackFlag(flag) {
    for (const t of packTriggers) if (!t.fired && t.on === 'flag' && t.value === flag) firePackTrigger(t);
  }
  function notifyPackQuestDone(storyId) {
    for (const t of packTriggers) if (!t.fired && t.on === 'questDone' && t.value === storyId) firePackTrigger(t);
  }
  // island-entry detector: the player is "on" an island when within its radius
  // (ISLES geometry). Fires on:'visit' triggers the first time per island. Skip
  // entirely if no visit trigger is even pending (cheap on the common path).
  let nearPackIsland = null;
  function checkPackVisits() {
    if (!packTriggers.some(t => !t.fired && t.on === 'visit')) return;
    let on = null;
    for (const isl of ISLANDS) {
      const geo = ISLES[ISLE_OF[isl.id]];
      if (!geo) continue;
      const dx = player.pos.x - geo.c[0], dz = player.pos.z - geo.c[1];
      if (dx * dx + dz * dz < geo.r * geo.r) { on = isl.id; break; }
    }
    if (on && nearPackIsland !== on) { nearPackIsland = on; notifyPackVisit(on); }
    else if (!on) nearPackIsland = null;
  }
  // 'enter'/'boot' triggers fire once now (after the cold open, so they queue)
  for (const t of packTriggers) if (t.on === 'enter' || t.on === 'boot') {
    setTimeout(() => firePackTrigger(t), 400);
  }

  // a few ambient villagers around the plaza from day one
  const villagers = [];
  for (let i = 0; i < 4; i++) {
    const a = (i / 4) * Math.PI * 2 + 0.5;
    villagers.push(npcSys.addNPC({
      id: 'amb-' + i,
      x: Math.cos(a) * 10, z: 95 + Math.sin(a) * 10,
      palette: { robe: VILLAGER_HUES[i], trim: 0x3c3428, skin: [0xd9a066, 0xb97f4e, 0x8a5a33, 0xd9b07c][i % 4] },
      hatKind: ['none', 'cap', 'brim', 'hood'][i % 4],
      wander: 8,
    }));
  }

  // ---------- compass tutorial (the Geography Isle beat) ----------
  function openCompass() {
    let step = 0; // 0..3 = asks
    UI.push({
      className: 'wh-fest-layer',
      html: '<div class="wh-fest-card wh-compass-card"></div>',
      dismissible: true,
      onClose() { Read.stop(); },
      onMount(el, { close }) { render(el.querySelector('.wh-compass-card'), close); },
    });

    function render(card, close) {
      const ask = COMPASS.asks[step];
      const askDir = COMPASS.dirs.find(d => d.id === ask);
      card.innerHTML = `
        <div class="wh-bridge-head"><b>The Compass</b>
          <span class="wh-bridge-sub">North, East, South, West — tap to hear, then answer</span>
          <button class="dlg-x" data-gui-close>CLOSE</button></div>
        <div class="wh-compass">
          ${COMPASS.dirs.map(d => `
            <button class="wh-cp wh-cp-${d.id}" data-d="${d.id}">
              <b>${d.id}</b><span>${esc(d.en)}</span>
              <span class="wh-cp-zh" lang="zh-Hans">${esc(d.zh)}</span>
              <span class="wh-cp-es" lang="es">${esc(d.es)}</span>
            </button>`).join('')}
          <div class="wh-cp-mid"></div>
        </div>
        <p class="wh-compass-ask">Tap <b>${esc(askDir.en).toUpperCase()}</b>
          <span lang="zh-Hans">${esc(askDir.zh)}</span> · <span lang="es">${esc(askDir.es)}</span>
          ${Read.buttonHTML(askDir.en, { lang: 'en-US', label: 'Hear the direction' })}</p>
        <div class="wh-story-nav"><span class="wh-fest-tip">Step ${step + 1} of ${COMPASS.asks.length} — wrong taps cost nothing</span></div>`;
      Read.speak(askDir.en, { lang: 'en-US', rate: 0.8 });
      card.querySelectorAll('.wh-cp').forEach(b => b.addEventListener('click', () => {
        if (b.dataset.d === ask) {
          Sfx.good();
          b.classList.add('done');
          step++;
          if (step >= COMPASS.asks.length) {
            S.compass = true;
            save();
            Sfx.questDone();
            particles.burst('confetti', player.pos.x, player.pos.y + 2, player.pos.z, 24);
            close();
            UI.banner('You know the compass', 'North, east, south, west — the world is yours to walk.');
            refreshHud();
            updateGoal();
          } else {
            setTimeout(() => render(card, close), 420);
          }
        } else {
          Sfx.bad();
          b.classList.remove('wobble'); void b.offsetWidth; b.classList.add('wobble');
          const d = COMPASS.dirs.find(x => x.id === b.dataset.d);
          Read.speak(`That is ${d.en}. Find ${askDir.en}.`, { lang: 'en-US', rate: 0.85 });
        }
      }));
    }
  }

  // ---------- island + town + festival stations ----------
  const islandStations = {};
  for (const region of def.regions) {
    const st = stations.list.find(s => s.id === region.id);
    if (!st) continue;
    islandStations[region.id] = st;
    st.sub = 'Word Isle';
    st.verb = 'Visit';
    st.onInteract = () => openIslandPanel(region.id);
    // re-bake the floating label (the engine baked "Learning station" at boot)
    if (st.labelSprite && st.labelSprite.parent) {
      const fresh = makeLabel(region.name, 'Word Isle', '#' + region.color.toString(16).padStart(6, '0'));
      fresh.position.copy(st.labelSprite.position);
      fresh.material.opacity = 0;
      st.labelSprite.parent.add(fresh);
      st.labelSprite.parent.remove(st.labelSprite);
      st.labelSprite = fresh;
    }
  }

  function openIslandPanel(id) {
    const isl = ISLANDS.find(i => i.id === id);
    const terms = islandTerms[id] || [];
    const got = terms.filter(en => S.gems[en]).length;
    const story = STORIES.find(s => s.island === id);
    UI.push({
      className: 'wh-build-layer',
      html: `<div class="wh-build-card">
        <div class="wh-bridge-head"><b>${esc(isl.name)}</b>
          <span class="wh-bridge-sub">Word Isle</span>
          <button class="dlg-x" data-gui-close>CLOSE</button></div>
        <p class="wh-build-blurb">${esc(isl.blurb)}</p>
        <p class="wh-build-progress">Word-gems found here: <b>${got}</b> / ${terms.length}</p>
        ${story ? `<p class="wh-build-hint">${S.stories[story.id] ? 'You heard the story of ' : 'Find '} <b>${esc(story.npc)}</b>${S.stories[story.id] ? '.' : ' and hear the story.'}</p>` : ''}
        <div class="wh-story-nav">
          ${isl.tutorial ? `<button class="wh-btn wh-open-compass">${S.compass ? 'COMPASS — PLAY AGAIN' : 'COMPASS LESSON'}</button>` : ''}
        </div>
      </div>`,
      dismissible: true,
      onMount(el, { close }) {
        const b = el.querySelector('.wh-open-compass');
        if (b) b.addEventListener('click', () => { close(); openCompass(); });
      },
    });
  }

  // town hall
  {
    const st = stations.list.find(s => s.id === 'town');
    if (st) { st.verb = 'Open'; st.onInteract = openTownPanel; }
  }
  function openTownPanel() {
    const builtN = Object.keys(S.builds).length;
    UI.push({
      className: 'wh-build-layer',
      html: `<div class="wh-build-card wh-town-card">
        <div class="wh-bridge-head"><b>Harbor Town</b>
          <span class="wh-bridge-sub">${builtN} of ${BUILDINGS.length} buildings standing</span>
          <button class="dlg-x" data-gui-close>CLOSE</button></div>
        <div class="wh-town-rows">
          ${BUILDINGS.map(b => {
            const built = !!S.builds[b.id];
            const have = catCount(b.cat);
            return `<button class="wh-town-row ${built ? 'built' : ''}" data-b="${b.id}">
              <span class="wh-town-dot" style="background:#${b.color.toString(16).padStart(6, '0')}"></span>
              <b>${esc(b.name)}</b>
              <span>${built ? 'BUILT' : `${have}/${b.cost} words`}</span>
            </button>`;
          }).join('')}
        </div>
        <p class="wh-build-hint">Tap a building to see it — the beacon will guide you to its plot.</p>
      </div>`,
      dismissible: true,
      onMount(el, { close }) {
        el.querySelectorAll('.wh-town-row').forEach(r => r.addEventListener('click', () => {
          const b = BUILDINGS.find(x => x.id === r.dataset.b);
          Sfx.click();
          const y = field.height(b.plot[0], b.plot[1]);
          stations.setBeacon({ pos: new THREE.Vector3(b.plot[0], y, b.plot[1]) });
          close();
        }));
      },
    });
  }

  // festival lawn
  let bank = null;
  {
    const st = stations.list.find(s => s.id === 'festival');
    if (st) { st.verb = 'Join'; st.onInteract = openFestivalMenu; }
  }
  function townDone() {
    return Object.keys(S.builds).length >= BUILDINGS.length &&
           Object.keys(S.bridges).length >= BRIDGES.length;
  }
  function collectedTerms() {
    const out = [];
    for (const en in S.gems) if (termMap[en]) out.push(termMap[en]);
    return out;
  }
  function listenPool() {
    const got = collectedTerms();
    if (got.length >= 8) return got;
    // early game: borrow easy geography words so the stall always works
    const fill = (islandTerms['wh-geo'] || []).concat(islandTerms.home || []).map(en => termMap[en]);
    return got.concat(fill).slice(0, 24);
  }
  function openFestivalMenu() {
    const done = townDone();
    const need = (BUILDINGS.length - Object.keys(S.builds).length) + (BRIDGES.length - Object.keys(S.bridges).length);
    UI.push({
      className: 'wh-build-layer',
      html: `<div class="wh-build-card wh-fest-menu">
        <div class="wh-bridge-head"><b>Festival Lawn</b>
          <span class="wh-bridge-sub">Gentle games — no timers, no fail, play forever</span>
          <button class="dlg-x" data-gui-close>CLOSE</button></div>
        <div class="wh-town-rows">
          <button class="wh-town-row" data-g="match"><b>Picture Match</b><span>match words to pictures</span></button>
          <button class="wh-town-row" data-g="sort"><b>Word Sort</b><span>sort words into families</span></button>
          <button class="wh-town-row" data-g="listen"><b>Listen and Find</b><span>hear a word, tap its gem</span></button>
          <button class="wh-town-row" data-g="lanterns"><b>Question Lanterns</b><span>light lanterns with answers</span></button>
          <button class="wh-town-row wh-tt-row ${done ? '' : 'locked'}" data-g="tt">
            <b>Time Travel Festival</b>
            <span>${done ? (S.won ? 'visit again any time' : 'THE BIG DAY — your town is ready') : `finish the town first — ${need} to go`}</span>
          </button>
        </div>
      </div>`,
      dismissible: true,
      onMount(el, { close }) {
        el.querySelectorAll('.wh-town-row').forEach(r => r.addEventListener('click', async () => {
          const g = r.dataset.g;
          Sfx.click();
          const played = kind => { S.played[kind] = (S.played[kind] || 0) + 1; save(); refreshHud(); updateGoal(); };
          if (g === 'match') { close(); openPictureMatch({ getTerm: en => termMap[en], onPlayed: played }); }
          if (g === 'sort') { close(); openWordSort({ onPlayed: played }); }
          if (g === 'listen') { close(); openListenFind({ pool: listenPool(), onPlayed: played }); }
          if (g === 'lanterns') {
            if (!bank) { try { bank = await loadBank('global9'); } catch (e) { Panels.toast('The lanterns are resting — try again.'); return; } }
            close();
            openLanterns({ bank, onPlayed: played });
          }
          if (g === 'tt') {
            if (!townDone()) { Sfx.denied(); Panels.toast('The Time Travel Festival opens when every bridge and building is done.'); return; }
            close();
            openTimeTravel({
              sentences: S.sentences,
              onDone() {
                if (!S.won) {
                  S.won = true;
                  save();
                  Sfx.eraUnlock();
                  UI.banner('WORD HARBOR IS HOME', 'You arrived with a boat and built a town out of words. It is yours forever.', 6000);
                  particles.burst('confetti', player.pos.x, player.pos.y + 2, player.pos.z, 40);
                  refreshHud();
                  updateGoal();
                }
              },
            });
          }
        }));
      },
    });
  }

  // ---------- HUD ----------
  const bar = document.createElement('div');
  bar.id = 'wh-bar';
  bar.innerHTML = `
    <div class="tb-block wh-words" title="Word-gems collected — they are never lost">
      <span class="wh-gem-dot"></span><b id="wh-nwords">0</b><span class="tb-lab">WORDS</span>
    </div>
    <div class="tb-block" title="Sentence-bridges built"><span class="tb-lab">BRIDGES</span> <b id="wh-nbridges">0/7</b></div>
    <div class="tb-block" title="Town buildings raised"><span class="tb-lab">TOWN</span> <b id="wh-nbuilds">0/9</b></div>
    <div class="tb-block wh-light-block" title="How much of the harbor is lit — the Quiet recedes as you play">
      <span class="tb-lab">LIGHT</span>
      <span class="wh-light-track"><span id="wh-light-fill" class="wh-light-fill"></span></span>
    </div>
    <button id="wh-book" class="tb-btn">BOOK</button>
    <button id="wh-journal" class="tb-btn">JOURNAL</button>
    <button id="wh-town" class="tb-btn">TOWN</button>
  `;
  document.body.appendChild(bar);
  // namespaced inline styles for the new story bits (we may NOT edit game.css).
  if (!document.getElementById('wh-story-style')) {
    const styleEl = document.createElement('style');
    styleEl.id = 'wh-story-style';
    styleEl.textContent = `
      #wh-bar .wh-light-block { gap: 6px; }
      #wh-bar .wh-light-track { display:inline-block; width:64px; height:9px; border-radius:6px;
        background: rgba(20,22,30,0.55); overflow:hidden; vertical-align:middle; }
      #wh-bar .wh-light-fill { display:block; height:100%; width:0%;
        background: linear-gradient(90deg,#ffcf7a,#ffe6b0); transition: width 0.6s ease; }
      .wh-keystone-card .wh-ks-pic { width:100%; max-width:360px; aspect-ratio: 5/3; margin: 0 auto 10px; display:block; border-radius:10px; }
      .wh-ks-choices { display:flex; flex-direction:column; gap:10px; margin: 6px 0 4px; }
      .wh-ks-choice { display:flex; align-items:center; gap:12px; text-align:left;
        padding:10px 12px; border-radius:12px; cursor:pointer; font-size:16px; line-height:1.3;
        background: rgba(255,255,255,0.06); border:2px solid rgba(255,210,130,0.35); color: inherit; }
      .wh-ks-choice:hover { background: rgba(255,210,130,0.14); }
      .wh-ks-thumb { width:54px; height:40px; flex:0 0 auto; border-radius:8px; }
      .wh-ks-choice span { flex:1 1 auto; }
      #wh-goal .qt-quiet { display:block; margin-top:3px; font-size:12px; opacity:0.78; font-style:italic; }
    `;
    document.head.appendChild(styleEl);
  }
  const tracker = document.createElement('button');
  tracker.id = 'wh-goal';
  document.body.appendChild(tracker);
  tracker.addEventListener('click', () => { Sfx.click(); updateGoal(true); });

  const builtCats = () => new Set(BUILDINGS.filter(b => S.builds[b.id]).map(b => b.cat));
  function openWordBook() {
    openBook({
      data: gloss, state: S, builtCats: builtCats(),
      islandOf: en => islandName(islandOfTerm[en]),
      counts: { total: Object.keys(termMap).length, got: wordCount() },
    });
  }
  bar.querySelector('#wh-book').addEventListener('click', () => { Sfx.click(); openWordBook(); });
  bar.querySelector('#wh-town').addEventListener('click', () => { Sfx.click(); openTownPanel(); });
  // JOURNAL — the Field Journal (Codex): the turning points you have understood
  // across the harbor, fed by every keystone (Bula + every pack). A small
  // "Achievements" link in the codex panel opens the milestones panel. Both are
  // the shared spine; codex.open()/ach.open() inject their own scoped CSS.
  bar.querySelector('#wh-journal').addEventListener('click', () => { Sfx.click(); openJournalPanel(); });
  function openJournalPanel() {
    codex.open();
    // graft a tiny "Achievements" affordance onto the codex head (no game.css edit)
    requestAnimationFrame(() => {
      const head = document.querySelector('.gui-codex .cdx-head');
      if (head && !head.querySelector('.wh-ach-link')) {
        const btn = document.createElement('button');
        btn.className = 'wh-ach-link';
        btn.type = 'button';
        btn.textContent = 'ACHIEVEMENTS';
        btn.style.cssText = 'margin-right:8px;background:rgba(255,209,102,0.12);color:#ffd166;border:1px solid rgba(255,210,130,0.4);border-radius:8px;padding:6px 10px;font:700 11px system-ui;letter-spacing:0.06em;cursor:pointer;';
        btn.addEventListener('click', () => { Sfx.click(); ach.open(); });
        head.insertBefore(btn, head.querySelector('.dlg-x'));
      }
    });
  }
  window.addEventListener('keydown', (e) => {
    if (e.target.tagName === 'TEXTAREA' || e.target.tagName === 'INPUT') return;
    if (e.code === 'KeyB') { e.stopImmediatePropagation(); openWordBook(); }
    if (e.code === 'KeyJ') { e.stopImmediatePropagation(); openJournalPanel(); }
  }, true);

  function refreshHud() {
    bar.querySelector('#wh-nwords').textContent = wordCount();
    bar.querySelector('#wh-nbridges').textContent = `${Object.keys(S.bridges).length}/${BRIDGES.length}`;
    bar.querySelector('#wh-nbuilds').textContent = `${Object.keys(S.builds).length}/${BUILDINGS.length}`;
    const fill = bar.querySelector('#wh-light-fill');
    if (fill) fill.style.width = Math.max(6, townLight()) + '%';
  }

  // ---------- goals (the gentle quest line, framed as the arrival story) ----
  function nextGoal() {
    // the story opens with Mira, the lamplighter who hands you your first word
    if (!story.is('firstWord')) return { text: 'Talk to Mira, the lamplighter', at: MIRA.npcPos };
    if (wordCount() < 3) {
      const g = active.find(r => r.islandId === 'home') || active[0];
      return { text: 'Collect 3 word-gems on the beach — light the Quiet', at: g ? [g.x, g.z] : [0, 110] };
    }
    if (!S.stories['st-arrive']) return { text: 'Hear the Harbor Guide\'s welcome', at: [4, 112] };
    // the gentle keystone: help Bula find water with the right word
    if (!S.helped[KEYSTONE.id]) return { text: 'Help Bula by the well — give the right word', at: KEYSTONE.npcPos };
    if (!S.bridges['br-geo']) return { text: 'Build the Compass Bridge (north shore)', at: [0, 21] };
    if (!S.compass) return { text: 'Take the compass lesson on Geography Isle', at: [0, -38] };
    if (!S.stories['st-geo']) return { text: 'Talk to the Mapmaker on Geography Isle', at: [6, -32] };
    const nb = BRIDGES.find(b => !S.bridges[b.id]);
    if (nb) return { text: `Build the ${nb.name} — ${Object.keys(S.bridges).length} of ${BRIDGES.length} bridges`, at: [(nb.a[0] + nb.b[0]) / 2, (nb.a[1] + nb.b[1]) / 2] };
    const nbuild = BUILDINGS.find(b => !S.builds[b.id]);
    if (nbuild) return { text: `Raise the ${nbuild.name} — ${Object.keys(S.builds).length} of ${BUILDINGS.length} buildings`, at: nbuild.plot };
    if (!S.won) return { text: 'Your town is ready — join the Time Travel Festival', at: [30, 112] };
    return { text: `Home. ${wordCount()} of ${Object.keys(termMap).length} words found — keep exploring`, at: null };
  }

  function updateGoal(announce = false) {
    const g = nextGoal();
    tracker.innerHTML = `<span class="qt-name">NEXT</span><span class="qt-obj">${esc(g.text)}</span>` +
      `<span class="qt-quiet">${esc(quietLine())}</span>`;
    if (g.at) {
      const y = field.height(g.at[0], g.at[1]);
      stations.setBeacon({ pos: new THREE.Vector3(g.at[0], Math.max(y, 0.4), g.at[1]) });
    } else {
      stations.setBeacon(null);
    }
    if (announce) Panels.toast(g.text);
  }

  function checkTown() {
    if (townDone() && !S.flags.ttToast) {
      S.flags.ttToast = true;
      save();
      UI.banner('The town is complete', 'The Time Travel Festival is ready on the Festival Lawn.');
    }
  }

  // ---------- panels coexistence ----------
  Panels.setHandlers({
    onOpen() { api.setPaused(true); },
    onClose() {
      if (!UI.isOpen()) api.setPaused(false);
      stations.refreshVisuals();
      updateGoal();
    },
    onStationCleared() { stations.refreshVisuals(); updateGoal(); },
    chime: Audio.chime,
  });

  // ---------- frame loop ----------
  let stepT = 0, saveT = 0, waveT = 0, labelT = 0;
  api.onFrame((dt, t) => {
    npcSys.update(dt, t, player.pos);
    particles.update(dt);

    // word-gems bob and spin (one instanced upload per frame)
    for (const r of active) {
      const bob = Math.sin(t * 1.8 + r.phase) * 0.25;
      dummy.position.set(r.x, r.y + bob, r.z);
      dummy.rotation.set(0, t * 0.9 + r.phase, 0);
      dummy.scale.setScalar(1);
      dummy.updateMatrix();
      gems.setMatrixAt(r.slot, dummy.matrix);
    }
    gems.instanceMatrix.needsUpdate = true;

    // Mira's lamp + Bula's marker bob gently (skip alternate frames on mobile)
    if (!isMobile || (t % 0.1 < 0.05)) {
      if (miraLamp) { miraLamp.position.y = 2.4 + Math.sin(t * 1.6) * 0.12; miraLamp.rotation.y = t * 0.8; }
      if (bulaMarker && !S.helped[KEYSTONE.id]) {
        bulaMarker.visible = true;
        bulaMarker.position.y = 2.2 + Math.sin(t * 2.2) * 0.1;
        bulaMarker.rotation.y = t * 1.2;
      } else if (bulaMarker) { bulaMarker.visible = false; }
      // pack-NPC keystone markers bob the same gentle way
      for (const lp of loadedPacks) {
        for (const r of lp.npcRecs) {
          if (r.marker && r.marker.visible) {
            r.marker.position.y = 2.2 + Math.sin(t * 2.2 + 0.6) * 0.1;
            r.marker.rotation.y = t * 1.2;
          }
        }
      }
    }

    // villagers wave when you come close (the talk gesture doubles as a wave)
    waveT -= dt;
    if (waveT <= 0) {
      waveT = 0.3;
      for (const n of npcSys.npcs) {
        const dx = player.pos.x - n.group.position.x;
        const dz = player.pos.z - n.group.position.z;
        n.talking = (dx * dx + dz * dz) < 49;
      }
      // pack triggers: detect first entry onto each island (for on:'visit')
      checkPackVisits();
    }

    // building name-labels show only as you approach (less clutter, and each
    // sprite is a draw call — a finished town keeps only the nearest few)
    labelT -= dt;
    if (labelT <= 0) {
      labelT = 0.4;
      for (const id in buildMeshes) {
        const rec = buildMeshes[id];
        if (!rec.label) continue;
        const dx = player.pos.x - rec.label.position.x;
        const dz = player.pos.z - rec.label.position.z;
        rec.label.visible = (dx * dx + dz * dz) < 30 * 30;
      }
    }

    // soft footsteps
    if (!api.isPaused() && player.grounded && player.speedNow > 1.2) {
      stepT -= dt * player.speedNow;
      if (stepT <= 0) { stepT = 3.6; Sfx.footstep(false); }
    }

    saveT -= dt;
    if (saveT <= 0) {
      saveT = 5;
      S.pos = [Math.round(player.pos.x * 10) / 10, Math.round(player.pos.z * 10) / 10];
      save();
    }
  });

  // ---------- boot ----------
  refillAll();
  refreshHud();
  updateGoal();
  if (S.pos) player.teleport(S.pos[0], S.pos[1]);
  Sfx.startAmbient();

  // ---------- cold open ----------
  // New Game opens on the arrival story, not a menu card: the boat reaches the
  // warm island at dusk, the half-built quiet town, and Mira the lamplighter
  // handing you your first word. The story begins (chapter 1); Mira's prompt
  // waits at the plaza. Gentle by design — short lines, dusk tint, her portrait.
  if (!S.flags.intro) {
    S.flags.intro = true;
    if (story.chapter < 1) story.chapter = 1;
    save();
    refreshHud(); // the LIGHT meter appears now, near-empty, ready to climb
    const controlsBeat = {
      tint: 'amber', kicker: 'Your new home',
      text: (isMobile
        ? 'Left stick to move, drag to look, TAP a glowing word to act. No timers, nothing to lose. Find Mira at the plaza.'
        : 'WASD to move, mouse to look, E to collect and talk. B — word book. No timers, nothing to lose. Find Mira at the plaza.'),
      cta: 'Step onto the dock',
    };
    playCutscene([...COLD_OPEN, controlsBeat]);
  }

  // ---------- debug / verification hook ----------
  const game = {
    S, gloss, active, termMap, islandOfTerm, story, codex, ach,
    collect, openCompass, openFestivalMenu, openTownPanel, openWordBook, openBuildPanel,
    bridges: BRIDGES, buildings: BUILDINGS, packs: loadedPacks,
    townLight, quietLine, lightLamp,
    save: () => save(),
    debug: {
      gems: () => active.map(r => ({ en: r.en, isle: r.islandId, x: +r.x.toFixed(1), z: +r.z.toFixed(1) })),
      grab(en) { collect(en); },
      talkMira() { if (miraNpc) openDialogue(miraNpc, MIRA.dialogue, dialogueCtx()); },
      helpBula() { openKeystone(); },
      coldOpen() { story.chapter = 1; playCutscene([...COLD_OPEN, { tint: 'amber', text: 'Step onto the dock.', cta: 'Begin' }]); },
      grantCat(cat, n = 8) {
        const c = gloss.categories.find(x => x.name === cat);
        c.terms.slice(0, n).forEach(t => { S.gems[t.en] = 1; });
        save(); refreshHud(); updateGoal();
      },
      bridge(id) {
        const br = BRIDGES.find(b => b.id === id);
        S.bridges[id] = 1;
        const s = br.words.join(' ') + '.';
        if (!S.sentences.includes(s)) S.sentences.push(s);
        save(); placeBridge(br); refreshHud(); updateGoal(); checkTown();
      },
      build(id) {
        const b = BUILDINGS.find(x => x.id === id);
        S.builds[id] = 1;
        save(); placeBuilding(b, BUILDINGS.indexOf(b)); refreshHud(); updateGoal(); checkTown();
      },
      goto(x, z) { player.teleport(x, z); },
      // ---- story-pack system verification ----
      // list every loaded pack with its NPCs + keystone ids
      packs() {
        return loadedPacks.map(lp => ({
          id: lp.id, unit: lp.unit, title: lp.title,
          npcs: lp.npcRecs.map(r => r.spec.id),
          keystones: lp.npcRecs.filter(r => r.keystoneId).map(r => r.keystoneId),
        }));
      },
      // open a pack's keystone overlay by id (the same one the NPC opens)
      keystone(id) {
        const rec = packKeystones[id];
        if (!rec) { console.warn('no such pack keystone:', id, '— have:', Object.keys(packKeystones)); return false; }
        openPackKeystone(rec.pack, rec.ks); return true;
      },
      // teleport to a pack NPC (so you can see its marker + walk up to it)
      gotoNpc(npcId) {
        for (const lp of loadedPacks) {
          const r = lp.npcRecs.find(x => x.spec.id === npcId);
          if (r) { player.teleport(r.npc.group.position.x, r.npc.group.position.z + 4); return true; }
        }
        return false;
      },
      // force-fire a pack cutscene by pack id + cutscene key (ignores the gate)
      packCutscene(packId, key) {
        const lp = loadedPacks.find(x => x.id === packId);
        if (!lp) { console.warn('no such pack:', packId); return false; }
        return playPackCutscene(lp.pack, key);
      },
      codex() { codex.open(); },
      achievements() { ach.open(); },
      codexEntries() { return codex.entries(); },
      reset() { store.reset(); location.reload(); },
    },
  };
  window.WH = game;
  return game;
}
