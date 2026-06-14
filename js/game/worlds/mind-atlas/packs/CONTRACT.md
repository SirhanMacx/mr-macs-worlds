# Mind Atlas Story-Pack Contract

**This is the authoritative spec.** A content author writes ONE ES module that
exports `pack`, drops it in this folder, and adds two lines to `index.js`. The
world's loader (`game.js` → `packs/loader.js`) registers it **defensively**:
a malformed pack is logged and skipped — it can never crash the world or break
another pack.

The gold-standard reference is **`u1-ten-percent.js`** (Unit 1 · Biological
Bases — the "we only use 10% of our brains" Fog-encounter). **Read it first,
then copy its structure.** Everything below documents the shape it follows.

---

## The world you are writing into

The Mind Atlas is **"The Atlas and the Fog"**: a single human mind has gone
dark. **Atlas** is the mind's own fading sense of itself (a warm lighthouse-steady
mentor). **The Fog** is the mind's accumulated **misconceptions**, given one
recurring face — every tempting-but-wrong belief is the Fog speaking. You push it
back from a region only by **understanding** the real science. Restoring regions
builds toward the **Exam of the Self**. The growing record of correct science is
the **Codex** (the player's "Clarity"); the **Clarity meter** is the standing
meter that rises as the Fog recedes.

Your pack is **additive curriculum content** layered onto this world. It must
respect the spine:

- **Honest pedagogy.** Every claim is real, in-scope psychology. **2024-CED
  scope holds.** Deliberately EXCLUDED as a *correct* answer (per the 2024 CED):
  Kohlberg's stages, Maslow's hierarchy, named emotion theories (James-Lange /
  Cannon-Bard / Schachter-Singer), Freud's psychosexual stages, Gardner's
  multiple intelligences. (They may appear as a *misconception the Fog offers*,
  but never as the right answer.)
- **No invented verbatim quotes from real people.** A real figure may speak
  *paraphrase*. Prefer a **fictional mind-denizen** (like the built-in Astra,
  Mnemo, Pavla) as the teaching NPC so nothing is mis-attributed. The Codex
  `source` names the in-world scene, not a real scientist.
- **Gentle on clinical content.** If your pack touches mental health, include the
  988 support note in the relevant text (the `ap-health` region already models
  this).

---

## The pack module shape

```js
export const pack = {
  id,            // string, unique across ALL packs. e.g. 'u1-ten-percent'
  unit,          // curriculum unit label, e.g. 'Unit 1 · Biological Bases of Behavior'
  title,         // short pack title, e.g. 'The Ten-Percent Fog'

  npcs:        [ /* NPCSpec */ ],         // extra characters added to the world
  cutscenes:   { FLAGNAME: [ /* beat */ ] },  // named story-beat sequences
  triggers:    [ /* TriggerSpec */ ],     // when each cutscene fires (once)
  keystones:   [ /* KeystoneSpec */ ],    // THE CORE — understanding beats
  codex:       [ /* CodexEntry */ ],      // the real ideas this pack teaches
  achievements:[ /* Achievement */ ],     // optional milestones
};
export default pack;
```

All fields except `id` are optional, but a pack with no `keystones` teaches
nothing — a real pack ships at least one keystone + the codex entry it records.

---

### `npcs[]` — NPCSpec  (the characters you add)

Each NPC joins the world at an **existing region's station**, offset from its
center, with a procedural portrait + a "Speak with" marker — exactly like the
built-in region denizens.

| field | type | notes |
|---|---|---|
| `id` | string | unique within the pack |
| `name` | string | shown on the label + dialogue header |
| `title` | string | shown under the name |
| `region` | string | a REGIONS id: `ap-bio`, `ap-cognition`, `ap-dev`, `ap-social`, `ap-health`, `ap-methods` (see "Region ids") |
| `offset` | `[dx, dz]` | placement relative to the region's station center. **Avoid the built-in denizen's spot** (see the offset table below). |
| `hatKind` | string | `'hood'`, `'scholar'`, `'brim'`, `'crown'`, `'none'` … |
| `palette` | `{ robe, trim, skin, hat }` | hex ints; procedural (zero assets) |
| `dialogue` | tree | `{ start, nodes }` — see "Dialogue trees" |

**The NPC's dialogue is your mentor's lore + the on-ramp to the keystone.** The
loader auto-appends a launcher choice ("Take me to the Fog. I will answer it.")
to any terminal node so the player can walk from conversation straight into your
keystone — you do **not** wire the keystone runner yourself.

**Region station centers** (so you can pick a non-colliding offset):

| region id | name | center `[x,z]` | built-in denizen offset |
|---|---|---|---|
| `ap-bio` | Neural Forest | `[150,-110]` | `[7,5]` |
| `ap-cognition` | Memory Archipelago | `[205,60]` | `[-7,5]` |
| `ap-dev` | Growth Grove | `[-180,40]` | `[7,-5]` |
| `ap-social` | Social Plaza | `[0,-40]` | `[-7,-5]` |
| `ap-health` | Wellness Springs | `[60,180]` | `[7,5]` |
| `ap-methods` | Observatory Heights | `[-150,-120]` | (Case Files hub) |

Pick an offset ~`[±9, ±7]` that is not the denizen's. (The sample uses
`[-9,-7]` at `ap-bio`.)

