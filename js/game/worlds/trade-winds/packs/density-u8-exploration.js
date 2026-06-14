// density-u8-exploration.js — DENSITY STORY PACK: Unit 8, Age of Exploration (more).
//
// This is the SECOND, denser pack for Unit 8. The shipped pack (u8-exploration.js)
// already teaches three keystones — (1) WHY Europeans sailed (cut out the
// middlemen), (2) the Columbian Exchange, and (3) the human cost of the Atlantic
// system. This pack does NOT repeat any of those. It deepens the unit toward full
// curriculum coverage with FOUR NEW keystones the first pack leaves untouched:
//
//   (a) THE TECHNOLOGY + STATE BACKING that made oceanic voyages possible — the
//       caravel (lateen + square rig that could beat back upwind), the magnetic
//       compass and astrolabe, and the new MONEY behind it all: crown patronage,
//       the joint-stock company that pooled investor capital and SPREAD the risk,
//       and the mercantilist doctrine that pushed states to bankroll exploration.
//   (b) WHY SMALL EUROPEAN FORCES TOPPLED LARGE EMPIRES (Aztec, Inca) — handled
//       soberly: the decisive factor was epidemic DISEASE (smallpox) shattering
//       populations and leadership, plus INDIGENOUS ALLIANCES (subject peoples who
//       joined to throw off their overlords) and STEEL/horses/firearms — never a
//       myth of European supremacy, and centering the human catastrophe.
//   (c) THE RISE OF A TRULY GLOBAL ECONOMY — for the first time all the inhabited
//       continents were tied into ONE trade web, with American (Potosí) silver as
//       the money that flowed to Ming China and turned the world's commerce into a
//       single circuit (the Manila galleon, the price revolution, global markets).
//   (d) WHY ASIA STILL SET THE TERMS at first — at Calicut and across maritime
//       Asia, European newcomers were minor players who had to BUY their way in
//       with American silver because they made nothing Asian markets wanted; the
//       "Age of Exploration" did not begin as European dominance over Asia.
//
// Pure DATA module — no imports, no engine calls — so it can never crash the world.
// The loader in ../game.js wires it in (adds NPCs at Calicut & Florence, fires the
// cutscene once, makes each keystone reachable, records the Codex entries, lifts
// House Standing, unlocks achievements). See CONTRACT.md for the field spec; this
// COPIES the shape of the gold-standard unit3-belief-systems.js.
//
// Honest pedagogy: every place, date, and idea is real Global-History-9, Unit 8
// content. Teaching voices are fictional in-world denizens of Calicut and Florence
// so nothing is mis-attributed; real figures (da Gama, Columbus, Cortés, Pizarro,
// Magellan, the Medici) are referred to in paraphrase grounded in the record, never
// given invented verbatim quotes. The conquest keystone is handled with sober care
// and dignity. De-identified throughout. ALL ids are namespaced with the prefix
// "d-tw-u8-" so nothing collides with the core world or any other pack.

