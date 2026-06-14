// postfx.js — tier-gated EffectComposer factory for Mr. Mac's Worlds.
//
// PERFORMANCE POSTURE (Chromebook-first):
//   buildPostFX() returns null whenever `qual.composer` is falsy. The `low`
//   tier therefore NEVER constructs a composer or allocates a single
//   render target — the engine renders direct with renderer.render(), exactly
//   as the shipped game does. This is a hard branch, not a flag: on low this
//   module imports nothing expensive and touches no WebGL state.
//
//   medium → RenderPass → UnrealBloom(strength .25, res÷4) → FXAA → grade → OutputPass
//   high   → RenderPass → GTAO(half-res, small radius) → UnrealBloom(.4, res÷2)
//            → SMAA → grade → OutputPass
//
// COLOR / TONE MAP CONTRACT (read by the integrator):
//   r0.161's OutputPass READS renderer.toneMapping + renderer.outputColorSpace
//   and applies them in its final shader. So to keep ACES + sRGB with a
//   composer present, the integrator must leave:
//       renderer.toneMapping     = THREE.ACESFilmicToneMapping
//       renderer.outputColorSpace = THREE.SRGBColorSpace
//   OutputPass then does the ACES tone-map + sRGB encode ONCE, at the end of
//   the chain. RenderPass and the intermediate passes run in linear/HDR space,
//   so there is NO double tone-map. (Do NOT set renderer.toneMapping =
//   NoToneMapping when a composer exists in this three.js version — that would
//   disable ACES entirely. The grade pass below is purely additive contrast/
//   vignette/split-tone and is NOT a tone-mapper.)
//
// BUDGET: this module adds ZERO geometry/draw-call cost to the scene graph
//   (post passes are full-screen quads, counted as GPU time not scene draw
//   calls). Bloom internal res is divided 2–4×; GTAO runs at half device res.
//   dispose() frees every allocated target so the engine can rebuild on a
//   tier demotion without leaking GPU memory.
//
// DEFENSIVE DEFAULT: called without a qual arg (or with qual.composer false),
//   returns null → caller falls back to direct render. Safe before wiring.

import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { FXAAShader } from 'three/addons/shaders/FXAAShader.js';
import { SMAAPass } from 'three/addons/postprocessing/SMAAPass.js';
import { GTAOPass } from 'three/addons/postprocessing/GTAOPass.js';

// ---------------------------------------------------------------------------
// Final grade ShaderPass — vignette + gentle filmic contrast + subtle
// split-tone (cool shadows / warm highlights). Pure in-shader math: no LUT
// texture, no extra render target beyond the ShaderPass ping-pong buffer.
// Runs on the already-ACES-tone-mapped... no — it runs BEFORE OutputPass, so
// it operates in the working (HDR-ish, pre-tone-map) space. We keep the touch
// very light so it reads well after OutputPass applies ACES.
// ---------------------------------------------------------------------------
const GradeShader = {
  name: 'MMWGradeShader',
  uniforms: {
    tDiffuse:     { value: null },
    uVignette:    { value: 0.32 },  // 0 = none … 1 = strong corner darkening
    uContrast:    { value: 1.045 }, // gentle S-curve strength around 0.5
    uSplitTone:   { value: 0.10 },  // cool-shadow / warm-highlight amount
    uSaturation:  { value: 1.04 },  // a hair more colour
  },
  vertexShader: /* glsl */`
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
    }
  `,
  fragmentShader: /* glsl */`
    uniform sampler2D tDiffuse;
    uniform float uVignette;
    uniform float uContrast;
    uniform float uSplitTone;
    uniform float uSaturation;
    varying vec2 vUv;

    void main() {
      vec4 tex = texture2D( tDiffuse, vUv );
      vec3 c = tex.rgb;

      // luminance (Rec.709)
      float l = dot( c, vec3( 0.2126, 0.7152, 0.0722 ) );

      // gentle filmic contrast around mid-grey (pivot 0.5)
      c = ( c - 0.5 ) * uContrast + 0.5;

      // subtle split-tone: push shadows cooler, highlights warmer
      vec3 shadowTint    = vec3( -0.04, 0.0,  0.06 ); // toward teal-blue
      vec3 highlightTint = vec3(  0.05, 0.02, -0.04 ); // toward warm amber
      float hi = smoothstep( 0.35, 0.95, l );
      c += mix( shadowTint, highlightTint, hi ) * uSplitTone;

      // saturation around recomputed luma
      float l2 = dot( c, vec3( 0.2126, 0.7152, 0.0722 ) );
      c = mix( vec3( l2 ), c, uSaturation );

      // smooth radial vignette
      vec2 d = vUv - 0.5;
      float v = 1.0 - dot( d, d ) * ( uVignette * 2.4 );
      c *= clamp( v, 0.0, 1.0 );

      gl_FragColor = vec4( clamp( c, 0.0, 1.0 ), tex.a );
    }
  `,
};

