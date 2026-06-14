// density-u0-research-methods.js — DENSITY STORY-PACK for The Mind Atlas.
//
// AP Unit 0 / Science Practices · Research Methods. A SECOND, denser pack for the
// research-methods region (the Observatory — ap-methods, the Case Files hub). The
// world already ships the capstone "Exam of the Self" there (apply + evaluate);
// THIS pack deepens the region toward full Science-Practices coverage with the
// four method-skills the capstone assumes but never teaches head-on:
//   (a) correlation ≠ causation                         (SP3)
//   (b) why we need a control/comparison group + random assignment (SP2/SP3)
//   (c) operational definitions + reliability vs. validity (SP1/SP4)
//   (d) sampling bias / representative samples           (SP3/SP4)
// Each is a Fog-encounter: the Fog offers the INTUITIVE error; the player answers
// with the METHOD. CED Science Practices SP1–SP4.
//
// NON-DUPLICATION (checked against the existing region content):
//   - exam-of-the-self.js teaches the META-skill (apply a concept + evaluate the
//     evidence, judging a claim on its own support). It mentions "felt better is
//     not proof; placebo/natural recovery need a comparison group" only as ONE
//     link of its braid. This pack instead teaches the DISTINCT method skills the
//     capstone takes for granted — what a control group + random assignment buy
//     you (group equivalence → causal claim), correlation vs. causation as its
//     own idea, operationalization + reliability/validity, and sampling bias.
//   - content.js's ap-health wraith #2 ("feel better → treatment worked") is the
//     placebo point; we do NOT repeat it — our control-group keystone is about
//     ESTABLISHING causation by experimental design (random assignment creating
//     comparable groups + manipulating one variable), not debunking placebo.
//
// HONEST PEDAGOGY + 2024 CED SCOPE: every claim below is real, in-scope research
// methodology. The teaching voices are FICTIONAL mind-denizens (Vetra, Sondra,
// Calix) with Atlas's light behind them, so nothing is mis-attributed; no real
// person is quoted. The Codex `source` names the in-world scene, not a scientist.
//
// PURE DATA MODULE — no imports, no engine calls. See packs/CONTRACT.md for the
// field-by-field spec. ID namespace for THIS pack: every id is prefixed `d-ma-u0-`.

