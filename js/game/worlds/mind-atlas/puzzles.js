// puzzles.js — MIND ATLAS concept-mechanic puzzles. Each is a real psychology
// idea turned into a playable verb: neuron signal-routing, the 7±2 working-
// memory carry, classical conditioning of a companion, reinforcement schedules,
// attribution sorting, and cognitive restructuring. Every open*() returns a
// small controller with an auto() that drives the real logic (used by the
// in-game hint and by headless verification).
import * as UI from '../../ui.js';
import * as Sfx from '../../sfx.js';
import {
  NEURON_PUZZLE, NEUROTRANSMITTERS, MEMORY_PUZZLE, CONDITIONING,
  REINFORCEMENT, ATTRIBUTION, RESTRUCTURE,
} from './content.js';

const esc = UI.esc;
const NT_BY = {}; NEUROTRANSMITTERS.forEach(n => { NT_BY[n.id] = n; });
const hx = n => '#' + n.toString(16).padStart(6, '0');

// ---------------- 1) NEURON SIGNAL-ROUTING ----------------
export function openNeuron(g, onWin) {
  const gates = NEURON_PUZZLE.gates;
  let i = 0, done = false;
  let card = null;

  UI.push({
    className: 'gui-ma ma-puzzle',
    html: '<div class="ma-card"></div>',
    onMount(el, { close }) { card = el.querySelector('.ma-card'); render(); },
  });

  function render() {
    if (i >= gates.length) return finish();
    const gate = gates[i];
    // a row of synapse nodes, the live one pulsing
    const track = gates.map((gt, k) =>
      `<div class="ma-syn ${k < i ? 'on' : k === i ? 'live' : ''}">${k < i ? '●' : k === i ? '◉' : '○'}</div>`).join('<span class="ma-axon"></span>');
    card.innerHTML = `
      <div class="ma-head"><div><div class="ma-kicker">NEURAL CAVERNS · SIGNAL ROUTING</div>
        <div class="ma-title">Synapse ${i + 1} of ${gates.length}</div></div>
        <button class="dlg-x" data-gui-close>LEAVE</button></div>
      <div class="ma-track">${track}</div>
      <p class="ma-clue">${esc(gate.clue)}</p>
      <div class="ma-keys">${NEUROTRANSMITTERS.map(n =>
        `<button class="ma-key" data-nt="${n.id}" style="--c:${hx(n.color)}"><b>${esc(n.icon)}</b><span>${esc(n.name)}</span><i>${esc(n.role)}</i></button>`).join('')}</div>
      <div class="ma-fb" id="ma-fb"></div>`;
    card.querySelectorAll('.ma-key').forEach(b => b.addEventListener('click', () => pick(b.dataset.nt)));
  }

  function pick(ntId) {
    if (done || i >= gates.length) return;
    const gate = gates[i];
    const fb = card.querySelector('#ma-fb');
    if (ntId === gate.answer) {
      Sfx.good(); g.fx('sparkle');
      i++;
      if (fb) { fb.className = 'ma-fb good'; fb.textContent = 'Signal routed. ' + gate.why; }
      if (i >= gates.length) setTimeout(finish, 260); else setTimeout(render, 260);
    } else {
      Sfx.bad(); g.hurt(10, 'mis-routed signal');
      if (fb) { fb.className = 'ma-fb bad'; fb.innerHTML = `<b>That key does not fit this synapse.</b> ${esc(NT_BY[gate.answer] ? 'Think: ' + gate.clue.replace(/\.$/, '') : '')}`; }
    }
  }

  function finish() {
    if (done) return;
    done = true;
    card.innerHTML = `
      <div class="ma-head"><div><div class="ma-kicker good">SIGNAL RESTORED</div>
      <div class="ma-title">The caverns light up</div></div></div>
      <p class="ma-clue">Every synapse carried its message. The neural pathways glow end to end.</p>
      <div class="ma-actions"><button class="ma-go" data-gui-close>CONTINUE</button></div>`;
    Sfx.questDone(); g.fx('confetti');
    onWin && onWin();
  }

  const ctrl = {
    auto() { while (i < gates.length && !done) pick(gates[i].answer); if (!done) finish(); },
    close: null,
  };
  return ctrl;
}

