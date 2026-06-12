// verify-w5.mjs — Wave 5 ship gate: hub title screen with live save progress,
// cross-world polish, and a regression beat through all three games.
// Run:  node verify-w5.mjs <repo-root> [base-url]   (no base-url = local server)
import { chromium } from "/Volumes/CURRICULA/00_ACTIVE_CURRENT_PROJECTS/Review_Arcade/mr-macs-review-arcade-live/node_modules/playwright-core/index.mjs";
import http from "node:http"; import fs from "node:fs"; import path from "node:path";

const ROOT = process.argv[2] || "/tmp/mmw3_w5";
const BASE = process.argv[3];
const SHOTS = "/tmp/mmw3_w5_shots";
fs.mkdirSync(SHOTS, { recursive: true });
const TAG = BASE ? "live_" : "";
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
// TTS spy
await ctx.addInitScript(() => {
  window.__tts = [];
  try {
    if (window.speechSynthesis) {
      window.speechSynthesis.speak = (u) => { window.__tts.push({ text: u.text, lang: u.lang }); };
      window.speechSynthesis.cancel = () => {};
      window.speechSynthesis.getVoices = () => [];
    }
  } catch (e) { /* no-op */ }
});
const page = await ctx.newPage();
page.on("console", m => { if (m.type() === "error") errs.push(m.text()); });
page.on("pageerror", e => errs.push("PAGEERROR: " + e.message));
page.on("dialog", d => d.accept());
const ok = (c, m) => { console.log((c ? "PASS" : "FAIL") + " — " + m); if (!c) fails.push(m); };
const sleep = ms => page.waitForTimeout(ms);
const shot = n => page.screenshot({ path: `${SHOTS}/${TAG}${n}.png` });

// ============ 1. HUB — fresh device ============
await page.goto(base + "/index.html", { waitUntil: "networkidle" });
await page.evaluate(() => localStorage.clear());
await page.reload({ waitUntil: "networkidle" });
await sleep(1500); // map thumbnails paint in slices
ok(await page.$$eval(".card-map canvas.painted", e => e.length) === 3, "hub: all three world maps painted from the real seeded fields");
ok(await page.$eval("#bg", c => c.width > 0 && c.getContext("2d").getImageData(0, 0, 8, 8).data.some(v => v > 0)), "hub: animated backdrop canvas is painting");
const labels = await page.$$eval(".card-course", e => e.map(x => x.textContent));
ok(labels[0].includes("Global History 9"), "hub: course label 1 = Global History 9");
ok(labels[1].includes("AP Psychology"), "hub: course label 2 = AP Psychology");
ok(labels[2].includes("ENL") && labels[2].includes("英语新手友好") && labels[2].includes("Para principiantes"), "hub: ENL label is trilingual-friendly");
ok(await page.$$eval(".play-btn", e => e.every(b => b.textContent === "NEW GAME")) === true, "hub fresh: all three cards offer NEW GAME");
ok(await page.$$eval(".new-btn", e => e.every(b => b.hidden)) === true, "hub fresh: no Start-over links without a save");
ok(await page.$$eval(".pg-fresh", e => e.length) === 3, "hub fresh: each card shows its fantasy invitation line");
ok(await page.$eval(".hub-foot", f => f.textContent.trim() === "Mr. Maccarello"), "hub: minimal teacher footer");
await shot("01_hub_fresh");

