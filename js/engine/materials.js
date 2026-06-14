// materials.js — MODULE C: shared-material detail injectors (no new materials).
//
// Everything here ADDS visual detail to the EXISTING shared materials the
// engine already creates (one terrain MeshStandardMaterial, one scatter
// MeshStandardMaterial, character heads) via `material.onBeforeCompile`.
// We NEVER construct a new MeshStandardMaterial — that would add a draw call
// per system and blow the tier draw-call ceiling. The only allowed canvas
// texture is the tiny shared face texture (≤64px, cached by palette key).
//
// Every injector is GATED by a passed `qual` and is a hard no-op on the `low`
// tier (Chromebook path), so the cheapest device gets exactly today's shader.
// All injectors are pure functions with no engine knowledge: they patch a
// material in place and (where time-driven) return an { update(t) } handle.
//
// Tier flags read defensively (a builder/integrator may call us with no qual):
//   qual.tier            'low' | 'medium' | 'high'
//   qual.terrainDetail   detail-normal + slope/height AO   (medium+)
//   qual.terrainTriplanar triplanar 2-octave blend         (high)
//   qual.vegWind         vertex sway                       (medium+)
// Missing flags fall back to tier-derived defaults, so a bare {tier:'medium'}
// still does the right thing.

import * as THREE from 'three';

// ---------------------------------------------------------------------------
// Safe default qual — a builder called WITHOUT qual behaves exactly as 'low'.
// ---------------------------------------------------------------------------
const LOW_QUAL = Object.freeze({
  tier: 'low',
  terrainDetail: false,
  terrainTriplanar: false,
  vegWind: false,
});

// Normalize a possibly-partial qual into a full flag set. Tier drives the
// defaults; explicit boolean flags win. `low` forces every expensive flag off.
function resolveQual(qual) {
  const q = qual || LOW_QUAL;
  const tier = q.tier || 'low';
  if (tier === 'low') return { tier: 'low', terrainDetail: false, terrainTriplanar: false, vegWind: false };
  const med = tier === 'medium' || tier === 'high';
  const high = tier === 'high';
  return {
    tier,
    terrainDetail: q.terrainDetail ?? med,
    terrainTriplanar: q.terrainTriplanar ?? high,
    vegWind: q.vegWind ?? med,
  };
}

// ---------------------------------------------------------------------------
// Shared GLSL: a 2-octave value-noise. Authored once, injected where needed.
// Deterministic, no textures, cheap enough for the medium tier.
// ---------------------------------------------------------------------------
const NOISE_GLSL = /* glsl */`
  float mmw_hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
  }
  float mmw_vnoise(vec2 p) {
    vec2 i = floor(p), f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    float a = mmw_hash(i);
    float b = mmw_hash(i + vec2(1.0, 0.0));
    float c = mmw_hash(i + vec2(0.0, 1.0));
    float d = mmw_hash(i + vec2(1.0, 1.0));
    return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
  }
  float mmw_fbm2(vec2 p) {
    return mmw_vnoise(p) * 0.65 + mmw_vnoise(p * 2.07 + 19.3) * 0.35;
  }
`;

