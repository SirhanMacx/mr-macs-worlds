// gmap.js — the trade map: full-screen canvas painted from the SAME height
// field as the terrain, with era fog-of-war. Locked regions hide under cloud;
// unlocked cities show names, routes draw as caravan-dotted lines, the active
// quest target glows. Opens with M or the MAP button in the trade bar.
import * as UI from './ui.js';

export function createGameMap({ def, field, cities, paths, getEra, getQuestTarget, getPlayer }) {
  const RES = 460;
  let base = null; // offscreen terrain, painted once (sliced)

  function paintBase() {
    const off = document.createElement('canvas');
    off.width = off.height = RES;
    const octx = off.getContext('2d');
    const img = octx.createImageData(RES, RES);
    const hgt = new Float32Array(RES * RES);
    const col = [0, 0, 0];
    const sea = def.sea;
    let row = 0;
    function slice() {
      const until = Math.min(RES, row + 26);
      for (; row < until; row++) {
        for (let i = 0; i < RES; i++) {
          const x = (i / (RES - 1) - 0.5) * def.size;
          const z = (row / (RES - 1) - 0.5) * def.size;
          hgt[row * RES + i] = field.height(x, z);
        }
      }
      if (row < RES) { requestAnimationFrame(slice); return; }
      for (let j = 0; j < RES; j++) {
        for (let i = 0; i < RES; i++) {
          const h = hgt[j * RES + i];
          const x = (i / (RES - 1) - 0.5) * def.size;
          const z = (j / (RES - 1) - 0.5) * def.size;
          let r, g, b;
          if (h < sea + 0.05) {
            const t = Math.min(1, (sea - h) / 6);
            r = 70 - 25 * t; g = 163 - 73 * t; b = 176 - 62 * t;
          } else {
            const hl = hgt[j * RES + Math.max(0, i - 1)];
            const hu = hgt[Math.max(0, j - 1) * RES + i];
            const slope = Math.hypot(h - hl, h - hu) / (def.size / RES);
            field.color(x, z, h, slope, col);
            const shade = 1 + ((hl - h) + (hu - h)) * 0.045;
            r = col[0] * 255 * shade; g = col[1] * 255 * shade; b = col[2] * 255 * shade;
          }
          const p = (j * RES + i) * 4;
          img.data[p] = r; img.data[p + 1] = g; img.data[p + 2] = b; img.data[p + 3] = 255;
        }
      }
      octx.putImageData(img, 0, 0);
      // parchment tint
      octx.globalCompositeOperation = 'overlay';
      octx.fillStyle = 'rgba(214,186,130,0.18)';
      octx.fillRect(0, 0, RES, RES);
      octx.globalCompositeOperation = 'source-over';
      base = off;
    }
    slice();
  }
  paintBase();

  const toMap = (x, z, S) => [(x / def.size + 0.5) * S, (z / def.size + 0.5) * S];

  function open() {
    UI.push({
      className: 'gui-map',
      html: `
        <div class="map-card">
          <div class="map-head">
            <div><div class="map-title">The Trade Map</div><div class="map-sub" id="map-era"></div></div>
            <button class="dlg-x" data-gui-close>CLOSE</button>
          </div>
          <canvas id="map-canvas"></canvas>
          <div class="map-legend" id="map-legend"></div>
        </div>`,
      onMount(el) {
        const cv = el.querySelector('#map-canvas');
        const wrap = el.querySelector('.map-card');
        const S = Math.min(window.innerWidth - 48, window.innerHeight - 190, 560);
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        cv.width = S * dpr; cv.height = S * dpr;
        cv.style.width = S + 'px'; cv.style.height = S + 'px';
        const x = cv.getContext('2d');
        x.setTransform(dpr, 0, 0, dpr, 0, 0);
        draw(x, S, el);
      },
    });
  }

  function draw(x, S, el) {
    const era = getEra();
    x.fillStyle = '#0c1020';
    x.fillRect(0, 0, S, S);
    if (base) x.drawImage(base, 0, 0, S, S);

    // routes between unlocked cities (subtle dotted)
    x.save();
    x.setLineDash([4, 5]);
    x.lineWidth = 1.6;
    x.strokeStyle = 'rgba(60,40,20,0.55)';
    for (const p of paths) {
      x.beginPath();
      p.forEach(([px, pz], i) => {
        const [mx, my] = toMap(px, pz, S);
        i ? x.lineTo(mx, my) : x.moveTo(mx, my);
      });
      x.stroke();
    }
    x.restore();

    // fog over locked-era city regions
    for (const c of cities) {
      if (c.era <= era) continue;
      const [mx, my] = toMap(c.x, c.z, S);
      const R = S * 0.16;
      const g = x.createRadialGradient(mx, my, R * 0.15, mx, my, R);
      g.addColorStop(0, 'rgba(52,60,86,0.88)');
      g.addColorStop(0.7, 'rgba(52,60,86,0.72)');
      g.addColorStop(1, 'rgba(52,60,86,0)');
      x.fillStyle = g;
      x.beginPath(); x.arc(mx, my, R, 0, Math.PI * 2); x.fill();
      x.fillStyle = 'rgba(200,210,240,0.5)';
      x.font = `700 ${Math.round(S * 0.05)}px Georgia, serif`;
      x.textAlign = 'center';
      x.fillText('?', mx, my + S * 0.018);
    }

    // unlocked cities
    const target = getQuestTarget();
    for (const c of cities) {
      if (c.era > era) continue;
      const [mx, my] = toMap(c.x, c.z, S);
      x.fillStyle = '#' + c.color.toString(16).padStart(6, '0');
      x.strokeStyle = 'rgba(20,14,8,0.8)';
      x.lineWidth = 1.4;
      x.beginPath(); x.arc(mx, my, 5.5, 0, Math.PI * 2); x.fill(); x.stroke();
      if (target === c.id) {
        x.strokeStyle = '#ffe9b0'; x.lineWidth = 2.2;
        x.beginPath(); x.arc(mx, my, 10, 0, Math.PI * 2); x.stroke();
      }
      x.fillStyle = '#1c1206';
      x.font = `700 ${Math.round(S * 0.027)}px system-ui`;
      x.textAlign = 'center';
      x.strokeStyle = 'rgba(255,244,214,0.85)'; x.lineWidth = 3;
      x.strokeText(c.name, mx, my - 10);
      x.fillText(c.name, mx, my - 10);
    }

    // player arrow
    const pl = getPlayer();
    const [px, py] = toMap(pl.x, pl.z, S);
    x.save();
    x.translate(px, py);
    x.rotate(-pl.yaw);
    x.fillStyle = '#ffffff';
    x.beginPath(); x.moveTo(0, -9); x.lineTo(6, 7); x.lineTo(-6, 7); x.closePath(); x.fill();
    x.strokeStyle = '#1b2a4a'; x.lineWidth = 1.6; x.stroke();
    x.restore();

    const eraEl = el.querySelector('#map-era');
    if (eraEl) eraEl.textContent = `Era ${era} of 4 — fog hides the roads your license does not yet cover`;
    const leg = el.querySelector('#map-legend');
    if (leg) {
      leg.innerHTML = cities.filter(c => c.era <= era)
        .map(c => `<span class="map-chip"><i style="background:#${c.color.toString(16).padStart(6, '0')}"></i>${UI.esc(c.name)}</span>`).join('') +
        `<span class="map-chip locked">? — unexplored era</span>`;
    }
  }

  return { open };
}
