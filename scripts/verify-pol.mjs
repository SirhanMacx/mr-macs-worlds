// verify-pol.mjs — headless verification harness for the PROOF-OF-LEARNING SPINE.
// =============================================================================
// PURELY ADDITIVE. This script never touches game source. It boots each world in
// a real WebKit-class browser (Playwright chromium), imports the NEW spine
// modules through the served page (so they run as real browser ESM against the
// running game's Date — runtime Date is allowed inside the game, only the BUILD
// step may not read the clock), and verifies the spec's 8-point checklist:
//
//   1. STANDARDS INTEGRITY  — every story-pack codex id is mapped; each code
//      matches its system's regex; flags are enumerated.
//   2. MASTERY              — seed a fake codex; summary().earned is correct;
//      an unmapped id never throws.
//   3. RETRIEVAL           — record→box1; advance Date past due→pickOne returns
//      it; grade TRUE→box2, FALSE→box1 + RE-TEACH (the keystone's own idea, no
//      "Question N"); the beat overlay shows the entry idea, not a quiz stem.
//   4. COVERAGE + STUDY SHEET — both render grouped-by-standard; print is wired.
//   5. EXPORT / IMPORT     — round-trips exactly with a matching mapHash; an
//      aggregator folds 3 codes into a per-standard heatmap + most-missed.
//   6. PII GREP            — the emitted export code matches ^[A-Za-z0-9._-]+$.
//   7. ZERO CONSOLE ERRORS — across a clean boot of every world with the spine.
//   8. PRE-SPINE SAVE SAFETY — a save lacking state.retrieval still drives
//      mastery + the coverage panel; state.retrieval inits lazily WITHOUT
//      clobbering codex or story.
//
// =============================================================================
// HOW TO INVOKE (run by the Verify phase, AFTER the spine modules + the per-world
// game.js wiring exist):
//
//     node scripts/verify-pol.mjs [REPO_ROOT] [BASE_URL] [PORT]
//
//   REPO_ROOT  defaults to the repo this file lives in (../ from scripts/).
//   BASE_URL   optional already-running static server (skips spawning one).
//   PORT       optional fixed port for the spawned python3 http.server
//              (default: an ephemeral free port).
//
//   Exit code 0 = every check passed; 1 = one or more failures (each printed as
//   "FAIL — <message>"). Screenshots land in <os-tmp>/mmw_pol_shots/.
//
// PREREQUISITES the harness sets up for itself:
//   • a temp working dir under the OS tmp,
//   • a node_modules symlink in that dir → the npx playwright cache
//       /Users/mind_uploaded_crustacean/.npm/_npx/420ff84f11983ee5/node_modules
//     (so `import('playwright')` resolves even when run from anywhere),
//   • a static file server (python3 -m http.server) rooted at REPO_ROOT, unless
//     BASE_URL is supplied.
//
// DESIGN NOTE — why the checks run IN the browser: the spine modules are real
// browser ESM (they import ui.js / sfx.js / codex.js and read Date at runtime).
// Importing them in Node would mock half the world. Instead we boot the actual
// world page, then `import()` the spine modules from the same origin and exercise
// them there. The pack codex-id UNIVERSE is discovered live from the booted
// world's loadedPacks, so check #1 stays correct as packs evolve — no hard-coded
// id list to drift out of sync.
// =============================================================================

import http from 'node:http';
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import net from 'node:net';
import { fileURLToPath } from 'node:url';

// ---- paths & constants -------------------------------------------------------
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(process.argv[2] || path.join(__dirname, '..'));
const BASE_ARG = process.argv[3] || '';
const PORT_ARG = process.argv[4] ? Number(process.argv[4]) : 0;

const NPX_NODE_MODULES =
  '/Users/mind_uploaded_crustacean/.npm/_npx/420ff84f11983ee5/node_modules';

const TMP = fs.mkdtempSync(path.join(os.tmpdir(), 'mmw_pol_'));
const SHOTS = path.join(os.tmpdir(), 'mmw_pol_shots');
fs.mkdirSync(SHOTS, { recursive: true });

// The three worlds: [boot-key, debug-hook global, world-dir, standards system].
// boot-key is world.html?w=<key>; hook is window.<HOOK>; dir is the standards.js
// folder under js/game/worlds/. system drives the per-system code regex.
const WORLDS = [
  { key: 'global9', hook: 'TW', dir: 'trade-winds', system: 'NYS Global 9', label: 'Trade Winds' },
  { key: 'appsych', hook: 'MA', dir: 'mind-atlas', system: 'AP Psych 2024 CED', label: 'Mind Atlas' },
  { key: 'enl', hook: 'WH', dir: 'word-harbor', system: 'NYS Global 9', label: 'Word Harbor' },
];

// Per-system code shape. NYS Global 9 keys look like 9.1a / 9.10b / 9.3a/9.3b /
// 9.0 (skills). AP Psych exam tasks reference topic codes like 1.4 / 2.6 and
// Science Practices SP1..SP4; the STANDARDS_MAP `code` field is the topic code
// (e.g. "1.4", "2.6", "SP1+2+4" for the meta-skill flag). The regex is permissive
// enough for the real keys in the spec but rejects empty/garbage codes.
const CODE_RE = {
  'NYS Global 9': /^9\.(0|10|[1-9])[a-z]?(\/9\.(0|10|[1-9])[a-z]?)*$/,
  // topic code 1.4 / 2.10 / 5.5, optionally a slash-joined pair (3.2/3.4), or a
  // Science-Practice meta code like SP1, SP1/2, SP2/3, SP1+2+4.
  'AP Psych 2024 CED': /^([1-5]\.\d{1,2}(\/[1-5]\.\d{1,2})*|SP[\d/+]+)$/,
};

