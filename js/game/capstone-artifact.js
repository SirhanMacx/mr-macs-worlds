// capstone-artifact.js — the EXAM BRIDGE: turn a lifetime of gathered Codex
// understandings into a structured, standards-stamped capstone artifact that
// mirrors the REAL exam tasks the curriculum builds toward:
//   • Global 9  → the Regents Enduring Issues Essay (kind: 'eie')
//   • AP Psych  → the AAQ / EBQ free-response (kind: 'aaq_ebq')
//
// PURELY ADDITIVE. Imports only ui.js (overlay) + sfx.js (a quiet chime). Never
// edits codex.js / standards.js — both arrive as INJECTED dependencies so this
// file composes with whatever the other agents build:
//   codex     = createCodex(...)  → { record, has, entries(), count(), open() }
//   standards = a world standards module → { FRAMEWORK, STANDARDS_MAP }
//               STANDARDS_MAP[codexId] = { code, strand, label, examTask, confidence, note? }
//
// THE EVIDENCE-RESOLVER FIX (per spec): the Trade Winds capstone pack
// (trade-winds/packs/u9-enduring-issues.js) lists `evidenceIds` that NOTHING
// records — cx-trade-networks / cx-power-and-authority / cx-tech-and-innovation /
// cx-conflict-and-exchange are PHANTOM ids. We do NOT depend on them. Instead we
// resolve evidence against the codex ids the player has ACTUALLY earned
// (codex.entries()), grouped by enduring-issue THEME derived from the standards
// map. The pack is never edited; we simply never read its phantom ids.
//
// PII-FREE: no names, no free text from the player, no device id — only the
// player's own earned understandings, which are authored curriculum content.

import * as UI from './ui.js';
import * as Sfx from './sfx.js';

const STYLE_ID = 'mmw-capstone-style';

// ---------------------------------------------------------------------------
// Era / "place-in-time" bucketing.
//
// "Spans >= 2 eras / places" is the heart of both rubrics. Every standards code
// in this game begins with an integer that orders it in time / by unit:
//   Global 9 : 9.1 .. 9.10   (Key Ideas ascend with era — river valleys → ocean age)
//   AP Psych : 1.x .. 5.x    (Units order the course; SP codes start with 'SP')
// So we derive an "era bucket" from the FIRST integer in the code. For Global 9
// that is the Key-Idea number (9, then the sub-number 1..10 is the real era key);
// for AP Psych it is the unit number. We extract BOTH the leading group and the
// first meaningful sub-number so 9.1 and 9.10 land in different buckets.
// ---------------------------------------------------------------------------
function eraBucketFromCode(code) {
  if (!code || typeof code !== 'string') return null;
  // Global 9 form "9.4c" → era key = the sub-number after the first dot ("4").
  // AP Psych form "2.6"  → unit key = the leading number ("2").
  // Skills/meta form "9.0" or "SP1+2+4" → no era bucket (returns a stable token).
  const g9 = code.match(/^9\.(\d+)/);
  if (g9) return 'g9-' + g9[1];                 // distinct era per Key-Idea sub-number
  const unit = code.match(/^(\d+)\./);
  if (unit) return 'u-' + unit[1];              // AP unit bucket
  const lead = code.match(/^(\d+)/);
  if (lead) return 'n-' + lead[1];
  return null;                                  // SP-only / skills codes have no era
}

// A human label for an era bucket (used in the rubric self-check hint).
function eraLabel(bucket) {
  if (!bucket) return 'an era';
  if (bucket.startsWith('g9-')) return 'Key Idea era ' + bucket.slice(3);
  if (bucket.startsWith('u-')) return 'Unit ' + bucket.slice(2);
  return bucket;
}