// ---------------- 2) MEMORY-ORB CARRY (7±2) ----------------
export function openMemory(g, onWin) {
  const cap = MEMORY_PUZZLE.baseCapacity + (g.hasAbility('chunking') ? MEMORY_PUZZLE.chunkBonus : 0);
  const target = MEMORY_PUZZLE.target;
  const queue = MEMORY_PUZZLE.orbs.slice(0, Math.max(target, MEMORY_PUZZLE.orbs.length));
  let tray = [], vault = 0, qi = 0, done = false, overflowed = false;
  let card = null;

  UI.push({
    className: 'gui-ma ma-puzzle',
    html: '<div class="ma-card"></div>',
    onMount(el, { close }) { card = el.querySelector('.ma-card'); render(); },
  });

  function render() {
    const slots = [];
    for (let s = 0; s < cap; s++) {
      const orb = tray[s];
      slots.push(`<div class="ma-slot ${orb ? 'full' : ''}">${orb ? esc(orb) : ''}</div>`);
    }
    card.innerHTML = `
      <div class="ma-head"><div><div class="ma-kicker">MEMORY ARCHIPELAGO · WORKING MEMORY</div>
        <div class="ma-title">Carry ${target} orbs to the vault</div></div>
        <button class="dlg-x" data-gui-close>LEAVE</button></div>
      <p class="ma-clue">${esc(MEMORY_PUZZLE.intro)}</p>
      <div class="ma-mem">
        <div class="ma-tray"><div class="ma-traylab">WORKING-MEMORY TRAY · capacity ${cap}${g.hasAbility('chunking') ? ' (Chunking)' : ''}</div>
          <div class="ma-slots">${slots.join('')}</div></div>
        <div class="ma-vault"><div class="ma-vaultnum">${vault}/${target}</div><div class="ma-vaultlab">LONG-TERM VAULT</div></div>
      </div>
      <div class="ma-membtns">
        <button class="ma-mb" id="ma-load" ${qi >= queue.length ? 'disabled' : ''}>PICK UP ORB (${Math.max(0, queue.length - qi)} left)</button>
        <button class="ma-mb prim" id="ma-dep" ${tray.length ? '' : 'disabled'}>REHEARSE &amp; DEPOSIT (${tray.length})</button>
      </div>
      <div class="ma-fb" id="ma-fb"></div>`;
    card.querySelector('#ma-load').addEventListener('click', load);
    card.querySelector('#ma-dep').addEventListener('click', deposit);
  }

  function load() {
    if (done || qi >= queue.length) return;
    const orb = queue[qi++];
    const fb = () => card.querySelector('#ma-fb');
    if (tray.length >= cap) {
      const lost = tray.shift();           // working-memory overflow: oldest slips out
      tray.push(orb);
      overflowed = true;
      Sfx.bad(); g.fx('dust');
      render();
      const f = fb(); if (f) { f.className = 'ma-fb bad'; f.innerHTML = `<b>Working memory overflow.</b> The tray was full — orb "${esc(lost)}" slipped into the tide. Deposit before it fills.`; }
    } else {
      tray.push(orb);
      Sfx.click();
      render();
    }
  }

  function deposit() {
    if (done || !tray.length) return;
    vault += tray.length;
    tray = [];
    Sfx.coin(); g.fx('sparkle'); g.insight(0);
    if (vault >= target) return finish();
    render();
    const f = card.querySelector('#ma-fb'); if (f) { f.className = 'ma-fb good'; f.textContent = 'Encoded to long-term storage. The tray is clear — pick up more.'; }
  }

  function finish() {
    if (done) return;
    done = true;
    card.innerHTML = `
      <div class="ma-head"><div><div class="ma-kicker good">ARCHIPELAGO STORED</div>
      <div class="ma-title">${overflowed ? 'You felt the limit — and beat it' : 'All orbs safely vaulted'}</div></div></div>
      <p class="ma-clue">Working memory holds only about seven at a time, so you carried them across in batches and chunked the rest into the vault.</p>
      <div class="ma-actions"><button class="ma-go" data-gui-close>CONTINUE</button></div>`;
    Sfx.questDone(); g.fx('confetti');
    onWin && onWin();
  }

  const ctrl = {
    auto() {
      // demonstrate the limit: fill the tray, then one more to force an overflow
      while (tray.length < cap && qi < queue.length) load();
      if (qi < queue.length) load();   // one overflow — the 7±2 limit bites
      deposit();
      // then deliver the rest in safe batches until the vault is full
      let guard = 0;
      while (!done && guard++ < 60) {
        if (tray.length < cap && qi < queue.length) { load(); continue; }
        if (tray.length) { deposit(); continue; }
        break;
      }
    },
    load, deposit,
    info: () => ({ cap, tray: tray.length, vault, overflowed, done }),
    close: null,
  };
  return ctrl;
}