// Resolve the qual flags with a low-safe default. Anything we don't recognise
// is treated as "off" so an under-specified qual can never silently turn on
// an expensive path.
function normQual(qual) {
  const q = qual || {};
  return {
    tier:       q.tier || 'low',
    composer:   !!q.composer,
    bloom:      q.bloom !== false,             // medium+ default on
    aa:         q.aa || (q.tier === 'high' ? 'smaa' : 'fxaa'),
    ssao:       !!q.ssao,                       // high only, off by default
    ssaoForce:  !!q.ssaoForce,                   // expensive GTAO normal-pass — off (busts draw budget)
    grade:      q.grade !== false,             // composer tiers default on
    godrays:    !!q.godrays,                    // high only, opt-in
    motes:      !!q.motes,                      // high only, opt-in
    pixelRatio: q.pixelRatio,                   // composer internal scale
  };
}

/**
 * Build the post-processing chain for the given tier.
 *
 * @param {THREE.WebGLRenderer} renderer
 * @param {THREE.Scene}         scene
 * @param {THREE.Camera}        camera
 * @param {object}              [qual]   tier flags; defaults to low (→ null)
 * @returns {null | {
 *   composer: EffectComposer,
 *   render(dt:number): void,
 *   setSize(w:number, h:number): void,
 *   dispose(): void,
 *   passes: object,            // named passes for debug / live tweaks
 * }}
 */
