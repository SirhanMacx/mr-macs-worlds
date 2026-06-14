// word-harbor.js — world definition for "WORD HARBOR" (Global 9 ENL).
// A warm archipelago: you arrive by boat at a new land and build your harbor
// town by collecting words. Seven islands echo the real ENL units —
// Geography Isle (the tutorial), Paleo Valley, River Lands, Classical
// Heights, Caravan Coast, Renaissance Quay and Exploration Point — all
// reached over shallow sandy fords that the sentence-bridges later span.
//
// Gentle by design: no timers, no death, slow camera, big interaction radii.
// Seed 20270603 = the ENL Time Travel final window (June 2027). Same seed,
// same harbor, for every student.

import { makeFbm, makeRidged, makeNoise2D } from '../core/noise.js';
import { subSeed } from '../core/prng.js';
import {
  clamp, lerp, smoothstep, radialMask,
  makePolylineDist, rgb, mix3, scale3,
} from '../core/field-utils.js';

const SEED = 20270603;

// ---------------- island layout ----------------
export const ISLES = {
  home:      { c: [0, 95],      r: 64 },
  geo:       { c: [0, -38],     r: 50 },
  paleo:     { c: [-138, -126], r: 52 },
  river:     { c: [138, -126],  r: 56 },
  classical: { c: [-208, 8],    r: 50 },
  caravan:   { c: [208, 8],     r: 52 },
  ren:       { c: [-132, 152],  r: 50 },
  explore:   { c: [132, 156],   r: 50 },
};

// shallow sandy fords between islands — the bridge sites span these
export const FORDS = [
  [[0, 38], [0, 4]],                 // home → Geography Isle
  [[-38, -68], [-92, -98]],          // geo → Paleo Valley
  [[38, -68], [92, -98]],            // geo → River Lands
  [[-172, -82], [-192, -38]],        // paleo → Classical Heights
  [[172, -82], [192, -38]],          // river → Caravan Coast
  [[-185, 52], [-160, 112]],         // classical → Renaissance Quay
  [[185, 52], [160, 116]],           // caravan → Exploration Point
];

// roads: only WITHIN islands (the fords stay water until bridged)
const PATHS = [
  [[0, 122], [0, 95], [0, 48]],                       // home: quay → plaza → north shore
  [[0, 95], [30, 112]],                               // plaza → festival lawn
  [[0, 95], [-26, 112]],                              // plaza → town-hall side
  [[0, -4], [0, -38], [0, -70]],                      // geography isle spine
  [[0, -38], [-34, -62]], [[0, -38], [34, -62]],      // geo forks toward the west/east fords
  [[-98, -102], [-138, -126], [-166, -98]],           // paleo valley road
  [[98, -102], [138, -126], [168, -96]],              // river lands road
  [[-196, -32], [-208, 8], [-192, 46]],               // classical heights road
  [[196, -32], [208, 8], [192, 46]],                  // caravan coast road
  [[-156, 116], [-132, 152]],                         // renaissance quay road
  [[156, 120], [132, 156]],                           // exploration point road
];