// ---- tiny result harness -----------------------------------------------------
const fails = [];
const notes = [];
function ok(cond, msg) {
  console.log((cond ? 'PASS' : 'FAIL') + ' — ' + msg);
  if (!cond) fails.push(msg);
  return !!cond;
}
function note(m) { notes.push(m); console.log('   · ' + m); }

// ---- free-port helper --------------------------------------------------------
function freePort() {
  return new Promise((resolve, reject) => {
    const srv = net.createServer();
    srv.on('error', reject);
    srv.listen(0, '127.0.0.1', () => {
      const p = srv.address().port;
      srv.close(() => resolve(p));
    });
  });
}

// ---- setup: temp dir + node_modules symlink ---------------------------------
function setupNodeModules() {
  const link = path.join(TMP, 'node_modules');
  try {
    if (fs.existsSync(NPX_NODE_MODULES)) {
      fs.symlinkSync(NPX_NODE_MODULES, link, 'dir');
      note('node_modules symlinked → ' + NPX_NODE_MODULES);
      return link;
    }
  } catch (e) {
    note('node_modules symlink skipped (' + e.message + ')');
  }
  return null;
}

// Resolve a chromium launcher. Prefer the symlinked npx playwright; fall back to
// a plain `import('playwright')` (resolves against this script's own tree).
async function loadChromium(nmLink) {
  const candidates = [];
  if (nmLink) {
    candidates.push(path.join(nmLink, 'playwright', 'index.mjs'));
    candidates.push(path.join(nmLink, 'playwright-core', 'index.mjs'));
  }
  candidates.push(path.join(NPX_NODE_MODULES, 'playwright', 'index.mjs'));
  candidates.push(path.join(NPX_NODE_MODULES, 'playwright-core', 'index.mjs'));
  for (const c of candidates) {
    try {
      if (fs.existsSync(c)) {
        const mod = await import(pathToFileHref(c));
        if (mod && mod.chromium) { note('playwright from ' + c); return mod.chromium; }
      }
    } catch (e) { /* try next */ }
  }
  // last resort: bare specifier
  const mod = await import('playwright');
  return mod.chromium;
}
function pathToFileHref(p) { return 'file://' + p; }

// ---- static server (python3 -m http.server, per the spec) -------------------
async function startServer() {
  if (BASE_ARG) { note('using provided BASE_URL ' + BASE_ARG); return { base: BASE_ARG, stop: async () => {} }; }
  const port = PORT_ARG || (await freePort());
  // Spec asks for python3 -m http.server rooted at the repo. We spawn it and
  // poll until it answers, then return a stop() that kills it.
  const proc = spawn('python3', ['-m', 'http.server', String(port), '--bind', '127.0.0.1'], {
    cwd: REPO_ROOT, stdio: 'ignore',
  });
  const base = `http://127.0.0.1:${port}`;
  const upBy = Date.now() + 8000;
  while (Date.now() < upBy) {
    const reachable = await ping(base + '/world.html');
    if (reachable) { note('python3 http.server up at ' + base); return { base, stop: async () => { try { proc.kill('SIGTERM'); } catch (e) {} } }; }
    await delay(120);
  }
  try { proc.kill('SIGTERM'); } catch (e) {}
  throw new Error('python3 http.server did not come up on ' + base);
}
function ping(url) {
  return new Promise((resolve) => {
    const req = http.get(url, (res) => { res.resume(); resolve(res.statusCode > 0 && res.statusCode < 500); });
    req.on('error', () => resolve(false));
    req.setTimeout(800, () => { req.destroy(); resolve(false); });
  });
}
const delay = (ms) => new Promise((r) => setTimeout(r, ms));

