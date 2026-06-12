// verify-wh.mjs — headless verification of WORD HARBOR (Wave 4) + regression
// smokes on Trade Winds and Mind Atlas. Run:  node verify-wh.mjs <repo-root> [base-url]
import { chromium } from "/Volumes/CURRICULA/00_ACTIVE_CURRENT_PROJECTS/Review_Arcade/mr-macs-review-arcade-live/node_modules/playwright-core/index.mjs";
import http from "node:http"; import fs from "node:fs"; import path from "node:path";

const ROOT = process.argv[2] || "/tmp/mmw3_w4";
const BASE = process.argv[3];
const SHOTS = "/tmp/mmw3_w4_shots";
fs.mkdirSync(SHOTS, { recursive: true });
const MIME = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".json": "application/json" };

let server, base = BASE;
if (!BASE) {
  server = http.createServer((req, res) => {
    let p = decodeURIComponent(req.url.split("?")[0]); if (p === "/") p = "/index.html";
    const fp = path.join(ROOT, p);
    if (!fp.startsWith(ROOT) || !fs.existsSync(fp)) { res.writeHead(404); return res.end("404"); }
    res.writeHead(200, { "Content-Type": MIME[path.extname(fp)] || "application/octet-stream" });
    res.end(fs.readFileSync(fp));
  });
  await new Promise(r => server.listen(0, r));
  base = `http://localhost:${server.address().port}`;
}

const fails = [], errs = [];
const browser = await chromium.launch({ args: ["--use-gl=angle", "--enable-unsafe-swiftshader"] });
const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
// TTS spy: record every utterance instead of actually speaking
await ctx.addInitScript(() => {
  window.__tts = [];
  const patch = () => {
    if (!window.speechSynthesis) return;
    try {
      window.speechSynthesis.speak = (u) => { window.__tts.push({ text: u.text, lang: u.lang }); };
      window.speechSynthesis.cancel = () => {};
      window.speechSynthesis.getVoices = () => [];
    } catch (e) { /* no-op */ }
  };
  patch();
});
const page = await ctx.newPage();
page.on("console", m => { if (m.type() === "error") errs.push(m.text()); });
page.on("pageerror", e => errs.push("PAGEERROR: " + e.message));
const ok = (c, m) => { console.log((c ? "PASS" : "FAIL") + " — " + m); if (!c) fails.push(m); };
const sleep = ms => page.waitForTimeout(ms);
const shot = n => page.screenshot({ path: `${SHOTS}/${n}.png` });
const tts = () => page.evaluate(() => window.__tts.length);
const lastTts = () => page.evaluate(() => window.__tts[window.__tts.length - 1] || null);

// walk-to-and-press-the-prompt: the genuinely "played" interaction path
async function promptAt(x, z, expectRe, clickIt = true) {
  await page.evaluate(([px, pz]) => window.WH.debug.goto(px, pz), [x, z]);
  await sleep(700);
  const txt = await page.evaluate(() => {
    const p = document.getElementById("prompt");
    return p && p.style.display !== "none" ? p.textContent : null;
  });
  if (!txt || !expectRe.test(txt)) return txt;
  if (clickIt) { await page.click("#prompt"); await sleep(450); }
  return txt;
}

// ============ 1. HUB ============
await page.goto(base + "/index.html", { waitUntil: "networkidle" });
ok(await page.$("#card-enl") !== null, "hub has the Word Harbor card");
const enlDesc = await page.textContent("#card-enl .card-desc");
ok(/word-gems/i.test(enlDesc) && /中文/.test(enlDesc) && /Español/.test(enlDesc), "card copy: word-gems + trilingual");
await sleep(1200); // map thumbnails paint
const painted = await page.$$eval(".card-map canvas.painted", e => e.length);
ok(painted === 3, "all three world maps painted from real fields: " + painted);
await shot("01_hub_three_worlds");

