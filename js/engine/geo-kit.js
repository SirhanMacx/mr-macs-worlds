// geo-kit.js — tiny geometry toolkit: bake transformed, vertex-colored
// primitives into ONE BufferGeometry (one draw call per archetype/structure),
// plus the canvas-texture label sprite. No three.js addons needed.
import * as THREE from 'three';

const _c = new THREE.Color();

// parts: [{ geo, color (hex), x,y,z, rx,ry,rz, sx,sy,sz }]
// Returns a single indexed BufferGeometry with position/normal/color (linear).
export function bakeParts(parts) {
  const geos = [];
  for (const p of parts) {
    let g = p.geo.index ? p.geo.toNonIndexed() : p.geo.clone();
    const m = new THREE.Matrix4();
    m.compose(
      new THREE.Vector3(p.x || 0, p.y || 0, p.z || 0),
      new THREE.Quaternion().setFromEuler(new THREE.Euler(p.rx || 0, p.ry || 0, p.rz || 0)),
      new THREE.Vector3(p.sx ?? 1, p.sy ?? (p.sx ?? 1), p.sz ?? (p.sx ?? 1))
    );
    g.applyMatrix4(m);
    // Color.set(hex) already converts sRGB → linear working space under
    // three's default color management — do NOT convert again (double
    // conversion crushes everything dark).
    _c.set(p.color);
    const n = g.attributes.position.count;
    const col = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) { col[i * 3] = _c.r; col[i * 3 + 1] = _c.g; col[i * 3 + 2] = _c.b; }
    g.setAttribute('color', new THREE.BufferAttribute(col, 3));
    geos.push(g);
  }
  // manual merge (positions / normals / colors)
  let total = 0;
  for (const g of geos) total += g.attributes.position.count;
  const pos = new Float32Array(total * 3);
  const nor = new Float32Array(total * 3);
  const col = new Float32Array(total * 3);
  let off = 0;
  for (const g of geos) {
    pos.set(g.attributes.position.array, off * 3);
    nor.set(g.attributes.normal.array, off * 3);
    col.set(g.attributes.color.array, off * 3);
    off += g.attributes.position.count;
    g.dispose();
  }
  const out = new THREE.BufferGeometry();
  out.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  out.setAttribute('normal', new THREE.BufferAttribute(nor, 3));
  out.setAttribute('color', new THREE.BufferAttribute(col, 3));
  out.computeBoundingSphere();
  return out;
}

// Crisp canvas label sprite (no font assets). Ported from v1, kept because it
// works beautifully on Chromebooks.
export function makeLabel(text, sub, color = '#ffffff', scale = 0.03) {
  const pad = 24, fs = 44, sfs = 27;
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  ctx.font = `700 ${fs}px system-ui, sans-serif`;
  const w1 = ctx.measureText(text).width;
  ctx.font = `500 ${sfs}px system-ui, sans-serif`;
  const w2 = sub ? ctx.measureText(sub).width : 0;
  const W = Math.ceil(Math.max(w1, w2) + pad * 2);
  const H = sub ? fs + sfs + pad * 2 + 8 : fs + pad * 2;
  canvas.width = W; canvas.height = H;

  ctx.fillStyle = 'rgba(10, 14, 24, 0.78)';
  roundRect(ctx, 0, 0, W, H, 18); ctx.fill();
  ctx.lineWidth = 4; ctx.strokeStyle = color; ctx.globalAlpha = 0.95;
  roundRect(ctx, 2, 2, W - 4, H - 4, 16); ctx.stroke(); ctx.globalAlpha = 1;

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
  tex.colorSpace = THREE.SRGBColorSpace;
  const mat = new THREE.SpriteMaterial({ map: tex, transparent: true, depthTest: false });
  const sprite = new THREE.Sprite(mat);
  sprite.scale.set(W * scale, H * scale, 1);
  sprite.renderOrder = 50;
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
