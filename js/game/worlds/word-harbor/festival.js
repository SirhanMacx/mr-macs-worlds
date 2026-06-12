// festival.js — the Festival Lawn: gentle MODS-style practice as games.
// Four stalls (Picture Match, Word Sort, Listen + Find, Question Lanterns)
// plus the TIME TRAVEL FESTIVAL capstone. No fail states anywhere: wrong
// taps wobble and invite another try, every game can be replayed forever.
import * as UI from '../../ui.js';
import * as Sfx from '../../sfx.js';
import * as Read from '../../../learn/read-aloud.js';
import { paintPic } from './pics.js';
import { openStory } from './storybook.js';
import { PICTURE_PAIRS, SORT_ROUNDS, TIME_TRAVEL, LANTERN_TOPICS } from './content.js';

const esc = UI.esc;

function sample(arr, n) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a.slice(0, n);
}

function wobble(el) {
  if (!el) return;
  el.classList.remove('wobble');
  void el.offsetWidth;
  el.classList.add('wobble');
}

function cheer(card, msg, { onAgain, onClose }) {
  const nav = card.querySelector('.wh-story-nav');
  nav.innerHTML = `
    <span class="wh-cheer">${esc(msg)}</span>
    <button class="wh-btn wh-again">PLAY AGAIN</button>
    <button class="wh-btn" data-gui-close>DONE</button>`;
  Sfx.questDone();
  card.querySelector('.wh-again').addEventListener('click', () => { Sfx.click(); onAgain(); });
  if (onClose) onClose();
}

// ---------- 1. Picture Match ----------
export function openPictureMatch({ getTerm, onPlayed }) {
  UI.push({
    className: 'wh-fest-layer',
    html: '<div class="wh-fest-card"></div>',
    dismissible: true,
    onClose() { Read.stop(); },
    onMount(el) { start(el.querySelector('.wh-fest-card')); },
  });

  function start(card) {
    const pairs = sample(PICTURE_PAIRS, 4);
    const pics = sample(pairs, pairs.length);
    const wordsArr = sample(pairs, pairs.length);
    let selWord = null;
    let done = 0;

    card.innerHTML = `
      <div class="wh-bridge-head"><b>Picture Match</b>
        <span class="wh-bridge-sub">Tap a word, then tap its picture</span>
        <button class="dlg-x" data-gui-close>CLOSE</button></div>
      <div class="wh-pm-words">${wordsArr.map(p =>
        `<button class="wh-tile" data-w="${esc(p.term)}">${esc(p.term)}</button>`).join('')}</div>
      <div class="wh-pm-pics">${pics.map(p =>
        `<button class="wh-pm-pic" data-p="${esc(p.term)}" aria-label="picture choice"><canvas></canvas></button>`).join('')}</div>
      <div class="wh-story-nav"><span class="wh-fest-tip">Matches: <b class="wh-pm-count">0</b> / 4 — no timer, no fail</span></div>`;

    card.querySelectorAll('.wh-pm-pic').forEach((b, i) => {
      requestAnimationFrame(() => paintPic(pics[i].pic, b.querySelector('canvas')));
      b.addEventListener('click', () => {
        if (b.classList.contains('done')) return;
        if (!selWord) { wobble(b); return; }
        if (b.dataset.p === selWord.dataset.w) {
          Sfx.good();
          b.classList.add('done');
          selWord.classList.add('done');
          const t = getTerm(selWord.dataset.w);
          if (t) Read.speak(t.en, { lang: 'en-US', rate: 0.85 });
          selWord = null;
          done++;
          card.querySelector('.wh-pm-count').textContent = done;
          if (done === pairs.length) {
            cheer(card, 'All matched. Lovely work.', { onAgain: () => start(card) });
            onPlayed && onPlayed('match');
          }
        } else {
          Sfx.bad(); wobble(b); wobble(selWord);
        }
      });
    });
    card.querySelectorAll('[data-w]').forEach(b => b.addEventListener('click', () => {
      if (b.classList.contains('done')) return;
      Sfx.click();
      card.querySelectorAll('[data-w]').forEach(x => x.classList.remove('sel'));
      b.classList.add('sel');
      selWord = b;
      const t = getTerm(b.dataset.w);
      if (t) Read.speak(t.en, { lang: 'en-US', rate: 0.85 });
    }));
  }
}

