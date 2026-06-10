// progress.js — XP, per-unit mastery and settings, persisted to localStorage.
// v2 schema: per-course unit records (learned / best round / cleared) feed the
// quest log, the beacon and the station glow-up.
const KEY = 'mmw-progress-v2';

const state = load();

function blankCourse() { return { units: {}, stations: {}, once: {} }; }

function load() {
  let s = null;
  try { s = JSON.parse(localStorage.getItem(KEY) || 'null'); } catch (e) { /* fresh */ }
  if (!s || s.v !== 2) {
    s = { v: 2, xp: 0, courses: {}, settings: { quality: 'auto', muted: true, rm: null } };
    // carry XP over from v1 if present
    try {
      const v1 = JSON.parse(localStorage.getItem('mmw-progress-v1') || 'null');
      if (v1 && typeof v1.xp === 'number') s.xp = v1.xp;
    } catch (e) { /* ignore */ }
  }
  return s;
}

function save() {
  try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) { /* private mode */ }
  emit();
}

const listeners = new Set();
export function onChange(fn) { listeners.add(fn); return () => listeners.delete(fn); }
function emit() { listeners.forEach(fn => fn(state)); }

export function getState() { return state; }

function course(key) {
  if (!state.courses[key]) state.courses[key] = blankCourse();
  const c = state.courses[key];
  if (!c.once) c.once = {};
  return c;
}

export function addXP(n) { state.xp += n; save(); return state.xp; }

// One-time collectible (returns true the first time only).
export function collect(courseKey, id, xp) {
  const c = course(courseKey);
  if (c.once[id]) return false;
  c.once[id] = true;
  state.xp += xp;
  save();
  return true;
}

// ---- unit mastery ----
export function unit(courseKey, unitId) {
  const c = course(courseKey);
  if (!c.units[unitId]) c.units[unitId] = { learned: false, best: 0, bestOf: 0, rounds: 0 };
  return c.units[unitId];
}

export function markLearned(courseKey, unitId) {
  const u = unit(courseKey, unitId);
  if (u.learned) return false;
  u.learned = true;
  state.xp += 10;
  save();
  return true;
}

export function recordRound(courseKey, unitId, correct, total) {
  const u = unit(courseKey, unitId);
  u.rounds += 1;
  const frac = total ? correct / total : 0;
  const bestFrac = u.bestOf ? u.best / u.bestOf : 0;
  if (frac > bestFrac) { u.best = correct; u.bestOf = total; }
  state.xp += correct * 5 + (frac >= 0.7 ? 10 : 0);
  save();
  return u;
}

export function unitCleared(courseKey, unitId) {
  const u = unit(courseKey, unitId);
  return u.learned && u.bestOf > 0 && u.best / u.bestOf >= 0.7;
}

// ---- skill stations (frq / crq / ei / mixed mcq) ----
export function markStation(courseKey, stationId) {
  const c = course(courseKey);
  if (c.stations[stationId]) return false;
  c.stations[stationId] = true;
  save();
  return true;
}
export function stationDone(courseKey, stationId) { return !!course(courseKey).stations[stationId]; }

// ---- settings ----
export function getSetting(k, fallback = null) {
  const v = state.settings ? state.settings[k] : null;
  return v === null || v === undefined ? fallback : v;
}
export function setSetting(k, v) {
  if (!state.settings) state.settings = {};
  state.settings[k] = v;
  save();
}

export function reset() {
  state.xp = 0;
  state.courses = {};
  save();
}
