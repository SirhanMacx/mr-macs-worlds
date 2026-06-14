// quality.js — the device QUALITY-TIER linchpin (graphics overhaul, spec §1.1).
//
// Everything expensive in the renderer is gated behind a tier so a weak school
// Chromebook never regresses below today's shipped path:
//   low    ≈ today's renderer (pixelRatio 1.0, NO composer, NO shadows, blob only)
//   medium  integrated desktop (1.5, bloom-lite+FXAA+vignette, optional 1024 shadows)
//   high    discrete / Apple   (min(dpr,2), bloom+SMAA+SSAO+grade, 2048 PCFSoft)
//
// Detection runs ONCE at boot (worst-of three signals), the result is persisted
// through the existing Progress settings so the GPU probe is skipped next boot,
// and a *demote-only* fps watchdog catches a misclassified-fast device and steps
// it down (never up — no oscillation). A HUD "GFX" button sets a manual ceiling.
//
// HARD RULES baked in here (the rest of the engine trusts these invariants):
//   • composer:false / shadows:false / pixelRatio 1.0 on low — ALWAYS.
//   • the low tier object allocates no shadow/reflection/SSAO targets (those are
//     boolean flags other modules branch on; this file never constructs anything).
//   • QUAL_LOW is exported as the safe default every builder falls back to when
//     called before the integrator threads a real `qual` in.

import * as Progress from '../learn/progress.js';

// ----------------------------------------------------------------------------
// The per-tier flag table. Frozen so a downstream module can't accidentally
// mutate a shared tier and leak settings between systems. This is the single
// source of truth for what each tier turns on.
// ----------------------------------------------------------------------------
export const TIERS = Object.freeze({
  low: Object.freeze({
    tier: 'low',
    pixelRatio: 1.0,            // HARD CAP — never above 1.0 on low
    composer: false,           // HARD OFF — engine takes a direct-render() branch
    bloom: false,
    aa: 'none',                // no FXAA/SMAA pass; renderer antialias may still be off
    ssao: false,
    grade: false,
    vignette: false,
    shadows: false,            // HARD OFF — blob shadows only
    shadowSize: 0,
    water: Object.freeze({ normal: false, fresnel: false, glitter: false, reflection: false }),
    sky: Object.freeze({ clouds: false, night: false, godRays: false }),
    terrain: Object.freeze({ detail: false, triplanar: false, ao: false }),
    veg: Object.freeze({ wind: false, fade: false, species: false, countMul: 0.55 }),
    characters: Object.freeze({ face: false, contact: false }),
    emissiveNight: 'static',
    motes: false,
    drawCallCeiling: 90,
  }),
  medium: Object.freeze({
    tier: 'medium',
    pixelRatio: 1.5,
    composer: true,
    bloom: 'lite',             // bloom internal res ÷4
    aa: 'fxaa',
    ssao: false,
    grade: false,
    vignette: true,
    shadows: false,            // optional — see shadowSize; integrator may enable
    shadowSize: 1024,
    water: Object.freeze({ normal: true, fresnel: true, glitter: true, reflection: false }),
    sky: Object.freeze({ clouds: true, night: true, godRays: false }),
    terrain: Object.freeze({ detail: true, triplanar: false, ao: true }),
    veg: Object.freeze({ wind: true, fade: true, species: false, countMul: 1.0 }),
    characters: Object.freeze({ face: true, contact: false }),
    emissiveNight: 'bloom',
    motes: false,
    drawCallCeiling: 130,
  }),
  high: Object.freeze({
    tier: 'high',
    pixelRatio: 0,             // 0 = "use min(dpr,2)" — resolved per device below
    composer: true,
    bloom: 'full',             // bloom internal res ÷2
    aa: 'smaa',
    ssao: true,
    grade: true,
    vignette: true,
    shadows: true,             // ON — player-following ortho
    shadowSize: 2048,
    water: Object.freeze({ normal: true, fresnel: true, glitter: true, reflection: true }),
    sky: Object.freeze({ clouds: true, night: true, godRays: true }),
    terrain: Object.freeze({ detail: true, triplanar: true, ao: true }),
    veg: Object.freeze({ wind: true, fade: true, species: true, countMul: 1.25 }),
    characters: Object.freeze({ face: true, contact: true }),
    emissiveNight: 'lantern',
    motes: true,
    drawCallCeiling: 180,
  }),
});