// ---------------------------------------------------------------------------
// Enduring-issue THEME classifier (Global 9 EIE only).
//
// The Regents EIE asks the student to name ONE recurring problem and prove it
// endured across far-apart eras. We group the player's earned understandings by
// theme so the artifact can pick the theme with the strongest cross-era support.
// Themes are inferred from the standards strand + code + the codex id/title text —
// tolerant of whatever ids the standards agent maps. Each earned entry lands in
// exactly one theme (first match wins); unmatched entries still appear under a
// general "interconnectedness" theme so they are never silently dropped.
// ---------------------------------------------------------------------------
const EIE_THEMES = [
  {
    key: 'trade-networks',
    claim: 'The impact of trade networks is an enduring issue: whenever roads and sea-lanes connect distant peoples, they carry not only goods but ideas, beliefs, technologies, and disease — reshaping every society they touch, in age after age.',
    match: /trade|silk|salt|gold|indian-ocean|middlemen|columbian|exchange|diffusion|network|merchant|tribute|caravan/i,
  },
  {
    key: 'power-and-authority',
    claim: 'The struggle over power and authority is an enduring issue: in every age rulers must both build power and convince people it is rightful — through law, faith, merit, conquest, or the staging of wealth.',
    match: /power|authority|empire|ruler|republic|mandate|merit|dhamma|pax|feudal|caliph|absolut|law|legitim/i,
  },
  {
    key: 'tech-and-innovation',
    claim: 'The impact of technology and innovation is an enduring issue: a single invention — writing, the printing press, the ocean-going ship — can remake belief, work, and the balance of power across the world.',
    match: /writing|accounting|printing|press|tech|innovation|tool|ship|navigation|gunpowder|caravel|invention/i,
  },
  {
    key: 'conflict-and-exchange',
    claim: 'Conflict and cultural exchange is an enduring issue: contact between peoples carries both violence and exchange together — the same roads that spread war spread faith, trade, and ideas.',
    match: /conflict|crusade|war|conquest|black-death|plague|slave|human-cost|invasion|reformation/i,
  },
  {
    // catch-all so no earned understanding is ever silently dropped.
    key: 'interconnectedness',
    claim: 'The interconnectedness of human societies is an enduring issue: across every era, distant peoples were bound together so that change in one place reshaped the lives of others far away.',
    match: /.*/,
  },
];

function classifyEieTheme(entry, code, strand) {
  const hay = [entry.id, entry.title, entry.idea, strand, code].filter(Boolean).join(' ');
  for (const t of EIE_THEMES) {
    if (t.match.test(hay)) return t;
  }
  return EIE_THEMES[EIE_THEMES.length - 1];
}

// ---------------------------------------------------------------------------
// Resolve the standards stamp for one earned codex id. Tolerant of an absent or
// partial STANDARDS_MAP (the standards agent's file may not be wired yet).
// ---------------------------------------------------------------------------
function stampFor(standards, id) {
  const map = (standards && standards.STANDARDS_MAP) || {};
  const s = map[id];
  if (!s || typeof s !== 'object') return { code: '', strand: '', examTask: '', confidence: '' };
  return {
    code: s.code ? String(s.code) : '',
    strand: s.strand ? String(s.strand) : '',
    examTask: s.examTask ? String(s.examTask) : '',
    confidence: s.confidence ? String(s.confidence) : '',
  };
}

// Build one evidence record from an earned codex entry, standards-stamped.
function toEvidence(entry, standards) {
  const stamp = stampFor(standards, entry.id);
  const bucket = eraBucketFromCode(stamp.code);
  return {
    codexId: entry.id,
    idea: entry.idea || entry.title || '',
    source: entry.source || '',
    code: stamp.code,            // the REAL standards code (e.g. "9.4c"), or '' if unmapped
    era: bucket,                 // era / place bucket derived from the code; null if none
    eraLabel: eraLabel(bucket),
    examTask: stamp.examTask,
  };
}

// Count distinct, non-null era buckets among a list of evidence.
function distinctEras(evidence) {
  const set = new Set();
  for (const e of evidence) if (e.era) set.add(e.era);
  return set.size;
}

