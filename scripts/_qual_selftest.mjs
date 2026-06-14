// Isolated self-test for js/engine/quality.js (Module A). Stubs the browser
// globals progress.js + quality.js touch, then asserts the documented contract.
// Run: node scripts/_qual_selftest.mjs  (exit 0 = pass)

// ---- minimal browser-global stubs (node has none of these) ----
const store = {};
globalThis.localStorage = {
  getItem: k => (k in store ? store[k] : null),
  setItem: (k, v) => { store[k] = String(v); },
  removeItem: k => { delete store[k]; },
};
globalThis.matchMedia = (q) => ({ matches: false, media: q });
globalThis.window = { devicePixelRatio: 2, addEventListener() {} };
Object.defineProperty(globalThis, 'navigator', {
  value: { hardwareConcurrency: 8, deviceMemory: 8 }, configurable: true, writable: true,
});
globalThis.WebGL2RenderingContext = class {};

const assert = (cond, msg) => { if (!cond) { console.error('FAIL:', msg); process.exit(1); } };
// Each independent "device" scenario simulates a fresh boot — clear the
// persisted effective tier/ceiling so the GPU probe actually runs. progress.js
// keeps an in-memory state object, so clear there too (not just localStorage).
const freshBoot = () => {
  for (const k of Object.keys(store)) delete store[k];
  const s = Progress.getState();
  if (s.settings) { delete s.settings.gfxTier; delete s.settings.gfxCeiling; }
};

const Q = await import('../js/engine/quality.js');
const Progress = await import('../js/learn/progress.js');

// 1) createQuality is a function
assert(typeof Q.createQuality === 'function', 'createQuality is a function');
assert(typeof Q.detectTier === 'function', 'detectTier is a function');

// 2) the per-tier flag table is exported with all three tiers + documented flags
assert(Q.TIERS && typeof Q.TIERS === 'object', 'TIERS table exported');
for (const t of ['low', 'medium', 'high']) {
  const T = Q.TIERS[t];
  assert(T, `TIERS.${t} exists`);
  assert(T.tier === t, `TIERS.${t}.tier === '${t}'`);
  for (const k of ['pixelRatio', 'composer', 'bloom', 'aa', 'ssao', 'shadows', 'shadowSize', 'drawCallCeiling']) {
    assert(k in T, `TIERS.${t} has flag '${k}'`);
  }
  for (const grp of ['water', 'terrain', 'veg', 'characters', 'sky']) {
    assert(T[grp] && typeof T[grp] === 'object', `TIERS.${t}.${grp} object`);
  }
}
// documented draw-call ceilings
assert(Q.TIERS.low.drawCallCeiling === 90, 'low ceiling 90');
assert(Q.TIERS.medium.drawCallCeiling === 130, 'medium ceiling 130');
assert(Q.TIERS.high.drawCallCeiling === 180, 'high ceiling 180');
// water sub-flags per spec
assert(Q.TIERS.low.water.glitter === false && Q.TIERS.medium.water.glitter === true, 'water.glitter low/med');
assert(Q.TIERS.high.water.reflection === true && Q.TIERS.medium.water.reflection === false, 'water.reflection high only');
// veg countMul
assert(Q.TIERS.low.veg.countMul === 0.55, 'veg countMul 0.55 low');
assert(Q.TIERS.high.veg.species === true, 'veg species high');

// 3) QUAL_LOW exists with composer:false / shadows:false / pixelRatio 1.0
assert(Q.QUAL_LOW, 'QUAL_LOW exported');
assert(Q.QUAL_LOW.composer === false, 'QUAL_LOW.composer === false');
assert(Q.QUAL_LOW.shadows === false, 'QUAL_LOW.shadows === false');
assert(Q.QUAL_LOW.pixelRatio === 1.0, 'QUAL_LOW.pixelRatio === 1.0');
assert(Q.QUAL_LOW.tier === 'low', 'QUAL_LOW.tier === low');

