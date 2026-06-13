// cutscene.js — the styled-beat player. NOT video: a sequence of framed text
// beats over a tinted vignette with a small procedural emblem (candle, ledger,
// door-notice, a character's face) — the 80 Days / graphic-novel idiom, built
// entirely on the existing UI overlay + WebAudio. Skippable, replayable, paused
// engine underneath. This is what gives a world a COLD OPEN instead of a menu.
//
// beat = {
//   kicker:  small all-caps label above the text (optional)
//   text:    the line that types on
//   tint:    'amber' | 'dusk' | 'cold' | 'stone'  (vignette mood)
//   art:     'candle' | 'ledger' | 'notice' | 'portrait' | null
//   palette: {robe,trim,skin,hat}   (only for art:'portrait')
//   cta:     button label (defaults: 'Continue', last beat 'Begin')
// }
import * as UI from './ui.js';
import * as Sfx from './sfx.js';

const TINTS = {
  amber: 'radial-gradient(120% 90% at 50% 38%, #3a2410 0%, #1a1208 55%, #0a0805 100%)',
  dusk:  'radial-gradient(120% 90% at 50% 40%, #2a2b44 0%, #14161f 60%, #080a10 100%)',
  cold:  'radial-gradient(120% 90% at 50% 40%, #16263a 0%, #0e1622 60%, #060a10 100%)',
  stone: 'radial-gradient(120% 90% at 50% 42%, #2c2a24 0%, #17150f 60%, #0a0907 100%)',
};

// Play a sequence of beats. Returns a Promise that resolves when the player
// reaches the end OR hits Skip. Pushes exactly one overlay (clean pause/resume).
export function playCutscene(beats, { pad = true } = {}) {
  return new Promise((resolve) => {
    let i = 0;
    let typeTimer = null;
    let stopPad = null;
    if (pad) { try { stopPad = Sfx.cinePad(); } catch (e) { /* audio unavailable */ } }

    const layer = UI.push({
      className: 'gui-cutscene',
      html: `<div class="cs-stage">
        <div class="cs-glow"></div>
        <canvas class="cs-art" width="200" height="200"></canvas>
        <div class="cs-kicker"></div>
        <div class="cs-text"></div>
        <div class="cs-row">
          <button class="cs-cta" type="button"></button>
        </div>
        <button class="cs-skip" type="button">Skip</button>
      </div>`,
      dismissible: false,
      silent: true,
      onClose() { clearInterval(typeTimer); if (stopPad) stopPad(); },
      onMount(el, { close }) {
        const stage = el.querySelector('.cs-stage');
        const skip = el.querySelector('.cs-skip');
        skip.addEventListener('click', () => { Sfx.click(); finish(close); });
        renderBeat(el, close);
      },
    });

    function finish(close) { close(); resolve(); }

    function renderBeat(el, close) {
      const b = beats[i];
      const stage = el.querySelector('.cs-stage');
      const kickEl = el.querySelector('.cs-kicker');
      const textEl = el.querySelector('.cs-text');
      const ctaEl = el.querySelector('.cs-cta');
      const art = el.querySelector('.cs-art');

      stage.style.background = TINTS[b.tint] || TINTS.amber;
      kickEl.textContent = b.kicker || '';
      kickEl.style.display = b.kicker ? 'block' : 'none';
      drawEmblem(art, b.art, b.palette || {});
      art.style.display = b.art ? 'block' : 'none';

      ctaEl.style.visibility = 'hidden';
      ctaEl.textContent = b.cta || (i === beats.length - 1 ? 'Begin' : 'Continue');

      // typewriter (same feel as dialogue)
      const full = b.text || '';
      let n = 0;
      clearInterval(typeTimer);
      textEl.textContent = '';
      typeTimer = setInterval(() => {
        n += 2;
        textEl.textContent = full.slice(0, n);
        if (n >= full.length) { clearInterval(typeTimer); ctaEl.style.visibility = 'visible'; }
      }, 18);

      const reveal = () => { clearInterval(typeTimer); textEl.textContent = full; ctaEl.style.visibility = 'visible'; };
      textEl.onclick = reveal;

      ctaEl.onclick = () => {
        Sfx.click();
        i += 1;
        if (i >= beats.length) { finish(close); return; }
        // small crossfade between beats
        stage.classList.remove('cs-shift'); void stage.offsetWidth; stage.classList.add('cs-shift');
        renderBeat(el, close);
      };
    }
  });
}

// ---------- procedural emblems (zero assets) ----------
function drawEmblem(canvas, kind, palette) {
  const x = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;
  x.clearRect(0, 0, W, H);
  if (!kind) return;
  if (kind === 'candle') return candle(x, W, H);
  if (kind === 'ledger') return ledger(x, W, H);
  if (kind === 'notice') return notice(x, W, H);
  if (kind === 'portrait') return portrait(x, W, H, palette);
}

