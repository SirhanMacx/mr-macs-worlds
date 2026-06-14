// belief-grove.js — a Word Harbor story-pack: BELIEF SYSTEMS ISLE.
//
// Read CONTRACT.md first, then geography-isle.sample.js (the gold standard),
// then this. This pack copies that shape exactly — pure DATA only, no imports,
// no engine calls — so it can never crash the world. The loader installs the
// NPC, fires the one warm cutscene, renders the keystones with zero new UI,
// records the Codex idea + lifts the town-light meter on the right word.
//
// Curriculum: Global 9 ENL, Belief Systems (the world routes the "Belief
// Systems" glossary category onto River Lands — `wh-river` — where, the River
// Scribe says, "By these rivers, great beliefs were born too"). The real,
// honest idea taught is the gentlest one in the whole unit: across many
// different faiths, people are taught to treat others kindly — the shared
// "golden rule." Picture-first, bilingual, warm and respectful: a grove of
// little shrines where you help a neighbor light the lamps by giving the words
// TEMPLE, KIND, and SHARE — building to the quiet idea of the golden rule.
//
// The neighbor is Anan, a lamplighter's friend who tends the grove of shrines
// but is missing three words. Each keystone is a gentle moment: the CHOICES are
// full in-character offers of a word (never A/B/C stems); a WRONG choice never
// fails — Anan re-teaches kindly, picture-first, and you try again from
// understanding (the same keystone loops); the RIGHT word opens a warm scene, a
// lamp lights, the Quiet steps back, and a true one-sentence idea is written to
// the Field Journal.
//
// De-identified: Anan and Mira are invented townsfolk; the only real person
// ever named in this world is "Mr. Maccarello," and he is not named here.
// Honest pedagogy: faiths are described respectfully and generally; no real
// figure is given an invented verbatim quote; the golden rule is taught as a
// SHARED teaching many traditions hold, not as belonging to any single one.
// Gentle: no fail states, no timers, no scores — kindness has no wrong turns.

