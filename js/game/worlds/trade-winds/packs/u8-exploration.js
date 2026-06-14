// u8-exploration.js — STORY PACK: Unit 8, Age of Exploration & the First Global Age.
//
// Pure DATA module — no imports, no engine calls — so it can never crash the world
// on its own. The loader in ../game.js wires everything below into the live game
// (adds the NPCs at Calicut, fires the cutscene once, makes each keystone reachable,
// records the Codex entries, lifts House Standing, unlocks achievements). See
// CONTRACT.md for the authoritative field-by-field spec; this file COPIES the shape
// of the gold-standard unit3-belief-systems.js.
//
// THIS PACK teaches three real Global-History-9, Unit 8 keystones, set at Calicut —
// the pepper port where Vasco da Gama landed in 1498 — and the wider Atlantic system
// it helped open:
//   (a) WHY Europeans sailed: to CUT OUT THE MIDDLEMEN and reach the spice/silk
//       sources DIRECTLY. The overland routes to Asian goods ran through Ottoman,
//       Venetian, and Arab hands, each taking a cut; a sea road to India would let a
//       crown buy pepper at the source and keep the markup.
//   (b) THE COLUMBIAN EXCHANGE: crops, animals, AND disease crossed the Atlantic in
//       BOTH directions, reshaping every continent's diet and demography — maize and
//       potatoes feeding Afro-Eurasia, horses and wheat remaking the Americas, and
//       smallpox and measles killing the great majority of Indigenous peoples who had
//       no immunity.
//   (c) THE ATLANTIC SYSTEM'S HUMAN COST: the trans-Atlantic slave trade, handled
//       with sober care and dignity — millions of African people enslaved and shipped
//       to labor on American plantations, a real and brutal engine of the new global
//       economy, never sensationalized.
//
// Honest pedagogy: every place, date, and idea is real. The teaching voices are
// fictional in-world denizens of Calicut and the docks so nothing is mis-attributed;
// real figures (da Gama, Columbus) are referred to in paraphrase grounded in the
// record, never given invented verbatim quotes. De-identified throughout. All ids
// are namespaced with the pack id (u8-) so nothing collides with core or other packs.

