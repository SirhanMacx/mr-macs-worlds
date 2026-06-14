// sky.js — MODULE D (sky half): gradient sky dome + sun/moon disc + drifting
// cloud layer(s) + a day→dusk→night cycle. One ShaderMaterial dome (BackSide,
// follows the camera), one additive sun sprite, one (medium+ two) InstancedMesh
// of soft canvas-texture cloud planes, and an optional high-tier god-ray cone.
//
// TIER POSTURE (read `qual` DEFENSIVELY — default = low = today's look):
//   • The 3-stop horizon→mid→zenith gradient + softer sun halo improve on ALL
//     tiers (pure shader math, no extra targets, no new draw calls) — low gets
//     a nicer sky for free.
//   • A slow night phase (dusk-blue dip + a moon term + an exported nightFactor
//     for emissive windows) runs on ALL tiers; it is colour-lerp + a cheap moon
//     dot in the existing dome shader, so it costs nothing extra. (Honoured even
//     under reducedMotion via a fixed daytime phase — no flashing.)
//   • medium+  : a 2nd, higher/slower cloud band (one extra InstancedMesh = 1
//     draw call, within the 130 ceiling).
//   • high     : a god-ray cone mesh anchored at the sun (1 additive draw call),
//     a cheap volumetric-shaft fake that complements postfx's screen-space rays.
//
// Per-biome warm/cool lighting comes straight from each world's `def.light` and
// `def.sky` (already authored per world). We add OPTIONAL night colour fields
// (def.sky.nightZenith / nightHorizon / fogNight / moonColor) with safe derived
// fallbacks so existing world defs need no edits.
//
// EXPORTS for the integrator + water:
//   buildSky(scene, camera, def, { reducedMotion, clouds, qual }) -> {
//     update(t), sun, hemi, sunDir, getSunDir(), getNightFactor(),
//     nightFactor   // live number, also returned each frame via getNightFactor()
//   }
//   sunDir / getSunDir() feed water.js (uSunDir) for fresnel + glitter.
//   getNightFactor() (0 = full day … 1 = deep night) drives emissive windows.
import * as THREE from 'three';
import { mulberry32, subSeed } from '../core/prng.js';
import { QUAL_LOW } from './quality.js';

// Resolve the sky-relevant tier flags with a low-safe default so a builder
// called before the integrator wires `qual` behaves exactly as today.
function resolveSky(qual) {
  const q = qual || QUAL_LOW;
  const tier = q.tier || 'low';
  const sky = q.sky || {};
  if (tier === 'low') return { tier: 'low', clouds2: false, night: true, godRays: false };
  const med = tier === 'medium' || tier === 'high';
  const high = tier === 'high';
  return {
    tier,
    clouds2: sky.clouds ?? med,     // 2nd cloud band
    night: sky.night ?? true,       // night phase (on all tiers — cheap)
    godRays: sky.godRays ?? high,   // god-ray cone (high only)
  };
}

