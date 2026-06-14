// mastery.js — a PURE READ MODEL over the live Codex and one world's standards map.
//
// The Codex (js/game/codex.js) is the only evidence of learning the game keeps:
// each earned story-pack keystone records one entry by id. A world's standards.js
// (worlds/<w>/standards.js — a sibling pure-data file built alongside this one)
// declares its FRAMEWORK (the standard system + its strands) and a STANDARDS_MAP
// that pins every mappable codex id to a real standard code, strand, exam task,
// and confidence. createMastery() walks BOTH and answers one question: of the
// turning points this world can document, which has the player actually understood,
// and what does that add up to per strand and overall ("exam coverage N%").
//
// CONTRACTS this file is coded against (so the spine composes):
//   codex      — { record, has, entries(), count, open } from createCodex().
//                Only entries() / has() are read here; nothing is recorded.
//   standards  — a module-shape object { FRAMEWORK, STANDARDS_MAP } (or its
//                default export). FRAMEWORK = { system, source, strands:{code:label} };
//                STANDARDS_MAP = { codexId:{ code, strand, label, examTask,
//                confidence:'high'|'medium'|'flag', note? } }.
//
// HARD RULES: this module NEVER persists (no save field, no localStorage), and it
// NEVER throws — an absent codex, an empty/garbled standards map, an unmapped or
// stale codex id, a missing strand label: every one degrades to a sane empty/zero
// answer. A keystone idea is hard to earn; a read of it must never cost a frame.
//
// Additive only. Imports ui.js for the optional coverage panel; touches no file
// the spec freezes. The panel injects its own scoped <style> once, dark/amber,
// matching the Field Journal idiom in codex.js.
import * as UI from './ui.js';

const STYLE_ID = 'mmw-mastery-style';

// ---- tiny internal helpers (all total — they cannot throw on bad shapes) ----

// Resolve the {FRAMEWORK, STANDARDS_MAP} pair from either a namespace import
// (import * as S) or a default export (import S from). Tolerates either, and a
// bare/absent argument — returning safe empties so callers never branch on it.
function resolveStandards(standards) {
  const s = standards && typeof standards === 'object' ? standards : {};
  // a default export wraps the same two fields; prefer top-level if present.
  const fromDefault = s.default && typeof s.default === 'object' ? s.default : {};
  const FRAMEWORK = (s.FRAMEWORK && typeof s.FRAMEWORK === 'object')
    ? s.FRAMEWORK
    : (fromDefault.FRAMEWORK && typeof fromDefault.FRAMEWORK === 'object' ? fromDefault.FRAMEWORK : {});
  const STANDARDS_MAP = (s.STANDARDS_MAP && typeof s.STANDARDS_MAP === 'object')
    ? s.STANDARDS_MAP
    : (fromDefault.STANDARDS_MAP && typeof fromDefault.STANDARDS_MAP === 'object' ? fromDefault.STANDARDS_MAP : {});
  const strands = (FRAMEWORK.strands && typeof FRAMEWORK.strands === 'object') ? FRAMEWORK.strands : {};
  return { FRAMEWORK, STANDARDS_MAP, strands };
}

// The set of codex ids the player has earned. Reads codex.entries() once; falls
// back to an empty set for a missing/odd codex so every count comes out zero.
function earnedSet(codex) {
  const set = new Set();
  try {
    const list = (codex && typeof codex.entries === 'function') ? codex.entries() : [];
    if (Array.isArray(list)) {
      for (const e of list) {
        const id = e && e.id;
        if (id) set.add(String(id));
      }
    }
  } catch (e) { /* unreadable codex → nothing earned, never throw */ }
  return set;
}

// pct(earned,total) → integer 0..100, 0 when total is 0 (no divide-by-zero).
function pct(earned, total) {
  if (!total || total <= 0) return 0;
  return Math.round((earned / total) * 100);
}

