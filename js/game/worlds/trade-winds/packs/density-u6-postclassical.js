// density-u6-postclassical.js — DENSITY STORY PACK · Global History 9, Unit 6
// (Post-Classical). ADDITIVE second pack for Unit 6 — it does NOT replace the
// shipped u6-postclassical.js; it DEEPENS the unit toward full curriculum coverage.
//
// Pure DATA module — no imports, no engine calls — so it can never crash the world
// on its own. The loader in ../game.js wires everything below into the live game
// (adds NPCs, fires cutscenes once, makes keystones reachable, records Codex
// entries, lifts House Standing, unlocks achievements). See CONTRACT.md for the
// authoritative spec; structure copied from the gold-standard unit3-belief-systems.js.
//
// EVERY id is namespaced with the prefix "d-tw-u6-" so it can NEVER collide with the
// shipped u6-postclassical.js (which uses bare "u6-" / "ks-" / "cx-" / "ach-" ids) or
// any other pack.
//
// THE EXISTING u6-postclassical.js ALREADY TEACHES: feudalism (response to collapse),
// the Crusades as two-way exchange, the Pax Mongolica, and the Black Death riding the
// trade routes. THIS DENSITY PACK adds THREE *different* real Unit-6 keystones, cast
// across the post-classical Mediterranean, that the shipped pack does NOT cover:
//
//   (a) BYZANTINE PRESERVATION — the Eastern Roman (Byzantine) Empire OUTLIVED the
//       fall of the West by a thousand years, and under Justinian it SAVED Roman law
//       by codifying it (the Corpus Juris Civilis / "Justinian's Code"), which became
//       the root of legal systems across Europe. Byzantium also became the heart of
//       ORTHODOX Christianity, which split from the Roman Catholic West in the Great
//       Schism of 1054. (Cast at Athens — the Greek-speaking, Orthodox East.)
//   (b) THE ISLAMIC GOLDEN AGE — while much of Western Europe's classical learning
//       was lost, scholars at the House of Wisdom in Baghdad TRANSLATED and PRESERVED
//       Greek texts and then ADVANCED knowledge: al-Khwarizmi gave the world algebra
//       and the algorithm; physicians like al-Razi and Ibn Sina (Avicenna) wrote
//       medical encyclopedias used for centuries; the Hindu-Arabic numerals and the
//       zero spread west. The Dar al-Islam was a bridge that carried learning across
//       the post-classical world. (Cast on the Byblos / Levant coast of the Dar al-Islam.)
//   (c) HOW THE BLACK DEATH RESHAPED EUROPE — beyond the dying, the plague killed so
//       many workers that LABOR became scarce; survivors could DEMAND higher wages and
//       better terms; serfdom and the manorial system that bound peasants to the land
//       began to BREAK DOWN in Western Europe, even as lords and the Statute of
//       Labourers (1351) tried and failed to freeze wages. Catastrophe shook loose an
//       old social order. (Cast at Florence, in the years after 1348.)
//
// Honest pedagogy: every figure, place, date and idea is real history. The mentor
// voices are fictional in-world denizens (a Greek jurist's clerk, a Baghdad-trained
// scholar, a manor steward) who PARAPHRASE the historical record (the Corpus Juris
// Civilis, the 1054 mutual excommunications, al-Khwarizmi's Algebra, the Statute of
// Labourers) — no invented verbatim quotes put in real people's mouths.
// De-identified: the only real living person ever named is "Mr. Maccarello".

