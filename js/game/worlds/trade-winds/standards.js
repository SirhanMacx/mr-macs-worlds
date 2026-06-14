// js/game/worlds/trade-winds/standards.js
//
// Proof-of-Learning spine — STANDARDS MAP for TRADE WINDS (world key `global9`).
// World: "The House of the Open Road" — NYS Global History & Geography I
// (Grade 9), the trading-empire campaign across four eras.
//
// PURE DATA. No imports, no side effects, no DOM, no clock. This file is the
// single source of truth that maps every earned Codex id in this world to a
// real NYS Social Studies Framework code, so the coverage matrix, the teacher
// dashboard, the export code, and the study sheet can all read one shape.
//
// CONTRACT (every world's standards.js shares this exact shape):
//   export const FRAMEWORK   = { system, source, strands:{ code: label } }
//   export const STANDARDS_MAP = {
//     codexId: { code, strand, label, examTask, confidence, note? }
//   }
//   export default { FRAMEWORK, STANDARDS_MAP }
//
// Field meaning:
//   code        the real framework code (NYS Global: ^9\.\d{1,2}[a-e]?$ or '9.0')
//   strand      the Key-Idea bucket the code rolls up to (a key of FRAMEWORK.strands)
//   label       a human, learner-facing sentence for the understanding earned
//   examTask    the Regents task this evidence supports (CRQ / EIE / Stimulus MCQ)
//   confidence  'high'  = code is a clean, defensible match
//               'medium'= the idea fits the Key Idea but the sub-letter is a soft fit
//               'flag'  = a genuine skill / EIE meta-capstone, not a single content code
//   note        optional rationale (kept for the teacher-facing crosswalk)
//
// The 22 ids below are the COMPLETE set of Codex entries this world can record
// (the `ks-*` ids in the packs are KEYSTONE node ids and the `ach-*` ids are
// ACHIEVEMENTS — neither is a Codex entry, so neither is mapped). They mirror,
// in insertion order, the GAME_PROOF_OF_LEARNING_SPEC.md §A "Trade Winds" list,
// and the bit order for the export-code bitmask is exactly this insertion order.
//
// Codes validated against the NYS 9-12 Social Studies Framework (2017 updates),
// Grade 9 Global History & Geography I, Key Ideas 9.1-9.10 and their sub-letter
// conceptual understandings — see 15_Standards_and_CEDs/source_files/
// NYS_9-12_Social_Studies_Framework_2017_updates.pdf and
// standards_crosswalk_Global_9R.json (official key_idea_titles).
//
// Notes on the few non-trivial mappings (per spec §A):
//   • cx-direct-vs-republic, cx-pax-romana, cx-mandate-merit → 9.3b. The spec
//     groups all three under "political powers / state-building" of the classical
//     era; in the 2017 framework 9.3 is the Classical-Civilizations Key Idea, and
//     9.3b is the achievements/expansion conceptual understanding the trading
//     campaign actually demonstrates (Roman republic→empire, Han Mandate & merit
//     exams). cx-mandate-merit is kept MEDIUM because the Mandate-of-Heaven /
//     merit-exam idea also bridges 9.5 (political achievements); 9.3b is primary.
//   • cx-price-of-empire → 9.3a/9.3b. The "conquest and slavery price of empire"
//     idea straddles 9.3a (expansion) and 9.3b (achievement/decline); primary
//     code is 9.3a, secondary 9.3b noted — kept MEDIUM by design (the seam IS
//     the lesson).
//   • cx-u7-printing-reformation → 9.9a/9.9b. Renaissance/print money is 9.9a;
//     the Reformation it set off is 9.9b. Primary 9.9a, secondary 9.9b noted —
//     kept MEDIUM (a single idea spanning two adjacent sub-letters).
//   • cx-enduring-issues → 9.0 (FLAG). The capstone is the cross-cutting Regents
//     Enduring-Issues Essay meta-skill (name a recurring issue + prove it endured
//     across far-apart eras), not a single Key-Idea content code. Mapped to the
//     '9.0' skills strand by design — the analogue of Mind Atlas' '0.SP'.

