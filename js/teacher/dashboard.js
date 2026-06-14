// dashboard.js — the teacher's privacy-safe Proof-of-Learning view. No accounts,
// no network, no names — ever. Two panels:
//
//   1. THIS DEVICE — reads the mmw-game-*-v? saves already in this browser
//      (read-only) and shows mastery by standard for whichever worlds have been
//      played here. Useful on a shared classroom machine or a teacher's own run.
//
//   2. CLASS CODES — a textarea where students paste their opt-in PoL1 export
//      codes (one per line). Decoded + map-validated + aggregated into a coverage
//      heatmap by standard, a most-missed list, and a roster COUNT (never names).
//
// Dark/amber, scoped <style> injected once. Static + offline. Standards maps are
// imported dynamically and the page degrades gracefully if a world's standards.js
// has not shipped yet (it simply can't aggregate that world, and says so).

import { decode, mapHashOf } from './export-code.js';
import { aggregate } from './aggregate.js';

const WORLDS = [
  { key: 'trade-winds', short: 'tw', label: 'Trade Winds', course: 'Global History 9' },
  { key: 'mind-atlas',  short: 'ma', label: 'Mind Atlas',  course: 'AP Psychology' },
  { key: 'word-harbor', short: 'wh', label: 'Word Harbor', course: 'Global 9 ENL' },
];

// Verbatim privacy statement — shipped on the page, word-for-word.
const PRIVACY_STATEMENT = [
  'This dashboard is private by construction. It has no accounts, no logins, and never sends anything over the network.',
  'Student export codes carry only two things: which standards were understood, and which were flagged for re-teaching. They are bits, not names. A code contains no student name, no free text, no device identifier, and no email — by construction it can only be the characters A–Z, a–z, 0–9, and . _ -',
  'Sharing a code is opt-in. A student presses "Share my progress (no name)" inside the game; nothing is collected unless a student chooses to hand you the code.',
  'Time-on-task is not collected (privacy-safe). The only time signal in a code is a coarse week bucket, and it is optional.',
  'This-device mastery is read directly from saves already in this browser and is never uploaded.',
].join('\n\n');

let standardsMapsByWorld = null; // lazily loaded { worldKey: STANDARDS_MAP }

export async function start(root) {
  injectStyleOnce();
  const host = root || document.getElementById('teacher-root') || document.body;
  host.innerHTML = shell();

  standardsMapsByWorld = await loadStandardsMaps();

  renderDeviceView(host.querySelector('#tv-device'));
  wireClassCodes(host);
  wirePrivacy(host);
}

// ---- dynamic, fault-tolerant standards.js loading -----------------------
async function loadStandardsMaps() {
  const out = {};
  for (const w of WORLDS) {
    try {
      // standards.js are built by sibling agents; tolerate their absence.
      const mod = await import(`../game/worlds/${w.key}/standards.js`);
      const map = (mod && (mod.STANDARDS_MAP || (mod.default && mod.default.STANDARDS_MAP))) || null;
      if (map && Object.keys(map).length) out[w.key] = map;
    } catch (e) {
      // not shipped yet — skip; the UI will note the world is unavailable.
    }
  }
  return out;
}

// ---- THIS DEVICE: read mmw-game-*-v? saves read-only --------------------
// We do NOT depend on save.js (it has side effects / version pinning). We read
// localStorage directly, matching any version suffix, and never write back.
function readDeviceSaves() {
  const found = {};
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      const m = /^mmw-game-(trade-winds|mind-atlas|word-harbor)-v\d+$/.exec(k || '');
      if (!m) continue;
      try {
        const raw = JSON.parse(localStorage.getItem(k) || 'null');
        if (raw && typeof raw === 'object') found[m[1]] = { key: k, state: raw };
      } catch (e) { /* skip unparseable */ }
    }
  } catch (e) { /* localStorage unavailable */ }
  return found;
}

function earnedIdSet(state) {
  const set = new Set();
  const codex = state && state.codex;
  if (Array.isArray(codex)) {
    for (const e of codex) if (e && e.id) set.add(String(e.id));
  } else if (codex && typeof codex === 'object') {
    for (const k of Object.keys(codex)) { const e = codex[k]; if (e && e.id) set.add(String(e.id)); }
  }
  return set;
}

