// skill-stations.js — all the instructional overlay panels.
// Each function opens a modal over the 3D canvas, returns when closed.
import { loadBank, drawQuestions } from './content-loader.js';
import * as Progress from './progress.js';

const overlay = () => document.getElementById('panel-overlay');
const root = () => document.getElementById('panel-root');

let _onClose = null;
export function setPauseHandlers(onOpen, onClose) { _open = onOpen; _onClose = onClose; }
let _open = null;

function escapeHTML(s) {
  return String(s).replace(/[&<>"']/g, c => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[c]));
}
function nl2br(s) { return escapeHTML(s).replace(/\n/g, '<br>'); }

export function openPanel(html, { wide = false } = {}) {
  _open && _open();
  root().className = 'panel' + (wide ? ' panel-wide' : '');
  root().innerHTML = html;
  overlay().classList.add('open');
  // focus close button for a11y
  const c = root().querySelector('.panel-close');
  if (c) c.focus();
}

export function closePanel() {
  overlay().classList.remove('open');
  root().innerHTML = '';
  _onClose && _onClose();
}

function header(title, sub) {
  return `<div class="panel-head">
      <div><h2>${escapeHTML(title)}</h2>${sub ? `<p class="panel-sub">${escapeHTML(sub)}</p>` : ''}</div>
      <button class="panel-close" aria-label="Close">✕</button>
    </div>`;
}

function wireClose() {
  root().querySelector('.panel-close')?.addEventListener('click', closePanel);
}

// ---------------- Content node (key terms) ----------------
export function openContentNode(node) {
  const terms = node.terms.map(t =>
    `<div class="term"><div class="term-name">${escapeHTML(t.term)}</div><div class="term-def">${escapeHTML(t.def)}</div></div>`
  ).join('');
  openPanel(`
    ${header(node.label, node.unit)}
    <p class="node-blurb">${escapeHTML(node.blurb)}</p>
    <div class="terms">${terms}</div>
    <div class="panel-actions">
      <button class="btn btn-primary" id="node-done">Got it (+10 XP)</button>
    </div>
  `);
  wireClose();
  root().querySelector('#node-done').addEventListener('click', () => {
    const fresh = Progress.collect('node:' + node.id, 10);
    closePanel();
    if (fresh) toast(`+10 XP — ${node.label} learned!`);
  });
}

// ---------------- MCQ runner ----------------
export async function openMCQ(courseKey, stationCfg) {
  openPanel(`${header(stationCfg.station, 'Loading questions…')}<div class="loading">Loading…</div>`);
  wireClose();
  let bank;
  try { bank = await loadBank(courseKey); }
  catch (e) { root().querySelector('.loading').textContent = 'Could not load the question bank.'; return; }

  const questions = drawQuestions(bank, stationCfg.perRound || 10);
  let idx = 0, correct = 0;
  const shuffledChoices = questions.map(q => shuffleChoices(q));

  function render() {
    if (idx >= questions.length) return finish();
    const q = questions[idx];
    const ch = shuffledChoices[idx];
    const opts = ch.map((c, i) =>
      `<button class="mcq-choice" data-i="${i}">${escapeHTML(c)}</button>`).join('');
    openPanel(`
      ${header(stationCfg.station, `Question ${idx + 1} of ${questions.length} · ${escapeHTML(q.topic)}`)}
      <div class="mcq-prompt">${escapeHTML(q.prompt)}</div>
      <div class="mcq-choices">${opts}</div>
      <div class="mcq-feedback" id="mcq-fb"></div>
      <div class="panel-actions" id="mcq-actions"></div>
    `, { wide: true });
    wireClose();
    root().querySelectorAll('.mcq-choice').forEach(btn => {
      btn.addEventListener('click', () => grade(btn, q, ch));
    });
  }

  function grade(btn, q, ch) {
    const picked = ch[+btn.dataset.i];
    const isRight = picked === q.answer;
    if (isRight) correct++;
    root().querySelectorAll('.mcq-choice').forEach(b => {
      b.disabled = true;
      const val = ch[+b.dataset.i];
      if (val === q.answer) b.classList.add('correct');
      else if (b === btn) b.classList.add('wrong');
    });
    const fb = root().querySelector('#mcq-fb');
    fb.className = 'mcq-feedback show ' + (isRight ? 'good' : 'bad');
    fb.innerHTML = `<strong>${isRight ? 'Correct!' : 'Not quite.'}</strong> ${escapeHTML(q.explanation || ('Answer: ' + q.answer))}`;
    const actions = root().querySelector('#mcq-actions');
    actions.innerHTML = `<button class="btn btn-primary" id="mcq-next">${idx + 1 < questions.length ? 'Next →' : 'See results'}</button>`;
    actions.querySelector('#mcq-next').addEventListener('click', () => { idx++; render(); });
  }

  function finish() {
    Progress.recordMCQ(correct, questions.length);
    const xp = correct * 5;
    Progress.addXP(xp, 'mcq');
    const pct = Math.round((correct / questions.length) * 100);
    openPanel(`
      ${header('Round complete', stationCfg.station)}
      <div class="score-big">${correct} / ${questions.length}</div>
      <p class="score-sub">${pct}% correct · +${xp} XP</p>
      <div class="panel-actions">
        <button class="btn" id="mcq-again">Play again</button>
        <button class="btn btn-primary panel-close-btn">Done</button>
      </div>
    `);
    root().querySelector('#mcq-again').addEventListener('click', () => openMCQ(courseKey, stationCfg));
    root().querySelector('.panel-close-btn').addEventListener('click', closePanel);
    if (pct >= 70) toast(`Nice round — ${pct}%!`);
  }

  render();
}

function shuffleChoices(q) {
  const a = q.choices.slice();
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
  return a;
}

// ---------------- Free-Response Lab (AAQ / EBQ) ----------------
export function openFRQ(frqCfg) {
  const items = frqCfg.items;
  let pick = 0;
  function render() {
    const it = items[pick];
    const tabs = items.map((x, i) =>
      `<button class="frq-tab ${i === pick ? 'active' : ''}" data-i="${i}">${escapeHTML(x.type)} ${i + 1}</button>`).join('');
    openPanel(`
      ${header(frqCfg.station, frqCfg.blurb)}
      <div class="frq-tabs">${tabs}</div>
      <h3 class="frq-title">${escapeHTML(it.title)}</h3>
      <div class="doc"><div class="doc-label">${it.type === 'AAQ' ? 'Research source' : 'Sources'}</div><div class="doc-text">${nl2br(it.stimulus)}</div></div>
      <div class="frq-prompt"><strong>Prompt</strong><div>${nl2br(it.prompt)}</div></div>
      <p class="frq-think">Plan your response below (private — nothing is sent anywhere), then reveal the scoring rubric and a model answer.</p>
      <textarea class="frq-input" placeholder="Type your response here…"></textarea>
      <div class="panel-actions">
        <button class="btn btn-primary" id="frq-reveal">Reveal rubric &amp; model (+15 XP)</button>
      </div>
      <div class="frq-reveal" id="frq-out"></div>
    `, { wide: true });
    wireClose();
    root().querySelectorAll('.frq-tab').forEach(b =>
      b.addEventListener('click', () => { pick = +b.dataset.i; render(); }));
    root().querySelector('#frq-reveal').addEventListener('click', () => reveal(it));
  }
  function reveal(it) {
    const rubric = it.rubric.map(r =>
      `<li><strong>${escapeHTML(r.part)}</strong> — ${escapeHTML(r.criterion)}</li>`).join('');
    const out = root().querySelector('#frq-out');
    out.innerHTML = `
      <h4>Scoring rubric (${it.type} · 7 points)</h4>
      <ul class="rubric">${rubric}</ul>
      <h4>Model response</h4>
      <div class="model">${nl2br(it.model)}</div>
      <p class="frq-tip">Compare your draft to each rubric point. On the real exam, the Application points reward applying <em>your own</em> course knowledge — that's where most points are won.</p>
    `;
    out.classList.add('show');
    if (Progress.collect('frq:' + it.title, 15)) toast('+15 XP — free-response practiced!');
    out.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
  render();
}

// ---------------- Document Lab (CRQ) ----------------
export function openCRQ(crqCfg) {
  const set = crqCfg.items[0];
  const docs = set.docs.map(d =>
    `<div class="doc"><div class="doc-label">${escapeHTML(d.label)} — <span class="doc-src">${escapeHTML(d.source)}</span></div><div class="doc-text">${escapeHTML(d.text)}</div></div>`).join('');
  const qs = set.questions.map((q, i) => `
    <div class="crq-q">
      <div class="crq-qtext">${nl2br(q.q)}</div>
      <textarea class="frq-input" placeholder="Type your answer…"></textarea>
      <button class="btn btn-sm reveal-q" data-i="${i}">Reveal model &amp; rubric</button>
      <div class="crq-model" id="crq-model-${i}"></div>
    </div>`).join('');
  openPanel(`
    ${header(crqCfg.station, crqCfg.blurb)}
    <h3 class="frq-title">${escapeHTML(set.title)}</h3>
    <div class="docs">${docs}</div>
    <div class="crq-questions">${qs}</div>
    <div class="panel-actions"><button class="btn btn-primary panel-close-btn">Done (+15 XP)</button></div>
  `, { wide: true });
  wireClose();
  root().querySelectorAll('.reveal-q').forEach(b => b.addEventListener('click', () => {
    const i = +b.dataset.i; const q = set.questions[i];
    const el = root().querySelector('#crq-model-' + i);
    el.innerHTML = `<div class="rubric-line"><strong>What earns credit:</strong> ${escapeHTML(q.rubric)}</div><h4>Model answer</h4><div class="model">${escapeHTML(q.model)}</div>`;
    el.classList.add('show');
    b.disabled = true;
  }));
  root().querySelector('.panel-close-btn').addEventListener('click', () => {
    if (Progress.collect('crq:' + set.title, 15)) toast('+15 XP — CRQ practiced!');
    closePanel();
  });
}

// ---------------- Enduring Issues Quest ----------------
export function openEI(eiCfg) {
  const q = eiCfg.quest;
  const issueCards = eiCfg.issues.map(is =>
    `<button class="ei-issue" data-name="${escapeHTML(is.name)}"><span class="ei-name">${escapeHTML(is.name)}</span><span class="ei-desc">${escapeHTML(is.desc)}</span></button>`).join('');
  const docs = q.docs.map(d =>
    `<div class="doc"><div class="doc-label">${escapeHTML(d.label)} — <span class="doc-src">${escapeHTML(d.source)}</span></div><div class="doc-text">${escapeHTML(d.text)}</div></div>`).join('');
  openPanel(`
    ${header(eiCfg.station, 'The culminating Regents skill')}
    <div class="ei-intro">${escapeHTML(eiCfg.intro)}</div>
    <h3 class="frq-title">${escapeHTML(q.title)}</h3>
    <div class="docs">${docs}</div>
    <p class="ei-ask"><strong>Step 1.</strong> Read all three documents. Which enduring issue do they share? Pick one:</p>
    <div class="ei-issues">${issueCards}</div>
    <div class="ei-result" id="ei-result"></div>
  `, { wide: true });
  wireClose();
  root().querySelectorAll('.ei-issue').forEach(btn => btn.addEventListener('click', () => {
    const name = btn.dataset.name;
    const correct = name === q.answer.issue;
    root().querySelectorAll('.ei-issue').forEach(b => {
      b.disabled = true;
      if (b.dataset.name === q.answer.issue) b.classList.add('correct');
      else if (b === btn) b.classList.add('wrong');
    });
    const rub = q.answer.rubric.map(r => `<li>${escapeHTML(r)}</li>`).join('');
    root().querySelector('#ei-result').innerHTML = `
      <div class="ei-verdict ${correct ? 'good' : 'bad'}">
        ${correct ? '✓ Strong choice.' : 'Defensible issues here are Inequality (strongest) or Power.'}
        The best-supported enduring issue across these documents is <strong>${escapeHTML(q.answer.issue)}</strong>.
      </div>
      <p class="ei-ask"><strong>Step 2.</strong> Define it and argue why it is significant — here is a model:</p>
      <div class="model">${escapeHTML(q.answer.why)}</div>
      <h4>What a full essay needs</h4>
      <ul class="rubric">${rub}</ul>
      <div class="panel-actions"><button class="btn btn-primary panel-close-btn">Quest complete (+25 XP)</button></div>
    `;
    root().querySelector('.panel-close-btn').addEventListener('click', () => {
      if (Progress.collect('ei:' + q.title, 25)) toast('+25 XP — Enduring Issue mastered!');
      closePanel();
    });
    root().querySelector('#ei-result').scrollIntoView({ behavior: 'smooth', block: 'start' });
  }));
}

// ---------------- toast ----------------
let toastTimer = null;
export function toast(msg) {
  let t = document.getElementById('toast');
  if (!t) { t = document.createElement('div'); t.id = 'toast'; document.body.appendChild(t); }
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove('show'), 2600);
}
