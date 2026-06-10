# Mr. Mac's Worlds 🌐🧠🐫

A **3D, explorable learning experience** for a veteran New York teacher's students.
Walk through themed worlds, approach landmarks to learn real in-scope content, and
step into **skill stations** that drill the actual exam tasks — built so students
*want* to explore while they master the material.

**Live site:** see the repository's GitHub Pages URL (Settings → Pages).

Built with **three.js via CDN + importmap, vanilla JS, fully static** — no build
step, no bundler. Designed to run on **school Chromebooks and phones**.

---

## What v1 includes

### A 3D Hub
A stylized observatory-style hub with a glowing monument and **portals** to each
world. Two portals are live; three more (AP World History, Global 10, US History 11)
are visible "coming soon" stubs so the experience reads as a growing campus.

### World 1 — AP Psychology: *The Mind Atlas* 🧠
An explorable brain-scape (translucent low-poly brain, drifting "neuron" particles).
- **6 content nodes**, one per 2024-CED unit: Research Methods, Biological Bases,
  Cognition, Development & Learning, Social Psychology & Personality, Mental &
  Physical Health. Each node teaches 5 key concepts in a clean panel.
- **MCQ Portal** — pulls real questions from the AP Psychology bank, shuffles the
  answer choices, grades each item, and shows the explanation.
- **Free-Response Lab** — authentic **AAQ** (Article Analysis, 7-pt, Parts A–F) and
  **EBQ** (Evidence-Based, 7-pt: Claim + two sourced body parts) practice. Read the
  source(s) → plan privately → reveal the **scoring rubric** and a **model answer**.

### World 2 — Global History 9: *The Trade Winds World* 🐫
A warm Silk Road / river-valley map (stepped ziggurat, sun disc, dunes, a flowing
trade-route ribbon).
- **6 content nodes**: Human Origins & the Neolithic Revolution, River Worlds
  (Mesopotamia/Egypt/Indus/Shang), Belief Systems, Classical Empires, Exchange
  Networks (Silk Road / Indian Ocean / Trans-Saharan), and Postclassical Power
  (Byzantium, Islamic Golden Age, Mongols, Black Death).
- **Stimulus MCQ Hall** — real Regents-style questions from the Global 9 bank.
- **Document Lab (CRQ)** — a 2-document Constructed-Response set: describe historical
  context, then explain cause/effect, with model answers + what-earns-credit notes.
- **Enduring Issues Quest** — the culminating Regents skill. Read 3 documents,
  identify the shared **enduring issue** from the real NYS list (Conflict, Power,
  Inequality, Ideas & Beliefs, Scarcity, Technology), then see a model argument and
  the full-essay rubric.

### Controls (desktop + Chromebook + touch)
- **Desktop:** `WASD` / arrow keys to move, **drag the mouse** to look (no pointer-lock
  required — works on locked-down school machines).
- **Touch / Chromebook touchscreen:** on-screen **joystick** (bottom-left) to move,
  **swipe the right half** to look.
- **Tap-to-walk:** tap a distant crystal or gate and you walk toward it; tap again on
  arrival to open it.

### Fun + progress
XP for learning nodes and completing stations, a collectible "mastered" count in the
HUD, toasts for milestones, and live-rotating crystals/portals.

### Accessibility & performance
- Capped pixel ratio (≤1.5), low-poly geometry, instanced décor, modest draw calls,
  per-world lazy build/teardown.
- **Reduced-motion** toggle (`RM` in the HUD) — also auto-detected from the OS — that
  thins particle counts and stops idle animation.
- High-contrast readable text panels. **Audio is off by default** (none ships in v1).
- **Graceful WebGL fallback** screen if the device/browser can't do WebGL.

---

## Content provenance & scope

All practice content is **real and vetted** — nothing was invented:

- **Question banks** were copied (unmodified content) from Mr. Mac's Review Arcade's
  shared bank into `data/global9-bank.json` (**275 items, 55 topics**) and
  `data/appsych-bank.json` (**175 items, 35 topics**). Each item keeps its prompt,
  four choices, correct answer, topic, and a teaching explanation.
- **AP Psychology is 2024-CED-clean.** The build script (`scripts/build-banks.py`)
  runs a hard gate that **fails** if any excluded content appears as testable:
  Maslow's hierarchy of needs, Kohlberg's stages, Gardner's multiple-intelligences
  taxonomy, Freud's psychosexual stages, or the three named theories of emotion
  (James-Lange / Cannon-Bard / Schachter-Singer). Humanistic psychology (Rogers,
  person-centered therapy) is correctly **kept**, as the CED intends.
- **Global History uses the real NYS framework:** stimulus MCQs, the CRQ task
  structure, and the official Enduring Issues framing used in the New York Global
  History & Geography II Regents.
- Concept nodes and the writing-task specs were drawn from the teacher's own
  curricula (an AP Psychology synthesis course and a Global 9 Regents course).

---

## Repository structure

```
index.html               # entry; three.js importmap + module bootstrap
css/styles.css            # HUD, panels, touch controls, loading, fallback
js/
  main.js                 # engine: hub, world load/unload, raycast interaction, HUD, loop
  controls.js             # WASD + mouse-look + touch joystick + tap-to-walk
  content-loader.js       # fetch/cache JSON, draw/shuffle questions
  progress.js             # XP / collectibles / visited, localStorage
  skill-stations.js       # content panels + MCQ runner + AAQ/EBQ + CRQ + Enduring Issues
  worlds/
    world-utils.js        # shared low-poly builders (markers, labels, ground, instancing)
    appsych-world.js      # The Mind Atlas
    global9-world.js      # The Trade Winds World
data/
  appsych-bank.json       # AP Psych questions (2024-CED-clean)
  global9-bank.json       # Global 9 questions
  world-content.json      # world layouts, content nodes, skill-station prompts/rubrics/models
assets/                   # (intentionally light — see assets/README.md)
scripts/build-banks.py    # regenerates the two bank JSONs from the arcade source + scope gate
.nojekyll                 # serve files starting with _ and js/ verbatim on Pages
```

---

## Adding more worlds later

The engine is data-driven and modular, so extending it is straightforward:

1. **Add content** to `data/world-content.json` under a new course key (nodes with
   `pos`/`color`/`terms`, plus any `mcq` / `crq` / `frq` / `ei` station configs). If
   it's a new MCQ subject, drop a `data/<course>-bank.json` and teach
   `content-loader.loadBank()` its filename.
2. **Write a world builder** in `js/worlds/<course>-world.js` exporting
   `build<Course>World(scene, interactables, content, reducedMotion)`. Reuse
   `world-utils.js` for markers, labels, ground, and instanced décor.
3. **Register it** in `js/main.js`: import the builder, branch on the key in
   `loadWorld()`, and add a `makePortal(...)` (or promote one of the existing
   `makeStubPortal` stubs) in `loadHub()`.

That's it — controls, raycasting, HUD, XP, and all four station types are shared.

To refresh the question banks, run `python3 scripts/build-banks.py` (it reads the
arcade source bank, slims it, and re-runs the AP Psych exclusion gate).

---

## Run locally

Because it uses ES modules + `fetch`, serve over HTTP (not `file://`):

```bash
python3 -m http.server 8848
# then open http://localhost:8848/
```

---

*A standalone project — it does not touch or depend on the Review Arcade repo. It
only reused (copied) that project's vetted question data.*