// ---------------- 3) CLASSICAL CONDITIONING (companion) ----------------
export function openConditioning(g, onWin) {
  const C = CONDITIONING;
  let strength = 0, phase = 'acquire', acquired = false, done = false;
  const history = [];
  let card = null;

  UI.push({
    className: 'gui-ma ma-puzzle',
    html: '<div class="ma-card"></div>',
    onMount(el, { close }) { card = el.querySelector('.ma-card'); render(); },
  });

  function creature(strength) {
    // a small procedural mind-creature; ears perk + drips appear with CR strength
    const perk = (strength * 18).toFixed(0);
    const drip = strength > 0.45 ? `<circle cx="50" cy="62" r="${(strength * 3).toFixed(1)}" fill="#7fd9ff"/>` : '';
    return `<svg viewBox="0 0 100 90" class="ma-creature">
      <ellipse cx="50" cy="60" rx="26" ry="20" fill="#3a7d6b"/>
      <circle cx="50" cy="40" r="18" fill="#4f9e8a"/>
      <polygon points="36,30 30,${10 - perk} 44,26" fill="#3a7d6b"/>
      <polygon points="64,30 70,${10 - perk} 56,26" fill="#3a7d6b"/>
      <circle cx="43" cy="40" r="3" fill="#0c1622"/><circle cx="57" cy="40" r="3" fill="#0c1622"/>
      <path d="M44 50 Q50 ${50 + strength * 6} 56 50" stroke="#0c1622" stroke-width="2" fill="none"/>
      ${drip}</svg>`;
  }

  function render() {
    const pts = history.map((h, k) => `${(k / Math.max(1, C.steps || 18)) * 200},${60 - h * 52}`).join(' ');
    card.innerHTML = `
      <div class="ma-head"><div><div class="ma-kicker">LEARNING GROVE · CLASSICAL CONDITIONING</div>
        <div class="ma-title">${phase === 'acquire' ? 'Acquisition — build the response' : 'Extinction — let it fade'}</div></div>
        <button class="dlg-x" data-gui-close>LEAVE</button></div>
      <p class="ma-clue">${esc(C.intro)}</p>
      <div class="ma-cond">
        <div class="ma-crewrap">${creature(strength)}
          <div class="ma-crbar"><i style="width:${(strength * 100).toFixed(0)}%"></i></div>
          <div class="ma-crlab">Conditioned response: ${(strength * 100).toFixed(0)}%</div></div>
        <svg class="ma-curve" viewBox="0 0 200 64" preserveAspectRatio="none">
          <line x1="0" y1="8" x2="200" y2="8" stroke="rgba(127,217,255,.25)"/>
          <polyline points="${pts}" fill="none" stroke="#7fd9ff" stroke-width="2"/></svg>
      </div>
      <div class="ma-membtns">
        <button class="ma-mb prim" id="ma-pair">RING CHIME + FEED</button>
        <button class="ma-mb" id="ma-alone">RING CHIME ALONE</button>
      </div>
      <div class="ma-legend"><b>${esc(C.terms.ns)}</b> · <b>${esc(C.terms.us)}</b> · <b>${esc(C.terms.cr)}</b></div>
      <div class="ma-fb" id="ma-fb">${phase === 'acquire'
        ? 'Pair the chime with feeding until the response reaches ' + (C.acquireTo * 100) + '%.'
        : 'Now ring the chime ALONE until the response drops below ' + (C.extinguishTo * 100) + '%.'}</div>`;
    card.querySelector('#ma-pair').addEventListener('click', pair);
    card.querySelector('#ma-alone').addEventListener('click', alone);
  }

  function pair() {
    if (done) return;
    strength = Math.min(1, strength + C.gainPerPair);
    history.push(strength);
    Sfx.good(); g.fx('sparkle');
    if (phase === 'acquire' && strength >= C.acquireTo) { acquired = true; phase = 'extinguish'; g.insight(0); }
    render();
  }
  function alone() {
    if (done) return;
    if (!acquired) {
      // chime alone before acquisition does little — teaches that the link must form first
      Sfx.click();
      const f = card.querySelector('#ma-fb'); if (f) { f.className = 'ma-fb'; f.textContent = 'The chime means nothing yet — pair it with feeding first to build the association.'; }
      return;
    }
    strength = Math.max(0, strength - C.dropPerAlone);
    history.push(strength);
    Sfx.click();
    if (strength <= C.extinguishTo) return finish();
    render();
  }

  function finish() {
    if (done) return;
    done = true;
    card.innerHTML = `
      <div class="ma-head"><div><div class="ma-kicker good">GROVE RESTORED</div>
      <div class="ma-title">Acquisition, then extinction — read live</div></div></div>
      <p class="ma-clue">You paired a neutral chime with feeding until the chime alone stirred your companion (acquisition), then rang it alone until the link faded (extinction). That is classical conditioning, start to finish.</p>
      <div class="ma-actions"><button class="ma-go" data-gui-close>CONTINUE</button></div>`;
    Sfx.questDone(); g.fx('confetti');
    onWin && onWin();
  }

  const ctrl = {
    auto() {
      let guard = 0;
      while (!acquired && guard++ < 40) pair();
      guard = 0;
      while (!done && guard++ < 40) alone();
    },
    close: null,
  };
  return ctrl;
}

