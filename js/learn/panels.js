// panels.js — every instructional overlay: unit stations (Learn + Practice),
// the mixed MCQ hall, the Free-Response Lab (AAQ/EBQ), the Document Lab (CRQ)
// and the Enduring Issues Quest. Ported from v1 and extended with per-unit
// topic filtering + mastery recording. Closing a panel always returns the
// player to the world exactly where they were.
import { loadBank, drawQuestions } from './content-loader.js';
import * as Progress from './progress.js';
import * as Glossary from './glossary.js';
import * as Read from './read-aloud.js';

const overlay = () => document.getElementById('panel-overlay');
const root = () => document.getElementById('panel-root');

let _onOpen = null, _onClose = null, _onStationCleared = null, _chime = null;
export function setHandlers({ onOpen, onClose, onStationCleared, chime } = {}) {
  _onOpen = onOpen; _onClose = onClose; _onStationCleared = onStationCleared; _chime = chime;
}

function escapeHTML(s) {
  return String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}
function nl2br(s) { return escapeHTML(s).replace(/\n/g, '<br>'); }

export function openPanel(html, { wide = false } = {}) {
  _onOpen && _onOpen();
  root().className = 'panel' + (wide ? ' panel-wide' : '');
  root().innerHTML = html;
  overlay().classList.add('open');
  const c = root().querySelector('.panel-close');
  if (c) c.focus();
}

export function closePanel() {
  overlay().classList.remove('open');
  root().innerHTML = '';
  _onClose && _onClose();
}

export function isOpen() { return overlay().classList.contains('open'); }

function header(title, sub) {
  // Worlds with a trilingual glossary (ENL support) get a glossary button
  // inside every station panel, so it is reachable mid-quiz / mid-lab.
  const gloss = Glossary.isAvailable()
    ? '<button class="panel-gloss glossary-open-btn" type="button" title="Trilingual glossary — English, 中文, Español (G)" aria-label="Open the trilingual glossary">GLOSSARY</button>'
    : '';
  return `<div class="panel-head">
      <div><h2>${escapeHTML(title)}</h2>${sub ? `<p class="panel-sub">${escapeHTML(sub)}</p>` : ''}</div>
      <div class="panel-head-btns">${gloss}<button class="panel-close" aria-label="Close">✕</button></div>
    </div>`;
}
function wireClose() {
  root().querySelector('.panel-close')?.addEventListener('click', closePanel);
}

function cleared(courseKey, unitId, label) {
  if (Progress.collect(courseKey, 'clearbonus:' + unitId, 20)) {
    toast(`Station cleared — ${label}! +20 XP`);
    _chime && _chime('clear');
    _onStationCleared && _onStationCleared(unitId);
  }
}

