// ============================================================================
// standards.js — Mind Atlas  ·  Proof-of-Learning standards map
// ----------------------------------------------------------------------------
// PURE DATA. No imports, no side effects, no DOM, no clock. This file is the
// authoritative crosswalk from the 20 Mind Atlas story-pack Codex ids to the
// College Board AP Psychology Course and Exam Description (2024, Course
// Framework V.1) — its five units, topic outline, and four Science Practices.
//
// Contract (shared across all three worlds so the spine composes):
//   export const FRAMEWORK   = { system, source, strands:{ code: label } };
//   export const STANDARDS_MAP = {
//     codexId: { code, strand, label, examTask, confidence:'high'|'medium'|'flag', note? }
//   };
//   export default { FRAMEWORK, STANDARDS_MAP };
//
// Field meanings (AP Psychology dialect of the shared contract):
//   code       the single best-fit CED topic code. Matches ^[1-5]\.\d+$
//              (Unit.Topic, e.g. '1.4' = Unit 1, Topic 1.4 "The Brain"), or
//              a Science-Practice meta code 'SP1+2+4' for the cross-cutting
//              meta capstone (no single content topic — analogous to Trade
//              Winds' '9.0').
//              Where a Codex idea straddles two topics, the PRIMARY one is
//              `code` and the secondary is named in `note`.
//   strand     the parent UNIT, a single-digit key ('1'..'5', or '0' for the
//              science-practice capstone) that MUST exist in FRAMEWORK.strands.
//              Drives the coverage-matrix row headers.
//   label      a short human description of the understanding earned.
//   examTask   the AP free-response task this evidence supports, with the
//              Science Practice(s) it exercises:
//                AAQ = Article Analysis Question · EBQ = Evidence-Based Question
//                MCQ = multiple-choice · SP1 Concept Application ·
//                SP2 Research Methods & Design · SP3 Data Interpretation ·
//                SP4 Argumentation.
//   confidence 'high'   = code is a clean, direct CED topic match.
//              'medium' = defensible but the idea genuinely spans two adjacent
//                         topics; the seam IS the lesson (see note).
//              'flag'   = a genuine cross-cutting Science-Practice / meta
//                         capstone, not a single content topic (mapped to the
//                         '0' strand by design).
//
// Every code below was cross-checked verbatim against the CED topic outline and
// Science-Practice tables in
//   15_Standards_and_CEDs/source_files/AP_Psychology_CED.pdf
// (topic titles confirmed: 1.4 The Brain · 2.1 Perception · 2.6 Retrieving
//  Memories · 2.7 Forgetting and Other Memory Challenges · 2.8 Intelligence and
//  Achievement · 3.2 Physical Development Across the Lifespan · 3.4 Cognitive
//  Development Across the Lifespan · 3.6 Social-Emotional Development Across the
//  Lifespan · 3.7 Classical Conditioning · 3.8 Operant Conditioning ·
//  4.1 Attribution Theory and Person Perception · 4.3 Psychology of Social
//  Situations · 4.4 Psychodynamic and Humanistic Theories of Personality ·
//  4.5 Social-Cognitive and Trait Theories of Personality · 5.1 Introduction to
//  Health Psychology · 5.4 Selection of Categories of Psychological Disorders ·
//  5.5 Treatment of Psychological Disorders; Science Practices 1.A/1.B
//  Concept Application, 2.A-2.D Research Methods & Design, 3.A-3.C Data
//  Interpretation, 4.A/4.B Argumentation).
//
// Deviations from GAME_PROOF_OF_LEARNING_SPEC.md §A "Mind Atlas" list, with the
// CED evidence that justifies the upgrade (the spec invited fixing medium/flag
// codes where a cleaner one is confirmable):
//   • u3dl_cx_blankslate — spec 3.2/3.4 medium → 3.2 HIGH. The idea is newborn
//     PHYSICAL/perceptual capacities (rooting reflex [CED 3.2], visual cliff /
//     depth perception, inborn temperament). 3.4 is Cognitive Development, which
//     this idea is not about; temperament's social-emotional angle (3.6) is the
//     secondary, noted. Primary anchor is unambiguously 3.2.
//   • u5h_cx_schizophrenia — spec 5.4/5.5 medium → 5.4 HIGH. CED Topic 5.4
//     "Selection of Categories of Psychological Disorders" explicitly covers
//     BOTH schizophrenic spectrum disorders AND dissociative identity disorder,
//     so the "schizophrenia ≠ split personality" distinction is a clean single-
//     topic (5.4) categorization claim. (5.5 is Treatment — not this idea.)
//   • u3dl_cx_conditioning — kept MEDIUM by design: the idea is the SEAM between
//     classical (3.7) and operant (3.8) conditioning; the distinction itself
//     spans both topics. Primary 3.7, secondary 3.8 noted.
//   • cx_exam_self — kept FLAG: the capstone is the cross-cutting Science-
//     Practice meta-skill (apply a concept + evaluate evidence), not one topic.
// ============================================================================

