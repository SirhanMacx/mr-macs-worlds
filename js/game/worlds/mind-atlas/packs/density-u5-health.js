// density-u5-health.js — DENSITY STORY-PACK for The Mind Atlas.
//
// Unit 5 · Mental & Physical Health (more). This is the SECOND, denser pack for
// the unit: it ADDS three NEW Fog-encounters at Clinic Springs (region id
// `ap-health`) that do NOT overlap the first u5-health pack (schizophrenia ≠
// split / stigma / therapy-works / stress-is-physical). All three are GENTLE,
// compassionate, and 2024-CED-scoped:
//   (a) "depression is just sadness — snap out of it" → major depressive
//       disorder is a real clinical condition (persistent low mood + loss of
//       interest, with sleep/appetite/energy/concentration changes lasting
//       weeks), not ordinary sadness or a failure of willpower.
//   (b) "anxiety is rare / a personal flaw" → anxiety disorders are among the
//       MOST common mental-health conditions and are highly TREATABLE (CBT,
//       exposure, medication), distinct from everyday nervousness.
//   (c) "well-being is just brain chemistry" (or "just attitude") → the
//       BIOPSYCHOSOCIAL model: health and disorder arise from biological,
//       psychological, AND social factors working together — no single cause.
//
// CRAFT BAR (copied from the gold-standard u1-ten-percent.js + u5-health.js):
//   - Keystone choices are FULL IN-CHARACTER SENTENCES (kind:'say') — never an
//     "A/B/C" stem, never a quiz, never a "Question N of M" or a score.
//   - A WRONG choice is a CONSEQUENCE, not a red X: the Fog thickens (a small
//     Confidence cost) and a pack mentor re-teaches the real science, then the
//     SAME keystone loops back so the player answers from understanding.
//   - The RIGHT choice CHANGES THE WORLD: it records a Codex entry, lifts the
//     Clarity meter, sets a story flag, and unlocks an achievement; the mentor
//     confirms WHY.
//
// HONEST PEDAGOGY: every claim is real, in-scope psychology. The teaching voices
// (Mira, a counselor-denizen of the warm pools; and Theo, a keeper of the
// terrace gardens) are FICTIONAL mind-denizens, so nothing is a fake quote
// attributed to a real person. The Codex `source` names the in-world scene.
//
// COMPASSIONATE + 988: Clinic Springs is the world's `sensitive` region. Clinical
// content here is handled gently and never sensationally, and the support note
// (988 — the Suicide & Crisis Lifeline) appears in the relevant text.
//
// PLACEMENT / ID DISCIPLINE: every id is namespaced `d-ma-u5-` so it can never
// collide with the world's built-in content (Wren the steward at [7,5]) or the
// first u5-health pack (Halden at [-9,7]). Mira sits at offset [9,-7] and Theo
// at [-7,-7] from the ap-health station [60,180] — both clear of Wren and Halden.
//
// Pure DATA only — no imports, no engine calls. See packs/CONTRACT.md for spec.

