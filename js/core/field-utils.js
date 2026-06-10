// field-utils.js — pure-math helpers shared by world height/biome fields,
// the terrain mesh builder, the minimap, and the hub map thumbnails.
// No three.js here on purpose: the 2D hub imports this too.

export const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
export const lerp = (a, b, t) => a + (b - a) * t;

export function smoothstep(e0, e1, x) {
  const t = clamp((x - e0) / (e1 - e0), 0, 1);
  return t * t * (3 - 2 * t);
}

// 1 at the center, fading to 0 at radius r (soft = inner fraction held at 1).
export function radialMask(x, z, cx, cz, r, soft = 0.45) {
  const d = Math.hypot(x - cx, z - cz);
  return 1 - smoothstep(r * soft, r, d);
}

// Rotated elliptical mask, 1 inside → 0 outside.
export function ellipseMask(x, z, cx, cz, rx, rz, rot = 0) {
  const c = Math.cos(rot), s = Math.sin(rot);
  const dx = x - cx, dz = z - cz;
  const u = (dx * c - dz * s) / rx;
  const v = (dx * s + dz * c) / rz;
  return 1 - smoothstep(0.55, 1, Math.hypot(u, v));
}

// Distance from point to a segment.
export function segDist(px, pz, ax, az, bx, bz) {
  const dx = bx - ax, dz = bz - az;
  const L2 = dx * dx + dz * dz || 1e-9;
  let t = ((px - ax) * dx + (pz - az) * dz) / L2;
  t = clamp(t, 0, 1);
  const qx = ax + dx * t, qz = az + dz * t;
  return Math.hypot(px - qx, pz - qz);
}

// Build a fast min-distance function to a set of polylines [[ [x,z], ... ], ...].
// Used for rivers (carve), roads (color + smooth) and sandbars (raise).
export function makePolylineDist(polys) {
  const segs = [];
  for (const line of polys) {
    for (let i = 0; i < line.length - 1; i++) {
      segs.push([line[i][0], line[i][1], line[i + 1][0], line[i + 1][1]]);
    }
  }
  return function dist(x, z) {
    let m = Infinity;
    for (let i = 0; i < segs.length; i++) {
      const s = segs[i];
      const d = segDist(x, z, s[0], s[1], s[2], s[3]);
      if (d < m) m = d;
    }
    return m;
  };
}

// ---- color helpers (0..1 float sRGB triplets) ----
export function rgb(hex) {
  return [((hex >> 16) & 255) / 255, ((hex >> 8) & 255) / 255, (hex & 255) / 255];
}

export function mix3(a, b, t, out) {
  out[0] = a[0] + (b[0] - a[0]) * t;
  out[1] = a[1] + (b[1] - a[1]) * t;
  out[2] = a[2] + (b[2] - a[2]) * t;
  return out;
}

export function scale3(a, s, out) {
  out[0] = clamp(a[0] * s, 0, 1);
  out[1] = clamp(a[1] * s, 0, 1);
  out[2] = clamp(a[2] * s, 0, 1);
  return out;
}

// Exact sRGB → linear transfer (three.js vertex colors are linear-space).
export function srgbToLinear(c) {
  return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
}
