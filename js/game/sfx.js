// sfx.js — the game's whole soundscape, synthesized in WebAudio. Zero assets.
// UI ticks, coin chings, footsteps, quest fanfares, ambient wind + birds.
// Respects the world's existing mute setting (engine/audio.js stays the
// authority for "muted"); resumes the context on the first user gesture.
import * as Audio from '../engine/audio.js';

let ctx = null;
let master = null;
let ambient = null;

function ac() {
  if (!ctx) {
    ctx = new (window.AudioContext || window.webkitAudioContext)();
    master = ctx.createGain();
    master.gain.value = 0.5;
    master.connect(ctx.destination);
  }
  if (ctx.state === 'suspended') ctx.resume();
  return ctx;
}

const on = () => !Audio.isMuted();

// ---------- primitive voices ----------
function tone({ freq = 440, type = 'triangle', at = 0, dur = 0.12, vol = 0.16, slide = 0, q = null }) {
  const c = ac();
  const t0 = c.currentTime + at;
  const o = c.createOscillator();
  const g = c.createGain();
  o.type = type;
  o.frequency.setValueAtTime(freq, t0);
  if (slide) o.frequency.exponentialRampToValueAtTime(Math.max(30, freq + slide), t0 + dur);
  g.gain.setValueAtTime(0.0001, t0);
  g.gain.exponentialRampToValueAtTime(vol, t0 + 0.012);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  let node = o;
  if (q) {
    const f = c.createBiquadFilter();
    f.type = 'bandpass'; f.frequency.value = freq; f.Q.value = q;
    o.connect(f); node = f;
  }
  node.connect(g).connect(master);
  o.start(t0); o.stop(t0 + dur + 0.06);
}

let noiseBuf = null;
function noise({ at = 0, dur = 0.08, vol = 0.1, freq = 1200, q = 1.2, type = 'bandpass' }) {
  const c = ac();
  if (!noiseBuf) {
    noiseBuf = c.createBuffer(1, c.sampleRate * 1.2, c.sampleRate);
    const d = noiseBuf.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
  }
  const t0 = c.currentTime + at;
  const src = c.createBufferSource();
  src.buffer = noiseBuf;
  src.loop = true;
  const f = c.createBiquadFilter();
  f.type = type; f.frequency.value = freq; f.Q.value = q;
  const g = c.createGain();
  g.gain.setValueAtTime(0.0001, t0);
  g.gain.exponentialRampToValueAtTime(vol, t0 + 0.01);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  src.connect(f).connect(g).connect(master);
  src.start(t0); src.stop(t0 + dur + 0.05);
}

// ---------- the library ----------
export function click() { if (on()) tone({ freq: 720, type: 'square', dur: 0.045, vol: 0.05 }); }
export function open() { if (on()) { tone({ freq: 392, dur: 0.07, vol: 0.07 }); tone({ freq: 587, at: 0.05, dur: 0.09, vol: 0.07 }); } }
export function close() { if (on()) { tone({ freq: 587, dur: 0.07, vol: 0.06 }); tone({ freq: 392, at: 0.05, dur: 0.09, vol: 0.06 }); } }

export function coin() {
  if (!on()) return;
  tone({ freq: 1318, type: 'square', dur: 0.05, vol: 0.05 });
  tone({ freq: 1760, type: 'square', at: 0.05, dur: 0.14, vol: 0.06 });
}
export function sell() { // cha-ching
  if (!on()) return;
  noise({ dur: 0.05, vol: 0.07, freq: 5200, q: 1 });
  tone({ freq: 988, type: 'square', at: 0.02, dur: 0.06, vol: 0.06 });
  tone({ freq: 1318, type: 'square', at: 0.08, dur: 0.07, vol: 0.07 });
  tone({ freq: 1976, type: 'square', at: 0.15, dur: 0.16, vol: 0.07 });
}
export function buy() {
  if (!on()) return;
  tone({ freq: 880, type: 'square', dur: 0.05, vol: 0.05 });
  tone({ freq: 659, type: 'square', at: 0.06, dur: 0.1, vol: 0.05 });
}
export function denied() {
  if (!on()) return;
  tone({ freq: 196, type: 'sawtooth', dur: 0.13, vol: 0.06 });
  tone({ freq: 165, type: 'sawtooth', at: 0.1, dur: 0.18, vol: 0.06 });
}
export function good() {
  if (!on()) return;
  tone({ freq: 660, dur: 0.09, vol: 0.09 });
  tone({ freq: 880, at: 0.08, dur: 0.13, vol: 0.09 });
}
export function bad() {
  if (!on()) return;
  tone({ freq: 330, type: 'sawtooth', dur: 0.12, vol: 0.07 });
  tone({ freq: 247, type: 'sawtooth', at: 0.11, dur: 0.2, vol: 0.07 });
}
export function questAccept() {
  if (!on()) return;
  tone({ freq: 523, dur: 0.08, vol: 0.08 });
  tone({ freq: 659, at: 0.08, dur: 0.08, vol: 0.08 });
  tone({ freq: 784, at: 0.16, dur: 0.18, vol: 0.09 });
}
export function questDone() {
  if (!on()) return;
  [523, 659, 784, 1047].forEach((f, i) => tone({ freq: f, at: i * 0.09, dur: i === 3 ? 0.3 : 0.1, vol: 0.1 }));
}
export function levelUp() {
  if (!on()) return;
  [392, 523, 659, 784, 1047, 1318].forEach((f, i) => tone({ freq: f, at: i * 0.07, dur: 0.12, vol: 0.09 }));
}
export function eraUnlock() {
  if (!on()) return;
  [262, 330, 392, 523].forEach((f, i) => tone({ freq: f, at: i * 0.13, dur: 0.4, vol: 0.1, type: 'triangle' }));
  [1047, 1318, 1568].forEach((f, i) => tone({ freq: f, at: 0.5 + i * 0.1, dur: 0.35, vol: 0.07 }));
  noise({ at: 0.5, dur: 0.5, vol: 0.04, freq: 6000, q: 0.6 });
}
export function examPass() { questDone(); setTimeout(() => on() && tone({ freq: 1568, dur: 0.4, vol: 0.08 }), 380); }

