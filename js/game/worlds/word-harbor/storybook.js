// storybook.js — WORD HARBOR's picture-first story dialogue.
// Every line: a procedural illustration, simple English (max ~12 words),
// a read-aloud speaker, and a 中文 + Español hint toggle. No timers, no
// wrong answers — stories are warm and always finishable.
import * as UI from '../../ui.js';
import * as Sfx from '../../sfx.js';
import * as Read from '../../../learn/read-aloud.js';
import { paintPic } from './pics.js';

const esc = UI.esc;
const HINT_KEY = 'mmw-wh-hints'; // '1' = hints open by default

export function openStory({ title, npc, lines, doneLabel = 'THE END', onDone, onLine }) {
  let i = 0;
  let hintsOn = false;
  try { hintsOn = localStorage.getItem(HINT_KEY) === '1'; } catch (e) { /* fresh */ }

  UI.push({
    className: 'gui-dialogue wh-story',
    html: '<div class="wh-story-card"></div>',
    dismissible: true,
    onClose() { Read.stop(); },
    onMount(el, { close }) { render(el.querySelector('.wh-story-card'), close); },
  });

  function render(card, close) {
    const line = lines[i];
    const last = i === lines.length - 1;
    card.innerHTML = `
      <div class="wh-story-head">
        <div class="wh-story-who">${npc ? esc(npc) : ''}<b>${esc(title)}</b></div>
        <span class="wh-story-step">${i + 1} / ${lines.length}</span>
        <button class="dlg-x" data-gui-close>LEAVE</button>
      </div>
      <canvas class="wh-story-pic" aria-hidden="true"></canvas>
      <div class="wh-story-line">
        <p class="wh-story-en">${esc(line.en)}</p>
        ${Read.buttonHTML(line.en, { lang: 'en-US', label: 'Read this line aloud', extraClass: 'wh-read-line' })}
      </div>
      <div class="wh-story-hints" style="display:${hintsOn ? 'block' : 'none'}">
        <p lang="zh-Hans"><span class="wh-hint-lab">中文</span> ${esc(line.zh)} ${Read.buttonHTML(line.zh, { lang: 'zh-CN', label: 'Read in Chinese' })}</p>
        <p lang="es"><span class="wh-hint-lab">Español</span> ${esc(line.es)} ${Read.buttonHTML(line.es, { lang: 'es-ES', label: 'Read in Spanish' })}</p>
      </div>
      <div class="wh-story-nav">
        <button class="wh-btn wh-hint-toggle ${hintsOn ? 'on' : ''}">${hintsOn ? 'HIDE HINTS' : '中文 / ESPAÑOL'}</button>
        ${i > 0 ? '<button class="wh-btn wh-back">BACK</button>' : ''}
        <button class="wh-btn wh-next">${last ? esc(doneLabel) : 'NEXT'}</button>
      </div>`;

    const cv = card.querySelector('.wh-story-pic');
    requestAnimationFrame(() => paintPic(line.pic, cv));

    // gentle auto read-aloud of the English line (slower rate for ENL)
    Read.speak(line.en, { lang: 'en-US', rate: 0.85 });
    onLine && onLine(line, i);

    card.querySelector('.wh-hint-toggle').addEventListener('click', () => {
      Sfx.click();
      hintsOn = !hintsOn;
      try { localStorage.setItem(HINT_KEY, hintsOn ? '1' : '0'); } catch (e) { /* no-op */ }
      render(card, close);
    });
    const back = card.querySelector('.wh-back');
    if (back) back.addEventListener('click', () => { Sfx.click(); i -= 1; render(card, close); });
    card.querySelector('.wh-next').addEventListener('click', () => {
      Sfx.click();
      if (last) { close(); onDone && onDone(); return; }
      i += 1;
      render(card, close);
    });
  }
}
