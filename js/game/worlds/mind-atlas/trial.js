// trial.js — TRIAL OF THE SELF: the optional gauntlet that reuses the full
// 175-question AP Psych bank (mixed, shuffled), the way Trade Winds reuses its
// bank for Guild Exams. Never forced; passing is the victory lap once the five
// regions are restored. One question at a time, real explanations.
import * as UI from '../../ui.js';
import * as Sfx from '../../sfx.js';
import { loadBank, drawQuestions, shuffle } from '../../../learn/content-loader.js';
import { TRIAL } from './content.js';

const esc = UI.esc;

export function openTrial(g, onPass) {
  let card = null;
  UI.push({
    className: 'gui-ma ma-trial',
    html: '<div class="ma-card"></div>',
    onMount(el, { close }) { card = el.querySelector('.ma-card'); lobby(close); },
  });

  function lobby(close) {
    card.innerHTML = `
      <div class="ma-head"><div><div class="ma-kicker">FINAL EXAM OF THE SELF</div>
        <div class="ma-title">${esc(TRIAL.name)}</div></div>
        <button class="dlg-x" data-gui-close>LEAVE</button></div>
      <p class="ma-clue">${esc(TRIAL.blurb)} ${TRIAL.perRound} questions, mixed from all five units. Pass at ${Math.round(TRIAL.needFrac * 100)}%.</p>
      <div class="ma-actions"><button class="ma-go prim" id="ma-begin">BEGIN THE TRIAL</button></div>`;
    card.querySelector('#ma-begin').addEventListener('click', async () => {
      Sfx.click();
      const bank = await loadBank('appsych');
      const qs = drawQuestions(bank, TRIAL.perRound, null);
      run(qs, close);
    });
  }

  function run(qs, close) {
    let i = 0, correct = 0;
    function ask() {
      const q = qs[i];
      const choices = shuffle(q.choices.slice());
      card.innerHTML = `
        <div class="ma-head"><div><div class="ma-kicker">TRIAL OF THE SELF</div>
          <div class="ma-title">Question ${i + 1} of ${qs.length} — ${correct} correct</div></div></div>
        <p class="ma-wclaim">${esc(q.prompt)}</p>
        <div class="ma-reframes">${choices.map(c => `<button class="ma-reframe">${esc(c)}</button>`).join('')}</div>
        <div class="ma-fb" id="ma-fb"></div>`;
      card.querySelectorAll('.ma-reframe').forEach(b => b.addEventListener('click', () => {
        const right = b.textContent === q.answer;
        if (right) { correct++; Sfx.good(); } else Sfx.bad();
        card.querySelectorAll('.ma-reframe').forEach(x => {
          x.disabled = true;
          if (x.textContent === q.answer) x.classList.add('right');
          else if (x === b) x.classList.add('wrong');
        });
        const fb = card.querySelector('#ma-fb');
        const expl = (q.explanation || '').split('. ').slice(0, 2).join('. ');
        fb.className = 'ma-fb ' + (right ? 'good' : 'bad');
        fb.innerHTML = `<b>${right ? 'Correct.' : 'It is ' + esc(q.answer) + '.'}</b> ${esc(expl)}${expl.endsWith('.') ? '' : '.'}
          <button class="ma-go" id="ma-next">${i + 1 < qs.length ? 'NEXT' : 'SEE RESULT'}</button>`;
        fb.querySelector('#ma-next').addEventListener('click', () => { i++; (i < qs.length) ? ask() : finish(); });
      }));
    }
    function finish() {
      const passed = correct / qs.length >= TRIAL.needFrac;
      if (passed) { Sfx.examPass(); g.fx('confetti'); onPass && onPass(correct, qs.length); }
      else Sfx.bad();
      card.innerHTML = `
        <div class="ma-head"><div><div class="ma-kicker ${passed ? 'good' : 'bad'}">${passed ? 'THE SELF IS WHOLE' : 'NOT YET'}</div>
          <div class="ma-title">${correct} of ${qs.length} correct</div></div></div>
        <p class="ma-clue">${passed
          ? 'You answered the mind to itself. The atlas is complete and ready for the exam.'
          : 'Walk the regions, study the denizens, then sit the Trial again — there is no penalty for a second attempt.'}</p>
        <div class="ma-actions"><button class="ma-go" data-gui-close>${passed ? 'WALK IN TRIUMPH' : 'ANOTHER DAY'}</button></div>`;
    }
    ask();
  }

  const ctrl = { close: null };
  return ctrl;
}