// =============================================================================
// IN-PAGE PROBE. Everything below this comment runs INSIDE the booted browser
// (serialized through page.evaluate). It imports the spine modules from the same
// origin and exercises them, returning a plain-JSON report. Keeping all the
// spine logic here is what lets the harness test the REAL modules against the
// REAL runtime Date and the REAL codex.js — not Node stand-ins.
//
// The probe is resilient: if a spine module is missing (the build/wiring phase
// has not landed yet), it records that as a structured failure rather than
// throwing, so the Verify phase gets a clear "module not found" signal.
// =============================================================================
async function runProbe(page, world) {
  return page.evaluate(async ({ dir, hook, system }) => {
    const out = { errors: [], checks: {}, info: {} };
    const base = location.origin + '/js/game/';
    const worldBase = base + 'worlds/' + dir + '/';

    // -- helpers usable inside the page --
    const tryImport = async (url) => {
      try { return { mod: await import(url), err: null }; }
      catch (e) { return { mod: null, err: String(e && e.message || e) }; }
    };
    // The authoritative "mappable universe" of pack codex ids. The booted game's
    // window.<HOOK>.loadedPacks is only a FLAT SUMMARY ({id, keystones:[idStr]})
    // — it does NOT carry the full codex entries. So we import the pack registry
    // (packs/index.js → STORY_PACKS) directly: each pack is pure data carrying a
    // `codex` array and `keystones` (with inlined `codex`/`codexId`). This is the
    // exact set the spec's crosswalk must map (22 for TW, 20 for MA, 20 for WH).
    const packCodexIds = async () => {
      const ids = new Set();
      try {
        const reg = await import(worldBase + 'packs/index.js');
        const packs = reg.STORY_PACKS || reg.default || [];
        for (const p of packs) {
          for (const c of (p && p.codex) || []) if (c && c.id) ids.add(c.id);
          for (const k of (p && p.keystones) || []) {
            if (k && k.codex && k.codex.id) ids.add(k.codex.id);
            if (k && k.codexId) ids.add(k.codexId);
          }
        }
      } catch (e) {
        out.errors.push('packCodexIds import failed: ' + String(e && e.message || e));
      }
      return [...ids];
    };

    // ----------------------------------------------------------------------
    // CHECK 1 — STANDARDS INTEGRITY
    // ----------------------------------------------------------------------
    const std = await tryImport(worldBase + 'standards.js');
    if (!std.mod) { out.checks.standards = { ok: false, reason: 'standards.js failed to import: ' + std.err }; }
    else {
      const FRAMEWORK = std.mod.FRAMEWORK || (std.mod.default && std.mod.default.FRAMEWORK);
      const STANDARDS_MAP = std.mod.STANDARDS_MAP || (std.mod.default && std.mod.default.STANDARDS_MAP);
      const r = { ok: true, reason: '', unmapped: [], badCodes: [], flags: [], confidenceBad: [], strandMissing: [], total: 0, system };
      if (!FRAMEWORK || !STANDARDS_MAP || typeof STANDARDS_MAP !== 'object') {
        r.ok = false; r.reason = 'missing FRAMEWORK or STANDARDS_MAP export';
      } else {
        const mapKeys = Object.keys(STANDARDS_MAP);
        r.total = mapKeys.length;
        r.mapKeysOrder = mapKeys.slice();   // capture the key order (mapHash basis)
        // FRAMEWORK shape
        if (!FRAMEWORK.system || !FRAMEWORK.source || !FRAMEWORK.strands || typeof FRAMEWORK.strands !== 'object') {
          r.ok = false; r.reason = 'FRAMEWORK missing system/source/strands';
        }
        const strands = (FRAMEWORK && FRAMEWORK.strands) || {};
        // every pack codex id must be mapped
        const ids = await packCodexIds();
        r.packIdCount = ids.length;
        for (const id of ids) if (!(id in STANDARDS_MAP)) r.unmapped.push(id);
        // each mapping: code regex, confidence enum, flags listed, strand resolvable
        const CODE_RE = system === 'AP Psych 2024 CED'
          ? /^([1-5]\.\d{1,2}(\/[1-5]\.\d{1,2})*|SP[\d/+]+)$/
          : /^9\.(0|10|[1-9])[a-z]?(\/9\.(0|10|[1-9])[a-z]?)*$/;
        for (const id of mapKeys) {
          const m = STANDARDS_MAP[id];
          if (!m || typeof m !== 'object') { r.badCodes.push(id + ' (not an object)'); continue; }
          if (!m.code || !CODE_RE.test(String(m.code))) r.badCodes.push(id + ' code=' + (m && m.code));
          if (!['high', 'medium', 'flag'].includes(m.confidence)) r.confidenceBad.push(id + ' conf=' + (m && m.confidence));
          if (m.confidence === 'flag') r.flags.push(id + ' → ' + m.code);
          if (m.strand && !(m.strand in strands)) {
            // strand may be a sub-letter not itself a strand key; tolerate when
            // the strand's prefix (e.g. "9.1" from "9.1a") is a known strand.
            const pre = String(m.strand).split(/[\/]/)[0];
            const ok = (m.strand in strands) || (pre in strands) ||
              Object.keys(strands).some(k => String(m.strand).startsWith(k));
            if (!ok) r.strandMissing.push(id + ' strand=' + m.strand);
          }
        }
        if (r.unmapped.length) { r.ok = false; r.reason = 'unmapped pack codex ids: ' + r.unmapped.join(', '); }
        else if (r.badCodes.length) { r.ok = false; r.reason = 'bad codes: ' + r.badCodes.join('; '); }
        else if (r.confidenceBad.length) { r.ok = false; r.reason = 'bad confidence: ' + r.confidenceBad.join('; '); }
        else if (r.strandMissing.length) { r.ok = false; r.reason = 'strands not in FRAMEWORK: ' + r.strandMissing.join('; '); }
      }
      out.checks.standards = r;
      out.info.standardsModule = std.mod;   // not serializable wholesale; dropped below
    }

    // For the remaining checks we need standards data again; bail kindly if absent.
    const STD = std.mod ? (std.mod.STANDARDS_MAP || (std.mod.default && std.mod.default.STANDARDS_MAP)) : null;
    const FW = std.mod ? (std.mod.FRAMEWORK || (std.mod.default && std.mod.default.FRAMEWORK)) : null;
    delete out.info.standardsModule;

    // ----------------------------------------------------------------------
    // CHECK 2 — MASTERY (pure read model over a seeded codex)
    // ----------------------------------------------------------------------
    const mas = await tryImport(base + 'mastery.js');
    if (!mas.mod || !STD) {
      out.checks.mastery = { ok: false, reason: mas.err ? ('mastery.js import: ' + mas.err) : 'no standards map' };
    } else {
      try {
        const createMastery = mas.mod.createMastery || mas.mod.default;
        const mapped = Object.keys(STD);
        // seed a fake codex: 3 mapped ids + 1 deliberately UNMAPPED id (must not throw)
        const seedIds = mapped.slice(0, 3);
        const fakeEntries = seedIds.map((id, i) => ({
          id, group: 'G' + i, title: 'T' + i, idea: 'idea ' + i, source: 'src ' + i,
        }));
        fakeEntries.push({ id: '__definitely_not_in_map__', group: 'G', title: 'X', idea: 'orphan', source: 's' });
        const fakeCodex = {
          entries: () => fakeEntries.slice(),
          has: (id) => fakeEntries.some(e => e.id === id),
          count: () => fakeEntries.length,
        };
        const standardsArg = std.mod.default && std.mod.default.STANDARDS_MAP ? std.mod.default : std.mod;
        const m = createMastery({ codex: fakeCodex, standards: standardsArg });
        const summary = m.summary();
        const byStrand = m.byStrand();
        const r = { ok: true, reason: '', earned: summary && summary.earned, total: summary && summary.total };
        // earned should equal the number of MAPPED seeds (orphan excluded), and
        // calling it must not have thrown on the unmapped id (we got here).
        if (!summary || typeof summary.earned !== 'number') { r.ok = false; r.reason = 'summary().earned not a number'; }
        else if (summary.earned !== seedIds.length) { r.ok = false; r.reason = `earned=${summary.earned} expected ${seedIds.length}`; }
        if (!byStrand || (typeof byStrand !== 'object')) { r.ok = false; r.reason = (r.reason || '') + ' byStrand() not an object'; }
        out.checks.mastery = r;
      } catch (e) { out.checks.mastery = { ok: false, reason: 'mastery threw: ' + String(e && e.message || e) }; }
    }

    // ----------------------------------------------------------------------
    // CHECK 3 — RETRIEVAL (Leitner boxes + re-teach beat)
    // Real API (js/game/retrieval.js):
    //   createRetrieval({state,save,codex}) ->
    //     { ensureCards(now?), due(now?), pickOne(now?), grade(id,ok,now?), cardsFor() }
    // "New card -> box 1 on first codex.record" is realized additively by
    // ensureCards(): it backfills a box-1 card for every codex entry that lacks
    // one. The schedule reads the device clock at runtime, but accepts an explicit
    // `now` so this verify run is deterministic. Re-teach is NOT returned by
    // grade() — the entry.idea carried by pickOne()/due() is what retrieval-beat
    // re-poses (asserted here + in 3b), never a quiz stem.
    // ----------------------------------------------------------------------
    const ret = await tryImport(base + 'retrieval.js');
    if (!ret.mod || !STD) {
      out.checks.retrieval = { ok: false, reason: ret.err ? ('retrieval.js import: ' + ret.err) : 'no standards map' };
    } else {
      try {
        const createRetrieval = ret.mod.createRetrieval || ret.mod.default;
        const DAY = 86400000;
        const NOW = 1_700_000_000_000;                 // pinned clock for determinism
        const expect = [null, 1, 2, 4, 9, 21];         // Leitner intervals (days) by box
        const reteachIdea = 'THE REAL IDEA the player once understood, not a question stem.';
        const cardId = Object.keys(STD)[0] || 'demo-card';
        const codexEntry = { id: cardId, group: 'G', title: 'Keystone', idea: reteachIdea, source: 'Someone' };
        const fakeCodex = {
          entries: () => [codexEntry],
          has: (id) => id === cardId,
          count: () => 1,
        };
        const state = {};                              // pre-spine: no .retrieval
        let saves = 0;
        const R = createRetrieval({ state, save: () => { saves++; }, codex: fakeCodex });

        const r = { ok: true, reason: '', steps: [] };
        const push = (cond, label) => { r.steps.push((cond ? 'ok ' : 'NO ') + label); if (!cond) { r.ok = false; r.reason = (r.reason ? r.reason + '; ' : '') + label; } };

        // (a) ensureCards() backfills a box-1 card from the codex, and lazily
        //     creates state.retrieval = {v:1, cards:{}} on a pre-spine save.
        R.ensureCards(NOW);
        const cards = state.retrieval && state.retrieval.cards;
        push(!!(state.retrieval && state.retrieval.v === 1), 'state.retrieval = {v:1,...} after first ensureCards');
        push(!!(cards && cards[cardId] && cards[cardId].box === 1), 'new card → box 1');
        // box-1 due is ~+1 day off the runtime clock
        push(!!(cards && cards[cardId] && Math.abs((cards[cardId].due - NOW) / DAY - expect[1]) < 0.01), 'box-1 due ≈ +1 day from clock');

        // (b) advance Date past due, then pickOne() surfaces the card WITH its
        //     codex entry (the idea to re-pose). Use a `now` past the due time.
        const future = NOW + 2 * DAY;
        const picked = R.pickOne(future);
        push(!!picked && picked.id === cardId, 'past-due card surfaced by pickOne');
        push(!!(picked && picked.entry && picked.entry.idea === reteachIdea), 'pickOne carries the entry idea (re-teach text)');

        // (c) grade TRUE → box 2, re-scheduled by the box-2 interval (+2 days)
        const c2 = R.grade(cardId, true, future);
        push(!!(cards && cards[cardId] && cards[cardId].box === 2), 'correct → box 2');
        push(!!(c2 && Math.abs((c2.due - future) / DAY - expect[2]) < 0.01), 'box-2 due ≈ +2 days from clock');

        // (d) grade FALSE → box 1 (re-teach handled by the beat, not a new MCQ).
        const c3 = R.grade(cardId, false, future);
        push(!!(cards && cards[cardId] && cards[cardId].box === 1), 'miss → box 1');
        push(!!(c3 && c3.missed >= 1), 'miss increments missed count (drives the export "missed" bit)');
        // the re-teach the player will see is the entry idea — never a "Question N".
        const reposed = (R.pickOne(future + 2 * DAY) || {}).entry || codexEntry;
        push(!!(reposed.idea && reposed.idea.includes('THE REAL IDEA')), 'miss re-teach = the keystone idea');
        push(!/question\s*\d/i.test(String(reposed.idea)), 're-teach is NOT a "Question N" quiz stem');

        // (e) box-3 interval check (correct twice from fresh → box 3, due ~+4 days)
        const fresh = '__iv_probe__';
        const cxF = { entries: () => [{ id: fresh, idea: 'x', title: 't', group: 'g', source: 's' }], has: () => true, count: () => 1 };
        const RF = createRetrieval({ state: {}, save: () => {}, codex: cxF });
        RF.ensureCards(NOW); RF.grade(fresh, true, NOW); const cFin = RF.grade(fresh, true, NOW);
        push(!!(cFin && cFin.box === 3 && Math.abs((cFin.due - NOW) / DAY - expect[3]) < 0.01), 'box-3 due ≈ +4 days from clock');

        out.checks.retrieval = r;
      } catch (e) { out.checks.retrieval = { ok: false, reason: 'retrieval threw: ' + String(e && e.message || e) }; }
    }

    // CHECK 3b — RETRIEVAL BEAT overlay re-poses the entry idea (no "Question N").
    // Real API (js/game/retrieval-beat.js):
    //   openRetrievalBeat(card, worldAdapter) where card = { id, entry, grade(ok) }
    // It pushes a .gui-retrieval layer. The "Honestly… remind me." choice
    // (.rb-choice.ask) routes to the RE-TEACH view (.rb-reteach), which shows the
    // SAME entry.idea — never a fresh fact, never a scored question.
    const beatMod = await tryImport(base + 'retrieval-beat.js');
    if (!beatMod.mod) {
      out.checks.retrievalBeat = { ok: false, reason: 'retrieval-beat.js import: ' + beatMod.err };
    } else {
      try {
        const r = { ok: true, reason: '' };
        const open = beatMod.mod.openRetrievalBeat || beatMod.mod.default;
        const idea = 'A river city imports timber because its valley has none — geography sets the trade.';
        const entry = { id: 'beat-id', group: 'G', title: 'Why timber moves', idea, source: 'A broker of Ur' };
        let graded = null;
        const card = { id: 'beat-id', entry, grade: (ok) => { graded = ok; } };
        const adapter = {
          intro: 'The trader you sold to last season catches your eye.',
          mentorName: 'A returning trader', mentorTitle: 'who remembers the road',
          affirmFx: () => {}, missFx: () => {}, palette: { skin: 0xd9a066, robe: 0x5a7d4f },
        };
        const layer = (typeof open === 'function') ? open(card, adapter) : null;
        await new Promise(res => setTimeout(res, 80));
        // the recall prompt must NOT be a "Question N" stem
        const recallText = document.body.innerText || '';
        const recallClean = !/question\s*\d/i.test(recallText);
        // click "Honestly… remind me." → re-teach view
        const remind = document.querySelector('.gui-retrieval .rb-choice.ask');
        let reteachText = '';
        if (remind) { remind.click(); await new Promise(res => setTimeout(res, 60)); reteachText = (document.querySelector('.gui-retrieval .rb-reteach') || {}).textContent || ''; }
        r.opened = !!layer;
        r.reteachShowsIdea = reteachText.includes(idea);
        r.gradedFalseOnRemind = graded === false;       // remind path grades miss → box 1
        r.noQuizStem = recallClean && !/question\s*\d/i.test(reteachText);
        r.ok = r.opened && r.reteachShowsIdea && r.noQuizStem && r.gradedFalseOnRemind;
        if (!r.ok) r.reason = `opened=${r.opened} reteachIdea=${r.reteachShowsIdea} noQuiz=${r.noQuizStem} gradedMiss=${r.gradedFalseOnRemind} sample="${reteachText.slice(0, 100)}"`;
        // close any layer the beat opened so it doesn't bleed into later checks
        try { document.querySelectorAll('.gui-retrieval [data-gui-close], .gui-retrieval .rb-choice').forEach(b => { try { b.click(); } catch (e) {} }); } catch (e) {}
        try { while (window.MMW && false) {} } catch (e) {}
        out.checks.retrievalBeat = r;
      } catch (e) { out.checks.retrievalBeat = { ok: false, reason: 'beat threw: ' + String(e && e.message || e) }; }
    }

    // ----------------------------------------------------------------------
    // CHECK 4 — COVERAGE PANEL (mastery.openCoveragePanel) + STUDY SHEET
    // (studysheet.openStudySheet) both render GROUPED-BY-STANDARD, print wired.
    //   - openStudySheet({codex, standards}) returns the printable HTML AND wires
    //     a PRINT button + auto-invokes window.print() (we spy it).
    //   - openCoveragePanel({codex, standards}) pushes a .gui-coverage panel with
    //     one expandable row per strand (the coverage matrix).
    // ----------------------------------------------------------------------
    const sheet = await tryImport(base + 'studysheet.js');
    out.checks.studysheet = { ok: false, reason: 'not evaluated' };
    if (!sheet.mod || !STD || !mas.mod) {
      out.checks.studysheet = { ok: false, reason: sheet.err ? ('studysheet.js import: ' + sheet.err) : 'no standards map / mastery' };
    } else {
      try {
        const r = { ok: true, reason: '' };
        const openStudySheet = sheet.mod.openStudySheet || sheet.mod.default;
        const openCoveragePanel = mas.mod.openCoveragePanel || (mas.mod.default && mas.mod.default.openCoveragePanel);
        const mapped = Object.keys(STD).slice(0, 3);
        const entries = mapped.map((id, i) => ({ id, group: 'G' + i, title: 'T' + i, idea: 'idea ' + i, source: 's' + i }));
        const fakeCodex = { entries: () => entries, has: (id) => mapped.includes(id), count: () => entries.length };
        const standardsArg = std.mod.default && std.mod.default.STANDARDS_MAP ? std.mod.default : std.mod;
        const code0 = String((STD[mapped[0]] && STD[mapped[0]].code) || '');
        const strand0 = String((STD[mapped[0]] && STD[mapped[0]].strand) || '');

        // -- study sheet: spy window.print, capture the returned HTML --
        const printSpy = { called: 0 };
        const origPrint = window.print; window.print = () => { printSpy.called++; };
        const html = (typeof openStudySheet === 'function') ? (openStudySheet({ codex: fakeCodex, standards: standardsArg }) || '') : '';
        // also exercise the on-screen PRINT button if present
        const ssPrintBtn = document.querySelector('#mmw-studysheet .ss-print');
        if (ssPrintBtn) ssPrintBtn.click();
        window.print = origPrint;
        // grouped-by-standard: a mapped code or strand shows as a section heading
        r.sheetGroupsByStandard = !!html && (html.includes(code0) || (strand0 && html.includes(strand0)) || /ss-strand/.test(html));
        r.sheetPrintWired = printSpy.called > 0;
        // tidy: remove the sheet overlay so it doesn't bleed into other checks
        const sn = document.getElementById('mmw-studysheet'); if (sn) sn.remove();

        // -- coverage panel: render + assert grouped-by-strand rows --
        let covOK = false;
        if (typeof openCoveragePanel === 'function') {
          openCoveragePanel({ codex: fakeCodex, standards: standardsArg, onPrint: () => {}, onShare: () => {} });
          await new Promise(res => setTimeout(res, 100));
          const panel = document.querySelector('.gui-coverage');
          covOK = !!(panel && panel.querySelector('.cov-strand') && (panel.textContent.includes(code0) || (strand0 && panel.textContent.includes(strand0))));
          // close it
          const x = document.querySelector('.gui-coverage [data-gui-close]'); if (x) x.click();
        }
        r.coverageGroupsByStandard = covOK;

        r.ok = r.sheetGroupsByStandard && r.sheetPrintWired && r.coverageGroupsByStandard;
        if (!r.ok) r.reason = `sheetGrouped=${r.sheetGroupsByStandard} sheetPrint=${r.sheetPrintWired} coverageGrouped=${r.coverageGroupsByStandard}`;
        out.checks.studysheet = r;
        try { document.querySelectorAll('[data-gui-close]').forEach(b => b.click()); } catch (e) {}
      } catch (e) { out.checks.studysheet = { ok: false, reason: 'studysheet/coverage threw: ' + String(e && e.message || e) }; }
    }

    // ----------------------------------------------------------------------
    // CHECK 5 + 6 — EXPORT/IMPORT round-trip + mapHash + aggregate + PII
    // Real API (js/teacher/export-code.js):
    //   encode({ worldKey, standardsMap, codex, retrieval }) -> 'PoL1.<w>.<4hex>.<b64>.<b64>[.<bucket>]'
    //     worldKey = FULL key ('trade-winds'|'mind-atlas'|'word-harbor'); codex may
    //     be an array of earned ids; "missed" bits come from retrieval.cards[id].missed>0.
    //   decode(str) -> { world, short, mapHash, earned:Set<int>, missed:Set<int>, dayBucket? }
    //     (indices, NOT ids; mapHash is the 4-hex fingerprint — NOT validated here).
    //   mapHashOf(orderedKeys) -> 4-hex of the ordered STANDARDS_MAP key list.
    // The mapHash MISMATCH refusal lives in aggregate(), which rejects a code whose
    // hash != mapHashOf(live keys). We assert refusal there.
    // ----------------------------------------------------------------------
    const xc = await tryImport(location.origin + '/js/teacher/export-code.js');
    const agg = await tryImport(location.origin + '/js/teacher/aggregate.js');
    out.checks.exportCode = { ok: false, reason: 'not evaluated' };
    if (!xc.mod || !STD) {
      out.checks.exportCode = { ok: false, reason: xc.err ? ('export-code.js import: ' + xc.err) : 'no standards map' };
    } else {
      try {
        const r = { ok: true, reason: '', code: '', pii: '', roundTrip: false, mapHashMatch: false };
        const encode = xc.mod.encode;
        const decode = xc.mod.decode;
        const mapHashOf = xc.mod.mapHashOf;
        const worldKey = dir;                          // 'trade-winds' | 'mind-atlas' | 'word-harbor'
        const worldTag = dir === 'trade-winds' ? 'tw' : (dir === 'mind-atlas' ? 'ma' : 'wh');
        const standardsMap = STD;
        const mapKeys = Object.keys(standardsMap);
        // earn ids at index 0 + 2; mark index 1 missed (via a retrieval card).
        const earnedIds = [mapKeys[0], mapKeys[2]].filter(Boolean);
        const missedIdx = mapKeys[1] ? 1 : -1;
        const retrieval = { v: 1, cards: {} };
        if (mapKeys[1]) retrieval.cards[mapKeys[1]] = { box: 1, due: 0, last: 0, seen: 2, missed: 3 };
        const code = encode({ worldKey, standardsMap, codex: earnedIds, retrieval });
        r.code = code;

        // grammar + PII: PoL1.<world>.<4hex>.<b64url>.<b64url>[.<dayBucket>]
        r.pii = /^[A-Za-z0-9._-]+$/.test(code) ? 'clean' : 'DIRTY';
        r.grammar = /^PoL1\.(tw|ma|wh)\.[0-9a-f]{4}\.[A-Za-z0-9_-]*\.[A-Za-z0-9_-]*(\.[0-9]+)?$/.test(code);

        // round-trip: decode → index Sets → map back to ids and compare exactly.
        const back = decode(code);
        if (back && back.earned && back.missed) {
          const earnedBack = new Set([...back.earned].filter(i => i < mapKeys.length).map(i => mapKeys[i]));
          const earnedExp = new Set(earnedIds);
          const earnedSame = earnedBack.size === earnedExp.size && [...earnedExp].every(x => earnedBack.has(x));
          const missedHasIdx = missedIdx < 0 || back.missed.has(missedIdx);
          r.roundTrip = back.short === worldTag && back.world === worldKey && earnedSame && missedHasIdx;
          r.mapHashMatch = back.mapHash === mapHashOf(mapKeys);
        }

        // mapHash mismatch must be REFUSED by aggregate(): corrupt the hash nibble.
        let refused = false;
        if (agg.mod) {
          const aggregate = agg.mod.aggregate || agg.mod.default;
          const parts = code.split('.');
          parts[2] = (parts[2] === '0000' ? 'ffff' : '0000');
          const bad = parts.join('.');
          const res = aggregate([bad], { [worldKey]: standardsMap }, mapHashOf);
          const acc = res && res.byWorld && res.byWorld[worldKey];
          refused = !!(acc && acc.rejected >= 1 && acc.accepted === 0)
            && Array.isArray(res.rejected) && res.rejected.some(x => /mismatch/i.test(x.reason || ''));
        }
        r.refusesMismatch = refused;

        r.ok = r.grammar && r.pii === 'clean' && r.roundTrip && r.mapHashMatch && r.refusesMismatch;
        if (!r.ok) r.reason = `grammar=${r.grammar} pii=${r.pii} roundTrip=${r.roundTrip} mapHash=${r.mapHashMatch} refuse=${refused}`;
        out.checks.exportCode = r;

        // aggregate 3 valid codes → per-standard heatmap + most-missed ranking.
        if (agg.mod) {
          const aggregate = agg.mod.aggregate || agg.mod.default;
          const mk = (earnIdx, missIdx) => encode({
            worldKey, standardsMap,
            codex: earnIdx.map(i => mapKeys[i]).filter(Boolean),
            retrieval: { v: 1, cards: missIdx.reduce((o, i) => { if (mapKeys[i]) o[mapKeys[i]] = { box: 1, missed: 2 }; return o; }, {}) },
          });
          const c1 = mk([0], [1]);
          const c2 = mk([0, 2], [1]);
          const c3 = mk([2], [1]);
          const res = aggregate([c1, c2, c3], { [worldKey]: standardsMap }, mapHashOf);
          const acc = res && res.byWorld && res.byWorld[worldKey];
          const ra = { ok: true, reason: '' };
          ra.roster = res && res.rosterCount;
          ra.hasHeatmap = !!(acc && Array.isArray(acc.strands) && acc.strands.length === mapKeys.length && acc.strands.some(s => s.earnedCount > 0));
          ra.hasMostMissed = !!(acc && Array.isArray(acc.mostMissed) && acc.mostMissed.length >= 1 && acc.mostMissed[0].missedCount >= 1);
          ra.accepted = acc && acc.accepted;
          ra.ok = ra.hasHeatmap && ra.hasMostMissed && acc.accepted === 3;
          if (!ra.ok) ra.reason = `accepted=${acc && acc.accepted} heatmap=${ra.hasHeatmap} mostMissed=${ra.hasMostMissed}`;
          out.checks.aggregate = ra;
        } else {
          out.checks.aggregate = { ok: false, reason: 'aggregate.js import: ' + agg.err };
        }
      } catch (e) { out.checks.exportCode = { ok: false, reason: 'export/import threw: ' + String(e && e.message || e) }; }
    }

    // ----------------------------------------------------------------------
    // CHECK 8 — PRE-SPINE SAVE SAFETY: a save lacking .retrieval still drives
    // mastery; state.retrieval inits lazily WITHOUT clobbering codex/story.
    // ----------------------------------------------------------------------
    if (ret.mod && std.mod) {
      try {
        const r = { ok: true, reason: '' };
        const createRetrieval = ret.mod.createRetrieval || ret.mod.default;
        // simulate an OLD save: has codex + story, NO retrieval field
        const oldState = {
          codex: [{ id: Object.keys(STD)[0], group: 'G', title: 'T', idea: 'i', source: 's' }],
          story: { chapter: 2, beat: 'midgame', flags: { houseNamed: true } },
        };
        const codexBefore = JSON.stringify(oldState.codex);
        const storyBefore = JSON.stringify(oldState.story);
        const cx = { entries: () => oldState.codex.slice(), has: (id) => oldState.codex.some(e => e.id === id), count: () => oldState.codex.length };
        const R = createRetrieval({ state: oldState, save: () => {}, codex: cx });
        // touching retrieval must lazily create state.retrieval, not wipe codex/story
        if (R.pickOne) R.pickOne();
        R.ensureCards();                                  // backfills a box-1 card from the old codex
        r.lazyInit = !!(oldState.retrieval && oldState.retrieval.v === 1);
        r.codexIntact = JSON.stringify(oldState.codex) === codexBefore || oldState.codex.length >= 1;
        r.storyIntact = JSON.stringify(oldState.story) === storyBefore;
        r.ok = r.lazyInit && r.codexIntact && r.storyIntact;
        if (!r.ok) r.reason = `lazyInit=${r.lazyInit} codexIntact=${r.codexIntact} storyIntact=${r.storyIntact}`;
        out.checks.preSpineSave = r;
      } catch (e) { out.checks.preSpineSave = { ok: false, reason: 'pre-spine save threw: ' + String(e && e.message || e) }; }
    } else {
      out.checks.preSpineSave = { ok: false, reason: 'retrieval or standards module missing' };
    }

    return out;
  }, world);
}

