// crossing-isle.js — a gentle, picture-first Word Harbor story-pack for the
// POST-CLASSICAL crossing era, set on CARAVAN COAST (wh-caravan, "Trade Networks
// + Encounters").
//
// Read CONTRACT.md first, then geography-isle.sample.js (the gold standard) and
// river-lands.js (the multi-keystone model). This pack copies that shape exactly:
// real neighbors added to an existing island (wh-caravan, centered [208,8], r=52),
// a one-time warm cutscene, a trigger that fires it, and — the heart — THREE
// picture-first word-keystones whose CHOICES are full in-character offers of a
// word (never A/B/C stems), whose NOT-QUITE path re-teaches kindly and loops
// (never a red X, never a score, no fail state), and whose RIGHT path visibly
// changes the world: a lamp lights, the town-light meter rises, and a Codex entry
// is written.
//
// Curriculum: Global 9 ENL, post-classical Trade Networks + Encounters. The
// quiet, true idea — kept very simple for a newcomer reader: WHEN PEOPLE CROSSED
// BETWEEN LANDS, THEY CARRIED IDEAS AND BOOKS WITH THEM, AND COMMUNITIES CARED
// FOR EACH OTHER IN HARD TIMES. A traveler walks the trade road (TRAVEL); in
// their pack is not gold but a BOOK they carry from land to land (so people far
// apart can LEARN the same ideas); and when a traveler falls sick on the road, a
// rest-house gives CARE (help) — neighbors looking after a stranger. Each
// keystone gives the neighbor the ONE word whose picture matches what they need.
//
// De-identified: Yusra, Bashir and Old Cira are invented townsfolk; no real
// names. The only real person ever nameable is "Mr. Maccarello", unused here.
// Honest pedagogy: the history is real (people, books and ideas moved along
// post-classical trade routes; travelers' rest-houses and communities cared for
// the sick) — no invented verbatim quotes from any real figure; the teaching
// voices are fictional denizens, so nothing is mis-attributed. Picture-first so
// an emerging reader succeeds without decoding text; bilingual zh + es
// throughout; gentle — a not-quite choice gets a kind retry and the keystone
// loops, never a fail. Warm, simple, no fear: a sick traveler is shown only being
// cared for and getting better.
//
// Pictures used are REAL pics.js scene kinds. There is no separate "travel" /
// "learn" / "care" scene, so: travel → the 'boat' scene (a traveler crossing the
// water; 'road' and 'camel' are the not-quite road/desert choices); learn → the
// 'book' scene; care/help → the 'pray' scene (two people side by side, a warm
// light), with 'temple' as the rest-house that shelters the sick.
//
// IDs are all namespaced 'wh-cross-*' so they never collide with the shipped
// content (which already has st-caravan, the Caravan Keeper at [202,14]) or with
// the other packs (wh-river-*, wh-belief-*, wh-geo-*).

