// verify-enl.mjs — headless verification of the ENL support layer in the
// Trade Winds world. Run:  node verify-enl.mjs <repo-root> [live-base-url]
import { chromium } from "/Volumes/CURRICULA/00_ACTIVE_CURRENT_PROJECTS/Review_Arcade/mr-macs-review-arcade-live/node_modules/playwright-core/index.mjs";
import http from "node:http"; import fs from "node:fs"; import path from "node:path";

const ROOT = process.argv[2] || "/tmp/mmw_enl";
const BASE = process.argv[3]; // if provided, test live URL instead of local server
const SHOTS = "/tmp/mmw_enl_shots";
fs.mkdirSync(SHOTS, { recursive: true });
const MIME = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".json": "application/json", ".txt": "text/plain" };

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
const page = await ctx.newPage();
page.on("console", m => { if (m.type() === "error") errs.push(m.text()); });
page.on("pageerror", e => errs.push("PAGEERROR: " + e.message));
const ok = (c, m) => { console.log((c ? "PASS" : "FAIL") + " — " + m); if (!c) fails.push(m); };

// ---- 1. hub copy ----
await page.goto(base + "/index.html", { waitUntil: "networkidle" });
const course = await page.textContent("#card-global9 .card-course");
ok(/9R\s*&\s*ENL/.test(course), "hub card says 9R & ENL: " + course.trim());
const desc = await page.textContent("#card-global9 .card-desc");
ok(/trilingual/i.test(desc) && /中文/.test(desc) && /Español/.test(desc), "hub card mentions trilingual glossary");
ok(!/same calendar|lockstep|shared calendar/i.test(await page.evaluate(() => document.body.innerText)), "no shared-calendar claim on hub");
await page.waitForTimeout(900); // let map thumbnails paint
await page.screenshot({ path: SHOTS + "/01_hub.png" });

// ---- 2. world loads ----
await page.goto(base + "/world.html?w=global9", { waitUntil: "domcontentloaded" });
await page.waitForFunction(() => window.MMW && window.MMW.info, null, { timeout: 60000 });
await page.waitForTimeout(2500); // settle the frame loop
const info0 = await page.evaluate(() => window.MMW.info());
ok(info0.calls > 0 && info0.triangles > 0, `world renders: ${info0.calls} draw calls, ${info0.triangles} tris, ${info0.fps} fps`);
ok(info0.calls < 120, "draw calls within perf budget (<120): " + info0.calls);
await page.screenshot({ path: SHOTS + "/02_world.png" });

// speech availability in this browser (buttons no-op away without it)
const speechOK = await page.evaluate(() => typeof window.speechSynthesis !== "undefined" && typeof window.SpeechSynthesisUtterance !== "undefined");
console.log("INFO — speechSynthesis available in this browser: " + speechOK);

// ---- 3. glossary from the HUD ----
ok(await page.$("#btn-gloss") !== null, "HUD has GLOSSARY button");
await page.click("#btn-gloss");
await page.waitForSelector("#glossary-overlay.open", { timeout: 5000 });
await page.waitForFunction(() => document.querySelectorAll("#glossary-overlay .g-term").length > 0, null, { timeout: 8000 });
const nTerms = await page.$$eval("#glossary-overlay .g-term", e => e.length);
ok(nTerms === 244, "glossary shows all 244 terms: " + nTerms);
const nCats = await page.$$eval("#glossary-overlay .g-cat", e => e.length);
ok(nCats === 9, "glossary shows 9 categories: " + nCats);
const zhVisible = await page.$$eval("#glossary-overlay .g-zh", e => e.length);
ok(zhVisible === 244, "Chinese + pinyin shown by default: " + zhVisible);
if (speechOK) {
  const nRead = await page.$$eval("#glossary-overlay .read-btn", e => e.length);
  ok(nRead >= 488, "speaker buttons on glossary terms (EN + translation): " + nRead);
}
await page.screenshot({ path: SHOTS + "/03_glossary_zh.png" });