// ===========================================================================
// applyTerrainDetail(material, qual)
//   medium: 2-octave value-noise detail-normal perturbation + slope/height AO
//           darkening, read from a per-vertex `aSlope` attribute + world pos.
//   high  : additionally triplanar-blends the detail noise so steep faces
//           (cliffs) get the same micro-texture as flats without stretching.
// No-op on low. The terrain builder must add the float `aSlope` attribute and
// pass it through; if absent we fall back to slope=0 (flat → no streaking).
// Returns { update(t) } (time currently unused but reserved + safe to call).
// ===========================================================================
export function applyTerrainDetail(material, qual) {
  const q = resolveQual(qual);
  if (q.tier === 'low' || !q.terrainDetail) {
    return { update() {} }; // hard no-op on low
  }

  const uniforms = { uDetailScale: { value: 0.22 } };
  const triplanar = !!q.terrainTriplanar;

  material.onBeforeCompile = (shader) => {
    shader.uniforms.uDetailScale = uniforms.uDetailScale;

    // --- vertex: forward world position + per-vertex slope to the fragment ---
    shader.vertexShader = shader.vertexShader
      .replace('#include <common>', `#include <common>
        attribute float aSlope;
        varying vec3 vMmwWorld;
        varying float vMmwSlope;`)
      .replace('#include <begin_vertex>', `#include <begin_vertex>
        vMmwWorld = (modelMatrix * vec4(transformed, 1.0)).xyz;
        #ifdef USE_INSTANCING
          vMmwWorld = (modelMatrix * instanceMatrix * vec4(transformed, 1.0)).xyz;
        #endif
        vMmwSlope = aSlope;`);

    // --- fragment: detail-normal perturbation + slope/height AO ---
    shader.fragmentShader = shader.fragmentShader
      .replace('#include <common>', `#include <common>
        ${NOISE_GLSL}
        uniform float uDetailScale;
        varying vec3 vMmwWorld;
        varying float vMmwSlope;`)
      // Perturb the shading normal from the noise gradient AFTER the geometry
      // normal is established but BEFORE lights consume it. <normal_fragment_maps>
      // is the canonical post-normal injection point and keeps shadow/fog chunks
      // untouched.
      .replace('#include <normal_fragment_maps>', `#include <normal_fragment_maps>
      {
        vec2 dp = vMmwWorld.xz * uDetailScale;
        ${triplanar ? `
        // triplanar: blend XZ / XY / ZY noise by world-normal so cliffs don't streak
        vec3 bw = abs(normalize(vMmwWorld - cameraPosition * 0.0 + normal));
        bw = pow(max(abs(normal), 0.0001), vec3(4.0));
        bw /= (bw.x + bw.y + bw.z);
        float nC = mmw_fbm2(vMmwWorld.xz * uDetailScale) * bw.y
                 + mmw_fbm2(vMmwWorld.xy * uDetailScale) * bw.z
                 + mmw_fbm2(vMmwWorld.zy * uDetailScale) * bw.x;
        float e = 0.85;
        float nX = mmw_fbm2(vMmwWorld.xz * uDetailScale + vec2(e, 0.0)) * bw.y
                 + mmw_fbm2(vMmwWorld.xy * uDetailScale + vec2(e, 0.0)) * bw.z
                 + mmw_fbm2(vMmwWorld.zy * uDetailScale + vec2(e, 0.0)) * bw.x;
        float nZ = mmw_fbm2(vMmwWorld.xz * uDetailScale + vec2(0.0, e)) * bw.y
                 + mmw_fbm2(vMmwWorld.xy * uDetailScale + vec2(0.0, e)) * bw.z
                 + mmw_fbm2(vMmwWorld.zy * uDetailScale + vec2(0.0, e)) * bw.x;
        ` : `
        float e = 0.85;
        float nC = mmw_fbm2(dp);
        float nX = mmw_fbm2(dp + vec2(e, 0.0));
        float nZ = mmw_fbm2(dp + vec2(0.0, e));
        `}
        vec3 perturb = normalize(vec3((nC - nX), 0.9, (nC - nZ)));
        normal = normalize(normal + perturb * 0.18);
      }`)
      // Height/slope ambient-occlusion darkening: steep + low-lying ground reads
      // a touch deeper. Injected at <dithering_fragment> (very end), so it never
      // disturbs lighting math, shadows or fog.
      .replace('#include <dithering_fragment>', `
      {
        float slopeAO = 1.0 - clamp(vMmwSlope * 0.5, 0.0, 0.42);
        float hollow  = mmw_fbm2(vMmwWorld.xz * 0.05) * 0.10;
        gl_FragColor.rgb *= (slopeAO - hollow * (1.0 - slopeAO));
      }
      #include <dithering_fragment>`);
  };
  material.needsUpdate = true;

  return {
    update(t) { /* reserved: terrain detail is currently static */ },
  };
}

// ===========================================================================
// applyWind(material, qual)
//   medium+: vertex sway injected into <begin_vertex>. Amplitude scales by the
//            vertex's LOCAL height (so trunks stay planted, canopies sway), and
//            the per-instance phase is derived from the instanceMatrix world
//            translation so a whole forest doesn't sway in lockstep.
//   Amplitude is 0 on low (hard no-op — we don't even patch the shader).
// Returns { update(t), uniforms } — call update(seconds) each frame.
// ===========================================================================
export function applyWind(material, qual) {
  const q = resolveQual(qual);
  if (q.tier === 'low' || !q.vegWind) {
    return { update() {}, uniforms: null }; // hard no-op on low
  }

  const uniforms = {
    uTime: { value: 0 },
    uWindAmp: { value: q.tier === 'high' ? 0.16 : 0.11 },
    uWindFreq: { value: 1.35 },
  };

  material.onBeforeCompile = (shader) => {
    shader.uniforms.uTime = uniforms.uTime;
    shader.uniforms.uWindAmp = uniforms.uWindAmp;
    shader.uniforms.uWindFreq = uniforms.uWindFreq;

    shader.vertexShader = shader.vertexShader
      .replace('#include <common>', `#include <common>
        uniform float uTime;
        uniform float uWindAmp;
        uniform float uWindFreq;`)
      // Sway runs right after <begin_vertex> establishes `transformed` (local
      // space) — height-weighted, per-instance-phased, leaving normals/shadows
      // untouched.
      .replace('#include <begin_vertex>', `#include <begin_vertex>
      {
        float heightW = clamp(transformed.y * 0.45, 0.0, 1.6);
        #ifdef USE_INSTANCING
          float phase = instanceMatrix[3].x * 0.7 + instanceMatrix[3].z * 0.9;
        #else
          float phase = position.x * 0.7 + position.z * 0.9;
        #endif
        float sway = sin(uTime * uWindFreq + phase) * uWindAmp * heightW;
        float gust = cos(uTime * uWindFreq * 0.53 + phase * 1.7) * uWindAmp * 0.5 * heightW;
        transformed.x += sway;
        transformed.z += gust;
      }`);
  };
  material.needsUpdate = true;

  return {
    uniforms,
    update(t) { uniforms.uTime.value = t; },
  };
}

