// scatter.js — deterministic instanced vegetation and props.
// Each flora rule becomes ONE InstancedMesh (one draw call). Placement is
// rejection-sampled with the world's seeded PRNG against the field probe
// (biome weights, slope/height limits, keep-out radii around stations and
// roads) — identical layout on every device, every visit.
import * as THREE from 'three';
import { mulberry32, subSeed } from '../core/prng.js';
import { bakeParts } from './geo-kit.js';

// ---------- archetype geometry builders (vertex-colored, merged) ----------
const A = {
  treeRound: () => bakeParts([
    { geo: new THREE.CylinderGeometry(0.14, 0.22, 1.7, 5), color: 0x6e4f2f, y: 0.85 },
    { geo: new THREE.IcosahedronGeometry(1.15, 0), color: 0x4e7e3a, y: 2.3 },
    { geo: new THREE.IcosahedronGeometry(0.8, 0), color: 0x5e9447, x: 0.5, y: 2.9, z: 0.25 },
  ]),
  glowTree: () => bakeParts([
    { geo: new THREE.CylinderGeometry(0.14, 0.22, 1.8, 5), color: 0x4a3b56, y: 0.9 },
    { geo: new THREE.IcosahedronGeometry(1.2, 0), color: 0x2f8f7a, y: 2.5 },
    { geo: new THREE.IcosahedronGeometry(0.78, 0), color: 0x3fae90, x: -0.45, y: 3.1, z: 0.3 },
  ]),
  treeCone: () => bakeParts([
    { geo: new THREE.CylinderGeometry(0.12, 0.2, 1.1, 5), color: 0x53404f, y: 0.55 },
    { geo: new THREE.ConeGeometry(1.05, 2.4, 6), color: 0x2c5e54, y: 2.2 },
    { geo: new THREE.ConeGeometry(0.75, 1.8, 6), color: 0x356d5e, y: 3.5 },
  ]),
  cypress: () => bakeParts([
    { geo: new THREE.CylinderGeometry(0.1, 0.16, 0.8, 5), color: 0x5d452a, y: 0.4 },
    { geo: new THREE.ConeGeometry(0.62, 3.6, 6), color: 0x3a6b3e, y: 2.5 },
  ]),
  treeFlat: () => bakeParts([
    { geo: new THREE.CylinderGeometry(0.12, 0.2, 2.1, 5), color: 0x73512c, y: 1.05, rz: 0.1 },
    { geo: new THREE.IcosahedronGeometry(1.5, 0), color: 0x6e8a3c, y: 2.6, sy: 0.38 },
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

export function buildScatter(scene, field, def, { isMobile = false, keepout = [] } = {}) {
  const group = new THREE.Group();
  group.name = 'scatter';
  scene.add(group);

  const stdMat = new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.9, metalness: 0, flatShading: true });
  const grassMat = new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 1, metalness: 0, side: THREE.DoubleSide, flatShading: true });
  const sparkMat = new THREE.MeshBasicMaterial({ color: 0x9fffe8, transparent: true, opacity: 0.9, blending: THREE.AdditiveBlending, depthWrite: false });

  const dummy = new THREE.Object3D();
  const meshes = [];
  const sparks = [];
  const R = def.size * 0.47;

  let ruleIndex = 0;
  for (const rule of def.flora) {
    ruleIndex++;
    if (isMobile && rule.mobileSkip) continue;
    let count = rule.count;
    if (isMobile) count = rule.mobileCount ?? Math.round(count * 0.55);

    const rng = mulberry32(subSeed(def.seed, 'flora:' + rule.kind + ':' + ruleIndex));
    const geo = A[rule.kind]();
    const mat = rule.kind === 'spark' ? sparkMat : (rule.kind === 'grassTuft' ? grassMat : stdMat);
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
  const sparkDummy = new THREE.Object3D();
  function update(t) {
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
    meshes.forEach(m => { if (m.material === stdMat) m.castShadow = on; });
  }

  return { group, update, setShadows };
}
