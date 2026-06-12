# Mr. Mac's Worlds

**Three real games — one per class.** Seeded, procedurally generated 3D
worlds where *knowing the course material is the game mechanic*: knowledge
makes you richer, stronger, and faster inside the game verbs, never a quiz
that interrupts them. Fully static (GitHub Pages), no logins, no accounts,
no build step — three.js via CDN importmap and vanilla ES modules, tuned for
60 fps on school Chromebooks and phones.

| World | Course | Genre | URL |
|---|---|---|---|
| **Trade Winds** | Global History 9 | trading-empire game | `world.html?w=global9` |
| **Mind Atlas** | AP Psychology (2024 CED) | mind-delver action-puzzle | `world.html?w=appsych` |
| **Word Harbor** | Global 9 ENL · 英语新手友好 · Para principiantes | gentle builder-collector | `world.html?w=enl` |

The hub (`index.html`) is a game title screen: an animated dusk diorama,
three world cards with **live progress read from each game's save** (rank /
era / net worth · regions restored · words + buildings), and a
Continue / New-Game choice per world. Design doc: `docs/GAME_DESIGN.md`.

---

## The three games

### Trade Winds — *Global History 9*
Start in 3000 BCE with one donkey and thirty shekels; end with a trade empire
spanning 4,500 years. Nine real cities with live markets and historically
true price spreads; quest chains from real figures (Hammurabi's envoy,
Herodotus, Ashoka's missionary, Zhang Qian, Mansa Musa, Ibn Battuta, Zheng
He, Lorenzo de' Medici); travel events on the real routes (monsoon timing,
Sahara night-travel, caravanserai tolls, quarantine) answered by **applying**
course knowledge; era progression with map fog-of-war (River Valleys →
Classical → Post-Classical → First Global Age); XP / levels / perks, caravan
upgrades, a pack animal at your heels. The 275-question Regents bank powers
optional, diegetic **Guild Exams** (Peddler → Magnate). Every city, good,
price spread and event is real history; famous figures speak paraphrase
grounded in the record, never invented verbatim quotes.

### Mind Atlas — *AP Psychology*
You are a Mind Cartographer shrunk into a vast inner world, restoring five
fragmented regions before the Exam of the Self. Each region is a
**mechanic-puzzle built from the actual concept**: route neural signals with
the right neurotransmitter keys, carry memory orbs through a working-memory
limit of 7±2, condition a creature companion and watch the acquisition curve,
judge a crowd against attribution bias, rebuild distorted thoughts on the
evidence. **Misconception Wraiths** are mini-bosses you defeat by choosing
the correct refutation — wrong answers cost confidence, not red X's.
Restoring a region grants a psych-themed ability (Chunking, Habituation...)
that gates the next region, metroidvania-style. AAQ/EBQ practice runs as
**Case Files**; the 175-item bank fuels the optional Trial of the Self.
Strictly **2024-CED-scoped** — excluded content never appears as a correct
answer (`scripts/build-banks.py` hard-fails otherwise).

### Word Harbor — *Global 9 ENL*
You arrive by boat in a warm new land — a gentle builder-collector that
mirrors the newcomer experience. Collect **word-gems** (each is a real
glossary term; tap to hear it in English, 中文, then Español via the
browser's built-in speech — nothing leaves the device), spend words to build
**sentence-bridges** between seven unit-themed islands and raise a harbor
town one word-family building at a time. Story quests retell unit content in
simple English (12 words max per line, picture-first); festival games are
MODS-style practice with **no timers, no death, no fail states** — wrong
answers cost nothing and retry freely. Capstone: the Time Travel Festival,
presented with the sentences you built. 244 trilingual terms
(`data/enl-glossary-global9.json`).

---

## Controls

- **Desktop:** WASD / arrows + mouse-look (drag or click for pointer lock) ·
  SHIFT run · SPACE hop · **E** interact · M map/atlas · J journal · G glossary
- **Touch:** virtual joystick (push far to run) + drag-to-look · tap prompts
  to act. Verified at 390 px-wide viewports.
- Pausing is automatic whenever any overlay is open; hiding the tab suspends
  all sound and flushes the save immediately.

## Teacher notes

- **Saves are per-device `localStorage`** (`mmw-game-<world>-v1`). No
  accounts, no sync, nothing typed ever leaves the browser. A student gets
  meaningful progress in an 8-minute session and resumes instantly.
- **New Game** on a hub card erases that world's save on that device (with a
  confirm). Clearing browser site-data does the same.
