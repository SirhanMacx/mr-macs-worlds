// density-u3-belief.js — DENSITY STORY-PACK: Unit 3, Belief Systems (more).
//
// Additive, pure-DATA ES module (no imports, no engine calls — it can never crash
// the world on its own). The loader in ../../game.js wires everything below into
// the live game: it adds the NPCs, fires the cutscene once, makes each keystone
// reachable, records the Codex entry, lifts House Standing, and unlocks the
// achievement. See packs/CONTRACT.md for the authoritative field spec, and
// unit3-belief-systems.js for the gold-standard shape this file copies.
//
// This is the SECOND, DENSER Unit-3 pack. The shipped pack (`u3-belief-systems`)
// already teaches WHY a ruler adopts and spreads a belief to UNIFY an empire and
// LEGITIMIZE himself (Ashoka / Buddhist dhamma). This pack does NOT repeat that.
// It deepens Unit 3 toward full coverage with NEW keystones:
//
//   (a) A belief system both UNIFIES a society AND JUSTIFIES its HIERARCHY. Two
//       cases, side by side:
//         • Confucian filial/social order — the Five Relationships rank everyone
//           (ruler/subject, parent/child, elder/younger…) so that the same
//           teaching that makes a society peaceful and orderly ALSO fixes who is
//           above whom. (Taught at Varanasi by a traveling scholar of the Ru
//           tradition — the teaching VOICE is a fictional in-world denizen; the
//           ideas are paraphrased from the record, the Analects, never invented
//           as verbatim quotes by the historical Confucius.)
//         • Hindu dharma & varna — duty (dharma) is assigned by birth-station
//           (varna), so belief binds an immense, diverse society into ONE cosmic
//           order while justifying the social ranks within it. (Taught at
//           Varanasi, the sacred Ganges city, by a Brahmin priest of the ghats.)
//
//   (b) MONOTHEISM vs POLYTHEISM vs ETHICAL PHILOSOPHY as three different answers
//       to one human question — "how should we live?" One God who commands a
//       covenant and a moral law (the Abrahamic tradition, whose origin story
//       places Abraham at Ur); MANY gods who must be fed with offerings and
//       bargained with (Mesopotamian polytheism, the living religion of Ur); and
//       an ethical WAY that answers the question of right conduct without making
//       worship its center (the Confucian / Daoist "way of living well"). Taught
//       at Ur by an Abrahamic herdsman-elder and a temple scribe of the moon-god
//       Nanna, with the Ru scholar's "way" recalled as the third path.
//
// Honest pedagogy: every figure, place, text, and idea named is real history and
// within Global-History-9 / NYS-Framework scope. Real teachings are referenced by
// the record (the Analects; the Vedic varna/dharma scheme; the Abrahamic covenant
// tradition; Mesopotamian cult practice) and the SPEAKING voices are fictional
// in-world denizens, so nothing is mis-attributed and no verbatim quote is
// invented for a historical person. De-identified: the only real modern person
// ever named anywhere in the world is "Mr. Maccarello".
//
// ID DISCIPLINE: every id here is namespaced with the prefix "d-tw-u3-" so it can
// NEVER collide with the shipped `u3-belief-systems` pack or any other pack.
//
// PLACEMENT (offsets chosen to dodge every existing NPC):
//   Varanasi (era 2): core Devala [6,-4]; shipped-pack monk Tissa [-6,5].
//     This pack adds the Ru scholar at [10,4] and the Brahmin priest at [-10,-3].
//   Ur (era 1): core Sarpa [4,5], Mar-Sippar [-7,4], Nin-Banda [7,-3].
//     This pack adds the Abrahamic elder at [2,-8] and the Nanna scribe at [-3,-8].