// 4) detectTier on a "low" GPU string must return low; on high GPU → high.
function fakeRenderer(gpuStr, { gl2 = true, maxTex = 16384, pr = 2 } = {}) {
  const gl = {
    getExtension: () => ({ UNMASKED_RENDERER_WEBGL: 37446 }),
    getParameter: (p) => (p === 37446 ? gpuStr : (p === 0x0D33 ? maxTex : maxTex)), // MAX_TEXTURE_SIZE=0x0D33
    MAX_TEXTURE_SIZE: 0x0D33,
  };
  if (gl2) Object.setPrototypeOf(gl, WebGL2RenderingContext.prototype);
  return { getContext: () => gl, setPixelRatio() {}, getPixelRatio: () => pr };
}
assert(Q.detectTier(fakeRenderer('Google SwiftShader')) === 'low', 'swiftshader → low');
assert(Q.detectTier(fakeRenderer('NVIDIA GeForce RTX 4070')) === 'high', 'nvidia → high');
assert(Q.detectTier(fakeRenderer('Apple M2')) === 'high', 'apple M → high');
assert(Q.detectTier(fakeRenderer('Mali-G52')) === 'low', 'mali → low');
assert(Q.detectTier(fakeRenderer('Some Unknown VendorX 9000')) === 'medium', 'unknown → medium');

// 5) createQuality returns a live tier object; low never carries composer/shadows.
freshBoot();
let changed = null;
const renderer = fakeRenderer('Google SwiftShader');
const qual = Q.createQuality(renderer, { onChange: (q) => { changed = q.tier; } });
assert(typeof qual.tick === 'function', 'qual.tick is a function (watchdog)');
assert(qual.tier === 'low', 'swiftshader device → live tier low');
assert(qual.composer === false && qual.shadows === false && qual.pixelRatio === 1.0, 'low live invariants');

// 6) HARD INVARIANT: forcing low always strips composer/shadows + caps pr at 1.
freshBoot();
const hq = Q.createQuality(fakeRenderer('NVIDIA GeForce RTX 4090'), {});
assert(hq.tier === 'high' && hq.composer === true && hq.shadows === true, 'high device → composer+shadows on');
assert(hq.pixelRatio === 2.0, 'high pixelRatio = min(dpr,2) = 2');
hq.forceTier('low');
assert(hq.tier === 'low' && hq.composer === false && hq.shadows === false && hq.pixelRatio === 1.0, 'forced low strips everything');
hq.forceTier('medium');
assert(hq.tier === 'medium' && hq.composer === true && hq.pixelRatio === 1.5, 'forced medium: composer on, pr 1.5');

// 7) watchdog DEMOTE-ONLY: feed sustained slow frames at high → must step down, never up.
freshBoot();
const wd = Q.createQuality(fakeRenderer('NVIDIA GeForce RTX 4090'), {});
wd.forceTier('high');
assert(wd.tier === 'high', 'watchdog test starts at high');
// Feed exactly enough sustained-slow frames for ONE demotion: the watchdog
// needs SUSTAIN(90) consecutive slow frames AND past the 4s cooldown. After it
// fires once it resets slowRun + cooldown, so a single tight burst steps down
// exactly one tier (high → medium).
let demoted = null;
const wd2 = Q.createQuality(fakeRenderer('NVIDIA GeForce RTX 4090'), { onChange: q => { demoted = q.tier; } });
wd2.forceTier('high');
demoted = null;
for (let i = 0; i < 110; i++) wd2.tick(40); // 25fps for ~4.4s → one demotion
assert(wd2.tier === 'medium', `watchdog demoted high → medium in one burst (got ${wd2.tier})`);
assert(demoted === 'medium', 'onChange fired with the demoted tier');
// feeding fast frames must NOT auto-promote back
for (let i = 0; i < 600; i++) wd2.tick(8);
assert(wd2.tier === 'medium', 'no auto-promote after recovery');
// sustained slowness keeps stepping down until it finds a tier that holds.
for (let i = 0; i < 300; i++) wd.tick(40);
assert(wd.tier === 'low', 'persistent slowness eventually reaches low (never below)');

// 8) low + very-slow → pixelRatio shrink to 0.85, never a tier below low.
freshBoot();
const low = Q.createQuality(fakeRenderer('Google SwiftShader'), {});
assert(low.tier === 'low', 'low start');
for (let i = 0; i < 200; i++) low.tick(30); // ~33fps, below VERY_SLOW(40)
assert(low.tier === 'low', 'low stays low (no tier below)');
assert(low.pixelRatio === 0.85, `low pixelRatio shrunk to 0.85 (got ${low.pixelRatio})`);

console.log('OK — all quality.js contract assertions passed.');