// ===========================================================================
// PUBLIC: buildArtifact
//
// Returns a plain data object (no UI, no clock) so it is unit-testable:
//   { kind, claim, evidence:[{codexId, idea, source, code, era, ...}],
//     rubricSelfCheck:[{criterion, met, hint}], framework }
//
// Uses ONLY earned codex ids. If chosenEvidenceIds is given, the artifact is
// limited to that subset (intersected with earned) — the world can let the
// player pick; if omitted, ALL earned evidence relevant to the capstone is used.
// ===========================================================================
export function buildArtifact({ codex, standards, kind = 'eie', chosenEvidenceIds } = {}) {
  // 1) the universe of earned understandings — the ONLY thing we ever cite.
  const earned = (codex && typeof codex.entries === 'function' ? codex.entries() : [])
    .filter(e => e && e.id);

  // optional player-chosen subset (intersect with earned; ignore unknown ids,
  // which is exactly how the phantom evidenceIds get harmlessly dropped).
  let pool = earned;
  if (Array.isArray(chosenEvidenceIds) && chosenEvidenceIds.length) {
    const want = new Set(chosenEvidenceIds.map(String));
    pool = earned.filter(e => want.has(e.id));
  }

  if (kind === 'aaq_ebq') return buildAaqEbq(pool, standards);
  return buildEie(pool, standards);
}

// ---- Global 9: Enduring Issues Essay ----------------------------------------
function buildEie(pool, standards) {
  // group every earned understanding by enduring-issue theme.
  const byTheme = {};
  for (const e of pool) {
    const stamp = stampFor(standards, e.id);
    const theme = classifyEieTheme(e, stamp.code, stamp.strand);
    (byTheme[theme.key] || (byTheme[theme.key] = { theme, items: [] })).items.push(e);
  }

  // pick the strongest theme: the one whose evidence spans the MOST distinct
  // eras (the rubric rewards endurance across time), tie-broken by sheer count.
  let best = null;
  for (const key of Object.keys(byTheme)) {
    const group = byTheme[key];
    const ev = group.items.map(e => toEvidence(e, standards));
    const eras = distinctEras(ev);
    const score = eras * 100 + ev.length;
    if (!best || score > best.score) best = { score, eras, theme: group.theme, evidence: ev };
  }

  const evidence = best ? best.evidence : pool.map(e => toEvidence(e, standards));
  const claim = best ? best.theme.claim : '';
  const eras = distinctEras(evidence);
  const facts = evidence.length;

  // REAL Regents EIE rubric criteria (paraphrased, in the order a grader reads).
  const rubricSelfCheck = [
    {
      criterion: 'Identifies and defines an Enduring Issue',
      met: !!claim && facts > 0,
      hint: claim
        ? 'Your claim names a recurring problem the world faces in age after age — not a single event.'
        : 'Name a recurring problem (such as the impact of trade networks or the struggle over power and authority), not a single event. Gather more understandings on the road first.',
    },
    {
      criterion: 'Argues the issue is significant AND has endured',
      met: !!claim && eras >= 2,
      hint: eras >= 2
        ? 'Your evidence reaches across far-apart eras, which is what makes an issue "enduring."'
        : 'An issue is enduring only if you can show it in DIFFERENT, far-apart eras. Gather evidence from another era to prove it lasted.',
    },
    {
      criterion: 'Uses evidence from >= 2 eras / places',
      // auto-pre-filled from the evidence codes, exactly as the spec requires.
      met: eras >= 2,
      hint: eras >= 2
        ? `Your evidence spans ${eras} distinct eras (${evidence.filter(e => e.era).map(e => e.eraLabel).filter((v, i, a) => a.indexOf(v) === i).join(', ')}).`
        : `Your evidence currently spans ${eras} era${eras === 1 ? '' : 's'}. The rubric needs at least 2 different eras or places.`,
    },
    {
      criterion: 'Evidence is accurate and relevant (real history)',
      met: facts >= 2,
      hint: facts >= 2
        ? 'Each piece of evidence is a real understanding you earned in the world, tied to a real time and place.'
        : 'Strong essays cite at least two accurate pieces of evidence. Earn another understanding to strengthen the case.',
    },
    {
      criterion: 'Analyzes — bends each example to PROVE the claim',
      met: !!claim && facts >= 2 && eras >= 2,
      hint: (!!claim && facts >= 2 && eras >= 2)
        ? 'Connect each example back to your claim explicitly: say WHY it shows the issue enduring, not just THAT it happened.'
        : 'Analysis means explaining how each example proves your claim across time — build out claim + cross-era evidence first.',
    },
  ];

  return {
    kind: 'eie',
    framework: (standards && standards.FRAMEWORK) || null,
    claim,
    evidence,
    rubricSelfCheck,
  };
}