export function buildSky(scene, camera, def, { reducedMotion = false, clouds = 14, qual = QUAL_LOW } = {}) {
  const skyCfg = def.sky;
  const Q = resolveSky(qual);

  // ---- per-biome night colours (optional fields, derived if absent) -------
  const dayZenith = new THREE.Color(skyCfg.zenithDay);
  const dayHorizon = new THREE.Color(skyCfg.horizonDay);
  // Night zenith: a deep, slightly biome-tinted blue. Derive from the dusk
  // zenith pushed dark+blue so each world keeps its mood at night.
  const nightZenith = skyCfg.nightZenith != null
    ? new THREE.Color(skyCfg.nightZenith)
    : new THREE.Color(skyCfg.zenithDusk).lerp(new THREE.Color(0x0a1430), 0.72);
  const nightHorizon = skyCfg.nightHorizon != null
    ? new THREE.Color(skyCfg.nightHorizon)
    : new THREE.Color(skyCfg.horizonDusk).lerp(new THREE.Color(0x1a2244), 0.62);
  const fogNight = skyCfg.fogNight != null
    ? new THREE.Color(skyCfg.fogNight)
    : new THREE.Color(skyCfg.fogDusk).lerp(new THREE.Color(0x121a30), 0.66);
  const moonColor = new THREE.Color(skyCfg.moonColor != null ? skyCfg.moonColor : 0xbcc6e6);

  const uniforms = {
    uZenith: { value: dayZenith.clone() },
    uHorizon: { value: dayHorizon.clone() },
    // mid-band tint = midpoint of horizon/zenith, slightly desaturated toward
    // a soft sky-grey so the 3-stop gradient reads atmospheric, not banded.
    uMid: { value: dayHorizon.clone().lerp(dayZenith, 0.5).lerp(new THREE.Color(0xc9d6e2), 0.18) },
    uSunDir: { value: new THREE.Vector3(0, 1, 0) },
    uMoonDir: { value: new THREE.Vector3(0, -1, 0) },
    uSunColor: { value: new THREE.Color(skyCfg.sunColor) },
    uMoonColor: { value: moonColor },
    uNight: { value: 0 },        // 0 day … 1 night — dims sun halo, lifts moon/stars
    uHazeColor: { value: dayHorizon.clone() },
  };

  const dome = new THREE.Mesh(
    new THREE.SphereGeometry(1, 24, 16),
    new THREE.ShaderMaterial({
      uniforms,
      side: THREE.BackSide,
      depthWrite: false,
      fog: false,
      vertexShader: `
        varying vec3 vDir;
        void main() {
          vDir = normalize(position);
          vec4 mv = modelViewMatrix * vec4(position, 1.0);
          gl_Position = projectionMatrix * mv;
        }`,
      fragmentShader: `
        uniform vec3 uZenith, uMid, uHorizon, uSunColor, uMoonColor, uSunDir, uMoonDir, uHazeColor;
        uniform float uNight;
        varying vec3 vDir;
        // cheap hash for a faint star sparkle (night only)
        float hash3(vec3 p){ return fract(sin(dot(p, vec3(127.1,311.7,74.7))) * 43758.5453); }
        void main() {
          float y = clamp(vDir.y, 0.0, 1.0);
          // 3-stop gradient: horizon -> mid (low sky) -> zenith. Two eased
          // mixes give a soft horizon glow that lifts into deep zenith.
          float tLow = pow(y, 0.42);              // horizon -> mid, quick near ground
          float tHigh = smoothstep(0.18, 1.0, y); // mid -> zenith, gentle up top
          vec3 col = mix(uHorizon, uMid, tLow);
          col = mix(col, uZenith, tHigh);

          // softer, two-lobe sun halo: a tight disc + a wide warm bloom.
          float s = clamp(dot(normalize(vDir), normalize(uSunDir)), 0.0, 1.0);
          float disc = pow(s, 320.0);
          float halo = pow(s, 16.0) * 0.26 + pow(s, 4.0) * 0.07;
          float dayMask = 1.0 - uNight;
          col += uSunColor * (disc * 0.95 + halo) * dayMask;

          // moon: a soft cool disc + faint glow, lifted in at night.
          float m = clamp(dot(normalize(vDir), normalize(uMoonDir)), 0.0, 1.0);
          float moonDisc = pow(m, 900.0);
          float moonGlow = pow(m, 22.0) * 0.18;
          col += uMoonColor * (moonDisc * 0.85 + moonGlow) * uNight;

          // faint stars high in the dome at night (no texture).
          if (uNight > 0.05 && y > 0.25) {
            vec3 sp = floor(vDir * 130.0);
            float st = hash3(sp);
            float star = step(0.9975, st) * smoothstep(0.25, 0.7, y);
            col += vec3(0.9, 0.92, 1.0) * star * uNight * 0.8;
          }

          // gentle haze just under the horizon (warm by day, cool by night).
          col = mix(col, uHazeColor * 0.96, smoothstep(0.02, -0.18, vDir.y));
          gl_FragColor = vec4(col, 1.0);
        }`,
    })
  );
  dome.frustumCulled = false;
  dome.renderOrder = -2;
  scene.add(dome);

  // ---- lights (per-biome warm/cool from def.light) ------------------------
  const hemi = new THREE.HemisphereLight(def.light.hemiSky, def.light.hemiGround, def.light.hemiI);
  scene.add(hemi);
  const sun = new THREE.DirectionalLight(def.light.sun, def.light.sunI);
  sun.position.set(80, 120, 40);
  scene.add(sun);
  scene.add(sun.target);
  // cool night key colour for the directional light (moonlight)
  const sunDayColor = new THREE.Color(def.light.sun);
  const sunNightColor = new THREE.Color(def.light.sun).lerp(moonColor, 0.85);
  const hemiSkyDay = new THREE.Color(def.light.hemiSky);
  const hemiSkyNight = new THREE.Color(def.light.hemiSky).lerp(new THREE.Color(0x223055), 0.7);
  const hemiGroundDay = new THREE.Color(def.light.hemiGround);
  const hemiGroundNight = new THREE.Color(def.light.hemiGround).lerp(new THREE.Color(0x14182a), 0.66);

  // ---- fog ----
  scene.fog = new THREE.FogExp2(skyCfg.fogDay, def.fogDensity);
  const fogDay = new THREE.Color(skyCfg.fogDay), fogDusk = new THREE.Color(skyCfg.fogDusk);

  // ---- clouds: one (low) or two (medium+) instanced bands of soft sprites --
  const cloudTex = makeCloudTexture(subSeed(def.seed, 'clouds'));
  const cloudGeo = new THREE.PlaneGeometry(1, 1);
  const cloudMat = new THREE.MeshBasicMaterial({
    map: cloudTex, transparent: true, opacity: 0.5, depthWrite: false, fog: false,
  });

  // a band = { mesh, data[], y, sizeBase, sizeVar, driftBase, driftVar, opacity }
  const bands = [];
  function makeBand(count, opts) {
    const mat = opts.shareMat ? cloudMat : cloudMat.clone();
    if (!opts.shareMat) mat.opacity = opts.opacity;
    const mesh = new THREE.InstancedMesh(cloudGeo, mat, count);
    mesh.frustumCulled = false;
    mesh.renderOrder = -1;
    const rng = mulberry32(subSeed(def.seed, opts.seedLabel));
    const data = [];
    const dummy = new THREE.Object3D();
    for (let i = 0; i < count; i++) {
      const c = {
        x: (rng() - 0.5) * def.size * 1.6,
        z: (rng() - 0.5) * def.size * 1.6,
        y: opts.y + rng() * opts.yVar,
        s: opts.sizeBase + rng() * opts.sizeVar,
        drift: opts.driftBase + rng() * opts.driftVar,
        rot: rng() * Math.PI,
      };
      data.push(c);
      place(dummy, mesh, i, c);
    }
    bands.push({ mesh, data, dummy });
    scene.add(mesh);
    return mesh;
  }
  function place(dummy, mesh, i, c) {
    dummy.position.set(c.x, c.y, c.z);
    dummy.rotation.set(-Math.PI / 2, 0, c.rot);
    dummy.scale.set(c.s, c.s, 1);
    dummy.updateMatrix();
    mesh.setMatrixAt(i, dummy.matrix);
  }

  // primary band (matches today's look)
  makeBand(clouds, {
    shareMat: true, seedLabel: 'cloudpos',
    y: 120, yVar: 60, sizeBase: 120, sizeVar: 220, driftBase: 1.2, driftVar: 1.6,
  });
  // medium+ : a higher, larger, slower secondary band for depth.
  if (Q.clouds2) {
    const n2 = Math.max(4, Math.round(clouds * 0.55));
    makeBand(n2, {
      shareMat: false, opacity: 0.32, seedLabel: 'cloudpos2',
      y: 185, yVar: 70, sizeBase: 220, sizeVar: 300, driftBase: 0.5, driftVar: 0.8,
    });
  }

  // ---- high: god-ray cone anchored at the sun (one additive draw call) -----
  // A thin downward cone of additive, vertically-faded haze that brightens
  // when the sun is high and clear — a cheap volumetric complement to postfx's
  // screen-space god-rays. Pure shader, no targets. Gated to high.
  let godCone = null, godUniforms = null;
  if (Q.godRays) {
    godUniforms = {
      uColor: { value: new THREE.Color(skyCfg.sunColor) },
      uStrength: { value: 0.0 },
    };
    const coneGeo = new THREE.ConeGeometry(140, 360, 18, 1, true);
    coneGeo.translate(0, -180, 0); // apex up, opening down toward the ground
    godCone = new THREE.Mesh(
      coneGeo,
      new THREE.ShaderMaterial({
        uniforms: godUniforms,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        side: THREE.DoubleSide,
        fog: false,
        vertexShader: `
          varying float vY;
          void main() {
            vY = clamp((position.y + 180.0) / 360.0, 0.0, 1.0); // 1 at apex, 0 at base
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }`,
        fragmentShader: `
          uniform vec3 uColor; uniform float uStrength;
          varying float vY;
          void main() {
            // fade from apex (bright) to base, soft radial falloff implied by cone
            float a = pow(vY, 1.6) * uStrength;
            gl_FragColor = vec4(uColor, a * 0.22);
          }`,
      })
    );
    godCone.frustumCulled = false;
    godCone.renderOrder = -1;
    scene.add(godCone);
  }

  // ---- day → dusk → night cycle state -------------------------------------
  const colDayZ = dayZenith, colDuskZ = new THREE.Color(skyCfg.zenithDusk);
  const colDayH = dayHorizon, colDuskH = new THREE.Color(skyCfg.horizonDusk);
  const sunDir = new THREE.Vector3();
  const moonDir = new THREE.Vector3();
  // scratch colours (avoid per-frame allocation)
  const cZ = new THREE.Color(), cH = new THREE.Color(), cMid = new THREE.Color(), cFog = new THREE.Color();
  let nightFactor = 0;

  function update(t) {
    // A full slow cycle: phase walks 0(noon) → 1(golden) → (night) → back.
    // We map a 0..1 "clock" onto a noon→dusk→night→dawn loop so the world
    // breathes through a real night without ever sitting in darkness too long.
    // reducedMotion: pin to a pleasant late-afternoon, no night flicker.
    let dayPhase, night;
    if (reducedMotion || !Q.night) {
      dayPhase = 0.35;     // late-afternoon key
      night = 0.0;
    } else {
      // clock in [0,1): 0..0.45 day↔dusk, 0.45..0.78 night, 0.78..1 dawn back to day
      const clock = ((t / skyCfg.cycleSec) % 1 + 1) % 1;
      if (clock < 0.45) {
        dayPhase = clock / 0.45;          // 0 noon → 1 golden hour
        night = 0.0;
      } else if (clock < 0.62) {
        dayPhase = 1.0;
        night = smoothstep01((clock - 0.45) / 0.17); // dusk → night
      } else if (clock < 0.78) {
        dayPhase = 1.0;
        night = 1.0;                       // deep night
      } else {
        dayPhase = 1.0 - (clock - 0.78) / 0.22 * 1.0; // golden → noon over dawn
        night = 1.0 - smoothstep01((clock - 0.78) / 0.22); // night → dawn
      }
    }
    nightFactor = night;

    // sun elevation: ride from the noon..dusk authored band, then dip below
    // the horizon as night deepens (so the sun disc actually sets).
    const dayElev = THREE.MathUtils.lerp(skyCfg.sunElev[1], skyCfg.sunElev[0], dayPhase);
    const elev = dayElev - night * (dayElev + 0.35); // dips to ~ -0.35 at full night
    sunDir.set(
      Math.cos(skyCfg.sunAzim) * Math.cos(elev),
      Math.sin(elev),
      Math.sin(skyCfg.sunAzim) * Math.cos(elev)
    );
    // moon opposite-ish the sun, riding up as the sun sets.
    const moonElev = -elev * 0.8 + 0.15;
    const moonAzim = skyCfg.sunAzim + Math.PI * 0.85;
    moonDir.set(
      Math.cos(moonAzim) * Math.cos(moonElev),
      Math.sin(moonElev),
      Math.sin(moonAzim) * Math.cos(moonElev)
    );
    uniforms.uSunDir.value.copy(sunDir);
    uniforms.uMoonDir.value.copy(moonDir);
    uniforms.uNight.value = night;

    // sky colours: day↔dusk lerp, then crossfade into the night palette.
    cZ.lerpColors(colDayZ, colDuskZ, dayPhase).lerp(nightZenith, night);
    cH.lerpColors(colDayH, colDuskH, dayPhase).lerp(nightHorizon, night);
    cMid.copy(cH).lerp(cZ, 0.5).lerp(skyMidGrey, 0.16);
    cFog.lerpColors(fogDay, fogDusk, dayPhase).lerp(fogNight, night);
    uniforms.uZenith.value.copy(cZ);
    uniforms.uHorizon.value.copy(cH);
    uniforms.uMid.value.copy(cMid);
    uniforms.uHazeColor.value.copy(cH);
    scene.fog.color.copy(cFog);

    // light placement + intensity (warm day → cool dim night).
    sun.position.copy(sunDir).multiplyScalar(220).add(camera.position);
    sun.target.position.copy(camera.position);
    const dayDim = 0.86 + 0.14 * (1 - dayPhase);
    sun.intensity = def.light.sunI * dayDim * (1 - 0.78 * night); // moonlight ~ 22%
    sun.color.copy(sunDayColor).lerp(sunNightColor, night);
    hemi.intensity = def.light.hemiI * (0.9 + 0.1 * (1 - dayPhase)) * (1 - 0.62 * night);
    hemi.color.copy(hemiSkyDay).lerp(hemiSkyNight, night);
    hemi.groundColor.copy(hemiGroundDay).lerp(hemiGroundNight, night);

    dome.position.copy(camera.position);
    dome.scale.setScalar(camera.far * 0.92);

    // god-ray cone: anchor at the sun direction, fade with sun height + clarity.
    if (godCone && godUniforms) {
      const dist = camera.far * 0.5;
      godCone.position.copy(sunDir).multiplyScalar(dist).add(camera.position);
      // Align the cone's local +Y (apex→base axis) with the sun direction so the
      // apex sits up at the sun and the flare streams down toward the ground.
      _gcQuat.setFromUnitVectors(_gcUp, _gcTarget.copy(sunDir).normalize());
      godCone.quaternion.copy(_gcQuat);
      // strength: brightest when sun is mid-high, killed at night.
      const h = Math.max(0, sunDir.y);
      godUniforms.uStrength.value = THREE.MathUtils.clamp(h * 1.6, 0, 1) * (1 - night);
      godUniforms.uColor.value.copy(uniforms.uSunColor.value);
      godCone.visible = godUniforms.uStrength.value > 0.01;
    }

    // cloud drift (skipped under reducedMotion). Clouds dim into night.
    if (!reducedMotion) {
      for (let b = 0; b < bands.length; b++) {
        const band = bands[b];
        const speed = (b === 0) ? 0.016 : 0.010;
        for (let i = 0; i < band.data.length; i++) {
          const c = band.data[i];
          c.x += c.drift * speed;
          if (c.x > def.size) c.x = -def.size;
          place(band.dummy, band.mesh, i, c);
        }
        band.mesh.instanceMatrix.needsUpdate = true;
        // night dimming on the cloud material(s)
        const baseOp = (b === 0) ? 0.5 : 0.32;
        band.mesh.material.opacity = baseOp * (1 - 0.55 * night);
      }
    }
  }

  return {
    update,
    sun,
    hemi,
    sunDir,
    getSunDir: () => sunDir,
    getNightFactor: () => nightFactor,
    get nightFactor() { return nightFactor; },
  };
}

const skyMidGrey = new THREE.Color(0xc9d6e2);
const _gcTarget = new THREE.Vector3();
const _gcUp = new THREE.Vector3(0, 1, 0);   // cone local apex→base axis
const _gcQuat = new THREE.Quaternion();
function smoothstep01(x) { x = Math.min(1, Math.max(0, x)); return x * x * (3 - 2 * x); }

// Soft procedural cloud blob texture (seeded, no assets).
function makeCloudTexture(seed) {
  const rng = mulberry32(seed);
  const c = document.createElement('canvas');
  c.width = c.height = 128;
  const ctx = c.getContext('2d');
  ctx.clearRect(0, 0, 128, 128);
  for (let i = 0; i < 11; i++) {
    const x = 26 + rng() * 76, y = 40 + rng() * 48, r = 12 + rng() * 24;
    const g = ctx.createRadialGradient(x, y, 0, x, y, r);
    g.addColorStop(0, 'rgba(255,255,255,0.55)');
    g.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = g;
    ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill();
  }
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}
