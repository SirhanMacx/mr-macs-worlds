// studysheet.js — a PRINTABLE revision sheet derived from the player's Codex,
// grouped by curriculum STANDARD. The classroom bridge: a student plays the
// game, then prints a clean, paper-friendly study sheet of exactly what they
// have come to understand — organized the way the exam organizes it (by strand /
// Key Idea / unit), with "still to understand" stubs for the strands they have
// not yet relit. White paper, black text, amber rules, no 3D, no chrome.
//
// PURELY ADDITIVE. Imports nothing but does its own DOM. Dependencies are
// INJECTED so it composes with whatever the standards / codex agents ship:
//   codex     → { has(id), entries(), count(), ... }
//   standards → { FRAMEWORK, STANDARDS_MAP } (per-world standards module)
//
// HOW PRINT WORKS WITHOUT TOUCHING css/game.css OR THE 3D CANVAS:
// we build a single absolutely-positioned overlay element with id
// "mmw-studysheet" + inject a scoped print stylesheet that, INSIDE @media print,
// hides everything on the page except this overlay (`body > *:not(#mmw-studysheet)
// { display:none }`) and resets the overlay to a plain white document. So the 3D
// game canvas, HUD, and any open panels never appear on paper. After
// window.print() the overlay is removed and the page is untouched.

const STYLE_ID = 'mmw-studysheet-style';
const SHEET_ID = 'mmw-studysheet';

// ---------------------------------------------------------------------------
// Build the grouped model: for each STANDARDS_MAP entry, bucket it under its
// strand, marking whether the player has earned it. Earned entries carry the
// full codex idea/title/source; unearned ones become a "still to understand"
// stub so the sheet doubles as a revision checklist.
// ---------------------------------------------------------------------------
function buildModel({ codex, standards }) {
  const map = (standards && standards.STANDARDS_MAP) || {};
  const fw = (standards && standards.FRAMEWORK) || {};
  const strandLabels = (fw && fw.strands) || {};

  // index the player's earned codex entries by id for quick lookup.
  const earnedById = {};
  const entries = (codex && typeof codex.entries === 'function') ? codex.entries() : [];
  for (const e of entries) if (e && e.id) earnedById[e.id] = e;

  // group standards entries by strand, preserving first-seen strand order.
  const order = [];
  const groups = {};
  for (const codexId of Object.keys(map)) {
    const s = map[codexId] || {};
    const strand = s.strand || 'Other';
    if (!groups[strand]) { groups[strand] = []; order.push(strand); }
    const earned = earnedById[codexId] || null;
    groups[strand].push({
      codexId,
      code: s.code || '',
      label: s.label || (earned ? (earned.title || '') : ''),
      examTask: s.examTask || '',
      confidence: s.confidence || '',
      earned: !!earned,
      title: earned ? (earned.title || s.label || '') : (s.label || ''),
      idea: earned ? (earned.idea || '') : '',
      source: earned ? (earned.source || '') : '',
    });
  }

  // sort each strand's rows by code (natural-ish: "9.2b" before "9.10a").
  for (const strand of order) groups[strand].sort((a, b) => codeKey(a.code) - codeKey(b.code) || a.codexId.localeCompare(b.codexId));

  const totalEarned = order.reduce((n, st) => n + groups[st].filter(r => r.earned).length, 0);
  const totalMapped = order.reduce((n, st) => n + groups[st].length, 0);

  return { fw, strandLabels, order, groups, totalEarned, totalMapped };
}

// turn a code like "9.10a" into a sortable number (9.10 < 9.2 numerically must be
// avoided: weight major*1000 + minor*10 + letter).
function codeKey(code) {
  if (!code) return Number.MAX_SAFE_INTEGER - 1;
  const m = String(code).match(/(\d+)(?:\.(\d+))?\s*([a-z])?/i);
  if (!m) return Number.MAX_SAFE_INTEGER - 1;
  const major = parseInt(m[1], 10) || 0;
  const minor = m[2] ? parseInt(m[2], 10) : 0;
  const letter = m[3] ? (m[3].toLowerCase().charCodeAt(0) - 96) : 0;
  return major * 100000 + minor * 100 + letter;
}

