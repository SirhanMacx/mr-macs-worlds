// aggregate.js — turn a pile of opt-in EXPORT CODES into class-level coverage,
// with zero names and zero accounts. Pure data in, pure data out.
//
// A teacher pastes many PoL1 codes (one per student, voluntarily shared). This
// module decodes each, validates its 4-hex mapHash against the live standards
// map for that world (a code minted on a different map version is REFUSED, not
// silently mis-counted), and reports:
//   - per-standard coverage: % of submitters who earned >=1 codex behind it,
//     plus the mean earned/total across the class.
//   - a most-missed ranking, built from the missed bitmasks.
//   - a roster count = number of accepted codes (NOT identities).
//
// Time-on-task is never derived. "Not collected (privacy-safe)" is the truth.

import { decode } from './export-code.js';

// orderedKeys + label/strand lookups from a world's STANDARDS_MAP.
function keysOf(standardsMap) { return Object.keys(standardsMap || {}); }

// aggregate(codes, standardsMapsByWorld, mapHashOf)
//   codes                  array of raw PoL1 strings (any worlds, any order).
//   standardsMapsByWorld   { 'trade-winds': STANDARDS_MAP, 'mind-atlas':..., 'word-harbor':... }
//                          worlds with no map provided are reported as "unknown map".
//   mapHashOf              the mapHashOf fn from export-code.js (injected so this
//                          module stays import-light and testable). Required to
//                          validate codes against the live map version.
//
// Returns:
//   {
//     rosterCount,                 // accepted codes total
//     byWorld: {
//       <world>: {
//         accepted, rejected,      // counts of codes for this world
//         total,                   // number of standards (bits) in the map
//         strands: [               // grouped, in map order
//           { code, strand, label, confidence,
//             earnedCount, earnedPct,   // how many submitters earned this standard
//             missedCount }             // how many flagged it missed (re-teach)
//         ],
//         meanEarned, meanTotal,   // mean #standards earned per submitter / total
//         mostMissed: [ {code,label,missedCount,...} ]  // desc by missedCount
//       }
//     },
//     rejected: [ { code, reason } ]   // de-identified rejection log (no PII)
//   }
export function aggregate(codes, standardsMapsByWorld = {}, mapHashOf) {
  const byWorld = {};
  const rejected = [];
  let rosterCount = 0;

  // pre-build per-world accumulators for every world we have a map for.
  for (const world of Object.keys(standardsMapsByWorld)) {
    const map = standardsMapsByWorld[world];
    const keys = keysOf(map);
    byWorld[world] = {
      world,
      accepted: 0,
      rejected: 0,
      total: keys.length,
      keys,
      expectedHash: typeof mapHashOf === 'function' ? mapHashOf(keys) : null,
      // per-standard tallies, aligned to key index
      earnedCounts: new Array(keys.length).fill(0),
      missedCounts: new Array(keys.length).fill(0),
      sumEarned: 0, // for meanEarned
    };
  }

  for (const raw of (codes || [])) {
    if (raw == null || String(raw).trim() === '') continue;
    const dec = decode(String(raw).trim());
    if (!dec) { rejected.push({ code: redact(raw), reason: 'malformed or non-PoL1' }); continue; }

    const acc = byWorld[dec.world];
    if (!acc) {
      rejected.push({ code: redact(raw), reason: `no standards map loaded for ${dec.world}` });
      continue;
    }
    // mapHash gate: refuse a code minted against a different map version.
    if (acc.expectedHash != null && dec.mapHash !== acc.expectedHash) {
      acc.rejected++;
      rejected.push({ code: redact(raw), reason: `map version mismatch (got ${dec.mapHash}, expected ${acc.expectedHash})` });
      continue;
    }

    // accept: fold this submitter's earned/missed bits into the tallies.
    acc.accepted++;
    rosterCount++;
    let earnedHere = 0;
    for (let i = 0; i < acc.total; i++) {
      if (dec.earned.has(i)) { acc.earnedCounts[i]++; earnedHere++; }
      if (dec.missed.has(i)) acc.missedCounts[i]++;
    }
    acc.sumEarned += earnedHere;
  }

  // finalize each world into the reported shape.
  const out = { rosterCount, byWorld: {}, rejected };
  for (const world of Object.keys(byWorld)) {
    const acc = byWorld[world];
    const map = standardsMapsByWorld[world];
    const n = acc.accepted;
    const strands = acc.keys.map((id, i) => {
      const meta = (map && map[id]) || {};
      return {
        id,
        code: meta.code || id,
        strand: meta.strand || '',
        label: meta.label || id,
        confidence: meta.confidence || '',
        examTask: meta.examTask || '',
        earnedCount: acc.earnedCounts[i],
        earnedPct: n ? Math.round((acc.earnedCounts[i] / n) * 100) : 0,
        missedCount: acc.missedCounts[i],
      };
    });
    const mostMissed = strands
      .filter(s => s.missedCount > 0)
      .slice()
      .sort((a, b) => b.missedCount - a.missedCount || a.earnedPct - b.earnedPct);

    out.byWorld[world] = {
      world,
      accepted: acc.accepted,
      rejected: acc.rejected,
      total: acc.total,
      strands,
      mostMissed,
      meanEarned: n ? +(acc.sumEarned / n).toFixed(1) : 0,
      meanTotal: acc.total,
    };
  }
  return out;
}

// redact() — keep ONLY the structural prefix of a rejected code in the log, so a
// teacher can debug "wrong world / wrong version" without the log ever echoing
// arbitrary pasted text back onto the screen. Stays inside the PII allowlist.
function redact(raw) {
  const s = String(raw).trim();
  if (/^[A-Za-z0-9._-]+$/.test(s)) {
    const parts = s.split('.');
    return parts.slice(0, 3).join('.') + (parts.length > 3 ? '.…' : '');
  }
  return '(non-conforming token)';
}

export default { aggregate };
