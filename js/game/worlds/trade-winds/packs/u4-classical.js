// u4-classical.js — STORY PACK: Unit 4, the Classical Empires.
//
// Additive, pure-DATA module (no imports, no engine calls — it can never crash
// the world on its own). The loader in ../game.js wires everything below into
// the live game: it adds the NPCs, fires each cutscene once, makes each keystone
// reachable, records the Codex entry, lifts House Standing, and unlocks the
// achievement. See CONTRACT.md for the authoritative field spec, and
// unit3-belief-systems.js for the gold-standard shape this file copies.
//
// THIS PACK teaches three real Global-History-9 Unit 4 (Classical Empires)
// keystones, set across the world's Classical-era cities (Athens, Chang'an):
//
//   (a) DIRECT democracy vs the REPUBLIC. In Athens, citizens themselves voted
//       in person in the Assembly (the Ekklesia) — but "citizen" was a narrow
//       circle (free adult men, no women, no enslaved people, no metics). Rome,
//       far larger, governed as a REPUBLIC: citizens elected representatives
//       (consuls, tribunes, the Senate) who checked one another. The keystone
//       idea: as the body of citizens grows too large to gather, scale itself
//       pushes a state from direct rule toward representation.
//
//   (b) How a HUGE empire HOLDS TOGETHER. Rome's Pax Romana bound the
//       Mediterranean with roads, one common law, and a standing army; Han China
//       bound its realm with the Mandate of Heaven (a ruler keeps power only
//       while he rules well) and a merit civil-service exam system that staffed
//       government with trained scholar-officials instead of mere warlords.
//
//   (c) The PRICE of empire — handled soberly. The roads, the marble, the grain
//       dole, and the leisure of the citizen all rested on conquest and on mass
//       slavery; the same power that brought "peace" was built on the unfree.
//
// Honest pedagogy: every figure, place, and institution named is real. Real
// figures are referenced by the record (laws, institutions, edicts), and the
// teaching VOICES are fictional in-world denizens (a magistrate's clerk, a Roman
// jurist abroad, a Han examination scholar, a freed quarry-worker) so nothing is
// mis-attributed. The only real modern person named anywhere is "Mr. Maccarello".

