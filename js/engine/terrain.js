// terrain.js — chunked heightmap terrain with per-vertex biome colors.
// One MeshStandardMaterial (vertexColors) shared by every chunk: chunks exist
// purely so the camera frustum can cull geometry behind you. Normals are
// computed from the analytic height field with central differences, so chunk
// borders never seam. Colors are authored in sRGB and converted to linear
// (three.js expects linear vertex colors).
import * as THREE from 'three';
import { srgbToLinear } from '../core/field-utils.js';

export function buildTerrain(scene, field, { size, chunks = 5, segs = 52 }) {
  const mat = new THREE.MeshStandardMaterial({
    vertexColors: true,
    roughness: 0.96,
    metalness: 0,
  });
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
    const n = segs;
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
    const col = [0, 0, 0];

    let p = 0;
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

        field.color(x, z, h, Math.hypot(dx, dz), col);
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
    geo.setIndex(new THREE.BufferAttribute(index, 1));
    geo.computeBoundingSphere();

    const mesh = new THREE.Mesh(geo, mat);
    mesh.receiveShadow = true;
    mesh.matrixAutoUpdate = false;
    group.add(mesh);
  }

  return {
    group,
    jobs,
    buildChunk,
    setShadows(on) { group.children.forEach(m => { m.receiveShadow = on; }); },
    dispose() {
      group.children.forEach(m => m.geometry.dispose());
      mat.dispose();
      scene.remove(group);
    },
  };
}
