// achievements.js — earned milestones. World-agnostic.
//
// Where the Codex records what a player UNDERSTOOD, achievements record what a
// player DID and held onto — the named beats of an arc ("The house has a name
// again", "You read a hostile source against itself", "You built a bridge no
// one could cross before"). They are sparse and meaningful, never a participation
// confetti machine. unlock() is idempotent; the first time only, it fires a
// tasteful banner + float so the moment lands, then never nags again.
//
//   unlock(id, meta)  meta = { title, desc }. Idempotent by id.
//   has(id)           already earned?
//   list()            all earned, in earn order.
//   open()            renders the achievements panel (earned, newest first).
//
// Persists to state.achievements. Migrates cleanly over save defaults. Depends
// only on ui.js + sfx.js. Never throws on missing state.
import * as UI from './ui.js';
import * as Sfx from './sfx.js';

const STYLE_ID = 'mmw-ach-style';

export function createAchievements({ state, save } = {}) {
  const st = state && typeof state === 'object' ? state : {};
  if (!Array.isArray(st.achievements)) {
    st.achievements = st.achievements && typeof st.achievements === 'object'
      ? Object.keys(st.achievements).map(k => st.achievements[k]).filter(a => a && a.id)
      : [];
  }
  const list = st.achievements;
  const persist = typeof save === 'function' ? save : () => {};
  const index = new Set(list.map(a => a && a.id).filter(Boolean));

  function has(id) { return index.has(id); }
  function list_() { return list.slice(); }

  function unlock(id, meta = {}) {
    try {
      if (!id || index.has(id)) return false;
      const a = {
        id: String(id),
        title: meta.title ? String(meta.title) : String(id),
        desc: meta.desc ? String(meta.desc) : '',
        at: Date.now(),
      };
      list.push(a);
      index.add(a.id);
      persist();
      // first-unlock fanfare — tasteful, once.
      try { Sfx.questDone(); } catch (e) { /* audio unavailable */ }
      try { UI.banner('Achievement', a.title); } catch (e) { /* ui not ready */ }
      try { UI.floatText('Unlocked', 'gain'); } catch (e) { /* ui not ready */ }
      return true;
    } catch (e) {
      return false; // never break a story beat over an achievement write
    }
  }

  function open() {
    injectStyleOnce();
    UI.push({
      className: 'gui-ach',
      html: '<div class="ach-card"></div>',
      onMount(el) { render(el.querySelector('.ach-card')); },
    });
  }

  function render(card) {
    const n = list.length;
    // newest first — the most recent milestone reads at the top.
    const ordered = list.slice().reverse();
    const progress = n === 0
      ? 'No milestones yet. Carry an arc to its turning point and it will be marked here.'
      : `You have earned <b>${n}</b> milestone${n === 1 ? '' : 's'}.`;

    const body = n === 0
      ? '<p class="ach-empty">These are the moments that changed the world around you, not the points you scored.</p>'
      : ordered.map(a => `
          <article class="ach-entry">
            <div class="ach-medal" aria-hidden="true"></div>
            <div class="ach-meat">
              <h4>${UI.esc(a.title)}</h4>
              ${a.desc ? `<p class="ach-desc">${UI.esc(a.desc)}</p>` : ''}
            </div>
          </article>`).join('');

    card.innerHTML = `
      <div class="ach-head">
        <div>
          <div class="ach-title">Achievements</div>
          <div class="ach-sub">What you carried through</div>
        </div>
        <button class="dlg-x" data-gui-close type="button">CLOSE</button>
      </div>
      <div class="ach-progress">${progress}</div>
      <div class="ach-body">${body}</div>`;
  }

  return { unlock, has, list: list_, open };
}

// ---------- scoped CSS, injected once (does NOT touch css/game.css) ----------
function injectStyleOnce() {
  if (typeof document === 'undefined') return;
  if (document.getElementById(STYLE_ID)) return;
  const s = document.createElement('style');
  s.id = STYLE_ID;
  s.textContent = `
.gui-ach .ach-card {
  background: linear-gradient(180deg, rgba(22,18,12,0.98), rgba(12,10,7,0.98));
  border: 1px solid rgba(255,210,130,0.42); border-radius: 14px;
  box-shadow: 0 18px 60px rgba(0,0,0,0.66);
  color: #ece4d2; width: min(560px, 96vw); max-height: 88vh; overflow: auto; padding: 18px;
}
.gui-ach .ach-head { display: flex; justify-content: space-between; align-items: flex-start; gap: 12px; }
.gui-ach .ach-title { font: 800 21px/1.15 Georgia, serif; color: #ffd166; letter-spacing: 0.02em; }
.gui-ach .ach-sub { font: 600 12px/1.3 system-ui, sans-serif; color: #bfae8c; margin-top: 3px; }
.gui-ach .ach-progress {
  font: 600 13px/1.5 system-ui, sans-serif; color: #e8dfc8;
  background: rgba(255,209,102,0.08); border-left: 3px solid #ffd166;
  border-radius: 6px; padding: 10px 12px; margin: 14px 0 4px;
}
.gui-ach .ach-progress b { color: #ffd166; }
.gui-ach .ach-body { margin-top: 8px; }
.gui-ach .ach-empty { font: 500 13px/1.6 Georgia, serif; color: #a89a7e; padding: 6px 2px; }
.gui-ach .ach-entry {
  display: flex; gap: 12px; align-items: center;
  background: rgba(255,255,255,0.045); border: 1px solid rgba(255,255,255,0.07);
  border-radius: 10px; padding: 11px 13px; margin-bottom: 8px;
}
.gui-ach .ach-medal {
  flex: none; width: 38px; height: 38px; border-radius: 50%;
  background: radial-gradient(circle at 35% 30%, #ffe9a0, #c8951e 70%, #9a6f12);
  box-shadow: 0 0 10px rgba(255,209,102,0.45), inset 0 -2px 4px rgba(0,0,0,0.35);
  border: 1px solid rgba(255,234,160,0.7);
}
.gui-ach .ach-meat { flex: 1; min-width: 0; }
.gui-ach .ach-entry h4 { font: 800 15px/1.25 Georgia, serif; color: #ffe9c0; margin: 0; }
.gui-ach .ach-desc { font: 500 12.5px/1.5 system-ui, sans-serif; color: #cabfa5; margin: 4px 0 0; }
`;
  document.head.appendChild(s);
}