export const def = {
  key: 'enl',
  world: 'word-harbor',
  title: 'Word Harbor',
  subtitle: 'Global 9 ENL — arrive by boat, collect the words, build your town.',
  glossary: './data/enl-glossary-global9.json',
  game: './game/worlds/word-harbor/game.js',
  seed: SEED,
  size: 620,
  sea: 0,
  boundR: 282,
  boundsMsg: 'Calm open water — the tide carries you gently back to shore.',
  spawn: [0, 120],
  spawnYaw: 0, // facing -z (north): the plaza, then Geography Isle

  sky: {
    zenithDay: 0x4a86c8, horizonDay: 0xfdebd2, fogDay: 0xdfe3d8,
    zenithDusk: 0x3b5a9e, horizonDusk: 0xf7cf9e, fogDusk: 0xe4cdb4,
    sunColor: 0xfff4de, cycleSec: 780, sunAzim: 1.8, sunElev: [0.42, 0.74],
    // graphics overhaul: additive night-phase mood (medium+; derived if absent).
    // A welcoming harbor night — soft navy zenith, lamp-warm horizon glow, a
    // bright friendly moon (lit windows + harbor lights read warm under bloom).
    nightZenith: 0x0c1838, nightHorizon: 0x2b3354, fogNight: 0x151f38, moonColor: 0xcdd8f0,
  },
  // GRAPHICS OVERHAUL (D1): a gentle, sun-warm harbor — drop the flat fill so the
  // islands and lamps gain dimension, warm the key so the town reads welcoming
  // (the lamp-lit "warmth" mood the world is about). Soft, never harsh.
  light: {
    hemiSky: 0xc6def8, hemiGround: 0xa08454, hemiI: 0.6, sun: 0xffeec6, sunI: 1.9,
    exposure: 1.12, grade: { warm: 0.065, cool: 0.045, contrast: 1.045, sat: 1.07 },
  },
  water: { deep: 0x2a6e86, shallow: 0x5fb8bd, opacity: 0.8, waveAmp: 0.12 },
  fogDensity: 0.0042,
  avatar: { jacket: 0x4d8f86, pants: 0x55503f, skin: 0xd9a066, hat: 0xd8b27a, pack: 0x9a6a3f },

  // ---------------- the seven word-isles ----------------
  // The game layer replaces every station interaction with Word Harbor's own;
  // topics listed here feed the gentle Question Lanterns festival stall.
  regions: [
    {
      id: 'wh-geo', nodeId: 'wh-geo', name: 'Geography Isle',
      center: [0, -38], r: 50, stationKind: 'stonecircle', color: 0x67c587,
      topics: ['Early Humans', 'Farming Revolution'],
    },
    {
      id: 'wh-paleo', nodeId: 'wh-paleo', name: 'Paleo Valley',
      center: [-138, -126], r: 52, stationKind: 'stones', color: 0xc9a25e,
      topics: ['Early Humans', 'Farming Revolution', 'Early Worlds'],
    },
    {
      id: 'wh-river', nodeId: 'wh-river', name: 'River Lands',
      center: [138, -126], r: 56, stationKind: 'ziggurat', color: 0xe0b54e,
      topics: ['Mesopotamia', 'Egypt + Indus', 'Shang China'],
    },
    {
      id: 'wh-classical', nodeId: 'wh-classical', name: 'Classical Heights',
      center: [-208, 8], r: 50, stationKind: 'temple', color: 0xf09a62,
      topics: ['Greek City-States', 'Roman Republic + Empire', 'India + China'],
    },
    {
      id: 'wh-caravan', nodeId: 'wh-caravan', name: 'Caravan Coast',
      center: [208, 8], r: 52, stationKind: 'caravanserai', color: 0xe8c46a,
      topics: ['Silk Roads', 'Indian Ocean', 'Trans-Saharan Trade'],
    },
    {
      id: 'wh-ren', nodeId: 'wh-ren', name: 'Renaissance Quay',
      center: [-132, 152], r: 50, stationKind: 'walledTown', color: 0xe87a8a,
      topics: ['Renaissance', 'Reformation', 'Medieval Europe'],
    },
    {
      id: 'wh-explore', nodeId: 'wh-explore', name: 'Exploration Point',
      center: [132, 156], r: 50, stationKind: 'lighthouse', color: 0x5fc4d8,
      topics: ['Navigation', 'Exploration', 'Columbian Exchange'],
    },
  ],

  skills: [
    { id: 'town', kind: 'town', stationKind: 'harbor', pos: [-26, 112], label: 'Harbor Town Hall', sub: 'Build your town with words', color: 0xffd166 },
    { id: 'festival', kind: 'festival', stationKind: 'pavilion', pos: [30, 112], label: 'Festival Lawn', sub: 'Gentle word games', color: 0xb78ee8 },
    { id: 'hub', kind: 'hub', stationKind: 'gateway', pos: [0, 134], label: "Wayfarer's Gate", sub: 'Back to the hub', color: 0xffd27f },
  ],

  order: ['wh-geo', 'wh-paleo', 'wh-river', 'wh-classical', 'wh-caravan', 'wh-ren', 'wh-explore', 'town', 'festival'],

  paths: PATHS,

  // ---------------- flora ----------------
  flora: [
    { kind: 'treeRound', count: 200, scale: [0.85, 1.5], test: p => Math.max(p.home, p.geo, p.ren) * (p.h > 1 && p.h < 14 && p.slope < 0.45 ? 0.75 : 0) },
    { kind: 'cypress', count: 90, scale: [0.9, 1.5], test: p => Math.max(p.classical, p.ren * 0.6) * (p.h > 1.2 && p.h < 16 && p.slope < 0.5 ? 0.8 : 0) },
    { kind: 'palm', count: 110, scale: [0.85, 1.3], test: p => (Math.max(p.caravan, p.explore) + (p.h > 0.5 && p.h < 2.2 ? 0.35 : 0)) * (p.h > 0.5 && p.h < 6 && p.slope < 0.4 ? 0.9 : 0) },
    { kind: 'treeFlat', count: 90, scale: [0.9, 1.5], test: p => p.paleo * (p.h > 1 && p.h < 14 && p.slope < 0.4 ? 0.7 : 0) },
    { kind: 'rock', count: 130, scale: [0.5, 1.6], test: p => Math.max(p.paleo, p.classical * 0.6) * (p.h > 0.8 && p.slope < 0.8 ? 0.5 : 0) },
    { kind: 'bush', count: 130, scale: [0.6, 1.2], test: p => (p.h > 0.8 && p.h < 12 && p.slope < 0.5 ? 0.4 : 0) * (1 - p.caravan * 0.7) },
    { kind: 'grassTuft', count: 380, scale: [0.7, 1.4], mobileSkip: true, test: p => Math.max(p.home, p.geo, p.ren, p.river * 0.7) * (p.h > 0.8 && p.h < 10 && p.slope < 0.4 ? 0.85 : 0) },
    { kind: 'reed', count: 120, scale: [0.8, 1.4], test: p => (p.h > 0.12 && p.h < 1.1 && p.slope < 0.35 ? 0.85 : 0) },
  ],

  // ---------------- the field ----------------
  buildField() {
    const base = makeFbm(subSeed(SEED, 'base'), { octaves: 4, freq: 1 / 190, gain: 0.5 });
    const hill = makeFbm(subSeed(SEED, 'hill'), { octaves: 5, freq: 1 / 52, gain: 0.5 });
    const ridge = makeRidged(subSeed(SEED, 'ridge'), { octaves: 4, freq: 1 / 110 });
    const dune = makeRidged(subSeed(SEED, 'dune'), { octaves: 3, freq: 1 / 24 });
    const moist = makeFbm(subSeed(SEED, 'moist'), { octaves: 3, freq: 1 / 70 });
    const varn = makeNoise2D(subSeed(SEED, 'var'));

    const pathD = makePolylineDist(PATHS);
    const fordD = makePolylineDist(FORDS);
    const max0 = v => (v > 0 ? v : 0);

    function masks(x, z) {
      const m = {};
      for (const k in ISLES) {
        const isl = ISLES[k];
        m[k] = radialMask(x, z, isl.c[0], isl.c[1], isl.r, 0.55);
      }
      return m;
    }

    // -- raw height (before station flattening) --
    function raw(x, z) {
      const m = masks(x, z);
      const pd = pathD(x, z);
      const pathM = 1 - smoothstep(2.2, 7, pd);
      const det = 1 - 0.7 * pathM; // roads shave the bumps

      let h = -6.5 + base(x, z) * 1.2; // sea floor

      // each island rises gently from the water
      h += m.home * (4.2 + max0(hill(x, z)) * 1.6 * det);
      h += m.geo * (4.0 + max0(hill(x, z)) * 2.2 * det);
      h += m.paleo * (4.6 + max0(ridge(x, z)) * 6.5 * det);             // rugged old hills
      h += m.river * (3.4 + max0(hill(x, z)) * 1.2 * det);              // flat green delta
      h += m.classical * (5.2 + max0(hill(x, z)) * 3.4 * det);          // marble heights
      h += m.caravan * (3.8 + dune(x * 0.5, z * 1.2) * 2.2 * det);      // soft dunes
      h += m.ren * (4.6 + max0(hill(x, z)) * 2.6 * det);                // hill-town quay
      h += m.explore * (4.0 + max0(hill(x, z)) * 2.0 * det);            // breezy headland

      // a small river across River Lands (carved to water level)
      const rd = Math.abs((x - 138) * 0.7 + (z + 126) * 0.7);
      h = lerp(h, Math.min(h, -1.4), m.river * (1 - smoothstep(3, 9, rd)) * 0.9);

      // shallow sandy fords between the islands (wadeable, bridge sites)
      const fd = fordD(x, z);
      const fordM = 1 - smoothstep(5, 14, fd);
      h = lerp(h, -0.4, fordM * smoothstep(1.6, 0.2, h));

      // roads are gentle causeways on land
      h = lerp(h, Math.max(h, 1.0), pathM * smoothstep(-0.2, 1.2, h));

      // hand-set flats: town plaza, classical acropolis, renaissance terrace
      h = plateau(h, x, z, 0, 100, 42, 4.6);
      h = plateau(h, x, z, -208, 8, 30, 8.5);
      h = plateau(h, x, z, -132, 152, 28, 7.0);
      return h;
    }

    function plateau(h, x, z, cx, cz, r, top) {
      const m = radialMask(x, z, cx, cz, r, 0.4);
      return lerp(h, top + (h - top) * 0.15, m);
    }

    // -- station flats (two-phase: measure raw, then pull terrain to it) --
    const flats = [];
    for (const r of def.regions) flats.push({ x: r.center[0], z: r.center[1], r: r.stationKind === 'walledTown' || r.stationKind === 'temple' ? 20 : 14 });
    for (const s of def.skills) flats.push({ x: s.pos[0], z: s.pos[1], r: 13 });
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
      seabed: rgb(0x9a8a68), sand: rgb(0xe2cd9a), grass: rgb(0x83b35e), grassWarm: rgb(0xa8b362),
      meadow: rgb(0x74b06a), duneA: rgb(0xe8d29a), duneB: rgb(0xcfac6e), wetland: rgb(0x5fa468),
      rock: rgb(0x968a7e), path: rgb(0xd6bb8e),
    };
    const tmp = [0, 0, 0];

    function color(x, z, h, slope, out) {
      const m = masks(x, z);
      const wet = moist(x, z) * 0.5 + 0.5;

      mix3(C.grassWarm, C.grass, clamp(wet * 1.25, 0, 1), out);
      mix3(out, C.meadow, Math.max(m.geo, m.home * 0.6) * 0.7, out);

      // caravan dunes: two-tone
      const dn = dune(x * 0.5, z * 1.2) * 0.5 + 0.5;
      mix3(C.duneB, C.duneA, dn, tmp);
      mix3(out, tmp, m.caravan * 0.92, out);

      // river-lands wet greens where low
      mix3(out, C.wetland, m.river * smoothstep(3.4, 1.2, h) * 0.8, out);

      // beaches + seabed (broad, friendly beaches)
      const sandT = 1 - smoothstep(0.5, 2.0, h);
      mix3(out, C.sand, sandT * (1 - m.caravan * 0.4), out);
      mix3(out, C.seabed, smoothstep(0.2, -2.4, h), out);

      // rock on steep paleo/classical slopes
      const rockT = smoothstep(0.45, 0.78, slope);
      mix3(out, C.rock, rockT, out);

      // carved roads
      const pm = 1 - smoothstep(2.0, 6.2, pathD(x, z));
      mix3(out, C.path, pm * 0.68 * (1 - sandT * 0.6) * (1 - smoothstep(0.2, -1, h)), out);

      // subtle ground variation
      scale3(out, 1 + varn(x * 0.9, z * 0.9) * 0.05, out);
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
        home: m.home, geo: m.geo, paleo: m.paleo, river: m.river,
        classical: m.classical, caravan: m.caravan, ren: m.ren, explore: m.explore,
        path: 1 - smoothstep(2.2, 7, pd), pathD: pd,
        fordD: fordD(x, z),
      };
    }

    return { height, color, probe, pathD, seaLevel: def.sea };
  },
};

export default def;
