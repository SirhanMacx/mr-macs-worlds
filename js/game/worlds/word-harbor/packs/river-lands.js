// river-lands.js — a gentle, picture-first Word Harbor story-pack for RIVER LANDS.
//
// Read CONTRACT.md first, then geography-isle.sample.js (the gold standard). This
// pack copies that shape exactly: real neighbors added to an existing island
// (wh-river, "River Lands"), a one-time warm cutscene, a trigger that fires it,
// and — the heart — THREE picture-first word-keystones whose CHOICES are full
// in-character offers of a word (never A/B/C stems), whose NOT-QUITE path
// re-teaches kindly and loops (never a red X, never a score, no fail state), and
// whose RIGHT path visibly changes the world: a lamp lights, the town-light
// meter rises, and a Codex entry is written.
//
// Curriculum: Global 9 ENL, River Lands (first river-valley civilizations). The
// quiet, true idea — kept simple for a newcomer reader: PEOPLE BUILT THE FIRST
// TOWNS WHERE RIVERS WATERED THE LAND. The river gives WATER; the watered land
// becomes a FARM; the flood leaves rich soil so the farm grows enough food for
// many people; and where the food is, a CITY grows. Each keystone gives the
// neighbor the ONE word whose picture matches what they need.
//
// De-identified: Sela, Old Nima and the harvest helpers are invented townsfolk;
// no real names. The only real person ever nameable is "Mr. Maccarello", unused
// here. Honest pedagogy: the geography is real (river → water → farm → city); no
// invented verbatim quotes from any real figure. Picture-first so an emerging
// reader succeeds without decoding text; bilingual zh + es throughout; gentle —
// a not-quite choice gets a kind retry and the keystone loops, never a fail.
//
// Pictures used are REAL pics.js scene kinds (river, farm, town, ziggurat, world,
// boat, gem). There is no separate "water"/"city"/"flood" scene, so: water → the
// 'river' scene, city → the 'town' scene, flood/rich-soil → the 'farm' scene.
//
// IDs are all namespaced 'wh-river-*' so they never collide with the shipped
// content (which already has st-river, the River Scribe at [132,-120], etc.).

