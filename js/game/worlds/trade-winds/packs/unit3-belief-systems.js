// unit3-belief-systems.js — SAMPLE STORY-PACK (the GOLD STANDARD).
//
// Workflow-2 authors: COPY THIS FILE to build a new content pack. It is a pure
// DATA module — no imports, no engine calls — so it can never crash the world on
// its own. The loader in ../game.js wires everything below into the live game
// (adds the NPC, fires the cutscene once, makes the keystone reachable, records
// the Codex entry, lifts House Standing, unlocks the achievement). See CONTRACT.md
// for the authoritative field-by-field spec.
//
// THIS PACK teaches a real Global-History-9, Unit 3 (Belief Systems) keystone:
// WHY a ruler ADOPTS and SPREADS a belief system — to UNIFY a vast, diverse
// realm and LEGITIMIZE his rule. The case is Ashoka of the Maurya Empire, who
// after the bloodbath at Kalinga turned to Buddhist dhamma and carved it on rocks
// and pillars across his lands. (Honest pedagogy: Ashoka and the monk speak
// PARAPHRASE grounded in the edicts and the historical record — no invented
// verbatim quotes.) It is set at Varanasi, the Belief Crossroads, alongside the
// existing edict-courier quest but with its own NEW character so nothing collides.

export const pack = {
  // ---- identity ----
  id: 'u3-belief-systems',
  unit: 'Unit 3 — Belief Systems',          // the Codex group + author-facing label
  title: 'Why a King Carves His Faith in Stone',

  // ---- extra characters added to the world ----
  // Real figure (Ashoka) speaks paraphrase; the monk is a period-true scholar who
  // serves as the MENTOR who re-teaches on a wrong keystone answer. Both are placed
  // at an EXISTING city (Varanasi / the Belief Crossroads). The keystone tree lives
  // ON this NPC (see `keystone` below); plain conversational nodes give the world
  // texture before and after the turning point.
  npcs: [
    {
      id: 'u3-monk-thessaly',           // unique id; loader prefixes pack id for marker/extra ids
      name: 'Tissa',
      title: 'Wandering Monk of the Sangha',
      city: 'varanasi',                  // must be an existing CITIES id
      era: 2,                            // hidden until the world reaches this era
      offset: [-6, 5],                   // placed relative to the city center (avoids the edict envoy at [6,-4])
      hatKind: 'hood',                   // npc.js HATS key: none|cap|brim|turban|crown|hood|scholar
      palette: { robe: 0xc8a13c, trim: 0x8a6a1e, skin: 0xa9672f, hat: 0xb8902c },
      // keystoneId points this NPC's conversation at the keystone in `keystones`
      // below. The loader builds the dialogue tree: a calm intro the first times,
      // the keystone challenge while it is unwon, and a warm "after" once understood.
      keystoneId: 'ks-ashoka-dhamma',
      // optional flavor shown before the keystone is even reachable / after it is won
      introText: 'Peace on your road, trader. I walk from town to town with nothing but a bowl and the teaching. Near here, at Sarnath, the Buddha first set the wheel of dhamma turning — and not far from here a great king has lately staked his whole empire on it. Stay a moment; there is a thing about kings and belief worth understanding before you trade another mile.',
      afterText: 'You see it now: a king who could not hold a hundred peoples with spears alone reached for something they could ALL carry — a shared teaching. Belief is the cheapest garrison a ruler ever posts. Walk gently, friend.',
    },
  ],

  // ---- named story-beat sequences (playCutscene format) ----
  // Each is an array of beats: { kicker, text, tint, art, palette, cta }. The
  // loader plays one ONCE when a matching trigger fires. tint ∈ amber|dusk|cold|stone,
  // art ∈ candle|ledger|notice|portrait|null. Use art:'portrait' + palette for a face.
  cutscenes: {
    // Fires the first time the player reaches Varanasi in Era II — frames the unit
    // question ("why would a conqueror kneel?") before the player meets the monk.
    U3_INTRO: [
      {
        tint: 'stone', kicker: 'Varanasi — the Belief Crossroads', art: 'notice',
        text: 'On the Ganges ghats the pilgrims outnumber the merchants. Word runs the bazaar like fire: the great king Ashoka, who once drowned Kalinga in blood, has put down the sword and taken up the teaching of the Buddha — and is carving his change of heart onto rocks in every corner of his realm for all to read.',
      },
      {
        tint: 'amber', kicker: 'A question for a trader', art: 'portrait',
        palette: { robe: 0xc8a13c, trim: 0x8a6a1e, skin: 0xa9672f, hat: 0xb8902c },
        text: 'A barefoot monk at the temple steps catches your eye. "You look like a merchant who weighs things," he says. "Then weigh this one: a conqueror who has already WON — why would he kneel? Why spend a kingdom\'s stone to spread a faith instead of an army? Find the answer and you will understand power better than most kings do." His name is Tissa. Go and ask him.',
        cta: 'Seek out the monk',
      },
    ],
  },

  // ---- triggers: when each cutscene fires (once) ----
  // on: 'visit'   value = a city id           — fires when the player enters that city
  //     'enter'   value = an era number       — fires when the world reaches that era
  //     'flag'    value = a story flag key     — fires when that story flag is set
  //     'questDone' value = a quest id         — fires when that quest completes
  // play = the key in `cutscenes` to play. reward (optional) lifts House Standing
  // after the beats: { house, title, sub }.
  triggers: [
    {
      on: 'visit', value: 'varanasi', play: 'U3_INTRO',
      reward: { house: 1, title: 'A question worth a kingdom', sub: 'Varanasi sets you a riddle about belief and power.' },
    },
  ],

  // ---- THE CORE: keystones ----
  // A keystone is the moment the player UNDERSTANDS. It is a dialogue tree built
  // to the exemplar bar (the Nin-Banda pattern in content.js):
  //   • choices are FULL IN-CHARACTER SENTENCES (kind:'say') — never "A/B/C" stems,
  //     never a quiz. The player SPEAKS an interpretation.
  //   • the RIGHT choice visibly changes the world: it records the pack's Codex
  //     entry (codexId), lifts House Standing (house), and may set a story flag /
  //     unlock an achievement. The mentor confirms WHY.
  //   • a WRONG choice is a CONSEQUENCE, not a red X: the scene re-routes to a
  //     mentor who teaches the missing idea, then LOOPS back to `challenge` so the
  //     player answers again. No score, no "Question N of M", no failure screen.
  // The loader exposes this tree on the NPC whose keystoneId matches `id`.
  keystones: [
    {
      id: 'ks-ashoka-dhamma',
      npc: 'u3-monk-thessaly',            // which pack NPC carries this keystone
      codexId: 'cx-ashoka-dhamma',        // the Codex entry recorded on success (see `codex`)
      house: 2,                            // House Standing lifted on the right answer
      houseTitle: 'You read a king\'s true reason',
      houseSub: 'A monk of Sarnath marks the House of the Open Road as one that understands why power kneels.',
      flag: 'u3AshokaUnderstood',          // optional story flag set on success
      achievement: 'ach-belief-and-power', // optional achievement id unlocked on success (see `achievements`)
      // entry node of the tree:
      start: 'challenge',
      nodes: {
        challenge: {
          text: 'Tissa folds his legs on the warm stone. "So. King Ashoka conquered Kalinga and counted the dead — a hundred thousand, the edicts say, and more carried off. He had already WON; no army could touch him. And yet he turned to the Buddha\'s dhamma and is now carving it across an empire that runs from the mountains to the southern seas — dozens of peoples, a hundred tongues, who never chose him. Tell me, merchant who weighs things: WHY would a victorious king spend his treasury spreading a belief instead of posting more spears?"',
          choices: [
            {
              kind: 'say',
              // ★ RIGHT — belief as the cheap, shared mortar that unifies a diverse
              // realm AND legitimizes the ruler who could never garrison it all.
              label: 'Because spears cannot hold a hundred peoples who never chose him — there are too many, too far apart. A shared teaching can. Dhamma gives every subject one set of values to live by and makes Ashoka its protector, so they obey not just his soldiers but his rightness. Belief unifies the realm and makes his rule legitimate — that is cheaper and stronger than any garrison.',
              // marks: codexId, house, flag, achievement (handled by the loader through ctx)
              right: true,
              next: 'won',
            },
            {
              kind: 'say',
              // ✗ WRONG (the seductive misread) — "he simply got religion / went soft."
              // Re-routes to the monk's correction, then loops back.
              label: 'Because the slaughter broke his nerve. He simply felt guilt and went soft — a king who has lost his stomach for war, nothing cleverer than that.',
              setFlag: 'u3GuiltMisread',
              next: 'reteachGuilt',
            },
            {
              kind: 'say',
              // ✗ WRONG (the other common misread) — "the gods demanded it."
              label: 'Because the gods commanded it. A king must spread the one true faith or be cursed — it is duty to heaven, not statecraft.',
              next: 'reteachGods',
            },
          ],
        },

        // ---- RIGHT PATH: the world changes ----
        won: {
          // The loader runs the keystone's reward (Codex + House + flag + achievement)
          // the FIRST time this node is reached, via the `onEnter:'reward'` marker.
          onEnter: 'reward',
          text: '(Tissa nods slowly, the way a teacher nods at a student who has overtaken him.) "Yes. You see the king behind the convert. An empire that wide cannot be held by fear — there are not soldiers enough in the world. So Ashoka gives his hundred peoples something they can ALL carry: one teaching, one set of duties, with himself as its great protector. They keep his peace because they believe in it, and they believe in HIM for keeping it. That is why he spends stone, not steel. Belief is the mortar of empires — and you understood it before I had to say it." He presses his palms together. "Your house has my blessing on every road it walks."',
          choices: [
            { label: 'Then I\'ll carry that understanding with me.', next: '@close' },
          ],
        },

        // ---- WRONG PATH: consequence + re-teach + LOOP back to challenge ----
        reteachGuilt: {
          text: '(Tissa does not frown; he only tilts his head.) "Guilt was the door, friend — the edicts say plainly the king grieved Kalinga. But grief is not a POLICY. A guilty man weeps in private; he does not carve his change of heart onto rocks in a dozen languages from the mountains to the sea. Ask yourself why a sorry king would PUBLISH his sorrow across an empire of strangers. What does spreading the teaching DO for a ruler who must hold lands too vast to garrison?" He waits, patient. "Weigh it again."',
          choices: [
            { label: 'I see — it is what the published belief DOES for his rule. Let me answer again.', clearFlag: 'u3GuiltMisread', next: 'challenge' },
          ],
        },
        reteachGods: {
          text: '(Tissa smiles gently.) "You have the reverence right and the reason wrong. Ashoka does not force one faith — his own edicts urge respect for ALL sects; he honors Brahmins and ascetics alike. This is not heaven\'s command; it is a king\'s craft. Dhamma is the common ground he offers a hundred quarrelling peoples so they can be ONE realm under him. Think less about the gods and more about the empire. Why would shared values knit a diverse kingdom together — and bind it to its king? Try once more."',
          choices: [
            { label: 'Of course — it is the empire he is holding together. Let me try again.', next: 'challenge' },
          ],
        },
      },
    },
  ],

  // ---- Codex: the real ideas this pack teaches ----
  // Fed to the shared Codex. The keystone's codexId points here. group should equal
  // the pack's `unit` so entries bucket together in the journal. id must be globally
  // unique across all packs.
  codex: [
    {
      id: 'cx-ashoka-dhamma',
      group: 'Unit 3 — Belief Systems',
      title: 'Why rulers adopt and spread belief systems',
      idea: 'A realm too vast and varied to hold by force can be unified by a shared belief — and a ruler who champions that belief makes his power legitimate. Ashoka spread Buddhist dhamma across the Maurya Empire to bind a hundred peoples together and to rule as the teaching\'s protector, not just its conqueror.',
      source: 'Tissa, wandering monk of the Sangha (on the edicts of King Ashoka)',
    },
  ],

  // ---- Achievements: optional milestones ----
  // Sparse and meaningful. Unlocked by a keystone (achievement id) or a trigger.
  achievements: [
    {
      id: 'ach-belief-and-power',
      title: 'Belief is the cheapest garrison',
      desc: 'You understood why a victorious king carves his faith in stone — to unify an empire too wide for spears and to make his rule legitimate.',
    },
  ],
};

export default pack;