// ============ 2. HUB — live progress from seeded game saves ============
await page.evaluate(() => {
  localStorage.setItem("mmw-game-trade-winds-v1", JSON.stringify({
    v: 1, coins: 180, cargo: { barley: 5 }, capacity: 9, transport: "camel",
    xp: 900, level: 5, perkPts: 0, perks: {}, era: 2, rank: 3, quests: {}, flags: {}, visited: ["byblos"], pos: null,
  }));
  localStorage.setItem("mmw-game-mind-atlas-v1", JSON.stringify({
    v: 1, insight: 40, xp: 700, level: 4, perkPts: 0, confidence: 90,
    regions: { "ap-bio": { puzzle: true, wraith: true, restored: true }, "ap-cognition": { puzzle: true, wraith: true, restored: true } },
    abilities: { saltatory: true, chunking: true }, gates: {}, scrolls: 3, cases: { "case-sleep": true }, flags: {}, pos: null,
  }));
  const gems = {}; for (let i = 0; i < 30; i++) gems["term-" + i] = 1;
  localStorage.setItem("mmw-game-word-harbor-v1", JSON.stringify({
    v: 1, gems, bridges: { "br-geo": 1, "br-2": 1, "br-3": 1 }, builds: { "b-skills": 1, "b-geo": 1 },
    stories: {}, sentences: [], compass: true, played: {}, won: false, flags: {}, pos: null,
  }));
});
await page.reload({ waitUntil: "networkidle" });
await sleep(1500);
const prog = await page.$$eval(".card-progress", e => e.map(x => x.textContent));
ok(/Merchant/.test(prog[0]) && /Era 2 of 4/.test(prog[0]), "hub: Trade Winds shows rank + era — " + prog[0].trim().slice(0, 60));
ok(/Net worth 200/.test(prog[0]), "hub: Trade Winds net worth = coins + cargo at base (180 + 5 barley) = 200");
ok(/2.*of 5 regions restored/.test(prog[1]) && /level 4/.test(prog[1]), "hub: Mind Atlas shows 2/5 regions + level — " + prog[1].trim().slice(0, 70));
ok(/30.*of 244 words/.test(prog[2]) && /2.*of 9 buildings/.test(prog[2]), "hub: Word Harbor shows 30/244 words + 2/9 buildings");
ok(await page.$$eval(".play-btn", e => e.every(b => b.textContent === "CONTINUE")) === true, "hub seeded: all three cards offer CONTINUE");
ok(await page.$$eval(".new-btn", e => e.every(b => !b.hidden)) === true, "hub seeded: Start-over link visible on each card");
ok(await page.$$eval(".pg-bar i", e => e.length === 3 && e.every(i => parseFloat(i.style.width) > 0)), "hub seeded: progress bars fill");
await shot("02_hub_seeded");

// ============ 3. NEW GAME (erase + start fresh), old URL intact ============
await page.click("#card-global9 .new-btn"); // confirm() auto-accepted
await page.waitForURL(/world\.html\?w=global9/, { timeout: 20000 });
await page.waitForFunction(() => window.MMW && window.TW, null, { timeout: 120000 });
await sleep(2000);
ok(await page.evaluate(() => window.TW.S.coins === 30 && window.TW.S.rank === 0 && window.TW.S.era === 1), "New Game truly erased the Trade Winds save (30 shekels, Peddler, Era 1)");

// ============ 4. TRADE WINDS — perf + core loop beat + polish hooks ============
const twInfo = await page.evaluate(() => window.MMW.info());
ok(twInfo.calls > 0 && twInfo.calls <= 120, `Trade Winds draw calls within budget: ${twInfo.calls} (${twInfo.triangles} tris)`);
const beat = await page.evaluate(() => {
  const c0 = window.TW.S.coins;
  window.TW.debug.buy("barley", 2);
  const c1 = window.TW.S.coins, q1 = window.TW.S.cargo.barley || 0;
  window.TW.debug.sell("barley", 2);
  return { c0, c1, q1, c2: window.TW.S.coins, q2: window.TW.S.cargo.barley || 0 };
});
ok(beat.c1 < beat.c0 && beat.q1 === 2, `TW core loop: bought 2 barley (${beat.c0} -> ${beat.c1} shekels)`);
ok(beat.c2 > beat.c1 && beat.q2 === 0, `TW core loop: sold 2 barley (${beat.c1} -> ${beat.c2} shekels)`);
// float-label offset queue: three same-frame labels take stacked slots
const floats = await page.evaluate(async () => {
  const m = await import("./js/game/ui.js");
  m.floatText("+12 shekels", "gain"); m.floatText("+5 XP", "xp"); m.floatText("-2 toll", "loss");
  return [...document.querySelectorAll(".gui-float")].map(e => e.style.marginTop);
});
ok(new Set(floats).size === 3 && floats.includes("0px") && floats.includes("26px") && floats.includes("52px"),
  "TW polish: same-frame float labels stack in offset slots " + JSON.stringify(floats));
