// xp.js — game XP, levels and perk points. Generic: the world supplies the
// perk catalog; this module owns the curve and the unlock arithmetic.
export function createXP({ state, save, onLevelUp }) {
  function needFor(level) { return Math.round(60 * Math.pow(level, 1.35)); }

  function add(n, reason = '') {
    state.xp += n;
    let leveled = false;
    while (state.xp >= needFor(state.level)) {
      state.xp -= needFor(state.level);
      state.level += 1;
      state.perkPts += 1;
      leveled = true;
    }
    save();
    if (leveled && onLevelUp) onLevelUp(state.level);
    return { leveled, level: state.level };
  }

  function progress() {
    const need = needFor(state.level);
    return { xp: state.xp, need, frac: Math.min(1, state.xp / need), level: state.level, pts: state.perkPts };
  }

  function perkRank(perkId) { return state.perks[perkId] || 0; }

  function buyPerk(perk) {
    if (state.perkPts < 1) return { ok: false, why: 'points' };
    if (perkRank(perk.id) >= perk.max) return { ok: false, why: 'maxed' };
    state.perkPts -= 1;
    state.perks[perk.id] = perkRank(perk.id) + 1;
    save();
    return { ok: true, rank: state.perks[perk.id] };
  }

  return { add, progress, perkRank, buyPerk, needFor };
}
