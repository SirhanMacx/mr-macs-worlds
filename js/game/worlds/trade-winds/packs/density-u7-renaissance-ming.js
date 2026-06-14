// density-u7-renaissance-ming.js — ADDITIVE DENSITY STORY-PACK (Global History 9, Unit 7).
//
// Pure DATA module — no imports, no engine calls — so it can never crash the world
// on its own. The defensive loader in ../../game.js wires everything below into the
// live game (adds the NPCs at Chang'an and Florence, fires the cutscene once, makes
// each keystone reachable, records the Codex entries, lifts House Standing, unlocks
// achievements). See packs/CONTRACT.md for the authoritative field-by-field spec;
// this file COPIES the structure of the gold-standard sample (unit3-belief-systems.js).
//
// This is the SECOND, DENSER Unit-7 pack. It does NOT repeat the shipped
// u7-renaissance-reformation pack, which already teaches (a) the Renaissance was
// FUNDED by Medici trade & banking wealth and (b) the printing press broke the
// Church's INFORMATION monopoly. Those two ideas are off-limits here.
//
// THIS PACK teaches three NEW Unit-7 keystones, deepening the same era (Era IV, the
// First Global Age, c. 1450-1600) toward full curriculum coverage:
//
//   (a) MING CHINA TURNED INWARD — why a superpower STOPPED exploring. Under the
//       Yongle Emperor the admiral Zheng He led seven enormous Treasure-Fleet
//       voyages (1405-1433) across the Indian Ocean to East Africa — fleets dwarfing
//       anything in Europe. Then the Ming court ENDED them: the voyages were ruinously
//       costly, the Confucian scholar-officials saw foreign trade and eunuch power as
//       distractions, and the real threat was the land frontier — the Mongols to the
//       north — so wealth went into the Great Wall and the Grand Canal, not the sea.
//       China could have kept the oceans and chose not to. (Wrong reads: "the ships
//       failed / China couldn't build them" — the OPPOSITE was true; or "barbarians
//       smashed the fleet" — it was a POLICY choice, not a defeat.)
//       Set at CHANG'AN (the inland imperial capital), via a Ming scholar-official.
//
//   (b) THE SCIENTIFIC REVOLUTION WAS A NEW WAY OF KNOWING — believe what you can
//       OBSERVE, MEASURE, and TEST, not what an ancient authority decreed. For
//       centuries the truth about nature was settled by texts — Aristotle, Ptolemy,
//       Galen, the Church's reading of them. The new natural philosophers (Copernicus,
//       Galileo with his telescope, later Newton) trusted instruments and repeatable
//       evidence over inherited authority — and so the Earth went round the sun even
//       though every old book and every eye on the ground said otherwise. The METHOD
//       is the revolution. (Wrong reads: "they just found newer, better books" — the
//       point was distrusting authority itself; or "they proved the ancients right" —
//       they overturned them by observation.) Set at FLORENCE, via an instrument-maker.
//
//   (c) HUMANISM CHANGED THE VIEW OF THE INDIVIDUAL — the human being became worth
//       studying, capable, and dignified in THIS life, not merely a sinner awaiting
//       the next. Renaissance humanists revived Greek and Roman learning and studied
//       the "humanities" (grammar, rhetoric, history, poetry, moral philosophy);
//       they prized human reason, talent, education, and earthly achievement. Art put
//       real, particular people at the center; writers argued for human potential and
//       dignity. It is a shift in WHO matters and what a life is for. (Wrong reads:
//       "humanism rejected God / was atheism" — most humanists were devout, it was
//       a new emphasis, not a denial; or "it only meant studying old languages" — the
//       languages were the DOOR to a new, higher view of the human person.)
//       Set at FLORENCE, via a humanist tutor.
//
// Honest pedagogy & CED scope: every figure, place, and date is real Global-History-9
// material. The teaching voices are FICTIONAL period denizens (a Ming scholar-official,
// a Florentine instrument-maker, a humanist tutor) so nothing is mis-attributed. Real
// figures — the Yongle Emperor, Zheng He, Copernicus, Galileo, Petrarch, Erasmus,
// Pico della Mirandola — are described in PARAPHRASE grounded in the historical record,
// never with invented verbatim quotes. De-identified: the only real person ever named
// is "Mr. Maccarello".

