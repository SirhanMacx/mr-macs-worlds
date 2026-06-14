// Self-verify for capstone-artifact.js + studysheet.js (PoL spine).
// Runs headless under node. A tiny DOM/window shim lets the real modules import
// (they touch document/window only lazily, but we provide enough so even those
// paths don't throw). Then we assert the spec's verification points.

// ---- minimal DOM + window shim (enough for injectStyle + studysheet mount) ----
function makeEl(tag) {
  const el = {
    tagName: (tag || 'div').toUpperCase(),
    id: '', className: '', _html: '', style: {}, children: [], parentNode: null,
    setAttribute() {}, getAttribute() { return null; },
    appendChild(c) { c.parentNode = el; el.children.push(c); return c; },
    remove() { if (el.parentNode) el.parentNode.children = el.parentNode.children.filter(x => x !== el); },
    addEventListener() {}, removeEventListener() {},
    querySelector() { return makeEl('div'); },
    querySelectorAll() { return []; },
    classList: { add() {}, remove() {}, toggle() {}, contains() { return false; } },
    focus() {},
    get innerHTML() { return el._html; },
    set innerHTML(v) { el._html = String(v); },
    get textContent() { return el._html; },
    set textContent(v) { el._html = String(v); },
  };
  return el;
}
const _byId = {};
const documentShim = {
  head: makeEl('head'),
  body: makeEl('body'),
  createElement: (t) => makeEl(t),
  getElementById: (id) => _byId[id] || null,
  addEventListener() {}, removeEventListener() {},
  querySelector() { return null; }, querySelectorAll() { return []; },
};
// track id-assigned elements appended to head/body
const _origAppendHead = documentShim.head.appendChild;
documentShim.head.appendChild = function (c) { if (c.id) _byId[c.id] = c; return _origAppendHead.call(this, c); };
const _origAppendBody = documentShim.body.appendChild;
documentShim.body.appendChild = function (c) {
  if (c.id) _byId[c.id] = c;
  c.remove = () => { if (c.id) delete _byId[c.id]; documentShim.body.children = documentShim.body.children.filter(x => x !== c); };
  return _origAppendBody.call(this, c);
};
documentShim.body.children = [];
documentShim.body.querySelector = () => null;

globalThis.document = documentShim;
globalThis.window = {
  print: () => { window.__printed = (window.__printed || 0) + 1; },
  requestAnimationFrame: (cb) => cb && cb(),
  AudioContext: function () {}, webkitAudioContext: function () {},
  addEventListener() {}, removeEventListener() {},
  matchMedia: () => ({ matches: false, addEventListener() {}, removeEventListener() {} }),
  speechSynthesis: { getVoices: () => [], speak() {}, cancel() {} },
  localStorage: { getItem: () => null, setItem() {}, removeItem() {} },
};
globalThis.requestAnimationFrame = (cb) => cb && cb();
try { Object.defineProperty(globalThis, 'navigator', { value: { language: 'en', userAgent: 'node' }, configurable: true }); } catch (e) { /* navigator already fine */ }
globalThis.localStorage = globalThis.window.localStorage;
globalThis.speechSynthesis = globalThis.window.speechSynthesis;
globalThis.SpeechSynthesisUtterance = function () {};

// ---- a fake codex that satisfies the contract surface we use ----
function fakeCodex(entries) {
  const list = entries.slice();
  const idx = new Set(list.map(e => e.id));
  return {
    has: (id) => idx.has(id),
    entries: () => list.slice(),
    count: () => list.length,
  };
}

