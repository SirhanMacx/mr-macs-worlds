# Trade Winds — Story-Pack Authoring Contract

**This is the authoritative spec.** A "story pack" is an additive ES module that
bolts extra characters, cutscenes, and **keystones** (understanding beats) onto the
shipped Trade Winds world *without editing any core file*. Dozens of packs can be
authored in parallel and plugged in cleanly. The loader in `../game.js` registers
every pack **defensively** — one malformed pack is logged and skipped, never
crashes the world.

The gold-standard reference is **`unit3-belief-systems.js`** in this folder. Copy
it. Everything below documents the shape it follows.

---

## 0. The non-negotiable craft bar

A keystone is **the moment the player UNDERSTANDS** a real curriculum idea — not a
quiz. It must follow the exemplar in `../content.js` (the Nin-Banda
`challenge`/`allywin`/`lostcheap`/`lostgods` tree):

- **Choices are full in-character sentences** (`kind:'say'`). The player *speaks*
  an interpretation. **Never** A/B/C stems, never "Question N of M", never a score.
- **A wrong choice is a CONSEQUENCE, not a red X.** It re-routes to a mentor who
  *teaches the missing idea*, then **loops back** to the challenge so the player
  answers again. No failure screen, no points lost.
- **The right choice visibly changes the world**: it records a **Codex** entry
  (the understanding), **lifts House Standing** (the meter), optionally sets a story
  flag and unlocks an **achievement**. A mentor confirms *why*.
- **Honest pedagogy.** Every figure, place, date, and idea is real history. Real
  figures speak **paraphrase grounded in the record** (laws, edicts, travel
  accounts) — **never invented verbatim quotes.**
- **De-identified.** The only real person ever named is "Mr. Maccarello". No other
  real teacher/school/student names.

The **Codex** is the game's Enduring-Issues capstone evidence-book: each keystone
adds one understanding the student can later walk back into their essay.

---

## 1. Module shape

A pack is a **pure DATA module** (no imports, no engine calls — so it can't crash
the world on its own). It must `export const pack = { ... }` and may also default-export it.

```js
export const pack = {
  id, unit, title,          // identity
  npcs: [ ... ],            // extra characters at existing cities
  cutscenes: { FLAG: [beats] }, // named playCutscene sequences
  triggers: [ ... ],        // when each cutscene fires (once)
  keystones: [ ... ],       // THE CORE understanding beats
  codex: [ ... ],           // the real ideas this pack teaches
  achievements: [ ... ],    // optional milestones
};
export default pack;
```

---

## 2. Identity

| field   | type   | required | meaning |
|---------|--------|----------|---------|
| `id`    | string | **yes**  | globally unique pack id, kebab-case, e.g. `'u3-belief-systems'`. Prefixed onto generated NPC/trigger/cutscene keys, so it must be unique across all packs. |
| `unit`  | string | yes      | the curriculum unit / region / era label. **Use this as the Codex `group`** so a pack's understandings bucket together, e.g. `'Unit 3 — Belief Systems'`. |
| `title` | string | yes      | human-readable pack title (shown only in the debug list). |

---

## 3. `npcs` — extra characters

Each NPC is placed at an **existing city** and given a dialogue tree built from its
keystone (see §5). Supporting characters carry period-true names/trades; real
figures speak paraphrase.

```js
npcs: [{
  id: 'u3-monk-thessaly',     // unique within the pack; loader prefixes it for marker/extra ids
  name: 'Tissa',
  title: 'Wandering Monk of the Sangha',
  city: 'varanasi',           // MUST be an existing CITIES id (see list below)
  era: 2,                     // NPC hidden until the world reaches this era
  offset: [-6, 5],            // [x, z] relative to the city center — keep clear of existing NPCs
  hatKind: 'hood',            // npc.js HATS key: none | cap | brim | turban | crown | hood | scholar
  palette: { robe: 0xc8a13c, trim: 0x8a6a1e, skin: 0xa9672f, hat: 0xb8902c },
  keystoneId: 'ks-ashoka-dhamma', // ties this NPC to a keystone in `keystones`
  introText: '...',           // shown the first time(s) before the keystone
  afterText: '...',           // shown once the keystone is understood
}]
```