export const pack = {
  // ---- identity --------------------------------------------------------------
  id: 'd-ma-u5-health-density',
  unit: 'Unit 5 · Mental & Physical Health',
  title: 'Deeper Waters at Clinic Springs',

  // ---- extra characters added to the world -----------------------------------
  npcs: [
    {
      id: 'd-ma-u5-npc-mira',
      name: 'Mira',
      title: 'a counselor of the warm pools',
      region: 'ap-health',
      offset: [9, -7],            // ap-health station [60,180]; clear of Wren [7,5] + Halden [-9,7]
      hatKind: 'hood',
      palette: { robe: 0x2563a8, trim: 0x163a63, skin: 0xc8a06a, hat: 0x163a63 },
      dialogue: {
        start: (ctx) => (ctx.is && ctx.is('d-ma-u5-flag-mood-clear')) ? 'after' : 'root',
        nodes: {
          root: {
            text: 'You came down to the deeper pools — good. I sit with the minds that arrive heavy and afraid. The Fog is patient here; it does not shout, it murmurs. To the sad it whispers "just sadness, snap out of it." To the anxious it whispers "you are rare, you are broken." Both lies keep a hurting mind from the help that actually exists. If the steam ever weighs on you: 988 reaches the Suicide & Crisis Lifeline, any hour — and reaching out is courage, not collapse. Will you help me answer it?',
            choices: [
              { label: 'What is the Fog telling people about feeling low?', next: 'mood' },
              { label: 'And what is it telling the anxious ones?', next: 'anx' },
              { label: 'Point me at the Fog. I will answer it.', next: 'sendin' },
            ],
          },
          mood: {
            text: 'It calls clinical depression "just sadness" — as if a few days of feeling down were the same thing. They are not. Major depressive disorder is a real condition: a low mood OR a loss of interest in almost everything, dragging on for weeks, dragging sleep and appetite and energy and concentration down with it. "Snap out of it" is the cruelest thing you can say to it, because the disorder is exactly what takes the snapping-out away. And it is treatable — therapy, sometimes medication, often both.',
            choices: [
              { label: 'Then I will tell the Fog what depression actually is.', next: 'sendin' },
              { label: 'What about the anxious ones?', next: 'anx' },
            ],
          },
          anx: {
            text: 'To the anxious it whispers that they are a strange, weak few. The opposite is true: anxiety disorders are among the MOST common mental-health conditions there are — generalized anxiety, panic, phobias, all of it. And here is the kind part: they are highly treatable. Cognitive-behavioral therapy and exposure therapy work well, sometimes alongside medication. Everyday nervousness before a test is not a disorder; a disorder is fear or worry that is excessive, persistent, and gets in the way of living. Naming that difference is half the cure.',
            choices: [
              { label: 'Then I will answer the anxiety lie with that.', next: 'sendin' },
            ],
          },
          sendin: {
            text: 'Good. The Fog will offer the comfortable belief as if it were kindness — "it is nothing," "you are alone in it." Refuse it gently, with what is actually true, and the deeper pools clear. If it gets its hooks in you, come back. There is no shame in a second pass; healing almost never goes in a straight line.',
            choices: [],
          },
          after: {
            text: 'The deeper pools run clear and warm. You told the heavy minds the truth they needed: that what they carry is real, and common, and treatable — never a thing to "snap out of," never a sign that they are alone. The springs will remember it.',
            choices: [],
          },
        },
      },
    },
    {
      id: 'd-ma-u5-npc-theo',
      name: 'Theo',
      title: 'keeper of the terrace gardens',
      region: 'ap-health',
      offset: [-7, -7],           // clear of Wren [7,5], Halden [-9,7], Mira [9,-7]
      hatKind: 'brim',
      palette: { robe: 0x3f7d5a, trim: 0x234a35, skin: 0xb88a5b, hat: 0x234a35 },
      dialogue: {
        start: (ctx) => (ctx.is && ctx.is('d-ma-u5-flag-whole-clear')) ? 'after' : 'root',
        nodes: {
          root: {
            text: 'I keep the gardens that ring the springs — the part of healing that is neither pill nor pep talk. The Fog hates this garden, because it wants ONE cause for everything. It will tell you a troubled mind is "just bad chemistry," or just as wrongly, "just a bad attitude." Both are too small. A mind grows the way a garden does — from soil, weather, AND care together. Will you help me say so?',
            choices: [
              { label: 'What is the one-cause lie the Fog is selling?', next: 'onecause' },
              { label: 'So how should we think about well-being instead?', next: 'model' },
              { label: 'Point me at the Fog. I will answer it.', next: 'sendin' },
            ],
          },
          onecause: {
            text: 'Two halves of the same lie. One says health and disorder are PURELY biological — just genes and brain chemistry, nothing you do matters. The other says it is PURELY psychological or moral — just willpower, just attitude, "think positive." Each is a single key for a lock with three keyholes. Reach for one alone and the door stays shut.',
            choices: [
              { label: 'Then tell me the model that fits all three keyholes.', next: 'model' },
              { label: 'I will answer the Fog with that.', next: 'sendin' },
            ],
          },
          model: {
            text: 'The biopsychosocial model. It holds that health and disorder come from three kinds of factors woven together: BIOLOGICAL — genes, brain chemistry, physical health; PSYCHOLOGICAL — thoughts, emotions, coping, learned habits; and SOCIAL — relationships, culture, stress, support, circumstance. No single one is the whole story. That is why good care tends to combine approaches — and why blaming a person for "not trying" misses two-thirds of the picture.',
            choices: [
              { label: 'Then I will answer the Fog with all three together.', next: 'sendin' },
            ],
          },
          sendin: {
            text: 'Good. It will press you to pick ONE cause — it always does; a single cause is easy to fear and easy to blame. Refuse the trap. Name all three woven together, and the garden lights from the roots up. Come back if it catches you; even a gardener replants.',
            choices: [],
          },
          after: {
            text: 'The terrace gardens glow from the roots up, every bed in bloom. You refused the Fog its single cause and named the whole weave — body, mind, and world together. This mind will look at its own troubles more kindly now, and more truly.',
            choices: [],
          },
        },
      },
    },
  ],

  // ---- named cutscenes (playCutscene beat arrays) -----------------------------
  cutscenes: {
    // Fires once when the player first sets a flag from this pack's NPCs being
    // engaged — but since Mind Atlas prefers visit/flag triggers and the region
    // intro is already owned by the first pack's U5H_INTRO, this one fires on the
    // FLAG that the player has cleared the first deeper-pool keystone, framing the
    // garden arc. Gentle, with the 988 note carried again.
    D_MA_U5_DEEPER: [
      {
        tint: 'cold', kicker: 'The deeper pools of Clinic Springs',
        text: 'Below the bright terraces the water runs darker and warmer, where the heaviest minds come to rest. The Fog does not roar here — it murmurs, low and almost kind, telling the sad that they are merely sad and the frightened that they are alone. Two denizens tend these waters: a counselor at the pools and a keeper in the gardens above.',
      },
      {
        tint: 'dusk',
        text: 'The counselor looks up as you approach. "Gently, now," she says. "Nothing here is a flaw and nothing here is hopeless. If it ever weighs too much: 988 reaches the Suicide & Crisis Lifeline, any hour. Come — we answer these quiet lies with the truth, one pool at a time."',
      },
    ],
  },

  // ---- triggers: WHEN a cutscene fires (once each) ----------------------------
  // Fires when the player clears the first deeper-pool keystone (the depression
  // one), opening the garden arc. Uses a story flag this pack itself sets, so it
  // never double-fires with the first pack's region-visit intro.
  triggers: [
    { on: 'flag', value: 'd-ma-u5-flag-depression-clear', play: 'D_MA_U5_DEEPER', reward: { clarity: 4, insight: 10 } },
  ],

  // ---- keystones: THE CORE ----------------------------------------------------
  keystones: [
    // (a) depression is a disorder, not "just sadness / snap out of it" ---------
    {
      id: 'd-ma-u5-ks-depression',
      npc: 'd-ma-u5-npc-mira',
      region: 'ap-health',
      kicker: 'THE FOG · the just-sadness lie',
      title: 'Depression Is a Disorder, Not a Mood to Snap Out Of',
      taunt: 'The Fog settles soft over the first deep pool, almost tender. "Counselor\'s friend, hello. A small kindness for you: this heaviness is just sadness. Everyone gets sad. They could cheer up if they tried — snap out of it, look on the bright side. Nothing wrong, nothing to treat. Believe that and you needn\'t worry, and neither need they."',
      ask: 'Mira sits at the water\'s edge and speaks low. "It dresses cruelty as comfort. So tell it plainly — how is clinical depression different from ordinary sadness, and why is \'snap out of it\' the wrong thing to say?"',
      choices: [
        {
          kind: 'say',
          label: 'Major depressive disorder is a real clinical condition, not ordinary sadness — a persistent low mood or loss of interest in nearly everything for at least two weeks, along with changes in sleep, appetite, energy, and concentration. "Snap out of it" misses that the disorder itself is what takes that ability away, and it is treatable with therapy and sometimes medication. If anyone is struggling, 988 reaches the Suicide & Crisis Lifeline, any hour.',
          correct: true,
        },
        {
          kind: 'say',
          label: 'You\'re right — depression is just regular sadness, and anyone feeling it really could just decide to cheer up if they put in the effort.',
          // WRONG: collapses a disorder into a mood + willpower. Re-teach, gently.
          coach: 'The pool dims and the cold seeps in — that is the Fog feeding on the kindest-sounding cruelty there is. Mira steadies you. "No. Major depressive disorder is not a bad day you can decide your way out of. It is a clinical condition — a low mood OR loss of interest in almost everything, lasting weeks, dragging sleep, appetite, energy, and concentration with it. The disorder is exactly what removes the ability to \'just cheer up.\' And it responds to treatment — therapy, sometimes medication. Say it that way, and the water clears. If anyone is hurting, 988 is there, any hour."',
        },
        {
          kind: 'say',
          label: 'Depression just means you feel a little down for an afternoon — it always passes by the next morning on its own, so there\'s nothing to it.',
          // WRONG: minimizes duration/severity. Teach the clinical threshold.
          coach: 'A pool gutters and the haze presses closer. Mira shakes her head softly. "That describes a passing mood, not the disorder. What makes major depression clinical is that it PERSISTS — at least two weeks of low mood or lost interest, with real changes in sleep, appetite, energy, and concentration that get in the way of living. It does not just lift by morning, and treating it like a triviality keeps people from the help that works. Name the real thing, and the pool will clear."',
        },
      ],
      win: 'The Fog flinches from the plain truth and lifts off the first deep pool. "…Weeks. Real. Not a thing to snap." The water warms and steadies. Mira exhales. "There. You did not just correct it — you said it the way a heavy mind needs to hear it: this is real, this is not your failing, and this can get better."',
      recordCodex: 'd-ma-u5-cx-depression',
      flag: 'd-ma-u5-flag-depression-clear',
      achievement: 'd-ma-u5-ach-not-just-sad',
      clarity: 9,
      confidenceCost: 10,
    },

    // (b) anxiety disorders are common + treatable -----------------------------
    {
      id: 'd-ma-u5-ks-anxiety',
      npc: 'd-ma-u5-npc-mira',
      region: 'ap-health',
      kicker: 'THE FOG · the you-are-alone lie',
      title: 'Anxiety Disorders Are Common — and Treatable',
      taunt: 'The Fog coils over the second deep pool, low and confiding. "Here is a secret for the frightened one: this fear of yours is strange. Rare. Something is wrong with YOU specifically — no one else struggles like this, and nothing will fix it. Best to hide it and never speak of it. Believe that and you\'ll stay quiet, and I\'ll stay fed."',
      ask: 'Mira looks at you steadily. "This lie isolates — it convinces the anxious they are uniquely broken. So answer it honestly: how common are anxiety disorders, and can anything actually be done?"',
      choices: [
        {
          kind: 'say',
          label: 'Anxiety disorders are among the most common mental-health conditions, not rare — generalized anxiety, panic disorder, and phobias affect a great many people. And they are highly treatable: cognitive-behavioral therapy and exposure therapy work well, sometimes alongside medication. A disorder is fear or worry that is excessive, persistent, and disruptive — different from the everyday nervousness everyone feels.',
          correct: true,
        },
        {
          kind: 'say',
          label: 'You\'re right — anxiety disorders are rare and strange, and once you have one there\'s really nothing that can be done about it.',
          // WRONG: repeats the isolation + hopelessness. Re-teach prevalence + treatment.
          coach: 'The terrace dims and the chill returns — the Fog grows on isolation. Mira\'s voice stays warm. "Both halves are false. Anxiety disorders are among the MOST common conditions there are — the anxious are in vast company, never alone. And they are highly treatable: exposure therapy and cognitive-behavioral therapy help a great many people, sometimes with medication. \'Rare and hopeless\' is exactly the lie that keeps someone from the door. Say \'common and treatable,\' and the steam lifts."',
        },
        {
          kind: 'say',
          label: 'Everyone who ever feels nervous before a test has an anxiety disorder — being a little worried is exactly the same as the clinical condition.',
          // WRONG: over-pathologizes normal nervousness. Teach the threshold.
          coach: 'A pool stirs but stays grey — the Fog will take an overcorrection too. Mira shakes her head gently. "Careful — not every nerve is a disorder. Ordinary nervousness before a test is normal and even useful. An anxiety DISORDER is fear or worry that is excessive, persistent, and gets in the way of daily life. The honest, helpful truth is that disorders are common AND treatable — but calling all worry a disorder blurs the very line that helps people know when to seek care. Name the real threshold, and the pool clears."',
        },
      ],
      win: 'The Fog recoils from the company and the hope and pulls off the second deep pool. "…Common. Treatable. Not alone." The water runs clear and warm. Mira nods. "There. You took the loneliest lie and answered it with the truest comfort: you are not the only one, and there is help that works."',
      recordCodex: 'd-ma-u5-cx-anxiety',
      flag: 'd-ma-u5-flag-mood-clear',
      achievement: 'd-ma-u5-ach-not-alone',
      clarity: 8,
      confidenceCost: 10,
    },

    // (c) the biopsychosocial model of well-being ------------------------------
    {
      id: 'd-ma-u5-ks-biopsychosocial',
      npc: 'd-ma-u5-npc-theo',
      region: 'ap-health',
      kicker: 'THE FOG · the one-cause lie',
      title: 'Well-Being Has Three Roots, Not One',
      taunt: 'The Fog drifts up into the terrace gardens, breezy and certain. "Gardener\'s helper — let me simplify things for you. A troubled mind has ONE cause. Pick whichever you like: it\'s all just brain chemistry, OR it\'s all just attitude and willpower. One key, one lock. Believe that and you can stop looking — and you\'ll always know exactly who to blame."',
      ask: 'Theo kneels among the garden beds. "It wants a single cause because a single cause is easy to fear and easy to blame. So answer it: how do biological, psychological, AND social factors actually fit together in health and disorder?"',
      choices: [
        {
          kind: 'say',
          label: 'The biopsychosocial model holds that health and disorder come from biological, psychological, and social factors woven together — genes and brain chemistry, thoughts and emotions and coping, and relationships, culture, and circumstance all at once. No single one is the whole cause, which is why effective care often combines approaches and why blaming a person for "not trying" misses most of the picture.',
          correct: true,
        },
        {
          kind: 'say',
          label: 'You\'re right — it really is just brain chemistry. Genes and neurotransmitters explain everything, and a person\'s thoughts, habits, and relationships have nothing to do with it.',
          // WRONG: pure biological reductionism. Re-teach all three roots.
          coach: 'A garden bed dims and the haze settles low — the Fog loves a single cause. Theo shakes his head. "Too small. Biology matters — genes, brain chemistry, physical health — but it is only one of three roots. The biopsychosocial model adds the PSYCHOLOGICAL — thoughts, emotions, coping, learned habits — and the SOCIAL — relationships, culture, stress, support, circumstance. They work together. Reach for biology alone and you miss two-thirds of why a mind suffers and heals. Name all three, and the garden lights."',
        },
        {
          kind: 'say',
          label: 'Actually it\'s all just mindset — if someone has the right attitude and enough willpower, nothing biological or social about their life matters at all.',
          // WRONG: pure psychological/moral reductionism. Re-teach the weave.
          coach: 'A bed stirs but stays grey — the Fog will take the opposite single cause just as gladly. Theo answers kindly. "That swings too far the other way, and it slides toward blame. Mindset and coping are real — they are the PSYCHOLOGICAL root — but they are only one of three. There are also BIOLOGICAL factors (genes, brain chemistry, physical health) and SOCIAL ones (relationships, culture, stress, support). \'Just try harder\' ignores two of the three roots. Weave all three together, and the garden glows."',
        },
      ],
      win: 'The Fog cannot hold a single cause against all three and thins out of the gardens entirely. "…Body. Mind. World. Together." The terrace beds light from the roots up. Theo rises, looking over the bloom. "There — the whole weave, not one thread. You taught this mind to see its own troubles wholly: never one cause, never one to blame. The springs are deep and whole now."',
      recordCodex: 'd-ma-u5-cx-biopsychosocial',
      flag: 'd-ma-u5-flag-whole-clear',
      achievement: 'd-ma-u5-ach-whole-weave',
      clarity: 9,
      confidenceCost: 10,
    },
  ],

  // ---- codex: the real ideas this pack teaches --------------------------------
  codex: [
    {
      id: 'd-ma-u5-cx-depression',
      group: 'Mental & Physical Health',
      title: 'Depression is a disorder, not "just sadness"',
      idea: 'Major depressive disorder is a real clinical condition — a persistent low mood or loss of interest for at least two weeks with changes in sleep, appetite, energy, and concentration — not ordinary sadness or a failure of willpower, and it is treatable with therapy and sometimes medication. (Support: 988, the Suicide & Crisis Lifeline.)',
      source: 'Mira, counselor of the warm pools',
    },
    {
      id: 'd-ma-u5-cx-anxiety',
      group: 'Mental & Physical Health',
      title: 'Anxiety disorders are common and treatable',
      idea: 'Anxiety disorders (generalized anxiety, panic, phobias) are among the most common mental-health conditions and are highly treatable with cognitive-behavioral and exposure therapy and sometimes medication; a disorder is fear or worry that is excessive, persistent, and disruptive, distinct from everyday nervousness.',
      source: 'Mira, counselor of the warm pools',
    },
    {
      id: 'd-ma-u5-cx-biopsychosocial',
      group: 'Mental & Physical Health',
      title: 'The biopsychosocial model of well-being',
      idea: 'The biopsychosocial model explains health and disorder as arising from biological, psychological, and social factors working together — genes and brain chemistry, thoughts and emotions and coping, and relationships, culture, and circumstance — so no single cause is the whole story and effective care often combines approaches.',
      source: 'Theo, keeper of the terrace gardens',
    },
  ],

  // ---- achievements: optional milestones --------------------------------------
  achievements: [
    {
      id: 'd-ma-u5-ach-not-just-sad',
      title: 'Not just sad',
      desc: 'You taught that major depression is a real, treatable disorder — never an ordinary mood to "snap out of" — and answered it with compassion and fact.',
    },
    {
      id: 'd-ma-u5-ach-not-alone',
      title: 'Not alone in it',
      desc: 'You answered the isolation Fog with the truest comfort: anxiety disorders are common and treatable, and no one who has one is uniquely broken.',
    },
    {
      id: 'd-ma-u5-ach-whole-weave',
      title: 'The whole weave',
      desc: 'You refused the Fog its single cause and named the biopsychosocial model — body, mind, and world woven together in health and disorder.',
    },
  ],
};

export default pack;