// ---- AP Psych: AAQ / EBQ ----------------------------------------------------
function buildAaqEbq(pool, standards) {
  const evidence = pool.map(e => toEvidence(e, standards));
  // distinct "places" here = distinct units/topics the concepts come from.
  const eras = distinctEras(evidence);
  const concepts = evidence.length;

  // A claim assembled from the player's own earned ideas (no invented text).
  const claim = concepts
    ? 'Applying the science I understood — and weighing the evidence behind each claim — a tidy story is not the same as a true one: a claim holds only when its concept fits the situation AND the evidence rules out the easy alternatives.'
    : '';

  // REAL AP Psych AAQ/EBQ skill demands (apply a concept; evaluate evidence /
  // research design; defend a claim with cited evidence).
  const rubricSelfCheck = [
    {
      criterion: 'Applies a psychological concept to the situation',
      met: concepts >= 1,
      hint: concepts >= 1
        ? 'You can name a real concept (e.g., reconstructive memory, the fundamental attribution error) and show how it explains the case.'
        : 'Earn understandings in the regions first — an AAQ/EBQ requires a real concept to apply.',
    },
    {
      criterion: 'Evaluates the evidence / research design',
      met: concepts >= 2,
      hint: concepts >= 2
        ? 'Ask whether a claim is truly supported, or whether chance, expectation, or a missing comparison group could explain it.'
        : 'Evaluation needs more than one understanding — gather another so you can weigh competing explanations.',
    },
    {
      criterion: 'Defends a claim with cited evidence',
      met: !!claim && concepts >= 2,
      hint: (!!claim && concepts >= 2)
        ? 'State your claim, then cite each understanding as evidence that supports it.'
        : 'Build a claim and back it with at least two earned understandings.',
    },
    {
      criterion: 'Draws on concepts from >= 2 units / topics',
      met: eras >= 2,
      hint: eras >= 2
        ? `Your evidence spans ${eras} units/topics — a strong, integrated answer.`
        : 'A strong answer integrates concepts from more than one unit. Restore another region to broaden it.',
    },
  ];

  return {
    kind: 'aaq_ebq',
    framework: (standards && standards.FRAMEWORK) || null,
    claim,
    evidence,
    rubricSelfCheck,
  };
}

// ===========================================================================
// PUBLIC: openArtifactPanel — a printable, structured view of the artifact.
//
// UI.push a dark/amber panel showing the claim, the standards-stamped evidence,
// and the rubric self-check. A PRINT button calls onPrint (the world wires this
// to studysheet/window.print, or we fall back to window.print()).
// ===========================================================================
export function openArtifactPanel(artifact, { onPrint } = {}) {
  injectStyleOnce();
  const a = artifact && typeof artifact === 'object' ? artifact : { evidence: [], rubricSelfCheck: [] };
  UI.push({
    className: 'gui-capstone',
    html: '<div class="cap-card"></div>',
    onMount(el, ctx) {
      renderArtifact(el.querySelector('.cap-card'), a, { onPrint, close: ctx && ctx.close });
    },
  });
  try { Sfx.open(); } catch (e) { /* audio unavailable */ }
}