**Existing city ids** (era in parentheses): `byblos`(1), `ur`(1), `catalhoyuk`(1),
`athens`(2), `varanasi`(2), `changan`(2), `timbuktu`(3), `florence`(4), `calicut`(4).

Notes:
- The loader builds the NPC's tree: `introText` on first talk → the keystone
  challenge while unwon → `afterText` once understood. The keystone is **always
  reachable** (it routes straight in after the intro, and again on every re-entry —
  that is what makes the wrong-path loop work).
- An NPC **without** a matching keystone is still a valid, playable flavor NPC
  (it just shows `introText`).
- Place `offset` so the NPC doesn't overlap a core NPC. (Varanasi's edict envoy
  sits at `[6,-4]`, so the sample monk uses `[-6,5]`.)

---

## 4. `cutscenes` + `triggers` — story beats

`cutscenes` is a map of **name → array of beats**. A beat is the `playCutscene`
format (do **not** import cutscene.js — just author the data):

```js
cutscenes: {
  U3_INTRO: [
    { tint:'stone', kicker:'Varanasi — the Belief Crossroads', art:'notice',
      text:'...' },
    { tint:'amber', kicker:'A question for a trader', art:'portrait',
      palette:{ robe:0xc8a13c, trim:0x8a6a1e, skin:0xa9672f, hat:0xb8902c },
      text:'...', cta:'Seek out the monk' },
  ],
}
```

Beat fields: `kicker` (small caps label, optional), `text` (required), `tint`
(`amber`|`dusk`|`cold`|`stone`), `art` (`candle`|`ledger`|`notice`|`portrait`|`null`),
`palette` (only with `art:'portrait'`), `cta` (button label; defaults Continue/Begin).

`triggers` say **when** a cutscene fires. Each fires **once** (the loader gates it
on a generated story flag that survives saves/reloads):

```js
triggers: [{
  on: 'visit',          // 'visit' | 'enter' | 'flag' | 'questDone'
  value: 'varanasi',    // city id | era number | story-flag key | quest id (per `on`)
  play: 'U3_INTRO',     // a key in `cutscenes`
  reward: { house: 1, title: '...', sub: '...' }, // optional House lift after the beats
}]
```

| `on`        | `value` is…            | fires when… |
|-------------|------------------------|-------------|
| `visit`     | a city id              | the player enters that city |
| `enter`     | an era number (2/3/4)  | the world reaches that era |
| `flag`      | a story-flag key       | that story flag becomes set |
| `questDone` | a quest id             | that quest completes |

---

## 5. `keystones` — THE CORE

A keystone is a dialogue tree authored as **data**, compiled by the loader into the
live tree the engine plays. It is the single place the world changes on understanding.

```js
keystones: [{
  id: 'ks-ashoka-dhamma',     // globally unique
  npc: 'u3-monk-thessaly',    // which pack NPC carries it (or set NPC.keystoneId)
  codexId: 'cx-ashoka-dhamma',// Codex entry recorded on success (must exist in `codex`)
  house: 2,                   // House Standing lifted on the right answer
  houseTitle: '...', houseSub: '...', // banner shown on the lift
  flag: 'u3AshokaUnderstood', // optional story flag set on success
  achievement: 'ach-belief-and-power', // optional achievement id unlocked on success
  start: 'challenge',         // entry node id
  nodes: {
    challenge: {
      text: '... the in-character question ...',
      choices: [
        { kind:'say', label:'<full in-character RIGHT sentence>', right:true, next:'won' },
        { kind:'say', label:'<full in-character WRONG sentence>', setFlag:'...', next:'reteachX' },
        { kind:'say', label:'<another WRONG sentence>', next:'reteachY' },
      ],
    },
    won: {
      onEnter:'reward',       // pays out Codex + House + flag + achievement, ONCE
      text:'... mentor confirms WHY ...',
      choices:[ { label:'...', next:'@close' } ],
    },
    reteachX: {               // CONSEQUENCE + re-teach, then LOOP back
      text:'... mentor teaches the missing idea ...',
      choices:[ { label:'... let me answer again.', clearFlag:'...', next:'challenge' } ],
    },
    reteachY: { text:'...', choices:[ { label:'...', next:'challenge' } ] },
  },
}]
```

