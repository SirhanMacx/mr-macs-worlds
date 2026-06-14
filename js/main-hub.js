// main-hub.js — the title screen. No WebGL here: a cheap animated 2D-canvas
// backdrop (gradient dusk sky, parallax ridgelines, sea shimmer), plus world
// cards whose thumbnails are painted from the exact same seeded height/biome
// fields the 3D worlds generate from, and LIVE progress read from each game's
// localStorage save. Zero emoji, zero external assets.
import { def as tradeWinds } from './worlds/trade-winds.js';
import { def as mindAtlas } from './worlds/mind-atlas.js';
import { def as wordHarbor } from './worlds/word-harbor.js';
import { RANKS } from './game/guild.js';
import { ERAS, GOODS } from './game/worlds/trade-winds/content.js';
import { REGIONS as MA_REGIONS } from './game/worlds/mind-atlas/content.js';
import { BUILDINGS, BRIDGES } from './game/worlds/word-harbor/content.js';

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// ---------------------------------------------------------------- saves ----
// Each world has a set of localStorage aliases it has ever saved under: the
// internal world key the controller passes to createSave() (e.g. 'trade-winds')
// AND the public def.key on the hub card (e.g. 'global9'). Worlds bumped their
// save to v2 for the story rebuild — but old devices may still hold a v1. So the
// reader is BOTH version-tolerant (scan every mmw-game-<alias>-vN, prefer the
// highest N) AND alias-tolerant, so live progress shows no matter which key a
// world ended up writing.
const SAVE_ALIASES = {
  'trade-winds': ['global9', 'trade-winds'],
  'mind-atlas': ['appsych', 'mind-atlas'],
  'word-harbor': ['enl', 'word-harbor'],
};

function parseSave(raw) {
  try {
    const obj = JSON.parse(raw || 'null');
    return obj && typeof obj === 'object' ? obj : null;
  } catch (e) { return null; }
}

function gameSave(worldKey) {
  const aliases = SAVE_ALIASES[worldKey] || [worldKey];
  let best = null, bestV = -1;
  // 1) direct hits on known aliases, any version suffix we can find
  for (const a of aliases) {
    for (let v = 1; v <= 9; v++) {
      const s = parseSave(safeGet(`mmw-game-${a}-v${v}`));
      if (s) { const sv = (typeof s.v === 'number' ? s.v : v); if (sv >= bestV) { best = s; bestV = sv; } }
    }
  }
  if (best) return best;
  // 2) belt-and-braces: scan all keys with the mmw-game-<alias>- prefix in case
  //    a world ever lands on an unexpected version suffix.
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (!k) continue;
      const hit = aliases.some(a => k.indexOf(`mmw-game-${a}-`) === 0);
      if (!hit) continue;
      const s = parseSave(localStorage.getItem(k));
      if (!s) continue;
      const m = k.match(/-v(\d+)$/);
      const sv = (typeof s.v === 'number' ? s.v : (m ? +m[1] : 0));
      if (sv >= bestV) { best = s; bestV = sv; }
    }
  } catch (e) { /* private mode */ }
  return best;
}

function safeGet(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }

const GOOD_BASE = {}; GOODS.forEach(g => { GOOD_BASE[g.id] = g.base; });

let whTermTotal = 244; // refined from the live glossary below

