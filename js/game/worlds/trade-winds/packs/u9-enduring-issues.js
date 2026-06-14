// u9-enduring-issues.js — STORY-PACK: the Enduring-Issues Capstone.
//
// This is a pure DATA module (no imports, no engine calls) so it can never crash
// the world on its own. The loader in ../game.js wires everything below into the
// live game. See CONTRACT.md for the authoritative field-by-field spec; the
// gold-standard structural template is ../packs/unit3-belief-systems.js.
//
// THE ASSIGNMENT (Unit 9 — Enduring Issues Capstone): a fictional in-world
// ARCHIVIST at Byblos — keeper of your house's ledger and, with it, the whole
// Codex of understandings you have gathered on the road — runs the capstone the
// way the NYS Regents asks a Global student to write the Enduring Issues Essay.
// The player does NOT take a quiz. The player ASSEMBLES a thesis-style claim:
//   1) name a real Enduring Issue (the impact of trade networks / power &
//      authority / conflict / technology & innovation),
//   2) choose, in full in-character sentences, which gathered understandings make
//      the STRONGEST EVIDENCE — and crucially, evidence that spans DIFFERENT ERAS,
//      because the Regents rubric rewards an issue shown to ENDURE across time.
// A weak claim (one era, one example, or a list with no argument) is gently
// re-COACHED by the archivist, who teaches what makes evidence strong, then LOOPS
// the player back to build the claim again — never a red X, never a score.
//
// HONEST PEDAGOGY: every figure, place, date and idea referenced is real history
// (Ashoka's edicts, the Han/Silk-Road exchange, Mansa Musa's 1324 hajj, Byblos
// and its alphabet, the post-1450 ocean voyages). The archivist is a fictional
// in-world denizen so no real person is given invented words. The only real
// person ever named is "Mr. Maccarello" — and he is not named here.
//
// CODEX-EVIDENCE WIRING: the pack references the player's gathered understandings
// by STRING id only (e.g. 'cx-ashoka-dhamma'). It does NOT read live save state
// (a pure-data pack cannot). The loader / a later workflow can use `evidenceIds`
// and the per-choice `usesEvidence` strings to gate availability or highlight
// which Codex entries a player has actually earned; if it does nothing, the
// keystone still plays start-to-finish as authored.

