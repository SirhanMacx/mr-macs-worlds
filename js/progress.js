// progress.js — XP, collectibles, and visited tracking persisted to localStorage.
const KEY = 'mmw-progress-v1';

const state = load();

function load() {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {}
  return { xp: 0, visited: {}, stars: {}, mcqCorrect: 0, mcqTotal: 0 };
}

function save() {
  try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) {}
  emit();
}

const listeners = new Set();
export function onChange(fn) { listeners.add(fn); return () => listeners.delete(fn); }
function emit() { listeners.forEach(fn => fn(state)); }

export function getState() { return state; }

export function addXP(n, reason = '') {
  state.xp += n;
  save();
  return state.xp;
}

// collecting a "star" (a content node fully read, or a station completed)
export function collect(id, xp = 10) {
  if (state.stars[id]) return false; // already collected
  state.stars[id] = true;
  state.xp += xp;
  save();
  return true;
}

export function hasStar(id) { return !!state.stars[id]; }

export function visit(id) {
  if (!state.visited[id]) { state.visited[id] = true; save(); }
}

export function recordMCQ(correct, total) {
  state.mcqCorrect += correct;
  state.mcqTotal += total;
  save();
}

export function reset() {
  state.xp = 0; state.visited = {}; state.stars = {}; state.mcqCorrect = 0; state.mcqTotal = 0;
  save();
}