// Each entry: lines of progress HTML + a 0..1 completion fraction for the bar.
const PROGRESS = {
  'trade-winds': (S) => {
    const rank = RANKS[Math.min(S.rank || 0, RANKS.length - 1)].name;
    const era = Math.min(S.era || 1, 4);
    const eraName = (ERAS[era] || {}).name || '';
    let worth = S.coins || 0;
    for (const id in (S.cargo || {})) worth += (S.cargo[id] || 0) * (GOOD_BASE[id] || 0);
    return {
      html: `<span class="pg-line"><b>${esc(rank)}</b> · Era ${era} of 4 — ${esc(eraName)}</span>` +
        `<span class="pg-line">Net worth <b>${worth}</b> shekels · Level ${S.level || 1}</span>`,
      frac: ((S.rank || 0) / (RANKS.length - 1)) * 0.5 + ((era - 1) / 3) * 0.5,
    };
  },
  'mind-atlas': (S) => {
    const total = MA_REGIONS.length;
    const restored = MA_REGIONS.filter(r => S.regions && S.regions[r.id] && S.regions[r.id].restored).length;
    const cases = Object.values(S.cases || {}).filter(Boolean).length;
    return {
      html: `<span class="pg-line"><b>${restored}</b> of ${total} regions restored</span>` +
        `<span class="pg-line">Cartographer level ${S.level || 1}${cases ? ` · ${cases} case file${cases > 1 ? 's' : ''} closed` : ''}</span>`,
      frac: restored / total,
    };
  },
  'word-harbor': (S) => {
    const words = Object.keys(S.gems || {}).length;
    const builds = Object.keys(S.builds || {}).length;
    const bridges = Object.keys(S.bridges || {}).length;
    return {
      html: `<span class="pg-line"><b>${words}</b> of ${whTermTotal} words found</span>` +
        `<span class="pg-line">Town <b>${builds}</b> of ${BUILDINGS.length} buildings · ${bridges} of ${BRIDGES.length} bridges</span>`,
      frac: (words / whTermTotal) * 0.4 + (builds / BUILDINGS.length) * 0.4 + (bridges / BRIDGES.length) * 0.2,
    };
  },
};

// Teaser hook shown on a FRESH card (no save yet) — the new story premises.
const FRESH = {
  'trade-winds': 'Your mother never came home from the eastern road. One donkey, her unfinished ledger, and a rival who means to erase your name. Rebuild the house.',
  'mind-atlas': 'A mind has gone dark. You are its cartographer. Push back the Fog of every comforting lie until the mind can face the Exam of the Self.',
  'word-harbor': 'You arrive by boat at dusk. The town is quiet and half-built. Learn a word, light a lamp, help a neighbor — and the harbor wakes.',
};

// The story title each card leads with (poster headline above the course tag).
const STORY_TITLE = {
  'trade-winds': 'The House of the Open Road',
  'mind-atlas': 'The Atlas and the Fog',
  'word-harbor': 'The Harbor That Was Waiting for You',
};

function esc(s) {
  return String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

// ------------------------------------------------------------ map paint ----
// Paint a hillshaded top-down map of the world into the card canvas, in
// row-slices so the page stays responsive. (Same fields as the 3D worlds.)
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

// ------------------------------------------------------------ card wire ----
function refreshProgress(card, worldKey) {
  const prog = card.querySelector('.card-progress');
  const play = card.querySelector('.play-btn');
  const fresh = card.querySelector('.new-btn');
  const S = gameSave(worldKey);
  if (S) {
    const p = PROGRESS[worldKey](S);
    const frac = Math.max(0.02, Math.min(1, p.frac || 0));
    prog.classList.remove('is-fresh');
    prog.innerHTML = p.html + `<span class="pg-bar"><i style="width:${(frac * 100).toFixed(1)}%"></i></span>`;
    // a save exists → the story is underway: CONTINUE picks up where you left off,
    // and the quiet "Begin anew" link starts the cold open over.
    play.textContent = 'CONTINUE';
    fresh.hidden = false;
    card.classList.add('has-save');
  } else {
    prog.classList.add('is-fresh');
    // the full premise teaser already lives in .card-hook; here we just mark the
    // card as an unopened story so BEGIN plays the cold open.
    prog.innerHTML = `<span class="pg-line pg-fresh">A new story. Press BEGIN to play the opening.</span>`;
    play.textContent = 'BEGIN';
    fresh.hidden = true;
    card.classList.remove('has-save');
  }
}

// wipe every localStorage save a world may hold (all aliases, all versions) so
// "Begin anew" truly starts the cold open over no matter which key it lives at.
function wipeWorld(worldKey) {
  const aliases = SAVE_ALIASES[worldKey] || [worldKey];
  let toRemove = [];
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k && aliases.some(a => k.indexOf(`mmw-game-${a}-`) === 0)) toRemove.push(k);
    }
    for (const k of toRemove) localStorage.removeItem(k);
  } catch (err) { /* private mode */ }
}

