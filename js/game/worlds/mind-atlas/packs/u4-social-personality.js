// u4-social-personality.js — STORY-PACK for The Mind Atlas.
//
// Unit 4 · Social Psychology & Personality. Four Fog-encounters in the Social
// Plaza, each dispelling a tempting social-psych / personality misconception
// with real, 2024-CED-scoped science:
//   (a) the FUNDAMENTAL ATTRIBUTION ERROR — "they failed because they're lazy"
//       → situational forces are routinely underweighted when we judge others.
//   (b) MILGRAM'S SITUATIONAL OBEDIENCE — "I would never obey an order to hurt
//       someone" → ordinary people obeyed an authority; the power was in the
//       situation, not in cruel personalities.
//   (c) the BARNUM / FORER EFFECT — "this quiz reveals my hidden true self"
//       → vague, flattering, universally-true statements feel personal.
//   (d) the BYSTANDER EFFECT — "someone in a crowd will surely help" → diffusion
//       of responsibility means more bystanders can mean LESS help.
//
// CRAFT BAR (copied from the gold-standard u1-ten-percent.js):
//   - Keystone choices are FULL IN-CHARACTER SENTENCES (kind:'say') — never
//     A/B/C stems, never a quiz, never "Question N of M", never a score.
//   - A WRONG choice is a CONSEQUENCE, not a red X: the Fog thickens (a small
//     Confidence cost) and the mentor (Lior, a fictional plaza-reader this pack
//     adds, with Atlas's light behind her) re-teaches the missing idea, then the
//     SAME keystone loops back so the player answers from understanding.
//   - The RIGHT choice CHANGES THE WORLD: a Codex entry is written ("Understood"),
//     the Clarity meter lifts, a story flag opens, an achievement may unlock.
//
// HONEST PEDAGOGY: every claim is real, in-scope psychology. The teaching voice
// (Lior) is a FICTIONAL mind-denizen, so nothing is a fake quote attributed to a
// real person; Milgram's studies are described as the historical record reports
// them, with no invented verbatim quotes. The Codex `source` names the in-world
// scene, not a real scientist.
//
// 2024-CED SCOPE: Freud's psychosexual stages and Maslow's hierarchy appear ONLY
// as comfortable lies the Fog offers — never as a correct answer.
//
// See packs/CONTRACT.md for the field-by-field spec. This file is ONE
// `export const pack = { ... }` of pure DATA — no imports, no engine calls.

