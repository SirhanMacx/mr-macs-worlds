// trade-winds.js — world definition for "The Trade Winds World" (Global History 9).
// One continuous procedural landmass whose regions echo the year's units:
// NW origin foothills → a great river delta (River Worlds) → an eastern belief
// crossroads → a Mediterranean classical coast → a southern dune sea with a
// caravan oasis → a NE steppe with a domed citadel (postclassical) → a walled
// Renaissance hill town → a SW harbor of encounters.
//
// Seed 20270623 = the Global Regents date (June 23, 2027). Same seed, same world.
// Everything here is pure math — no three.js — so the 2D hub can draw the real map.

import { makeFbm, makeRidged, makeNoise2D } from '../core/noise.js';
import { subSeed } from '../core/prng.js';
import {
  clamp, lerp, smoothstep, radialMask, ellipseMask,
  makePolylineDist, rgb, mix3, scale3,
} from '../core/field-utils.js';

const SEED = 20270623;

// ---------------- layout ----------------
const PATHS = [
  [[0, 64], [0, 24], [0, -12]],                       // spawn → Hall of Issues
  [[0, -12], [-34, -40], [-64, -64]],                 // → Renaissance town
  [[-64, -64], [-120, -104], [-170, -140]],           // → Origins foothills
  [[0, -12], [70, -30], [140, -44]],                  // → Steppe citadel
  [[140, -44], [148, -90], [150, -122]],              // citadel → River delta
  [[140, -44], [176, -10], [205, 25]],                // citadel → Belief crossroads
  [[205, 25], [120, 110], [40, 196]],                 // belief → Oasis
  [[0, 64], [20, 130], [40, 196]],                    // spawn → Oasis
  [[0, 64], [-80, 76], [-150, 86]],                   // spawn → Grand Stoa
  [[-150, 86], [-186, 58], [-212, 30]],               // stoa → Classical coast
  [[-150, 86], [-126, 140], [-96, 186]],              // stoa → Document Lab
  [[-96, 186], [-124, 180], [-150, 172]],             // lab → Harbor
  [[0, 64], [0, 96]],                                 // spawn → Wayfarer's Gate
];

const RIVER = [
  [-20, -195], [40, -180], [90, -165], [140, -150], [180, -140], [230, -135], [285, -142],
];

