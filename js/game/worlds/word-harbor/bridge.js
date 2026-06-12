// bridge.js — sentence-bridges: arrange word tiles into the frame sentence
// and the bridge physically spans the ford. Wrong order wobbles cutely and
// you simply try again — no penalty, no timer, nothing lost. The glossary
// terms inside the sentence are the "cost": you must have collected them.
import * as THREE from 'three';
import { bakeParts } from '../../../engine/geo-kit.js';
import * as UI from '../../ui.js';
import * as Sfx from '../../sfx.js';
import * as Read from '../../../learn/read-aloud.js';

const esc = UI.esc;

function shuffled(words) {
  const idx = words.map((_, i) => i);
  for (let tries = 0; tries < 8; tries++) {
    for (let i = idx.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [idx[i], idx[j]] = [idx[j], idx[i]];
    }
    if (idx.some((v, i) => v !== i)) break; // never hand them the answer pre-built
  }
  return idx;
}

// ---------- the puzzle overlay ----------
export function openBridgePuzzle(bridge, { hasGem, whereIs, onBuilt }) {
  const missing = bridge.gems.filter(g => !hasGem(g));
  if (missing.length) {
    UI.push({
      className: 'wh-bridge-layer',
      html: `<div class="wh-bridge-card">
        <div class="wh-bridge-head"><b>${esc(bridge.name)}</b><button class="dlg-x" data-gui-close>CLOSE</button></div>
        <p class="wh-bridge-need">This bridge needs word-gems you have not found yet:</p>
        ${missing.map(g => `<p class="wh-bridge-miss"><span class="wh-bk-gem empty"></span><b>${esc(g)}</b> — look on ${esc(whereIs(g))}</p>`).join('')}
        <div class="wh-story-nav"><button class="wh-btn" data-gui-close>I WILL FIND THEM</button></div>
      </div>`,
      dismissible: true,
    });
    return;
  }

  const words = bridge.words;
  let order = shuffled(words);   // tile order in the tray
  let slots = words.map(() => null); // each slot holds a tile index (into words) or null
  let hintsOn = false;

  UI.push({
    className: 'wh-bridge-layer',
    html: '<div class="wh-bridge-card"></div>',
    dismissible: true,
    onClose() { Read.stop(); },
    onMount(el, { close }) { render(el.querySelector('.wh-bridge-card'), close); },
  });

  function render(card, close) {
    const used = new Set(slots.filter(v => v !== null));
    const gemSet = new Set(bridge.gems.map(g => g.toLowerCase()));
    const tileCls = w => gemSet.has(w.toLowerCase().replace(/[.,]/g, '')) ? 'wh-tile gem' : 'wh-tile';

    card.innerHTML = `
      <div class="wh-bridge-head">
        <b>${esc(bridge.name)}</b>
        <span class="wh-bridge-sub">Put the words in order to build the bridge</span>
        <button class="dlg-x" data-gui-close>CLOSE</button>
      </div>
      <div class="wh-slots">
        ${slots.map((v, i) => v === null
          ? `<button class="wh-slot empty" data-slot="${i}" aria-label="Empty word slot"></button>`
          : `<button class="wh-slot" data-slot="${i}">${esc(words[v])}</button>`).join('')}
      </div>
      <div class="wh-tray">
        ${order.map(ti => used.has(ti)
          ? `<span class="wh-tile spent"></span>`
          : `<button class="${tileCls(words[ti])}" data-tile="${ti}">${esc(words[ti])}</button>`).join('')}
      </div>
      <div class="wh-story-hints" style="display:${hintsOn ? 'block' : 'none'}">
        <p lang="zh-Hans"><span class="wh-hint-lab">中文</span> ${esc(bridge.zh)}</p>
        <p lang="es"><span class="wh-hint-lab">Español</span> ${esc(bridge.es)}</p>
      </div>
      <div class="wh-story-nav">
        <button class="wh-btn wh-hint-toggle">${hintsOn ? 'HIDE HINTS' : '中文 / ESPAÑOL'}</button>
        ${Read.available() ? '<button class="wh-btn wh-hear">HEAR THE SENTENCE</button>' : ''}
        <button class="wh-btn wh-check" ${slots.every(v => v !== null) ? '' : 'disabled'}>BUILD</button>
      </div>`;

    card.querySelectorAll('[data-tile]').forEach(b => b.addEventListener('click', () => {
      Sfx.click();
      const ti = +b.dataset.tile;
      const free = slots.indexOf(null);
      if (free < 0) return;
      slots[free] = ti;
      render(card, close);
    }));
    card.querySelectorAll('.wh-slot:not(.empty)').forEach(b => b.addEventListener('click', () => {
      Sfx.click();
      slots[+b.dataset.slot] = null;
      render(card, close);
    }));
    card.querySelector('.wh-hint-toggle').addEventListener('click', () => {
      Sfx.click(); hintsOn = !hintsOn; render(card, close);
    });
    const hear = card.querySelector('.wh-hear');
    if (hear) hear.addEventListener('click', () => Read.speak(words.join(' '), { lang: 'en-US', rate: 0.85 }));
    card.querySelector('.wh-check').addEventListener('click', () => {
      const right = slots.every((v, i) => v === i);
      if (right) {
        Sfx.questDone();
        Read.speak(words.join(' '), { lang: 'en-US', rate: 0.85 });
        close();
        onBuilt();
      } else {
        // a friendly wobble; the words stay so you can fix just the wrong part
        Sfx.bad();
        card.classList.remove('wobble');
        void card.offsetWidth;
        card.classList.add('wobble');
        const tip = document.createElement('p');
        tip.className = 'wh-bridge-tryagain';
        tip.textContent = 'Almost. Try another order — nothing is lost.';
        const old = card.querySelector('.wh-bridge-tryagain');
        if (old) old.remove();
        card.querySelector('.wh-story-nav').before(tip);
      }
    });
  }
}

