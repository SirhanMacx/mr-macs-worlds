// quests.js — quest chains (talk → do → return), generic. The world supplies
// quest defs; state lives in the save. Stages auto-advance on the signals the
// game forwards (city visits, talks, deliveries) and the controller juices
// every beat.
export function createQuests({ state, save, defs, hooks = {} }) {
  const byId = {};
  defs.forEach(q => { byId[q.id] = q; });

  function rec(id) {
    if (!state.quests[id]) state.quests[id] = { stage: -1, done: false, visited: [] };
    return state.quests[id];
  }

  const isActive = id => { const r = state.quests[id]; return r && r.stage >= 0 && !r.done; };
  const isDone = id => !!(state.quests[id] && state.quests[id].done);
  const isAvailable = (id, era) => {
    const q = byId[id];
    return q && !isDone(id) && !isActive(id) && q.era <= era && (!q.requires || q.requires.every(isDone));
  };

  function stageOf(id) {
    const r = state.quests[id];
    if (!r || r.stage < 0 || r.done) return null;
    return byId[id].stages[r.stage];
  }

  function accept(id) {
    const r = rec(id);
    if (r.stage >= 0 || r.done) return false;
    r.stage = 0;
    r.visited = [];
    save();
    hooks.onAccept && hooks.onAccept(byId[id]);
    return true;
  }

  function advance(id) {
    const q = byId[id];
    const r = rec(id);
    if (r.done || r.stage < 0) return;
    r.stage += 1;
    r.visited = [];
    if (r.stage >= q.stages.length) {
      r.done = true;
      save();
      hooks.onDone && hooks.onDone(q);
    } else {
      save();
      hooks.onStage && hooks.onStage(q, q.stages[r.stage]);
    }
  }

  // ---- signals ----
  function notifyVisit(cityId) {
    for (const id in state.quests) {
      const st = stageOf(id);
      if (!st) continue;
      if (st.type === 'visit') {
        const r = state.quests[id];
        const want = st.cities || [st.target];
        if (want.includes(cityId) && !r.visited.includes(cityId)) {
          r.visited.push(cityId);
          save();
          hooks.onProgress && hooks.onProgress(byId[id], st, r.visited.length, want.length);
          if (want.every(c => r.visited.includes(c))) advance(id);
        }
      }
    }
  }

  // "can this npc take a turn-in right now?" — dialogue asks before rendering
  function turnInReady(id, npcId, econ) {
    const st = stageOf(id);
    if (!st) return false;
    if (st.type === 'talk') return st.target === npcId;
    if (st.type === 'deliver') {
      if (st.target !== npcId) return false;
      for (const g in st.goods) if (!econ.has(g, st.goods[g])) return false;
      return true;
    }
    return false;
  }

  // consume deliverables + advance
  function deliver(id, econ) {
    const st = stageOf(id);
    if (!st || st.type !== 'deliver') return false;
    for (const g in st.goods) econ.removeGood(g, st.goods[g]);
    advance(id);
    return true;
  }

  function activeList() {
    const out = [];
    for (const id in state.quests) {
      const st = stageOf(id);
      if (st) out.push({ quest: byId[id], stage: st, rec: state.quests[id] });
    }
    return out;
  }

  function doneCount() {
    let n = 0;
    for (const id in state.quests) if (state.quests[id].done) n++;
    return n;
  }

  return { byId, rec, isActive, isDone, isAvailable, stageOf, accept, advance, notifyVisit, turnInReady, deliver, activeList, doneCount };
}