// ---------- 2. Word Sort ----------
export function openWordSort({ onPlayed }) {
  let roundIx = Math.floor(Math.random() * SORT_ROUNDS.length);
  UI.push({
    className: 'wh-fest-layer',
    html: '<div class="wh-fest-card"></div>',
    dismissible: true,
    onClose() { Read.stop(); },
    onMount(el) { start(el.querySelector('.wh-fest-card')); },
  });

  function start(card) {
    const round = SORT_ROUNDS[roundIx % SORT_ROUNDS.length];
    const chips = sample(round.terms, round.terms.length);
    let sel = null;
    let done = 0;

    card.innerHTML = `
      <div class="wh-bridge-head"><b>Word Sort</b>
        <span class="wh-bridge-sub">Tap a word, then tap its family</span>
        <button class="dlg-x" data-gui-close>CLOSE</button></div>
      <div class="wh-pm-words wh-sort-chips">${chips.map(t =>
        `<button class="wh-tile" data-t="${esc(t.en)}" data-c="${esc(t.cat)}">${esc(t.en)}</button>`).join('')}</div>
      <div class="wh-sort-bins">
        <div class="wh-bin" data-bin="${esc(round.a.cat)}"><h4>${esc(round.a.label)}</h4><div class="wh-bin-list"></div></div>
        <div class="wh-bin" data-bin="${esc(round.b.cat)}"><h4>${esc(round.b.label)}</h4><div class="wh-bin-list"></div></div>
      </div>
      <div class="wh-story-nav"><span class="wh-fest-tip">Sorted: <b class="wh-sort-count">0</b> / ${round.terms.length}</span></div>`;

    card.querySelectorAll('[data-t]').forEach(b => b.addEventListener('click', () => {
      if (b.classList.contains('done')) return;
      Sfx.click();
      card.querySelectorAll('[data-t]').forEach(x => x.classList.remove('sel'));
      b.classList.add('sel');
      sel = b;
      Read.speak(b.dataset.t, { lang: 'en-US', rate: 0.85 });
    }));
    card.querySelectorAll('.wh-bin').forEach(bin => bin.addEventListener('click', () => {
      if (!sel) { wobble(bin); return; }
      if (bin.dataset.bin === sel.dataset.c) {
        Sfx.good();
        const chip = document.createElement('span');
        chip.className = 'wh-bin-chip';
        chip.textContent = sel.dataset.t;
        bin.querySelector('.wh-bin-list').appendChild(chip);
        sel.classList.add('done');
        sel.classList.remove('sel');
        sel = null;
        done++;
        card.querySelector('.wh-sort-count').textContent = done;
        if (done === SORT_ROUNDS[roundIx % SORT_ROUNDS.length].terms.length) {
          roundIx++;
          cheer(card, 'Every word found its family.', { onAgain: () => start(card) });
          onPlayed && onPlayed('sort');
        }
      } else {
        Sfx.bad(); wobble(bin); wobble(sel);
      }
    }));
  }
}

// ---------- 3. Listen + Find ----------
export function openListenFind({ pool, onPlayed }) {
  UI.push({
    className: 'wh-fest-layer',
    html: '<div class="wh-fest-card"></div>',
    dismissible: true,
    onClose() { Read.stop(); },
    onMount(el) { start(el.querySelector('.wh-fest-card')); },
  });

  function start(card) {
    const ROUNDS = 5;
    let round = 0;
    next();

    function next() {
      if (round >= ROUNDS) {
        card.querySelector('.wh-story-nav').innerHTML = '';
        cheer(card, 'You found every word by ear.', { onAgain: () => start(card) });
        onPlayed && onPlayed('listen');
        return;
      }
      const four = sample(pool, 4);
      const target = four[Math.floor(Math.random() * 4)];
      card.innerHTML = `
        <div class="wh-bridge-head"><b>Listen and Find</b>
          <span class="wh-bridge-sub">Listen, then tap the word you hear</span>
          <button class="dlg-x" data-gui-close>CLOSE</button></div>
        <div class="wh-lf-speaker"><button class="wh-btn wh-lf-hear">HEAR THE WORD AGAIN</button></div>
        <div class="wh-pm-words wh-lf-choices">${four.map(t =>
          `<button class="wh-tile gem" data-t="${esc(t.en)}"><span class="wh-bk-gem"></span>${esc(t.en)}</button>`).join('')}</div>
        <div class="wh-story-nav"><span class="wh-fest-tip">Word ${round + 1} of ${ROUNDS} — wrong taps cost nothing</span></div>`;
      const speakTarget = () => Read.speak(target.en, { lang: 'en-US', rate: 0.8 });
      speakTarget();
      card.querySelector('.wh-lf-hear').addEventListener('click', () => { Sfx.click(); speakTarget(); });
      card.querySelectorAll('[data-t]').forEach(b => b.addEventListener('click', () => {
        if (b.dataset.t === target.en) {
          Sfx.good();
          b.classList.add('done');
          round++;
          setTimeout(next, 450);
        } else {
          Sfx.bad(); wobble(b); speakTarget();
        }
      }));
    }
  }
}

