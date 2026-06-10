// main-hub.js — the hub page. No WebGL here: world cards get REAL map
// thumbnails painted from the exact same seeded height/biome fields the 3D
// worlds are generated from (proof of determinism, and it loads instantly).
import { def as tradeWinds } from './worlds/trade-winds.js';
import { def as mindAtlas } from './worlds/mind-atlas.js';

const KEY = 'mmw-progress-v2';

function progressFor(def) {
  let st = null;
  try { st = JSON.parse(localStorage.getItem(KEY) || 'null'); } catch (e) { /* fresh */ }
  const out = { xp: st?.xp || 0, cleared: 0, total: def.order.length };
  const c = st?.courses?.[def.key];
  if (!c) return out;
  for (const id of def.order) {
    const u = c.units?.[id];
    if (u && u.learned && u.bestOf > 0 && u.best / u.bestOf >= 0.7) { out.cleared++; continue; }
    if (c.stations?.[id]) out.cleared++;
  }
  return out;
}

// Paint a hillshaded top-down map of the world into the card canvas, in
// row-slices so the page stays responsive.
function paintMap(canvas, def, field) {
  const W = canvas.width, H = canvas.height;
  const ctx = canvas.getContext('2d');
  const img = ctx.createImageData(W, H);
  const hgt = new Float32Array(W * H);
  const col = [0, 0, 0];
  const deep = hexRGB(def.water.deep), shal = hexRGB(def.water.shallow);
  const pad = 1.04;

  let row = 0;
  function slice() {
    const until = Math.min(H, row + 18);
    for (; row < until; row++) {
      for (let i = 0; i < W; i++) {
        const x = (i / (W - 1) - 0.5) * def.size * pad;
        const z = (row / (H - 1) - 0.5) * def.size * pad;
        hgt[row * W + i] = field.height(x, z);
      }
    }
    if (row < H) { requestAnimationFrame(slice); return; }
    for (let j = 0; j < H; j++) {
      for (let i = 0; i < W; i++) {
        const h = hgt[j * W + i];
        let r, g, b;
        if (h < def.sea + 0.05) {
          const t = Math.min(1, (def.sea - h) / 6);
          r = shal[0] + (deep[0] - shal[0]) * t;
          g = shal[1] + (deep[1] - shal[1]) * t;
          b = shal[2] + (deep[2] - shal[2]) * t;
        } else {
          const x = (i / (W - 1) - 0.5) * def.size * pad;
          const z = (j / (H - 1) - 0.5) * def.size * pad;
          const hl = hgt[j * W + Math.max(0, i - 1)];
          const hu = hgt[Math.max(0, j - 1) * W + i];
          const cell = (def.size * pad) / W;
          field.color(x, z, h, Math.hypot(h - hl, h - hu) / cell, col);
          const shade = 1 + ((hl - h) + (hu - h)) * 0.05;
          r = col[0] * 255 * shade; g = col[1] * 255 * shade; b = col[2] * 255 * shade;
        }
        const p = (j * W + i) * 4;
        img.data[p] = r; img.data[p + 1] = g; img.data[p + 2] = b; img.data[p + 3] = 255;
      }
    }
    ctx.putImageData(img, 0, 0);
    // station pins
    for (const reg of def.regions) drawPin(ctx, def, W, H, pad, reg.center[0], reg.center[1], reg.color);
    for (const sk of def.skills) if (sk.kind !== 'hub') drawPin(ctx, def, W, H, pad, sk.pos[0], sk.pos[1], sk.color);
    canvas.classList.add('painted');
  }
  slice();
}

function drawPin(ctx, def, W, H, pad, x, z, color) {
  const px = (x / (def.size * pad) + 0.5) * W;
  const py = (z / (def.size * pad) + 0.5) * H;
  ctx.fillStyle = '#' + color.toString(16).padStart(6, '0');
  ctx.strokeStyle = 'rgba(8,10,18,0.7)';
  ctx.lineWidth = 1.2;
  ctx.beginPath(); ctx.arc(px, py, 3.2, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
}

function hexRGB(hex) { return [(hex >> 16) & 255, (hex >> 8) & 255, hex & 255]; }

function wireCard(elId, def, href) {
  const card = document.getElementById(elId);
  if (!card) return;
  const canvas = card.querySelector('canvas');
  const field = def.buildField();
  paintMap(canvas, def, field);
  const p = progressFor(def);
  const prog = card.querySelector('.card-progress');
  if (prog) {
    prog.innerHTML = p.cleared > 0
      ? `<b>${p.cleared}</b> / ${p.total} stations cleared`
      : `${p.total} stations to discover`;
  }
  card.addEventListener('click', () => { window.location.href = href; });
  card.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); window.location.href = href; }
  });
}

function boot() {
  // total XP chip
  let xp = 0;
  try { xp = JSON.parse(localStorage.getItem(KEY) || 'null')?.xp || 0; } catch (e) { /* fresh */ }
  const xpEl = document.getElementById('hub-xp');
  if (xpEl && xp > 0) { xpEl.style.display = 'inline-flex'; xpEl.querySelector('b').textContent = xp; }

  wireCard('card-global9', tradeWinds, './world.html?w=global9');
  wireCard('card-appsych', mindAtlas, './world.html?w=appsych');
}

window.addEventListener('DOMContentLoaded', boot);