// ---------------- 3b) REINFORCEMENT SCHEDULES (operant mini) ----------------
export function openReinforcement(g, onWin) {
  const R = REINFORCEMENT;
  let pulls = {}, done = false, card = null;
  R.schedules.forEach(s => { pulls[s.id] = 0; });

  UI.push({
    className: 'gui-ma ma-puzzle',
    html: '<div class="ma-card"></div>',
    onMount(el, { close }) { card = el.querySelector('.ma-card'); render(); },
  });

  function payout(id, n) {
    // deterministic-ish pattern preview so the schedules read differently
    if (id === 'fr') return n % 4 === 0;
    if (id === 'vr') return [3, 7, 9, 12, 13, 17].includes(n);
    if (id === 'fi') return n % 5 === 0;
    if (id === 'vi') return [4, 11, 14, 19].includes(n);
    return false;
  }

  function render() {
    card.innerHTML = `
      <div class="ma-head"><div><div class="ma-kicker">LEARNING GROVE · REINFORCEMENT SCHEDULES</div>
        <div class="ma-title">Which schedule resists extinction best?</div></div>
        <button class="dlg-x" data-gui-close>LEAVE</button></div>
      <p class="ma-clue">${esc(R.intro)}</p>
      <div class="ma-mach">${R.schedules.map(s => `
        <div class="ma-machine">
          <div class="ma-mname">${esc(s.name)}</div>
          <div class="ma-mdesc">${esc(s.desc)}</div>
          <div class="ma-mreel" id="reel-${s.id}">— — —</div>
          <button class="ma-mb" data-pull="${s.id}">PULL LEVER</button>
        </div>`).join('')}</div>
      <div class="ma-keys ma-choose">${R.schedules.map(s =>
        `<button class="ma-key" data-pick="${s.id}"><b>${esc(s.name)}</b></button>`).join('')}</div>
      <div class="ma-fb" id="ma-fb">Pull a few levers, then choose the schedule most resistant to extinction.</div>`;
    card.querySelectorAll('[data-pull]').forEach(b => b.addEventListener('click', () => pull(b.dataset.pull)));
    card.querySelectorAll('[data-pick]').forEach(b => b.addEventListener('click', () => choose(b.dataset.pick)));
  }

  function pull(id) {
    if (done) return;
    pulls[id]++;
    const hit = payout(id, pulls[id]);
    const reel = card.querySelector('#reel-' + id);
    if (reel) reel.textContent = hit ? '★ ★ ★' : '— — —';
    hit ? Sfx.coin() : Sfx.click();
    if (hit) g.fx('sparkle');
  }

  function choose(id) {
    if (done) return;
    const fb = card.querySelector('#ma-fb');
    if (id === R.answer) {
      done = true;
      Sfx.questDone(); g.fx('confetti');
      card.innerHTML = `
        <div class="ma-head"><div><div class="ma-kicker good">SCHEDULE READ CORRECTLY</div>
        <div class="ma-title">Variable-ratio</div></div></div>
        <p class="ma-clue">${esc(R.why)}</p>
        <div class="ma-actions"><button class="ma-go" data-gui-close>CONTINUE</button></div>`;
      onWin && onWin();
    } else {
      Sfx.bad(); g.hurt(6, 'misread the schedule');
      if (fb) { fb.className = 'ma-fb bad'; fb.textContent = 'Not the most extinction-resistant. Watch which machine keeps you pulling even through dry streaks — the unpredictable one.'; }
    }
  }

  const ctrl = { auto() { for (let n = 1; n <= 14; n++) R.schedules.forEach(s => pull(s.id)); choose(R.answer); }, close: null };
  return ctrl;
}

