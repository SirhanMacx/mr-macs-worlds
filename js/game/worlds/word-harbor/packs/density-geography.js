// density-geography.js — WORD HARBOR density pack for Geography Isle.
//
// ADDITIVE second pack for the tutorial island. The shipped Geography pack
// (geography-isle.sample.js) teaches the FIRST big idea: GEOGRAPHY is the whole
// study of the land's shape and place. This pack goes one quiet step deeper with
// the small, picture-first words an emerging reader actually USES to find a
// place: MAP, MOUNTAIN, SEA, and NORTH. The quiet true idea woven through all
// three keystones — maps and directions help us find places.
//
// Pure DATA module. No imports, no engine calls — it cannot crash the world.
// Honors every Word Harbor house rule: no fail states, no timers, no scores;
// picture-first; simple short English; bilingual zh + es on prompts, re-teaches
// and wins; de-identified (only invented townsfolk; the teacher is only ever
// "Mr. Maccarello" if named, and is not named here); honest geography; zero
// external assets (only procedural pics.js scene kinds).
//
// ID DISCIPLINE: every id is namespaced with the prefix "d-wh-geo-" (codex and
// achievement ids use the safe variant "d_wh_geo_") so nothing can ever collide
// with the shipped sample pack (id 'wh-geo-sample', npc 'teku', keystone
// 'teku-first-word', codex 'wh_geo_first_word', achievement 'wh_teku_helped').
//
// PLACEMENT: Geography Isle is centered at [0,-38], radius 50. Existing
// occupants we dodge: the Mapmaker (story NPC) at [6,-32] and Teku (sample
// pack) at [-10,-20]. Our three neighbors sit on clear ground around them.

