// codex.js — the player's FIELD JOURNAL of understanding. World-agnostic.
//
// Every world's story shares this one spine: when a player reaches a keystone
// beat — the moment they actually GET why a thing was true (why a river city
// imports timber, why a memory fades, why a word changes a job interview) — the
// world calls codex.record(entry). The Codex is the growing record of what the
// player has LEARNED, not what they were quizzed on. It is the substrate the
// later capstones read: Global 9's Enduring-Issues essay and AP Psych's "Exam
// of the Self" both walk these entries back to the player as their own thinking.
//
// An entry = { id, group, title, idea, source }
//   id     unique key — record() is idempotent by id (a re-visited scene never
//          double-logs). Required; a missing id is ignored rather than thrown.
//   group  the unit / era / region label entries are bucketed under in the
//          panel ("River Valleys", "Memory", "Word & Work"). Defaults to "Field Notes".
//   title  the short heading of the turning point ("Why trade roads exist").
//   idea   the real concept in one human sentence — the thing understood.
//   source the figure or scene that taught it ("Nin-Banda, timber broker of Ur").
//
// Persists to state.codex. Survives across save merges because save.js layers
// the live save over defaults; an old save with no codex field simply starts
// empty here. Depends only on ui.js + sfx.js. Never throws on missing state.
import * as UI from './ui.js';
import * as Sfx from './sfx.js';

const STYLE_ID = 'mmw-codex-style';

export function createCodex({ state, save } = {}) {
  // defensive: tolerate a bare/ð throwaway state, or one with a stale shape.
  const st = state && typeof state === 'object' ? state : {};
  if (!Array.isArray(st.codex)) {
    // migrate cleanly: an object-shaped legacy save, or nothing, becomes [].
    st.codex = st.codex && typeof st.codex === 'object'
      ? Object.keys(st.codex).map(k => st.codex[k]).filter(e => e && e.id)
      : [];
  }
  const list = st.codex;
  const persist = typeof save === 'function' ? save : () => {};
  const index = new Set(list.map(e => e && e.id).filter(Boolean));

  function has(id) { return index.has(id); }
  function count() { return list.length; }
  function entries() { return list.slice(); }

  // record() — idempotent by id, safe to call before the panel ever opens, and
  // safe to call repeatedly at a keystone (re-entering a scene is harmless).
  function record(entry) {
    try {
      if (!entry || !entry.id || index.has(entry.id)) return false;
      const clean = {
        id: String(entry.id),
        group: entry.group ? String(entry.group) : 'Field Notes',
        title: entry.title ? String(entry.title) : '',
        idea: entry.idea ? String(entry.idea) : '',
        source: entry.source ? String(entry.source) : '',
      };
      list.push(clean);
      index.add(clean.id);
      persist();
      // a quiet, earned chime — this is comprehension, not a coin.
      try { Sfx.good(); } catch (e) { /* audio unavailable */ }
      try { UI.floatText('Understood', 'xp'); } catch (e) { /* ui not ready */ }
      return true;
    } catch (e) {
      return false; // never break a story beat over a journal write
    }
  }

  function open() {
    injectStyleOnce();
    UI.push({
      className: 'gui-codex',
      html: '<div class="cdx-card"></div>',
      onMount(el) { render(el.querySelector('.cdx-card')); },
    });
  }

  function render(card) {
    const n = list.length;
    // group entries by 'group', preserving first-seen order of both groups
    // and entries within them — the panel reads as a chronology of insight.
    const order = [];
    const buckets = {};
    for (const e of list) {
      const g = e.group || 'Field Notes';
      if (!buckets[g]) { buckets[g] = []; order.push(g); }
      buckets[g].push(e);
    }

    const progress = n === 0
      ? 'Your field journal is empty. Understand a turning point and it will be written here.'
      : `You have understood <b>${n}</b> of the world&rsquo;s turning point${n === 1 ? '' : 's'}.`;

    const body = n === 0
      ? '<p class="cdx-empty">Talk to the people who lived it. The moment a thing makes sense, this page remembers it for you.</p>'
      : order.map(g => `
          <section class="cdx-group">
            <h3>${UI.esc(g)} <span class="cdx-gcount">${buckets[g].length}</span></h3>
            ${buckets[g].map(e => `
              <article class="cdx-entry">
                <h4>${UI.esc(e.title)}</h4>
                ${e.idea ? `<p class="cdx-idea">${UI.esc(e.idea)}</p>` : ''}
                ${e.source ? `<p class="cdx-source">${UI.esc(e.source)}</p>` : ''}
              </article>`).join('')}
          </section>`).join('');

    card.innerHTML = `
      <div class="cdx-head">
        <div>
          <div class="cdx-title">Field Journal</div>
          <div class="cdx-sub">What you have come to understand</div>
        </div>
        <button class="dlg-x" data-gui-close type="button">CLOSE</button>
      </div>
      <div class="cdx-progress">${progress}</div>
      <div class="cdx-body">${body}</div>`;
  }

  return { record, has, entries, count, open };
}