---

### `cutscenes{}` — keyed beat arrays  (playCutscene format)

A cutscene is an array of beats. Each beat:

| field | type | notes |
|---|---|---|
| `kicker` | string? | small label above the text |
| `text` | string | the beat copy |
| `tint` | `'amber'\|'dusk'\|'cold'\|'stone'` | mood. Mind Atlas uses mostly `'cold'`/`'dusk'`. |
| `art` | `'portrait'\|null` | draw a portrait beat |
| `palette` | `{robe,trim,skin,hat}` | portrait colors (e.g. the Atlas or Fog palette) |
| `cta` | string? | the button label on the last beat |

The key (e.g. `TENPCT_INTRO`) is referenced by a trigger's `play`.

---

### `triggers[]` — TriggerSpec  (when a cutscene fires, once)

| field | type | notes |
|---|---|---|
| `on` | `'visit'` \| `'enter'` \| `'flag'` | what fires it. `'visit'`/`'enter'` = entering region `value`'s area; `'flag'` = story flag `value` becomes true. (`'questDone'` is reserved for the quest-driven worlds; Mind Atlas has no quests, so prefer `visit`/`flag`.) |
| `value` | string | a region id (for visit) or a story-flag name (for flag) |
| `play` | string | the `cutscenes{}` key to play |
| `reward` | `{ clarity?, insight?, xp? }`? | applied after the cutscene |

Each trigger fires **at most once** (persisted in `state.packTriggersFired`).

---

### `keystones[]` — KeystoneSpec  (THE CORE)

A keystone is **the moment the player UNDERSTANDS**. It is an in-character
encounter with the Fog, built to the exemplar bar:

- The Fog **taunts** with the comfortable, wrong belief.
- A mentor poses the **ask** in character.
- The player picks a **full in-character sentence** (`choices[]`) — **never an
  A/B/C stem, never a quiz**.
- A **wrong** choice is a **consequence, not a red X**: the Fog thickens (a small
  Confidence cost), the **mentor coaches** the real science, then the **same**
  keystone re-renders so the player answers from understanding (the loop).
- The **right** choice **changes the world**: it records a **Codex** entry
  (the "Understood" chime), **lifts the Clarity meter**, sets a **story flag**,
  and unlocks an optional **achievement**, then shows a payoff line.

| field | type | notes |
|---|---|---|
| `id` | string | unique within the pack |
| `npc` | string | the pack NPC `id` that delivers it (its dialogue gets the launcher) |
| `region` | string | the region whose Clarity lifts on success |
| `kicker` | string? | header label (e.g. `'THE FOG · the ten-percent lie'`) |
| `title` | string? | encounter title |
| `taunt` | string | the Fog's in-character offer of the wrong belief |
| `ask` | string | the in-character challenge question |
| `choices` | `ChoiceSpec[]` | exactly **one** `correct:true`; the rest carry a `coach` |
| `win` | string | the world-changing payoff line |
| `recordCodex` | string | a `codex[]` entry `id` to record on success |
| `flag` | string | a story flag set on success (also de-launches the NPC ramp) |
| `achievement` | string? | an `achievements[]` `id` to unlock on success |
| `clarity` | number? | Clarity points the win lifts (default 8) |
| `confidenceCost` | number? | the Fog's bite on a wrong answer (default 12) |

**ChoiceSpec:**

| field | type | notes |
|---|---|---|
| `kind` | `'say'` | always `'say'` — these render as in-character lines |
| `label` | string | the **full sentence** the player says |
| `correct` | `true`? | exactly one choice is correct |
| `coach` | string | (wrong choices) the mentor's re-teach. Shown after the Fog thickens; then the keystone loops back. Make it **teach**, not scold. |

