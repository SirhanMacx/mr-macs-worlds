// wraith.js — MISCONCEPTION WRAITH encounters. The wraith voices a tempting,
// exam-style misconception; you beat it by choosing the correct refutation.
// HP is the wraith's confidence in its lie — right refutations drain it; a wrong
// choice costs YOUR confidence instead. Distractor-busting as combat.
import * as UI from '../../ui.js';
import * as Sfx from '../../sfx.js';
import { WRAITHS } from './content.js';

const esc = UI.esc;

export function openWraith(regionId, g, onWin) {
  const W = WRAITHS[regionId];
  if (!W) { onWin && onWin(); return { auto() {} }; }
  const claims = W.claims;
  let hp = claims.length, ci = 0, done = false, card = null;

  UI.push({
    className: 'gui-ma ma-wraith',
    html: '<div class="ma-card"></div>',
    onMount(el, { close }) { card = el.querySelector('.ma-card'); render(); },
  });

  function hpBar() {
    const pips = [];
    for (let k = 0; k < claims.length; k++) pips.push(`<i class="${k < hp ? 'on' : ''}"></i>`);
    return `<div class="ma-whp">${pips.join('')}</div>`;
  }

  function wraithSvg() {
    return `<svg viewBox="0 0 120 110" class="ma-wraithart">
      <defs><radialGradient id="wg" cx="50%" cy="40%" r="60%">
        <stop offset="0%" stop-color="#b07cff"/><stop offset="100%" stop-color="#2a1a44"/></radialGradient></defs>
      <path d="M60 8 C32 8 18 34 22 60 C24 78 18 86 14 98 C30 92 34 100 48 96 C54 102 66 102 72 96 C86 100 90 92 106 98 C102 86 96 78 98 60 C102 34 88 8 60 8 Z" fill="url(#wg)" opacity="0.92"/>
      <circle cx="46" cy="46" r="6" fill="#fff"/><circle cx="74" cy="46" r="6" fill="#fff"/>
      <circle cx="46" cy="47" r="2.6" fill="#1a0f2e"/><circle cx="74" cy="47" r="2.6" fill="#1a0f2e"/>
      <path d="M44 70 Q60 62 76 70" stroke="#1a0f2e" stroke-width="2.5" fill="none"/></svg>`;
  }

  function render() {
    if (ci >= claims.length || hp <= 0) return finish();
    const c = claims[ci];
    const refs = c.refutations.map((r, idx) => ({ ...r, idx })).sort(() => Math.random() - 0.5);
    card.innerHTML = `
      <div class="ma-head"><div><div class="ma-kicker bad">MISCONCEPTION WRAITH</div>
        <div class="ma-title">${esc(W.name)}</div><div class="ma-wtag">${esc(W.tag)}</div></div>
        <button class="dlg-x" data-gui-close>FLEE</button></div>
      <div class="ma-wbody">${wraithSvg()}${hpBar()}</div>
      <div class="ma-wclaim">"${esc(c.claim)}"</div>
      <p class="ma-wask">Choose the refutation that breaks the lie:</p>
      <div class="ma-reframes">${refs.map(r =>
        `<button class="ma-reframe" data-ok="${r.correct ? 1 : 0}">${esc(r.text)}</button>`).join('')}</div>
      <div class="ma-fb" id="ma-fb"></div>`;
    card.querySelectorAll('.ma-reframe').forEach(b => b.addEventListener('click', () => strike(b.dataset.ok === '1', b)));
  }

  function strike(ok, btn) {
    if (done) return;
    const c = claims[ci];
    const fb = card.querySelector('#ma-fb');
    if (ok) {
      hp--; ci++;
      Sfx.good(); g.fx('sparkle');
      if (fb) { fb.className = 'ma-fb good'; fb.innerHTML = `<b>Direct hit.</b> ${esc(c.why)}`; }
      if (ci >= claims.length || hp <= 0) setTimeout(finish, 420); else setTimeout(render, 480);
    } else {
      Sfx.bad(); g.hurt(16, 'the wraith feeds on the error');
      if (btn) btn.classList.add('wrong');
      if (fb) { fb.className = 'ma-fb bad'; fb.innerHTML = `<b>The wraith grows brighter.</b> That answer repeats a misconception — find the correct refutation.`; }
      if (g.confidence() <= 0) return retreat();
    }
  }

  function retreat() {
    if (done) return;
    done = true;
    card.innerHTML = `
      <div class="ma-head"><div><div class="ma-kicker bad">YOU FALL BACK</div>
      <div class="ma-title">Confidence spent</div></div></div>
      <p class="ma-clue">The wraith was too strong this time. Study the region's denizen and the info panel, then return — your confidence will recover as you walk.</p>
      <div class="ma-actions"><button class="ma-go" data-gui-close>RETREAT</button></div>`;
    g.recover();
  }

  function finish() {
    if (done) return;
    done = true;
    card.innerHTML = `
      <div class="ma-head"><div><div class="ma-kicker good">WRAITH DISPELLED</div>
      <div class="ma-title">${esc(W.name)} unravels</div></div></div>
      <p class="ma-clue">Every lie met its correction. The misconception cannot hold in a mind that knows the difference.</p>
      <div class="ma-actions"><button class="ma-go" data-gui-close>CONTINUE</button></div>`;
    Sfx.examPass(); g.fx('confetti');
    onWin && onWin();
  }

  const ctrl = {
    auto() {
      while (!done && ci < claims.length && hp > 0) strike(true, null);
      if (!done) finish();
    },
    close: null,
  };
  return ctrl;
}