export const pack = {
  // ---- identity ----
  id: 'u9-enduring-issues',
  unit: 'Unit 9 — Enduring Issues Capstone',   // the Codex group + author-facing label
  title: 'The Keeper of the Ledger — Building an Enduring-Issues Argument',

  // The understandings this capstone draws on, by Codex id. These are the ids the
  // base world and other packs record on the road (the trade-network keystone is
  // the spine of Trade Winds; the others are the cross-era understandings a player
  // gathers). Referenced by STRING only — never read live here. A later workflow
  // may use this list to check "has the player gathered enough" before the keeper
  // opens the capstone; if it doesn't, the keystone still plays as authored.
  evidenceIds: [
    'cx-trade-networks',     // the spine: trade moves goods, ideas, faiths, disease
    'cx-ashoka-dhamma',      // Unit 3 pack: belief unifies a vast realm (Maurya, ~250 BCE)
    'cx-power-and-authority',// how rulers build and justify power across eras
    'cx-tech-and-innovation',// how a single invention reshapes the world
    'cx-conflict-and-exchange', // contact carries both violence and exchange
  ],

  // ---- extra characters added to the world ----
  // The Archivist is a fictional period-true keeper of the house's books at Byblos
  // (where, per the base content, "Your house keeps its ledgers here"). She is the
  // MENTOR who re-teaches on a weak capstone claim. Placed at an EXISTING city
  // (Byblos) at an offset clear of the harbormaster Zimrida [6,3] and Old Anath
  // [-4,-7]. Hidden until Era 4 so the player has had a whole game to gather
  // understandings before the capstone opens.
  npcs: [
    {
      id: 'u9-archivist-byblos',
      name: 'Shapash',
      title: 'Keeper of the House Ledger',
      city: 'byblos',                    // must be an existing CITIES id
      era: 4,                            // hidden until the world reaches the First Global Age
      offset: [-8, 4],                   // clear of Zimrida [6,3] and Anath [-4,-7]
      hatKind: 'scholar',                // npc.js HATS key: none|cap|brim|turban|crown|hood|scholar
      palette: { robe: 0x3c5a6e, trim: 0x24414f, skin: 0xc98a5b, hat: 0x1d3543 },
      keystoneId: 'ks-enduring-issues',
      introText: 'Welcome home, heir. Four eras your house has walked — from cedar on a donkey\'s back to porcelain off the great fleets — and I have kept every line of it in this ledger. But a ledger of trades is not yet WISDOM. The scribes of Mr. Maccarello\'s school across the sea will one day ask their students to do a strange and difficult thing: to look across a thousand years and name an issue that NEVER goes away — and then to PROVE it endured, with evidence from far-apart times. You have gathered the evidence on the road without knowing it. Sit. Let me show you how a merchant\'s notes become an argument.',
      afterText: 'There it is, written in your own hand at last: not a list of things that happened, but a claim about how the world WORKS — shown to be true in age after age. That is the difference between a trader who remembers and a thinker who understands. Your mother would have read this page twice and smiled. Walk on, keeper of your own ledger now.',
    },
  ],

  // ---- named story-beat sequences (playCutscene format) ----
  cutscenes: {
    // Fires the first time the player reaches Byblos in Era IV — frames the capstone
    // (the whole journey was gathering evidence) before they sit with the archivist.
    U9_CAPSTONE_INTRO: [
      {
        tint: 'dusk', kicker: 'Byblos — the Ledger Room', art: 'ledger',
        text: 'The harbor you started from looks small now. Four generations of your house — and four eras of the world — fit inside one cedar-bound book on the ledger-room table. Cuneiform receipts at the front; a Florentine bill of exchange near the back; and everywhere between, the roads you walked and the things you came to understand on them.',
      },
      {
        tint: 'amber', kicker: 'The keeper sets you a final road', art: 'portrait',
        palette: { robe: 0x3c5a6e, trim: 0x24414f, skin: 0xc98a5b, hat: 0x1d3543 },
        text: 'Shapash, the old keeper of the ledger, turns the book to face you and taps a blank back page. "One thing the road never asked you," she says, "but the world always will: of everything you have seen, what TROUBLE keeps coming back, century after century — and can you prove it kept coming back? Bring me what you understood out there. We will turn your trades into a true argument." This is the Enduring Issues page. Go and write it with her.',
        cta: 'Sit with the keeper',
      },
    ],
  },

  // ---- triggers: when each cutscene fires (once) ----
  triggers: [
    {
      on: 'visit', value: 'byblos', play: 'U9_CAPSTONE_INTRO',
      reward: { house: 1, title: 'The ledger turns to its last page', sub: 'Byblos asks you to turn a lifetime of trades into one enduring argument.' },
    },
  ],

  // ---- THE CORE: keystones ----
  // The capstone keystone. The player UNDERSTANDS how to build an Enduring-Issues
  // argument from evidence across time. Choices are FULL IN-CHARACTER SENTENCES.
  // A weak claim re-routes to the keeper, who teaches the missing craft and LOOPS
  // back. The strong claim records the Codex entry + lifts House Standing big +
  // unlocks the capstone achievement.
  //
  // Structure of the tree (it mirrors how the essay is actually built, in stages,
  // so the "moment of understanding" is the assembly itself, not a single answer):
  //   challenge  → pick the Enduring ISSUE to argue
  //   defineWeak / defineStrong → was the issue defined as a recurring problem?
  //   evidence   → pick which gathered understandings are the STRONGEST EVIDENCE
  //   (weak evidence picks re-teach: one-era, off-topic, or list-not-argument)
  //   won        → the keeper confirms the finished thesis; the world changes
  keystones: [
    {
      id: 'ks-enduring-issues',
      npc: 'u9-archivist-byblos',
      codexId: 'cx-enduring-issues',
      house: 3,                            // a BIG lift — this is the capstone
      houseTitle: 'You turned a lifetime of trade into an argument',
      houseSub: 'The keeper of the ledger marks the House of the Open Road as one that understands how an issue is shown to endure across the ages.',
      flag: 'u9CapstoneBuilt',
      achievement: 'ach-enduring-issues',
      start: 'challenge',
      nodes: {
        // ---- STAGE 1: choose the Enduring Issue to argue ----
        challenge: {
          text: 'Shapash smooths the blank page. "An Enduring Issue is not an event, heir — it is a PROBLEM the world keeps facing in age after age. The trick is to choose one you can actually PROVE endured, using what you came to understand on your roads. Look back across all four eras. What enduring issue will you argue?"',
          choices: [
            {
              kind: 'say',
              // ★ STRONGEST — the spine of the whole game, and an issue the player
              // has demonstrably met in every era of Trade Winds.
              label: 'I\'ll argue the impact of trade networks — that whenever roads and sea-lanes connect distant peoples, they carry far more than goods: ideas, beliefs, technologies, and disease all travel the same routes, and that has reshaped the world in every era I crossed.',
              usesEvidence: 'cx-trade-networks',
              next: 'defineStrong',
            },
            {
              kind: 'say',
              // ★ ALSO STRONG — a classic Regents enduring issue the player can
              // support across eras (Hammurabi → Ashoka → Mansa Musa → empires).
              label: 'I\'ll argue power and authority — how rulers in every age must build their power and then convince people it is RIGHTFUL, whether by carving laws in stone, championing a faith, or staging their wealth for the whole world to see.',
              usesEvidence: 'cx-power-and-authority',
              next: 'defineStrong',
            },
            {
              kind: 'say',
              // ✗ WEAK FRAMING — an EVENT, not an enduring issue. Re-teach the
              // difference (event vs. recurring problem), then loop back.
              label: 'I\'ll write about the year three Portuguese ships reached Calicut in 1498 — the single most important thing that ever happened on the trade roads.',
              setFlag: 'u9PickedAnEvent',
              next: 'reteachEventNotIssue',
            },
          ],
        },

        // ---- STAGE 2a: a strong issue, defined as recurring → go to evidence ----
        defineStrong: {
          text: 'Shapash nods. "Good — that is a problem the world meets again and again, not a single day on a calendar. Now the hard part, and the part most forget." She dips her reed pen. "An issue is only ENDURING if you can show it in DIFFERENT, far-apart times. One brilliant example proves nothing endured. So: from everything you understood out there, choose the evidence that proves your issue lasted across the eras. Choose well."',
          choices: [
            {
              kind: 'say',
              // ★ RIGHT — cross-era evidence, each tied to a real understanding the
              // player gathered, explicitly spanning the four eras of the game.
              label: 'I\'ll prove it across the eras: from the river cities that had to import every timber and stone, to King Ashoka spreading dhamma along his roads, to the Silk Road carrying silk and paper west, to Mansa Musa\'s gold flooding Cairo in 1324 — same issue, four different ages, each one a real thing I came to understand.',
              right: true,
              usesEvidence: 'cx-trade-networks',
              next: 'won',
            },
            {
              kind: 'say',
              // ✗ WEAK — strong but ONE ERA only. Re-teach "must span time", loop.
              label: 'I\'ll prove it with the Silk Road alone — three or four examples, all from the age of the great caravans. That road shows everything my issue needs.',
              setFlag: 'u9OneEraOnly',
              next: 'reteachOneEra',
            },
            {
              kind: 'say',
              // ✗ WEAK — a LIST with no argument / no explanation of relevance.
              label: 'I\'ll simply list every place and ruler I met, in order, so the page shows how much I have seen — the more entries, the stronger the argument.',
              setFlag: 'u9ListedNotArgued',
              next: 'reteachListNotArgument',
            },
          ],
        },

        // ---- RIGHT PATH: the world changes ----
        won: {
          // The loader runs the keystone reward (Codex + House + flag + achievement)
          // the FIRST time this node is reached, via onEnter:'reward'.
          onEnter: 'reward',
          text: '(Shapash reads it back slowly, the way a teacher reads a thing that has finally come out right.) "Listen to what you just built. A CLAIM — that trade networks change every world they touch. A DEFINITION — an issue the world meets in age after age, not one passing event. And EVIDENCE that reaches across time — the treeless river cities, Ashoka\'s roads, the Silk Road, Mansa Musa\'s gold — each one real, each one from a different age, each one bent to PROVE the claim instead of merely sitting on the page. That is an Enduring Issues argument. Not a list of what happened — a reasoned case for how the world WORKS, shown to be true across the centuries." She signs the page and slides it to you. "The scribes of Mr. Maccarello\'s school could ask no more. The ledger is closed; the argument is yours."',
          choices: [
            { label: 'Then I\'ll carry the argument, not just the cargo.', next: '@close' },
          ],
        },

        // ---- WRONG PATHS: consequence + re-teach + LOOP back ----
        // 2b: chose an EVENT instead of an enduring issue.
        reteachEventNotIssue: {
          text: '(Shapash sets the pen down gently — not displeased, only correcting.) "1498 matters, heir, more than most days ever will. But it is an EVENT — one moment on the calendar. An Enduring Issue is a TROUBLE that keeps returning across the ages: the impact of trade networks, the struggle over power and authority, conflict, the upheavals of new technology. The Portuguese reaching Calicut is powerful EVIDENCE for an enduring issue — but it cannot BE the issue, because an event happens once and an issue happens again and again. So name the larger problem that 1498 is only one chapter of. Try once more — choose the recurring trouble, not the single day."',
          choices: [
            { label: 'I see it — the day is evidence, not the issue. Let me name the issue itself.', clearFlag: 'u9PickedAnEvent', next: 'challenge' },
          ],
        },
        // 2c: strong issue but only ONE era of evidence.
        reteachOneEra: {
          text: '(Shapash taps the single column you drew.) "Every example you named is true, and the Silk Road is a fine road. But look — they all stand in ONE age. An issue is called ENDURING for a reason: you must show it survived from era to era, or you have only proved it existed ONCE. Reach back to the river cities and forward to the ocean voyages; pull your evidence from times that sit far apart on the page. The argument is strong only when the SAME issue appears in DIFFERENT centuries. Build the column again — and this time let it span the eras you actually crossed."',
          choices: [
            { label: 'Of course — it must endure, so the evidence must cross the eras. Let me choose again.', clearFlag: 'u9OneEraOnly', next: 'defineStrong' },
          ],
        },
        // 2d: a list, not an argument.
        reteachListNotArgument: {
          text: '(Shapash almost smiles.) "You have certainly SEEN a great deal — but a ledger of names is not an argument, any more than a full warehouse is a sale. The scribes do not ask how much you witnessed; they ask whether each piece of evidence PROVES your claim. So for every entry, you must be able to say WHY it belongs and HOW it shows the issue enduring. Choose fewer things, from far-apart eras, and bend each one to the point. A short, reasoned case beats a long inventory every time. Build it again — this time make each entry EARN its place."',
          choices: [
            { label: 'Right — not the most entries, the entries that prove the point across time. Let me rebuild it.', clearFlag: 'u9ListedNotArgued', next: 'defineStrong' },
          ],
        },
      },
    },
  ],

  // ---- Codex: the real idea this pack teaches ----
  codex: [
    {
      id: 'cx-enduring-issues',
      group: 'Unit 9 — Enduring Issues Capstone',
      title: 'How to build an Enduring Issues argument from evidence across time',
      idea: 'An Enduring Issue is a problem the world faces in age after age (such as the impact of trade networks or the struggle over power and authority), and a strong argument names that recurring issue, then proves it endured by drawing the strongest evidence from DIFFERENT, far-apart eras — bending each example to support the claim rather than merely listing what happened.',
      source: 'Shapash, keeper of the House of the Open Road\'s ledger (on building the Enduring Issues argument)',
    },
  ],

  // ---- Achievements: optional milestones ----
  achievements: [
    {
      id: 'ach-enduring-issues',
      title: 'The argument, not just the cargo',
      desc: 'You turned a lifetime of trades into an Enduring Issues argument — naming a recurring problem and proving it endured with evidence drawn across the ages.',
    },
  ],
};

export default pack;
