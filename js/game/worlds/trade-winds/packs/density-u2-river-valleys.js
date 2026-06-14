// density-u2-river-valleys.js — DENSITY STORY PACK · Unit 2 — River Valley Civilizations (more).
//
// Pure DATA module (no imports, no engine calls) — it can never crash the world on
// its own. The loader in ../game.js wires everything below into the live game (adds
// the NPCs, fires the cutscene once, makes each keystone reachable, records the Codex
// entry, lifts House Standing, sets flags, unlocks achievements). See CONTRACT.md for
// the authoritative field-by-field spec; this file COPIES the structure of the gold-
// standard sample unit3-belief-systems.js.
//
// This is the SECOND, denser Unit-2 pack. It deliberately AVOIDS every idea already
// taught — the shipped world's Chapter-1 beats (import-dependence at Ur via Nin-Banda;
// Hammurabi's law code via Mar-Sippar) AND the first density pack u2-river-valleys.js
// (writing-began-as-accounting via Shennur; geography-shapes-belief / Nile-vs-Tigris
// via Meret). It teaches THREE further real Global-History-9, Unit 2 keystones:
//
//   (A) THE SOCIAL PYRAMID / SPECIALIZATION OF LABOR. A river society is stratified
//       BECAUSE its farms make a surplus. When irrigated floodplain fields grow more
//       grain than the growers need, the extra feeds people who do NOT farm — priests,
//       scribes, kings, soldiers, potters, weavers, metalworkers — and at the bottom,
//       the enslaved. The food surplus is what BUYS specialization, and specialization
//       hardens into a fixed social pyramid: a few at the top, the farming many in the
//       middle, the enslaved beneath. (Seductive misreads: "the gods/kings simply
//       decreed the ranks" / "stronger people naturally rose to the top" — both skip
//       the SURPLUS that made non-farmers possible at all.)
//
//   (B) IRRIGATION & FLOOD-CONTROL AS THE ENGINE OF STATE POWER. Canals, dikes, and
//       reservoirs in a dry floodplain are too big for any one family. Digging and
//       dredging them, sharing the water fairly, and settling the fights they cause
//       all demand a central authority that can command labor and keep records. So the
//       waterworks do not merely serve the state — they CREATE it: the need to manage
//       water concentrates power in temples and kings. The canal builds the king as
//       much as the king builds the canal. (Misreads: "a strong king built the canals,
//       so kings came first" / "the gods sent the floods, so priests just prayed" —
//       both miss that the SHARED labor of water management is what grew central power.)
//
//   (C) PARALLEL RIVER CIVILIZATIONS (Indus & Shang compared to Mesopotamia). The
//       same recipe — a great river, a farmed floodplain, a surplus, cities, writing,
//       and social ranks — appeared INDEPENDENTLY on the Indus (Harappa, Mohenjo-Daro,
//       c. 2600-1900 BCE: gridded streets, covered drains, a script still undeciphered,
//       remarkably uniform weights and bricks) and on China's Yellow River under the
//       Shang (c. 1600-1046 BCE: bronze ritual vessels, oracle-bone writing, walled
//       capitals, a king-and-priest elite). They were NOT copies of Sumer and mostly
//       never met it; civilization arose in PARALLEL wherever a river valley allowed
//       it. (Misreads: "Sumer taught everyone else how to do it" / "they're identical
//       because they copied a single original" — both deny INDEPENDENT, parallel rise.)
//
// HONEST PEDAGOGY: every figure, place, date and idea is real history (2024 NYS
// Framework Unit 2 scope). The teaching voices are fictional in-world denizens of Ur
// (a granary overseer, a canal master, and a far-traveled river-trader) so nothing is
// mis-attributed; they speak PARAPHRASE grounded in the archaeological record (Sumerian
// temple/palace storehouses and ration economy; the irrigation societies of southern
// Mesopotamia; the Harappan grid-cities, drains, and standardized weights; Shang
// bronzes and oracle bones). No invented verbatim quotes. De-identified: the only real
// person ever named anywhere is "Mr. Maccarello".
//
// All three NPCs sit at EXISTING city Ur (Era 1). Offsets dodge every core Ur NPC
// (vell-agent [4,5], hammurabi-envoy [-7,4], ninbanda [7,-3]) AND the first density
// pack's Shennur ([-5,-8] at Ur). New offsets used: [9,6], [-9,-3], [2,9].