// ---- a stub standards module (the real one is built by another agent) -------
// Mirrors the spec shape exactly: FRAMEWORK + STANDARDS_MAP default-export.
const TW_STANDARDS = {
  FRAMEWORK: {
    system: 'NYS Global History 9',
    source: 'NYS 9-12 Social Studies Framework (2017)',
    strands: { '9.1': 'First Civilizations', '9.4': 'Political Powers & Networks', '9.10': 'Interaction & Disruption', '9.0': 'Social Studies Practices' },
  },
  STANDARDS_MAP: {
    'cx-neolithic-surplus': { code: '9.1a', strand: '9.1', label: 'Neolithic surplus', examTask: 'Enduring Issues evidence', confidence: 'high' },
    'cx-silk-road-diffusion': { code: '9.4c', strand: '9.4', label: 'Silk Road diffusion', examTask: 'Enduring Issues evidence', confidence: 'high' },
    'cx-u8-columbian-exchange': { code: '9.10b', strand: '9.10', label: 'Columbian Exchange', examTask: 'Enduring Issues evidence', confidence: 'high' },
    'cx-enduring-issues': { code: '9.0', strand: '9.0', label: 'EIE meta-skill', examTask: 'Enduring Issues Essay', confidence: 'flag', note: 'meta' },
  },
};
const MA_STANDARDS = {
  FRAMEWORK: { system: 'AP Psychology (2024 CED)', source: 'AP Psychology Course and Exam Description', strands: { '2': 'Cognition', '4': 'Social Psychology', 'SP': 'Science Practices' } },
  STANDARDS_MAP: {
    'u2c_cx_reconstructive': { code: '2.6', strand: '2', label: 'Reconstructive memory', examTask: 'AAQ', confidence: 'high' },
    'u4sp_cx_fae': { code: '4.1', strand: '4', label: 'Fundamental attribution error', examTask: 'AAQ', confidence: 'high' },
    'cx_exam_self': { code: 'SP1+2+4', strand: 'SP', label: 'Apply + evaluate', examTask: 'AAQ/EBQ meta', confidence: 'flag' },
  },
};

let failures = 0;
function ok(cond, msg) { if (cond) { console.log('  PASS', msg); } else { console.log('  FAIL', msg); failures++; } }

// dynamic import after shims are in place
const cap = await import('../js/game/capstone-artifact.js');
const ss = await import('../js/game/studysheet.js');

console.log('\n[capstone-artifact] EIE — earned-only evidence + standards stamp');
{
  // seed: 3 earned trade-theme understandings across 3 eras + the capstone id.
  const codex = fakeCodex([
    { id: 'cx-neolithic-surplus', group: 'U1', title: 'Surplus', idea: 'A surplus frees hands to specialize.', source: 'Hodja' },
    { id: 'cx-silk-road-diffusion', group: 'U4', title: 'Silk Road', idea: 'Roads carry goods, faith, and disease together.', source: 'a caravaneer' },
    { id: 'cx-u8-columbian-exchange', group: 'U8', title: 'Columbian Exchange', idea: 'Ocean contact swapped crops, animals, and disease.', source: 'a sailor' },
    { id: 'cx-enduring-issues', group: 'U9', title: 'EIE', idea: 'Name a recurring issue and prove it across eras.', source: 'Shapash' },
  ]);
  // include a PHANTOM id in the chosen list — it must be ignored.
  const art = cap.buildArtifact({ codex, standards: TW_STANDARDS, kind: 'eie',
    chosenEvidenceIds: ['cx-neolithic-surplus', 'cx-silk-road-diffusion', 'cx-u8-columbian-exchange', 'cx-trade-networks' /* phantom */] });

  const earnedIds = new Set(codex.entries().map(e => e.id));
  ok(art.evidence.length > 0, 'evidence is non-empty');
  ok(art.evidence.every(e => earnedIds.has(e.codexId)), 'evidence ONLY contains earned codex ids (phantom dropped)');
  ok(!art.evidence.some(e => e.codexId === 'cx-trade-networks'), 'phantom id cx-trade-networks absent');
  ok(art.evidence.every(e => typeof e.code === 'string' && e.code.length > 0), 'every evidence item has a non-empty standards code');
  const spans = art.rubricSelfCheck.find(r => /spans/i.test(r.criterion) || />=\s*2 eras/i.test(r.criterion) || />= 2 eras/.test(r.criterion));
  ok(!!spans, "a 'spans >= 2 eras' rubric criterion exists");
  ok(spans && spans.met === true, "'spans >= 2 eras' computes met=true for 3-era evidence");
  ok(!!art.claim && /enduring/i.test(art.claim), 'a thesis-style claim is generated');
}

