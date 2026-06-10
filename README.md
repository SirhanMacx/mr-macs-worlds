# Mr. Mac's Worlds

A **seeded, procedurally generated, open-world 3D learning environment**.
Students free-roam two living continents, walk up to landmark **learning
stations**, and master real exam skills — AP Psychology (2024 CED) and the NYS
Global History & Geography 9 path.

Built with **three.js via CDN importmap, vanilla ES modules, fully static** —
no build step, no bundler. Designed to run at 60 fps on **school Chromebooks**
and phones.

---

## v2 — what it is

### Two open worlds, one engine

| World | Course | Seed |
|---|---|---|
| **The Trade Winds World** | Global History 9 | `20270623` (the Global Regents date) |
| **The Mind Atlas** | AP Psychology | `20270511` (the projected AP exam date) |

Every world is generated **deterministically from its fixed seed**
(mulberry32 PRNG + seeded value-noise / fBm / ridged multifractal). Same seed,
same mountains, same roads, same landmark positions — for every student, every
visit, on every device. The hub's map thumbnails are painted at runtime from
the *same* height/biome fields as the 3D terrain, as proof.

### The land
- **Heightmap terrain** built from layered noise: continent mask, ridged
  mountain ranges, domain-warped hills, biome-blended dunes / steppe / delta /
  terraces, rivers carved below sea level, roads raised into causeways, and
  flattened building pads under every station.
- **Per-vertex biome coloring** (grass, savanna, two-tone dunes, wetland,
  beach sand, rock-by-slope, snow/crystal by altitude, painted road ribbons)
  on a single shared `MeshStandardMaterial`.
- **Animated water** — one plane, one cheap shader: shoreline tinting and foam
  from pre-sampled terrain depth, two-wave vertex bob, scrolling sparkle.
- **Sky dome shader** (zenith/horizon gradient + sun disc), drifting instanced
  clouds, hemisphere + directional light, and matched exponential fog with a
  slow noon-to-golden-hour drift.
- **Instanced flora** — hundreds to ~2,000 trees / palms / cypress / glowing
  dream-trees / rocks / crystals / reeds / grass tufts, placed by seeded
  rejection-sampling against the biome field (one draw call per archetype).

### The explorer
- Third-person procedural avatar (walk cycle, hop, soft blob shadow) with a
  smoothed chase camera.
- **Terrain collision is analytic** — the player samples the exact `height(x, z)`
  function the mesh was built from. No raycasts, no physics engine, no cost.
- **Desktop:** WASD/arrows + drag-look or click-to-pointer-lock, Shift to run,
  Space to hop, wheel to zoom. **Touch:** virtual joystick (push far to run) +
  drag-look.

### The learning layer (the point)
- **8 region stations** in Trade Winds (Origins Foothills, River Delta, Belief
  Crossroads, Classical Coast, Oasis Caravanserai, Steppe Citadel, Renaissance
  Hill Town, Harbor of Encounters) and **6** in Mind Atlas (Observatory
  Heights, Neural Forest, Memory Archipelago, Growth Grove, Social Plaza,
  Wellness Springs) — each with a **distinct procedural silhouette** (ziggurat,
  colonnaded temple, caravanserai, walled hill town with campanile, harbor
  with caravel, giant neuron, retrieval lighthouse...).
- Walk up → prompt → **E / tap** opens the station overlay **in place**:
  - **Learn** tab — the unit's key ideas and terms (+XP for studying).
  - **Practice** tab — 10 MCQs drawn **only from that unit's topics** in the
    real question banks. Score **70%+ after studying to clear the station** —
    it lights up gold across the world, the minimap, and the quest log.
- **Skill stations** drill the written exam: **Free-Response Lab** (real AAQ +
  EBQ tasks with rubrics and model answers), **Document Lab** (NYS CRQ set),
  **Hall of Enduring Issues** (the culminating Regents essay skill), and mixed
  MCQ halls.
- **HUD**: live compass strip with station markers, procedural minimap painted
  from the height field, light-pillar **beacon** to the suggested next station,
  quest log with per-unit mastery (tap any row to re-aim the beacon), XP, and
  persistent progress in `localStorage`.

