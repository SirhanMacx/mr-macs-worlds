// u6-postclassical.js — STORY PACK · Global History 9, Unit 6 (Post-Classical).
//
// Pure DATA module — no imports, no engine calls — so it can never crash the world
// on its own. The loader in ../game.js wires everything below into the live game
// (adds NPCs, fires cutscenes once, makes keystones reachable, records Codex
// entries, lifts House Standing, unlocks achievements). See CONTRACT.md for the
// authoritative spec; structure copied from the gold-standard unit3-belief-systems.js.
//
// THIS PACK teaches four real Unit-6 keystones across the post-classical
// Mediterranean and the Mongol steppe-road:
//   (a) FEUDALISM arose as a RESPONSE to collapse and insecurity after Rome and
//       Charlemagne broke apart — protection traded for service, power scattered
//       down to whoever could defend the land. (Florence / medieval Italy.)
//   (b) The CRUSADES were a TWO-WAY EXCHANGE, not only a war — Europe came home
//       richer in Greek learning, sugar, citrus, and the banking/credit habits of
//       the Levant. (Byblos / the Crusader coast of Outremer.)
//   (c) The PAX MONGOLICA made the Silk Road SAFER THAN EVER — one law, one
//       protected road from China to Persia — so the Mongols did not only destroy;
//       they also connected and guarded the greatest trade the world had seen.
//       (Chang'an / the Yuan-era eastern terminus.)
//   (d) The BLACK DEATH rode the VERY ROUTES that brought prosperity — connection's
//       dark side; the plague followed the caravans and the galleys. (Florence,
//       1348, Boccaccio's plague city.)
//
// Honest pedagogy: every figure, place and date is real. The mentor voices are
// fictional in-world denizens (a reeve, a factor, a road-warden, a physician) who
// PARAPHRASE the historical record (feudal oaths, the Yam relay, Boccaccio's
// Decameron, Gabriele de' Mussi's account of Caffa) — no invented verbatim quotes.
// De-identified: the only real living person ever named is "Mr. Maccarello".

