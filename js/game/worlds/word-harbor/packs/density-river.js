// density-river.js — a SECOND, denser Word Harbor story-pack for RIVER LANDS.
//
// This is an ADDITIVE density pack. The shipped River Lands pack
// (river-lands.js, id 'wh-river-first-towns') already teaches WATER, FARM and
// CITY — the river → water → farm → city chain. This pack does NOT repeat any of
// those ideas. It deepens the same gentle, true story toward fuller coverage with
// THREE NEW word-keystones a newcomer ninth-grader meets next:
//
//   GRAIN   — the food the watered farm makes, which can be DRIED and STORED so
//             the family eats all year, even when nothing grows (the "surplus"
//             idea, kept picture-simple). This is NOT the farm (the place) — it
//             is what the farm produces and saves.
//   HOME    — ONE house where ONE family lives. The first brick of a town. This
//             is NOT the whole city — it is the single warm room a family builds.
//   BUILD   — the quiet keystone idea of the isle: by the river, many families
//             worked TOGETHER to BUILD the first towns. Not one person, not one
//             family — neighbors building side by side. (family + together → build.)
//
// The quiet, true through-line, kept simple: BY THE RIVER, PEOPLE GREW FOOD AND
// BUILT THE FIRST TOWNS TOGETHER. Grain feeds the family through the year; a home
// shelters one family; and when many families build together, a town rises.
//
// Read CONTRACT.md first, then geography-isle.sample.js (gold standard) and the
// shipped river-lands.js (so these ideas do not overlap). This pack copies that
// exact DATA shape: invented neighbors at the real wh-river island, a one-time
// warm cutscene, a trigger, picture-first keystones whose CHOICES are full
// in-character offers of a word (never A/B/C stems, never a score), whose
// NOT-QUITE path re-teaches kindly and LOOPS (never a red X, no fail state), and
// whose RIGHT path visibly changes the world: a lamp lights, the town-light meter
// rises, and a Codex entry (one true sentence) is written.
//
// De-identified: Tama, Eli, Old Rana and the river neighbors are invented
// townsfolk; no real student, colleague or person names anywhere. The only real
// person ever nameable is "Mr. Maccarello", unused here. Honest pedagogy: the
// geography is real (river farms make storable grain; families build homes; towns
// are built together); no invented verbatim quotes from any real figure.
// Bilingual zh (中文) + es (Español) on every prompt, reteach and win.
//
// Pictures are REAL pics.js scene kinds only (river, farm, town, ziggurat, gem,
// boat, hunt, book). pics.js has no separate grain/home/build/family scene, so —
// exactly as the shipped river-lands.js maps water→river and city→town — here:
//   grain → 'farm' (rows of golden grain), home → 'town' (a house in the town),
//   build → 'ziggurat' (mud-brick raised by hands), family → 'farm'/'town'.
// Unknown kinds safely fall back to 'gem' in the renderer, so nothing can break.
//
// ID DISCIPLINE: EVERY id (pack, npcs, keystones, codex, achievements, cutscene
// flag) carries the unique namespace prefix 'd-wh-river-' so it can NEVER collide
// with the shipped river-lands.js ids (wh-river-*) or any other pack. NPCs are
// placed at REAL coords inside wh-river (center [138,-126], radius 56), clear of
// the River Scribe [132,-120] and the shipped neighbors Sela [120,-108], Old Nima
// [150,-114], Davi [138,-150].