export const pack = {
  // ---- identity ----
  id: 'wh-belief-grove',
  unit: 'Belief Systems Isle',
  title: 'The Grove of Quiet Lamps',

  // ---- npcs ----
  // Anan tends the grove of little shrines on River Lands (wh-river, centered
  // at [138,-126], radius 56). The shipped River Scribe sits at [132,-120], so
  // Anan is placed to the southwest of it, clear of that station, near the
  // water's edge where the lamps reflect.
  npcs: [
    {
      id: 'wh-belief-anan',
      name: 'Anan',
      title: 'Keeper of the grove of shrines',
      pos: [120, -108],
      palette: { robe: 0xb78ee8, trim: 0x7a5da8, skin: 0xd9a066, hat: 0xe6d6f5 },
      hatKind: 'hood',
      keystone: 'wh-belief-temple', // tapping Anan opens the first keystone
    },
  ],

  // ---- cutscenes ----
  // One short line per beat (Word Harbor's gentle density). Warm dusk tint.
  cutscenes: {
    WH_BELIEF_GROVE_ARRIVES: [
      {
        tint: 'dusk', kicker: 'Belief Systems Isle',
        text: 'Down by the river, small shrines stand in a quiet grove.',
      },
      {
        tint: 'dusk',
        text: 'Their little lamps are dark. A friend kneels among them.',
      },
      {
        tint: 'dusk', art: 'portrait',
        palette: { robe: 0xb78ee8, trim: 0x7a5da8, skin: 0xd9a066, hat: 0xe6d6f5 },
        kicker: 'Anan, keeper of the grove',
        text: 'Anan looks up, gentle. "You carry words. Help me light the lamps?"',
        cta: 'Sit with Anan',
      },
    ],
  },

  // ---- triggers ----
  // Fires once, the first time the player enters River Lands.
  triggers: [
    { on: 'visit', value: 'wh-river', play: 'WH_BELIEF_GROVE_ARRIVES' },
  ],

  // ---- keystones: THE CORE ----
  // Three gentle word-keystones that build to the quiet idea: temple → kind →
  // share, and the Codex of the third names the shared "golden rule." Each has
  // FULL in-character choices, a plausible-but-wrong path that re-teaches and
  // loops, and a win that lights a lamp + writes a true idea.
  keystones: [
    // (1) TEMPLE — the picture-first word for the special place of belief.
    {
      id: 'wh-belief-temple',
      npcId: 'wh-belief-anan',
      npcName: 'Anan',
      npcTitle: 'Keeper of the grove of shrines',
      island: 'wh-river',
      flag: 'wh-belief-temple-lit',
      pic: 'temple',
      prompt: {
        en: 'Anan points to the little buildings in the grove. "People come here to pray, all kinds of people. What is the ONE word for a special place of belief?" Which word do you give?',
        zh: 'Anan 指着树丛里的小房子。"各种各样的人都来这里祈祷。表示『信仰的特别地方』的那个词是什么？"你给哪个词？',
        es: 'Anan señala los pequeños edificios del bosque. "Aquí viene gente de todo tipo a rezar. ¿Cuál es la palabra para un lugar especial de creencia?" ¿Qué palabra le das?',
      },
      choices: [
        {
          word: 'temple', pic: 'temple', right: true,
          label: 'Here is TEMPLE — a special place where people go to pray.',
        },
        {
          // Plausible-but-wrong: a real glossary word, but it names a HOME, not
          // a place of belief. The re-teach narrows house → place to pray.
          word: 'home', pic: 'town', right: false,
          label: 'Here is HOME — the place where a family lives.',
          reteach: {
            en: 'A home is where people sleep and eat. Anan means the place people come to PRAY together. Look at the little shrines again.',
            zh: 'home 是人们睡觉、吃饭的地方。Anan 说的是人们一起『祈祷』的地方。再看看那些小神龛。',
            es: 'Un hogar es donde la gente duerme y come. Anan habla del lugar donde la gente va a REZAR junta. Mira otra vez los pequeños santuarios.',
          },
        },
        {
          // Plausible-but-wrong: a real route, the road TO a place, not the
          // place itself. The re-teach distinguishes the path from the place.
          word: 'road', pic: 'road', right: false,
          label: 'Here is ROAD — the path you walk to get somewhere.',
          reteach: {
            en: 'A road takes you TO a place, but it is not the place. Anan needs the word for the special building of belief itself. Look once more.',
            zh: 'road 带你『去』一个地方，但它不是那个地方。Anan 需要的是『信仰的特别建筑』本身的词。再看一次。',
            es: 'Un camino te lleva HACIA un lugar, pero no es el lugar. Anan necesita la palabra para el edificio especial de la creencia. Mira otra vez.',
          },
        },
      ],
      win: {
        pic: 'temple',
        en: 'Anan smiles. "TEMPLE — yes." The first lamp glows warm in the grove, and the little shrine is no longer dark.',
        zh: 'Anan 笑了。"temple——对。"树丛里第一盏灯暖暖地亮了，那座小神龛不再黑暗。',
        es: 'Anan sonríe. "TEMPLO, sí." La primera lámpara brilla cálida en el bosque, y el pequeño santuario ya no está oscuro.',
      },
      codex: {
        id: 'wh_belief_temple',
        group: 'Belief Systems Isle',
        title: 'A place to believe together',
        idea: 'A temple is a special place where people gather to pray and practice a belief system — different faiths build different temples, but each is a home for shared belief.',
        source: 'Anan, keeper of the grove of shrines',
      },
      achievement: 'wh_belief_grove_lit',
      light: 'You gave Anan the word TEMPLE, and the grove is a little brighter.',
    },

    // (2) KIND — the heart-word the faiths share. Gated after TEMPLE by flag.
    {
      id: 'wh-belief-kind',
      npcId: 'wh-belief-anan',
      npcName: 'Anan',
      npcTitle: 'Keeper of the grove of shrines',
      island: 'wh-river',
      flag: 'wh-belief-kind-lit',
      pic: 'pray',
      prompt: {
        en: 'At each shrine the people are gentle to one another. "Many faiths teach one same lesson," says Anan. "What is the word for being soft and good to other people?" Which word do you give?',
        zh: '在每座神龛前，人们都互相温柔相待。Anan 说："很多信仰都教同一个道理。表示『对别人温柔又善良』的那个词是什么？"你给哪个词？',
        es: 'En cada santuario la gente es amable entre sí. "Muchas religiones enseñan la misma lección", dice Anan. "¿Cuál es la palabra para ser bueno y suave con los demás?" ¿Qué palabra le das?',
      },
      choices: [
        {
          word: 'kind', pic: 'pray', right: true,
          label: 'Here is KIND — being gentle and good to other people.',
        },
        {
          // Plausible-but-wrong: a real, lovely word about wealth, not the
          // heart. The re-teach moves from things → how you treat people.
          word: 'rich', pic: 'gem', right: false,
          label: 'Here is RICH — having a lot of money and fine things.',
          reteach: {
            en: 'Rich is about having THINGS. The faiths here teach about how you TREAT people — soft, good, caring. Which word means that? Look again.',
            zh: 'rich 说的是『拥有东西』。这里的信仰教的是你『怎样对待别人』——温柔、善良、关心。哪个词是这个意思？再看一看。',
            es: 'Rico se trata de TENER cosas. Las religiones de aquí enseñan cómo TRATAS a la gente: con suavidad, bondad, cuidado. ¿Qué palabra significa eso? Mira otra vez.',
          },
        },
        {
          // Plausible-but-wrong: a real word, but about being correct, not
          // good. The re-teach separates "being right" from "being kind."
          word: 'right', pic: 'book', right: false,
          label: 'Here is RIGHT — when an answer is correct, not wrong.',
          reteach: {
            en: 'Right means an answer is correct. But Anan asked about your HEART — being good and gentle to people, even strangers. Which word is that? Look once more.',
            zh: 'right 是说答案『正确』。但 Anan 问的是你的『心』——对人善良温柔，哪怕是陌生人。哪个词是这个意思？再看一次。',
            es: 'Right significa que una respuesta es correcta. Pero Anan preguntó por tu CORAZÓN: ser bueno y suave con la gente, aun con desconocidos. ¿Qué palabra es esa? Mira otra vez.',
          },
        },
      ],
      win: {
        pic: 'pray',
        en: 'Anan presses a hand to their heart. "KIND — yes, that is the one." A second lamp lights, and two people by the shrine bow gently to each other.',
        zh: 'Anan 把手放在心口。"kind——对，就是这个词。"第二盏灯亮了，神龛旁的两个人轻轻地互相鞠躬。',
        es: 'Anan se lleva la mano al corazón. "AMABLE, sí, esa es." Una segunda lámpara se enciende, y dos personas junto al santuario se inclinan con suavidad.',
      },
      codex: {
        id: 'wh_belief_kind',
        group: 'Belief Systems Isle',
        title: 'The lesson the faiths share',
        idea: 'To be kind means to treat other people with gentleness and care, and almost every major belief system teaches this as one of its first and most important lessons.',
        source: 'Anan, keeper of the grove of shrines',
      },
      light: 'You gave Anan the word KIND, and the grove is warmer still.',
    },

    // (3) SHARE → the golden rule. Gated after KIND by flag. The Codex names
    // the real shared teaching honestly (a teaching MANY traditions hold).
    {
      id: 'wh-belief-share',
      npcId: 'wh-belief-anan',
      npcName: 'Anan',
      npcTitle: 'Keeper of the grove of shrines',
      island: 'wh-river',
      flag: 'wh-belief-share-lit',
      pic: 'town',
      prompt: {
        en: 'One lamp is still dark. "The faiths say: treat others the way you want to be treated. So if you have bread, you give some away." What is the word for giving part of what you have to others?',
        zh: '还有一盏灯是黑的。"信仰说：你想别人怎样对你，你就怎样对别人。所以你有面包，就分一些出去。"表示『把你拥有的一部分给别人』的那个词是什么？',
        es: 'Una lámpara sigue oscura. "Las religiones dicen: trata a los demás como quieres que te traten. Así que si tienes pan, das un poco." ¿Cuál es la palabra para dar parte de lo que tienes a otros?',
      },
      choices: [
        {
          word: 'share', pic: 'town', right: true,
          label: 'Here is SHARE — to give part of what you have to others.',
        },
        {
          // Plausible-but-wrong: the opposite heart — to hold it all. The
          // re-teach turns "keep" toward "give a part away."
          word: 'keep', pic: 'gem', right: false,
          label: 'Here is KEEP — to hold all of it for yourself.',
          reteach: {
            en: 'Keep means to hold it all yourself. But the golden rule asks you to GIVE a part to others, the way you would want them to give to you. Which word is that? Look again.',
            zh: 'keep 是说全部留给自己。但黄金法则要你把一部分『给』别人，就像你希望别人也给你一样。哪个词是这个意思？再看一看。',
            es: 'Keep significa quedarte con todo. Pero la regla de oro te pide DAR una parte a los demás, como querrías que te dieran a ti. ¿Qué palabra es esa? Mira otra vez.',
          },
        },
        {
          // Plausible-but-wrong: a real word, but it means to ask FOR, the
          // reverse of giving. The re-teach flips "take" into "give a part."
          word: 'take', pic: 'gem', right: false,
          label: 'Here is TAKE — to get a thing for yourself.',
          reteach: {
            en: 'Take means you get something for yourself. The golden rule is the other way: you GIVE a part, so others have some too. Which word means giving a part? Look once more.',
            zh: 'take 是你给自己拿一样东西。黄金法则正好相反：你『给』出一部分，让别人也有。哪个词表示『给出一部分』？再看一次。',
            es: 'Take significa conseguir algo para ti. La regla de oro es lo contrario: DAS una parte para que otros también tengan. ¿Qué palabra significa dar una parte? Mira otra vez.',
          },
        },
      ],
      win: {
        pic: 'town',
        en: 'Anan breaks a loaf and hands you half. "SHARE — that is the golden rule." The last lamp lights, and the whole grove glows. Neighbors of every faith sit down together.',
        zh: 'Anan 掰开一块面包，递给你一半。"share——这就是黄金法则。"最后一盏灯亮了，整片树丛都亮了。各种信仰的邻居坐到了一起。',
        es: 'Anan parte un pan y te da la mitad. "COMPARTIR: esa es la regla de oro." La última lámpara se enciende y todo el bosque brilla. Vecinos de cada fe se sientan juntos.',
      },
      codex: {
        id: 'wh_belief_golden_rule',
        group: 'Belief Systems Isle',
        title: 'The golden rule',
        idea: 'The golden rule — treat others the way you want to be treated, and share what you have — is a teaching that many different belief systems hold in common.',
        source: 'Anan, keeper of the grove of shrines',
      },
      achievement: 'wh_belief_golden_rule_found',
      light: 'You gave Anan the word SHARE, and the whole grove is lit.',
    },
  ],

  // ---- codex: every real idea this pack can teach ----
  // Identical (same ids) to the entries inlined in the keystones above. Each is
  // recorded only when its keystone is understood.
  codex: [
    {
      id: 'wh_belief_temple',
      group: 'Belief Systems Isle',
      title: 'A place to believe together',
      idea: 'A temple is a special place where people gather to pray and practice a belief system — different faiths build different temples, but each is a home for shared belief.',
      source: 'Anan, keeper of the grove of shrines',
    },
    {
      id: 'wh_belief_kind',
      group: 'Belief Systems Isle',
      title: 'The lesson the faiths share',
      idea: 'To be kind means to treat other people with gentleness and care, and almost every major belief system teaches this as one of its first and most important lessons.',
      source: 'Anan, keeper of the grove of shrines',
    },
    {
      id: 'wh_belief_golden_rule',
      group: 'Belief Systems Isle',
      title: 'The golden rule',
      idea: 'The golden rule — treat others the way you want to be treated, and share what you have — is a teaching that many different belief systems hold in common.',
      source: 'Anan, keeper of the grove of shrines',
    },
  ],

  // ---- achievements: sparse + meaningful ----
  achievements: [
    { id: 'wh_belief_grove_lit', title: 'A lamp in the grove', desc: 'You lit the first shrine of the belief grove with a kind word.' },
    { id: 'wh_belief_golden_rule_found', title: 'The golden rule', desc: 'You gave the word that many faiths share: treat others kindly, and share.' },
  ],
};

export default pack;
