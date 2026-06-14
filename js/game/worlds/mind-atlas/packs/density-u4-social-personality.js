// density-u4-social-personality.js — DENSITY STORY-PACK for The Mind Atlas.
//
// Unit 4 · Social Psychology & Personality (MORE). This is an ADDITIVE second
// pack for Unit 4: the world already ships `u4-social-personality.js` (which
// teaches the fundamental attribution error, Milgram's situational obedience,
// the Barnum/Forer effect, and the bystander effect). This pack does NOT repeat
// any of those. It pushes Unit 4 toward fuller 2024-CED coverage with three NEW
// Fog-encounters in the Social Plaza:
//   (a) CONFORMITY (Asch) — "I think for myself; a crowd's wrong answer could
//       never move ME" → most people, at least once, will publicly agree with a
//       confident unanimous majority even against the plain evidence of their
//       own eyes (normative social influence).
//   (b) COGNITIVE DISSONANCE — "I'll only do what I already believe" → when our
//       behavior clashes with our attitude, we often relieve the discomfort by
//       changing the ATTITUDE to fit what we already DID (attitudes follow
//       behavior; the classic effort/insufficient-justification finding).
//   (c) THE SELF-SERVING BIAS / ACTOR-OBSERVER ASYMMETRY — "I succeed because
//       I'm skilled; I fail because of bad luck — and that's just being honest"
//       → we credit our own successes to disposition and blame our failures on
//       the situation (self-serving bias), and we flip that lens when explaining
//       OTHER people (actor-observer asymmetry).
//
// CRAFT BAR (copied from the gold-standard u1-ten-percent.js):
//   - Keystone choices are FULL IN-CHARACTER SENTENCES (kind:'say') — never
//     A/B/C stems, never a quiz, never "Question N of M", never a score.
//   - A WRONG choice is a CONSEQUENCE, not a red X: the Fog thickens (a small
//     Confidence cost) and the mentor (Vesna, a NEW fictional plaza-watcher this
//     pack adds, with Atlas's light behind her) re-teaches the missing idea,
//     then the SAME keystone loops back so the player answers from understanding.
//   - The RIGHT choice CHANGES THE WORLD: a Codex entry is written ("Understood"),
//     the Clarity meter lifts, a story flag opens, an achievement may unlock.
//
// HONEST PEDAGOGY: every claim is real, in-scope psychology. The teaching voices
// (Vesna and Kade) are FICTIONAL mind-denizens, so nothing is a fake quote
// attributed to a real person; Asch's line-judgment studies and the dissonance
// findings are described as the historical record reports them, with no invented
// verbatim quotes. The Codex `source` names the in-world scene, not a real
// scientist.
//
// 2024-CED SCOPE: Freud's psychosexual stages and Maslow's hierarchy appear ONLY
// as comfortable lies the Fog offers — never as a correct answer.
//
// ID DISCIPLINE: every id in this pack is namespaced with the prefix
// "d-ma-u4-" so it can NEVER collide with the shipped `u4-social-personality`
// pack (which uses the `u4sp_*` prefix) or any other pack.
//
// See packs/CONTRACT.md for the field-by-field spec. This file is ONE
// `export const pack = { ... }` of pure DATA — no imports, no engine calls.