export const pack = {
  // ---- identity ----
  id: 'u6-postclassical',
  unit: 'Unit 6 — Post-Classical',          // the Codex group + author-facing label
  title: 'After Rome: Lords, Crusades, the Khan\'s Road, and the Plague',

  // ---- extra characters added to the world ----
  // All are fictional period-true denizens who carry a keystone tree (the MENTOR
  // who re-teaches on a wrong answer is built into each tree). Each is placed at an
  // EXISTING city with an offset that avoids the core NPCs there.
  npcs: [
    {
      // (a) FEUDALISM — a manor reeve at Florence (medieval Tuscany).
      id: 'u6-reeve-tuscany',
      name: 'Gualtieri',
      title: 'Reeve of a Tuscan Manor',
      city: 'florence',                  // existing CITIES id (Lorenzo sits at [6,-4])
      era: 3,                            // post-classical; hidden until Era III
      offset: [-7, 5],                   // clear of Lorenzo at [6,-4]
      hatKind: 'brim',
      palette: { robe: 0x5a6e3c, trim: 0x3a4726, skin: 0xc98a5b, hat: 0x3a4726 },
      keystoneId: 'ks-feudalism',
      introText: 'Down from the bank houses, are you? Up here the world is older and harder. I keep this manor for my lord — count the sheaves, judge the small quarrels, see the road kept. My grandfather remembered when Charlemagne\'s empire still seemed whole. Then it broke, and the Northmen came up every river, and there was no emperor near enough to save anyone. Sit a moment — there is a thing about how we live now, and WHY, that a trader ought to understand.',
      afterText: 'You have it: when the great roof of empire falls in, men build small shelters under the rubble. My lord gives me protection and a strip of land; I give him my labor and my loyalty. No emperor, no salaried army — just oath bound to oath, all the way up. It is not the strongest way to run a world. It is the way that works when no one strong is left.',
    },
    {
      // (b) CRUSADES as two-way exchange — a Genoese factor on the Levant coast.
      id: 'u6-factor-outremer',
      name: 'Anselmo',
      title: 'Genoese Factor of the Levant Coast',
      city: 'byblos',                    // existing CITIES id (Zimrida [6,3], Anath [-4,-7])
      era: 3,
      offset: [-7, 6],
      hatKind: 'cap',
      palette: { robe: 0x7a3030, trim: 0x4a1a1a, skin: 0xd9a066, hat: 0x4a1a1a },
      keystoneId: 'ks-crusades-exchange',
      introText: 'A western ledger! Then we speak the same tongue. My house keeps a counting-room here in the Crusader ports — Outremer, "the land beyond the sea," the Latins call it. The knights came east for the holy places and the war runs on, bloody as ever. But a factor watches the wharves, not the walls — and what comes off these ships home to Genoa and Venice is changing the West more than any battle. Ask me about it; you will not guess the half.',
      afterText: 'You understand now: the Crusades spilled blood for two centuries, yes — but the wharves carried more than soldiers. Greek and Arabic learning long lost to the West, sugar and citrus and silk, the habits of credit and bills of exchange that built our banks. Europe sailed east to take a tomb and sailed home with a library, a spice rack, and a banking system. War was the door; exchange walked through it both ways.',
    },
    {
      // (c) PAX MONGOLICA — a road-warden of the Yam relay at the Silk Road's east.
      id: 'u6-warden-yam',
      name: 'Toghan',
      title: 'Warden of the Khan\'s Road',
      city: 'changan',                   // existing CITIES id (Zhang Qian [-6,-4], Vandak [7,4])
      era: 3,
      offset: [-7, 6],
      hatKind: 'cap',
      palette: { robe: 0x4a5a7a, trim: 0x2a3450, skin: 0xc98a5b, hat: 0x2a3450 },
      keystoneId: 'ks-pax-mongolica',
      introText: 'You flinch at the name Mongol — most western merchants do; you have heard only the burning. Hear the other half from a man who keeps the road. I am a warden of the Yam, the Khan\'s relay: post stations a day apart, fresh horses, guards, the paiza tablet that opens every gate from Khanbaliq to Persia. The empire that frightened you also did a thing no empire ever managed before. Let me set you a question, and weigh it like a trader, not like a frightened priest.',
      afterText: 'There — you see past the fire. Yes, the conquest was terrible; I will not pretty it. But once the Khans held the whole road, they wanted it RICH, so they made it SAFE: one law, one relay, one peace from the Pacific to Persia. A merchant could cross the world and arrive, the chroniclers wrote, with gold untouched. The Mongols did not only destroy. For a hundred years they connected and guarded the greatest trade the earth had known.',
    },
    {
      // (d) BLACK DEATH — a physician in plague-struck Florence, 1348.
      id: 'u6-physician-florence',
      name: 'Maestro Dino',
      title: 'Physician of Plague-Time Florence',
      city: 'florence',                  // same city as the reeve; far-apart offset
      era: 4,                            // 1348 is end of the post-classical arc → Era IV
      offset: [7, 6],                    // clear of Lorenzo [6,-4] and the reeve [-7,5]
      hatKind: 'hood',
      palette: { robe: 0x3a3a3a, trim: 0x1c1c1c, skin: 0xc98a5b, hat: 0x1c1c1c },
      keystoneId: 'ks-black-death',
      introText: 'Keep your distance, friend, and I will keep mine — it is wiser now than it was a year ago. I am a physician, though physic is little use against this. They are calling it the Great Mortality. It came off the ships at Messina last year and it is in our streets now; Boccaccio writes that they bury them in trenches, layered like ship\'s cargo. I have a question that haunts every merchant who survives. Ask it of me and learn the cost no ledger shows.',
      afterText: 'Now you carry the hard truth with the prosperity: the same roads and galleys that made us rich brought the death among us. The plague did not fall from the sky — it RODE the trade, out of the east along the caravan tracks, onto the Black Sea galleys, into every port that prospered. Connection is a blessing and a blade. The merchant who forgets the second edge of it is the one who carries it home.',
    },
  ],

  // ---- named story-beat sequences (playCutscene format) ----
  cutscenes: {
    // Frames the post-Roman insecurity question the first time the player reaches
    // Florence in Era III — before meeting the reeve.
    U6_AFTER_ROME: [
      {
        tint: 'cold', kicker: 'Tuscany — after the great roof fell', art: 'notice',
        text: 'Above the bankers\' city the hills are studded with stone towers and walled manors, each guarding its own valley. Old folk on the road still speak of a time when one emperor\'s peace ran from the Atlantic to the Elbe — Charlemagne\'s. Then it shattered among his grandsons, the Northmen rowed up every river to burn, and the Magyars and Saracens raided the rest. No emperor could come. People learned to look to whoever was near enough to protect them.',
      },
      {
        tint: 'stone', kicker: 'A reeve\'s riddle', art: 'portrait',
        palette: { robe: 0x5a6e3c, trim: 0x3a4726, skin: 0xc98a5b, hat: 0x3a4726 },
        text: 'A weathered man with a tally-stick eyes your pack. "Trader. Look at this country — a hundred little lords, each with his own keep and his own armed men, swearing up a ladder of oaths to a king who can barely command any of them. No tax-paid army, no imperial road-wardens, no distant law. Ask yourself the real question: WHY would a whole world organize itself this way? What were they all so afraid of?" His name is Gualtieri the reeve.',
        cta: 'Go and ask the reeve',
      },
    ],

    // Frames the Mongol road question when the world reaches Era III generally
    // (the steppe peace is the era's quiet engine).
    U6_KHANS_PEACE: [
      {
        tint: 'amber', kicker: 'The road no one expected', art: 'notice',
        text: 'Word runs the caravanserais like wind: the road east is OPEN — truly open, end to end, in a way no graybeard remembers. The Mongol khans, whose grandfathers burned a hundred cities, now hold every mile of it under one law. Merchants who would never have dared the steppe a lifetime ago speak of riding from the Italian ports to Khanbaliq and back, papers stamped, horses waiting, the whole length of the world guarded. They have a phrase for it on the road: the Khan\'s peace.',
      },
    ],
  },

  // ---- triggers: when each cutscene fires (once) ----
  triggers: [
    {
      on: 'visit', value: 'florence', play: 'U6_AFTER_ROME',
      reward: { house: 1, title: 'A riddle from the hills', sub: 'Tuscany asks you why a broken world built itself out of oaths.' },
    },
    {
      on: 'enter', value: 3, play: 'U6_KHANS_PEACE',
      reward: { house: 1, title: 'The road is open end to end', sub: 'The Khan\'s peace throws the whole Silk Road wide — for those who understand why.' },
    },
  ],

  // ---- THE CORE: keystones ----
  keystones: [
    // ============================================================= (a) FEUDALISM
    {
      id: 'ks-feudalism',
      npc: 'u6-reeve-tuscany',
      codexId: 'cx-feudalism',
      house: 2,
      houseTitle: 'You read why a broken world bound itself in oaths',
      houseSub: 'A Tuscan reeve marks the House of the Open Road as one that understands the cost of collapse.',
      flag: 'u6FeudalismUnderstood',
      achievement: 'ach-shelter-in-the-rubble',
      start: 'challenge',
      nodes: {
        challenge: {
          text: 'Gualtieri leans on his tally-stick. "So. Rome fell long ago; Charlemagne raised one last great empire and it broke apart among his heirs within a single lifetime. After that — Northmen up every river, Magyars on horseback, no emperor who could reach a burning village in time. And out of that came THIS: a hundred lords in a hundred keeps, each man swearing service to the lord above him for protection and a plot of land, power scattered into a thousand little hands. Tell me, trader who has crossed safer roads than these — WHY did the whole West organize itself into feudalism? What does this strange ladder of oaths actually DO for people?"',
          choices: [
            {
              kind: 'say',
              // ★ RIGHT — feudalism as a response to collapse/insecurity: protection
              // traded for service when no central power could defend anyone.
              label: 'Because the central power that once protected everyone was gone — no emperor, no paid army, no distant law to stop the raiders. So people made their own security close to home: a lord gives you protection and land, and in return you give him service and loyalty. Feudalism is what a frightened, leaderless world builds — decentralized power, protection traded for service, because the only safety left was the lord who was actually near enough to fight for you.',
              right: true,
              next: 'won',
            },
            {
              kind: 'say',
              // ✗ WRONG (seductive misread) — "the lords were just greedy / it was
              // designed to oppress the peasants." Re-routes, re-teaches, loops back.
              label: 'Because the lords were simply greedy and clever — they invented this to trap free people into serving them. It is nothing but a scheme of oppression dressed up as an oath.',
              setFlag: 'u6GreedMisread',
              next: 'reteachGreed',
            },
            {
              kind: 'say',
              // ✗ WRONG (other common misread) — "a king deliberately designed it
              // as a tidy system from the top down."
              label: 'Because a wise king sat down and designed it — a tidy pyramid, planned from the throne down, the way an architect plans a cathedral.',
              next: 'reteachDesigned',
            },
          ],
        },
        won: {
          onEnter: 'reward',
          text: '(Gualtieri nods, slow and grim.) "Aye — you see the fear under the oath. When the roof of empire fell in, no one was coming to save you. So you knelt to the man with the keep and the armed riders, and you said: protect me, and I am yours — my labor, my loyalty, my sons in your fields and your wars. He said: I will, and here is land to live on. No tax, no salaried legion, no far-off law — just oath bound to oath, all the way up to a king who is barely first among equals. It is a weak, splintered way to hold a world together. But when nothing strong is left, it is the way that WORKS." He taps the tally-stick on the stone. "Carry that, and you understand half the Middle Ages."',
          choices: [
            { label: 'Then I\'ll carry that understanding down the road.', next: '@close' },
          ],
        },
        reteachGreed: {
          text: '(Gualtieri does not bristle; he just shakes his head.) "There was greed in it — there is greed in everything men do. But greed is not why it APPEARED. Ask yourself: the serf binds himself to the lord, yes — but what does the lord owe back? Protection. Real protection, walls and armed men, when the alternative was a raider\'s torch and no help for a hundred miles. A man does not kneel to greed; he kneels to FEAR, and trades his freedom for a wall to stand behind. The bargain was harsh both ways. Now — what made that fearful bargain the only one on offer? What had just collapsed?" He waits. "Weigh it again."',
          choices: [
            { label: 'I see — it was protection traded for service when the wall of empire was gone. Let me answer again.', clearFlag: 'u6GreedMisread', next: 'challenge' },
          ],
        },
        reteachDesigned: {
          text: '(Gualtieri almost laughs.) "No king designed this, friend. No one sat at a throne and drew a pyramid. It GREW — village by village, oath by oath, out of pure necessity, as each frightened man bound himself to the nearest strong one. That is why it is so messy: a thousand local bargains, not one grand plan. It did not come from a king\'s strength. It came from a king\'s WEAKNESS — from the fact that no central power was left to protect anyone. Think less about clever planning and more about who had collapsed, and why people had to fend for themselves. Try her once more."',
          choices: [
            { label: 'Of course — it grew up from below because the center had collapsed. Let me try again.', next: 'challenge' },
          ],
        },
      },
    },

    // ====================================================== (b) CRUSADES EXCHANGE
    {
      id: 'ks-crusades-exchange',
      npc: 'u6-factor-outremer',
      codexId: 'cx-crusades-exchange',
      house: 2,
      houseTitle: 'You read the Crusades as a road that ran both ways',
      houseSub: 'A Genoese factor marks your house as one that sees exchange where others see only the war.',
      flag: 'u6CrusadesUnderstood',
      achievement: 'ach-the-road-runs-both-ways',
      start: 'challenge',
      nodes: {
        challenge: {
          text: 'Anselmo sweeps a hand at the crowded wharves. "Everyone at home tells the Crusades as one story: knights sail east, fight the Muslims for the holy places, win some, lose more, sail home. Two hundred years of blood — true enough. But I am a factor; I count what comes OFF these ships, not what dies on the walls. And what flows west off this coast is remaking Europe. Tell me, trader — when you weigh the whole Crusades, what do you SEE? Were they only a war?"',
          choices: [
            {
              kind: 'say',
              // ★ RIGHT — the Crusades as a two-way exchange: Europe gained Greek/Arab
              // learning, sugar, citrus, banking/credit habits, not only fought a war.
              label: 'No — they were a war, but they were also an exchange that ran both ways. Sailing east to fight, Europe rediscovered Greek and Arabic learning the West had lost, and came home wanting sugar, citrus, silk, and spices it had only tasted here. And to finance the whole thing — armies, fleets, ransoms — the West learned the Levant\'s habits of credit, bills of exchange, and banking. Europe set out to take a tomb and came home richer in books, goods, and money-craft. The war was the door; the real lasting story is what came back through it.',
              right: true,
              next: 'won',
            },
            {
              kind: 'say',
              // ✗ WRONG (seductive misread) — "it was purely a religious war, nothing
              // else mattered." Re-routes, re-teaches, loops back.
              label: 'No — it was purely a holy war, start to finish. Faith against faith over the holy places, and nothing else about it matters or lasts.',
              setFlag: 'u6HolyWarOnly',
              next: 'reteachHolyWar',
            },
            {
              kind: 'say',
              // ✗ WRONG (one-way misread) — "Europe brought civilization TO the East;
              // the traffic only went one way."
              label: 'Yes, an exchange — but a one-way one: Europe carried its faith and its civilization OUT to a backward East, and gained nothing worth naming in return.',
              next: 'reteachOneWay',
            },
          ],
        },
        won: {
          onEnter: 'reward',
          text: '(Anselmo grins like a man who has just been understood.) "There it is — the road that runs both ways. Off these wharves go the things that will rebuild the West: Aristotle and the Greek geometers, kept and improved by Arab and Byzantine scholars and copied back into Latin. Sugar cane and citrus and the silks the knights\' wives will not now live without. And the money-craft, friend — the bills of exchange, the letters of credit, the way to move a fortune across the sea without a single coin in the hold. Genoa and Venice grow fat on it; their banks are built on it. Europe sailed east for a holy war and sailed home with a renaissance in its cargo." He lowers his voice. "Tell that story at home. Most never hear it."',
          choices: [
            { label: 'I\'ll carry both halves of it home — the war and the exchange.', next: '@close' },
          ],
        },
        reteachHolyWar: {
          text: '(Anselmo shakes his head, not unkindly.) "Holy it was — I have stood in the churches and heard the vows. But \'nothing else matters\' is what a chronicler says, not what a factor sees. Stand on this wharf one morning and watch: sugar and citrus and silk going aboard for Genoa; chests of Greek manuscripts a Latin abbey will pay a fortune to copy; and the banking houses opening their letters of credit to finance the next fleet. Two centuries of contact between West and East does not leave only graves. What do you think CROSSED, in all that traffic, besides arrows? Weigh it again."',
          choices: [
            { label: 'I see — alongside the war, goods and learning and money-craft crossed both ways. Let me answer again.', clearFlag: 'u6HolyWarOnly', next: 'challenge' },
          ],
        },
        reteachOneWay: {
          text: '(Anselmo laughs, short and sharp.) "One-way? Friend, you have the direction backwards. When the knights arrived, it was the Latin West that was the poorer cousin — the East had cities, libraries, medicine, mathematics, plumbing, sugar, while many a crusader lord could not read. The lasting traffic flowed WEST: Greek learning the West had forgotten, Arab advances in medicine and algebra, the goods and the banking. Europe did not bring civilization here; it carried civilization HOME. Think about which side had the library — and try once more."',
          choices: [
            { label: 'Of course — the rich exchange flowed back into Europe. Let me try again.', next: 'challenge' },
          ],
        },
      },
    },

    // ===================================================== (c) PAX MONGOLICA
    {
      id: 'ks-pax-mongolica',
      npc: 'u6-warden-yam',
      codexId: 'cx-pax-mongolica',
      house: 2,
      houseTitle: 'You saw past the fire to the Khan\'s open road',
      houseSub: 'A warden of the Yam marks your house as one that understands the Mongols connected as well as conquered.',
      flag: 'u6PaxMongolicaUnderstood',
      achievement: 'ach-one-law-one-road',
      start: 'challenge',
      nodes: {
        challenge: {
          text: 'Toghan settles cross-legged, the paiza tablet at his belt. "You came in afraid of the word Mongol. Good — be honest about the burning; it was real, whole cities put to the sword. But now weigh the OTHER thing the Khans did, for it is just as real. Once they held the entire road — from the Pacific to Persia, every khanate under one family\'s law — a merchant could cross the whole world. The chroniclers wrote a maiden could walk the road alone with a basket of gold and arrive untouched. So tell me, trader: what did the Mongol empire DO for the Silk Road? Did they only destroy it?"',
          choices: [
            {
              kind: 'say',
              // ★ RIGHT — Pax Mongolica: one law, one protected relay road made trade
              // safer than ever; Mongols connected and guarded, not only destroyed.
              label: 'No — once they ruled the whole road, they made it safer than it had ever been. One empire, one law from China to Persia, the Yam relay with fresh horses and guards and the paiza tablet that opens every gate. The Mongols wanted the road rich, so they protected it — and goods, ideas, and people moved across the whole of Eurasia under one peace. They conquered, terribly, but then they CONNECTED and GUARDED the greatest trade the world had known.',
              right: true,
              next: 'won',
            },
            {
              kind: 'say',
              // ✗ WRONG (seductive misread) — "the Mongols only destroyed; they were
              // nothing but a wrecking storm." Re-routes, re-teaches, loops back.
              label: 'No — the Mongols only destroyed. They were a storm of horsemen, nothing but ruin and ash; whatever trade survived did so in spite of them, never because of them.',
              setFlag: 'u6OnlyDestroyed',
              next: 'reteachOnlyDestroyed',
            },
            {
              kind: 'say',
              // ✗ WRONG (other misread) — "they helped trade by pure accident, with no
              // intent; the peace was just luck."
              label: 'Trade got safer, true — but only by blind luck. The Khans never meant to help merchants; the peace was an accident nobody planned or protected.',
              next: 'reteachAccident',
            },
          ],
        },
        won: {
          onEnter: 'reward',
          text: '(Toghan touches the paiza at his belt with quiet pride.) "Yes. You see the whole of it now, not just the smoke. The conquest was savage — I will never deny it. But a wrecker does not build relay stations a day apart and stock them with fresh horses; a wrecker does not stamp a tablet that makes every guard from Khanbaliq to Tabriz your servant. The Khans wanted the road to POUR wealth into their treasuries, so they made the whole of it one law and one peace — the Pax Mongolica, the western scholars will call it. For a hundred years a merchant crossed the earth and arrived. They destroyed, and then they connected. Both are true, and a wise trader holds both." He nods you on. "Ride safe. The road is open."',
          choices: [
            { label: 'Then I\'ll ride it knowing both halves of the truth.', next: '@close' },
          ],
        },
        reteachOnlyDestroyed: {
          text: '(Toghan does not take offense; he has heard it a hundred times.) "The destruction was real — I told you so first, and I meant it. But \'only\' is the word that blinds you. Look at what you are standing on: a relay road of post stations, fresh horses, armed guards, all built and paid for by the Khans. Why would a mere wrecker build that? They built it because a SAFE road is a RICH road, and they wanted the riches. Trade did not survive in spite of them on this stretch — it flourished BECAUSE of the peace they imposed. Ask yourself why conquerors who could take anything would choose to guard the merchants instead of robbing them. Weigh it again."',
          choices: [
            { label: 'I see — they guarded the road because a safe road made them rich. Let me answer again.', clearFlag: 'u6OnlyDestroyed', next: 'challenge' },
          ],
        },
        reteachAccident: {
          text: '(Toghan shakes his head firmly.) "No accident, friend. Look at the Yam with open eyes — the post stations did not place themselves a day\'s ride apart; the horses did not stable themselves; the paiza tablet did not carve itself. All of it was DESIGNED, ordered from the top, paid for and patrolled, precisely so trade and the Khan\'s messengers could cross the empire fast and safe. The peace was a policy, not a stroke of luck — because the Khans understood, as you do, that a guarded road fills a treasury. Think about who built the relay and why, and try once more."',
          choices: [
            { label: 'Of course — the safe road was deliberate policy, not luck. Let me try again.', next: 'challenge' },
          ],
        },
      },
    },

    // ===================================================== (d) BLACK DEATH
    {
      id: 'ks-black-death',
      npc: 'u6-physician-florence',
      codexId: 'cx-black-death',
      house: 2,
      houseTitle: 'You named connection\'s dark edge',
      houseSub: 'A plague-time physician marks your house as one that understands the roads carried death as well as wealth.',
      flag: 'u6BlackDeathUnderstood',
      achievement: 'ach-the-second-edge',
      start: 'challenge',
      nodes: {
        challenge: {
          text: 'Maestro Dino keeps his careful distance. "You have spent this whole journey learning how the roads made the world rich — the Khan\'s open road, the Crusader wharves, the caravans pouring east and west. Now learn the price of it, here in 1348, with the bells tolling all day for the dead. They are calling it the Great Mortality. It came west out of the east — off a Black Sea galley at Caffa, the chroniclers say, and onto the ships, and into every prosperous port in turn. Tell me, trader who knows the trade routes better than most: HOW did this death travel so far, so fast, into every corner of the known world?"',
          choices: [
            {
              kind: 'say',
              // ★ RIGHT — the plague rode the very trade routes that brought prosperity:
              // connection's dark side. The dense, connected network spread it fast.
              label: 'It rode the very trade routes that made us rich. The same caravans and galleys that carried silk and spice west out of the east carried the plague with them — port to port, fair to fair, along the busiest, most connected roads on earth. The death did not fall from the sky; it followed the trade. The connection that brought prosperity is exactly what spread the disaster — that is the dark edge of a connected world.',
              right: true,
              next: 'won',
            },
            {
              kind: 'say',
              // ✗ WRONG (period-true but causally wrong) — "God's punishment / bad air,
              // sent from heaven, nothing to do with trade." Re-routes, re-teaches.
              label: 'It fell upon us from Heaven — a punishment for our sins, or a poison in the very air, sent by God. It has nothing to do with roads or trade; no merchant carried it.',
              setFlag: 'u6WrathMisread',
              next: 'reteachWrath',
            },
            {
              kind: 'say',
              // ✗ WRONG (disconnect misread) — "isolated places caught it too, so trade
              // can't be how it spread."
              label: 'It must have arisen on its own in each place at once — even remote villages caught it, so the trade roads cannot be how it traveled at all.',
              next: 'reteachIsolated',
            },
          ],
        },
        won: {
          onEnter: 'reward',
          text: '(Maestro Dino bows his hooded head.) "You have it, and it is a bitter thing to have. Trace the death on a map and it is a map of TRADE: out of the east along the caravan roads, to Caffa on the Black Sea, onto the Genoese galleys, to Messina, to Genoa, to Marseille, up every river and road to every fair — fastest exactly where the world was most connected. The merchants did not mean to carry it. But the very network that moved their fortunes moved the pestilence in the same holds, the same caravans, the same crowded ports. The world had woven itself together as never before — and so, for the first time, a plague could travel the whole of that weave." He steps back. "Remember it on every road you ride: connection is a blessing AND a blade."',
          choices: [
            { label: 'I\'ll carry that knowledge — and ride more carefully for it.', next: '@close' },
          ],
        },
        reteachWrath: {
          text: '(Maestro Dino does not scold; the fear is honest enough.) "Half the city believes exactly that, and the priests preach it. But look with a merchant\'s eyes, not a frightened soul\'s. If it were only Heaven\'s wrath falling everywhere at once, why does it arrive in a city the very season the galleys do — and strike the busy ports first, and the lonely mountain hamlets last or never? It does not rain down evenly; it TRAVELS, and it travels the trade lanes, port after port, in step with the ships. Ask yourself what moves city to city in exactly that pattern. What did those galleys at Caffa carry besides cargo? Weigh it again."',
          choices: [
            { label: 'I see — it travels port to port with the ships, not down from the sky. Let me answer again.', clearFlag: 'u6WrathMisread', next: 'challenge' },
          ],
        },
        reteachIsolated: {
          text: '(Maestro Dino shakes his head gently.) "It reached far, yes — even small places, in the end. But not all at once, and not on their own. Watch the order of it: the great connected ports first — Caffa, Messina, Genoa, Marseille — then up the roads and rivers from those hubs, and only LAST the places hardest to reach, some of which it spared entirely. That is the signature of something CARRIED, spreading outward from the busiest crossroads along the lines of travel. The remote village did not invent the plague; the plague walked to it, late, down a road from a market town. Think about the ORDER it arrived in, and try once more."',
          choices: [
            { label: 'Of course — it spread outward from the busy hubs along the travel routes. Let me try again.', next: 'challenge' },
          ],
        },
      },
    },
  ],

  // ---- Codex: the real ideas this pack teaches ----
  codex: [
    {
      id: 'cx-feudalism',
      group: 'Unit 6 — Post-Classical',
      title: 'Why feudalism arose: protection traded for service',
      idea: 'When central authority collapsed after Rome and Charlemagne and raiders threatened everyone, people built security from the ground up: a lord gave protection and land while vassals and serfs gave service and loyalty, scattering power into many local hands. Feudalism was a response to insecurity, not a planned design.',
      source: 'Gualtieri, reeve of a Tuscan manor (on the feudal bargain after the fall of the Carolingian Empire)',
    },
    {
      id: 'cx-crusades-exchange',
      group: 'Unit 6 — Post-Classical',
      title: 'The Crusades as a two-way exchange',
      idea: 'The Crusades were a centuries-long war, but also a two-way exchange that enriched Europe: contact with the Byzantine and Islamic worlds returned lost Greek and Arab learning to the West and introduced sugar, citrus, silk, spices, and the credit and banking practices that fueled Italian commerce.',
      source: 'Anselmo, Genoese factor of the Levant coast (on what the Crusader ports carried home to Genoa and Venice)',
    },
    {
      id: 'cx-pax-mongolica',
      group: 'Unit 6 — Post-Classical',
      title: 'The Pax Mongolica made the Silk Road safer than ever',
      idea: 'After their brutal conquests the Mongols unified the whole Silk Road under one law, building the Yam relay of post stations, fresh horses, and guards and issuing the paiza passport, so trade and ideas crossed Eurasia more safely than ever before. The Mongols did not only destroy; they also connected and protected the greatest trade network of the age.',
      source: 'Toghan, warden of the Khan\'s road (on the Yam relay and the Mongol peace from China to Persia)',
    },
    {
      id: 'cx-black-death',
      group: 'Unit 6 — Post-Classical',
      title: 'The Black Death rode the trade routes — connection\'s dark side',
      idea: 'The Black Death (c. 1347-1351) spread along the very trade routes that had brought prosperity: out of the east by caravan to the Black Sea port of Caffa, onto Genoese galleys, and into every connected Mediterranean port. The dense, interconnected network that carried wealth also carried catastrophe — connection is both a blessing and a danger.',
      source: 'Maestro Dino, physician of plague-time Florence (on how the Great Mortality of 1348 followed the galleys and caravans)',
    },
  ],

  // ---- Achievements: optional milestones ----
  achievements: [
    {
      id: 'ach-shelter-in-the-rubble',
      title: 'Shelter in the rubble',
      desc: 'You understood feudalism as a response to collapse — protection traded for service when no central power was left to defend anyone.',
    },
    {
      id: 'ach-the-road-runs-both-ways',
      title: 'The road runs both ways',
      desc: 'You understood that the Crusades were a two-way exchange, not only a war — Europe came home richer in learning, goods, and banking.',
    },
    {
      id: 'ach-one-law-one-road',
      title: 'One law, one road',
      desc: 'You saw past the burning to the Pax Mongolica — the Mongols made the Silk Road safer than ever under a single law.',
    },
    {
      id: 'ach-the-second-edge',
      title: 'The second edge of connection',
      desc: 'You understood that the Black Death rode the same trade routes that brought prosperity — the dark side of a connected world.',
    },
  ],
};

export default pack;
