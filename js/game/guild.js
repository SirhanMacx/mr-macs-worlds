// guild.js — the Merchants' Guild Hall: diegetic ranked exams built from the
// real question bank. Optional, never forced — but ranks pay: vendor
// discounts, titles, shekel purses. One question at a time, instant feedback
// with the bank's real explanation, era-scoped topics.
import * as UI from './ui.js';
import * as Sfx from './sfx.js';
import { loadBank, drawQuestions, shuffle } from '../learn/content-loader.js';

const esc = UI.esc;

// ranks: index = rank number
export const RANKS = [
  { name: 'Peddler', q: 0, need: 0, purse: 0, discount: 0 },
  { name: 'Apprentice Trader', q: 8, need: 6, purse: 40, discount: 0.02 },
  { name: 'Trader', q: 10, need: 7, purse: 80, discount: 0.04 },
  { name: 'Merchant', q: 12, need: 9, purse: 150, discount: 0.06 },
  { name: 'Master Merchant', q: 14, need: 11, purse: 250, discount: 0.08 },
  { name: 'Magnate', q: 15, need: 12, purse: 400, discount: 0.10 },
];

export function openGuild({ course, state, save, topicsForEra, getEra, onReward }) {
  const rank = state.rank || 0;
  const next = RANKS[rank + 1];

  UI.push({
    className: 'gui-guild',
    html: '<div class="gld-card"></div>',
    onMount(el, { close }) {
      const card = el.querySelector('.gld-card');
      renderLobby(card, close);
    },
  });

  function renderLobby(card, close) {
    const ladder = RANKS.map((r, i) =>
      `<div class="gld-rung ${i <= (state.rank || 0) ? 'won' : ''} ${i === (state.rank || 0) + 1 ? 'next' : ''}">
        <b>${esc(r.name)}</b>${i > 0 ? `<span>${r.need}/${r.q} correct — purse ${r.purse} shekels — prices ${Math.round(r.discount * 100)}% better</span>` : '<span>where every house begins</span>'}
      </div>`).join('');
    card.innerHTML = `
      <div class="gld-head">
        <div><div class="gld-title">Merchants' Guild Hall</div>
        <div class="gld-sub">Prove what you know of the world and its trade. Rank is forever; the purse is paid once.</div></div>
        <button class="dlg-x" data-gui-close>LEAVE</button>
      </div>
      <div class="gld-ladder">${ladder}</div>
      <div class="gld-actions">
        ${next ? `<button class="gld-start">SIT THE ${esc(next.name.toUpperCase())} EXAM — ${next.q} questions</button>` : '<p class="gld-doneall">You hold the highest seal the guild grants. The hall salutes you.</p>'}
      </div>`;
    const b = card.querySelector('.gld-start');
    if (b) b.addEventListener('click', async () => {
      Sfx.click();
      const bank = await loadBank(course);
      const topics = topicsForEra(getEra());
      const qs = drawQuestions(bank, next.q, topics);
      runExam(card, close, qs, next);
    });
  }

  function runExam(card, close, qs, rankDef) {
    let i = 0, correct = 0;
    function ask() {
      const q = qs[i];
      const choices = shuffle(q.choices.map(c => c));
      card.innerHTML = `
        <div class="gld-head">
          <div><div class="gld-title">${esc(rankDef.name)} Exam</div>
          <div class="gld-sub">Question ${i + 1} of ${qs.length} — ${correct} correct so far</div></div>
        </div>
        <p class="gld-q">${esc(q.prompt)}</p>
        <div class="gld-choices">${choices.map(c => `<button class="gld-choice">${esc(c)}</button>`).join('')}</div>`;
      card.querySelectorAll('.gld-choice').forEach(b => b.addEventListener('click', () => {
        const right = b.textContent === q.answer;
        if (right) { correct++; Sfx.good(); } else Sfx.bad();
        card.querySelectorAll('.gld-choice').forEach(x => {
          x.disabled = true;
          if (x.textContent === q.answer) x.classList.add('right');
          else if (x === b) x.classList.add('wrong');
        });
        const fb = document.createElement('div');
        fb.className = 'gld-fb ' + (right ? 'good' : 'bad');
        const expl = (q.explanation || '').split('. ').slice(0, 2).join('. ');
        fb.innerHTML = `<b>${right ? 'Correct.' : 'Not quite — it is ' + esc(q.answer) + '.'}</b> ${esc(expl)}${expl.endsWith('.') ? '' : '.'}
          <button class="gld-next">${i + 1 < qs.length ? 'NEXT QUESTION' : 'SEE THE RESULT'}</button>`;
        card.appendChild(fb);
        fb.querySelector('.gld-next').addEventListener('click', () => {
          Sfx.click();
          i++;
          if (i < qs.length) ask(); else finish();
        });
      }));
    }
    function finish() {
      const passed = correct >= rankDef.need;
      if (passed) {
        state.rank = (state.rank || 0) + 1;
        save();
        Sfx.examPass();
        onReward && onReward(rankDef, correct, qs.length);
      } else Sfx.bad();
      card.innerHTML = `
        <div class="gld-head"><div><div class="gld-title">${passed ? 'The guild stamps your seal.' : 'The examiners shake their heads.'}</div>
        <div class="gld-sub">${correct} of ${qs.length} correct — ${rankDef.need} needed</div></div></div>
        <p class="gld-q">${passed
          ? `You are now <b>${esc(rankDef.name)}</b>. The purse of ${rankDef.purse} shekels is yours, and merchants across the map now offer you ${Math.round(rankDef.discount * 100)}% better prices.`
          : 'Walk the world, read the station stories, trade the routes — then sit the exam again. The guild charges nothing for a second attempt.'}</p>
        <div class="gld-actions"><button class="gld-start" data-gui-close>${passed ? 'BACK TO THE FLOOR' : 'ANOTHER DAY'}</button></div>`;
    }
    ask();
  }
}