export const pack = {
  // ---- identity --------------------------------------------------------------
  id: 'd-ma-u4-social-personality-more',
  unit: 'Unit 4 · Social Psychology & Personality',
  title: 'The Plaza of Borrowed Verdicts',

  // ---- extra characters added to the world -----------------------------------
  // Two mentor denizens at the Social Plaza station, offset so they never overlap
  // the built-in plaza voice (Sol, at offset [-7,-5]) NOR the first U4 pack's
  // reader (Lior, at offset [8,-7]). The ap-social station is at [0,-40].
  //   - Vesna (the keystone mentor) sits at [-9, 7]  — opposite quadrant to Sol/Lior.
  //   - Kade  (a supporting witness)  sits at [9, 7]  — far corner, no overlap.
  // Both are fictional mind-denizens and speak paraphrase only.
  npcs: [
    {
      id: 'd-ma-u4-watcher',
      name: 'Vesna',
      title: 'a watcher of the Social Plaza',
      region: 'ap-social',
      offset: [-9, 7],            // ap-social station [0,-40]; dodges Sol [-7,-5] & Lior [8,-7]
      hatKind: 'hood',
      palette: { robe: 0x6d28d9, trim: 0x4c1d95, skin: 0xe0a96d, hat: 0x4c1d95 },
      dialogue: {
        start: (ctx) => (ctx.is && ctx.is('d-ma-u4-all-cleared')) ? 'after' : 'root',
        nodes: {
          root: {
            text: 'Another reader works the far stones; I watch a quieter Fog. It does not hand out verdicts about other people — it hands out verdicts about YOU, ones you are sure you reached alone. "I think for myself." "I only act on what I believe." "I win on skill and lose on luck." Each feels like honesty. Each is borrowed. Which of mine shall I show you?',
            choices: [
              { label: 'Surely a crowd\'s obviously-wrong answer could never move me.', next: 'conform' },
              { label: 'I would only ever do what I already believe in.', next: 'dissonance' },
              { label: 'When I succeed it\'s skill, when I fail it\'s luck — that\'s just honest.', next: 'serving' },
              { label: 'Point me at the Fog. I will answer it.', next: 'sendin' },
            ],
          },
          conform: {
            text: 'Picture three lines on a card; one plainly matches a sample. Everyone in the room answers aloud before you — and, one after another, confidently names the WRONG line. Now it is your turn. In Asch\'s line-judgment studies, a large share of people, at least once, went along with that unanimous wrong majority against the evidence of their own eyes. Not because they could not see — because standing alone against the group is hard. That is normative social influence, and "not me" is exactly its favourite mark.',
            choices: [
              { label: 'So the group can bend even what I plainly see.', next: 'sendin' },
              { label: 'Tell me about acting against my own beliefs.', next: 'dissonance' },
            ],
          },
          dissonance: {
            text: 'Watch what happens when behavior gets AHEAD of belief. Do a dull task, then — for almost nothing — tell the next person it was fun. Having little outside reason for the lie, people resolve the discomfort by quietly deciding the task really was kind of fun. That tension between act and attitude is cognitive dissonance, and we relieve it by changing the ATTITUDE to fit what we already DID. It is why attitudes so often follow behavior, not the other way around. The same engine makes us prize what cost us great effort.',
            choices: [
              { label: 'So what I do can rewrite what I think I believe.', next: 'sendin' },
              { label: 'And how I explain my own wins and losses?', next: 'serving' },
            ],
          },
          serving: {
            text: 'Listen to how a mind narrates itself. The good grade? "I\'m sharp." The bad one? "Unfair test, rough week." Crediting our successes to who we are and blaming our failures on the circumstances is the self-serving bias — it protects how we feel about ourselves. And there is a twist: we flip the lens for other people, reaching for THEIR character to explain THEIR failures while excusing our own by the situation. That asymmetry is the actor-observer effect.',
            choices: [
              { label: 'So I flatter myself and judge others by a different rule.', next: 'sendin' },
              { label: 'Start me on the crowd that moves me.', next: 'conform' },
            ],
          },
          sendin: {
            text: 'Then go to the centre stones. The Fog will offer the verdict as plain self-knowledge — that is what makes it stick. Refuse it with what people actually do under social pressure, and the plaza brightens a little more with each one. If it gets its hooks in, come back; no one reads their own mind right on the first pass. Kade keeps a watch by the east stone if you want a witness\'s account.',
            choices: [],
          },
          after: {
            text: 'Three borrowed verdicts, three returned to sender. The plaza no longer mistakes the crowd\'s confidence for truth, no longer assumes its beliefs came first, no longer keeps two rulebooks — one kind for itself, one harsh for everyone else. You taught this mind to suspect the verdict that flatters it most.',
            choices: [],
          },
        },
      },
    },
    {
      id: 'd-ma-u4-witness',
      name: 'Kade',
      title: 'a witness by the east stone',
      region: 'ap-social',
      offset: [9, 7],            // ap-social station [0,-40]; far corner, dodges Sol/Lior/Vesna
      hatKind: 'brim',
      palette: { robe: 0x0f766e, trim: 0x134e4a, skin: 0xc98a5b, hat: 0x134e4a },
      dialogue: {
        // Kade's lines REMEMBER which of Vesna's keystones the player has cleared.
        start: (ctx) => {
          if (!ctx || !ctx.is) return 'fresh';
          if (ctx.is('d-ma-u4-all-cleared')) return 'all';
          if (ctx.is('d-ma-u4-conform-cleared')) return 'midway';
          return 'fresh';
        },
        nodes: {
          fresh: {
            text: 'I just stand here and watch the crowd, cartographer. Want to know the strangest thing I see? People are sure they would hold their answer against the whole room — right up until they\'re IN the room. Vesna can show you what bends them. I only confirm it: the bending is real, and it is ordinary.',
            choices: [
              { label: 'Why would anyone agree with an answer they can see is wrong?', next: 'why' },
              { label: 'Does the group always win?', next: 'always' },
              { label: 'I\'ll go hear it from Vesna.', next: '@close' },
            ],
          },
          why: {
            text: 'Two reasons, really. Sometimes you genuinely doubt yourself — "they all see it; maybe I\'m the one who\'s wrong" — that\'s informational influence. But often you see fine; you just don\'t want to be the lone holdout, so you go along out loud while disagreeing inside. That second one is normative influence, and it is the one that surprises people about themselves.',
            choices: [
              { label: 'So I might agree out loud and still disagree within.', next: 'always' },
              { label: 'Take me to answer the Fog.', next: '@close' },
            ],
          },
          always: {
            text: 'No — and this is the hopeful part. In those line studies, the moment even ONE other person broke from the majority, conformity dropped sharply. A single ally makes standing your ground far easier. The crowd\'s power is real, but it is not destiny; one honest voice can free a whole room.',
            choices: [
              { label: 'Then one ally is worth more than I thought.', next: '@close' },
            ],
          },
          midway: {
            text: 'You faced down the crowd-stone — I saw it from here. So you know now: the bending is real and it is ordinary. Vesna has harder ones left, about why your own actions quietly rewrite your beliefs, and why you keep two rulebooks for success and failure. Go finish them. I\'ll keep watch.',
            choices: [
              { label: 'What did you make of the crowd-stone?', next: 'why' },
              { label: 'Back to Vesna, then.', next: '@close' },
            ],
          },
          all: {
            text: 'All three stones, quiet now. You should know what changed from where I stand: the crowd no longer moves you without your leave, your deeds no longer pull your beliefs along in the dark, and you read your own wins and losses by the same rule you give everyone else. That last one is the rarest sight in this plaza. Well watched, cartographer.',
            choices: [
              { label: 'It helped having a witness. Thank you, Kade.', next: '@close' },
            ],
          },
        },
      },
    },
  ],

  // ---- named cutscenes (playCutscene beat arrays) -----------------------------
  cutscenes: {
    // Fires once when the player first sets a flag opening this denser layer —
    // we tie it to clearing the FIRST keystone so it doesn't collide with the
    // existing U4 pack's own 'visit' intro on ap-social.
    'D-MA-U4-INTRO': [
      {
        tint: 'cold', kicker: 'The inner ring of stones',
        text: 'Behind the plaza\'s loud verdicts about other people stands a quieter inner ring — three pale stones that murmur about YOU. The Fog here is thin and patient, and what it whispers does not feel like a lie at all. It feels like knowing yourself.',
      },
      {
        tint: 'dusk',
        text: 'A watcher in a violet hood steps from between them. "You answered the loud verdicts," Vesna says. "Good. These are harder, because to dispel them you must doubt the one witness you trust most — your own sense of having decided alone. Stay. I will show you the room you can\'t see yourself standing in."',
      },
    ],
  },

  // ---- triggers: WHEN a cutscene fires (once each) ----------------------------
  // Use a 'flag' trigger so we never double-fire with the existing U4 pack's
  // 'visit' trigger on ap-social. This plays once the player clears the
  // conformity keystone (the on-ramp into the denser inner ring).
  triggers: [
    { on: 'flag', value: 'd-ma-u4-conform-cleared', play: 'D-MA-U4-INTRO', reward: { clarity: 3, insight: 8 } },
  ],

  // ---- keystones: THE CORE ----------------------------------------------------
  keystones: [
    // (a) CONFORMITY (ASCH) -----------------------------------------------------
    {
      id: 'd-ma-u4-ks-conformity',
      npc: 'd-ma-u4-watcher',
      region: 'ap-social',
      kicker: 'THE FOG · the "I think for myself" verdict',
      title: 'A Crowd Could Never Move Me',
      taunt: 'The Fog settles over a pale stone marked with three uneven lines. "Cartographer," it says warmly, "here is a comfort you\'ve earned: YOU are an independent thinker. A whole room could name the wrong line aloud, smiling, certain — and you\'d hold your answer without a flicker. Conformity is for sheep, and you are no sheep. \'Not me.\' Say it. It\'s true."',
      ask: 'Vesna stands at the stone, the lines plain to anyone. "It loves \'not me.\' So answer it honestly — when Asch sat ordinary people in a room where everyone aloud named the obviously-wrong line, what did most of them actually do, and why?"',
      choices: [
        {
          kind: 'say',
          label: 'Most people, at least once, went along with the unanimous wrong majority against the plain evidence of their own eyes — not because they couldn\'t see, but because standing alone against a confident group is hard. That is normative social influence, and "not me" is exactly the confidence it preys on.',
          correct: true,
        },
        {
          kind: 'say',
          label: 'They all kept their own answer, of course — no thinking person agrees with a wrong group. Conformity in a clear-cut case like that basically never happens.',
          coach: 'The stone dims and the cold creeps in — the Fog feeds on "not me." Vesna steadies you, Atlas\'s light behind her. "That is the comfortable reading, and the studies say otherwise. A large share of perfectly capable people DID go along with the wrong majority at least once, against what they plainly saw — that\'s the unsettling finding. The pull is normative: we don\'t want to be the lone dissenter out loud. Name that pressure, and the stone is ours."',
        },
        {
          kind: 'say',
          label: 'If anyone agreed with the wrong line, it can only be because they genuinely couldn\'t tell which line matched — their eyesight or judgment was just poor.',
          coach: 'A line on the stone gutters; the haze presses in. Vesna shakes her head, kindly. "Careful — the lines were easy; alone, people judged them almost perfectly. So it isn\'t bad eyesight. Much of the conforming is normative: they SAW the right answer and agreed out loud anyway, just to not stand alone. (Doubting your own perception because the group seems sure is the OTHER kind — informational influence.) Answer with the social pressure, not poor vision."',
        },
      ],
      win: 'The Fog peels off the line-stone. "…They saw it, and bent anyway." It thins as the three lines settle clear. Vesna nods. "There. \'I think for myself\' is the door the crowd walks through. You shut it not by pretending you\'re immune, but by respecting how hard it is to stand alone — and choosing to anyway."',
      recordCodex: 'd-ma-u4-cx-conformity',
      flag: 'd-ma-u4-conform-cleared',
      achievement: 'd-ma-u4-ach-conformity',
      clarity: 8,
      confidenceCost: 10,
    },

    // (b) COGNITIVE DISSONANCE --------------------------------------------------
    {
      id: 'd-ma-u4-ks-dissonance',
      npc: 'd-ma-u4-watcher',
      region: 'ap-social',
      kicker: 'THE FOG · the "beliefs come first" verdict',
      title: 'I Only Act On What I Believe',
      taunt: 'The Fog coils around a stone shaped like an arrow pointing one way only — belief to action. "Simple, cartographer," it murmurs. "Your attitudes drive your deeds, always in that order. You\'d never do a thing and then change your mind to match it — that would be weak. Belief leads; behavior follows. Tidy. True."',
      ask: 'Vesna turns the arrow-stone in her hands; it spins. "It insists the arrow only points one way. So tell it — when people act in a way that clashes with what they believe, for little outside reason, what often happens to the belief?"',
      choices: [
        {
          kind: 'say',
          label: 'The clash creates cognitive dissonance — an uncomfortable tension — and we often relieve it by changing the ATTITUDE to fit what we already did. So attitudes frequently follow behavior, not just the other way around; the arrow points both ways.',
          correct: true,
        },
        {
          kind: 'say',
          label: 'Nothing happens to the belief — behavior can never change an attitude. If I act against what I believe, I just feel like a hypocrite and my belief stays exactly the same.',
          coach: 'The arrow-stone darkens and the cold bites — the Fog feeds on "belief leads, always." Vesna steadies you. "Not quite. When act and attitude clash with little outside justification, that discomfort — cognitive dissonance — pushes us to RESHAPE the attitude so it fits the act. Do a dull task, talk it up for almost nothing, and you start believing it really was fine. Behavior pulls belief along. Tell the Fog the arrow runs both ways."',
        },
        {
          kind: 'say',
          label: 'What really happens is the unconscious takes over — acting against my beliefs just stirs up my repressed psychosexual conflicts from childhood, and that\'s the true engine.',
          coach: 'A crack runs through the stone; the haze closes in. Vesna shakes her head, gentle but firm. "Two missteps. The mechanism here is cognitive dissonance — the plain discomfort of act clashing with attitude, eased by adjusting the attitude — not buried childhood stages, which aren\'t the accepted account anyway. Keep it to what we can see: behavior creates tension, and we resolve it by changing the belief to match. Answer with that."',
        },
      ],
      win: 'The Fog\'s arrow-stone swings to point both directions and the cold lifts. "…My doing rewrites my believing." Vesna almost smiles. "There it is. You catch yourself not by trusting that your beliefs always came first, but by noticing when an action has quietly gone back and edited them."',
      recordCodex: 'd-ma-u4-cx-dissonance',
      flag: 'd-ma-u4-dissonance-cleared',
      achievement: 'd-ma-u4-ach-dissonance',
      clarity: 8,
      confidenceCost: 10,
    },

    // (c) SELF-SERVING BIAS / ACTOR-OBSERVER ------------------------------------
    {
      id: 'd-ma-u4-ks-self-serving',
      npc: 'd-ma-u4-watcher',
      region: 'ap-social',
      kicker: 'THE FOG · the "just being honest" verdict',
      title: 'My Wins Are Skill, My Losses Are Luck',
      taunt: 'The Fog drapes a stone scored with two ledgers. "An easy, honest one, cartographer," it soothes. "When YOU win, it\'s your skill — own it. When you lose, it was bad luck, a rough day, an unfair setup. That\'s not vanity, that\'s just telling it straight. And when OTHERS fail? Well — that\'s who they are. Two rulebooks, both correct."',
      ask: 'Vesna runs a finger down the two ledgers. "It calls the double standard honesty. So name it for the Fog — what is the bias in crediting my own wins to my character but blaming my losses on the situation, and what is the twist when I judge other people?"',
      choices: [
        {
          kind: 'say',
          label: 'That is the self-serving bias — taking credit for successes (disposition) while blaming failures on circumstances (situation), because it protects self-esteem. And the twist is the actor-observer effect: I excuse my own failures by the situation but reach for other people\'s character to explain theirs.',
          correct: true,
        },
        {
          kind: 'say',
          label: 'You\'re right — it really is just honesty. My wins genuinely are all skill and my losses genuinely are all luck, and other people really do fail because of who they are.',
          coach: 'The ledger-stone dims and the cold deepens — the Fog feeds on the flattering double standard. Vesna catches your eye. "That\'s the bias itself talking. Crediting your wins to character and your losses to circumstance is the self-serving bias — it guards self-esteem, not truth. And reaching for OTHERS\' character while excusing your own by the situation is the actor-observer flip. The honest move is one rulebook for everyone. Tell the Fog that."',
        },
        {
          kind: 'say',
          label: 'The bias is the reverse — people actually blame themselves for failures and give all the credit for success to luck and other people.',
          coach: 'A ledger-line fades; the haze tightens. Vesna shakes her head. "That\'s the opposite of the usual pattern. The self-serving bias runs the flattering way: my successes are ME, my failures are the situation. (Self-blame and crediting others does happen — for instance in some depressive thinking — but it isn\'t the default self-serving pattern.) And remember the actor-observer twist for how you judge others. Answer with the self-serving direction."',
        },
      ],
      win: 'The Fog\'s two ledgers fold into one and the cold lifts. "…One rule. The same rule." Vesna exhales. "Hardest stone in the plaza — because the verdict it offers feels like honesty, not vanity. You traded two rulebooks for one. Now this mind can read its own wins and losses by the measure it gives everyone else."',
      recordCodex: 'd-ma-u4-cx-self-serving',
      flag: 'd-ma-u4-self-serving-cleared',
      achievement: 'd-ma-u4-ach-self-serving',
      clarity: 9,
      confidenceCost: 10,
    },
  ],

  // ---- codex: the real ideas this pack teaches --------------------------------
  codex: [
    {
      id: 'd-ma-u4-cx-conformity',
      group: 'Social Psychology & Personality',
      title: 'A confident crowd can bend what you see',
      idea: 'Conformity (Asch): when a unanimous group publicly gives an obviously wrong answer, most people will go along with it at least once against the evidence of their own eyes — driven by normative social influence (the wish not to stand alone), and conformity drops sharply the moment even one ally dissents.',
      source: 'Vesna, a watcher of the Social Plaza',
    },
    {
      id: 'd-ma-u4-cx-dissonance',
      group: 'Social Psychology & Personality',
      title: 'Attitudes can follow behavior',
      idea: 'Cognitive dissonance: when our actions clash with our attitudes (with little outside justification), the discomfort pushes us to change the attitude to fit what we already did — so attitudes often follow behavior rather than the reverse.',
      source: 'Vesna, a watcher of the Social Plaza',
    },
    {
      id: 'd-ma-u4-cx-self-serving',
      group: 'Social Psychology & Personality',
      title: 'Two rulebooks for success and failure',
      idea: 'The self-serving bias credits our successes to our character but blames our failures on the situation (protecting self-esteem); the actor-observer effect is the related flip — we explain our own failures situationally but reach for other people\'s character to explain theirs.',
      source: 'Vesna, a watcher of the Social Plaza',
    },
  ],

  // ---- achievements: optional milestones --------------------------------------
  achievements: [
    {
      id: 'd-ma-u4-ach-conformity',
      title: 'I saw it, and I held',
      desc: 'You faced the "I think for myself" Fog by naming Asch\'s conformity and the normative pull to go along with a confident crowd.',
    },
    {
      id: 'd-ma-u4-ach-dissonance',
      title: 'The arrow runs both ways',
      desc: 'You dispelled the "beliefs come first" Fog by showing how cognitive dissonance lets attitudes follow behavior.',
    },
    {
      id: 'd-ma-u4-ach-self-serving',
      title: 'One rulebook',
      desc: 'You traded the self-serving double standard for a single rule by naming the self-serving and actor-observer biases.',
    },
  ],
};

export default pack;