- The site is fully static; after the first load only the three.js CDN files
  are remote. There is no service worker, so a true cold offline start is not
  guaranteed — but everything course-related is local JSON.
- **De-identified by design**: no student or colleague names anywhere; the
  only name on the site is the footer's "Mr. Maccarello".
- ENL support also exists *inside* Trade Winds (HUD glossary + read-aloud on
  every question) for mixed-section play; Word Harbor is the dedicated,
  kinder-tuned ENL world.

## Engine (shared by all three)

Deterministic worlds from fixed seeds (mulberry32 + seeded value-noise /
fBm / ridged multifractal): same mountains, same roads, same landmarks for
every student on every device — the hub card maps are painted at runtime from
the *same* height fields as proof. Chunked vertex-colored terrain, analytic
terrain collision (no physics engine), animated water with shore foam, sky
dome shader with a slow day drift, instanced flora, procedural landmark
architecture (ziggurats to lighthouses), procedural low-poly NPCs with
transform-based animation, one pooled particle system, synthesized WebAudio
SFX (zero audio assets), and a strict **≤120 draw-call budget** per world
(pixel-ratio clamp + auto-degrade keep Chromebooks at 60 fps).

## Content provenance

All practice content is real and vetted — nothing invented:

- `data/global9-bank.json` — 275 Regents-style items, 55 topics.
- `data/appsych-bank.json` — 175 items, 35 topics, 2024-CED-clean (scope
  gate in `scripts/build-banks.py`).
- `data/enl-glossary-global9.json` — 244 trilingual terms in 9 categories.
- `data/world-content.json` — unit key ideas + AAQ/EBQ/CRQ/Enduring-Issues
  tasks with rubrics and model answers, aligned to the NYS framework and AP CED.
- Trade Winds' goods, prices, routes, figures and events; Mind Atlas' puzzle
  answers and wraith refutations; Word Harbor's story lines — all checked
  against the historical / psychological record (see `docs/GAME_DESIGN.md`,
  "honest pedagogy" pillar).

## Repository structure

```
index.html                 # hub title screen (animated 2D backdrop, live save progress)
world.html                 # the 3D world page (?w=global9 | ?w=appsych | ?w=enl)
docs/GAME_DESIGN.md        # v3 design document (pillars + per-world specs)
css/hub.css | styles.css | game.css
js/
  core/                    # prng, seeded noise, field math
  engine/                  # terrain, sky, water, scatter, structures, stations,
                           # player, HUD, audio, geo-kit, frame loop
  learn/                   # banks loader, station panels, glossary, read-aloud, progress
  game/                    # shared game systems: save slots, economy, XP/perks,
                           # quests, NPCs, particles, SFX synth, dialogue, vendor,
                           # guild exams, trade map, game HUD, overlay stack
  game/worlds/
    trade-winds/           # content DB + game controller (Global 9)
    mind-atlas/            # content, puzzles, wraiths, case files, trial (AP Psych)
    word-harbor/           # content, bridges, festivals, picture book, TTS (ENL)
  worlds/                  # per-world terrain/biome/station definitions
  main-hub.js              # title screen: backdrop, map thumbnails, save progress
  main-world.js            # world bootstrap (loading screen, WebGL check)
data/                      # question banks + glossary + world content
scripts/build-banks.py     # regenerates bank JSONs + AP scope gate
verify-w5.mjs              # ship gate: hub + all three games, headless (playwright)
verify-wh.mjs              # Word Harbor full-loop verification (Wave 4)
```

## Run locally

ES modules + `fetch` need HTTP (not `file://`):

```bash
python3 -m http.server 8848
# open http://localhost:8848/
```

Verification (headless Chromium, plays each game's core loop, checks draw
calls, mobile layout, save integrity, console errors):

```bash
node verify-w5.mjs /path/to/repo                 # local
node verify-w5.mjs /path/to/repo https://<pages-url>  # live
```

---

*A standalone project — it does not touch or depend on any other repository.
It only reused (copied) already-vetted question data. No student data leaves
the device: progress lives in `localStorage` only.*