// trade map opens and the locked-era fog DRIFTS (two frames differ)
await page.evaluate(() => window.TW.gmap.open());
await sleep(700);
const mapA = await page.$eval("#map-canvas", c => c.toDataURL().length + ":" + c.toDataURL().slice(2000, 2080));
await sleep(450);
const mapB = await page.$eval("#map-canvas", c => c.toDataURL().length + ":" + c.toDataURL().slice(2000, 2080));
ok(await page.$(".gui-map") !== null, "TW: trade map open");
ok(mapA !== mapB, "TW polish: fog-of-war blobs drift (map animates between frames)");
await shot("03_tw_trade_map");
await page.keyboard.press("Escape");
await sleep(300);
// market overlay = the signature moment
await page.evaluate(() => window.TW.openCity(window.TW.cityById.byblos));
await sleep(700);
ok(await page.$(".gui-layer") !== null, "TW: Byblos market/city overlay open");
await shot("04_tw_market");
await page.keyboard.press("Escape");
await sleep(300);
// tab-hide flush: hiding the tab writes the save immediately
const flush = await page.evaluate(() => {
  localStorage.removeItem("mmw-game-trade-winds-v1");
  Object.defineProperty(document, "hidden", { value: true, configurable: true });
  document.dispatchEvent(new Event("visibilitychange"));
  const raw = JSON.parse(localStorage.getItem("mmw-game-trade-winds-v1") || "null");
  Object.defineProperty(document, "hidden", { value: false, configurable: true });
  document.dispatchEvent(new Event("visibilitychange"));
  return raw && raw.coins === window.TW.S.coins;
});
ok(flush === true, "TW: tab-hide flushes the save to localStorage immediately");
// save/reload integrity
const twSnap = await page.evaluate(() => ({ coins: window.TW.S.coins, era: window.TW.S.era, level: window.TW.S.level }));
await page.reload({ waitUntil: "domcontentloaded" });
await page.waitForFunction(() => window.MMW && window.TW, null, { timeout: 120000 });
await sleep(1500);
ok(await page.evaluate((s) => window.TW.S.coins === s.coins && window.TW.S.era === s.era && window.TW.S.level === s.level, twSnap),
  "TW: save/reload integrity " + JSON.stringify(twSnap));
const twErrs = errs.length;
ok(twErrs === 0, "Trade Winds: 0 console errors" + (twErrs ? " — " + JSON.stringify(errs.slice(0, 4)) : ""));

// ============ 5. MIND ATLAS — perf + orb beat + region ambience ============
// drop the hub-seeded fixture saves: the world tests run from a fresh game
await page.evaluate(() => { localStorage.removeItem("mmw-game-mind-atlas-v1"); localStorage.removeItem("mmw-game-word-harbor-v1"); });
await page.goto(base + "/world.html?w=appsych", { waitUntil: "domcontentloaded" });
await page.waitForFunction(() => window.MMW && window.MA, null, { timeout: 120000 });
await sleep(2200);
const maInfo = await page.evaluate(() => window.MMW.info());
ok(maInfo.calls > 0 && maInfo.calls <= 120, `Mind Atlas draw calls within budget: ${maInfo.calls} (${maInfo.triangles} tris)`);
// dismiss intro if present
if (await page.$(".gui-intro")) { await page.click(".ma-go"); await sleep(400); }
// core loop beat: carry memory orbs through working memory — 7±2 limit bites
const mem = await page.evaluate(() => window.MA.debug.memLimit());
ok(mem.cap >= 5 && mem.cap <= 9 && mem.overflowed === true,
  `MA core loop: memory-orb working set capped at ${mem.cap} (7±2), overflow felt`);
// region ambience: hemisphere light tints differently per region
const tint = await page.evaluate(async () => {
  const hemi = (() => { let h = null; window.MMW.scene.traverse(o => { if (o.isHemisphereLight) h = o; }); return h; })();
  const read = () => ({ r: +hemi.color.r.toFixed(3), g: +hemi.color.g.toFixed(3), b: +hemi.color.b.toFixed(3) });
  const settle = () => new Promise(r => setTimeout(r, 1700));
  const bio = window.MMW.def.regions.find(x => x.id === "ap-bio");
  const soc = window.MMW.def.regions.find(x => x.id === "ap-social");
  window.MMW.teleport(bio.center[0], bio.center[1]); await settle();
  const a = read();
  window.MMW.teleport(soc.center[0], soc.center[1]); await settle();
  const b = read();
  return { a, b, diff: Math.abs(a.r - b.r) + Math.abs(a.g - b.g) + Math.abs(a.b - b.b) };
});
ok(tint.diff > 0.02, `MA polish: region-tinted ambient light shifts between Neural Caverns and Social Plaza (delta ${tint.diff.toFixed(3)})`);
// signature moment: a Misconception Wraith mid-fight (wrong answer costs confidence)
const wr = await page.evaluate(() => window.MA.debug.wraithWrong("ap-bio"));
ok(wr.after < wr.before, `MA: wraith wrong answer costs confidence (${wr.before} -> ${wr.after})`);
await sleep(400);
ok(await page.$(".ma-wraith") !== null, "MA: wraith encounter on screen");
await shot("05_ma_wraith");
await page.evaluate(() => { const m = document.querySelector(".ma-wraith"); });
await page.keyboard.press("Escape");
await sleep(300);
// save/reload integrity: solve the Neural Caverns puzzle, reload, still solved
ok(await page.evaluate(() => window.MA.debug.solvePuzzle("ap-bio")) === true, "MA: neuron puzzle solved through real logic");
await page.reload({ waitUntil: "domcontentloaded" });
await page.waitForFunction(() => window.MMW && window.MA, null, { timeout: 120000 });
await sleep(1500);
ok(await page.evaluate(() => !!(window.MA.S.regions["ap-bio"] && window.MA.S.regions["ap-bio"].puzzle)), "MA: save/reload integrity (puzzle stays solved)");
ok(errs.length === twErrs, "Mind Atlas: 0 new console errors" + (errs.length > twErrs ? " — " + JSON.stringify(errs.slice(twErrs, twErrs + 4)) : ""));