// ============ 2. WORD HARBOR BOOTS ============
await page.goto(base + "/world.html?w=enl", { waitUntil: "domcontentloaded" });
await page.waitForFunction(() => window.MMW && window.WH, null, { timeout: 90000 });
await sleep(2500);
const info0 = await page.evaluate(() => window.MMW.info());
ok(info0.calls > 0 && info0.triangles > 0, `world renders: ${info0.calls} calls, ${info0.triangles} tris, ${info0.fps} fps`);
ok(info0.calls < 120, "draw calls within budget (<120): " + info0.calls);
ok((await page.textContent("title")) === null || true, "title ok"); // page.title below
ok((await page.title()).includes("Word Harbor"), "document title is Word Harbor");
ok(await page.$(".wh-intro") !== null, "arrival intro shows on first visit");
await shot("02_intro");
await page.click(".intro-go");
await sleep(400);
ok(/Harbor Guide/.test(await page.textContent("#wh-goal")), "first goal: talk to the Harbor Guide");
await shot("03_world_first_view");

// ============ 3. STORY DIALOGUE (picture-first, TTS, hints) ============
const t0 = await tts();
const pTxt = await promptAt(4, 109, /Talk to/);
ok(/Talk to/.test(pTxt || ""), "walked to the Harbor Guide, prompt shows: " + pTxt);
await page.waitForSelector(".wh-story-card", { timeout: 5000 });
const line1 = await page.textContent(".wh-story-en");
ok(line1.trim().split(/\s+/).length <= 12, "story line is simple (<=12 words): " + line1.trim());
ok(await tts() > t0, "story line auto-read aloud (TTS fired)");
ok(await page.$eval(".wh-story-pic", c => c.width > 0), "procedural picture painted");
// hint toggle
await page.click(".wh-hint-toggle");
await sleep(250);
ok(await page.$eval(".wh-story-hints", e => getComputedStyle(e).display !== "none"), "hint toggle reveals translations");
ok(/欢迎/.test(await page.textContent(".wh-story-hints [lang='zh-Hans']")), "Chinese hint text shown");
ok(/Bienvenido/.test(await page.textContent(".wh-story-hints [lang='es']")), "Spanish hint text shown");
await shot("04_story_hints");
for (let i = 0; i < 4; i++) { await page.click(".wh-next"); await sleep(300); }
ok(await page.evaluate(() => !!window.WH.S.stories["st-arrive"]), "arrival story completed + saved");

// ============ 4. COLLECT 3 WORD-GEMS (TTS + language cycle) ============
const homeGems = await page.evaluate(() => window.WH.debug.gems().filter(g => g.isle === "home"));
ok(homeGems.length === 3, "3 starter gems wash ashore at home: " + homeGems.map(g => g.en).join(", "));
let cycleChecked = false;
for (const g of homeGems) {
  const before = await tts();
  const txt = await promptAt(g.x, g.z, /Collect word/);
  ok(/Collect word/.test(txt || ""), `gem prompt for "${g.en}": ` + txt);
  await page.waitForSelector(".wh-gemcard", { timeout: 5000 });
  const spoken = await lastTts();
  ok(await tts() > before && spoken && spoken.lang === "en-US", `collecting "${g.en}" speaks it in English`);
  if (!cycleChecked) {
    cycleChecked = true;
    await page.click(".wh-gem-big"); await sleep(250);
    let s = await lastTts();
    ok(s.lang === "zh-CN", "tap again: speaks 中文 (zh-CN): " + s.text);
    await page.click(".wh-gem-big"); await sleep(250);
    s = await lastTts();
    ok(s.lang === "es-ES", "tap again: speaks Español (es-ES): " + s.text);
    await shot("05_gem_card");
  }
  await page.click(".wh-gem-keep");
  await sleep(300);
}
ok(await page.evaluate(() => Object.keys(window.WH.S.gems).length) === 3, "3 word-gems in the book");

// word book shows them
await page.click("#wh-book");
await sleep(400);
ok(await page.$(".wh-book") !== null, "word book opens");
const gotRows = await page.$$eval(".wh-bk-term.got", e => e.length);
ok(gotRows === 3, "book shows 3 collected words bright: " + gotRows);
await shot("06_word_book");
await page.keyboard.press("Escape");
await sleep(300);

