// gamehud.js — the trade bar: shekels, cargo meter, guild rank, era badge,
// level + XP fill, the live quest tracker chip, and the JOURNAL / MAP
// buttons. Pure DOM, identical for touch and keyboard, zero emoji.
import * as UI from './ui.js';
import * as Sfx from './sfx.js';

const esc = UI.esc;

export function createGameHUD({ onJournal, onMap, isMobile }) {
  const bar = document.createElement('div');
  bar.id = 'trade-bar';
  bar.innerHTML = `
    <div class="tb-block tb-coins" title="Shekels — weighed silver, the money of the first merchants">
      <span class="tb-coin-dot"></span><b id="tb-coins">0</b>
    </div>
    <div class="tb-block" title="Cargo packs used"><span class="tb-lab">CARGO</span> <b id="tb-cargo">0/6</b></div>
    <div class="tb-block tb-rank" title="Guild rank — take exams at the Merchants' Guild Hall"><b id="tb-rank">Peddler</b></div>
    <div class="tb-block tb-era"><span class="tb-lab">ERA</span> <b id="tb-era">I</b> <span id="tb-eraname" class="tb-eraname"></span></div>
    <div class="tb-block tb-house" id="tb-house-block" title="House Standing — your family's name in the markets of the world. Win it back one honest contract at a time." style="display:none">
      <span class="tb-lab">HOUSE</span>
      <span class="tb-housebar"><i id="tb-housefill"></i></span>
      <b id="tb-house">0</b>
    </div>
    <div class="tb-block tb-lvl" title="Trader level — earn XP by trading, quests and exams">
      <span class="tb-lab">LV</span> <b id="tb-level">1</b>
      <span class="tb-xpbar"><i id="tb-xpfill"></i></span>
      <span id="tb-pts" class="tb-pts" style="display:none"></span>
    </div>
    <button id="tb-journal" class="tb-btn">JOURNAL</button>
    <button id="tb-map" class="tb-btn">MAP</button>
  `;
  document.body.appendChild(bar);

  const tracker = document.createElement('button');
  tracker.id = 'quest-tracker';
  tracker.style.display = 'none';
  document.body.appendChild(tracker);
  tracker.addEventListener('click', () => { Sfx.click(); onJournal(); });

  bar.querySelector('#tb-journal').addEventListener('click', () => { Sfx.click(); onJournal(); });
  bar.querySelector('#tb-map').addEventListener('click', () => { Sfx.click(); onMap(); });

  window.addEventListener('keydown', (e) => {
    if (e.target.tagName === 'TEXTAREA' || e.target.tagName === 'INPUT') return;
    if (e.code === 'KeyM') { e.stopImmediatePropagation(); onMap(); }
    if (e.code === 'KeyJ') { e.stopImmediatePropagation(); onJournal(); }
  }, true);

  const el = id => bar.querySelector('#' + id);
  const coinsEl = el('tb-coins'), cargoEl = el('tb-cargo'), rankEl = el('tb-rank'),
    eraEl = el('tb-era'), eraNameEl = el('tb-eraname'), lvlEl = el('tb-level'),
    xpFill = el('tb-xpfill'), ptsEl = el('tb-pts'),
    houseBlock = el('tb-house-block'), houseFill = el('tb-housefill'), houseEl = el('tb-house');

  let lastCoins = null;

  function set({ coins, cargo, cap, rank, era, eraName, level, xpFrac, perkPts }) {
    if (coins !== undefined) {
      coinsEl.textContent = coins;
      if (lastCoins !== null && coins !== lastCoins) {
        coinsEl.parentElement.classList.remove('pulse');
        void coinsEl.parentElement.offsetWidth;
        coinsEl.parentElement.classList.add('pulse');
      }
      lastCoins = coins;
    }
    if (cargo !== undefined) cargoEl.textContent = `${cargo}/${cap}`;
    if (rank !== undefined) rankEl.textContent = rank;
    if (era !== undefined) { eraEl.textContent = ['I', 'II', 'III', 'IV'][era - 1] || era; eraNameEl.textContent = isMobile ? '' : (eraName || ''); }
    if (level !== undefined) lvlEl.textContent = level;
    if (xpFrac !== undefined) xpFill.style.width = Math.round(xpFrac * 100) + '%';
    if (perkPts !== undefined) {
      ptsEl.style.display = perkPts > 0 ? 'inline' : 'none';
      ptsEl.textContent = `+${perkPts} PERK`;
    }
  }

  // House Standing — shown only once the story has begun (chapter >= 1). A
  // small pulse on rise makes "the house has a name again" feel like a win.
  let lastHouse = null;
  function setHouse(standing, max = 12) {
    if (standing === undefined || standing === null) { houseBlock.style.display = 'none'; return; }
    houseBlock.style.display = '';
    houseEl.textContent = standing;
    houseFill.style.width = Math.max(4, Math.min(100, Math.round((standing / max) * 100))) + '%';
    if (lastHouse !== null && standing > lastHouse) {
      houseBlock.classList.remove('rise'); void houseBlock.offsetWidth; houseBlock.classList.add('rise');
    }
    lastHouse = standing;
  }

  function setQuest(q) {
    if (!q) { tracker.style.display = 'none'; return; }
    tracker.style.display = 'block';
    tracker.innerHTML = `<span class="qt-name">${esc(q.name)}</span><span class="qt-obj">${esc(q.objective)}</span>`;
  }

  return { set, setQuest, setHouse, bar };
}