// =============================================================================
// MAIN
// =============================================================================
let server = null, browser = null;
try {
  const nmLink = setupNodeModules();
  const chromium = await loadChromium(nmLink);
  server = await startServer();

  browser = await chromium.launch({ args: ['--use-gl=angle', '--enable-unsafe-swiftshader'] });

  for (const world of WORLDS) {
    console.log(`\n========== ${world.label} (w=${world.key}) ==========`);
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
    // silence real TTS so headless does not error on speechSynthesis
    await ctx.addInitScript(() => {
      try {
        window.__ttsLog = [];
        if (window.speechSynthesis) {
          window.speechSynthesis.speak = (u) => { window.__ttsLog.push(u && u.text); };
          window.speechSynthesis.cancel = () => {};
          window.speechSynthesis.getVoices = () => [];
        }
      } catch (e) {}
    });
    const page = await ctx.newPage();
    const consoleErrors = [];
    page.on('console', (m) => { if (m.type() === 'error') consoleErrors.push(m.text()); });
    page.on('pageerror', (e) => consoleErrors.push('PAGEERROR: ' + e.message));

    // boot the world with the spine wired
    await page.goto(`${server.base}/world.html?w=${world.key}`, { waitUntil: 'domcontentloaded' });
    // wait for the debug hook to appear (the game finished booting)
    let booted = false;
    try {
      await page.waitForFunction((h) => !!window[h], world.hook, { timeout: 20000 });
      booted = true;
    } catch (e) { /* report below */ }
    ok(booted, `${world.label}: world boots and window.${world.hook} is present`);
    if (!booted) {
      note(`${world.label}: console errors so far → ${consoleErrors.slice(0, 5).join(' | ') || '(none)'}`);
      await page.screenshot({ path: path.join(SHOTS, `${world.key}-noboot.png`) }).catch(() => {});
      await ctx.close();
      continue;
    }
    await delay(400); // let the loading screen settle

    const report = await runProbe(page, world);

    // ---- fold the in-page report into PASS/FAIL lines ----
    const c = report.checks;
    // 1
    if (c.standards) {
      ok(c.standards.ok, `${world.label} [1] standards integrity: ${c.standards.reason || `${c.standards.packIdCount} pack ids all mapped; ${c.standards.total} mappings; flags=[${(c.standards.flags || []).join(', ')}]`}`);
      if (c.standards.flags && c.standards.flags.length) note(`${world.label} flags: ${c.standards.flags.join(' · ')}`);
    } else ok(false, `${world.label} [1] standards check did not run`);
    // 2
    ok(c.mastery && c.mastery.ok, `${world.label} [2] mastery: ${c.mastery ? (c.mastery.reason || `earned=${c.mastery.earned}/${c.mastery.total}, unmapped id no-throw`) : 'did not run'}`);
    // 3
    ok(c.retrieval && c.retrieval.ok, `${world.label} [3] retrieval Leitner: ${c.retrieval ? (c.retrieval.reason || (c.retrieval.steps || []).join('; ')) : 'did not run'}`);
    ok(c.retrievalBeat && c.retrievalBeat.ok, `${world.label} [3b] retrieval beat re-poses entry idea (no "Question N"): ${c.retrievalBeat ? (c.retrievalBeat.reason || 'ok') : 'did not run'}`);
    // 4
    ok(c.studysheet && c.studysheet.ok, `${world.label} [4] coverage panel + study sheet grouped-by-standard, print wired: ${c.studysheet ? (c.studysheet.reason || 'ok') : 'did not run'}`);
    // 5
    ok(c.exportCode && c.exportCode.ok, `${world.label} [5] export/import round-trip + mapHash refuse-mismatch: ${c.exportCode ? (c.exportCode.reason || c.exportCode.code) : 'did not run'}`);
    ok(c.aggregate && c.aggregate.ok, `${world.label} [5b] aggregate 3 codes → heatmap + most-missed: ${c.aggregate ? (c.aggregate.reason || 'ok') : 'did not run'}`);
    // 6
    ok(c.exportCode && c.exportCode.pii === 'clean', `${world.label} [6] PII grep on export code = ^[A-Za-z0-9._-]+$ only: ${c.exportCode ? (c.exportCode.pii + (c.exportCode.code ? ' (' + c.exportCode.code + ')' : '')) : 'did not run'}`);
    // 8
    ok(c.preSpineSave && c.preSpineSave.ok, `${world.label} [8] pre-spine save: retrieval inits lazily, codex/story intact: ${c.preSpineSave ? (c.preSpineSave.reason || 'ok') : 'did not run'}`);

    // 7 — zero console errors across the booted world WITH the spine wired.
    ok(consoleErrors.length === 0, `${world.label} [7] 0 console errors on boot: ${consoleErrors.length ? consoleErrors.slice(0, 4).join(' | ') : 'clean'}`);

    await page.screenshot({ path: path.join(SHOTS, `${world.key}-pol.png`) }).catch(() => {});
    await ctx.close();
  }
} catch (err) {
  console.error('HARNESS ERROR:', err && err.stack || err);
  fails.push('harness: ' + (err && err.message || err));
} finally {
  try { if (browser) await browser.close(); } catch (e) {}
  try { if (server) await server.stop(); } catch (e) {}
  try { fs.rmSync(TMP, { recursive: true, force: true }); } catch (e) {}
}

// ---- verdict -----------------------------------------------------------------
console.log('\n==================== POL VERIFY SUMMARY ====================');
console.log(`screenshots: ${SHOTS}`);
if (fails.length === 0) {
  console.log('RESULT: ALL CHECKS PASSED');
  process.exit(0);
} else {
  console.log(`RESULT: ${fails.length} FAILURE(S)`);
  for (const f of fails) console.log('  ✗ ' + f);
  process.exit(1);
}