function candle(x, W, H) {
  // halo
  const g = x.createRadialGradient(W / 2, H * 0.34, 4, W / 2, H * 0.34, 90);
  g.addColorStop(0, 'rgba(255,196,110,0.55)'); g.addColorStop(1, 'rgba(255,180,90,0)');
  x.fillStyle = g; x.fillRect(0, 0, W, H);
  // candle body
  x.fillStyle = '#e7d8b4'; x.fillRect(W / 2 - 12, H * 0.45, 24, H * 0.42);
  x.fillStyle = 'rgba(0,0,0,0.18)'; x.fillRect(W / 2 + 4, H * 0.45, 8, H * 0.42);
  // flame
  x.fillStyle = '#ffd27a';
  x.beginPath(); x.moveTo(W / 2, H * 0.30); x.quadraticCurveTo(W / 2 + 12, H * 0.40, W / 2, H * 0.47);
  x.quadraticCurveTo(W / 2 - 12, H * 0.40, W / 2, H * 0.30); x.fill();
  x.fillStyle = '#fff3d0';
  x.beginPath(); x.ellipse(W / 2, H * 0.41, 4, 8, 0, 0, Math.PI * 2); x.fill();
}

function ledger(x, W, H) {
  x.save(); x.translate(W / 2, H / 2);
  // open book — two leaves
  x.fillStyle = '#d9c9a3';
  x.beginPath(); x.moveTo(-72, -44); x.lineTo(-4, -52); x.lineTo(-4, 50); x.lineTo(-72, 44); x.closePath(); x.fill();
  x.beginPath(); x.moveTo(72, -44); x.lineTo(4, -52); x.lineTo(4, 50); x.lineTo(72, 44); x.closePath(); x.fill();
  // spine
  x.fillStyle = '#6e5530'; x.fillRect(-5, -52, 10, 104);
  // ruled lines (an unfinished page — last lines blank)
  x.strokeStyle = 'rgba(60,42,22,0.55)'; x.lineWidth = 1.4;
  for (let r = 0; r < 6; r++) {
    const yy = -34 + r * 13;
    x.beginPath(); x.moveTo(-66, yy); x.lineTo(r < 4 ? -14 : -40, yy); x.stroke();
    x.beginPath(); x.moveTo(12, yy); x.lineTo(r < 3 ? 64 : 34, yy); x.stroke();
  }
  x.restore();
}

function notice(x, W, H) {
  x.save(); x.translate(W / 2, H / 2); x.rotate(-0.05);
  // nail
  x.fillStyle = '#3a2a16'; x.beginPath(); x.arc(0, -66, 5, 0, Math.PI * 2); x.fill();
  // parchment
  x.fillStyle = '#cdbb92'; x.fillRect(-58, -60, 116, 120);
  x.strokeStyle = 'rgba(40,28,14,0.4)'; x.lineWidth = 2; x.strokeRect(-58, -60, 116, 120);
  // a seal
  x.fillStyle = '#7a2230'; x.beginPath(); x.arc(0, 44, 13, 0, Math.PI * 2); x.fill();
  // text lines
  x.strokeStyle = 'rgba(40,28,14,0.5)'; x.lineWidth = 2.2;
  for (let r = 0; r < 5; r++) { const yy = -40 + r * 15; x.beginPath(); x.moveTo(-44, yy); x.lineTo(44 - (r % 2) * 16, yy); x.stroke(); }
  x.restore();
}

function portrait(x, W, H, p) {
  const hex = n => '#' + (n ?? 0x7a6a4f).toString(16).padStart(6, '0');
  const g = x.createRadialGradient(W / 2, H * 0.42, 8, W / 2, H * 0.42, 110);
  g.addColorStop(0, 'rgba(255,210,150,0.18)'); g.addColorStop(1, 'rgba(255,210,150,0)');
  x.fillStyle = g; x.fillRect(0, 0, W, H);
  // shoulders
  x.fillStyle = hex(p.robe); x.beginPath(); x.ellipse(W / 2, H * 1.02, W * 0.42, H * 0.34, 0, Math.PI, 0); x.fill();
  // head
  x.fillStyle = hex(p.skin ?? 0xd9a066); x.beginPath(); x.arc(W / 2, H * 0.45, W * 0.22, 0, Math.PI * 2); x.fill();
  // brimmed hat (caravan-master read)
  x.fillStyle = hex(p.hat ?? p.trim ?? 0x4a3b28);
  x.beginPath(); x.ellipse(W / 2, H * 0.30, W * 0.34, H * 0.07, 0, 0, Math.PI * 2); x.fill();
  x.beginPath(); x.ellipse(W / 2, H * 0.255, W * 0.17, H * 0.10, 0, 0, Math.PI * 2); x.fill();
  // eyes
  x.fillStyle = '#1c1410';
  x.beginPath(); x.arc(W * 0.44, H * 0.46, 3, 0, Math.PI * 2); x.fill();
  x.beginPath(); x.arc(W * 0.56, H * 0.46, 3, 0, Math.PI * 2); x.fill();
}