const TIER_ORDER = ['low', 'medium', 'high'];
const tierIndex = t => Math.max(0, TIER_ORDER.indexOf(t));

// ----------------------------------------------------------------------------
// QUAL_LOW — the safe default object every builder imports for defensive calls
// made BEFORE the integrator wires a real `qual` in. It is a fully-resolved low
// tier (pixelRatio already a real number) so destructuring never explodes.
// ----------------------------------------------------------------------------
export const QUAL_LOW = Object.freeze({ ...TIERS.low });

// ----------------------------------------------------------------------------
// GPU-string heuristics (UNMASKED_RENDERER_WEBGL via WEBGL_debug_renderer_info).
// We bias conservative: an unknown / empty string falls to medium, and any of
// the weak-GPU substrings forces low. swiftshader/llvmpipe are the headless &
// software paths (also our Chromebook proxy in the verify harness).
// ----------------------------------------------------------------------------
const LOW_GPU = [
  'swiftshader', 'llvmpipe', 'software', 'microsoft basic',
  'mali', 'powervr', 'videocore',
  'adreno (tm) 3', 'adreno (tm) 4', 'adreno (tm) 5',
  'adreno 3', 'adreno 4', 'adreno 5',
  'intel hd', 'intel(r) hd', 'hd graphics 2', 'hd graphics 3', 'hd graphics 4', 'hd graphics 5',
  'uhd graphics 6', 'gma',
];
const HIGH_GPU = [
  'nvidia', 'geforce', 'rtx', 'gtx', 'quadro',
  'radeon rx', 'radeon pro', 'rx 5', 'rx 6', 'rx 7',
  'apple m', 'apple a1', 'apple a2', 'apple gpu',
  'iris xe', 'intel arc', 'arc a',
];

function gpuString(renderer) {
  try {
    const gl = renderer && renderer.getContext && renderer.getContext();
    if (!gl) return '';
    const ext = gl.getExtension('WEBGL_debug_renderer_info');
    if (!ext) return '';
    return String(gl.getParameter(ext.UNMASKED_RENDERER_WEBGL) || '').toLowerCase();
  } catch (e) { return ''; }
}

function gpuTier(str) {
  if (!str) return 'medium';                              // unknown → middle of the road
  if (LOW_GPU.some(s => str.includes(s))) return 'low';
  if (HIGH_GPU.some(s => str.includes(s))) return 'high';
  return 'medium';
}

// Hard caps from the GL/platform, independent of the GPU name.
function hardCaps(renderer) {
  let ceiling = 'high';
  const lower = t => { if (tierIndex(t) < tierIndex(ceiling)) ceiling = t; };
  try {
    const gl = renderer && renderer.getContext && renderer.getContext();
    if (gl) {
      // WebGL2 is assumed by the rest of the engine; its absence → low.
      const isGL2 = (typeof WebGL2RenderingContext !== 'undefined') && (gl instanceof WebGL2RenderingContext);
      if (!isGL2) lower('low');
      const maxTex = gl.getParameter(gl.MAX_TEXTURE_SIZE) || 0;
      if (maxTex && maxTex < 4096) lower('low');
    }
  } catch (e) { /* ignore — leave ceiling */ }
  const nav = (typeof navigator !== 'undefined') ? navigator : {};
  if (typeof nav.deviceMemory === 'number' && nav.deviceMemory <= 2) lower('low');
  if (typeof nav.hardwareConcurrency === 'number' && nav.hardwareConcurrency <= 2) lower('medium');
  return ceiling;
}

function isCoarse() {
  try { return matchMedia('(pointer: coarse)').matches || ('ontouchstart' in window); }
  catch (e) { return false; }
}