export function createMastery({ codex, standards } = {}) {
  const { FRAMEWORK, STANDARDS_MAP, strands } = resolveStandards(standards);

  // Build a stable, ordered list of strand codes. Source of truth is the
  // FRAMEWORK.strands declaration (preserves the author's pedagogical order:
  // 9.1 → 9.10, or U1 → U5). Any strand referenced by the MAP but missing from
  // the declaration is appended at the end so its items are never dropped silently.
  function strandOrder() {
    const order = [];
    const seen = new Set();
    for (const code of Object.keys(strands)) {
      if (!seen.has(code)) { seen.add(code); order.push(code); }
    }
    for (const id of Object.keys(STANDARDS_MAP)) {
      const m = STANDARDS_MAP[id];
      const sc = m && m.strand;
      if (sc && !seen.has(sc)) { seen.add(sc); order.push(sc); }
    }
    return order;
  }

  // itemsForStrand(code) → every mapped codex id whose .strand === code, in
  // STANDARDS_MAP key order, decorated with its standard fields + earned flag.
  // Unknown code (or no map) → []. Never throws.
  function itemsForStrand(code) {
    const out = [];
    if (!code) return out;
    const earned = earnedSet(codex);
    for (const id of Object.keys(STANDARDS_MAP)) {
      const m = STANDARDS_MAP[id];
      if (!m || m.strand !== code) continue;
      out.push({
        id,
        code: m.code || '',
        strand: m.strand || '',
        label: m.label || '',
        examTask: m.examTask || '',
        confidence: m.confidence || 'medium',
        note: m.note || '',
        earned: earned.has(id),
      });
    }
    return out;
  }

  // byStrand() → ordered array, one row per strand:
  //   { code, label, total, earned, pct, items:[...itemsForStrand] }
  // Strands with zero mapped items still appear (total:0, pct:0) so the matrix
  // reads as the full framework, not just the parts touched.
  function byStrand() {
    const earned = earnedSet(codex);
    return strandOrder().map(code => {
      const items = itemsForStrand(code);
      const got = items.reduce((n, it) => n + (it.earned ? 1 : 0), 0);
      return {
        code,
        label: (strands && strands[code]) ? String(strands[code]) : code,
        total: items.length,
        earned: got,
        pct: pct(got, items.length),
        items,
      };
    });
  }

  // summary() → the whole-world headline. total = number of mapped codex ids
  // (the documentable universe); earned = how many of those the player holds;
  // pct = "exam coverage N%". strands echoes byStrand for a one-call dashboard.
  function summary() {
    const earned = earnedSet(codex);
    const mappedIds = Object.keys(STANDARDS_MAP);
    const total = mappedIds.length;
    let got = 0;
    for (const id of mappedIds) if (earned.has(id)) got++;
    const rows = byStrand();
    return {
      system: FRAMEWORK.system || '',
      source: FRAMEWORK.source || '',
      total,
      earned: got,
      pct: pct(got, total),
      strandCount: rows.length,
      strands: rows,
    };
  }

  return { byStrand, summary, itemsForStrand };
}

// ---------------------------------------------------------------------------
// openCoveragePanel — the dark/amber COVERAGE MATRIX view.
//
// A render helper (not part of the read model). UI.push-es a panel showing:
//   • an overall headline ("Exam coverage N%") under the framework system name,
//   • one row per strand with a fill bar (earned/total) and a count chip,
//   • each strand expandable to its items: a standard-code chip, the idea label,
//     the exam task it feeds, marked earned (amber) or still-to-understand (dim),
//   • PRINT and SHARE buttons, wired by the world (onPrint / onShare). If a
//     handler is absent, that button is omitted (the world owns those features —
//     studysheet.js prints, the export-code path shares).
//
// Pure presentation over a live mastery read model; opens fresh data each call.
// Injects its own scoped style once; never touches css/game.css or the codex panel.
// ---------------------------------------------------------------------------
export function openCoveragePanel({ codex, standards, mastery, onPrint, onShare } = {}) {
  injectStyleOnce();
  // Use the passed read model, or build one on the fly from codex+standards so
  // the panel is usable even if a caller forgets to thread `mastery` through.
  const model = (mastery && typeof mastery.summary === 'function')
    ? mastery
    : createMastery({ codex, standards });

  let sum;
  try { sum = model.summary(); }
  catch (e) { sum = { system: '', source: '', total: 0, earned: 0, pct: 0, strandCount: 0, strands: [] }; }

  UI.push({
    className: 'gui-coverage',
    html: '<div class="cov-card"></div>',
    onMount(el, ctx) { render(el.querySelector('.cov-card'), sum, { onPrint, onShare }, ctx); },
  });
}