export function buildPostFX(renderer, scene, camera, qual = { composer: false }) {
  const q = normQual(qual);

  // HARD low-path branch: no composer, no targets, no GL allocation.
  if (!q.composer) return null;

  // composer internal pixel ratio (capped by the tier; never above renderer's)
  const dpr = renderer.getPixelRatio ? renderer.getPixelRatio() : 1;
  const cpr = Math.min(q.pixelRatio || dpr, dpr || 1);

  const size = renderer.getSize ? renderer.getSize(new THREE.Vector2()) : new THREE.Vector2(1, 1);
  const w = Math.max(1, Math.floor(size.x));
  const h = Math.max(1, Math.floor(size.y));

  const composer = new EffectComposer(renderer);
  composer.setPixelRatio(cpr);
  composer.setSize(w, h);

  const passes = {};
  const disposers = [];

  // 1) scene render
  const renderPass = new RenderPass(scene, camera);
  composer.addPass(renderPass);
  passes.render = renderPass;

  // 2) (high) ambient occlusion at HALF the composer resolution, small radius.
  //    GTAO allocates its own depth/normal/AO targets → dispose them on demote.
  //
  //    DRAW-CALL BUDGET: GTAOPass runs an internal NormalPass that RE-RENDERS the
  //    whole scene to a normal buffer — that roughly DOUBLES the per-frame draw
  //    calls and was the dominant reason high busted the ≤180 ceiling. The
  //    contact-AO it provided is now delivered for FREE on every tier by the
  //    cheap vertex/decal AO contact rings under structures/trees/NPCs (see
  //    D1/FIX-4), so the expensive screen-space AO is gated OFF by default. The
  //    pass is kept intact behind an explicit opt-in flag for a future
  //    high-headroom device, but it never counts against the shipped budget.
  if (q.ssao && q.ssaoForce && q.tier === 'high') {
    const aoW = Math.max(1, Math.round((w * cpr) / 2));
    const aoH = Math.max(1, Math.round((h * cpr) / 2));
    // small-radius contact AO; pass tuning via the constructor's
    // aoParameters / pdParameters (the r0.161 API — updateGtaoMaterial /
    // updatePdMaterial under the hood). Keep it cheap and subtle.
    const gtao = new GTAOPass(
      scene, camera, aoW, aoH,
      undefined,
      { radius: 0.18, distanceExponent: 1.0, thickness: 1.0, scale: 1.0, samples: 8 },
      { lumaPhi: 10, depthPhi: 2, normalPhi: 3, radius: 4, rings: 4, samples: 8 },
    );
    try { gtao.output = GTAOPass.OUTPUT.Default; } catch (_) {}
    composer.addPass(gtao);
    passes.gtao = gtao;
    disposers.push(() => { try { gtao.dispose?.(); } catch (_) {} });
  }

  // 3) bloom — divided internal resolution per tier (÷4 medium, ÷2 high).
  if (q.bloom) {
    const div = q.tier === 'high' ? 2 : 4;
    const res = new THREE.Vector2(Math.max(1, w / div), Math.max(1, h / div));
    const strength = q.tier === 'high' ? 0.40 : 0.25;
    const radius = 0.55;
    const threshold = 0.85;
    const bloom = new UnrealBloomPass(res, strength, radius, threshold);
    composer.addPass(bloom);
    passes.bloom = bloom;
    disposers.push(() => { try { bloom.dispose?.(); } catch (_) {} });
  }

  // 4) anti-alias — FXAA (medium) or SMAA (high). Composer pixelRatio < dpr
  //    means MSAA isn't free, so a post AA pass earns its keep.
  if (q.aa === 'smaa' && q.tier === 'high') {
    const smaa = new SMAAPass(w * cpr, h * cpr);
    composer.addPass(smaa);
    passes.smaa = smaa;
    disposers.push(() => { try { smaa.dispose?.(); } catch (_) {} });
  } else if (q.aa) {
    const fxaa = new ShaderPass(FXAAShader);
    fxaa.material.uniforms.resolution.value.set(1 / (w * cpr), 1 / (h * cpr));
    composer.addPass(fxaa);
    passes.fxaa = fxaa;
    // ShaderPass has no targets of its own to dispose beyond material
    disposers.push(() => { try { fxaa.material.dispose?.(); } catch (_) {} });
  }

  // 5) (high, opt-in) god-rays + dust motes overlay — additive, full-screen.
  let godrays = null;
  if (q.godrays && q.tier === 'high') {
    godrays = buildGodrays(camera);
    if (godrays) {
      composer.addPass(godrays.pass);
      passes.godrays = godrays.pass;
      disposers.push(() => godrays.dispose());
    }
  }

  // 6) final grade — vignette + filmic contrast + split-tone (no LUT).
  let gradePass = null;
  if (q.grade) {
    gradePass = new ShaderPass(GradeShader);
    composer.addPass(gradePass);
    passes.grade = gradePass;
    disposers.push(() => { try { gradePass.material.dispose?.(); } catch (_) {} });
  }

  // 7) OutputPass — applies renderer.toneMapping (ACES) + sRGB encode, ONCE.
  const outputPass = new OutputPass();
  composer.addPass(outputPass);
  passes.output = outputPass;

  return {
    composer,
    passes,

    // Call this every frame in place of renderer.render(scene, camera).
    render(dt = 0) {
      if (godrays) godrays.update(dt, camera);
      composer.render(dt);
    },

    // Call on window resize, AFTER renderer.setSize().
    setSize(nw, nh) {
      const W = Math.max(1, Math.floor(nw));
      const H = Math.max(1, Math.floor(nh));
      const r = renderer.getPixelRatio ? renderer.getPixelRatio() : 1;
      const pr = Math.min(q.pixelRatio || r, r || 1);
      composer.setPixelRatio(pr);
      composer.setSize(W, H);
      if (passes.bloom) {
        const div = q.tier === 'high' ? 2 : 4;
        passes.bloom.setSize(Math.max(1, W / div), Math.max(1, H / div));
      }
      if (passes.smaa) passes.smaa.setSize(W * pr, H * pr);
      if (passes.fxaa) passes.fxaa.material.uniforms.resolution.value.set(1 / (W * pr), 1 / (H * pr));
      if (passes.gtao) passes.gtao.setSize(Math.max(1, Math.round((W * pr) / 2)), Math.max(1, Math.round((H * pr) / 2)));
    },

    // Free every allocated target (for tier-demotion rebuilds).
    dispose() {
      for (const d of disposers) { try { d(); } catch (_) {} }
      try { composer.renderTarget1?.dispose(); } catch (_) {}
      try { composer.renderTarget2?.dispose(); } catch (_) {}
      try { composer.dispose?.(); } catch (_) {}
    },
  };
}