function renderDeviceView(el) {
  if (!el) return;
  const saves = readDeviceSaves();
  const blocks = [];
  for (const w of WORLDS) {
    const map = standardsMapsByWorld[w.key];
    const save = saves[w.key];
    if (!map) {
      blocks.push(worldBlock(w, `<p class="tv-note">Standards map for ${esc(w.label)} is not installed yet.</p>`));
      continue;
    }
    if (!save) {
      blocks.push(worldBlock(w, `<p class="tv-note">No saved progress for ${esc(w.label)} on this device.</p>`));
      continue;
    }
    const earned = earnedIdSet(save.state);
    blocks.push(worldBlock(w, deviceStrandTable(map, earned)));
  }
  el.innerHTML = blocks.join('') || '<p class="tv-note">No worlds available.</p>';
}

function deviceStrandTable(map, earnedSet) {
  const keys = Object.keys(map);
  const rows = keys.map(id => {
    const meta = map[id] || {};
    const got = earnedSet.has(id);
    return `<tr class="${got ? 'is-earned' : 'is-open'}">
      <td class="tv-std">${esc(meta.code || id)}</td>
      <td class="tv-lab">${esc(meta.label || id)}</td>
      <td class="tv-mark">${got ? 'understood' : '—'}</td>
    </tr>`;
  }).join('');
  const earnedN = keys.filter(id => earnedSet.has(id)).length;
  return `
    <div class="tv-summary">Understood <b>${earnedN}</b> of <b>${keys.length}</b> mapped standards.</div>
    <table class="tv-table"><thead><tr><th>Standard</th><th>What it covers</th><th>This device</th></tr></thead>
      <tbody>${rows}</tbody></table>`;
}

function worldBlock(w, inner) {
  return `<section class="tv-world">
    <h3>${esc(w.label)} <span class="tv-course">${esc(w.course)}</span></h3>
    ${inner}
  </section>`;
}

// ---- CLASS CODES: paste -> aggregate -> heatmap + most-missed -----------
function wireClassCodes(host) {
  const ta = host.querySelector('#tv-codes');
  const btn = host.querySelector('#tv-run');
  const clr = host.querySelector('#tv-clear');
  const out = host.querySelector('#tv-class-out');
  if (!btn || !ta || !out) return;

  btn.addEventListener('click', () => {
    const codes = ta.value.split(/[\s,]+/).map(s => s.trim()).filter(Boolean);
    if (!codes.length) { out.innerHTML = '<p class="tv-note">Paste one or more export codes above, one per line.</p>'; return; }
    const result = aggregate(codes, standardsMapsByWorld, mapHashOf);
    out.innerHTML = renderClassResult(result, codes.length);
  });
  if (clr) clr.addEventListener('click', () => { ta.value = ''; out.innerHTML = ''; });
}

function renderClassResult(result, submitted) {
  const parts = [];
  parts.push(`<div class="tv-roster">Roster: <b>${result.rosterCount}</b> code${result.rosterCount === 1 ? '' : 's'} accepted${submitted > result.rosterCount ? ` · ${submitted - result.rosterCount} not counted` : ''}. <span class="tv-tot">Time-on-task: not collected (privacy-safe).</span></div>`);

  for (const w of WORLDS) {
    const wr = result.byWorld[w.key];
    if (!wr) {
      if (anyCodeFor(result, w.key)) parts.push(worldBlock(w, `<p class="tv-note">Standards map not installed; cannot aggregate ${esc(w.label)}.</p>`));
      continue;
    }
    if (!wr.accepted) continue; // nothing pasted for this world
    parts.push(worldBlock(w, classWorldBody(wr)));
  }

  if (result.rejected && result.rejected.length) {
    parts.push(`<details class="tv-rejected"><summary>${result.rejected.length} code(s) not counted</summary>
      <ul>${result.rejected.map(r => `<li><code>${esc(r.code)}</code> — ${esc(r.reason)}</li>`).join('')}</ul></details>`);
  }
  return parts.join('');
}

function anyCodeFor() { return false; } // rejected log already explains; keep heatmap clean

function classWorldBody(wr) {
  const heat = wr.strands.map(s => {
    const pct = s.earnedPct;
    return `<div class="tv-cell" style="--pct:${pct}" title="${esc(s.label)} — ${pct}% understood${s.missedCount ? `, ${s.missedCount} flagged` : ''}">
      <div class="tv-bar"><div class="tv-fill" style="height:${pct}%"></div></div>
      <div class="tv-cell-code">${esc(s.code)}</div>
      <div class="tv-cell-pct">${pct}%</div>
    </div>`;
  }).join('');

  const missed = wr.mostMissed.length
    ? `<ol class="tv-missed">${wr.mostMissed.map(s =>
        `<li><span class="tv-mcount">${s.missedCount}</span> <b>${esc(s.code)}</b> ${esc(s.label)}</li>`).join('')}</ol>`
    : '<p class="tv-note">No standards flagged for re-teaching.</p>';

  return `
    <div class="tv-summary">${wr.accepted} submitter(s) · mean <b>${wr.meanEarned}</b> of <b>${wr.meanTotal}</b> standards understood.</div>
    <div class="tv-heat-label">Coverage heatmap — % of submitters who understood each standard</div>
    <div class="tv-heat">${heat}</div>
    <div class="tv-heat-label">Most-missed (flagged for re-teach)</div>
    ${missed}`;
}

