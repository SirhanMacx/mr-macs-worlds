// density-u5-exchange.js — DENSITY STORY PACK for Trade Winds (Global History 9).
//
// Unit 5 — Expanding Zones of Exchange (Silk Road / Indian Ocean / Trans-Saharan).
// This is a SECOND, denser pack for Unit 5. It is a pure DATA module: no imports,
// no engine calls, so it can never crash the world on its own. The loader in
// ../game.js wires everything below into the live game. See ./CONTRACT.md for the
// authoritative field-by-field spec; this file COPIES the structure of the
// gold-standard ./unit3-belief-systems.js.
//
// IT DOES NOT DUPLICATE the base pack (./u5-exchange.js). That pack already taught:
//   • cultural diffusion in general (Buddhism / paper / disease) at Chang'an,
//   • the gold–salt SCARCITY law at Timbuktu,
//   • the TECHNOLOGY of Indian Ocean trade (dhow / lateen / astrolabe / monsoon)
//     at Calicut,
// and the base world's quest NPCs cover Zhang Qian, Mansa Musa, Ibn Battuta, and
// Zheng He. This DENSITY pack opens TWO NEW curriculum ideas the unit still needs,
// each set at an EXISTING city with all-new fictional denizens so nothing collides:
//
//   (a) TIMBUKTU — a great trade city became a COSMOPOLITAN HUB OF LEARNING, not
//       just a market. Wealth from caravans funded the Sankore mosque-university
//       and a book trade so large that scholars, students, and manuscripts (law,
//       astronomy, medicine) became Timbuktu's most valuable cargo. The same
//       pattern made the Swahili coast (Kilwa) and Samarkand cosmopolitan crossroads
//       of many peoples and tongues. Mentor: Aïsha, a Sankore copyist & bookseller.
//   (b) CALICUT — RELIGION SPREAD ALONG TRADE AS A SYSTEM. Islam crossed the Indian
//       Ocean not by armies but on the merchant network itself: Muslim traders
//       settled in port after port, intermarried, built mosques, and tied a common
//       faith, law, and language (Arabic) into the trade web, so a merchant could
//       move from Calicut to Kilwa to Aden inside ONE shared world (the Dar al-Islam).
//       Mentor: Ahmad ibn Yusuf, a Karimi merchant of the port quarter.
//
// Honest pedagogy: every place, institution, route, and idea here is real history —
// Sankore and the Timbuktu manuscript tradition; the Swahili Stone Towns and Kilwa;
// Samarkand as a Silk-Road crossroads; the merchant-borne spread of Islam across the
// Indian Ocean and the connected Dar al-Islam Ibn Battuta could travel inside. The
// two MENTORS are fictional in-world denizens so nothing is mis-attributed and no
// invented verbatim quote is put in a real figure's mouth. De-identified: the only
// real person named anywhere in the game is "Mr. Maccarello".

