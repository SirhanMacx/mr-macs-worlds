// wraith.js — THE FOG encounter. Every "wraith" is the one recurring antagonist
// (THE FOG, the mind's accumulated MISCONCEPTIONS) wearing a regional face. It
// TAUNTS with a tempting wrong belief; you answer in-character with the real
// science. A wrong choice makes the Fog THICKEN and ATLAS coaches you back to
// the truth (a consequence + re-teach, NOT a red X / score / "Question 1 of N")
// and you try again from understanding. The CORRECT science drains the Fog;
// clearing all its claims clears the Fog from that region (and the controller
// raises Clarity + restores the region). The refutation-as-combat mechanic and
// the auto() verification hook are preserved.
import * as UI from '../../ui.js';
import * as Sfx from '../../sfx.js';
import { WRAITHS, FOG } from './content.js';

const esc = UI.esc;

// g.story (if present) and g.regionsRestored() let the Fog escalate region to
// region. onWin restores the region. onCoach is optional; by default Atlas
// coaches inline. Backward compatible with the old openWraith(regionId, g, onWin).
export function openWraith(regionId, g, onWin) {
  const W = WRAITHS[regionId];
  if (!W) { onWin && onWin(); return { auto() {} }; }
  const claims = W.claims;
  const story = g && g.story;
  const restored = (g && g.regionsRestored) ? g.regionsRestored() : 0;
  const escLine = FOG.escalation[Math.min(restored, FOG.escalation.length - 1)];

  let hp = claims.length, ci = 0, done = false, card = null;
  let phase = 'taunt'; // taunt → fight (claims) → finish
  let coaching = false;

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

  // procedural Fog face (the recurring antagonist). Thins as hp drops.
  function fogSvg() {
    const op = (0.55 + 0.37 * (hp / Math.max(1, claims.length))).toFixed(2);
    return `<svg viewBox="0 0 120 110" class="ma-wraithart" aria-hidden="true">
      <defs><radialGradient id="fg-${regionId}" cx="50%" cy="40%" r="62%">
        <stop offset="0%" stop-color="#b07cff"/><stop offset="65%" stop-color="#3a2466"/><stop offset="100%" stop-color="#1a1030"/></radialGradient></defs>
      <path d="M60 8 C30 6 16 32 22 58 C24 76 14 84 10 100 C28 94 34 102 48 96 C54 102 66 102 72 96 C86 102 92 94 110 100 C106 84 96 76 98 58 C104 32 90 6 60 8 Z" fill="url(#fg-${regionId})" opacity="${op}"/>
      <circle cx="46" cy="46" r="6" fill="#ece9ff"/><circle cx="74" cy="46" r="6" fill="#ece9ff"/>
      <circle cx="46" cy="47" r="2.4" fill="#1a0f2e"/><circle cx="74" cy="47" r="2.4" fill="#1a0f2e"/>
      <path d="M44 72 Q60 64 76 72" stroke="#1a0f2e" stroke-width="2.2" fill="none" opacity="0.8"/></svg>`;
  }

  // ---- the Fog taunts before the fight (one in-character beat) ----
  function renderTaunt() {
    const intro = W.keystone
      ? escLine + ' ' + (W.taunt || '')
      : escLine + ' ' + (W.taunt || 'The Fog offers you a comfortable, familiar belief.');
    card.innerHTML = `
      <div class="ma-head"><div><div class="ma-kicker bad">${esc(FOG.name)} · ${esc(W.tag)}</div>
        <div class="ma-title">${esc(W.name)}</div></div>
        <button class="dlg-x" data-gui-close>WITHDRAW</button></div>
      <div class="ma-wbody">${fogSvg()}</div>
      <div class="ma-wclaim">${esc(intro)}</div>
      <p class="ma-wask">${W.keystone ? 'This is the keystone of the whole mind. Face the Fog with the truth.' : 'Face the Fog with the truth, claim by claim.'}</p>
      <div class="ma-actions"><button class="ma-go prim" id="ma-faceit">Answer the Fog with the science</button></div>`;
    const b = card.querySelector('#ma-faceit');
    if (b) b.addEventListener('click', () => { Sfx.click(); phase = 'fight'; render(); });
  }

  function render() {
    if (phase === 'taunt') return renderTaunt();
    if (coaching) return; // Atlas coaching overlay is showing; wait for retry
    if (ci >= claims.length || hp <= 0) return finish();
    const c = claims[ci];
    // choices are full in-character lines: the Fog's lie vs. your true answer
    const refs = c.refutations.map((r, idx) => ({ ...r, idx })).sort(() => Math.random() - 0.5);
    card.innerHTML = `
      <div class="ma-head"><div><div class="ma-kicker bad">${esc(FOG.name)} · ${esc(W.tag)}</div>
        <div class="ma-title">${esc(W.name)}</div></div>
        <button class="dlg-x" data-gui-close>WITHDRAW</button></div>
      <div class="ma-wbody">${fogSvg()}${hpBar()}</div>
      <div class="ma-wclaim">The Fog presses the belief: "${esc(c.claim)}"</div>
      <p class="ma-wask">You answer:</p>
      <div class="ma-reframes">${refs.map(r =>
        `<button class="ma-reframe say" data-ok="${r.correct ? 1 : 0}">${esc(r.text)}</button>`).join('')}</div>
      <div class="ma-fb" id="ma-fb"></div>`;
    card.querySelectorAll('.ma-reframe').forEach(b => b.addEventListener('click', () => strike(b.dataset.ok === '1', b)));
  }

  function strike(ok, btn) {
    if (done || coaching) return;
    const c = claims[ci];
    const fb = card.querySelector('#ma-fb');
    if (ok) {
      hp--; ci++;
      Sfx.good(); g.fx('sparkle');
      if (fb) { fb.className = 'ma-fb good'; fb.innerHTML = `<b>The Fog thins.</b> ${esc(c.why)}`; }
      if (ci >= claims.length || hp <= 0) setTimeout(finish, 460); else setTimeout(render, 520);
    } else {
      // WRONG = the Fog THICKENS + Atlas coaches you to the truth, then retry.
      // This is a consequence + re-teach, never a red X or a lost "point."
      Sfx.bad();
      try { if (Sfx.storyMiss) Sfx.storyMiss(); } catch (e) { /* ok */ }
      g.hurt(14, 'the Fog feeds on the easy belief');
      if (btn) btn.classList.add('wrong');
      atlasCoach(c);
    }
  }

  // ATLAS steps in on a wrong answer — the mentor consequence, then a retry of
  // the SAME claim from understanding (the keystone loop).
  function atlasCoach(c) {
    coaching = true;
    const coach = W.coach
      || 'Atlas’s light steadies you. "The Fog thickened because you reached for the comfortable belief. Look at what is actually true here, then answer it again."';
    card.innerHTML = `
      <div class="ma-head"><div><div class="ma-kicker">ATLAS</div>
        <div class="ma-title">The Fog thickened — look again</div></div></div>
      <div class="ma-wbody"><svg viewBox="0 0 100 92" class="ma-creature" aria-hidden="true">
        <defs><radialGradient id="atl-${regionId}" cx="50%" cy="42%" r="60%">
          <stop offset="0%" stop-color="#ffe7b0"/><stop offset="100%" stop-color="#163a4a"/></radialGradient></defs>
        <circle cx="50" cy="44" r="30" fill="url(#atl-${regionId})" opacity="0.95"/>
        <circle cx="50" cy="44" r="13" fill="#fff3d0"/></svg></div>
      <p class="ma-clue">${esc(coach)}</p>
      <div class="ma-fb bad"><b>Why that belief is wrong:</b> ${esc(c.why)}</div>
      <div class="ma-actions"><button class="ma-go prim" id="ma-retry">I understand now — face the Fog again</button></div>`;
    const b = card.querySelector('#ma-retry');
    if (b) b.addEventListener('click', () => { Sfx.click(); coaching = false; render(); });
  }

  function finish() {
    if (done) return;
    done = true;
    const humbled = W.humbled
      || 'The Fog loses its hold here, thinning to almost nothing. "…This room is yours, cartographer."';
    card.innerHTML = `
      <div class="ma-head"><div><div class="ma-kicker good">THE FOG RECEDES</div>
      <div class="ma-title">${esc(W.name)} can’t hold here</div></div></div>
      <div class="ma-wbody">${fogSvg()}</div>
      <p class="ma-clue">${esc(humbled)}</p>
      <div class="ma-actions"><button class="ma-go" data-gui-close>CONTINUE</button></div>`;
    Sfx.examPass(); g.fx('confetti');
    onWin && onWin();
  }

  const ctrl = {
    auto() {
      // drive the real logic to completion (used by hint + headless verify):
      // skip the taunt, answer every claim correctly.
      phase = 'fight'; coaching = false;
      while (!done && ci < claims.length && hp > 0) strike(true, null);
      if (!done) finish();
    },
    close: null,
  };
  return ctrl;
}