export const pack = {
  // ---- identity --------------------------------------------------------------
  id: 'd-ma-u0-research-methods',
  unit: 'Unit 0 · Research Methods & Science Practices',
  title: 'The Observatory of Method',

  // ---- extra characters added to the world -----------------------------------
  // Three fictional mind-denizens at the Observatory (ap-methods, center
  // [-150,-120]). The region's only existing add is Lumen (lamplighter) at
  // offset [9,7] from the capstone pack, plus the built-in Case Files hub. We
  // place ours at the three OTHER corners so nothing overlaps:
  //   Vetra  [-9, 7]   Sondra [9, -7]   Calix [-9, -7]
  // Each mentor owns one method-skill and the on-ramp to its keystone, and reads
  // story flags so they remember what the player has already understood.
  npcs: [
    {
      id: 'd-ma-u0-npc-vetra',
      name: 'Vetra',
      title: 'a chart-reader of the Observatory',
      region: 'ap-methods',
      offset: [-9, 7],
      hatKind: 'scholar',
      palette: { robe: 0x1f4d63, trim: 0x10303f, skin: 0xbfe8ff, hat: 0x10303f },
      dialogue: {
        start: (ctx) => (ctx.is && ctx.is('d-ma-u0-flag-corr')) ? 'after' : 'root',
        nodes: {
          root: {
            text: 'Cartographer. I read the charts the mind makes of itself — the scatterplots, the trend lines. The Fog loves a chart. It finds two things that rise together and whispers that one MUST be causing the other. It is at my reading-table now with its favorite pair. Will you answer it?',
            choices: [
              { label: 'Why is "they rise together, so one causes the other" wrong?', next: 'why' },
              { label: 'If correlation isn\'t cause, what is correlation good FOR?', next: 'good' },
              { label: 'Point me at the Fog. I will answer it.', next: 'sendin' },
            ],
          },
          why: {
            text: 'Because a correlation only tells you two measures move together — it never tells you WHY. A third, lurking variable can drive both: ice-cream sales and drowning rise together, but heat causes each. Or the arrow may simply point the other way. Correlation is real and useful, but on its own it cannot establish cause.',
            choices: [
              { label: 'So I need something more than a correlation to claim cause.', next: 'good' },
              { label: 'Then I\'ll answer the Fog with that.', next: 'sendin' },
            ],
          },
          good: {
            text: 'A great deal. A correlation lets you PREDICT and points you toward questions worth testing. A strong one — close to +1 or −1 — is a genuine signal. It just isn\'t a verdict. To claim that one thing CAUSES another, you have to do an experiment: control the variables yourself. Knowing the difference is half of clear thinking.',
            choices: [
              { label: 'Good. To the reading-table, then.', next: 'sendin' },
            ],
          },
          sendin: {
            text: 'Go on. It will hand you the easy story — "they move together, so there\'s your cause." Refuse it with the truth: correlation shows a relationship, not its direction or its source; a lurking variable could be doing the work. There is no shame in a second pass; I have re-drawn these charts more times than I can count.',
            choices: [],
          },
          after: {
            text: 'The reading-table is clear and the trend line means exactly what it should — a relationship, no more, no less. You did not let the Fog promote a coincidence to a cause. The Observatory reads truer for it.',
            choices: [],
          },
        },
      },
    },
    {
      id: 'd-ma-u0-npc-sondra',
      name: 'Sondra',
      title: 'an experiment-warden of the Observatory',
      region: 'ap-methods',
      offset: [9, -7],
      hatKind: 'brim',
      palette: { robe: 0x2a5a4a, trim: 0x163a2e, skin: 0xc9e8d6, hat: 0x163a2e },
      dialogue: {
        start: (ctx) => (ctx.is && ctx.is('d-ma-u0-flag-control')) ? 'after' : 'root',
        nodes: {
          root: {
            text: 'I keep the experiment-floor of the Observatory, cartographer — where claims of CAUSE are put to the test. The Fog has set up a trial with one group and no comparison, and it is ready to crown a winner. A study with nothing to compare against proves nothing. Help me hold the floor?',
            choices: [
              { label: 'Why isn\'t one treated group enough to prove cause?', next: 'why' },
              { label: 'What does random ASSIGNMENT actually do?', next: 'rand' },
              { label: 'Take me to the trial. I will answer it.', next: 'sendin' },
            ],
          },
          why: {
            text: 'Because without a comparison you can\'t know what would have happened anyway. People change on their own; time, expectation, and a hundred other things move them. A control or comparison group — treated identically except for the one variable you\'re testing — is the baseline that lets you say the treatment, and not something else, did the work.',
            choices: [
              { label: 'And how do I make the two groups truly comparable?', next: 'rand' },
              { label: 'Then I\'ll answer the Fog with that.', next: 'sendin' },
            ],
          },
          rand: {
            text: 'Random assignment — deciding by chance who lands in each group. It doesn\'t make the groups identical, but it spreads every difference, known and unknown, evenly across them, so the groups START equivalent on average. Then you change ONE thing (the independent variable) and watch the outcome. That, and only that, lets you claim cause.',
            choices: [
              { label: 'Good. To the trial.', next: 'sendin' },
            ],
          },
          sendin: {
            text: 'Go. The Fog will say its one group got better, so the treatment works — clean, obvious. Refuse it: with no comparison group there is no baseline, and without random assignment the groups may have differed from the start. There is no shame in a second pass; I have re-run worse trials than this.',
            choices: [],
          },
          after: {
            text: 'The experiment-floor stands honest again — a treated group, a comparison group, chance deciding who went where. You held the line on what it takes to claim a cause. Atlas keeps better count of this mind for it.',
            choices: [],
          },
        },
      },
    },
    {
      id: 'd-ma-u0-npc-calix',
      name: 'Calix',
      title: 'a measure-keeper of the Observatory',
      region: 'ap-methods',
      offset: [-9, -7],
      hatKind: 'hood',
      palette: { robe: 0x3a3a6a, trim: 0x1f1f44, skin: 0xd9c2ff, hat: 0x1f1f44 },
      dialogue: {
        start: (ctx) => {
          if (ctx.is && ctx.is('d-ma-u0-flag-sample')) return 'after';
          if (ctx.is && ctx.is('d-ma-u0-flag-opdef')) return 'mid';
          return 'root';
        },
        nodes: {
          root: {
            text: 'I keep the measures here — how this mind turns a fuzzy idea like "happiness" or "stress" into something it can actually count. The Fog hates a clear measure; it would rather everyone mean a different thing by the same word. Two of its lies sit on my bench. Will you take them?',
            choices: [
              { label: 'How do you measure something as vague as "happiness"?', next: 'opdef' },
              { label: 'What\'s the difference between reliable and valid?', next: 'relval' },
              { label: 'And what about WHO you measure — does that matter?', next: 'sample' },
              { label: 'Show me the first lie. I will answer it.', next: 'sendop' },
            ],
          },
          opdef: {
            text: 'You write an OPERATIONAL DEFINITION — you state exactly how a concept will be measured, in steps anyone could repeat. "Stress" becomes "score on this ten-item scale," or "happiness" becomes "rated 1 to 7 on these prompts." It pins the fuzzy word down so two researchers measure the SAME thing and others can replicate the study.',
            choices: [
              { label: 'And once I can measure it — reliable versus valid?', next: 'relval' },
              { label: 'Show me the first lie.', next: 'sendop' },
            ],
          },
          relval: {
            text: 'RELIABILITY is consistency — the measure gives the same answer on repeat, like a scale that reads the same weight twice. VALIDITY is accuracy — the measure actually captures what you mean, not something else. A bathroom scale stuck five pounds high is perfectly reliable yet not valid. You need both: a measure can be consistent and still consistently wrong.',
            choices: [
              { label: 'Show me the first lie, then.', next: 'sendop' },
            ],
          },
          sample: {
            text: 'It matters more than almost anything. If you study only the easy-to-reach — whoever volunteers, whoever\'s nearby — your sample isn\'t the population, and your findings may not generalize. A representative sample, ideally drawn at random, mirrors the whole group. Skew who you ask and you get sampling bias: a true answer to the wrong question.',
            choices: [
              { label: 'Then show me that lie at the bench.', next: 'sendsamp' },
            ],
          },
          sendop: {
            text: 'Good. The first sits where you measure things. The Fog will sneer that you can\'t put a number on something so personal, so why try to be precise at all? Refuse it: an operational definition states exactly how a concept is measured so the study can be repeated and checked. Come back if it gets a hook in you.',
            choices: [],
          },
          mid: {
            text: 'The measure-bench is clear of its first lie — "happiness" now means something you actually stated and could measure again. One lie still sits here, though: the Fog\'s trick about WHO you measure. Ready for it?',
            choices: [
              { label: 'Remind me — why does the sample matter?', next: 'sample' },
              { label: 'Show me the second lie. I will answer it.', next: 'sendsamp' },
            ],
          },
          sendsamp: {
            text: 'This one sits where you choose who to study. The Fog will say a big, eager crowd of volunteers is plenty — bigger is always better, surely? Refuse it: size cannot fix a skewed sample; representativeness is what lets findings generalize. Come back if it gets its hooks in.',
            choices: [],
          },
          after: {
            text: 'Both lies are gone from the bench — what you measure is defined, and who you measure is fair. The Observatory can trust its own numbers again. That is no small thing in a mind.',
            choices: [],
          },
        },
      },
    },
  ],

  // ---- named cutscenes (playCutscene beat arrays) -----------------------------
  // One scene-setter fires when the player first enters the Observatory region,
  // framing this denser methods layer (the place where the mind learns HOW it
  // knows, not just what). Uses the world's cold/dusk mood.
  cutscenes: {
    'D_MA_U0_INTRO': [
      {
        tint: 'cold', kicker: 'The Observatory of Method',
        text: 'High over the haze stands the Observatory — not a region the Fog can simply darken, but the place this mind comes to ask HOW it knows anything at all. Charts, trial-floors, and measuring-benches line its galleries. Tonight the Fog has crept into each, leaving a comfortable shortcut on every instrument.',
      },
      {
        tint: 'dusk',
        text: 'Three keepers wait among the instruments — a chart-reader, an experiment-warden, a measure-keeper. "The Fog cannot lie about FACTS up here," the chart-reader says. "So it lies about METHOD instead — how to read a chart, run a trial, take a measure. Help us teach it the difference, and this mind will never be so easily fooled again."',
      },
    ],
  },

  // ---- triggers: WHEN a cutscene fires (once each) ----------------------------
  triggers: [
    { on: 'visit', value: 'ap-methods', play: 'D_MA_U0_INTRO', reward: { clarity: 4, insight: 10 } },
  ],

  // ---- keystones: THE CORE ----------------------------------------------------
  // Four UNDERSTANDING beats, one per Science-Practice skill. Each: the Fog
  // taunts with the intuitive error; the mentor poses the ask; full in-character
  // sentence choices (exactly one correct); a wrong choice thickens the Fog and
  // the mentor re-teaches, then loops back; the right choice records a Codex
  // entry + lifts Clarity + sets a flag (+ an achievement on the last).
  keystones: [
    {
      id: 'd-ma-u0-ks-correlation',
      npc: 'd-ma-u0-npc-vetra',
      region: 'ap-methods',
      kicker: 'THE FOG · the chart that "proves" a cause',
      title: 'Correlation Is Not Causation',
      taunt: 'The Fog pools over the reading-table and traces the trend line with a grey finger, delighted. "Look how tidy, cartographer. Towns with more ice-cream sales have more drownings — the lines climb together, clean as you like. There it is: ice cream drives people to drown. Two things rise together; one made the other. You can stop digging now."',
      ask: 'Vetra slides the scatterplot toward you, Atlas\'s light steady at her shoulder. "It always reaches for ‘they move together, so one caused the other.\' Tell it, plainly — what does this correlation actually let you conclude, and what would it take to claim a cause?"',
      choices: [
        {
          kind: 'say',
          label: 'It lets me conclude only that the two MOVE together — nothing about cause or direction. A lurking third variable, summer heat, drives both ice cream and swimming, so the link is real but not causal. To claim ice cream CAUSES drowning I\'d need an experiment that controls the variables, not a chart.',
          correct: true,
        },
        {
          kind: 'say',
          label: 'You\'re right — the lines climb together so clearly that ice cream must be causing the drownings. A correlation that strong is as good as proof of cause.',
          coach: 'The trend line flares and the haze thickens — that is the Fog feeding on the leap from "together" to "because." Vetra steadies you, Atlas\'s light behind her. "A correlation, however strong, only shows two measures MOVE together. It can\'t tell you the direction, and it can\'t rule out a lurking variable doing the real work — here, summer heat lifts both ice cream and swimming. Correlation is a signal, not a verdict. Tell it THAT."',
        },
        {
          kind: 'say',
          label: 'Since they\'re only correlated, the relationship must be a fluke — there\'s really no connection at all, so I can ignore the chart entirely.',
          coach: 'A shelf of charts dims and the cold presses in. Vetra shakes her head, kindly. "You over-corrected. A correlation is NOT nothing — it\'s a genuine relationship that lets you predict and points you toward what to test. The error isn\'t believing the link exists; it\'s assuming the link means CAUSE. A third variable can produce a true correlation with no direct cause between the two. Keep the relationship, drop the causal claim, and answer again."',
        },
      ],
      win: 'The Fog\'s tidy story comes apart in its hands — the trend line stays, but its claim of cause evaporates. "…Only that they move together. Not why." It thins and slides off the reading-table. Vetra sets the chart straight. "There. A relationship, named honestly — not a coincidence crowned as a cause. This mind will read its charts true from now on."',
      recordCodex: 'd-ma-u0-cx-correlation',
      flag: 'd-ma-u0-flag-corr',
      clarity: 9,
      confidenceCost: 12,
    },
    {
      id: 'd-ma-u0-ks-control',
      npc: 'd-ma-u0-npc-sondra',
      region: 'ap-methods',
      kicker: 'THE FOG · the trial with nothing to compare',
      title: 'Control Groups & Random Assignment',
      taunt: 'The Fog drapes itself over the experiment-floor, gesturing at a single huddle of figures. "Watch this, cartographer. I gave this whole group my new study-method, and look — most of them improved! One group, one method, one happy result. The method works. Why clutter a clean trial with a second group, or with rolling dice over who goes where?"',
      ask: 'Sondra plants herself by the empty second pen, Atlas\'s light at her back. "It wants to crown a winner with one group and no comparison. Tell it, plainly — what does the trial NEED before it can claim the method caused the improvement, and what does deciding by chance do for it?"',
      choices: [
        {
          kind: 'say',
          label: 'It needs a control or comparison group treated identically except for the method — a baseline, since people often improve on their own. And the two groups must be formed by RANDOM ASSIGNMENT, which spreads every difference evenly so they start equivalent on average; only then can a change in the one manipulated variable be credited as the cause.',
          correct: true,
        },
        {
          kind: 'say',
          label: 'One group that improved is plenty — if most of them got better after the method, the method obviously caused it. A second group would just complicate a result that already speaks for itself.',
          coach: 'The floor tilts grey and the cold bites — the Fog is feeding on a result with no baseline. Sondra steadies you, Atlas\'s light behind her. "With nothing to compare against, you can\'t know what would have happened ANYWAY — people change with time, expectation, and chance. A control group, treated the same except for your one variable, is the baseline that lets you say the method, not life itself, did the work. Tell it you need that comparison."',
        },
        {
          kind: 'say',
          label: 'Add a second group, sure — I\'ll just hand-pick who goes in each so the groups look balanced to me, then compare. No need to leave it to chance.',
          coach: 'One pen lights, then gutters as the Fog leans on the gap you left. Sondra nods, kindly. "Good — you saw you need a comparison group. But choosing who goes where lets bias creep in, even unawares, and you can only balance differences you already KNOW about. Random assignment leaves it to chance, spreading known AND unknown differences evenly so the groups start equivalent on average. Add the dice, then answer again."',
        },
      ],
      win: 'The Fog\'s lone huddle splits — a treated group and a comparison group, chance deciding who stands where. Its boast falls flat. "…You wouldn\'t crown it without a baseline." It thins and drains off the floor. Sondra surveys the honest trial. "There. A comparison, a coin-flip, one variable changed. That is how this mind will earn the word ‘cause\' from now on."',
      recordCodex: 'd-ma-u0-cx-control',
      flag: 'd-ma-u0-flag-control',
      clarity: 9,
      confidenceCost: 12,
    },
    {
      id: 'd-ma-u0-ks-opdef',
      npc: 'd-ma-u0-npc-calix',
      region: 'ap-methods',
      kicker: 'THE FOG · the measure too "personal" to define',
      title: 'Operational Definitions & Reliability vs. Validity',
      taunt: 'The Fog curls around the measuring-bench, almost soothing. "Happiness, cartographer — such a private, shimmering thing. You can\'t cage it in a number, and you shouldn\'t try. Just ask people if they feel good and trust your gut on the answer. Why fuss over exact steps, or whether your little scale even works? Precision is for things that don\'t matter."',
      ask: 'Calix lifts a stuck-high scale and a vague survey, Atlas\'s light steady beside him. "It wants every word to mean whatever\'s convenient. Tell it, plainly — how do you pin a fuzzy concept down so a study can be repeated, and how do reliability and validity differ once you have a measure?"',
      choices: [
        {
          kind: 'say',
          label: 'I write an operational definition — I state exactly how the concept is measured, in repeatable steps, so "happiness" becomes, say, a rating 1 to 7 on these prompts and anyone can replicate it. Then I check reliability (does it give consistent results on repeat?) AND validity (does it actually capture happiness, not something else?) — a measure can be reliable yet not valid.',
          correct: true,
        },
        {
          kind: 'say',
          label: 'You\'re right that happiness can\'t really be defined — so I\'ll just trust my gut on whether people seem happy. As long as my impression feels consistent to me, that\'s reliable enough, and reliable means it\'s a good measure.',
          coach: 'The bench fogs over and the cold seeps in — the Fog is feeding on a measure no one could repeat. Calix steadies you, Atlas\'s light behind him. "A gut impression isn\'t a method; without an OPERATIONAL DEFINITION — stated, repeatable steps — no one can check or replicate you. And reliable does NOT mean good: this scale reads a steady five pounds high — perfectly consistent, consistently WRONG. Reliability is consistency; validity is accuracy. Tell it you need both, defined."',
        },
        {
          kind: 'say',
          label: 'Fine, I\'ll define my measure precisely and make sure it gives the exact same number every time — once it\'s perfectly consistent, I know it\'s measuring the right thing.',
          coach: 'The scale gleams steady — and stays five pounds off. Calix shakes his head, kindly. "You\'ve nailed reliability — consistency — and that\'s real. But consistency alone doesn\'t make a measure right: a scale stuck high is reliable yet not VALID, because it doesn\'t capture the true weight. Operationalizing AND reliability still leave you needing validity — does it measure what you mean? Add that, then answer again."',
        },
      ],
      win: 'The Fog\'s shimmer-and-shrug collapses into something countable — "happiness," stated in steps anyone could repeat, on a scale checked for both consistency and accuracy. "…You actually defined it." It thins off the bench. Calix sets the instruments straight. "There. A concept pinned down, a measure both reliable AND valid. This mind can trust its own readings now."',
      recordCodex: 'd-ma-u0-cx-opdef',
      flag: 'd-ma-u0-flag-opdef',
      clarity: 9,
      confidenceCost: 12,
    },
    {
      id: 'd-ma-u0-ks-sampling',
      npc: 'd-ma-u0-npc-calix',
      region: 'ap-methods',
      kicker: 'THE FOG · the crowd that "speaks for everyone"',
      title: 'Sampling Bias & Representative Samples',
      taunt: 'The Fog swells over the bench, pointing at a huge eager crowd by the door. "Numbers, cartographer — that\'s what wins. I asked the thousands who lined up to volunteer, all from the one club that loves this study. A thousand answers! Surely that speaks for everyone in the mind. The bigger the crowd, the truer the result — size settles it."',
      ask: 'Calix gestures from the volunteer crush to the empty rest of the hall, Atlas\'s light at his shoulder. "It thinks a big, lopsided crowd is the same as the whole population. Tell it, plainly — what\'s wrong with sampling only the eager and the easy-to-reach, and what makes a sample trustworthy enough to generalize?"',
      choices: [
        {
          kind: 'say',
          label: 'Studying only volunteers from one club is sampling bias — they aren\'t the population, so the findings may not generalize no matter how many you ask; sheer size can\'t fix a skewed sample. What I need is a REPRESENTATIVE sample that mirrors the whole group, ideally drawn at RANDOM so everyone has a fair chance to be included.',
          correct: true,
        },
        {
          kind: 'say',
          label: 'A thousand answers is overwhelming evidence — with a crowd that big, it doesn\'t matter that they all came from one club. The larger the sample, the more it must represent everyone.',
          coach: 'The hall darkens and the cold creeps up — the Fog is feeding on big numbers from a narrow crowd. Calix steadies you, Atlas\'s light behind him. "Size can\'t cure a SKEW. A thousand people who all volunteered from one club are still that one club, not the mind\'s whole population — that\'s sampling bias, and a bigger biased sample is just a bigger wrong answer. You need a sample that REPRESENTS the population, ideally random. Tell it that."',
        },
        {
          kind: 'say',
          label: 'You\'re right that the crowd is skewed — so the only fix is to shrink it. A small handful of people will somehow represent everyone better than a large group does.',
          coach: 'A few figures wink out of the crowd and the haze presses in. Calix shakes his head, kindly. "Shrinking it isn\'t the cure — a tiny sample can be just as unrepresentative, and noisier besides. The problem was never the SIZE; it was WHO. The fix is representativeness: a sample that mirrors the population, ideally drawn at random so every member has a fair chance. Aim for fair, not just small, and answer again."',
        },
      ],
      win: 'The Fog\'s wall of volunteers thins to its true narrow self — and beside it rises a fair cross-section of the whole mind, drawn by lot. "…A thousand of the same is still just the same." It loses its grip on the bench and is gone. Calix sets the last instrument right. "There. Not the loudest crowd — a representative one. This mind will know the difference between everyone and merely the eager.',
      recordCodex: 'd-ma-u0-cx-sampling',
      flag: 'd-ma-u0-flag-sample',
      achievement: 'd-ma-u0-ach-method',
      clarity: 10,
      confidenceCost: 12,
    },
  ],

  // ---- codex: the real ideas this pack teaches (fed to the shared Codex) -------
  codex: [
    {
      id: 'd-ma-u0-cx-correlation',
      group: 'Research Methods',
      title: 'Correlation is not causation',
      idea: 'A correlation shows only that two variables move together — it cannot establish that one causes the other, because the direction may be reversed or a lurking third variable may drive both; correlations are useful for prediction, but only a controlled experiment can support a causal claim.',
      source: 'Vetra, chart-reader of the Observatory',
    },
    {
      id: 'd-ma-u0-cx-control',
      group: 'Research Methods',
      title: 'Why experiments need a control group and random assignment',
      idea: 'To claim a cause you need a control/comparison group as a baseline (people change on their own) and random assignment to form the groups, which spreads known and unknown differences evenly so the groups start equivalent — then manipulating one variable lets you attribute the effect to it.',
      source: 'Sondra, experiment-warden of the Observatory',
    },
    {
      id: 'd-ma-u0-cx-opdef',
      group: 'Research Methods',
      title: 'Operational definitions, and reliability vs. validity',
      idea: 'An operational definition states exactly how a concept is measured in repeatable steps so a study can be replicated and checked; reliability is consistency (the same result on repeat) while validity is accuracy (measuring what you actually mean), and a measure can be reliable yet not valid.',
      source: 'Calix, measure-keeper of the Observatory',
    },
    {
      id: 'd-ma-u0-cx-sampling',
      group: 'Research Methods',
      title: 'Sampling bias and representative samples',
      idea: 'Studying only the easy-to-reach or self-selected (like volunteers) produces sampling bias, so the findings may not generalize no matter how large the sample; trustworthy generalization requires a representative sample that mirrors the population, ideally drawn through random sampling.',
      source: 'Calix, measure-keeper of the Observatory',
    },
  ],

  // ---- achievements: optional milestones (fed to the shared Achievements) ------
  achievements: [
    {
      id: 'd-ma-u0-ach-method',
      title: 'Keeper of Method',
      desc: 'You taught the Fog the four habits of evidence — correlation is not cause, controlled experiments earn causal claims, measures must be defined and both reliable and valid, and a sample must represent its population — and the Observatory of Method stood clear.',
    },
  ],
};

export default pack;
