// save.js — versioned per-world game saves in localStorage. The game keeps ONE
// mutable state object; every transaction calls save() so an 8-minute class
// session can end mid-anything and resume instantly. De-identified by design:
// no names, no logins, nothing leaves the device.
export function createSave(worldKey, defaults) {
  const KEY = `mmw-game-${worldKey}-v1`;
  let state;

  function freshState() {
    return JSON.parse(JSON.stringify(defaults));
  }

  try {
    const raw = JSON.parse(localStorage.getItem(KEY) || 'null');
    if (raw && raw.v === defaults.v) {
      // merge over defaults so new fields appear on old saves
      state = Object.assign(freshState(), raw);
    } else {
      state = freshState();
    }
  } catch (e) {
    state = freshState();
  }

  let timer = null;
  function save(immediate = false) {
    if (immediate) {
      clearTimeout(timer); timer = null;
      try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) { /* private mode */ }
      return;
    }
    // coalesce bursts (a 6-item sell = one write)
    if (timer) return;
    timer = setTimeout(() => {
      timer = null;
      try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) { /* private mode */ }
    }, 120);
  }

  function reset() {
    state = freshState();
    save(true);
    return state;
  }

  // flush on tab hide/close so nothing is lost when the bell rings
  document.addEventListener('visibilitychange', () => { if (document.hidden) save(true); });
  window.addEventListener('pagehide', () => save(true));

  return { get state() { return state; }, save, reset, KEY };
}