export const pack = {
  // ---- identity ----
  id: 'd-tw-u3-belief-density',
  unit: 'Unit 3 — Belief Systems',          // Codex group + author-facing label
  title: 'Belief, Hierarchy, and the Question "How Should We Live?"',

  // ---- extra characters added to the world ----
  npcs: [
    {
      id: 'd-tw-u3-ru-scholar',
      name: 'Yan Rong',
      title: 'Traveling Scholar of the Ru Tradition',
      city: 'varanasi',
      era: 2,
      offset: [10, 4],                  // far right; clear of Devala/Tissa & wanderers
      hatKind: 'scholar',
      palette: { robe: 0x2f5d4a, trim: 0x1c3a2e, skin: 0xd9b07c, hat: 0x16281f },
      keystoneId: 'd-tw-u3-ks-confucian-hierarchy',
      introText: 'You are far from my master\'s country, trader, and so am I — I carry his teaching west the way you carry cloth. We of the Ru school study one thing above all: how people should treat one another so a household, a village, a whole realm can live in peace. We do not begin with the gods. We begin with the bond between a parent and a child, and we build outward from there. Sit a while; there is a riddle in that bond worth your time.',
      afterText: 'You have it now: order and rank are the SAME thread for us. The Five Relationships make a society gentle and predictable — and in the same breath they fix who must defer to whom. A teaching can knit a people together and rank them at once; the two are not opposites. Carry that wherever you trade.',
    },
    {
      id: 'd-tw-u3-brahmin-priest',
      name: 'Devadatta',
      title: 'Brahmin Priest of the Ganges Ghats',
      city: 'varanasi',
      era: 2,
      offset: [-10, -3],                // far left; clear of Devala/Tissa/Zhang-style slots
      hatKind: 'none',
      palette: { robe: 0xe8e0cf, trim: 0xb8a878, skin: 0xa9672f, hat: 0xb8a878 },
      keystoneId: 'd-tw-u3-ks-dharma-varna',
      introText: 'Welcome to Kashi, the city of light, where the dying come to cross over and the living come to be made clean. You see every kind of person on these steps — priest and warrior, farmer and sweeper — and yet it is ONE order, not a chaos. There is a teaching beneath that order. A trader who moves among all sorts of people should understand what holds them in one frame. Ask me, and I will show you.',
      afterText: 'So you grasp it: each person is born to a station with its own dharma, its own right duty, and to do your own duty well is to keep the whole in balance. It makes one society out of a thousand kinds of people — and it sets each in his place. Belief that unifies and belief that ranks: here they are one and the same teaching. Go in peace, friend.',
    },
    {
      id: 'd-tw-u3-abrahamic-elder',
      name: 'Terah-ben-Nahor',
      title: 'Herdsman-Elder of the One God',
      city: 'ur',
      era: 1,
      offset: [2, -8],                  // bottom-center; clear of Sarpa/Mar-Sippar/Nin-Banda
      hatKind: 'hood',
      palette: { robe: 0xb5a079, trim: 0x6e5e3c, skin: 0xc98a5b, hat: 0x6e5e3c },
      keystoneId: 'd-tw-u3-ks-how-to-live',
      introText: 'Peace to you, stranger, here in the city of the moon. My people keep a thing this great city finds strange: we hold that there is but ONE God over all, who made the heavens and asks of us not offerings of meat but justice and faithfulness — a covenant, a binding promise between God and a people. The temple folk here would call us fools. Before you judge, weigh what each of us is really answering. There is a question under all of it.',
      afterText: 'You see it clearly now: the temple and I and the eastern scholar are all answering ONE question — how should a person live? — and we give three different shapes of answer. One God who commands a moral law; many gods who must be fed and bargained with; and a master who teaches right conduct without making worship the center at all. Three roads, one question. That is the whole of it. Go well.',
    },
    {
      id: 'd-tw-u3-nanna-scribe',
      name: 'Lugal-amar',
      title: 'Temple Scribe of Nanna',
      city: 'ur',
      era: 1,
      offset: [-3, -8],                 // bottom-center-left; clear of all Ur NPCs
      hatKind: 'cap',
      palette: { robe: 0x6e87b0, trim: 0x3c4f73, skin: 0xb98a5e, hat: 0x2c3a55 },
      // No keystone of its own — a memory-branching supporting voice that
      // references the player's choices (the polytheist's case + reaction).
      introText: 'I keep the offering-lists for the great temple of Nanna, lord moon of Ur — barley, beer, oil, the fat rams. The gods are many, like a great household of lords, and like any lord they must be fed and flattered or they grow angry and the river fails or the enemy comes. That is religion as Ur has always known it: do right by the gods, and they do right by you. A bargain, kept in both directions.',
      afterText: 'The herdsman-elder and I will never agree, and that is well — but you, trader, weighed us both fairly instead of laughing at either. Few do. Whatever road you keep, you have learned to SEE a belief before you measure it. The moon-god grant you a steady river under your boats.',
    },
  ],

  // ---- named story-beat sequences (playCutscene format) ----
  cutscenes: {
    // Fires the first time the player reaches Varanasi in Era II — frames the
    // "unifies AND ranks" question before the player meets the two teachers.
    D_TW_U3_CROSSROADS: [
      {
        tint: 'stone', kicker: 'Varanasi — Where the Teachings Meet', art: 'notice',
        text: 'On the ghats of Kashi the talk is not of pepper but of HOW TO LIVE. A Brahmin recites the duties owed to one\'s station; beside him a traveling scholar from the far east argues that order begins not with the gods at all, but with the bond between a parent and a child. Two teachings, two peoples — and both, you notice, somehow knit a society together AND tell each person exactly where he stands in it.',
      },
      {
        tint: 'amber', kicker: 'A merchant\'s puzzle', art: 'portrait',
        palette: { robe: 0x2f5d4a, trim: 0x1c3a2e, skin: 0xd9b07c, hat: 0x16281f },
        text: 'The eastern scholar reads your trader\'s eye. "You weigh things for a living," he says. "Then weigh this: how can ONE teaching make a people gentle and united, and in the very same breath decide who must bow to whom? Most merchants think peace and rank pull against each other. Find why they don\'t, and you will read every court and every household you ever bargain in." His name is Yan Rong. Seek him, and the priest beside him.',
        cta: 'Seek the two teachers',
      },
    ],
  },

  // ---- triggers: when each cutscene fires (once) ----
  triggers: [
    {
      on: 'visit', value: 'varanasi', play: 'D_TW_U3_CROSSROADS',
      reward: { house: 1, title: 'A puzzle on the ghats', sub: 'Varanasi asks how one teaching can unite a people and rank them at once.' },
    },
  ],

  // ---- THE CORE: keystones ----
  keystones: [
    // ============================================================
    // KEYSTONE 1 — Confucian filial/social order: belief that UNIFIES
    // a society AND JUSTIFIES its hierarchy (the Five Relationships).
    // ============================================================
    {
      id: 'd-tw-u3-ks-confucian-hierarchy',
      npc: 'd-tw-u3-ru-scholar',
      codexId: 'd-tw-u3-cx-confucian-hierarchy',
      house: 2,
      houseTitle: 'You saw order and rank as one thread',
      houseSub: 'A scholar of the Ru tradition marks the House of the Open Road as one that understands how a teaching unites and ranks at once.',
      flag: 'dTwU3ConfucianUnderstood',
      achievement: 'd-tw-u3-ach-order-and-rank',
      start: 'challenge',
      nodes: {
        challenge: {
          text: 'Yan Rong sets a worn bamboo slip on his knee. "My master taught Five Relationships — ruler and subject, parent and child, husband and wife, elder and younger, friend and friend. Each side owes the other something: the parent is kind, the child is dutiful; the ruler is just, the subject is loyal. We call the root of it FILIAL devotion — honor flowing up to those above you, care flowing down to those below. Now weigh it, merchant: a kingdom that lives this way is famously peaceful and orderly. But tell me what ELSE such a teaching does. WHY would a ruler love it?"',
          choices: [
            {
              kind: 'say',
              // ★ RIGHT — the same teaching that unifies ALSO justifies hierarchy.
              label: 'Because the very thing that keeps the peace also fixes who stands above whom. If every person learns to defer to those above and care for those below, the whole society runs smoothly without force — but the same lesson teaches the subject to obey the ruler and the child the parent as the natural, RIGHT order. The teaching unifies the realm and justifies its hierarchy in one breath, so a ruler gets harmony and obedience together.',
              right: true,
              next: 'won',
            },
            {
              kind: 'say',
              // ✗ WRONG (the "it's only manners" misread).
              label: 'Because it is simply good manners — politeness between people, nothing to do with power. A ruler likes it the way anyone likes a courteous neighbor; it is etiquette, not statecraft.',
              setFlag: 'dTwU3MannersMisread',
              next: 'reteachManners',
            },
            {
              kind: 'say',
              // ✗ WRONG (the "it must be the gods' command" misread).
              label: 'Because the gods decreed these ranks, and to break them is to sin against heaven. It is religious law handed down from above, like an offering owed to a temple.',
              next: 'reteachGods',
            },
          ],
        },

        won: {
          onEnter: 'reward',
          text: '(Yan Rong inclines his head the careful degree a teacher gives an equal.) "Yes. You have seen the hinge. Filial devotion makes a son honor his father — and by the same habit makes a subject honor his ruler. The bond that keeps a family gentle is the bond that keeps an empire from flying apart, AND it is the bond that tells each person to keep his place. A ruler loves it because it gives him obedience that feels like virtue, not chains. Order and rank, one thread. You read it before I could finish the riddle." He rolls the slip closed. "Your house has a scholar\'s respect on every road."',
          choices: [
            { label: 'Then I will carry that thread with me.', next: '@close' },
          ],
        },

        reteachManners: {
          text: '(Yan Rong smiles, unoffended.) "Manners are the surface, friend — but look under them. When a child is taught to defer to a parent in EVERYTHING, he is also being taught to defer to the ruler, the elder, the husband. The same habit that makes a household gentle makes a subject loyal. It is not idle courtesy; it is the quiet architecture of who obeys whom. Ask again what such a teaching DOES for a ruler — not how polite it looks, but what power it secures." He waits. "Weigh it once more."',
          choices: [
            { label: 'I see — it builds obedience into the manners themselves. Let me answer again.', clearFlag: 'dTwU3MannersMisread', next: 'challenge' },
          ],
        },
        reteachGods: {
          text: '(Yan Rong shakes his head gently.) "You reach for heaven, but my master rarely did. He was asked about serving the spirits and answered, in effect, that one should first learn to serve the living — the world of people came first for him. The Five Relationships are not a god\'s decree; they are a teaching ABOUT people, for people. That is exactly what makes them so useful to a king: he need not summon a god to demand obedience — the teaching makes obedience feel like simple virtue. Think less of heaven and more of the household and the throne. Try once more."',
          choices: [
            { label: 'Of course — it works through people, not the gods. Let me try again.', next: 'challenge' },
          ],
        },
      },
    },

    // ============================================================
    // KEYSTONE 2 — Hindu dharma & varna: belief that UNIFIES a vast,
    // diverse society into ONE order while JUSTIFYING its ranks.
    // ============================================================
    {
      id: 'd-tw-u3-ks-dharma-varna',
      npc: 'd-tw-u3-brahmin-priest',
      codexId: 'd-tw-u3-cx-dharma-varna',
      house: 2,
      houseTitle: 'You read duty as both bond and rank',
      houseSub: 'A Brahmin of the Ganges marks the House of the Open Road as one that understands how dharma unifies a society and orders it.',
      flag: 'dTwU3DharmaUnderstood',
      // shares the same milestone as keystone 1 (both teach unify+justify-hierarchy)
      achievement: 'd-tw-u3-ach-order-and-rank',
      start: 'challenge',
      nodes: {
        challenge: {
          text: 'Devadatta gestures down the crowded steps — priests chanting, a warrior in mail, a farmer with his sack, a sweeper at the water\'s edge. "You see four kinds of people, and more, and yet they are ONE order, not a brawl. We teach that the world is arranged in varna — broad ranks of society — and that each person has a dharma, a right duty, fitted to his station and his stage of life. A warrior\'s dharma is to fight justly; a farmer\'s is to till; a priest\'s is to keep the rites. Tell me, trader: how can such a teaching make ONE people out of so many sorts — and what does it do to the ranks between them?"',
          choices: [
            {
              kind: 'say',
              // ★ RIGHT — duty-by-station unifies the whole AND fixes the hierarchy.
              label: 'Because giving every person a duty fitted to his station knits all those different kinds into one cosmic order — each part doing its work keeps the whole in balance, so a thousand sorts of people become one society. But the same teaching fixes the ranks in place: it says your station and its duty are RIGHT, even sacred, so the hierarchy is not questioned but honored. The belief unifies the society and justifies its inequality at the very same time.',
              right: true,
              next: 'won',
            },
            {
              kind: 'say',
              // ✗ WRONG (the "everyone is equal, just different jobs" misread).
              label: 'Because it makes everyone equal — it is only a way of dividing up the work, like a guild sorting trades, with no one really above anyone else.',
              setFlag: 'dTwU3EqualityMisread',
              next: 'reteachEquality',
            },
            {
              kind: 'say',
              // ✗ WRONG (the "it's purely about the afterlife, not society" misread).
              label: 'Because it is only about the next life — duty has nothing to do with holding society together now; it is a private matter between a soul and the heavens.',
              next: 'reteachAfterlife',
            },
          ],
        },

        won: {
          onEnter: 'reward',
          text: '(Devadatta presses his palms together, pleased.) "You have understood Kashi itself. When the priest keeps the rite and the farmer tills and the warrior guards — each holding to his own dharma — the world stays whole; that is how so many peoples live as ONE. And because each station is taught to be its rightful place, no one need force the order: it is believed in. That is the power and the price of it together. A teaching that binds a vast land and ranks it in one stroke." He marks your brow with ash. "Walk clean, friend of the river."',
          choices: [
            { label: 'I\'ll carry both the binding and the cost.', next: '@close' },
          ],
        },

        reteachEquality: {
          text: '(Devadatta shakes his head, not unkindly.) "Would that it were only equal trades, but be honest with what you see on these very steps — the priest is held high and the sweeper low, and the teaching does not call that an accident. Dharma does bind us into one order, yes; but it does so by RANKING us and calling the ranks right. Do not mistake unity for equality — the genius and the hardness of it is that it gives you both at once: one society, unequal but unquestioned. Look again, and tell me what the teaching does to the ranks, not just to the work."',
          choices: [
            { label: 'I understand — it unites by ranking, not by leveling. Let me answer again.', clearFlag: 'dTwU3EqualityMisread', next: 'challenge' },
          ],
        },
        reteachAfterlife: {
          text: '(Devadatta lifts a hand toward the living crowd.) "The next life is real to us, true — but look here, NOW. When every person does his own duty in THIS world, the fields are tilled, the rites are kept, the kingdom holds. Dharma is not only a soul\'s private path; it is the mortar of a living society, telling each person his place and his work so the whole stands together. The here-and-now order is the point as much as the hereafter. Weigh again what it does to hold this crowd as one people."',
          choices: [
            { label: 'Yes — it orders this world, not only the next. Let me try again.', next: 'challenge' },
          ],
        },
      },
    },

    // ============================================================
    // KEYSTONE 3 — Monotheism vs polytheism vs ethical philosophy as
    // three answers to "how should we live?" Set at Ur.
    // ============================================================
    {
      id: 'd-tw-u3-ks-how-to-live',
      npc: 'd-tw-u3-abrahamic-elder',
      codexId: 'd-tw-u3-cx-how-to-live',
      house: 2,
      houseTitle: 'You read three faiths as three answers',
      houseSub: 'An elder of the one God marks the House of the Open Road as one that hears the same question under very different beliefs.',
      flag: 'dTwU3HowToLiveUnderstood',
      achievement: 'd-tw-u3-ach-three-roads',
      start: 'challenge',
      nodes: {
        challenge: {
          text: 'Terah-ben-Nahor squats by his small fire, away from the great ziggurat of Nanna. "Hear the differences plainly, trader. The temple of Ur keeps MANY gods — the moon, the sky, the storm — and serves them with offerings: feed them, flatter them, and they keep the river and the harvest; anger them, and ruin comes. WE keep but ONE God over all, who wants not fat rams but a covenant — that we deal justly and stay faithful, and the moral law that follows from it. And far to the east, men say, a master teaches how to live rightly with barely a word about gods at all. Three peoples, three beliefs. Tell me what they have in COMMON — what one thing are all three really answering?"',
          choices: [
            {
              kind: 'say',
              // ★ RIGHT — all three answer "how should we live?" in different shapes.
              label: 'They are all answering the same human question — how should a person live? — but in three different shapes. Your one God answers it with a covenant and a moral law given from above; the temple answers it with many gods who must be fed and bargained with so the world stays in your favor; and the eastern master answers it with an ethical way of right conduct that hardly needs the gods at all. Monotheism, polytheism, and a philosophy of living — three roads to the one question of how to live well.',
              right: true,
              next: 'won',
            },
            {
              kind: 'say',
              // ✗ WRONG (the "one is true, the others are just wrong/false" misread).
              label: 'They have nothing in common — yours is simply the true one and theirs are false superstitions, errors to be pitied. There is no shared question, only right belief and wrong belief.',
              setFlag: 'dTwU3TrueFalseMisread',
              next: 'reteachTrueFalse',
            },
            {
              kind: 'say',
              // ✗ WRONG (the "all religion is just fear of nature" reductive misread).
              label: 'They are all the same thing exactly — just frightened people inventing gods to explain thunder and floods. There is no real difference between any of them, and no real question underneath.',
              next: 'reteachReductive',
            },
          ],
        },

        won: {
          onEnter: 'reward',
          text: '(The old herdsman nods slowly, the fire low between you.) "You hear it. I will never agree that the temple\'s gods are real, nor will the scribe ever bow to mine, nor either of us follow the eastern master — and yet you are right that all three of us stand before the SAME question: how ought a person to live, and what keeps the world in order? One answers with a covenant and a law from one God; one with offerings to many; one with a way of right conduct and no need of worship at all. To see the shared question without flattening the real differences — that is rare wisdom in a young trader. Go in the favor of the One." ',
          choices: [
            { label: 'Three roads, one question — I\'ll remember it that way.', next: '@close' },
          ],
        },

        reteachTrueFalse: {
          text: '(Terah-ben-Nahor raises a patient hand.) "I hold the One God true with all my heart, friend — but that is MY answer, not the question. Step back from who is right. The scribe at the temple and the eastern master are not merely wrong; they are giving DIFFERENT answers to the very thing I care about — how a person should live, and what holds the world together. A monotheist, a polytheist, and a philosopher of conduct are three travelers on one road, asking one thing. Find the question they share, beneath the answers you would judge. Weigh it again."',
          choices: [
            { label: 'I see — set aside which is right and find the shared question. Let me answer again.', clearFlag: 'dTwU3TrueFalseMisread', next: 'challenge' },
          ],
        },
        reteachReductive: {
          text: '(The elder shakes his head firmly but without anger.) "No — do not flatten them into one fearful mush. The differences are REAL and they matter: one God who commands a moral covenant is not the same as a household of gods to be bartered with, and neither is a teaching that answers how to live with hardly a god in sight. They are not identical and they are not all mere fear of thunder. They are three genuinely DIFFERENT answers — to one shared question about how to live. Honor the difference AND find the common question. Try once more."',
          choices: [
            { label: 'You\'re right — different answers, one shared question. Let me try again.', next: 'challenge' },
          ],
        },
      },
    },
  ],

  // ---- Codex: the real ideas this pack teaches ----
  codex: [
    {
      id: 'd-tw-u3-cx-confucian-hierarchy',
      group: 'Unit 3 — Belief Systems',
      title: 'A belief system unifies a society and justifies its hierarchy (Confucianism)',
      idea: 'Confucian teaching binds a society in peace and fixes its ranks with one idea: the Five Relationships and filial devotion train each person to defer to those above and care for those below, so that the same habit that makes a household gentle makes a subject obey a ruler — giving rulers harmony and a justified hierarchy at once.',
      source: 'Yan Rong, traveling scholar of the Ru tradition (paraphrasing the Analects of Confucius)',
    },
    {
      id: 'd-tw-u3-cx-dharma-varna',
      group: 'Unit 3 — Belief Systems',
      title: 'A belief system unifies a society and justifies its hierarchy (Hindu dharma & varna)',
      idea: 'In Hindu teaching, varna (broad social ranks) and dharma (one\'s right duty by station) knit a vast, diverse society into one cosmic order — each part doing its proper work keeps the whole in balance — while at the same time declaring each station and its inequality rightful and even sacred, so the hierarchy is honored rather than questioned.',
      source: 'Devadatta, Brahmin priest of the Ganges ghats (on varna and dharma)',
    },
    {
      id: 'd-tw-u3-cx-how-to-live',
      group: 'Unit 3 — Belief Systems',
      title: 'Monotheism, polytheism, and ethical philosophy as answers to "how should we live?"',
      idea: 'Belief systems give different shapes of answer to one shared human question — how should a person live? Monotheism answers with one God and a covenant-based moral law; polytheism answers with many gods who are served and bargained with through offerings; and an ethical philosophy (such as Confucianism) answers with a way of right conduct that needs little focus on the gods at all.',
      source: 'Terah-ben-Nahor, herdsman-elder of the one God, with Lugal-amar, scribe of Nanna (Ur)',
    },
  ],

  // ---- Achievements: optional milestones ----
  achievements: [
    {
      id: 'd-tw-u3-ach-order-and-rank',
      title: 'Order and rank, one thread',
      desc: 'You understood how a belief system can unify a society and justify its hierarchy in the very same breath — in Confucian filial order and in Hindu dharma and varna.',
    },
    {
      id: 'd-tw-u3-ach-three-roads',
      title: 'Three roads, one question',
      desc: 'You heard the same human question — how should we live? — beneath monotheism, polytheism, and an ethical philosophy, without flattening the real differences between them.',
    },
  ],
};

export default pack;