export const pack = {
  // ---- identity ----
  id: 'wh-cross-isle',
  unit: 'Caravan Coast',
  title: 'What the Traveler Carried',

  // ---- npcs: extra characters placed at an existing island ----
  // Caravan Coast is centered at [208,8], radius 52 (see worlds/word-harbor.js
  // ISLES). The shipped Caravan Keeper sits at [202,14]; place these neighbors
  // well clear of that, along the warm trade road on the isle's east + south.
  npcs: [
    {
      id: 'wh-cross-yusra',
      name: 'Yusra',
      title: 'A traveler with a dusty road behind her',
      pos: [226, 22],
      palette: { robe: 0xc98a4e, trim: 0x8a5a33, skin: 0xd9a066, hat: 0xe0c08a },
      hatKind: 'hood',
      keystone: 'wh-cross-ks-travel',   // tapping Yusra opens the TRAVEL keystone
    },
    {
      id: 'wh-cross-bashir',
      name: 'Bashir',
      title: 'A young scholar guarding his pack',
      pos: [222, -8],
      palette: { robe: 0x4e7d8a, trim: 0x2f515a, skin: 0x8a5a33, hat: 0xcdbf7a },
      hatKind: 'scholar',
      keystone: 'wh-cross-ks-book',     // tapping Bashir opens the BOOK keystone
    },
    {
      id: 'wh-cross-cira',
      name: 'Old Cira',
      title: 'A keeper of the rest-house door',
      pos: [200, 30],
      palette: { robe: 0xb78ee8, trim: 0x6f5aa0, skin: 0xd9b07c, hat: 0xe2d8f0 },
      hatKind: 'turban',
      keystone: 'wh-cross-ks-care',     // tapping Cira opens the CARE keystone
    },
  ],

  // ---- cutscenes: named playCutscene beat-sequences (ONE short line each) ----
  cutscenes: {
    CROSSING_WELCOME: [
      {
        tint: 'amber', kicker: 'Caravan Coast',
        text: 'Warm dunes meet the sea. A road of footprints comes in from far away, and a traveler rests at its end.',
      },
      {
        tint: 'amber', art: 'portrait',
        palette: { robe: 0xc98a4e, trim: 0x8a5a33, skin: 0xd9a066, hat: 0xe0c08a },
        kicker: 'Yusra, at the end of the road',
        text: '"I have walked far, friend. You collect words — will you walk a little of my road with me?"',
        cta: 'Walk with Yusra',
      },
    ],
  },

  // ---- triggers: when each cutscene fires (once) ----
  triggers: [
    { on: 'visit', value: 'wh-caravan', play: 'CROSSING_WELCOME' },
  ],

  // ---- keystones: THE CORE — three gentle, picture-first word moments ----
  // Each: the player GIVES the word whose PICTURE matches what the neighbor needs.
  // A not-quite choice is never a fail — its `reteach` is read aloud (picture
  // first), then the same keystone loops so the player tries again from
  // understanding. The right word opens a warm `win`, lights a lamp, lifts the
  // town-light meter, and writes the real idea to the Field Journal Codex.
  keystones: [
    // ---------- KEYSTONE 1: TRAVEL ----------
    {
      id: 'wh-cross-ks-travel',
      npcId: 'wh-cross-yusra',
      island: 'wh-caravan',
      flag: 'whCrossTravelGiven',
      pic: 'boat',
      prompt: {
        en: 'Yusra points back along the long road of footprints. "I went from my home land all the way to here, over sand and sea, to meet new people. What is the word for going far between lands like this?" Which word do you give?',
        zh: 'Yusra 指着身后那条长长的脚印路。"我从家乡一路走到这里，越过沙漠和大海，去见新的人。像这样在不同的地方之间走很远，用哪一个词来说？" 你给哪个词？',
        es: 'Yusra señala el largo camino de huellas a su espalda. "Vine desde mi tierra hasta aquí, por arena y mar, para conocer gente nueva. ¿Cuál es la palabra para ir lejos entre tierras así?" ¿Qué palabra le das?',
      },
      choices: [
        {
          word: 'travel', pic: 'boat', right: true,
          label: 'Here is TRAVEL — going far between lands, over road and sea, to reach new people.',
        },
        {
          // Not-quite: the ROAD is the path you travel ON, not the going itself.
          word: 'road', pic: 'road', right: false,
          label: 'Here is ROAD — the stone path that runs across the land.',
          reteach: {
            en: 'A road is the path you walk ON — but it stays still. Yusra means the GOING itself: leaving one land and reaching another far away. What do we call that? Try again.',
            zh: '路是你走在上面的小路——但它不动。Yusra 说的是"走"这件事本身：离开一个地方，到达远方另一个地方。那叫什么？再试一次。',
            es: 'Un camino es la senda por la que ANDAS, pero no se mueve. Yusra se refiere al ir mismo: dejar una tierra y llegar a otra lejana. ¿Cómo se llama eso? Intenta otra vez.',
          },
        },
        {
          // Not-quite: the CARAVAN is who/what travels together — a real glossary
          // word — but it names the group, not the act of going far.
          word: 'caravan', pic: 'camel', right: false,
          label: 'Here is CARAVAN — a line of camels and people moving together.',
          reteach: {
            en: 'A caravan is the GROUP that goes together — the camels and people. But Yusra is asking for the WORD for the going itself, far between lands. What is that one word? Try again.',
            zh: '商队是一起出发的那群人和骆驼。但 Yusra 问的是"走"这件事本身的词——在不同地方之间走很远。那一个词是什么？再试一次。',
            es: 'Una caravana es el GRUPO que va junto: los camellos y la gente. Pero Yusra pregunta por la PALABRA del ir mismo, lejos entre tierras. ¿Cuál es esa palabra? Intenta otra vez.',
          },
        },
      ],
      win: {
        pic: 'boat',
        en: 'Yusra smiles and shoulders her pack. "TRAVEL — yes! That is what I do." She waves at the sea and the road, both ways home. A lamp lights at the end of the road, soft and warm.',
        zh: 'Yusra 笑了，背起行囊。"旅行——对！这就是我在做的事。"她朝大海和道路挥手，两条路都通向家。道路的尽头亮起一盏灯，温柔又温暖。',
        es: 'Yusra sonríe y se echa el bulto al hombro. "¡VIAJAR, sí! Eso es lo que hago." Saluda al mar y al camino, ambos rumbo a casa. Una lámpara se enciende al final del camino, suave y cálida.',
      },
      codex: {
        id: 'wh_cross_travel',
        group: 'Caravan Coast',
        title: 'Travel carried people between lands',
        idea: 'To travel is to go far between lands by road and sea — in the post-classical world, travelers crossed great distances and met people very different from themselves.',
        source: 'Yusra, a traveler of the trade road',
      },
      achievement: 'wh_cross_helped',
      light: 'You gave Yusra the word TRAVEL, and the end of the road is brighter.',
    },

    // ---------- KEYSTONE 2: BOOK / LEARN ----------
    {
      id: 'wh-cross-ks-book',
      npcId: 'wh-cross-bashir',
      island: 'wh-caravan',
      flag: 'whCrossBookGiven',
      pic: 'book',
      prompt: {
        en: 'Bashir opens his pack. Inside is no gold — only pages full of writing he carries from land to land so faraway people can read the same ideas. "What is this thing I carry, that holds ideas and helps people learn?" Which word do you give?',
        zh: 'Bashir 打开行囊。里面没有黄金——只有满满写着字的纸页，他把它从一个地方带到另一个地方，好让远方的人也能读到同样的思想。"我带的这个东西，装着思想、帮人学习，叫什么？" 你给哪个词？',
        es: 'Bashir abre su bulto. Dentro no hay oro, solo páginas llenas de escritura que lleva de tierra en tierra para que gente lejana lea las mismas ideas. "¿Qué es esto que cargo, que guarda ideas y ayuda a aprender?" ¿Qué palabra le das?',
      },
      choices: [
        {
          word: 'book', pic: 'book', right: true,
          label: 'Here is BOOK — pages of writing that carry ideas so people far apart can learn the same things.',
        },
        {
          // Not-quite: GOLD is what most travelers are imagined to carry — a real
          // trade word — but it is not what holds and spreads ideas.
          word: 'gold', pic: 'gem', right: false,
          label: 'Here is GOLD — bright treasure that traders carry to buy and sell.',
          reteach: {
            en: 'Many traders carry gold to buy and sell. But Bashir\'s pack holds something that teaches — pages of ideas, not treasure. What thing of writing helps people learn? Try again.',
            zh: '很多商人带黄金去买卖。但 Bashir 的行囊里装的是能教人的东西——一页页的思想，不是财宝。哪个写着字、帮人学习的东西？再试一次。',
            es: 'Muchos comerciantes llevan oro para comprar y vender. Pero el bulto de Bashir guarda algo que enseña: páginas de ideas, no tesoro. ¿Qué cosa de escritura ayuda a aprender? Intenta otra vez.',
          },
        },
        {
          // Not-quite: the ROAD is HOW the book moves between lands, not the thing
          // that holds the ideas. Narrows path → the thing carried on it.
          word: 'road', pic: 'road', right: false,
          label: 'Here is ROAD — the path that carries the traveler from land to land.',
          reteach: {
            en: 'The road is how Bashir travels — but Bashir is asking about the THING in his pack, the one that holds writing and ideas. What do we call the pages people read to learn? Try again.',
            zh: '路是 Bashir 走的方式——但 Bashir 问的是行囊里的那个东西，装着文字和思想的那个。人们读来学习的那一页页纸叫什么？再试一次。',
            es: 'El camino es como viaja Bashir, pero Bashir pregunta por la COSA de su bulto, la que guarda escritura e ideas. ¿Cómo se llaman las páginas que la gente lee para aprender? Intenta otra vez.',
          },
        },
      ],
      win: {
        pic: 'book',
        en: 'Bashir lifts the pages gently. "BOOK — yes!" He reads one line aloud, and two strangers from far-apart lands lean in to listen and learn together. A lamp lights over the open book.',
        zh: 'Bashir 轻轻举起那些纸页。"书——对！"他念出一行字，两个来自遥远地方的陌生人凑过来一起听、一起学。翻开的书上方亮起一盏灯。',
        es: 'Bashir levanta las páginas con cuidado. "¡LIBRO, sí!" Lee una línea en voz alta, y dos desconocidos de tierras lejanas se acercan a escuchar y aprender juntos. Una lámpara se enciende sobre el libro abierto.',
      },
      codex: {
        id: 'wh_cross_book',
        group: 'Caravan Coast',
        title: 'Travelers carried books and ideas',
        idea: 'A book carries ideas in writing, so when travelers moved between lands they spread learning — the same stories, faith, and knowledge could be read by people far apart.',
        source: 'Bashir, a scholar of the trade road',
      },
      achievement: 'wh_cross_helped',
      light: 'You gave Bashir the word BOOK, and the open page is brighter.',
    },

    // ---------- KEYSTONE 3: CARE / HELP (sick → help) ----------
    {
      id: 'wh-cross-ks-care',
      npcId: 'wh-cross-cira',
      island: 'wh-caravan',
      flag: 'whCrossCareGiven',
      pic: 'pray',
      prompt: {
        en: 'Old Cira keeps the rest-house door. A traveler arrived tired and sick, and now lies warm inside with water, food, and someone sitting beside them. "When neighbors look after a sick stranger like this, what is the word?" Which word do you give?',
        zh: 'Cira 奶奶守着休息屋的门。一位旅人累倒了、病了，现在躺在屋里，有水、有食物，还有人坐在身边。"邻居们这样照顾一个生病的陌生人，叫什么？" 你给哪个词？',
        es: 'La abuela Cira cuida la puerta de la casa de descanso. Un viajero llegó cansado y enfermo, y ahora descansa adentro con agua, comida y alguien sentado a su lado. "Cuando los vecinos cuidan así a un extraño enfermo, ¿cuál es la palabra?" ¿Qué palabra le das?',
      },
      choices: [
        {
          word: 'care', pic: 'pray', right: true,
          label: 'Here is CARE — looking after someone who is sick or tired, the way a community helps a stranger.',
        },
        {
          // Not-quite: TRADE is what the road is famous for — a real glossary word —
          // but it is buying and selling, not helping a sick person.
          word: 'trade', pic: 'camel', right: false,
          label: 'Here is TRADE — buying and selling goods along the road.',
          reteach: {
            en: 'Trade is buying and selling — but no one is selling anything here. The sick traveler is being helped for free, with kindness. What is the word for looking after someone in need? Try again.',
            zh: '贸易是买卖——但这里没有人在卖东西。生病的旅人是被免费、好心地照顾着。照顾有需要的人，用哪个词？再试一次。',
            es: 'El comercio es comprar y vender, pero aquí nadie vende nada. Al viajero enfermo lo ayudan gratis, con bondad. ¿Cuál es la palabra para cuidar a alguien que lo necesita? Intenta otra vez.',
          },
        },
        {
          // Not-quite: the rest-house (shelter) is the PLACE that gives care, not
          // the caring act itself. Narrows place → what the people do inside it.
          word: 'shelter', pic: 'temple', right: false,
          label: 'Here is SHELTER — the rest-house roof that keeps travelers out of the sun.',
          reteach: {
            en: 'The shelter is the PLACE — the roof and walls. But Cira is asking what the people DO inside: sitting with the sick traveler, bringing water, helping them get better. What is that called? Try again.',
            zh: '休息屋是那个地方——屋顶和墙。但 Cira 问的是人们在里面做的事：陪着生病的旅人、端水、帮他好起来。那叫什么？再试一次。',
            es: 'El refugio es el LUGAR: el techo y las paredes. Pero Cira pregunta qué HACE la gente adentro: acompañar al viajero enfermo, traerle agua, ayudarlo a mejorar. ¿Cómo se llama eso? Intenta otra vez.',
          },
        },
      ],
      win: {
        pic: 'pray',
        en: 'Old Cira nods, warm and slow. "CARE — yes." Inside, the tired traveler is already sitting up, stronger, smiling at the neighbor beside them. A lamp lights over the rest-house door.',
        zh: 'Cira 奶奶慢慢地、温暖地点点头。"照顾——对。"屋里，疲惫的旅人已经坐了起来，好多了，朝身旁的邻居微笑。休息屋的门上方亮起一盏灯。',
        es: 'La abuela Cira asiente, cálida y despacio. "CUIDADO, sí." Adentro, el viajero cansado ya está incorporado, más fuerte, sonriendo al vecino a su lado. Una lámpara se enciende sobre la puerta de la casa de descanso.',
      },
      codex: {
        id: 'wh_cross_care',
        group: 'Caravan Coast',
        title: 'Communities cared for one another',
        idea: 'To care is to look after someone who is sick or in need — along the trade roads, communities built rest-houses and looked after tired and sick travelers, even strangers from far away.',
        source: 'Old Cira, keeper of the rest-house',
      },
      achievement: 'wh_cross_helped',
      light: 'You gave Old Cira the word CARE, and the rest-house door is brighter.',
    },
  ],

  // ---- codex: every real idea this pack can teach (mirrors the inlined ones) ----
  codex: [
    {
      id: 'wh_cross_travel',
      group: 'Caravan Coast',
      title: 'Travel carried people between lands',
      idea: 'To travel is to go far between lands by road and sea — in the post-classical world, travelers crossed great distances and met people very different from themselves.',
      source: 'Yusra, a traveler of the trade road',
    },
    {
      id: 'wh_cross_book',
      group: 'Caravan Coast',
      title: 'Travelers carried books and ideas',
      idea: 'A book carries ideas in writing, so when travelers moved between lands they spread learning — the same stories, faith, and knowledge could be read by people far apart.',
      source: 'Bashir, a scholar of the trade road',
    },
    {
      id: 'wh_cross_care',
      group: 'Caravan Coast',
      title: 'Communities cared for one another',
      idea: 'To care is to look after someone who is sick or in need — along the trade roads, communities built rest-houses and looked after tired and sick travelers, even strangers from far away.',
      source: 'Old Cira, keeper of the rest-house',
    },
  ],

  // ---- achievements: one sparse, meaningful milestone ----
  achievements: [
    {
      id: 'wh_cross_helped',
      title: 'What the traveler carried',
      desc: 'You walked the crossing road: travel, then the book of ideas, then care for a stranger.',
    },
  ],
};

export default pack;
