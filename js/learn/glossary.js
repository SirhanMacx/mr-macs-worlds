// glossary.js — in-world trilingual glossary for ENL support (EN · 中文 +
// pinyin · Español). Loads the shared Global 9 glossary JSON, renders a
// searchable overlay that stacks ABOVE the station panels (so it can be
// opened from inside a quiz or lab without losing your place), and closes
// back to exactly where you were. Keyboard: G opens, Esc closes, search is
// focused on open. All data is local; read-aloud is browser-native speech.
import * as Read from './read-aloud.js';

const LANG_KEY = 'mmw-gloss-lang'; // 'zh' | 'es'

let _url = null;
let _data = null;        // parsed glossary JSON
let _onOpen = null, _onClose = null;
let _overlay = null;     // root element, built lazily
let _lang = 'zh';
let _query = '';
let _lastFocus = null;

function escapeHTML(s) {
  return String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

export function init(url, { onOpen, onClose } = {}) {
  _url = url;
  _onOpen = onOpen || null;
  _onClose = onClose || null;
  try { _lang = localStorage.getItem(LANG_KEY) === 'es' ? 'es' : 'zh'; } catch (e) { /* fresh */ }
}

export function isAvailable() { return !!_url; }
export function isOpen() { return !!_overlay && _overlay.classList.contains('open'); }

export async function open() {
  if (!_url) return;
  _lastFocus = document.activeElement;
  if (!_overlay) buildOverlay();
  _overlay.classList.add('open');
  _onOpen && _onOpen();
  if (!_data) {
    try {
      const res = await fetch(_url);
      if (!res.ok) throw new Error('HTTP ' + res.status);
      _data = await res.json();
    } catch (err) {
      _overlay.querySelector('#gloss-body').innerHTML =
        '<div class="loading">Could not load the glossary. Refresh to try again.</div>';
      return;
    }
  }
  renderList();
  const search = _overlay.querySelector('#gloss-search');
  if (search && !matchMedia('(pointer: coarse)').matches) search.focus();
}

export function close() {
  if (!isOpen()) return;
  Read.stop();
  _overlay.classList.remove('open');
  _onClose && _onClose();
  if (_lastFocus && _lastFocus.focus && document.contains(_lastFocus)) _lastFocus.focus();
  _lastFocus = null;
}

function setLang(l) {
  _lang = l === 'es' ? 'es' : 'zh';
  try { localStorage.setItem(LANG_KEY, _lang); } catch (e) { /* no-op */ }
  syncLangTabs();
  renderList();
}

function syncLangTabs() {
  _overlay.querySelectorAll('.gloss-lang .tab').forEach(b =>
    b.classList.toggle('active', b.dataset.lang === _lang));
}

function buildOverlay() {
  _overlay = document.createElement('div');
  _overlay.id = 'glossary-overlay';
  _overlay.innerHTML = `
    <div class="gloss" role="dialog" aria-modal="true" aria-label="Trilingual glossary">
      <div class="panel-head">
        <div>
          <h2>Glossary</h2>
          <p class="panel-sub" id="gloss-count">English · 中文 + pinyin · Español</p>
        </div>
        <button class="panel-close" id="gloss-close" aria-label="Close the glossary">✕</button>
      </div>
      <div class="gloss-tools">
        <input id="gloss-search" type="search" placeholder="Search a word… / 搜索… / buscar…"
               autocomplete="off" aria-label="Search the glossary">
        <div class="tabs gloss-lang" role="group" aria-label="Translation language">
          <button class="tab" data-lang="zh">中文 + pinyin</button>
          <button class="tab" data-lang="es">Español</button>
        </div>
      </div>
      <div id="gloss-body" class="gloss-body"><div class="loading">Loading the glossary…</div></div>
    </div>`;
  document.body.appendChild(_overlay);

  _overlay.querySelector('#gloss-close').addEventListener('click', close);
  // tap the dim backdrop to close (touch-friendly)
  _overlay.addEventListener('click', (e) => { if (e.target === _overlay) close(); });
  _overlay.querySelectorAll('.gloss-lang .tab').forEach(b =>
    b.addEventListener('click', () => setLang(b.dataset.lang)));
  let debounce = null;
  _overlay.querySelector('#gloss-search').addEventListener('input', (e) => {
    clearTimeout(debounce);
    debounce = setTimeout(() => { _query = e.target.value.trim().toLowerCase(); renderList(); }, 120);
  });
  syncLangTabs();
}

function matches(t) {
  if (!_query) return true;
  return (t.en && t.en.toLowerCase().includes(_query)) ||
         (t.zh && t.zh.includes(_query)) ||
         (t.pinyin && t.pinyin.toLowerCase().includes(_query)) ||
         (t.es && t.es.toLowerCase().includes(_query)) ||
         (t.definition_en_simple && t.definition_en_simple.toLowerCase().includes(_query));
}

function termRow(t) {
  const trans = _lang === 'zh'
    ? `<span class="g-zh" lang="zh-Hans">${escapeHTML(t.zh)}</span> <span class="g-pinyin">${escapeHTML(t.pinyin)}</span>`
    : `<span class="g-es" lang="es">${escapeHTML(t.es)}</span>`;
  const transBtn = _lang === 'zh'
    ? Read.buttonHTML(t.zh, { lang: 'zh-CN', label: `Read "${t.en}" in Chinese` })
    : Read.buttonHTML(t.es, { lang: 'es-ES', label: `Read "${t.en}" in Spanish` });
  const enBtn = Read.buttonHTML(`${t.en}. ${t.definition_en_simple}`,
    { lang: 'en-US', label: `Read "${t.en}" and its definition in English` });
  return `<div class="g-term">
      <div class="g-head">
        <span class="g-en">${escapeHTML(t.en)}</span>${enBtn}
        <span class="g-trans">${trans}${transBtn}</span>
      </div>
      <div class="g-def">${escapeHTML(t.definition_en_simple)}</div>
    </div>`;
}

function renderList() {
  if (!_data) return;
  const body = _overlay.querySelector('#gloss-body');
  let shown = 0, total = 0;
  const sections = _data.categories.map(cat => {
    const terms = cat.terms.filter(t => { total++; return matches(t); });
    shown += terms.length;
    if (!terms.length) return '';
    return `<section class="g-cat">
        <h3 class="g-cat-name">${escapeHTML(cat.name)}</h3>
        ${terms.map(termRow).join('')}
      </section>`;
  }).join('');
  body.innerHTML = sections ||
    `<div class="loading">No matches for "${escapeHTML(_query)}" — try a shorter word.</div>`;
  const count = _overlay.querySelector('#gloss-count');
  if (count) {
    count.textContent = _query
      ? `${shown} of ${total} terms · English · 中文 + pinyin · Español`
      : `${total} terms · English · 中文 + pinyin · Español`;
  }
}

// ---- global wiring ----
// Any element with class `glossary-open-btn` opens the glossary (used by the
// HUD button and by the button inside every station panel header).
document.addEventListener('click', (e) => {
  const btn = e.target && e.target.closest && e.target.closest('.glossary-open-btn');
  if (!btn) return;
  e.preventDefault();
  e.stopPropagation();
  open();
});

// Esc closes the glossary FIRST (before the engine closes the panel under
// it) — capture phase + stopImmediatePropagation guarantees the ordering.
window.addEventListener('keydown', (e) => {
  if (e.code === 'Escape' && isOpen()) {
    e.stopImmediatePropagation();
    close();
  }
}, true);