function render(card, sum, handlers, ctx) {
  const sys = sum.system || 'Standards Coverage';
  const headline = sum.total > 0
    ? `Exam coverage <b>${sum.pct}%</b> &mdash; ${sum.earned} of ${sum.total} turning points documented`
    : 'No standards are mapped for this world yet.';

  // strand rows: a fill bar sized to pct, a count chip, then the expandable items.
  const rows = (sum.strands || []).map((s, i) => {
    const items = (s.items || []).map(it => {
      const cls = it.earned ? 'cov-item earned' : 'cov-item unearned';
      const conf = it.confidence === 'flag'
        ? '<span class="cov-flag" title="Skill / meta-standard — judged, not auto-scored">skill</span>'
        : (it.confidence === 'medium' ? '<span class="cov-med" title="Medium-confidence alignment">~</span>' : '');
      const task = it.examTask ? `<span class="cov-task">${UI.esc(it.examTask)}</span>` : '';
      return `
        <li class="${cls}">
          <span class="cov-chip">${UI.esc(it.code || '?')}</span>
          <span class="cov-itxt">${UI.esc(it.label || it.id)} ${conf}</span>
          ${task}
          <span class="cov-dot" aria-hidden="true">${it.earned ? 'understood' : 'still to understand'}</span>
        </li>`;
    }).join('');

    const barW = Math.max(0, Math.min(100, s.pct));
    const fullClass = s.total > 0 && s.earned === s.total ? ' full' : '';
    return `
      <section class="cov-strand${fullClass}" data-strand="${i}">
        <button class="cov-srow" type="button" aria-expanded="false">
          <span class="cov-scode">${UI.esc(s.code)}</span>
          <span class="cov-slabel">${UI.esc(s.label)}</span>
          <span class="cov-bar"><span class="cov-fill" style="width:${barW}%"></span></span>
          <span class="cov-count">${s.earned}/${s.total}</span>
          <span class="cov-caret" aria-hidden="true">+</span>
        </button>
        <ul class="cov-items" hidden>${items || '<li class="cov-item none">No turning points mapped to this strand.</li>'}</ul>
      </section>`;
  }).join('');

  const printBtn = handlers && typeof handlers.onPrint === 'function'
    ? '<button class="cov-act cov-print" type="button" data-cov-print>PRINT STUDY SHEET</button>' : '';
  const shareBtn = handlers && typeof handlers.onShare === 'function'
    ? '<button class="cov-act cov-share" type="button" data-cov-share>SHARE MY PROGRESS (NO NAME)</button>' : '';

  card.innerHTML = `
    <div class="cov-head">
      <div>
        <div class="cov-title">Standards Coverage</div>
        <div class="cov-sub">${UI.esc(sys)}</div>
      </div>
      <button class="dlg-x" data-gui-close type="button">CLOSE</button>
    </div>
    <div class="cov-headline">${headline}</div>
    <div class="cov-body">${rows || '<p class="cov-empty">Understand a turning point on the road and it will be charted here against the standards.</p>'}</div>
    ${(printBtn || shareBtn) ? `<div class="cov-actions">${printBtn}${shareBtn}</div>` : ''}`;

  // expand / collapse a strand's item list (delegated; rows re-render on open()).
  card.addEventListener('click', (e) => {
    const srow = e.target.closest && e.target.closest('.cov-srow');
    if (srow) {
      const strand = srow.closest('.cov-strand');
      const items = strand && strand.querySelector('.cov-items');
      if (items) {
        const open = items.hasAttribute('hidden');
        if (open) items.removeAttribute('hidden'); else items.setAttribute('hidden', '');
        srow.setAttribute('aria-expanded', open ? 'true' : 'false');
        const caret = srow.querySelector('.cov-caret');
        if (caret) caret.textContent = open ? '−' : '+'; // − / +
      }
      return;
    }
    if (e.target.closest && e.target.closest('[data-cov-print]')) {
      try { handlers.onPrint(); } catch (err) { /* world handler failed — ignore */ }
      return;
    }
    if (e.target.closest && e.target.closest('[data-cov-share]')) {
      try { handlers.onShare(); } catch (err) { /* world handler failed — ignore */ }
      return;
    }
  });
}