export const pack = {
  // ---- identity ----
  id: 'u4-classical',
  unit: 'Unit 4 — Classical Empires',        // Codex group + author-facing label
  title: 'How the Classical World Governed — and What It Cost',

  // ---- extra characters added to the world ----
  // All placed at EXISTING cities, with offsets chosen to avoid the core NPCs
  // (Athens: Herodotus [-7,3], Kallias [8,5]; Chang'an: Zhang Qian [-6,-4],
  // Vandak [7,4], Roshanak [-7,6]; Varanasi: Devala [6,-4], the u3 monk [-6,5]).
  npcs: [
    {
      id: 'u4-clerk-athens',
      name: 'Pheidias the Younger',
      title: 'Clerk of the Athenian Assembly',
      city: 'athens',
      era: 2,
      offset: [7, -5],                  // bottom-right; clear of Herodotus/Kallias
      hatKind: 'none',
      palette: { robe: 0xcfc7b2, trim: 0x8f8770, skin: 0xd9a066 },
      keystoneId: 'ks-direct-vs-republic',
      introText: 'You come on a voting day, trader. Up there on the Pnyx hill the citizens are gathering — six thousand of them, maybe more, to argue and raise their hands and DECIDE, each man his own vote, no go-between. We call it rule by the demos, the people themselves. The Romans to the west do it another way entirely, and a sharp merchant who carries goods between worlds ought to understand why. Stay; I will show you both.',
      afterText: 'You have it: a city small enough that its citizens can crowd one hill rules itself directly; a power as wide as Rome cannot, so it must elect men to stand in for the rest. Neither is "better" in the air — each fits the SIZE of the thing it governs. Carry that, and you will read every council you ever bargain before.',
    },
    {
      id: 'u4-jurist-rome',
      name: 'Lucius Verca',
      title: 'A Roman jurist, abroad in the agora',
      city: 'athens',                    // a Roman studying Greek law in Athens (Rome is not a world city)
      era: 2,
      offset: [-6, -6],                  // far corner; clear of Herodotus at [-7,3]
      hatKind: 'cap',
      palette: { robe: 0xb7b0a0, trim: 0x7a2f2f, skin: 0xd9a066, hat: 0x7a2f2f },
      keystoneId: 'ks-pax-romana',
      introText: 'Salve, merchant. I am Roman — I came to Athens to read their philosophers, but I find I keep explaining MY city to theirs. They ask the same thing you traders all ask: how does Rome hold so many peoples, from Britain to Syria, without the whole thing flying to pieces? It is a fair question, and the answer is not "the legions." Sit; let me put it to you the way Rome lives it.',
      afterText: 'Just so. Roads to move the law and the legions fast; ONE law every province answers to; and the army to enforce the peace at the edges. That bundle — not love of Rome — is the Pax Romana. Two centuries of open roads and safe seas, paid for in iron and order. You trade the length of it; now you know why you can.',
    },
    {
      id: 'u4-scholar-changan',
      name: 'Scholar Dong',
      title: 'A candidate for the Han civil service',
      city: 'changan',
      era: 2,
      offset: [6, -5],                   // clear of Zhang Qian [-6,-4], Vandak [7,4]
      hatKind: 'scholar',
      palette: { robe: 0x3a4a6e, trim: 0x202a45, skin: 0xd9b07c, hat: 0x202a45 },
      keystoneId: 'ks-mandate-merit',
      introText: 'Peace, traveler from the western roads. You have seen how Rome holds its world — by road and law and soldier. The Han holds a realm just as vast by something you cannot pave: an IDEA about who deserves to rule, and a way to find the men to run it. I have studied the classics for years to sit an examination that could make a farmer\'s son an official. Let me explain what that buys an emperor — it is cleverer than another army.',
      afterText: 'You understand the two pillars now. The Mandate of Heaven says the throne is EARNED by good rule and forfeited by bad — so even an emperor is held to account. And the exams staff the empire with trained scholar-officials chosen for learning, not birth or sword. Together they make a government that can outlast any one ruler. That is how the Han holds the world without a Roman in sight.',
    },
    {
      id: 'u4-freedman-athens',
      name: 'Sosos',
      title: 'A freed worker of the silver mines',
      city: 'athens',
      era: 2,
      offset: [9, 2],                    // right side, clear of Kallias [8,5]
      hatKind: 'none',
      palette: { robe: 0x6e6151, trim: 0x47402f, skin: 0xb97f4e },
      keystoneId: 'ks-price-of-empire',
      introText: 'You admire the marble and the voting and the long Roman roads, I can see it on you. I worked the silver at Laurion — chained, half-starved, in the dark, so Athens could mint the coins that paid for all of it. I am free now; most never were. Before you decide the classical world was a golden age, weigh the part that gleams against the part that bled. I will tell it plainly; you decide what to write down.',
      afterText: 'Now you carry the whole of it — not just the columns but the chains under them. The roads, the leisure, the law, the silver: every glory of these empires stood on conquest and on the labor of people who never chose it. A trader who sees only the gleam is a trader who has been fooled. You will not be. Go gently with what you know.',
    },
  ],

  // ---- named story-beat sequences (playCutscene format) ----
  cutscenes: {
    // Fires the first time the player reaches Athens in Era II — frames the
    // governance question before the player meets the clerk and the jurist.
    U4_ATHENS_INTRO: [
      {
        tint: 'stone', kicker: 'Athens — the Assembly Hill', art: 'notice',
        text: 'Climb from the harbor and the whole city is shouting uphill. On the Pnyx, citizens are massing in the open air to vote — by their own raised hands, no one speaking for them. This is the demokratia the Greeks invented: rule by the people, in person. But the "people" who may climb that hill are a narrow few, and far to the west a younger power named Rome has chosen a very different way to be ruled.',
      },
      {
        tint: 'amber', kicker: 'Two ways to rule', art: 'portrait',
        palette: { robe: 0xcfc7b2, trim: 0x8f8770, skin: 0xd9a066 },
        text: 'A wax-tablet clerk waves you over from the foot of the hill. "Merchant! You go everywhere — then you above all should know the question of the age: who decides, and how? Athens decides on this hill, every citizen his own vote. Rome decides through men it ELECTS to stand for the rest. Find out WHY two great peoples chose so differently, and you will understand power better than the men shouting up there." He is the Assembly\'s clerk. Go and ask him.',
        cta: 'Climb to the Assembly',
      },
    ],
    // Fires the first time the player reaches Chang'an in Era II — frames how a
    // vast empire is held by an idea and an exam rather than only by force.
    U4_CHANGAN_INTRO: [
      {
        tint: 'stone', kicker: 'Chang\'an — the Han Capital', art: 'notice',
        text: 'Past the western gate the avenues run straight as a ruled line, thronged with officials in graded robes. The Han Empire is as wide as Rome and just as crowded with peoples — yet you see far fewer soldiers than you expected. Word in the market is that the men who actually RUN this empire were not born to it: they passed examinations on the classics, and a clever farmer\'s son can rise where a Roman would need a sword.',
      },
      {
        tint: 'amber', kicker: 'A throne that can be lost', art: 'portrait',
        palette: { robe: 0x3a4a6e, trim: 0x202a45, skin: 0xd9b07c, hat: 0x202a45 },
        text: 'A scholar in a candidate\'s robe, ink still on his fingers, falls into step beside you. "You have seen how Rome binds its world. Ask yourself how WE bind one as large — with so little of the legion about it. The answer is two ideas you cannot see on a map. Find me by the examination hall and I will show you how an empire holds when its strength is not in steel." He bows. Seek out Scholar Dong.',
        cta: 'Find the examination hall',
      },
    ],
  },

  // ---- triggers: when each cutscene fires (once) ----
  triggers: [
    {
      on: 'visit', value: 'athens', play: 'U4_ATHENS_INTRO',
      reward: { house: 1, title: 'Two ways to rule', sub: 'Athens sets you the oldest question of government: who decides, and how?' },
    },
    {
      on: 'visit', value: 'changan', play: 'U4_CHANGAN_INTRO',
      reward: { house: 1, title: 'A throne that can be lost', sub: 'Chang\'an shows you how an empire holds by an idea and an exam, not only by an army.' },
    },
  ],

  // ---- THE CORE: keystones ----
  keystones: [
    // ===== (a) DIRECT DEMOCRACY vs THE REPUBLIC — why scale pushes toward representation =====
    {
      id: 'ks-direct-vs-republic',
      npc: 'u4-clerk-athens',
      codexId: 'cx-direct-vs-republic',
      house: 2,
      houseTitle: 'You read why power changes shape with size',
      houseSub: 'A clerk of the Assembly marks the House of the Open Road as one that grasps why a vast state must elect rather than gather.',
      flag: 'u4DemocracyUnderstood',
      achievement: 'ach-who-decides',
      start: 'challenge',
      nodes: {
        challenge: {
          text: 'Pheidias spreads two wax tablets on his knee. "Look at the two. HERE, Athens: the citizens themselves climb this hill and vote in person — direct democracy, every citizen his own voice, no one between him and the decision. THERE, Rome: far too big a body of citizens to ever gather on one hill, so they ELECT men — consuls, tribunes, a Senate — to decide for them, and they set those men to check one another so none becomes a king. Now tell me, merchant who weighs things: WHY did the larger power choose to be ruled through chosen representatives instead of by everyone in person?"',
          choices: [
            {
              kind: 'say',
              // ★ RIGHT — scale forces representation; checks prevent one-man rule.
              label: 'Because a state can vote in person only while its citizens are few enough to all stand in one place. Athens can crowd one hill; Rome\'s citizens are too many and too scattered ever to gather — so they must ELECT a handful to decide for the rest, and then divide power among those few so no one of them seizes it. As a state grows large, sheer size forces it from direct rule toward representation.',
              right: true,
              next: 'won',
            },
            {
              kind: 'say',
              // ✗ WRONG (the "more democratic = direct" misread) — assumes Rome was less free.
              label: 'Because Rome simply trusted its people less than Athens did. Representatives are just a way to keep ordinary citizens away from real power — the Athenian way is the only TRUE democracy and Rome fell short of it.',
              setFlag: 'u4PurityMisread',
              next: 'reteachPurity',
            },
            {
              kind: 'say',
              // ✗ WRONG (the "Athens was a full democracy" misread) — ignores narrow citizenship.
              label: 'Because in Athens absolutely everyone had a vote, and Rome just could not match that fairness. Athens already gave every person who lived there an equal say.',
              next: 'reteachCitizens',
            },
          ],
        },

        // ---- RIGHT PATH ----
        won: {
          onEnter: 'reward',
          text: '(Pheidias taps the tablet and grins.) "There it is — you saw the hill, not the slogan. A body small enough to stand together can rule itself directly; a body too large must choose a few to stand IN for it, and then bind those few with checks so none turns tyrant. That is the whole difference between our Assembly and their Republic — not how much they love freedom, but how MANY they must govern. The bigger the realm, the harder it leans on representation. Spoken like a man who has counted a crowd. Athens marks your house a friend of good government."',
          choices: [
            { label: 'Then I\'ll carry that — size decides the shape of the vote.', next: '@close' },
          ],
        },

        // ---- WRONG PATHS: consequence + re-teach + LOOP back ----
        reteachPurity: {
          text: '(Pheidias shakes his head, not unkindly.) "You hear \'representative\' and think \'kept out\' — but think like a builder, not a partisan. Rome did not invent the Senate to muzzle its people; it invented it because you CANNOT fit a republic\'s worth of citizens on any one hill. When a body grows past the size of a single meeting, electing trusted men to decide — and checking them against one another — is how the people keep a hand on power at all. It is not less democratic; it is democracy stretched to fit something huge. So ask again: what forced Rome to elect instead of gather?"',
          choices: [
            { label: 'I see — it is the SIZE that forces representation, not distrust. Let me answer again.', clearFlag: 'u4PurityMisread', next: 'challenge' },
          ],
        },
        reteachCitizens: {
          text: '(Pheidias laughs softly.) "Friend, look harder at who is actually on that hill. Every voice up there is a free adult MAN whose father was a citizen. The women of Athens may not vote. The enslaved — and there are tens of thousands — may not. The metics, the foreign-born traders like you, may not, however rich. Athens is a direct democracy for a NARROW circle, not for everyone who lives here. So set fairness aside; that is a separate truth. My question is only about size: why must a power as vast as Rome elect representatives instead of gathering all its citizens in one place? Weigh that again."',
          choices: [
            { label: 'Right — citizenship here is narrow, and my answer must be about scale. Let me try again.', next: 'challenge' },
          ],
        },
      },
    },

    // ===== (b-Rome) PAX ROMANA — roads + common law + army =====
    {
      id: 'ks-pax-romana',
      npc: 'u4-jurist-rome',
      codexId: 'cx-pax-romana',
      house: 2,
      houseTitle: 'You read how Rome held a world',
      houseSub: 'A Roman jurist marks the House of the Open Road as one that understands the machinery of the Pax Romana.',
      flag: 'u4PaxUnderstood',
      achievement: 'ach-machinery-of-empire',
      start: 'challenge',
      nodes: {
        challenge: {
          text: 'Lucius draws a long straight line in the dust with his stick, then crosses it. "Britain to Syria, Spain to Egypt — peoples who never asked to be Roman, all quiet under one peace for generations. The Greeks here think it is the legions, but a legion can only stand in one place at a time, and the empire is too wide for that. So tell me, trader who has ridden our roads: what is it — really — that lets Rome HOLD a world that big in a lasting peace?"',
          choices: [
            {
              kind: 'say',
              // ★ RIGHT — the integrated bundle: roads + common law + army.
              label: 'It is three things working as one. The ROADS let your law, your officials, and your legions reach any province in days, so distance stops protecting rebels. ONE common Roman law gives every province the same rules and the same courts, so a Gaul and a Syrian are bound into a single order. And the ARMY guards the frontiers and backs the law. Roads, common law, and army together — not any one alone — are what hold the peace.',
              right: true,
              next: 'won',
            },
            {
              kind: 'say',
              // ✗ WRONG (the "fear alone" misread).
              label: 'It is fear, plain and simple. The legions are everywhere and everyone is too terrified to revolt — that is the whole of the Roman peace.',
              setFlag: 'u4FearMisread',
              next: 'reteachFear',
            },
            {
              kind: 'say',
              // ✗ WRONG (the "they loved Rome" / culture-only misread).
              label: 'It is that the conquered all came to love Rome and wanted to be Roman, so they simply chose to stay loyal out of admiration.',
              next: 'reteachLove',
            },
          ],
        },

        won: {
          onEnter: 'reward',
          text: '(Lucius wipes the dust from his hands, satisfied.) "You have it whole — most see only one leg of the stool. The roads move everything that matters fast; the law makes a man in Lyon answer to the same rules as a man in Antioch; the army holds the line so both can. Take any one away and the peace cracks. We call those two centuries the Pax Romana, and that bundle is its engine — not the love of Rome, not terror, but ROADS, LAW, and ARMY locked together. Rome will remember the merchant who understood her."',
          choices: [
            { label: 'Then I\'ll carry it — roads, common law, and army, as one machine.', next: '@close' },
          ],
        },

        reteachFear: {
          text: '(Lucius shakes his head.) "Fear keeps a province quiet for a season, not for two hundred years — and you cannot put a legion in every town from Britain to the Nile; there are not soldiers enough in the world. Fear is the FLOOR, not the building. Think about what a merchant like you actually relies on every day under Rome: a paved road you can travel without a guide, a court that will hear your contract the same in Spain as in Egypt, a frontier held so bandits stay out. What is the BUNDLE of things — beyond the spear — that lets Rome hold so wide a peace? Answer me again."',
          choices: [
            { label: 'I see — fear alone cannot last; it is the whole bundle of road, law, and army. Let me answer again.', clearFlag: 'u4FearMisread', next: 'challenge' },
          ],
        },
        reteachLove: {
          text: '(Lucius gives a dry smile.) "Some did grow proud to be Roman, true — and Rome was clever to offer citizenship as a reward. But do not mistake the icing for the cake. A province does not stay peaceful for centuries on admiration; it stays peaceful because the roads, the courts, and the legions make order the easiest path and revolt the hardest. Affection is a bonus on top of the machine, not the machine itself. So tell me again: what is the working machinery — the things Rome actually BUILT and enforced — that holds the peace?"',
          choices: [
            { label: 'Of course — loyalty is a bonus; the real answer is the built machinery of roads, law, and army. Let me try again.', next: 'challenge' },
          ],
        },
      },
    },

    // ===== (b-Han) MANDATE OF HEAVEN + MERIT CIVIL-SERVICE EXAMS =====
    {
      id: 'ks-mandate-merit',
      npc: 'u4-scholar-changan',
      codexId: 'cx-mandate-merit',
      house: 2,
      houseTitle: 'You read how the Han held its world',
      houseSub: 'A Han examination candidate marks the House of the Open Road as one that grasps the Mandate of Heaven and the merit exam.',
      flag: 'u4HanUnderstood',
      achievement: 'ach-machinery-of-empire',   // shared milestone: understanding how empires hold
      start: 'challenge',
      nodes: {
        challenge: {
          text: 'Scholar Dong sets down his brush. "Rome binds its world with roads and law and the legion — things you can touch. The Han is just as vast, yet we lean far less on the soldier. Two things you cannot pave do the holding. First: the Mandate of Heaven — the belief that Heaven grants the throne to a ruler ONLY while he governs justly, and withdraws it when he does not. Second: the examinations — these halls where men are chosen for office by what they have learned, not by birth or by the sword. Now tell me, traveler: HOW do those two — a belief and a test — actually hold an empire together?"',
          choices: [
            {
              kind: 'say',
              // ★ RIGHT — Mandate = accountability/legitimacy; exams = a competent, loyal, durable bureaucracy.
              label: 'The Mandate makes the throne ACCOUNTABLE: a ruler keeps power only by ruling well, so good government is the price of legitimacy — and a new dynasty can claim Heaven\'s favor instead of mere conquest. The exams then staff the whole empire with trained scholar-officials chosen for learning, so government runs on skill and loyalty to the system rather than on warlords or noble birth. Together a just claim to rule and a competent civil service let the empire outlast any single emperor.',
              right: true,
              next: 'won',
            },
            {
              kind: 'say',
              // ✗ WRONG (the "Mandate = the king can do anything" misread).
              label: 'The Mandate means Heaven made the emperor all-powerful, so whatever he does is right and no one may ever judge or remove him — that fear of the divine is what holds the realm.',
              setFlag: 'u4MandateMisread',
              next: 'reteachMandate',
            },
            {
              kind: 'say',
              // ✗ WRONG (the "exams are just for rich noble birth" misread).
              label: 'The examinations simply confirm the great noble families in the offices they already hold by birth — they are a formality for the highborn, nothing more.',
              next: 'reteachExams',
            },
          ],
        },

        won: {
          onEnter: 'reward',
          text: '(Scholar Dong inclines his head, pleased.) "Precisely so. The Mandate is a leash, not a license — it says even the Son of Heaven must rule WELL or lose all claim; flood, famine, and revolt are read as Heaven\'s warning. And the examinations put the trained, not the born, in charge of the realm\'s thousand tasks — a civil service that keeps working though emperors die. A worthy claim above, a skilled bureaucracy below: that is how the Han holds a world as large as Rome\'s with so little of the legion about it. You have understood China, trader."',
          choices: [
            { label: 'Then I\'ll carry it — a throne that must be earned, and an empire run by the learned.', next: '@close' },
          ],
        },

        reteachMandate: {
          text: '(Scholar Dong raises a finger gently.) "You have turned the Mandate upside down. It does not say the emperor can do anything — it says the OPPOSITE. Heaven grants the throne for good rule and TAKES IT BACK for bad: drought, famine, defeat, and rebellion are read as signs the Mandate is lost, and a ruler who governs cruelly forfeits his right to govern at all. That is what lets a new dynasty rightfully replace a failed one. So it is a check on the throne, not a blank warrant. Knowing that, how does the Mandate help HOLD the empire — and what does the exam add beneath it? Answer me again."',
          choices: [
            { label: 'I see — the Mandate holds rulers ACCOUNTABLE, it does not free them. Let me answer again.', clearFlag: 'u4MandateMisread', next: 'challenge' },
          ],
        },
        reteachExams: {
          text: '(Scholar Dong smiles ruefully.) "Spoken like a man who has never sat one. The whole point of the examinations is that they reach PAST birth: a farmer\'s son who masters the classics may rise to office, and many did. The Han built this so the empire would be run by men chosen for what they KNOW — a trained civil service loyal to the system — instead of by hereditary warlords who might carve the realm into private kingdoms. That is exactly what gives a vast empire competent, durable government. So weigh it again: how do a just claim to rule AND a merit-chosen bureaucracy together hold the empire? Try once more."',
          choices: [
            { label: 'Of course — the exams reward LEARNING over birth and build a lasting civil service. Let me try again.', next: 'challenge' },
          ],
        },
      },
    },

    // ===== (c) THE PRICE OF EMPIRE — slavery and conquest, handled soberly =====
    {
      id: 'ks-price-of-empire',
      npc: 'u4-freedman-athens',
      codexId: 'cx-price-of-empire',
      house: 2,
      houseTitle: 'You weighed the cost beneath the glory',
      houseSub: 'A freed mine-worker marks the House of the Open Road as one honest enough to count what empire is built on.',
      flag: 'u4CostUnderstood',
      achievement: 'ach-honest-ledger',
      start: 'challenge',
      nodes: {
        challenge: {
          text: 'Sosos turns his scarred hands palm-up. "You have admired the voting hill, the Roman roads, the marble that makes a man feel he is standing inside a god\'s house. Now I will ask you the hard thing, and I want a true answer, not a flattering one. The silver I dug at Laurion in the dark — chained, unpaid, expendable — bought the ships and the coins and the leisure that let citizens spend all day on that hill. Across Rome it is the same: conquest brings captives, and captives do the work. So tell me, merchant: what is the TRUE price of all this classical glory?"',
          choices: [
            {
              kind: 'say',
              // ★ RIGHT — sober: glory rested on conquest + mass slavery; the unfree paid for the freedom.
              label: 'The price was paid by the people it was built on. The leisure that let Athenian citizens govern, and the wealth and grain that fed Rome\'s peace, rested on conquest and on the labor of enslaved people who never chose it — in the mines, the fields, the great houses. The same power that brought "peace" and "democracy" to a few was built on the unfreedom of many. To tell the classical world honestly, I have to count that cost, not only the marble.',
              right: true,
              next: 'won',
            },
            {
              kind: 'say',
              // ✗ WRONG (the "it was a golden age, no shadow" misread).
              label: 'There was no real price — it was simply a golden age. The slaves were few and well-treated, and the glory was won fairly; only an ungrateful person would dwell on shadows.',
              setFlag: 'u4GoldenMisread',
              next: 'reteachGolden',
            },
            {
              kind: 'say',
              // ✗ WRONG (the "everyone did it, so it doesn't count" relativizing misread).
              label: 'Every people on earth kept slaves back then, so it does not really count against Athens or Rome — it is just how the world worked and not worth weighing.',
              next: 'reteachExcuse',
            },
          ],
        },

        won: {
          onEnter: 'reward',
          text: '(Sosos lets out a long breath and nods.) "You did not look away. Yes — the freedom of the few was bought with the chains of the many; the roads and the marble and the coin all came at the end of a spear and off the backs of the captured. That does not erase what these empires achieved — the law, the learning, the arts are real. But an honest accounting holds BOTH at once: the gift and its cost. Most travelers want only the gleam. You took the whole weight, and that is the rarer, braver thing. Go well, trader — and write it down true."',
          choices: [
            { label: 'I will — the glory and the cost, counted together, honestly.', next: '@close' },
          ],
        },

        reteachGolden: {
          text: '(Sosos\'s jaw tightens, but his voice stays level.) "I was IN the dark, friend; do not tell me it gleamed. Slavery in these empires was not small and it was not gentle — Athens held tens of thousands; the Laurion mines ate men alive; Rome\'s wars dragged whole cities into bondage. A \'golden age\' that needs the unfree to do its labor has a shadow you are choosing not to see. I am not asking you to hate the marble. I am asking you to be HONEST about what stood under it. So tell me again, plainly: what was the real human price of this glory?"',
          choices: [
            { label: 'I see — I cannot wave the suffering away; the price was real and large. Let me answer again.', clearFlag: 'u4GoldenMisread', next: 'challenge' },
          ],
        },
        reteachExcuse: {
          text: '(Sosos shakes his head slowly.) "\'Everyone did it\' is the oldest way to stop thinking. That it was common does not make it weightless — it means the suffering was VAST, not that it was nothing. And honesty is not about ranking who was worst; it is about telling the whole truth of the place you are studying: that Athens\' freedom and Rome\'s peace were built on people who had neither. Set the excuse down and just weigh THIS world. What did the glory of Athens and Rome actually cost the people who made it possible? Answer me once more."',
          choices: [
            { label: 'You\'re right — common does not mean weightless; I must weigh this empire\'s real cost. Let me try again.', next: 'challenge' },
          ],
        },
      },
    },
  ],

  // ---- Codex: the real ideas this pack teaches ----
  codex: [
    {
      id: 'cx-direct-vs-republic',
      group: 'Unit 4 — Classical Empires',
      title: 'Why scale pushes a state from direct rule toward representation',
      idea: 'Athens practiced DIRECT democracy — citizens voted in person in the Assembly — but citizenship was narrow (free adult men only); Rome, far larger, governed as a REPUBLIC of elected representatives who checked one another, because a body of citizens too large to gather in one place must choose a few to decide for the rest.',
      source: 'Pheidias the Younger, clerk of the Athenian Assembly',
    },
    {
      id: 'cx-pax-romana',
      group: 'Unit 4 — Classical Empires',
      title: 'How Rome held a vast empire — the Pax Romana',
      idea: 'Rome held a Mediterranean-wide empire in a long peace (the Pax Romana) not by fear alone but by an integrated machine: ROADS that moved law, officials, and legions quickly; ONE common law and court system binding every province into a single order; and a standing ARMY that guarded the frontiers and backed the law.',
      source: 'Lucius Verca, a Roman jurist abroad in Athens',
    },
    {
      id: 'cx-mandate-merit',
      group: 'Unit 4 — Classical Empires',
      title: 'How Han China held a vast empire — Mandate of Heaven and merit exams',
      idea: 'Han China held an empire as large as Rome\'s with far less force by two ideas: the Mandate of Heaven, which granted legitimacy only to a ruler who governed justly and could be withdrawn (holding even the emperor accountable), and a merit civil-service examination system that staffed government with trained scholar-officials chosen for learning rather than birth, producing a competent bureaucracy that outlasted any single ruler.',
      source: 'Scholar Dong, a candidate for the Han civil service',
    },
    {
      id: 'cx-price-of-empire',
      group: 'Unit 4 — Classical Empires',
      title: 'The price of classical empire — conquest and slavery',
      idea: 'The achievements of the classical empires — Athenian citizens\' leisure to govern, Rome\'s wealth and peace — rested on conquest and on the labor of large numbers of enslaved people who never chose it; an honest account of the classical world holds both its real accomplishments and the human cost beneath them.',
      source: 'Sosos, a freed worker of the Laurion silver mines',
    },
  ],

  // ---- Achievements: sparse, meaningful ----
  achievements: [
    {
      id: 'ach-who-decides',
      title: 'Who Decides, and How',
      desc: 'You understood why a small city can rule itself directly while a vast power must elect representatives — scale itself reshapes government.',
    },
    {
      id: 'ach-machinery-of-empire',
      title: 'The Machinery of Empire',
      desc: 'You understood how huge empires actually hold together — Rome by roads, common law, and army; Han China by the Mandate of Heaven and a merit civil service.',
    },
    {
      id: 'ach-honest-ledger',
      title: 'The Honest Ledger',
      desc: 'You weighed the cost beneath the glory — that classical greatness was built on conquest and slavery — and chose to record the whole truth.',
    },
  ],
};

export default pack;