function wireCard(elId, def, worldKey, href) {
  const card = document.getElementById(elId);
  if (!card) return;
  paintMap(card.querySelector('canvas'), def, def.buildField());
  // lead the card with its story title as the poster headline
  const titleEl = card.querySelector('.card-saga-title');
  if (titleEl && STORY_TITLE[worldKey]) titleEl.textContent = STORY_TITLE[worldKey];
  refreshProgress(card, worldKey);

  const go = () => { window.location.href = href; };
  card.addEventListener('click', go);
  card.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      if (e.target.closest && e.target.closest('button')) return; // buttons handle themselves
      e.preventDefault(); go();
    }
  });
  card.querySelector('.play-btn').addEventListener('click', (e) => { e.stopPropagation(); go(); });
  card.querySelector('.new-btn').addEventListener('click', (e) => {
    e.stopPropagation();
    const name = (STORY_TITLE[worldKey] || card.querySelector('h2').textContent);
    if (!window.confirm(`Begin "${name}" again from the very start? Your current progress on this device will be erased.`)) return;
    wipeWorld(worldKey);
    go();
  });
}

// ------------------------------------------------------------- backdrop ----
// A slow dusk diorama: banded sky, twinkling stars, sun low on the horizon,
// three drifting parallax ridgelines, and a shimmering sea. Painted at half
// resolution and capped at 30fps; reduced-motion gets a single still frame.
function startBackdrop() {
  const cv = document.getElementById('bg');
  if (!cv) return;
  const ctx = cv.getContext('2d');
  let W = 0, H = 0, ridges = [], stars = [];

  function ridgePath(seed, baseY, amp) {
    // wraps horizontally: f(0) == f(W) because every sine has an integer
    // number of periods across W
    const p = new Path2D();
    p.moveTo(0, H);
    const n = Math.max(48, Math.floor(W / 14));
    for (let i = 0; i <= n; i++) {
      const x = (i / n) * W;
      const u = (i / n) * Math.PI * 2;
      const y = baseY +
        Math.sin(u * 3 + seed) * amp * 0.5 +
        Math.sin(u * 7 + seed * 2.7) * amp * 0.3 +
        Math.sin(u * 13 + seed * 5.1) * amp * 0.2;
      p.lineTo(x, y);
    }
    p.lineTo(W, H);
    p.closePath();
    return p;
  }

  function resize() {
    W = Math.max(320, Math.floor(window.innerWidth / 2));
    H = Math.max(240, Math.floor(window.innerHeight / 2));
    cv.width = W; cv.height = H;
    ridges = [
      { path: ridgePath(1.7, H * 0.58, H * 0.05), color: '#1b2747', speed: 2.4 },
      { path: ridgePath(4.2, H * 0.66, H * 0.07), color: '#131c36', speed: 4.6 },
      { path: ridgePath(8.9, H * 0.74, H * 0.09), color: '#0c1326', speed: 8.0 },
    ];
    stars = [];
    for (let i = 0; i < 110; i++) {
      stars.push({ x: Math.random() * W, y: Math.random() * H * 0.5, r: 0.4 + Math.random() * 0.9, ph: Math.random() * Math.PI * 2, sp: 0.6 + Math.random() * 1.8 });
    }
  }
  resize();
  window.addEventListener('resize', resize);

  function paint(t) {
    // sky: deep night into a warm dusk band that breathes very slowly
    const warm = 0.5 + 0.5 * Math.sin(t * 0.05);
    const g = ctx.createLinearGradient(0, 0, 0, H);
    g.addColorStop(0, '#05070f');
    g.addColorStop(0.45, '#0b1228');
    g.addColorStop(0.72, `rgb(${38 + warm * 26}, ${36 + warm * 16}, ${64 + warm * 6})`);
    g.addColorStop(0.8, `rgb(${96 + warm * 50}, ${60 + warm * 24}, ${52 + warm * 8})`);
    g.addColorStop(1, '#0a0f1f');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);

    // stars
    for (const s of stars) {
      const a = 0.25 + 0.55 * (0.5 + 0.5 * Math.sin(t * s.sp + s.ph));
      ctx.globalAlpha = a;
      ctx.fillStyle = '#dfe8ff';
      ctx.fillRect(s.x, s.y, s.r, s.r);
    }
    ctx.globalAlpha = 1;

    // low sun with a soft glow
    const sx = W * 0.72, sy = H * 0.72;
    const glow = ctx.createRadialGradient(sx, sy, 2, sx, sy, H * 0.3);
    glow.addColorStop(0, `rgba(255, 196, 110, ${0.5 + warm * 0.2})`);
    glow.addColorStop(1, 'rgba(255, 196, 110, 0)');
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = '#ffd99a';
    ctx.beginPath(); ctx.arc(sx, sy, H * 0.035, 0, Math.PI * 2); ctx.fill();

    // parallax ridges (each drawn twice for seamless wrap)
    for (const r of ridges) {
      const off = (t * r.speed) % W;
      ctx.save();
      ctx.translate(-off, 0);
      ctx.fillStyle = r.color;
      ctx.fill(r.path);
      ctx.translate(W, 0);
      ctx.fill(r.path);
      ctx.restore();
    }

    // sea band with shimmer lines + a sun glint column
    const seaY = H * 0.82;
    const sg = ctx.createLinearGradient(0, seaY, 0, H);
    sg.addColorStop(0, '#0d1b30');
    sg.addColorStop(1, '#060b16');
    ctx.fillStyle = sg;
    ctx.fillRect(0, seaY, W, H - seaY);
    ctx.strokeStyle = 'rgba(150, 185, 235, 0.12)';
    ctx.lineWidth = 1;
    for (let i = 0; i < 7; i++) {
      const y = seaY + 4 + i * ((H - seaY) / 8);
      const sw = W * (0.1 + 0.08 * Math.sin(t * 0.7 + i * 1.7));
      const cx = W * 0.5 + Math.sin(t * 0.21 + i * 2.4) * W * 0.3;
      ctx.beginPath(); ctx.moveTo(cx - sw, y); ctx.lineTo(cx + sw, y); ctx.stroke();
    }
    ctx.globalAlpha = 0.1 + warm * 0.08;
    ctx.fillStyle = '#ffce8a';
    ctx.fillRect(sx - W * 0.015, seaY, W * 0.03, H - seaY);
    ctx.globalAlpha = 1;
  }

  if (reducedMotion) { paint(8); return; }
  let last = 0;
  function loop(ms) {
    requestAnimationFrame(loop);
    if (ms - last < 33) return; // ~30fps is plenty for a backdrop
    last = ms;
    paint(ms / 1000);
  }
  requestAnimationFrame(loop);
}

// ----------------------------------------------------------------- boot ----
function boot() {
  startBackdrop();
  wireCard('card-global9', tradeWinds, 'trade-winds', './world.html?w=global9');
  wireCard('card-appsych', mindAtlas, 'mind-atlas', './world.html?w=appsych');
  wireCard('card-enl', wordHarbor, 'word-harbor', './world.html?w=enl');

  // refine the Word Harbor term total from the live glossary (fallback 244)
  fetch(wordHarbor.glossary).then(r => r.json()).then(gl => {
    const n = (gl.categories || []).reduce((a, c) => a + (c.terms || []).length, 0);
    if (n > 0) { whTermTotal = n; }
    const card = document.getElementById('card-enl');
    if (card) refreshProgress(card, 'word-harbor');
  }).catch(() => { /* offline first load — 244 stands */ });
}

window.addEventListener('DOMContentLoaded', boot);