export const FRAMEWORK = {
  system: 'AP Psychology — College Board Course and Exam Description (2024, Course Framework V.1)',
  source: 'AP Psychology Course and Exam Description, © 2024 College Board: five units, the topic outline (Topics 1.1-5.5), and the four Science Practices (1 Concept Application, 2 Research Methods and Design, 3 Data Interpretation, 4 Argumentation).',
  // Full unit catalog so the coverage matrix has a row header for every unit,
  // even those not yet earned through play. Keys are the single-digit unit codes
  // used as `strand` below (the leading digit of each topic code); '0' is the
  // cross-cutting Science-Practice capstone strand (analogous to Trade Winds' 9.0).
  strands: {
    '1': 'Unit 1 · Biological Bases of Behavior',
    '2': 'Unit 2 · Cognition',
    '3': 'Unit 3 · Development and Learning',
    '4': 'Unit 4 · Social Psychology and Personality',
    '5': 'Unit 5 · Mental and Physical Health',
    '0': 'Science Practices & exam-skill capstone (apply concepts, evaluate evidence — no single content topic)',
  },
};

export const STANDARDS_MAP = {
  // ===== Unit 1 — Biological Bases of Behavior =====
  'cx_tenpercent': {
    code: '1.4',
    strand: '1',
    label: 'You use all of your brain: the "10%" claim is a myth — imaging shows whole-brain activity across a day, the default-mode network runs even at rest, and the brain burns ~20% of the body\'s energy. Regions specialize (localization of function) but none sit idle.',
    examTask: 'AAQ/MCQ on brain structure and localization of function (SP1 Concept Application); supports applying neuroscience concepts to a scenario.',
    confidence: 'high',
  },
  'cx_u1bio_sides': {
    code: '1.4',
    strand: '1',
    label: 'There is no "left-brained" or "right-brained" personality: functions lateralize (language usually left; some spatial/face/prosody right), but the corpus callosum links the hemispheres so they cooperate on nearly every task — "logical vs. creative people" is a myth.',
    examTask: 'AAQ/MCQ on hemispheric specialization and the corpus callosum (SP1 Concept Application); supports applying brain organization to a scenario.',
    confidence: 'high',
    note: 'Lateralization / split-brain content is filed under CED Topic 1.4 "The Brain"; the corpus callosum and hemispheric specialization are 1.4 enduring-knowledge items.',
  },
  'cx_u1bio_plastic': {
    code: '1.4',
    strand: '1',
    label: 'The brain rewires and can grow new neurons: neuroplasticity lets surviving circuits take on new jobs after damage or with practice, and neurogenesis adds new neurons (notably in the hippocampus) — the brain reorganizes across the whole lifespan, not only in childhood.',
    examTask: 'AAQ/MCQ on neuroplasticity and neurogenesis (SP1 Concept Application); supports applying brain-adaptation concepts to recovery/learning scenarios.',
    confidence: 'high',
  },

  // ===== Unit 2 — Cognition =====
  'u2c_cx_reconstructive': {
    code: '2.6',
    strand: '2',
    label: 'Memory rebuilds, it does not replay: recall is reconstructive — the mind stores gist and cues and rebuilds the scene fresh each time, filling gaps with current expectations, which is why honest memories drift and differ.',
    examTask: 'AAQ on retrieval and reconstructive memory (SP1 Concept Application); supports applying memory concepts to a research-article scenario.',
    confidence: 'high',
  },
  'u2c_cx_misinformation': {
    code: '2.7',
    strand: '2',
    label: 'Eyewitness memory can be reshaped: the misinformation effect folds misleading post-event information into a memory so a person genuinely recalls it wrong — a confident eyewitness is not necessarily an accurate one.',
    examTask: 'AAQ on the misinformation effect (SP1 Concept Application + SP2 Research Methods); supports evaluating eyewitness-memory study designs and conclusions.',
    confidence: 'high',
    note: 'CED Topic 2.7 "Forgetting and Other Memory Challenges" covers memory errors including the misinformation effect.',
  },
  'u2c_cx_perception': {
    code: '2.1',
    strand: '2',
    label: 'Perception is top-down, not a clean window: it combines bottom-up sensory data with top-down processing — expectation, context, and prior knowledge — so a perceptual set can prime the mind to see one thing and miss another.',
    examTask: 'AAQ/MCQ on top-down vs. bottom-up processing and perceptual set (SP1 Concept Application); supports applying perception concepts to a scenario.',
    confidence: 'high',
  },
  'u2c_cx_intelligence': {
    code: '2.8',
    strand: '2',
    label: 'A test score is a limited measure: intelligence is broader than any single score, and a test is trustworthy only when standardized, reliable, and valid — and even then it can carry cultural bias and cannot capture everything a mind can do.',
    examTask: 'EBQ/AAQ on intelligence testing and psychometrics — standardization, reliability, validity, bias (SP2 Research Methods + SP3 Data Interpretation); supports evaluating test quality.',
    confidence: 'high',
  },

  // ===== Unit 3 — Development and Learning =====
  'u3dl_cx_punishment': {
    code: '3.8',
    strand: '3',
    label: 'Reinforcement teaches better than punishment: positive reinforcement adds something pleasant, negative reinforcement removes something unpleasant — both STRENGTHEN a behavior — while punishment only weakens behavior, by fear, and only when immediate, certain, and consistent.',
    examTask: 'AAQ/MCQ on operant conditioning — reinforcement vs. punishment (SP1 Concept Application); supports applying operant principles to a behavior scenario.',
    confidence: 'high',
  },
  'u3dl_cx_blankslate': {
    code: '3.2',
    strand: '3',
    label: 'Newborns are not blank slates: they prefer the human face and turn toward voices, show early depth perception (the visual cliff), arrive with reflexes, and each has an inborn temperament — development builds on these, not on an empty page.',
    examTask: 'AAQ/MCQ on early physical development — reflexes, the visual cliff, temperament (SP1 Concept Application); supports applying lifespan-development concepts to an infant scenario.',
    confidence: 'high',
    note: 'Upgraded from spec 3.2/3.4 (medium) to 3.2 (high): reflexes are a CED 3.2 item and the visual cliff is early perceptual/physical development; temperament also touches 3.6 (Social-Emotional Development). 3.4 is Cognitive Development, which this idea is not about.',
  },
  'u3dl_cx_conditioning': {
    code: '3.7',
    strand: '3',
    label: 'Classical and operant conditioning differ: classical is an involuntary association between two stimuli (a signal triggers an automatic, reflexive response); operant concerns voluntary behavior and its consequences (reinforced behaviors grow, punished ones shrink) — stimulus-and-reflex vs. behavior-and-consequence.',
    examTask: 'AAQ/MCQ distinguishing classical (3.7) and operant (3.8) conditioning (SP1 Concept Application); supports correctly classifying a learning scenario.',
    confidence: 'medium',
    note: 'Kept medium by design: the idea is the SEAM between Topic 3.7 (Classical Conditioning) and Topic 3.8 (Operant Conditioning); primary anchor 3.7, secondary 3.8.',
  },
  'u3dl_cx_attachment': {
    code: '3.6',
    strand: '3',
    label: 'Attachment is built on contact comfort: in Harlow\'s study, infant monkeys clung to a soft cloth mother that gave no milk over a wire mother that did, using her as a safe base — the bond rides on warmth and security, not the food bowl.',
    examTask: 'AAQ on attachment and contact comfort (SP1 Concept Application + SP2 Research Methods); supports applying attachment research and evaluating its design.',
    confidence: 'high',
  },

  // ===== Unit 4 — Social Psychology and Personality =====
  'u4sp_cx_fae': {
    code: '4.1',
    strand: '4',
    label: 'Weigh the situation before the person: the fundamental attribution error is overestimating others\' disposition (character) and underestimating situational causes — while we readily blame the situation for our own failures.',
    examTask: 'AAQ/MCQ on attribution and the fundamental attribution error (SP1 Concept Application); supports applying attribution theory to a scenario.',
    confidence: 'high',
  },
  'u4sp_cx_obedience': {
    code: '4.3',
    strand: '4',
    label: 'Obedience lives in the situation: Milgram\'s studies showed situational pressure — a close authority, gradual escalation, and diffused responsibility — drove ordinary people to harmful obedience; it was not about unusually cruel personalities.',
    examTask: 'EBQ on Milgram\'s obedience research (SP2 Research Methods + SP4 Argumentation); supports defending a claim with cited study evidence and evaluating the design/ethics.',
    confidence: 'high',
    note: 'CED Topic 4.3 "Psychology of Social Situations" covers obedience and situational influence (the Milgram paradigm).',
  },
  'u4sp_cx_barnum': {
    code: '4.5',
    strand: '4',
    label: 'Why vague readings feel personal: the Barnum (Forer) effect is accepting vague, flattering, double-ended statements as uniquely true of us because they fit almost everyone — a real personality measure is judged by reliability and validity, not by how "seen" it makes us feel.',
    examTask: 'EBQ on personality assessment quality — reliability and validity vs. the Barnum effect (SP2 Research Methods + SP4 Argumentation); supports evaluating a measure\'s evidence.',
    confidence: 'high',
    note: 'Upgraded from spec 4.4/4.5 to a single anchor 4.5: assessing a personality MEASURE (reliability/validity, trait measurement) is filed under CED Topic 4.5 "Social-Cognitive and Trait Theories of Personality"; 4.4 (Psychodynamic and Humanistic) is the secondary frame for "feeling seen."',
  },
  'u4sp_cx_bystander': {
    code: '4.3',
    strand: '4',
    label: 'A crowd can mean less help: the bystander effect — the more witnesses present, the less likely any one helps, because responsibility diffuses — each assumes someone else will act; singling out one person to ask directly breaks the diffusion.',
    examTask: 'EBQ on the bystander effect and diffusion of responsibility (SP1 Concept Application + SP4 Argumentation); supports defending a claim about prosocial behavior with evidence.',
    confidence: 'high',
    note: 'CED Topic 4.3 "Psychology of Social Situations" covers the bystander effect and diffusion of responsibility.',
  },

  // ===== Unit 5 — Mental and Physical Health =====
  'u5h_cx_schizophrenia': {
    code: '5.4',
    strand: '5',
    label: 'Schizophrenia is not "split personality": it is a psychotic disorder of perception and thought (hallucinations, delusions, disorganized thinking) — NOT having multiple personalities, which describes the separate condition of dissociative identity disorder.',
    examTask: 'AAQ/MCQ on correctly categorizing psychological disorders — schizophrenic spectrum vs. dissociative disorders (SP1 Concept Application); supports accurate diagnosis-category reasoning.',
    confidence: 'high',
    note: 'Upgraded from spec 5.4/5.5 (medium) to 5.4 (high): CED Topic 5.4 "Selection of Categories of Psychological Disorders" explicitly covers BOTH schizophrenic spectrum disorders and dissociative identity disorder, so this is a clean single-topic categorization claim. (5.5 is Treatment.)',
  },
  'u5h_cx_stigma': {
    code: '5.4',
    strand: '5',
    label: 'Mental illness is common, treatable, and not weakness: conditions affect about one in five adults a year and are treatable; most people living with one are no more violent than anyone else, and stigma is itself a barrier to care. (Support: 988, the Suicide & Crisis Lifeline.)',
    examTask: 'EBQ on the prevalence, treatability, and stigma of psychological disorders (SP4 Argumentation); supports defending an evidence-based claim that counters stigma.',
    confidence: 'high',
    note: 'Filed under CED Topic 5.4 (categories/perception of psychological disorders); the prevalence-and-stigma framing also bridges to 5.1/5.5.',
  },
  'u5h_cx_therapy_works': {
    code: '5.5',
    strand: '5',
    label: 'Evidence-based therapy works: cognitive-behavioral and exposure therapies have strong research support, tested in controlled studies against comparison groups; for many conditions they work as well as medication, and combining them is often best.',
    examTask: 'EBQ on the effectiveness of psychotherapy (SP2 Research Methods + SP4 Argumentation); supports evaluating treatment-outcome evidence and the need for a comparison group.',
    confidence: 'high',
  },
  'u5h_cx_stress_physical': {
    code: '5.1',
    strand: '5',
    label: 'Stress has real physiological effects: it activates the HPA axis and hormones like cortisol, and chronic stress can raise blood pressure, suppress immune function, and exhaust the body — the general adaptation syndrome pattern of alarm, resistance, and exhaustion.',
    examTask: 'AAQ/MCQ on health psychology — stress physiology, the HPA axis, and general adaptation syndrome (SP1 Concept Application); supports applying stress concepts to a health scenario.',
    confidence: 'high',
  },

  // ===== The Exam of the Self — Science-Practice capstone (cross-cutting skill) =====
  'cx_exam_self': {
    code: 'SP1+2+4',
    strand: '0',
    label: 'Apply the science, evaluate the evidence: a chain of claims feeling consistent is not proof — you dispel bundled misconceptions by APPLYING real concepts and EVALUATING evidence on each claim alone (memory is reconstructive; ignoring the situation is the fundamental attribution error; "felt better" needs a comparison group to rule out placebo and natural recovery).',
    examTask: 'AAQ + EBQ meta-skill: apply a psychological concept (SP1), evaluate a study\'s evidence and design (SP2), interpret data (SP3), and defend a claim with cited evidence (SP4) — the full free-response skill set.',
    confidence: 'flag',
    note: 'Genuine cross-cutting Science-Practice meta-capstone (the Exam of the Self), not a single content topic. Mapped to the \'0\' strand by design; ties back to cx_tenpercent (trust evidence over the comfortable feeling).',
  },
};

export default { FRAMEWORK, STANDARDS_MAP };