> **How the Codex record + meter lift happen.** You do not call them. On a
> correct choice the loader calls `codex.record(<the codex[] entry matching
> recordCodex>)`, `story.flag(flag)`, `ach.unlock(achievement)` (if any), and
> `raiseClarity(clarity)` — all guarded so a journal/achievement write can never
> break the beat. You just declare the ids; the loader validates that
> `recordCodex`/`achievement` resolve and warns (non-fatally) if they don't.

---

### `codex[]` — CodexEntry  (the ideas you teach)

Fed to the shared Codex (`state.codex`). One entry per keystone that records it.

| field | type | notes |
|---|---|---|
| `id` | string | matches a keystone's `recordCodex` |
| `group` | string | bucket label in the Field Journal panel, e.g. `'Biological Bases'` |
| `title` | string | the turning point, e.g. `'You use all of your brain'` |
| `idea` | string | the real concept in one human sentence — the thing understood |
| `source` | string | the in-world scene/figure that taught it (NOT a real person) |

---

### `achievements[]` — Achievement  (optional milestones)

Fed to the shared Achievements (`state.achievements`). Sparse and meaningful.

| field | type | notes |
|---|---|---|
| `id` | string | matches a keystone's `achievement` |
| `title` | string | the milestone, e.g. `'The whole forest, lit'` |
| `desc` | string | one sentence on what was carried through |

---

## Dialogue trees (for `npcs[].dialogue`)

Standard branching tree used everywhere in the world:

```js
dialogue: {
  start: (ctx) => ctx.is('myflag') ? 'after' : 'root',  // or a string node id
  nodes: {
    root: {
      text: '...',
      choices: [
        { label: 'Ask a thing', next: 'branch' },
        { label: 'Leave it', next: '@close' },   // '@close' ends the talk
      ],
    },
    branch: { text: '...', choices: [] },  // a node with [] choices is "terminal";
                                           // the loader appends the keystone
                                           // launcher to terminals automatically.
    after:  { text: '...', choices: [] },
  },
}
```

The `ctx` passed to `start`/effects exposes: `state`, `story`, `is(flag)`,
`flag(k,v)`, `regionsRestored()`, `hasAbility(id)`, `raiseClarity(n,title,sub)`,
`insight(n,label)`. A choice may carry an `effect(ctx)` that runs on click.

---

## Region ids (quick reference)

`ap-bio` (Unit 1 Biological Bases) · `ap-cognition` (Unit 2 Cognition) ·
`ap-dev` (Unit 3 Development & Learning) · `ap-social` (Unit 4 Social Psych &
Personality) · `ap-health` (Unit 5 Mental & Physical Health) · `ap-methods`
(Research Methods / the Observatory — Case Files hub).

---

## Shipping a pack (the two-line edit)

1. Create `packs/your-pack.js` exporting `pack` (copy `u1-ten-percent.js`).
2. In `packs/index.js`:
   ```js
   import { pack as yourPack } from './your-pack.js';   // line 1
   // ...add to the array:
   export const STORY_PACKS = [ u1TenPercent, yourPack ];  // line 2
   ```

That's it. The loader registers it at boot. Nothing else in the world changes.

---

## Self-check before you ship

- `node --check packs/your-pack.js` passes.
- `id` is unique; `recordCodex` and `achievement` ids resolve to entries in your
  own `codex[]`/`achievements[]` (the loader warns to the console if not).
- Every keystone `choices[]` has **exactly one** `correct:true` and the rest have
  a teaching `coach`.
- No A/B/C stems; choices read as full in-character sentences.
- Every claim is real, in-scope (2024 CED) psychology; no invented real-person
  quotes; clinical content carries the 988 note.
- In-game (or via the debug hook): the keystone is reachable, a wrong choice
  re-teaches + loops, the right choice writes a Codex entry + lifts Clarity, and
  the Codex panel shows the entry. Zero console errors.

### Debug surface (`window.MA.debug`)

```js
MA.debug.packs()            // [{id, unit, title, keystones:[ids]}]
MA.debug.packCount()        // number of loaded packs
MA.debug.keystones()        // all loaded keystone ids
MA.debug.keystoneInfo(id)   // {pack, region, flag, codex}
MA.debug.runKeystone(id)    // open a keystone's encounter (verify the loop)
MA.debug.openCodex()        // open the Field Journal panel
MA.debug.codexCount()       // entries recorded so far
MA.debug.hasCodex(id)       // was a specific entry recorded?
MA.debug.openAchievements() // open the medals panel
```
