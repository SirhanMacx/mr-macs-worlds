// js/game/worlds/word-harbor/standards.js
//
// Proof-of-Learning spine — STANDARDS MAP for WORD HARBOR (key `enl`).
// World: "The Harbor That Was Waiting for You" — NYS Global History &
// Geography I (Grade 9), the ENL / newcomer course.
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
//               'flag'   = a genuine skill / ENL meta-capstone, not a single content code
//   note        optional rationale (kept for the teacher-facing crosswalk)
//
// The 20 ids below are the COMPLETE set of Codex entries this world can record
// (the `_helped` / `_lit` / `_found` / `_welcomed` / `_storyteller` / `_year_told`
// / `_teku_helped` ids in the packs are ACHIEVEMENTS, not Codex — not mapped).
// Bit order for the export-code bitmask is the insertion order of STANDARDS_MAP.
//
// Codes validated against the NYS 9-12 Social Studies Framework (2017 updates),
// Grade 9 Global History & Geography I, Key Ideas 9.1-9.10, sub-letter
// conceptual understandings — see 15_Standards_and_CEDs/source_files/
// NYS_9-12_Social_Studies_Framework_2017_updates.pdf and
// standards_crosswalk_Global_9R.json (official key_idea_titles).

export const FRAMEWORK = {
  system: 'NYS Global History & Geography I (Grade 9) — ENL',
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
  // ---- Geography Isle (tutorial) — Key Idea 9.1 ----
  wh_geo_first_word: {
    code: '9.1',
    strand: '9.1',
    label: 'Geography — the land\'s shape and place — comes first, because WHERE people live shapes HOW they live.',
    examTask: 'Enduring Issues Essay: geography as the opening "where shapes how" frame for the whole year',
    confidence: 'high',
    note: 'KI 9.1: "complex societies were influenced by geographic conditions." Kept at Key-Idea level — this is the year-opening geography-first idea, broader than any one sub-letter.',
  },

  // ---- River Lands — Key Idea 9.1 (Neolithic / environment / cities) ----
  wh_river_water: {
    code: '9.1b',
    strand: '9.1',
    label: 'The first families settled beside rivers because a river gives the fresh water that keeps people and crops alive.',
    examTask: 'CRQ (geographic factors): how a river\'s water explains WHY the first settlements were located where they were',
    confidence: 'high',
    note: '9.1b: civilizations "adapted to and modified their environment to meet the needs of their population" (food, water, shelter).',
  },
  wh_river_farm: {
    code: '9.1a',
    strand: '9.1',
    label: 'A flooding river leaves rich soil, so river land becomes a farm that grows far more food than hunting or gathering could.',
    examTask: 'CRQ / stimulus MCQ: the Neolithic turn to agriculture and the food surplus it created',
    confidence: 'high',
    note: '9.1a: the Neolithic Era\'s "turn to agriculture, herding, and semi-sedentary lifestyles" vs. Paleolithic hunting and gathering.',
  },
  wh_river_city: {
    code: '9.1c',
    strand: '9.1',
    label: 'River-watered farms grew extra food, so many people could live close together in one place — and that is how the first cities grew.',
    examTask: 'CRQ / stimulus MCQ: cities as a defining characteristic of the first complex societies',
    confidence: 'high',
    note: '9.1c lists "cities" among the shared characteristics of complex societies; the idea also rests on the 9.1a surplus.',
  },

  // ---- Belief Systems Isle (Belief Grove) — Key Idea 9.2 ----
  wh_belief_temple: {
    code: '9.2a',
    strand: '9.2',
    label: 'A temple is a shared place where people gather to practice a belief system — different faiths build different temples.',
    examTask: 'CRQ (belief systems): practices and places of worship as features of a belief system',
    confidence: 'high',
    note: '9.2a: belief systems "developed beliefs and practices" — temples are the shared practice/place.',
  },
  wh_belief_kind: {
    code: '9.2a',
    strand: '9.2',
    label: 'Being kind — treating others with gentleness and care — is taught as a first lesson by almost every major belief system.',
    examTask: 'Enduring Issues / CRQ: the shared ethical codes across world belief systems',
    confidence: 'high',
    note: '9.2a covers the "requirements to live a good life" — ethical codes — common across Hinduism, Buddhism, Judaism, Christianity, Islam, Confucianism, Daoism.',
  },
  wh_belief_golden_rule: {
    code: '9.2a',
    strand: '9.2',
    label: 'The golden rule — treat others as you want to be treated — is a core teaching that many different belief systems hold in common.',
    examTask: 'Enduring Issues Essay: an idea shared across eras and places (a strong EIE thread)',
    confidence: 'high',
    note: '9.2a: comparing core beliefs and ethical codes across belief systems; the golden rule is the canonical shared ethic.',
  },

  // ---- Caravan Coast — Crossing Isle (travelers / diffusion) — Key Idea 9.4 ----
  wh_cross_travel: {
    code: '9.4a',
    strand: '9.4',
    label: 'Travelers crossed great distances by road and sea, meeting people very different from themselves, along the great trade networks.',
    examTask: 'CRQ (trade networks): the geographic reach of Afro-Eurasian routes by land and water',
    confidence: 'high',
    note: '9.4a: "Afro-Eurasian transregional trade networks grew across land and bodies of water."',
  },
  wh_cross_book: {
    code: '9.4c',
    strand: '9.4',
    label: 'Books carry ideas in writing, so travelers spread learning — the same stories, faith, and knowledge reached people far apart.',
    examTask: 'CRQ / Enduring Issues: cultural diffusion (the spread of ideas and faith) along trade routes',
    confidence: 'high',
    note: '9.4c: travelers/missionaries "brought with them ... ideas that led to cultural diffusion," incl. diffusion of religious ideas.',
  },
  wh_cross_care: {
    code: '9.4c',
    strand: '9.4',
    label: 'Along the trade roads, communities built rest-houses and cared for tired and sick travelers — even strangers from far away.',
    examTask: 'CRQ (trade networks): the human institutions (rest-houses / caravanserai) that supported travelers and exchange',
    confidence: 'medium',
    note: '9.4c is the travelers-and-exchange CU; "care for travelers" is the human-welfare angle of that movement, a softer sub-letter fit than the literal diffusion clause.',
  },

  // ---- Caravan Coast — Trade Docks (what trade is / coins / roads) — Key Idea 9.4 ----
  wh_trade_what_is_trade: {
    code: '9.4a',
    strand: '9.4',
    label: 'Trade is a two-way swap: people give what they have for what they need, so both sides walk away with what they wanted.',
    examTask: 'Stimulus MCQ / CRQ: defining exchange as the engine of transregional trade networks',
    confidence: 'high',
    note: '9.4a: the foundational definition of the exchange that the Afro-Eurasian networks ran on.',
  },
  wh_trade_coin: {
    code: '9.4d',
    strand: '9.4',
    label: 'A coin is metal everyone agrees has worth, so people can buy and sell easily instead of swapping one good for another.',
    examTask: 'CRQ (trade & states): how control of trade and economic growth helped political states emerge and expand',
    confidence: 'high',
    note: '9.4d: "Control of transregional trade and economic growth contributed to the emergence and expansion of political states"; money is the economic mechanism of that growth.',
  },
  wh_trade_road: {
    code: '9.4a',
    strand: '9.4',
    label: 'A road joins faraway places to nearby ones, so goods, money, and ideas can travel between distant cities and a small market.',
    examTask: 'CRQ (trade networks): the routes (Silk Roads, Trans-Saharan, Indian Ocean) that connected regions',
    confidence: 'high',
    note: '9.4a: the land/water routes of the transregional trade networks.',
  },

  // ---- Exploration Point — Far Shore (voyages / Encounter) — Key Idea 9.10 ----
  wh_far_shore_boat: {
    code: '9.10a',
    strand: '9.10',
    label: 'For most of history the only way to reach a far shore was by boat — so boats carried travelers, traders, and newcomers to new lands.',
    examTask: 'CRQ / stimulus MCQ: the technologies and motives that made overseas exploration possible',
    confidence: 'high',
    note: '9.10a: "Various motives, new knowledge, and technological innovations influenced exploration" — ship technology is the enabling innovation.',
  },
  wh_far_shore_new: {
    code: '9.10b',
    strand: '9.10',
    label: 'Sea voyages brought people to lands they had never seen — new plants, food, and neighbors — and learning that new place turns a stranger into a settler.',
    examTask: 'CRQ / Enduring Issues: the Encounter and the colonization of the Americas',
    confidence: 'high',
    note: '9.10b: "Transatlantic exploration led to the Encounter, colonization of the Americas."',
  },
  wh_far_shore_home: {
    code: '9.10b',
    strand: '9.10',
    label: 'People who crossed the seas met new neighbors and, over time, made the new land home — a meeting of strangers, not only a voyage.',
    examTask: 'Enduring Issues Essay: the human meaning of the Encounter (interaction and settlement across oceans)',
    confidence: 'high',
    note: '9.10b: the Encounter and settlement; framed here as the human story of newcomers making a home.',
  },

  // ---- The Time Travel Festival (year-end recap of the four threads) ----
  wh_ttf_geography: {
    code: '9.1',
    strand: '9.1',
    label: 'Every history begins with geography — the land\'s shape and place — because where people live shapes how they live.',
    examTask: 'Enduring Issues Essay: geography as a recurring frame across eras and places',
    confidence: 'high',
    note: 'Year-end recap of the geography thread (mirrors wh_geo_first_word); kept at KI 9.1 level.',
  },
  wh_ttf_farming: {
    code: '9.1a',
    strand: '9.1',
    label: 'A food surplus from farming let some people take new jobs, and villages grew into towns.',
    examTask: 'CRQ / Enduring Issues: the Neolithic food surplus and the rise of complex society',
    confidence: 'high',
    note: 'Year-end recap of the farming/surplus thread; 9.1a (the Neolithic agricultural turn).',
  },
  wh_ttf_trade: {
    code: '9.4a',
    strand: '9.4',
    label: 'Caravans and ships carried goods and ideas between distant cities, tying Egypt, Rome, Mali, and China into one connected world.',
    examTask: 'Enduring Issues Essay: interconnectedness / trade networks as a thread across the year',
    confidence: 'high',
    note: 'Year-end recap of the trade thread; 9.4a (the transregional networks across land and water).',
  },
  wh_ttf_home: {
    code: '9.0',
    strand: '9.0',
    label: 'Like the travelers all year, a newcomer who arrives with nothing can learn words, help neighbors, and turn a strange harbor into a home.',
    examTask: 'ENL capstone skill: building academic English and belonging — the disposition that powers every CRQ and Enduring Issues response',
    confidence: 'flag',
    note: 'Genuine ENL meta-capstone, not a content Key Idea — the newcomer-literacy/belonging through-line of the whole world. Mapped to 9.0 (skills) and flagged.',
  },
};

export default { FRAMEWORK, STANDARDS_MAP };