// ---------- scoped CSS, injected once (does NOT touch css/game.css) ----------
function injectStyleOnce() {
  if (typeof document === 'undefined') return;
  if (document.getElementById(STYLE_ID)) return;
  const s = document.createElement('style');
  s.id = STYLE_ID;
  s.textContent = `
.gui-codex .cdx-card {
  background: linear-gradient(180deg, rgba(22,18,12,0.98), rgba(12,10,7,0.98));
  border: 1px solid rgba(255,210,130,0.42); border-radius: 14px;
  box-shadow: 0 18px 60px rgba(0,0,0,0.66);
  color: #ece4d2; width: min(640px, 96vw); max-height: 88vh; overflow: auto; padding: 18px;
}
.gui-codex .cdx-head { display: flex; justify-content: space-between; align-items: flex-start; gap: 12px; }
.gui-codex .cdx-title { font: 800 21px/1.15 Georgia, serif; color: #ffd166; letter-spacing: 0.02em; }
.gui-codex .cdx-sub { font: 600 12px/1.3 system-ui, sans-serif; color: #bfae8c; margin-top: 3px; }
.gui-codex .cdx-progress {
  font: 600 13px/1.5 system-ui, sans-serif; color: #e8dfc8;
  background: rgba(255,209,102,0.08); border-left: 3px solid #ffd166;
  border-radius: 6px; padding: 10px 12px; margin: 14px 0 4px;
}
.gui-codex .cdx-progress b { color: #ffd166; }
.gui-codex .cdx-body { margin-top: 6px; }
.gui-codex .cdx-empty { font: 500 13px/1.6 Georgia, serif; color: #a89a7e; padding: 6px 2px; }
.gui-codex .cdx-group { margin-top: 14px; }
.gui-codex .cdx-group h3 {
  display: flex; align-items: center; gap: 8px;
  font: 800 11px/1 system-ui, sans-serif; letter-spacing: 0.12em; text-transform: uppercase;
  color: #bfae8c; margin: 0 0 9px; padding-bottom: 7px; border-bottom: 1px solid rgba(255,210,130,0.16);
}
.gui-codex .cdx-gcount {
  font: 800 10px/1 system-ui, sans-serif; color: #0c0a07; background: #ffd166;
  border-radius: 20px; padding: 3px 7px; letter-spacing: 0;
}
.gui-codex .cdx-entry {
  background: rgba(255,255,255,0.045); border: 1px solid rgba(255,255,255,0.07);
  border-left: 3px solid rgba(139,233,253,0.55);
  border-radius: 9px; padding: 11px 13px; margin-bottom: 8px;
}
.gui-codex .cdx-entry h4 { font: 700 15px/1.25 Georgia, serif; color: #f4ecd8; margin: 0; }
.gui-codex .cdx-idea { font: 500 13.5px/1.55 Georgia, serif; color: #ddd2ba; margin: 6px 0 0; }
.gui-codex .cdx-source { font: 600 11.5px/1.35 system-ui, sans-serif; color: #8be9fd; margin: 6px 0 0; }
`;
  document.head.appendChild(s);
}
