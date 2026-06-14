// water.js — MODULE D (water half): one subdivided water plane, ONE shader
// material, tier-gated detail. Per-vertex "depth under the surface" is
// pre-sampled from the terrain field so shorelines tint and foam without any
// render-to-texture. Gentle two-wave vertex bob + procedural sparkle — a single
// draw call. Higher tiers ADD detail to the SAME material via compile-time
// #defines + extra uniforms — never a second material.
//
// TIER POSTURE (read `qual` DEFENSIVELY — default = low = today's shader):
//   low    : exactly today's shader (hard branch — no extra uniforms compiled).
//   medium+: animated normal (2 scrolling noise gradients) + view-angle fresnel
//            + a sun-direction glitter highlight (needs uSunDir from sky).
//   high   : additionally a low-res (÷4) PLANAR REFLECTION render target — a
//            mirror camera reflected across the sea plane renders ONLY the sky
//            dome + flagged structures (layer), blended into the surface by the
//            fresnel term. One extra small RT; rendered once per frame BEFORE
//            the main pass by the integrator calling water.updateReflection().
//
// INTEGRATION CONTRACT (the integrator wires these — all optional / defensive):
//   buildWater(scene, field, def, { reducedMotion, qual, sky }) -> {
//     mesh, update(t),                 // update(t) also pulls uSunDir from sky
//     setSunDir(vec3),                 // alt to passing `sky`
//     reflectionLayer,                 // THREE.Layers channel reflected objects must enable (high)
//     needsReflection,                 // bool: true only on high
//     updateReflection(renderer, scene, camera),  // call each frame BEFORE main render (high)
//     dispose()
//   }
//   On medium+/high the integrator should set the water's sun direction every
//   frame (either pass `sky` so update() reads sky.getSunDir(), or call
//   setSunDir(sky.sunDir)). If neither happens, glitter/fresnel still render
//   with a sensible default sun (straight up) — never a crash.
import * as THREE from 'three';
import { QUAL_LOW } from './quality.js';

// Layer index reflected objects opt into (sky dome + structures the world flags
// for reflection). Kept high to avoid colliding with default layer 0.
const REFLECTION_LAYER = 9;

function resolveWater(qual) {
  const q = qual || QUAL_LOW;
  const tier = q.tier || 'low';
  const w = q.water || {};
  if (tier === 'low') return { tier: 'low', normal: false, fresnel: false, glitter: false, reflection: false };
  const med = tier === 'medium' || tier === 'high';
  const high = tier === 'high';
  return {
    tier,
    normal: w.normal ?? med,
    fresnel: w.fresnel ?? med,
    glitter: w.glitter ?? med,
    reflection: w.reflection ?? high,
  };
}