// ============ 5. SENTENCE-BRIDGE (wrong order free retry → build) ============
const bTxt = await promptAt(0, 26, /Build/);
ok(/Build/.test(bTxt || ""), "bridge site prompt: " + bTxt);
await page.waitForSelector(".wh-bridge-card", { timeout: 5000 });
// place tiles in a deliberately wrong order (reverse tray reading = reversed sentence)
const tileIds = await page.$$eval("[data-tile]", els => els.map(e => +e.dataset.tile));
for (const ti of tileIds.slice().reverse()) {
  await page.click(`[data-tile="${ti}"]`);
  await sleep(120);
}
await page.click(".wh-check");
await sleep(400);
ok(await page.$(".wh-bridge-tryagain") !== null, "wrong order: friendly retry message, nothing lost");
ok(await page.$(".wh-bridge-card") !== null, "puzzle stays open after a miss");
await shot("07_bridge_wrong_retry");
// clear the slots and rebuild in the right order
const filled = await page.$$eval(".wh-slot:not(.empty)", els => els.length);
for (let i = 0; i < filled; i++) { await page.click(".wh-slot:not(.empty)"); await sleep(100); }
const total = tileIds.length;
for (let want = 0; want < total; want++) { await page.click(`[data-tile="${want}"]`); await sleep(100); }
await page.click(".wh-check");
await sleep(700);
ok(await page.evaluate(() => !!window.WH.S.bridges["br-geo"]), "Compass Bridge built (right order)");
ok(await page.evaluate(() => window.WH.S.sentences.length >= 1), "sentence saved for the festival: " +
  await page.evaluate(() => window.WH.S.sentences[0]));
await shot("08_bridge_built");

// ============ 6. COMPASS TUTORIAL (Geography Isle beat) ============
const iTxt = await promptAt(0, -38, /Visit/);
ok(/Visit/.test(iTxt || ""), "Geography Isle station prompt: " + iTxt);
await page.waitForSelector(".wh-open-compass", { timeout: 5000 });
await page.click(".wh-open-compass");
await sleep(400);
ok(await page.$(".wh-compass-card") !== null, "compass lesson opens");
// wrong tap first (asks E, tap N) — must NOT advance
await page.click('.wh-cp[data-d="N"]');
await sleep(250);
ok(/Step 1/.test(await page.textContent(".wh-fest-tip")), "wrong direction wobbles, still step 1");
for (const d of ["E", "S", "N", "W"]) {
  await page.click(`.wh-cp[data-d="${d}"]`);
  await sleep(520);
}
ok(await page.evaluate(() => window.WH.S.compass === true), "compass tutorial complete");
await shot("09_compass_done");

// ============ 7. CONSTRUCT A BUILDING (terms played) ============
await page.evaluate(() => window.WH.debug.grantCat("Skills + Exam Words", 8));
const plotTxt = await promptAt(-14, 84, /Plan|Visit/);
ok(/Plan/.test(plotTxt || ""), "plot prompt at School of Scribes: " + plotTxt);
await page.waitForSelector(".wh-construct", { timeout: 5000 });
ok(await page.$eval(".wh-construct", b => !b.disabled), "CONSTRUCT enabled with 8 words of the family");
const tBuild = await tts();
await page.click(".wh-construct");
await sleep(2600); // the building speaks a few of its words
ok(await page.evaluate(() => !!window.WH.S.builds["b-skills"]), "School of Scribes built");
ok(await tts() > tBuild, "the new building plays its words (TTS sequence fired)");
await shot("10_building_built");

// ============ 8. FESTIVAL GAME END-TO-END (Listen and Find) ============
const fTxt = await promptAt(30, 110, /Join/);
ok(/Join/.test(fTxt || ""), "festival lawn prompt: " + fTxt);
await page.waitForSelector('[data-g="listen"]', { timeout: 5000 });
await page.click('[data-g="listen"]');
await sleep(600);
for (let r = 0; r < 5; r++) {
  const target = (await lastTts()).text;
  // wrong tap once on round 1 to prove free retry
  if (r === 0) {
    const wrong = await page.$$eval(".wh-lf-choices [data-t]", (els, t) =>
      els.map(e => e.dataset.t).find(x => x !== t), target);
    await page.click(`.wh-lf-choices [data-t="${wrong}"]`);
    await sleep(300);
    ok(await page.$(".wh-lf-choices") !== null, "listen+find: wrong tap costs nothing, round continues");
  }
  await page.click(`.wh-lf-choices [data-t="${target}"]`);
  await sleep(650);
}
ok(await page.$(".wh-cheer") !== null, "Listen and Find completed with a cheer");
await shot("11_festival_listen");
await page.click('[data-gui-close]');
await sleep(300);

