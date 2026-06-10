// hud.js — in-world interface: compass strip, procedural minimap (painted
// from the same height field as the terrain), quest log with "guide me"
// beacons, the interact prompt, XP readout and settings buttons.
import * as Progress from '../learn/progress.js';

const TAU = Math.PI * 2;
const wrapA = a => ((a + Math.PI * 3) % TAU) - Math.PI;
const bearingOf = (dx, dz) => Math.atan2(dx, -dz); // 0 = north (-z), clockwise

export function buildHUD({ def, stations, isMobile, onInteract, onHelp, onSound, onQuality }) {
  const hud = document.getElementById('hud');
  hud.innerHTML = `
    <div class="hud-top">
      <div class="hud-left ui-block">
        <a class="hud-btn" href="./" title="Back to the hub">⌂ HUB</a>
        <span id="hud-world" class="hud-world">${def.title}</span>
      </div>
      <canvas id="compass" class="compass"></canvas>
      <div class="hud-right ui-block">
        <span class="hud-xp" title="Experience points">★ <b id="hud-xp">0</b></span>
        <button id="btn-log" class="hud-btn" title="Quest log (Q)">LOG</button>
        <button id="btn-map" class="hud-btn" title="Map (M)">MAP</button>
        <button id="btn-snd" class="hud-btn" title="Sound on/off">SND</button>
        <button id="btn-hq" class="hud-btn" title="High quality (shadows)">HQ</button>
        <button id="btn-help" class="hud-btn" title="Help">?</button>
      </div>
    </div>
    <canvas id="minimap" class="minimap"></canvas>
    <button id="prompt" class="prompt ui-block" style="display:none"></button>
    <div id="questlog" class="questlog ui-block" style="display:none"></div>
    <div id="crosshair" class="crosshair"></div>
  `;

  // ---------- compass ----------
  const compass = hud.querySelector('#compass');
  const cw = isMobile ? 280 : 460, chh = 40;
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  compass.width = cw * dpr; compass.height = chh * dpr;
  compass.style.width = cw + 'px'; compass.style.height = chh + 'px';
  const cctx = compass.getContext('2d');
  const FOV = (isMobile ? 60 : 70) * Math.PI / 180;

  function drawCompass(camYaw, playerPos, beaconTarget) {
    cctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    cctx.clearRect(0, 0, cw, chh);
    cctx.fillStyle = 'rgba(8,12,22,0.55)';
    roundRect(cctx, 0, 6, cw, 26, 13); cctx.fill();

    const facing = -camYaw;
    cctx.textAlign = 'center'; cctx.textBaseline = 'middle';
    for (let d = 0; d < 360; d += 15) {
      const b = d * Math.PI / 180;
      const rel = wrapA(b - facing);
      if (Math.abs(rel) > FOV) continue;
      const x = cw / 2 + (rel / FOV) * (cw / 2 - 14);
      const main = d % 90 === 0;
      cctx.fillStyle = main ? '#e8eefc' : 'rgba(200,212,240,0.4)';
      if (main) {
        cctx.font = '700 13px system-ui';
        cctx.fillText(['N', 'E', 'S', 'W'][d / 90], x, 19);
      } else {
        cctx.fillRect(x - 0.5, 14, 1, 10);
      }
    }
    // station markers
    for (const st of stations.list) {
      const rel = wrapA(bearingOf(st.pos.x - playerPos.x, st.pos.z - playerPos.z) - facing);
      if (Math.abs(rel) > FOV) continue;
      const x = cw / 2 + (rel / FOV) * (cw / 2 - 14);
      cctx.fillStyle = '#' + st.color.toString(16).padStart(6, '0');
      cctx.beginPath(); cctx.arc(x, 30, st === beaconTarget ? 4.5 : 3, 0, TAU); cctx.fill();
      if (st === beaconTarget) {
        cctx.strokeStyle = '#ffe9b0'; cctx.lineWidth = 1.5;
        cctx.beginPath(); cctx.arc(x, 30, 6.5, 0, TAU); cctx.stroke();
      }
    }
  }

  // ---------- minimap ----------
  const minimap = hud.querySelector('#minimap');
  const msize = isMobile ? 124 : 160;
  minimap.width = msize * dpr; minimap.height = msize * dpr;
  minimap.style.width = msize + 'px'; minimap.style.height = msize + 'px';
  const mctx = minimap.getContext('2d');
  let mapBase = null; // offscreen painted terrain
  let mapVisible = !isMobile;
  minimap.style.display = mapVisible ? 'block' : 'none';

  // paint the terrain map once, in slices (keeps boot snappy)
  function paintMinimap(field) {
    const res = 200;
    const off = document.createElement('canvas');
    off.width = off.height = res;
    const octx = off.getContext('2d');
    const img = octx.createImageData(res, res);
    const hgt = new Float32Array(res * res);
    const col = [0, 0, 0];
    const sea = def.sea;
    const deep = hexRGB(def.water.deep), shal = hexRGB(def.water.shallow);

    let row = 0;
    function slice() {
      const until = Math.min(res, row + 24);
      for (; row < until; row++) {
        for (let i = 0; i < res; i++) {
          const x = (i / (res - 1) - 0.5) * def.size;
          const z = (row / (res - 1) - 0.5) * def.size;
          hgt[row * res + i] = field.height(x, z);
        }
      }
      if (row < res) { requestAnimationFrame(slice); return; }
      // shade + color
      for (let j = 0; j < res; j++) {
        for (let i = 0; i < res; i++) {
          const h = hgt[j * res + i];
          const x = (i / (res - 1) - 0.5) * def.size;
          const z = (j / (res - 1) - 0.5) * def.size;
          let r, g, b;
          if (h < sea + 0.05) {
            const t = Math.min(1, (sea - h) / 6);
            r = shal[0] + (deep[0] - shal[0]) * t;
            g = shal[1] + (deep[1] - shal[1]) * t;
            b = shal[2] + (deep[2] - shal[2]) * t;
          } else {
            const hl = hgt[j * res + Math.max(0, i - 1)];
            const hu = hgt[Math.max(0, j - 1) * res + i];
            const slope = Math.hypot(h - hl, h - hu) / (def.size / res);
            field.color(x, z, h, slope, col);
            const shade = 1 + ((hl - h) + (hu - h)) * 0.045;
            r = col[0] * 255 * shade; g = col[1] * 255 * shade; b = col[2] * 255 * shade;
          }
          const p = (j * res + i) * 4;
          img.data[p] = r; img.data[p + 1] = g; img.data[p + 2] = b; img.data[p + 3] = 255;
        }
      }
      octx.putImageData(img, 0, 0);
      mapBase = off;
    }
    slice();
  }

  function drawMinimap(playerPos, camYaw, beaconTarget, t) {
    if (!mapVisible) return;
    mctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    mctx.clearRect(0, 0, msize, msize);
    mctx.save();
    mctx.beginPath(); mctx.arc(msize / 2, msize / 2, msize / 2 - 1, 0, TAU); mctx.clip();
    if (mapBase) mctx.drawImage(mapBase, 0, 0, msize, msize);
    else { mctx.fillStyle = '#10182c'; mctx.fillRect(0, 0, msize, msize); }

    const toMap = (x, z) => [(x / def.size + 0.5) * msize, (z / def.size + 0.5) * msize];
    for (const st of stations.list) {
      const [mx, my] = toMap(st.pos.x, st.pos.z);
      mctx.fillStyle = stations.clearedOf(st) ? '#ffd166' : '#' + st.color.toString(16).padStart(6, '0');
      mctx.beginPath(); mctx.arc(mx, my, 3, 0, TAU); mctx.fill();
      mctx.strokeStyle = 'rgba(0,0,0,0.5)'; mctx.lineWidth = 0.8; mctx.stroke();
    }
    if (beaconTarget) {
      const [bx, by] = toMap(beaconTarget.pos.x, beaconTarget.pos.z);
      mctx.strokeStyle = '#ffe9b0'; mctx.lineWidth = 1.6;
      const pr = 5.5 + Math.sin(t * 4) * 1.5;
      mctx.beginPath(); mctx.arc(bx, by, pr, 0, TAU); mctx.stroke();
    }
    // player arrow
    const [px, py] = toMap(playerPos.x, playerPos.z);
    mctx.save();
    mctx.translate(px, py);
    mctx.rotate(-camYaw); // up-arrow rotated by facing bearing on a north-up map
    mctx.fillStyle = '#ffffff';
    mctx.beginPath(); mctx.moveTo(0, -7); mctx.lineTo(4.6, 5); mctx.lineTo(-4.6, 5); mctx.closePath(); mctx.fill();
    mctx.strokeStyle = '#1b2a4a'; mctx.lineWidth = 1.4; mctx.stroke();
    mctx.restore();
    mctx.restore();
    mctx.strokeStyle = 'rgba(220,230,255,0.35)'; mctx.lineWidth = 1.5;
    mctx.beginPath(); mctx.arc(msize / 2, msize / 2, msize / 2 - 1, 0, TAU); mctx.stroke();
  }

  // ---------- quest log ----------
  const logEl = hud.querySelector('#questlog');
  let logVisible = false;

  function refreshLog() {
    const rows = def.order.map(id => {
      const st = stations.list.find(s => s.id === id);
      if (!st) return '';
      let status;
      if (st.type === 'unit') {
        const u = Progress.unit(def.key, st.id);
        const star = Progress.unitCleared(def.key, st.id);
        status = star ? '<span class="ql-star">★ cleared</span>'
          : `${u.learned ? 'studied ✓' : 'not studied'} · best ${u.bestOf ? u.best + '/' + u.bestOf : '—'}`;
      } else {
        status = Progress.stationDone(def.key, st.id) ? '<span class="ql-star">★ done</span>' : 'not yet';
      }
      const here = stations.beaconTarget === st ? ' ql-here' : '';
      return `<button class="ql-row${here}" data-id="${st.id}">
          <span class="ql-dot" style="background:#${st.color.toString(16).padStart(6, '0')}"></span>
          <span class="ql-name">${st.label}</span>
          <span class="ql-status">${status}</span>
        </button>`;
    }).join('');
    logEl.innerHTML = `
      <div class="ql-head"><h3>Quest Log</h3><button class="ql-close" aria-label="Close">✕</button></div>
      <p class="ql-tip">Walk the year in order — or tap a stop to point the beacon there.</p>
      <div class="ql-rows">${rows}</div>`;
    logEl.querySelector('.ql-close').addEventListener('click', toggleLog);
    logEl.querySelectorAll('.ql-row').forEach(b => b.addEventListener('click', () => {
      stations.guideTo(b.dataset.id);
      refreshLog();
    }));
  }

  function toggleLog() {
    logVisible = !logVisible;
    if (logVisible) refreshLog();
    logEl.style.display = logVisible ? 'block' : 'none';
  }
  function toggleMap() {
    mapVisible = !mapVisible;
    minimap.style.display = mapVisible ? 'block' : 'none';
  }

  // ---------- prompt ----------
  const promptEl = hud.querySelector('#prompt');
  let promptFor = null;
  function setPrompt(station) {
    if (station === promptFor) return;
    promptFor = station;
    if (!station) { promptEl.style.display = 'none'; return; }
    const verb = station.type === 'hub' ? 'Return to hub' : 'Open';
    promptEl.innerHTML = isMobile
      ? `<b>TAP</b> ${verb} — ${station.label}`
      : `<b>E</b> ${verb} — ${station.label}`;
    promptEl.style.display = 'block';
  }
  promptEl.addEventListener('click', () => { if (promptFor) onInteract(promptFor); });

  // ---------- buttons + keys ----------
  hud.querySelector('#btn-log').addEventListener('click', toggleLog);
  hud.querySelector('#btn-map').addEventListener('click', toggleMap);
  hud.querySelector('#btn-help').addEventListener('click', onHelp);
  const sndBtn = hud.querySelector('#btn-snd');
  sndBtn.classList.toggle('on', !Progress.getSetting('muted', true));
  sndBtn.addEventListener('click', () => {
    const nowOn = !sndBtn.classList.contains('on');
    sndBtn.classList.toggle('on', nowOn);
    onSound(nowOn);
  });
  const hqBtn = hud.querySelector('#btn-hq');
  hqBtn.classList.toggle('on', Progress.getSetting('quality', 'auto') === 'hq');
  hqBtn.addEventListener('click', () => {
    const nowOn = !hqBtn.classList.contains('on');
    hqBtn.classList.toggle('on', nowOn);
    onQuality(nowOn);
  });

  window.addEventListener('keydown', (e) => {
    if (e.target.tagName === 'TEXTAREA' || e.target.tagName === 'INPUT') return;
    if (e.code === 'KeyQ') toggleLog();
    if (e.code === 'KeyM') toggleMap();
    if (e.code === 'KeyE' && promptFor) onInteract(promptFor);
  });

  // XP readout
  const xpEl = hud.querySelector('#hud-xp');
  Progress.onChange(st => { xpEl.textContent = st.xp; });
  xpEl.textContent = Progress.getState().xp;

  return {
    paintMinimap,
    setPrompt,
    refreshLog,
    update(t, player, beaconTarget, frame) {
      // compass every other frame, minimap at ~10 Hz
      if (frame % 2 === 0) drawCompass(player.camYaw, player.pos, beaconTarget);
      if (frame % 6 === 0) drawMinimap(player.pos, player.camYaw, beaconTarget, t);
    },
  };
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function hexRGB(hex) { return [(hex >> 16) & 255, (hex >> 8) & 255, hex & 255]; }