// warm two-note rise — "the house has a name again". Used on a story win.
export function houseRise() {
  if (!on()) return;
  tone({ freq: 392, type: 'triangle', dur: 0.5, vol: 0.09 });
  tone({ freq: 523, type: 'triangle', at: 0.16, dur: 0.6, vol: 0.1 });
  tone({ freq: 784, type: 'sine', at: 0.32, dur: 0.5, vol: 0.06 });
}
// soft dissonant fall — a wrong-path beat. CONSEQUENCE, not a buzzer.
export function storyMiss() {
  if (!on()) return;
  tone({ freq: 330, type: 'sine', dur: 0.4, vol: 0.06 });
  tone({ freq: 247, type: 'sine', at: 0.18, dur: 0.55, vol: 0.06 });
}

// a quiet, slowly-evolving low string pad for cutscenes. Returns a stop()
// handle so the caller releases it when the beat ends. Self-contained; honors
// mute (silent pad if muted, but still returns a working stop()).
export function cinePad() {
  const c = ac();
  const g = c.createGain();
  g.gain.value = 0.0001;
  if (on()) g.gain.linearRampToValueAtTime(0.05, c.currentTime + 1.4);
  g.connect(master);
  const voices = [];
  [110, 164.81, 220].forEach((f, idx) => {
    const o = c.createOscillator();
    o.type = idx === 2 ? 'sine' : 'triangle';
    o.frequency.value = f;
    const vg = c.createGain();
    vg.gain.value = idx === 2 ? 0.25 : 0.5;
    // gentle detune drift via a slow LFO so the pad breathes
    const lfo = c.createOscillator(); lfo.frequency.value = 0.05 + idx * 0.03;
    const lg = c.createGain(); lg.gain.value = 1.5;
    lfo.connect(lg).connect(o.detune);
    o.connect(vg).connect(g);
    o.start(); lfo.start();
    voices.push(o, lfo);
  });
  let stopped = false;
  return function stop() {
    if (stopped) return; stopped = true;
    try {
      g.gain.cancelScheduledValues(c.currentTime);
      g.gain.setValueAtTime(g.gain.value, c.currentTime);
      g.gain.linearRampToValueAtTime(0.0001, c.currentTime + 0.6);
      voices.forEach(v => v.stop(c.currentTime + 0.7));
    } catch (e) { /* already stopped */ }
  };
}

let stepFlip = false;
export function footstep(run) {
  if (!on()) return;
  stepFlip = !stepFlip;
  noise({ dur: 0.045, vol: run ? 0.035 : 0.022, freq: stepFlip ? 240 : 200, q: 0.9, type: 'lowpass' });
}

// hoofbeat for the pack animal (slightly woodier than the footstep)
export function hoof() {
  if (!on()) return;
  noise({ dur: 0.04, vol: 0.02, freq: 330, q: 1.6, type: 'bandpass' });
}

// ---------- ambient bed: soft wind + occasional birds ----------
export function startAmbient() {
  if (ambient) return;
  try {
    const c = ac();
    if (!noiseBuf) noise({ dur: 0.001, vol: 0.0001 }); // builds the buffer
    const src = c.createBufferSource();
    src.buffer = noiseBuf; src.loop = true;
    const f = c.createBiquadFilter();
    f.type = 'lowpass'; f.frequency.value = 420; f.Q.value = 0.4;
    const g = c.createGain();
    g.gain.value = 0;
    const lfo = c.createOscillator();
    const lg = c.createGain();
    lfo.frequency.value = 0.07; lg.gain.value = 90;
    lfo.connect(lg).connect(f.frequency);
    src.connect(f).connect(g).connect(master);
    src.start(); lfo.start();
    ambient = { g, birdTimer: null };
    const tick = () => {
      ambient.g.gain.linearRampToValueAtTime(on() ? 0.018 : 0, c.currentTime + 0.8);
      if (on() && Math.random() < 0.3) birdChirp();
      ambient.birdTimer = setTimeout(tick, 2600 + Math.random() * 4200);
    };
    tick();
  } catch (e) { /* audio unavailable */ }
}

function birdChirp() {
  const base = 2200 + Math.random() * 1400;
  const n = 2 + Math.floor(Math.random() * 3);
  for (let i = 0; i < n; i++) {
    tone({ freq: base + Math.random() * 500, at: i * 0.12 + Math.random() * 0.04, dur: 0.07, vol: 0.018, slide: 320, type: 'sine' });
  }
}

// ---------- tab-hide pause ----------
// When the tab is hidden (bell rings, student switches to Classroom) the
// whole soundscape suspends — ambient wind, birds, everything. It resumes
// in place when the tab returns. Saves flush separately in game/save.js.
document.addEventListener('visibilitychange', () => {
  if (!ctx) return;
  try {
    if (document.hidden) ctx.suspend();
    else if (ctx.state === 'suspended') ctx.resume();
  } catch (e) { /* audio context unavailable */ }
});
