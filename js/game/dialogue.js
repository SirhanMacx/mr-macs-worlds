// dialogue.js — branching NPC conversation overlay. Portrait is drawn from
// the NPC's palette (procedural, zero assets), text types on, choices carry
// effects. Honest pedagogy rule: real figures speak paraphrase grounded in
// the record — the UI shows "speaks through an interpreter" flavor instead of
// fake direct quotes when a world flags it.
import * as UI from './ui.js';
import * as Sfx from './sfx.js';

const esc = UI.esc;

export function openDialogue(npc, tree, ctx) {
  let nodeId = typeof tree.start === 'function' ? tree.start(ctx) : (tree.start || 'root');
  let typeTimer = null;
  npc.talking = true;

  const layer = UI.push({
    className: 'gui-dialogue',
    html: '<div class="dlg-card"></div>',
    dismissible: true,
    onClose() { npc.talking = false; clearInterval(typeTimer); },
    onMount(el, { close }) {
      ctx.close = close;
      render(el.querySelector('.dlg-card'), close);
    },
  });

  function render(card, close) {
    const node = tree.nodes[nodeId];
    if (!node) { close(); return; }
    const text = typeof node.text === 'function' ? node.text(ctx) : node.text;
    const choices = (node.choices || []).filter(c => !c.when || c.when(ctx));

    card.innerHTML = `
      <div class="dlg-head">
        <canvas class="dlg-portrait" width="92" height="92"></canvas>
        <div class="dlg-who">
          <div class="dlg-name">${esc(npc.name)}</div>
          ${npc.title ? `<div class="dlg-title">${esc(npc.title)}</div>` : ''}
        </div>
        <button class="dlg-x" data-gui-close aria-label="Leave conversation">LEAVE</button>
      </div>
      <div class="dlg-text"></div>
      <div class="dlg-choices"></div>`;

    drawPortrait(card.querySelector('.dlg-portrait'), npc.palette || {});

    // typewriter
    const textEl = card.querySelector('.dlg-text');
    const chEl = card.querySelector('.dlg-choices');
    let i = 0;
    clearInterval(typeTimer);
    const full = text;
    typeTimer = setInterval(() => {
      i += 3;
      textEl.textContent = full.slice(0, i);
      if (i >= full.length) {
        clearInterval(typeTimer);
        showChoices();
      }
    }, 14);
    textEl.addEventListener('click', () => { // tap to skip typing
      clearInterval(typeTimer);
      textEl.textContent = full;
      showChoices();
    });

    function showChoices() {
      if (chEl.childElementCount) return;
      if (!choices.length) {
        const b = document.createElement('button');
        b.className = 'dlg-choice';
        b.textContent = 'Farewell.';
        b.addEventListener('click', () => { Sfx.click(); close(); });
        chEl.appendChild(b);
        return;
      }
      for (const c of choices) {
        const b = document.createElement('button');
        b.className = 'dlg-choice' + (c.kind ? ' ' + c.kind : '');
        b.textContent = typeof c.label === 'function' ? c.label(ctx) : c.label;
        b.addEventListener('click', () => {
          Sfx.click();
          let next = c.next;
          if (c.effect) {
            const r = c.effect(ctx);
            if (typeof r === 'string') next = r; // effect may redirect
          }
          if (next === '@close' || (!next && !c.effect)) { close(); return; }
          if (!next) { close(); return; }
          nodeId = next;
          render(card, close);
        });
        chEl.appendChild(b);
      }
    }
  }
}

// tiny procedural face: skin circle, robe shoulders, hat band, eyes
function drawPortrait(canvas, p) {
  const x = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;
  const hex = n => '#' + (n ?? 0x7a6a4f).toString(16).padStart(6, '0');
  x.fillStyle = 'rgba(12,16,28,0.9)';
  x.fillRect(0, 0, W, H);
  // shoulders / robe
  x.fillStyle = hex(p.robe);
  x.beginPath(); x.ellipse(W / 2, H * 0.95, W * 0.42, H * 0.3, 0, Math.PI, 0); x.fill();
  // head
  x.fillStyle = hex(p.skin ?? 0xd9a066);
  x.beginPath(); x.arc(W / 2, H * 0.46, W * 0.24, 0, Math.PI * 2); x.fill();
  // hat / headwrap
  x.fillStyle = hex(p.hat ?? p.trim ?? 0x4a3b28);
  x.beginPath(); x.ellipse(W / 2, H * 0.3, W * 0.26, H * 0.13, 0, Math.PI, 0, true); x.fill();
  // eyes
  x.fillStyle = '#1c1410';
  x.beginPath(); x.arc(W * 0.43, H * 0.47, 2.4, 0, Math.PI * 2); x.fill();
  x.beginPath(); x.arc(W * 0.57, H * 0.47, 2.4, 0, Math.PI * 2); x.fill();
  // frame
  x.strokeStyle = 'rgba(255,210,130,0.5)';
  x.lineWidth = 2;
  x.strokeRect(1, 1, W - 2, H - 2);
}
