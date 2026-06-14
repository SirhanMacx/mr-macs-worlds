// time-travel-festival.js — the WORD HARBOR CAPSTONE story-pack.
//
// Read CONTRACT.md first, then geography-isle.sample.js (the gold standard),
// then this. This pack copies that shape exactly — pure DATA only, no imports,
// no engine calls — so it can never crash the world. The loader installs the
// NPC, fires the warm cutscene, renders the keystones with zero new UI, records
// each Codex idea + lifts the town-light meter on the right word.
//
// Curriculum: Global 9 ENL — THE CAPSTONE. The whole town the player helped
// build gathers in Harbor Town for the TIME TRAVEL FESTIVAL (the mirror of the
// real ENL final). This is the payoff of the arrival story: the harbor is fully
// bright, the Quiet is gone, and the player TELLS THE YEAR'S STORY in the simple
// sentences and words they gathered all year — the very bridge-sentences and
// Codex ideas they already earned (referenced by id as strings).
//
// It is a SPECIAL gentle capstone. There are no fail states ANYWHERE — every
// choice here is true, kind, and reads back the player's own learning. But it
// still honors the craft bar: each keystone's choices are FULL in-character
// sentences (the player SPEAKS one chapter of the year), exactly one choice is
// the through-line the festival is celebrating, and a "not-yet" choice is never
// a red X — Lumi the festival storyteller gently re-tells the missing chapter,
// picture-first, and the player tells it again from understanding (the keystone
// loops). The RIGHT sentence visibly changes the world: a festival lamp blooms,
// the harbor brightens, a Codex idea (the synthesis of the whole year) is
// written, and Mira celebrates and says WHY it matters.
//
// De-identified: Lumi is an invented townsperson; the warm mentor Mira is the
// shipped lamplighter (celebrated here in prose, never given new dialogue). The
// only real person ever named in this world is "Mr. Maccarello," and he is not
// named here. Honest pedagogy: every place, era, and idea is real Global 9
// content; no real figure is given an invented verbatim quote; the festival
// civilizations (Egypt, Rome, Mali, Song China) are the world's own TIME_TRAVEL
// set, described generally and truthfully.
//
// Picture-first, bilingual (中文 + Español), joyful, slow and kind.

