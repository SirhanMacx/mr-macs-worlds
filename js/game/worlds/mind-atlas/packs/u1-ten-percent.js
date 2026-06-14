// u1-ten-percent.js — GOLD-STANDARD SAMPLE STORY-PACK for The Mind Atlas.
//
// Unit 1 · Biological Bases of Behavior. A Fog-encounter that dispels the most
// famous neuro-myth there is — "we only use 10% of our brains" — with real,
// 2024-CED-scoped neuroscience (whole-brain activity, glucose cost, fMRI/PET
// evidence, localization, plasticity). It is the GOLD STANDARD the Workflow-2
// pack authors copy: study it, then write your own to the same bar.
//
// What makes it gold (mirrors Trade Winds' Nin-Banda keystone exactly):
//   - The keystone choices are FULL IN-CHARACTER SENTENCES (kind:'say'), never
//     "A) ...", "B) ...", and never a quiz stem.
//   - A WRONG choice does NOT show a red X / score / "Question N of M". The Fog
//     THICKENS (a small Confidence cost — a consequence), and a MENTOR
//     (Sef, the brain-mapper denizen this pack adds, with Atlas's light behind
//     her) walks you back to the truth and loops you to the SAME challenge to
//     answer it from understanding.
//   - The RIGHT choice visibly CHANGES THE WORLD: the Fog withdraws from the
//     Neural Forest reading-room, a Codex entry is written ("Understood"), the
//     Clarity meter lifts, and a story flag opens.
//
// HONEST PEDAGOGY: every claim below is real, in-scope psychology/neuroscience.
// The figure who teaches it (Sef) is FICTIONAL (a mind-denizen, like Astra/Glia)
// so nothing is a fake quote attributed to a real person. The Codex `source`
// names the in-world scene, not a real scientist.
//
// See packs/CONTRACT.md for the full field-by-field spec. This file is one
// `export const pack = { ... }`. To ship it, it is imported in packs/index.js.

