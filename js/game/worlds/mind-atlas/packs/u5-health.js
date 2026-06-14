// u5-health.js — STORY-PACK for The Mind Atlas.
//
// Unit 5 · Mental & Physical Health. Four GENTLE Fog-encounters at Clinic
// Springs (region id `ap-health`), each dispelling a real, costly clinical
// misconception with 2024-CED-scoped psychology:
//   (a) "schizophrenia means a split/multiple personality" → it is a psychotic
//       disorder of perception and thought, distinct from dissociative identity
//       disorder (DID).
//   (b) stigma — "people with mental illness are dangerous / weak" → disorders
//       are common, treatable, and most people with them are no more violent
//       than anyone else; help-seeking is strength.
//   (c) "therapy doesn't really do anything" → evidence-based treatments (CBT,
//       exposure, etc.) have strong research support.
//   (d) "stress is purely mental" → chronic stress has real physiological
//       effects (HPA axis, cortisol, immune function, the GAS pattern).
//
// CRAFT BAR (copied from the gold-standard u1-ten-percent.js):
//   - Keystone choices are FULL IN-CHARACTER SENTENCES (kind:'say') — never an
//     "A/B/C" stem, never a quiz, never a "Question N of M" or a score.
//   - A WRONG choice is a CONSEQUENCE, not a red X: the Fog thickens (a small
//     Confidence cost) and the pack's mentor (Halden, a fictional springs-warden)
//     re-teaches the real science, then the SAME keystone loops back so the
//     player answers from understanding.
//   - The RIGHT choice CHANGES THE WORLD: it records a Codex entry, lifts the
//     Clarity meter, sets a story flag, and unlocks an achievement; the mentor
//     confirms WHY.
//
// HONEST PEDAGOGY: every claim is real, in-scope psychology. The teaching voice
// (Halden) is a FICTIONAL mind-denizen, so nothing is a fake quote attributed to
// a real person. The Codex `source` names the in-world scene, not a real figure.
//
// COMPASSIONATE + 988: Clinic Springs is the world's `sensitive` region. Clinical
// content here is handled gently and never sensationally, and the support note
// (988 — the Suicide & Crisis Lifeline) appears in the relevant text.
//
// PLACEMENT: all NPC/keystone/codex/achievement ids are namespaced `u5h_` so they
// never collide with the world's built-in content (Wren the steward, the Fog's
// built-in stigma + placebo claims in content.js). Halden sits at offset [-9, 7]
// from the ap-health station [60,180]; Wren the built-in steward sits at [7,5].
//
// Pure DATA only — no imports, no engine calls. See packs/CONTRACT.md for spec.