export const def = {
  key: 'global9',
  world: 'trade-winds',
  title: 'The Trade Winds World',
  subtitle: 'Global History 9 — 9R & ENL — walk the year from the first villages to the first global age.',
  // ENL support: in-world trilingual glossary (EN · 中文 + pinyin · Español)
  glossary: './data/enl-glossary-global9.json',
  // Wave 1+2: the full TRADE WINDS game layer (see docs/GAME_DESIGN.md)
  game: './game/worlds/trade-winds/game.js',
  seed: SEED,
  size: 640,
  sea: 0,
  boundR: 296,
  boundsMsg: 'Open water ahead — the trade winds blow you back to shore.',
  spawn: [0, 64],
  spawnYaw: 0, // facing -z (north), toward the Hall of Issues

  sky: {
    zenithDay: 0x3f74b5, horizonDay: 0xdfe7d9, fogDay: 0xc9d8d6,
    zenithDusk: 0x35518f, horizonDusk: 0xf2c98e, fogDusk: 0xd9c4a8,
    sunColor: 0xfff2da, cycleSec: 660, sunAzim: 2.05, sunElev: [0.38, 0.72],
    // graphics overhaul: additive night-phase mood (medium+ night cycle; sky.js
    // derives these if absent, so these are optional polish, never required).
    // A warm-Mediterranean night — deep indigo zenith, sandstone-warm horizon.
    nightZenith: 0x0b1736, nightHorizon: 0x24304f, fogNight: 0x141e34, moonColor: 0xc7d2ee,
  },
  // GRAPHICS OVERHAUL (D1, free on every tier): the old high-key fill (hemiI .85)
  // washed shadows flat so nothing read dimensional. Split a WARM key sun (raised
  // to 2.05, pushed amber) against a deeper, cooler, dimmer sky fill (hemiI .56,
  // cooler hemiSky / warmer-earth hemiGround) so Trade Winds grass and dunes get
  // real form + warm/cool separation. `exposure` + `grade` are read by the engine
  // for the low-tier in-material warm tone (no composer). All pure constants.
  light: {
    hemiSky: 0xb9d4ff, hemiGround: 0x9c7a4a, hemiI: 0.56, sun: 0xffe7b8, sunI: 2.05,
    exposure: 1.12, grade: { warm: 0.06, cool: 0.05, contrast: 1.05, sat: 1.07 },
  },
  water: { deep: 0x1f5a72, shallow: 0x46a3b0, opacity: 0.84, waveAmp: 0.16 },
  fogDensity: 0.0046,
  avatar: { jacket: 0x33658a, pants: 0x4a4339, skin: 0xd9a066, hat: 0xc9a36b, pack: 0x8a5a33 },

  // ---------------- learning layer ----------------
  // Region topics use exact bank topic strings (data/global9-bank.json).
  regions: [
    {
      id: 'g9-origins', nodeId: 'g9-origins', name: 'Origins Foothills',
      center: [-170, -140], r: 60, stationKind: 'stones', color: 0xf59e0b,
      topics: ['Early Humans', 'Farming Revolution', 'Early Worlds'],
    },
    {
      id: 'g9-rivers', nodeId: 'g9-rivers', name: 'River Delta',
      center: [150, -122], r: 55, stationKind: 'ziggurat', color: 0xfbbf24,
      topics: ['Mesopotamia', 'Egypt + Indus', 'Shang China'],
    },
    {
      id: 'g9-belief', nodeId: 'g9-belief', name: 'Belief Crossroads',
      center: [205, 25], r: 55, stationKind: 'shrine', color: 0xfb923c,
      topics: ['Hinduism', 'Buddhism', 'Judaism + Christianity', 'Islam', 'Chinese Philosophies', 'Belief + Rule'],
    },
    {
      id: 'g9-classical', nodeId: 'g9-classical', name: 'Classical Coast',
      center: [-212, 30], r: 60, stationKind: 'temple', color: 0xf97316,
      topics: ['Greek City-States', 'Alexander + Hellenism', 'Roman Republic + Empire', 'India + China', 'Maya + Decline', 'Classical + Trade'],
    },
    {
      id: 'g9-silkroad', nodeId: 'g9-silkroad', name: 'Oasis Caravanserai',
      center: [40, 196], r: 60, stationKind: 'caravanserai', color: 0xeab308,
      topics: ['Silk Roads', 'Indian Ocean', 'Trans-Saharan Trade', 'African Trade Cities', 'Disease + Mongols'],
    },
    {
      id: 'g9-postclassical', nodeId: 'g9-postclassical', name: 'Steppe Citadel',
      center: [140, -44], r: 60, stationKind: 'citadel', color: 0xea580c,
      topics: ['Byzantine Empire', 'Medieval Europe', 'Islamic Golden Age', 'Tang + Song China', 'Mongols + Japan', 'Islam + South Asia', 'Christian Schisms + Crusades', 'Black Death', 'Plague Effects', 'Conflict + Exchange'],
    },
    {
      id: 'g9-renaissance', nodeId: 'g9-renaissance', name: 'Renaissance Hill Town',
      center: [-64, -64], r: 55, stationKind: 'walledTown', color: 0xf43f5e,
      topics: ['Renaissance', 'Reformation', 'Religious Wars', 'Absolute Monarchs', 'Scientific + Enlightenment Thinkers', 'Empires + States'],
    },
    {
      id: 'g9-encounters', nodeId: 'g9-encounters', name: 'Harbor of Encounters',
      center: [-150, 172], r: 60, stationKind: 'harbor', color: 0x22d3ee,
      topics: ['Ottoman Conquest', 'Ottoman Government', 'Ming China', 'Foreign Contact', 'Isolation + Tribute', 'West + East Africa', 'African Beliefs', 'Aztec Empire', 'Inca Empire', 'Pre-Columbian Culture', 'Navigation', 'Exploration', 'Columbian Exchange', 'Conquest', 'Atlantic Labor', 'Early Modern Change'],
    },
  ],

  skills: [
    { id: 'mcq', kind: 'mcq', stationKind: 'stoa', pos: [-150, 86], label: 'Stimulus MCQ Hall', sub: 'The Grand Stoa', color: 0xfbbf24, perRound: 12 },
    { id: 'crq', kind: 'crq', stationKind: 'archive', pos: [-96, 186], label: 'Document Lab', sub: 'CRQ Scriptorium', color: 0xf97316 },
    { id: 'ei', kind: 'ei', stationKind: 'forum', pos: [0, -12], label: 'Hall of Enduring Issues', sub: 'Six stones, one essay', color: 0xef4444 },
    { id: 'hub', kind: 'hub', stationKind: 'gateway', pos: [0, 96], label: "Wayfarer's Gate", sub: 'Back to the hub', color: 0xffd27f },
  ],

  // suggested progression for the beacon + quest log
  order: ['g9-origins', 'g9-rivers', 'g9-belief', 'g9-classical', 'g9-silkroad', 'g9-postclassical', 'g9-renaissance', 'g9-encounters', 'mcq', 'crq', 'ei'],

  paths: PATHS,
  river: RIVER,

  // ---------------- flora ----------------
  // test(p) gets a field probe {h, slope, desert, steppe, delta, med, path, riverD, oasisD}
  flora: [
    { kind: 'cypress', count: 130, scale: [0.9, 1.5], test: p => p.med * (p.h > 1.2 && p.h < 22 && p.slope < 0.5 ? 0.8 : 0) },
    { kind: 'treeRound', count: 240, scale: [0.8, 1.5], test: p => p.med * (p.h > 1 && p.h < 20 && p.slope < 0.45 ? 0.7 : 0) },
    { kind: 'treeFlat', count: 110, scale: [0.9, 1.6], test: p => Math.max(p.steppe, p.origins) * (p.h > 1 && p.h < 16 && p.slope < 0.4 ? 0.6 : 0) },
    { kind: 'palm', count: 90, scale: [0.85, 1.3], test: p => ((p.oasisD < 26 ? 1 : 0) + (p.desert < 0.3 && p.h > 0.6 && p.h < 3 ? 0.5 : 0) + (p.riverD < 18 && p.h > 0.5 && p.h < 4 ? 0.5 : 0)) * (p.slope < 0.4 ? 1 : 0) },
    { kind: 'rock', count: 200, scale: [0.5, 1.8], test: p => (p.h > 0.8 && p.slope < 0.85 ? 0.35 + p.mtn * 0.65 : 0) },
    { kind: 'bush', count: 150, scale: [0.6, 1.2], test: p => (p.h > 0.8 && p.h < 18 && p.slope < 0.5 ? 0.35 : 0) * (1 - p.desert * 0.8) },
    { kind: 'grassTuft', count: 460, scale: [0.7, 1.4], mobileSkip: true, test: p => Math.max(p.med, p.steppe) * (p.h > 0.8 && p.h < 14 && p.slope < 0.4 ? 0.8 : 0) },
    { kind: 'reed', count: 130, scale: [0.8, 1.4], test: p => (p.h > 0.15 && p.h < 1.1 && p.slope < 0.35 ? 0.9 : 0) },
  ],

  // ---------------- the field ----------------
  buildField() {
    const base = makeFbm(subSeed(SEED, 'base'), { octaves: 4, freq: 1 / 210, gain: 0.5 });
    const hill = makeFbm(subSeed(SEED, 'hill'), { octaves: 5, freq: 1 / 58, gain: 0.5 });
    const ridge = makeRidged(subSeed(SEED, 'ridge'), { octaves: 4, freq: 1 / 135 });
    const dune = makeRidged(subSeed(SEED, 'dune'), { octaves: 3, freq: 1 / 26 });
    const warp = makeFbm(subSeed(SEED, 'warp'), { octaves: 3, freq: 1 / 92, gain: 0.55 });
    const moist = makeFbm(subSeed(SEED, 'moist'), { octaves: 3, freq: 1 / 74 });
    const varn = makeNoise2D(subSeed(SEED, 'var'));

    const pathD = makePolylineDist(PATHS);
    const riverD = makePolylineDist([RIVER]);
    const max0 = v => (v > 0 ? v : 0);

    function masks(x, z) {
      const cont = smoothstep(302, 232, Math.hypot(x, z));
      const mtn = ellipseMask(x, z, -30, -192, 170, 62, -0.16) * cont;
      const desert = smoothstep(98, 152, z) * cont;
      const steppe = ellipseMask(x, z, 152, -58, 125, 88, 0.15) * cont * (1 - mtn);
      const delta = radialMask(x, z, 165, -148, 95) * cont;
      const origins = radialMask(x, z, -170, -140, 110) * cont;
      return { cont, mtn, desert, steppe, delta, origins };
    }

    // -- raw height (before station flattening) --
    function raw(x, z) {
      const wAmt = 26;
      const wx = x + warp(x + 311, z - 97) * wAmt;
      const wz = z + warp(x - 588, z + 233) * wAmt;
      const m = masks(x, z);

      const pd = pathD(x, z);
      const pathM = 1 - smoothstep(2.4, 7.5, pd);
      const det = 1 - 0.72 * pathM; // roads shave the bumps

      let h = -9 + m.cont * 12 + base(wx, wz) * 6.5 * m.cont;
      h += ridge(wx, wz) * 44 * m.mtn;                                  // northern range
      h += max0(hill(wx, wz)) * 8.5 * m.origins * det;                  // foothills
      h += hill(wx, wz) * 2.6 * m.cont * det;                           // rolling detail

      // southern dune sea (ridges stretched east-west)
      const duneH = 2.3 + dune(wx * 0.45, wz * 1.25) * 3.6 * det + base(wx, wz) * 1.4;
      h = lerp(h, duneH, m.desert * 0.82);

      // eastern steppe: long low waves
      h = lerp(h, 2.6 + hill(wx, wz) * 2.1 * det, m.steppe * 0.66);

      // delta lowland
      h = lerp(h, 1.5 + max0(hill(wx, wz)) * 1.1 * det, m.delta * 0.85);

      // the great river (carved below sea level so the water plane fills it)
      const rd = riverD(x + warp(x, z) * 9, z + warp(z, x) * 9);
      h = lerp(h, Math.min(h, -2.6), 1 - smoothstep(4, 13, rd));

      // harbor bay + oasis pond
      h = lerp(h, -3.5, radialMask(x, z, -176, 224, 66) * 0.92);
      h = lerp(h, -1.6, radialMask(x, z, 40, 208, 15, 0.3));

      // roads are causeways — never submerged
      h = lerp(h, Math.max(h, 1.1), pathM);

      // hand-set hills: classical acropolis, renaissance town, hall of issues, citadel mound
      h = plateau(h, x, z, -212, 30, 38, 10);
      h = plateau(h, x, z, -64, -64, 42, 13);
      h = plateau(h, x, z, 0, -12, 32, 8);
      h = plateau(h, x, z, 140, -44, 32, 6);
      return h;
    }

    function plateau(h, x, z, cx, cz, r, top) {
      const m = radialMask(x, z, cx, cz, r, 0.4);
      return lerp(h, top + (h - top) * 0.15, m);
    }

    // -- station flats (two-phase: measure raw, then pull terrain to it) --
    const flats = [];
    for (const r of def.regions) flats.push({ x: r.center[0], z: r.center[1], r: r.stationKind === 'walledTown' || r.stationKind === 'temple' ? 20 : 14 });
    for (const s of def.skills) flats.push({ x: s.pos[0], z: s.pos[1], r: s.stationKind === 'stoa' ? 18 : 13 });
    for (const f of flats) f.y0 = Math.max(raw(f.x, f.z), 1.2);

    function height(x, z) {
      let h = raw(x, z);
      for (let i = 0; i < flats.length; i++) {
        const f = flats[i];
        const dx = x - f.x, dz = z - f.z;
        if (dx * dx + dz * dz > f.r * f.r) continue;
        h = lerp(h, f.y0, radialMask(x, z, f.x, f.z, f.r, 0.45) * 0.94);
      }
      return h;
    }

    // -- color --
    const C = {
      seabed: rgb(0x8a7c5e), sand: rgb(0xd8c08a), grass: rgb(0x7aa854), grassDry: rgb(0xa2a85e),
      savanna: rgb(0xbcab60), desertA: rgb(0xe3c98f), desertB: rgb(0xc7a164), wetland: rgb(0x5d9b62),
      rock: rgb(0x8b8178), snow: rgb(0xf3f3ee), path: rgb(0xcdb184),
    };
    const tmp = [0, 0, 0];

    function color(x, z, h, slope, out) {
      const m = masks(x, z);
      const wet = moist(x, z) * 0.5 + 0.5;

      mix3(C.grassDry, C.grass, clamp(wet * 1.3, 0, 1), out);
      mix3(out, C.savanna, Math.max(m.steppe, m.origins * 0.55) * 0.8, out);

      // desert duning: two-tone by ridge phase
      const dn = dune(x * 0.45, z * 1.25) * 0.5 + 0.5;
      mix3(C.desertB, C.desertA, dn, tmp);
      mix3(out, tmp, m.desert * 0.95, out);

      // delta wetland greens where low
      mix3(out, C.wetland, m.delta * smoothstep(3.6, 1.4, h) * 0.85, out);

      // beaches + seabed
      const sandT = 1 - smoothstep(0.45, 1.8, h);
      mix3(out, C.sand, sandT * (1 - m.desert * 0.5), out);
      mix3(out, C.seabed, smoothstep(0.2, -2.6, h), out);

      // rock on steep slopes, snow up high
      const rockT = smoothstep(0.42, 0.72, slope);
      mix3(out, C.rock, rockT, out);
      mix3(out, C.snow, smoothstep(23, 29, h) * (1 - rockT * 0.5), out);

      // carved roads
      const pm = 1 - smoothstep(2.2, 6.5, pathD(x, z));
      mix3(out, C.path, pm * 0.7 * (1 - sandT * 0.6) * (1 - smoothstep(0.2, -1, h)), out);

      // subtle ground variation so big fields never look flat
      scale3(out, 1 + varn(x * 0.9, z * 0.9) * 0.055, out);
      return out;
    }

    // -- probe (flora + structure placement) --
    function probe(x, z) {
      const h = height(x, z);
      const e = 1.4;
      const sx = (height(x + e, z) - height(x - e, z)) / (2 * e);
      const sz = (height(x, z + e) - height(x, z - e)) / (2 * e);
      const slope = Math.hypot(sx, sz);
      const m = masks(x, z);
      const pd = pathD(x, z);
      return {
        h, slope,
        desert: m.desert, steppe: m.steppe, delta: m.delta, mtn: m.mtn, origins: m.origins,
        med: m.cont * (1 - m.desert) * (1 - m.steppe * 0.8) * (1 - m.mtn) * (1 - m.delta * 0.5),
        path: 1 - smoothstep(2.4, 7.5, pd), pathD: pd,
        riverD: riverD(x, z), oasisD: Math.hypot(x - 40, z - 208),
      };
    }

    return { height, color, probe, pathD, seaLevel: def.sea };
  },
};

export default def;