export const pack = {
  // ---- identity --------------------------------------------------------------
  id: 'u1-ten-percent',
  unit: 'Unit 1 · Biological Bases of Behavior',
  title: 'The Ten-Percent Fog',

  // ---- extra characters added to the world -----------------------------------
  // Placed at an existing region's station (region: a REGIONS id), offset from
  // its center so it never overlaps the region's own denizen. Speaks paraphrase
  // — a fictional mind-denizen, so no invented real-person quotes.
  npcs: [
    {
      id: 'brainmapper',
      name: 'Sef',
      title: 'a brain-mapper of the Neural Forest',
      region: 'ap-bio',
      offset: [-9, -7],            // ap-bio station is at [150,-110]; glia sits at [7,5]
      hatKind: 'scholar',
      palette: { robe: 0x155e75, trim: 0x0e3a47, skin: 0x9be7ff, hat: 0x0e3a47 },
      // Sef is the pack's mentor voice: lore + the hint that points at the
      // keystone. Standard dialogue tree (root + branches). When the keystone
      // is already cleared she acknowledges it (start() is ctx-aware).
      dialogue: {
        start: (ctx) => (ctx.is && ctx.is('tenpct_cleared')) ? 'after' : 'root',
        nodes: {
          root: {
            text: 'You found the old reading-room of the Forest — and the Fog found it first. It sits in the corner repeating the cosiest lie a mind ever told itself: "you only use a tenth of me, so why bother lighting the rest?" I map this brain for a living. That lie has been costing it whole regions. Will you help me put it out?',
            choices: [
              { label: 'How is the ten-percent idea wrong, exactly?', next: 'why' },
              { label: 'If it is so wrong, why does everyone believe it?', next: 'stick' },
              { label: 'Point me at the Fog. I will answer it.', next: 'sendin' },
            ],
          },
          why: {
            text: 'Because a brain uses essentially ALL of itself. Over a day, brain imaging — fMRI, PET — shows activity across the whole organ; even at rest, the default-mode network hums. It is only about two percent of your body weight yet burns roughly twenty percent of your energy. Evolution would never feed a furnace nine-tenths idle. And we know it is all working because damage anywhere — any region — costs something real.',
            choices: [
              { label: 'So no silent ninety percent waiting to be unlocked.', next: 'sendin' },
              { label: 'Why does everyone still believe the ten-percent line?', next: 'stick' },
            ],
          },
          stick: {
            text: 'It FEELS hopeful — a hidden reserve of genius one trick away. Films and ads sell it. And "use it all" sounds boastful, so the modest-sounding lie wins. But a comfortable story is exactly what the Fog is made of. The cure is the same as always here: ask, check, and trust the evidence over the feeling.',
            choices: [
              { label: 'Then I will answer it with the evidence.', next: 'sendin' },
            ],
          },
          sendin: {
            text: 'Good. It will offer you the easy belief like a kindness. Refuse it with what the brain actually does — all of it, all the time, paid for in glucose — and the reading-room is ours again. If it gets its hooks in you, come back to me. There is no shame in a second pass; I have re-mapped this brain a hundred times.',
            choices: [],
          },
          after: {
            text: 'The reading-room is bright again — every shelf lit, not a tenth of them. You answered the Fog the way this brain needs to answer everything: with the evidence, not the comfort. The Forest remembers it now.',
            choices: [],
          },
        },
      },
    },
  ],

  // ---- named cutscenes (playCutscene beat arrays) -----------------------------
  // Keyed by a FLAG name; a trigger fires one by name. Beats use the cutscene
  // format: { kicker, text, tint:'amber'|'dusk'|'cold'|'stone', art, palette }.
  cutscenes: {
    // Fires once when the player first enters the Neural Forest region — sets up
    // the reading-room and points at Sef, so the keystone has a frame.
    TENPCT_INTRO: [
      {
        tint: 'cold', kicker: 'The reading-room of the Forest',
        text: 'Deep in the Neural Forest, between two great glowing axons, an old reading-room stands half-dark. Nine of its ten shelves have gone grey, as if someone decided they were never worth lighting. A grey shape sits among them, content.',
      },
      {
        tint: 'dusk',
        text: 'A brain-mapper waits at the lit shelf, lantern raised against the haze. "You feel it too," she says. "The Fog has convinced this room it is mostly empty. Come — I will show you it never was."',
      },
    ],
  },

  // ---- triggers: WHEN a cutscene fires (once each) ----------------------------
  // on: 'visit'  → fires when the player enters region `value`'s area
  //     'flag'   → fires when story flag `value` is set
  //     'questDone' → fires when quest id `value` completes (TW-style worlds)
  //     'enter'  → alias of 'visit'
  // play: the cutscenes[] key to play. reward (optional): { clarity, insight, xp }.
  triggers: [
    { on: 'visit', value: 'ap-bio', play: 'TENPCT_INTRO', reward: { clarity: 4, insight: 10 } },
  ],

  // ---- keystones: THE CORE ----------------------------------------------------
  // An in-character UNDERSTANDING beat. The loader makes each reachable from
  // Sef's "answer the Fog" path and as a debug jump target. Shape mirrors the
  // wraith encounter + Trade Winds keystone:
  //   npc        → which pack NPC delivers it (the Fog speaks; mentor coaches)
  //   region     → the region whose standing (Clarity) lifts on success
  //   taunt      → the Fog's in-character offer of the comfortable lie
  //   ask        → the priestess-style challenge question (in character)
  //   choices[]  → kind:'say' full sentences; exactly one correct
  //       correct: true        → the right understanding
  //       coach (on a wrong)   → the MENTOR's re-teach (consequence, not red X);
  //                              after it, the SAME keystone re-renders (loop)
  //   win        → the world-changing payoff line shown on success
  //   recordCodex→ the Codex id (must match an entry in this pack's codex[])
  //   flag       → story flag set on success
  //   achievement→ (optional) achievement id from this pack's achievements[]
  //   confidenceCost (optional, default 12) → the Fog's bite on a wrong answer
  keystones: [
    {
      id: 'ks_tenpercent',
      npc: 'brainmapper',
      region: 'ap-bio',
      kicker: 'THE FOG · the ten-percent lie',
      title: 'The Ten-Percent Fog',
      taunt: 'The Fog uncurls from the grey shelves, gentle as good news. "Cartographer. Lovely of you to come. Here is a kindness, free: this brain only ever uses a tenth of itself. The other ninety percent? Sleeping. Spare. So you can stop lighting shelves and rest — there was never much here to map."',
      ask: 'Sef sets her lantern on the dark shelf and looks to you. "It always opens with that one. So answer it, plainly — when this person is just sitting here, reading, doing nothing special, how much of their brain is actually working? Tell the Fog the truth of it."',
      choices: [
        {
          kind: 'say',
          label: 'Essentially all of it. Imaging like fMRI and PET shows activity across the whole brain over a day — even at rest the default-mode network hums. It is two percent of body weight but burns about twenty percent of the energy; no body would feed a furnace that sat nine-tenths idle.',
          correct: true,
        },
        {
          kind: 'say',
          label: 'About ten percent, like you say — and if I could just switch on the rest, this mind would wake up a genius.',
          // WRONG: the Fog thickens; Sef walks you back to the science, then loop.
          coach: 'The shelves dim another notch and the cold bites — that is the Fog feeding on the easy hope. Sef steadies you, Atlas\'s light behind her. "You reached for the dream of a hidden reserve. There isn\'t one. Brain imaging shows the WHOLE organ active across a day; the resting brain still runs its default-mode network. And it eats — two percent of your weight, a fifth of your fuel. Nothing in a body stays that hungry to do nothing. Tell it THAT, and the room is ours."',
        },
        {
          kind: 'say',
          label: 'Only the part doing the reading — one little reading-spot lights up and the rest of the brain goes dark until it is needed.',
          // WRONG: localization is real, but not "the rest goes dark." Re-teach.
          coach: 'A shelf gutters out and the haze presses closer. Sef shakes her head, kindly. "Closer — different jobs DO live in different places; that is localization, and it is true. But a region going quiet is not the brain going dark. Reading alone lights vision, language, memory, attention, movement to track the line — and the default-mode network never fully stops. The whole organ is in use; pieces just take turns leading. Answer with that."',
        },
      ],
      win: 'The Fog flinches from the evidence and pulls back off the shelves — and one by one they catch light, all ten, not one. "…All of it. Always all of it." It thins to a wisp and slips out under the door. Sef lifts her lantern to the bright room. "There. Not a tenth — the whole forest, lit. This brain will not forget that it is all worth using."',
      recordCodex: 'cx_tenpercent',
      flag: 'tenpct_cleared',
      achievement: 'ach_tenpct',
      confidenceCost: 12,
    },
  ],

  // ---- codex: the real ideas this pack teaches (fed to the shared Codex) -------
  // Each keystone's recordCodex points at one of these. group buckets it in the
  // Field Journal panel; idea is the one-sentence understanding; source names the
  // in-world scene (NOT a real person — honest pedagogy).
  codex: [
    {
      id: 'cx_tenpercent',
      group: 'Biological Bases',
      title: 'You use all of your brain',
      idea: 'The "10% of the brain" claim is a myth: imaging shows the whole brain is active across a day, even at rest the default-mode network runs, and the brain burns ~20% of the body\'s energy at ~2% of its weight — different regions specialize (localization) but none sit idle in reserve.',
      source: 'Sef, brain-mapper of the Neural Forest',
    },
  ],

  // ---- achievements: optional milestones (fed to the shared Achievements) ------
  achievements: [
    {
      id: 'ach_tenpct',
      title: 'The whole forest, lit',
      desc: 'You put out the ten-percent Fog with real neuroscience and lit every shelf of the Neural Forest reading-room.',
    },
  ],
};

export default pack;