export const pack = {
  // ---- identity --------------------------------------------------------------
  id: 'u5-health',
  unit: 'Unit 5 · Mental & Physical Health',
  title: 'The Fog at Clinic Springs',

  // ---- extra characters added to the world -----------------------------------
  npcs: [
    {
      id: 'u5h_warden',
      name: 'Halden',
      title: 'a warden of the warm springs',
      region: 'ap-health',
      offset: [-9, 7],            // ap-health station [60,180]; Wren sits at [7,5]
      hatKind: 'hood',
      palette: { robe: 0x0f766e, trim: 0x0b4f49, skin: 0xc8a06a, hat: 0x0b4f49 },
      dialogue: {
        start: (ctx) => (ctx.is && ctx.is('u5h_all_clear')) ? 'after' : 'root',
        nodes: {
          root: {
            text: 'Welcome to the lower terraces, traveler. I tend these waters where the mind comes to heal. The Fog loves it here — not because it is cruel for sport, but because the cruelest lies it tells are about SUFFERING itself. It whispers that disorders are shameful, hopeless, made-up. Every one of those is wrong, and every one keeps a hurting mind from the help it deserves. If the steam ever feels heavy: 988 reaches the Suicide & Crisis Lifeline, any hour — asking for help is strength, not weakness. Will you help me clear the terraces?',
            choices: [
              { label: 'What lies is the Fog telling about disorders here?', next: 'lies' },
              { label: 'Why are these particular lies so dangerous?', next: 'why' },
              { label: 'Point me at the Fog. I will answer it.', next: 'sendin' },
            ],
          },
          lies: {
            text: 'Four, mostly, on these terraces. That "schizophrenia" means a split or multiple personality — it does not; it is a disorder of perception and thought. That people with mental illness are dangerous or simply weak — they are not; disorders are common and treatable, and most people living with one are no more violent than anyone else. That therapy "does nothing" — when the evidence says structured, evidence-based therapy genuinely helps. And that stress is "all in your head" — when chronic stress wears on the body in measurable ways.',
            choices: [
              { label: 'Then I will answer each one with the truth.', next: 'sendin' },
              { label: 'Why are these lies so dangerous?', next: 'why' },
            ],
          },
          why: {
            text: 'Because stigma is not just unkind — it is a barrier to care. A mind that believes its suffering is shameful, or hopeless, or imaginary will not reach for help, and help is exactly what works. Roughly one in five adults lives with a mental-health condition in a given year; that is not weakness, it is being human. The kindest thing — and the truest — is to say plainly: this is real, this is common, and this can get better.',
            choices: [
              { label: 'Then I will answer the Fog with that.', next: 'sendin' },
            ],
          },
          sendin: {
            text: 'Good. The Fog will offer you the comfortable belief as if it were a mercy. Refuse it gently, with what is actually true — and the steam clears, terrace by terrace. If it gets its hooks in you, come back. There is no shame in a second pass; healing is rarely one clean step.',
            choices: [],
          },
          after: {
            text: 'The terraces are clear, the water bright and warm again. You answered every lie the way a healing mind needs to hear it — true, and kind, and without shame. The springs will remember: suffering is real, common, and treatable, and reaching for help is strength.',
            choices: [],
          },
        },
      },
    },
  ],

  // ---- named cutscenes (playCutscene beat arrays) -----------------------------
  cutscenes: {
    // Fires once when the player first enters Clinic Springs — frames the four
    // encounters gently and points at Halden. 988 note carried in the steward's
    // line, matching the region's sensitive handling.
    U5H_INTRO: [
      {
        tint: 'cold', kicker: 'The lower terraces of Clinic Springs',
        text: 'Warm water steps down the hillside in terraces, steam rising soft against the grey. This is a place of recovery — but the Fog has settled low over the pools, murmuring the cruelest lies a mind can hear: that its suffering is shameful, dangerous, hopeless, or imaginary.',
      },
      {
        tint: 'dusk',
        text: 'A warden waits at the brightest pool, hands open and unhurried. "Easy, now," they say. "Nothing here is sensational and nothing here is shameful. If it ever feels heavy: 988 reaches the Suicide & Crisis Lifeline, any hour. Come — we clear this with the truth, gently, one terrace at a time."',
      },
    ],
  },

  // ---- triggers: WHEN a cutscene fires (once each) ----------------------------
  triggers: [
    { on: 'visit', value: 'ap-health', play: 'U5H_INTRO', reward: { clarity: 4, insight: 10 } },
  ],

  // ---- keystones: THE CORE ----------------------------------------------------
  keystones: [
    // (a) schizophrenia ≠ split / multiple personality -------------------------
    {
      id: 'u5h_ks_schizophrenia',
      npc: 'u5h_warden',
      region: 'ap-health',
      kicker: 'THE FOG · the split-personality lie',
      title: 'What Schizophrenia Actually Is',
      taunt: 'The Fog drifts low over the first pool, almost soothing. "Warden\'s little helper, is it? Here is something everyone knows: schizophrenia is when a person has a SPLIT mind — two, three, a dozen personalities taking turns. \'Schizo\' even means \'split,\' doesn\'t it? Tidy. Believe that and you needn\'t look any closer."',
      ask: 'Halden kneels by the water and speaks softly. "It offers the word\'s shape and hopes you stop there. So tell it plainly — what IS schizophrenia, really, and how is it different from the \'many personalities\' idea it is leaning on?"',
      choices: [
        {
          kind: 'say',
          label: 'Schizophrenia is a psychotic disorder — a disturbance of perception and thought, with symptoms like hallucinations, delusions, and disorganized thinking. It is not a "split into many personalities"; that idea describes dissociative identity disorder, which is a separate condition entirely.',
          correct: true,
        },
        {
          kind: 'say',
          label: 'Right — schizophrenia is exactly when someone splits into several different personalities that take turns running their life.',
          // WRONG: conflates schizophrenia with DID. Re-teach, gently.
          coach: 'The steam thickens and chills — that is the Fog feeding on a familiar mix-up. Halden steadies you. "Easy. That picture — many personalities taking turns — describes DISSOCIATIVE IDENTITY DISORDER, a different and rare condition. Schizophrenia is a PSYCHOTIC disorder: it disrupts perception and thought — hallucinations, delusions, disorganized thinking. The word\'s root is misleading; the science is not. Name it as it actually is, and the pool clears."',
        },
        {
          kind: 'say',
          label: 'It is just when someone is moody or unpredictable — switching between cheerful and angry from one moment to the next.',
          // WRONG: confuses with mood instability; teaches what schizophrenia is.
          coach: 'A pool dims and the haze presses in. Halden shakes their head kindly. "That is not it either — quick mood swings are not what defines schizophrenia. Schizophrenia is a psychotic disorder: a disturbance of PERCEPTION and THOUGHT — hallucinations, delusions, disorganized thinking — not simply changeable moods. And it is distinct from the multiple-personalities idea, which is dissociative identity disorder. Answer with the real definition."',
        },
      ],
      win: 'The Fog recoils from the clear distinction and lifts off the first pool. "…Perception and thought. Not a crowd of selves." The water brightens. Halden nods. "There. The word fooled the world for a century; you would not let it fool you. A real disorder, named with care."',
      recordCodex: 'u5h_cx_schizophrenia',
      flag: 'u5h_schizophrenia_cleared',
      achievement: 'u5h_ach_named_with_care',
      clarity: 8,
      confidenceCost: 10,
    },

    // (b) stigma — "dangerous / weak" → common + treatable ---------------------
    {
      id: 'u5h_ks_stigma',
      npc: 'u5h_warden',
      region: 'ap-health',
      kicker: 'THE FOG · the stigma lie',
      title: 'Dangerous and Weak — and Wrong',
      taunt: 'The Fog coils over the second terrace, low and confiding. "Between us: people with mental illness are dangerous, and the rest are just weak — couldn\'t cope, didn\'t try. Best to keep your distance, and never admit you\'re one of them. Believe that and you stay clean of it all."',
      ask: 'Halden looks at you steadily. "This is the cruelest one, and the one that does the most harm — it keeps hurting people from ever asking for help. So answer it, kindly and plainly: what is the truth about people living with mental-health conditions?"',
      choices: [
        {
          kind: 'say',
          label: 'Mental-health conditions are common — about one in five adults in a given year — and treatable, not a sign of weakness. Most people living with a disorder are no more violent than anyone else, and the stigma in your words is itself a barrier to care. If anyone is struggling, 988 reaches the Suicide & Crisis Lifeline, any hour.',
          correct: true,
        },
        {
          kind: 'say',
          label: 'Fair enough — people with mental illness really are mostly dangerous, and someone who gets one just wasn\'t strong enough to handle their life.',
          // WRONG: repeats the stigma. Re-teach with compassion + 988.
          coach: 'The terrace dims and the cold deepens — the Fog grows when stigma is spoken. Halden\'s voice stays gentle. "No — and this is the lie that costs the most lives. Most people with a mental-health condition are NOT violent; they are far likelier to be harmed than to harm. And a disorder is not a failure of willpower — it is a real condition with biological, psychological, and social roots, and it is COMMON: about one in five adults each year. Stigma like that keeps people from the help that works. If anyone is struggling, 988 is there, any hour. Say the truth, and the steam lifts."',
        },
        {
          kind: 'say',
          label: 'Mental illness is so rare and unusual that it really only happens to a strange few — most people never have to think about it.',
          // WRONG: minimizes prevalence; teaches how common it is.
          coach: 'A pool gutters and the haze closes in. Halden shakes their head softly. "The opposite is true — these conditions are COMMON, not rare. Roughly one in five adults lives with one in a given year; nearly everyone loves someone who has. Treating it as a strange exception is its own kind of stigma, because it tells people their experience is freakish instead of human. It is common, it is treatable, and reaching for help — 988, any hour — is strength. Answer with that."',
        },
      ],
      win: 'The Fog flinches from the plain compassion and pulls off the second terrace. "…Common. Treatable. No room for shame." The water warms and steadies. Halden exhales. "There. You did not just correct it — you said it the way someone who is hurting needs to hear it. That is the whole work."',
      recordCodex: 'u5h_cx_stigma',
      flag: 'u5h_stigma_cleared',
      achievement: 'u5h_ach_no_room_for_shame',
      clarity: 9,
      confidenceCost: 10,
    },

    // (c) "therapy doesn't do anything" → evidence-based treatment works -------
    {
      id: 'u5h_ks_therapy_works',
      npc: 'u5h_warden',
      region: 'ap-health',
      kicker: 'THE FOG · the therapy-is-useless lie',
      title: 'Therapy Actually Works',
      taunt: 'The Fog settles over the third pool, weary and worldly. "Therapy? Just talking. Pay someone to nod while you feel sad — it does nothing real. Pills, maybe, but \'talk\'? Save your time. Believe that and you never have to start."',
      ask: 'Halden cups a handful of warm water and lets it fall. "It dresses up giving-up as good sense. So tell it the truth: does evidence-based therapy actually help — and how do we KNOW?"',
      choices: [
        {
          kind: 'say',
          label: 'Yes — evidence-based therapies like cognitive-behavioral therapy and exposure therapy have strong research support, tested in controlled studies against comparison groups. For many conditions they work as well as medication, and combining them is often best. "Just talking" understates structured treatment that is shown to change how people think and act.',
          correct: true,
        },
        {
          kind: 'say',
          label: 'You\'re right — therapy is only ever someone nodding along, and there\'s no real evidence any of it does anything.',
          // WRONG: dismisses the evidence base. Re-teach with CBT + RCTs.
          coach: 'The pool darkens and the chill returns — the Fog feeds on hopelessness. Halden steadies you, warm and certain. "Not so. Evidence-based therapies — cognitive-behavioral therapy, exposure therapy, and others — are TESTED, in controlled studies with comparison groups, and they genuinely help. CBT, for instance, has strong support for depression and anxiety, often matching medication. That is not nodding along; that is a structured method shown to change thoughts and behavior. Tell it THAT, and the steam clears."',
        },
        {
          kind: 'say',
          label: 'Therapy works for sure, because every single person who tries any kind of counseling always gets completely better.',
          // WRONG: overclaims (not "everyone always"); teaches the honest claim.
          coach: 'A shelf of steam wavers but does not lift — overpromising is its own trap. Halden smiles gently. "Careful — \'everyone always, completely\' is too much, and the Fog would love to catch you overstating. The honest, powerful truth is narrower: evidence-based therapies like CBT and exposure work for MANY people, shown in controlled studies, often as well as medication — not a guaranteed cure for all. Claim what the evidence actually supports, and the pool will clear."',
        },
      ],
      win: 'The Fog recoils from the evidence and lifts off the third pool. "…Tested. Structured. It works." The water runs clear and warm. Halden nods. "There. You did not promise a miracle and you did not surrender — you said exactly what the research shows. That is how a mind learns to trust the help it needs."',
      recordCodex: 'u5h_cx_therapy_works',
      flag: 'u5h_therapy_cleared',
      achievement: 'u5h_ach_help_that_works',
      clarity: 8,
      confidenceCost: 10,
    },

    // (d) "stress is purely mental" → real physiological effects ---------------
    {
      id: 'u5h_ks_stress_physical',
      npc: 'u5h_warden',
      region: 'ap-health',
      kicker: 'THE FOG · the all-in-your-head lie',
      title: 'Stress Lives in the Body Too',
      taunt: 'The Fog drapes the highest terrace, breezy and dismissive. "Stress? It\'s all in your head. A mood, a worry — nothing to do with the body. Just think positive and it vanishes. Believe that and you can ignore it entirely."',
      ask: 'Halden rests a hand near the warm spring. "It pretends the body is not listening. So answer it: is stress \'purely mental\' — or does chronic stress actually do something physical?"',
      choices: [
        {
          kind: 'say',
          label: 'Stress is not "purely mental" — it has real physiological effects. The HPA axis releases stress hormones like cortisol, and prolonged stress can raise blood pressure, suppress immune function, and wear the body down — the general adaptation syndrome pattern of alarm, resistance, and exhaustion.',
          correct: true,
        },
        {
          kind: 'say',
          label: 'Exactly — stress is only ever a feeling in the mind, with no effect on the body at all.',
          // WRONG: denies the physiology. Re-teach HPA / cortisol / GAS.
          coach: 'The terrace dims and the cold creeps in — the Fog likes when the body is ignored. Halden steadies you. "The body is very much listening. Stress activates the HPA axis, releasing hormones like CORTISOL; chronic stress can raise blood pressure, weaken immune response, and exhaust the system — Selye called that pattern the general adaptation syndrome: alarm, resistance, exhaustion. \'Purely mental\' it is not. Name the physiology, and the steam lifts."',
        },
        {
          kind: 'say',
          label: 'Stress is purely a body thing — just hormones and blood pressure — and how you think about a situation has nothing to do with it.',
          // WRONG: over-corrects, drops appraisal/mind side. Teach both.
          coach: 'A pool stirs but stays grey — the Fog will take an overcorrection too. Halden shakes their head kindly. "You swung too far. Stress is BOTH: how we appraise a situation as threatening AND a real physiological response — the HPA axis, cortisol, raised blood pressure, immune effects, the general adaptation syndrome. Mind and body together. The Fog\'s lie was \'purely mental\'; do not answer it with \'purely physical.\' Say it lives in both, and the terrace clears."',
        },
      ],
      win: 'The Fog thins from the top terrace as the body is finally named. "…Cortisol. Blood pressure. The body keeps the count." The highest pool glows clear. Halden lifts their gaze across the bright, clear terraces. "There — all of them, lit and warm. You taught this mind to take its own stress seriously, body and all. The springs are whole."',
      recordCodex: 'u5h_cx_stress_physical',
      flag: 'u5h_stress_cleared',
      achievement: 'u5h_ach_body_keeps_count',
      clarity: 9,
      confidenceCost: 10,
    },
  ],

  // ---- codex: the real ideas this pack teaches --------------------------------
  codex: [
    {
      id: 'u5h_cx_schizophrenia',
      group: 'Mental & Physical Health',
      title: 'Schizophrenia is not "split personality"',
      idea: 'Schizophrenia is a psychotic disorder of perception and thought (hallucinations, delusions, disorganized thinking) — it is NOT having multiple personalities, which describes the separate condition of dissociative identity disorder.',
      source: 'Halden, warden of Clinic Springs',
    },
    {
      id: 'u5h_cx_stigma',
      group: 'Mental & Physical Health',
      title: 'Mental illness is common, treatable, and not weakness',
      idea: 'Mental-health conditions are common (about one in five adults a year) and treatable; most people living with one are no more violent than anyone else, and stigma — calling them dangerous or weak — is itself a barrier to care. (Support: 988, the Suicide & Crisis Lifeline.)',
      source: 'Halden, warden of Clinic Springs',
    },
    {
      id: 'u5h_cx_therapy_works',
      group: 'Mental & Physical Health',
      title: 'Evidence-based therapy works',
      idea: 'Evidence-based psychotherapies such as cognitive-behavioral therapy and exposure therapy have strong research support, tested in controlled studies against comparison groups; for many conditions they work as well as medication, and combining them is often best.',
      source: 'Halden, warden of Clinic Springs',
    },
    {
      id: 'u5h_cx_stress_physical',
      group: 'Mental & Physical Health',
      title: 'Stress has real physiological effects',
      idea: 'Stress is not "purely mental": it activates the HPA axis and stress hormones like cortisol, and chronic stress can raise blood pressure, suppress immune function, and exhaust the body — the general adaptation syndrome pattern of alarm, resistance, and exhaustion.',
      source: 'Halden, warden of Clinic Springs',
    },
  ],

  // ---- achievements: optional milestones --------------------------------------
  achievements: [
    {
      id: 'u5h_ach_named_with_care',
      title: 'Named with care',
      desc: 'You taught the difference between schizophrenia (a psychotic disorder) and the multiple-personalities idea (dissociative identity disorder), refusing the lie hidden in a word.',
    },
    {
      id: 'u5h_ach_no_room_for_shame',
      title: 'No room for shame',
      desc: 'You answered the stigma Fog with compassion and fact: mental illness is common, treatable, and no measure of weakness.',
    },
    {
      id: 'u5h_ach_help_that_works',
      title: 'Help that works',
      desc: 'You showed that evidence-based therapy is a tested, structured treatment that genuinely helps — not "just talking."',
    },
    {
      id: 'u5h_ach_body_keeps_count',
      title: 'The body keeps the count',
      desc: 'You proved stress is never "purely mental" — naming the HPA axis, cortisol, and the general adaptation syndrome the body runs through.',
    },
  ],
};

export default pack;
