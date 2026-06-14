// scatter.js — deterministic instanced vegetation and props.
// Each flora rule becomes ONE InstancedMesh (one draw call). Placement is
// rejection-sampled with the world's seeded PRNG against the field probe
// (biome weights, slope/height limits, keep-out radii around stations and
// roads) — identical layout on every device, every visit.
//
// GRAPHICS OVERHAUL (Module E):
//   • Tree canopies are subdivided (rounder silhouettes) for a softer profile.
//   • 3 new instanced archetypes — broadleaf (layered canopy), flowerShrub
//     (flowering bush), tallGrass (waving blades) — each still ONE InstancedMesh
//     (one draw call). They ship at medium+ via qual.veg.species, with counts
//     scaled by qual.veg.countMul, so low is byte-for-byte today's flora set.
//   • The shared veg materials get materials.applyWind (amplitude 0 on low) so
//     canopies/blades sway on medium/high without any new material.
//   • Far instances alpha-fade in (medium+) instead of hard-popping; on low the
//     materials stay opaque (no transparency state change at all).
import * as THREE from 'three';
import { mulberry32, subSeed } from '../core/prng.js';
import { bakeParts } from './geo-kit.js';
import { applyWind, applyGrade } from './materials.js';
import { QUAL_LOW } from './quality.js';

