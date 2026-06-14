// retrieval-beat.js — the in-character "remember when…" moment.
//
// When a Codex card comes due (retrieval.js), the world surfaces it NOT as a
// quiz but as a memory. A familiar figure — Trade Winds' returning trader, Mind
// Atlas' Atlas, Word Harbor's Mira — turns to the player and re-poses the very
// idea the player once understood, in the player's own voice, and asks them to
// affirm it. There is no score, no "Question N", no red X. Affirming keeps the
// idea warm (grade true). Asking to be reminded is honored, not punished: the
// mentor re-teaches the SAME idea (never a new one), and the player affirms it
// freshly (grade false → the card drops to box 1 and returns tomorrow).
//
// PURELY ADDITIVE. Reads the Codex entry by id (entry.idea is the re-teach
// text — never invented here), pushes a UI layer styled to match the world's
// dialogue look via a scoped injected <style> (the injectStyleOnce idiom; does
// NOT touch css/game.css), and grades through retrieval.grade.
//
//   openRetrievalBeat(card, worldAdapter)
//
//   card        a pickOne() result: { id, card, entry, grade(ok) }
//               - id     the codex id
//               - entry  the Codex entry { id, group, title, idea, source }
//               - grade(ok)  bound grader (preferred); falls back to card.card
//                            + a passed retrieval if present. Either way the
//                            schedule is updated through retrieval.js.
//
//   worldAdapter = {
//     intro,       // "The trader you sold to last season catches your eye…"
//     mentorName,  // who is speaking ("A returning trader", "Atlas", "Mira")
//     mentorTitle, // optional subtitle under the name
//     affirmFx,    // () => world's quiet 'kept it warm' feedback (sfx/particle)
//     missFx,      // () => world's gentle 'let's revisit' feedback
//     palette,     // {skin,robe,hat,trim} for the procedural portrait
//   }

import * as UI from './ui.js';

const STYLE_ID = 'mmw-retrieval-beat-style';
const esc = UI.esc;

// Resolve the grader from whatever the caller handed us. The clean path is a
// bound `card.grade(ok)`; we also accept an explicit retrieval instance on the
// adapter so a world can wire it either way without retrieval-beat caring.
function resolveGrade(card, adapter) {
  if (card && typeof card.grade === 'function') return card.grade;
  const ret = adapter && adapter.retrieval;
  const id = card && card.id;
  if (ret && typeof ret.grade === 'function' && id) {
    return (ok) => ret.grade(id, ok);
  }
  return () => {}; // never break a beat over a missing grader
}