export const pack = {
  // ---- identity ----
  id: 'wh-time-travel-festival',
  unit: 'The Time Travel Festival',
  title: 'You Tell the Year\'s Story',

  // ---- npcs ----
  // The festival is held in Harbor Town (`home`, centered at [0,95], radius 64).
  // The shipped townsfolk sit nearby: Mira the lamplighter at [-7,116], the
  // Harbor Guide at [4,112], the keystone neighbor Bula at [12,104]. Lumi, the
  // festival storyteller, stands on the bright festival lawn to the SOUTH of
  // them, clear of every station, where the new lamps are strung. Tapping Lumi
  // opens the first festival keystone; a soft marker bobs until the year's story
  // is told. The Quiet is already gone — this is celebration, not pressure.
  npcs: [
    {
      id: 'wh-ttf-lumi',
      name: 'Lumi',
      title: 'The festival storyteller',
      pos: [0, 78],
      palette: { robe: 0xe8b84a, trim: 0xb87a34, skin: 0xd9a066, hat: 0xf2d28a },
      hatKind: 'brim',
      keystone: 'wh-ttf-geography', // tapping Lumi opens the first chapter
    },
  ],

  // ---- cutscenes ----
  // One short line per beat (Word Harbor's gentle density). Warm dusk → amber as
  // the festival lights come up. The town the player built gathers.
  cutscenes: {
    WH_TTF_FESTIVAL_BEGINS: [
      {
        tint: 'dusk', kicker: 'The Time Travel Festival',
        text: 'The whole town gathers tonight. Every lamp is lit.',
      },
      {
        tint: 'amber',
        text: 'The harbor is bright. The Quiet is gone for good.',
      },
      {
        tint: 'amber', art: 'portrait',
        palette: { robe: 0xe8b84a, trim: 0xb87a34, skin: 0xd9a066, hat: 0xf2d28a },
        kicker: 'Lumi, the festival storyteller',
        text: 'Lumi smiles wide. "Tonight you tell our story — with your own words."',
        cta: 'Step onto the festival lawn',
      },
    ],
  },

  // ---- triggers ----
  // Fires once. The festival begins when the town is lit (the shipped story sets
  // the `townLit` flag when the harbor is full of light) — the natural capstone
  // gate. If `townLit` is never reached the cutscene simply waits; the keystones
  // are still reachable by walking up to Lumi, so the pack never softlocks.
  triggers: [
    { on: 'flag', value: 'townLit', play: 'WH_TTF_FESTIVAL_BEGINS',
      reward: { light: 'The festival lights come up over the whole harbor.' } },
  ],

  // ---- keystones: THE CORE — telling the year's story, one chapter at a time --
  // A gentle four-beat arc. In each, the player SPEAKS one chapter of the year
  // using a simple sentence they already gathered (the bridge-sentences from
  // content.js BRIDGES, and the ideas already written to their Codex). The
  // choices are full in-character sentences; the RIGHT one is the chapter the
  // festival is celebrating in that moment. A "not-yet" choice never fails —
  // Lumi re-tells the missing chapter picture-first and the player tells it
  // again. The wrong choices reference REAL collected words/codex ideas from
  // OTHER chapters, so even a re-teach is a warm review of the player's own year.
  keystones: [
    // ============================================================
    // (1) GEOGRAPHY — where the story begins: the land's shape and place.
    //     References the gathered idea `wh_geo_first_word` (Geography Isle).
    // ============================================================
    {
      id: 'wh-ttf-geography',
      npcId: 'wh-ttf-lumi',
      island: 'home',
      flag: 'wh-ttf-geo-told',
      pic: 'world',
      prompt: {
        en: 'Lumi lifts a lamp. "Begin at the beginning. How does every history start?" Which sentence do you tell first?',
        zh: 'Lumi 举起一盏灯。"从最开始讲。每段历史是怎么开始的？"你先讲哪一句？',
        es: 'Lumi alza una lámpara. "Empieza por el principio. ¿Cómo empieza toda historia?" ¿Qué oración cuentas primero?',
      },
      choices: [
        {
          // RIGHT: the year's true opening chapter — the Geography Isle idea.
          word: 'geography', pic: 'world', right: true,
          label: 'First the land. Geography is the land\'s shape and place — and where people live shapes how they live.',
        },
        {
          // not-yet: a real LATER chapter (trade). Lumi gently rewinds to the start.
          word: 'trade', pic: 'camel', right: false,
          label: 'First the caravans. Trade made the empire rich.',
          reteach: {
            en: 'That is a true chapter — but it comes later! The story begins with the LAND: its shape and place. Trade comes after people have homes and food. Start at the beginning.',
            zh: '那是真的一章——但它在后面！故事要从 land 开始：它的形状和位置。贸易是人们有了家和食物以后的事。从最开始讲。',
            es: 'Ese es un capítulo verdadero, ¡pero viene después! La historia empieza con la TIERRA: su forma y su lugar. El comercio llega cuando la gente ya tiene hogar y comida. Empieza por el principio.',
          },
        },
        {
          // not-yet: a real LATER chapter (cities). Lumi narrows back to geography.
          word: 'city', pic: 'ziggurat', right: false,
          label: 'First the cities. People built great cities by the water.',
          reteach: {
            en: 'Cities are a wonderful chapter — but ask WHY they grew by the water. The land came first: its rivers, its hills, its coast. Tell the land\'s story first.',
            zh: '城市是很棒的一章——但要问它们为什么在水边长大。Land 在先：它的河流、山丘、海岸。先讲 land 的故事。',
            es: 'Las ciudades son un capítulo maravilloso, pero pregunta POR QUÉ crecieron junto al agua. La tierra vino primero: sus ríos, sus colinas, su costa. Cuenta primero la historia de la tierra.',
          },
        },
      ],
      win: {
        pic: 'world',
        en: 'Lumi nods. "Yes — first the land." A festival lamp blooms over the lawn. Mira, watching, presses a hand to her heart: "That is exactly where we begin."',
        zh: 'Lumi 点头。"对——先讲 land。"草坪上一盏节日灯绽放。在一旁看着的 Mira 把手按在心口："这正是我们的开始。"',
        es: 'Lumi asiente. "Sí, primero la tierra." Una lámpara de fiesta florece sobre el césped. Mira, que observa, se lleva la mano al corazón: "Ahí es justo donde empezamos."',
      },
      codex: {
        id: 'wh_ttf_geography',
        group: 'The Time Travel Festival',
        title: 'The story begins with the land',
        idea: 'Every history begins with geography — the land\'s shape and place — because where people live shapes how they live.',
        source: 'Lumi, the festival storyteller (telling the year\'s story)',
      },
      achievement: 'wh_ttf_storyteller',
      light: 'You told the first chapter, and the festival lawn grows brighter.',
    },

    // ============================================================
    // (2) FARMING & SURPLUS — the chapter where everything changed.
    //     References the gathered bridge-sentence "Farming gave people a food
    //     surplus" (BRIDGES br-classical) and the Paleo Valley story.
    // ============================================================
    {
      id: 'wh-ttf-farming',
      npcId: 'wh-ttf-lumi',
      island: 'home',
      flag: 'wh-ttf-farming-told',
      pic: 'farm',
      prompt: {
        en: 'Lumi leans in. "The people moved with the animals — then ONE thing changed everything. What do you tell next?"',
        zh: 'Lumi 凑近。"人们跟着动物迁移——然后有一件事改变了一切。你接着讲什么？"',
        es: 'Lumi se inclina. "La gente se movía con los animales, y luego UNA cosa lo cambió todo. ¿Qué cuentas después?"',
      },
      choices: [
        {
          // RIGHT: the surplus chapter — the engine of everything after.
          word: 'surplus', pic: 'farm', right: true,
          label: 'Then we learned to farm. Farming gave people a food surplus — extra food.',
        },
        {
          // not-yet: a real EARLIER chapter (hunting). Lumi moves the story forward.
          word: 'nomad', pic: 'hunt', right: false,
          label: 'We hunted and gathered. We were nomads who moved all the time.',
          reteach: {
            en: 'That is true — but it is the chapter BEFORE the change! Lumi asks what changed everything. People stopped moving when they learned to FARM and grew extra food. Tell that chapter next.',
            zh: '那是真的——但那是改变之前的一章！Lumi 问的是什么改变了一切。人们学会了 farm、种出多余的食物，就不再迁移了。接着讲那一章。',
            es: 'Es verdad, ¡pero es el capítulo ANTES del cambio! Lumi pregunta qué lo cambió todo. La gente dejó de moverse cuando aprendió a CULTIVAR y produjo comida extra. Cuenta ese capítulo después.',
          },
        },
        {
          // not-yet: a real FEATURE word, not the engine. Lumi names the cause.
          word: 'fertile', pic: 'river', right: false,
          label: 'The river floods, and the soil becomes rich and fertile.',
          reteach: {
            en: 'Rich, fertile soil is real and important — it is WHY farming worked. But the thing that changed everything was the EXTRA food it gave: the surplus. Tell what the food surplus did.',
            zh: '肥沃的土壤是真实又重要的——它是 farming 成功的原因。但改变一切的是它带来的多余食物：surplus。讲一讲 food surplus 做了什么。',
            es: 'El suelo rico y fértil es real e importante: es POR QUÉ funcionó la agricultura. Pero lo que lo cambió todo fue la comida EXTRA que dio: el excedente. Cuenta qué hizo ese excedente de comida.',
          },
        },
      ],
      win: {
        pic: 'farm',
        en: 'Lumi claps softly. "A food surplus — yes!" A second lamp blooms. Mira beams: "Extra food meant some people could do new jobs. That is how everything else began."',
        zh: 'Lumi 轻轻鼓掌。"food surplus——对！"第二盏灯绽放。Mira 笑容满面："多余的食物让一些人能做新的工作。其它的一切就是这样开始的。"',
        es: 'Lumi aplaude suavemente. "Un excedente de comida, ¡sí!" Florece una segunda lámpara. Mira sonríe: "La comida extra permitió que algunos hicieran trabajos nuevos. Así empezó todo lo demás."',
      },
      codex: {
        id: 'wh_ttf_farming',
        group: 'The Time Travel Festival',
        title: 'A food surplus changed everything',
        idea: 'When farming gave people a food surplus — extra food — some people could do new jobs, and villages grew into towns.',
        source: 'Lumi, the festival storyteller (telling the year\'s story)',
      },
      light: 'You told the chapter that changed everything; the harbor glows warmer.',
    },

    // ============================================================
    // (3) CITIES & TRADE — the chapter where the world connected.
    //     References the gathered bridge-sentences "Fertile river valleys gave
    //     people food" → cities, and "Trade made the empire rich" (br-caravan),
    //     and the Time Travel Festival civilizations (Egypt, Rome, Mali, China).
    // ============================================================
    {
      id: 'wh-ttf-trade',
      npcId: 'wh-ttf-lumi',
      island: 'home',
      flag: 'wh-ttf-trade-told',
      pic: 'camel',
      prompt: {
        en: 'Lumi sweeps a hand at the bright town. "Then cities grew, and ships and caravans went far. What connected the whole world?"',
        zh: 'Lumi 朝着明亮的小镇挥手。"后来城市长大了，船和商队走得很远。是什么把整个世界连在一起？"',
        es: 'Lumi señala el pueblo iluminado. "Luego crecieron las ciudades, y barcos y caravanas fueron lejos. ¿Qué conectó al mundo entero?"',
      },
      choices: [
        {
          // RIGHT: trade — the connector across all the festival civilizations.
          word: 'trade', pic: 'camel', right: true,
          label: 'Trade connected the world. Caravans and ships carried goods and ideas everywhere.',
        },
        {
          // not-yet: a real TOOL of trade, not the connector itself.
          word: 'compass', pic: 'compass', right: false,
          label: 'Sailors used navigation and the compass to cross the sea.',
          reteach: {
            en: 'The compass is real, and it HELPED sailors cross — but it is the tool, not the answer. What MOVED between cities, near and far? Goods and ideas, carried by trade. Tell what connected the world.',
            zh: 'compass 是真的，它帮助水手渡海——但它是工具，不是答案。在城市之间、远近往来的是什么？是货物和思想，靠 trade 运送。讲是什么把世界连在一起。',
            es: 'La brújula es real y AYUDÓ a los marineros a cruzar, pero es la herramienta, no la respuesta. ¿Qué se MOVÍA entre ciudades, cerca y lejos? Bienes e ideas, llevados por el comercio. Cuenta qué conectó al mundo.',
          },
        },
        {
          // not-yet: a real PLACE the player visited, not the connector.
          word: 'empire', pic: 'king', right: false,
          label: 'Mansa Musa ruled a rich empire and carried gold to Mecca.',
          reteach: {
            en: 'Mali was a real, rich empire — that is a true chapter! But ask HOW it grew rich: trade carried its gold and salt across the desert. The thing that connected Egypt, Rome, Mali and China was trade. Tell that.',
            zh: 'Mali 是真实又富有的帝国——那是真的一章！但要问它怎么变富的：trade 把它的黄金和盐运过沙漠。把 Egypt、Rome、Mali、China 连在一起的是 trade。讲这个。',
            es: 'Mali fue un imperio real y rico, ¡ese es un capítulo verdadero! Pero pregunta CÓMO se enriqueció: el comercio llevó su oro y su sal por el desierto. Lo que conectó a Egipto, Roma, Mali y China fue el comercio. Cuenta eso.',
          },
        },
      ],
      win: {
        pic: 'camel',
        en: 'Lumi laughs with joy. "Trade — that is the thread!" A third lamp blooms. Mira nods: "Goods, ideas, even your boat — trade is how a far-away harbor became your home."',
        zh: 'Lumi 开心地笑了。"trade——这就是那根线！"第三盏灯绽放。Mira 点头："货物、思想，连你的船也是——trade 让一个遥远的港口成了你的家。"',
        es: 'Lumi ríe de alegría. "El comercio, ¡ese es el hilo!" Florece una tercera lámpara. Mira asiente: "Bienes, ideas, hasta tu barco: el comercio hizo que un puerto lejano se volviera tu hogar."',
      },
      codex: {
        id: 'wh_ttf_trade',
        group: 'The Time Travel Festival',
        title: 'Trade connected the whole world',
        idea: 'Caravans and ships carried goods and ideas between distant cities, so trade tied Egypt, Rome, Mali and China — and far-off harbors — into one connected world.',
        source: 'Lumi, the festival storyteller (telling the year\'s story)',
      },
      light: 'You told how the world connected; the harbor shines from shore to shore.',
    },

    // ============================================================
    // (4) THE ARRIVAL STORY — the gentlest, final chapter: YOUR story.
    //     The payoff of the whole arrival narrative: you came by boat, learned
    //     words, helped neighbors, and built a home. References the cold-open
    //     gift word HOME and the "town built out of words" close.
    // ============================================================
    {
      id: 'wh-ttf-home',
      npcId: 'wh-ttf-lumi',
      island: 'home',
      flag: 'wh-ttf-home-told',
      pic: 'town',
      prompt: {
        en: 'Lumi takes your hand. "One chapter is left — the newest one. How does OUR story end?" The whole town leans in to hear.',
        zh: 'Lumi 握住你的手。"还剩一章——最新的一章。我们的故事怎么结束？"全镇的人都凑过来听。',
        es: 'Lumi toma tu mano. "Queda un capítulo, el más nuevo. ¿Cómo termina NUESTRA historia?" Todo el pueblo se acerca a escuchar.',
      },
      choices: [
        {
          // RIGHT: the arrival story's payoff — the first gift word, HOME.
          word: 'home', pic: 'town', right: true,
          label: 'A stranger arrived by boat, learned words, helped neighbors — and built a home. This town is my home now.',
        },
        {
          // not-yet: a true but unfinished telling — the journey without the home.
          word: 'boat', pic: 'boat', right: false,
          label: 'A stranger arrived by boat across the sea, alone and with no words.',
          reteach: {
            en: 'That is how the story BEGAN — true and beautiful. But tonight it ends happily! The stranger learned words, helped neighbors, and made this place a HOME. Tell the whole ending.',
            zh: '故事就是这样开始的——真实又美。但今晚它有了快乐的结局！那个陌生人学会了词语，帮助了邻居，把这里变成了 HOME。把完整的结尾讲出来。',
            es: 'Así EMPEZÓ la historia, verdadero y hermoso. ¡Pero esta noche termina feliz! El forastero aprendió palabras, ayudó a sus vecinos e hizo de este lugar un HOGAR. Cuenta el final completo.',
          },
        },
        {
          // not-yet: the motif (the Quiet) without the warm resolution.
          word: 'quiet', pic: 'sad', right: false,
          label: 'The town was full of the Quiet — the space before we shared words.',
          reteach: {
            en: 'The Quiet was real at the start — but look around! Every lamp is lit and the Quiet is gone. The ending is warm: you learned words, helped neighbors, and found a home. Tell the happy ending.',
            zh: 'Quiet 在最开始是真实的——但看看四周！每盏灯都亮了，Quiet 已经消失。结局是温暖的：你学会了词语，帮助了邻居，找到了家。讲那个快乐的结局。',
            es: 'El Silencio fue real al inicio, ¡pero mira a tu alrededor! Cada lámpara está encendida y el Silencio se fue. El final es cálido: aprendiste palabras, ayudaste a tus vecinos y hallaste un hogar. Cuenta el final feliz.',
          },
        },
      ],
      win: {
        pic: 'town',
        en: 'The whole town cheers your name. The last festival lamp blooms and the harbor blazes gold. Mira wipes away a happy tear: "You arrived with a boat and built a home out of words. Welcome home, for good."',
        zh: '全镇为你欢呼。最后一盏节日灯绽放，海港闪耀着金光。Mira 擦去一滴喜悦的泪："你坐着一条船来，用词语建起了一个家。欢迎回家，永远的家。"',
        es: 'Todo el pueblo aclama tu nombre. La última lámpara de fiesta florece y el puerto arde en oro. Mira se seca una lágrima feliz: "Llegaste con un barco y construiste un hogar con palabras. Bienvenido a casa, para siempre."',
      },
      codex: {
        id: 'wh_ttf_home',
        group: 'The Time Travel Festival',
        title: 'You built a home out of words',
        idea: 'Like the travelers all year, a newcomer who arrives with nothing can learn words, help neighbors, and turn a strange harbor into a home.',
        source: 'Lumi, the festival storyteller (telling the year\'s story)',
      },
      achievement: 'wh_ttf_year_told',
      light: 'You told the whole year\'s story, and the entire harbor blazes with light.',
    },
  ],

  // ---- codex: every real idea this pack can teach ----
  // Recorded only when its keystone is understood (each keystone inlines the
  // matching entry by the same id). Listed here to document the full learning
  // payload — the synthesis of the whole Word Harbor year.
  codex: [
    {
      id: 'wh_ttf_geography',
      group: 'The Time Travel Festival',
      title: 'The story begins with the land',
      idea: 'Every history begins with geography — the land\'s shape and place — because where people live shapes how they live.',
      source: 'Lumi, the festival storyteller (telling the year\'s story)',
    },
    {
      id: 'wh_ttf_farming',
      group: 'The Time Travel Festival',
      title: 'A food surplus changed everything',
      idea: 'When farming gave people a food surplus — extra food — some people could do new jobs, and villages grew into towns.',
      source: 'Lumi, the festival storyteller (telling the year\'s story)',
    },
    {
      id: 'wh_ttf_trade',
      group: 'The Time Travel Festival',
      title: 'Trade connected the whole world',
      idea: 'Caravans and ships carried goods and ideas between distant cities, so trade tied Egypt, Rome, Mali and China — and far-off harbors — into one connected world.',
      source: 'Lumi, the festival storyteller (telling the year\'s story)',
    },
    {
      id: 'wh_ttf_home',
      group: 'The Time Travel Festival',
      title: 'You built a home out of words',
      idea: 'Like the travelers all year, a newcomer who arrives with nothing can learn words, help neighbors, and turn a strange harbor into a home.',
      source: 'Lumi, the festival storyteller (telling the year\'s story)',
    },
  ],

  // ---- achievements: sparse, meaningful milestones ----
  achievements: [
    { id: 'wh_ttf_storyteller', title: 'The Festival Storyteller', desc: 'You began to tell the year\'s story at the Time Travel Festival.' },
    { id: 'wh_ttf_year_told', title: 'A Home Built of Words', desc: 'You told the whole year\'s story — and the harbor blazed with light.' },
  ],
};

export default pack;