// ================= UNIT STATION (Learn + Practice tabs) =================
// region: { id, name, topics }, node: world-content node { label, unit, blurb, terms }
export function openUnitStation(courseKey, region, node) {
  let tab = Progress.unit(courseKey, region.id).learned ? 'practice' : 'learn';

  function render() {
    const u = Progress.unit(courseKey, region.id);
    const isCleared = Progress.unitCleared(courseKey, region.id);
    const best = u.bestOf ? `${u.best}/${u.bestOf}` : '—';
    openPanel(`
      ${header(node.label, node.unit + (isCleared ? '  ·  ★ CLEARED' : ''))}
      <div class="tabs">
        <button class="tab ${tab === 'learn' ? 'active' : ''}" data-t="learn">Learn ${u.learned ? '✓' : ''}</button>
        <button class="tab ${tab === 'practice' ? 'active' : ''}" data-t="practice">Practice · best ${best}</button>
      </div>
      <div id="tab-body"></div>
    `, { wide: true });
    wireClose();
    root().querySelectorAll('.tab').forEach(b => b.addEventListener('click', () => { tab = b.dataset.t; render(); }));
    if (tab === 'learn') renderLearn(); else renderPractice();
  }

  function renderLearn() {
    const u = Progress.unit(courseKey, region.id);
    const terms = node.terms.map(t =>
      `<div class="term"><div class="term-name">${escapeHTML(t.term)}</div><div class="term-def">${escapeHTML(t.def)}</div></div>`).join('');
    root().querySelector('#tab-body').innerHTML = `
      <p class="node-blurb">${escapeHTML(node.blurb)}</p>
      <div class="terms">${terms}</div>
      <div class="panel-actions">
        <button class="btn btn-primary" id="node-done">${u.learned ? 'Reviewed ✓' : 'Got it (+10 XP)'}</button>
        <button class="btn" id="to-practice">Practice this unit →</button>
      </div>`;
    root().querySelector('#node-done').addEventListener('click', () => {
      if (Progress.markLearned(courseKey, region.id)) {
        toast(`+10 XP — ${node.label} studied!`);
        _chime && _chime('good');
      }
      render();
    });
    root().querySelector('#to-practice').addEventListener('click', () => { tab = 'practice'; render(); });
  }

  async function renderPractice() {
    const body = root().querySelector('#tab-body');
    body.innerHTML = `<div class="loading">Drawing questions for this unit…</div>`;
    let bank;
    try { bank = await loadBank(courseKey); }
    catch (e) { body.innerHTML = '<div class="loading">Could not load the question bank.</div>'; return; }
    runMCQ({
      courseKey, bank, topics: region.topics, n: 10,
      title: node.label, sub: 'Unit practice — 10 questions',
      mount: body,
      onFinish(correct, total) {
        Progress.recordRound(courseKey, region.id, correct, total);
        if (Progress.unitCleared(courseKey, region.id)) cleared(courseKey, region.id, node.label);
        render();
      },
      onAgain: renderPractice,
    });
  }

  render();
}

// ================= MIXED MCQ STATION =================
export function openMCQ(courseKey, stationCfg, stationId = 'mcq') {
  openPanel(`${header(stationCfg.station, stationCfg.blurb || 'Mixed questions from the whole bank')}<div id="tab-body"><div class="loading">Loading questions…</div></div>`, { wide: true });
  wireClose();
  loadBank(courseKey).then(bank => {
    runMCQ({
      courseKey, bank, topics: null, n: stationCfg.perRound || 12,
      title: stationCfg.station, sub: null,
      mount: root().querySelector('#tab-body'),
      onFinish(correct, total) {
        Progress.recordRound(courseKey, 'station:' + stationId, correct, total);
        if (correct / total >= 0.7 && Progress.markStation(courseKey, stationId)) {
          cleared(courseKey, stationId, stationCfg.station);
        }
      },
      onAgain: () => openMCQ(courseKey, stationCfg, stationId),
    });
  }).catch(() => {
    const b = root().querySelector('#tab-body');
    if (b) b.innerHTML = '<div class="loading">Could not load the question bank.</div>';
  });
}

