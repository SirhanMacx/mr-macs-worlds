// prng.js — deterministic seeded randomness for Mr. Mac's Worlds.
// mulberry32: tiny, fast, good distribution. Same seed → same world, every visit,
// on every device (only 32-bit integer ops, identical across JS engines).

export function mulberry32(seed) {
  let a = seed >>> 0;
  return function () {
    a |= 0; a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// FNV-1a string hash → 32-bit uint. Used to derive stable sub-seeds by label.
export function hashStr(s) {
  let h = 0x811c9dc5;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

// Derive an independent stream seed from a master seed + label.
// Changing tree placement must never reshuffle the mountains.
export function subSeed(seed, label) {
  return (hashStr(label) ^ Math.imul(seed >>> 0, 0x9E3779B1)) >>> 0;
}
