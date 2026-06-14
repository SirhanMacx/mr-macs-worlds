// u2-river-valleys.js — STORY PACK · Unit 2 — River Valley Civilizations.
//
// Pure DATA module (no imports, no engine calls) — it can never crash the world
// on its own. The loader in ../game.js wires everything below into the live game
// (adds the NPCs, fires the cutscene once, makes each keystone reachable, records
// the Codex entry, lifts House Standing, unlocks the achievement). See CONTRACT.md
// for the authoritative field-by-field spec; this file COPIES the structure of the
// gold-standard sample unit3-belief-systems.js.
//
// THIS PACK teaches two real Global-History-9, Unit 2 keystones that go BEYOND the
// world's shipped Chapter-1 beats (import-dependence at Ur and Hammurabi's code —
// both already exist in content.js, so this pack never duplicates them):
//
//   (A) WRITING FOLLOWED ACCOUNTING. Cuneiform did NOT begin as poetry or scripture.
//       It grew out of TEMPLE AND TRADE BOOK-KEEPING: clay tokens, then sealed
//       bullae, then numbers and pictographs pressed into clay tablets to track
//       grain, sheep, wages, and rations at Uruk and Ur (c. 3300 BCE). The earliest
//       tablets are receipts and ration lists — the verb "to write" was born from
//       the verb "to count." (The seductive misreads: "writing was invented to tell
//       stories" / "writing was invented for prayers to the gods.")
//
//   (B) GEOGRAPHY SHAPES BELIEF. Egypt's Nile flooded ON SCHEDULE every summer,
//       gentle and life-giving; Mesopotamia's Tigris and Euphrates flooded
//       VIOLENTLY and UNPREDICTABLY, drowning whole towns. Two river valleys, two
//       opposite worldviews: Egyptian optimism and a bright, ordered afterlife vs.
//       Mesopotamian anxiety, gods who must be appeased, and a bleak House of Dust
//       below. The same human need — to explain the river — produced opposite faiths.
//       (Misreads: "Egyptians were just naturally cheerier people" / "they worshiped
//       different gods, so of course their beliefs differed" — both skip the GEOGRAPHY.)
//
// HONEST PEDAGOGY: every figure, place, date and idea is real history. The teaching
// voices are fictional in-world denizens (a temple tally-scribe of Ur and a Nile
// flood-watcher) so nothing is mis-attributed; they speak PARAPHRASE grounded in the
// archaeological and textual record (the Uruk/Ur account tablets; the Egyptian
// Nilometer and Book of the Dead tradition; the Mesopotamian Epic of Gilgamesh's
// House of Dust). No invented verbatim quotes. De-identified: the only real person
// ever named anywhere is "Mr. Maccarello".
//
// Placed at EXISTING cities Ur (Era 1) and Byblos (Era 1 — the Egypt/Nile node, the
// world's cedar-to-Egypt port). Offsets dodge every core NPC at those cities.

