// story.js — the narrative spine. A tiny chapter/beat state machine that sits
// ON TOP of the save (state.story), so a world can ask "where are we in the
// story?" and gate dialogue/quests on it. No engine, no rendering — just flags
// that migrate cleanly onto old saves (save.js merges new fields over defaults).
//
// This is the "missing spine" the v3 worlds never had: a protagonist's arc the
// player advances by UNDERSTANDING the history, tracked here as plain flags.
export function createStory({ state, save }) {
  if (!state.story) state.story = { chapter: 0, beat: 'coldopen', flags: {} };
  const s = state.story;
  if (!s.flags) s.flags = {};

  return {
    get chapter() { return s.chapter; },
    set chapter(v) { s.chapter = v; save(); },
    get beat() { return s.beat; },
    setBeat(b) { s.beat = b; save(); },
    // flags are the story's memory: "the Vell won a round at Ur", "the house has
    // a name again". The world reads them to decide which scene is live.
    flag(k, v = true) { s.flags[k] = v; save(); },
    is(k) { return !!s.flags[k]; },
    advance() { s.chapter = (s.chapter || 0) + 1; save(); },
    raw: s,
  };
}
