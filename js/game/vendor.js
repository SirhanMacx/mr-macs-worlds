// vendor.js — the market UI: a city's buy list and your cargo's sell list,
// live prices, capacity meter, one-tap and x5 trading. Knowing WHERE a good
// is cheap and WHERE it is dear is the whole game — the UI shows the local
// price plus the good's real-history note, never a quiz.
import * as UI from './ui.js';
import * as Sfx from './sfx.js';

const esc = UI.esc;

// openMarket({city, goodsHere:[{good, price}], econ, onBuy, onSell, onStory, footer})
export function openMarket(opts) {
  const { city, econ } = opts;

  UI.push({
    className: 'gui-market',
    html: '<div class="mkt-card"></div>',
    onMount(el) {
      const card = el.querySelector('.mkt-card');
      render(card);
    },
  });

  function render(card) {
    const goodsHere = opts.goodsHere();
    // build sell rows from actual cargo
    const sellRows = [];
    const stateCargo = opts.cargo();
    for (const gid in stateCargo) {
      const row = goodsHere.find(r => r.good.id === gid);
      const good = econ.goodById[gid];
      sellRows.push({ good, n: stateCargo[gid], price: row ? row.price : Math.max(1, Math.round(good.base * 0.55)), local: !!row });
    }
    sellRows.sort((a, b) => b.price - a.price);

    const cap = `${econ.cargoCount()}/${econ.capacity()}`;

    card.innerHTML = `
      <div class="mkt-head">
        <div>
          <div class="mkt-city">${esc(city.name)} — Market</div>
          <div class="mkt-sub">${esc(city.tag)}</div>
        </div>
        <div class="mkt-meta">
          <span class="mkt-coins">${econ.coins()} <i>shekels</i></span>
          <span class="mkt-cap">Cargo ${cap}</span>
          <button class="dlg-x" data-gui-close>LEAVE</button>
        </div>
      </div>
      <div class="mkt-cols">
        <div class="mkt-col">
          <h3>For sale here</h3>
          <div class="mkt-rows" id="mkt-buy"></div>
        </div>
        <div class="mkt-col">
          <h3>Your cargo</h3>
          <div class="mkt-rows" id="mkt-sell">${sellRows.length ? '' : '<p class="mkt-empty">Nothing in your packs. Buy low here, sell high somewhere it is scarce.</p>'}</div>
        </div>
      </div>
      ${opts.footer ? `<div class="mkt-foot">${opts.footer}</div>` : ''}`;

    const buyEl = card.querySelector('#mkt-buy');
    for (const row of goodsHere) {
      const { good, price, spread } = row;
      const d = document.createElement('div');
      d.className = 'mkt-row';
      d.innerHTML = `
        <div class="mkt-good">
          <b>${esc(good.name)}</b>
          <span class="mkt-fact">${esc(good.fact)}</span>
          ${spread ? `<span class="mkt-spread">${esc(spread)}</span>` : ''}
        </div>
        <div class="mkt-price">${price}</div>
        <div class="mkt-btns"><button data-n="1">BUY</button><button data-n="5">x5</button></div>`;
      d.querySelectorAll('button').forEach(b => b.addEventListener('click', () => {
        const n = +b.dataset.n;
        let bought = 0;
        for (let i = 0; i < n; i++) {
          const r = econ.buy(good.id, price);
          if (!r.ok) {
            if (bought === 0) {
              Sfx.denied();
              UI.floatText(r.why === 'coins' ? 'Not enough shekels' : 'Packs are full', 'warn');
            }
            break;
          }
          bought++;
        }
        if (bought > 0) { Sfx.buy(); opts.onBuy && opts.onBuy(good, price, bought); }
        render(card);
      }));
      buyEl.appendChild(d);
    }

    const sellEl = card.querySelector('#mkt-sell');
    for (const row of sellRows) {
      const d = document.createElement('div');
      d.className = 'mkt-row' + (row.local ? '' : ' mkt-flat');
      d.innerHTML = `
        <div class="mkt-good">
          <b>${esc(row.good.name)}</b> <span class="mkt-n">x${row.n}</span>
          ${row.local ? '' : '<span class="mkt-fact">No demand here — they pay scrap rates</span>'}
        </div>
        <div class="mkt-price">${row.price}</div>
        <div class="mkt-btns"><button data-n="1">SELL</button><button data-n="${Math.min(5, row.n)}">x${Math.min(5, row.n)}</button></div>`;
      d.querySelectorAll('button').forEach(b => b.addEventListener('click', () => {
        const n = +b.dataset.n;
        let sold = 0, total = 0;
        for (let i = 0; i < n; i++) {
          const r = econ.sell(row.good.id, row.price);
          if (!r.ok) break;
          sold++; total += row.price;
        }
        if (sold > 0) { Sfx.sell(); opts.onSell && opts.onSell(row.good, row.price, sold, total); }
        render(card);
      }));
      sellEl.appendChild(d);
    }

    // footer buttons (story / guild etc) are wired by the controller
    opts.onRender && opts.onRender(card, () => render(card));
  }
}