// ---------- 4. Question Lanterns (gentle bank practice) ----------
export function openLanterns({ bank, onPlayed }) {
  UI.push({
    className: 'wh-fest-layer',
    html: '<div class="wh-fest-card"></div>',
    dismissible: true,
    onClose() { Read.stop(); },
    onMount(el) { start(el.querySelector('.wh-fest-card')); },
  });

  function start(card) {
    const pool = bank.questions.filter(q => LANTERN_TOPICS.includes(q.topic));
    const qs = sample(pool.length >= 5 ? pool : bank.questions, 5);
    let lit = 0;

    function show() {
      if (lit >= qs.length) {
        card.querySelector('.wh-story-nav').innerHTML = '';
        cheer(card, 'All five lanterns are glowing.', { onAgain: () => start(card) });
        onPlayed && onPlayed('lanterns');
        return;
      }
      const q = qs[lit];
      const choices = sample(q.choices, q.choices.length);
      card.innerHTML = `
        <div class="wh-bridge-head"><b>Question Lanterns</b>
          <span class="wh-bridge-sub">Light a lantern with the right word</span>
          <button class="dlg-x" data-gui-close>CLOSE</button></div>
        <div class="wh-lantern-row">${qs.map((_, i) =>
          `<span class="wh-lantern ${i < lit ? 'lit' : ''}"></span>`).join('')}</div>
        <p class="wh-lantern-q">${esc(q.prompt)}
          ${Read.buttonHTML(q.prompt, { lang: 'en-US', label: 'Read the question aloud' })}</p>
        <div class="wh-pm-words wh-lantern-choices">${choices.map(c =>
          `<button class="wh-tile" data-c="${esc(c)}">${esc(c)}</button>`).join('')}</div>
        <div class="wh-story-nav"><span class="wh-fest-tip">Take all the tries you need</span></div>`;
      Read.speak(q.prompt, { lang: 'en-US', rate: 0.85 });
      card.querySelectorAll('[data-c]').forEach(b => b.addEventListener('click', () => {
        if (b.dataset.c === q.answer) {
          Sfx.good();
          b.classList.add('done');
          lit++;
          setTimeout(show, 500);
        } else {
          Sfx.bad(); wobble(b); b.classList.add('dim');
        }
      }));
    }
    show();
  }
}

// ---------- the Time Travel Festival (capstone) ----------
// Mirrors the real ENL final: choose a civilization, visit it through a
// picture-dialogue, then present three sentences you built on the bridges.
export function openTimeTravel({ sentences, onDone }) {
  UI.push({
    className: 'wh-fest-layer wh-tt-layer',
    html: '<div class="wh-fest-card"></div>',
    dismissible: true,
    onClose() { Read.stop(); },
    onMount(el, { close }) { pick(el.querySelector('.wh-fest-card'), close); },
  });

  function pick(card, close) {
    card.innerHTML = `
      <div class="wh-bridge-head"><b>Time Travel Festival</b>
        <span class="wh-bridge-sub">Choose a civilization to visit</span>
        <button class="dlg-x" data-gui-close>CLOSE</button></div>
      <div class="wh-tt-civs">${TIME_TRAVEL.map(c =>
        `<button class="wh-tt-civ" data-id="${esc(c.id)}"><canvas></canvas><b>${esc(c.name)}</b></button>`).join('')}</div>`;
    card.querySelectorAll('.wh-tt-civ').forEach((b, i) => {
      requestAnimationFrame(() => paintPic(TIME_TRAVEL[i].pic, b.querySelector('canvas')));
      b.addEventListener('click', () => {
        Sfx.click();
        const civ = TIME_TRAVEL.find(c => c.id === b.dataset.id);
        close();
        openStory({
          title: civ.name,
          npc: 'Time Travel Festival',
          lines: civ.visit,
          doneLabel: 'PRESENT MY SENTENCES',
          onDone: () => present(civ),
        });
      });
    });
  }

  function present(civ) {
    UI.push({
      className: 'wh-fest-layer wh-tt-layer',
      html: '<div class="wh-fest-card"></div>',
      dismissible: true,
      onClose() { Read.stop(); },
      onMount(el, { close }) {
        const card = el.querySelector('.wh-fest-card');
        const three = sentences.slice(0, 3);
        card.innerHTML = `
          <div class="wh-bridge-head"><b>Your Presentation</b>
            <span class="wh-bridge-sub">You visited ${esc(civ.name)}. Now read your sentences.</span>
            <button class="dlg-x" data-gui-close>CLOSE</button></div>
          ${three.map(s => `
            <div class="wh-tt-sentence"><p>${esc(s)}</p>
              ${Read.buttonHTML(s, { lang: 'en-US', label: 'Read this sentence aloud' })}</div>`).join('')}
          <div class="wh-story-nav"><button class="wh-btn wh-tt-go">PRESENT — READ THEM ALL</button></div>`;
        card.querySelector('.wh-tt-go').addEventListener('click', () => {
          Sfx.questDone();
          Read.speak(three.join('. '), { lang: 'en-US', rate: 0.85 });
          const nav = card.querySelector('.wh-story-nav');
          nav.innerHTML = `<span class="wh-cheer">You built a town out of words. Congratulations.</span>
            <button class="wh-btn" data-gui-close>FINISH</button>`;
          onDone && onDone(civ);
        });
      },
    });
  }
}