export const pack = {
  // ---- identity --------------------------------------------------------------
  id: 'u4-social-personality',
  unit: 'Unit 4 · Social Psychology & Personality',
  title: 'The Plaza of Easy Verdicts',

  // ---- extra characters added to the world -----------------------------------
  // One mentor denizen at the Social Plaza station, offset so she never overlaps
  // the built-in plaza voice (Sol, at offset [-7,-5]). Lior is fictional and
  // speaks paraphrase only.
  npcs: [
    {
      id: 'u4_plazareader',
      name: 'Lior',
      title: 'a reader of the Social Plaza',
      region: 'ap-social',
      offset: [8, -7],            // ap-social station is at [0,-40]; Sol sits at [-7,-5]
      hatKind: 'scholar',
      palette: { robe: 0xb45309, trim: 0x7c2d12, skin: 0xe0a96d, hat: 0x7c2d12 },
      dialogue: {
        start: (ctx) => (ctx.is && ctx.is('u4sp_all_cleared')) ? 'after' : 'root',
        nodes: {
          root: {
            text: 'You came to the plaza, then. Good. The Fog is thickest here, because here it wears a face we trust: our own judgment. It hands out four easy verdicts — "they\'re just lazy," "I\'d never obey," "this quiz finally explains me," "someone else will help." Each one feels like wisdom. Each one is the Fog. Which would you have me show you first?',
            choices: [
              { label: 'Why do we blame the person and forget the situation?', next: 'fae' },
              { label: 'Surely I would never obey an order to hurt someone.', next: 'obey' },
              { label: 'A personality quiz really did seem to know my hidden self.', next: 'barnum' },
              { label: 'In a crowd, someone always steps up to help — right?', next: 'bystander' },
              { label: 'Point me at the Fog. I will answer it.', next: 'sendin' },
            ],
          },
          fae: {
            text: 'When someone stumbles, we leap to character — "lazy, rude, weak" — and skip the circumstances entirely. That overweighting of disposition and underweighting of the situation is the fundamental attribution error. Notice the twist: for our OWN failures we readily blame the situation. The cure is one question — would a decent person ALSO struggle in those exact circumstances? — asked before you judge.',
            choices: [
              { label: 'So weigh the situation before I read the person.', next: 'sendin' },
              { label: 'Tell me about the obedience verdict instead.', next: 'obey' },
            ],
          },
          obey: {
            text: 'Almost everyone says "not me." Yet in Milgram\'s obedience studies, a striking share of ordinary volunteers kept delivering what they believed were escalating shocks because a calm authority simply told them to continue. The power was in the SITUATION — proximity to authority, gradual escalation, diffused responsibility — not in cruel personalities. "I would never" is exactly the confidence the situation exploits.',
            choices: [
              { label: 'Then the danger is in the setup, not just the soul.', next: 'sendin' },
              { label: 'Show me the quiz that "knows" me.', next: 'barnum' },
            ],
          },
          barnum: {
            text: 'Read this aloud: "You have a great deal of unused potential; at times you are outgoing, at other times reserved." Feels tailored, doesn\'t it? It is the Barnum, or Forer, effect — we accept vague, flattering, double-ended statements as uniquely our own because they are true of almost everyone. The horoscope, the personality quiz, the cold reading all run on it. The test of a real personality measure is reliability and validity, not how seen it makes you feel.',
            choices: [
              { label: 'So the feeling of being known is the trick itself.', next: 'sendin' },
              { label: 'And the crowd that should have helped?', next: 'bystander' },
            ],
          },
          bystander: {
            text: 'We assume a big crowd is a safety net. Often it is the opposite. The bystander effect: the more witnesses there are, the LESS likely any one of them is to help, because responsibility diffuses — "someone else will, someone else must have called." Each person waits for another, and the moment passes. The break is to stop being "a crowd" and become one named person: catch an eye, ask directly, "You — call for help."',
            choices: [
              { label: 'So a crowd can be the reason help never comes.', next: 'sendin' },
              { label: 'Start me with the blame verdict.', next: 'fae' },
            ],
          },
          sendin: {
            text: 'Then go. The Fog will offer you the verdict like a gift — it always sounds like good sense. Refuse it with what people actually do under social pressure, and the plaza brightens a little more with each one. If it gets its hooks in, come back; no one reads this plaza right on the first pass.',
            choices: [],
          },
          after: {
            text: 'Four verdicts, four answered. The plaza no longer judges fast and judges the person — it weighs the situation, distrusts the flattery, and names a single helper out of the crowd. You read it the way this mind needs to read every room: people are shaped by where they stand, not only by who they are.',
            choices: [],
          },
        },
      },
    },
  ],

  // ---- named cutscenes (playCutscene beat arrays) -----------------------------
  cutscenes: {
    // Fires once when the player first enters the Social Plaza region — frames
    // the four verdicts and points at Lior.
    U4SP_INTRO: [
      {
        tint: 'cold', kicker: 'The ring of standing stones',
        text: 'The Social Plaza is a circle of grey standing stones, and a crowd of denizens murmurs between them — judging fast, judging the person. Above the ring the Fog has spread itself thin and wide, so that every easy verdict in the crowd seems to rise from the haze itself.',
      },
      {
        tint: 'dusk',
        text: 'A reader stands at the centre stone, unhurried. "Welcome to the plaza of easy verdicts," she says. "Four of them hang here, and the Fog feeds on every one. Stay, and I will teach you to read people the way they actually are — pressed and pulled by the room they stand in."',
      },
    ],
  },

  // ---- triggers: WHEN a cutscene fires (once each) ----------------------------
  triggers: [
    { on: 'visit', value: 'ap-social', play: 'U4SP_INTRO', reward: { clarity: 4, insight: 10 } },
  ],

  // ---- keystones: THE CORE ----------------------------------------------------
  keystones: [
    // (a) FUNDAMENTAL ATTRIBUTION ERROR -----------------------------------------
    {
      id: 'u4sp_ks_fae',
      npc: 'u4_plazareader',
      region: 'ap-social',
      kicker: 'THE FOG · the lazy-person verdict',
      title: 'They Failed Because They\'re Lazy',
      taunt: 'The Fog drips down a standing stone and shows you a denizen who missed a deadline. "Easy one, cartographer," it purrs. "He failed because he\'s LAZY. That\'s who he is. The traffic, the sick kid, the broken bus? Excuses. Judge the person, not the day. Cleaner that way."',
      ask: 'Lior steps beside you. "It always reaches for character first. So tell it plainly — what is the Fog doing wrong when it explains his failure by who he is and ignores the day he had?"',
      choices: [
        {
          kind: 'say',
          label: 'It is committing the fundamental attribution error — overweighting his disposition and underweighting the situation. Before I call him lazy I should ask whether a decent person would also struggle in those exact circumstances.',
          correct: true,
        },
        {
          kind: 'say',
          label: 'You\'re right — character is destiny. Some people are just lazy, and the situation almost never really matters.',
          coach: 'The stone darkens and the cold bites — the Fog feeds on the easy verdict. Lior steadies you, Atlas\'s light behind her. "That IS the fundamental attribution error talking — leaping to disposition, erasing the circumstances. Notice we never do it to ourselves: our own slip-ups always have a reason. Weigh the situation first — would a decent person also struggle on a day like his? — and the verdict loses its grip."',
        },
        {
          kind: 'say',
          label: 'The real mistake is the opposite — people always blame the situation and never hold anyone responsible for anything.',
          coach: 'A stone gutters and the haze presses in. Lior shakes her head, kindly. "Not quite — the error runs the OTHER way when we judge others: we reach for character and skip the situation. People can still be responsible; the point is to weigh the circumstances before you name the cause, not to excuse everything. Answer with that."',
        },
      ],
      win: 'The Fog flinches off the stone. "…You weighed his day before you weighed his soul." It thins as the denizen straightens — judged fairly at last. Lior nods. "That is how this plaza was meant to read people: situation first, then person."',
      recordCodex: 'u4sp_cx_fae',
      flag: 'u4sp_fae_cleared',
      achievement: 'u4sp_ach_fae',
      clarity: 8,
      confidenceCost: 10,
    },

    // (b) MILGRAM'S SITUATIONAL OBEDIENCE ---------------------------------------
    {
      id: 'u4sp_ks_obedience',
      npc: 'u4_plazareader',
      region: 'ap-social',
      kicker: 'THE FOG · the "not me" verdict',
      title: 'I Would Never Obey',
      taunt: 'The Fog drapes over a stone shaped like a podium. "Let me flatter you, cartographer," it murmurs. "YOU would never obey an order to hurt someone. Only cruel people do that — sadists, monsters. You\'re good, so you\'re safe. The situation? Irrelevant. It\'s all about character."',
      ask: 'Lior folds her arms. "It loves the words \'not me.\' So answer it — when Milgram put ordinary volunteers under a calm authority\'s orders, what actually explained how many kept going?"',
      choices: [
        {
          kind: 'say',
          label: 'The power was in the SITUATION, not in cruel personalities — proximity to an authority, gradual escalation, and diffused responsibility led a striking share of ordinary people to keep obeying. "I would never" is exactly the confidence the situation exploits.',
          correct: true,
        },
        {
          kind: 'say',
          label: 'Exactly as you say — only unusually cruel, sadistic volunteers would ever obey like that. A good person like me is immune.',
          coach: 'The podium-stone dims and the cold sharpens — the Fog feeds on "not me." Lior steadies you. "That is the comfortable reading, and it is wrong. The obedient volunteers were ordinary people, not screened monsters; the situation did the work — an authority close at hand, the shocks rising one small step at a time, responsibility handed upward. Believing yourself immune is what makes the setup dangerous. Name the situation, and the stone is ours."',
        },
        {
          kind: 'say',
          label: 'The study really showed that obedience like that is basically impossible to produce in a lab.',
          coach: 'A stone goes quiet and the haze closes in. Lior shakes her head. "The opposite — Milgram\'s point was how READILY obedience could be produced in ordinary people, given the right situational pressure. That is the unsettling finding, not its absence. Answer with the power of the situation."',
        },
      ],
      win: 'The Fog recoils from the podium-stone. "…Ordinary people. The room, not the heart." It thins to a wisp. Lior watches it go. "Good. \'Not me\' is the door the situation walks through. You shut it by respecting the pressure, not your own purity."',
      recordCodex: 'u4sp_cx_obedience',
      flag: 'u4sp_obedience_cleared',
      achievement: 'u4sp_ach_obedience',
      clarity: 8,
      confidenceCost: 10,
    },

    // (c) BARNUM / FORER EFFECT -------------------------------------------------
    {
      id: 'u4sp_ks_barnum',
      npc: 'u4_plazareader',
      region: 'ap-social',
      kicker: 'THE FOG · the quiz that "knows" you',
      title: 'This Quiz Reveals My True Self',
      taunt: 'The Fog unfurls a glittering scroll. "Take the quiz, cartographer — it finally explains you. \'You have great unused potential; sometimes outgoing, sometimes reserved; you crave approval yet stay independent.\' See? It KNOWS your hidden true self. That is real personality science — feel how seen you are."',
      ask: 'Lior taps the shimmering scroll. "Read it again — it would fit almost anyone here. So tell the Fog: why does a vague little reading feel so personally, perfectly true?"',
      choices: [
        {
          kind: 'say',
          label: 'That is the Barnum, or Forer, effect — vague, flattering, double-ended statements feel uniquely mine because they are true of almost everyone. A real personality measure is judged by reliability and validity, not by how seen it makes me feel.',
          correct: true,
        },
        {
          kind: 'say',
          label: 'You\'re right that it reveals a hidden self — and what it really uncovers are my unconscious psychosexual stages from childhood, the true engine of my personality.',
          coach: 'The scroll dims and the cold bites. Lior steadies you, gentle but firm. "Two errors in one. First, the quiz only feels precise because of the Barnum effect — statements broad enough to fit everyone. Second, Freud\'s psychosexual stages are not the accepted scientific account of personality; reaching for them is grabbing another comfortable story. Test a measure by its reliability and validity, not by how known it makes you feel. Answer with that."',
        },
        {
          kind: 'say',
          label: 'It feels true because the quiz must be tapping a real, scientifically measured trait that happens to be the same in all of us.',
          coach: 'A stone gutters; the haze presses. Lior shakes her head. "Careful — the shared feeling is the giveaway, not the proof. The statements are deliberately broad and flattering, so they ring true for nearly everyone — that is the Barnum effect, not a measured universal trait. Real trait measures earn trust through reliability and validity. Name the effect, and the scroll lets go."',
        },
      ],
      win: 'The Fog\'s scroll crumbles. "…True of everyone. That was the trick." It thins away. Lior almost smiles. "The feeling of being known is the lure. You answered with the test that actually matters — does the measure hold up — and the flattery had nothing left to stand on."',
      recordCodex: 'u4sp_cx_barnum',
      flag: 'u4sp_barnum_cleared',
      achievement: 'u4sp_ach_barnum',
      clarity: 8,
      confidenceCost: 10,
    },

    // (d) BYSTANDER EFFECT ------------------------------------------------------
    {
      id: 'u4sp_ks_bystander',
      npc: 'u4_plazareader',
      region: 'ap-social',
      kicker: 'THE FOG · the safety-in-numbers verdict',
      title: 'Someone Will Surely Help',
      taunt: 'The Fog spreads thin over a crowded corner where a denizen has collapsed. "Relax, cartographer," it soothes. "Look how MANY people are here. In a crowd this big, someone will surely help. You can keep walking — there is safety in numbers. Someone else has it handled."',
      ask: 'Lior\'s voice drops. "It always says \'someone else.\' But the corner is crowded and no one moves. Tell the Fog — why can a bigger crowd mean LESS help, not more?"',
      choices: [
        {
          kind: 'say',
          label: 'That is the bystander effect — the more witnesses there are, the less likely any one helps, because responsibility diffuses and everyone assumes someone else will act. The break is to stop being "a crowd": catch one person\'s eye and ask them directly.',
          correct: true,
        },
        {
          kind: 'say',
          label: 'You\'re right — more people genuinely does mean more help. The crowd is the safest place to collapse, so I can keep walking.',
          coach: 'The corner darkens and the cold deepens — the Fog feeds on "someone else." Lior catches your arm. "That is the dangerous reading. The bystander effect is the opposite: more witnesses, LESS chance any single one acts, because responsibility spreads so thin that each waits for another. The cure is to undo the crowd — name one person, meet their eyes, ask them directly. Answer with that, and the corner is ours."',
        },
        {
          kind: 'say',
          label: 'No one helps because everyone in that crowd is simply a cruel, uncaring person at heart.',
          coach: 'A stone gutters; the haze tightens. Lior shakes her head. "Not cruelty — diffusion of responsibility. Each witness is probably decent, but in a crowd each assumes another will step in, so no one does. It is the situation, not their hearts. The fix is to single one person out and ask them by name. Tell the Fog THAT."',
        },
      ],
      win: 'The Fog scatters off the corner as you imagine pointing — "You, in the grey, call for help." One denizen breaks from the crowd and kneels. The Fog thins to nothing. Lior exhales. "There. A crowd is where help dies in the waiting. You turned it back into one named person — and one named person acts."',
      recordCodex: 'u4sp_cx_bystander',
      flag: 'u4sp_bystander_cleared',
      achievement: 'u4sp_ach_bystander',
      clarity: 8,
      confidenceCost: 10,
    },
  ],

  // ---- codex: the real ideas this pack teaches --------------------------------
  codex: [
    {
      id: 'u4sp_cx_fae',
      group: 'Social Psychology & Personality',
      title: 'Weigh the situation before the person',
      idea: 'The fundamental attribution error is the tendency, when judging others, to overestimate their disposition (character) and underestimate situational causes — yet we readily blame the situation for our own failures.',
      source: 'Lior, a reader of the Social Plaza',
    },
    {
      id: 'u4sp_cx_obedience',
      group: 'Social Psychology & Personality',
      title: 'Obedience lives in the situation',
      idea: 'Milgram\'s obedience studies showed that situational pressure — a close authority, gradual escalation, and diffused responsibility — led ordinary people to harmful obedience; it was not about unusually cruel personalities.',
      source: 'Lior, a reader of the Social Plaza',
    },
    {
      id: 'u4sp_cx_barnum',
      group: 'Social Psychology & Personality',
      title: 'Why vague readings feel personal',
      idea: 'The Barnum (Forer) effect is our tendency to accept vague, flattering, double-ended statements as uniquely true of us because they are true of almost everyone; a real personality measure is judged by reliability and validity, not by how seen it makes us feel.',
      source: 'Lior, a reader of the Social Plaza',
    },
    {
      id: 'u4sp_cx_bystander',
      group: 'Social Psychology & Personality',
      title: 'A crowd can mean less help',
      idea: 'The bystander effect: the more witnesses present, the less likely any single one helps, because responsibility diffuses — each assumes someone else will act; singling out one person to ask directly breaks the diffusion.',
      source: 'Lior, a reader of the Social Plaza',
    },
  ],

  // ---- achievements: optional milestones --------------------------------------
  achievements: [
    {
      id: 'u4sp_ach_fae',
      title: 'Situation first',
      desc: 'You put out the lazy-person verdict by naming the fundamental attribution error and weighing the situation before the person.',
    },
    {
      id: 'u4sp_ach_obedience',
      title: 'The room, not the heart',
      desc: 'You answered the "I would never obey" Fog with the situational power that Milgram\'s obedience studies revealed.',
    },
    {
      id: 'u4sp_ach_barnum',
      title: 'True of everyone',
      desc: 'You saw through the quiz that "knows" you by naming the Barnum (Forer) effect.',
    },
    {
      id: 'u4sp_ach_bystander',
      title: 'One named helper',
      desc: 'You broke the bystander effect by turning a frozen crowd back into a single person asked to help.',
    },
  ],
};

export default pack;