export function openRetrievalBeat(card, worldAdapter = {}) {
  injectStyleOnce();

  const entry = (card && card.entry) || {};
  const idea = entry.idea || '';
  // Nothing to re-pose without an idea — surfacing this would be an empty beat.
  if (!idea) return null;

  const grade = resolveGrade(card, worldAdapter);
  const a = worldAdapter || {};
  const mentor = a.mentorName || 'A familiar face';
  const title = a.mentorTitle || (entry.source ? `who remembers ${entry.source}` : '');
  const intro = a.intro || 'Someone you once spoke with catches your eye, and a memory comes back to you.';
  const palette = a.palette || {};

  // The affirmation is the player's OWN idea, given back to them to say. The
  // re-teach is the SAME idea, spoken by the mentor — never a fresh fact.
  const affirmSay = `Yes — ${idea}`;
  const reteachLine = idea;

  let resolved = false;

  const layer = UI.push({
    className: 'gui-retrieval gui-dialogue',
    html: '<div class="rb-card"></div>',
    dismissible: true,
    onMount(el, { close }) {
      renderRecall(el.querySelector('.rb-card'), close);
    },
  });

  // --- step 1: the memory returns; the player chooses to affirm or be reminded.
  function renderRecall(cardEl, close) {
    cardEl.innerHTML = `
      <div class="rb-head">
        <canvas class="rb-portrait" width="84" height="84"></canvas>
        <div class="rb-who">
          <div class="rb-name">${esc(mentor)}</div>
          ${title ? `<div class="rb-title">${esc(title)}</div>` : ''}
        </div>
      </div>
      <div class="rb-flag">A memory returns</div>
      <p class="rb-intro">${esc(intro)}</p>
      ${entry.title ? `<p class="rb-prompt">Back then, you worked out something about <b>${esc(entry.title)}</b>. Does it still hold?</p>`
                    : `<p class="rb-prompt">Back then, you worked something out. Does it still hold?</p>`}
      <div class="rb-choices"></div>`;

    drawPortrait(cardEl.querySelector('.rb-portrait'), palette);

    const choices = cardEl.querySelector('.rb-choices');

    const yes = document.createElement('button');
    yes.className = 'rb-choice say';
    yes.textContent = affirmSay;
    yes.addEventListener('click', () => {
      if (resolved) return;
      resolved = true;
      try { grade(true); } catch (e) { /* schedule write is best-effort */ }
      try { if (a.affirmFx) a.affirmFx(); } catch (e) {}
      try { UI.floatText('Still understood', 'xp'); } catch (e) {}
      renderKept(cardEl, close);
    });

    const remind = document.createElement('button');
    remind.className = 'rb-choice ask';
    remind.textContent = 'Honestly… remind me.';
    remind.addEventListener('click', () => {
      if (resolved) return;
      resolved = true;
      try { grade(false); } catch (e) { /* best-effort */ }
      try { if (a.missFx) a.missFx(); } catch (e) {}
      renderReteach(cardEl, close);
    });

    choices.appendChild(yes);
    choices.appendChild(remind);
  }

  // --- affirm path: a quiet acknowledgement, then the player moves on.
  function renderKept(cardEl, close) {
    cardEl.innerHTML = `
      <div class="rb-head">
        <canvas class="rb-portrait" width="84" height="84"></canvas>
        <div class="rb-who">
          <div class="rb-name">${esc(mentor)}</div>
          ${title ? `<div class="rb-title">${esc(title)}</div>` : ''}
        </div>
      </div>
      <p class="rb-said">&ldquo;${esc(affirmSay)}&rdquo;</p>
      <p class="rb-note">You still carry it. Good.</p>
      <div class="rb-choices"></div>`;
    drawPortrait(cardEl.querySelector('.rb-portrait'), palette);
    addContinue(cardEl.querySelector('.rb-choices'), close, 'Carry on');
  }

  // --- remind path: the mentor RE-TEACHES the same idea, then the player
  // affirms it freshly — closing the loop without ever scoring or quizzing.
  function renderReteach(cardEl, close) {
    cardEl.innerHTML = `
      <div class="rb-head">
        <canvas class="rb-portrait" width="84" height="84"></canvas>
        <div class="rb-who">
          <div class="rb-name">${esc(mentor)}</div>
          ${title ? `<div class="rb-title">${esc(title)}</div>` : ''}
        </div>
      </div>
      <div class="rb-flag">Let me walk you back through it</div>
      <p class="rb-reteach">${esc(reteachLine)}</p>
      ${entry.source ? `<p class="rb-source">— as ${esc(entry.source)} showed you</p>` : ''}
      <div class="rb-choices"></div>`;
    drawPortrait(cardEl.querySelector('.rb-portrait'), palette);

    const choices = cardEl.querySelector('.rb-choices');
    const ok = document.createElement('button');
    ok.className = 'rb-choice say';
    ok.textContent = 'Right — I have it again.';
    ok.addEventListener('click', () => {
      try { UI.floatText('Back in mind', 'xp'); } catch (e) {}
      close();
    });
    choices.appendChild(ok);
  }

  function addContinue(choices, close, label) {
    const b = document.createElement('button');
    b.className = 'rb-choice';
    b.textContent = label || 'Continue';
    b.addEventListener('click', () => close());
    choices.appendChild(b);
  }

  return layer;
}

// Tiny procedural face, matching dialogue.js so the mentor reads as a person of
// this world. Zero assets; palette-driven.
function drawPortrait(canvas, p) {
  if (!canvas || !canvas.getContext) return;
  const x = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;
  const hex = n => '#' + (n ?? 0x7a6a4f).toString(16).padStart(6, '0');
  x.fillStyle = 'rgba(12,16,28,0.9)';
  x.fillRect(0, 0, W, H);
  x.fillStyle = hex(p.robe);
  x.beginPath(); x.ellipse(W / 2, H * 0.95, W * 0.42, H * 0.3, 0, Math.PI, 0); x.fill();
  x.fillStyle = hex(p.skin ?? 0xd9a066);
  x.beginPath(); x.arc(W / 2, H * 0.46, W * 0.24, 0, Math.PI * 2); x.fill();
  x.fillStyle = hex(p.hat ?? p.trim ?? 0x4a3b28);
  x.beginPath(); x.ellipse(W / 2, H * 0.3, W * 0.26, H * 0.13, 0, Math.PI, 0, true); x.fill();
  x.fillStyle = '#1c1410';
  x.beginPath(); x.arc(W * 0.43, H * 0.47, 2.4, 0, Math.PI * 2); x.fill();
  x.beginPath(); x.arc(W * 0.57, H * 0.47, 2.4, 0, Math.PI * 2); x.fill();
  x.strokeStyle = 'rgba(255,210,130,0.5)';
  x.lineWidth = 2;
  x.strokeRect(1, 1, W - 2, H - 2);
}