// ---------------------------------------------------------------------------
// OPTIONAL: god-rays overlay (high only). Screen-space radial blur from the
// sun's projected position, composited additively. Implemented as a single
// ShaderPass so it adds no scene-graph draw calls — it samples the colour
// buffer the composer already holds. The caller passes the sun's WORLD
// position once via setSunWorldPos(); update() reprojects it each frame.
//
// Kept deliberately self-contained + optional. Returns null if construction
// fails (e.g. missing shader chunk) so the chain degrades gracefully.
// ---------------------------------------------------------------------------
export function buildGodrays(camera, { density = 0.6, weight = 0.18, decay = 0.94, samples = 24 } = {}) {
  const sunNdc = new THREE.Vector3(0.5, 0.85, 0); // screen-space sun (default top-centre)
  const sunWorld = new THREE.Vector3();
  let hasWorld = false;

  const shader = {
    name: 'MMWGodrayShader',
    uniforms: {
      tDiffuse: { value: null },
      uSun:     { value: new THREE.Vector2(0.5, 0.85) },
      uDensity: { value: density },
      uWeight:  { value: weight },
      uDecay:   { value: decay },
      uVisible: { value: 1.0 },
    },
    vertexShader: /* glsl */`
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
      }
    `,
    fragmentShader: /* glsl */`
      uniform sampler2D tDiffuse;
      uniform vec2  uSun;
      uniform float uDensity;
      uniform float uWeight;
      uniform float uDecay;
      uniform float uVisible;
      varying vec2 vUv;
      const int SAMPLES = ${Math.max(8, Math.min(48, samples | 0))};
      void main() {
        vec4 base = texture2D( tDiffuse, vUv );
        vec2 dir = ( vUv - uSun ) * ( uDensity / float( SAMPLES ) );
        vec2 uv = vUv;
        float illum = 1.0;
        vec3 ray = vec3( 0.0 );
        for ( int i = 0; i < SAMPLES; i++ ) {
          uv -= dir;
          vec3 s = texture2D( tDiffuse, uv ).rgb;
          // only bright pixels feed the shafts (cheap luminance gate)
          float l = max( 0.0, dot( s, vec3( 0.2126, 0.7152, 0.0722 ) ) - 0.7 );
          ray += s * l * illum * uWeight;
          illum *= uDecay;
        }
        gl_FragColor = vec4( base.rgb + ray * uVisible, base.a );
      }
    `,
  };

  let pass;
  try {
    pass = new ShaderPass(shader);
  } catch (_) {
    return null;
  }

  return {
    pass,
    setSunWorldPos(v) { sunWorld.copy(v); hasWorld = true; },
    update(_dt, cam) {
      const c = cam || camera;
      if (hasWorld && c) {
        sunNdc.copy(sunWorld).project(c);
        pass.uniforms.uSun.value.set(sunNdc.x * 0.5 + 0.5, sunNdc.y * 0.5 + 0.5);
        // fade out when the sun is behind the camera or off-screen
        pass.uniforms.uVisible.value = (sunNdc.z < 1.0) ? 1.0 : 0.0;
      }
    },
    dispose() { try { pass.material.dispose?.(); } catch (_) {} },
  };
}

// ---------------------------------------------------------------------------
// OPTIONAL: dust motes (high only). A SINGLE additive THREE.Points system
// (one draw call) of slow-drifting sprites that catch the light. This is a
// SCENE object, not a post pass — the caller adds it to the scene and ticks
// update(t). Tier-gated to high; counts as exactly one draw call against the
// 180 ceiling. Uses a tiny shared 32px radial canvas texture (no external
// asset). Returns { points, update(t), dispose() }.
// ---------------------------------------------------------------------------
let _moteTex = null;
function moteTexture() {
  if (_moteTex) return _moteTex;
  const cv = document.createElement('canvas');
  cv.width = cv.height = 32;
  const ctx = cv.getContext('2d');
  const g = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
  g.addColorStop(0, 'rgba(255,255,255,1)');
  g.addColorStop(0.4, 'rgba(255,250,235,0.55)');
  g.addColorStop(1, 'rgba(255,250,235,0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 32, 32);
  _moteTex = new THREE.CanvasTexture(cv);
  _moteTex.colorSpace = THREE.SRGBColorSpace;
  return _moteTex;
}

export function buildMotes({ count = 220, area = 90, height = 18, center = [0, 0, 0], color = 0xfff4d8 } = {}) {
  const n = Math.max(16, count | 0);
  const positions = new Float32Array(n * 3);
  const phases = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    positions[i * 3 + 0] = center[0] + (Math.random() - 0.5) * area;
    positions[i * 3 + 1] = center[1] + Math.random() * height + 1;
    positions[i * 3 + 2] = center[2] + (Math.random() - 0.5) * area;
    phases[i] = Math.random() * Math.PI * 2;
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  const mat = new THREE.PointsMaterial({
    size: 0.35,
    map: moteTexture(),
    color,
    transparent: true,
    opacity: 0.55,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    sizeAttenuation: true,
  });
  const points = new THREE.Points(geo, mat);
  points.frustumCulled = false;
  points.renderOrder = 2;

  return {
    points,
    update(t) {
      const p = geo.attributes.position.array;
      for (let i = 0; i < n; i++) {
        const ph = phases[i];
        p[i * 3 + 0] += Math.sin(t * 0.18 + ph) * 0.004;
        p[i * 3 + 1] += Math.sin(t * 0.11 + ph * 1.7) * 0.003;
        p[i * 3 + 2] += Math.cos(t * 0.15 + ph) * 0.004;
      }
      geo.attributes.position.needsUpdate = true;
    },
    dispose() {
      try { geo.dispose(); } catch (_) {}
      try { mat.dispose(); } catch (_) {}
    },
  };
}