### Performance posture (Chromebook-first)
- Pixel ratio clamped (≤1.5 desktop, 1 on touch); auto-degrades to 1 if the
  first seconds run slow.
- **< 100 draw calls**: chunked terrain under one material, one InstancedMesh
  per flora archetype, stations baked to one solid + one glow mesh each,
  distance-faded label sprites.
- Exp2 fog + tight far plane do the distance culling; **no postprocessing**;
  shadows are an opt-in **HQ** toggle.
- Reduced-motion support (OS-detected), WebAudio chimes (muted by default),
  graceful WebGL-fallback page.

---

## Content provenance & scope

All practice content is **real and vetted** — nothing invented:

- `data/global9-bank.json` — **275 items, 55 topics** (Regents-style).
- `data/appsych-bank.json` — **175 items, 35 topics**, **2024-CED-clean**:
  `scripts/build-banks.py` hard-fails if excluded content (Maslow's hierarchy,
  Kohlberg, Gardner, psychosexual stages, the three named emotion theories)
  appears as testable. Humanistic psychology is correctly kept.
- `data/world-content.json` — unit blurbs/terms, AAQ/EBQ/CRQ/Enduring-Issues
  tasks with rubrics and model answers, aligned to the real NYS framework and
  AP CED.
- Region stations filter the banks by **exact topic strings**, so unit practice
  stays on-unit.

---

## Repository structure

```
index.html                 # hub — world cards w/ live seeded map thumbnails (no WebGL)
world.html                 # the 3D world page (?w=global9 | ?w=appsych)
css/hub.css                # hub styling
css/styles.css             # HUD, panels, touch controls, loading, fallback
js/
  core/
    prng.js                # mulberry32 + FNV-1a hash + labeled sub-seeds
    noise.js               # seeded value noise, fBm, ridged multifractal
    field-utils.js         # masks, polyline distance, color mixing (pure math)
  engine/
    engine.js              # boot + frame loop + quality/degrade + interactions
    terrain.js             # chunked heightmap mesh, analytic normals, vertex colors
    sky.js                 # gradient dome shader, sun, clouds, day drift, fog
    water.js               # animated water plane w/ shore foam
    scatter.js             # seeded instanced flora per biome
    structures.js          # procedural landmark architecture (17 builders)
    stations.js            # placement, prompts, rings, beacon, cleared glow
    player.js              # avatar + chase cam + terrain-following controller
    hud.js                 # compass, minimap, quest log, prompt, settings
    geo-kit.js             # bake vertex-colored parts into one geometry; canvas labels
    audio.js               # tiny WebAudio chimes (no assets)
  learn/
    content-loader.js      # fetch/cache JSON, unit-filtered question draw
    panels.js              # Learn/Practice station, MCQ runner, FRQ/CRQ/EI overlays
    progress.js            # XP, per-unit mastery, settings (localStorage)
  worlds/
    trade-winds.js         # Global 9 world definition (layout, biomes, field, flora)
    mind-atlas.js          # AP Psych world definition
  main-hub.js              # hub bootstrap (paints real maps from the world fields)
  main-world.js            # world bootstrap (loading screen, WebGL check)
data/                      # question banks + world content (see provenance above)
scripts/build-banks.py     # regenerates bank JSONs + AP scope gate
.nojekyll                  # serve js/ and _-files verbatim on Pages
```

---

## Adding another world

1. Write `js/worlds/<key>.js` exporting a `def` — copy the shape of
   `trade-winds.js`: seed, size, sky/water/light palette, `regions` (with bank
   topic lists), `skills`, `order`, `paths`, `flora` rules, and a `buildField()`
   that returns `{ height, color, probe, pathD }`.
2. Register it in `js/main-world.js` (`WORLDS`) and add a card in `index.html`
   + `js/main-hub.js`.
3. Add bank/topic data to `data/` and a node entry per region to
   `data/world-content.json`.

The engine (terrain, water, sky, scatter, stations, player, HUD, panels,
progress) is fully shared.

---

## Run locally

ES modules + `fetch` need HTTP (not `file://`):

```bash
python3 -m http.server 8848
# open http://localhost:8848/
```

---

*A standalone project — it does not touch or depend on any other repository.
It only reused (copied) already-vetted question data. No student data leaves
the device: progress lives in `localStorage` only.*