export const pack = {
  // ---- identity ----
  id: 'd-tw-u8-exploration-density',
  unit: 'Unit 8 — Age of Exploration',        // Codex group (buckets with the first pack)
  title: 'The First Global Age — Ships, Silver, and the Joining of the World',

  // ---- extra characters added to the world ----
  // Two teaching denizens at Calicut (era 4) and two at Florence (era 4). Each
  // carries one keystone. Offsets are chosen to avoid EVERY existing NPC:
  //   Calicut core: Zheng He [-7,4], Kunjali [8,-5];
  //   Calicut shipped u8 pack: spice-broker [6,6], ship-surgeon [-4,8], ledger [9,2].
  //   Florence core: Lorenzo [6,-4], Vell trio [-7,6]/[6,6]/[-6,6], Bernardo [-8,5];
  //   Florence u7 pack: [10,6], [8,9].
  npcs: [
    {
      id: 'd-tw-u8-shipwright',
      name: 'Estêvão the Shipwright',
      title: 'Caravel-Builder of the Calicut Careenage',
      city: 'calicut',
      era: 4,
      offset: [-10, -2],                      // far west, clear of all Calicut NPCs
      hatKind: 'cap',
      palette: { robe: 0x6b4a2a, trim: 0x42301c, skin: 0xc98a5b, hat: 0x42301c },
      keystoneId: 'd-tw-u8-ks-ship-and-stars',
      introText: 'Mind the pitch, trader — I am scraping a hull. I built caravels on the Tagus before I followed the new sea-road out here to Calicut. Folk look at a ship like da Gama\'s and think it is just a bigger boat. It is not. There is a reason the old galleys never rounded Africa and this little vessel did. Sit on this keel-block a moment — there is a thing about HOW these voyages became possible at all that a merchant ought to know before he ships a cargo round the world.',
      afterText: 'Now you see it: it was not courage alone that opened the oceans, it was rigging and instruments — a caravel that could claw back upwind, a compass and astrolabe to find your way out of sight of land. Tools made the impossible voyage merely difficult. Sail with that knowledge, friend.',
    },
    {
      id: 'd-tw-u8-factor',
      name: 'Branca the Factor',
      title: 'Company Factor of the Calicut Trade-House',
      city: 'calicut',
      era: 4,
      offset: [10, 8],                        // far north-east corner, clear of all
      hatKind: 'none',
      palette: { robe: 0x355e7a, trim: 0x1d3a4e, skin: 0xd9a066 },
      keystoneId: 'd-tw-u8-ks-global-economy',
      introText: 'I am a factor — I keep a company\'s warehouse here at the far end of the world and answer to investors I will never meet in a city I have never seen. Look at this quay, trader: pepper for Lisbon, porcelain for Mexico, and Spanish silver, dug in the Andes, that pays for all of it before it sails on to China. Twenty years ago these were separate worlds. Now they are one market with one bloodstream. Ask me about it — about how the whole earth became a single ledger, and who at first still held the upper hand.',
      afterText: 'You have it: for the first time every inhabited continent was strung onto one trade web, and American silver was the thread. The world did not just trade more — it became, for the first time, a single connected economy. And at the start, it was Asia\'s markets that set the price; Europe had to BUY its seat with that silver. Carry that whole picture, friend.',
    },
    {
      id: 'd-tw-u8-banker',
      name: 'Donato the Banker',
      title: 'Florentine Banker of the Exploration Houses',
      city: 'florence',
      era: 4,
      offset: [-10, -3],                      // far south-west, clear of Florence NPCs
      hatKind: 'cap',
      palette: { robe: 0x4a2c5e, trim: 0x2c1838, skin: 0xd9b07c, hat: 0x2c1838 },
      keystoneId: 'd-tw-u8-ks-state-and-capital',
      introText: 'You stand in Florence, trader — the city that lends Europe its money and taught it to keep its books. I bank the men who bank the voyages. Everyone praises the captains, but a captain cannot buy a fleet, victual a crew, or survive a wreck that swallows a year\'s cargo. Someone has to PAY for the ocean, and someone has to be able to lose a ship without losing everything. Ask me how that puzzle got solved — it is the quiet engine under every sail of this age.',
      afterText: 'Now you understand the engine no painting shows: crowns chasing bullion and trade by the new mercantile thinking, and the joint-stock company that let many investors pool money and SHARE the risk of a voyage. The money and the state made the voyages possible as surely as the caravel did. Bank wisely, friend.',
    },
    {
      id: 'd-tw-u8-chronicler',
      name: 'Mencia the Chronicler',
      title: 'Chronicler of the American Conquests',
      city: 'florence',
      era: 4,
      offset: [2, -9],                        // far south edge, clear of all Florence NPCs
      hatKind: 'hood',
      palette: { robe: 0x5e3a3a, trim: 0x381f1f, skin: 0xc98a5b, hat: 0x381f1f },
      keystoneId: 'd-tw-u8-ks-fall-of-empires',
      introText: 'I gather the accounts that come back across the ocean and try to write them down truthfully, which is harder than it sounds. The reports say a few hundred Spaniards under Cortés and then Pizarro brought down the Aztec and the Inca — empires of millions. People tell it like a fable of brave little Europe. The truth is graver and far more honest than that, and it matters that we tell it right. Sit with me, trader. I will not let it become a legend of conquest. I will tell you what really felled those empires.',
      afterText: 'You did not take the fable. You see what truly toppled those empires: smallpox tearing through peoples with no immunity, subject nations who allied with the newcomers to throw off their overlords, and steel and horses on top of a society already collapsing. Not European greatness — catastrophe, alliance, and accident. Remember the millions, and tell it true.',
    },
  ],

  // ---- named story-beat sequences (playCutscene format) ----
  // tint ∈ amber|dusk|cold|stone; art ∈ candle|ledger|notice|portrait|null.
  cutscenes: {
    // Fires the first time the player reaches Florence in Era IV — frames the
    // deeper unit question ("HOW did a few small ships rewrite the whole world?")
    // and points the player toward the four new teaching denizens.
    D_TW_U8_INTRO: [
      {
        tint: 'stone', kicker: 'Florence — the Counting-House of Europe', art: 'ledger',
        text: 'In the banking halls of Florence the talk is not of pepper but of money — whose ships, whose silver, whose ledger. The captains who rounded Africa and crossed the western ocean are famous now, but here they speak of a stranger marvel: that a handful of small vessels, and the money behind them, has begun to lace every continent on earth into a single web of trade, and to topple empires of millions across the sea.',
      },
      {
        tint: 'amber', kicker: 'A deeper riddle', art: 'portrait',
        palette: { robe: 0x4a2c5e, trim: 0x2c1838, skin: 0xd9b07c, hat: 0x2c1838 },
        text: 'A banker watches you study the ledgers. "Everyone asks WHY the ships sailed," he says, "and that is half the story. The harder question is HOW — how did such small vessels reach the ends of the earth at all, how were they paid for, how did a few hundred men bring down great empires, and how did the whole world suddenly become one market? Four people — two here in Florence, two out at Calicut — each hold a piece of the answer. Find them, and you will understand the machinery of the First Global Age, not just its motive." His name is Donato. Go and ask.',
        cta: 'Walk the Florence banking halls',
      },
    ],
  },

  // ---- triggers: when each cutscene fires (once) ----
  triggers: [
    {
      on: 'visit', value: 'florence', play: 'D_TW_U8_INTRO',
      reward: { house: 1, title: 'The machinery behind the age', sub: 'Florence sets you the harder riddle: not why the ships sailed, but HOW the world was rewired — ships, silver, conquest, and a single global market.' },
    },
  ],

  // ---- THE CORE: keystones ----
  keystones: [
    // ============ KEYSTONE A — THE SHIP AND THE STARS (TECHNOLOGY) ============
    {
      id: 'd-tw-u8-ks-ship-and-stars',
      npc: 'd-tw-u8-shipwright',
      codexId: 'd-tw-u8-cx-maritime-tech',
      house: 2,
      houseTitle: 'You read the technology behind the voyages',
      houseSub: 'The Calicut shipwrights mark the House of the Open Road as one that understands how rigging and instruments made the impossible ocean merely difficult.',
      flag: 'dTwU8TechUnderstood',
      achievement: 'd-tw-u8-ach-rigging-and-reckoning',
      start: 'challenge',
      nodes: {
        challenge: {
          text: 'Estêvão runs his hand along the curved hull. "For a thousand years ships hugged the coast, because a square-rigged vessel can only run with the wind at its back — sail too far out and you cannot beat your way home. So tell me, trader: the Portuguese rounded Africa and the Spanish crossed the open ocean in vessels SMALLER than the galleys that never dared it. The wind did not change. What CHANGED so that these little ships could go where the great ones could not?"',
          choices: [
            {
              kind: 'say',
              // ★ RIGHT — caravel (lateen+square rig, can sail into the wind) + compass/astrolabe navigation.
              label: 'The tools changed, not the courage. The caravel carried both square sails for speed AND triangular lateen sails, so for the first time a ship could tack and claw its way back UPWIND instead of only running before it — that is what let crews sail far from any coast and still get home. And the magnetic compass and the astrolabe let them hold a heading and reckon their latitude out of sight of land. Better rigging and better instruments turned an impossible voyage into a merely dangerous one.',
              right: true,
              next: 'won',
            },
            {
              kind: 'say',
              // ✗ WRONG — "they were just braver / had better sailors."
              label: 'The men changed — these were simply braver, harder sailors than the ones before them, willing to risk the open sea where the old crews lost their nerve.',
              setFlag: 'dTwU8BraveryMisread',
              next: 'reteachBravery',
            },
            {
              kind: 'say',
              // ✗ WRONG — "the ships were just bigger / cannon won the sea."
              label: 'The ships got bigger and stronger — Europe simply built huge gun-decked vessels that could muscle through any sea where the smaller old boats failed.',
              next: 'reteachBigger',
            },
          ],
        },

        won: {
          onEnter: 'reward',
          text: '(Estêvão slaps the keel, pleased.) "There it is — you looked at the RIGGING, not the romance. The caravel\'s lateen sails let it beat to windward; that one trick is the whole difference between hugging a coast and crossing an ocean. Add a compass to hold your course and an astrolabe to read the sun, and a captain can leave the sight of land for weeks and still find his way to Calicut or to a new continent. The Portuguese pioneered it down the African coast voyage by voyage, and Spain carried it across the western sea. Small ships, big science. That is HOW the oceans opened." He grins through the pitch on his hands. "Your house ships wiser for knowing what carried the cargo."',
          choices: [
            { label: 'Then I\'ll respect the rigging as much as the captain.', next: '@close' },
          ],
        },

        reteachBravery: {
          text: '(Estêvão laughs, not unkindly.) "Brave men drowned by the thousand in the centuries before, friend — courage was never in short supply. What they LACKED was a ship that could sail home against the wind. Bravery cannot tack to windward; a lateen sail can. Stop looking at the sailors\' hearts and look at their HULLS and their instruments. What was new in the ship and in the navigation that let it leave the coast behind? Weigh it again."',
          choices: [
            { label: 'I see — it is the ship and the instruments, not the nerve. Let me answer again.', clearFlag: 'dTwU8BraveryMisread', next: 'challenge' },
          ],
        },
        reteachBigger: {
          text: '(Estêvão shakes his head and pats the small hull.) "Bigger? This caravel is SMALLER than the galleys that never dared the deep ocean. Size was never the problem and cannon never crossed an ocean — guns came later, for fighting, not for finding the way. The problem was always the WIND and knowing WHERE you are. Think about what lets a small ship sail toward the wind and find its position far from any shore. Try once more."',
          choices: [
            { label: 'Of course — it is sailing into the wind and finding your way, not sheer size. Let me try again.', next: 'challenge' },
          ],
        },
      },
    },

    // ============ KEYSTONE B — STATE BACKING & CAPITAL ============
    {
      id: 'd-tw-u8-ks-state-and-capital',
      npc: 'd-tw-u8-banker',
      codexId: 'd-tw-u8-cx-state-and-capital',
      house: 2,
      houseTitle: 'You read the money and the state behind the sails',
      houseSub: 'The Florentine bankers mark your house as one that understands the crown patronage, mercantilism, and joint-stock capital that paid for the ocean.',
      flag: 'dTwU8CapitalUnderstood',
      achievement: 'd-tw-u8-ach-pay-for-the-ocean',
      start: 'challenge',
      nodes: {
        challenge: {
          text: 'Donato lays three coins on the ledger. "A voyage round the world costs a fortune, takes years, and may sink with everything aboard — no single merchant can risk that and survive a single loss. Yet the voyages kept coming, fleet after fleet. So tell me, trader who weighs things: HOW were these ruinous, risky voyages actually paid for, and what kept one shipwreck from ruining the men who funded it?"',
          choices: [
            {
              kind: 'say',
              // ★ RIGHT — crown patronage + mercantilism + joint-stock companies pooling capital and spreading risk.
              label: 'They were paid for by states and pooled money, not by lone heroes. Kings and queens bankrolled voyages because the new mercantilist thinking told them national wealth meant gold, silver, and trade controlled by the crown — so finding sea-roads to riches was state business. And merchants invented the joint-stock company: many investors each bought a SHARE of a voyage, pooling enough capital to outfit a fleet and SPREADING the risk so that if one ship sank, no single backer was ruined. Crown patronage and shared-risk capital are what made years-long voyages survivable.',
              right: true,
              next: 'won',
            },
            {
              kind: 'say',
              // ✗ WRONG — "the captains paid for it themselves / rich adventurers."
              label: 'The captains paid for it themselves — bold rich men spent their own fortunes on their own ships, and the daring ones got their money back many times over.',
              setFlag: 'dTwU8SelfFundedMisread',
              next: 'reteachSelfFunded',
            },
            {
              kind: 'say',
              // ✗ WRONG — "the church / faith funded it as a crusade."
              label: 'The Church paid for it — these were really crusades for the faith, funded by the Pope to spread Christianity across the seas, with money no king needed to find.',
              next: 'reteachChurch',
            },
          ],
        },

        won: {
          onEnter: 'reward',
          text: '(Donato slides the three coins into one stack.) "Precisely — you see the LEDGER under the legend. The thinking of the day, what later writers called mercantilism, taught every crown that a nation\'s power was its store of bullion and its command of trade; so monarchs themselves underwrote Columbus and da Gama and Magellan, chasing wealth for the state. And the merchants\' great invention was the joint-stock company — sell shares in a voyage, gather many small purses into one great purse, and divide both the profit AND the loss. One ship could sink and the company sailed on. That sharing of risk is what turned a gambler\'s voyage into a standing business — and Florence taught Europe how to keep those books." He taps the stack. "Your house knows now who really pays for an ocean."',
          choices: [
            { label: 'Then I\'ll fund my ventures the wiser way — shared, not solo.', next: '@close' },
          ],
        },

        reteachSelfFunded: {
          text: '(Donato shakes his head over the ledger.) "One man\'s fortune, friend? A single lost fleet would beggar the richest merchant in Europe — and fleets were lost all the time. No one would stake everything on a coin-toss that ruinous. The whole point was NOT to bet it all on one purse. Think: who has wealth deep enough to absorb a sunk fleet — and what device let ordinary investors club together so no one of them faced the whole loss alone? Weigh it again."',
          choices: [
            { label: 'I see — it is states and pooled, shared-risk money, not lone fortunes. Let me answer again.', clearFlag: 'dTwU8SelfFundedMisread', next: 'challenge' },
          ],
        },
        reteachChurch: {
          text: '(Donato folds his hands.) "Faith stirred some hearts, true, and missionaries sailed — but the Church was not paying the shipwrights or victualling the crews. These ledgers are signed by CROWNS and by companies of investors chasing return, not by the Pope chasing souls. Follow the money on the page, not the sermon. Which monarchies funded the great voyages, and what new kind of company let many backers share the cost and the risk? Try once more."',
          choices: [
            { label: 'Of course — it is crowns and joint-stock investors footing the bill. Let me try again.', next: 'challenge' },
          ],
        },
      },
    },

    // ============ KEYSTONE C — WHY SMALL FORCES TOPPLED EMPIRES ============
    // Handled with sober care and dignity per the assignment. The teaching voice is
    // a fictional chronicler; the history (disease, alliances, steel) is real, never
    // sensationalized, and refuses the myth of European supremacy.
    {
      id: 'd-tw-u8-ks-fall-of-empires',
      npc: 'd-tw-u8-chronicler',
      codexId: 'd-tw-u8-cx-fall-of-empires',
      house: 2,
      houseTitle: 'You told the conquest honestly',
      houseSub: 'A chronicler of the Americas marks your house as one that refused the fable and named what truly felled great empires.',
      flag: 'dTwU8ConquestUnderstood',
      achievement: 'd-tw-u8-ach-not-a-fable',
      start: 'challenge',
      nodes: {
        challenge: {
          text: 'Mencia spreads her chronicles on the table. "Here is the hard fact, told plainly. Cortés reached the Aztec empire with a few hundred Spaniards; Pizarro reached the Inca empire with fewer still. Each empire ruled millions. Within a few years both lay broken. The legend says it proves European greatness. I do not believe the legend, and I will not write it. Tell me, trader — what truly let such small forces bring down such vast empires?"',
          choices: [
            {
              kind: 'say',
              // ★ RIGHT — disease (smallpox) + Indigenous alliances + steel/horses/guns; not European supremacy.
              label: 'Not greatness — catastrophe, alliance, and accident. The decisive force was disease: smallpox and other plagues, against which the peoples of the Americas had no immunity, killed an enormous share of the population and struck down leaders and armies before battle was even joined. On top of that, subject and rival peoples allied with the Spaniards in their thousands to overthrow overlords they hated, so the small Spanish force was never really small. Steel weapons, horses, and guns helped — but they were the smallest part. It was an empire already collapsing from plague and division, not European supremacy.',
              right: true,
              next: 'won',
            },
            {
              kind: 'say',
              // ✗ WRONG — "European weapons / superiority won it."
              label: 'European weapons won it — steel swords, guns, and horses simply made each Spaniard worth a hundred warriors, and superior arms beat numbers every time.',
              setFlag: 'dTwU8WeaponsMisread',
              next: 'reteachWeapons',
            },
            {
              kind: 'say',
              // ✗ WRONG — "the empires were weak / the people gave up."
              label: 'The empires were just weak and their people gave up easily — they must not have wanted to fight, or they would never have fallen to so few.',
              next: 'reteachWeak',
            },
          ],
        },

        won: {
          onEnter: 'reward',
          text: '(Mencia sets down her pen, grave and steady.) "Yes. You refused the fable, and you must. The single largest force was the unseen one — epidemic disease, smallpox above all, swept through peoples who had never met it and emptied cities, fields, and palaces; in places the great majority died within a generation. Then Cortés and Pizarro did not fight alone: tens of thousands of Indigenous allies, peoples crushed under Aztec or weakened by Inca civil war, joined them to settle their own scores. Steel and horses and guns mattered at the edges, but they did not topple millions — plague and division did, and the Spaniards walked into the wreckage. We tell it this way out of respect for the dead, and so no one ever again mistakes a catastrophe for a triumph." She closes the book gently. "Your house carries the truth, not the legend."',
          choices: [
            { label: 'I\'ll carry the truth and the memory of those who fell.', next: '@close' },
          ],
        },

        reteachWeapons: {
          text: '(Mencia shakes her head slowly.) "If steel alone decided it, friend, a few hundred swords could never have held against millions, however sharp. Arms matter at the front of a battle, but they do not unmake an empire. Ask what had already broken those empires BEFORE the fighting was decided. What unseen thing killed armies and emperors without a blow? Who fought ALONGSIDE the Spaniards in their tens of thousands, and why? Look past the swords. Weigh it again."',
          choices: [
            { label: 'I see — disease and Indigenous alliances did the real work, not the steel. Let me answer again.', clearFlag: 'dTwU8WeaponsMisread', next: 'challenge' },
          ],
        },
        reteachWeak: {
          text: '(Mencia\'s voice stays gentle but firm.) "These were not weak peoples, and they did not give up — they resisted fiercely, again and again, and many died fighting. To call them weak is the legend wearing another mask; it blames the dying for their own catastrophe. The honest question is what overwhelmed even a strong, defiant people: a plague they had no defense against, and rival nations turning the moment against their overlords. Look at the disease and the alliances, not a failure of will. Try once more."',
          choices: [
            { label: 'Of course — it was plague and alliances overwhelming a people who fought hard, not weakness. Let me try again.', next: 'challenge' },
          ],
        },
      },
    },

    // ============ KEYSTONE D — THE RISE OF A GLOBAL ECONOMY ============
    {
      id: 'd-tw-u8-ks-global-economy',
      npc: 'd-tw-u8-factor',
      codexId: 'd-tw-u8-cx-global-economy',
      house: 2,
      houseTitle: 'You saw the world become one market',
      houseSub: 'The Calicut company factors mark your house as one that understands how silver tied every continent into a single global economy.',
      flag: 'dTwU8GlobalEconomyUnderstood',
      achievement: 'd-tw-u8-ach-one-bloodstream',
      start: 'challenge',
      nodes: {
        challenge: {
          text: 'Branca gestures across the crowded quay. "Watch the silver, trader. It is dug from a mountain at Potosí in the Andes by forced labor, shipped to Spain, then carried east — some across the Atlantic and on overland, some clear across the Pacific from Mexico to Manila — and it ends up in China, because the Ming will take silver for their silk and porcelain when they want little else Europe makes. One metal, every ocean, all the continents. Tell me: what is the truest way to describe what is happening to the WORLD\'S trade in this age?"',
          choices: [
            {
              kind: 'say',
              // ★ RIGHT — for the first time all inhabited continents linked into ONE global economy, with American silver as the medium; Asia still set terms.
              label: 'For the first time, all the inhabited continents were linked into a SINGLE global economy. Before, the Atlantic and Pacific kept whole worlds apart; now American silver flows across both oceans to pay for Asian goods, and the Americas, Europe, Africa, and Asia trade in one connected web. The world did not merely trade more — it became one market with one bloodstream of money. And at first Asia still set the terms: Europeans had to buy in with silver because they made little Asian markets wanted.',
              right: true,
              next: 'won',
            },
            {
              kind: 'say',
              // ✗ WRONG — "Europe now dominates world trade."
              label: 'It means Europe now rules world trade — the European powers have taken over commerce everywhere, and from now on Asia and the Americas simply work for Europe\'s markets.',
              setFlag: 'dTwU8EuroDominanceMisread',
              next: 'reteachDominance',
            },
            {
              kind: 'say',
              // ✗ WRONG — "it is just more of the same old long-distance trade."
              label: 'It is just more of the same — long-distance trade has gone on for ages along the Silk Road and the Indian Ocean. There are simply a few more routes now; nothing fundamental has changed.',
              next: 'reteachSame',
            },
          ],
        },

        won: {
          onEnter: 'reward',
          text: '(Branca nods toward a chest of silver bound for China.) "Yes — you see the whole web, not one strand of it. This is the moment the Atlantic and the Pacific stop dividing the world and start CONNECTING it. American silver becomes the money that ties Europe, Africa, the Americas, and Asia into one circuit — the Manila galleon alone carries Mexican silver straight across the Pacific to buy Chinese goods. So much bullion floods in that prices rise across continents at once, the first truly global price shift. And mark this well: at the start, Asia\'s great economies set the price; the newcomers from Europe were minor buyers who had to PAY in silver to get a seat at a table China and India already owned. The First Global Age begins not as European mastery but as one connected market." She latches the chest. "Your house trades in a world that is suddenly whole. Few merchants grasp how new that is."',
          choices: [
            { label: 'Then I\'ll trade as a citizen of one connected world.', next: '@close' },
          ],
        },

        reteachDominance: {
          text: '(Branca raises a hand, kindly correcting.) "Europe RULING world trade? Not yet, friend — not for a long while. Look at this quay again: the Europeans here are buyers, and they pay in silver because they make nothing the Ming or the Mughals actually want. China and India are the great workshops and the great markets; the newcomers must buy their way in on Asia\'s terms. The new thing is not European mastery — it is CONNECTION: the continents woven into one market for the first time. Think about the web being made, not who supposedly owns it. Weigh it again."',
          choices: [
            { label: 'I see — it is one connected world economy, with Asia still setting terms, not European rule. Let me answer again.', clearFlag: 'dTwU8EuroDominanceMisread', next: 'challenge' },
          ],
        },
        reteachSame: {
          text: '(Branca shakes her head and points to the Pacific horizon.) "More of the same? The Silk Road and the Indian Ocean were vast — but they never crossed the OPEN oceans, and the Americas were a world entirely apart, unknown to Asia and Europe alike. Now silver from a mountain in the Andes pays for silk in China, carried across the Pacific. That has never happened in all of history. For the first time the WHOLE earth is one market. Think about what is connected now that was utterly separate before. Try once more."',
          choices: [
            { label: 'Of course — the Americas and the open oceans join in, making one whole-earth market. Let me try again.', next: 'challenge' },
          ],
        },
      },
    },
  ],

  // ---- Codex: the real ideas this pack teaches ----
  codex: [
    {
      id: 'd-tw-u8-cx-maritime-tech',
      group: 'Unit 8 — Age of Exploration',
      title: 'The technology that opened the oceans',
      idea: 'Oceanic voyages became possible because of new maritime technology: the caravel combined square and lateen (triangular) sails so a ship could finally beat back UPWIND and leave the coast behind, while the magnetic compass and astrolabe let crews hold a heading and reckon latitude far out of sight of land — turning impossible voyages into merely dangerous ones.',
      source: 'Estêvão, caravel-builder of Calicut (on the ships and instruments of the early voyages)',
    },
    {
      id: 'd-tw-u8-cx-state-and-capital',
      group: 'Unit 8 — Age of Exploration',
      title: 'The state and the capital behind the voyages',
      idea: 'The ruinous, risky voyages were paid for by STATES and POOLED money: mercantilist thinking convinced crowns that national power meant bullion and controlled trade, so monarchs bankrolled exploration, while merchants invented the joint-stock company — many investors each buying a share, pooling enough capital to outfit fleets and spreading the risk so one shipwreck could not ruin a single backer.',
      source: 'Donato, Florentine banker (on mercantilism and the joint-stock company)',
    },
    {
      id: 'd-tw-u8-cx-fall-of-empires',
      group: 'Unit 8 — Age of Exploration',
      title: 'Why small forces toppled great American empires',
      idea: 'A few hundred Spaniards under Cortés and Pizarro brought down the Aztec and Inca empires not through European supremacy but through catastrophe and alliance: epidemic disease, above all smallpox, killed an enormous share of peoples who had no immunity and struck down their leaders, while tens of thousands of Indigenous allies joined to overthrow hated overlords — steel, horses, and guns mattered least. Told soberly, it is a catastrophe, not a triumph.',
      source: 'Mencia, chronicler of the American conquests (on disease, alliances, and the fall of the Aztec and Inca)',
    },
    {
      id: 'd-tw-u8-cx-global-economy',
      group: 'Unit 8 — Age of Exploration',
      title: 'The rise of a single global economy',
      idea: 'The First Global Age tied every inhabited continent into ONE connected economy for the first time, with American silver (from Potosí, carried across both the Atlantic and the Pacific via the Manila galleon to Ming China) as the money that linked the markets — and at the start Asia still set the terms, since Europeans had to buy in with silver because they made little Asian markets wanted.',
      source: 'Branca, company factor of Calicut (on silver, the Manila galleon, and the joining of the world\'s markets)',
    },
  ],

  // ---- Achievements: optional milestones ----
  achievements: [
    {
      id: 'd-tw-u8-ach-rigging-and-reckoning',
      title: 'Rigging and reckoning',
      desc: 'You understood the technology that opened the oceans — the caravel that could sail upwind, and the compass and astrolabe that found the way far from land.',
    },
    {
      id: 'd-tw-u8-ach-pay-for-the-ocean',
      title: 'Who paid for the ocean',
      desc: 'You understood the money and the state behind the sails — crown patronage, mercantilism, and the joint-stock company that pooled capital and shared the risk.',
    },
    {
      id: 'd-tw-u8-ach-not-a-fable',
      title: 'Not a fable',
      desc: 'You told the conquest of the Americas honestly — disease, Indigenous alliances, and a collapsing empire, not a legend of European greatness.',
    },
    {
      id: 'd-tw-u8-ach-one-bloodstream',
      title: 'One world, one bloodstream',
      desc: 'You saw the world become a single global economy — American silver tying every continent into one market, with Asia still setting the terms.',
    },
  ],
};

export default pack;