// ---------- scoped CSS, injected once (does NOT touch css/game.css) ----------
function injectStyleOnce() {
  if (typeof document === 'undefined') return;
  if (document.getElementById(STYLE_ID)) return;
  const s = document.createElement('style');
  s.id = STYLE_ID;
  s.textContent = `
.gui-coverage .cov-card {
  background: linear-gradient(180deg, rgba(22,18,12,0.98), rgba(12,10,7,0.98));
  border: 1px solid rgba(255,210,130,0.42); border-radius: 14px;
  box-shadow: 0 18px 60px rgba(0,0,0,0.66);
  color: #ece4d2; width: min(660px, 96vw); max-height: 88vh; overflow: auto; padding: 18px;
}
.gui-coverage .cov-head { display: flex; justify-content: space-between; align-items: flex-start; gap: 12px; }
.gui-coverage .cov-title { font: 800 21px/1.15 Georgia, serif; color: #ffd166; letter-spacing: 0.02em; }
.gui-coverage .cov-sub { font: 600 12px/1.3 system-ui, sans-serif; color: #bfae8c; margin-top: 3px; }
.gui-coverage .cov-headline {
  font: 600 13.5px/1.5 system-ui, sans-serif; color: #e8dfc8;
  background: rgba(255,209,102,0.08); border-left: 3px solid #ffd166;
  border-radius: 6px; padding: 11px 13px; margin: 14px 0 6px;
}
.gui-coverage .cov-headline b { color: #ffd166; font-size: 15px; }
.gui-coverage .cov-empty { font: 500 13px/1.6 Georgia, serif; color: #a89a7e; padding: 6px 2px; }
.gui-coverage .cov-body { margin-top: 6px; }
.gui-coverage .cov-strand { margin-top: 8px; border: 1px solid rgba(255,255,255,0.07); border-radius: 9px; overflow: hidden; }
.gui-coverage .cov-strand.full { border-color: rgba(255,210,130,0.4); }
.gui-coverage .cov-srow {
  display: grid; grid-template-columns: auto 1fr 120px auto auto; align-items: center; gap: 10px;
  width: 100%; text-align: left; cursor: pointer;
  background: rgba(255,255,255,0.04); border: 0; color: #ece4d2;
  padding: 10px 12px; font: inherit;
}
.gui-coverage .cov-srow:hover { background: rgba(255,255,255,0.07); }
.gui-coverage .cov-scode {
  font: 800 11px/1 system-ui, sans-serif; color: #0c0a07; background: #ffd166;
  border-radius: 6px; padding: 4px 7px; letter-spacing: 0; white-space: nowrap;
}
.gui-coverage .cov-slabel { font: 600 13px/1.35 system-ui, sans-serif; color: #ddd2ba; min-width: 0; overflow: hidden; text-overflow: ellipsis; }
.gui-coverage .cov-bar { height: 8px; background: rgba(255,255,255,0.1); border-radius: 5px; overflow: hidden; }
.gui-coverage .cov-fill { display: block; height: 100%; background: linear-gradient(90deg, #ffb74d, #ffd166); border-radius: 5px; transition: width 0.3s ease; }
.gui-coverage .cov-count { font: 800 12px/1 system-ui, sans-serif; color: #bfae8c; white-space: nowrap; }
.gui-coverage .cov-caret { font: 800 16px/1 system-ui, sans-serif; color: #ffd166; width: 14px; text-align: center; }
.gui-coverage .cov-items { list-style: none; margin: 0; padding: 4px 12px 10px; background: rgba(0,0,0,0.22); }
.gui-coverage .cov-item {
  display: grid; grid-template-columns: auto 1fr auto; align-items: center; gap: 9px;
  padding: 8px 0; border-bottom: 1px solid rgba(255,255,255,0.05);
}
.gui-coverage .cov-item:last-child { border-bottom: 0; }
.gui-coverage .cov-item.none { display: block; color: #8a7d63; font: 500 12px/1.5 Georgia, serif; }
.gui-coverage .cov-chip {
  font: 800 10px/1 system-ui, sans-serif; border-radius: 5px; padding: 4px 6px; white-space: nowrap;
}
.gui-coverage .cov-item.earned .cov-chip { color: #0c0a07; background: #8be9fd; }
.gui-coverage .cov-item.unearned .cov-chip { color: #9bb6bd; background: rgba(139,233,253,0.14); }
.gui-coverage .cov-itxt { font: 500 12.5px/1.45 Georgia, serif; min-width: 0; }
.gui-coverage .cov-item.earned .cov-itxt { color: #f2ead6; }
.gui-coverage .cov-item.unearned .cov-itxt { color: #8f846a; }
.gui-coverage .cov-task { font: 700 10.5px/1 system-ui, sans-serif; color: #bfae8c; white-space: nowrap; }
.gui-coverage .cov-dot { grid-column: 2 / 4; font: 700 9.5px/1 system-ui, sans-serif; letter-spacing: 0.1em; text-transform: uppercase; margin-top: 2px; }
.gui-coverage .cov-item.earned .cov-dot { color: #ffd166; }
.gui-coverage .cov-item.unearned .cov-dot { color: #6f6650; }
.gui-coverage .cov-flag { font: 800 9px/1 system-ui, sans-serif; color: #0c0a07; background: #f6c177; border-radius: 4px; padding: 2px 4px; margin-left: 4px; vertical-align: middle; }
.gui-coverage .cov-med { color: #f6c177; font-weight: 800; margin-left: 3px; }
.gui-coverage .cov-actions { display: flex; gap: 10px; flex-wrap: wrap; margin-top: 16px; padding-top: 14px; border-top: 1px solid rgba(255,210,130,0.16); }
.gui-coverage .cov-act {
  flex: 1 1 auto; cursor: pointer; font: 800 12px/1 system-ui, sans-serif; letter-spacing: 0.06em;
  border-radius: 8px; padding: 12px 14px; border: 1px solid rgba(255,210,130,0.5);
  background: rgba(255,209,102,0.1); color: #ffd166; transition: background 0.15s ease;
}
.gui-coverage .cov-act:hover { background: rgba(255,209,102,0.2); }
`;
  document.head.appendChild(s);
}

export default { createMastery, openCoveragePanel };
