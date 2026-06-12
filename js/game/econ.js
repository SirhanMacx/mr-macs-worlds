// econ.js — currency + cargo inventory + price math, generic over any world's
// goods catalog. Operates on the game's saved state object; every mutation
// reports back so the controller can juice + save.
export function createEconomy({ state, goods, save }) {
  const goodById = {};
  goods.forEach(g => { goodById[g.id] = g; });

  function cargoCount() {
    let n = 0;
    for (const k in state.cargo) n += state.cargo[k];
    return n;
  }
  function capacity() { return state.capacity; }
  function coins() { return state.coins; }

  function cargoValue(priceFn) {
    let v = 0;
    for (const k in state.cargo) v += (priceFn ? priceFn(k) : goodById[k].base) * state.cargo[k];
    return Math.round(v);
  }
  function netWorth(priceFn) { return state.coins + cargoValue(priceFn); }

  function canBuy(goodId, price) {
    if (state.coins < price) return 'coins';
    if (cargoCount() >= state.capacity) return 'space';
    return null;
  }

  function buy(goodId, price) {
    const why = canBuy(goodId, price);
    if (why) return { ok: false, why };
    state.coins -= price;
    state.cargo[goodId] = (state.cargo[goodId] || 0) + 1;
    save();
    return { ok: true };
  }

  function sell(goodId, price) {
    if (!state.cargo[goodId]) return { ok: false, why: 'none' };
    state.cargo[goodId] -= 1;
    if (state.cargo[goodId] <= 0) delete state.cargo[goodId];
    state.coins += price;
    save();
    return { ok: true };
  }

  function addCoins(n) { state.coins = Math.max(0, state.coins + n); save(); return state.coins; }

  function addGood(goodId, n = 1) {
    state.cargo[goodId] = (state.cargo[goodId] || 0) + n;
    save();
  }

  function removeGood(goodId, n = 1) {
    const have = state.cargo[goodId] || 0;
    const take = Math.min(have, n);
    if (take <= 0) return 0;
    state.cargo[goodId] -= take;
    if (state.cargo[goodId] <= 0) delete state.cargo[goodId];
    save();
    return take;
  }

  function has(goodId, n = 1) { return (state.cargo[goodId] || 0) >= n; }

  // lose a random selection of cargo (events) — returns what was lost
  function loseRandomCargo(n) {
    const lost = {};
    for (let i = 0; i < n; i++) {
      const keys = Object.keys(state.cargo);
      if (!keys.length) break;
      const k = keys[Math.floor(Math.random() * keys.length)];
      state.cargo[k] -= 1;
      if (state.cargo[k] <= 0) delete state.cargo[k];
      lost[k] = (lost[k] || 0) + 1;
    }
    if (Object.keys(lost).length) save();
    return lost;
  }

  return {
    goodById, cargoCount, capacity, coins, cargoValue, netWorth,
    canBuy, buy, sell, addCoins, addGood, removeGood, has, loseRandomCargo,
  };
}

// City price for a good: base * city multiplier * gentle local drift so
// markets feel alive (deterministic per ~2-minute window, no RNG abuse).
export function priceAt(good, mult, tNow, cityIdx = 0, discount = 0) {
  const drift = 1 + Math.sin(tNow / 140 + cityIdx * 1.7 + good.base) * 0.06;
  return Math.max(1, Math.round(good.base * mult * drift * (1 - discount)));
}