function renderArtifact(card, a, { onPrint, close } = {}) {
  const isEie = a.kind !== 'aaq_ebq';
  const heading = isEie ? 'Enduring Issues Argument' : 'Free-Response Argument';
  const sub = isEie
    ? 'Built from what you understood across the eras — the way the Regents asks'
    : 'Built from what you understood across the mind — the way the AP exam asks';

  const ev = Array.isArray(a.evidence) ? a.evidence : [];
  const evidenceHtml = ev.length
    ? ev.map(e => `
        <article class="cap-ev">
          <div class="cap-ev-top">
            <span class="cap-ev-code">${UI.esc(e.code || '—')}</span>
            <span class="cap-ev-era">${UI.esc(e.eraLabel || '')}</span>
          </div>
          <p class="cap-ev-idea">${UI.esc(e.idea || '')}</p>
          ${e.source ? `<p class="cap-ev-src">${UI.esc(e.source)}</p>` : ''}
        </article>`).join('')
    : '<p class="cap-empty">You have not yet gathered evidence to build this argument. Understand more turning points on the road, then return.</p>';

  const rubric = Array.isArray(a.rubricSelfCheck) ? a.rubricSelfCheck : [];
  const rubricHtml = rubric.map(r => `
      <li class="cap-rub ${r.met ? 'met' : 'unmet'}">
        <span class="cap-rub-mark" aria-hidden="true">${r.met ? '✓' : '○'}</span>
        <div>
          <div class="cap-rub-crit">${UI.esc(r.criterion)}</div>
          <div class="cap-rub-hint">${UI.esc(r.hint || '')}</div>
        </div>
      </li>`).join('');

  const fw = a.framework && a.framework.system ? a.framework.system : '';

  card.innerHTML = `
    <div class="cap-head">
      <div>
        <div class="cap-title">${UI.esc(heading)}</div>
        <div class="cap-sub">${UI.esc(sub)}</div>
      </div>
      <button class="dlg-x" data-gui-close type="button">CLOSE</button>
    </div>
    ${a.claim ? `<div class="cap-claim"><span class="cap-claim-tag">Your claim</span>${UI.esc(a.claim)}</div>` : ''}
    <div class="cap-section-h">Your evidence${ev.length ? ` <span class="cap-count">${ev.length}</span>` : ''}</div>
    <div class="cap-ev-list">${evidenceHtml}</div>
    <div class="cap-section-h">Rubric self-check${fw ? ` <span class="cap-fw">${UI.esc(fw)}</span>` : ''}</div>
    <ul class="cap-rubric">${rubricHtml}</ul>
    <div class="cap-actions">
      <button class="cap-btn cap-print" type="button">PRINT THIS ARGUMENT</button>
      <button class="cap-btn cap-close-2" data-gui-close type="button">DONE</button>
    </div>`;

  const printBtn = card.querySelector('.cap-print');
  if (printBtn) {
    printBtn.addEventListener('click', () => {
      try {
        if (typeof onPrint === 'function') onPrint(a);
        else if (typeof window !== 'undefined' && window.print) window.print();
      } catch (e) { /* printing unavailable; never break the panel */ }
    });
  }
}