// Shared MCQ runner: renders into `mount`, never replaces the whole panel,
// so unit-station tabs stay alive.
function runMCQ({ courseKey, bank, topics, n, mount, onFinish, onAgain }) {
  const questions = drawQuestions(bank, n, topics);
  const shuffled = questions.map(q => shuffleChoices(q));
  let idx = 0, correct = 0;

  function renderQ() {
    if (idx >= questions.length) return renderDone();
    const q = questions[idx];
    const ch = shuffled[idx];
    mount.innerHTML = `
      <div class="mcq-meta">Question ${idx + 1} of ${questions.length} · <span class="mcq-topic">${escapeHTML(q.topic)}</span></div>
      <div class="mcq-prompt">${escapeHTML(q.prompt)}${Read.buttonHTML(
        q.prompt + '. ' + ch.map((c, i) => 'Choice ' + (i + 1) + ': ' + c).join('. '),
        { lang: 'en-US', label: 'Read this question and its choices aloud' })}</div>
      <div class="mcq-choices">${ch.map((c, i) => `<button class="mcq-choice" data-i="${i}">${escapeHTML(c)}</button>`).join('')}</div>
      <div class="mcq-feedback" id="mcq-fb"></div>
      <div class="panel-actions" id="mcq-actions"></div>`;
    mount.querySelectorAll('.mcq-choice').forEach(btn => btn.addEventListener('click', () => grade(btn, q, ch)));
  }

  function grade(btn, q, ch) {
    const isRight = ch[+btn.dataset.i] === q.answer;
    if (isRight) correct++;
    _chime && _chime(isRight ? 'good' : 'bad');
    mount.querySelectorAll('.mcq-choice').forEach(b => {
      b.disabled = true;
      const val = ch[+b.dataset.i];
      if (val === q.answer) b.classList.add('correct');
      else if (b === btn) b.classList.add('wrong');
    });
    const fb = mount.querySelector('#mcq-fb');
    fb.className = 'mcq-feedback show ' + (isRight ? 'good' : 'bad');
    fb.innerHTML = `<strong>${isRight ? 'Correct!' : 'Not quite.'}</strong> ${escapeHTML(q.explanation || ('Answer: ' + q.answer))}`;
    const actions = mount.querySelector('#mcq-actions');
    actions.innerHTML = `<button class="btn btn-primary" id="mcq-next">${idx + 1 < questions.length ? 'Next →' : 'See results'}</button>`;
    actions.querySelector('#mcq-next').addEventListener('click', () => { idx++; renderQ(); });
    actions.querySelector('#mcq-next').focus();
  }

  function renderDone() {
    const pct = Math.round((correct / questions.length) * 100);
    const xp = correct * 5 + (pct >= 70 ? 10 : 0);
    mount.innerHTML = `
      <div class="score-big">${correct} / ${questions.length}</div>
      <p class="score-sub">${pct}% correct · +${xp} XP${pct >= 70 ? ' · round bonus!' : ''}</p>
      <div class="panel-actions">
        <button class="btn" id="mcq-again">New round</button>
        <button class="btn btn-primary" id="mcq-done">Back to the world</button>
      </div>`;
    mount.querySelector('#mcq-again').addEventListener('click', onAgain);
    mount.querySelector('#mcq-done').addEventListener('click', closePanel);
    onFinish(correct, questions.length);
    if (pct >= 70) toast(`Nice round — ${pct}%!`);
  }

  renderQ();
}

function shuffleChoices(q) {
  const a = q.choices.slice();
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
  return a;
}

// ================= Free-Response Lab (AAQ / EBQ) =================
export function openFRQ(courseKey, frqCfg, stationId = 'frq') {
  const items = frqCfg.items;
  let pick = 0;
  function render() {
    const it = items[pick];
    const tabs = items.map((x, i) =>
      `<button class="tab ${i === pick ? 'active' : ''}" data-i="${i}">${escapeHTML(x.type)} ${i + 1}</button>`).join('');
    openPanel(`
      ${header(frqCfg.station, frqCfg.blurb)}
      <div class="tabs">${tabs}</div>
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
    root().querySelectorAll('.tab').forEach(b =>
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
      <p class="frq-tip">Compare your draft to each rubric point. On the real exam, the Application points reward applying <em>your own</em> course knowledge — that's where most points are won.</p>`;
    out.classList.add('show');
    if (Progress.collect(courseKey, 'frq:' + it.title, 15)) {
      toast('+15 XP — free-response practiced!');
      _chime && _chime('good');
    }
    if (Progress.markStation(courseKey, stationId)) cleared(courseKey, stationId, frqCfg.station);
    out.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
  render();
}

// ================= Document Lab (CRQ) =================
export function openCRQ(courseKey, crqCfg, stationId = 'crq') {
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
    if (Progress.collect(courseKey, 'crq:' + set.title, 15)) toast('+15 XP — CRQ practiced!');
    if (Progress.markStation(courseKey, stationId)) cleared(courseKey, stationId, crqCfg.station);
    closePanel();
  });
}