console.log('\n[capstone-artifact] EIE — single-era evidence fails the spans check');
{
  const codex = fakeCodex([
    { id: 'cx-silk-road-diffusion', group: 'U4', title: 'Silk Road', idea: 'one era only.', source: 'x' },
  ]);
  const art = cap.buildArtifact({ codex, standards: TW_STANDARDS, kind: 'eie' });
  const spans = art.rubricSelfCheck.find(r => /spans|eras/i.test(r.criterion) && /2/.test(r.criterion));
  ok(spans && spans.met === false, "'spans >= 2 eras' computes met=false for single-era evidence");
}

console.log('\n[capstone-artifact] AAQ/EBQ — earned-only + apply/evaluate rubric');
{
  const codex = fakeCodex([
    { id: 'u2c_cx_reconstructive', group: 'U2', title: 'Reconstructive memory', idea: 'Memory rebuilds, not replays.', source: 'Atlas' },
    { id: 'u4sp_cx_fae', group: 'U4', title: 'FAE', idea: 'Blaming character over situation is the FAE.', source: 'Atlas' },
    { id: 'cx_exam_self', group: 'Capstone', title: 'Apply + evaluate', idea: 'Weigh evidence on each claim.', source: 'Lumen' },
  ]);
  const art = cap.buildArtifact({ codex, standards: MA_STANDARDS, kind: 'aaq_ebq' });
  const earnedIds = new Set(codex.entries().map(e => e.id));
  ok(art.evidence.every(e => earnedIds.has(e.codexId)), 'AAQ evidence only contains earned ids');
  ok(art.evidence.every(e => typeof e.code === 'string' && e.code.length > 0), 'AAQ evidence each has a code');
  ok(art.rubricSelfCheck.some(r => /appl/i.test(r.criterion)), 'rubric includes an APPLY criterion');
  ok(art.rubricSelfCheck.some(r => /evaluat/i.test(r.criterion)), 'rubric includes an EVALUATE criterion');
  ok(art.rubricSelfCheck.some(r => /claim/i.test(r.criterion)), 'rubric includes a DEFEND-A-CLAIM criterion');
}

console.log('\n[capstone-artifact] resolver never throws on unmapped ids');
{
  const codex = fakeCodex([{ id: 'totally-unmapped-id', group: 'X', title: 'X', idea: 'y', source: 'z' }]);
  let threw = false;
  let art;
  try { art = cap.buildArtifact({ codex, standards: TW_STANDARDS, kind: 'eie' }); } catch (e) { threw = true; }
  ok(!threw, 'buildArtifact does not throw on an unmapped earned id');
  ok(art && Array.isArray(art.evidence), 'still returns a well-formed artifact');
}

console.log('\n[studysheet] emits grouped-by-standard HTML with earned + stub rows');
{
  const codex = fakeCodex([
    { id: 'cx-neolithic-surplus', group: 'U1', title: 'Surplus', idea: 'A surplus frees hands.', source: 'Hodja' },
    { id: 'cx-silk-road-diffusion', group: 'U4', title: 'Silk Road', idea: 'Roads carry more than goods.', source: 'a trader' },
  ]);
  const html = ss.openStudySheet({ codex, standards: TW_STANDARDS });
  ok(typeof html === 'string' && html.length > 0, 'openStudySheet returns HTML');
  // grouped by standard: strand headers present
  ok(/9\.1/.test(html) && /9\.4/.test(html) && /9\.10/.test(html), 'HTML is grouped by standard (strand codes present)');
  ok(/A surplus frees hands/.test(html), 'earned idea text rendered');
  ok(/9\.4c/.test(html), 'earned standards code rendered');
  ok(/Still to understand/i.test(html), "unearned-in-strand 'still to understand' stub present");
  // earned source rendered
  ok(/Hodja/.test(html), 'earned source rendered');
}

console.log('\n[studysheet] tolerates empty standards map');
{
  const codex = fakeCodex([]);
  let threw = false, html;
  try { html = ss.openStudySheet({ codex, standards: { FRAMEWORK: {}, STANDARDS_MAP: {} } }); } catch (e) { threw = true; }
  ok(!threw, 'openStudySheet does not throw with empty map');
  ok(typeof html === 'string', 'returns HTML even when empty');
}

console.log('\n' + (failures === 0 ? 'ALL CHECKS PASSED' : `${failures} CHECK(S) FAILED`));
process.exit(failures === 0 ? 0 : 1);