// ---------- scoped CSS, injected once (does NOT touch css/game.css) ----------
function injectStyleOnce() {
  if (typeof document === 'undefined') return;
  if (document.getElementById(STYLE_ID)) return;
  const s = document.createElement('style');
  s.id = STYLE_ID;
  s.textContent = `
.gui-capstone .cap-card {
  background: linear-gradient(180deg, rgba(22,18,12,0.98), rgba(12,10,7,0.98));
  border: 1px solid rgba(255,210,130,0.42); border-radius: 14px;
  box-shadow: 0 18px 60px rgba(0,0,0,0.66);
  color: #ece4d2; width: min(680px, 96vw); max-height: 90vh; overflow: auto; padding: 18px;
}
.gui-capstone .cap-head { display: flex; justify-content: space-between; align-items: flex-start; gap: 12px; }
.gui-capstone .cap-title { font: 800 22px/1.15 Georgia, serif; color: #ffd166; letter-spacing: 0.02em; }
.gui-capstone .cap-sub { font: 600 12px/1.35 system-ui, sans-serif; color: #bfae8c; margin-top: 3px; }
.gui-capstone .cap-claim {
  font: 500 14.5px/1.55 Georgia, serif; color: #f4ecd8;
  background: rgba(255,209,102,0.10); border-left: 3px solid #ffd166;
  border-radius: 8px; padding: 12px 14px; margin: 14px 0 6px;
}
.gui-capstone .cap-claim-tag {
  display: block; font: 800 10px/1 system-ui, sans-serif; letter-spacing: 0.14em;
  text-transform: uppercase; color: #ffd166; margin-bottom: 6px;
}
.gui-capstone .cap-section-h {
  display: flex; align-items: center; gap: 8px;
  font: 800 11px/1 system-ui, sans-serif; letter-spacing: 0.12em; text-transform: uppercase;
  color: #bfae8c; margin: 18px 0 9px; padding-bottom: 7px; border-bottom: 1px solid rgba(255,210,130,0.16);
}
.gui-capstone .cap-count, .gui-capstone .cap-fw {
  font: 800 10px/1 system-ui, sans-serif; color: #0c0a07; background: #ffd166;
  border-radius: 20px; padding: 3px 8px; letter-spacing: 0.04em; text-transform: none;
}
.gui-capstone .cap-fw { background: rgba(139,233,253,0.85); }
.gui-capstone .cap-ev {
  background: rgba(255,255,255,0.045); border: 1px solid rgba(255,255,255,0.07);
  border-left: 3px solid rgba(139,233,253,0.55);
  border-radius: 9px; padding: 11px 13px; margin-bottom: 8px;
}
.gui-capstone .cap-ev-top { display: flex; align-items: center; gap: 10px; margin-bottom: 5px; }
.gui-capstone .cap-ev-code {
  font: 800 11px/1 system-ui, sans-serif; color: #0c0a07; background: #8be9fd;
  border-radius: 5px; padding: 3px 7px; letter-spacing: 0.03em;
}
.gui-capstone .cap-ev-era { font: 700 11px/1 system-ui, sans-serif; color: #bfae8c; }
.gui-capstone .cap-ev-idea { font: 500 13.5px/1.55 Georgia, serif; color: #ddd2ba; margin: 0; }
.gui-capstone .cap-ev-src { font: 600 11.5px/1.35 system-ui, sans-serif; color: #8be9fd; margin: 6px 0 0; }
.gui-capstone .cap-empty { font: 500 13px/1.6 Georgia, serif; color: #a89a7e; padding: 4px 2px; }
.gui-capstone .cap-rubric { list-style: none; margin: 0; padding: 0; }
.gui-capstone .cap-rub {
  display: flex; gap: 10px; align-items: flex-start;
  padding: 10px 12px; margin-bottom: 7px; border-radius: 9px;
  background: rgba(255,255,255,0.035); border: 1px solid rgba(255,255,255,0.06);
}
.gui-capstone .cap-rub.met { border-left: 3px solid #6ee7a8; }
.gui-capstone .cap-rub.unmet { border-left: 3px solid rgba(255,180,120,0.6); }
.gui-capstone .cap-rub-mark { font: 800 16px/1.2 system-ui, sans-serif; }
.gui-capstone .cap-rub.met .cap-rub-mark { color: #6ee7a8; }
.gui-capstone .cap-rub.unmet .cap-rub-mark { color: #ffb478; }
.gui-capstone .cap-rub-crit { font: 700 13.5px/1.3 system-ui, sans-serif; color: #f4ecd8; }
.gui-capstone .cap-rub-hint { font: 500 12px/1.45 system-ui, sans-serif; color: #b9ad8e; margin-top: 3px; }
.gui-capstone .cap-actions { display: flex; gap: 10px; margin-top: 16px; flex-wrap: wrap; }
.gui-capstone .cap-btn {
  font: 800 12px/1 system-ui, sans-serif; letter-spacing: 0.06em; cursor: pointer;
  border-radius: 8px; padding: 11px 16px; border: 1px solid rgba(255,210,130,0.5);
  background: rgba(255,209,102,0.14); color: #ffd166;
}
.gui-capstone .cap-btn.cap-print { background: #ffd166; color: #0c0a07; border-color: #ffd166; }
.gui-capstone .cap-btn:hover { filter: brightness(1.08); }
`;
  document.head.appendChild(s);
}

export default { buildArtifact, openArtifactPanel };