export const FRAMEWORK = {
  system: 'NYS Global History & Geography I (Grade 9)',
  source: 'New York State 9-12 Social Studies Framework (2017 updates), Grade 9 Global History and Geography I (Key Ideas 9.1-9.10)',

  // FULL strand catalog (every Key Idea), so the coverage matrix has a header
  // for every strand even when no Codex entry has been earned in it yet.
  // Labels are the official NYS Key Idea titles (standards_crosswalk_Global_9R.json).
  strands: {
    '9.1':  'Development of Civilization',
    '9.2':  'Belief Systems: Rise and Impact',
    '9.3':  'Classical Civilizations: Expansion, Achievement, Decline',
    '9.4':  'Rise of Transregional Trade Networks',
    '9.5':  'Political Powers and Achievements',
    '9.6':  'Social and Cultural Growth and Conflict',
    '9.7':  'The Ottoman Empire and the Ming Dynasty Pre-1600',
    '9.8':  'Africa and the Americas Pre-1600',
    '9.9':  'Transformation of Western Europe and Russia',
    '9.10': 'Interactions and Disruptions',
    '9.0':  'Course skills & Regents tasks (CRQ / Enduring Issues / stimulus analysis) — no single Key Idea',
  },
};

export const STANDARDS_MAP = {
  // ===== Unit 1 — Early Humans & the Neolithic Revolution (9.1) =====
  'cx-neolithic-surplus': {
    code: '9.1a',
    strand: '9.1',
    label: 'The Neolithic Revolution changed society because farming produced a SURPLUS — more food than was needed to survive — which freed some people from food production and made specialized jobs, social classes, trade, and government possible.',
    examTask: 'CRQ / Stimulus-MCQ on the Neolithic Revolution and the rise of civilization (9.1); supports a constructed-response on cause and effect of agriculture.',
    confidence: 'high',
  },
  'cx-settling-tradeoff': {
    code: '9.1a',
    strand: '9.1',
    label: 'Settling down was a trade-off, not pure progress: farming villages gained surplus, permanence, and population, but lost the forager\'s varied diet and mobility and took on new risks — denser disease, dependence on one harvest, and harder labor.',
    examTask: 'CRQ on the costs and benefits of the shift to agriculture (9.1); supports weighing trade-offs in a document-based prompt.',
    confidence: 'high',
  },

  // ===== Unit 2 — River Valley Civilizations (9.1) =====
  'cx-u2-writing-accounting': {
    code: '9.1c',
    strand: '9.1',
    label: 'Writing began as accounting, not literature: the first scripts (cuneiform) were invented by temple and palace scribes to track grain, trade, taxes, and debts — record-keeping for a complex economy came before storytelling.',
    examTask: 'CRQ / Stimulus-MCQ on the development of writing and complex societies in river valleys (9.1); supports analyzing how civilizations met the needs of growing populations.',
    confidence: 'high',
    note: '9.1c is the "complex institutions / writing systems and record keeping" conceptual understanding of the Development-of-Civilization Key Idea.',
  },
  'cx-u2-geography-belief': {
    code: '9.1b',
    strand: '9.1',
    label: 'Geography shaped opposite river-valley beliefs: Egypt\'s gentle, predictable Nile floods fostered an optimistic, orderly worldview, while Mesopotamia\'s sudden, destructive river floods fostered an anxious worldview — the same need for water, opposite outlooks.',
    examTask: 'CRQ on how physical geography shaped early civilizations and belief (9.1); supports a geography-and-culture constructed response.',
    confidence: 'high',
    note: '9.1b is the "physical geography influenced the development of civilizations" conceptual understanding.',
  },

  // ===== Unit 3 — Belief Systems (9.2) =====
  'cx-ashoka-dhamma': {
    code: '9.2b',
    strand: '9.2',
    label: 'Rulers adopt and spread belief systems to UNIFY and LEGITIMIZE: Ashoka turned to Buddhist dhamma after the bloodshed at Kalinga, then carved edicts along his roads to bind a vast, diverse Maurya realm under shared values — faith as a tool of statecraft.',
    examTask: 'CRQ / Stimulus-MCQ on belief systems and political power (9.2); supports analyzing how a ruler used religion to govern.',
    confidence: 'high',
    note: '9.2b is the "belief systems and their influence on culture, government, and social order" conceptual understanding.',
  },

  // ===== Unit 4 — Classical Empires (9.3) =====
  'cx-direct-vs-republic': {
    code: '9.3b',
    strand: '9.3',
    label: 'Scale pushes a state from direct rule toward representation: as a city-state grows into a territory too large for every citizen to gather and decide, it must develop representative institutions (Rome\'s republic, the Senate) to govern people who cannot all be in one place.',
    examTask: 'CRQ / Stimulus-MCQ on the political achievements of classical civilizations (9.3); supports analyzing how governments adapted to growth.',
    confidence: 'high',
  },
  'cx-pax-romana': {
    code: '9.3b',
    strand: '9.3',
    label: 'Rome held a vast empire through the Pax Romana: ~200 years of relative peace enforced by a professional army, a network of roads, common law and currency, and local self-rule — the infrastructure of order let trade and culture flow across three continents.',
    examTask: 'CRQ / Stimulus-MCQ on the expansion and achievement of classical Rome (9.3); supports analyzing the methods empires used to maintain control.',
    confidence: 'high',
  },
  'cx-mandate-merit': {
    code: '9.3b',
    strand: '9.3',
    label: 'Han China held a vast empire through the Mandate of Heaven and merit: the Mandate justified the emperor\'s rule (and its loss explained dynastic fall), while a Confucian civil-service exam recruited capable officials by merit rather than birth — legitimacy plus competent administration.',
    examTask: 'CRQ / Stimulus-MCQ comparing how classical empires (Rome, Han China) governed (9.3); supports a comparison constructed response.',
    confidence: 'medium',
    note: 'Primary 9.3b (classical-civilization achievement). The Mandate-of-Heaven / merit-exam idea also bridges 9.5 (political powers and achievements); kept medium for that seam.',
  },
  'cx-price-of-empire': {
    code: '9.3a',
    strand: '9.3',
    label: 'Classical empires carried a human price: conquest, tribute, and large-scale slavery powered the wealth and monuments of Rome and Han China — the same expansion that built roads and cities was paid for by the unfree and the conquered.',
    examTask: 'CRQ on the costs of classical expansion (9.3); supports evaluating both achievements and human costs of empire.',
    confidence: 'medium',
    note: 'Straddles 9.3a (expansion of classical civilizations) and 9.3b (achievement/decline). Primary 9.3a, secondary 9.3b — the seam IS the lesson, so kept medium.',
  },

  // ===== Unit 5 — Expanding Zones of Exchange (9.4) =====
  'cx-silk-road-diffusion': {
    code: '9.4c',
    strand: '9.4',
    label: 'The Silk Road moved ideas, not just goods: along the same caravan routes that carried silk and spices traveled religions (Buddhism), technologies (paper, the compass), art, and knowledge — cultural diffusion was the deeper cargo of transregional trade.',
    examTask: 'CRQ / Stimulus-MCQ on cultural diffusion along trade networks (9.4); supports analyzing how trade routes spread ideas across regions.',
    confidence: 'high',
    note: '9.4c is the "trade networks encouraged cultural diffusion / spread of ideas and technologies" conceptual understanding.',
  },
  'cx-gold-salt-scarcity': {
    code: '9.4c',
    strand: '9.4',
    label: 'Scarcity sets value: across the Sahara, salt was scarce in the gold-rich south and gold was scarce in the salt-rich north, so the two were traded nearly weight for weight — value comes from scarcity relative to need, not from a thing being "precious" in itself.',
    examTask: 'CRQ / Stimulus-MCQ on the trans-Saharan gold-salt trade (9.4); supports analyzing why and how transregional trade networks formed.',
    confidence: 'high',
  },
  'cx-indian-ocean-tech': {
    code: '9.4b',
    strand: '9.4',
    label: 'Technology made Indian Ocean trade possible: monsoon winds gave a predictable seasonal sailing calendar, and the lateen sail, dhow, and astrolabe let ships ride and navigate them — geography plus technology, not luck, built the largest pre-modern sea-trade network.',
    examTask: 'CRQ / Stimulus-MCQ on the Indian Ocean trade network and maritime technology (9.4); supports analyzing how geography and technology enabled trade.',
    confidence: 'high',
    note: '9.4b is the "factors and technologies that facilitated transregional trade networks" conceptual understanding.',
  },

  // ===== Unit 6 — Post-Classical (9.5, 9.6) =====
  'cx-feudalism': {
    code: '9.5a',
    strand: '9.5',
    label: 'Feudalism arose as protection traded for service: after central authority collapsed (post-Rome Europe), people exchanged loyalty, labor, or military service for land and protection from a lord — a decentralized system that filled the vacuum left by a fallen empire.',
    examTask: 'CRQ / Stimulus-MCQ on feudalism and political organization after the fall of Rome (9.5); supports analyzing how societies organized power.',
    confidence: 'high',
    note: '9.5a is the "expansion of political states and empires / responses to the collapse of centralized authority" conceptual understanding.',
  },
  'cx-crusades-exchange': {
    code: '9.6a',
    strand: '9.6',
    label: 'The Crusades were a two-way exchange: launched as religious war, they reopened contact between Europe and the Islamic world, carrying back goods, classical learning, mathematics, and tastes — the same conflict that spilled blood also spread ideas and trade.',
    examTask: 'CRQ / Stimulus-MCQ on the Crusades as conflict and cultural exchange (9.6); supports analyzing how contact between cultures brought both conflict and exchange.',
    confidence: 'high',
    note: '9.6a is the "social, cultural, and economic interactions among regions, including the Crusades" conceptual understanding.',
  },
  'cx-pax-mongolica': {
    code: '9.5b',
    strand: '9.5',
    label: 'The Pax Mongolica made the Silk Road safer than ever: a single Mongol authority spanning Asia secured the routes, so merchants, envoys, and ideas (and, later, disease) moved across Eurasia more freely than under any earlier patchwork of rulers.',
    examTask: 'CRQ / Stimulus-MCQ on the Mongol Empire and the security of trade routes (9.5); supports analyzing how political power shaped trade.',
    confidence: 'high',
    note: '9.5b is the "interactions and methods of expansion of states/empires, including the Mongols" conceptual understanding.',
  },
  'cx-black-death': {
    code: '9.6b',
    strand: '9.6',
    label: 'The Black Death rode the trade routes — connection\'s dark side: the same well-traveled Silk Road and sea-lanes that carried goods carried the plague from Asia to Europe, killing perhaps a third of the population and reshaping labor, economy, and faith.',
    examTask: 'CRQ / Stimulus-MCQ on the spread and impact of the Black Death (9.6); supports analyzing the unintended consequences of interconnection.',
    confidence: 'high',
    note: '9.6b is the "consequences of social/cultural interactions and conflict, including disease (Black Death)" conceptual understanding.',
  },

  // ===== Unit 7 — Renaissance & Reformation (9.9) =====
  'cx-u7-medici-money': {
    code: '9.9a',
    strand: '9.9',
    label: 'The Renaissance happened where the money was: Italian banking and trade wealth (the Medici of Florence) paid for the artists, scholars, and humanist learning that revived classical ideas — cultural rebirth grew from commercial prosperity.',
    examTask: 'CRQ / Stimulus-MCQ on the Renaissance and the transformation of Western Europe (9.9); supports analyzing the causes of the Renaissance.',
    confidence: 'high',
    note: '9.9a is the "Renaissance and the transformation of Western Europe" conceptual understanding.',
  },
  'cx-u7-printing-reformation': {
    code: '9.9a',
    strand: '9.9',
    label: 'The printing press made the Reformation unstoppable: movable type let Luther\'s ideas (and vernacular Bibles) spread faster than the Church could suppress them — a single technology turned a local protest into a continent-wide religious revolution.',
    examTask: 'CRQ / Stimulus-MCQ on the printing press and the Protestant Reformation (9.9); supports analyzing how technology drove religious and political change.',
    confidence: 'medium',
    note: 'Primary 9.9a (transformation of Western Europe / Renaissance technology); the Reformation it set off is 9.9b. A single idea spanning two adjacent sub-letters, so kept medium.',
  },

  // ===== Unit 8 — Age of Exploration (9.10) =====
  'cx-u8-cut-the-middlemen': {
    code: '9.10a',
    strand: '9.10',
    label: 'Europeans sailed to cut out the middlemen: Ottoman and Italian intermediaries drove up the price of Asian spices and silk, so Portugal and Spain sought sea routes to buy at the source — the search for cheaper trade, plus "God, gold, and glory," launched the Age of Exploration.',
    examTask: 'CRQ / Stimulus-MCQ on the motives for European exploration (9.10); supports analyzing the economic causes of overseas expansion.',
    confidence: 'high',
    note: '9.10a is the "technological and economic factors that fostered global interaction / European exploration" conceptual understanding.',
  },
  'cx-u8-columbian-exchange': {
    code: '9.10b',
    strand: '9.10',
    label: 'The Columbian Exchange ran both ways — and carried disease: the Americas, Europe, Africa, and Asia traded crops, animals, and people, transforming diets and populations worldwide, while Old World diseases devastated Indigenous peoples who had no immunity.',
    examTask: 'CRQ / Stimulus-MCQ on the Columbian Exchange (9.10); supports analyzing the global consequences of European contact with the Americas.',
    confidence: 'high',
    note: '9.10b is the "Columbian Exchange and the interactions/disruptions of global contact" conceptual understanding.',
  },
  'cx-u8-atlantic-human-cost': {
    code: '9.10c',
    strand: '9.10',
    label: 'The Atlantic system was built on human cost: the transatlantic slave trade forcibly transported millions of Africans to labor on plantations producing sugar, tobacco, and cotton — the wealth of the new global economy rested on coerced, brutal human bondage.',
    examTask: 'CRQ / Stimulus-MCQ on the transatlantic slave trade and the Atlantic system (9.10); supports evaluating the human costs of global economic systems.',
    confidence: 'high',
    note: '9.10c is the "movement of people (including the slave trade) and its effects" conceptual understanding.',
  },

  // ===== Unit 9 — Enduring Issues Capstone (skills, 9.0) =====
  'cx-enduring-issues': {
    code: '9.0',
    strand: '9.0',
    label: 'How to build an Enduring Issues argument from evidence across time: name a recurring problem the world faces in age after age (such as the impact of trade networks or the struggle over power and authority), then PROVE it endured by drawing the strongest evidence from DIFFERENT, far-apart eras — bending each example to support the claim, not merely listing what happened.',
    examTask: 'EIE meta-skill — the Regents Enduring Issues Essay: define an enduring issue, argue it is significant AND has endured, and support it with accurate evidence from at least two eras/places, with analysis.',
    confidence: 'flag',
    note: 'Genuine cross-cutting Regents Enduring-Issues-Essay meta-capstone, not a single Key-Idea content code. Mapped to the \'9.0\' skills strand by design (the analogue of Mind Atlas\' \'0.SP\').',
  },
};

export default { FRAMEWORK, STANDARDS_MAP };