// ---- privacy statement (verbatim) + optional QR copy --------------------
function wirePrivacy(host) {
  const el = host.querySelector('#tv-privacy');
  if (el) el.textContent = PRIVACY_STATEMENT;
}

// ---- shell + scoped style ----------------------------------------------
function shell() {
  return `
  <div class="tv-wrap">
    <header class="tv-head">
      <div class="tv-kicker">MR. MAC'S WORLDS</div>
      <h1 class="tv-h1">Proof-of-Learning · Teacher View</h1>
      <p class="tv-lede">Standards-aligned evidence of learning. No accounts, no names, nothing leaves this device.</p>
      <p class="tv-back"><a href="./index.html">&larr; Back to the worlds</a></p>
    </header>

    <section class="tv-card">
      <h2>This device</h2>
      <p class="tv-sub">Mastery by standard, read directly from the saves already in this browser.</p>
      <div id="tv-device"></div>
    </section>

    <section class="tv-card">
      <h2>Class coverage</h2>
      <p class="tv-sub">Paste students' opt-in export codes — one per line. Codes are bits, never names.</p>
      <textarea id="tv-codes" class="tv-codes" rows="6" placeholder="PoL1.tw.… &#10;PoL1.ma.… &#10;PoL1.wh.…" spellcheck="false"></textarea>
      <div class="tv-btns">
        <button id="tv-run" class="tv-btn tv-btn-go" type="button">Build coverage</button>
        <button id="tv-clear" class="tv-btn" type="button">Clear</button>
      </div>
      <div id="tv-class-out" class="tv-class-out"></div>
    </section>

    <section class="tv-card tv-privacy-card">
      <h2>Privacy</h2>
      <pre id="tv-privacy" class="tv-privacy"></pre>
    </section>
  </div>`;
}