export const pack = {
  // ---- identity ----
  id: 'u8-exploration',
  unit: 'Unit 8 — Age of Exploration',        // the Codex group + author-facing label
  title: 'The First Global Age — Why the Oceans Filled with Sails',

  // ---- extra characters added to the world ----
  // Three teaching denizens at Calicut (era 4). Each carries one keystone. Offsets
  // avoid the core NPCs at this city: Zheng He at [-7,4] and the harbor pilot
  // Kunjali at [8,-5].
  npcs: [
    {
      id: 'u8-spice-broker',
      name: 'Cherian',
      title: 'Pepper Broker of the Calicut Bazaar',
      city: 'calicut',
      era: 4,
      offset: [6, 6],                         // clear of Zheng He [-7,4] and Kunjali [8,-5]
      hatKind: 'cap',
      palette: { robe: 0x1f7a5a, trim: 0x114433, skin: 0xa9672f, hat: 0x114433 },
      keystoneId: 'ks-u8-cut-the-middlemen',
      introText: 'Welcome to Calicut, friend — the pepper does not grow any closer to the sea than here. I have weighed cardamom and clove for Arab dhows and Chinese junks all my life. But this past spring a strange new ship dropped anchor: pale sailors off a Portuguese caravel, come the whole way round Africa. Their captain, da Gama, knelt and asked the Zamorin for Christians and spices. Sit with me before you trade — there is a thing about WHY those ships came that a merchant must understand.',
      afterText: 'You have it: they did not sail around a whole continent for the love of the sea. They sailed to reach the pepper at its SOURCE — to cut every hand between the vine and their own market. The world is about to have one ocean-road instead of a hundred middlemen. Trade carefully in the years coming, friend.',
    },
    {
      id: 'u8-ship-surgeon',
      name: 'Inês the Apothecary',
      title: 'Ship\'s Apothecary of the Carrera',
      city: 'calicut',
      era: 4,
      offset: [-4, 8],                        // distinct from the broker and the core NPCs
      hatKind: 'none',
      palette: { robe: 0x8a5a8c, trim: 0x4e2e50, skin: 0xd9a066 },
      keystoneId: 'ks-u8-columbian-exchange',
      introText: 'You smell that? Maize roasting at the next stall — corn, off a plant no one in this hemisphere had seen a lifetime ago. I keep a chest of seeds and a chest of medicines, and I have sailed the great ocean-crossing west and back. What I have watched move across that water in twenty years would unmake the map of any kitchen on earth. Ask me about it, trader — and ask me about the thing that moves with the seeds and that no chest of medicine can stop.',
      afterText: 'Now you understand the exchange: it ran BOTH ways, and it carried life and death together. New crops to feed millions; new animals to remake whole ways of living; and a tide of disease that emptied the Americas of most of their people. One ocean crossing rewrote what every continent eats — and who is left to eat it. Carry that knowledge soberly.',
    },
    {
      id: 'u8-ledger-keeper',
      name: 'Mateus the Ledger-Keeper',
      title: 'Counting-House Clerk of the Atlantic Trade',
      city: 'calicut',
      era: 4,
      offset: [9, 2],                         // east edge, clear of all others
      hatKind: 'cap',
      palette: { robe: 0x4a4f63, trim: 0x282c3a, skin: 0x8a5a3a, hat: 0x282c3a },
      keystoneId: 'ks-u8-atlantic-human-cost',
      introText: 'I keep books for the Atlantic houses — the ones that grew rich after the new sea-roads opened. Sugar, tobacco, silver: the ledgers balance beautifully. But there is a column in these books that is not goods at all. It is people. I will not dress it up for you, trader. If you mean to understand the world this age is building, you must understand its cost in human lives. Sit, and I will tell it plainly and with respect.',
      afterText: 'You have not looked away, and that matters. The new global economy was built in part on the forced labor of millions of enslaved African people, carried across the Atlantic against their will to work plantations they would never own. We name it honestly so it is never repeated and never reduced to a number. Walk on carrying their memory, friend.',
    },
  ],

  // ---- named story-beat sequences (playCutscene format) ----
  // tint ∈ amber|dusk|cold|stone; art ∈ candle|ledger|notice|portrait|null.
  cutscenes: {
    // Fires the first time the player reaches Calicut in Era IV — frames the unit
    // question ("why would Europeans risk the whole ocean?") before the player meets
    // the three teaching denizens.
    U8_INTRO: [
      {
        tint: 'amber', kicker: 'Calicut, 1498 — the Spice Coast', art: 'notice',
        text: 'The pepper quays of Calicut have seen Arab dhows and Chinese junks for centuries. But this season the talk on every wharf is the same: a Portuguese captain named Vasco da Gama has sailed the whole way around Africa and dropped anchor here, the first ship to reach India by sea from the far end of Europe. He came asking for Christians and spices — and for a way to buy the pepper without paying anyone in between.',
      },
      {
        tint: 'dusk', kicker: 'A merchant\'s riddle', art: 'portrait',
        palette: { robe: 0x1f7a5a, trim: 0x114433, skin: 0xa9672f, hat: 0x114433 },
        text: 'A pepper broker at the bazaar reads the question on your face. "Every trader who lands here asks the same thing," he says. "WHY? Why would a kingdom risk fortunes and crews to sail around a whole continent, when the spices have always reached Europe just fine over the old roads? Answer that, and you will understand the age that is opening — and what it will cost." His name is Cherian. Three people at this port have a piece of that answer. Go and find them.',
        cta: 'Walk the Calicut quays',
      },
    ],
  },

  // ---- triggers: when each cutscene fires (once) ----
  triggers: [
    {
      on: 'visit', value: 'calicut', play: 'U8_INTRO',
      reward: { house: 1, title: 'The ocean opens a question', sub: 'Calicut sets you the riddle of why the sails came — and what the new global age will cost.' },
    },
  ],

  // ---- THE CORE: keystones ----
  keystones: [
    // ================= KEYSTONE A — WHY EUROPEANS SAILED =================
    {
      id: 'ks-u8-cut-the-middlemen',
      npc: 'u8-spice-broker',
      codexId: 'cx-u8-cut-the-middlemen',
      house: 2,
      houseTitle: 'You read the reason behind the sails',
      houseSub: 'The Calicut brokers mark the House of the Open Road as one that understands why crowns spent fortunes to reach the source.',
      flag: 'u8MiddlemenUnderstood',
      achievement: 'ach-u8-source-not-the-stall',
      start: 'challenge',
      nodes: {
        challenge: {
          text: 'Cherian sets a single peppercorn on his scale. "Watch this corn travel the OLD way, trader. It leaves my hand in Calicut and crosses the Arabian Sea to an Arab merchant, who sells it on to a caravan, which carries it through lands the Ottoman sultan now controls — and he takes his toll. Then a Venetian buys it and ships it to Europe at the price of a small house. Every hand it passes multiplies its cost. So da Gama\'s crown sent ships the whole way around Africa to land HERE. Tell me, merchant who weighs things: WHY would a kingdom go to all that danger and expense?"',
          choices: [
            {
              kind: 'say',
              // ★ RIGHT — to cut out the middlemen and buy at the source.
              label: 'Because every middleman on the old road takes a cut, so by the time pepper reaches Europe its price has been multiplied many times over — and worse, the overland routes run through Ottoman, Arab, and Venetian hands a Christian crown cannot control. A sea-road straight to Calicut lets them buy the spice at the SOURCE and keep all that markup for themselves. They are not chasing the ocean — they are cutting out the middlemen.',
              right: true,
              next: 'won',
            },
            {
              kind: 'say',
              // ✗ WRONG (the romantic misread) — "for adventure / to see the world."
              label: 'Because sailors crave adventure and glory. Men have always wanted to see what lies beyond the edge of the map — it is the thrill of discovery, nothing more practical than that.',
              setFlag: 'u8AdventureMisread',
              next: 'reteachAdventure',
            },
            {
              kind: 'say',
              // ✗ WRONG (the other common misread) — "to conquer / take land."
              label: 'Because Europe simply wanted more land to rule. A king always wants a bigger empire, so he sent ships to seize new territory wherever he could find it.',
              next: 'reteachConquest',
            },
          ],
        },

        // ---- RIGHT PATH: the world changes ----
        won: {
          onEnter: 'reward',
          text: '(Cherian sweeps the peppercorn off the scale and into your palm, grinning.) "There it is — you see the LEDGER behind the voyage, not just the romance. The old spice road was a chain of middlemen, and after the Ottomans took Constantinople in 1453 the chain ran through hands Europe trusted less than ever. So Portugal and then Spain spent everything to find a sea-road that skipped them all — Portugal east around Africa to me, Spain west across the open ocean hoping for the same Indies. The lure was Asian markets; the goal was to reach the SOURCE and pocket the markup. That is the engine of this whole age." He presses the corn into your hand. "Your house trades smarter for knowing it."',
          choices: [
            { label: 'Then I\'ll buy at the source and remember why.', next: '@close' },
          ],
        },

        // ---- WRONG PATHS: consequence + re-teach + LOOP back ----
        reteachAdventure: {
          text: '(Cherian does not laugh at you; he only taps the scale.) "Adventure stirs a sailor, friend — but it does not pay for a fleet. Kings and merchant-houses funded these voyages, and they wanted a RETURN, not a thrill. Think like the one who signs the bills, not the one at the oar. The spices already reach Europe over the old roads — so what makes it worth risking ships to reach them by sea instead? Who is standing between Europe and the pepper, taking a cut at every step? Weigh it again."',
          choices: [
            { label: 'I see — follow the money, not the romance. Let me answer again.', clearFlag: 'u8AdventureMisread', next: 'challenge' },
          ],
        },
        reteachConquest: {
          text: '(Cherian shakes his head gently.) "Conquest comes LATER, and not everywhere — da Gama did not arrive here with an army; he arrived asking the Zamorin to trade. The first goal was the goods, not the ground. Picture the price of pepper climbing as it passes from Arab to caravan to Ottoman toll to Venetian ship. What would a crown gain by sailing straight to where the spice grows? Think about the middlemen, not the map of empire. Try once more."',
          choices: [
            { label: 'Of course — it begins with the trade, with skipping the middlemen. Let me try again.', next: 'challenge' },
          ],
        },
      },
    },

    // ================= KEYSTONE B — THE COLUMBIAN EXCHANGE =================
    {
      id: 'ks-u8-columbian-exchange',
      npc: 'u8-ship-surgeon',
      codexId: 'cx-u8-columbian-exchange',
      house: 2,
      houseTitle: 'You grasp the exchange that remade the world',
      houseSub: 'An apothecary of the great crossing marks your house as one that understands the two-way tide of crops, beasts, and disease.',
      flag: 'u8ExchangeUnderstood',
      achievement: 'ach-u8-both-ways',
      start: 'challenge',
      nodes: {
        challenge: {
          text: 'Inês opens her seed-chest and lifts a fistful of maize kernels. "After Columbus crossed in 1492, two worlds that had been apart since the ice age were suddenly joined by ships running back and forth. Maize and potatoes and tomatoes went EAST to Europe, Africa, and Asia. Wheat, horses, cattle, and sugarcane came WEST to the Americas. And in the holds, unseen, came smallpox and measles — diseases no one in the Americas had ever met." She closes her hand. "Tell me, trader: what is the truest way to describe what crossed that ocean?"',
          choices: [
            {
              kind: 'say',
              // ★ RIGHT — a two-way exchange of crops, animals, AND disease, reshaping diet and demography.
              label: 'It was a two-way exchange, and it carried far more than treasure. Crops and animals crossed in BOTH directions — maize and potatoes feeding millions across Afro-Eurasia, horses and wheat remaking life in the Americas — and disease crossed too, smallpox and measles killing most of the Indigenous people who had no immunity. One ocean crossing rewrote what every continent ate and how many people were left to eat it.',
              right: true,
              next: 'won',
            },
            {
              kind: 'say',
              // ✗ WRONG (the one-way / Europe-only misread).
              label: 'It was Europe bringing its superior crops and animals to a poorer New World — a one-way gift of wheat and cattle to lands that had little of their own.',
              setFlag: 'u8OneWayMisread',
              next: 'reteachOneWay',
            },
            {
              kind: 'say',
              // ✗ WRONG (the "just gold and silver" misread).
              label: 'It was mostly about the silver and gold — the ships came home loaded with bullion, and that treasure is the real story of the exchange. Plants and sickness are a footnote.',
              next: 'reteachSilver',
            },
          ],
        },

        won: {
          onEnter: 'reward',
          text: '(Inês nods, the gravity of it settling between you.) "Yes. People call it the Columbian Exchange, and the word EXCHANGE matters — it went BOTH ways, and it carried life and death in the same holds. The potato alone would feed Europe\'s growing millions; the horse would remake whole nations on the American plains. But the same ships carried smallpox to peoples with no defense against it, and across the next century the great majority of the Americas\' Indigenous population died — the worst demographic collapse in recorded history. New foods, new beasts, and a tide of death, all on one current." She latches the chest. "You see the whole of it now. That is rarer than you\'d think."',
          choices: [
            { label: 'I\'ll carry the whole of it — the harvest and the cost.', next: '@close' },
          ],
        },

        reteachOneWay: {
          text: '(Inês raises an eyebrow, kindly.) "One way? Look in my own kitchen, friend. The tomato in an Italian sauce, the potato that feeds Ireland, the maize that feeds half of Africa, the chili in every Asian dish — every one of those came FROM the Americas. The Old World did not give crops to an empty land; it TRADED crops with a hemisphere full of farmers, and got as much as it gave. And the deadliest cargo went one way the gift-story never mentions — the disease. Think about what crossed in BOTH directions. Weigh it again."',
          choices: [
            { label: 'I see — it ran both ways, east and west. Let me answer again.', clearFlag: 'u8OneWayMisread', next: 'challenge' },
          ],
        },
        reteachSilver: {
          text: '(Inês sets down a single dried potato beside an imagined coin.) "The silver was real and it mattered — but the silver did not change how the WORLD ate, or how many people there were to feed. The potato did. The maize did. The smallpox did. A mountain of bullion never reshaped a continent\'s diet or emptied its villages; crops and disease did exactly that, to every continent at once. Look past the treasure chest to the seed-chest and the sick-bed. Try once more."',
          choices: [
            { label: 'Of course — the crops and the disease are the real story. Let me try again.', next: 'challenge' },
          ],
        },
      },
    },

    // ================= KEYSTONE C — THE ATLANTIC SYSTEM'S HUMAN COST =================
    // Handled with sober care and dignity per the assignment. The teaching voice is a
    // fictional clerk; the history (the trans-Atlantic slave trade as the engine of the
    // plantation economy) is real, never sensationalized, and centers human dignity.
    {
      id: 'ks-u8-atlantic-human-cost',
      npc: 'u8-ledger-keeper',
      codexId: 'cx-u8-atlantic-human-cost',
      house: 2,
      houseTitle: 'You named the human cost honestly',
      houseSub: 'A counting-house clerk marks your house as one that refused to look away from what the new global economy was built upon.',
      flag: 'u8HumanCostUnderstood',
      achievement: 'ach-u8-the-column-of-people',
      start: 'challenge',
      nodes: {
        challenge: {
          text: 'Mateus opens a heavy ledger and turns it so you can see. "These books are how the Atlantic houses grew rich after the sea-roads opened. Sugar from the Caribbean, tobacco from Virginia, silver from Potosí — and the labor that grew and dug it all was forced. Beginning in the fifteenth century and across three centuries to come, traders carried millions of enslaved African people across the Atlantic against their will, to work plantations they would never own, in chains, far from everyone they loved." He keeps his voice level and grave. "Tell me plainly, trader — what is the honest way to understand this in the story of the new global economy?"',
          choices: [
            {
              kind: 'say',
              // ★ RIGHT — the trans-Atlantic slave trade was a brutal, central engine of
              // the new economy; millions of enslaved people, named with dignity.
              label: 'That the new global economy was built in large part on the forced labor of millions of enslaved African people, torn from their homes and shipped across the Atlantic to work American plantations. It was not a side note to the age of exploration — it was a central, brutal engine of it, and the wealth in these ledgers was paid for in human lives that we must name with dignity, not reduce to numbers.',
              right: true,
              next: 'won',
            },
            {
              kind: 'say',
              // ✗ WRONG (the minimizing misread) — "just one trade among many."
              label: 'That it was just one trade among many in a busy age — a line of business like sugar or silver, no more central to the story than any other cargo.',
              setFlag: 'u8MinimizeMisread',
              next: 'reteachMinimize',
            },
            {
              kind: 'say',
              // ✗ WRONG (the "inevitable / normal for the time" misread).
              label: 'That it was simply normal for the time, so there is nothing much to understand — every age had its hardships and this was just one of them.',
              next: 'reteachNormalize',
            },
          ],
        },

        won: {
          onEnter: 'reward',
          text: '(Mateus closes the ledger and rests his hand on it for a moment, in something like respect.) "Yes. You said it the way it must be said. The trans-Atlantic slave trade carried an estimated twelve million African people across the ocean over three centuries; well over a million died on the crossing alone. The plantation wealth that fed Europe\'s rise was wrung from their stolen labor and their stolen lives. It is not a footnote to the First Global Age — it is one of its foundations, and the most terrible. We study it not to dwell in horror but so that real people are remembered as people, and so the world never again calls such a thing ordinary." He looks at you steadily. "Your house understands what its prosperity can be built on. Few do, and fewer admit it."',
          choices: [
            { label: 'I\'ll remember them as people, and carry that responsibility.', next: '@close' },
          ],
        },

        reteachMinimize: {
          text: '(Mateus does not raise his voice; he turns a page.) "One trade among many, friend? Look at how the whole system DEPENDS on it. The sugar, the tobacco, the cotton — none of it grows itself. Strip the forced labor out of these ledgers and the plantation economy collapses; there is no Atlantic fortune without it. That is what makes it central, not incidental. And these were not crates — they were people, with names and families. Think about what the entire economy rested upon, and who paid for it. Weigh it again."',
          choices: [
            { label: 'I see — it was the foundation the whole economy rested on, paid in human lives. Let me answer again.', clearFlag: 'u8MinimizeMisread', next: 'challenge' },
          ],
        },
        reteachNormalize: {
          text: '(Mateus shakes his head slowly, gently.) "\'Normal for the time\' is the excuse every ledger like this hides behind — and it was contested even in its own day; enslaved people resisted and rebelled, and voices rose against it. To call suffering ordinary is to refuse to see the people in it. The work of understanding history is precisely to NOT look away: to name what happened, why it happened — the demand for plantation labor and the profit in it — and at what human cost. Look again, with their humanity in view. Try once more."',
          choices: [
            { label: 'Of course — I won\'t look away or call it ordinary. Let me try again.', next: 'challenge' },
          ],
        },
      },
    },
  ],

  // ---- Codex: the real ideas this pack teaches ----
  codex: [
    {
      id: 'cx-u8-cut-the-middlemen',
      group: 'Unit 8 — Age of Exploration',
      title: 'Why Europeans sailed: cutting out the middlemen',
      idea: 'Europeans risked ocean voyages to reach the spice and silk sources of Asia DIRECTLY, because the overland routes ran through Ottoman, Arab, and Venetian middlemen who each took a cut and drove the price sky-high; a sea-road to Calicut and beyond let a crown buy at the source and keep the markup.',
      source: 'Cherian, pepper broker of Calicut (on the spice routes and Vasco da Gama\'s 1498 arrival)',
    },
    {
      id: 'cx-u8-columbian-exchange',
      group: 'Unit 8 — Age of Exploration',
      title: 'The Columbian Exchange ran both ways — and carried disease',
      idea: 'After 1492 the Columbian Exchange moved crops, animals, AND disease in BOTH directions across the Atlantic: maize and potatoes fed millions in Afro-Eurasia while horses and wheat remade the Americas, and smallpox and measles killed the great majority of Indigenous peoples who had no immunity — one crossing that reshaped every continent\'s diet and demography.',
      source: 'Inês the apothecary (on the two-way exchange after Columbus, 1492)',
    },
    {
      id: 'cx-u8-atlantic-human-cost',
      group: 'Unit 8 — Age of Exploration',
      title: 'The human cost of the Atlantic system',
      idea: 'The new global economy was built in large part on the trans-Atlantic slave trade: across three centuries an estimated twelve million enslaved African people were carried against their will to labor on American plantations, a brutal and central engine of the First Global Age whose wealth was paid for in human lives that must be remembered with dignity.',
      source: 'Mateus the ledger-keeper (on the trans-Atlantic slave trade and the plantation economy)',
    },
  ],

  // ---- Achievements: optional milestones ----
  achievements: [
    {
      id: 'ach-u8-source-not-the-stall',
      title: 'Buy at the source',
      desc: 'You understood why Europeans risked the open ocean — to cut out the middlemen and reach the spice and silk sources directly.',
    },
    {
      id: 'ach-u8-both-ways',
      title: 'The tide ran both ways',
      desc: 'You grasped the Columbian Exchange — crops, animals, AND disease crossing the Atlantic in both directions, remaking every continent.',
    },
    {
      id: 'ach-u8-the-column-of-people',
      title: 'You did not look away',
      desc: 'You named the human cost of the Atlantic system honestly — the trans-Atlantic slave trade as a central engine of the new global economy, remembered with dignity.',
    },
  ],
};

export default pack;