export function buildWater(scene, field, def, { reducedMotion = false, qual = QUAL_LOW, sky = null } = {}) {
  const cfg = def.water;
  const size = def.size * 1.25;
  const segs = 96;
  const Q = resolveWater(qual);

  const geo = new THREE.PlaneGeometry(size, size, segs, segs);
  geo.rotateX(-Math.PI / 2);

  // pre-sample terrain depth at every water vertex (shore tinting + foam)
  const pos = geo.attributes.position;
  const depth = new Float32Array(pos.count);
  for (let i = 0; i < pos.count; i++) {
    const d = def.sea - field.height(pos.getX(i), pos.getZ(i));
    depth[i] = Math.max(0, d);
  }
  geo.setAttribute('aDepth', new THREE.BufferAttribute(depth, 1));

  // --- uniforms (low set is identical to today; detail uniforms added only on
  //     medium+ so the low shader compiles exactly as before) -----------------
  const extra = {};
  if (Q.normal || Q.fresnel || Q.glitter || Q.reflection) {
    extra.uSunDir = { value: new THREE.Vector3(0, 1, 0) };
    extra.uCamPos = { value: new THREE.Vector3() };
  }
  if (Q.glitter) extra.uSunColor = { value: new THREE.Color(0xfff3da) };
  let reflectionRT = null;
  if (Q.reflection) {
    extra.uReflRT = { value: null };
    extra.uReflMatrix = { value: new THREE.Matrix4() };
    extra.uReflMix = { value: 0.5 };
  }

  const uniforms = THREE.UniformsUtils.merge([
    THREE.UniformsLib.fog,
    {
      uTime: { value: 0 },
      uDeep: { value: new THREE.Color(cfg.deep) },
      uShallow: { value: new THREE.Color(cfg.shallow) },
      uOpacity: { value: cfg.opacity },
      uAmp: { value: cfg.waveAmp * (reducedMotion ? 0.35 : 1) },
    },
    extra,
  ]);

  // compile-time feature flags — keeps low shader byte-identical to today.
  const defines = {};
  if (Q.normal) defines.MMW_NORMAL = '';
  if (Q.fresnel) defines.MMW_FRESNEL = '';
  if (Q.glitter) defines.MMW_GLITTER = '';
  if (Q.reflection) defines.MMW_REFLECT = '';

  const mat = new THREE.ShaderMaterial({
    uniforms,
    defines,
    transparent: true,
    depthWrite: false,
    fog: true,
    vertexShader: `
      #include <fog_pars_vertex>
      uniform float uTime, uAmp;
      attribute float aDepth;
      varying float vDepth;
      varying vec3 vPos;
      #if defined(MMW_FRESNEL) || defined(MMW_GLITTER) || defined(MMW_REFLECT)
        uniform vec3 uCamPos;
        varying vec3 vWorld;
        varying vec3 vView;
      #endif
      #ifdef MMW_REFLECT
        uniform mat4 uReflMatrix;
        varying vec4 vReflUv;
      #endif
      void main() {
        vDepth = aDepth;
        vec3 p = position;
        p.y += sin(p.x * 0.045 + uTime * 0.9) * uAmp
              + cos(p.z * 0.06 + uTime * 0.7) * uAmp * 0.8;
        vPos = p;
        vec4 worldPos = modelMatrix * vec4(p, 1.0);
        #if defined(MMW_FRESNEL) || defined(MMW_GLITTER) || defined(MMW_REFLECT)
          vWorld = worldPos.xyz;
          vView = normalize(uCamPos - worldPos.xyz);
        #endif
        #ifdef MMW_REFLECT
          vReflUv = uReflMatrix * worldPos;
        #endif
        vec4 mvPosition = modelViewMatrix * vec4(p, 1.0);
        gl_Position = projectionMatrix * mvPosition;
        #include <fog_vertex>
      }`,
    fragmentShader: `
      #include <fog_pars_fragment>
      uniform vec3 uDeep, uShallow;
      uniform float uTime, uOpacity;
      varying float vDepth;
      varying vec3 vPos;
      #if defined(MMW_FRESNEL) || defined(MMW_GLITTER) || defined(MMW_REFLECT)
        uniform vec3 uSunDir;
        varying vec3 vWorld;
        varying vec3 vView;
      #endif
      #ifdef MMW_GLITTER
        uniform vec3 uSunColor;
      #endif
      #ifdef MMW_REFLECT
        uniform sampler2D uReflRT;
        uniform float uReflMix;
        varying vec4 vReflUv;
      #endif

      float hash(vec2 p) {
        return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
      }
      float vnoise(vec2 p) {
        vec2 i = floor(p), f = fract(p);
        f = f * f * (3.0 - 2.0 * f);
        return mix(mix(hash(i), hash(i + vec2(1, 0)), f.x),
                   mix(hash(i + vec2(0, 1)), hash(i + vec2(1, 1)), f.x), f.y);
      }
      void main() {
        float shore = smoothstep(3.5, 0.4, vDepth);
        vec3 col = mix(uDeep, uShallow, shore);
        // two scrolling noise fields make moving "wavelets"
        float n = vnoise(vPos.xz * 0.16 + vec2(uTime * 0.06, uTime * 0.045))
                + vnoise(vPos.xz * 0.32 - vec2(uTime * 0.05, uTime * 0.08));
        col += vec3(0.10, 0.13, 0.13) * smoothstep(1.18, 1.45, n);

        #ifdef MMW_NORMAL
          // surface normal from two scrolling noise gradients (cheap detail-normal)
          vec2 q1 = vPos.xz * 0.22 + vec2(uTime * 0.07, uTime * 0.05);
          vec2 q2 = vPos.xz * 0.41 - vec2(uTime * 0.06, uTime * 0.09);
          float e = 0.6;
          float c0 = vnoise(q1) * 0.6 + vnoise(q2) * 0.4;
          float cx = vnoise(q1 + vec2(e, 0.0)) * 0.6 + vnoise(q2 + vec2(e, 0.0)) * 0.4;
          float cz = vnoise(q1 + vec2(0.0, e)) * 0.6 + vnoise(q2 + vec2(0.0, e)) * 0.4;
          vec3 nrm = normalize(vec3((c0 - cx) * 1.4, 1.0, (c0 - cz) * 1.4));
        #else
          vec3 nrm = vec3(0.0, 1.0, 0.0);
        #endif

        #if defined(MMW_FRESNEL) || defined(MMW_REFLECT)
          // schlick-ish fresnel: more reflective at grazing angles
          float fres = pow(1.0 - clamp(dot(vView, nrm), 0.0, 1.0), 3.0);
          fres = 0.04 + 0.55 * fres;
        #endif

        #ifdef MMW_REFLECT
          // planar reflection sampled in projected screen space
          vec2 ruv = vReflUv.xy / max(vReflUv.w, 0.0001);
          // small normal-driven ripple distortion
          #ifdef MMW_NORMAL
            ruv += nrm.xz * 0.02;
          #endif
          vec3 refl = texture2D(uReflRT, ruv).rgb;
          col = mix(col, refl, clamp(fres * uReflMix, 0.0, 0.7));
        #elif defined(MMW_FRESNEL)
          // no reflection RT: a cheap sky-tint stand-in toward a bright horizon hue
          vec3 skyTint = mix(uShallow, vec3(0.78, 0.86, 0.92), 0.6);
          col = mix(col, skyTint, fres * 0.45);
        #endif

        #ifdef MMW_GLITTER
          // sun glitter: specular sparkle along the sun reflection vector
          vec3 sd = normalize(uSunDir);
          vec3 h = normalize(sd + vView);
          float spec = pow(max(dot(nrm, h), 0.0), 90.0);
          // break it up with noise so it reads as sparkles, not a mirror disc
          float sparkle = smoothstep(0.6, 1.0, vnoise(vPos.xz * 1.7 + uTime * 0.4));
          col += uSunColor * spec * (0.5 + 0.9 * sparkle) * max(sd.y, 0.0);
        #endif

        // foam line right at the shore
        float foam = smoothstep(0.55, 0.12, vDepth) * (0.55 + 0.45 * sin(uTime * 1.6 + vPos.x * 0.3 + vPos.z * 0.2));
        col = mix(col, vec3(0.92, 0.97, 0.97), foam * 0.5);
        float alpha = uOpacity * mix(0.55, 1.0, smoothstep(0.0, 2.5, vDepth));
        gl_FragColor = vec4(col, alpha);
        #include <fog_fragment>
      }`,
  });

  const mesh = new THREE.Mesh(geo, mat);
  mesh.position.y = def.sea;
  mesh.renderOrder = 2;
  mesh.frustumCulled = false;
  scene.add(mesh);

  // --- high: planar reflection plumbing ------------------------------------
  let reflCamera = null, reflMatrix = null;
  if (Q.reflection) {
    const rw = 512, rh = 512; // ÷4-ish target; small + cheap, mipless
    reflectionRT = new THREE.WebGLRenderTarget(rw, rh, {
      minFilter: THREE.LinearFilter,
      magFilter: THREE.LinearFilter,
      generateMipmaps: false,
      depthBuffer: true,
    });
    reflectionRT.texture.colorSpace = THREE.NoColorSpace; // sample raw, composited in-shader
    uniforms.uReflRT.value = reflectionRT.texture;
    reflCamera = new THREE.PerspectiveCamera();
    reflMatrix = uniforms.uReflMatrix.value;
  }

  // sun direction source (defensive): explicit setSunDir > sky.getSunDir().
  let sunSource = sky;
  const _sd = new THREE.Vector3(0, 1, 0);
  function pullSun() {
    if (!uniforms.uSunDir) return;
    let v = null;
    if (sunSource && typeof sunSource.getSunDir === 'function') v = sunSource.getSunDir();
    else if (sunSource && sunSource.sunDir) v = sunSource.sunDir;
    if (v) _sd.copy(v);
    uniforms.uSunDir.value.copy(_sd);
  }

  // scratch for planar-reflection mirror-camera construction (no per-frame alloc).
  const _view = new THREE.Vector3();
  const _q = new THREE.Quaternion();
  const _position = new THREE.Vector3();
  const _scale = new THREE.Vector3();
  const _lookAtPos = new THREE.Vector3();
  const _rotMat = new THREE.Matrix4();
  const _texMat = new THREE.Matrix4();

  function updateReflection(renderer, scn, camera) {
    if (!Q.reflection || !reflectionRT || !reflCamera) return;
    // --- build the mirror camera (reflected across the sea plane) ----------
    // Standard planar-reflection construction (à la three's Reflector).
    const sea = def.sea;
    reflCamera.copy(camera);
    reflCamera.matrixWorld.copy(camera.matrixWorld);
    reflCamera.matrixWorld.decompose(_position, _q, _scale);

    // reflect camera position across the plane y = sea
    const camY = _position.y;
    _position.y = 2 * sea - camY;

    // reflect orientation: flip the view & up vectors' y component
    _view.set(0, 0, -1).applyQuaternion(_q);
    _view.y = -_view.y;
    _lookAtPos.copy(_position).add(_view);
    const up = new THREE.Vector3(0, 1, 0).applyQuaternion(_q);
    up.y = -up.y; // mirrored up
    _rotMat.lookAt(_position, _lookAtPos, up);
    reflCamera.position.copy(_position);
    reflCamera.quaternion.setFromRotationMatrix(_rotMat);
    reflCamera.updateMatrixWorld();
    reflCamera.matrixWorldInverse.copy(reflCamera.matrixWorld).invert();

    // texture-projection matrix: clip space → [0,1] UV for sampling uReflRT
    _texMat.set(
      0.5, 0.0, 0.0, 0.5,
      0.0, 0.5, 0.0, 0.5,
      0.0, 0.0, 0.5, 0.5,
      0.0, 0.0, 0.0, 1.0
    );
    _texMat.multiply(reflCamera.projectionMatrix);
    _texMat.multiply(reflCamera.matrixWorldInverse);
    reflMatrix.copy(_texMat);

    // --- render ONLY the reflection layer (sky dome + flagged structures) --
    const prevRT = renderer.getRenderTarget();
    const prevMask = camera.layers.mask; // unused; we set reflCamera's layers
    reflCamera.layers.disableAll();
    reflCamera.layers.enable(REFLECTION_LAYER);
    // hide the water itself during the reflection pass
    const wasVisible = mesh.visible;
    mesh.visible = false;
    renderer.setRenderTarget(reflectionRT);
    const prevAutoClear = renderer.autoClear;
    renderer.autoClear = true;
    renderer.clear();
    renderer.render(scn, reflCamera);
    renderer.autoClear = prevAutoClear;
    renderer.setRenderTarget(prevRT);
    mesh.visible = wasVisible;
    void prevMask;
  }

  return {
    mesh,
    reflectionLayer: REFLECTION_LAYER,
    needsReflection: !!Q.reflection,
    setSunDir(v) { sunSource = { sunDir: v }; pullSun(); },
    setSky(s) { sunSource = s; },
    updateReflection,
    // update(t [, camera]) — pulls the sun dir from the sky source each frame and,
    // if a camera is passed, feeds its world position for fresnel/glitter/reflection.
    // camera is optional so the low path (no detail uniforms) stays a pure no-op.
    update(t, camera) {
      uniforms.uTime.value = t;
      if (uniforms.uSunDir) pullSun();
      if (uniforms.uCamPos && camera && camera.position) {
        uniforms.uCamPos.value.copy(camera.position);
      }
    },
    // explicit camera-position feed (alt to passing the camera into update()).
    setCamPos(v) { if (uniforms.uCamPos) uniforms.uCamPos.value.copy(v); },
    dispose() {
      geo.dispose();
      mat.dispose();
      if (reflectionRT) reflectionRT.dispose();
      scene.remove(mesh);
    },
  };
}
