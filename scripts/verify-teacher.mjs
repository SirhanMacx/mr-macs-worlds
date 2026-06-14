// verify-teacher.mjs — self-verify for the teacher dashboard spine.
// Covers the contract's SELF-VERIFY list for the teacher slice:
//   - node --check (run separately by the harness) for all four files
//   - encode -> decode round-trips an earned set EXACTLY + mapHash matches
//   - aggregate of 3 synthetic codes yields correct per-standard coverage
//   - PII grep: every emitted code matches ^[A-Za-z0-9._-]+$ and has no
//     name / '@' / free text
// Pure Node; no DOM. dashboard.js is DOM-bound, so it is checked only by
// node --check (the harness does that) — not imported here.
//
// run: node scripts/verify-teacher.mjs

import { encode, decode, mapHashOf, shortFor, worldFor } from '../js/teacher/export-code.js';
import { aggregate } from '../js/teacher/aggregate.js';

let pass = 0, fail = 0;
const ok = (cond, msg) => { if (cond) { pass++; } else { fail++; console.error('  FAIL:', msg); } };
const section = (s) => console.log('\n== ' + s + ' ==');

// ---- synthetic standards maps in the contracted shape ----
// (real per-world standards.js are built by sibling agents; these stand in for
//  the *shape* + bit ordering this module must honor.)
const TW_MAP = {
  'cx-neolithic-surplus':   { code: '9.1a',  strand: '9.1', label: 'Neolithic surplus', examTask: 'CRQ', confidence: 'high' },
  'cx-silk-road-diffusion': { code: '9.4c',  strand: '9.4', label: 'Silk Road diffusion', examTask: 'CRQ', confidence: 'high' },
  'cx-black-death':         { code: '9.6b',  strand: '9.6', label: 'Black Death effects', examTask: 'CRQ', confidence: 'high' },
  'cx-columbian-exchange':  { code: '9.10b', strand: '9.10', label: 'Columbian Exchange', examTask: 'CRQ', confidence: 'high' },
  'cx-enduring-issues':     { code: '9.0',   strand: '9.0', label: 'Enduring issues skill', examTask: 'EIE', confidence: 'flag' },
};
const MA_MAP = {
  'cx_tenpercent':        { code: '1.4', strand: '1', label: 'Ten-percent myth', examTask: 'AAQ', confidence: 'high' },
  'u2c_cx_reconstructive':{ code: '2.6', strand: '2', label: 'Reconstructive memory', examTask: 'AAQ', confidence: 'high' },
  'cx_exam_self':         { code: 'SP', strand: 'SP', label: 'Exam of the self', examTask: 'EBQ', confidence: 'flag' },
};
const MAPS = { 'trade-winds': TW_MAP, 'mind-atlas': MA_MAP };

// =====================================================================
section('short/world code mapping is bijective for the 3 worlds');
ok(shortFor('trade-winds') === 'tw', 'trade-winds -> tw');
ok(shortFor('mind-atlas') === 'ma', 'mind-atlas -> ma');
ok(shortFor('word-harbor') === 'wh', 'word-harbor -> wh');
ok(worldFor('tw') === 'trade-winds' && worldFor('ma') === 'mind-atlas' && worldFor('wh') === 'word-harbor', 'short -> world round trip');
ok(shortFor('nope') === null && worldFor('zz') === null, 'unknown codes -> null');

// =====================================================================
section('encode -> decode round-trips an earned set EXACTLY + mapHash matches');
{
  // earn the 1st, 3rd, 5th TW standards; flag the 3rd as missed.
  const keys = Object.keys(TW_MAP);
  const earnedIds = [keys[0], keys[2], keys[4]];
  const retrieval = { v: 1, cards: { [keys[2]]: { box: 1, due: 0, last: 0, seen: 1, missed: 2 } } };

  const code = encode({ worldKey: 'trade-winds', standardsMap: TW_MAP, codex: earnedIds, retrieval });
  ok(typeof code === 'string' && code.startsWith('PoL1.tw.'), 'code has PoL1.tw prefix: ' + code);

  const dec = decode(code);
  ok(dec && dec.world === 'trade-winds', 'decoded world is trade-winds');
  ok(dec.mapHash === mapHashOf(keys), 'decoded mapHash matches mapHashOf(orderedKeys)');

  // earned bit-set must equal exactly indices {0,2,4}
  const earnedExpected = new Set([0, 2, 4]);
  const earnedDecoded = new Set([...dec.earned].filter(i => i < keys.length));
  ok(setsEqual(earnedDecoded, earnedExpected), 'earned indices exact: ' + [...earnedDecoded]);

  // missed bit-set must equal exactly {2}
  const missedDecoded = new Set([...dec.missed].filter(i => i < keys.length));
  ok(setsEqual(missedDecoded, new Set([2])), 'missed indices exact: ' + [...missedDecoded]);

  // round-trip back to ids
  const ids = [...earnedDecoded].map(i => keys[i]).sort();
  ok(JSON.stringify(ids) === JSON.stringify([...earnedIds].sort()), 'earned ids reconstruct exactly');
}

// =====================================================================
section('mapHash mismatch is refused');
{
  const code = encode({ worldKey: 'trade-winds', standardsMap: TW_MAP, codex: [Object.keys(TW_MAP)[0]] });
  // corrupt the mapHash segment
  const parts = code.split('.');
  parts[2] = (parts[2] === 'ffff') ? '0000' : 'ffff';
  const bad = parts.join('.');
  const res = aggregate([bad], MAPS, mapHashOf);
  ok(res.byWorld['trade-winds'].accepted === 0, 'mismatched-map code not accepted');
  ok(res.rejected.length === 1 && /mismatch/.test(res.rejected[0].reason), 'rejection reason names the mismatch');
}

