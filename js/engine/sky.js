// sky.js — gradient sky dome + sun disc + drifting cloud layer + day cycle.
// One ShaderMaterial dome (BackSide, follows the camera), one additive sun
// sprite, one InstancedMesh of soft canvas-texture cloud planes. The slow
// "day drift" eases sun elevation and re-tints sky/fog/lights between a noon
// and a late-afternoon key — subtle, never night, off under reduced motion.
import * as THREE from 'three';
import { mulberry32, subSeed } from '../core/prng.js';

export function buildSky(scene, camera, def, { reducedMotion = false, clouds = 14 } = {}) {
  const skyCfg = def.sky;

  const uniforms = {
    uZenith: { value: new THREE.Color(skyCfg.zenithDay) },
    uHorizon: { value: new THREE.Color(skyCfg.horizonDay) },
    uSunDir: { value: new THREE.Vector3(0, 1, 0) },
    uSunColor: { value: new THREE.Color(skyCfg.sunColor) },
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
        uniform vec3 uZenith, uHorizon, uSunColor, uSunDir;
        varying vec3 vDir;
        void main() {
          float t = pow(clamp(vDir.y, 0.0, 1.0), 0.55);
          vec3 col = mix(uHorizon, uZenith, t);
          float s = clamp(dot(normalize(vDir), normalize(uSunDir)), 0.0, 1.0);
          col += uSunColor * (pow(s, 220.0) * 0.9 + pow(s, 14.0) * 0.22);
          // gentle haze just under the horizon
          col = mix(col, uHorizon * 0.96, smoothstep(0.02, -0.18, vDir.y));
          gl_FragColor = vec4(col, 1.0);
        }`,
    })
  );
  dome.frustumCulled = false;
  dome.renderOrder = -2;
  scene.add(dome);

  // ---- lights ----
  const hemi = new THREE.HemisphereLight(def.light.hemiSky, def.light.hemiGround, def.light.hemiI);
  scene.add(hemi);
  const sun = new THREE.DirectionalLight(def.light.sun, def.light.sunI);
  sun.position.set(80, 120, 40);
  scene.add(sun);
  scene.add(sun.target);

  // ---- fog ----
  scene.fog = new THREE.FogExp2(skyCfg.fogDay, def.fogDensity);

  // ---- clouds: one instanced layer of soft sprites lying flat overhead ----
  const cloudTex = makeCloudTexture(subSeed(def.seed, 'clouds'));
  const cloudGeo = new THREE.PlaneGeometry(1, 1);
  const cloudMat = new THREE.MeshBasicMaterial({
    map: cloudTex, transparent: true, opacity: 0.5, depthWrite: false, fog: false,
  });
  const cloudMesh = new THREE.InstancedMesh(cloudGeo, cloudMat, clouds);
  cloudMesh.frustumCulled = false;
  cloudMesh.renderOrder = -1;
  const rng = mulberry32(subSeed(def.seed, 'cloudpos'));
  const cloudData = [];
  const dummy = new THREE.Object3D();
  for (let i = 0; i < clouds; i++) {
    const c = {
      x: (rng() - 0.5) * def.size * 1.6,
      z: (rng() - 0.5) * def.size * 1.6,
      y: 120 + rng() * 60,
      s: 120 + rng() * 220,
      drift: 1.2 + rng() * 1.6,
      rot: rng() * Math.PI,
    };
    cloudData.push(c);
    placeCloud(i, c);
  }
  function placeCloud(i, c) {
    dummy.position.set(c.x, c.y, c.z);
    dummy.rotation.set(-Math.PI / 2, 0, c.rot);
    dummy.scale.set(c.s, c.s, 1);
    dummy.updateMatrix();
    cloudMesh.setMatrixAt(i, dummy.matrix);
  }
  scene.add(cloudMesh);

  // ---- day cycle state ----
  const colDayZ = new THREE.Color(skyCfg.zenithDay), colDuskZ = new THREE.Color(skyCfg.zenithDusk);
  const colDayH = new THREE.Color(skyCfg.horizonDay), colDuskH = new THREE.Color(skyCfg.horizonDusk);
  const fogDay = new THREE.Color(skyCfg.fogDay), fogDusk = new THREE.Color(skyCfg.fogDusk);
  const sunDir = new THREE.Vector3();

  function update(t) {
    // phase 0 → noon-ish, 1 → late golden hour, eased back and forth
    const phase = reducedMotion ? 0.35 : 0.5 - 0.5 * Math.cos((t / skyCfg.cycleSec) * Math.PI * 2);
    const elev = THREE.MathUtils.lerp(skyCfg.sunElev[1], skyCfg.sunElev[0], phase);
    sunDir.set(
      Math.cos(skyCfg.sunAzim) * Math.cos(elev),
      Math.sin(elev),
      Math.sin(skyCfg.sunAzim) * Math.cos(elev)
    );
    uniforms.uSunDir.value.copy(sunDir);
    uniforms.uZenith.value.lerpColors(colDayZ, colDuskZ, phase);
    uniforms.uHorizon.value.lerpColors(colDayH, colDuskH, phase);
    scene.fog.color.lerpColors(fogDay, fogDusk, phase);

    sun.position.copy(sunDir).multiplyScalar(220).add(camera.position);
    sun.target.position.copy(camera.position);
    sun.intensity = def.light.sunI * (0.86 + 0.14 * (1 - phase));
    hemi.intensity = def.light.hemiI * (0.9 + 0.1 * (1 - phase));

    dome.position.copy(camera.position);
    dome.scale.setScalar(camera.far * 0.92);

    if (!reducedMotion) {
      for (let i = 0; i < cloudData.length; i++) {
        const c = cloudData[i];
        c.x += c.drift * 0.016;
        if (c.x > def.size) c.x = -def.size;
        placeCloud(i, c);
      }
      cloudMesh.instanceMatrix.needsUpdate = true;
    }
  }

  return { update, sun, hemi, sunDir };
}

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
