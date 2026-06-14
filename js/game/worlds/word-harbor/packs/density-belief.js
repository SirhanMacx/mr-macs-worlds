// density-belief.js — a SECOND, DENSER Word Harbor story-pack for the
// BELIEF SYSTEMS isle (curriculum: Global 9 ENL, Belief Systems, routed onto
// River Lands — `wh-river`, centered at [138,-126], radius 56).
//
// Read CONTRACT.md first, then geography-isle.sample.js (the gold standard),
// then belief-grove.js (the EXISTING belief pack — already teaches TEMPLE,
// KIND, and SHARE/the golden rule). This pack does NOT repeat those. It is a
// content-DENSITY pack: it deepens the same gentle theme with three NEW
// word-keystones — PEACE, STORY, and HOPE — building to the quiet, true idea
// that *stories and beliefs teach people how to live together*.
//
// Pure DATA only: no imports, no engine calls — so a broken pack can never
// crash the world. The loader installs the NPCs, fires one warm cutscene,
// renders the keystones with zero new UI, records the Codex idea + lifts the
// town-light meter on the right word, and unlocks the achievements.
//
// House rules honored (Word Harbor): no fail states / timers / scores — a wrong
// word is "try again from understanding," never a red X; picture-first (every
// prompt, choice and win carries a pics.js scene kind so an emerging reader
// succeeds without decoding); simple English; bilingual zh + es on prompt,
// reteach and win; de-identified (Mela and Old Sefu are invented townsfolk; the
// only real person this world ever names is "Mr. Maccarello," not named here);
// honest pedagogy (faiths described respectfully and generally — peace, story,
// and hope are taught as teachings MANY traditions share, never assigned to one
// faith; no real figure is given an invented verbatim quote); zero external
// assets (only pics.js procedural scene kinds).
//
// ID DISCIPLINE: every id in this pack carries the unique namespace prefix
// `d-wh-belief-` (and codex ids `d_wh_belief_`) so it can NEVER collide with the
// shipped belief-grove pack or any other pack. NPCs sit on real River Lands
// coords clear of the River Scribe station ([132,-120]) and of belief-grove's
// Anan ([120,-108]).