// =====================================================================
section('aggregate of 3 synthetic codes yields correct coverage');
{
  const keys = Object.keys(TW_MAP);
  // Student A: earns {0,1}; B: earns {1,2}; C: earns {1} and misses {3}
  const codeA = encode({ worldKey: 'trade-winds', standardsMap: TW_MAP, codex: [keys[0], keys[1]] });
  const codeB = encode({ worldKey: 'trade-winds', standardsMap: TW_MAP, codex: [keys[1], keys[2]] });
  const codeC = encode({ worldKey: 'trade-winds', standardsMap: TW_MAP, codex: [keys[1]],
    retrieval: { v: 1, cards: { [keys[3]]: { box: 1, missed: 1 } } } });

  const res = aggregate([codeA, codeB, codeC], MAPS, mapHashOf);
  ok(res.rosterCount === 3, 'rosterCount = 3');
  const tw = res.byWorld['trade-winds'];
  ok(tw.accepted === 3, 'tw accepted = 3');

  // standard index 0: earned by A only -> 1/3 = 33%
  ok(tw.strands[0].earnedCount === 1 && tw.strands[0].earnedPct === 33, 'std0 earned by 1/3 (33%)');
  // standard index 1: earned by all 3 -> 100%
  ok(tw.strands[1].earnedCount === 3 && tw.strands[1].earnedPct === 100, 'std1 earned by 3/3 (100%)');
  // standard index 2: earned by B only -> 33%
  ok(tw.strands[2].earnedCount === 1 && tw.strands[2].earnedPct === 33, 'std2 earned by 1/3 (33%)');
  // standard index 3: earned by none -> 0%, missed by C once
  ok(tw.strands[3].earnedCount === 0 && tw.strands[3].earnedPct === 0, 'std3 earned by 0/3 (0%)');
  ok(tw.strands[3].missedCount === 1, 'std3 missed by 1');
  // most-missed surfaces std3 first
  ok(tw.mostMissed.length === 1 && tw.mostMissed[0].id === keys[3], 'most-missed = std3');
  // mean earned: (2 + 2 + 1) / 3 = 1.7
  ok(tw.meanEarned === 1.7, 'meanEarned = 1.7, got ' + tw.meanEarned);
}

// =====================================================================
section('aggregate spans multiple worlds in one paste');
{
  const twCode = encode({ worldKey: 'trade-winds', standardsMap: TW_MAP, codex: [Object.keys(TW_MAP)[0]] });
  const maCode = encode({ worldKey: 'mind-atlas', standardsMap: MA_MAP, codex: [Object.keys(MA_MAP)[0], Object.keys(MA_MAP)[2]] });
  const res = aggregate([twCode, maCode], MAPS, mapHashOf);
  ok(res.rosterCount === 2, 'two worlds, two codes accepted');
  ok(res.byWorld['mind-atlas'].accepted === 1 && res.byWorld['mind-atlas'].strands[0].earnedPct === 100, 'MA std0 100%');
}

// =====================================================================
section('PII grep: emitted codes are allowlist-only, no name/@/free text');
{
  const samples = [];
  samples.push(encode({ worldKey: 'trade-winds', standardsMap: TW_MAP, codex: Object.keys(TW_MAP) }));     // all earned
  samples.push(encode({ worldKey: 'trade-winds', standardsMap: TW_MAP, codex: [] }));                       // none earned
  samples.push(encode({ worldKey: 'mind-atlas', standardsMap: MA_MAP, codex: [Object.keys(MA_MAP)[1]] }));  // partial
  for (const s of samples) {
    ok(/^[A-Za-z0-9._-]+$/.test(s), 'allowlist-only: ' + s);
    ok(!s.includes('@'), 'no @: ' + s);
    ok(!/[a-z]+@|name|student|[A-Z][a-z]+ [A-Z][a-z]+/.test(s.replace(/^PoL1/, '')), 'no name-like tokens: ' + s);
    // every char individually inside the allowlist
    ok([...s].every(c => /[A-Za-z0-9._-]/.test(c)), 'every char allowed: ' + s);
  }
}

// =====================================================================
section('decode rejects malformed / hostile input safely');
ok(decode('') === null, 'empty -> null');
ok(decode('hello world') === null, 'spaces -> null');
ok(decode('PoL1.tw.zzzz.AA.AA') === null, 'bad mapHash hex -> null');
ok(decode('PoL2.tw.abcd.AA.AA') === null, 'wrong version -> null');
ok(decode('PoL1.xx.abcd.AA.AA') === null, 'unknown world -> null');
ok(decode('PoL1.tw.abcd.AA.AA.7@x') === null, 'PII in dayBucket -> null');
ok(decode('PoL1.tw.abcd.AA.AA.123') !== null, 'valid dayBucket -> ok');

// =====================================================================
section('empty / degenerate inputs do not throw');
ok(encode({}) === '', 'empty encode -> empty string');
ok(encode({ worldKey: 'trade-winds', standardsMap: {}, codex: [] }) === '', 'empty map -> empty string');
{
  const res = aggregate([], MAPS, mapHashOf);
  ok(res.rosterCount === 0, 'no codes -> roster 0');
  const res2 = aggregate(['garbage', '', null, 'PoL1.tw'], MAPS, mapHashOf);
  ok(res2.rosterCount === 0 && res2.rejected.length >= 1, 'garbage rejected, no throw');
}

// =====================================================================
function setsEqual(a, b) {
  if (a.size !== b.size) return false;
  for (const x of a) if (!b.has(x)) return false;
  return true;
}

console.log(`\n${fail === 0 ? 'OK' : 'FAILED'} — ${pass} passed, ${fail} failed`);
process.exit(fail === 0 ? 0 : 1);
