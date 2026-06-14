// density-u4-classical.js — DENSITY STORY PACK: Unit 4, the Classical Empires (more).
//
// Additive, pure-DATA module (no imports, no engine calls — it can never crash
// the world on its own). The loader in ../game.js wires everything below into
// the live game: it adds the NPCs, fires each cutscene once, makes each keystone
// reachable, records the Codex entry, lifts House Standing, and unlocks the
// achievement. See CONTRACT.md for the authoritative field spec, and
// unit3-belief-systems.js for the gold-standard shape this file copies.
//
// This is a SECOND, DENSER pack for Unit 4. The existing `u4-classical` pack
// already teaches: direct democracy vs the Republic, the Pax Romana, the Mandate
// of Heaven + merit exams, and the price of empire (slavery/conquest). This pack
// adds the ideas those leave out, and does NOT duplicate any of them:
//
//   (a) CLASSICAL ACHIEVEMENTS THAT OUTLIVED THE EMPIRES. Not how the empires
//       held together, but what they MADE that the world still uses after they
//       fell. Rome's enduring gifts were practical: written law (the Twelve
//       Tables → the great legal codes) and engineering (roads, aqueducts, the
//       arch and concrete). Greece's enduring gifts were intellectual:
//       philosophy and reasoned inquiry (Socrates' questioning, Aristotle's logic
//       and observation, the start of natural science and geometry). Han China's
//       enduring gifts were administrative and technological: paper and the merit
//       civil-service idea, which outlasted dynasty after dynasty. The keystone
//       idea: an empire's deepest legacy is often its IDEAS and INVENTIONS, which
//       can long outlive its armies and its borders.
//
//   (b) WHY CLASSICAL EMPIRES FELL — a real cause-analysis, not "barbarians."
//       Rome and Han China both came apart for overlapping internal reasons:
//       OVEREXPANSION (the empire grew larger than it could defend or govern);
//       FISCAL STRAIN (the cost of armies and administration outran the taxes,
//       so coins were debased and the burden crushed the farmers); and FRONTIER
//       PRESSURE (migrating and raiding peoples pressing on borders that were
//       already overstretched and underfunded). The keystone idea: great empires
//       usually fall to a COMBINATION of internal weakening and outside pressure,
//       not to a single dramatic blow.
//
// Honest pedagogy: every figure, place, institution, and date named is real.
// Real figures (Socrates, Aristotle, the Twelve Tables, Cai Lun and paper, the
// debasement of Roman coinage, the Yellow Turban revolt, the migrations across
// the Rhine and Danube) are referenced by the historical record; the teaching
// VOICES are fictional in-world denizens (a Stoa philosophy student, a Roman
// road-engineer abroad, a Han papermaker-clerk, a retired frontier officer) so
// nothing is mis-attributed and no fake verbatim quotes are put in real mouths.
// The only real modern person named anywhere is "Mr. Maccarello".