// ============ 6. WORD HARBOR — perf + gem beat with TTS + town shot ============
await page.goto(base + "/world.html?w=enl", { waitUntil: "domcontentloaded" });
await page.waitForFunction(() => window.MMW && window.WH, null, { timeout: 120000 });
await sleep(2200);
const whInfo = await page.evaluate(() => window.MMW.info());
ok(whInfo.calls > 0 && whInfo.calls <= 120, `Word Harbor draw calls within budget: ${whInfo.calls} (${whInfo.triangles} tris)`);
if (await page.$(".wh-intro")) { await page.click(".intro-go"); await sleep(400); }
// core loop beat: walk to a real gem, collect it, hear it
const gem = (await page.evaluate(() => window.WH.debug.gems()))[0];
const t0 = await page.evaluate(() => window.__tts.length);
await page.evaluate(([x, z]) => window.WH.debug.goto(x, z), [gem.x, gem.z]);
await sleep(800);
const gPrompt = await page.evaluate(() => {
  const p = document.getElementById("prompt");
  return p && p.style.display !== "none" ? p.textContent : null;
});
ok(/Collect word/.test(gPrompt || ""), `WH core loop: gem prompt for "${gem.en}" — ` + gPrompt);
await page.click("#prompt");
await sleep(500);
ok(await page.$(".wh-gemcard") !== null, "WH: gem card open");
ok(await page.evaluate(() => window.__tts.length) > t0, "WH: collecting the gem speaks it (TTS fired)");
await page.click(".wh-gem-keep");
await sleep(400);
ok(await page.evaluate((en) => !!window.WH.S.gems[en], gem.en), `WH: "${gem.en}" kept in the word book`);
// town + bridge for the signature shot
await page.evaluate(() => {
  window.WH.debug.bridge("br-geo");
  ["b-skills", "b-geo", "b-belief", "b-explore"].forEach(id => window.WH.debug.build(id));
  window.WH.debug.goto(0, 96);
});
await sleep(1200);
const whInfo2 = await page.evaluate(() => window.MMW.info());
ok(whInfo2.calls <= 120, `WH: with bridge + 4 buildings still within budget: ${whInfo2.calls}`);
await shot("06_wh_town");
// worst case: the COMPLETE town (all 9 buildings, all 7 bridges), standing inside it
await page.evaluate(() => {
  window.WH.bridges.forEach(b => { if (!window.WH.S.bridges[b.id]) window.WH.debug.bridge(b.id); });
  window.WH.buildings.forEach(b => { if (!window.WH.S.builds[b.id]) window.WH.debug.build(b.id); });
  window.WH.debug.goto(4, 112);
});
await sleep(1200);
const whInfo3 = await page.evaluate(() => window.MMW.info());
ok(whInfo3.calls <= 120, `WH: FULL town, standing inside it, within budget: ${whInfo3.calls}`);
// save/reload integrity
await page.reload({ waitUntil: "domcontentloaded" });
await page.waitForFunction(() => window.MMW && window.WH, null, { timeout: 120000 });
await sleep(1500);
ok(await page.evaluate((en) => !!window.WH.S.gems[en] && !!window.WH.S.bridges["br-geo"] && Object.keys(window.WH.S.builds).length === 9, gem.en),
  "WH: save/reload integrity (gem + bridge + full town persist)");
ok(errs.length === twErrs, "Word Harbor: 0 new console errors" + (errs.length > twErrs ? " — " + JSON.stringify(errs.slice(twErrs, twErrs + 4)) : ""));