// ===========================================================================
// makeFaceTexture(palette)
//   Returns a SHARED tiny (64px) CanvasTexture of two eyes + a mouth, suitable
//   as a character head map. Cached by a palette key so every NPC with the same
//   palette shares one GPU texture (not per-NPC). `palette` may be a string key
//   or an object { eye, mouth, blush } (hex numbers or css strings).
// ===========================================================================
const _faceCache = new Map();

function _toCss(c, fallback) {
  if (c == null) return fallback;
  if (typeof c === 'number') return '#' + (c & 0xffffff).toString(16).padStart(6, '0');
  return c;
}

export function makeFaceTexture(palette) {
  // Build a stable cache key from the palette so identical palettes share one
  // texture (the whole point — keeps the texture count flat regardless of NPCs).
  let key, eye, mouth, blush;
  if (palette == null || typeof palette === 'string' || typeof palette === 'number') {
    key = 'k:' + (palette ?? 'default');
    eye = '#1a1a22'; mouth = '#7a3b34'; blush = null;
  } else {
    eye = _toCss(palette.eye, '#1a1a22');
    mouth = _toCss(palette.mouth, '#7a3b34');
    blush = _toCss(palette.blush, null);
    key = `o:${eye}|${mouth}|${blush}`;
  }
  const cached = _faceCache.get(key);
  if (cached) return cached;

  const S = 64;
  const canvas = (typeof document !== 'undefined')
    ? document.createElement('canvas')
    : null;

  let tex;
  if (canvas && canvas.getContext) {
    canvas.width = S; canvas.height = S;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, S, S); // transparent — the head's own color shows through

    if (blush) {
      ctx.fillStyle = blush;
      ctx.globalAlpha = 0.5;
      ctx.beginPath(); ctx.ellipse(S * 0.26, S * 0.6, 6, 4, 0, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.ellipse(S * 0.74, S * 0.6, 6, 4, 0, 0, Math.PI * 2); ctx.fill();
      ctx.globalAlpha = 1;
    }

    ctx.fillStyle = eye;
    ctx.beginPath(); ctx.ellipse(S * 0.34, S * 0.44, 4.5, 6, 0, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(S * 0.66, S * 0.44, 4.5, 6, 0, 0, Math.PI * 2); ctx.fill();
    // catch-light
    ctx.fillStyle = '#ffffff';
    ctx.globalAlpha = 0.85;
    ctx.beginPath(); ctx.arc(S * 0.355, S * 0.41, 1.4, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(S * 0.675, S * 0.41, 1.4, 0, Math.PI * 2); ctx.fill();
    ctx.globalAlpha = 1;

    ctx.strokeStyle = mouth;
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.arc(S * 0.5, S * 0.56, 7, 0.18 * Math.PI, 0.82 * Math.PI);
    ctx.stroke();

    tex = new THREE.CanvasTexture(canvas);
  } else {
    // Headless / no-DOM fallback: a 1px data texture so callers never crash.
    tex = new THREE.DataTexture(new Uint8Array([0, 0, 0, 0]), 1, 1, THREE.RGBAFormat);
    tex.needsUpdate = true;
  }
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.minFilter = THREE.LinearFilter;
  tex.magFilter = THREE.LinearFilter;
  tex.generateMipmaps = false;
  tex.name = 'mmw-face';

  _faceCache.set(key, tex);
  return tex;
}

// ===========================================================================
// GRADE_SHADER — a tiny tone/contrast/saturation/vignette grade pass source,
// exported for Module B's composer to use as a final ShaderPass. low never
// builds a composer so this is unused there; provided so B has one canonical
// grade definition rather than re-authoring it.
// ===========================================================================
export const GRADE_SHADER = {
  name: 'MMWGrade',
  uniforms: {
    tDiffuse: { value: null },
    uContrast: { value: 1.06 },
    uSaturation: { value: 1.08 },
    uLift: { value: 0.0 },        // shadow lift
    uVignette: { value: 0.32 },   // 0 = off
    uWarmth: { value: 0.015 },    // slight warm push in highlights
  },
  vertexShader: /* glsl */`
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: /* glsl */`
    uniform sampler2D tDiffuse;
    uniform float uContrast, uSaturation, uLift, uVignette, uWarmth;
    varying vec2 vUv;
    void main() {
      vec4 c = texture2D(tDiffuse, vUv);
      vec3 col = c.rgb;
      // shadow lift
      col = col + uLift * (1.0 - col);
      // contrast around 0.5
      col = (col - 0.5) * uContrast + 0.5;
      // saturation
      float l = dot(col, vec3(0.2126, 0.7152, 0.0722));
      col = mix(vec3(l), col, uSaturation);
      // gentle warm push in the highlights
      col += vec3(uWarmth, uWarmth * 0.4, -uWarmth) * smoothstep(0.5, 1.0, l);
      // vignette
      vec2 d = vUv - 0.5;
      float vig = 1.0 - uVignette * dot(d, d) * 2.4;
      col *= clamp(vig, 0.0, 1.0);
      gl_FragColor = vec4(clamp(col, 0.0, 1.0), c.a);
    }
  `,
};
