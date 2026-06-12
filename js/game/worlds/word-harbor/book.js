// book.js — the WORD BOOK: Word Harbor's inventory IS the glossary.
// Collecting a gem opens the gem card (big word, tap to hear EN → 中文 →
// Español), and the book shows every category with collected words bright
// and waiting words as gentle outlines. Words are never lost: building a
// house "moves them in" and they stay browsable here forever.
import * as UI from '../../ui.js';
import * as Sfx from '../../sfx.js';
import * as Read from '../../../learn/read-aloud.js';

const esc = UI.esc;
const LANGS = [
  { id: 'en', lang: 'en-US', label: 'English' },
  { id: 'zh', lang: 'zh-CN', label: '中文' },
  { id: 'es', lang: 'es-ES', label: 'Español' },
];

function speakTerm(term, langId) {
  const L = LANGS.find(l => l.id === langId) || LANGS[0];
  const text = langId === 'zh' ? term.zh : langId === 'es' ? term.es : term.en;
  Read.speak(text, { lang: L.lang, rate: 0.85 });
}

// ---------- the gem card (shown when a word-gem is collected or tapped) ----------
// Tap the big word to hear it again and cycle EN → 中文 → Español.
export function openGemCard(term, { isNew = false, homeName = null } = {}) {
  let langIx = 0;
  UI.push({
    className: 'wh-gemcard-layer',
    html: '<div class="wh-gemcard"></div>',
    dismissible: true,
    onClose() { Read.stop(); },
    onMount(el, { close }) {
      const card = el.querySelector('.wh-gemcard');
      render(card, close);
      // speak the word in English the moment it is collected
      speakTerm(term, 'en');
    },
  });

  function render(card, close) {
    const L = LANGS[langIx];
    const big = L.id === 'zh' ? term.zh : L.id === 'es' ? term.es : term.en;
    card.innerHTML = `
      ${isNew ? '<div class="wh-gem-kicker">NEW WORD</div>' : ''}
      <button class="wh-gem-big" lang="${L.id === 'zh' ? 'zh-Hans' : L.id}" aria-label="Tap to hear and switch language">
        <span class="wh-gem-word">${esc(big)}</span>
        <span class="wh-gem-langtag">${L.label} — tap to hear next language</span>
      </button>
      ${L.id === 'zh' ? `<div class="wh-gem-pinyin">${esc(term.pinyin || '')}</div>` : ''}
      <div class="wh-gem-row">
        <span class="wh-gem-en">${esc(term.en)}</span>
        <span class="wh-gem-zh" lang="zh-Hans">${esc(term.zh)}</span>
        <span class="wh-gem-es" lang="es">${esc(term.es)}</span>
      </div>
      <p class="wh-gem-def">${esc(term.definition_en_simple)}
        ${Read.buttonHTML(term.definition_en_simple, { lang: 'en-US', label: 'Read the meaning aloud' })}</p>
      ${homeName ? `<p class="wh-gem-home">This word lives in your <b>${esc(homeName)}</b>.</p>` : ''}
      <div class="wh-story-nav">
        <button class="wh-btn wh-gem-keep" data-gui-close>${isNew ? 'KEEP IT' : 'CLOSE'}</button>
      </div>`;
    card.querySelector('.wh-gem-big').addEventListener('click', () => {
      Sfx.click();
      langIx = (langIx + 1) % LANGS.length;
      render(card, close);
      speakTerm(term, LANGS[langIx].id);
    });
  }
}

// ---------- the word book ----------
// data: glossary JSON; state.gems: {en: 1}; builtCats: Set of category names
export function openBook({ data, state, builtCats, islandOf, counts }) {
  UI.push({
    className: 'wh-book-layer',
    html: '<div class="wh-book"></div>',
    dismissible: true,
    onClose() { Read.stop(); },
    onMount(el) { render(el.querySelector('.wh-book')); },
  });

  function render(root) {
    const total = counts.total, got = counts.got;
    const cats = data.categories.map(cat => {
      const gotHere = cat.terms.filter(t => state.gems[t.en]).length;
      const moved = builtCats.has(cat.name);
      const rows = cat.terms.map(t => {
        if (state.gems[t.en]) {
          return `<button class="wh-bk-term got" data-term="${esc(t.en)}">
              <span class="wh-bk-gem"></span><b>${esc(t.en)}</b>
              <span lang="zh-Hans">${esc(t.zh)}</span><span lang="es">${esc(t.es)}</span>
            </button>`;
        }
        const isle = islandOf(t.en);
        return `<div class="wh-bk-term waiting">
            <span class="wh-bk-gem empty"></span><b>?</b>
            <span class="wh-bk-where">waiting on ${esc(isle)}</span>
          </div>`;
      }).join('');
      return `<details class="wh-bk-cat" ${gotHere ? 'open' : ''}>
          <summary><b>${esc(cat.name)}</b>
            <span class="wh-bk-count">${gotHere}/${cat.terms.length}${moved ? ' · moved into town' : ''}</span>
          </summary>
          <div class="wh-bk-rows">${rows}</div>
        </details>`;
    }).join('');

    root.innerHTML = `
      <div class="wh-book-head">
        <div><h2>Word Book</h2><p class="wh-book-sub">${got} of ${total} words found · words are never lost</p></div>
        <button class="dlg-x" data-gui-close>CLOSE</button>
      </div>
      <div class="wh-book-body">${cats}</div>`;

    root.querySelectorAll('.wh-bk-term.got').forEach(b => b.addEventListener('click', () => {
      const term = findTerm(data, b.dataset.term);
      if (term) { Sfx.click(); openGemCard(term, { isNew: false }); }
    }));
  }
}

export function findTerm(data, en) {
  for (const cat of data.categories) {
    for (const t of cat.terms) if (t.en === en) return t;
  }
  return null;
}