export const pack = {
  // ---- identity ----
  id: 'd-tw-u2-river-valleys',
  unit: 'Unit 2 — River Valley Civilizations', // the Codex group + author-facing label
  title: 'Surplus, Canals, and Cousins of the River (River Valleys II)',

  // ---- extra characters added to the world ----
  // All three are fictional in-world denizens so no real figure is put words in mouth.
  // Each carries one keystone tree (see `keystones`). Intro/after lines give texture.
  npcs: [
    {
      id: 'd-tw-u2-overseer-lugala',
      name: 'Lugala',
      title: 'Granary Overseer of the Moon-Temple',
      city: 'ur',                         // existing CITIES id (Era 1)
      era: 1,
      offset: [9, 6],                     // clear of vell-agent[4,5], ninbanda[7,-3], shennur[-5,-8]
      hatKind: 'cap',
      palette: { robe: 0x7a6a3a, trim: 0x4e4222, skin: 0xc98a5b, hat: 0x3c3318 },
      keystoneId: 'd-tw-u2-ks-social-pyramid',
      introText: 'Welcome to the great storehouse, trader. I weigh the temple\'s grain — every basket of barley the fields send up, and every ration that goes back out: to the priests, the scribes, the weavers, the soldiers, and the field-hands who never see the inside of a granary. Folk look at our ranks — high priest at the top, slaves at the bottom — and think a god simply drew the line. Stand by my scales a moment and I\'ll show you what really stacked Ur into a pyramid. It begins, of all places, with how much grain a flooded field can grow.',
      afterText: 'Now you have it: the surplus is the foundation stone. A field that grows more than it eats can feed a man who does not farm at all — and once a city can feed priests and scribes and smiths, it MUST sort them into ranks. The pyramid is built of spare barley. Carry that under your hat, and you\'ll read any city in the world.',
    },
    {
      id: 'd-tw-u2-canalmaster-eresha',
      name: 'Eresha',
      title: 'Canal Master of the Lower Fields',
      city: 'ur',                         // existing CITIES id (Era 1)
      era: 1,
      offset: [-9, -3],                   // clear of hammurabi-envoy[-7,4] and shennur[-5,-8]
      hatKind: 'turban',
      palette: { robe: 0x2f6f6a, trim: 0x1d4a46, skin: 0xb97f4e, hat: 0x143832 },
      keystoneId: 'd-tw-u2-ks-irrigation-power',
      introText: 'Mind the mud, merchant — you stand at the mouth of the great canal. I am the one who says when it is dredged, who opens which gate, and who answers when two villages quarrel over the same water. Out here the river gives nothing for free; without these ditches Ur is desert. People think the king dug all this because he was mighty. Stay, and watch the water a while: I think you\'ll find the canal made the king as much as the king made the canal.',
      afterText: 'Yes — water is power, and the man who shares the water rules the men who need it. No one family can dig a canal this long or keep the peace along it; that work needs one hand over all. The ditch did not just feed the king\'s table — it built his throne. Go well, and remember who holds the gate.',
    },
    {
      id: 'd-tw-u2-trader-bansabira',
      name: 'Bansabira',
      title: 'River-Trader of the Eastern Roads',
      city: 'ur',                         // existing CITIES id (Era 1)
      era: 1,
      offset: [2, 9],                     // clear of all core Ur NPCs and shennur[-5,-8]
      hatKind: 'hood',
      palette: { robe: 0x8a5a8c, trim: 0x573a5a, skin: 0xa9672f, hat: 0x3a2540 },
      keystoneId: 'd-tw-u2-ks-parallel-rivers',
      introText: 'Peace, House of the Open Road. I have rowed and ridden farther east than most men dream — past the Gulf to the cities of the great eastern river, where the streets run straight as a scribe\'s ruler and clay pipes carry the dirty water away under the road. And I have heard travelers speak of a third river-land farther east still, where kings cast wine-vessels of bronze and read the cracks in burnt bones. You think Ur taught the whole world how to be a city. Sit, and I\'ll trouble that idea — because I have seen the others, and they are no children of Sumer.',
      afterText: 'So now you know: we were not the only ones. The Indus built its grid-cities and the far eastern kings cast their bronzes without ever copying us — each great river grew its own civilization, the same way a marsh grows reeds. Not one teacher and many pupils, friend, but many rivers, each raising its own.',
    },
  ],

  // ---- named story-beat sequences (playCutscene format) ----
  // tint ∈ amber|dusk|cold|stone, art ∈ candle|ledger|notice|portrait|null.
  cutscenes: {
    // Fires the first time the player reaches Ur — frames all THREE density questions
    // (why the city is a pyramid; how canals made the state; whether Sumer was alone)
    // and points the player at the three new denizens. Distinct from the first U2
    // pack's U2_INTRO (different flag/key, so both can fire).
    D_TW_U2_INTRO: [
      {
        tint: 'stone', kicker: 'Ur — Below the Ziggurat', art: 'ledger',
        text: 'Step back from the bazaar and look at the whole of Ur. The high priest in his linen rides above a forest of scribes and stewards; below them the potters and smiths and weavers at their benches; below them the field-hands trudging out to the canals at dawn; and beneath everyone, the enslaved, carrying what no free hand will. A whole city sorted top to bottom — and humming through all of it, the slap of water in the irrigation ditches and the creak of grain-carts coming up from the fields.',
      },
      {
        tint: 'amber', kicker: 'Three riddles by the granary', art: 'portrait',
        palette: { robe: 0x7a6a3a, trim: 0x4e4222, skin: 0xc98a5b, hat: 0x3c3318 },
        text: 'A granary overseer named Lugala beckons you to her scales. "Three things this city will teach a trader sharp enough to ask," she says. "First — from my granary — WHY a river city stacks itself into a pyramid of ranks. Second, down at the canal mouth, Eresha the water-master can show you how the ditches themselves grew kings. And third, that purple-hooded river-trader Bansabira, lately back from the eastern rivers, will tell you whether Ur taught the world to be a city — or whether the world learned it many times over, on its own." Three riddles, three teachers. Begin where you like.',
        cta: 'Start at the granary',
      },
    ],
  },

  // ---- triggers: when each cutscene fires (once) ----
  triggers: [
    {
      on: 'visit', value: 'ur', play: 'D_TW_U2_INTRO',
      reward: { house: 1, title: 'Three riddles below the ziggurat', sub: 'Ur offers a denser lesson: why a city ranks itself, how canals raise kings, and whether Sumer was ever alone.' },
    },
  ],

  // ---- THE CORE: keystones ----
  keystones: [
    // ============================================================
    // KEYSTONE A — THE SOCIAL PYRAMID / SPECIALIZATION FROM SURPLUS
    // ============================================================
    {
      id: 'd-tw-u2-ks-social-pyramid',
      npc: 'd-tw-u2-overseer-lugala',
      codexId: 'd-tw-u2-cx-social-pyramid',
      house: 2,
      houseTitle: 'You traced the social pyramid back to the surplus',
      houseSub: 'A granary overseer of Ur marks the House of the Open Road as one that knows spare barley, not a god\'s decree, built the ranks.',
      flag: 'dTwU2PyramidUnderstood',
      achievement: 'd-tw-u2-ach-surplus-builds-rank',
      start: 'challenge',
      nodes: {
        challenge: {
          text: 'Lugala sets a basket of barley on her scale. "Look at Ur, trader, top to bottom: high priest, then scribes and officials, then craftsmen, then the field-hands who actually grow the grain — and under them all, the enslaved. A neat pyramid. Now tell me, you who buy and sell for a living: WHAT lets a city sort itself like this at all? Why can Ur keep priests and scribes and smiths who never plant a single seed — when the first villages were nothing but farmers, every soul bent over the same furrow?"',
          choices: [
            {
              kind: 'say',
              // ★ RIGHT — food surplus enables specialization, which hardens into ranks.
              label: 'It\'s the surplus. Your irrigated fields grow far more barley than the farmers themselves eat, and that extra grain — the surplus in this very granary — feeds people who do NOT farm: priests, scribes, soldiers, potters, weavers, smiths. Once a city can free hands from the field, those hands take up specialized work, and the city sorts them by what they do and what they hold. The spare grain BUYS the specialists, and the specialists harden into a pyramid of ranks.',
              right: true,
              next: 'won',
            },
            {
              kind: 'say',
              // ✗ WRONG (seductive misread) — "the gods/kings just decreed the ranks."
              label: 'The gods set it so, and the king carved it into law — the high are high because heaven and the throne declared it. The ranks came down from above; there is nothing underneath them.',
              setFlag: 'dTwU2DecreeMisread',
              next: 'reteachDecree',
            },
            {
              kind: 'say',
              // ✗ WRONG (the other common misread) — "the strong naturally rose."
              label: 'The strongest and cleverest simply rose to the top, the way they always do — the weak ended up farming and the very weakest were enslaved. It is just nature sorting people.',
              next: 'reteachStrong',
            },
          ],
        },

        // ---- RIGHT PATH: the world changes ----
        won: {
          onEnter: 'reward',
          text: '(Lugala thumps the full basket, pleased.) "A trader who can see the floor beneath the throne. Yes — strip away the surplus and the whole pyramid falls flat into farmers again. One family on a dry hillside grows barely enough to eat; it can keep no priest, no scribe, no army. But flood-water and canals make a field grow three, four, ten times what its grower needs — and THAT spare grain, sitting in baskets like these, is what pays a man to pray, or write, or forge bronze, instead of plant. The more surplus, the more specialists; the more specialists, the taller and harder the ranks. The pyramid stands on stored barley, friend, not on a god\'s say-so." She marks your ledger. "The House of the Open Road knows what feeds a city\'s shape."',
          choices: [
            { label: 'Then every rank in Ur is built on spare grain. I\'ll carry that.', next: '@close' },
          ],
        },

        // ---- WRONG PATH: consequence + re-teach + LOOP back ----
        reteachDecree: {
          text: '(Lugala does not bristle; she only tilts the scale.) "A decree can NAME the ranks, trader — it cannot FEED them. Say the king proclaims a thousand priests tomorrow. Who grows their bread? A village of pure farmers, each raising just enough for its own table, has nothing spare to hand a priest — so there are no priests, decree or no decree. The order from above only works because something below already makes it possible. Ask yourself: what must a city\'s FIELDS produce before it can keep a single person who does not farm? Find that, and you\'ve found the floor of the pyramid. Weigh it again."',
          choices: [
            { label: 'I see — the decree needs spare grain to stand on. It\'s the surplus first. Let me answer again.', clearFlag: 'dTwU2DecreeMisread', next: 'challenge' },
          ],
        },
        reteachStrong: {
          text: '(Lugala shakes her head, not unkindly.) "\'The strong rose\' explains nothing, friend — strength does not bake bread. The strongest farmer on a starving hill is still a farmer; he cannot become a priest if there is no spare grain to feed a priest. What CHANGED, when villages grew into cities, was not the people\'s muscles but their fields: irrigation made the barley pile up faster than mouths could eat it. THAT surplus is what let some hands leave the furrow for the altar, the writing-board, the forge. Look past who is strong and ask what the fields could spare. Try once more."',
          choices: [
            { label: 'You\'re right — it\'s not strength, it\'s the spare harvest that freed the specialists. Let me try again.', next: 'challenge' },
          ],
        },
      },
    },

    // ============================================================
    // KEYSTONE B — IRRIGATION & FLOOD-CONTROL AS THE ENGINE OF STATE POWER
    // ============================================================
    {
      id: 'd-tw-u2-ks-irrigation-power',
      npc: 'd-tw-u2-canalmaster-eresha',
      codexId: 'd-tw-u2-cx-irrigation-power',
      house: 2,
      houseTitle: 'You saw the canal raise the throne',
      houseSub: 'A canal master of Ur marks the House of the Open Road as one that knows shared waterworks grew central power.',
      flag: 'dTwU2IrrigationUnderstood',
      achievement: 'd-tw-u2-ach-canal-built-the-king',
      start: 'challenge',
      nodes: {
        challenge: {
          text: 'Eresha crouches at the canal gate and lets the brown water run through her fingers. "This land is desert until I let the river in. But look at what a canal demands, trader: it must be dug for miles, dredged of silt every single year, its banks kept whole against the flood, its water shared fairly among a dozen quarrelling villages, and someone must judge the fights when the share runs short. Now — no one family can do all that. So tell me, you who watch how power gathers: where did Ur\'s KINGS and great temples truly come from? What raised them above everyone else?"',
          choices: [
            {
              kind: 'say',
              // ★ RIGHT — large-scale water management requires & concentrates central authority.
              label: 'The water raised them. Canals and dikes are too vast for any one family — digging and dredging them needs organized, commanded labor; sharing the water fairly needs a judge with authority over all; keeping records of who owes work and water needs scribes and a center. So the very job of managing the river concentrates power in the temple and the king. The waterworks don\'t just serve the state — they CREATE it. The canal built the throne.',
              right: true,
              next: 'won',
            },
            {
              kind: 'say',
              // ✗ WRONG (seductive misread) — "a strong king came first, THEN built canals."
              label: 'A mighty king rose first by his own strength, and only THEN did he command these canals to be dug. The throne came first; the ditches are just what a powerful man chooses to build.',
              setFlag: 'dTwU2KingFirstMisread',
              next: 'reteachKingFirst',
            },
            {
              kind: 'say',
              // ✗ WRONG (the other common misread) — "the gods sent the floods; priests just prayed."
              label: 'The gods send the floodwaters as they please, and the priests simply pray for a good rise. Power lies with heaven and the prayers; the digging is just labor, nothing to do with who rules.',
              next: 'reteachGods',
            },
          ],
        },

        // ---- RIGHT PATH: the world changes ----
        won: {
          onEnter: 'reward',
          text: '(Eresha closes the gate with a wooden groan and looks at you levelly.) "You read the water true. A single household can scratch a little ditch — but the long canals that feed a whole city, the dikes that hold back a killing flood, the fair division of water in a dry year and the peace between villages who would otherwise cut each other\'s banks: all of that needs ONE authority over many hands. Someone to muster the diggers, someone to keep the work-records, someone whose word ends the water-quarrel. That someone becomes the temple, and then the king. The river did not bow to a ready-made ruler — managing the river is what GREW the ruler. Power pooled where the water pooled." She presses a wet thumbprint to your ledger. "The House of the Open Road understands what really holds the gate."',
          choices: [
            { label: 'Then power flowed down the canal before it ever sat on a throne. I\'ll carry that.', next: '@close' },
          ],
        },

        // ---- WRONG PATH: consequence + re-teach + LOOP back ----
        reteachKingFirst: {
          text: '(Eresha smiles thinly and gestures at the empty desert beyond the green.) "Picture your mighty king BEFORE the canals, trader — standing on cracked mud where nothing grows, ruling a handful of starving families. Where is his strength FROM? There is no surplus to feed his soldiers, no city to tax, no work that needs his command. It is the canals that fill the granaries and the granaries that fill his hand. He did not build power and then dig — the digging, the shared labor, the records, the judging of water: THAT is the work that made anyone powerful enough to be called king. Which came first, then — the throne, or the thing that must be managed to fill it? Weigh it again."',
          choices: [
            { label: 'I see — managing the water is what grew the king in the first place. Let me answer again.', clearFlag: 'dTwU2KingFirstMisread', next: 'challenge' },
          ],
        },
        reteachGods: {
          text: '(Eresha lets a little water run, then dams it with her hand.) "You honor heaven, and the priests do pray for a kind flood — but prayer does not dredge a canal or settle a water-war. Look at what the temple ACTUALLY does here: it musters the diggers, it stores the surplus, its scribes record who owes labor and who owes water, and the high priest\'s word decides whose field drinks first in a dry year. That earthly WORK — organizing thousands of hands to control the river — is the true root of the temple\'s power, prayers or no prayers. Think less about the gods sending the water and more about who must ORGANIZE its control. Try once more."',
          choices: [
            { label: 'Of course — it\'s organizing the labor to control the water that builds the power. Let me try again.', next: 'challenge' },
          ],
        },
      },
    },

    // ============================================================
    // KEYSTONE C — PARALLEL RIVER CIVILIZATIONS (Indus & Shang vs. Sumer)
    // ============================================================
    {
      id: 'd-tw-u2-ks-parallel-rivers',
      npc: 'd-tw-u2-trader-bansabira',
      codexId: 'd-tw-u2-cx-parallel-rivers',
      house: 2,
      houseTitle: 'You learned civilization rose in parallel',
      houseSub: 'A far-traveled trader marks the House of the Open Road as one that knows many rivers raised cities on their own.',
      flag: 'dTwU2ParallelUnderstood',
      achievement: 'd-tw-u2-ach-many-rivers-many-cradles',
      start: 'challenge',
      nodes: {
        challenge: {
          text: 'Bansabira unrolls a worn travel-cloth marked with rivers. "I have stood in the eastern cities on the great Indus river, trader — Harappa, Mohenjo-Daro. Their streets cross in a grid, their houses share covered drains beneath the road, their bricks and weights are the same in every town as if a single hand made them, and they write in a script no man can yet read. And I\'ve heard true tales of a third river-land far to the east, on a yellow river, where Shang kings cast bronze vessels for the gods and read the future in cracked bones. Here is my riddle: Ur is old and great — so did Sumer TEACH all these others how to build a city? Or is something stranger going on?"',
          choices: [
            {
              kind: 'say',
              // ★ RIGHT — independent, parallel rise of civilization in multiple river valleys.
              label: 'Something stranger — they rose on their own. The Indus cities and the Shang on their yellow river never copied Sumer; mostly they never even met it. Yet each grew the same way Ur did: a great river, a farmed floodplain, a surplus, cities, writing, and ranks of priests and kings. Civilization wasn\'t invented once here and carried abroad — it sprang up INDEPENDENTLY wherever a river valley could feed it. Many rivers, many cradles, each raising its own.',
              right: true,
              next: 'won',
            },
            {
              kind: 'say',
              // ✗ WRONG (seductive misread) — "Sumer taught everyone; one cradle spread out."
              label: 'Of course Sumer taught them — Ur was first, so the others must have learned the whole art of the city from us and carried it east. Civilization was born once, here, and spread outward from this one cradle.',
              setFlag: 'dTwU2OneCradleMisread',
              next: 'reteachOneCradle',
            },
            {
              kind: 'say',
              // ✗ WRONG (the other common misread) — "they're identical, so they're one copied original."
              label: 'They sound the same as Ur, so they must all be the same single civilization, copied from one original — cities, writing, kings, all just one pattern stamped out again and again.',
              next: 'reteachIdentical',
            },
          ],
        },

        // ---- RIGHT PATH: the world changes ----
        won: {
          onEnter: 'reward',
          text: '(Bansabira rolls the cloth shut with respect.) "You have the rare eyes, House of the Open Road. Walk Mohenjo-Daro\'s straight streets and you\'ll see drains and brickwork finer than ours — but no temple-tower like our ziggurat, and a script we cannot read; it is no child of Sumer, only a cousin. And the Shang on their yellow river cast bronze and carve their oracle-bones in ways Ur never knew. Three great rivers, three peoples who mostly never traded a word — yet each, fed by its own flood and surplus, raised cities, writing, and kings on its own. That is the deep truth: civilization is not a secret one teacher whispered down a road. It is what a river valley GROWS, again and again, wherever the water and the grain allow. Many cradles, friend — not one." He clasps your wrist. "Now you carry more world than most kings ever see."',
          choices: [
            { label: 'Then every great river raised its own. I\'ll carry that map with me.', next: '@close' },
          ],
        },

        // ---- WRONG PATH: consequence + re-teach + LOOP back ----
        reteachOneCradle: {
          text: '(Bansabira taps the eastern rivers on his cloth.) "Being FIRST is not the same as being the TEACHER, trader. The Indus cities and the Shang were a thousand miles and more away, across mountains and seas — most never met a Sumerian in their lives, and what they built does not even match ours. Their writing is nothing like our cuneiform; the Shang cast bronze and crack bones in ways no Sumerian ever did. If they copied us, why share none of our actual marks or rites? Ask instead: what did all three places HAVE in common that could grow a city on its own — with no teacher at all? Look at the rivers, not the road between them. Weigh it again."',
          choices: [
            { label: 'I see — they weren\'t taught by us; each river grew its own. Let me answer again.', clearFlag: 'dTwU2OneCradleMisread', next: 'challenge' },
          ],
        },
        reteachIdentical: {
          text: '(Bansabira chuckles and smooths the cloth.) "Cousins, not twins, friend — and the differences are the whole point. Yes, all three have cities, writing, and ranked rulers — because all three sit on a river that floods, farms, and makes a surplus. But Ur raises a great ziggurat; Mohenjo-Daro raises no such tower and writes a script we cannot read; the Shang cast bronze vessels and burn oracle-bones we never used. Same river-recipe, different cooks — that is exactly what proves each rose on its OWN, rather than one being stamped from another. So: why would three faraway peoples share the broad shape of the city yet differ in all its details? Try once more."',
          choices: [
            { label: 'Of course — same river-recipe, separate peoples, each rising on its own. Let me try again.', next: 'challenge' },
          ],
        },
      },
    },
  ],

  // ---- Codex: the real ideas this pack teaches ----
  codex: [
    {
      id: 'd-tw-u2-cx-social-pyramid',
      group: 'Unit 2 — River Valley Civilizations',
      title: 'Food surplus created specialization and the social pyramid',
      idea: 'Irrigated river-valley farms produced more grain than the farmers needed, and that food surplus freed some people from farming to become specialists — priests, scribes, soldiers, artisans — while the farming majority and the enslaved stayed below; the stored surplus is what made non-farmers possible at all, so specialization hardened a river society into a fixed social pyramid rather than any divine decree.',
      source: 'Lugala, granary overseer of the Moon-Temple of Ur (on the Sumerian temple storehouse and ration economy)',
    },
    {
      id: 'd-tw-u2-cx-irrigation-power',
      group: 'Unit 2 — River Valley Civilizations',
      title: 'Irrigation and flood-control concentrated power into the state',
      idea: 'Large-scale canals, dikes, and reservoirs in a dry floodplain are too big for any one family: digging and dredging them, dividing the water fairly, judging water disputes, and keeping labor records all require one central authority that can command organized labor — so managing the river concentrated power in temples and kings, meaning the waterworks helped create the state rather than the state simply building the waterworks.',
      source: 'Eresha, canal master of the lower fields of Ur (on Mesopotamian irrigation and the rise of temple-and-palace authority)',
    },
    {
      id: 'd-tw-u2-cx-parallel-rivers',
      group: 'Unit 2 — River Valley Civilizations',
      title: 'River-valley civilizations arose independently and in parallel',
      idea: 'The Indus Valley (Harappa and Mohenjo-Daro, c. 2600-1900 BCE, with gridded streets, covered drains, standardized weights and bricks, and an undeciphered script) and Shang China on the Yellow River (c. 1600-1046 BCE, with bronze ritual vessels, oracle-bone writing, and walled capitals) developed cities, writing, surplus farming, and social ranks on their own, mostly without contact with Sumer — civilization arose independently in multiple river valleys rather than spreading from a single cradle.',
      source: 'Bansabira, river-trader of the eastern roads (on the Harappan grid-cities and Shang bronzes and oracle bones)',
    },
  ],

  // ---- Achievements: optional milestones ----
  achievements: [
    {
      id: 'd-tw-u2-ach-surplus-builds-rank',
      title: 'The pyramid is built of spare barley',
      desc: 'You understood that a farming surplus freed people to specialize, and that specialization — not a god\'s decree — built a river society\'s social pyramid.',
    },
    {
      id: 'd-tw-u2-ach-canal-built-the-king',
      title: 'The canal built the king',
      desc: 'You understood how the shared labor of irrigation and flood-control concentrated power and helped create the centralized state.',
    },
    {
      id: 'd-tw-u2-ach-many-rivers-many-cradles',
      title: 'Many rivers, many cradles',
      desc: 'You understood that the Indus and Shang river civilizations arose independently, in parallel with Sumer — not copied from one original cradle.',
    },
  ],
};

export default pack;
