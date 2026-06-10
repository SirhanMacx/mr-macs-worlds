// audio.js — tiny WebAudio chimes (no audio assets). Muted by default;
// the HUD sound toggle persists the choice.
let ctx = null;
let muted = true;

export function setMuted(m) { muted = m; }
export function isMuted() { return muted; }

const PATTERNS = {
  good: [[660, 0, 0.09], [880, 0.09, 0.12]],
  bad: [[330, 0, 0.12], [262, 0.1, 0.16]],
  clear: [[523, 0, 0.1], [659, 0.1, 0.1], [784, 0.2, 0.1], [1047, 0.3, 0.22]],
};

export function chime(type = 'good') {
  if (muted) return;
  try {
    ctx = ctx || new (window.AudioContext || window.webkitAudioContext)();
    if (ctx.state === 'suspended') ctx.resume();
    const t0 = ctx.currentTime;
    for (const [freq, at, dur] of (PATTERNS[type] || PATTERNS.good)) {
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = 'triangle';
      o.frequency.value = freq;
      g.gain.setValueAtTime(0.0001, t0 + at);
      g.gain.exponentialRampToValueAtTime(0.12, t0 + at + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, t0 + at + dur);
      o.connect(g).connect(ctx.destination);
      o.start(t0 + at);
      o.stop(t0 + at + dur + 0.05);
    }
  } catch (e) { /* audio unavailable — fine */ }
}