// ---------- archetype geometry builders (vertex-colored, merged) ----------
// Canopies use IcosahedronGeometry(detail:1) — 80 tris vs 20 — for a rounder,
// less faceted blob at a negligible cost (still one merged geometry per kind).
const A = {
  treeRound: () => bakeParts([
    { geo: new THREE.CylinderGeometry(0.14, 0.22, 1.7, 6), color: 0x6e4f2f, y: 0.85 },
    { geo: new THREE.IcosahedronGeometry(1.18, 1), color: 0x4e7e3a, y: 2.3, sy: 0.92 },
    { geo: new THREE.IcosahedronGeometry(0.82, 1), color: 0x5e9447, x: 0.5, y: 2.95, z: 0.25 },
    { geo: new THREE.IcosahedronGeometry(0.6, 1), color: 0x6aa352, x: -0.42, y: 2.7, z: -0.3 },
  ]),
  glowTree: () => bakeParts([
    { geo: new THREE.CylinderGeometry(0.14, 0.22, 1.8, 6), color: 0x4a3b56, y: 0.9 },
    { geo: new THREE.IcosahedronGeometry(1.22, 1), color: 0x2f8f7a, y: 2.5, sy: 0.94 },
    { geo: new THREE.IcosahedronGeometry(0.8, 1), color: 0x3fae90, x: -0.45, y: 3.1, z: 0.3 },
  ]),
  treeCone: () => bakeParts([
    { geo: new THREE.CylinderGeometry(0.12, 0.2, 1.1, 6), color: 0x53404f, y: 0.55 },
    { geo: new THREE.ConeGeometry(1.05, 2.4, 8), color: 0x2c5e54, y: 2.2 },
    { geo: new THREE.ConeGeometry(0.75, 1.8, 8), color: 0x356d5e, y: 3.5 },
  ]),
  cypress: () => bakeParts([
    { geo: new THREE.CylinderGeometry(0.1, 0.16, 0.8, 6), color: 0x5d452a, y: 0.4 },
    { geo: new THREE.ConeGeometry(0.62, 3.6, 8), color: 0x3a6b3e, y: 2.5 },
  ]),
  treeFlat: () => bakeParts([
    { geo: new THREE.CylinderGeometry(0.12, 0.2, 2.1, 6), color: 0x73512c, y: 1.05, rz: 0.1 },
    { geo: new THREE.IcosahedronGeometry(1.55, 1), color: 0x6e8a3c, y: 2.6, sy: 0.4 },
  ]),
  // --- new archetypes (medium+) -------------------------------------------
  // Broadleaf: a stout trunk under a wide, layered three-lobe canopy — a fuller,
  // shade-tree silhouette distinct from the single-blob treeRound.
  broadleaf: () => bakeParts([
    { geo: new THREE.CylinderGeometry(0.18, 0.3, 2.0, 6), color: 0x6b4a2c, y: 1.0 },
    { geo: new THREE.IcosahedronGeometry(1.5, 1), color: 0x49773a, y: 2.7, sy: 0.78 },
    { geo: new THREE.IcosahedronGeometry(1.05, 1), color: 0x588d44, x: 0.7, y: 3.3, z: 0.3, sy: 0.85 },
    { geo: new THREE.IcosahedronGeometry(1.0, 1), color: 0x568a42, x: -0.65, y: 3.2, z: -0.35, sy: 0.85 },
    { geo: new THREE.IcosahedronGeometry(0.7, 1), color: 0x65a050, y: 3.9 },
  ]),
  // Flowering shrub: a green mound dotted with bright petals — a splash of color
  // along meadows/roadsides.
  flowerShrub: () => bakeParts([
    { geo: new THREE.IcosahedronGeometry(0.7, 1), color: 0x4f7a3c, y: 0.5, sy: 0.78 },
    { geo: new THREE.IcosahedronGeometry(0.5, 1), color: 0x5c8a46, x: 0.45, y: 0.42, z: 0.2, sy: 0.7 },
    { geo: new THREE.IcosahedronGeometry(0.12, 0), color: 0xe86a8a, x: 0.18, y: 0.95, z: 0.1 },
    { geo: new THREE.IcosahedronGeometry(0.11, 0), color: 0xf0c24a, x: -0.28, y: 0.86, z: -0.18 },
    { geo: new THREE.IcosahedronGeometry(0.1, 0), color: 0xe86a8a, x: 0.4, y: 0.7, z: -0.3 },
    { geo: new THREE.IcosahedronGeometry(0.1, 0), color: 0xede0f0, x: -0.05, y: 1.0, z: 0.35 },
  ]),
  // Tall grass: a clutch of slim blades that sway noticeably under the wind
  // injector (its blades reach high so the height-weighted sway bends the tips).
  tallGrass: () => bakeParts([
    { geo: new THREE.ConeGeometry(0.06, 1.7, 3, 1, true), color: 0x7da352, y: 0.85, rz: 0.06 },
    { geo: new THREE.ConeGeometry(0.05, 1.5, 3, 1, true), color: 0x8fb15e, x: 0.16, y: 0.75, rz: -0.12, ry: 1.1 },
    { geo: new THREE.ConeGeometry(0.05, 1.3, 3, 1, true), color: 0x83a957, x: -0.14, y: 0.65, rz: 0.14, ry: 2.2 },
    { geo: new THREE.ConeGeometry(0.045, 1.1, 3, 1, true), color: 0x96b865, x: 0.05, y: 0.55, z: 0.18, ry: 0.6 },
  ]),
  palm: () => {
    const parts = [
      { geo: new THREE.CylinderGeometry(0.13, 0.2, 1.4, 5), color: 0x8a6a3e, y: 0.7, rz: 0.14 },
      { geo: new THREE.CylinderGeometry(0.11, 0.14, 1.3, 5), color: 0x97754a, x: 0.18, y: 1.95, rz: 0.2 },
    ];
    for (let i = 0; i < 6; i++) {
      const a = (i / 6) * Math.PI * 2;
      parts.push({
        geo: new THREE.ConeGeometry(0.22, 1.9, 4),
        color: i % 2 ? 0x4d8a40 : 0x5d9c4c,
        x: 0.34 + Math.cos(a) * 0.75, y: 2.62, z: Math.sin(a) * 0.75,
        rx: Math.sin(a) * 1.35, rz: -Math.cos(a) * 1.35, sy: 0.5,
      });
    }
    return bakeParts(parts);
  },
  rock: () => bakeParts([
    { geo: new THREE.IcosahedronGeometry(0.9, 0), color: 0x8b8178, sy: 0.7 },
    { geo: new THREE.IcosahedronGeometry(0.5, 0), color: 0x7c7269, x: 0.7, y: 0.1, sy: 0.6 },
  ]),
  crystal: () => bakeParts([
    { geo: new THREE.OctahedronGeometry(0.7, 0), color: 0xbcd0ff, y: 0.7, sy: 1.7 },
    { geo: new THREE.OctahedronGeometry(0.4, 0), color: 0xd7e3ff, x: 0.5, y: 0.4, sy: 1.5, ry: 0.6 },
  ]),
  bush: () => bakeParts([
    { geo: new THREE.IcosahedronGeometry(0.75, 0), color: 0x55793d, y: 0.45, sy: 0.7 },
  ]),
  grassTuft: () => bakeParts([
    { geo: new THREE.ConeGeometry(0.3, 1.0, 3, 1, true), color: 0x7da352, y: 0.5, sx: 1, sy: 1, sz: 0.4 },
    { geo: new THREE.ConeGeometry(0.24, 0.8, 3, 1, true), color: 0x8fb15e, x: 0.25, y: 0.4, sz: 0.4, ry: 1.2 },
  ]),
  reed: () => bakeParts([
    { geo: new THREE.CylinderGeometry(0.035, 0.05, 1.5, 4), color: 0x6d8a4a, y: 0.75, rz: 0.06 },
    { geo: new THREE.CylinderGeometry(0.035, 0.05, 1.2, 4), color: 0x7d9a55, x: 0.16, y: 0.6, rz: -0.1 },
    { geo: new THREE.ConeGeometry(0.07, 0.35, 4), color: 0x8a6a3e, y: 1.6 },
  ]),
  spark: () => bakeParts([
    { geo: new THREE.IcosahedronGeometry(0.16, 0), color: 0xffffff, y: 2.6 },
  ]),
};

