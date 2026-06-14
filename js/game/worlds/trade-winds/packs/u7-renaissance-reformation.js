// u7-renaissance-reformation.js — ADDITIVE STORY-PACK (Global History 9, Unit 7).
//
// Pure DATA module — no imports, no engine calls — so it can never crash the world
// on its own. The defensive loader in ../game.js wires everything below into the
// live game (adds the NPCs at Florence, fires the cutscene once, makes each keystone
// reachable, records the Codex entries, lifts House Standing, unlocks achievements).
// See CONTRACT.md for the authoritative field-by-field spec; this file COPIES the
// structure of the gold-standard sample, unit3-belief-systems.js.
//
// THIS PACK teaches two real Unit 7 keystones, both set in Florence (era 4, the
// First Global Age, 1450-1600), COMPLEMENTING the existing Lorenzo de' Medici quest:
//
//   (a) THE RENAISSANCE WAS FUNDED BY TRADE & BANKING WEALTH. Humanism, the new
//       art, the recovered ancients — all of it rode on merchant money. The Medici
//       were bankers first (the gold florin, branches from London to Rome); their
//       profits PAID for Botticelli, for manuscript-hunting, for the workshops.
//       No ledgers, no rebirth. (Wrong reads: "kings/popes alone made it" or
//       "it was a pure burst of genius with no money behind it.")
//
//   (b) THE PRINTING PRESS BROKE THE CHURCH'S MONOPOLY ON INFORMATION. Gutenberg's
//       movable type (c. 1450) made books cheap; when a monk named Martin Luther
//       nailed up his 95 theses in 1517, presses copied and spread them across the
//       German lands in WEEKS — faster than Rome could answer. Technology, not just
//       theology, is why the Reformation could not be contained. (Wrong read: "the
//       press just made prettier/neater books" — it missed that cheap copies broke
//       the Church's control of WHO could read and spread ideas.)
//
// Honest pedagogy: the teaching voices are FICTIONAL Florentine denizens (a Medici-
// bank ledger-keeper and a bookshop printer) so nothing is mis-attributed. Real
// figures — the Medici, Botticelli, Michelangelo, Gutenberg, Luther — are described
// in PARAPHRASE grounded in the historical record, never with invented verbatim
// quotes. De-identified: the only real person ever named is "Mr. Maccarello".

