# Word Harbor Story-Pack Contract

**This is the authoritative spec for a Word Harbor content pack.** A pack is a
small ES module that adds curriculum content to the *Word Harbor* world (key
`enl`, the Global 9 ENL "Harbor That Was Waiting for You") **without touching the
shipped story or mechanics**. Dozens of packs can be authored in parallel and
plug in cleanly; the world's loader registers each one defensively, so a single
broken pack can never crash the game — it is logged and skipped.

Read this file, then read **`geography-isle.sample.js`** — the gold-standard
example that demonstrates every field at the craft bar of the shipped world.
Copy it and change the content; do not invent a new shape.

---

## 0. The world you are writing for (so your content fits)

Word Harbor is a **gentle, picture-first, bilingual** archipelago for newcomer
English learners. The premise: *you arrive by boat at a half-built town; "the
Quiet" (the loneliness of not yet sharing words) recedes as you learn words and
help neighbors. Mira the lamplighter is the warm mentor. Every lamp you light is
one more word, one more neighbor helped.*

Non-negotiable house rules — **your pack must honor all of them:**

| Rule | What it means for your pack |
|---|---|
| **No fail states, no timers, no scores** | A wrong choice is "try again from understanding," never a red X, never "Question N of M." |
| **Picture-first** | Every prompt/choice/win carries a procedural picture (`pics.js` kind) so an emerging reader succeeds without decoding text. |
| **Simple English** | Keep lines short and plain. Cutscene beats: ONE short line each. |
| **Bilingual** | Prompts, re-teaches and wins carry `zh` (中文) + `es` (Español) where the field allows. |
| **De-identified** | Only invented townsfolk. No student, colleague, or real-person names anywhere. The teacher is only ever "Mr. Maccarello" if named at all. |
| **Honest pedagogy** | Real history/geography. Real figures speak **paraphrase**, never invented verbatim quotes. The idea you teach in the Codex must be true. |
| **Zero external assets** | Pictures are `pics.js` scene kinds (procedural canvas). No image files, no fonts, no audio files. |
| **Chromebook 60fps, touch + keyboard** | A pack adds a handful of NPCs + overlays; do not add per-frame work or large meshes. |

The world's geometry, glossary categories and islands already exist — your pack
**attaches to them**. The seven islands (and their world-coordinate centers, from
`js/worlds/word-harbor.js` `ISLES`):

| island id | name | center `[x,z]` | radius |
|---|---|---|---|
| `home` | Harbor Town | `[0, 95]` | 64 |
| `wh-geo` | Geography Isle (tutorial) | `[0, -38]` | 50 |
| `wh-paleo` | Paleo Valley | `[-138, -126]` | 52 |
| `wh-river` | River Lands | `[138, -126]` | 56 |
| `wh-classical` | Classical Heights | `[-208, 8]` | 50 |
| `wh-caravan` | Caravan Coast | `[208, 8]` | 52 |
| `wh-ren` | Renaissance Quay | `[-132, 152]` | 50 |
| `wh-explore` | Exploration Point | `[132, 156]` | 50 |