export const pack = {
  // ---- identity ----
  id: 'd-tw-u4-classical-density',
  unit: 'Unit 4 — Classical Empires',         // Codex group (matches the base pack so entries bucket together)
  title: 'What the Classical World Left Behind — and Why It Fell',

  // ---- extra characters added to the world ----
  // All placed at EXISTING cities, with offsets chosen to avoid BOTH the core
  // NPCs AND the base u4-classical pack's NPCs:
  //   Athens core: Herodotus [-7,3], Kallias [8,5]; base u4: clerk [7,-5],
  //     jurist [-6,-6], freedman [9,2].  → free spots used here: [-9,-3], [2,8].
  //   Chang'an core: Zhang Qian [-6,-4], Vandak [7,4], Roshanak [-7,6];
  //     base u4: scholar [6,-5].          → free spots used here: [-9,2], [2,8].
  npcs: [
    {
      id: 'd-tw-u4-philosopher-athens',
      name: 'Aristokleia',
      title: 'A student of the Stoa',
      city: 'athens',
      era: 2,
      offset: [-9, -3],                  // far left, clear of Herodotus [-7,3] and base jurist [-6,-6]
      hatKind: 'none',
      palette: { robe: 0xe4ddca, trim: 0x9a8f6e, skin: 0xd9a066 },
      keystoneId: 'd-tw-u4-ks-greek-legacy',
      introText: 'You have been weighing how Athens VOTES, trader — but stay a moment for the thing Athens will be remembered for longest. The voting hill will fall silent one day; this will not. Here Socrates taught men to question every easy answer; here Aristotle gathers, sorts, and reasons about the whole living world. We learn to ask WHY, and to test the asking. Empires rise and rot — but a way of thinking can outlive every one of them. Let me show you what I mean.',
      afterText: 'Now you carry it: the Parthenon may crumble and the Assembly may scatter, but the HABIT we built here — question, observe, reason, test — does not. That is Greece\'s deepest export. It will travel your roads longer than any amphora of oil, into lands that never heard the name Athens. Go think well, merchant.',
    },
    {
      id: 'd-tw-u4-engineer-athens',
      name: 'Faustus the Surveyor',
      title: 'A Roman road-engineer, abroad in the agora',
      city: 'athens',                    // a Roman engineer studying Greek harbors (Rome is not a world city)
      era: 2,
      offset: [2, 8],                    // bottom-center, clear of Kallias [8,5] and base freedman [9,2]
      hatKind: 'cap',
      palette: { robe: 0xc2bca8, trim: 0x7a2f2f, skin: 0xd9a066, hat: 0x7a2f2f },
      keystoneId: 'd-tw-u4-ks-roman-legacy',
      introText: 'Salve, merchant. I lay out roads for Rome — I came east to study how the Greeks cut a harbor, but everyone here wants to talk about temples and voting. Ask me instead about the things Rome BUILDS, and the things Rome WRITES DOWN. Long after the last legion marches home, you will still travel my roads, drink from our aqueducts, and live under laws that started as our Twelve Tables. Let me show you why those outlast emperors.',
      afterText: 'There it is. Rome\'s greatest bequest is not its conquests — those unravel — but the PRACTICAL frame it leaves standing: roads, arches, aqueducts, and above all a written, public law that later peoples build their own codes upon. Centuries from now men who never wore a toga will still be ruled by Rome\'s idea of law. That is the part of empire that does not die.',
    },
    {
      id: 'd-tw-u4-papermaker-changan',
      name: 'Clerk Wen',
      title: 'A papermaker of the Han records office',
      city: 'changan',
      era: 2,
      offset: [-9, 2],                   // far left, clear of Zhang Qian [-6,-4] and Roshanak [-7,6]
      hatKind: 'scholar',
      palette: { robe: 0x46603c, trim: 0x2a3a24, skin: 0xd9b07c, hat: 0x2a3a24 },
      keystoneId: 'd-tw-u4-ks-han-legacy',
      introText: 'Welcome from the western roads, trader. You have seen our examination halls and our graded officials — but look at what I hold: a sheet of PAPER. Light, cheap, made from bark and rag in our workshops since Cai Lun perfected it. Before paper, knowledge rode on bamboo bundles a man could barely lift, or on silk too dear to waste. Paper is how an idea travels far and cheap. The Han will end — every dynasty does — but paper, and the way we choose officials, will outlive us by a thousand years. Sit; I will tell you why this scrap matters more than a sword.',
      afterText: 'Now you understand the quiet gift. Paper carried the classics that the exams were built on, and it carried them west along your own roads to peoples who never heard of us. The Han falls; the paper and the merit-idea do not. The lightest thing in this office will outweigh every spear in the armory in the long account of the world. Carry that — and carry the paper.',
    },
    {
      id: 'd-tw-u4-officer-changan',
      name: 'Old Bo',
      title: 'A retired officer of the northern frontier',
      city: 'changan',
      era: 2,
      offset: [2, 8],                    // bottom-center, clear of Vandak [7,4] and base scholar [6,-5]
      hatKind: 'cap',
      palette: { robe: 0x5a4636, trim: 0x382a1e, skin: 0xc98a5b, hat: 0x382a1e },
      keystoneId: 'd-tw-u4-ks-why-empires-fall',
      introText: 'You study how empires HOLD, merchant — let an old soldier tell you how they LOSE. I served on the northern walls when the Han was still mighty, and I watched the rot from inside: the realm grown too wide to pay for, the coin worth less each year, the farmers crushed by taxes and the lords swollen, and beyond the wall the horse-peoples pressing harder every season. Rome in the west died of the very same sickness. People want one villain — a barbarian, a bad emperor. The truth is slower and sadder. Stay, and I will tell it straight.',
      afterText: 'So now you know the real shape of a fall: not one blow but many, working together for a hundred years. An empire stretched past what it can defend, a treasury bled white, a people taxed to the bone — and then the pressure at the border finds the cracks already there. Rome and the Han both went this way. Remember it, and you will never again be fooled by a story that blames it all on one enemy at the gate.',
    },
  ],

  // ---- named story-beat sequences (playCutscene format) ----
  cutscenes: {
    // Fires the first time the player reaches Athens in Era II — frames the
    // LEGACY question (what survives an empire) distinct from the base pack's
    // governance cutscene.
    D_TW_U4_LEGACY_INTRO: [
      {
        tint: 'stone', kicker: 'Athens — Beyond the Marble', art: 'notice',
        text: 'You came to Athens for the voting hill and the harbor prices. But walk past the Agora\'s edge, into the shaded colonnades, and a different kind of trade is going on — in ideas. Men argue not over the price of grain but over the nature of justice, the motion of the stars, the right way to reason itself. Someone is asking, of every confident claim, the single dangerous word: WHY?',
      },
      {
        tint: 'amber', kicker: 'What outlasts an empire', art: 'portrait',
        palette: { robe: 0xe4ddca, trim: 0x9a8f6e, skin: 0xd9a066 },
        text: 'A young woman in a plain himation falls into step beside you. "Merchant — you carry oil and silver, but the most valuable cargo in this city weighs nothing. Empires fall; you have surely seen ruins on your roads. So ask the deeper question: when Athens and Rome are dust, what of them will STILL be alive in the world?" She is a student of the Stoa. Find her, and find out.',
        cta: 'Seek the philosopher',
      },
    ],
    // Fires the first time the player reaches Chang'an in Era II — frames the
    // FALL question (why empires die) distinct from the base pack's "how it holds".
    D_TW_U4_FALL_INTRO: [
      {
        tint: 'dusk', kicker: 'Chang\'an — The Long Account', art: 'notice',
        text: 'The Han capital still gleams, but linger in the wineshops near the barracks and you hear another tale under the splendor: tax collectors squeezing harder each year, frontier garrisons begging for pay that never comes, coins that buy less than they did last spring. The empire looks eternal from the avenue. The men who guarded its edges are not so sure.',
      },
      {
        tint: 'dusk', kicker: 'How a great power dies', art: 'portrait',
        palette: { robe: 0x5a4636, trim: 0x382a1e, skin: 0xc98a5b, hat: 0x382a1e },
        text: 'A weathered old man with a soldier\'s bearing waves you to his table. "Trader, you have learned how the Han and Rome HOLD their worlds. Now learn the harder lesson — how worlds this size come apart. It is never the one enemy the storytellers love. Sit with me and I will show you the slow sickness that killed two great empires at once." Seek out the retired frontier officer.',
        cta: 'Hear the old soldier',
      },
    ],
  },

  // ---- triggers: when each cutscene fires (once) ----
  triggers: [
    {
      on: 'visit', value: 'athens', play: 'D_TW_U4_LEGACY_INTRO',
      reward: { house: 1, title: 'What outlasts an empire', sub: 'Athens sets you a deeper riddle: when the marble is dust, what of it is still alive in the world?' },
    },
    {
      on: 'visit', value: 'changan', play: 'D_TW_U4_FALL_INTRO',
      reward: { house: 1, title: 'The long account', sub: 'Chang\'an sets you the hard question of how a great empire actually comes apart.' },
    },
  ],

  // ---- THE CORE: keystones ----
  keystones: [
    // ===== (a-Greece) GREEK PHILOSOPHY & SCIENCE — a way of thinking that outlived Athens =====
    {
      id: 'd-tw-u4-ks-greek-legacy',
      npc: 'd-tw-u4-philosopher-athens',
      codexId: 'd-tw-u4-cx-greek-legacy',
      house: 2,
      houseTitle: 'You saw the cargo that weighs nothing',
      houseSub: 'A student of the Stoa marks the House of the Open Road as one that grasps why a way of thinking outlives the city that made it.',
      flag: 'd-tw-u4-greekLegacyUnderstood',
      achievement: 'd-tw-u4-ach-ideas-outlive-empires',
      start: 'challenge',
      nodes: {
        challenge: {
          text: 'Aristokleia sits on a worn step in the colonnade. "Let me set the riddle plainly, merchant. Athens gave the world the voting hill — but other cities will rule, and that will pass. What Athens gave that does NOT pass is harder to point at. Socrates taught us to question every confident answer until it cracks; Aristotle gathers and sorts the whole living world and reasons from what he observes; men here measure the heavens and prove theorems that will be true forever. So tell me: WHY would these things — philosophy, logic, the start of reasoned science — outlive Athens herself, when her ships and her empire will not?"',
          choices: [
            {
              kind: 'say',
              // ★ RIGHT — ideas/methods are portable, copyable, and not bound to one state's power.
              label: 'Because an idea is not a possession that can be conquered. A way of thinking — to question claims, to observe carefully, to reason and prove — can be taught, copied, written down, and carried anywhere, by anyone, even by peoples who never heard of Athens. Armies and empires are tied to one power and one place, so they fall with it; but a method of inquiry has no borders and no garrison to lose. That is why Greek philosophy and science outlive the city that bore them.',
              right: true,
              next: 'won',
            },
            {
              kind: 'say',
              // ✗ WRONG (the "it survives only because Athens stayed powerful" misread).
              label: 'Because Athens will simply stay powerful forever, so its learning lasts only as long as Athenian armies make people respect it. Take away Athens\' power and the philosophy dies with it.',
              setFlag: 'd-tw-u4-powerMisread',
              next: 'reteachPower',
            },
            {
              kind: 'say',
              // ✗ WRONG (the "it's just clever talk, not real legacy" misread).
              label: 'It would not really outlive Athens at all — philosophy is just clever talk for idle men. The roads and the coins are the only real legacy; arguments in a colonnade leave nothing behind.',
              next: 'reteachIdle',
            },
          ],
        },

        won: {
          onEnter: 'reward',
          text: '(Aristokleia smiles and taps her temple.) "Yes — you see why it is the lightest cargo and the most lasting. A spear must be carried by a man and held by an army; an idea, once spoken and written, copies itself into every mind that hears it and crosses every border without a toll. When Athens is ruins, students in lands she never touched will still question, observe, and reason in the way we taught here. That habit IS Greece\'s empire — the only one that cannot be conquered. Your house has the thanks of the Stoa."',
          choices: [
            { label: 'Then I\'ll carry it — ideas have no borders, so they outlive the empire.', next: '@close' },
          ],
        },

        reteachPower: {
          text: '(Aristokleia shakes her head, gently.) "You have chained the idea to the army — but look at how knowledge actually travels. A theorem proved in Athens stays true whether or not a single Athenian soldier still stands; men in Egypt, in Persia, in lands far past our reach learn it and pass it on. The whole POINT of a reasoned method is that anyone can test it and keep it — it needs no fleet to protect it. So set Athens\' power aside, for it will fade. Ask again: what is it ABOUT a way of thinking that lets it outlive the state that first taught it?"',
          choices: [
            { label: 'I see — an idea can be copied and carried by anyone, so it does not need Athens\' power. Let me answer again.', clearFlag: 'd-tw-u4-powerMisread', next: 'challenge' },
          ],
        },
        reteachIdle: {
          text: '(Aristokleia laughs, not unkindly.) "Idle talk? Friend, the questioning we do here becomes the way later peoples build medicine, law, astronomy, and government itself. To ask WHY, and to test the answer, is not decoration — it is the engine under everything you call practical. And unlike a road that one flood can wash out, a proof or a method, once written, can be relearned forever from a single surviving copy. So do not mistake the colonnade for emptiness. Tell me again: why would this way of thinking outlast the city that made it?"',
          choices: [
            { label: 'You\'re right — a method of inquiry is real legacy, and it can be carried and relearned anywhere. Let me try again.', next: 'challenge' },
          ],
        },
      },
    },

    // ===== (a-Rome) ROMAN LAW & ENGINEERING — the practical frame that outlived Rome =====
    {
      id: 'd-tw-u4-ks-roman-legacy',
      npc: 'd-tw-u4-engineer-athens',
      codexId: 'd-tw-u4-cx-roman-legacy',
      house: 2,
      houseTitle: 'You read what Rome truly left standing',
      houseSub: 'A Roman road-engineer marks the House of the Open Road as one that grasps why law and engineering outlast conquest.',
      flag: 'd-tw-u4-romanLegacyUnderstood',
      achievement: 'd-tw-u4-ach-ideas-outlive-empires',  // shared milestone: legacies outlive empires
      start: 'challenge',
      nodes: {
        challenge: {
          text: 'Faustus crouches and scratches an arch in the dust, then a straight road beside it. "Merchant, every empire conquers; that part is common and it always comes undone. So forget the battles. Rome\'s lasting gift is two practical things. We WRITE LAW down and post it in public — it began with our Twelve Tables, plain rules a citizen can read, and it will grow into the great codes that later peoples copy for a thousand years. And we BUILD to last — roads, the arch, concrete, aqueducts that carry water for miles. Tell me: WHY do a written law and a stone road outlive the empire that made them, when the legions do not?"',
          choices: [
            {
              kind: 'say',
              // ★ RIGHT — written, public law + durable physical infrastructure both keep working without the empire.
              label: 'Because both keep working without Rome standing behind them. A law that is written down and made public can be read, kept, and copied by whoever comes after — later peoples build their own codes on the Roman idea of clear, public law. And a road, an arch, an aqueduct, once built well, keeps carrying traffic and water for centuries no matter who rules. Conquest needs an army to last; law and engineering, once made, outlive the maker.',
              right: true,
              next: 'won',
            },
            {
              kind: 'say',
              // ✗ WRONG (the "only the army matters / nothing lasts without legions" misread).
              label: 'Nothing of Rome lasts without the legions to enforce it. The day the army leaves, the roads are abandoned and the laws are forgotten — only raw military power leaves any mark at all.',
              setFlag: 'd-tw-u4-legionMisread',
              next: 'reteachLegion',
            },
            {
              kind: 'say',
              // ✗ WRONG (the "law/engineering = mere conquest" conflation misread).
              label: 'Roman law and roads are really just tools of conquest, so they die exactly when the conquest does — there is no difference between Rome\'s building and Rome\'s armies.',
              next: 'reteachConquest',
            },
          ],
        },

        won: {
          onEnter: 'reward',
          text: '(Faustus dusts off his hands, pleased.) "Just so. The legion is rented power — stop paying it and it vanishes. But a law carved in public stone can be read by your great-grandchildren and copied into their own codes; a well-laid road and a sound aqueduct go on serving travelers and cities long after the last Roman officer is gone. That is why, centuries from now, peoples who never paid a denarius of tribute will still drive on our roads and argue cases under law descended from our Tables. Rome the conqueror dies; Rome the lawgiver and builder does not. Rome will remember the merchant who saw the difference."',
          choices: [
            { label: 'Then I\'ll carry it — written law and good engineering keep working without the empire.', next: '@close' },
          ],
        },

        reteachLegion: {
          text: '(Faustus shakes his head.) "Spoken like a man who has only watched the soldiers. But think about what you yourself USE on your route: a paved road still carries your cart in provinces Rome no longer rules; an aqueduct still pours into a town the legions left long ago. And a law, once written and public, is not erased when the army marches — it is read, kept, and built upon by whoever follows. Power evaporates; stone and written rules do not. So ask again, properly: why do Rome\'s law and engineering outlast the legions that won them?"',
          choices: [
            { label: 'I see — a road and a written law keep working on their own, with no legion needed. Let me answer again.', clearFlag: 'd-tw-u4-legionMisread', next: 'challenge' },
          ],
        },
        reteachConquest: {
          text: '(Faustus gives a wry grin.) "You have melted two different things into one. Conquest is an EVENT — it happens, then it decays the moment force lets up. Law and engineering are CREATIONS — once made, they stand on their own and serve anyone, friend or stranger, ruler or ruled. The Twelve Tables do not care who governs; the aqueduct pours for whoever lives by it. That is exactly why later peoples keep Rome\'s law and roads while they forget Rome\'s battles. Weigh it again: why does what Rome BUILT and WROTE outlive what Rome merely WON?"',
          choices: [
            { label: 'Of course — conquest is an event that decays, but law and roads are creations that keep serving. Let me try again.', next: 'challenge' },
          ],
        },
      },
    },

    // ===== (a-Han) PAPER & THE MERIT IDEA — the quiet Han gifts that outlived the dynasty =====
    {
      id: 'd-tw-u4-ks-han-legacy',
      npc: 'd-tw-u4-papermaker-changan',
      codexId: 'd-tw-u4-cx-han-legacy',
      house: 2,
      houseTitle: 'You weighed the lightest, longest gift',
      houseSub: 'A Han papermaker marks the House of the Open Road as one that grasps why paper and the merit idea outlive the dynasty that made them.',
      flag: 'd-tw-u4-hanLegacyUnderstood',
      achievement: 'd-tw-u4-ach-ideas-outlive-empires',  // shared milestone
      start: 'challenge',
      nodes: {
        challenge: {
          text: 'Clerk Wen holds up a clean sheet between two fingers, so the light shows through. "Look hard, trader. Bamboo books are heavy and silk is dear, but THIS — paper, perfected in our workshops since Cai Lun\'s day — is cheap, light, and made from rag and bark. And beside it sits our other quiet invention: choosing officials by EXAMINATION, by what a man has learned, an idea later realms will borrow for centuries. The Han will fall like every dynasty before it. So tell me: WHY would a scrap of paper and a way of picking clerks outlive the whole mighty empire that made them?"',
          choices: [
            {
              kind: 'say',
              // ★ RIGHT — cheap paper spreads knowledge widely & is copied abroad; the merit idea is a portable institution.
              label: 'Because both spread far beyond the empire that made them and keep working without it. Cheap paper lets knowledge be copied many times over and carried down every road, so ideas survive even when one realm collapses — they live on in the thousand copies, in other lands. And choosing officials by learning is a method any later state can adopt for itself. A dynasty is one government that ends; a cheap medium for ideas and a portable way to run a government are gifts the whole world can keep and reuse.',
              right: true,
              next: 'won',
            },
            {
              kind: 'say',
              // ✗ WRONG (the "secret kept inside Han walls" misread).
              label: 'Because the Han will guard paper as a secret forever, so only this empire ever has it — it lasts only as long as the Han keeps it locked away inside our own borders.',
              setFlag: 'd-tw-u4-secretMisread',
              next: 'reteachSecret',
            },
            {
              kind: 'say',
              // ✗ WRONG (the "tiny stuff, real legacy is monuments/conquests" misread).
              label: 'A scrap of paper is too small to matter. The real legacy of the Han is its conquests and great palaces — paper and exams are trifles that will be forgotten the moment the dynasty ends.',
              next: 'reteachTrifle',
            },
          ],
        },

        won: {
          onEnter: 'reward',
          text: '(Clerk Wen lays the sheet down reverently.) "Precisely. The empire is one thing, in one place, in one time — and it ends. But paper is the cheapest way the world has ever found to MULTIPLY an idea: a single text becomes a hundred, a thousand, scattered so widely that no fall can erase them all. And the notion of choosing the able by examination is a tool any future state can pick up and use. Both will travel your roads west, into lands that never bowed to a Han emperor, and live on a thousand years after this capital is grass. The lightest things in this office are its longest shadow. Carry that — and carry the paper."',
          choices: [
            { label: 'Then I\'ll carry it — cheap paper multiplies ideas everywhere, and the merit idea travels on its own.', next: '@close' },
          ],
        },

        reteachSecret: {
          text: '(Clerk Wen shakes his head.) "A thing held secret does not become a legacy — it dies WITH the keeper. The reason paper matters to the world is the OPPOSITE of a locked vault: it is cheap to make and easy to copy, so it spreads, and once it spreads no single empire can call it back. Soon enough the craft itself travels your western roads to other peoples. The same with choosing officials by learning — others will copy the idea and make it their own. So forget hoarding. Ask again: why do a cheap medium for ideas and a borrowable way to govern outlast the dynasty that first made them?"',
          choices: [
            { label: 'I see — it lasts BECAUSE it spreads and is copied, not because it is hoarded. Let me answer again.', clearFlag: 'd-tw-u4-secretMisread', next: 'challenge' },
          ],
        },
        reteachTrifle: {
          text: '(Clerk Wen smiles patiently.) "You weigh legacy by its size, but weigh it by its REACH instead. A palace stands in one spot until it burns; a conquest unravels the moment the army weakens. But paper carries every classic, every law, every record — and the way it multiplies ideas changes how all later peoples learn and govern. The small thing in my hand is precisely the thing that does NOT die with the dynasty, because it has scattered itself into ten thousand copies across the world. So look past the palaces and tell me again: why do paper and the merit idea outlive the Han?"',
          choices: [
            { label: 'You\'re right — judge legacy by reach, not size; paper multiplies and spreads. Let me try again.', next: 'challenge' },
          ],
        },
      },
    },

    // ===== (b) WHY CLASSICAL EMPIRES FELL — overexpansion + fiscal strain + frontier pressure =====
    {
      id: 'd-tw-u4-ks-why-empires-fall',
      npc: 'd-tw-u4-officer-changan',
      codexId: 'd-tw-u4-cx-why-empires-fall',
      house: 2,
      houseTitle: 'You read the true shape of a fall',
      houseSub: 'A retired frontier officer marks the House of the Open Road as one that understands empires fall to many causes at once, not one enemy.',
      flag: 'd-tw-u4-fallUnderstood',
      achievement: 'd-tw-u4-ach-anatomy-of-collapse',
      start: 'challenge',
      nodes: {
        challenge: {
          text: 'Old Bo turns his cup slowly. "I watched it from the wall, merchant, so hear me out. The Han and Rome both looked eternal — and both came apart for the SAME slow reasons. The realm grew too WIDE to defend or govern; the cost of all those armies and officials outran the taxes, so the rulers debased the coin and squeezed the farmers until they revolted; and all the while the peoples beyond the frontier pressed harder on borders already stretched thin and starved of pay. So tell me, trader who weighs things: what REALLY brings down a great classical empire?"',
          choices: [
            {
              kind: 'say',
              // ★ RIGHT — the combination: overexpansion + fiscal strain + frontier pressure, internal weakening first.
              label: 'Not one blow, but several working together over a long time. The empire overexpands until it is too big to defend or pay for; the cost of armies and government then outruns the taxes, so coins are debased and the farmers are crushed and turn rebellious; and that internal weakening leaves the overstretched, underfunded frontier unable to hold when outside peoples press on it. The outsiders are the final shove, but the empire was already hollowed from within — that is why both Rome and the Han fell the same way.',
              right: true,
              next: 'won',
            },
            {
              kind: 'say',
              // ✗ WRONG (the "barbarians did it / single external villain" misread).
              label: 'It is simple: the barbarians did it. A strong, healthy empire was smashed from outside by invaders, pure and sudden — there was nothing wrong inside, just a stronger enemy at the gate.',
              setFlag: 'd-tw-u4-barbarianMisread',
              next: 'reteachBarbarian',
            },
            {
              kind: 'say',
              // ✗ WRONG (the "one bad emperor / single cause" misread).
              label: 'It comes down to one bad ruler. A single wicked or foolish emperor ruined everything; replace that one man and the empire would have stood forever, untouched.',
              next: 'reteachOneMan',
            },
          ],
        },

        won: {
          onEnter: 'reward',
          text: '(Old Bo nods, slow and grim.) "That is the soldier\'s truth of it. The wall did not break because the men beyond it suddenly grew mighty — it broke because behind us the realm had stretched past what it could pay for, the coin was worthless, the farmers were ruined and rising, and our garrisons went unfed and unpaid. The outside pressure only found the cracks that were ALREADY there. Rome died of the same disease in the same years, far to the west. Anyone who tells you a great empire fell to a single enemy or a single bad king is telling a story, not history. You have the real shape of it now. Go carry it honestly."',
          choices: [
            { label: 'I will — overexpansion, fiscal strain, and frontier pressure, working together.', next: '@close' },
          ],
        },

        reteachBarbarian: {
          text: '(Old Bo snorts softly.) "The barbarian at the gate is the easy story, and it is wrong — or rather, it is only the last page. Ask yourself: why could the same frontier peoples be HELD for centuries and then suddenly not? Because by the end the empire had overstretched itself, drained its treasury, debased its coin, and ground its farmers into revolt — so the garrisons were thin, unpaid, and brittle. The outsiders did not grow ten times stronger; the empire grew weak from within and could no longer hold a border it once held with ease. So weigh it again: what is the FULL set of reasons a great empire actually falls?"',
          choices: [
            { label: 'I see — the outside pressure only succeeds because the empire was hollowed from within first. Let me answer again.', clearFlag: 'd-tw-u4-barbarianMisread', next: 'challenge' },
          ],
        },
        reteachOneMan: {
          text: '(Old Bo shakes his head.) "If one bad emperor could doom an empire this size, one good one could save it — yet good emperors came and the rot went on regardless. A single ruler is a symptom, not the sickness. The real causes are structural and slow: a realm grown too vast to defend, a treasury that cannot pay for its own armies, a coinage debased, a peasantry taxed into revolt, and a frontier under steady pressure. No one man makes or unmakes all of that. Set the single villain aside and tell me again: what combination of forces brings a classical empire down?"',
          choices: [
            { label: 'You\'re right — it is structural and slow, not one man; many forces together. Let me try again.', next: 'challenge' },
          ],
        },
      },
    },
  ],

  // ---- Codex: the real ideas this pack teaches ----
  codex: [
    {
      id: 'd-tw-u4-cx-greek-legacy',
      group: 'Unit 4 — Classical Empires',
      title: 'Why Greek philosophy and science outlived Athens',
      idea: 'Classical Greece\'s longest-lasting legacy was a way of thinking — questioning claims (Socrates), observing and reasoning about the natural world (Aristotle), and proving truths in mathematics and astronomy — and ideas like these outlive the empire that made them because a method can be taught, written, copied, and carried by anyone across any border, while armies and states are tied to one power and fall with it.',
      source: 'Aristokleia, a student of the Stoa at Athens',
    },
    {
      id: 'd-tw-u4-cx-roman-legacy',
      group: 'Unit 4 — Classical Empires',
      title: 'Why Roman law and engineering outlived Rome',
      idea: 'Rome\'s most enduring achievements were practical: written, public law (beginning with the Twelve Tables and growing into legal codes later peoples copied) and durable engineering (roads, the arch, concrete, aqueducts). Both outlast the empire because they keep working without it — a written law can be read, kept, and built upon by whoever follows, and well-built roads and aqueducts keep serving for centuries regardless of who rules.',
      source: 'Faustus the Surveyor, a Roman road-engineer abroad in Athens',
    },
    {
      id: 'd-tw-u4-cx-han-legacy',
      group: 'Unit 4 — Classical Empires',
      title: 'Why Han paper and the merit idea outlived the dynasty',
      idea: 'Han China\'s quiet but world-changing legacies were cheap paper (perfected under Cai Lun) and the idea of choosing officials by merit examination. Cheap paper outlasts any one empire because it multiplies ideas into countless copies that spread far and cannot all be erased, and the merit-examination idea is a portable institution any later state can adopt — so both spread west and endured a thousand years past the dynasty that made them.',
      source: 'Clerk Wen, a papermaker of the Han records office',
    },
    {
      id: 'd-tw-u4-cx-why-empires-fall',
      group: 'Unit 4 — Classical Empires',
      title: 'Why classical empires fell — a combination of causes',
      idea: 'The classical empires of Rome and Han China fell not to a single enemy but to a combination of forces working together over a long time: overexpansion (growing too large to defend or govern), fiscal strain (the cost of armies and administration outrunning taxes, leading to debased coinage and crushed, rebellious farmers), and frontier pressure (outside peoples pressing on overstretched, underfunded borders). The internal weakening came first; the outside pressure was the final shove that found cracks already there.',
      source: 'Old Bo, a retired officer of the Han northern frontier',
    },
  ],

  // ---- Achievements: sparse, meaningful ----
  achievements: [
    {
      id: 'd-tw-u4-ach-ideas-outlive-empires',
      title: 'The Cargo That Weighs Nothing',
      desc: 'You understood why the deepest legacies of the classical world — Greek philosophy and science, Roman law and engineering, Han paper and the merit idea — outlived the empires that made them.',
    },
    {
      id: 'd-tw-u4-ach-anatomy-of-collapse',
      title: 'The Anatomy of a Collapse',
      desc: 'You understood why great classical empires fall to a combination of internal weakening and outside pressure — overexpansion, fiscal strain, and frontier pressure — not to a single enemy or a single bad ruler.',
    },
  ],
};

export default pack;