function esc(s) {
  return String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

// ---------------------------------------------------------------------------
// Render the printable HTML for the model.
// ---------------------------------------------------------------------------
function renderSheetHTML(model) {
  const { fw, strandLabels, order, groups, totalEarned, totalMapped } = model;
  const system = (fw && fw.system) || 'Study Sheet';
  const source = (fw && fw.source) || '';

  const sections = order.map(strand => {
    const rows = groups[strand];
    const strandLabel = strandLabels[strand] || strand;
    const rowsHtml = rows.map(r => r.earned
      ? `<div class="ss-row ss-earned">
           <div class="ss-row-head">
             <span class="ss-code">${esc(r.code || '—')}</span>
             <span class="ss-title">${esc(r.title)}</span>
           </div>
           ${r.idea ? `<p class="ss-idea">${esc(r.idea)}</p>` : ''}
           <div class="ss-meta">
             ${r.source ? `<span class="ss-source">${esc(r.source)}</span>` : ''}
             ${r.examTask ? `<span class="ss-exam">Exam: ${esc(r.examTask)}</span>` : ''}
           </div>
         </div>`
      : `<div class="ss-row ss-stub">
           <div class="ss-row-head">
             <span class="ss-code">${esc(r.code || '—')}</span>
             <span class="ss-title">${esc(r.label || 'Still to understand')}</span>
           </div>
           <p class="ss-todo">Still to understand &mdash; relit this in the game and it will be written here.</p>
         </div>`).join('');
    return `<section class="ss-strand">
        <h2>${esc(strand)} <span class="ss-strand-label">${esc(strandLabel)}</span></h2>
        ${rowsHtml}
      </section>`;
  }).join('');

  const emptyNote = order.length === 0
    ? '<p class="ss-empty">No standards are mapped for this world yet. Play and earn understandings, then print again.</p>'
    : '';

  return `
    <header class="ss-header">
      <div class="ss-h-title">${esc(system)} &mdash; Study Sheet</div>
      ${source ? `<div class="ss-h-source">${esc(source)}</div>` : ''}
      <div class="ss-h-progress">Understood <b>${totalEarned}</b> of <b>${totalMapped}</b> mapped turning points.</div>
    </header>
    ${emptyNote}
    <div class="ss-body">${sections}</div>
    <footer class="ss-footer">Mr Mac&rsquo;s Worlds &middot; printed from the player&rsquo;s own Field Journal &middot; no personal data collected.</footer>`;
}

// ---------------------------------------------------------------------------
// PUBLIC: openStudySheet — render the sheet and invoke window.print().
//
// Returns the rendered HTML string (handy for testing/headless verification).
// Safe to call with no DOM (returns the HTML without trying to print).
// ---------------------------------------------------------------------------
export function openStudySheet({ codex, standards } = {}) {
  const model = buildModel({ codex, standards });
  const html = renderSheetHTML(model);

  if (typeof document === 'undefined') return html;   // headless: just return HTML

  injectPrintStyleOnce();

  // remove any prior sheet, then mount a fresh one.
  const prior = document.getElementById(SHEET_ID);
  if (prior) prior.remove();

  const sheet = document.createElement('div');
  sheet.id = SHEET_ID;
  sheet.innerHTML = `
    <div class="ss-page">
      ${html}
      <div class="ss-screen-actions">
        <button class="ss-btn ss-print" type="button">PRINT</button>
        <button class="ss-btn ss-dismiss" type="button">CLOSE</button>
      </div>
    </div>`;
  document.body.appendChild(sheet);

  function dismiss() { try { sheet.remove(); } catch (e) { /* already gone */ } }

  const printBtn = sheet.querySelector('.ss-print');
  const closeBtn = sheet.querySelector('.ss-dismiss');
  if (printBtn) printBtn.addEventListener('click', () => { try { window.print && window.print(); } catch (e) { /* no printer */ } });
  if (closeBtn) closeBtn.addEventListener('click', dismiss);

  // auto-open the print dialog (the screen-only buttons stay for a re-print /
  // close). Guard so a headless / no-print environment never throws.
  try { if (window.print) window.print(); } catch (e) { /* printing unavailable */ }

  return html;
}

// ---------- scoped print + screen CSS, injected once (no css/game.css edit) ----------
function injectPrintStyleOnce() {
  if (typeof document === 'undefined') return;
  if (document.getElementById(STYLE_ID)) return;
  const s = document.createElement('style');
  s.id = STYLE_ID;
  s.textContent = `
/* on-screen: a centered light "paper" preview over a dim backdrop */
#${SHEET_ID} {
  position: fixed; inset: 0; z-index: 99999; overflow: auto;
  background: rgba(8,6,4,0.82); padding: 24px;
}
#${SHEET_ID} .ss-page {
  background: #fff; color: #1a1208; max-width: 820px; margin: 0 auto;
  padding: 32px 36px; border-radius: 6px; box-shadow: 0 18px 60px rgba(0,0,0,0.5);
  font-family: Georgia, 'Times New Roman', serif;
}
#${SHEET_ID} .ss-header { border-bottom: 2px solid #c8902a; padding-bottom: 12px; margin-bottom: 16px; }
#${SHEET_ID} .ss-h-title { font: 800 22px/1.2 Georgia, serif; color: #7a4f0a; }
#${SHEET_ID} .ss-h-source { font: 600 11px/1.3 system-ui, sans-serif; color: #6b5a3a; margin-top: 3px; }
#${SHEET_ID} .ss-h-progress { font: 600 13px/1.4 system-ui, sans-serif; color: #2a2010; margin-top: 8px; }
#${SHEET_ID} .ss-h-progress b { color: #7a4f0a; }
#${SHEET_ID} .ss-empty { font: 500 13px/1.6 Georgia, serif; color: #555; }
#${SHEET_ID} .ss-strand { margin-bottom: 18px; break-inside: avoid; }
#${SHEET_ID} .ss-strand h2 {
  font: 800 12px/1.2 system-ui, sans-serif; letter-spacing: 0.08em; text-transform: uppercase;
  color: #7a4f0a; border-bottom: 1px solid #e3c98a; padding-bottom: 5px; margin: 0 0 8px;
  display: flex; gap: 8px; align-items: baseline;
}
#${SHEET_ID} .ss-strand-label { font: 600 11px/1.2 system-ui, sans-serif; text-transform: none; letter-spacing: 0; color: #6b5a3a; }
#${SHEET_ID} .ss-row { padding: 7px 0 8px; border-bottom: 1px dotted #d9c79a; break-inside: avoid; }
#${SHEET_ID} .ss-row-head { display: flex; gap: 8px; align-items: baseline; }
#${SHEET_ID} .ss-code { font: 800 11px/1.2 system-ui, sans-serif; color: #fff; background: #c8902a; border-radius: 3px; padding: 2px 6px; white-space: nowrap; }
#${SHEET_ID} .ss-title { font: 700 14px/1.3 Georgia, serif; color: #1a1208; }
#${SHEET_ID} .ss-idea { font: 500 13px/1.5 Georgia, serif; color: #2a2010; margin: 4px 0 0; }
#${SHEET_ID} .ss-meta { margin-top: 4px; display: flex; gap: 14px; flex-wrap: wrap; }
#${SHEET_ID} .ss-source { font: 600 11px/1.3 system-ui, sans-serif; color: #6b5a3a; }
#${SHEET_ID} .ss-exam { font: 600 11px/1.3 system-ui, sans-serif; color: #8a5a0a; }
#${SHEET_ID} .ss-stub .ss-title { color: #8a7a55; }
#${SHEET_ID} .ss-todo { font: 500 12px/1.45 Georgia, serif; color: #9a8a64; font-style: italic; margin: 3px 0 0; }
#${SHEET_ID} .ss-footer { margin-top: 18px; border-top: 1px solid #e3c98a; padding-top: 8px; font: 500 10px/1.4 system-ui, sans-serif; color: #6b5a3a; }
#${SHEET_ID} .ss-screen-actions { margin-top: 18px; display: flex; gap: 10px; }
#${SHEET_ID} .ss-btn {
  font: 800 12px/1 system-ui, sans-serif; letter-spacing: 0.06em; cursor: pointer;
  border-radius: 6px; padding: 10px 16px; border: 1px solid #c8902a;
}
#${SHEET_ID} .ss-btn.ss-print { background: #c8902a; color: #fff; }
#${SHEET_ID} .ss-btn.ss-dismiss { background: #fff; color: #7a4f0a; }

/* PRINT: hide the whole app, show ONLY the study sheet as a plain white page. */
@media print {
  body > *:not(#${SHEET_ID}) { display: none !important; }
  #${SHEET_ID} { position: static; inset: auto; background: #fff; padding: 0; overflow: visible; }
  #${SHEET_ID} .ss-page { box-shadow: none; border-radius: 0; max-width: none; margin: 0; padding: 0; }
  #${SHEET_ID} .ss-screen-actions { display: none !important; }
  #${SHEET_ID} .ss-code { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
}
`;
  document.head.appendChild(s);
}

export default { openStudySheet };
