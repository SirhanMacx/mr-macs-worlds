// ui.js — the game's overlay stack (dialogue, market, events, map, journal).
// One root element, one stack; opening pauses the engine, closing the last
// layer resumes it (unless a classic learn-panel is open underneath).
// All UI is DOM — identical on touch and keyboard. Zero emoji.
import * as Panels from '../learn/panels.js';
import * as Sfx from './sfx.js';

let api = null;
let rootEl = null;
const stack = [];

export function init(engineApi) {
  api = engineApi;
  rootEl = document.createElement('div');
  rootEl.id = 'game-ui';
  document.body.appendChild(rootEl);
  window.addEventListener('keydown', (e) => {
    if (e.code === 'Escape' && stack.length) {
      const top = stack[stack.length - 1];
      if (top.dismissible !== false) { e.stopImmediatePropagation(); pop(); }
    }
  }, true);
  return rootEl;
}

export function isOpen() { return stack.length > 0; }

function applyPause() {
  const shouldPause = stack.length > 0 || Panels.isOpen();
  api.setPaused(shouldPause);
  document.body.classList.toggle('gui-open', stack.length > 0);
}

// push({className, html, onMount(el, ctx), dismissible, silent})
export function push(layer) {
  const el = document.createElement('div');
  el.className = 'gui-layer ' + (layer.className || '');
  el.innerHTML = layer.html;
  rootEl.appendChild(el);
  const entry = { ...layer, el };
  stack.push(entry);
  applyPause();
  if (!layer.silent) Sfx.open();
  // generic close buttons (delegated — UIs re-render their content freely)
  el.addEventListener('click', (e) => {
    if (e.target.closest && e.target.closest('[data-gui-close]')) popTo(entry);
  });
  layer.onMount && layer.onMount(el, { close: () => popTo(entry), replaceHTML: (h) => { el.innerHTML = h; layer.onMount && layer.onMount(el, { close: () => popTo(entry) }); } });
  requestAnimationFrame(() => el.classList.add('in'));
  return entry;
}

export function pop() {
  const entry = stack.pop();
  if (!entry) return;
  entry.el.classList.remove('in');
  const el = entry.el;
  setTimeout(() => el.remove(), 180);
  entry.onClose && entry.onClose();
  if (!entry.silent) Sfx.close();
  applyPause();
}

function popTo(entry) {
  const i = stack.indexOf(entry);
  if (i < 0) return;
  while (stack.length > i) pop();
}

export function closeAll() { while (stack.length) pop(); }

// floating "+12" style feedback chip near screen center
export function floatText(text, kind = 'gain') {
  const f = document.createElement('div');
  f.className = `gui-float ${kind}`;
  f.textContent = text;
  rootEl.appendChild(f);
  requestAnimationFrame(() => f.classList.add('go'));
  setTimeout(() => f.remove(), 1400);
}

// big centered announcement banner (era unlock, level up, quest complete)
export function banner(title, sub = '', ms = 2600) {
  const b = document.createElement('div');
  b.className = 'gui-banner';
  b.innerHTML = `<div class="gb-title">${esc(title)}</div>${sub ? `<div class="gb-sub">${esc(sub)}</div>` : ''}`;
  rootEl.appendChild(b);
  requestAnimationFrame(() => b.classList.add('in'));
  setTimeout(() => { b.classList.remove('in'); setTimeout(() => b.remove(), 400); }, ms);
}

export function esc(s) {
  return String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}