export const pack = {
  // ---- identity ----
  id: 'wh-river-first-towns',
  unit: 'River Lands',
  title: 'Where the River Made a Town',

  // ---- npcs: extra characters placed at an existing island ----
  // River Lands is centered at [138,-126], radius 56 (see worlds/word-harbor.js
  // ISLES). The shipped River Scribe sits at [132,-120]; place these neighbors
  // well clear of that, along the green riverbank on the isle's south + west.
  npcs: [
    {
      id: 'wh-river-sela',
      name: 'Sela',
      title: 'A child with an empty water jar',
      pos: [120, -108],
      palette: { robe: 0x6fae6a, trim: 0x3f7a4a, skin: 0xd9a066, hat: 0x8fc27a },
      hatKind: 'none',
      keystone: 'wh-river-ks-water',   // tapping Sela opens the WATER keystone
    },
    {
      id: 'wh-river-nima',
      name: 'Old Nima',
      title: 'A grandmother by the green fields',
      pos: [150, -114],
      palette: { robe: 0xc9a25e, trim: 0x8a6a3a, skin: 0xd9a066, hat: 0xb59a5e },
      hatKind: 'brim',
      keystone: 'wh-river-ks-farm',    // tapping Nima opens the FARM keystone
    },
    {
      id: 'wh-river-davi',
      name: 'Davi',
      title: 'A builder counting the harvest',
      pos: [138, -150],
      palette: { robe: 0xc2a36b, trim: 0x8a6a3a, skin: 0x8a5a33, hat: 0xd4b06e },
      hatKind: 'cap',
      keystone: 'wh-river-ks-town',    // tapping Davi opens the TOWN keystone
    },
  ],

  // ---- cutscenes: named playCutscene beat-sequences (ONE short line each) ----
  cutscenes: {
    RIVER_LANDS_WELCOME: [
      {
        tint: 'amber', kicker: 'River Lands',
        text: 'Green fields run beside a wide, slow river. A child waves to you with an empty jar.',
      },
      {
        tint: 'amber', art: 'portrait',
        palette: { robe: 0x6fae6a, trim: 0x3f7a4a, skin: 0xd9a066, hat: 0x8fc27a },
        kicker: 'Sela, by the riverbank',
        text: '"You found words for the harbor. Will you help us by the river too?"',
        cta: 'Follow Sela',
      },
    ],
  },

  // ---- triggers: when each cutscene fires (once) ----
  triggers: [
    { on: 'visit', value: 'wh-river', play: 'RIVER_LANDS_WELCOME' },
  ],

  // ---- keystones: THE CORE — three gentle, picture-first word moments ----
  // Each: the player GIVES the word whose PICTURE matches what the neighbor needs.
  // A not-quite choice is never a fail — its `reteach` is read aloud (picture
  // first), then the same keystone loops so the player tries again from
  // understanding. The right word opens a warm `win`, lights a lamp, lifts the
  // town-light meter, and writes the real idea to the Field Journal Codex.
  keystones: [
    // ---------- KEYSTONE 1: WATER ----------
    {
      id: 'wh-river-ks-water',
      npcId: 'wh-river-sela',
      island: 'wh-river',
      flag: 'whRiverWaterGiven',
      pic: 'river',
      prompt: {
        en: 'Sela holds an empty jar and looks at the river. "My family is thirsty, and the seeds will not grow dry. What do I bring back from the river?" Which word do you give?',
        zh: 'Sela 拿着空罐子，望着河。"家里口渴，种子干了不会发芽。我从河里带回来什么？" 你给哪个词？',
        es: 'Sela sostiene un jarro vacío y mira el río. "Mi familia tiene sed, y las semillas no crecen secas. ¿Qué traigo del río?" ¿Qué palabra le das?',
      },
      choices: [
        {
          word: 'water', pic: 'river', right: true,
          label: 'Here is WATER — the river gives it, and people and seeds both drink.',
        },
        {
          // Not-quite: a pretty thing from the river, but not what keeps life.
          word: 'gem', pic: 'gem', right: false,
          label: 'Here is GEM — a shiny stone you might find by the river.',
          reteach: {
            en: 'A gem is pretty, but you cannot drink it and a seed cannot drink it. Look at the river. What does Sela carry home to drink and to grow food? Try again.',
            zh: '宝石很漂亮，但不能喝，种子也不能喝。看看那条河。Sela 带回家来喝、来种庄稼的是什么？再试一次。',
            es: 'Una gema es bonita, pero no se puede beber y una semilla no la bebe. Mira el río. ¿Qué lleva Sela a casa para beber y para cultivar? Intenta otra vez.',
          },
        },
        {
          // Not-quite: a real river thing, but it carries you, it is not the drink.
          word: 'boat', pic: 'boat', right: false,
          label: 'Here is BOAT — it floats on the river and carries people.',
          reteach: {
            en: 'A boat floats ON the river, but a thirsty family and a dry seed cannot drink a boat. What does the river GIVE that keeps people and plants alive? Try again.',
            zh: '船浮在河上，但口渴的家人和干种子不能喝船。河给的、能让人和庄稼活下去的是什么？再试一次。',
            es: 'Un barco flota EN el río, pero una familia con sed y una semilla seca no beben un barco. ¿Qué DA el río que mantiene vivos a las personas y las plantas? Intenta otra vez.',
          },
        },
      ],
      win: {
        pic: 'river',
        en: 'Sela fills the jar and laughs. "WATER — yes!" She waters the little seeds and pours a cup for her family. A lamp lights by the river, soft and warm.',
        zh: 'Sela 把罐子装满，笑了。"水——对！"她浇了小种子，又给家人倒了一杯。河边亮起一盏灯，温柔又温暖。',
        es: 'Sela llena el jarro y ríe. "¡AGUA, sí!" Riega las semillas pequeñas y sirve un vaso a su familia. Una lámpara se enciende junto al río, suave y cálida.',
      },
      codex: {
        id: 'wh_river_water',
        group: 'River Lands',
        title: 'The river gives water',
        idea: 'A river gives fresh water, and water keeps both people and plants alive — that is why the first families settled close beside the rivers.',
        source: 'Sela, a child of the river fields',
      },
      achievement: 'wh_river_helped',
      light: 'You gave Sela the word WATER, and the riverbank is brighter.',
    },

    // ---------- KEYSTONE 2: FARM ----------
    {
      id: 'wh-river-ks-farm',
      npcId: 'wh-river-nima',
      island: 'wh-river',
      flag: 'whRiverFarmGiven',
      pic: 'farm',
      prompt: {
        en: 'Old Nima stands where the river left rich, dark soil after the flood. "Now the land is wet and rich. Here we plant rows of seeds and grow our food. What do we call this place?" Which word do you give?',
        zh: 'Nima 奶奶站在河水退去、留下肥沃黑土的地方。"现在土地又湿又肥。我们在这里种下一排排种子，长出粮食。这地方叫什么？" 你给哪个词？',
        es: 'La abuela Nima está donde el río dejó tierra rica y oscura tras la crecida. "Ahora la tierra está húmeda y rica. Aquí plantamos hileras de semillas y cultivamos comida. ¿Cómo se llama este lugar?" ¿Qué palabra le das?',
      },
      choices: [
        {
          word: 'farm', pic: 'farm', right: true,
          label: 'Here is FARM — the watered land where people plant seeds and grow food.',
        },
        {
          // Not-quite: where the food came from BEFORE farming. Part of the story,
          // but not the watered, planted land Nima is standing on.
          word: 'hunt', pic: 'hunt', right: false,
          label: 'Here is HUNT — chasing wild animals far from the river to find food.',
          reteach: {
            en: 'Long ago people did hunt for food. But Nima is not chasing animals — she is planting seeds in the wet, rich soil the river left. What do we call land where you plant and grow food? Try again.',
            zh: '很久以前人们靠打猎找食物。但 Nima 不是在追动物——她是在河水留下的湿润肥土里种下种子。种庄稼、长粮食的土地叫什么？再试一次。',
            es: 'Hace mucho la gente cazaba para comer. Pero Nima no persigue animales: planta semillas en la tierra húmeda y rica que dejó el río. ¿Cómo se llama la tierra donde plantas y cultivas comida? Intenta otra vez.',
          },
        },
        {
          // Not-quite: the WATER itself (the keystone-1 word). It feeds the farm,
          // but it is not the planted land. Narrows river → the land it waters.
          word: 'water', pic: 'river', right: false,
          label: 'Here is WATER — the wet that the river brings to the land.',
          reteach: {
            en: 'Yes, the water makes the soil rich — that is the gift. But Nima is asking for the PLACE: the land she plants, with its rows of seeds and grain. What is that land called? Try again.',
            zh: '对，水让土壤变肥沃——那是礼物。但 Nima 问的是那个地方：她种下种子、长出谷物的土地。那片土地叫什么？再试一次。',
            es: 'Sí, el agua hace rica la tierra: ese es el regalo. Pero Nima pregunta por el LUGAR: la tierra que planta, con sus hileras de semillas y grano. ¿Cómo se llama esa tierra? Intenta otra vez.',
          },
        },
      ],
      win: {
        pic: 'farm',
        en: 'Old Nima smiles wide. "FARM — yes!" The flood left the soil rich, and her rows of grain stand tall and golden. A lamp lights over the green fields.',
        zh: 'Nima 奶奶笑得很开心。"农田——对！"洪水退后土壤肥沃，她的一排排谷物又高又金黄。绿色的田野上亮起一盏灯。',
        es: 'La abuela Nima sonríe amplia. "¡GRANJA, sí!" La crecida dejó la tierra rica, y sus hileras de grano se alzan altas y doradas. Una lámpara se enciende sobre los campos verdes.',
      },
      codex: {
        id: 'wh_river_farm',
        group: 'River Lands',
        title: 'The flood makes the farm',
        idea: 'When a river floods it leaves rich, fertile soil behind, so the watered land becomes a farm that can grow far more food than people could ever hunt or gather.',
        source: 'Old Nima, a grandmother of the river fields',
      },
      achievement: 'wh_river_helped',
      light: 'You gave Old Nima the word FARM, and the green fields are brighter.',
    },

    // ---------- KEYSTONE 3: TOWN/CITY ----------
    {
      id: 'wh-river-ks-town',
      npcId: 'wh-river-davi',
      island: 'wh-river',
      flag: 'whRiverTownGiven',
      pic: 'town',
      prompt: {
        en: 'Davi counts baskets of extra grain. "The farm grew more food than one family needs. Now many people come to live close together where the food is. What grows here, with houses and streets?" Which word do you give?',
        zh: 'Davi 在数一筐筐多出来的谷物。"农田长的粮食比一家人吃的还多。现在很多人都来到有粮食的地方一起住。这里长出了什么——有房子、有街道？" 你给哪个词？',
        es: 'Davi cuenta cestas de grano sobrante. "La granja produjo más comida de la que una familia necesita. Ahora muchas personas vienen a vivir juntas donde está la comida. ¿Qué crece aquí, con casas y calles?" ¿Qué palabra le das?',
      },
      choices: [
        {
          word: 'city', pic: 'town', right: true,
          label: 'Here is CITY — many homes and streets, full of people who live close together.',
        },
        {
          // Not-quite: the land that FEEDS the city, not the place where people live.
          word: 'farm', pic: 'farm', right: false,
          label: 'Here is FARM — the fields of grain beside the river.',
          reteach: {
            en: 'The farm grows the food — that is why people can gather here. But Davi means the busy PLACE the people build: many houses and streets together. What is that called? Try again.',
            zh: '农田长出粮食——所以人们才能聚到这里。但 Davi 说的是人们建起来的热闹地方：许多房子和街道连在一起。那叫什么？再试一次。',
            es: 'La granja produce la comida: por eso la gente puede reunirse aquí. Pero Davi se refiere al LUGAR concurrido que construyen: muchas casas y calles juntas. ¿Cómo se llama? Intenta otra vez.',
          },
        },
        {
          // Not-quite: one tall building people raised, not the whole settlement.
          word: 'ziggurat', pic: 'ziggurat', right: false,
          label: 'Here is ZIGGURAT — one tall temple of mud-brick steps.',
          reteach: {
            en: 'A ziggurat is just ONE big building inside the place. Davi means the WHOLE place — all the homes and streets and people together. What word names that whole settlement? Try again.',
            zh: '塔庙只是这个地方里的一座大建筑。Davi 说的是整个地方——所有的房子、街道和人合在一起。哪个词指整个聚居地？再试一次。',
            es: 'Un zigurat es solo UN gran edificio dentro del lugar. Davi se refiere a TODO el lugar: todas las casas, calles y personas juntas. ¿Qué palabra nombra ese asentamiento entero? Intenta otra vez.',
          },
        },
      ],
      win: {
        pic: 'town',
        en: 'Davi sets down the baskets and grins. "CITY — yes!" Where the river fed the farm, houses and streets rise and neighbors call out to one another. A lamp lights over the first city.',
        zh: 'Davi 放下篮子，咧嘴笑了。"城市——对！"在河水滋养农田的地方，房子和街道立起来，邻居互相打着招呼。第一座城市上空亮起一盏灯。',
        es: 'Davi deja las cestas y sonríe. "¡CIUDAD, sí!" Donde el río alimentó la granja, se alzan casas y calles y los vecinos se saludan. Una lámpara se enciende sobre la primera ciudad.',
      },
      codex: {
        id: 'wh_river_city',
        group: 'River Lands',
        title: 'Where the food is, a city grows',
        idea: 'Because river-watered farms grew extra food, many people could live close together in one place — and that is how the first cities grew up beside the rivers.',
        source: 'Davi, a builder of the river fields',
      },
      achievement: 'wh_river_helped',
      light: 'You gave Davi the word CITY, and the first city by the river is brighter.',
    },
  ],

  // ---- codex: every real idea this pack can teach (mirrors the inlined ones) ----
  codex: [
    {
      id: 'wh_river_water',
      group: 'River Lands',
      title: 'The river gives water',
      idea: 'A river gives fresh water, and water keeps both people and plants alive — that is why the first families settled close beside the rivers.',
      source: 'Sela, a child of the river fields',
    },
    {
      id: 'wh_river_farm',
      group: 'River Lands',
      title: 'The flood makes the farm',
      idea: 'When a river floods it leaves rich, fertile soil behind, so the watered land becomes a farm that can grow far more food than people could ever hunt or gather.',
      source: 'Old Nima, a grandmother of the river fields',
    },
    {
      id: 'wh_river_city',
      group: 'River Lands',
      title: 'Where the food is, a city grows',
      idea: 'Because river-watered farms grew extra food, many people could live close together in one place — and that is how the first cities grew up beside the rivers.',
      source: 'Davi, a builder of the river fields',
    },
  ],

  // ---- achievements: one sparse, meaningful milestone ----
  achievements: [
    {
      id: 'wh_river_helped',
      title: 'A town by the water',
      desc: 'You traced the river to its town: water, then farm, then city.',
    },
  ],
};

export default pack;