// ---------------- 4) ATTRIBUTION SORT (Social) ----------------
export function openAttribution(g, onWin) {
  const A = ATTRIBUTION;
  let i = 0, correct = 0, bias = 0, done = false, card = null;

  UI.push({
    className: 'gui-ma ma-puzzle',
    html: '<div class="ma-card"></div>',
    onMount(el, { close }) { card = el.querySelector('.ma-card'); render(); },
  });

  function render() {
    if (i >= A.cards.length) return finish();
    const c = A.cards[i];
    card.innerHTML = `
      <div class="ma-head"><div><div class="ma-kicker">SOCIAL PLAZA · ATTRIBUTION</div>
        <div class="ma-title">Behavior ${i + 1} of ${A.cards.length}</div></div>
        <button class="dlg-x" data-gui-close>LEAVE</button></div>
      <p class="ma-clue">${esc(A.intro)}</p>
      <div class="ma-biasmeter"><span>Fundamental attribution error pull</span><div class="ma-biasbar"><i style="width:${Math.min(100, bias * 20)}%"></i></div></div>
      <div class="ma-scenario">${esc(c.text)}</div>
      <div class="ma-keys">${A.bins.map(b =>
        `<button class="ma-key" data-bin="${b.id}"><b>${esc(b.name)}</b><i>${esc(b.sub)}</i></button>`).join('')}</div>
      <div class="ma-fb" id="ma-fb"></div>`;
    card.querySelectorAll('[data-bin]').forEach(b => b.addEventListener('click', () => sort(b.dataset.bin)));
  }

  function sort(bin) {
    if (done) return;
    const c = A.cards[i];
    const fb = card.querySelector('#ma-fb');
    if (bin === c.answer) {
      correct++; i++; bias = Math.max(0, bias - 1);
      Sfx.good(); g.fx('sparkle');
      if (i >= A.cards.length) setTimeout(finish, 220); else setTimeout(render, 220);
      if (fb) { fb.className = 'ma-fb good'; fb.textContent = c.why; }
    } else {
      bias++;
      Sfx.bad(); g.hurt(8, 'attribution slip');
      if (fb) { fb.className = 'ma-fb bad'; fb.innerHTML = `<b>Look again.</b> ${esc(c.why)}`; }
      render();
      const f2 = card.querySelector('#ma-fb'); if (f2) { f2.className = 'ma-fb bad'; f2.innerHTML = `<b>Look again.</b> ${esc(c.why)}`; }
    }
  }

  function finish() {
    if (done) return;
    done = true;
    card.innerHTML = `
      <div class="ma-head"><div><div class="ma-kicker good">PLAZA RESTORED</div>
      <div class="ma-title">You judged the situation, not just the person</div></div></div>
      <p class="ma-clue">Each time you asked "would anyone act this way in this situation?" you resisted the fundamental attribution error — the heart of fair social judgment.</p>
      <div class="ma-actions"><button class="ma-go" data-gui-close>CONTINUE</button></div>`;
    Sfx.questDone(); g.fx('confetti');
    onWin && onWin();
  }

  const ctrl = { auto() { while (i < A.cards.length && !done) sort(A.cards[i].answer); if (!done) finish(); }, close: null };
  return ctrl;
}