export function buildScatter(scene, field, def, { isMobile = false, keepout = [], qual = QUAL_LOW, grade = null } = {}) {
  const q = qual || QUAL_LOW;
  const tier = q.tier || 'low';
  // Defensive veg flags (a builder called with a bare {tier} still behaves).
  const veg = q.veg || {};
  const lowTier = tier === 'low';
  const windOn = !lowTier && (veg.wind ?? (tier === 'medium' || tier === 'high'));
  const fadeOn = !lowTier && (veg.fade ?? (tier === 'medium' || tier === 'high'));
  const speciesOn = !lowTier && (veg.species ?? (tier === 'high'));
  const countMul = (typeof veg.countMul === 'number') ? veg.countMul : (lowTier ? 0.55 : 1.0);
  // The new archetypes are only added when the world's tier permits species AND
  // the world hasn't opted a rule out for mobile. Worlds that never declare these
  // kinds simply never instance them — nothing else is required of the content.
  const NEW_KINDS = new Set(['broadleaf', 'flowerShrub', 'tallGrass']);

  const group = new THREE.Group();
  group.name = 'scatter';
  scene.add(group);

  const stdMat = new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.9, metalness: 0, flatShading: true });
  const grassMat = new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 1, metalness: 0, side: THREE.DoubleSide, flatShading: true });
  const sparkMat = new THREE.MeshBasicMaterial({ color: 0x9fffe8, transparent: true, opacity: 0.9, blending: THREE.AdditiveBlending, depthWrite: false });

  // --- wind + far fade injected onto the SHARED veg materials (no new mats) ---
  // applyWind sets material.onBeforeCompile; far fade composes onto that same
  // hook so both effects share one shader. Both are hard no-ops on low.
  const windHandles = [];
  const farFadeMat = (m) => { if (fadeOn) injectFarFade(m, def.size); };
  if (windOn || fadeOn) {
    for (const m of [stdMat, grassMat]) {
      const h = windOn ? applyWind(m, q) : { update() {}, uniforms: null };
      windHandles.push(h);
      farFadeMat(m); // composes after wind's onBeforeCompile
    }
  }
  // FREE cinematic grade + night response on the shared veg materials (every tier
  // incl. low — composes onto wind/farFade). Makes foliage warm/cool with the
  // terrain and darken at dusk so trees/bushes don't stay flat & bright at night.
  const graders = [];
  if (grade) for (const m of [stdMat, grassMat]) graders.push(applyGrade(m, grade));

  const dummy = new THREE.Object3D();
  const meshes = [];
  const sparks = [];
  const R = def.size * 0.47;

  let ruleIndex = 0;
  for (const rule of def.flora) {
    ruleIndex++;
    if (isMobile && rule.mobileSkip) continue;
    // Gate the new archetypes behind the species flag (medium worlds that list
    // them still skip until high; low never reaches here for them).
    if (NEW_KINDS.has(rule.kind) && !speciesOn) continue;
    // Count resolution (never compounds the two discounts):
    //   • mobile keeps today's behavior exactly: mobileCount or round(×0.55).
    //   • non-mobile applies the tier countMul (low 0.55 / med 1.0 / high 1.25).
    //   • sparks are gameplay markers — always full count, never scaled.
    let count = rule.count;
    if (rule.kind !== 'spark') {
      if (isMobile) count = rule.mobileCount ?? Math.round(rule.count * 0.55);
      else count = Math.max(1, Math.round(rule.count * countMul));
    }

    const rng = mulberry32(subSeed(def.seed, 'flora:' + rule.kind + ':' + ruleIndex));
    const geo = A[rule.kind]();
    const mat = rule.kind === 'spark' ? sparkMat : (rule.kind === 'grassTuft' || rule.kind === 'tallGrass' ? grassMat : stdMat);
    const inst = new THREE.InstancedMesh(geo, mat, count);
    inst.frustumCulled = false;

    let placed = 0, tries = count * 16;
    while (placed < count && tries-- > 0) {
      const a = rng() * Math.PI * 2;
      const r = Math.sqrt(rng()) * R;
      const x = Math.cos(a) * r, z = Math.sin(a) * r;

      let blocked = false;
      for (const k of keepout) {
        const dx = x - k.x, dz = z - k.z;
        if (dx * dx + dz * dz < k.r * k.r) { blocked = true; break; }
      }
      if (blocked) continue;

      const p = field.probe(x, z);
      if (p.pathD < 6.5) continue;           // keep roads clear
      const w = rule.test(p);
      if (w <= 0 || rng() > w) continue;

      let s = rule.scale[0] + rng() * (rule.scale[1] - rule.scale[0]);
      if (rule.scaleBias) s *= rule.scaleBias(p);
      dummy.position.set(x, p.h - 0.08 * s, z);
      dummy.rotation.set(0, rng() * Math.PI * 2, 0);
      if (rule.kind === 'rock' || rule.kind === 'crystal') {
        dummy.rotation.x = (rng() - 0.5) * 0.3;
        dummy.position.y = p.h - 0.2 * s;
      }
      if (rule.kind === 'spark') {
        dummy.position.y = p.h + 1.2 + rng() * 3.5;
        sparks.push({ i: placed, mesh: inst, base: dummy.position.y, x, z, ph: rng() * Math.PI * 2 });
      }
      dummy.scale.setScalar(s);
      dummy.updateMatrix();
      inst.setMatrixAt(placed, dummy.matrix);
      placed++;
    }
    inst.count = placed;
    inst.instanceMatrix.needsUpdate = true;
    group.add(inst);
    meshes.push(inst);
  }

  // gentle bobbing for sparks only (cheap: few instances, throttled by engine)
  // plus driving the wind uniforms (no-op handles on low → zero cost there).
  const sparkDummy = new THREE.Object3D();
  function update(t) {
    // wind is uniform-driven on the GPU — just advance time (cheap, 2 handles).
    for (let i = 0; i < windHandles.length; i++) windHandles[i].update(t);
    if (!sparks.length) return;
    for (const s of sparks) {
      sparkDummy.position.set(s.x, s.base + Math.sin(t * 0.9 + s.ph) * 0.5, s.z);
      sparkDummy.scale.setScalar(0.8 + Math.sin(t * 1.7 + s.ph) * 0.25);
      sparkDummy.updateMatrix();
      s.mesh.setMatrixAt(s.i, sparkDummy.matrix);
    }
    if (sparks.length) sparks[0].mesh.instanceMatrix.needsUpdate = true;
  }

  function setShadows(on) {
    // solid (non-grass, non-spark) instances cast; grass/sparks never cast.
    meshes.forEach(m => { if (m.material === stdMat) m.castShadow = on; });
  }

  // night response for the free grade (every tier): foliage deepens + cools at
  // dusk so the world reads night, not flat-bright-trees-on-a-dark-ground.
  function setNight(nf) { for (const g of graders) g.update(nf); }

  return { group, update, setShadows, setNight };
}