function esc(s) {
  return String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

const STYLE_ID = 'mmw-teacher-style';
function injectStyleOnce() {
  if (typeof document === 'undefined' || document.getElementById(STYLE_ID)) return;
  const s = document.createElement('style');
  s.id = STYLE_ID;
  s.textContent = `
  :root { color-scheme: dark; }
  body.tv-body { margin:0; background:#0b0907; color:#ece4d2; font-family: system-ui, sans-serif; }
  .tv-wrap { max-width: 980px; margin: 0 auto; padding: 24px 18px 64px; }
  .tv-head { margin-bottom: 18px; }
  .tv-kicker { font: 800 11px/1 system-ui, sans-serif; letter-spacing: .22em; color:#bfae8c; }
  .tv-h1 { font: 800 30px/1.1 Georgia, serif; color:#ffd166; margin: 8px 0 6px; letter-spacing:.01em; }
  .tv-lede { font: 500 14px/1.5 system-ui, sans-serif; color:#cabfa5; margin: 0; max-width: 62ch; }
  .tv-back { margin: 10px 0 0; font: 600 13px/1 system-ui, sans-serif; }
  .tv-back a { color:#8be9fd; text-decoration: none; }
  .tv-back a:hover { text-decoration: underline; }
  .tv-card {
    background: linear-gradient(180deg, rgba(22,18,12,0.98), rgba(12,10,7,0.98));
    border: 1px solid rgba(255,210,130,0.42); border-radius: 14px;
    box-shadow: 0 18px 60px rgba(0,0,0,0.5);
    padding: 18px; margin: 16px 0;
  }
  .tv-card h2 { font: 800 18px/1.2 Georgia, serif; color:#ffd166; margin:0 0 4px; }
  .tv-sub { font: 500 12.5px/1.4 system-ui, sans-serif; color:#bfae8c; margin: 0 0 12px; }
  .tv-world { margin: 14px 0; padding-top: 12px; border-top: 1px solid rgba(255,210,130,0.16); }
  .tv-world:first-child { border-top: none; padding-top: 0; }
  .tv-world h3 { font: 800 15px/1.2 Georgia, serif; color:#f4ecd8; margin:0 0 8px; display:flex; align-items:baseline; gap:10px; }
  .tv-course { font: 600 11px/1 system-ui, sans-serif; color:#8be9fd; letter-spacing:.04em; }
  .tv-note { font: 500 13px/1.5 Georgia, serif; color:#a89a7e; margin: 6px 0; }
  .tv-summary { font: 600 13px/1.5 system-ui, sans-serif; color:#e8dfc8;
    background: rgba(255,209,102,0.08); border-left: 3px solid #ffd166; border-radius:6px; padding:9px 11px; margin: 8px 0 10px; }
  .tv-summary b { color:#ffd166; }
  .tv-table { width:100%; border-collapse: collapse; font: 500 12.5px/1.4 system-ui, sans-serif; }
  .tv-table th { text-align:left; font: 800 10px/1 system-ui, sans-serif; letter-spacing:.1em; text-transform:uppercase;
    color:#bfae8c; padding:6px 8px; border-bottom:1px solid rgba(255,210,130,0.2); }
  .tv-table td { padding:7px 8px; border-bottom:1px solid rgba(255,255,255,0.05); vertical-align:top; }
  .tv-std { color:#ffe9c0; font-weight:700; white-space:nowrap; }
  .tv-lab { color:#ddd2ba; }
  .tv-mark { white-space:nowrap; color:#a89a7e; }
  tr.is-earned .tv-mark { color:#8de08d; font-weight:700; }
  .tv-codes { width:100%; box-sizing:border-box; resize:vertical; min-height:96px;
    background: rgba(0,0,0,0.35); color:#ece4d2; border:1px solid rgba(255,210,130,0.3);
    border-radius:8px; padding:10px 12px; font: 500 13px/1.5 ui-monospace, Menlo, monospace; }
  .tv-btns { margin: 10px 0 0; display:flex; gap:10px; }
  .tv-btn { font: 800 12px/1 system-ui, sans-serif; letter-spacing:.05em; color:#ece4d2;
    background: rgba(255,255,255,0.06); border:1px solid rgba(255,210,130,0.3); border-radius:8px;
    padding:10px 14px; cursor:pointer; }
  .tv-btn:hover { border-color: rgba(255,210,130,0.6); }
  .tv-btn-go { color:#0c0a07; background:#ffd166; border-color:#ffd166; }
  .tv-class-out { margin-top: 14px; }
  .tv-roster { font: 700 14px/1.4 system-ui, sans-serif; color:#ffe9c0; margin-bottom: 10px; }
  .tv-roster b { color:#ffd166; }
  .tv-tot { display:block; font: 500 11.5px/1.4 system-ui, sans-serif; color:#a89a7e; margin-top:2px; }
  .tv-heat-label { font: 800 10px/1 system-ui, sans-serif; letter-spacing:.1em; text-transform:uppercase; color:#bfae8c; margin: 12px 0 8px; }
  .tv-heat { display:flex; flex-wrap:wrap; gap:8px; }
  .tv-cell { width: 64px; text-align:center; }
  .tv-bar { height: 60px; width: 100%; background: rgba(255,255,255,0.06); border-radius:6px;
    border:1px solid rgba(255,255,255,0.08); display:flex; align-items:flex-end; overflow:hidden; }
  .tv-fill { width:100%;
    background: linear-gradient(180deg, #ffe9a0, #ffd166 60%, #c8951e);
    min-height: 2px; transition: height .2s; }
  .tv-cell-code { font: 700 10px/1.2 ui-monospace, Menlo, monospace; color:#ffe9c0; margin-top:4px; word-break:break-all; }
  .tv-cell-pct { font: 600 10px/1 system-ui, sans-serif; color:#bfae8c; margin-top:2px; }
  .tv-missed { margin: 6px 0 0; padding-left: 0; list-style:none; }
  .tv-missed li { display:flex; align-items:baseline; gap:8px; padding:5px 0; border-bottom:1px solid rgba(255,255,255,0.05);
    font: 500 13px/1.4 system-ui, sans-serif; color:#ddd2ba; }
  .tv-missed b { color:#ffe9c0; }
  .tv-mcount { flex:none; min-width:22px; text-align:center; font: 800 11px/1 system-ui, sans-serif;
    color:#0c0a07; background:#ff9b6b; border-radius:20px; padding:3px 6px; }
  .tv-rejected { margin-top:14px; font: 500 12px/1.5 system-ui, sans-serif; color:#a89a7e; }
  .tv-rejected summary { cursor:pointer; color:#bfae8c; font-weight:700; }
  .tv-rejected code { color:#8be9fd; }
  .tv-privacy { white-space: pre-wrap; font: 500 13px/1.6 Georgia, serif; color:#ddd2ba; margin:0; }
  `;
  document.head.appendChild(s);
}

export default { start, PRIVACY_STATEMENT };
