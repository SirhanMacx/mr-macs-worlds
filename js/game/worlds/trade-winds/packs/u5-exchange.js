// u5-exchange.js — STORY PACK for Trade Winds (Global History 9).
//
// Unit 5 — Expanding Zones of Exchange (Silk Road / Indian Ocean / Trans-Saharan).
// This is a pure DATA module: no imports, no engine calls, so it can never crash
// the world on its own. The loader in ../game.js wires everything below into the
// live game. See ./CONTRACT.md for the authoritative field-by-field spec; this
// file COPIES the structure of the gold-standard ./unit3-belief-systems.js.
//
// It COMPLEMENTS the existing base keystones (Zhang Qian's complementary-scarcity
// silk-road exchange at Chang'an; Mansa Musa's supply-and-demand gold lesson and
// Ibn Battuta's connected-world lesson at Timbuktu; Zheng He's monsoon-direction
// lesson at Calicut). It adds THREE new understanding beats with NEW fictional
// denizens so nothing collides:
//
//   (a) CHANG'AN — the Silk Road carried IDEAS, religion, technology, and DISEASE,
//       not just silk: CULTURAL DIFFUSION. (Buddhism traveling from India into Han
//       and Tang China is the anchor case; paper and the plague are the other
//       freight.) Mentor: Liang, a Tang translator-monk at the Western Market.
//   (b) TIMBUKTU — the trans-Saharan GOLD–SALT trade, and WHY salt could be worth
//       its weight in gold: the West African forest belt produced gold but had no
//       salt of its own, while the desert had salt slabs (Taghaza) but no gold. A
//       thing's value is set by where it is SCARCE. Mentor: Fatima, a Timbuktu
//       caravan-broker who weighs both at the assay table.
//   (c) CALICUT — the TECHNOLOGY that made Indian Ocean trade possible: the dhow
//       with its lateen sail (which can beat against the wind), the astrolabe and
//       star-knowledge for finding latitude out of sight of land, and above all
//       the MONSOON as a seasonal CALENDAR. Mentor: Hassan, a Swahili-coast pilot
//       and dhow-master in the Calicut roads.
//
// Honest pedagogy: every place, route, good, technology, and idea here is real
// history. The named historical anchors (Buddhism's spread, paper after Talas in
// 751, the Black Death along the road, Taghaza salt, the dhow / lateen sail /
// astrolabe / monsoon) are genuine; the three MENTORS are fictional in-world
// denizens so nothing is mis-attributed and no invented verbatim quote is put in
// a real figure's mouth. De-identified: the only real person named anywhere in the
// game is "Mr. Maccarello".