export const pack = {
  // ---- identity ----
  id: 'd-tw-u5-exchange-density',
  unit: 'Unit 5 — Expanding Zones of Exchange', // Codex group + author-facing label
  title: 'Cities of Books and a Faith That Sailed — Exchange Networks (More)',

  // ---- extra characters added to the world ----
  // Two fictional mentor-denizens, each at an EXISTING city, each carrying ONE
  // keystone. Offsets dodge EVERY NPC already at that city (core + base density pack):
  //   Timbuktu busy: mansamusa[-7,-4], ibnbattuta[7,4], vell-south[6,6],
  //                  u5-broker-timbuktu[-8,5]                      -> use [8,-7]
  //   Calicut  busy: zhenghe[-7,4], pilot-calicut[8,-5],
  //                  u5-pilot-calicut[7,6]                          -> use [-8,-6]
  npcs: [
    {
      id: 'd-tw-u5-copyist-timbuktu',
      name: 'Aïsha',
      title: 'Copyist & Bookseller of Sankore',
      city: 'timbuktu',
      era: 3,                              // Timbuktu's era
      offset: [8, -7],                     // clear of mansamusa / ibnbattuta / vell-south / u5-broker
      hatKind: 'scholar',
      palette: { robe: 0x2f5d50, trim: 0x1c3a32, skin: 0x8a5a36, hat: 0x1c3a32 },
      keystoneId: 'd-tw-u5-ks-city-of-learning',
      introText: 'Peace, trader. You smell the gold and salt in this market — everyone does. But follow the lanes past the assay tables and you reach my courtyard at Sankore, where the real wealth of Timbuktu is shelved, not weighed: books. Caravans made this city rich, and the rich built schools, and the schools drew scholars from Cairo to Córdoba. Sit. There is a thing about what a trade city BECOMES that most merchants never stop to learn.',
      afterText: 'You see it now: the caravan brought the gold, the gold built Sankore, Sankore drew the scholars, and the scholars made Timbuktu a city the whole Muslim world wrote letters to. A great market does not stay only a market — it becomes a meeting-place of minds. Carry that, and walk well.',
    },
    {
      id: 'd-tw-u5-merchant-calicut',
      name: 'Ahmad ibn Yusuf',
      title: 'Karimi Merchant of the Port Quarter',
      city: 'calicut',
      era: 4,                              // Calicut's era
      offset: [-8, -6],                    // clear of zhenghe / pilot-calicut / u5-pilot-calicut
      hatKind: 'turban',
      palette: { robe: 0xdfe6ea, trim: 0x9aa6ad, skin: 0x9a6a3c, hat: 0xb7c0c6 },
      keystoneId: 'd-tw-u5-ks-faith-along-trade',
      introText: 'As-salaamu alaykum, trader. I am of the Karimi — merchant houses that move pepper and gold from these roads to Aden and Cairo. Look down this lane: a mosque, an Arabic court for our contracts, fellow believers who will lodge me though I was born a thousand miles away. I sailed in a stranger and I am already at home. Ask me how — for it is the same reason a faith can cross an ocean no army ever conquered.',
      afterText: 'Now you understand the secret of my road: I am never truly a stranger in any port from Sofala to Canton, because the same faith, the same law, the same Arabic letters reach every harbor before I do. Trade carried the religion, and the religion knit the trade into one world. Fair winds, friend.',
    },
  ],

  // ---- named story-beat sequences (playCutscene format) ----
  // tint in amber|dusk|cold|stone; art in candle|ledger|notice|portrait|null. The
  // loader plays one ONCE when a matching trigger fires.
  cutscenes: {
    // Fires the first time the player reaches Timbuktu in Era III — frames the
    // "what does a trade city BECOME?" question before the player meets the copyist.
    D_TW_U5_INTRO: [
      {
        tint: 'stone', kicker: 'Timbuktu — the City the Caravans Built', art: 'notice',
        text: 'You expected a market and you found a metropolis. Past the gold-scales and the salt slabs the lanes fill with another kind of traffic entirely: students with ink-stained fingers, scholars debating law in the shade, porters carrying not bales but bound manuscripts. Travelers say the book trade here out-earns every other merchandise — that learning itself has become a commodity worth crossing the desert for.',
      },
      {
        tint: 'amber', kicker: 'A bookseller in the Sankore quarter', art: 'portrait',
        palette: { robe: 0x2f5d50, trim: 0x1c3a32, skin: 0x8a5a36, hat: 0x1c3a32 },
        text: 'A woman cataloguing manuscripts looks up from her writing-board. "You came for gold," she says, smiling, "but you are standing in the part of Timbuktu the gold paid FOR. Here is a question worth more than a caravan-load: how does a place that began as a mere stop on a trade road turn into a city scholars travel the world to reach?" Her name is Aïsha. Go and ask her what a great market becomes.',
        cta: 'Seek out the bookseller',
      },
    ],
  },

  // ---- triggers: when each cutscene fires (once) ----
  triggers: [
    {
      on: 'visit', value: 'timbuktu', play: 'D_TW_U5_INTRO',
      reward: { house: 1, title: 'A city of more than markets', sub: 'Timbuktu asks what a trade road builds beyond a bazaar.' },
    },
  ],

  // ---- THE CORE: keystones ----
  // Each is a dialogue tree built to the exemplar bar. Choices are FULL IN-CHARACTER
  // SENTENCES (kind:'say'); the right one records the Codex entry + lifts House
  // Standing (+ flag + achievement); every wrong one re-routes to a mentor who
  // teaches the missing idea, then LOOPS back to `challenge`. No score, no
  // "Question N of M", no failure screen.
  keystones: [
    // =====================================================================
    // (a) TIMBUKTU — TRADE CITIES BECAME COSMOPOLITAN HUBS OF LEARNING.
    // Caravan wealth funded Sankore (mosque-university) and a vast book trade;
    // scholars, students, and manuscripts of law/astronomy/medicine flowed in;
    // the same pattern made Kilwa (Swahili coast) and Samarkand cosmopolitan
    // crossroads of many peoples and faiths. A market becomes a meeting of minds.
    // =====================================================================
    {
      id: 'd-tw-u5-ks-city-of-learning',
      npc: 'd-tw-u5-copyist-timbuktu',
      codexId: 'd-tw-u5-cx-city-of-learning',
      house: 2,
      houseTitle: 'You see what a great market becomes',
      houseSub: 'A Sankore bookseller marks the House of the Open Road as one that understands a trade city grows into a hub of learning.',
      flag: 'dTwU5CityOfLearningUnderstood',
      achievement: 'd-tw-u5-ach-city-of-books',
      start: 'challenge',
      nodes: {
        challenge: {
          text: 'Aïsha squares a freshly copied page. "Think on what you have walked through today," she says. "Timbuktu is the gateway where the desert salt meets the forest gold, and the tolls made it fabulously rich. But it did not stop there. That wealth raised the Sankore mosque into a place of study, and study drew scholars and students from across the Muslim world — Cairo, Fez, Córdoba — until manuscripts of law and astronomy and medicine became our costliest cargo. The Swahili port of Kilwa and the Silk-Road crossroads of Samarkand grew the very same way. So tell me, trader: WHAT does a place like this BECOME, beyond a busy bazaar?"',
          choices: [
            {
              kind: 'say',
              // ★ RIGHT — the trade hub becomes a cosmopolitan center of learning &
              // exchange of many peoples/ideas, because trade wealth funds schools.
              label: 'It becomes far more than a bazaar — it becomes a cosmopolitan city of learning. The wealth from trade pays for schools like Sankore and a great book trade, and that draws scholars, students, and ideas from many lands, so a market crossroads turns into a meeting-place of peoples and minds — like Kilwa on the Swahili coast and Samarkand on the Silk Road.',
              right: true,
              next: 'won',
            },
            {
              kind: 'say',
              // ✗ WRONG (the "just richer" misread) — wealth changes nothing but the size of the market.
              label: 'It just becomes a bigger, richer market — more gold changing hands, more caravans, but the same kind of place. Trade only ever makes a market larger; it does not turn it into anything new.',
              setFlag: 'dTwU5JustRicherMisread',
              next: 'reteachJustRicher',
            },
            {
              kind: 'say',
              // ✗ WRONG (the "books are imported finished" misread) — learning here is just buying foreign books, no local scholarship.
              label: 'It becomes a place that buys finished books shipped in from real centers like Cairo — there is no learning OF its own here, only foreign manuscripts passing through on their way somewhere better.',
              next: 'reteachImported',
            },
          ],
        },

        // ---- RIGHT PATH: the world changes ----
        won: {
          onEnter: 'reward',
          text: '(Aïsha sets her pen down and gestures to the shelves around her, pleased.) "Yes — you understand my city better than the merchants who only count its gold. The caravan brought the wealth; the wealth built Sankore; Sankore drew the scholars; and the scholars made Timbuktu a name written in libraries from Granada to Damascus. We copy and SELL the law of the Maliki jurists, the astronomy of the ancients, the medicine of the physicians — and students cross the Sahara to study, not to trade. Kilwa grew its stone palaces and Swahili tongue the same way; Samarkand its domes and its sciences. A great crossroads always becomes a meeting of minds, not only of goods." She inclines her head. "Your house is welcome in the Sankore quarter whenever you cross the sand."',
          choices: [
            { label: 'Then I\'ll remember the city the gold built, not just the gold.', next: '@close' },
          ],
        },

        // ---- WRONG PATHS: consequence + re-teach + LOOP back ----
        reteachJustRicher: {
          text: '(Aïsha shakes her head, gently amused.) "Look around you, trader — are these book-stalls and lecture-courtyards just a \'bigger market\'? Wealth is the SEED, not the whole plant. When a trade city grows rich it does something a poor village never can: it builds mosques, schools, libraries, and it pays scholars to come and stay. That is how Timbuktu, Kilwa, and Samarkand each turned from a stop on a road into a CITY the learned world traveled toward. So ask again — when trade pours wealth into one crossroads for generations, what NEW kind of place does it grow into? Weigh it again."',
          choices: [
            { label: 'I see — the wealth funds schools and draws scholars, so it becomes a city of learning, not just a fatter market. Let me answer again.', clearFlag: 'dTwU5JustRicherMisread', next: 'challenge' },
          ],
        },
        reteachImported: {
          text: '(Aïsha lifts a manuscript still wet with her own ink.) "I COPIED this one, here, this morning — Timbuktu does not only buy books, it makes them, teaches them, and argues over them. Our own jurists write commentaries; our own astronomers track the heavens; families build private libraries of thousands of volumes. Foreign learning arrives, yes — and then it takes root and grows new branches that we sell BACK out across the desert. A true hub does not just pass things through; it becomes a place where knowledge is produced and exchanged. So what does a rich trade city truly become? Try once more."',
          choices: [
            { label: 'Of course — it produces and exchanges learning of its own, a real center, not a waystation. Let me try again.', next: 'challenge' },
          ],
        },
      },
    },

    // =====================================================================
    // (b) CALICUT — RELIGION SPREAD ALONG TRADE ROUTES AS A SYSTEM.
    // Islam crossed the Indian Ocean on the merchant network — Muslim traders
    // settled port to port, intermarried, built mosques, and tied a shared
    // faith + law + Arabic into the trade web, forming one connected world
    // (the Dar al-Islam) a merchant or traveler could move through seamlessly.
    // =====================================================================
    {
      id: 'd-tw-u5-ks-faith-along-trade',
      npc: 'd-tw-u5-merchant-calicut',
      codexId: 'd-tw-u5-cx-faith-along-trade',
      house: 2,
      houseTitle: 'You see how a faith sailed the trade web',
      houseSub: 'A Karimi merchant marks the House of the Open Road as one that understands religion spread along the trade routes as a system.',
      flag: 'dTwU5FaithAlongTradeUnderstood',
      achievement: 'd-tw-u5-ach-faith-that-sailed',
      start: 'challenge',
      nodes: {
        challenge: {
          text: 'Ahmad walks you along the port quarter, past a mosque, a counting-house, and a crowd of merchants from a dozen coasts. "Here is a puzzle for a trader," he says. "No caliph\'s army ever conquered Calicut, or Kilwa, or the spice ports of the islands — yet in all of them you will find mosques, Arabic contracts, and Muslim merchants at home. The faith reached these harbors before any soldier did. So tell me: HOW does a religion like Islam come to be at home in port after port across an ocean no one conquered?"',
          choices: [
            {
              kind: 'say',
              // ★ RIGHT — religion spread along the trade routes as a system: merchants
              // settle, intermarry, build mosques; shared faith/law/Arabic ties the web.
              label: 'It spread along the trade routes themselves, carried by the merchants. Muslim traders settled in port after port, married into local families, built mosques, and brought their law and the Arabic language with them — so a shared faith spread peacefully through the network of commerce and tied all those harbors into one connected world a believer could travel and trade across.',
              right: true,
              next: 'won',
            },
            {
              kind: 'say',
              // ✗ WRONG (the conquest misread) — faith only spreads by armies.
              label: 'A faith can only spread by conquest — some Muslim army must have taken these ports by the sword, even if you have not heard of the war. Religion never travels except behind soldiers.',
              setFlag: 'dTwU5ConquestMisread',
              next: 'reteachConquest',
            },
            {
              kind: 'say',
              // ✗ WRONG (the "coincidence / no system" misread) — separate accidents, not a network.
              label: 'It is just coincidence — each port happened to convert on its own, with no connection to the others. The mosques here have nothing to do with the mosques in Kilwa or Aden; there is no system to it at all.',
              next: 'reteachCoincidence',
            },
          ],
        },

        won: {
          onEnter: 'reward',
          text: '(Ahmad spreads his hands toward the busy quay, satisfied.) "You have it. No sword opened these doors — commerce did. A Muslim merchant lands, trades honestly under a law everyone trusts, takes a local wife, raises children in the faith, and helps raise a mosque. The next ship finds a community already waiting. Do that in every harbor for centuries and the whole rim of the ocean shares one faith, one merchant-law, and Arabic as the common tongue of trade — the Dar al-Islam, the world Ibn Battuta could journey across for years and never feel a true stranger. The religion rode the trade, and the religion knit the trade into a single web." He smiles. "Sail under that web anytime, friend — your house understands it now."',
          choices: [
            { label: 'Then I\'ll see the faith and the trade as one web, not two.', next: '@close' },
          ],
        },

        reteachConquest: {
          text: '(Ahmad laughs softly and points to the local rulers\' banners over the harbor.) "Look — Calicut is ruled by its own Hindu Zamorin, not by any sultan, and still it is full of mosques and Muslim merchants who are welcome here. There was no war. A ruler protects the traders because the traders make him rich; the traders settle and the faith settles with them. Conquest is ONE way a religion travels — but across this ocean it was TRADE that carried Islam, port by peaceful port. So how does a faith reach a harbor no army ever stormed? Weigh it again."',
          choices: [
            { label: 'I see — the merchants carried it peacefully into ports no army took. Let me answer again.', clearFlag: 'dTwU5ConquestMisread', next: 'challenge' },
          ],
        },
        reteachCoincidence: {
          text: '(Ahmad shakes his head and taps a stack of contracts written in Arabic.) "Coincidence? I carry one law and one language from Aden to Calicut to Kilwa, and in every port I find fellow believers who honor the same contracts and lend me lodging. That is not a hundred accidents — it is one NETWORK. The same merchant families, the same faith, the same Arabic letters reach along every route, because each settled community plants the next. It is a system, knit together by trade. So how does a religion come to be at home all along a trade web? Try once more."',
          choices: [
            { label: 'Of course — it is one connected network the merchants built, port linking to port. Let me try again.', next: 'challenge' },
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
      id: 'd-tw-u5-cx-city-of-learning',
      group: 'Unit 5 — Expanding Zones of Exchange',
      title: 'Trade cities became cosmopolitan hubs of learning',
      idea: 'Wealth from long-distance trade let crossroads cities build schools, libraries, and book trades and draw scholars from far away, so a market hub like Timbuktu (with its Sankore mosque-university), Kilwa on the Swahili coast, or Samarkand on the Silk Road became a cosmopolitan center where peoples, faiths, and learning were exchanged, not just goods.',
      source: 'Aïsha, copyist and bookseller of Sankore in Timbuktu (on the manuscript trade and the scholars Sankore drew)',
    },
    {
      id: 'd-tw-u5-cx-faith-along-trade',
      group: 'Unit 5 — Expanding Zones of Exchange',
      title: 'Religion spread along trade routes as a system',
      idea: 'Religion spread along the trade networks themselves: Muslim merchants crossing the Indian Ocean settled in port after port, intermarried, built mosques, and carried a shared faith, law, and the Arabic language, so Islam spread peacefully through commerce and tied the harbors from East Africa to Asia into one connected world (the Dar al-Islam) a believer could travel and trade across.',
      source: 'Ahmad ibn Yusuf, Karimi merchant of Calicut (on the merchant-borne spread of Islam across the Indian Ocean)',
    },
  ],

  // ---- Achievements: optional milestones ----
  achievements: [
    {
      id: 'd-tw-u5-ach-city-of-books',
      title: 'The City the Gold Built',
      desc: 'You understood that a rich trade crossroads becomes a cosmopolitan hub of learning — Timbuktu\'s Sankore, Kilwa, and Samarkand — not merely a bigger market.',
    },
    {
      id: 'd-tw-u5-ach-faith-that-sailed',
      title: 'A Faith That Sailed',
      desc: 'You understood how religion spread along trade routes as a system — Islam carried port to port by merchants across an ocean no army conquered.',
    },
  ],
};

export default pack;