export const pack = {
  // ---- identity ----
  id: 'd-wh-river-density',
  unit: 'River Lands',
  title: 'Grain, Home, and Building Together',

  // ---- npcs: NEW neighbors placed at the real wh-river island ----
  // Offsets chosen to dodge every existing NPC on the isle. The shipped ones sit
  // on the south + west bank ([120,-108],[150,-114],[138,-150]) and the Scribe at
  // [132,-120]. These four take the NORTH and EAST of the green fields, all well
  // inside radius 56 of center [138,-126].
  npcs: [
    {
      id: 'd-wh-river-tama',
      name: 'Tama',
      title: 'A girl filling a grain basket',
      pos: [160, -138],
      palette: { robe: 0xe0c060, trim: 0xa8852f, skin: 0xd9a066, hat: 0xcdbf7a },
      hatKind: 'cap',
      keystone: 'd-wh-river-ks-grain',   // tapping Tama opens the GRAIN keystone
    },
    {
      id: 'd-wh-river-eli',
      name: 'Eli',
      title: 'A young neighbor stacking mud bricks',
      pos: [114, -140],
      palette: { robe: 0xb98a5a, trim: 0x7a5a33, skin: 0x8a5a33, hat: 0xd4b06e },
      hatKind: 'none',
      keystone: 'd-wh-river-ks-home',    // tapping Eli opens the HOME keystone
    },
    {
      id: 'd-wh-river-rana',
      name: 'Old Rana',
      title: 'An elder who calls the neighbors to work',
      pos: [152, -100],
      palette: { robe: 0xa86fd0, trim: 0x6b3f9a, skin: 0xd9a066, hat: 0xb59a5e },
      hatKind: 'hood',
      keystone: 'd-wh-river-ks-build',   // tapping Rana opens the BUILD keystone
    },
    {
      // A supporting NPC with a branching dialogue tree that REMEMBERS the
      // player's choices (reads the story flags this pack sets). No keystone —
      // just warm, period-true talk that changes as the three words are given.
      id: 'd-wh-river-mahla',
      name: 'Mahla',
      title: 'A weaver who watches the town grow',
      pos: [128, -96],
      palette: { robe: 0x6fae9a, trim: 0x3f7a6a, skin: 0xd9a066, hat: 0x8fc2a8 },
      hatKind: 'brim',
      dialogue: {
        // start() branches on how far the player has come (memory of flags).
        start: (ctx) => {
          const is = ctx && ctx.is ? ctx.is : () => false;
          if (is('dWhRiverBuildGiven')) return 'allDone';
          if (is('dWhRiverGrainGiven') && is('dWhRiverHomeGiven')) return 'twoDone';
          if (is('dWhRiverGrainGiven') || is('dWhRiverHomeGiven')) return 'oneDone';
          return 'greet';
        },
        nodes: {
          greet: {
            text: 'Welcome to our riverbank. The water comes, the fields turn green, and we are many now. But green fields are only the start. Tama is up the path with a question about her basket, and young Eli is stacking bricks by the bend. Help them, and you will see how a true town begins.',
            choices: [
              { label: 'I will go and help them.', next: '@close' },
              { label: 'Why are there so many of you here?', next: 'why' },
            ],
          },
          why: {
            text: 'Because the river feeds us. Where there is steady food, families do not have to wander anymore — they stay, and more families come. Soon you are not one house but many, all leaning on the same river. That is when the real work begins: building, together.',
            choices: [
              { label: 'Then I will help with the words.', next: '@close' },
            ],
          },
          oneDone: {
            text: 'I saw a new lamp light just now — someone got a word right. Word travels fast on a small riverbank. Keep going: when the basket is full AND every family has a roof, come find Old Rana. She will not raise the great work until both are true.',
            choices: [
              { label: 'I am on my way.', next: '@close' },
              { label: 'What is the great work?', next: 'greatwork' },
            ],
          },
          greatwork: {
            text: 'A wall, a store-house, a path to the water — things one family could never make alone. Rana waits for all of us to be ready, then we lift them together. No one builds a town by themselves. You will understand when you stand with us.',
            choices: [
              { label: 'I will be ready.', next: '@close' },
            ],
          },
          twoDone: {
            text: 'Two lamps brighter, and the baskets are full and the roofs are up. The river kept its promise this year. Now go to Old Rana on the high path — it is time for the work no single family can do alone. Stand with the neighbors and give her the word.',
            choices: [
              { label: 'I will go to Rana now.', next: '@close' },
              { label: 'You sound proud.', next: 'proud' },
            ],
          },
          proud: {
            text: 'I am. I came here with nothing but my hands and a few words. Now I have neighbors, a roof, grain for the cold months, and a name people call out across the fields. The river gave us the food. We gave each other the town.',
            choices: [
              { label: 'Thank you, Mahla. I will help finish it.', next: '@close' },
            ],
          },
          allDone: {
            text: 'You did it — you gave Rana the last word, and the whole bank lifted the work as one. Look around. Full baskets, warm homes, and walls we raised together. The river grew the food, but WE built the town. That is the oldest story there is, and now it is yours too.',
            choices: [
              { label: 'It is a good story. Thank you.', next: '@close' },
            ],
          },
        },
      },
    },
  ],

  // ---- cutscenes: named playCutscene beat-sequences (ONE short line each) ----
  // Fires once, gated by the trigger's flag, when the player has heard the
  // shipped River Scribe story (so it deepens rather than races the base pack).
  cutscenes: {
    D_WH_RIVER_HARVEST: [
      {
        tint: 'amber', kicker: 'River Lands',
        text: 'The fields are golden now. Up the path, neighbors are filling baskets and stacking bricks.',
      },
      {
        tint: 'amber', art: 'portrait',
        palette: { robe: 0xe0c060, trim: 0xa8852f, skin: 0xd9a066, hat: 0xcdbf7a },
        kicker: 'Tama, by the full baskets',
        text: '"You helped the river give water. Will you help us keep the food and build our home?"',
        cta: 'Help the neighbors',
      },
    ],
  },

  // ---- triggers: when the cutscene fires (once) ----
  // on:'questDone' value 'st-river' → fires after the shipped River Scribe story
  // is heard, so this density layer arrives AFTER the base river chain. Gated by
  // its own play key + survives reloads (the loader records the flag).
  triggers: [
    { on: 'questDone', value: 'st-river', play: 'D_WH_RIVER_HARVEST' },
  ],

  // ---- keystones: THE CORE — three NEW gentle, picture-first word moments ----
  // Each: the player GIVES the word whose MEANING matches what the neighbor needs.
  // A not-quite choice is never a fail — its `reteach` is read aloud (picture
  // first), routing the player to the missing idea, then the SAME keystone loops
  // so they try again from understanding. The right word opens a warm `win`,
  // lights a lamp, lifts the town-light meter, and writes one true Codex idea.
  keystones: [
    // ---------- KEYSTONE 1: GRAIN (the storable food / surplus) ----------
    {
      id: 'd-wh-river-ks-grain',
      npcId: 'd-wh-river-tama',
      island: 'wh-river',
      flag: 'dWhRiverGrainGiven',
      pic: 'farm',
      prompt: {
        en: 'Tama cuts the golden tops from the rows and fills a deep basket. "This dries hard, so we can keep it in jars and eat all winter, even when nothing grows. What is this dried food called?" Which word do you give?',
        zh: 'Tama 从一排排作物上割下金黄的穗头，装满一只深篮子。"这个晒干后很硬，可以装进罐子里，整个冬天都能吃，连什么都不长的时候也有。这种晒干的食物叫什么？" 你给哪个词？',
        es: 'Tama corta las espigas doradas de las hileras y llena una cesta honda. "Esto se seca duro, así que lo guardamos en jarras y comemos todo el invierno, aun cuando nada crece. ¿Cómo se llama esta comida seca?" ¿Qué palabra le das?',
      },
      choices: [
        {
          word: 'grain', pic: 'farm', right: true,
          label: 'Here is GRAIN — the dried seeds of the crop, kept in jars to eat all year.',
        },
        {
          // Not-quite: the PLACE the food grew (the base pack's word), not the
          // dried food you store. Routes to: the farm makes it, but it is not it.
          word: 'farm', pic: 'farm', right: false,
          label: 'Here is FARM — the watered field where the rows of crops grow.',
          reteach: {
            en: 'The farm is the PLACE that grows the food — that part you already know. But Tama is holding the food ITSELF: the dried, hard seeds she puts in jars to eat in winter. What is that stored food called? Try again.',
            zh: '农田是长粮食的地方——这个你已经知道了。但 Tama 手里拿的是食物本身：晒干、变硬、装进罐子、冬天吃的种子。那种储存的食物叫什么？再试一次。',
            es: 'La granja es el LUGAR donde crece la comida: eso ya lo sabes. Pero Tama sostiene la comida MISMA: las semillas secas y duras que guarda en jarras para el invierno. ¿Cómo se llama esa comida guardada? Intenta otra vez.',
          },
        },
        {
          // Not-quite: wild food from BEFORE farming. Routes to: stored crop, not
          // a hunted animal you must eat fast.
          word: 'hunt', pic: 'hunt', right: false,
          label: 'Here is HUNT — chasing a wild animal far away to eat tonight.',
          reteach: {
            en: 'A hunted animal must be eaten fast — you cannot keep it for winter. Tama\'s food is the opposite: dry seeds that last for months in a jar. What do we call the dried crop you store and eat all year? Try again.',
            zh: '打来的猎物必须很快吃掉——留不到冬天。Tama 的食物正相反：干种子，装在罐子里能放好几个月。那种储存起来、整年都能吃的干作物叫什么？再试一次。',
            es: 'Un animal cazado hay que comerlo pronto: no se guarda para el invierno. La comida de Tama es lo contrario: semillas secas que duran meses en una jarra. ¿Cómo se llama el cultivo seco que guardas y comes todo el año? Intenta otra vez.',
          },
        },
      ],
      win: {
        pic: 'farm',
        en: 'Tama claps the dust off her hands. "GRAIN — yes!" She seals the jars and stacks them in the cool shade. Now the family will eat even in the cold months. A lamp lights over the full baskets.',
        zh: 'Tama 拍掉手上的灰。"谷物——对！"她把罐子封好，码放在阴凉处。现在就算到了寒冷的月份，家里也有吃的。盛满的篮子上方亮起一盏灯。',
        es: 'Tama se sacude el polvo de las manos. "¡GRANO, sí!" Sella las jarras y las apila a la sombra fresca. Ahora la familia comerá hasta en los meses fríos. Una lámpara se enciende sobre las cestas llenas.',
      },
      codex: {
        id: 'd_wh_river_grain',
        group: 'River Lands',
        title: 'Grain can be stored',
        idea: 'Grain is the dried seed of a crop, and because it keeps for many months in jars, river farmers could save extra food and eat through the seasons when nothing grows.',
        source: 'Tama, a girl of the river harvest',
      },
      achievement: 'd_wh_river_provider',
      light: 'You gave Tama the word GRAIN, and the full baskets glow warm.',
    },

    // ---------- KEYSTONE 2: HOME (one family's house) ----------
    {
      id: 'd-wh-river-ks-home',
      npcId: 'd-wh-river-eli',
      island: 'wh-river',
      flag: 'dWhRiverHomeGiven',
      pic: 'town',
      prompt: {
        en: 'Eli pats the last mud brick into a small square of four walls and one warm room. "Just for my family — a roof to sleep under and a door we close at night. What is this ONE house called?" Which word do you give?',
        zh: 'Eli 把最后一块泥砖拍进一座小方屋——四面墙、一间温暖的房间。"只给我家人住——一个能睡觉的屋顶，一扇晚上关上的门。这一座房子叫什么？" 你给哪个词？',
        es: 'Eli coloca el último ladrillo de barro en un cuadrado de cuatro paredes y una sola habitación cálida. "Solo para mi familia: un techo para dormir y una puerta que cerramos de noche. ¿Cómo se llama esta ÚNICA casa?" ¿Qué palabra le das?',
      },
      choices: [
        {
          word: 'home', pic: 'town', right: true,
          label: 'Here is HOME — one family\'s own house, with a roof and a door they close at night.',
        },
        {
          // Not-quite: the WHOLE settlement (base pack's word). Routes to: home is
          // ONE house; the city is all of them.
          word: 'city', pic: 'town', right: false,
          label: 'Here is CITY — all the houses and streets and people together.',
          reteach: {
            en: 'A city is ALL the houses together — that is the big picture. But Eli built only ONE: a single house for his own family. What is one family\'s own house called? Try again.',
            zh: '城市是所有房子合在一起——那是大的整体。但 Eli 只盖了一座：给自己家人的一间房子。一家人自己的房子叫什么？再试一次。',
            es: 'Una ciudad son TODAS las casas juntas: ese es el panorama grande. Pero Eli construyó solo UNA: una casa para su propia familia. ¿Cómo se llama la casa de una sola familia? Intenta otra vez.',
          },
        },
        {
          // Not-quite: a tall temple, a single grand building, not a family house.
          word: 'ziggurat', pic: 'ziggurat', right: false,
          label: 'Here is ZIGGURAT — a tall temple of mud-brick steps for the whole town.',
          reteach: {
            en: 'A ziggurat is a huge temple the whole town shares — not a place a family sleeps. Eli made a small, warm house just for the people he loves. What do we call that one family\'s house? Try again.',
            zh: '塔庙是整座城共用的大神庙——不是一家人睡觉的地方。Eli 盖的是一间小小的、温暖的房子，只给他爱的人。那一家人的房子叫什么？再试一次。',
            es: 'Un zigurat es un templo enorme que comparte todo el pueblo, no un lugar donde duerme una familia. Eli hizo una casa pequeña y cálida solo para los suyos. ¿Cómo se llama esa casa de una familia? Intenta otra vez.',
          },
        },
      ],
      win: {
        pic: 'town',
        en: 'Eli opens the little wooden door and grins. "HOME — yes!" His family steps inside, out of the wind, and a small fire warms the room. A lamp lights over the first house by the river.',
        zh: 'Eli 推开小小的木门，咧嘴笑了。"家——对！"他的家人走进屋里，躲开了风，一小堆火温暖着房间。河边第一座房子上方亮起一盏灯。',
        es: 'Eli abre la pequeña puerta de madera y sonríe. "¡HOGAR, sí!" Su familia entra, lejos del viento, y un fuego pequeño calienta la habitación. Una lámpara se enciende sobre la primera casa junto al río.',
      },
      codex: {
        id: 'd_wh_river_home',
        group: 'River Lands',
        title: 'A home shelters one family',
        idea: 'A home is the single house one family builds to live in, and these family homes are the first building blocks that many neighbors join together into a town.',
        source: 'Eli, a young builder of the river fields',
      },
      achievement: 'd_wh_river_provider',
      light: 'You gave Eli the word HOME, and the first house by the river is warm.',
    },

    // ---------- KEYSTONE 3: BUILD (many families build the town together) ----
    {
      id: 'd-wh-river-ks-build',
      npcId: 'd-wh-river-rana',
      island: 'wh-river',
      flag: 'dWhRiverBuildGiven',
      pic: 'ziggurat',
      prompt: {
        en: 'Old Rana gathers every family on the bank. "The baskets are full and each family has a home. Now we raise the wall and the store-house — work too big for one family alone. We do it side by side, with many hands. What is the word for making something together?" Which word do you give?',
        zh: 'Rana 奶奶把河边的每一家人都召集起来。"篮子满了，每家也都有了家。现在我们要立起城墙和粮仓——这活儿一家人干不来。我们要肩并肩，许多只手一起干。"一起做出某样东西"用哪个词？" 你给哪个词？',
        es: 'La anciana Rana reúne a cada familia de la orilla. "Las cestas están llenas y cada familia tiene un hogar. Ahora levantamos la muralla y el granero: un trabajo demasiado grande para una sola familia. Lo hacemos lado a lado, con muchas manos. ¿Cuál es la palabra para hacer algo juntos?" ¿Qué palabra le das?',
      },
      choices: [
        {
          word: 'build', pic: 'ziggurat', right: true,
          label: 'Here is BUILD — many families working together to make something with their hands.',
        },
        {
          // Not-quite: the THING they will make, not the act of making it
          // together. Routes act vs. object.
          word: 'home', pic: 'town', right: false,
          label: 'Here is HOME — the one house a family lives in.',
          reteach: {
            en: 'Yes — each family already has a home. But Rana is not asking for the THING; she is asking for the WORK: many hands raising a wall and a store-house together. What is the word for making something with many hands? Try again.',
            zh: '对——每家已经有了家。但 Rana 问的不是那个东西，而是那件事：许多只手一起立起城墙和粮仓。"用许多只手一起做出东西"用哪个词？再试一次。',
            es: 'Sí, cada familia ya tiene un hogar. Pero Rana no pregunta por la COSA; pregunta por el TRABAJO: muchas manos levantando juntas una muralla y un granero. ¿Cuál es la palabra para hacer algo con muchas manos? Intenta otra vez.',
          },
        },
        {
          // Not-quite: trade, a real river-lands idea, but it moves goods, it does
          // not raise a wall with neighbors.
          word: 'boat', pic: 'boat', right: false,
          label: 'Here is BOAT — it carries goods up and down the river.',
          reteach: {
            en: 'A boat carries things along the water — useful, but it does not raise a wall. Rana means the work the neighbors do with their own hands, all together, to make the town. What is that word? Try again.',
            zh: '船在水上运东西——很有用，但它立不起城墙。Rana 说的是邻居们用自己的双手、大家一起、把城建起来的那件事。那个词是什么？再试一次。',
            es: 'Un barco lleva cosas por el agua: útil, pero no levanta una muralla. Rana se refiere al trabajo que los vecinos hacen con sus propias manos, todos juntos, para hacer el pueblo. ¿Cuál es esa palabra? Intenta otra vez.',
          },
        },
      ],
      win: {
        pic: 'ziggurat',
        en: 'Old Rana lifts her arms and the whole bank answers. "BUILD — yes!" Family beside family, they pass bricks hand to hand, and the wall and the store-house rise. A lamp lights over the town they made TOGETHER.',
        zh: 'Rana 奶奶举起双臂，整个河岸都回应了。"建造——对！"一家挨着一家，他们手手相传地传砖，城墙和粮仓立了起来。在他们一起建成的城上空，亮起一盏灯。',
        es: 'La anciana Rana alza los brazos y toda la orilla responde. "¡CONSTRUIR, sí!" Familia junto a familia, se pasan los ladrillos de mano en mano, y la muralla y el granero se alzan. Una lámpara se enciende sobre el pueblo que hicieron JUNTOS.',
      },
      codex: {
        id: 'd_wh_river_build',
        group: 'River Lands',
        title: 'A town is built together',
        idea: 'To build means many families working side by side, and the first river towns were built together because a wall, a store-house, or a path to the water was far too big for any one family to make alone.',
        source: 'Old Rana, an elder of the river bank',
      },
      achievement: 'd_wh_river_townmaker',
      light: 'You gave Old Rana the word BUILD, and the town that the neighbors raised together glows.',
    },
  ],

  // ---- codex: every real idea this pack can teach (mirrors the inlined ones) --
  codex: [
    {
      id: 'd_wh_river_grain',
      group: 'River Lands',
      title: 'Grain can be stored',
      idea: 'Grain is the dried seed of a crop, and because it keeps for many months in jars, river farmers could save extra food and eat through the seasons when nothing grows.',
      source: 'Tama, a girl of the river harvest',
    },
    {
      id: 'd_wh_river_home',
      group: 'River Lands',
      title: 'A home shelters one family',
      idea: 'A home is the single house one family builds to live in, and these family homes are the first building blocks that many neighbors join together into a town.',
      source: 'Eli, a young builder of the river fields',
    },
    {
      id: 'd_wh_river_build',
      group: 'River Lands',
      title: 'A town is built together',
      idea: 'To build means many families working side by side, and the first river towns were built together because a wall, a store-house, or a path to the water was far too big for any one family to make alone.',
      source: 'Old Rana, an elder of the river bank',
    },
  ],

  // ---- achievements: two sparse, meaningful milestones ----
  achievements: [
    {
      id: 'd_wh_river_provider',
      title: 'Enough for the cold months',
      desc: 'You helped store the grain and raise a home, so the river families would not go hungry or cold.',
    },
    {
      id: 'd_wh_river_townmaker',
      title: 'We built it together',
      desc: 'You gave the word BUILD, and many families raised the first river town side by side.',
    },
  ],
};

export default pack;