export const pack = {
  // ---- identity ----
  id: 'd-wh-geo-density',
  unit: 'Geography Isle',
  title: 'The Little Words That Find a Place',

  // ---- npcs: three neighbors added to Geography Isle ----
  npcs: [
    {
      // A market girl who lost her way among the stalls and needs the word for
      // the drawing that shows a place from above.
      id: 'd-wh-geo-sela',
      name: 'Sela',
      title: 'A girl lost among the stalls',
      pos: [-22, -44],
      palette: { robe: 0x6fae9a, trim: 0x3f6b5c, skin: 0xd9a066, hat: 0xe3d6a4 },
      hatKind: 'cap',
      keystone: 'd-wh-geo-ks-map',
    },
    {
      // An old shepherd who knows the high land but lost the word for it.
      id: 'd-wh-geo-doro',
      name: 'Doro',
      title: 'An old shepherd of the high land',
      pos: [20, -50],
      palette: { robe: 0x8a8f9c, trim: 0x5a5f6c, skin: 0x8a5a33, hat: 0x6e6258 },
      hatKind: 'hood',
      keystone: 'd-wh-geo-ks-mountain',
    },
    {
      // A young fisher who must point the boats home and needs a direction word.
      id: 'd-wh-geo-pell',
      name: 'Pell',
      title: 'A young fisher at the shore',
      pos: [-4, -58],
      palette: { robe: 0x4f86ae, trim: 0x2f546b, skin: 0xd9b07c, hat: 0x2f546b },
      hatKind: 'brim',
      keystone: 'd-wh-geo-ks-north',
    },
    {
      // A warm supporting neighbor: a peddler who remembers what you have done
      // for the others (branching, story-flag aware) and offers the sea word in
      // a gentle keystone of his own. He has BOTH a dialogue tree (memory) wired
      // through the keystone-bearing fisher? No — to keep one keystone per NPC,
      // the peddler carries a plain branching dialogue that REFERENCES the flags
      // set by the three keystones, so he becomes the pack's "memory" voice.
      id: 'd-wh-geo-bem',
      name: 'Bem',
      title: 'A travelling peddler of small maps',
      pos: [30, -36],
      palette: { robe: 0xc28f4e, trim: 0x8a5d2f, skin: 0x8a5a33, hat: 0xe0b54e },
      hatKind: 'turban',
      dialogue: {
        start: (ctx) => {
          // He greets you differently as you help the island's neighbors.
          if (ctx.is && ctx.is('d-wh-geo-helpedMap') &&
              ctx.is('d-wh-geo-helpedMountain') &&
              ctx.is('d-wh-geo-helpedNorth')) return 'allDone';
          if (ctx.is && (ctx.is('d-wh-geo-helpedMap') ||
              ctx.is('d-wh-geo-helpedMountain') ||
              ctx.is('d-wh-geo-helpedNorth'))) return 'someDone';
          return 'greet';
        },
        nodes: {
          greet: {
            text: 'Hello, word-collector. I sell small maps from a basket, but a map is only paper until someone knows the words on it. Sela, Doro and Pell each lost a small word today. Help them, and the whole isle will read together.',
            choices: [
              { label: 'Who are they? Tell me where to look.', next: 'whoare' },
              { label: 'I will go and help them now.', next: '@close' },
            ],
          },
          whoare: {
            text: 'Sela lost the word for the paper that shows a place from above. Doro lost the word for the tall land. Pell lost the word for the way the cold star points. Three small words. You carry words — share them.',
            choices: [
              { label: 'Three small words. I will find them.', next: '@close' },
            ],
          },
          someDone: {
            text: 'I saw a lamp light just now — you helped one of them. Word by word, you are teaching the isle to read its own ground. Keep going; the others are still waiting with their lost word.',
            choices: [
              { label: 'I will help the others too.', next: '@close' },
              { label: 'Why does each small word matter?', next: 'whymatter' },
            ],
          },
          whymatter: {
            text: 'Because a place you cannot name is a place you can get lost in. Map, mountain, the great water, the cold-star way — these are the words that put a finger on the ground and say HERE. Small words, but they find a home.',
            choices: [
              { label: 'Then I will give them every one.', next: '@close' },
            ],
          },
          allDone: {
            text: 'Look at the isle now — three more lamps, three neighbors who can read the ground beneath them. Sela points to her map, Doro names his mountain, Pell turns the boats home by the cold star. You gave the little words that find a place. Take a small map from my basket; you have earned it.',
            choices: [
              { label: 'Thank you, Bem. I will keep collecting words.', next: '@close' },
            ],
          },
        },
      },
    },
  ],

  // ---- cutscenes: one gentle arrival beat ----
  cutscenes: {
    D_WH_GEO_MARKET_MORNING: [
      {
        tint: 'amber', kicker: 'Geography Isle',
        text: 'Morning on the isle. Three neighbors stand still, each holding a question.',
      },
      {
        tint: 'amber', art: 'portrait',
        palette: { robe: 0xc28f4e, trim: 0x8a5d2f, skin: 0x8a5a33, hat: 0xe0b54e },
        kicker: 'Bem, the map peddler',
        text: 'A peddler waves you over. "Each one lost one small word. You collect words — share them."',
        cta: 'Help the neighbors',
      },
    ],
  },

  // ---- triggers: fire the arrival beat once, the first visit after the sample's ----
  // We gate on the shipped Teku flag is NOT required; a plain visit is fine and
  // the loader fires each trigger only once (story-flag backed). reward lifts the
  // town-light meter after the beats.
  triggers: [
    {
      on: 'visit', value: 'wh-geo', play: 'D_WH_GEO_MARKET_MORNING',
      reward: { light: 'The market wakes, and three neighbors look up, hopeful.' },
    },
  ],

  // ---- keystones: THE CORE — three gentle, picture-first understanding beats ----
  keystones: [
    // ============================================================ KEYSTONE 1: MAP
    {
      id: 'd-wh-geo-ks-map',
      npcId: 'd-wh-geo-sela',
      island: 'wh-geo',
      flag: 'd-wh-geo-helpedMap',
      pic: 'world',
      prompt: {
        en: 'Sela is lost between the market stalls. "I need the paper that shows this whole place from above, so I can find my way." Which word do you give?',
        zh: 'Sela 在集市的摊位之间迷路了。"我需要那张从上面显示整个地方的纸，好让我找到路。"你给哪个词？',
        es: 'Sela está perdida entre los puestos del mercado. "Necesito el papel que muestra todo este lugar desde arriba, para hallar mi camino." ¿Qué palabra le das?',
      },
      choices: [
        {
          word: 'map', pic: 'world', right: true,
          label: 'Here is MAP — a picture of a place seen from above, to find your way.',
        },
        {
          // Plausible-but-wrong: a real glossary thing, but it is one PLACE on
          // the map, not the picture of the place. Re-teach narrows part → tool.
          word: 'town', pic: 'town', right: false,
          label: 'Here is TOWN — the houses and streets where people live.',
          reteach: {
            en: 'A town is the real place itself. Sela needs the PAPER that shows the place from above, so she can follow it. Look at the picture again.',
            zh: 'town 是真实的地方本身。Sela 需要那张从上面显示这个地方的纸，好跟着它走。再看看图。',
            es: 'Un pueblo es el lugar real. Sela necesita el PAPEL que muestra el lugar desde arriba, para seguirlo. Mira el dibujo otra vez.',
          },
        },
        {
          // Plausible-but-wrong: the tool that READS a map, not the map itself.
          word: 'compass', pic: 'compass', right: false,
          label: 'Here is COMPASS — the small tool that shows which way is north.',
          reteach: {
            en: 'A compass shows the way, but it has no streets on it. Sela needs the drawing with the stalls and paths on it. Which one shows the whole place? Look again.',
            zh: 'compass 指方向，但上面没有街道。Sela 需要画着摊位和小路的那张图。哪个显示整个地方？再看一次。',
            es: 'Una brújula muestra la dirección, pero no tiene calles. Sela necesita el dibujo con los puestos y caminos. ¿Cuál muestra todo el lugar? Mira otra vez.',
          },
        },
      ],
      win: {
        pic: 'world',
        en: 'Sela traces the paths with her finger. "A MAP! Now I see where I am." She walks home without a wrong turn, and a lamp lights over the market.',
        zh: 'Sela 用手指描着小路。"地图！现在我知道我在哪了。"她一路没走错就回到家，集市上空一盏灯亮了。',
        es: 'Sela sigue los caminos con el dedo. "¡Un MAPA! Ahora veo dónde estoy." Llega a casa sin un solo giro equivocado, y una lámpara se enciende sobre el mercado.',
      },
      codex: {
        id: 'd_wh_geo_map',
        group: 'Geography Isle',
        title: 'What a map is',
        idea: 'A map is a drawing of a place seen from above, so a small piece of paper can show where things are and help you find your way.',
        source: 'Sela, a girl of the harbor market',
      },
      achievement: 'd_wh_geo_reader',
      light: 'You gave Sela the word MAP, and the market is brighter.',
    },

    // ======================================================= KEYSTONE 2: MOUNTAIN
    {
      id: 'd-wh-geo-ks-mountain',
      npcId: 'd-wh-geo-doro',
      island: 'wh-geo',
      flag: 'd-wh-geo-helpedMountain',
      pic: 'wall',
      prompt: {
        en: 'Doro points at the tall, rocky land that rises high above the fields. "On the map this is the high land. What is its word?" Which word do you give?',
        zh: 'Doro 指着那片高高耸立在田野之上的岩石高地。"在地图上这是高地。它叫什么词？"你给哪个词？',
        es: 'Doro señala la tierra alta y rocosa que se eleva sobre los campos. "En el mapa esto es la tierra alta. ¿Cuál es su palabra?" ¿Qué palabra le das?',
      },
      choices: [
        {
          word: 'mountain', pic: 'wall', right: true,
          label: 'Here is MOUNTAIN — land that rises high, far above the flat ground.',
        },
        {
          // Plausible-but-wrong: a real landform word, but LOW water-land, the
          // opposite of high. Re-teach contrasts high vs. low.
          word: 'river valley', pic: 'river', right: false,
          label: 'Here is RIVER VALLEY — the low green land down beside a river.',
          reteach: {
            en: 'A river valley is the LOW land, down by the water. Doro points UP at the high, rocky land. Which word means land that rises high? Look at the picture again.',
            zh: 'river valley 是低地，在水边。Doro 指的是上面那片高高的岩石地。哪个词表示高高升起的地？再看看图。',
            es: 'Un valle fluvial es la tierra BAJA, junto al agua. Doro señala ARRIBA, la tierra alta y rocosa. ¿Qué palabra es tierra que se eleva alto? Mira el dibujo otra vez.',
          },
        },
        {
          // Plausible-but-wrong: a thing people BUILD, not a shape of the land.
          word: 'road', pic: 'road', right: false,
          label: 'Here is ROAD — the path people build to walk from place to place.',
          reteach: {
            en: 'A road is built by people. Doro means a SHAPE of the land that nature made — tall and rocky. Which word names the high land itself? Look once more.',
            zh: 'road 是人修的。Doro 说的是大自然造出的一种地形——又高又多岩石。哪个词表示这片高地本身？再看一次。',
            es: 'Un camino lo construye la gente. Doro habla de una FORMA de la tierra hecha por la naturaleza: alta y rocosa. ¿Qué palabra nombra la tierra alta? Mira otra vez.',
          },
        },
      ],
      win: {
        pic: 'wall',
        en: 'Doro smiles at the peak. "MOUNTAIN — yes, that is its name." He marks it on the map so no shepherd loses the path again, and a lamp lights on the high trail.',
        zh: 'Doro 望着山峰微笑。"mountain——对，这就是它的名字。"他把它标在地图上，让牧羊人再也不会迷路，高高的山路上一盏灯亮了。',
        es: 'Doro sonríe al pico. "MONTAÑA, sí, ese es su nombre." Lo marca en el mapa para que ningún pastor pierda el camino, y una lámpara se enciende en el sendero alto.',
      },
      codex: {
        id: 'd_wh_geo_mountain',
        group: 'Geography Isle',
        title: 'Landforms have names',
        idea: 'A mountain is land that rises high above the flat ground, and naming a landform on a map lets people picture the high, low, and level ground before they travel it.',
        source: 'Doro, a shepherd of the high land',
      },
      achievement: 'd_wh_geo_reader',
      light: 'You gave Doro the word MOUNTAIN, and the high trail is brighter.',
    },

    // ========================================================== KEYSTONE 3: NORTH
    {
      id: 'd-wh-geo-ks-north',
      npcId: 'd-wh-geo-pell',
      island: 'wh-geo',
      flag: 'd-wh-geo-helpedNorth',
      pic: 'compass',
      prompt: {
        en: 'Pell must point the fishing boats home before dark. "The compass needle points one way — the way of the cold star. What is that direction\'s word?" Which word do you give?',
        zh: 'Pell 必须在天黑前为渔船指路回家。"指南针的针指向一个方向——那颗冷星的方向。那个方向叫什么词？"你给哪个词？',
        es: 'Pell debe guiar los barcos a casa antes de que oscurezca. "La aguja de la brújula apunta a un lado: el lado de la estrella fría. ¿Cuál es la palabra de esa dirección?" ¿Qué palabra le das?',
      },
      choices: [
        {
          word: 'north', pic: 'compass', right: true,
          label: 'Here is NORTH — the direction the compass needle and the cold star point.',
        },
        {
          // Plausible-but-wrong: a real direction, but the warm-sun way, not the
          // needle's way. Re-teach distinguishes the four directions.
          word: 'south', pic: 'compass', right: false,
          label: 'Here is SOUTH — the way toward the warm noon sun.',
          reteach: {
            en: 'South is the warm-sun way — the OPPOSITE of the needle. The compass needle points the other way, toward the cold star. Which word is that? Look at the compass again.',
            zh: 'south 是暖太阳那边——和针相反。指南针的针指向另一边，朝着那颗冷星。那是哪个词？再看看指南针。',
            es: 'El sur es el lado del sol cálido, lo OPUESTO a la aguja. La aguja apunta al otro lado, hacia la estrella fría. ¿Cuál palabra es esa? Mira la brújula otra vez.',
          },
        },
        {
          // Plausible-but-wrong: a glossary tool, not a direction word.
          word: 'astrolabe', pic: 'astrolabe', right: false,
          label: 'Here is ASTROLABE — the old tool that reads the height of the stars.',
          reteach: {
            en: 'An astrolabe is a tool, not a direction. Pell needs the WORD for the way — up toward the cold star where the needle rests. Which way is that? Look once more.',
            zh: 'astrolabe 是工具，不是方向。Pell 需要那个表示方向的词——朝着针停下的那颗冷星。那是哪个方向？再看一次。',
            es: 'Un astrolabio es una herramienta, no una dirección. Pell necesita la PALABRA del lado, hacia la estrella fría donde la aguja descansa. ¿Cuál lado es? Mira otra vez.',
          },
        },
      ],
      win: {
        pic: 'compass',
        en: 'Pell turns the tiller. "NORTH — home is north!" The boats follow the needle in, safe before dark, and a lamp lights at the shore to guide the last sail.',
        zh: 'Pell 转动舵柄。"北——家在北边！"渔船跟着针进港，在天黑前平安回来，岸边一盏灯亮起，为最后一张帆引路。',
        es: 'Pell gira el timón. "¡NORTE, la casa está al norte!" Los barcos siguen la aguja a puerto, a salvo antes de oscurecer, y una lámpara se enciende en la orilla para guiar la última vela.',
      },
      codex: {
        id: 'd_wh_geo_north',
        group: 'Geography Isle',
        title: 'Directions find the way',
        idea: 'North is the direction the compass needle points, and the four directions — north, east, south, west — let people on a map agree which way to walk to reach a place.',
        source: 'Pell, a young fisher of the harbor',
      },
      achievement: 'd_wh_geo_wayfinder',
      light: 'You gave Pell the word NORTH, and the shore light guides the boats home.',
    },
  ],

  // ---- codex: every real idea this pack can teach (mirrors the inlined ones) ----
  codex: [
    {
      id: 'd_wh_geo_map',
      group: 'Geography Isle',
      title: 'What a map is',
      idea: 'A map is a drawing of a place seen from above, so a small piece of paper can show where things are and help you find your way.',
      source: 'Sela, a girl of the harbor market',
    },
    {
      id: 'd_wh_geo_mountain',
      group: 'Geography Isle',
      title: 'Landforms have names',
      idea: 'A mountain is land that rises high above the flat ground, and naming a landform on a map lets people picture the high, low, and level ground before they travel it.',
      source: 'Doro, a shepherd of the high land',
    },
    {
      id: 'd_wh_geo_north',
      group: 'Geography Isle',
      title: 'Directions find the way',
      idea: 'North is the direction the compass needle points, and the four directions — north, east, south, west — let people on a map agree which way to walk to reach a place.',
      source: 'Pell, a young fisher of the harbor',
    },
  ],

  // ---- achievements: two sparse, meaningful milestones ----
  achievements: [
    { id: 'd_wh_geo_reader', title: 'You can read the ground', desc: 'You named the map and the mountain — the picture of a place and the shape of its land.' },
    { id: 'd_wh_geo_wayfinder', title: 'The wayfinder', desc: 'You gave the direction that turns lost boats toward home.' },
  ],
};

export default pack;