// ================= Enduring Issues Quest =================
export function openEI(courseKey, eiCfg, stationId = 'ei') {
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
    const isCorrect = name === q.answer.issue;
    _chime && _chime(isCorrect ? 'good' : 'bad');
    root().querySelectorAll('.ei-issue').forEach(b => {
      b.disabled = true;
      if (b.dataset.name === q.answer.issue) b.classList.add('correct');
      else if (b === btn) b.classList.add('wrong');
    });
    const rub = q.answer.rubric.map(r => `<li>${escapeHTML(r)}</li>`).join('');
    root().querySelector('#ei-result').innerHTML = `
      <div class="ei-verdict ${isCorrect ? 'good' : 'bad'}">
        ${isCorrect ? '✓ Strong choice.' : 'Defensible issues here are Inequality (strongest) or Power.'}
        The best-supported enduring issue across these documents is <strong>${escapeHTML(q.answer.issue)}</strong>.
      </div>
      <p class="ei-ask"><strong>Step 2.</strong> Define it and argue why it is significant — here is a model:</p>
      <div class="model">${escapeHTML(q.answer.why)}</div>
      <h4>What a full essay needs</h4>
      <ul class="rubric">${rub}</ul>
      <div class="panel-actions"><button class="btn btn-primary panel-close-btn">Quest complete (+25 XP)</button></div>`;
    root().querySelector('.panel-close-btn').addEventListener('click', () => {
      if (Progress.collect(courseKey, 'ei:' + q.title, 25)) toast('+25 XP — Enduring Issue mastered!');
      if (Progress.markStation(courseKey, stationId)) cleared(courseKey, stationId, eiCfg.station);
      closePanel();
    });
    root().querySelector('#ei-result').scrollIntoView({ behavior: 'smooth', block: 'start' });
  }));
}

// ================= Help =================
export function openHelp(world) {
  const isTouch = matchMedia('(pointer: coarse)').matches;
  openPanel(`
    ${header('How to explore', world ? world.title : "Mr. Mac's Worlds")}
    <div class="help">
      ${isTouch
        ? `<p><strong>Move:</strong> drag the joystick (bottom-left). Push it all the way to run. <strong>Look:</strong> drag anywhere on the right side of the screen.</p>
           <p><strong>Interact:</strong> walk up to a landmark and tap the glowing button that appears.</p>`
        : `<p><strong>Move:</strong> <kbd>W</kbd><kbd>A</kbd><kbd>S</kbd><kbd>D</kbd> or arrow keys · hold <kbd>Shift</kbd> to run · <kbd>Space</kbd> to hop.</p>
           <p><strong>Look:</strong> drag with the mouse, or click the world once to capture the mouse (press <kbd>Esc</kbd> to release). Scroll to zoom the camera.</p>
           <p><strong>Interact:</strong> walk up to a landmark and press <kbd>E</kbd>.</p>`}
      <p><strong>Find your way:</strong> the compass (top) and the map (<kbd>M</kbd>) mark every station. A light pillar marks the suggested next stop — open the quest log (<kbd>Q</kbd>) to see your progress through the year and tap any station to set the beacon.</p>
      <p><strong>Learning stations</strong> teach each unit's key ideas, then quiz you with real exam-style questions from that unit only. Score 70%+ after studying the terms to clear a station and light it up. Skill stations drill the written exam tasks.</p>
      ${world && world.glossary ? `<p><strong>Glossary</strong> (<kbd>G</kbd>): every key word in English, 中文 + pinyin, and Español, with a simple-English definition and read-aloud speaker buttons. Open it any time — even in the middle of a quiz — from the GLOSSARY button.</p>` : ''}
      <p class="help-note">This world is procedurally generated from a fixed seed — it is the same world for every student, every visit. Progress and XP save on this device only. Built for Mr. Maccarello's classes.</p>
    </div>
  `, { wide: false });
  wireClose();
}

// ================= toast =================
let toastTimer = null;
export function toast(msg) {
  let t = document.getElementById('toast');
  if (!t) { t = document.createElement('div'); t.id = 'toast'; document.body.appendChild(t); }
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove('show'), 2600);
}
