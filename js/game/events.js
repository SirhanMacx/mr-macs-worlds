// events.js — travel events. Zones sit on real routes; crossing one with
// cargo triggers an encounter card: a REAL geographic/historical situation,
// 2-3 choices, in-game consequences (cargo, shekels, time, XP) — applied
// knowledge with stakes, never a pop quiz. Every outcome explains the
// history in one line so the lesson lands either way.
import * as UI from './ui.js';
import * as Sfx from './sfx.js';

const esc = UI.esc;

export function createTravelEvents({ zones, events, state, save, getEra, hasCargo, onOutcome }) {
  const byId = {};
  events.forEach(e => { byId[e.id] = e; });

  let globalCooldown = 0;
  let activeCard = false;

  function update(dt, px, pz) {
    if (activeCard) return;
    if (globalCooldown > 0) { globalCooldown -= dt; return; }
    for (const z of zones) {
      if (z.cool > 0) { z.cool -= dt; continue; }
      const dx = px - z.x, dz = pz - z.z;
      if (dx * dx + dz * dz > z.r * z.r) { z.inside = false; continue; }
      if (z.inside) continue; // fire on entry only
      z.inside = true;
      const pool = z.events
        .map(id => byId[id])
        .filter(e => e && e.minEra <= getEra() && (!e.needCargo || hasCargo()) && !(e.once && state.flags['ev:' + e.id]));
      if (!pool.length) continue;
      // rotate: avoid repeating the zone's last event
      let pick = pool[Math.floor(Math.random() * pool.length)];
      if (pool.length > 1 && state.flags['evlast:' + z.id] === pick.id) {
        pick = pool[(pool.indexOf(pick) + 1) % pool.length];
      }
      state.flags['evlast:' + z.id] = pick.id;
      if (pick.once) state.flags['ev:' + pick.id] = true;
      z.cool = 240; // this stretch of road stays quiet for a while
      globalCooldown = 50;
      save();
      present(pick, z);
      return;
    }
  }

  function present(ev, zone) {
    activeCard = true;
    UI.push({
      className: 'gui-event',
      html: '<div class="evt-card"></div>',
      dismissible: false,
      silent: true,
      onClose() { activeCard = false; },
      onMount(el, { close }) {
        const card = el.querySelector('.evt-card');
        card.innerHTML = `
          <div class="evt-kicker">ON THE ROAD — ${esc(zone.name)}</div>
          <h3 class="evt-title">${esc(ev.title)}</h3>
          <p class="evt-body">${esc(ev.text)}</p>
          <div class="evt-choices"></div>`;
        Sfx.open();
        const ch = card.querySelector('.evt-choices');
        ev.choices.forEach(c => {
          const b = document.createElement('button');
          b.className = 'evt-choice';
          b.innerHTML = `<b>${esc(c.label)}</b>${c.hint ? `<span>${esc(c.hint)}</span>` : ''}`;
          b.addEventListener('click', () => {
            const out = c.outcome;
            card.innerHTML = `
              <div class="evt-kicker ${out.good ? 'good' : 'bad'}">${out.good ? 'GOOD CALL' : 'IT COSTS YOU'}</div>
              <p class="evt-body">${esc(out.text)}</p>
              <p class="evt-why">${esc(out.why)}</p>
              <div class="evt-choices"><button class="evt-choice evt-go">Continue the journey</button></div>`;
            out.good ? Sfx.good() : Sfx.bad();
            onOutcome && onOutcome(ev, c, out);
            card.querySelector('.evt-go').addEventListener('click', () => { Sfx.click(); close(); });
          });
          ch.appendChild(b);
        });
      },
    });
  }

  return { update, get active() { return activeCard; } };
}