export const pack = {
  // ---- identity ----
  id: 'u2-river-valleys',
  unit: 'Unit 2 — River Valley Civilizations', // the Codex group + author-facing label
  title: 'Receipts Before Poetry, Rivers Before Gods',

  // ---- extra characters added to the world ----
  // Both teaching voices are fictional in-world denizens so no real figure is ever
  // put words in their mouth. Each carries a keystone tree (see `keystones`); the
  // intro/after lines give the world texture before and after the turning point.
  npcs: [
    {
      id: 'u2-scribe-shennur',
      name: 'Shennur',
      title: 'Temple Tally-Scribe of Ur',
      city: 'ur',                          // existing CITIES id (Era 1)
      era: 1,
      // Core Ur NPCs sit at: vell-agent [4,5], hammurabi-envoy [-7,4], ninbanda [7,-3].
      // This offset stays clear of all three.
      offset: [-5, -8],
      hatKind: 'scholar',                  // npc.js HATS key
      palette: { robe: 0x6e5a8c, trim: 0x463a5e, skin: 0xc98a5b, hat: 0x3a2f4e },
      keystoneId: 'ks-u2-writing-accounting',
      introText: 'Sit, trader, while my stylus dries. I keep the moon-god\'s storehouse — every sheep, every jar of barley, every ration paid to a temple weaver passes under my reed before it passes any gate. Folk see these little clay tablets and think a god handed us the gift of writing for hymns and holy tales. I keep the oldest tablets in Ur, and I will tell you a humbler, truer thing about where these marks came from — if you can guess it before I say it.',
      afterText: 'You have it now: before a single tale was ever told in these marks, they counted barley and sheep and the wages of the temple. Writing is a daughter of the storehouse, not the shrine. Now go — and may your own ledger always balance, the way the first ones did.',
    },
    {
      id: 'u2-floodwatch-meret',
      name: 'Meret',
      title: 'Nile Flood-Watcher of the Delta',
      city: 'byblos',                      // existing CITIES id (Era 1) — the Egypt/Nile node port
      era: 1,
      // Core Byblos NPCs sit at: zimrida [6,3], anath [-4,-7]. This offset is clear.
      offset: [7, -6],
      hatKind: 'turban',
      palette: { robe: 0x2f8f6a, trim: 0x1d5e46, skin: 0xb97f4e, hat: 0x174a36 },
      keystoneId: 'ks-u2-geography-belief',
      introText: 'Peace, cedar-trader. I am off the boats from Egypt, where my work is to watch the river. Each summer the Nile rises, lays down its black gift of mud, and falls again — and I mark how high on the riverbank stone, so the scribes know what harvest to expect. You sail between two great river lands, Egypt and Sumer. Tarry a moment: there is a thing the two rivers taught their peoples that explains why our gods could not be more different — and a merchant who reads the water can learn it.',
      afterText: 'Yes — the river writes the faith. A river that keeps its promise teaches a people to trust tomorrow; a river that breaks it teaches them to dread it. Same need, opposite gods. Carry that under your hat, friend, and you will understand more than priests do.',
    },
  ],

  // ---- named story-beat sequences (playCutscene format) ----
  // tint ∈ amber|dusk|cold|stone, art ∈ candle|ledger|notice|portrait|null.
  cutscenes: {
    // Fires the first time the player reaches Ur — frames BOTH unit questions
    // (where writing came from; why two river faiths differ) before the NPCs.
    U2_INTRO: [
      {
        tint: 'stone', kicker: 'Ur — the Storehouse of the Moon', art: 'ledger',
        text: 'Below the great ziggurat the temple storehouses run for streets: barley by the silo, wool by the bale, every beast and every wage of every weaver counted. On the doorposts hang baskets of little clay tablets, marked all over with wedge-shaped pricks. The whole city, it seems, is one enormous account being kept.',
      },
      {
        tint: 'amber', kicker: 'A wager among the tablets', art: 'portrait',
        palette: { robe: 0x6e5a8c, trim: 0x463a5e, skin: 0xc98a5b, hat: 0x3a2f4e },
        text: 'A tally-scribe with ink to the elbow waves you over. "Merchant — you weigh goods for a living, so weigh a riddle. These marks, the oldest writing in the world: what do you suppose people first wrote down with them? Songs? Prayers? Guess wrong and I will show you the truth on a tablet older than any hymn." His name is Shennur. Down on the coast, he adds, a Nile flood-watcher named Meret has a stranger question still — about why Egypt\'s gods and Sumer\'s could not be less alike. Two riddles for the road.',
        cta: 'Seek out the tally-scribe',
      },
    ],
  },

  // ---- triggers: when each cutscene fires (once) ----
  triggers: [
    {
      on: 'visit', value: 'ur', play: 'U2_INTRO',
      reward: { house: 1, title: 'Two riddles of the river lands', sub: 'Ur sets you a wager about where writing began — and a flood-watcher waits with a deeper one.' },
    },
  ],

  // ---- THE CORE: keystones ----
  keystones: [
    // ============================================================
    // KEYSTONE A — WRITING FOLLOWED ACCOUNTING
    // ============================================================
    {
      id: 'ks-u2-writing-accounting',
      npc: 'u2-scribe-shennur',
      codexId: 'cx-u2-writing-accounting',
      house: 2,
      houseTitle: 'You traced writing back to the storehouse',
      houseSub: 'A tally-scribe of Ur marks the House of the Open Road as one that knows why the first words were receipts.',
      flag: 'u2WritingUnderstood',
      achievement: 'ach-u2-receipts-first',
      start: 'challenge',
      nodes: {
        challenge: {
          text: 'Shennur lays a worn clay tablet between you. "Cuneiform — wedge-writing — began here in Sumer, in cities like Uruk and our own Ur, while your great-grandmother\'s grandmother was a girl. It grew slowly: first we pressed little clay tokens into a lump to seal a bargain, then we drew numbers and small pictures straight onto wet tablets. Now tell me, trader who keeps a ledger: what did people FIRST write with these marks — and WHY did anyone bother inventing them at all?"',
          choices: [
            {
              kind: 'say',
              // ★ RIGHT — writing began as accounting / record-keeping for trade & temple.
              label: 'You wrote down the accounts — how much barley, how many sheep, what wages and rations the temple and the traders owed. Writing began because a storehouse and a market grew too big to hold in one man\'s memory. The marks were receipts and lists long before they were anything else; the need to COUNT came first and dragged the need to WRITE along behind it.',
              right: true,
              next: 'won',
            },
            {
              kind: 'say',
              // ✗ WRONG (seductive misread) — "writing was invented to tell stories."
              label: 'You wrote down stories, of course — the great tales of heroes and kings. Writing was invented so the poets\' songs would never be forgotten.',
              setFlag: 'u2WritingStoryMisread',
              next: 'reteachStory',
            },
            {
              kind: 'say',
              // ✗ WRONG (the other common misread) — "writing was invented for religion."
              label: 'You wrote down prayers and the holy words of the gods. Surely a sacred gift like writing was meant first for the temple\'s hymns and scripture.',
              next: 'reteachGods',
            },
          ],
        },

        // ---- RIGHT PATH: the world changes ----
        won: {
          onEnter: 'reward',
          text: '(Shennur taps the tablet, delighted.) "A merchant who reads the bones of his own trade. Yes — turn over the very oldest tablets and you will not find a single poem on them. You find: so many measures of barley, so many head of sheep, so many days\' ration paid to this weaver and that. Receipts. Lists. The storehouse outgrew memory, so we taught clay to remember for us. The hymns and the great tale of Gilgamesh came centuries LATER, once the marks already existed — borrowed, you might say, from the bookkeepers." He grins. "Writing is the daughter of the ledger, friend. Your trade invented it. Carry the House of the Open Road into any market on earth — its scribes are your kin."',
          choices: [
            { label: 'Then I keep the oldest craft of all. I\'ll carry that with me.', next: '@close' },
          ],
        },

        // ---- WRONG PATH: consequence + re-teach + LOOP back ----
        reteachStory: {
          text: '(Shennur does not scoff; he turns the tablet so you can see it plain.) "Look here — do you see a hero, a battle, a single line of verse? No. You see numbers and the sign for barley, over and over. The great story of Gilgamesh IS written in these marks — but not for a thousand years after the marks were first cut. By then writing was old. Ask yourself, trader: what kept the very FIRST scribes up at night? Not the muse. A storehouse too full to count from memory. What humble, un-poetic need would push a busy people to invent marks on clay?" He waits. "Weigh it again."',
          choices: [
            { label: 'I see — the need came before the art. It was the counting, not the poetry. Let me answer again.', clearFlag: 'u2WritingStoryMisread', next: 'challenge' },
          ],
        },
        reteachGods: {
          text: '(Shennur smiles gently.) "You honor the gift, and that does you credit — but you have the order backwards. The temple did need writing, yes. Yet what did the TEMPLE first set its scribes to write? Not hymns — accounts. How much grain in the god\'s storehouse, how much wool from the god\'s flocks, what ration each temple worker was owed. The shrine was also a vast estate, friend, and an estate must keep books. The prayers came later, once the marks already served the granary. Think less about heaven and more about the granary beside it. Why would a great household, sacred or not, need to WRITE? Try once more."',
          choices: [
            { label: 'Of course — even the god\'s house had to keep accounts. The records came first. Let me try again.', next: 'challenge' },
          ],
        },
      },
    },

    // ============================================================
    // KEYSTONE B — GEOGRAPHY SHAPES BELIEF (Nile vs. Tigris/Euphrates)
    // ============================================================
    {
      id: 'ks-u2-geography-belief',
      npc: 'u2-floodwatch-meret',
      codexId: 'cx-u2-geography-belief',
      house: 2,
      houseTitle: 'You read two faiths off two rivers',
      houseSub: 'A Nile flood-watcher marks the House of the Open Road as one that knows geography can shape a people\'s gods.',
      flag: 'u2GeographyBeliefUnderstood',
      achievement: 'ach-u2-river-shapes-faith',
      start: 'challenge',
      nodes: {
        challenge: {
          text: 'Meret crouches and draws two rivers in the dust. "You sail to both, trader, so you have seen it. In Egypt the Nile rises every summer like clockwork — gentle, generous, the same blessing year on year; we even mark its height on a measuring-stone so we know the harvest before it comes. In Sumer the Tigris and Euphrates rage without warning, drown whole towns, change their very beds. Now — the Egyptians built bright tombs and trust a kindly afterlife; the Sumerians fear their gods and tell of a grim House of Dust below. WHY are two river peoples\' faiths so opposite?"',
          choices: [
            {
              kind: 'say',
              // ★ RIGHT — geography (predictable vs. violent rivers) shaped opposite worldviews.
              label: 'The rivers taught them. A Nile that keeps its promise every year teaches Egyptians the world is dependable and good — so they trust the gods and imagine a bright life beyond death. Tigris and Euphrates that flood without warning teach Sumerians the world is dangerous and beyond their control — so their gods are feared, must be appeased, and the afterlife is bleak. Same human need to explain the river, but opposite rivers made opposite beliefs.',
              right: true,
              next: 'won',
            },
            {
              kind: 'say',
              // ✗ WRONG (seductive misread) — "Egyptians were just naturally cheerier."
              label: 'It is simply the people themselves — Egyptians were a sunnier, more hopeful sort by nature, and Sumerians a gloomier one. Two different temperaments, nothing to do with the water.',
              setFlag: 'u2TemperamentMisread',
              next: 'reteachTemperament',
            },
            {
              kind: 'say',
              // ✗ WRONG (the other common misread) — "different gods, of course different beliefs."
              label: 'Because they worshiped different gods — Egypt had its gods and Sumer had theirs, so naturally their beliefs came out different. There is nothing deeper to it than that.',
              next: 'reteachDifferentGods',
            },
          ],
        },

        // ---- RIGHT PATH: the world changes ----
        won: {
          onEnter: 'reward',
          text: '(Meret smooths the dust and looks at you with respect.) "You read the water, not just the wave. That is the whole of it. A people\'s gods are their answer to the land they live in — and these two lands ask opposite questions. The Nile says \'trust me, I will return,\' so Egypt paints its tombs in gold and waits for a green field beyond death. The twin rivers say \'I owe you nothing,\' so Sumer kneels and appeases and tells of a dim House of Dust. Same fear, same hope, same need to explain the flood — but a kind river and a cruel one will never raise the same faith." She presses a thumb of river-mud to your ledger like a seal. "The House of the Open Road understands the ground its trade stands on. Go well."',
          choices: [
            { label: 'Then I\'ll carry the rivers\' lesson with me.', next: '@close' },
          ],
        },

        // ---- WRONG PATH: consequence + re-teach + LOOP back ----
        reteachTemperament: {
          text: '(Meret shakes her head, not unkindly.) "Careful, trader — \'they were just born cheerier\' explains nothing, and it is the lazy answer a priest gives when he has stopped looking. Egyptians and Sumerians are the same flesh; put an Egyptian child on the Euphrates and a Sumerian on the Nile, and watch their hopes swap. Ask instead: what does a person come to BELIEVE about the world when their river keeps every promise — and what do they believe when it keeps none? The faith is not in the blood; it is in the water they grew up beside. Look at the rivers again."',
          choices: [
            { label: 'You\'re right — it isn\'t the people, it\'s the river that shaped them. Let me answer again.', clearFlag: 'u2TemperamentMisread', next: 'challenge' },
          ],
        },
        reteachDifferentGods: {
          text: '(Meret traces the two rivers once more.) "You are walking in a circle, friend. \'Different gods, so different beliefs\' — but WHY different gods? Why does one people imagine kindly, trustworthy gods and a golden afterlife, while the other imagines harsh gods who must be begged and a House of Dust? The gods did not fall from the sky already different. Each people MADE gods that matched the world they knew — and the world they knew was, above all, their river. So look past the gods to the thing UNDER them: one river that blesses on schedule, one that drowns by surprise. What would each teach a people to expect? Try once more."',
          choices: [
            { label: 'I see — the gods themselves came from the rivers. The flood shaped the faith. Let me try again.', next: 'challenge' },
          ],
        },
      },
    },
  ],

  // ---- Codex: the real ideas this pack teaches ----
  codex: [
    {
      id: 'cx-u2-writing-accounting',
      group: 'Unit 2 — River Valley Civilizations',
      title: 'Writing began as accounting, not literature',
      idea: 'The first writing — Sumerian cuneiform at cities like Uruk and Ur (c. 3300 BCE) — grew out of trade and temple record-keeping: clay tokens, then numbers and pictographs pressed into tablets to track grain, livestock, wages and rations; the earliest tablets are receipts and ration lists, and stories like the Epic of Gilgamesh were written centuries later once the script already existed.',
      source: 'Shennur, temple tally-scribe of Ur (on the earliest Uruk and Ur account tablets)',
    },
    {
      id: 'cx-u2-geography-belief',
      group: 'Unit 2 — River Valley Civilizations',
      title: 'Geography shaped opposite river-valley beliefs',
      idea: 'Egypt\'s Nile flooded predictably and gently each year, fostering an optimistic worldview and a bright afterlife, while Mesopotamia\'s Tigris and Euphrates flooded violently and unpredictably, fostering anxiety, gods who must be appeased, and a bleak underworld (the Gilgamesh "House of Dust") — the same human need to explain the river produced opposite faiths because the rivers themselves were opposite.',
      source: 'Meret, Nile flood-watcher of the Delta (on the Nilometer tradition and the Mesopotamian House of Dust)',
    },
  ],

  // ---- Achievements: optional milestones ----
  achievements: [
    {
      id: 'ach-u2-receipts-first',
      title: 'The first words were receipts',
      desc: 'You understood that writing began as bookkeeping for trade and temple — the need to count came before the need to compose.',
    },
    {
      id: 'ach-u2-river-shapes-faith',
      title: 'The river writes the faith',
      desc: 'You understood how a predictable Nile and a violent Tigris-Euphrates shaped opposite worldviews — geography can shape a people\'s gods.',
    },
  ],
};

export default pack;