export const pack = {
  // ---- identity ----
  id: 'd-tw-u6-postclassical-density',
  unit: 'Unit 6 — Post-Classical',          // Codex group — buckets with the shipped pack
  title: 'Survivals: Byzantine Law, the House of Wisdom, and the World the Plague Remade',

  // ---- extra characters added to the world ----
  // All are fictional period-true denizens who carry a keystone tree (the MENTOR who
  // re-teaches on a wrong answer is built into each tree). Each is placed at an
  // EXISTING city with an offset that avoids BOTH the core NPCs there AND the shipped
  // u6-postclassical.js NPCs (which sit at florence [-7,5]/[7,6], byblos [-7,6],
  // changan [-7,6]).
  npcs: [
    {
      // (a) BYZANTINE PRESERVATION + ORTHODOX SPLIT — a Greek jurist's clerk at Athens,
      // the Greek-speaking, Orthodox eastern Mediterranean (stands in for the surviving
      // Eastern Roman world centered on Constantinople).
      id: 'd-tw-u6-jurist-clerk',
      name: 'Eudokia',
      title: 'Clerk to a Jurist of the Eastern Romans',
      city: 'athens',                    // existing CITIES id (Herodotus [-7,3], potter Kallias [8,5])
      era: 3,                            // surfaces once the world reaches the post-classical era
      offset: [7, -6],                   // clear of Herodotus [-7,3] and Kallias [8,5]
      hatKind: 'scholar',
      palette: { robe: 0x6a2c8a, trim: 0x3e1652, skin: 0xd9b07c, hat: 0x3e1652 },
      keystoneId: 'd-tw-u6-ks-byzantine',
      introText: 'Greetings, western trader. You call us "Greeks," but hear what we call ourselves: Rhomaioi — Romans. The Rome you mean fell to the barbarians long ago; OURS did not. The Eastern Roman Empire still stands, ruled from the great City on the straits, and it has outlived the West by centuries. I clerk for a jurist; we keep the old Roman law alive on these pages. Sit — there is a thing about what an empire SAVES that a merchant of ledgers ought to grasp.',
      afterText: 'Now you understand why we matter, far from the ruins of the West. While their law and learning scattered, ours endured: the Emperor Justinian had every tangled Roman statute gathered and set in ORDER, one great code, so the law could not be lost again. And our faith took its own road — Orthodox, Greek, ruled from the City, until in 1054 East and West cursed each other and the one Church split in two. We did not merely survive the fall of Rome. We carried the half of Rome the West forgot.',
    },
    {
      // (b) ISLAMIC GOLDEN AGE — a Baghdad-trained scholar trading along the Levant
      // coast of the Dar al-Islam.
      id: 'd-tw-u6-scholar-baghdad',
      name: 'Yusuf al-Maliki',
      title: 'Scholar of the House of Wisdom',
      city: 'byblos',                    // existing CITIES id (Zimrida [6,3], Anath [-4,-7]); u6 Anselmo [-7,6]
      era: 3,
      offset: [7, -6],                   // clear of Zimrida [6,3], Anath [-4,-7], and Anselmo [-7,6]
      hatKind: 'turban',
      palette: { robe: 0x1f6e5a, trim: 0x114436, skin: 0xb97f4e, hat: 0xe8dcc0 },
      keystoneId: 'd-tw-u6-ks-golden-age',
      introText: 'Peace be upon you, traveler of the open road. You carry ledgers; do you know the numerals you keep them in? I studied in Baghdad, at the Bayt al-Hikma — the House of Wisdom — where caliphs paid in gold for books, not battles. While the West forgot its Greeks, WE gathered them, translated them, and went further. Ask me what flows out of the Dar al-Islam besides spice, and you will reckon your own ledgers differently after.',
      afterText: 'So you see it now: this was no dark age in our lands but a golden one. We saved the Greek learning the West had lost — Aristotle, Galen, Euclid — translated it into Arabic, and ADDED to it: al-Khwarizmi\'s al-jabr, which your tongue will call algebra; the medicine of al-Razi and Ibn Sina that your physicians will study for five hundred years; the numerals and the zero you scrawl without a thought. The Dar al-Islam was the bridge that carried the world\'s knowledge across the centuries. Reckon kindly when you reckon us.',
    },
    {
      // (c) BLACK DEATH RESHAPED EUROPE — a manor steward at Florence in the years
      // AFTER the 1348 plague, watching the old bonded order come apart.
      id: 'd-tw-u6-steward-tuscany',
      name: 'Bartolo',
      title: 'Manor Steward in the Years After the Plague',
      city: 'florence',                  // existing CITIES id; core Lorenzo [6,-4], Vell-master [-6,6],
                                         // printer [-8,5]; u6 reeve [-7,5], physician [7,6]
      era: 4,                            // the post-plague reshaping is late post-classical → Era IV
      offset: [8, -7],                   // clear of ALL the above
      hatKind: 'brim',
      palette: { robe: 0x7a5a2a, trim: 0x4e3818, skin: 0xc98a5b, hat: 0x4e3818 },
      keystoneId: 'd-tw-u6-ks-labor-shift',
      introText: 'You knew this country before the Great Mortality, trader? Then you knew a different world. I steward what is left of a manor — and "what is left" is the whole of it. The plague took a third of us, some say more. The dying is over; the RECKONING is not. The fields are the same; the hands to work them are not. There is a thing happening between lord and laborer now that no one foresaw. Hear it, for it will outlast every grave.',
      afterText: 'You have it, and it is the strangest fruit of the worst horror: with so many dead, a working man\'s hands became precious. The survivors could walk off a harsh manor and be hired, for WAGES, by a lord desperate for labor down the road. The old bonds — serf tied to the soil, owing labor for life — began to snap, however the lords raged and however many laws they passed to freeze the wages. The plague emptied the manors and, by emptying them, helped break serfdom itself. Catastrophe shook an old world loose.',
    },
  ],

  // ---- named story-beat sequences (playCutscene format) ----
  cutscenes: {
    // Frames the "what survived the fall of Rome?" question the first time the player
    // reaches Athens after the world turns post-classical — before meeting the clerk.
    D_TW_U6_THE_OTHER_ROME: [
      {
        tint: 'stone', kicker: 'Athens — and a Rome that did not fall', art: 'notice',
        text: 'In the old agora the talk is not of dead philosophers but of a living empire. The West, men say, fell to Goths and Vandals generations ago — its law, its libraries, its order scattered to the wind. But east of here, ruled from a great City on the straits between two seas, ANOTHER Rome still stands: Greek-tongued, Christian, unbroken. They do not call themselves Greeks. They call themselves Romans, and they have kept what the West let fall.',
      },
      {
        tint: 'amber', kicker: 'A clerk with a question', art: 'portrait',
        palette: { robe: 0x6a2c8a, trim: 0x3e1652, skin: 0xd9b07c, hat: 0x3e1652 },
        text: 'A sharp-eyed woman sorting law-scrolls looks up at your western dress. "You mourn the fall of Rome," she says, "as though all of Rome fell. Half of it did not. Ask yourself the real question, trader: when an empire collapses, what is the most important thing the SURVIVING half can do for every century that comes after? Not win a war — SAVE something. What?" Her name is Eudokia, clerk to a jurist. Go and ask her.',
        cta: 'Go and ask the clerk',
      },
    ],

    // Frames the Islamic Golden Age as the era's quiet engine of knowledge when the
    // world reaches the post-classical era generally.
    D_TW_U6_HOUSE_OF_WISDOM: [
      {
        tint: 'amber', kicker: 'The city that paid in gold for books', art: 'notice',
        text: 'Down every caravan road runs a rumor stranger than any cargo: that in Baghdad, capital of the caliphs, there is a house where scholars are paid — handsomely, in gold — not to fight or to govern but to READ. To gather the books of the dead Greeks and the Persians and the Indians, translate them into Arabic, and then to go further than the ancients ever did. They call it the Bayt al-Hikma, the House of Wisdom. While the West counts itself lucky to own one chained Bible, the Dar al-Islam is building libraries.',
      },
    ],
  },

  // ---- triggers: when each cutscene fires (once) ----
  triggers: [
    {
      on: 'visit', value: 'athens', play: 'D_TW_U6_THE_OTHER_ROME',
      reward: { house: 1, title: 'A Rome that did not fall', sub: 'Athens sets you a riddle about what a surviving empire saves.' },
    },
    {
      on: 'enter', value: 3, play: 'D_TW_U6_HOUSE_OF_WISDOM',
      reward: { house: 1, title: 'A house that paid in gold for books', sub: 'Word of Baghdad\'s House of Wisdom reaches the whole road.' },
    },
  ],

  // ---- THE CORE: keystones ----
  keystones: [
    // ============================================ (a) BYZANTINE PRESERVATION + SCHISM
    {
      id: 'd-tw-u6-ks-byzantine',
      npc: 'd-tw-u6-jurist-clerk',
      codexId: 'd-tw-u6-cx-byzantine',
      house: 2,
      houseTitle: 'You saw what the surviving half of Rome preserved',
      houseSub: 'A clerk of the Eastern Romans marks your house as one that understands Byzantium saved Roman law for the world.',
      flag: 'd-tw-u6-byzantineUnderstood',
      achievement: 'd-tw-u6-ach-the-half-that-held',
      start: 'challenge',
      nodes: {
        challenge: {
          text: 'Eudokia spreads a law-scroll across the table. "You western folk speak of \'the fall of Rome\' as though Rome simply ended. But the Eastern Roman Empire — what later tongues will call Byzantium — did NOT fall when the West did. It stood, here in the Greek-speaking east, for a thousand years more, ruled from the great City on the straits. And under the Emperor Justinian it did a thing that mattered to every century after. So tell me, trader who keeps careful books: of all an empire might do, WHY does it matter so much that this surviving half of Rome gathered the old Roman law into one ordered code — and what else did the Greek East become the heart of?"',
          choices: [
            {
              kind: 'say',
              // ★ RIGHT — Byzantium preserved/codified Roman law (Justinian's Code),
              // saving it for later Europe, and became the heart of Orthodox Christianity
              // which split from Rome in 1054.
              label: 'Because law that is scattered can be lost, and law that is lost has to be reinvented from nothing. By gathering every tangled Roman statute into one ordered code — Justinian\'s Code — the surviving East SAVED Roman law, and that code became the root of legal systems across later Europe. And the Greek East became the heart of Orthodox Christianity, its own branch of the faith, which finally split from the Roman Catholic West in the Great Schism of 1054. Byzantium did not just outlive Rome — it kept Rome\'s law and grew Rome\'s eastern faith.',
              right: true,
              next: 'won',
            },
            {
              kind: 'say',
              // ✗ WRONG (seductive misread) — "Byzantium was just a small leftover that
              // contributed nothing; the real story is the West." Re-routes + loops back.
              label: 'It does not matter much at all. The East was only a shrunken leftover of the real Rome, clinging on in the corner — it preserved nothing the world needed and the true history of these centuries belongs entirely to the West.',
              setFlag: 'd-tw-u6-leftoverMisread',
              next: 'reteachLeftover',
            },
            {
              kind: 'say',
              // ✗ WRONG (other misread) — "East and West were always one single Church
              // with no difference; nothing split."
              label: 'Surely there is nothing to tell. East and West were always one single Church, one faith with no real difference between them — Byzantium simply prayed the same way Rome did, and nothing ever divided them.',
              next: 'reteachOneChurch',
            },
          ],
        },
        won: {
          onEnter: 'reward',
          text: '(Eudokia rolls the scroll with quiet satisfaction.) "Yes. You see why a clerk\'s dull work is the work of centuries. The West\'s Rome shattered, but Justinian had the whole confused inheritance of Roman law gathered, pruned, and set in one ordered Corpus — so that when the West was ready to rebuild its courts, the law was THERE, waiting, saved from oblivion. Our jurists kept it alive on pages like these. And our faith took its own Greek road, ruled from the City, until in 1054 the legate of Rome and the Patriarch of the City laid mutual curses on each other, and the one Church became two — Orthodox and Catholic, to this day. We are the half of Rome that held. Carry that, and the fall of Rome looks only half as dark." She inclines her head. "Walk well, Roman of the West."',
          choices: [
            { label: 'Then I\'ll carry the half of Rome the West forgot.', next: '@close' },
          ],
        },
        reteachLeftover: {
          text: '(Eudokia does not take offense; she has heard western pride before.) "A leftover? This \'leftover\' outlasted your Rome by a THOUSAND years, friend, and rescued the very law your courts will one day be built upon. Look again at this scroll: it is Roman law, ordered by Justinian, copied and kept here while the West\'s own copies rotted in burned libraries. When western scholars finally hunger for law, where do you imagine they will find it whole? Ask yourself what is LOST when an empire falls — and what it means that ONE half of Rome kept it safe. Weigh it again."',
          choices: [
            { label: 'I see — the surviving East preserved Roman law itself for the later West. Let me answer again.', clearFlag: 'd-tw-u6-leftoverMisread', next: 'challenge' },
          ],
        },
        reteachOneChurch: {
          text: '(Eudokia raises an eyebrow.) "One single Church? You have not been east enough. We worship in Greek, not Latin; our patriarch in the City does not bow to the bishop of Rome; we quarrel over the Creed, over leavened bread, over who leads Christendom. It came to a head in the year 1054 — Rome\'s legate and our Patriarch excommunicated each other, and the one Church cracked into two: the Orthodox East and the Catholic West, a split that has never healed. Byzantium was not Rome\'s echo; it was the heart of its OWN branch of the faith. Think about how the East went its own way — and try once more."',
          choices: [
            { label: 'Of course — the Orthodox East split from Catholic Rome in 1054. Let me try again.', next: 'challenge' },
          ],
        },
      },
    },

    // ===================================================== (b) ISLAMIC GOLDEN AGE
    {
      id: 'd-tw-u6-ks-golden-age',
      npc: 'd-tw-u6-scholar-baghdad',
      codexId: 'd-tw-u6-cx-golden-age',
      house: 2,
      houseTitle: 'You read the Dar al-Islam as the bridge of knowledge',
      houseSub: 'A scholar of the House of Wisdom marks your house as one that knows where the world\'s learning was kept and advanced.',
      flag: 'd-tw-u6-goldenAgeUnderstood',
      achievement: 'd-tw-u6-ach-bridge-of-wisdom',
      start: 'challenge',
      nodes: {
        challenge: {
          text: 'Yusuf taps the figures in your own ledger. "Your western priests call these the Dark Ages, and for the West perhaps they were. But come east with your eyes open. In Baghdad the caliphs built the House of Wisdom and paid scholars in gold to gather the books of the dead — Greek, Persian, Indian — translate them into Arabic, and then to go FURTHER. So tell me, trader: when you weigh the Islamic world of these centuries, what was it DOING for human knowledge? Be precise. Was it merely keeping old books on a shelf?"',
          choices: [
            {
              kind: 'say',
              // ★ RIGHT — the Golden Age both PRESERVED Greek learning the West lost AND
              // advanced it: algebra (al-Khwarizmi), medicine (al-Razi, Ibn Sina),
              // Hindu-Arabic numerals + zero; a bridge carrying knowledge forward.
              label: 'It was doing two great things at once. It PRESERVED the Greek learning the West had lost — Aristotle, Euclid, Galen — by translating it into Arabic and keeping it safe. And it ADVANCED it: al-Khwarizmi gave the world algebra and the algorithm, physicians like al-Razi and Ibn Sina wrote medical encyclopedias studied for centuries, and the Hindu-Arabic numerals and the zero spread west from here. The Dar al-Islam was the bridge that carried the world\'s knowledge across the centuries — not a shelf, but a workshop.',
              right: true,
              next: 'won',
            },
            {
              kind: 'say',
              // ✗ WRONG (seductive misread) — "they only copied; they invented nothing
              // of their own." Re-routes, re-teaches, loops back.
              label: 'It was only copying, nothing more — Muslim scholars merely transcribed the Greeks word for word and added nothing of their own. There was no real discovery in it, just careful copyists keeping other men\'s ideas.',
              setFlag: 'd-tw-u6-onlyCopiedMisread',
              next: 'reteachOnlyCopied',
            },
            {
              kind: 'say',
              // ✗ WRONG (isolationist misread) — "their learning stayed locked in the
              // East and never touched Europe."
              label: 'Whatever they learned, it stayed locked here in the East. None of it ever reached Europe or mattered to the West — these were two sealed worlds that never shared a single idea.',
              next: 'reteachSealed',
            },
          ],
        },
        won: {
          onEnter: 'reward',
          text: '(Yusuf smiles, pleased to be understood.) "Just so — preservation AND creation, both. We gathered the Greeks the West had let slip and copied them faithfully, yes — but a copyist does not invent al-jabr, the balancing of equations your descendants will call algebra. A mere shelf does not produce Ibn Sina\'s Canon of Medicine, taught in your universities for five centuries. And the numerals you reckon in, the little circle that means nothing and changes everything — the zero — came to you through us, from India, across this bridge. The Dar al-Islam took in the knowledge of three civilizations, improved it, and passed it on. When your West \'rediscovers\' the Greeks, friend, it will be reading OUR translations." He bows slightly. "Reckon kindly when you reckon us."',
          choices: [
            { label: 'I\'ll carry both halves home — the books you saved and the knowledge you made.', next: '@close' },
          ],
        },
        reteachOnlyCopied: {
          text: '(Yusuf shakes his head, patient.) "Copying we did, and proudly — without it your beloved Aristotle would be ash. But \'nothing of their own\'? Open this book." He sets down a treatise. "This is al-Khwarizmi on al-jabr — a NEW way to solve for the unknown, a thing no Greek wrote. This is al-Razi distinguishing smallpox from measles by careful observation, which no ancient managed. A copyist transcribes; a scholar DISCOVERS, and Baghdad did both. Ask yourself: from where did the very word algebra come, and the word algorithm? Not from Athens. Weigh it again."',
          choices: [
            { label: 'I see — they preserved the Greeks AND made new discoveries of their own. Let me answer again.', clearFlag: 'd-tw-u6-onlyCopiedMisread', next: 'challenge' },
          ],
        },
        reteachSealed: {
          text: '(Yusuf gestures at the very ledger in your hands.) "Sealed worlds? Look at your own numbers, trader — those are not Roman numerals; you could never keep such accounts in those clumsy letters. Those digits, and the zero among them, walked west FROM HERE, through Spain and Sicily and the Crusader ports, into the counting-houses of Italy. So will our medicine, our astronomy, our translated Aristotle — the West will school itself on them. Knowledge does not respect borders; it travels the very roads you travel. Think about how ideas cross from the Dar al-Islam into Europe, and try once more."',
          choices: [
            { label: 'Of course — this learning crossed west into Europe and reshaped it. Let me try again.', next: 'challenge' },
          ],
        },
      },
    },

    // =============================================== (c) BLACK DEATH RESHAPED EUROPE
    {
      id: 'd-tw-u6-ks-labor-shift',
      npc: 'd-tw-u6-steward-tuscany',
      codexId: 'd-tw-u6-cx-labor-shift',
      house: 2,
      houseTitle: 'You read how catastrophe broke an old order',
      houseSub: 'A manor steward marks your house as one that understands the plague\'s labor shock helped end serfdom.',
      flag: 'd-tw-u6-laborShiftUnderstood',
      achievement: 'd-tw-u6-ach-precious-hands',
      start: 'challenge',
      nodes: {
        challenge: {
          text: 'Bartolo walks you past half-empty fields. "You learned, no doubt, that the Black Death killed a third of Europe and more — a horror beyond counting. But come stand in the AFTER with me, here in the years past 1348, and learn the part no graveyard shows. The lords still hold the same land; the manors still stand. But something between lord and laborer has turned upside down. Tell me, trader who knows the price of things: when a plague kills off so many of the working people, what happens to the VALUE of the hands that are left — and what does that do to the old bonds that tied a serf to his lord\'s land for life?"',
          choices: [
            {
              kind: 'say',
              // ★ RIGHT — labor scarcity → survivors demand wages/better terms → serfdom
              // and the manorial bond break down in the West (despite the Statute of
              // Labourers trying to freeze wages).
              label: 'When so many workers die, the survivors\' labor becomes scarce — and scarce things grow precious. A laborer can now walk off a harsh manor and be hired for WAGES by a lord down the road desperate for hands. So the old bonds begin to snap: serfs tied to the soil for life can bargain, demand pay, or leave, and the manorial system starts to break down — even though lords pass laws like the Statute of Labourers trying to freeze wages back to the old days. The plague, by emptying the manors, helped end serfdom in the West.',
              right: true,
              next: 'won',
            },
            {
              kind: 'say',
              // ✗ WRONG (seductive misread) — "nothing changed; lords just kept their
              // serfs exactly as before." Re-routes, re-teaches, loops back.
              label: 'Nothing changed at all. The lords simply kept their serfs bound exactly as before — fewer peasants, the same chains. A plague kills people; it does not touch how a manor is run or who must serve whom.',
              setFlag: 'd-tw-u6-nothingChangedMisread',
              next: 'reteachNothingChanged',
            },
            {
              kind: 'say',
              // ✗ WRONG (other misread) — "labor got CHEAPER because everyone was
              // desperate" — the supply/demand backwards.
              label: 'With everyone so desperate after the dying, labor must have grown CHEAPER — frightened, hungry survivors would surely work for less than ever, and the lords could pay them next to nothing.',
              next: 'reteachCheaper',
            },
          ],
        },
        won: {
          onEnter: 'reward',
          text: '(Bartolo gives a grim, knowing nod.) "You reckon it true, and it is the bitter miracle of the thing. Before the plague, a serf was cheap because there were always more of him; he owed his labor for life and had nowhere else to go. After — a third of those hands in the grave — every working man left became worth COURTING. He could say to my lord: pay me, or I walk to the next manor that will. The lords howled; they got the king to pass the Statute of Labourers to nail wages back to the old level. It did not hold. You cannot legislate hands back into existence. So the old chains rusted and snapped, manor by manor, and serfdom in these western lands began its long death. The worst horror anyone had seen shook loose a thousand-year order." He looks out at the thin harvest. "Remember it: even ruin remakes the world."',
          choices: [
            { label: 'I\'ll remember it — that even catastrophe can break an old order open.', next: '@close' },
          ],
        },
        reteachNothingChanged: {
          text: '(Bartolo almost laughs, then thinks better of it.) "Nothing changed? Friend, I am the steward; I watch it change every harvest. Before, I could work a serf hard and pay him in the right to stay alive on his strip, because if he fled, ten others waited to take his place. Now there ARE no ten others — they are dead. The man who is left knows it, and he bargains. Why else would lords across Europe beg the king for a law to FORCE wages down? You do not pass such a law against a world that has not changed. Ask yourself what scarce hands are worth — and what a worker can demand when he cannot be replaced. Weigh it again."',
          choices: [
            { label: 'I see — scarce labor gave survivors the power to demand more, breaking the old bonds. Let me answer again.', clearFlag: 'd-tw-u6-nothingChangedMisread', next: 'challenge' },
          ],
        },
        reteachCheaper: {
          text: '(Bartolo shakes his head firmly.) "You have the scales upside down, trader — you of all people should feel it. When a good is SCARCE, its price RISES; when it floods the market, the price falls. The plague did not flood the market with workers; it emptied it. A third of the hands, gone into the ground. So labor became the scarcest, dearest thing in the land, and the wage went UP, not down — so far up the lords ran weeping to the king to cap it by law. Think of it as you would any cargo: fewer sellers, the same buyers desperate for the harvest. Which way does the price move? Try once more."',
          choices: [
            { label: 'Of course — scarce labor grew dearer, so wages rose and serfs gained leverage. Let me try again.', next: 'challenge' },
          ],
        },
      },
    },
  ],

  // ---- Codex: the real ideas this pack teaches ----
  codex: [
    {
      id: 'd-tw-u6-cx-byzantine',
      group: 'Unit 6 — Post-Classical',
      title: 'Byzantium preserved Roman law and the Orthodox faith',
      idea: 'The Eastern Roman (Byzantine) Empire outlived the fall of the West by about a thousand years; under Justinian it codified scattered Roman law into the Corpus Juris Civilis ("Justinian\'s Code"), which became a foundation for later European legal systems, and it became the heart of Orthodox Christianity, which split from the Roman Catholic West in the Great Schism of 1054.',
      source: 'Eudokia, clerk to a jurist of the Eastern Romans (on Justinian\'s Code and the Great Schism of 1054)',
    },
    {
      id: 'd-tw-u6-cx-golden-age',
      group: 'Unit 6 — Post-Classical',
      title: 'The Islamic Golden Age preserved and advanced knowledge',
      idea: 'During the Islamic Golden Age, scholars at Baghdad\'s House of Wisdom translated and preserved Greek and other classical learning the West had lost, then advanced it: al-Khwarizmi developed algebra and the concept of the algorithm, physicians like al-Razi and Ibn Sina (Avicenna) wrote medical works used for centuries, and the Hindu-Arabic numerals and zero spread west — making the Dar al-Islam a bridge that carried knowledge across the post-classical world.',
      source: 'Yusuf al-Maliki, scholar of the House of Wisdom (on Baghdad\'s translation movement, al-Khwarizmi, and Ibn Sina)',
    },
    {
      id: 'd-tw-u6-cx-labor-shift',
      group: 'Unit 6 — Post-Classical',
      title: 'The Black Death\'s labor shortage helped end serfdom',
      idea: 'By killing roughly a third of Europe\'s people, the Black Death made surviving labor scarce and therefore valuable: peasants could demand higher wages and better terms or leave for other manors, so serfdom and the manorial system began to break down in Western Europe — even though lords and laws like the Statute of Labourers (1351) tried and failed to freeze wages. The catastrophe reshaped Europe\'s social and economic order.',
      source: 'Bartolo, manor steward in the years after the plague (on labor scarcity, rising wages, and the Statute of Labourers)',
    },
  ],

  // ---- Achievements: optional milestones ----
  achievements: [
    {
      id: 'd-tw-u6-ach-the-half-that-held',
      title: 'The half of Rome that held',
      desc: 'You understood that Byzantium outlived the fall of the West, preserved Roman law in Justinian\'s Code, and became the heart of Orthodox Christianity that split from Rome in 1054.',
    },
    {
      id: 'd-tw-u6-ach-bridge-of-wisdom',
      title: 'The bridge of wisdom',
      desc: 'You understood the Islamic Golden Age both preserved lost Greek learning and advanced it — algebra, medicine, and the numerals that crossed west into Europe.',
    },
    {
      id: 'd-tw-u6-ach-precious-hands',
      title: 'Hands made precious',
      desc: 'You understood how the Black Death\'s labor shortage let survivors demand wages and helped break serfdom and the manorial order in Western Europe.',
    },
  ],
};

export default pack;