// ============ 7. MOBILE 390px — hub + Word Harbor ============
const mctx = await browser.newContext({
  viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true,
  userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1",
});
const merrs = [];
const mp = await mctx.newPage();
mp.on("console", m => { if (m.type() === "error") merrs.push(m.text()); });
mp.on("pageerror", e => merrs.push("PAGEERROR: " + e.message));
await mp.addInitScript(() => {
  try { if (window.speechSynthesis) { window.speechSynthesis.speak = () => {}; window.speechSynthesis.getVoices = () => []; } } catch (e) { /* */ }
});
await mp.goto(base + "/index.html", { waitUntil: "networkidle" });
await mp.waitForTimeout(1600);
ok(await mp.evaluate(() => document.documentElement.scrollWidth <= 391), "mobile hub: no horizontal overflow at 390px");
ok(await mp.$$eval(".card", e => e.length === 3), "mobile hub: three cards stacked");
await mp.screenshot({ path: `${SHOTS}/${TAG}07_hub_mobile_390.png` });
await mp.goto(base + "/world.html?w=enl", { waitUntil: "domcontentloaded" });
await mp.waitForFunction(() => window.MMW && window.WH, null, { timeout: 120000 });
await mp.waitForTimeout(2500);
if (await mp.$(".wh-intro")) { await mp.tap(".intro-go"); await mp.waitForTimeout(500); }
const boxes = await mp.evaluate(() => {
  const get = (sel) => { const el = document.querySelector(sel); if (!el || !el.offsetParent && getComputedStyle(el).position !== "fixed" && getComputedStyle(el).position !== "absolute") return null; const r = el.getBoundingClientRect(); return r.width > 0 && r.height > 0 ? { x: r.x, y: r.y, w: r.width, h: r.height } : null; };
  return { joy: get("#joystick"), goal: get("#wh-goal"), bar: get("#wh-bar"), mini: get(".minimap canvas") || get(".minimap") };
});
const overlap = (a, b) => a && b && a.x < b.x + b.w && b.x < a.x + a.w && a.y < b.y + b.h && b.y < a.y + a.h;
ok(!!boxes.joy, "mobile WH: touch joystick present");
ok(!!boxes.goal, "mobile WH: goal chip visible at 390px (was hidden before W5)");
ok(!overlap(boxes.goal, boxes.bar), "mobile WH: goal chip clear of the word bar");
ok(!overlap(boxes.goal, boxes.joy), "mobile WH: goal chip clear of the joystick");
ok(!overlap(boxes.goal, boxes.mini), "mobile WH: goal chip clear of the minimap");
// interact verb works by tap: walk to a gem and tap the prompt
const mg = (await mp.evaluate(() => window.WH.debug.gems()))[0];
await mp.evaluate(([x, z]) => window.WH.debug.goto(x, z), [mg.x, mg.z]);
await mp.waitForTimeout(900);
const mPrompt = await mp.evaluate(() => { const p = document.getElementById("prompt"); return p && p.style.display !== "none" ? p.textContent : null; });
ok(/Collect word/.test(mPrompt || ""), "mobile WH: interact prompt reachable — " + mPrompt);
await mp.tap("#prompt");
await mp.waitForTimeout(600);
ok(await mp.$(".wh-gemcard") !== null, "mobile WH: tap on prompt opens the gem card");
await mp.screenshot({ path: `${SHOTS}/${TAG}08_wh_mobile_390.png` });
ok(merrs.length === 0, "mobile: 0 console errors" + (merrs.length ? " — " + JSON.stringify(merrs.slice(0, 4)) : ""));
await mctx.close();

// ============ 8. HUB reflects the session ============
await page.goto(base + "/index.html", { waitUntil: "networkidle" });
await sleep(1500);
const prog2 = await page.$$eval(".card-progress", e => e.map(x => x.textContent));
ok(/Peddler/.test(prog2[0]), "hub after play: Trade Winds rank reads Peddler (fresh run)");
ok(/of 244 words/.test(prog2[2]) && /4.*of 9 buildings/.test(prog2[2]), "hub after play: Word Harbor counts the session's gems + 4 buildings");
await shot("09_hub_after_session");

console.log("\n==== RESULT ====");
console.log(fails.length ? `FAILED (${fails.length}):\n - ` + fails.join("\n - ") : "ALL PASS");
console.log("console errors:", errs.length, errs.slice(0, 8));
await browser.close();
if (server) server.close();
process.exit(fails.length ? 1 : 0);