export const pack = {
  // ---- identity ----
  id: 'd-tw-u7-renaissance-ming',
  unit: 'Unit 7 — Renaissance & Reformation',     // Codex group + author-facing label
  title: 'Why the Dragon Came Home, and the New Lens on the World',

  // ---- extra characters added to the world ----
  // Three FICTIONAL denizens. One Ming scholar-official at CHANG'AN (the inland
  // imperial capital — era 2 city, but this NPC is era 4 so it appears in the First
  // Global Age). Two Florentines at FLORENCE (era 4). Each carries one keystone and
  // serves as its mentor on a wrong answer.
  //
  // Chang'an's occupied offsets: Zhang Qian [-6,-4], Vandak [7,4], Roshanak [-7,6],
  //   plus the u6-postclassical pack's Chang'an NPC. New offset [11,-7] avoids them all.
  // Florence's occupied offsets: Lorenzo [6,-4], Lord Vasht [-6,6], Maestro Bernardo
  //   [-8,5], and the shipped u7 pack's Donata [10,6] + Niccolosa [8,9], plus the
  //   u6-postclassical Florence NPC. New offsets [-11,-7] and [12,2] avoid them all.
  npcs: [
    {
      id: 'd-tw-u7-ming-official',
      name: 'Xu Wenchang',
      title: 'Scholar-Official of the Ming Court',
      city: 'changan',                  // existing CITIES id (inland imperial capital)
      era: 4,                           // hidden until the world reaches Era IV (Ming era)
      offset: [11, -7],                 // clear of Zhang Qian/Vandak/Roshanak and any era-4 add
      hatKind: 'scholar',
      palette: { robe: 0x7a1f2d, trim: 0x4a1018, skin: 0xd9b07c, hat: 0x1c1c24 },
      keystoneId: 'd-tw-u7-ks-ming-inward',
      introText: 'You travel far for a trader, and you have the patient face of a man who reads before he speaks — the court would approve of you. I serve in the Ministry; I have read the memorials on the great voyages. You will have heard the tales: a fleet of hundreds of ships, treasure-junks taller than any vessel your western ports have seen, sailing all the way to the spice coasts and the shores of Africa, and then — gone. The dragon came home and stayed home. Stay a while. There is a thing about that choice that the whole world has misread, and a merchant ought to understand it.',
      afterText: 'You understand it now, and few foreigners do. We did not lose the sea — we chose to leave it. The treasury was not bottomless, the real knives were at our northern wall, and the men who hold the brush distrusted the men who held the rudder. So the gold went into the Wall and the Canal, and the great ships were left to rot. Remember it the way I do: an empire that could rule the oceans, that simply decided the oceans were not worth ruling. History turns on such decisions, not only on storms and battles.',
    },
    {
      id: 'd-tw-u7-instrument-maker',
      name: 'Ginevra',
      title: 'Instrument-Maker off the Ponte Vecchio',
      city: 'florence',                 // existing CITIES id (era 4)
      era: 4,                           // hidden until Era IV
      offset: [-11, -7],                // clear of Lorenzo/Vasht/Bernardo and the shipped u7 NPCs
      hatKind: 'none',
      palette: { robe: 0x2f5f6e, trim: 0x1d3a44, skin: 0xd9a066 },
      keystoneId: 'd-tw-u7-ks-scientific-revolution',
      introText: 'Mind the workbench, friend — those brass rings and ground lenses cost more than your whole caravan, and they are sharper than they look. I grind glass and fit instruments for the natural philosophers, the men who study the heavens and the falling of bodies. Strange company they are. They do not ask what the old books SAY about the world — they ask what a careful eye and a true measurement SHOW. There is a quarrel raging over that very difference, and a trader who weighs things ought to take its measure. Rest your feet and I will set it before you.',
      afterText: 'Yes — you have the heart of it. The old way was to settle a question by asking which ancient wrote it down: Aristotle said, Ptolemy said, and that was the end of it. The new way is to LOOK, to MEASURE, to TEST, and to follow the evidence even when it shames every old book and your own two eyes. That is the whole revolution — not a newer authority, but trusting OBSERVATION over authority itself. My lenses serve that. Carry it with you; once a mind learns to ask "but what does it SHOW?", it never fully unlearns the question.',
    },
    {
      id: 'd-tw-u7-humanist-tutor',
      name: 'Tommaso',
      title: 'Humanist Tutor of the Studia Humanitatis',
      city: 'florence',                 // existing CITIES id (era 4)
      era: 4,                           // hidden until Era IV
      offset: [12, 2],                  // clear of Lorenzo/Vasht/Bernardo and the shipped u7 NPCs
      hatKind: 'cap',
      palette: { robe: 0x5a3c7a, trim: 0x39264f, skin: 0xc98a5b, hat: 0x39264f },
      keystoneId: 'd-tw-u7-ks-humanism-individual',
      introText: 'You catch me between pupils, traveler. I teach the studia humanitatis — the humanities: the old Latin and Greek, the historians and poets and moralists of Rome and Athens, brought back to life after long sleep. The fashionable folk think I merely drill dead languages into bored sons. They miss the larger thing entirely. There is a change of MIND running under all this dusty grammar — a change in how we see the human creature itself. Sit; I will ask you to put your finger on it, for it is the secret engine of this whole rebirth.',
      afterText: 'You named it exactly. The languages were never the point — they were the DOOR. Behind that door is a new way of seeing the human person: not only a sinner waiting out a brief, wretched life before the real one, but a being of reason, talent, and dignity, made to study, to create, to act WELL in THIS world. We paint real faces now, write of human worth, school the young to become capable and good. That shift — the individual made worth studying and able to rise — is the quiet heart of the age. Go well, and think highly of the creature you are.',
    },
  ],

  // ---- named story-beat sequences (playCutscene format) ----
  cutscenes: {
    // Fires the first time the player reaches Chang'an in Era IV — frames the Ming
    // turning-inward question (the densest, most counter-intuitive of the three).
    DTW_U7_MING_INTRO: [
      {
        tint: 'cold', kicker: 'Chang\'an — the Inland Court', art: 'notice',
        text: 'Word runs the markets like a cold wind from the coast: the great Treasure Fleet sails no more. For thirty years, men say, the Yongle Emperor sent his admiral Zheng He across the southern seas — hundreds of ships, junks so vast a western galley would fit inside one hold, all the way to the spice coasts and the far shores of Africa, returning with envoys, marvels, even a living giraffe for the court. No power on Earth could match those fleets. And now the court has ended them. The yards lie quiet; the orders are to look north, to the Wall, not south to the water.',
      },
      {
        tint: 'stone', kicker: 'A question for a trader', art: 'portrait',
        palette: { robe: 0x7a1f2d, trim: 0x4a1018, skin: 0xd9b07c, hat: 0x1c1c24 },
        text: 'A scholar-official in dark court silk regards you with shrewd, unhurried eyes. "You trade the long roads," he says, "so weigh me a hard one. The richest, most powerful realm on Earth built the greatest fleet the world had ever seen — and then chose to BURN the bridge to the ocean and stay home. Not because it failed. Because it decided. Tell me WHY a superpower would do such a thing, and you will understand this century better than the kings of the West ever will." His name is Xu Wenchang. Go and reason it out with him.',
        cta: 'Seek out the scholar-official',
      },
    ],
  },

  // ---- triggers: when each cutscene fires (once) ----
  triggers: [
    {
      on: 'visit', value: 'changan', play: 'DTW_U7_MING_INTRO',
      reward: { house: 1, title: 'The Inland Court sets you a riddle', sub: 'Why would the world\'s greatest sea-power choose to come home and stay home?' },
    },
  ],

  // ---- THE CORE: keystones ----
  keystones: [
    // ========================================================================
    // KEYSTONE A — MING CHINA TURNED INWARD (why a superpower stopped exploring)
    // ========================================================================
    {
      id: 'd-tw-u7-ks-ming-inward',
      npc: 'd-tw-u7-ming-official',
      codexId: 'd-tw-u7-cx-ming-inward',
      house: 2,
      houseTitle: 'You read why the dragon came home',
      houseSub: 'A Ming scholar-official marks the House of the Open Road as one that knows a great power can choose its own limits.',
      flag: 'dTwU7MingInwardUnderstood',
      achievement: 'd-tw-u7-ach-dragon-came-home',
      start: 'challenge',
      nodes: {
        challenge: {
          text: 'Xu Wenchang sets down his brush. "So. The Yongle Emperor sent Zheng He out seven times — fleets of hundreds of ships, the treasure-junks the largest wooden vessels ever to float, reaching the spice coasts and the African shore and overawing every harbor in between. China could have made the whole Indian Ocean its own. Then the court ended the voyages, let the great ships rot, and turned its eyes to the northern frontier. The richest realm on Earth simply walked away from the sea. Tell me, merchant who weighs things: WHY would a superpower do that?"',
          choices: [
            {
              kind: 'say',
              // ★ RIGHT — it was a deliberate POLICY choice driven by cost, court
              //   priorities (Confucian officials vs eunuchs/trade), and the LAND
              //   threat from the Mongol north.
              label: 'Because it was a choice, not a failure — and a reasonable one for the court. The voyages drained the treasury for prestige, not profit; the Confucian scholar-officials distrusted the eunuchs who ran them and saw sea-trade as a vulgar distraction; and the real danger was on land, the Mongols at the northern wall. So China spent its wealth on the Great Wall and the Grand Canal and the frontier, and let the fleet go. It could have ruled the oceans and decided the oceans were not worth the price.',
              right: true,
              next: 'won',
            },
            {
              kind: 'say',
              // ✗ WRONG (the "they couldn't" / technical-failure misread).
              label: 'Because the great ships failed — they were too big to sail safely, the voyages went badly, and China simply could not keep building or manning such a fleet. They quit because they had to.',
              setFlag: 'dTwU7FailureMisread',
              next: 'reteachFailure',
            },
            {
              kind: 'say',
              // ✗ WRONG (the "they were defeated" misread).
              label: 'Because some enemy smashed the fleet — barbarians or a rival sea-power destroyed the Treasure Ships in battle, and a beaten China had no choice but to give up the ocean.',
              next: 'reteachDefeat',
            },
          ],
        },

        // ---- RIGHT PATH: the world changes ----
        won: {
          onEnter: 'reward',
          text: '(Xu Wenchang inclines his head, the smallest measure of respect.) "Just so — you see the decision behind the legend. The fleets were a wonder, but wonders are dear: each voyage cost a province\'s taxes and brought home tribute and giraffes, not the silver an empire runs on. We of the brush thought the eunuch-admirals overreached, and that an emperor\'s strength lay in good farming and a quiet frontier, not in chasing the horizon. And the horizon never threatened us — the Mongols did, on horseback, at the Wall. So the court poured its gold north and inland: the Great Wall rebuilt in stone, the Grand Canal kept flowing, the army faced the steppe. We did not lose the sea. We weighed it and let it go. Mr. Maccarello would say you understood a turning point the West would later be very glad of." He folds his hands. "The court knows your house now."',
          choices: [
            { label: 'Then I\'ll remember it — China chose to come home.', next: '@close' },
          ],
        },

        // ---- WRONG PATHS: consequence + re-teach + LOOP back ----
        reteachFailure: {
          text: '(Xu Wenchang almost laughs.) "Failed? You have it backwards, friend. The opposite was true. Those ships were the finest on Earth — compartmented hulls, magnetic compasses, charts a western pilot would weep for; Zheng He completed SEVEN voyages and came home each time. China did not stop because it COULD not sail; it stopped while it still sailed best of all the world. That is exactly what makes the choice so strange and so important. So ask the harder question: when a realm that CAN do a great thing decides to STOP doing it, what does that tell you about its priorities — its money, its politics, its real enemies? Weigh it again."',
          choices: [
            { label: 'I see — it was choosing to stop, not being unable. Let me answer again.', clearFlag: 'dTwU7FailureMisread', next: 'challenge' },
          ],
        },
        reteachDefeat: {
          text: '(Xu Wenchang shakes his head slowly.) "No enemy sank the Treasure Fleet. No power on the water came close to matching it — that is the whole point. The fleet was not beaten; it was BEACHED, by order of the court, and left to rot in the yards. The danger we feared was never at sea — it rode horses, the Mongols on the northern steppe, a threat by LAND. So the ships were not lost in battle; they were judged not worth their cost when the real war was elsewhere. Think about a powerful realm CHOOSING its limits for reasons of money and politics and land defense, not being forced to them. Try once more."',
          choices: [
            { label: 'Of course — no one defeated them; the court chose to stop. Let me try again.', next: 'challenge' },
          ],
        },
      },
    },

    // ========================================================================
    // KEYSTONE B — THE SCIENTIFIC REVOLUTION AS A NEW WAY OF KNOWING
    // ========================================================================
    {
      id: 'd-tw-u7-ks-scientific-revolution',
      npc: 'd-tw-u7-instrument-maker',
      codexId: 'd-tw-u7-cx-scientific-revolution',
      house: 2,
      houseTitle: 'You saw the new way of knowing',
      houseSub: 'A Florentine instrument-maker marks the House of the Open Road as one that asks not who said it, but what it shows.',
      flag: 'dTwU7SciRevUnderstood',
      achievement: 'd-tw-u7-ach-but-what-does-it-show',
      start: 'challenge',
      nodes: {
        challenge: {
          text: 'Ginevra holds a ground lens up to the light and squints through it at you. "Here is the quarrel that keeps my workshop busy. For a thousand years, the truth about the heavens and the body was settled by the old masters — Aristotle, Ptolemy, Galen — and by the Church\'s reading of them. The Sun went round the Earth because the books said so. Now a Polish churchman has put the Sun at the center, and a man in Padua turns my best lens on the night sky and sees moons circling another world — moons the old books swore could not exist. Tell me, trader who weighs things: what is REALLY new here? What is the true revolution?"',
          choices: [
            {
              kind: 'say',
              // ★ RIGHT — the revolution is the METHOD: trust observation, measurement,
              //   and testing over inherited authority.
              label: 'The new thing is HOW they decide what is true. The old way settled every question by which ancient authority wrote it down. The new natural philosophers trust what they can observe, measure, and test instead — Copernicus\'s reasoning, Galileo\'s telescope, repeatable evidence — and they follow it even when it overturns Aristotle and the Church\'s books and what the eye on the ground seems to show. The revolution is the METHOD itself: observation and evidence above authority.',
              right: true,
              next: 'won',
            },
            {
              kind: 'say',
              // ✗ WRONG (the "newer authority" misread — still settling by who said it).
              label: 'The new thing is just better books. They found newer, smarter authorities to believe — Copernicus instead of Ptolemy — and now everyone copies the new masters the same way they once copied the old ones. One set of experts traded for another.',
              setFlag: 'dTwU7AuthorityMisread',
              next: 'reteachAuthority',
            },
            {
              kind: 'say',
              // ✗ WRONG (the "proved the ancients right" misread — backwards).
              label: 'The new thing is that careful study finally PROVED the ancients were right all along. The instruments confirm Aristotle and Ptolemy; the Earth sits still at the center, and the new philosophers merely polished the old truth.',
              next: 'reteachConfirm',
            },
          ],
        },

        // ---- RIGHT PATH: the world changes ----
        won: {
          onEnter: 'reward',
          text: '(Ginevra lowers the lens, grinning.) "There — said like one of them. For a thousand years a hard question ended the same way: which great name wrote it down? Aristotle said, Galen said, and the matter was closed. These new minds answer differently — they LOOK. They build the lens, they measure the falling stone, they do the thing again to be sure, and they trust the result over every dusty page AND over plain appearance, for the ground feels still yet wheels through the heavens. They have been threatened for it; truth bought with evidence is dangerous to anyone whose power rests on the old answers. But the method is loose now, and it cannot be called back. Mr. Maccarello would call it a new pair of eyes for the whole human race." She taps the lens. "My craft is honored to know your house."',
          choices: [
            { label: 'Then I\'ll carry it — ask not who said it, but what it shows.', next: '@close' },
          ],
        },

        // ---- WRONG PATHS: consequence + re-teach + LOOP back ----
        reteachAuthority: {
          text: '(Ginevra sets the lens down and shakes her head.) "Ah — but that would change nothing of real worth, only the names you bow to. The whole point is that these men refuse to settle truth by ANY name. Galileo did not say \'believe Copernicus because he is the new master\'; he said \'turn the glass on Jupiter and SEE the moons for yourself, then judge.\' If a thing can be tested and shown, it does not matter who first claimed it — and if it cannot be shown, no great name can save it. That is the break: not a newer authority, but distrusting authority itself in favor of evidence. So ask again — what kind of change is THAT? Weigh it once more."',
          choices: [
            { label: 'I see — it is not a new master but a new TEST for truth. Let me answer again.', clearFlag: 'dTwU7AuthorityMisread', next: 'challenge' },
          ],
        },
        reteachConfirm: {
          text: '(Ginevra winces.) "You have it exactly backwards, friend, and gently I will turn you round. The instruments did not confirm the ancients — they OVERTURNED them. The lens showed moons orbiting Jupiter, mountains on the Moon, the phases of Venus — things Aristotle and Ptolemy swore were impossible. The Sun, not the Earth, sits at the center; the careful eye proved the old certainty wrong. That is precisely why it shook the world and why it cost some of these men dearly. The revolution is not polishing old truth — it is letting OBSERVATION beat inherited authority even when the authority loses. Now think on what is truly new in their way of knowing. Try once more."',
          choices: [
            { label: 'Of course — observation overturned the ancients, it did not confirm them. Let me try again.', next: 'challenge' },
          ],
        },
      },
    },

    // ========================================================================
    // KEYSTONE C — HUMANISM CHANGED THE VIEW OF THE INDIVIDUAL
    // ========================================================================
    {
      id: 'd-tw-u7-ks-humanism-individual',
      npc: 'd-tw-u7-humanist-tutor',
      codexId: 'd-tw-u7-cx-humanism-individual',
      house: 2,
      houseTitle: 'You found the new view of the human person',
      houseSub: 'A humanist tutor marks the House of the Open Road as one that grasps the quiet engine of the rebirth.',
      flag: 'dTwU7HumanismUnderstood',
      achievement: 'd-tw-u7-ach-dignity-of-the-individual',
      start: 'challenge',
      nodes: {
        challenge: {
          text: 'Tommaso spreads a worn copy of an old Roman orator on the desk between you. "Everyone praises the new art and the recovered books, but few can say what truly CHANGED. We humanists revived the Latin and Greek and studied the humanities — history, poetry, rhetoric, moral philosophy. But the languages are only the surface. Beneath them runs a new idea about the human creature itself — a shift in who matters and what a life is FOR. Tell me, trader who weighs things: what is the deeper change that humanism brought?"',
          choices: [
            {
              kind: 'say',
              // ★ RIGHT — a new, higher view of the individual: capable, dignified,
              //   worth studying, meant to act and achieve in THIS life.
              label: 'It changed how you see the individual human being. The old view fixed every eye on the next life and on the human as a lowly sinner; humanism lifts the person here and now — a creature of reason, talent, and dignity, worth studying and able to learn, create, and live well in THIS world. That is why the art shows real, particular faces, why writers argue for human worth and potential, and why the young are schooled to become capable and good. The deeper change is a higher view of the individual.',
              right: true,
              next: 'won',
            },
            {
              kind: 'say',
              // ✗ WRONG (the "humanism = atheism / rejecting God" misread).
              label: 'It rejected God and religion altogether. Humanism means turning away from faith — the new thinkers were unbelievers who put man in the place of heaven and threw out the Church.',
              setFlag: 'dTwU7AtheismMisread',
              next: 'reteachAtheism',
            },
            {
              kind: 'say',
              // ✗ WRONG (the "it's only old languages" misread — the surface).
              label: 'It only meant learning old languages well. Humanism is simply better Latin and Greek and tidier grammar — scholars dusting off ancient books, with no change in how anyone thinks about people or life.',
              next: 'reteachLanguages',
            },
          ],
        },

        // ---- RIGHT PATH: the world changes ----
        won: {
          onEnter: 'reward',
          text: '(Tommaso closes the old book with reverence.) "Yes — you have walked through the door instead of stopping at it. We dig up Cicero and Plato not to hoard dead grammar but because they took the human creature SERIOUSLY: its reason, its speech, its capacity for excellence in the public world. From that springs everything you see — painters who give a merchant\'s wife a real and particular face; teachers who school boys, and some girls, to be capable and virtuous; writers who dare to speak of human dignity and the heights a person may reach by study and effort. Most of us are devout still; we have not thrown out heaven, only stopped treating this life as worthless rubble on the way there. The individual has become worth studying and able to rise. Mr. Maccarello would call that the quiet engine under the whole age." He bows slightly. "Your house honors my classroom."',
          choices: [
            { label: 'Then I\'ll carry it — the human being became worth studying.', next: '@close' },
          ],
        },

        // ---- WRONG PATHS: consequence + re-teach + LOOP back ----
        reteachAtheism: {
          text: '(Tommaso raises a hand, not offended, only correcting.) "Gently, friend — that is the common slander and it is wrong. Look at us: most humanists are faithful Christians; some are priests and bishops. We did not throw out God. What we changed was the EMPHASIS — from a life seen only as a wretched waiting-room for heaven, to a belief that the human person, made by God, has reason and dignity and is meant to use them WELL in this world too. It is a new height for the human creature, not a denial of the divine. So set aside \'they rejected God\' and ask the true question: how did humanism change the way people valued the human INDIVIDUAL? Weigh it again."',
          choices: [
            { label: 'I see — not rejecting God, but raising the worth of the human person. Let me answer again.', clearFlag: 'dTwU7AtheismMisread', next: 'challenge' },
          ],
        },
        reteachLanguages: {
          text: '(Tommaso smiles patiently and taps the book.) "The languages are real, yes — but they are the KEY, not the treasure behind the lock. We learned Cicero\'s Latin and Plato\'s Greek so we could hear again how the ancients prized human reason, civic virtue, and earthly achievement — and that hearing changed how we see ourselves. You can feel it everywhere: the portraits of real, particular people; the schools teaching boys to become capable men of affairs; the bold new talk of human dignity and potential. Grammar did not stay grammar — it opened a higher view of the person. So press past the surface: what did all that old learning DO to the way people regard the individual human being? Try once more."',
          choices: [
            { label: 'Of course — the languages were the door to a new view of the person. Let me try again.', next: 'challenge' },
          ],
        },
      },
    },
  ],

  // ---- Codex: the real ideas this pack teaches ----
  codex: [
    {
      id: 'd-tw-u7-cx-ming-inward',
      group: 'Unit 7 — Renaissance & Reformation',
      title: 'Why Ming China turned inward and stopped exploring',
      idea: 'Ming China ended Zheng He\'s great Treasure-Fleet voyages (1405-1433) by deliberate policy, not failure: the voyages were ruinously costly and brought prestige rather than profit, the Confucian scholar-officials distrusted the eunuch admirals and foreign sea-trade, and the true threat was the Mongols on the land frontier — so the empire poured its wealth into the Great Wall, the Grand Canal, and the north and abandoned the oceans it had been able to dominate.',
      source: 'Xu Wenchang, scholar-official of the Ming court (on the end of the Treasure Fleet)',
    },
    {
      id: 'd-tw-u7-cx-scientific-revolution',
      group: 'Unit 7 — Renaissance & Reformation',
      title: 'The Scientific Revolution as a new way of knowing',
      idea: 'The Scientific Revolution was a change in HOW people decided what is true: instead of settling questions by ancient authority (Aristotle, Ptolemy, Galen) and the Church\'s reading of them, natural philosophers like Copernicus and Galileo trusted observation, measurement, and repeatable testing — using instruments such as the telescope — and followed the evidence even when it overturned the old books, so the method of evidence-over-authority is the real revolution.',
      source: 'Ginevra, instrument-maker of Florence (on Copernicus, Galileo, and the new natural philosophy)',
    },
    {
      id: 'd-tw-u7-cx-humanism-individual',
      group: 'Unit 7 — Renaissance & Reformation',
      title: 'How humanism changed the view of the individual',
      idea: 'Renaissance humanism revived Greek and Roman learning and the studia humanitatis (history, poetry, rhetoric, moral philosophy) and used it to lift the view of the human being: the individual became a creature of reason, talent, and dignity worth studying and able to achieve in THIS life — seen in lifelike portraits of real people, education aimed at capable virtuous citizens, and bold claims for human worth — a new emphasis on human potential that, for most humanists, complemented rather than denied their Christian faith.',
      source: 'Tommaso, humanist tutor of the studia humanitatis (on Petrarch, Erasmus, and the dignity of the individual)',
    },
  ],

  // ---- Achievements: optional milestones ----
  achievements: [
    {
      id: 'd-tw-u7-ach-dragon-came-home',
      title: 'The dragon came home',
      desc: 'You understood that Ming China ended its great voyages by choice — for cost, court politics, and a land threat — not because the fleet failed.',
    },
    {
      id: 'd-tw-u7-ach-but-what-does-it-show',
      title: 'But what does it show?',
      desc: 'You understood the Scientific Revolution as a new way of knowing: trusting observation and evidence over inherited authority.',
    },
    {
      id: 'd-tw-u7-ach-dignity-of-the-individual',
      title: 'The dignity of the individual',
      desc: 'You understood that humanism raised the view of the human person — reason, talent, and dignity worth studying in this life.',
    },
  ],
};

export default pack;
