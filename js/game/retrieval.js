// retrieval.js — the spaced-recall spine of the Proof-of-Learning system.
//
// The Codex records WHAT a player came to understand. Retrieval keeps that
// understanding ALIVE: it is a tiny Leitner box scheduler riding the per-world
// save, so a keystone the player grasped in September can quietly resurface in
// October as a "remember when…" moment — not a quiz, a memory they affirm.
//
// PURELY ADDITIVE. It never edits codex.js or save.js. It reads the Codex as
// its source of truth (every recorded id deserves a card) and lazily creates
// state.retrieval the first time it runs on a save — pre-spine saves load
// untouched and pick up a fresh, empty schedule without clobbering codex/story.
//
// ---- CONTRACT (every Proof-of-Learning agent codes to this exact shape) ----
//
//   state.retrieval = {
//     v: 1,
//     cards: {
//       <codexId>: { box: 1..5, due: ms, last: ms, seen: int, missed: int }
//     }
//   }
//
//   Leitner intervals by box, in DAYS:  [_, 1, 2, 4, 9, 21]
//     (box 1 index unused/0; a box-1 card is due ~1 day after it was made.)
//   The schedule is computed against the DEVICE CLOCK at game RUNTIME — the
//   running game may read Date.now(); only the offline build/verify script
//   passes an explicit `now` so its result is deterministic.
//
//   New card  -> box 1, scheduled +1 day  (created by ensureCards on first sight)
//   Correct   -> box + 1 (max 5), re-scheduled by the new box's interval
//   Miss      -> box 1, re-scheduled +1 day  (the keystone's own idea is then
//                re-taught by retrieval-beat.js — NEVER a new MCQ/quiz)
//
//   API:  createRetrieval({ state, save, codex }) ->
//           { ensureCards(), due(now?), pickOne(now?), grade(id, ok, now?), cardsFor() }

const DAY = 86400000; // ms in a day
// Box -> days until next due. Index 0 is a placeholder so box N reads naturally.
const INTERVALS = [0, 1, 2, 4, 9, 21];
const MAX_BOX = 5;

