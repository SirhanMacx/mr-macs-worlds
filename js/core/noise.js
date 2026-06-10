// noise.js — seeded 2D value noise + fbm + ridged multifractal.
// Pure JS, zero deps, deterministic across devices (integer-hash lattice).
// Quintic interpolation gives smooth C2-continuous fields — good normals.

import { subSeed } from './prng.js';

// Seeded 2D gradient-free value noise in [-1, 1].
export function makeNoise2D(seed) {
  const S = seed | 0;

  function hash(ix, iz) {
    let n = (Math.imul(ix, 374761393) + Math.imul(iz, 668265263)) ^ S;
    n = Math.imul(n ^ (n >>> 13), 1274126177);
    n ^= n >>> 16;
    return (n >>> 0) / 4294967296;
  }

  return function noise(x, z) {
    const ix = Math.floor(x), iz = Math.floor(z);
    const fx = x - ix, fz = z - iz;
    // quintic fade
    const ux = fx * fx * fx * (fx * (fx * 6 - 15) + 10);
    const uz = fz * fz * fz * (fz * (fz * 6 - 15) + 10);
    const a = hash(ix, iz), b = hash(ix + 1, iz);
    const c = hash(ix, iz + 1), d = hash(ix + 1, iz + 1);
    return (a + (b - a) * ux + (c - a) * uz + (a - b - c + d) * ux * uz) * 2 - 1;
  };
}

// Fractal Brownian motion: layered octaves of value noise. Returns ~[-1, 1].
export function makeFbm(seed, { octaves = 5, lacunarity = 2, gain = 0.5, freq = 1 } = {}) {
  const layers = [];
  for (let i = 0; i < octaves; i++) layers.push(makeNoise2D(subSeed(seed, 'oct' + i)));
  return function fbm(x, z) {
    let amp = 1, f = freq, sum = 0, norm = 0;
    for (let i = 0; i < octaves; i++) {
      sum += layers[i](x * f, z * f) * amp;
      norm += amp;
      amp *= gain;
      f *= lacunarity;
    }
    return sum / norm;
  };
}

// Ridged multifractal — sharp mountain crests. Returns [0, 1].
export function makeRidged(seed, { octaves = 4, lacunarity = 2.1, gain = 0.55, freq = 1 } = {}) {
  const layers = [];
  for (let i = 0; i < octaves; i++) layers.push(makeNoise2D(subSeed(seed, 'ridge' + i)));
  return function ridged(x, z) {
    let amp = 0.6, f = freq, sum = 0, norm = 0, w = 1;
    for (let i = 0; i < octaves; i++) {
      let n = 1 - Math.abs(layers[i](x * f, z * f));
      n = n * n * w;
      w = Math.min(1, Math.max(0, n * 2));
      sum += n * amp;
      norm += amp;
      amp *= gain;
      f *= lacunarity;
    }
    return sum / norm;
  };
}