// language toggle
await page.click('#glossary-overlay .gloss-lang .tab[data-lang="es"]');
await page.waitForTimeout(300);
const esVisible = await page.$$eval("#glossary-overlay .g-es", e => e.length);
ok(esVisible === 244, "Español toggle swaps translations: " + esVisible);
await page.screenshot({ path: SHOTS + "/04_glossary_es.png" });
await page.click('#glossary-overlay .gloss-lang .tab[data-lang="zh"]');

// search
await page.fill("#gloss-search", "monotheism");
await page.waitForTimeout(400);
const nHits = await page.$$eval("#glossary-overlay .g-term", e => e.length);
ok(nHits >= 1 && nHits < 244, "search filters terms ('monotheism' → " + nHits + ")");
const hitTxt = await page.$eval("#glossary-overlay .g-term .g-en", e => e.textContent);
ok(/monotheism/i.test(hitTxt), "search hit is the right term: " + hitTxt);
await page.screenshot({ path: SHOTS + "/05_glossary_search.png" });
await page.fill("#gloss-search", "");
await page.waitForTimeout(400);

// Esc closes, back to the world in place
await page.keyboard.press("Escape");
await page.waitForTimeout(300);
ok(await page.$("#glossary-overlay.open") === null, "Esc closes the glossary");
ok(!(await page.evaluate(() => document.getElementById("panel-overlay").classList.contains("open"))), "back in the world (no panel open)");

// ---- 4. quiz overlay: speaker button + GLOSSARY button + stacking ----
const mcqId = await page.evaluate(() => window.MMW.stations.list.find(s => s.type === "mcq").id);
await page.evaluate((id) => window.MMW.openStation(id), mcqId);
await page.waitForSelector(".mcq-prompt", { timeout: 15000 });
if (speechOK) {
  ok(await page.$(".mcq-prompt .read-btn") !== null, "quiz question has a read-aloud speaker button");
} else {
  ok(await page.$(".mcq-prompt .read-btn") === null, "no speaker button when speech unavailable (graceful no-op)");
}
ok(await page.$(".panel-head .panel-gloss") !== null, "quiz panel header has GLOSSARY button");
await page.screenshot({ path: SHOTS + "/06_quiz_speaker.png" });

// glossary stacks above the quiz and returns to it
await page.click(".panel-head .panel-gloss");
await page.waitForSelector("#glossary-overlay.open", { timeout: 5000 });
ok(await page.evaluate(() => document.getElementById("panel-overlay").classList.contains("open")), "quiz panel stays open under the glossary");
await page.screenshot({ path: SHOTS + "/07_glossary_over_quiz.png" });
await page.keyboard.press("Escape");
await page.waitForTimeout(300);
ok(await page.$("#glossary-overlay.open") === null, "Esc closes glossary first");
ok(await page.evaluate(() => document.getElementById("panel-overlay").classList.contains("open")), "quiz panel still open after closing glossary");
ok(await page.$(".mcq-prompt") !== null, "quiz question still on screen (returned in place)");
await page.keyboard.press("Escape");
await page.waitForTimeout(300);
ok(!(await page.evaluate(() => document.getElementById("panel-overlay").classList.contains("open"))), "second Esc closes the quiz panel");

// ---- 5. perf unaffected ----
await page.waitForTimeout(800);
const info1 = await page.evaluate(() => window.MMW.info());
ok(Math.abs(info1.calls - info0.calls) <= 5, `draw calls unchanged after glossary use: ${info0.calls} → ${info1.calls}`);

// ---- 6. console errors ----
ok(errs.length === 0, "0 console errors" + (errs.length ? ": " + JSON.stringify(errs.slice(0, 5)) : ""));

console.log("\n==== RESULT ====");
console.log(fails.length ? `FAILED (${fails.length}):\n - ` + fails.join("\n - ") : "ALL PASS");
console.log("console errors:", errs.length);
await browser.close();
if (server) server.close();
process.exit(fails.length ? 1 : 0);