export function createRetrieval({ state, save, codex } = {}) {
  // Tolerate a bare/throwaway state or a stale shape — never throw on init.
  const st = state && typeof state === 'object' ? state : {};
  const persist = typeof save === 'function' ? save : () => {};
  const cdx = codex || null;

  // ---- lazy init: pre-spine saves get a fresh, empty schedule in place ----
  // We only attach state.retrieval if it is missing or malformed. We MUST NOT
  // touch state.codex / state.story / any other field — just slot ours beside.
  function ensureStore() {
    const r = st.retrieval;
    if (!r || typeof r !== 'object' || r.v !== 1 || !r.cards || typeof r.cards !== 'object') {
      st.retrieval = { v: 1, cards: {} };
    }
    return st.retrieval;
  }

  // Read "now" from the device clock unless the caller (verify script) pins it.
  function clock(now) {
    return typeof now === 'number' && isFinite(now) ? now : Date.now();
  }

  // Days-from-now for a given box, clamped to a real interval.
  function intervalDays(box) {
    const b = Math.max(1, Math.min(MAX_BOX, box | 0));
    return INTERVALS[b] || INTERVALS[1];
  }

  // Build a fresh box-1 card scheduled one day out from `at`.
  function freshCard(at) {
    return { box: 1, due: at + INTERVALS[1] * DAY, last: at, seen: 0, missed: 0 };
  }

  // Normalize a possibly-stale card object so the rest of the code is safe.
  function normalize(card, at) {
    if (!card || typeof card !== 'object') return freshCard(at);
    const box = Math.max(1, Math.min(MAX_BOX, (card.box | 0) || 1));
    return {
      box,
      due: typeof card.due === 'number' && isFinite(card.due) ? card.due : at + intervalDays(box) * DAY,
      last: typeof card.last === 'number' && isFinite(card.last) ? card.last : at,
      seen: Math.max(0, (card.seen | 0) || 0),
      missed: Math.max(0, (card.missed | 0) || 0),
    };
  }

  // ensureCards() — backfill a box-1 card for every recorded Codex id that has
  // none. This is the "New card -> box 1 on first codex.record" contract,
  // realized additively: the world calls ensureCards() after a keystone (or on
  // a visit pump) and any newly-earned id picks up a schedule, without ever
  // editing codex.js. Idempotent: existing cards are normalized, never reset.
  function ensureCards(now) {
    const store = ensureStore();
    const at = clock(now);
    let changed = false;
    if (cdx && typeof cdx.entries === 'function') {
      let list;
      try { list = cdx.entries(); } catch (e) { list = []; }
      for (const e of (list || [])) {
        const id = e && e.id;
        if (!id) continue;
        if (!store.cards[id]) {
          store.cards[id] = freshCard(at);
          changed = true;
        }
      }
    }
    if (changed) { try { persist(); } catch (e) { /* private mode */ } }
    return store.cards;
  }

  // due(now?) — every card whose due time has arrived, oldest-due first. Each
  // returned item carries the live card plus the matching Codex entry so the
  // caller can re-pose the player's OWN idea (retrieval-beat reads entry.idea).
  function due(now) {
    const store = ensureStore();
    const at = clock(now);
    const byId = codexIndex();
    const out = [];
    for (const id of Object.keys(store.cards)) {
      const card = normalize(store.cards[id], at);
      store.cards[id] = card; // heal in place
      if (card.due <= at) out.push({ id, card, entry: byId[id] || null });
    }
    out.sort((a, b) => a.card.due - b.card.due);
    return out;
  }

  // pickOne(now?) — the single best card to surface this session. Prefer one
  // that has an actual Codex idea to re-teach (a beat with no idea would have
  // nothing to re-pose); the most-overdue such card wins. Returns null when
  // nothing is due. NEVER mutates — surfacing is not grading.
  function pickOne(now) {
    const ready = due(now);
    if (!ready.length) return null;
    const withIdea = ready.filter(d => d.entry && d.entry.idea);
    return (withIdea[0] || ready[0]);
  }

  // grade(id, ok, now?) — the only mutating call. A card the player affirmed
  // (ok) climbs one box and is pushed further out; a card they could not recall
  // drops to box 1 and comes back tomorrow. Either way `seen` ticks. Returns
  // the updated card (or null for an unknown id). Persists once.
  function grade(id, ok, now) {
    if (!id) return null;
    const store = ensureStore();
    const at = clock(now);
    let card = store.cards[id];
    if (!card) {
      // grading an id we never carded (e.g. graded straight after record):
      // treat as a fresh card so the result still lands somewhere sane.
      card = freshCard(at);
    } else {
      card = normalize(card, at);
    }
    card.seen += 1;
    card.last = at;
    if (ok) {
      card.box = Math.min(MAX_BOX, card.box + 1);
    } else {
      card.box = 1;
      card.missed += 1;
    }
    card.due = at + intervalDays(card.box) * DAY;
    store.cards[id] = card;
    try { persist(); } catch (e) { /* private mode */ }
    return card;
  }

  // cardsFor() — read-only snapshot of the whole schedule, for the coverage
  // panel / verify script. Healed copies, never the live objects.
  function cardsFor(now) {
    const store = ensureStore();
    const at = clock(now);
    const snap = {};
    for (const id of Object.keys(store.cards)) {
      snap[id] = normalize(store.cards[id], at);
    }
    return snap;
  }

  // codexIndex() — id -> entry, rebuilt fresh each call (the Codex grows during
  // play; this is cheap at these sizes — at most 62 entries per world).
  function codexIndex() {
    const map = {};
    if (cdx && typeof cdx.entries === 'function') {
      let list;
      try { list = cdx.entries(); } catch (e) { list = []; }
      for (const e of (list || [])) { if (e && e.id) map[e.id] = e; }
    }
    return map;
  }

  return { ensureCards, due, pickOne, grade, cardsFor };
}

export default { createRetrieval };