// ---------------------------------------------------------------------------
// injectFarFade(material, worldSize) — composes a distance alpha-fade onto a
// shared veg material's EXISTING onBeforeCompile (set by applyWind, or none).
// Far instances fade IN over a band near the fog wall instead of hard-popping
// when they enter the frustum. medium+ only; never called on low (the material
// keeps its opaque defaults — no transparency state change whatsoever).
//
// We must flip the material to transparent for the alpha to take effect, but we
// keep depthWrite ON and only fade the OUTER ring (everything inside the band is
// fully opaque), so there's no sorting cost for the bulk of the vegetation.
// ---------------------------------------------------------------------------
function injectFarFade(material, worldSize) {
  // Fade band: start fading at ~62% of the half-extent, gone by ~78%. This sits
  // just inside the camera far-plane / fog so pops happen out of sight.
  const half = (worldSize || 600) * 0.5;
  const uniforms = {
    uFadeStart: { value: half * 1.24 },
    uFadeEnd: { value: half * 1.55 },
  };

  material.transparent = true;
  material.depthWrite = true; // opaque core dominates; outer ring is the only blend

  const prevOBC = material.onBeforeCompile;
  material.onBeforeCompile = (shader, renderer) => {
    if (prevOBC) prevOBC(shader, renderer); // run wind injection first (if any)

    shader.uniforms.uFadeStart = uniforms.uFadeStart;
    shader.uniforms.uFadeEnd = uniforms.uFadeEnd;

    // Forward the per-instance world XZ to the fragment shader. Use the instance
    // translation column when instanced; fall back to model position otherwise.
    shader.vertexShader = shader.vertexShader
      .replace('#include <common>', `#include <common>
        varying vec2 vMmwFadeXZ;`)
      .replace('#include <begin_vertex>', `#include <begin_vertex>
        #ifdef USE_INSTANCING
          vMmwFadeXZ = vec2(instanceMatrix[3].x, instanceMatrix[3].z);
        #else
          vMmwFadeXZ = vec2(modelMatrix[3].x, modelMatrix[3].z);
        #endif`);

    shader.fragmentShader = shader.fragmentShader
      .replace('#include <common>', `#include <common>
        uniform float uFadeStart;
        uniform float uFadeEnd;
        varying vec2 vMmwFadeXZ;`)
      // Fade by horizontal distance from the world center (matches the radial
      // scatter placement). Injected at the very end so it only scales the final
      // alpha — lighting/fog already resolved.
      .replace('#include <dithering_fragment>', `#include <dithering_fragment>
      {
        float d = length(vMmwFadeXZ);
        float fade = 1.0 - smoothstep(uFadeStart, uFadeEnd, d);
        gl_FragColor.a *= fade;
      }`);
  };
  material.needsUpdate = true;
}
