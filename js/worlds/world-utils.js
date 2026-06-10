// world-utils.js — shared low-poly builders for worlds. Keep draw calls modest.
import * as THREE from 'three';
import * as Progress from '../progress.js';

// A floating interactable marker: a glowing crystal + a sprite text label.
// Returns { group, data, kind } and registers itself in `interactables`.
export function makeMarker(scene, interactables, { pos, color, label, sublabel, kind, data }) {
  const group = new THREE.Group();
  group.position.set(pos[0], pos[1] ?? 0, pos[2]);

  // pedestal
  const ped = new THREE.Mesh(
    new THREE.CylinderGeometry(1.6, 2.0, 0.6, 6),
    new THREE.MeshStandardMaterial({ color: 0x1a2436, roughness: 0.9, metalness: 0.1 })
  );
  ped.position.y = 0.3;
  group.add(ped);

  // floating crystal (octahedron — cheap, reads as a "gem of knowledge")
  const crystalMat = new THREE.MeshStandardMaterial({
    color, emissive: new THREE.Color(color), emissiveIntensity: 0.55,
    roughness: 0.3, metalness: 0.2, flatShading: true
  });
  const crystal = new THREE.Mesh(new THREE.OctahedronGeometry(1.15, 0), crystalMat);
  crystal.position.y = 2.6;
  crystal.castShadow = false;
  group.add(crystal);

  // soft glow ring
  const ring = new THREE.Mesh(
    new THREE.RingGeometry(1.8, 2.2, 24),
    new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.22, side: THREE.DoubleSide })
  );
  ring.rotation.x = -Math.PI / 2; ring.position.y = 0.62;
  group.add(ring);

  // label sprite
  const sprite = makeLabel(label, sublabel, color);
  sprite.position.y = 4.4;
  group.add(sprite);

  group.userData = { crystal, ring, sprite, baseColor: color, kind, data, label, marker: true };
  scene.add(group);
  interactables.push(group);
  refreshMarkerState(group, data?.starId);
  return group;
}

export function refreshMarkerState(group, starId) {
  if (!starId) return;
  if (Progress.hasStar(starId)) {
    // mark as collected: dim + golden tint check
    group.userData.collected = true;
    group.userData.crystal.material.emissiveIntensity = 0.25;
  }
}

// canvas-texture label sprite (crisp on Chromebooks, no font deps)
export function makeLabel(text, sub, color = '#ffffff') {
  const pad = 24, fs = 44, sfs = 28;
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  ctx.font = `700 ${fs}px system-ui, sans-serif`;
  const w1 = ctx.measureText(text).width;
  ctx.font = `500 ${sfs}px system-ui, sans-serif`;
  const w2 = sub ? ctx.measureText(sub).width : 0;
  const W = Math.ceil(Math.max(w1, w2) + pad * 2);
  const H = sub ? fs + sfs + pad * 2 + 8 : fs + pad * 2;
  canvas.width = W; canvas.height = H;

  // rounded panel
  ctx.fillStyle = 'rgba(8, 14, 26, 0.82)';
  roundRect(ctx, 0, 0, W, H, 16); ctx.fill();
  ctx.lineWidth = 4; ctx.strokeStyle = color; ctx.globalAlpha = 0.9;
  roundRect(ctx, 2, 2, W - 4, H - 4, 14); ctx.stroke(); ctx.globalAlpha = 1;

  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillStyle = '#ffffff';
  ctx.font = `700 ${fs}px system-ui, sans-serif`;
  ctx.fillText(text, W / 2, sub ? pad + fs / 2 : H / 2);
  if (sub) {
    ctx.fillStyle = color;
    ctx.font = `500 ${sfs}px system-ui, sans-serif`;
    ctx.fillText(sub, W / 2, pad + fs + 8 + sfs / 2);
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.minFilter = THREE.LinearFilter;
  const mat = new THREE.SpriteMaterial({ map: tex, transparent: true, depthTest: false });
  const sprite = new THREE.Sprite(mat);
  const scale = 0.018;
  sprite.scale.set(W * scale, H * scale, 1);
  sprite.renderOrder = 999;
  return sprite;
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

// a simple low-poly ground disc with a subtle grid
export function makeGround(scene, color1, color2, radius = 80) {
  const geo = new THREE.CircleGeometry(radius, 48);
  const mat = new THREE.MeshStandardMaterial({ color: color1, roughness: 1, metalness: 0 });
  const ground = new THREE.Mesh(geo, mat);
  ground.rotation.x = -Math.PI / 2;
  ground.receiveShadow = true;
  scene.add(ground);

  // grid overlay for depth cues (cheap LineSegments)
  const grid = new THREE.GridHelper(radius * 2, 40, color2, color2);
  grid.material.opacity = 0.12; grid.material.transparent = true;
  scene.add(grid);
  return ground;
}

// scatter cheap decorative instanced shapes (rocks / stars) for atmosphere
export function scatterInstanced(scene, geo, mat, count, radiusMin, radiusMax, yBase, ySpread) {
  const mesh = new THREE.InstancedMesh(geo, mat, count);
  const dummy = new THREE.Object3D();
  for (let i = 0; i < count; i++) {
    const a = Math.random() * Math.PI * 2;
    const r = radiusMin + Math.random() * (radiusMax - radiusMin);
    dummy.position.set(Math.cos(a) * r, yBase + Math.random() * ySpread, Math.sin(a) * r);
    const s = 0.5 + Math.random() * 1.4;
    dummy.scale.set(s, s, s);
    dummy.rotation.set(Math.random() * 3, Math.random() * 3, Math.random() * 3);
    dummy.updateMatrix();
    mesh.setMatrixAt(i, dummy.matrix);
  }
  scene.add(mesh);
  return mesh;
}