export const pack = {
  // ---- identity ----
  id: 'u7-renaissance-reformation',
  unit: 'Unit 7 — Renaissance & Reformation',   // Codex group + author-facing label
  title: 'The Rebirth Was Bought, and the Press Set It Free',

  // ---- extra characters added to the world ----
  // Two FICTIONAL Florentine denizens placed at the EXISTING city of Florence
  // (era 4). Each carries one keystone and serves as its mentor on a wrong answer.
  // Florence's occupied offsets: Lorenzo [6,-4], Lord Vasht [-6,6], Maestro
  // Bernardo [-8,5]. These two avoid all of them.
  npcs: [
    {
      id: 'u7-ledger-keeper',
      name: 'Donata',
      title: 'Ledger-Keeper of the Medici Bank',
      city: 'florence',                  // existing CITIES id (era 4)
      era: 4,                            // hidden until the world reaches Era IV
      offset: [10, 6],                   // clear of Lorenzo/Vasht/Bernardo
      hatKind: 'none',
      palette: { robe: 0x7a2f3a, trim: 0x4a1c24, skin: 0xd9a066 },
      keystoneId: 'ks-u7-medici-money',
      introText: 'You have the look of someone who reads a ledger before a fresco — good. I keep the books for the bank, and the books are the truest history of this city. Everyone gawks at the new painting on the chapel wall; almost no one asks who PAID the painter, or where that gold came from. Stay a moment. There is a thing about this rebirth — this rinascita — that a merchant understands faster than any prince.',
      afterText: 'You see it the way I do now: every angel on that wall has a wool-bale and a bill of exchange behind it. The rebirth did not fall from heaven — it was earned, florin by florin, on the trade routes, and then SPENT on beauty. Carry that with you. Glory has an account-book.',
    },
    {
      id: 'u7-printer-shop',
      name: 'Niccolosa',
      title: 'Bookshop Printer off the Mercato',
      city: 'florence',                  // existing CITIES id (era 4)
      era: 4,                            // hidden until Era IV
      offset: [8, 9],                    // clear of all existing Florence NPCs
      hatKind: 'cap',
      palette: { robe: 0x33506e, trim: 0x1f3145, skin: 0xa9672f, hat: 0x1f3145 },
      keystoneId: 'ks-u7-printing-reformation',
      introText: 'Mind the wet sheets, friend — they bite. I run a press; the German trick of movable type came south within a lifetime and changed my whole trade. People praise my crisp letters and even pages, and they are not wrong. But there is a far bigger thing the press did, and a tale out of the German lands proves it. Pull up a stool when you have weighed the first matter; this one is worth your time.',
      afterText: 'Now you have it. The press did not only make books HANDSOMER — it made them CHEAP, and cheap means many, and many means an idea is loose before the powerful can call it back. A monk in Wittenberg learned that better than the Pope did. Ideas travel cheaper than pepper now, and that has broken something that stood a thousand years.',
    },
  ],

  // ---- named story-beat sequences (playCutscene format) ----
  cutscenes: {
    // Fires the first time the player reaches Florence in Era IV — frames BOTH
    // unit questions before the player meets either teacher.
    U7_INTRO: [
      {
        tint: 'amber', kicker: 'Florence — the Banking Republic',
        art: 'notice',
        text: 'The Arno glints with gold light and gold business. The Duomo\'s great dome stands finished overhead; a new David will soon rise; agents of the Medici bank move through the square with bills of exchange that turn florins in London into florins in Rome without a single coin crossing the Alps. Men have started calling this age a rinascita — a rebirth of the ancient world. The whole city seems lit from within.',
      },
      {
        tint: 'stone', kicker: 'Two questions for a trader',
        art: 'portrait',
        palette: { robe: 0x7a2f3a, trim: 0x4a1c24, skin: 0xd9a066 },
        text: 'Two Florentines will test how well you read this golden age. A bank ledger-keeper named Donata wants to know where all this BEAUTY came from — who paid for it, and why a merchant should care. And a bookshop printer named Niccolosa will ask what her clattering new press REALLY changed — for she has heard a rumor out of the German lands that a single monk\'s pamphlets are outrunning the Church itself. Find both answers and you will understand this century from the inside.',
        cta: 'Find the two Florentines',
      },
    ],
  },

  // ---- triggers: when each cutscene fires (once) ----
  triggers: [
    {
      on: 'visit', value: 'florence', play: 'U7_INTRO',
      reward: { house: 1, title: 'Florence sets you two riddles', sub: 'Where did the rebirth\'s gold come from — and what did the press truly break?' },
    },
  ],

  // ---- THE CORE: keystones ----
  keystones: [
    // ========================================================================
    // KEYSTONE A — THE RENAISSANCE WAS FUNDED BY TRADE & BANKING WEALTH
    // ========================================================================
    {
      id: 'ks-u7-medici-money',
      npc: 'u7-ledger-keeper',
      codexId: 'cx-u7-medici-money',
      house: 2,
      houseTitle: 'You read the gold behind the glory',
      houseSub: 'A Medici ledger-keeper marks the House of the Open Road as one that knows beauty is bought.',
      flag: 'u7MediciMoneyUnderstood',
      achievement: 'ach-u7-no-ledgers-no-botticelli',
      start: 'challenge',
      nodes: {
        challenge: {
          text: 'Donata taps a heavy ledger with one inked finger. "Look around you, trader. Painters, sculptors, men paid only to recover dusty Greek and Roman books — a whole rebirth of the ancient world, here in a republic of merchants. Now I keep the bank\'s books, so I ask the merchant\'s question: WHERE does all this beauty come from? Not who painted it — who PAID for it, and how was that fortune made in the first place? Weigh it carefully."',
          choices: [
            {
              kind: 'say',
              // ★ RIGHT — humanism and the new art ride on merchant & banking wealth.
              label: 'It rides on trade and banking. Florence got rich finishing wool and lending money — the Medici bank runs branches from London to Rome, and the florin is good in every port. That merchant fortune is what pays the painters, hunts the manuscripts, and funds the workshops. No ledgers, no Botticelli — the rebirth is bought with trade money, then spent on beauty.',
              right: true,
              next: 'won',
            },
            {
              kind: 'say',
              // ✗ WRONG (the throne/altar misread) — kings and popes alone made it.
              label: 'A king or a pope simply willed it into being. Great rulers and the Church command art whenever they please — the wealth of merchants has nothing to do with it.',
              setFlag: 'u7CrownMisread',
              next: 'reteachCrown',
            },
            {
              kind: 'say',
              // ✗ WRONG (the pure-genius misread) — it was talent with no money behind it.
              label: 'It is simply a burst of genius — brilliant men were born all at once. Money has nothing to do with it; great art needs only great talent.',
              next: 'reteachGenius',
            },
          ],
        },

        // ---- RIGHT PATH: the world changes ----
        won: {
          onEnter: 'reward',
          text: '(Donata closes the ledger with a satisfied snap.) "There it is — said like a banker, not a poet. Florence had no gold mines and no great army. What it had were looms, ships, and a bank trusted in cities that had never seen Tuscany. The Medici lent to popes and kings, and turned the profit into painters, libraries, and stonemasons — partly for God, partly for glory, partly to make Florence remembered. A boy named Michelangelo eats at their table; the ancients sit on their shelves to teach him. They will call this a golden age and forget it was earned one cargo, one loan, one bill of exchange at a time. You did not forget. Mr. Maccarello would say you read the source behind the source." She inclines her head. "The bank knows your house now."',
          choices: [
            { label: 'Then I\'ll remember the gold behind the glory.', next: '@close' },
          ],
        },

        // ---- WRONG PATHS: consequence + re-teach + LOOP back ----
        reteachCrown: {
          text: '(Donata does not scold; she only turns a page.) "Thrones and altars DO commission art — true, and the popes are great patrons. But ask the merchant\'s question: where does a pope\'s gold come from? A great share of it flows THROUGH banks like ours — the Medici were the papacy\'s own bankers. And Florence is no kingdom; it is a republic run by guilds and merchant houses. The men who paid Botticelli sold wool and lent silver. The crown and the altar do not stand ABOVE the money — they stand on top of it. Now ask again: what is the engine under all this beauty?" She waits. "Weigh it once more."',
          choices: [
            { label: 'I see — even popes and princes spend money that trade and banking made. Let me answer again.', clearFlag: 'u7CrownMisread', next: 'challenge' },
          ],
        },
        reteachGenius: {
          text: '(Donata almost smiles.) "Talent there is, in heaps — I have met some of it, and it is insufferable. But genius has always been born; it does not always get PAID. A painter must eat while he paints; a scholar must be kept while he hunts for a lost Greek manuscript; a sculptor needs marble, a workshop, apprentices, years. Who buys all that? Patrons made rich by trade and banking. Other cities had clever sons too — Florence had clever sons AND the deepest purse in Christendom. Think about what turns raw talent into a David that actually gets carved. Try once more."',
          choices: [
            { label: 'Of course — it took both the talent and the trade money to keep it fed. Let me try again.', next: 'challenge' },
          ],
        },
      },
    },

    // ========================================================================
    // KEYSTONE B — THE PRINTING PRESS BROKE THE CHURCH'S INFORMATION MONOPOLY
    // ========================================================================
    {
      id: 'ks-u7-printing-reformation',
      npc: 'u7-printer-shop',
      codexId: 'cx-u7-printing-reformation',
      house: 2,
      houseTitle: 'You saw what the press really broke',
      houseSub: 'A Florentine printer marks the House of the Open Road as one that knows cheap books are dangerous.',
      flag: 'u7PrintingUnderstood',
      achievement: 'ach-u7-ideas-cheaper-than-pepper',
      start: 'challenge',
      nodes: {
        challenge: {
          text: 'Niccolosa pulls a fresh sheet from the press, ink still gleaming. "Movable type — a German goldsmith\'s trick, not yet a lifetime old, and already a scribe\'s YEAR of copying comes off my frame in a week. A book that once cost a farm will soon cost a week\'s wage. Now: word has reached me from the German lands. A monk named Martin Luther nailed up a list of complaints against the Church in 1517, and within weeks copies were in every town from Wittenberg to the Rhine — faster than Rome could write a reply. Tell me, trader who weighs things: what did my press REALLY change?"',
          choices: [
            {
              kind: 'say',
              // ★ RIGHT — cheap books broke the Church's monopoly on information.
              label: 'It broke the Church\'s grip on information. When every book was copied slowly by hand, the Church and its scribes controlled what got written and who could read it. Cheap printing means many copies, fast — so Luther\'s ideas spread across the German lands in weeks, faster than Rome could answer or recall them. The press let the Reformation outrun the Church; that is why an idea could no longer be quietly buried.',
              right: true,
              next: 'won',
            },
            {
              kind: 'say',
              // ✗ WRONG (the cosmetic misread the prompt names) — "just prettier books."
              label: 'It just made books prettier and neater. Crisp even letters, tidy pages — handsome copies of the very same works the monasteries already had. A finer object, nothing more.',
              setFlag: 'u7PrettyMisread',
              next: 'reteachPretty',
            },
            {
              kind: 'say',
              // ✗ WRONG (the theology-only misread) — it was purely about Luther's beliefs.
              label: 'It changed nothing — it was all about Luther\'s arguments alone. People simply agreed with his theology; the machine that printed it had no part in why his ideas won.',
              next: 'reteachTheology',
            },
          ],
        },

        // ---- RIGHT PATH: the world changes ----
        won: {
          onEnter: 'reward',
          text: '(Niccolosa wipes her hands and grins like she has caught a fellow conspirator.) "Yes — and few in this square see it. For a thousand years, knowing things was the Church\'s business: monks copied the books, priests read them aloud, and Rome decided what the rest of us were allowed to hear. Then a goldsmith\'s press made copies CHEAP, and cheap is the dangerous word. Luther\'s complaints did not crawl from town to town by horse and rumor — they FLEW, in print, by the thousand, before Rome could gather a reply. You cannot un-ring a bell that has rung in a hundred towns at once. The technology did not write his theology — but it is why the Church could not contain it. Mr. Maccarello would call that a turning point you can hold in your hand." She taps the wet sheet. "My press is honored to know your house."',
          choices: [
            { label: 'Then I\'ll carry that — cheap copies changed the world.', next: '@close' },
          ],
        },

        // ---- WRONG PATHS: consequence + re-teach + LOOP back ----
        reteachPretty: {
          text: '(Niccolosa laughs, not unkindly, and holds up two pages.) "Prettier? A little — but look past the letters. A monastery could make ONE beautiful book in a year, locked in its library, read by a handful. My press makes a thousand plain ones in that same year, scattered to a thousand hands in a hundred towns. The change is not how a book LOOKS — it is how MANY there are, how CHEAP, and therefore how FAST an idea can travel before anyone in power can stop it. Ask yourself: when copies are suddenly many and cheap, who LOSES the power they used to have over what people read? Weigh it again."',
          choices: [
            { label: 'I see — it is the cheapness and the numbers, not the beauty, that matters. Let me answer again.', clearFlag: 'u7PrettyMisread', next: 'challenge' },
          ],
        },
        reteachTheology: {
          text: '(Niccolosa shakes her head slowly.) "His arguments mattered, of course — men had complained of the Church before. But others had complained for centuries, and Rome simply silenced them, one voice at a time, because ideas spread slow enough to catch. What was DIFFERENT in 1517 was the machine. Luther\'s words were in print, copied and re-copied across the German lands in weeks, in a tongue ordinary people read — too many copies, too fast, to call back. Same complaint, new technology, and now it could not be contained. Think about the press as part of the WHY, not just the page it sat on. Try once more."',
          choices: [
            { label: 'Of course — the press is part of why the ideas could not be stopped. Let me try again.', next: 'challenge' },
          ],
        },
      },
    },
  ],

  // ---- Codex: the real ideas this pack teaches ----
  codex: [
    {
      id: 'cx-u7-medici-money',
      group: 'Unit 7 — Renaissance & Reformation',
      title: 'Why the Renaissance happened where the money was',
      idea: 'The Renaissance — its humanism, art, and recovery of the ancients — was funded by trade and banking wealth: Florence grew rich on wool and finance, and merchant-bankers like the Medici spent those profits on painters, scholars, and manuscripts, so the rebirth rode on merchant money rather than springing from genius or rulers alone.',
      source: 'Donata, ledger-keeper of the Medici Bank (on Florentine banking and patronage)',
    },
    {
      id: 'cx-u7-printing-reformation',
      group: 'Unit 7 — Renaissance & Reformation',
      title: 'Why the printing press made the Reformation unstoppable',
      idea: 'The printing press (Gutenberg, c. 1450) made books cheap and plentiful, which broke the Church\'s long monopoly on copying and controlling information; when Luther posted his 95 theses in 1517, printed copies spread across the German lands in weeks — faster than Rome could answer — so technology, not theology alone, is why the Reformation could not be contained.',
      source: 'Niccolosa, bookshop printer of Florence (on Gutenberg\'s press and Luther\'s pamphlets)',
    },
  ],

  // ---- Achievements: optional milestones ----
  achievements: [
    {
      id: 'ach-u7-no-ledgers-no-botticelli',
      title: 'No ledgers, no Botticelli',
      desc: 'You understood that the Renaissance was bought with trade and banking wealth — merchant fortunes, spent on beauty.',
    },
    {
      id: 'ach-u7-ideas-cheaper-than-pepper',
      title: 'Ideas travel cheaper than pepper',
      desc: 'You understood that cheap printed books broke the Church\'s monopoly on information and let the Reformation outrun Rome.',
    },
  ],
};

export default pack;