// ---------- scoped CSS, injected once (does NOT touch css/game.css) ----------
// Matches the dark/amber dialogue look: parchment card, amber accents, the same
// portrait frame, soft-blue idea text — but reads as a warm recollection, never
// an exam panel.
function injectStyleOnce() {
  if (typeof document === 'undefined') return;
  if (document.getElementById(STYLE_ID)) return;
  const s = document.createElement('style');
  s.id = STYLE_ID;
  s.textContent = `
.gui-retrieval .rb-card {
  background: linear-gradient(180deg, rgba(22,18,12,0.98), rgba(12,10,7,0.98));
  border: 1px solid rgba(255,210,130,0.42); border-radius: 14px;
  box-shadow: 0 18px 60px rgba(0,0,0,0.66);
  color: #ece4d2; width: min(560px, 96vw); max-height: 88vh; overflow: auto; padding: 18px;
}
.gui-retrieval .rb-head { display: flex; align-items: center; gap: 12px; margin-bottom: 6px; }
.gui-retrieval .rb-portrait { border-radius: 10px; flex: 0 0 auto; }
.gui-retrieval .rb-name { font: 800 17px/1.15 Georgia, serif; color: #ffd166; }
.gui-retrieval .rb-title { font: 600 12px/1.3 system-ui, sans-serif; color: #bfae8c; margin-top: 3px; }
.gui-retrieval .rb-flag {
  display: inline-block; font: 800 10px/1 system-ui, sans-serif; letter-spacing: 0.14em;
  text-transform: uppercase; color: #0c0a07; background: #ffd166;
  border-radius: 20px; padding: 4px 9px; margin: 8px 0 4px;
}
.gui-retrieval .rb-intro { font: 500 13.5px/1.6 Georgia, serif; color: #ddd2ba; margin: 8px 0 0; }
.gui-retrieval .rb-prompt { font: 600 14px/1.55 system-ui, sans-serif; color: #f4ecd8; margin: 12px 0 0; }
.gui-retrieval .rb-prompt b { color: #ffd166; }
.gui-retrieval .rb-said {
  font: italic 600 15px/1.55 Georgia, serif; color: #f4ecd8; margin: 12px 0 0;
  border-left: 3px solid rgba(139,233,253,0.55); padding-left: 12px;
}
.gui-retrieval .rb-note { font: 500 13px/1.5 Georgia, serif; color: #bfae8c; margin: 10px 0 0; }
.gui-retrieval .rb-reteach {
  font: 500 14px/1.65 Georgia, serif; color: #ddd2ba; margin: 10px 0 0;
  background: rgba(255,209,102,0.08); border-left: 3px solid #ffd166;
  border-radius: 6px; padding: 11px 13px;
}
.gui-retrieval .rb-source { font: 600 11.5px/1.35 system-ui, sans-serif; color: #8be9fd; margin: 8px 0 0; }
.gui-retrieval .rb-choices { display: flex; flex-direction: column; gap: 9px; margin-top: 16px; }
.gui-retrieval .rb-choice {
  font: 600 13.5px/1.4 system-ui, sans-serif; text-align: left; cursor: pointer;
  color: #ece4d2; background: rgba(255,255,255,0.05);
  border: 1px solid rgba(255,255,255,0.12); border-radius: 9px; padding: 12px 14px;
  transition: background 0.12s ease, border-color 0.12s ease;
}
.gui-retrieval .rb-choice:hover { background: rgba(255,209,102,0.12); border-color: rgba(255,210,130,0.5); }
.gui-retrieval .rb-choice.say { border-left: 3px solid rgba(139,233,253,0.7); }
.gui-retrieval .rb-choice.ask { border-left: 3px solid rgba(255,210,130,0.45); color: #cbbd9c; }
`;
  document.head.appendChild(s);
}

export default { openRetrievalBeat };