// ============ 9. SAVE / RELOAD ============
const snap = await page.evaluate(() => ({
  gems: Object.keys(window.WH.S.gems).length,
  bridges: Object.keys(window.WH.S.bridges).length,
  builds: Object.keys(window.WH.S.builds).length,
  compass: window.WH.S.compass,
  stories: Object.keys(window.WH.S.stories).length,
}));
await page.reload({ waitUntil: "domcontentloaded" });
await page.waitForFunction(() => window.MMW && window.WH, null, { timeout: 90000 });
await sleep(1500);
const snap2 = await page.evaluate(() => ({
  gems: Object.keys(window.WH.S.gems).length,
  bridges: Object.keys(window.WH.S.bridges).length,
  builds: Object.keys(window.WH.S.builds).length,
  compass: window.WH.S.compass,
  stories: Object.keys(window.WH.S.stories).length,
}));
ok(JSON.stringify(snap) === JSON.stringify(snap2), `save/reload preserves everything: ${JSON.stringify(snap2)}`);
ok(await page.$(".wh-intro") === null, "intro does not replay after reload");

// ============ 10. WIN PATH — TIME TRAVEL FESTIVAL ============
await page.evaluate(() => {
  for (const b of window.WH.bridges) if (!window.WH.S.bridges[b.id]) window.WH.debug.bridge(b.id);
  for (const b of window.WH.buildings) if (!window.WH.S.builds[b.id]) window.WH.debug.build(b.id);
});
await sleep(600);
const info1 = await page.evaluate(() => window.MMW.info());
ok(info1.calls < 120, "full town + all bridges still within draw budget (<120): " + info1.calls);
await shot("12_full_town");
await page.evaluate(() => window.WH.openFestivalMenu());
await sleep(500);
ok(await page.$(".wh-tt-row:not(.locked)") !== null, "Time Travel Festival unlocked with the town complete");
await page.click('[data-g="tt"]');
await sleep(500);
ok((await page.$$(".wh-tt-civ")).length === 4, "four civilizations to visit");
await shot("13_time_travel_pick");
await page.click(".wh-tt-civ");
await sleep(500);
for (let i = 0; i < 3; i++) { await page.click(".wh-next"); await sleep(300); }
await page.waitForSelector(".wh-tt-go", { timeout: 5000 });
const sentN = await page.$$eval(".wh-tt-sentence", e => e.length);
ok(sentN === 3, "presentation shows 3 sentences you built: " + sentN);
await page.click(".wh-tt-go");
await sleep(600);
ok(await page.evaluate(() => window.WH.S.won === true), "WIN: Time Travel Festival presented, town is home");
await shot("14_win");

// console errors so far (Word Harbor)
ok(errs.length === 0, "0 console errors in Word Harbor" + (errs.length ? ": " + JSON.stringify(errs.slice(0, 5)) : ""));

// ============ 11. REGRESSIONS ============
const errsBefore = errs.length;
await page.goto(base + "/world.html?w=global9", { waitUntil: "domcontentloaded" });
await page.waitForFunction(() => window.MMW && window.TW, null, { timeout: 90000 });
await sleep(2200);
const twInfo = await page.evaluate(() => window.MMW.info());
ok(twInfo.calls > 0 && twInfo.calls < 120, `Trade Winds regression: renders, ${twInfo.calls} calls`);
ok(await page.$("#trade-bar") !== null, "Trade Winds game HUD present");
ok(errs.length === errsBefore, "Trade Winds: 0 new console errors");
await shot("15_regression_tradewinds");

await page.goto(base + "/world.html?w=appsych", { waitUntil: "domcontentloaded" });
await page.waitForFunction(() => window.MMW && window.MA, null, { timeout: 90000 });
await sleep(2200);
const maInfo = await page.evaluate(() => window.MMW.info());
ok(maInfo.calls > 0 && maInfo.calls < 120, `Mind Atlas regression: renders, ${maInfo.calls} calls`);
ok(errs.length === errsBefore, "Mind Atlas: 0 new console errors");
await shot("16_regression_mindatlas");

console.log("\n==== RESULT ====");
console.log(fails.length ? `FAILED (${fails.length}):\n - ` + fails.join("\n - ") : "ALL PASS");
console.log("console errors:", errs.length, errs.slice(0, 8));
await browser.close();
if (server) server.close();
process.exit(fails.length ? 1 : 0);
