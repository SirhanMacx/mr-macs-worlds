// terrain.js — chunked heightmap terrain with per-vertex biome colors.
// One MeshStandardMaterial (vertexColors) shared by every chunk: chunks exist
// purely so the camera frustum can cull geometry behind you. Normals are
// computed from the analytic height field with central differences, so chunk
// borders never seam. Colors are authored in sRGB and converted to linear
// (three.js expects linear vertex colors).
//
// GRAPHICS OVERHAUL (Module E): every chunk also carries a per-vertex `aSlope`
// float attribute (the height-field gradient magnitude). On medium/high tiers
// materials.applyTerrainDetail() reads it via onBeforeCompile to add a
// detail-normal + slope/height AO (medium) and a triplanar micro-texture
// (high) — all on the SINGLE shared material (no new material, no extra draw
// call). On the `low` tier the injector is a hard no-op, so the attribute is
// inert and the renderer is byte-for-byte today's path. Segment density also
// scales per tier (38 / 54 / 64) for crisper silhouettes on capable devices.
import * as THREE from 'three';
import { srgbToLinear } from '../core/field-utils.js';
import { applyTerrainDetail, applyGrade } from './materials.js';
import { QUAL_LOW } from './quality.js';

// Per-tier segments-per-chunk. The integrator may also pass an explicit `segs`
// (back-compat with the current engine), which always wins; otherwise the tier
// picks the density. low stays at today's mobile/desktop range.
const TIER_SEGS = { low: 38, medium: 54, high: 64 };

export function buildTerrain(scene, field, { size, chunks = 5, segs = null, qual = QUAL_LOW, grade = null } = {}) {
  const q = qual || QUAL_LOW;
  const tier = q.tier || 'low';
  // Resolve segment density: explicit arg > tier table > legacy default.
  const resolvedSegs = (typeof segs === 'number' && segs > 0)
    ? segs
    : (TIER_SEGS[tier] || 52);

  const mat = new THREE.MeshStandardMaterial({
    vertexColors: true,
    roughness: 0.96,
    metalness: 0,
  });
  // Inject slope/height detail on the shared material (no-op on low). This patches
  // `mat` in place via onBeforeCompile; the per-vertex `aSlope` attribute added
  // below feeds it. Safe to call before any geometry exists.
  const detail = applyTerrainDetail(mat, q);
  // FREE cinematic grade + night response on the SHARED terrain material (every
  // tier, low included — composes onto the detail injector). Drives the flat-look
  // fix on Chromebooks and makes noon ≠ dusk. uNight fed from the engine.
  const grader = grade ? applyGrade(mat, grade) : { update() {} };

  const group = new THREE.Group();
  group.name = 'terrain';
  scene.add(group);

  const chunkSize = size / chunks;
  const half = size / 2;
  const jobs = [];
  for (let cz = 0; cz < chunks; cz++) {
    for (let cx = 0; cx < chunks; cx++) {
      jobs.push({ x0: -half + cx * chunkSize, z0: -half + cz * chunkSize });
    }
  }

  // Build one chunk. Heavy (segs² height samples) — the engine spreads calls
  // across frames behind the loading bar.
  function buildChunk({ x0, z0 }) {
    const n = resolvedSegs;
    const step = chunkSize / n;
    const vertsPerSide = n + 1;

    // sample heights with a 1-vertex border ring for exact normals
    const hs = new Float32Array((vertsPerSide + 2) * (vertsPerSide + 2));
    for (let j = -1; j <= n + 1; j++) {
      for (let i = -1; i <= n + 1; i++) {
        hs[(j + 1) * (vertsPerSide + 2) + (i + 1)] = field.height(x0 + i * step, z0 + j * step);
      }
    }
    const H = (i, j) => hs[(j + 1) * (vertsPerSide + 2) + (i + 1)];

    const positions = new Float32Array(vertsPerSide * vertsPerSide * 3);
    const normals = new Float32Array(vertsPerSide * vertsPerSide * 3);
    const colors = new Float32Array(vertsPerSide * vertsPerSide * 3);
    // Per-vertex slope (gradient magnitude). Consumed by applyTerrainDetail on
    // medium/high; harmless ballast (~one float/vertex) on low.
    const slopes = new Float32Array(vertsPerSide * vertsPerSide);
    const col = [0, 0, 0];

    let p = 0, sIdx = 0;
    for (let j = 0; j <= n; j++) {
      for (let i = 0; i <= n; i++) {
        const x = x0 + i * step, z = z0 + j * step;
        const h = H(i, j);
        positions[p] = x; positions[p + 1] = h; positions[p + 2] = z;

        // central differences → normal + slope
        const dx = (H(i + 1, j) - H(i - 1, j)) / (2 * step);
        const dz = (H(i, j + 1) - H(i, j - 1)) / (2 * step);
        const inv = 1 / Math.sqrt(dx * dx + dz * dz + 1);
        normals[p] = -dx * inv; normals[p + 1] = inv; normals[p + 2] = -dz * inv;

        const slope = Math.hypot(dx, dz);
        slopes[sIdx++] = slope;

        field.color(x, z, h, slope, col);
        colors[p] = srgbToLinear(col[0]);
        colors[p + 1] = srgbToLinear(col[1]);
        colors[p + 2] = srgbToLinear(col[2]);
        p += 3;
      }
    }

    const index = new Uint32Array(n * n * 6);
    let q = 0;
    for (let j = 0; j < n; j++) {
      for (let i = 0; i < n; i++) {
        const a = j * vertsPerSide + i, b = a + 1, c = a + vertsPerSide, d = c + 1;
        index[q++] = a; index[q++] = c; index[q++] = b;
        index[q++] = b; index[q++] = c; index[q++] = d;
      }
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('normal', new THREE.BufferAttribute(normals, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    // aSlope feeds applyTerrainDetail's slope/height AO + cliff triplanar blend
    // (medium/high). Inert on low (the injector never reads it there).
    geo.setAttribute('aSlope', new THREE.BufferAttribute(slopes, 1));
    geo.setIndex(new THREE.BufferAttribute(index, 1));
    geo.computeBoundingSphere();

    const mesh = new THREE.Mesh(geo, mat);
    mesh.receiveShadow = true;
    mesh.matrixAutoUpdate = false;
    group.add(mesh);
  }

  return {
    group,
    mat,                 // shared terrain material (one for the whole world)
    jobs,
    buildChunk,
    segs: resolvedSegs,  // effective density (so the integrator can report it)
    // detail.update(t) is reserved (terrain detail is currently static) but
    // safe to call every frame — a no-op on low. setNight feeds the grade's
    // night uniform so the terrain deepens + cools at dusk on every tier.
    update(t) { detail.update(t); },
    setNight(nf) { grader.update(nf); },
    setShadows(on) { group.children.forEach(m => { m.receiveShadow = on; }); },
    dispose() {
      group.children.forEach(m => m.geometry.dispose());
      mat.dispose();
      scene.remove(group);
    },
  };
}