export const pack = {
  // ---- identity ----
  id: 'u5-exchange',
  unit: 'Unit 5 — Expanding Zones of Exchange', // Codex group + author-facing label
  title: 'What Else Crossed the Roads — Ideas, Salt, and the Wind',

  // ---- extra characters added to the world ----
  // Three fictional mentor-denizens, each at an EXISTING city, each carrying ONE
  // keystone. Offsets are chosen to avoid every core NPC at that city:
  //   Chang'an   busy slots: zhangqian[-6,-4], vandak[7,4], vell-east[-7,6]  -> use [7,-5]
  //   Timbuktu   busy slots: mansamusa[-7,-4], ibnbattuta[7,4], vell-south[6,6] -> use [-8,5]
  //   Calicut    busy slots: zhenghe[-7,4], pilot-calicut[8,-5]              -> use [7,6]
  npcs: [
    {
      id: 'u5-translator-changan',
      name: 'Liang',
      title: 'Translator of Sutras at the Western Market',
      city: 'changan',
      era: 2,                              // hidden until the world reaches Era II
      offset: [7, -5],                     // clear of zhangqian / vandak / vell-east
      hatKind: 'scholar',
      palette: { robe: 0xb87333, trim: 0x6e4423, skin: 0xd9b07c, hat: 0x3a2a18 },
      keystoneId: 'ks-silk-road-diffusion',
      introText: 'You smell the camels before you see them, trader — the Western Market is where the whole road empties out. Most merchants only count the silk going out and the horses coming in. I count something else. I sit here turning Sanskrit sutras into Chinese characters all day, because the most valuable thing the road ever carried was not in any of those bales. Stay a moment; there is a thing about THIS road most traders never see.',
      afterText: 'You see it now: the road is a river of MINDS, not only of goods. The Buddha came up it from India; paper went down it to the west; and one day, God forbid, a sickness will ride it too. Goods are only the cargo people notice. Walk well, friend — and watch what travels beside the silk.',
    },
    {
      id: 'u5-broker-timbuktu',
      name: 'Fatima',
      title: 'Caravan-Broker at the Assay Table',
      city: 'timbuktu',
      era: 3,                              // Timbuktu's era
      offset: [-8, 5],                     // clear of mansamusa / ibnbattuta / vell-south
      hatKind: 'turban',
      palette: { robe: 0x3a6ea5, trim: 0x244766, skin: 0x6b4226, hat: 0x244766 },
      keystoneId: 'ks-gold-salt-scarcity',
      introText: 'Peace, trader. Set your bags down at my table — I broker the two cargoes that built this city: gold coming up from the south, salt coming down from the desert north. Newcomers always laugh at the salt. "Rock? You trade ROCK?" Then I ask them one question they cannot answer, and they stop laughing. Sit. I will ask you the same one.',
      afterText: 'Now you understand the assay table. Gold is precious because the forest has it and we do not; salt is precious because the desert has it and the forest does not. Value lives wherever a thing is RARE. Carry that and you will never again be the trader who laughs at salt. Go in peace.',
    },
    {
      id: 'u5-pilot-calicut',
      name: 'Hassan',
      title: 'Dhow-Master of the Swahili Coast',
      city: 'calicut',
      era: 4,                              // Calicut's era
      offset: [7, 6],                      // clear of zhenghe / pilot-calicut
      hatKind: 'cap',
      palette: { robe: 0xe8e2d0, trim: 0xb0a888, skin: 0x8a5a36, hat: 0xb0a888 },
      keystoneId: 'ks-indian-ocean-tech',
      introText: 'As-salaamu alaykum, trader. That stitched ship in the roads with the slanting sail is mine — a dhow, sailed up from the Swahili coast on this season\'s wind. Landsmen think the sea is the empty part of the map, the dangerous gap between real places. They have it backwards. The ocean is the easiest highway on earth — IF you know its secret. Ask me, and I will tell you what carries a ship across open water out of sight of any shore.',
      afterText: 'Now you know the ocean\'s secret: a ship that can sail across the wind, a star to fix your latitude, and a wind that keeps a calendar. The Indian Ocean is not a barrier — it is the busiest road in the world, and the wind itself drives the caravan. Fair winds, friend.',
    },
  ],

  // ---- named story-beat sequences (playCutscene format) ----
  // Each is an array of beats: { kicker, text, tint, art, palette, cta }. tint in
  // amber|dusk|cold|stone, art in candle|ledger|notice|portrait|null. The loader
  // plays one ONCE when a matching trigger fires.
  cutscenes: {
    // Fires the first time the player reaches Chang'an in Era II — frames the
    // whole unit's question ("what ELSE crossed the roads?") before the player
    // meets the translator.
    U5_INTRO: [
      {
        tint: 'stone', kicker: 'Chang\'an — the Eastern Gate of the Road', art: 'notice',
        text: 'You step into the Western Market of Chang\'an and the world arrives with you: Sogdian credit-men, Persian musicians, steppe horse-traders, monks in saffron. The caravans you came in with carried silk one way and horses the other — but that is only the freight everyone bothers to weigh. Something heavier and harder to see has been moving up and down this road for centuries.',
      },
      {
        tint: 'amber', kicker: 'A translator at his table', art: 'portrait',
        palette: { robe: 0xb87333, trim: 0x6e4423, skin: 0xd9b07c, hat: 0x3a2a18 },
        text: 'A man bent over palm-leaf manuscripts looks up. "You count silk and horses," he says, not unkindly. "Weigh me a heavier cargo, then: the Buddha walked up this road from India and changed the soul of an empire. No camel ever carried him. How does a faith — or a tool, or a sickness — travel a trade road that only sells cloth and beasts?" His name is Liang. Go and learn what he counts.',
        cta: 'Seek out the translator',
      },
    ],
  },

  // ---- triggers: when each cutscene fires (once) ----
  triggers: [
    {
      on: 'visit', value: 'changan', play: 'U5_INTRO',
      reward: { house: 1, title: 'The road is more than its cargo', sub: 'Chang\'an asks what travels beside the silk.' },
    },
  ],

  // ---- THE CORE: keystones ----
  // Each is a dialogue tree built to the exemplar bar (the Nin-Banda / Zhang Qian
  // pattern). Choices are FULL IN-CHARACTER SENTENCES (kind:'say'); the right one
  // records the Codex entry + lifts House Standing (+ flag + achievement); every
  // wrong one re-routes to a mentor who teaches the missing idea, then LOOPS back
  // to `challenge`. No score, no "Question N of M", no failure screen.
  keystones: [
    // =====================================================================
    // (a) CHANG'AN — CULTURAL DIFFUSION along the Silk Road.
    // The road moved IDEAS, religion (Buddhism India -> China), technology
    // (paper, west after Talas 751), and DISEASE (the plague), not just silk.
    // =====================================================================
    {
      id: 'ks-silk-road-diffusion',
      npc: 'u5-translator-changan',
      codexId: 'cx-silk-road-diffusion',
      house: 2,
      houseTitle: 'You see what travels beside the silk',
      houseSub: 'A translator-monk marks the House of the Open Road as one that understands the road carries minds, not only cargo.',
      flag: 'u5DiffusionUnderstood',
      achievement: 'ach-roads-carry-minds',
      start: 'challenge',
      nodes: {
        challenge: {
          text: 'Liang sets down his brush. "Look at what I do all day: I turn Indian sutras into Chinese books, because Buddhism came UP this road from India and is remaking how my people think about life and death. No one paid a toll for the Buddha. Paper, born in China, will travel the other way and reach Baghdad and beyond. And one terrible day a sickness will ride the very same caravans. So tell me, merchant: when we say the Silk Road \'carried silk,\' what are we MISSING — what did this road really move?"',
          choices: [
            {
              kind: 'say',
              // ★ RIGHT — cultural diffusion: the road moved ideas, religion, technology, AND disease.
              label: 'You are missing almost everything that mattered. The road moved IDEAS along with goods — religions like Buddhism spreading from India into China, technologies like paper spreading west, and even diseases like the plague. Wherever traders went, beliefs and inventions and sicknesses went with them. That spread of culture along the trade routes is the road\'s real cargo.',
              right: true,
              next: 'won',
            },
            {
              kind: 'say',
              // ✗ WRONG (the literal misread) — "it carried silk, that's why it's named that."
              label: 'It carried silk — that is why we call it the Silk Road. The cloth was the whole point; the rest was just travelers passing through, nothing that changed anything.',
              setFlag: 'u5LiteralMisread',
              next: 'reteachLiteral',
            },
            {
              kind: 'say',
              // ✗ WRONG (the conquest misread) — "ideas only spread by armies / conquest."
              label: 'Faith only spreads by the sword. Buddhism must have come to China because some army conquered its way in — peaceful traders never change what a people believes.',
              next: 'reteachConquest',
            },
          ],
        },

        // ---- RIGHT PATH: the world changes ----
        won: {
          onEnter: 'reward',
          text: '(Liang touches the manuscript in front of him, almost tenderly.) "Yes. That is why a translator earns his bread at a trade market. The merchant carries the silk — and tucked in beside it ride the prayers, the recipes, the inventions, and, God forgive the road, the plagues. Historians have a name for it: cultural diffusion. Buddhism walked here from India on no army\'s back; paper will walk west and teach the world to write cheaply; and the same dust that carries gold will one day carry a sickness across half the earth. You will look at every caravan differently now." He presses his palms together. "May your house carry good things, and only good things, on every road it walks."',
          choices: [
            { label: 'Then I\'ll watch what travels beside the silk.', next: '@close' },
          ],
        },

        // ---- WRONG PATHS: consequence + re-teach + LOOP back ----
        reteachLiteral: {
          text: '(Liang does not scold; he just turns the manuscript toward you.) "Read this, then. It is Sanskrit, copied a thousand miles from where Sanskrit is spoken — that did not arrive in a bale of cloth. The name \'Silk Road\' is a label scholars gave it long after; the road itself never agreed to carry only one thing. Think past the silk: when a Chinese monk learns an Indian faith, when paper-making leaks west to Baghdad, when a steppe rat brings a plague to a city — what is actually CROSSING on this road, besides goods? Weigh it again."',
          choices: [
            { label: 'I see — it is whole ways of thinking and living crossing, not just goods. Let me answer again.', clearFlag: 'u5LiteralMisread', next: 'challenge' },
          ],
        },
        reteachConquest: {
          text: '(Liang shakes his head gently.) "No army carried the Buddha to China — merchants and monks did, walking the trade road one safe stretch at a time. A faith can ride a caravan as easily as a bolt of silk: a trader stops at a wayside shrine, a monk begs his supper at a market like this one, a copied scripture changes hands. Conquest is one way ideas move, but trade is the quieter, stronger one. So when goods flow along a road, what flows ALONGSIDE them without anyone needing to fight? Try once more."',
          choices: [
            { label: 'Of course — ideas and beliefs travel with the traders themselves. Let me try again.', next: 'challenge' },
          ],
        },
      },
    },

    // =====================================================================
    // (b) TIMBUKTU — TRANS-SAHARAN GOLD-SALT trade and the LAW OF SCARCITY.
    // The forest belt produced gold but no salt; the desert had salt but no
    // gold. Salt was worth its weight because it was vital AND scarce in the
    // south. Value is set by where a thing is RARE, not by what it "is."
    // =====================================================================
    {
      id: 'ks-gold-salt-scarcity',
      npc: 'u5-broker-timbuktu',
      codexId: 'cx-gold-salt-scarcity',
      house: 2,
      houseTitle: 'You learn why salt buys gold',
      houseSub: 'A Timbuktu broker marks the House of the Open Road as one that understands value lives wherever a thing is scarce.',
      flag: 'u5SaltUnderstood',
      achievement: 'ach-salt-for-gold',
      start: 'challenge',
      nodes: {
        challenge: {
          text: 'Fatima sets two things on the assay table: a leather pouch of gold dust from the southern forests, and a grey slab of rock salt walked down from Taghaza in the desert. "Here is the riddle that built Timbuktu," she says. "Caravans cross the deadliest desert on earth to trade these two — and in the southern goldfields men will swap salt for gold near enough weight for weight. To a stranger it is madness: precious metal for a lump of ROCK. You weigh things, trader. Tell me — WHY would anyone trade gold for salt?"',
          choices: [
            {
              kind: 'say',
              // ★ RIGHT — scarcity sets value; forest has gold, no salt; desert has salt, no gold.
              label: 'Because in the southern forests where the gold is, there is no salt — the people need it to live and to keep their food, but the land gives them none. The desert has salt but no gold. Each side trades what it has plenty of for what it cannot get. Salt is worth gold down south because down south salt is rare and the body cannot do without it. Value follows scarcity, not the kind of thing it is.',
              right: true,
              next: 'won',
            },
            {
              kind: 'say',
              // ✗ WRONG (the intrinsic-value misread) — "gold is just always worth more than salt."
              label: 'Gold is simply worth more than salt, everywhere and always. Anyone trading gold away for rock is being cheated — they will regret it.',
              setFlag: 'u5IntrinsicMisread',
              next: 'reteachIntrinsic',
            },
            {
              kind: 'say',
              // ✗ WRONG (the "salt is luxury" misread) — flavoring, not survival.
              label: 'Because salt is a fine luxury — a rich man\'s seasoning to flavor his feast. People pay dearly for it the way they pay for pepper or spice.',
              next: 'reteachLuxury',
            },
          ],
        },

        won: {
          onEnter: 'reward',
          text: '(Fatima sweeps the gold and the salt together with one hand.) "There it is — you weighed it true. The forest belt drowns in gold and starves for salt; the body cannot live without it and the heat makes it dearer still, yet the southern land yields none. The desert is the opposite: salt by the slab from Taghaza, and not a grain of gold. So the desert and the forest are made for each other, and Timbuktu sits exactly where they meet — and taxes the handshake. A thing is worth whatever it is RARE-and-needed somewhere else. Learn that and the whole Sahara makes sense." She nods, satisfied. "My table is open to your house whenever you cross the sand."',
          choices: [
            { label: 'Then value follows scarcity — I\'ll carry that across the sand.', next: '@close' },
          ],
        },

        reteachIntrinsic: {
          text: '(Fatima taps the salt slab, patient.) "If gold were always worth more than salt, child, no caravan would risk the desert to bring salt south — there would be no profit in it. But they DO, every season, because where they are going salt is worth its weight in gold and gold is merely common. A thing is not worth the same everywhere. Ask yourself: what makes salt precious in the southern forest in a way it is not precious here? Weigh it again."',
          choices: [
            { label: 'I see — its worth changes with the place. Let me answer again.', clearFlag: 'u5IntrinsicMisread', next: 'challenge' },
          ],
        },
        reteachLuxury: {
          text: '(Fatima almost laughs, then softens.) "Spice flavors a feast; salt keeps you ALIVE. In this heat a body sweats salt out and must put it back or it fails — and salt is the only way to keep meat and fish from rotting before the next harvest. It is not a rich man\'s seasoning; it is survival, and the gold lands have none of their own. A thing people MUST have, that the land will not give them — what does that do to its price? Try once more."',
          choices: [
            { label: 'Of course — it is a necessity they cannot get there, not a luxury. Let me try again.', next: 'challenge' },
          ],
        },
      },
    },

    // =====================================================================
    // (c) CALICUT — the TECHNOLOGY of Indian Ocean trade.
    // The dhow + lateen sail (can sail across/against the wind), the astrolabe
    // and star-knowledge (latitude out of sight of land), and above all the
    // MONSOON used as a seasonal calendar made open-ocean trade possible.
    // =====================================================================
    {
      id: 'ks-indian-ocean-tech',
      npc: 'u5-pilot-calicut',
      codexId: 'cx-indian-ocean-tech',
      house: 2,
      houseTitle: 'You read the ocean like a pilot',
      houseSub: 'A Swahili dhow-master marks the House of the Open Road as one that understands the technology that turned the ocean into a highway.',
      flag: 'u5DhowUnderstood',
      achievement: 'ach-wind-is-a-calendar',
      start: 'challenge',
      nodes: {
        challenge: {
          text: 'Hassan walks you down to the waterline, to his stitched-plank dhow with its single slanting sail. "I sailed this hull from the Swahili coast to Calicut across open water," he says, "out of sight of any land for days. No oars, no army of rowers, just this ship, this sail, and what is in my head. Landsmen call the ocean a barrier. I cross it twice a year for profit. Tell me, trader — what does a ship and its master NEED, to make the open ocean a road instead of a grave?"',
          choices: [
            {
              kind: 'say',
              // ★ RIGHT — dhow + lateen sail + astrolabe/stars + monsoon as a calendar.
              label: 'It needs the right tools and the right knowledge together. A dhow with a lateen sail that can catch the wind from the side and even work against it, an astrolabe and the stars to fix how far north or south you are when no land is in sight — and most of all the monsoon, the wind that reverses with the seasons so you sail out on one and home on the other. The wind itself becomes a calendar. Those are what turn open ocean into a highway.',
              right: true,
              next: 'won',
            },
            {
              kind: 'say',
              // ✗ WRONG (the brute-force misread) — "just a big ship and many rowers."
              label: 'It needs nothing clever — only a big enough ship and enough strong men at the oars to row across by brute force. Sailing is just hard work, not knowledge.',
              setFlag: 'u5RowMisread',
              next: 'reteachRow',
            },
            {
              kind: 'say',
              // ✗ WRONG (the wind-is-random misread) — "luck and a following wind."
              label: 'It needs luck, mostly — you wait for a wind blowing the way you want and pray it holds the whole crossing. The wind is just chance.',
              next: 'reteachLuck',
            },
          ],
        },

        won: {
          onEnter: 'reward',
          text: '(Hassan slaps the dhow\'s timber, pleased.) "A sailor\'s answer from a landsman — good. The lateen sail lets me work the wind from the side, so I am not its prisoner. The astrolabe and the stars tell me my latitude when there is nothing but water in every direction. And the monsoon — that is the great secret: it blows toward Asia half the year and back the other half, steady as a clock. We do not fight the ocean; we read it and ride it. That is why this sea has carried more trade for longer than any road on dry land. The wind keeps the calendar; the ship and the knowledge do the rest." He grins. "Sail with me anytime, friend — your house knows the sea now."',
          choices: [
            { label: 'Then I\'ll let the wind keep my calendar.', next: '@close' },
          ],
        },

        reteachRow: {
          text: '(Hassan laughs and points to his bare deck.) "Count the oars, trader — there are none. No crew on earth could row from Africa to India and back; they would die of thirst and exhaustion first. The dhow has almost no rowers because it does not NEED them: the sail does the work, and the right sail can even carry me across a wind, not just before it. This is not brute strength, it is craft — a hull, a sail, and the wind handled with skill. So what KIND of ship and what KNOWLEDGE make that crossing possible? Weigh it again."',
          choices: [
            { label: 'I see — it is the ship\'s design and the sailor\'s knowledge, not raw muscle. Let me answer again.', clearFlag: 'u5RowMisread', next: 'challenge' },
          ],
        },
        reteachLuck: {
          text: '(Hassan shakes his head, serious now.) "If the wind were chance, no one would dare these waters — and yet whole cities live by them. The wind here is the opposite of chance: the monsoon turns with the seasons like a tide you can mark on a calendar. I sail OUT when it blows one way and wait for it to reverse to come HOME. That is not luck; it is a timetable written in the sky, and every Swahili and Arab and Indian pilot has it by heart. A wind you can PREDICT and plan around — what does that make the ocean into? Try once more."',
          choices: [
            { label: 'Of course — the monsoon is a predictable, seasonal calendar, not luck. Let me try again.', next: 'challenge' },
          ],
        },
      },
    },
  ],

  // ---- Codex: the real ideas this pack teaches ----
  // The keystone codexIds point here; group equals the pack's `unit` so entries
  // bucket together. Each `idea` is one clear, true sentence the student can walk
  // back into an Enduring-Issues essay.
  codex: [
    {
      id: 'cx-silk-road-diffusion',
      group: 'Unit 5 — Expanding Zones of Exchange',
      title: 'The Silk Road moved ideas, not just goods (cultural diffusion)',
      idea: 'Trade routes like the Silk Road spread far more than merchandise: religions (Buddhism traveled from India into China), technologies (paper spread west), and even diseases (the plague) moved along with the caravans — a process called cultural diffusion.',
      source: 'Liang, translator of sutras at the Western Market of Chang\'an (on the spread of Buddhism, paper, and disease along the Silk Road)',
    },
    {
      id: 'cx-gold-salt-scarcity',
      group: 'Unit 5 — Expanding Zones of Exchange',
      title: 'Why salt could be worth its weight in gold (scarcity sets value)',
      idea: 'In the trans-Saharan trade the gold-rich West African forest belt had no salt of its own, while the desert had salt slabs (from places like Taghaza) but no gold; because salt was vital to life yet scarce in the south, it could trade for gold near its own weight — value follows scarcity and need, not the kind of thing itself.',
      source: 'Fatima, caravan-broker of Timbuktu (on the trans-Saharan gold-salt trade)',
    },
    {
      id: 'cx-indian-ocean-tech',
      group: 'Unit 5 — Expanding Zones of Exchange',
      title: 'The technology that made Indian Ocean trade possible',
      idea: 'Indian Ocean trade ran on technology and knowledge: the dhow with its lateen sail (which can sail across and against the wind), the astrolabe and star-knowledge for finding latitude out of sight of land, and above all the monsoon winds, which reverse with the seasons and so act as a dependable calendar for sailing out and home.',
      source: 'Hassan, dhow-master of the Swahili coast (on the dhow, the lateen sail, the astrolabe, and the monsoon)',
    },
  ],

  // ---- Achievements: optional milestones ----
  achievements: [
    {
      id: 'ach-roads-carry-minds',
      title: 'Roads Carry Minds',
      desc: 'You understood that the Silk Road spread ideas, religion, technology, and disease — cultural diffusion — not merely silk.',
    },
    {
      id: 'ach-salt-for-gold',
      title: 'Salt for Gold',
      desc: 'You understood why salt could trade for its weight in gold across the Sahara: a thing\'s value follows where it is scarce and needed.',
    },
    {
      id: 'ach-wind-is-a-calendar',
      title: 'The Wind Is a Calendar',
      desc: 'You understood the technology of Indian Ocean trade — the dhow, the lateen sail, the astrolabe, and the monsoon read as a seasonal calendar.',
    },
  ],
};

export default pack;