**Node fields**: `text` (string), `choices` (array), `onEnter:'reward'` (optional —
fires the keystone reward the first time the node is shown; put it on the `won` node).

**Choice fields**:
- `label` — the sentence the player speaks. Required. For a keystone, set `kind:'say'`.
- `next` — the node id to go to. Use `'@close'` to end the conversation.
- `right: true` — marks the success choice (also fires the reward as a safety net;
  pair it with an `onEnter:'reward'` `won` node).
- `setFlag` / `clearFlag` — a story-flag key to set / clear (use to remember a
  specific misread for nuance; the sample sets `u3GuiltMisread` then clears it).

**How a keystone records its Codex entry + lifts the meter (handled by the loader):**
When the player reaches the `won` node (or picks a `right` choice), the loader runs
the reward **exactly once**, in this order, each step individually guarded:
1. `codex.record(<the codex entry whose id === codexId>)` — idempotent; fires the
   quiet "Understood" chime + float.
2. `story.flag(flag)` if `flag` is set.
3. `raiseHouse(house, houseTitle, houseSub)` if `house > 0` — the meter pulse +
   banner + sparkle.
4. `ach.unlock(achievement, {title,desc})` if `achievement` is set — first-time
   banner + medal.

Because `record`/`unlock` are idempotent and the reward is fired-once, re-entering a
won keystone is harmless.

---

## 6. `codex` — the real ideas taught

Fed to the shared Codex. A keystone's `codexId` **must** point to an entry here.

```js
codex: [{
  id: 'cx-ashoka-dhamma',           // globally unique; record() is idempotent by id
  group: 'Unit 3 — Belief Systems', // bucket label — use the pack's `unit`
  title: 'Why rulers adopt and spread belief systems',
  idea: 'one human sentence — the thing understood (real history).',
  source: 'Tissa, wandering monk of the Sangha (on the edicts of King Ashoka)',
}]
```

---

## 7. `achievements` — optional milestones

Sparse and meaningful. A keystone's `achievement` id (or a future trigger) unlocks one.

```js
achievements: [{
  id: 'ach-belief-and-power',           // globally unique
  title: 'Belief is the cheapest garrison',
  desc: 'You understood why a victorious king carves his faith in stone.',
}]
```

---

## 8. Registering a pack — the ONLY edit outside your file

In `index.js`, two one-line edits:

```js
import { pack as myPack } from './my-pack-file.js';   // 1) import
export const STORY_PACKS = [
  unit3BeliefSystems,
  myPack,                                              // 2) add to the array
];
```

Nothing in `game.js` or any engine file changes. The loader picks it up at boot.

---

## 9. Uniqueness & safety checklist (before you ship a pack)

- [ ] `pack.id`, every `npc.id`, `keystone.id`, `codex[].id`, `achievement[].id`
      are **globally unique** across ALL packs (the loader namespaces marker/extra
      ids by pack, but Codex/achievement ids are global — collisions silently dedupe).
- [ ] Every `keystone.codexId` exists in `pack.codex`; every `keystone.achievement`
      (if set) exists in `pack.achievements`.
- [ ] Every `npc.city` is a real CITIES id; `offset` avoids existing NPCs.
- [ ] Every keystone wrong path **re-teaches and loops back** to the challenge.
- [ ] The right path uses a `won` node with `onEnter:'reward'`.
- [ ] Honest history; figures speak paraphrase (no fake quotes); de-identified.
- [ ] `node --check my-pack-file.js` passes.

---

## 10. Verifying (debug hooks on `window.TW.debug`)

Load `world.html?w=global9`, then in the console:

- `TW.debug.packs()` → list loaded packs (and any that failed, with the error).
- `TW.debug.keystones()` → every keystone, its NPC, and won-state.
- `TW.debug.gotoKeystone('ks-ashoka-dhamma')` → era-unlock + teleport + open the
  NPC straight at the keystone (then play the wrong path to see it re-teach+loop,
  and the right path to see the Codex record + House lift).
- `TW.debug.openCodex()` / `TW.debug.openAchievements()` → open the panels.
- `TW.debug.codexEntries()` / `TW.debug.achievements()` → inspect recorded data.
- `TW.debug.playPackCutscene('u3-belief-systems:U3_INTRO')` → force-play a cutscene.
