// mind-atlas.js — world definition for "The Mind Atlas" (AP Psychology, 2024 CED).
// A stylized inner world at permanent dusk: an Observatory plateau (research
// methods), a bioluminescent Neural Forest (biological bases), a Memory
// Archipelago with a retrieval lighthouse (cognition), a Growth Grove whose
// orchard literally matures west→east (development & learning), a standing-stone
// Social Plaza (social psych & personality), and terraced Wellness Springs
// (mental & physical health). A "stream of consciousness" runs from the northern
// range to the bay.
//
// Seed 20270511 = the projected AP Psych exam date (May 11, 2027).

import { makeFbm, makeRidged, makeNoise2D } from '../core/noise.js';
import { subSeed } from '../core/prng.js';
import {
  clamp, lerp, smoothstep, radialMask, ellipseMask,
  makePolylineDist, rgb, mix3, scale3,
} from '../core/field-utils.js';

const SEED = 20270511;

const PATHS = [
  [[0, 70], [0, 10], [0, -40]],                      // spawn → Social Plaza
  [[0, -40], [-70, -80], [-150, -120]],              // plaza → Observatory Heights
  [[0, -40], [70, -75], [150, -110]],                // plaza → Neural Forest
  [[0, -40], [-90, 0], [-180, 40]],                  // plaza → Growth Grove
  [[0, 70], [30, 120], [60, 180]],                   // spawn → Wellness Springs
  [[150, -110], [150, -20], [150, 55]],              // forest → bay shore
  [[150, 55], [178, 58], [205, 60]],                 // sandbar causeway → lighthouse
  [[0, 70], [34, 96]],                               // spawn → Exam Gate
  [[0, 70], [-34, 96]],                              // spawn → Free-Response Pavilion
  [[0, 70], [0, 118]],                               // spawn → gateway
];

const STREAM = [[40, -185], [80, -120], [120, -60], [160, 10], [185, 45], [215, 75]];
const SANDBAR = [[150, 55], [178, 58], [205, 60]];

