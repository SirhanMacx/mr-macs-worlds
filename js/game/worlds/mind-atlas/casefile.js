// casefile.js — CASE FILES: the AAQ / EBQ investigations. You gather three
// evidence scrolls in the world, then assemble the claim here. The assembly
// questions map one-to-one onto the real AAQ/EBQ rubric parts (from
// data/world-content.json), and the reveal shows that item's model + rubric —
// the existing free-response logic, played as detective work.
import * as UI from '../../ui.js';
import * as Sfx from '../../sfx.js';

const esc = UI.esc;

// assembly steps keyed to the two real free-response items (frqIndex 0 = AAQ
// sleep/memory, 1 = EBQ spacing). Each step's options are scored; the correct
// one matches the rubric criterion. Authored in-scope (2024 CED).
const ASSEMBLY = {
  'case-aaq': {
    steps: [
      { q: 'A. Identify the research method.', opts: ['Experiment (students were randomly assigned to conditions)', 'Correlational study', 'Naturalistic observation'], ans: 0 },
      { q: 'B. State the operational definition of memory in this study.', opts: ['The number of the 40 word pairs correctly recalled', 'The number of hours each student slept', 'The students’ self-rated confidence'], ans: 0 },
      { q: 'C. Identify the dependent variable.', opts: ['Recall score the next morning', 'Which sleep condition a student was assigned to', 'The number of students in the study'], ans: 0 },
      { q: 'D. One way to increase generalizability.', opts: ['Draw a random sample from a broader population than one college', 'Test only this same college again', 'Remove the comparison group'], ans: 0 },
      { q: 'E. One ethical guideline the researchers should follow.', opts: ['Informed consent and the right to withdraw', 'Deceive participants and skip debriefing', 'Hide the study’s purpose permanently'], ans: 0 },
      { q: 'F. Do the data support that sleep aids memory consolidation? Use the data.', opts: ['Support — 31 vs. 22 pairs recalled, significant at p < .01', 'Refute — the two groups recalled the same amount', 'Cannot tell — no numbers are given'], ans: 0 },
    ],
    pass: 5,
  },
  'case-ebq': {
    steps: [
      { q: 'A. Propose a defensible claim.', opts: ['Spacing study sessions improves long-term retention', 'Cramming the night before produces the best long-term learning', 'How you study has no effect on retention'], ans: 0 },
      { q: 'B. Pick evidence from ONE source that supports the claim.', opts: ['The spaced class scored 18% higher on a surprise quiz two weeks later', '78% of students crammed the night before', 'The survey had 400 participants'], ans: 0 },
      { q: 'B. Name the concept that connects that evidence to the claim.', opts: ['The spacing effect / distributed practice', 'The misinformation effect', 'The fundamental attribution error'], ans: 0 },
      { q: 'C. Pick evidence from a DIFFERENT source.', opts: ['Across 250+ experiments, spaced review beat massed cramming on delayed tests', 'The spaced class scored 18% higher (same source as B)', 'Students disliked spacing their study'], ans: 0 },
      { q: 'C. Name the concept that connects it to the claim.', opts: ['Spaced practice strengthens consolidation and retrieval', 'Negative reinforcement', 'Cognitive dissonance about studying'], ans: 0 },
    ],
    pass: 4,
  },
};

export function openCase(caseDef, frqItem, g, onWin) {
  const A = ASSEMBLY[caseDef.id];
  let i = 0, score = 0, done = false, card = null;

  UI.push({
    className: 'gui-ma ma-case',
    html: '<div class="ma-card"></div>',
    onMount(el, { close }) { card = el.querySelector('.ma-card'); render(); },
  });

  function scrollsHTML() {
    return `<div class="ma-scrolls">${caseDef.scrolls.map(s =>
      `<div class="ma-scroll"><b>${esc(s.label)}</b><span>${esc(s.note)}</span></div>`).join('')}</div>`;
  }

  function render() {
    if (i >= A.steps.length) return reveal();
    const st = A.steps[i];
    const opts = st.opts.map((o, idx) => ({ o, idx })).sort(() => Math.random() - 0.5);
    card.innerHTML = `
      <div class="ma-head"><div><div class="ma-kicker">CASE FILE · ${esc(caseDef.type)}</div>
        <div class="ma-title">${esc(caseDef.name)}</div></div>
        <button class="dlg-x" data-gui-close>LEAVE</button></div>
      ${i === 0 ? scrollsHTML() : ''}
      <div class="ma-casestep">Step ${i + 1} of ${A.steps.length}</div>
      <p class="ma-clue">${esc(st.q)}</p>
      <div class="ma-reframes">${opts.map(o =>
        `<button class="ma-reframe" data-i="${o.idx}">${esc(o.o)}</button>`).join('')}</div>
      <div class="ma-fb" id="ma-fb"></div>`;
    card.querySelectorAll('.ma-reframe').forEach(b => b.addEventListener('click', () => answer(+b.dataset.i, b)));
  }

  function answer(idx, btn) {
    if (done) return;
    const st = A.steps[i];
    const fb = card.querySelector('#ma-fb');
    if (idx === st.ans) {
      score++; i++;
      Sfx.good(); g.fx('sparkle');
      if (i >= A.steps.length) setTimeout(reveal, 240); else setTimeout(render, 240);
    } else {
      Sfx.bad();
      if (btn) btn.classList.add('wrong');
      if (fb) { fb.className = 'ma-fb bad'; fb.textContent = 'Not what the evidence best supports — try the rubric-worthy answer.'; }
    }
  }

  function reveal() {
    if (done) return;
    done = true;
    const passed = score >= A.pass;
    const rubric = (frqItem.rubric || []).map(r => `<li><b>${esc(r.part)}</b> — ${esc(r.criterion)}</li>`).join('');
    card.innerHTML = `
      <div class="ma-head"><div><div class="ma-kicker ${passed ? 'good' : ''}">CASE ${passed ? 'SOLVED' : 'FILED'}</div>
        <div class="ma-title">${esc(caseDef.name)} — ${score}/${A.steps.length}</div></div></div>
      <p class="ma-clue">${passed
        ? 'The evidence holds. This is exactly how the ' + esc(caseDef.type) + ' is scored on the exam — here is the official rubric and a model response.'
        : 'A workable start. Compare your picks to the rubric and the model, then re-open the case to tighten it.'}</p>
      <h4 class="ma-h4">Scoring rubric (${esc(frqItem.type)})</h4>
      <ul class="ma-rubric">${rubric}</ul>
      <h4 class="ma-h4">Model response</h4>
      <div class="ma-model">${esc(frqItem.model || '').replace(/\n/g, '<br>')}</div>
      <div class="ma-actions"><button class="ma-go" data-gui-close>CLOSE THE FILE</button></div>`;
    if (passed) { Sfx.examPass(); g.fx('confetti'); } else Sfx.close();
    onWin && onWin(passed, score, A.steps.length);
  }

  const ctrl = {
    auto() { while (i < A.steps.length && !done) answer(A.steps[i].ans, null); if (!done) reveal(); },
    close: null,
  };
  return ctrl;
}