Place your NPCs at world coordinates **inside the island you target**, clear of
the existing station and story NPCs. (Geography Isle's Mapmaker is at `[6,-32]`;
the sample's Teku sits at `[-10,-20]`.)

---

## 1. The pack module shape

Every pack file exports a `pack` object (a `default` export is also fine):

```js
export const pack = {
  id,            // string, globally unique across all packs (e.g. 'wh-river-irrigation')
  unit,          // curriculum unit / island label shown in panels (e.g. 'River Lands')
  title,         // human title of the pack (e.g. 'Why Cities Grew by the Water')

  npcs:        [ /* characters added to the world */ ],
  cutscenes:   { FLAG: [ /* playCutscene beats */ ] },
  triggers:    [ /* when each cutscene fires, once */ ],
  keystones:   [ /* THE CORE: in-character understanding beats */ ],
  codex:       [ /* the real ideas this pack teaches */ ],
  achievements:[ /* optional sparse milestones */ ],
};
export default pack;
```

Every array is optional and defaults to empty — a pack with only `npcs` + one
`keystone` is valid. **`id` is required**; a pack with no `id`, or a duplicate
`id`, is logged and skipped.

---

## 2. `npcs` — characters added to existing places

Each NPC is rendered exactly like the shipped story NPCs (a procedural humanoid
body + floating name label + optional bobbing marker).

```js
npcs: [
  {
    id: 'teku',                 // unique within the pack
    name: 'Teku',               // display name
    title: 'A young map-apprentice',  // shown under the name; defaults to pack.unit
    pos: [-10, -20],            // world [x, z] — put it ON the target island
    palette: { robe: 0x5a7d4f, trim: 0x39512f, skin: 0xd9b07c, hat: 0xcdbf7a },
    hatKind: 'scholar',         // 'cap'|'brim'|'scholar'|'turban'|'hood'|'none'
    keystone: 'teku-first-word',// OPTIONAL: id of a keystone below → tapping the
                                //   NPC opens it; a green marker bobs until solved.
    dialogue: { /* openDialogue tree */ }, // OPTIONAL alternative to `keystone`
  },
],
```

An NPC has **either** a `keystone` (the recommended, world-changing path) **or** a
plain `dialogue` tree (an `openDialogue` branching conversation; same shape as the
shipped Mira). If it has neither, tapping it shows a gentle "no words yet" toast.

`pos` is required and must be a 2-element array; an NPC missing `id` or `pos` is
skipped (the rest of the pack still loads).

---

## 3. `cutscenes` — named story-beat sequences

A map of **FLAG name → array of cutscene beats**. Beats use the shared
`playCutscene` format (`js/game/cutscene.js`). Keep Word Harbor's low density:
**one short line per beat.**

```js
cutscenes: {
  TEKU_ARRIVES: [
    { tint: 'dusk', kicker: 'Geography Isle',
      text: 'A young apprentice sits by the path, a half-drawn map on their knees.' },
    { tint: 'dusk', art: 'portrait',
      palette: { robe: 0x5a7d4f, trim: 0x39512f, skin: 0xd9b07c, hat: 0xcdbf7a },
      kicker: 'Teku, the map-apprentice',
      text: 'They look up at you, hopeful. "You collect words. I am missing one."',
      cta: 'Sit with Teku' },
  ],
},
```

Beat fields (all optional except `text`):

| field | values | meaning |
|---|---|---|
| `tint` | `'amber'`\|`'dusk'`\|`'cold'`\|`'stone'` | vignette mood. **Use `dusk`/`amber`** for Word Harbor's warmth. |
| `kicker` | string | small all-caps label above the text |
| `text` | string | the line that types on (**keep it short**) |
| `art` | `'portrait'`\|`'candle'`\|`'ledger'`\|`'notice'`\|`null` | a procedural emblem |
| `palette` | `{robe,trim,skin,hat}` | only for `art:'portrait'` |
| `cta` | string | button label (defaults: `'Continue'`, last beat `'Begin'`) |

---

## 4. `triggers` — when a cutscene fires (once)

Each trigger fires its `play` cutscene **exactly once**, gated by a story flag so
it survives reloads.

```js
triggers: [
  { on: 'visit', value: 'wh-geo', play: 'TEKU_ARRIVES', reward: { light: '...' } },
],
```

| field | meaning |
|---|---|
| `on` | `'visit'` (first entry onto island `value`), `'flag'` (when `story.is(value)` is true), `'questDone'` (when story id `value` — a `st-*` story — is heard), or `'enter'`/`'boot'` (once at boot). |
| `value` | the island id / story-flag / story id to watch (omit for `enter`/`boot`). |
| `play` | the **key in `cutscenes`** to run. |
| `reward` | optional `{ light: '<sub-line>' }` — lifts the town-light meter (lightLamp) after the beats finish. |

Island ids for `on:'visit'`: see the table in §0. Story ids for `on:'questDone'`
are the shipped stories: `st-arrive`, `st-geo`, `st-paleo`, `st-river`,
`st-classical`, `st-caravan`, `st-ren`, `st-explore`.

---

## 5. `keystones` — THE CORE (the understanding beat)

This is the heart of every pack and the thing the quality bar is judged on. A
keystone is a gentle, picture-first NPC moment where **the player advances the
warm story by GIVING the word whose MEANING matches what the neighbor needs.**

It follows the gold-standard pattern (the shipped Bula keystone, and Trade Winds'
Nin-Banda before it):

- **Choices are FULL in-character offers of a word** — natural sentences a person
  would say (`'Here is COMPASS — it shows you which way to walk.'`). **Never** A/B/C
  stems, never "Question 1 of 3."
- **A WRONG choice is a consequence, not a red X.** The neighbor re-teaches gently
  (its `reteach` is read aloud, picture-first, explaining *why* that word does not
  fit), and the player **tries again from understanding** — the same keystone
  loops. No score, no penalty, no "incorrect."
- **The RIGHT choice visibly changes the world:** a warm scene (`win`) opens, a
  **lamp lights** (the town-light meter rises), a **Codex entry is recorded** (the
  real idea understood), and an **achievement** may unlock. The neighbor's marker
  goes dark.

```js
keystones: [
  {
    id: 'teku-first-word',     // unique; an npc points at it via `keystone`
    npcId: 'teku',             // which npc owns it (for marker + re-entry)
    island: 'wh-geo',          // island id (context)
    flag: 'helpedTeku',        // OPTIONAL story flag set on success (for later triggers)
    pic: 'world',              // the scene picture above the prompt (pics.js kind)

    prompt: {                  // the question — simple English, TTS-able, bilingual
      en: 'Teku has drawn rivers, hills and a coast — but cannot name the whole study. "What is the ONE word for the land\'s shape and place?" Which word do you give?',
      zh: '…', es: '…',
    },

    choices: [                 // FULL in-character word-offers (not stems)
      { word: 'geography', pic: 'world', right: true,
        label: 'Here is GEOGRAPHY — the study of the land\'s shape and place.' },

      { word: 'river valley', pic: 'river', right: false,
        label: 'Here is RIVER VALLEY — the low green land beside a river.',
        reteach: {            // read aloud on a wrong pick; then the keystone loops
          en: 'A river valley is ONE place on your map. Teku needs the word for ALL of it … Look at the whole map again.',
          zh: '…', es: '…' } },
      // …at least one more plausible-but-wrong choice, each with its own reteach.
    ],

    win: {                     // the warm scene that opens on the right word
      pic: 'world',
      en: 'Teku\'s eyes go wide. "GEOGRAPHY — yes!" … A lamp lights on Geography Isle …',
      zh: '…', es: '…' },

    codex: {                   // the real idea, written to the Field Journal on success
      id: 'wh_geo_first_word',
      group: 'Geography Isle',
      title: 'Why geography comes first',
      idea: 'Geography is the land\'s shape and place — historians learn it first because WHERE people live shapes HOW they live: a river valley feeds farms, and farms feed cities.',
      source: 'Teku, a map-apprentice of the harbor' },

    achievement: 'wh_teku_helped',  // OPTIONAL id from `achievements` below
    light: 'You gave Teku the first word, and Geography Isle is brighter.', // OPTIONAL lamp sub-line
  },
],
```

### Keystone craft checklist (this is the bar)
1. **2–3 choices.** Exactly one `right: true`. The wrong ones are *plausible* —
   ideally real glossary terms a learner might confuse (a part vs. the whole, a
   tool vs. the study) — not silly. Each wrong choice has a `reteach` that narrows
   from the misconception toward the right idea.
2. **Picture per choice.** Every choice has a `pic` (its `wh-ks-thumb` thumbnail).
3. **The win changes the world.** The `win` scene should *show* the consequence (a
   lamp lights, the neighbor succeeds, an area warms) — the emotional payoff, not
   "Correct!"
4. **The Codex idea is the lesson.** `codex.idea` is one true sentence the learner
   now understands — the thing the whole keystone exists to teach.

### How the keystone records the Codex entry + lifts the meter
You do **nothing** mechanical — the loader does it. On the right choice the loader:
- writes `keystone.codex` to the shared Field Journal via `codex.record()`
  (idempotent by `codex.id`; safe on re-entry),
- sets `keystone.flag` (if present) on the story,
- unlocks `keystone.achievement` (if present),
- opens the `win` scene, then calls `lightLamp(keystone.light)` — the town-light
  meter (Word Harbor's "standing meter," the receding Quiet) rises with a soft
  chime + confetti.

Re-entering a solved keystone shows a warm "thank you" replay (no challenge).

---

## 6. `codex` — the real ideas the pack teaches

List every Codex entry the pack can write. Each is an object:

```js
{ id, group, title, idea, source }
```

| field | meaning |
|---|---|
| `id` | unique key; `record()` is idempotent by it (re-visiting never double-logs). |
| `group` | the unit/island the entry buckets under in the Field Journal panel (use your `unit`, e.g. `'Geography Isle'`). |
| `title` | short heading of the turning point (`'Why geography comes first'`). |
| `idea` | the real concept in **one human sentence** — the thing understood. |
| `source` | the figure or scene that taught it (`'Teku, a map-apprentice of the harbor'`). |

The loader records entries **only when a keystone is solved** (via the keystone's
inlined `codex`). This top-level `codex` array documents the pack's full learning
payload and lets a future study-guide read the set; keep its entries identical to
the ones inlined in your keystones (same `id`).

---

## 7. `achievements` — optional sparse milestones

```js
achievements: [
  { id: 'wh_teku_helped', title: 'The map has a title', desc: 'You gave Teku the first word of every history.' },
],
```

Sparse and meaningful (one per pack is plenty). The loader unlocks an achievement
when a keystone naming it (`keystone.achievement`) is solved. First unlock fires a
tasteful banner once, then never nags. They surface in the **Achievements** panel
(reached from the **JOURNAL** button in the HUD, or `J`).

---

## 8. Registering your pack — the ONE-LINE edit

Open **`packs/index.js`** and add two lines:

```js
import { pack as riverLands } from './river-lands.js';   // 1) one import

export const STORY_PACKS = [
  geographyIsleSample,
  riverLands,                                             // 2) one entry
];
```

That is the entire integration. At boot, the Word Harbor controller imports
`STORY_PACKS`, registers each pack inside its own `try/catch`, installs its NPCs,
triggers and keystones, wires the shared Codex + Achievements, and adds the
JOURNAL/CODEX affordance. **You never edit `game.js`, `codex.js`, `cutscene.js`,
`story.js`, or `css/game.css`.**

---

## 9. Verifying your pack (debug hooks)

With the world open (`world.html?w=enl`), the controller exposes `window.WH.debug`:

| call | does |
|---|---|
| `WH.debug.packs()` | lists every loaded pack with its NPC ids + keystone ids |
| `WH.debug.gotoNpc('teku')` | teleports next to a pack NPC (see its marker, walk up) |
| `WH.debug.keystone('teku-first-word')` | opens a pack keystone directly |
| `WH.debug.packCutscene('wh-geo-sample','TEKU_ARRIVES')` | force-plays a cutscene (ignores the gate) |
| `WH.debug.codex()` / `WH.debug.achievements()` | opens the Field Journal / milestones panel |
| `WH.debug.codexEntries()` | returns the recorded Codex entries (assert your idea is written) |

A correct keystone: wrong choice → re-teach line + the same keystone again (loop,
no penalty); right choice → win scene → a lamp lights (meter rises) → the idea is
in `WH.debug.codexEntries()`. Zero console errors throughout.

---

## 10. Author checklist (copy this, tick it)

- [ ] `pack.id` is unique; `unit` + `title` set.
- [ ] NPC(s) placed at real world coords **on the target island**, clear of stations.
- [ ] Each keystone: 2–3 **full in-character** choices, exactly one `right`.
- [ ] Each wrong choice has a **picture-first `reteach`** that re-teaches and loops.
- [ ] The `win` scene **shows the world changing** (a lamp/neighbor/area).
- [ ] `codex.idea` is **one true sentence** — the real lesson. `id` matches the inlined keystone entry.
- [ ] Bilingual (`zh` + `es`) on prompt / reteach / win.
- [ ] No real names; figures paraphrased; no invented quotes; no external assets.
- [ ] Added **one import + one array entry** to `packs/index.js`.
- [ ] `node --check yourpack.js` passes; `WH.debug.keystone(...)` behaves; zero console errors.