export const def = {
  key: 'appsych',
  world: 'mind-atlas',
  title: 'The Mind Atlas',
  subtitle: 'AP Psychology — an inner world mapped to the five units of the 2024 CED.',
  // Wave 3: the full MIND ATLAS game layer (see docs/GAME_DESIGN.md).
  game: './game/worlds/mind-atlas/game.js',
  seed: SEED,
  size: 560,
  sea: 0,
  boundR: 256,
  boundsMsg: 'The fog of the unconscious thickens — better turn back toward the lit world.',
  spawn: [0, 70],
  spawnYaw: 0,

  sky: {
    zenithDay: 0x2e3a8c, horizonDay: 0xe2a9c6, fogDay: 0xb5aed4,
    zenithDusk: 0x222a6e, horizonDusk: 0xf0bb96, fogDusk: 0xc2aac4,
    sunColor: 0xffdcc9, cycleSec: 600, sunAzim: -2.2, sunElev: [0.22, 0.46],
    // graphics overhaul: additive night-phase mood (medium+; derived if absent).
    // A dream/unconscious night — violet-black zenith, rosy-cool horizon, a
    // pale-lilac moon to keep the mind-delver world's reverie tone after dark.
    nightZenith: 0x0d0f2e, nightHorizon: 0x2a2348, fogNight: 0x161335, moonColor: 0xcfc6ee,
  },
  // GRAPHICS OVERHAUL (D1): a cool, dreamlike key against a violet fill — drop the
  // flat .95 fill so the mind-regions gain depth; keep the clinical-bright wonder
  // (a hair lifted exposure, cool grade) so the Atlas reads luminous, not murky.
  light: {
    hemiSky: 0x9fb0ff, hemiGround: 0x363a5e, hemiI: 0.62, sun: 0xffe2cf, sunI: 1.55,
    exposure: 1.10, grade: { warm: 0.035, cool: 0.07, contrast: 1.045, sat: 1.06 },
  },
  water: { deep: 0x1d4a66, shallow: 0x3aa6a0, opacity: 0.85, waveAmp: 0.14 },
  fogDensity: 0.0048,
  avatar: { jacket: 0xd97742, pants: 0x3e3a52, skin: 0xd9a066, hat: 0x6b5e8c, pack: 0x4a6b73 },

  // exact bank topic strings (data/appsych-bank.json)
  regions: [
    {
      id: 'ap-methods', nodeId: 'ap-methods', name: 'Observatory Heights',
      center: [-150, -120], r: 55, stationKind: 'observatory', color: 0x38bdf8,
      topics: ['Variables + Theory', 'Experimental Control', 'Research Designs', 'Sampling + Ethics', 'Descriptive Statistics', 'Research Methods'],
    },
    {
      id: 'ap-bio', nodeId: 'ap-bio', name: 'Neural Forest',
      center: [150, -110], r: 60, stationKind: 'neuronTree', color: 0x22d3ee,
      topics: ['Neurons', 'Neurotransmitters', 'Brain Structures', 'Body Systems', 'Biology + Behavior', 'Biological Bases'],
    },
    {
      id: 'ap-cognition', nodeId: 'ap-cognition', name: 'Memory Archipelago',
      center: [205, 60], r: 50, stationKind: 'lighthouse', color: 0x818cf8,
      topics: ['Perception + Attention', 'Thinking + Biases', 'Memory Processes', 'Memory Strategies', 'Memory Errors', 'Cognition'],
    },
    {
      id: 'ap-dev', nodeId: 'ap-dev', name: 'Growth Grove',
      center: [-180, 40], r: 55, stationKind: 'milestones', color: 0x34d399,
      topics: ['Prenatal + Childhood', 'Developmental Theories', 'Classical Conditioning', 'Operant Conditioning', 'Social Learning', 'Development + Learning'],
    },
    {
      id: 'ap-social', nodeId: 'ap-social', name: 'Social Plaza',
      center: [0, -40], r: 50, stationKind: 'stonecircle', color: 0xf87171,
      topics: ['Attribution + Attitudes', 'Groups + Influence', 'Classic Studies', 'Personality Theories', 'Traits + Self', 'Social + Mental Health'],
    },
    {
      id: 'ap-health', nodeId: 'ap-health', name: 'Wellness Springs',
      center: [60, 180], r: 55, stationKind: 'springs', color: 0x2dd4bf,
      topics: ['Disorder Categories', 'Mood + Psychosis', 'Anxiety + Dissociation', 'Therapies', 'Personality + Well-Being', 'Social + Mental Health'],
    },
  ],

  skills: [
    { id: 'mcq', kind: 'mcq', stationKind: 'examgate', pos: [34, 96], label: 'MCQ Exam Gate', sub: 'All five units, mixed', color: 0x38bdf8, perRound: 12 },
    { id: 'frq', kind: 'frq', stationKind: 'pavilion', pos: [-34, 96], label: 'Free-Response Lab', sub: 'AAQ + EBQ practice', color: 0xa78bfa },
    { id: 'hub', kind: 'hub', stationKind: 'gateway', pos: [0, 118], label: "Dreamer's Gate", sub: 'Back to the hub', color: 0xffd27f },
  ],

  order: ['ap-methods', 'ap-bio', 'ap-cognition', 'ap-dev', 'ap-social', 'ap-health', 'mcq', 'frq'],

  paths: PATHS,
  river: STREAM,

  flora: [
    { kind: 'glowTree', count: 230, scale: [0.8, 1.6], test: p => p.forest * (p.h > 1 && p.h < 20 && p.slope < 0.5 ? 1 : 0) + p.med * (p.h > 1 && p.h < 16 && p.slope < 0.45 ? 0.18 : 0) },
    { kind: 'treeCone', count: 170, scale: [0.85, 1.6], test: p => p.med * (p.h > 1 && p.h < 24 && p.slope < 0.5 ? 0.55 : 0) },
    {
      kind: 'treeRound', count: 90, scale: [0.5, 1.5],
      test: p => p.grove * (p.h > 1 && p.h < 14 && p.slope < 0.4 ? 1 : 0),
      // the orchard "grows up" west → east across the grove
      scaleBias: p => clamp(0.45 + (p.x + 235) / 110 * 0.9, 0.4, 1.7),
    },
    { kind: 'crystal', count: 90, scale: [0.6, 1.9], test: p => p.mtn * (p.slope < 0.85 ? 0.8 : 0) + (p.h > 16 ? 0.3 : 0) },
    { kind: 'rock', count: 140, scale: [0.5, 1.5], test: p => (p.h > 0.8 && p.slope < 0.8 ? 0.3 : 0) },
    { kind: 'bush', count: 140, scale: [0.6, 1.2], test: p => (p.h > 0.8 && p.h < 16 && p.slope < 0.5 ? 0.4 : 0) },
    { kind: 'grassTuft', count: 420, scale: [0.7, 1.4], mobileSkip: true, test: p => (p.h > 0.7 && p.h < 13 && p.slope < 0.4 ? 0.65 : 0) },
    { kind: 'reed', count: 120, scale: [0.8, 1.4], test: p => (p.h > 0.15 && p.h < 1.1 && p.slope < 0.35 ? 0.9 : 0) },
    { kind: 'spark', count: 160, scale: [0.7, 1.3], mobileCount: 80, test: p => p.forest * 0.9 + p.springs * 0.5 },
  ],

  buildField() {
    const base = makeFbm(subSeed(SEED, 'base'), { octaves: 4, freq: 1 / 190, gain: 0.5 });
    const hill = makeFbm(subSeed(SEED, 'hill'), { octaves: 5, freq: 1 / 54, gain: 0.5 });
    const ridge = makeRidged(subSeed(SEED, 'ridge'), { octaves: 4, freq: 1 / 120 });
    const warp = makeFbm(subSeed(SEED, 'warp'), { octaves: 3, freq: 1 / 84, gain: 0.55 });
    const dream = makeFbm(subSeed(SEED, 'dream'), { octaves: 3, freq: 1 / 64 });
    const varn = makeNoise2D(subSeed(SEED, 'var'));

    const pathD = makePolylineDist(PATHS);
    const streamD = makePolylineDist([STREAM]);
    const sandbarD = makePolylineDist([SANDBAR]);
    const max0 = v => (v > 0 ? v : 0);

    function masks(x, z) {
      const cont = smoothstep(262, 204, Math.hypot(x, z));
      const mtn = ellipseMask(x, z, 0, -205, 178, 62, 0.05) * cont;
      const forest = radialMask(x, z, 150, -110, 95) * cont;
      const grove = radialMask(x, z, -180, 40, 78) * cont;
      const springs = radialMask(x, z, 60, 180, 62) * cont;
      return { cont, mtn, forest, grove, springs };
    }

    function raw(x, z) {
      const wx = x + warp(x + 144, z - 377) * 22;
      const wz = z + warp(x - 901, z + 56) * 22;
      const m = masks(x, z);

      const pathM = 1 - smoothstep(2.4, 7, pathD(x, z));
      const det = 1 - 0.72 * pathM;

      let h = -9 + m.cont * 11.5 + base(wx, wz) * 6 * m.cont;
      h += ridge(wx, wz) * 36 * m.mtn;
      h += hill(wx, wz) * 2.5 * m.cont * det;
      h += max0(hill(wx * 1.3, wz * 1.3)) * 4.5 * m.forest * det; // mossy forest mounds

      // the bay (memory archipelago basin)
      h = lerp(h, -4, radialMask(x, z, 232, 92, 88) * 0.95);
      // islets rise back out of the bay
      h = islet(h, x, z, 205, 60, 19, 3.6);
      h = islet(h, x, z, 243, 104, 13, 2.6);
      h = islet(h, x, z, 188, 116, 11, 2.2);
      // sandbar causeway to the lighthouse
      const sb = 1 - smoothstep(3, 7.5, sandbarD(x, z));
      h = lerp(h, Math.max(h, 0.9), sb);

      // stream of consciousness — carved to the bay
      const sd = streamD(x + warp(x, z) * 7, z + warp(z, x) * 7);
      h = lerp(h, Math.min(h, -2.2), 1 - smoothstep(3, 10, sd));

      // wellness terraces: quantized steps
      const terr = m.springs * smoothstep(0.5, 3, h);
      if (terr > 0.01) h = lerp(h, Math.floor(h / 1.7) * 1.7 + 0.85, terr * 0.75);

      // roads are causeways: never submerged, ford the stream
      h = lerp(h, Math.max(h, 1.1), pathM);

      // observatory plateau + social plaza
      h = plateau(h, x, z, -150, -120, 40, 21);
      h = plateau(h, x, z, 0, -40, 34, 6.5);
      return h;
    }

    function islet(h, x, z, cx, cz, r, top) {
      const m = radialMask(x, z, cx, cz, r, 0.35);
      return lerp(h, top + hill(x, z) * 0.6, m);
    }
    function plateau(h, x, z, cx, cz, r, top) {
      const m = radialMask(x, z, cx, cz, r, 0.4);
      return lerp(h, top + (h - top) * 0.15, m);
    }

    const flats = [];
    for (const r of def.regions) flats.push({ x: r.center[0], z: r.center[1], r: r.stationKind === 'stonecircle' ? 18 : 13 });
    for (const s of def.skills) flats.push({ x: s.pos[0], z: s.pos[1], r: 12 });
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

    const C = {
      seabed: rgb(0x6f6e82), sand: rgb(0xcfc3a0), moss: rgb(0x3a7d6b), teal: rgb(0x4f9e8a),
      lavender: rgb(0x8e85c4), rock: rgb(0x7d7f96), crystal: rgb(0xe6ebff), glowmoss: rgb(0x4fb39a),
      path: rgb(0xa9bdb3),
    };
    const tmp = [0, 0, 0];

    function color(x, z, h, slope, out) {
      const m = masks(x, z);
      const d = dream(x, z) * 0.5 + 0.5;

      mix3(C.moss, C.teal, d, out);
      // lavender dream-meadows ripple across the open land
      const lav = smoothstep(0.55, 0.85, dream(x * 1.7 + 50, z * 1.7 - 80) * 0.5 + 0.5);
      mix3(out, C.lavender, lav * 0.5 * (1 - m.forest) * (1 - m.mtn), out);
      // forest floor: deeper, glowing moss
      mix3(out, C.glowmoss, m.forest * 0.45, out);

      const sandT = 1 - smoothstep(0.4, 1.7, h);
      mix3(out, C.sand, sandT, out);
      mix3(out, C.seabed, smoothstep(0.2, -2.8, h), out);

      const rockT = smoothstep(0.42, 0.72, slope);
      mix3(out, C.rock, rockT, out);
      mix3(out, C.crystal, smoothstep(17, 24, h) * (1 - rockT * 0.35), out);

      const pm = 1 - smoothstep(2.2, 6, pathD(x, z));
      mix3(out, C.path, pm * 0.65 * (1 - sandT * 0.6) * (1 - smoothstep(0.2, -1, h)), out);

      scale3(out, 1 + varn(x * 0.9, z * 0.9) * 0.05, out);
      return out;
    }

    function probe(x, z) {
      const h = height(x, z);
      const e = 1.4;
      const sx = (height(x + e, z) - height(x - e, z)) / (2 * e);
      const sz = (height(x, z + e) - height(x, z - e)) / (2 * e);
      const m = masks(x, z);
      return {
        x, z, h, slope: Math.hypot(sx, sz),
        mtn: m.mtn, forest: m.forest, grove: m.grove, springs: m.springs,
        med: m.cont * (1 - m.mtn) * (1 - m.forest) * (1 - m.grove * 0.6),
        desert: 0, steppe: 0, delta: 0, origins: 0,
        path: 1 - smoothstep(2.4, 7, pathD(x, z)), pathD: pathD(x, z),
        riverD: streamD(x, z), oasisD: 1e9,
      };
    }

    return { height, color, probe, pathD, seaLevel: def.sea };
  },
};

export default def;