// Resolve a tier name into a concrete, fully-numeric flag object. `dpr` lets the
// high tier turn its pixelRatio:0 sentinel into min(dpr,2).
function resolve(name, dpr) {
  const base = TIERS[name] || TIERS.low;
  const obj = { ...base };
  if (name === 'high') obj.pixelRatio = Math.min(dpr || 1, 2.0);
  // Defense-in-depth: low NEVER carries composer/shadows or pixelRatio > 1.
  if (name === 'low') { obj.composer = false; obj.shadows = false; obj.pixelRatio = 1.0; }
  return obj;
}

// The detection pipeline: worst-of (coarse-pointer ceiling, GPU string, hard caps).
export function detectTier(renderer) {
  const coarseCeiling = isCoarse() ? 'medium' : 'high'; // touch never auto-promotes past medium
  const gpu = gpuTier(gpuString(renderer));
  const caps = hardCaps(renderer);
  // worst-of across all signals
  let name = 'high';
  for (const c of [coarseCeiling, gpu, caps]) {
    if (tierIndex(c) < tierIndex(name)) name = c;
  }
  return name;
}

// ----------------------------------------------------------------------------
// createQuality(renderer, { onChange, ceiling, dpr }) -> live tier object + API.
// The returned object IS the flag table for the active tier (so callers can read
// `qual.composer`, `qual.water.glitter`, etc. directly) PLUS control methods.
// onChange(newTierObject) fires whenever the effective tier changes (demotion or
// a manual ceiling change) so the integrator can rebuild the composer/shadows.
// ----------------------------------------------------------------------------
export function createQuality(renderer, { onChange = () => {}, ceiling = null, dpr = null } = {}) {
  const realDpr = dpr != null ? dpr : ((typeof window !== 'undefined' && window.devicePixelRatio) || 1);

  // Manual ceiling: explicit arg > persisted setting > none.
  let savedCeiling = null;
  try { savedCeiling = Progress.getSetting ? Progress.getSetting('gfxCeiling', null) : null; } catch (e) { savedCeiling = null; }
  let ceilingName = ceiling || savedCeiling || null;        // null == auto (no manual cap)
  // touch hard-caps the ceiling at medium regardless of what was persisted.
  const touch = isCoarse();
  const capByTouch = name => (touch && tierIndex(name) > tierIndex('medium')) ? 'medium' : name;

  // Effective tier: prefer a persisted *effective* tier (skip the GPU probe), else detect.
  let savedTier = null;
  try { savedTier = Progress.getSetting ? Progress.getSetting('gfxTier', null) : null; } catch (e) { savedTier = null; }
  let detected = (savedTier && TIERS[savedTier]) ? savedTier : detectTier(renderer);

  function applyCeiling(name) {
    let n = name;
    if (ceilingName && tierIndex(ceilingName) < tierIndex(n)) n = ceilingName;
    return capByTouch(n);
  }

  let currentName = applyCeiling(detected);
  let current = resolve(currentName, realDpr);

  function persist() {
    try {
      if (Progress.setSetting) {
        Progress.setSetting('gfxTier', currentName);
        Progress.setSetting('gfxCeiling', ceilingName); // null persists as "auto"
      }
    } catch (e) { /* private mode — non-fatal */ }
  }
  persist();

  // ---- live mutable copy other modules read from -------------------------
  // We return one stable object reference and copy the resolved flags onto it so
  // a held reference stays valid across demotions.
  const live = {};
  function syncLive() {
    // wipe + copy (cheap; happens only on a tier change, not per frame)
    for (const k of Object.keys(live)) delete live[k];
    Object.assign(live, current);
  }
  syncLive();

  function setTier(name, { fromWatchdog = false } = {}) {
    const next = resolve(name, realDpr);
    if (name === currentName) return;
    currentName = name;
    current = next;
    syncLive();
    if (!fromWatchdog) persist(); else persist(); // persist either way (skip probe next boot)
    onChange(live);
  }

  // ---- demote-only fps watchdog ------------------------------------------
  // 60-frame EMA of frame time. <48fps sustained 90 frames → demote one tier,
  // 4s cooldown. On low (can't demote further) & <40fps → pixelRatio 0.85.
  const EMA_N = 60;
  const SLOW_FPS = 48;
  const VERY_SLOW_FPS = 40;
  const SUSTAIN_FRAMES = 90;
  const COOLDOWN_MS = 4000;
  let emaDt = 16.7;          // ms/frame, seeded at 60fps
  let slowRun = 0;
  let lastActionAt = -Infinity;
  let lowPrShrunk = false;
  let elapsedMs = 0;

  function tick(dtMs) {
    if (!(dtMs > 0)) return;
    // ignore absurd spikes (tab refocus, GC, alt-tab) so they don't trigger a demote
    if (dtMs > 200) { slowRun = 0; return; }
    elapsedMs += dtMs;
    emaDt += (dtMs - emaDt) * (2 / (EMA_N + 1));
    const fps = 1000 / emaDt;
    if (fps < SLOW_FPS) slowRun++; else slowRun = 0;

    if (slowRun < SUSTAIN_FRAMES) return;
    if (elapsedMs - lastActionAt < COOLDOWN_MS) return;

    if (currentName !== 'low') {
      // demote exactly one tier (respect — never below — the effective floor)
      const next = TIER_ORDER[Math.max(0, tierIndex(currentName) - 1)];
      lastActionAt = elapsedMs;
      slowRun = 0;
      setTier(next, { fromWatchdog: true });
    } else if (fps < VERY_SLOW_FPS && !lowPrShrunk) {
      // already on low: last resort is a pixelRatio shrink (never below 0.85).
      lowPrShrunk = true;
      lastActionAt = elapsedMs;
      slowRun = 0;
      live.pixelRatio = current.pixelRatio = 0.85;
      try { renderer && renderer.setPixelRatio && renderer.setPixelRatio(0.85); } catch (e) { /* headless */ }
      onChange(live);
    }
  }

  // ---- manual ceiling (HUD GFX button) -----------------------------------
  // setCeiling(name|null): null == auto. The watchdog can still demote below the
  // ceiling; we never auto-promote, so raising the ceiling re-detects from scratch.
  function setCeiling(name) {
    ceilingName = name ? capByTouch(name) : null;
    // raising the ceiling: re-detect (the device may now be allowed higher);
    // lowering: just re-clamp the current detection.
    const want = applyCeiling(detected);
    // reset watchdog state so a fresh ceiling gets a clean perf window
    slowRun = 0; lastActionAt = elapsedMs; lowPrShrunk = false;
    persist();
    if (want !== currentName) setTier(want);
    else persist();
    return currentName;
  }

  // The cycle the HUD wires to: low -> medium -> high -> low (capped at medium on touch).
  function cycleCeiling() {
    const order = touch ? ['low', 'medium'] : ['low', 'medium', 'high'];
    const cur = ceilingName || currentName;
    const i = order.indexOf(cur);
    const nextName = order[(i + 1) % order.length];
    return setCeiling(nextName);
  }

  // Verification/debug hook: hard-force a tier regardless of detection so the
  // headless harness (which always reads swiftshader=low) can still exercise the
  // medium/high paths. Bypasses the touch cap on purpose (test-only).
  function forceTier(name) {
    if (!TIERS[name]) return currentName;
    ceilingName = null;
    detected = name;
    slowRun = 0; lastActionAt = elapsedMs; lowPrShrunk = false;
    setTier(name);
    return currentName;
  }

  Object.defineProperties(live, {
    // live control surface (non-enumerable so a {...qual} spread stays pure flags)
    tick:         { value: tick,         enumerable: false },
    setCeiling:   { value: setCeiling,   enumerable: false },
    cycleCeiling: { value: cycleCeiling, enumerable: false },
    forceTier:    { value: forceTier,    enumerable: false },
    detectTier:   { value: () => detectTier(renderer), enumerable: false },
    getCeiling:   { value: () => ceilingName, enumerable: false },
    name:         { get: () => currentName, enumerable: false },
  });

  return live;
}

export default { detectTier, createQuality, TIERS, QUAL_LOW };
