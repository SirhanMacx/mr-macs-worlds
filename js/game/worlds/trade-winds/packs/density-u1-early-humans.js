// density-u1-early-humans.js — DENSITY STORY-PACK: Unit 1, Early Humans (more).
//
// Pure DATA module (no imports, no engine calls) — it cannot crash the world on
// its own. The defensive loader in ../../game.js wires everything below into the
// live game (adds the NPCs, fires the cutscene once, makes each keystone
// reachable, records the Codex entry, lifts House Standing, unlocks the
// achievement). See packs/CONTRACT.md for the authoritative field-by-field spec;
// this file COPIES the structure of the gold-standard unit3-belief-systems.js.
//
// This is the SECOND, denser Unit-1 pack. The existing u1-neolithic.js already
// teaches (a) the Neolithic surplus and (b) the settling-vs-foraging trade-off,
// both at Catalhoyuk. This pack does NOT repeat those. It adds two FRESH Unit-1
// keystones the curriculum requires:
//
//   (a) WHAT DEFINES A "CIVILIZATION" (vs. a mere village). A village can be old,
//       crowded, and prosperous and still NOT be a civilization. Historians reserve
//       that word for societies that show a cluster of features together: cities
//       (not just villages), a specialized labor force beyond farming, a system of
//       WRITING and record-keeping, organized GOVERNMENT and institutions, a
//       complex religion, social classes, and often monumental public works. The
//       real, telling contrast in this world is Catalhoyuk (a huge, ancient TOWN
//       with NO palace, NO temple, NO writing — a village, not a civilization) set
//       against Byblos and the river-valley cities downriver (true civilizations).
//       Honest pedagogy: this is the standard NYS Global-9 working definition of a
//       civilization, taught as a cluster of features, not a single trait.
//
//   (b) WHY COMPLEX SOCIETIES AROSE WHERE THEY DID — GEOGRAPHY & MIGRATION. Cities
//       and civilizations did not appear at random. Modern humans spread OUT OF
//       AFRICA across the world, and the first civilizations clustered in a handful
//       of RIVER VALLEYS — the Tigris-Euphrates, the Nile, the Indus, the Yellow
//       River. Rivers gave flood-renewed fertile soil for big surpluses, water to
//       drink and irrigate, and a highway for trade — and the work of taming the
//       floods demanded the very cooperation, leadership, and record-keeping that
//       grew into government. Geography did not FORCE civilization, but it set the
//       table where it was most likely to rise. (Wrong path: "people were just
//       smarter / luckier there" → the mentor corrects to the river-valley logic.)
//
// Honest pedagogy: Catalhoyuk, Byblos, the out-of-Africa migration, and the four
// river-valley hearths are all real history/archaeology; the named speakers are
// fictional in-world denizens (a Byblos scribe, a quarry overseer, a Catalhoyuk
// memory-keeper, a herder who has walked far) so no real person is given invented
// words. The only real person ever named in the whole world is "Mr. Maccarello" —
// and he is not named here. Every id is namespaced "d-tw-u1-" so nothing collides.