// ---------- the 3D bridge ----------
// A warm wooden plank bridge arched over the ford from a → b. All parts are
// baked into ONE geometry (one draw call per bridge) via geo-kit.

const WOOD = 0x9a6a3f, RAIL = 0x7a5230, SIGN = 0xe8d9b0;

function bakedMesh(parts) {
  const geo = bakeParts(parts);
  const mat = new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.85, metalness: 0.02, flatShading: true });
  return new THREE.Mesh(geo, mat);
}

export function buildBridgeMesh(field, a, b) {
  const ax = a[0], az = a[1], bx = b[0], bz = b[1];
  const len = Math.hypot(bx - ax, bz - az);
  const yaw = Math.atan2(bx - ax, bz - az); // plank z-axis runs along the span
  const dirX = (bz - az) / len, dirZ = -(bx - ax) / len; // sideways
  const ya = Math.max(field.height(ax, az), 0.6);
  const yb = Math.max(field.height(bx, bz), 0.6);
  const n = Math.max(8, Math.round(len / 2.4));

  const parts = [];
  const plankGeo = new THREE.BoxGeometry(3.2, 0.22, len / n + 0.4);
  const postGeo = new THREE.BoxGeometry(0.18, 1.0, 0.18);
  for (let i = 0; i <= n; i++) {
    const t = i / n;
    const x = ax + (bx - ax) * t;
    const z = az + (bz - az) * t;
    const arc = Math.sin(t * Math.PI) * 1.5;
    const y = ya + (yb - ya) * t + arc;
    const pitch = Math.cos(t * Math.PI) * (1.5 * Math.PI / len); // gentle arch tilt
    parts.push({ geo: plankGeo, color: i % 2 ? WOOD : 0x8d5f37, x, y, z, ry: yaw, rx: -pitch });
    if (i % 2 === 0) {
      for (const side of [-1.5, 1.5]) {
        parts.push({ geo: postGeo, color: RAIL, x: x + dirX * side, y: y + 0.55, z: z + dirZ * side, ry: yaw });
      }
    }
  }
  // handrails
  const railGeo = new THREE.BoxGeometry(0.14, 0.14, len * 1.02);
  for (const side of [-1.5, 1.5]) {
    parts.push({
      geo: railGeo, color: RAIL,
      x: (ax + bx) / 2 + dirX * side, y: (ya + yb) / 2 + 1.5, z: (az + bz) / 2 + dirZ * side, ry: yaw,
    });
  }
  return bakedMesh(parts);
}

// the pre-build marker: two posts and a little sign at the near bank
export function buildBridgeSite(field, a, b) {
  const mx = (a[0] + b[0]) / 2, mz = (a[1] + b[1]) / 2;
  const parts = [];
  const postGeo = new THREE.CylinderGeometry(0.16, 0.2, 2.2, 6);
  for (const [px, pz] of [a, b]) {
    const y = Math.max(field.height(px, pz), 0.4);
    parts.push({ geo: postGeo, color: 0x8a5a33, x: px, y: y + 1.1, z: pz });
  }
  const y0 = Math.max(field.height(a[0], a[1]), 0.4);
  const yaw = Math.atan2(mx - a[0], mz - a[1]);
  parts.push({ geo: new THREE.BoxGeometry(1.8, 1.05, 0.12), color: SIGN, x: a[0], y: y0 + 1.75, z: a[1], ry: yaw });
  return bakedMesh(parts);
}