// ---------------- 5) COGNITIVE RESTRUCTURING (Clinic) ----------------
export function openRestructure(g, onWin) {
  const R = RESTRUCTURE;
  let i = 0, done = false, card = null;

  UI.push({
    className: 'gui-ma ma-puzzle',
    html: '<div class="ma-card"></div>',
    onMount(el, { close }) { card = el.querySelector('.ma-card'); render(); },
  });

  function render() {
    if (i >= R.items.length) return finish();
    const it = R.items[i];
    // present choices in a stable order; the correct one is authored first, so shuffle
    const choices = it.choices.map((c, idx) => ({ ...c, idx })).sort(() => Math.random() - 0.5);
    card.innerHTML = `
      <div class="ma-head"><div><div class="ma-kicker">CLINIC SPRINGS · COGNITIVE RESTRUCTURING</div>
        <div class="ma-title">Distorted thought ${i + 1} of ${R.items.length}</div></div>
        <button class="dlg-x" data-gui-close>LEAVE</button></div>
      <p class="ma-clue">${esc(R.intro)}</p>
      <div class="ma-thought">${esc(it.thought)}<span class="ma-distort">${esc(it.distortion)}</span></div>
      <div class="ma-reframes">${choices.map(c =>
        `<button class="ma-reframe" data-ok="${c.correct ? 1 : 0}">${esc(c.text)}</button>`).join('')}</div>
      <div class="ma-fb" id="ma-fb"></div>`;
    card.querySelectorAll('.ma-reframe').forEach(b => b.addEventListener('click', () => pick(b.dataset.ok === '1', b)));
  }

  function pick(ok, btn) {
    if (done) return;
    const it = R.items[i];
    const fb = card.querySelector('#ma-fb');
    if (ok) {
      i++;
      Sfx.good(); g.fx('sparkle');
      if (i >= R.items.length) setTimeout(finish, 240); else setTimeout(render, 240);
      if (fb) { fb.className = 'ma-fb good'; fb.textContent = it.why; }
    } else {
      Sfx.bad(); g.hurt(8, 'distortion held');
      if (btn) btn.classList.add('wrong');
      if (fb) { fb.className = 'ma-fb bad'; fb.innerHTML = `<b>That reframe keeps the distortion.</b> Look for the balanced, evidence-based thought with a concrete next step.`; }
    }
  }

  function finish() {
    if (done) return;
    done = true;
    card.innerHTML = `
      <div class="ma-head"><div><div class="ma-kicker good">SPRINGS RESTORED</div>
      <div class="ma-title">Distortions rebuilt on the evidence</div></div></div>
      <p class="ma-clue">You named each distortion and replaced it with a thought that was kinder AND more accurate — the everyday skill of cognitive restructuring.</p>
      <div class="ma-actions"><button class="ma-go" data-gui-close>CONTINUE</button></div>`;
    Sfx.questDone(); g.fx('confetti');
    onWin && onWin();
  }

  const ctrl = {
    auto() {
      while (i < R.items.length && !done) pick(true, null);
      if (!done) finish();
    },
    close: null,
  };
  return ctrl;
}

// dispatch by region puzzle key
export const PUZZLES = {
  neuron: openNeuron,
  memory: openMemory,
  conditioning: openConditioning,
  attribution: openAttribution,
  restructure: openRestructure,
  reinforcement: openReinforcement,
};