export const pack = {
  // ---- identity ----
  id: 'd-wh-belief-density',
  unit: 'Belief Systems Isle',
  title: 'More Lamps in the Grove: Stories That Teach Us to Live Together',

  // ---- npcs ----
  // Two new neighbors on River Lands, on the far (east/south) edge of the grove,
  // clear of the River Scribe ([132,-120]) and of Anan ([120,-108]).
  //  - Mela, a young storyteller, sits to the EAST at [156, -132] (~18 from the
  //    [138,-126] center; well inside radius 56). She owns PEACE, then STORY.
  //  - Old Sefu, a lamp-mender, sits to the SOUTHEAST at [160, -116] (~24 from
  //    center). He owns HOPE.
  npcs: [
    {
      id: 'd-wh-belief-mela',
      name: 'Mela',
      title: 'A young storyteller of the grove',
      pos: [156, -132],
      palette: { robe: 0x6fae9a, trim: 0x3f7a66, skin: 0xe0b483, hat: 0xd8efe6 },
      hatKind: 'hood',
      keystone: 'd-wh-belief-peace', // tapping Mela opens the first new keystone
    },
    {
      id: 'd-wh-belief-sefu',
      name: 'Old Sefu',
      title: 'A lamp-mender who has seen many seasons',
      pos: [160, -116],
      palette: { robe: 0xd9a04e, trim: 0x9c6f2e, skin: 0xb07a44, hat: 0xf0dca0 },
      hatKind: 'brim',
      keystone: 'd-wh-belief-hope',
    },
  ],

  // ---- cutscenes ----
  // One short line per beat (Word Harbor's gentle density). Warm dusk tint.
  cutscenes: {
    D_WH_BELIEF_DENSITY_ARRIVES: [
      {
        tint: 'dusk', kicker: 'Belief Systems Isle',
        text: 'Past the lit shrines, more lamps still wait in the dark.',
      },
      {
        tint: 'dusk',
        text: 'A girl is telling a soft story to two old neighbors.',
      },
      {
        tint: 'dusk', art: 'portrait',
        palette: { robe: 0x6fae9a, trim: 0x3f7a66, skin: 0xe0b483, hat: 0xd8efe6 },
        kicker: 'Mela, a storyteller',
        text: 'Mela waves you over. "I tell the stories. I am missing words."',
        cta: 'Sit with Mela',
      },
    ],
  },

  // ---- triggers ----
  // Fires once, when the belief-grove's first lamp is lit (flag set by the
  // shipped belief-grove pack). This sequences the denser grove AFTER the
  // player has met Anan, without this pack depending on belief-grove loading
  // (if that flag never appears, the cutscene simply never fires — the NPCs and
  // keystones still work when the player walks up to them). No reward line here;
  // the lamps are lit by the keystones themselves.
  triggers: [
    { on: 'flag', value: 'wh-belief-temple-lit', play: 'D_WH_BELIEF_DENSITY_ARRIVES' },
  ],

  // ---- keystones: THE CORE ----
  // Three NEW gentle word-keystones (peace, story, hope) — none repeating
  // belief-grove's temple/kind/share. Each: FULL in-character choices (never
  // A/B/C stems), exactly one right; each wrong choice has a picture-first
  // reteach that narrows the misconception and LOOPS the same keystone (no
  // penalty); each win lights a lamp (lifts the meter) and writes a true,
  // one-sentence Codex idea.
  keystones: [
    // (1) PEACE — the word for a quiet, no-fighting togetherness many faiths ask for.
    {
      id: 'd-wh-belief-peace',
      npcId: 'd-wh-belief-mela',
      npcName: 'Mela',
      npcTitle: 'A young storyteller of the grove',
      island: 'wh-river',
      flag: 'd-wh-belief-peace-lit',
      pic: 'pray',
      prompt: {
        en: 'Mela points to neighbors of many faiths sitting calm together, no fighting. "All my stories end the same gentle way," she says. "What is the word for quiet, no-fighting living together?" Which word do you give?',
        zh: 'Mela 指着许多不同信仰的邻居安静地坐在一起，没有争吵。她说："我所有的故事都以同样温柔的方式结束。表示『安静、不打架、和睦相处』的那个词是什么？"你给哪个词？',
        es: 'Mela señala a vecinos de muchas religiones sentados tranquilos juntos, sin pelear. "Todas mis historias terminan igual de suaves", dice. "¿Cuál es la palabra para vivir juntos en calma, sin pelear?" ¿Qué palabra le das?',
      },
      choices: [
        {
          word: 'peace', pic: 'pray', right: true,
          label: 'Here is PEACE — living together calm and gentle, with no fighting.',
        },
        {
          // Plausible-but-wrong: a real word, but it names the FIGHT, the
          // opposite of what the faiths ask for. The reteach flips it.
          word: 'war', pic: 'wall', right: false,
          label: 'Here is WAR — when people fight each other with anger.',
          reteach: {
            en: 'War is the FIGHTING — that is the opposite. Mela means the calm AFTER fighting stops, when neighbors sit together. Which word is that? Look again.',
            zh: 'war 是『打仗』——那是相反的。Mela 说的是打架停下来『之后』的平静，邻居们坐在一起。哪个词是这个意思？再看一看。',
            es: 'War es la PELEA, lo contrario. Mela habla de la calma DESPUÉS de que la pelea para, cuando los vecinos se sientan juntos. ¿Qué palabra es esa? Mira otra vez.',
          },
        },
        {
          // Plausible-but-wrong: a real, lovely word, but it is just being
          // tired/resting, not living-together-calm. The reteach narrows
          // "one person resting" to "people together, not fighting."
          word: 'sleep', pic: 'town', right: false,
          label: 'Here is SLEEP — when one person closes their eyes to rest.',
          reteach: {
            en: 'Sleep is one person resting their eyes. Mela means MANY people, awake, living together with no fighting. Which word is that? Look once more.',
            zh: 'sleep 是一个人闭眼休息。Mela 说的是『许多』人，醒着，在一起生活、不打架。哪个词是这个意思？再看一次。',
            es: 'Sleep es una persona descansando los ojos. Mela habla de MUCHAS personas, despiertas, viviendo juntas sin pelear. ¿Qué palabra es esa? Mira otra vez.',
          },
        },
      ],
      win: {
        pic: 'pray',
        en: 'Mela smiles. "PEACE — yes." A lamp lights, and the neighbors of every faith lean back, calm and easy under its warm glow.',
        zh: 'Mela 笑了。"peace——对。"一盏灯亮了，各种信仰的邻居都靠了回去，在暖光下安静又自在。',
        es: 'Mela sonríe. "PAZ, sí." Una lámpara se enciende, y los vecinos de cada fe se recuestan, tranquilos y a gusto bajo su luz cálida.',
      },
      codex: {
        id: 'd_wh_belief_peace',
        group: 'Belief Systems Isle',
        title: 'The peace the faiths ask for',
        idea: 'Peace means living together calmly without fighting, and many belief systems teach it as a goal — asking followers to settle quarrels gently so neighbors of different faiths can share one place.',
        source: 'Mela, a storyteller of the grove',
      },
      achievement: 'd-wh-belief-storyteller',
      light: 'You gave Mela the word PEACE, and another lamp warms the grove.',
    },

    // (2) STORY — the word for the carried-down tale that teaches a lesson.
    // Gated after PEACE by flag (so it reads as Mela's second word).
    {
      id: 'd-wh-belief-story',
      npcId: 'd-wh-belief-mela',
      npcName: 'Mela',
      npcTitle: 'A young storyteller of the grove',
      island: 'wh-river',
      flag: 'd-wh-belief-story-lit',
      pic: 'book',
      prompt: {
        en: 'Mela opens a worn book. "My grandmother told these, and hers told her. Each one teaches a lesson about being good." What is the word for a tale that is told again and again and carries a lesson?',
        zh: 'Mela 打开一本旧书。"我奶奶讲过这些，她的奶奶讲给她听。每一个都教人要做好人。"表示『一遍遍讲下来、带着道理的故事』的那个词是什么？',
        es: 'Mela abre un libro gastado. "Mi abuela las contaba, y la suya a ella. Cada una enseña a ser bueno." ¿Cuál es la palabra para un relato que se cuenta una y otra vez y lleva una lección?',
      },
      choices: [
        {
          word: 'story', pic: 'book', right: true,
          label: 'Here is STORY — a tale told again and again that teaches a lesson.',
        },
        {
          // Plausible-but-wrong: a real word for the OBJECT that holds stories,
          // not the tale itself. The reteach separates the container from the
          // tale.
          word: 'book', pic: 'book', right: false,
          label: 'Here is BOOK — the paper pages you hold in your hands.',
          reteach: {
            en: 'A book is the PAGES that hold the tale. But Mela could tell it with no pages at all — out loud, by heart. The word she wants is the TALE itself. Which word is that? Look again.',
            zh: 'book 是装着故事的『纸页』。但 Mela 不用纸页也能讲——大声地、背下来地讲。她要的是『故事本身』那个词。哪个词是这个意思？再看一看。',
            es: 'Un libro son las PÁGINAS que guardan el relato. Pero Mela podría contarlo sin páginas, en voz alta, de memoria. La palabra que quiere es el RELATO mismo. ¿Cuál es? Mira otra vez.',
          },
        },
        {
          // Plausible-but-wrong: a real word, but it means a plain true fact,
          // not a told-down tale with a lesson. The reteach distinguishes a
          // bare fact from a carried story.
          word: 'fact', pic: 'world', right: false,
          label: 'Here is FACT — one true thing, like "the river is wide."',
          reteach: {
            en: 'A fact is one true thing, with no lesson and no telling. Mela means the long tale, told over and over, that teaches you how to be good. Which word is that? Look once more.',
            zh: 'fact 是一个真实的小事实，没有道理，也不用讲来讲去。Mela 说的是那种长长的、一遍遍讲的、教你做好人的故事。哪个词是这个意思？再看一次。',
            es: 'Un fact es una sola cosa verdadera, sin lección y sin contarse. Mela habla del relato largo, contado una y otra vez, que enseña a ser bueno. ¿Cuál es? Mira otra vez.',
          },
        },
      ],
      win: {
        pic: 'book',
        en: 'Mela hugs the book. "STORY — yes!" A lamp lights, and the old neighbors lean in to hear the next one begin.',
        zh: 'Mela 抱住那本书。"story——对！"一盏灯亮了，年长的邻居们都凑过来听下一个故事开始。',
        es: 'Mela abraza el libro. "HISTORIA, sí." Una lámpara se enciende, y los vecinos mayores se inclinan para oír cómo empieza la siguiente.',
      },
      codex: {
        id: 'd_wh_belief_story',
        group: 'Belief Systems Isle',
        title: 'How beliefs are passed down',
        idea: 'A story is a tale told again and again across generations, and belief systems use stories to pass down their lessons — teaching each new person how to be good and how to live with others.',
        source: 'Mela, a storyteller of the grove',
      },
      light: 'You gave Mela the word STORY, and the grove glows a little wider.',
    },

    // (3) HOPE — Old Sefu's word: the quiet feeling that tomorrow can be better,
    // which faiths and their stories give to people. This keystone carries the
    // pack's quiet thesis in its Codex: stories and beliefs teach people how to
    // live together. Gated after STORY by flag.
    {
      id: 'd-wh-belief-hope',
      npcId: 'd-wh-belief-sefu',
      npcName: 'Old Sefu',
      npcTitle: 'A lamp-mender who has seen many seasons',
      island: 'wh-river',
      flag: 'd-wh-belief-hope-lit',
      pic: 'pray',
      prompt: {
        en: 'Old Sefu mends the last dark lamp. "When the river floods, the stories tell us tomorrow will be kinder, so we keep going." What is the word for that quiet feeling that good things can still come?',
        zh: 'Sefu 老人正在修最后一盏黑灯。"河水泛滥的时候，故事告诉我们明天会更温柔，所以我们坚持下去。"表示『相信好事还会来的那种安静感觉』的那个词是什么？',
        es: 'El viejo Sefu repara la última lámpara apagada. "Cuando el río se desborda, las historias dicen que mañana será más amable, así que seguimos." ¿Cuál es la palabra para ese sentimiento tranquilo de que aún pueden venir cosas buenas?',
      },
      choices: [
        {
          word: 'hope', pic: 'pray', right: true,
          label: 'Here is HOPE — the quiet feeling that good things can still come.',
        },
        {
          // Plausible-but-wrong: a real feeling-word, but it is the heavy,
          // giving-up opposite. The reteach turns sadness toward looking-ahead.
          word: 'sad', pic: 'sad', right: false,
          label: 'Here is SAD — the heavy feeling when something hurts you.',
          reteach: {
            en: 'Sad is the heavy feeling that pulls you DOWN. Sefu means the gentle feeling that lifts you UP — that tomorrow can be better. Which word is that? Look again.',
            zh: 'sad 是把你往『下』拉的沉重感觉。Sefu 说的是把你往『上』提的温柔感觉——相信明天会更好。哪个词是这个意思？再看一看。',
            es: 'Sad es el sentimiento pesado que te tira HACIA ABAJO. Sefu habla del sentimiento suave que te levanta HACIA ARRIBA: que mañana puede ser mejor. ¿Cuál es esa palabra? Mira otra vez.',
          },
        },
        {
          // Plausible-but-wrong: a real word, but it is fear, expecting BAD —
          // the reverse of hope. The reteach flips dread to looking-forward.
          word: 'afraid', pic: 'wall', right: false,
          label: 'Here is AFRAID — feeling scared that something bad will happen.',
          reteach: {
            en: 'Afraid is waiting for something BAD. Sefu means the opposite — quietly trusting that something GOOD can still come. Which word is that? Look once more.',
            zh: 'afraid 是等着『坏』事发生。Sefu 说的正相反——安静地相信『好』事还会来。哪个词是这个意思？再看一次。',
            es: 'Afraid es esperar que pase algo MALO. Sefu habla de lo contrario: confiar con calma en que algo BUENO aún puede venir. ¿Cuál es esa palabra? Mira otra vez.',
          },
        },
      ],
      win: {
        pic: 'pray',
        en: 'Old Sefu lights the last lamp. "HOPE — that is the one." The whole grove glows now, and neighbors of every faith share their stories far into the warm night.',
        zh: 'Sefu 老人点亮了最后一盏灯。"hope——就是这个词。"现在整片树丛都亮了，各种信仰的邻居在温暖的夜里久久地分享着他们的故事。',
        es: 'El viejo Sefu enciende la última lámpara. "ESPERANZA, esa es." Todo el bosque brilla ahora, y vecinos de cada fe comparten sus historias hasta entrada la cálida noche.',
      },
      codex: {
        id: 'd_wh_belief_hope',
        group: 'Belief Systems Isle',
        title: 'Stories and beliefs teach us to live together',
        idea: 'Hope is the quiet trust that good things can still come, and belief systems pass it on through their stories — which is the deepest reason faiths matter: their stories teach people how to live together in peace.',
        source: 'Old Sefu, a lamp-mender of the grove',
      },
      achievement: 'd-wh-belief-grove-complete',
      light: 'You gave Old Sefu the word HOPE, and every lamp in the grove now burns.',
    },
  ],

  // ---- codex: every real idea this pack can teach ----
  // Identical ids to the entries inlined in the keystones above; each is
  // recorded only when its keystone is understood.
  codex: [
    {
      id: 'd_wh_belief_peace',
      group: 'Belief Systems Isle',
      title: 'The peace the faiths ask for',
      idea: 'Peace means living together calmly without fighting, and many belief systems teach it as a goal — asking followers to settle quarrels gently so neighbors of different faiths can share one place.',
      source: 'Mela, a storyteller of the grove',
    },
    {
      id: 'd_wh_belief_story',
      group: 'Belief Systems Isle',
      title: 'How beliefs are passed down',
      idea: 'A story is a tale told again and again across generations, and belief systems use stories to pass down their lessons — teaching each new person how to be good and how to live with others.',
      source: 'Mela, a storyteller of the grove',
    },
    {
      id: 'd_wh_belief_hope',
      group: 'Belief Systems Isle',
      title: 'Stories and beliefs teach us to live together',
      idea: 'Hope is the quiet trust that good things can still come, and belief systems pass it on through their stories — which is the deepest reason faiths matter: their stories teach people how to live together in peace.',
      source: 'Old Sefu, a lamp-mender of the grove',
    },
  ],

  // ---- achievements: sparse + meaningful ----
  achievements: [
    { id: 'd-wh-belief-storyteller', title: 'The storyteller has her words', desc: 'You gave Mela the word PEACE, and her gentle stories found their ending.' },
    { id: 'd-wh-belief-grove-complete', title: 'Every lamp in the grove', desc: 'You lit the deepest lamps with PEACE, STORY, and HOPE — the words that teach people to live together.' },
  ],
};

export default pack;