export const pack = {
  // ---- identity ----
  id: 'd-tw-u1-early-humans',
  unit: 'Unit 1 — Early Humans & the Neolithic Revolution', // Codex group + label (matches u1 pack so entries bucket together)
  title: 'City, Script, and River: What Makes a Civilization (and Where It Rose)',

  // ---- extra characters added to the world ----
  // Placed at two EXISTING Era-1 cities, on offsets that dodge every existing NPC:
  //
  //   BYBLOS (era 1) — existing: zimrida[6,3], anath[-4,-7], and the u2 pack's
  //   NPCs near [7,-6] and [-5,-8]. So this pack uses the LEFT/UPPER quadrant.
  //     • Iphitau — a temple scribe who carries the CIVILIZATION keystone.
  //     • Abdi-Ashtart — a quarry overseer, supporting NPC with branching memory.
  //
  //   CATALHOYUK (era 1) — existing: kamani[6,4], hodja[-6,5], yarra[-7,-5]. So
  //   this pack uses the RIGHT/LOWER quadrant.
  //     • Mellaart — the town's memory-keeper who carries the GEOGRAPHY keystone.
  //     • Tepe — a far-walking herder, supporting NPC with branching memory.
  //
  // Each NPC's keystoneId points its conversation at a keystone tree below; the
  // supporting NPCs (no keystoneId) are valid flavor NPCs whose dialogue remembers
  // the player's keystone choices via story flags.
  npcs: [
    {
      id: 'd-tw-u1-scribe-byblos',
      name: 'Iphitau',
      title: 'Temple Scribe of Byblos',
      city: 'byblos',                       // existing CITIES id (era 1)
      era: 1,
      offset: [-7, 6],                      // upper-left, clear of anath[-4,-7] & u2 NPC near [-5,-8]
      hatKind: 'scholar',
      palette: { robe: 0x3c6e8f, trim: 0x244a61, skin: 0xc98a5b, hat: 0x18304a },
      keystoneId: 'd-tw-u1-ks-civilization',
      introText: 'Welcome to Byblos, trader. Watch where you step — every other porter is carrying a sealed jar or a stamped tablet, and I am the one who marks what comes and goes. I keep the records: who paid the temple, how much cedar shipped to Egypt, what the king owes the gods. You have come up from Catalhoyuk in the hills, yes? A great old town — older than this port by far. And yet the scholars will tell you Byblos is a CIVILIZATION and Catalhoyuk was only a village. Sit; that distinction is worth more to a merchant than a sack of lapis.',
      afterText: 'Now you carry the true measure. Age and crowding do not make a civilization — Catalhoyuk had both and was still a village. It is the whole cluster: cities ruling their countryside, hands freed for a hundred trades, government and law, a complex faith, ranks of rich and poor, and above all the WRITING that lets a society remember itself past one lifetime. Mark it well, and you will read every city you ever enter at a glance.',
    },
    {
      id: 'd-tw-u1-overseer-byblos',
      name: 'Abdi-Ashtart',
      title: 'Overseer of the Temple Quarry',
      city: 'byblos',
      era: 1,
      offset: [-9, -2],                     // left flank, clear of anath[-4,-7] and the scribe[-7,6]
      hatKind: 'cap',
      palette: { robe: 0x7a5a2f, trim: 0x4a3618, skin: 0xb97f4e, hat: 0x4a3618 },
      // no keystoneId — supporting NPC; dialogue branches on the civilization flag
      introText: 'You there, mind the dust — we are cutting stone for the god\'s new wall. I drive the gangs: stone-cutters, sledge-haulers, water-carriers, the scribe who tallies every block. Not one of us grows his own grain, trader. We are FED by the temple stores, so we may spend our days building instead of farming. That is no small thing. There is no work-gang like this up in your hill-towns, and there is a reason why.',
      afterText: 'You understood the scribe, did you? Good. Then you see what my gang really is: proof of a civilization. Specialists — none of us farmers — fed by stored surplus and ORGANIZED by temple and king to raise a thing no single family could. A village has none of this. Now off you go; the god\'s wall will not haul itself.',
    },
    {
      id: 'd-tw-u1-keeper-catalhoyuk',
      name: 'Mellaart',
      title: 'Memory-Keeper of Catalhoyuk',
      city: 'catalhoyuk',                   // existing CITIES id (era 1)
      era: 1,
      offset: [8, -6],                      // lower-right, clear of kamani[6,4], hodja[-6,5], yarra[-7,-5]
      hatKind: 'none',
      palette: { robe: 0x8a6f3c, trim: 0x5e4a26, skin: 0xb97f4e },
      keystoneId: 'd-tw-u1-ks-geography-migration',
      introText: 'Sit by the wall-painting, trader — I am the one who keeps the old stories when we have no writing to keep them for us. We of Catalhoyuk are an old people; our grandmothers\' grandmothers came up out of the warm south, generation by generation, following the green. And here on this plain we stopped and built. But have you ever wondered why the GREAT cities — the ones with kings and god-houses and marks on clay — rise down in the river bottoms, and not up here on our fine plain? There is a riddle in the land itself. Let me set it to you.',
      afterText: 'Yes — you read the land now. Our people walked out of the south and spread across the whole world, but the mighty cities clustered where the great rivers run: the Two Rivers, the Nile, the Indus, the Yellow River. Flood-fed soil for huge surplus, water to drink and channel, a road that floats your goods — and floods so dangerous that taming them MADE men learn to work as one under leaders who kept the count. The land did not command it. But it laid the table. Walk well.',
    },
    {
      id: 'd-tw-u1-herder-catalhoyuk',
      name: 'Tepe',
      title: 'A Herder Who Has Walked Far',
      city: 'catalhoyuk',
      era: 1,
      offset: [9, 3],                       // right flank, clear of kamani[6,4] and the keeper[8,-6]
      hatKind: 'brim',
      palette: { robe: 0x6e6a4a, trim: 0x45422c, skin: 0xc98a5b, hat: 0x45422c },
      // no keystoneId — supporting NPC; dialogue branches on the geography flag
      introText: 'Peace, trader. I drive sheep, and sheep have taken me far — south to the great Two Rivers, where I have stood on the bank of a city you would not believe. Mud-brick towers taller than ten men, fields cut with water-ditches straight as a spear-cast, and a flood every spring that drowns the lot and then leaves the blackest, richest soil a herder ever saw. Up here our plain is good. Down there the river does half a farmer\'s work for him — and asks a terrible price for it.',
      afterText: 'So the memory-keeper got through to you. Good. Then you have seen with my own eyes what I mean: down in the river bottoms the land all but begs you to grow a surplus — and then floods so wild that no one family can master them, so the river itself drives folk to band together, raise leaders, keep records. That is where the kings and the clay-marks grew. Not here. The land chooses the ground; men do the rest.',
    },
  ],

  // ---- named story-beat sequences (playCutscene format) ----
  // Beats: { kicker, text, tint, art, palette, cta }. tint ∈ amber|dusk|cold|stone,
  // art ∈ candle|ledger|notice|portrait|null. The loader plays one ONCE when its
  // trigger fires. This pack fires its frame at BYBLOS (the civilization case),
  // since the existing u1 pack already owns the Catalhoyuk-arrival cutscene.
  cutscenes: {
    DTWU1_INTRO: [
      {
        tint: 'stone', kicker: 'Byblos — the Cedar Port', art: 'notice',
        text: 'Byblos is nothing like the hill-town you left. There are wharves stacked with cedar bound for treeless Egypt, a temple that owns the warehouses, soldiers at the gate, beggars and merchants and a governor\'s house all in their own quarters — and everywhere, pressed clay and inked reed: people WRITING things down. Lists of cargo. Debts to the god. The names of kings. Catalhoyuk, older by two thousand years, never had one mark of writing, one palace, one priest set above the rest. Two settlements — yet the scholars give only ONE of them a name historians fight over.',
      },
      {
        tint: 'amber', kicker: 'A scribe sets you a riddle', art: 'portrait',
        palette: { robe: 0x3c6e8f, trim: 0x244a61, skin: 0xc98a5b, hat: 0x18304a },
        text: 'A scribe looks up from a tablet, reed still wet. "You have walked here from Catalhoyuk," he says — "a town older and once larger than my whole port. So tell me, traveler who weighs things: why do my teachers call Byblos a CIVILIZATION and your great old hill-town a mere village? They are both crowded. They are both ancient. What is the difference that earns the grander word?" His name is Iphitau. Go and reason it out with him.',
        cta: 'Find the scribe',
      },
    ],
  },

  // ---- triggers: when each cutscene fires (once) ----
  // on: 'visit' value = city id | 'enter' value = era number | 'flag' value = flag
  //     | 'questDone' value = quest id. reward (optional) lifts House after the beats.
  triggers: [
    {
      on: 'visit', value: 'byblos', play: 'DTWU1_INTRO',
      reward: { house: 1, title: 'A riddle at the cedar port', sub: 'Byblos asks you what truly separates a city from a village.' },
    },
  ],

  // ---- THE CORE: keystones ----
  // Each is the moment the player UNDERSTANDS, built to the exemplar bar (the
  // Nin-Banda pattern in content.js): choices are FULL IN-CHARACTER SENTENCES
  // (kind:'say'); the RIGHT choice records the Codex entry + lifts House Standing
  // + sets a flag / unlocks an achievement and a mentor confirms WHY; each WRONG
  // choice is a CONSEQUENCE that re-teaches the missing idea and LOOPS back to
  // `challenge`. No score, no "Question N of M", no failure screen.
  keystones: [
    // ===================================================================
    // KEYSTONE 1 — WHAT DEFINES A CIVILIZATION (vs. a village).
    // Catalhoyuk = old, big, crowded — but NO writing, NO state, NO classes,
    // NO monuments: a village. Byblos / the river cities = the full cluster.
    // ===================================================================
    {
      id: 'd-tw-u1-ks-civilization',
      npc: 'd-tw-u1-scribe-byblos',
      codexId: 'd-tw-u1-cx-civilization',
      house: 2,
      houseTitle: 'You learned to tell a city from a village',
      houseSub: 'A scribe of Byblos marks the House of the Open Road as one that knows the true measure of a civilization.',
      flag: 'dTwU1CivUnderstood',
      achievement: 'd-tw-u1-ach-the-measure-of-a-city',
      start: 'challenge',
      nodes: {
        challenge: {
          text: 'Iphitau smooths a fresh tablet. "So. Catalhoyuk was vast and ancient — thousands of souls packed roof to roof when Byblos was nothing. By size and age it shames my port. And yet my teachers will not call it a civilization; they call it a village, and they call Byblos and the cities down the great rivers civilizations. The difference cannot be age, for Catalhoyuk is older. It cannot be crowds, for it was more crowded. Tell me, trader: what do Byblos and the river-cities HAVE that your great hill-town never had — the thing that earns the grander word?"',
          choices: [
            {
              kind: 'say',
              // ★ RIGHT — civilization as a CLUSTER of features, not one trait:
              // cities ruling a hinterland, specialized labor, writing/records,
              // organized government & institutions, social classes, monuments.
              label: 'It is not any single thing but a whole cluster you have and Catalhoyuk lacked: true cities that rule the farmland around them, hands freed for dozens of specialized trades, organized government and law, a complex priesthood, ranks of rich and poor — and above all WRITING, to keep records and laws past one lifetime. Catalhoyuk had crowds and age but none of that; a civilization is that bundle of features together, not a big village.',
              right: true,
              next: 'won',
            },
            {
              kind: 'say',
              // ✗ WRONG (the size misread the assignment names) — "bigger = civilization."
              label: 'It is simply size and numbers. A civilization is just a settlement grown large enough — pack enough people together and it becomes one. Catalhoyuk was only a hair too small or too early; bigness is the whole of it.',
              setFlag: 'dTwU1SizeMisread',
              next: 'reteachSize',
            },
            {
              kind: 'say',
              // ✗ WRONG (the single-trait misread) — "it is only the writing."
              label: 'It is the writing alone — nothing else. A place with marks on clay is a civilization, a place without them is a village, and that single trait settles it. The temples and kings and classes are beside the point.',
              next: 'reteachOneTrait',
            },
          ],
        },

        // ---- RIGHT PATH: the world changes ----
        won: {
          onEnter: 'reward',
          text: '(Iphitau sets down his reed and looks at you the way a teacher looks at a student who has named the whole list unprompted.) "Just so. Not one trait — a CLUSTER. Cities that rule their fields. Specialists fed by surplus: my smiths, weavers, soldiers, priests, and yes, scribes. A government and laws to bind it. A great faith with temples raised above the homes. Classes, high and low. Public works no family could build alone. And the writing that lets all of it REMEMBER itself — laws, debts, kings — past any one life. Catalhoyuk had the crowds and the years and even the surplus; it never grew the rest. That is why it stayed a village and we became a civilization." He presses the wet tablet to your hand to read. "Carry that measure, trader. Every settlement you enter, you will now read at a glance."',
          choices: [
            { label: 'Then I\'ll carry the true measure of a city with me.', next: '@close' },
          ],
        },

        // ---- WRONG PATH 1: consequence + re-teach + LOOP back ----
        reteachSize: {
          text: '(Iphitau shakes his head, not unkindly.) "If size alone made it, trader, then Catalhoyuk — older and MORE crowded than Byblos in its day — would be the grandest civilization of all, and my teachers would bow to it. They do not. A heap of people is still only a heap. Look at what my port has that your hill-town never grew: I keep WRITTEN records; a king and temple GOVERN us; my smiths and soldiers and weavers never touch a plow; we have lords and laborers, not near-equals. None of that comes from mere numbers. Ask not how MANY people, but how the society is ORGANIZED. Weigh it again."',
          choices: [
            { label: 'I see — it is not numbers but the cluster of features: writing, government, classes, specialists. Let me answer again.', clearFlag: 'dTwU1SizeMisread', next: 'challenge' },
          ],
        },
        // ---- WRONG PATH 2: consequence + re-teach + LOOP back ----
        reteachOneTrait: {
          text: '(Iphitau smiles and taps the tablet.) "You honor my craft, and writing IS one of the surest signs — I grant you that. But hear me: it is not writing ALONE. A society earns the word by a whole bundle that arrives together — cities ruling the land, specialists freed from farming, a government and laws, a complex faith, classes of high and low, great public works — and writing is the thread that ties them and lets them last. Pull on the one thread and you miss the cloth. Name the WHOLE cluster, trader, not just my reed. Try once more."',
          choices: [
            { label: 'Of course — writing is one thread, but it is the whole cluster of features together. Let me try again.', next: 'challenge' },
          ],
        },
      },
    },

    // ===================================================================
    // KEYSTONE 2 — GEOGRAPHY & MIGRATION: WHY complex societies arose WHERE
    // they did. Out of Africa → spread everywhere; civilizations clustered in
    // the four river valleys (Tigris-Euphrates, Nile, Indus, Yellow River),
    // because rivers gave flood-renewed soil, water, a trade highway, and a
    // flood-control problem that bred cooperation & government.
    // ===================================================================
    {
      id: 'd-tw-u1-ks-geography-migration',
      npc: 'd-tw-u1-keeper-catalhoyuk',
      codexId: 'd-tw-u1-cx-geography-migration',
      house: 2,
      houseTitle: 'You read the geography of the first cities',
      houseSub: 'The memory-keeper of Catalhoyuk marks the House of the Open Road as one that understands why civilization rose by the rivers.',
      flag: 'dTwU1GeoUnderstood',
      achievement: 'd-tw-u1-ach-where-the-rivers-run',
      start: 'challenge',
      nodes: {
        challenge: {
          text: 'Mellaart traces a line on the wall-painting. "Here is the riddle in the land, trader. Our kind came up out of the warm south, ages and ages ago, and spread to every corner of the world — to ice, to forest, to plain, to ours. So people are EVERYWHERE. Yet the first great cities — the ones with kings and god-houses and marks on clay — did not rise everywhere people went. They rose in a handful of the same kind of place: down in the great river bottoms, the Two Rivers, the Nile, the Indus, the Yellow River. Why there, trader? Why did civilization cluster by the rivers and not up here on our good high plain?"',
          choices: [
            {
              kind: 'say',
              // ★ RIGHT — the river-valley logic: flood-renewed fertile soil for
              // big surplus, water for drink/irrigation, a trade highway, AND a
              // flood-control problem demanding cooperation/leadership/records.
              label: 'Because the great rivers laid the table for it. Their yearly floods leave deep, fertile soil that grows a huge surplus; their water lets people drink and dig irrigation; the river itself is a highway that floats goods to trade. And taming those dangerous floods — the dikes and canals — was too big for one family, so it forced people to cooperate, follow leaders, and keep records, which grew into government. People spread everywhere, but the rivers made cities most likely to rise there.',
              right: true,
              next: 'won',
            },
            {
              kind: 'say',
              // ✗ WRONG (the smarter/luckier misread the assignment names) —
              // it was the people, not the place.
              label: 'Because the river people were simply cleverer or luckier than the rest of us. There is nothing special about the land — those folk just happened to be smarter and more blessed, and civilization would have risen wherever such people lived. The geography had nothing to do with it.',
              setFlag: 'dTwU1SmarterMisread',
              next: 'reteachSmarter',
            },
            {
              kind: 'say',
              // ✗ WRONG (the hard-determinism misread) — geography FORCED it,
              // people had no part.
              label: 'Because the river forces it, plain and simple — put any people by a great river and a civilization springs up on its own, like grass after rain. The land alone does all the work; the choices and labor of people count for nothing at all.',
              next: 'reteachForce',
            },
          ],
        },

        // ---- RIGHT PATH: the world changes ----
        won: {
          onEnter: 'reward',
          text: '(Mellaart nods slowly, the way the old nod when a young one has seen the whole pattern.) "You read the land true. Our people walked out of the south and filled the whole earth — so it was never that only river-folk existed. It is that the river VALLEYS gave four gifts at once: the flood that lays down black soil for a great surplus, the water to drink and to channel into the fields, the current that carries trade, and a flood so fierce no single family could fight it — so men had to band together, raise leaders, and keep the count, and that banding-together hardened into kings and law and the marks on clay. The land did not COMMAND civilization; our good plain proves that. But the rivers set the table, and that is where the feast was served. Carry it, trader: to know WHERE a thing happens, read the land first."',
          choices: [
            { label: 'Then I\'ll carry the geography of the first cities with me.', next: '@close' },
          ],
        },

        // ---- WRONG PATH 1: consequence + re-teach + LOOP back ----
        reteachSmarter: {
          text: '(Mellaart frowns gently and shakes her head.) "No, trader — that is a flattering lie the river-cities like to tell about themselves. Their grandmothers came out of the same warm south as ours; they are no cleverer, no more blessed by birth. Then why THERE and not here? Look at what their land GIVES that ours does not: a flood that renews the soil every year for a surplus we cannot match, water to channel into a thousand fields, a river-road for trade. Set the people aside a moment and look at the GROUND under them. What does a great river offer that a high plain never can? Weigh it again."',
          choices: [
            { label: 'I see — it was not cleverer people but what the river valleys offered: soil, water, a trade-road, a flood to master. Let me answer again.', clearFlag: 'dTwU1SmarterMisread', next: 'challenge' },
          ],
        },
        // ---- WRONG PATH 2: consequence + re-teach + LOOP back ----
        reteachForce: {
          text: '(Mellaart gives a patient half-smile.) "You have leaned too far the other way now, trader. The river does not raise a city by itself — it raises nothing without hands. Someone must choose to dig the canal, agree to share the water, obey the leader who keeps the count, plant and store and build. The flood is a problem and a gift; PEOPLE are the ones who answer it. The land sets the table — rich soil, water, a road, a flood worth taming — but men must come and do the work, or the valley stays empty marsh. Say it as a balance: the river makes it LIKELY, the people make it REAL. Try once more."',
          choices: [
            { label: 'Of course — the river makes civilization likely, but it is people who choose to dig, share, and build. Let me try again.', next: 'challenge' },
          ],
        },
      },
    },
  ],

  // ---- Codex: the real ideas this pack teaches ----
  // group equals the pack's `unit` so entries bucket with the existing u1 pack.
  // ids are globally unique (namespaced d-tw-u1-).
  codex: [
    {
      id: 'd-tw-u1-cx-civilization',
      group: 'Unit 1 — Early Humans & the Neolithic Revolution',
      title: 'What defines a civilization (vs. a village)',
      idea: 'A civilization is not simply a big or old settlement but a cluster of features arriving together: cities that govern surrounding farmland, a specialized labor force freed from farming, a system of writing and record-keeping, organized government and institutions, a complex religion, social classes, and often monumental public works. Catalhoyuk was ancient and crowded yet lacked writing, a state, classes, and monuments — so it was a village, while Byblos and the river-valley cities were civilizations.',
      source: 'Iphitau, temple scribe of Byblos (on the working definition of a civilization)',
    },
    {
      id: 'd-tw-u1-cx-geography-migration',
      group: 'Unit 1 — Early Humans & the Neolithic Revolution',
      title: 'Why complex societies arose where they did — geography & migration',
      idea: 'Modern humans migrated out of Africa and spread across the whole world, yet the first civilizations clustered in a few river valleys — the Tigris-Euphrates, the Nile, the Indus, and the Yellow River — because rivers gave flood-renewed fertile soil for a large surplus, water to drink and to irrigate, and a highway for trade, while controlling their dangerous floods demanded the cooperation, leadership, and record-keeping that grew into government. Geography did not force civilization but made it far more likely there.',
      source: 'Mellaart, memory-keeper of Catalhoyuk (on migration and the river-valley hearths)',
    },
  ],

  // ---- Achievements: optional milestones ----
  achievements: [
    {
      id: 'd-tw-u1-ach-the-measure-of-a-city',
      title: 'The Measure of a City',
      desc: 'You understood that a civilization is a cluster of features — cities, specialists, writing, government, classes, and monuments — not just a big or old village.',
    },
    {
      id: 'd-tw-u1-ach-where-the-rivers-run',
      title: 'Where the Rivers Run',
      desc: 'You understood why the first civilizations clustered in river valleys — fertile flood-soil, water, a trade highway, and floods whose taming bred government — even though humans had spread everywhere.',
    },
  ],
};

export default pack;
