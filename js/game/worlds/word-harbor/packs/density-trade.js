// density-trade.js — a DENSITY story-pack for Word Harbor's TRADE DOCKS.
//
// World: Word Harbor (Global 9 ENL — gentle, picture-first, bilingual zh+es,
// NO fail states). Island: Caravan Coast (id `wh-caravan`, centered at [208,8],
// radius 52 — see content.js ISLANDS + worlds/word-harbor.js ISLES). The warm
// trading-dunes-and-docks isle where caravans and ships traded the world.
//
// WHY THIS PACK EXISTS (content density, not a rebuild):
//   The island already has one trade pack (`wh-trade-docks`, neighbor "Sumi"),
//   which teaches TRADE (two-way swap), COIN (money), and ROAD (the path that
//   joins far places). This SECOND, denser pack ADDS four NEW trading words the
//   first pack does NOT teach — so it never duplicates an idea:
//     1) MARKET — the busy PLACE where many neighbors meet to buy and sell
//        (the first pack only ever used "market" as a WRONG choice; it never
//        TEACHES it). The place, not the road, not one stall.
//     2) SHIP  — a big boat that carries many goods across the SEA, so far
//        lands across the water can trade too (camels cross land; ships cross
//        water).
//     3) FAR   — distance: some goods come from very FAR away, others from
//        NEAR. Trade reaches across long distance.
//     4) NEED  — the quiet heart: people trade for what they NEED (must have),
//        which is not the same as what they only WANT.
//   Together they carry the quiet idea: people trade what they HAVE for what
//   they NEED, with neighbors NEAR and lands FAR — by road and by ship.
//
// CRAFT BAR (identical to geography-isle.sample.js + trade-docks.js):
//   - Choices are FULL in-character offers of a word (natural sentences a
//     person would say), NEVER A/B/C stems, "Question N", scores, or red X.
//   - A WRONG choice never fails: the neighbor re-teaches gently, picture-first,
//     and the SAME keystone LOOPS so the player tries again from understanding.
//   - The RIGHT choice opens a warm `win`, lights a lamp (the town-light meter
//     rises), writes a true one-sentence Codex idea, and may unlock a milestone.
//   - Supporting NPCs branch on STORY FLAGS (memory of the player's choices)
//     set by the keystones — so the docks remember what you have helped with.
//
// DE-IDENTIFIED + HONEST: Daru, Lina and old Hadi are invented townsfolk; no
// real students, colleagues, or real people are named (the teacher is only ever
// "Mr. Maccarello" if named, and is not named here). The economic-geography
// ideas are real; every teaching voice is an invented neighbor; no real figure
// is quoted. Gentle: no fail states, no timers, no scores.
//
// ID DISCIPLINE: every id is namespaced `d-wh-trade-` (hyphen ids) or
// `d_wh_trade_` (codex/achievement ids) so it can NEVER collide with the shipped
// world, the first trade pack, or any sibling density pack.

export const pack = {
  // ---- identity ----
  id: 'd-wh-trade-density',
  unit: 'Caravan Coast',                       // curriculum unit / island label
  title: 'Four More Trading Words: Market, Ship, Far and Need',

  // ---- npcs: three dock neighbors on Caravan Coast ----
  // Caravan Coast center [208,8], radius 52. Occupied points to dodge:
  //   Caravan Keeper (shipped story) at [202,14]; Sumi (first trade pack) at
  //   [196,-22]. All three below sit well inside the radius and clear of those.
  npcs: [
    {
      id: 'd-wh-trade-daru',
      name: 'Daru',
      title: 'A dock-runner',
      pos: [224, -6],                          // east dock, ~21 from Keeper, ~32 from Sumi
      palette: { robe: 0xc97a4e, trim: 0x8a4f2c, skin: 0xb97f4e, hat: 0xe0b54e },
      hatKind: 'cap',
      keystone: 'd-wh-trade-ks-market',        // tapping Daru opens the MARKET keystone
    },
    {
      id: 'd-wh-trade-lina',
      name: 'Lina',
      title: 'A ship-watcher at the quay',
      pos: [236, 22],                          // northeast quay, ~36 from Daru
      palette: { robe: 0x4d8f9a, trim: 0x2f5a63, skin: 0xd9a066, hat: 0x7aa6c6 },
      hatKind: 'brim',
      keystone: 'd-wh-trade-ks-ship',          // tapping Lina opens the SHIP keystone
    },
    {
      id: 'd-wh-trade-hadi',
      name: 'Hadi',
      title: 'An old caravan elder',
      pos: [180, 30],                          // northwest path, ~31 from Keeper
      palette: { robe: 0x8a6a44, trim: 0x5d472e, skin: 0x8a5a33, hat: 0xd8b27a },
      hatKind: 'turban',
      // Hadi has a plain branching dialogue (no keystone of his own). He is the
      // memory-keeper: his lines change as you help Daru and Lina, and he hands
      // off the two ideas the docks complete — FAR and NEED — by pointing you
      // back to Daru and Lina once they trust you.
      dialogue: {
        root: 'd-wh-trade-hadi-root',
        nodes: {
          'd-wh-trade-hadi-root': {
            pic: 'camel',
            text: {
              en: 'Old Hadi rests in the shade of a loaded cart. "I have walked the long roads sixty years. Sit. What have you learned on our docks?"',
              zh: '老哈迪在装满货物的车的阴影里休息。"我走长路走了六十年。坐下吧。你在我们码头上学到了什么？"',
              es: 'El viejo Hadi descansa a la sombra de un carro cargado. "He recorrido los largos caminos sesenta años. Siéntate. ¿Qué has aprendido en nuestros muelles?"',
            },
            choices: [
              { label: { en: 'Ask Hadi where his goods come from.', zh: '问哈迪他的货物从哪里来。', es: 'Pregúntale a Hadi de dónde vienen sus bienes.' }, to: 'd-wh-trade-hadi-far' },
              { label: { en: 'Ask Hadi why people trade at all.', zh: '问哈迪人们为什么要交易。', es: 'Pregúntale a Hadi por qué la gente comercia.' }, to: 'd-wh-trade-hadi-need' },
              { label: { en: 'Say goodbye for now.', zh: '先说再见。', es: 'Despedirse por ahora.' }, to: null },
            ],
          },
          // FAR branch — remembers whether you have helped Daru (the market).
          'd-wh-trade-hadi-far': {
            pic: 'road',
            text: {
              en: 'Hadi points at the dunes, then far past them. "My salt is from near. My silk walked many, many days — from very FAR. Both meet at one place. Daru can show you that place."',
              zh: '哈迪指向沙丘，又指向更远的地方。"我的盐来自近处。我的丝绸走了很多很多天——来自很 FAR（远）的地方。它们都在同一个地方相遇。达鲁可以带你看那个地方。"',
              es: 'Hadi señala las dunas, y luego mucho más allá. "Mi sal viene de cerca. Mi seda caminó muchos, muchos días, desde muy LEJOS. Ambas se encuentran en un solo lugar. Daru puede mostrarte ese lugar."',
            },
            // Memory: branch on the MARKET flag set by Daru's keystone.
            choices: [
              { label: { en: 'Continue.', zh: '继续。', es: 'Continuar.' }, to: 'd-wh-trade-hadi-far-end' },
            ],
          },
          'd-wh-trade-hadi-far-end': {
            pic: 'world',
            requireFlag: 'dWhTradeHelpedMarket',
            // Shown only if the player has already learned MARKET from Daru.
            text: {
              en: 'He smiles. "You already helped Daru name the MARKET. Good. Near goods and FAR goods meet there. Go give Daru the word for that long distance."',
              zh: '他笑了。"你已经帮达鲁说出了 MARKET（市场）。很好。近的货物和 FAR（远）的货物都在那里相遇。去把表示那段长距离的词给达鲁吧。"',
              es: 'Sonríe. "Ya ayudaste a Daru a nombrar el MERCADO. Bien. Los bienes cercanos y los LEJANOS se encuentran allí. Ve a darle a Daru la palabra para esa larga distancia."',
            },
            fallback: {
              // If MARKET not yet learned, gently send them to Daru first.
              en: 'He nods slowly. "First learn the PLACE where goods meet — Daru, by the east dock, is waiting to show you. Then come back and we will talk of FAR."',
              zh: '他慢慢点头。"先去学货物相遇的那个 PLACE（地方）——东码头边的达鲁正等着带你看。然后回来，我们再谈 FAR（远）。"',
              es: 'Asiente despacio. "Primero aprende el LUGAR donde se encuentran los bienes: Daru, junto al muelle este, espera para mostrártelo. Luego vuelve y hablaremos de LEJOS."',
            },
            choices: [
              { label: { en: 'Thank Hadi.', zh: '谢谢哈迪。', es: 'Agradecer a Hadi.' }, to: null },
            ],
          },
          // NEED branch — remembers whether you have helped Lina (the ship).
          'd-wh-trade-hadi-need': {
            pic: 'gem',
            text: {
              en: 'Hadi taps the cart. "We do not carry silk because it is pretty. We carry food, cloth, salt — things people must have. People trade most for what they NEED."',
              zh: '哈迪敲了敲车。"我们运丝绸不是因为它漂亮。我们运食物、布、盐——人们必须要有的东西。人们交易最多的，是他们 NEED（需要）的东西。"',
              es: 'Hadi golpea el carro. "No llevamos seda porque sea bonita. Llevamos comida, tela, sal: cosas que la gente debe tener. La gente comercia más por lo que NECESITA."',
            },
            choices: [
              { label: { en: 'Continue.', zh: '继续。', es: 'Continuar.' }, to: 'd-wh-trade-hadi-need-end' },
            ],
          },
          'd-wh-trade-hadi-need-end': {
            pic: 'farm',
            requireFlag: 'dWhTradeHelpedShip',
            text: {
              en: 'He looks at the sea. "You helped Lina name the SHIP that crosses the water. Ships are how far lands send what people NEED. Lina has one last word for you — go and listen."',
              zh: '他望向大海。"你帮莉娜说出了横渡海水的 SHIP（船）。船就是远方的土地送来人们 NEED（需要）之物的方式。莉娜还有最后一个词要给你——去听听吧。"',
              es: 'Mira el mar. "Ayudaste a Lina a nombrar el BARCO que cruza el agua. Los barcos son cómo las tierras lejanas envían lo que la gente NECESITA. Lina tiene una última palabra para ti: ve y escucha."',
            },
            fallback: {
              en: 'He gestures to the quay. "First meet Lina, the ship-watcher, at the northeast quay. Learn the boat that crosses the water. Then the word NEED will make more sense."',
              zh: '他指向码头。"先去东北码头见船的守望者莉娜。学一学那艘横渡海水的船。然后 NEED（需要）这个词就更好懂了。"',
              es: 'Señala el muelle. "Primero conoce a Lina, la vigía de barcos, en el muelle noreste. Aprende el barco que cruza el agua. Entonces la palabra NECESITAR tendrá más sentido."',
            },
            choices: [
              { label: { en: 'Thank Hadi.', zh: '谢谢哈迪。', es: 'Agradecer a Hadi.' }, to: null },
            ],
          },
        },
      },
    },
  ],

  // ---- cutscenes: one warm arrival beat-set (one short line per beat) ----
  cutscenes: {
    D_WH_TRADE_DOCKS_WAKE: [
      {
        tint: 'amber', kicker: 'Caravan Coast',
        text: 'The docks are busy today — a runner darts between carts, and a watcher counts sails far out at sea.',
      },
      {
        tint: 'amber', art: 'portrait',
        palette: { robe: 0xc97a4e, trim: 0x8a4f2c, skin: 0xb97f4e, hat: 0xe0b54e },
        kicker: 'Daru, the dock-runner',
        text: 'A young runner waves. "Word-keeper! We trade all day here, but we are missing the names for HOW and WHERE."',
        cta: 'Help on the docks',
      },
    ],
  },

  // ---- triggers: fire the arrival once, gated by a story flag ----
  triggers: [
    { on: 'visit', value: 'wh-caravan', play: 'D_WH_TRADE_DOCKS_WAKE' },
  ],

  // ---- keystones: THE CORE — four gentle, picture-first understanding beats ----
  keystones: [
    // ===== KEYSTONE 1 — MARKET (the PLACE neighbors meet to buy and sell) =====
    {
      id: 'd-wh-trade-ks-market',
      npcId: 'd-wh-trade-daru',
      island: 'wh-caravan',
      flag: 'dWhTradeHelpedMarket',
      pic: 'town',
      prompt: {
        en: 'Daru spins in the crowd. "Look — many people, many stalls, all in ONE busy place to buy and sell. Not the road that brings goods, not one stall — the whole place. What is that ONE word?" Which word do you give?',
        zh: 'Daru 在人群里转了一圈。"你看——很多人，很多摊位，都在 ONE（一个）热闹的地方买和卖。不是带来货物的路，也不是一个摊位——是整个地方。那一个词是什么？"你给哪个词？',
        es: 'Daru gira entre la multitud. "Mira: mucha gente, muchos puestos, todos en UN solo lugar concurrido para comprar y vender. No el camino que trae los bienes, ni un solo puesto: todo el lugar. ¿Cuál es esa palabra?" ¿Qué palabra le das?',
      },
      choices: [
        {
          word: 'market', pic: 'town', right: true,
          label: 'Here is MARKET — the busy place where many people meet to buy and sell.',
        },
        {
          // Plausible-but-wrong: the path that BRINGS goods, not the place they
          // are sold. (ROAD is taught by the first pack; here it is a foil.)
          word: 'road', pic: 'road', right: false,
          label: 'Here is ROAD — the long worn path that goods travel along to get here.',
          reteach: {
            en: 'A road is the path goods TRAVEL ON to arrive. But Daru means the busy PLACE where they are finally bought and sold — many people, many stalls, all in one spot. Look at the crowd, not the path.',
            zh: 'road 是货物走来的那条路。但 Daru 说的是它们最终被买卖的那个热闹的 PLACE（地方）——很多人、很多摊位，全在一处。看看人群，不是那条路。',
            es: 'Un camino es la ruta por la que VIAJAN los bienes para llegar. Pero Daru habla del LUGAR concurrido donde por fin se compran y venden: mucha gente, muchos puestos, todo en un sitio. Mira la multitud, no el camino.',
          },
        },
        {
          // Plausible-but-wrong: ONE seller's table, not the whole place.
          word: 'stall', pic: 'farm', right: false,
          label: 'Here is STALL — one small table where a single seller lays out goods.',
          reteach: {
            en: 'A stall is just ONE seller\'s little table. But Daru spread his arms at the WHOLE busy place — all the stalls and people together. The whole place has its own word. Look wider.',
            zh: 'stall 只是一个卖家的小桌子。但 Daru 张开双臂指的是整个热闹的地方——所有摊位和人合在一起。整个地方有它自己的词。看远一点。',
            es: 'Un puesto es solo la mesita de UN vendedor. Pero Daru abrió los brazos hacia TODO el lugar concurrido: todos los puestos y la gente juntos. Todo el lugar tiene su propia palabra. Mira más amplio.',
          },
        },
      ],
      win: {
        pic: 'town',
        en: 'Daru beams. "MARKET — yes!" He runs through the stalls, naming each. "This whole busy place — that is where the harbor trades." A lamp lights over the market square.',
        zh: 'Daru 笑得灿烂。"market——对！"他穿过摊位，一个个喊出名字。"这整个热闹的地方——就是港口做买卖的地方。"市场广场上方亮起一盏灯。',
        es: 'Daru resplandece. "¡MERCADO, sí!" Corre entre los puestos nombrando cada uno. "Todo este lugar concurrido: aquí es donde el puerto comercia." Una lámpara se enciende sobre la plaza del mercado.',
      },
      codex: {
        id: 'd_wh_trade_market',
        group: 'Caravan Coast',
        title: 'What a market is',
        idea: 'A market is the busy place where many buyers and sellers gather, so people can trade many different goods together in one spot instead of searching one seller at a time.',
        source: 'Daru, a dock-runner of the harbor',
      },
      achievement: 'd_wh_trade_market_named',
      light: 'You gave Daru the word MARKET, and the market square is brighter.',
    },

    // ===== KEYSTONE 2 — FAR (distance: goods come from far away) =====
    // Owned by Daru too; opens after MARKET (the dialogue + Hadi point here).
    {
      id: 'd-wh-trade-ks-far',
      npcId: 'd-wh-trade-daru',
      island: 'wh-caravan',
      flag: 'dWhTradeHelpedFar',
      pic: 'road',
      prompt: {
        en: 'Daru holds two baskets. "This salt is from the hills nearby. This silk walked many, many days to reach us — from a long distance away." He stretches his arms wide. "What is the word for that long distance — the opposite of near?" Which word do you give?',
        zh: 'Daru 拿着两个篮子。"这盐来自附近的山。这丝绸走了很多很多天才到我们这里——来自很远的距离。"他把手臂张得很开。"那段长距离的词是什么——near（近）的反义词？"你给哪个词？',
        es: 'Daru sostiene dos cestas. "Esta sal viene de las colinas cercanas. Esta seda caminó muchos, muchos días para llegar: desde una larga distancia." Abre los brazos. "¿Cuál es la palabra para esa larga distancia, lo contrario de cerca?" ¿Qué palabra le das?',
      },
      choices: [
        {
          word: 'far', pic: 'road', right: true,
          label: 'Here is FAR — a long distance away; the opposite of near.',
        },
        {
          // Plausible-but-wrong: the opposite word — near, not far.
          word: 'near', pic: 'town', right: false,
          label: 'Here is NEAR — close by, only a short distance away.',
          reteach: {
            en: 'Near means CLOSE — like the salt from the hills next door. But Daru asked about the silk that walked many, many days, from a LONG distance. That is the opposite of near. Stretch your arms wide like Daru and try again.',
            zh: 'near 是 CLOSE（近）——就像隔壁山上来的盐。但 Daru 问的是走了很多很多天、来自很 LONG（长）距离的丝绸。那是 near 的反义词。像 Daru 一样把手臂张开，再试一次。',
            es: 'Cerca significa PRÓXIMO, como la sal de las colinas de al lado. Pero Daru preguntó por la seda que caminó muchos, muchos días, desde una LARGA distancia. Eso es lo contrario de cerca. Abre los brazos como Daru e inténtalo otra vez.',
          },
        },
        {
          // Plausible-but-wrong: the line of camels, not the distance.
          word: 'caravan', pic: 'camel', right: false,
          label: 'Here is CARAVAN — the line of camels that carries goods across the desert.',
          reteach: {
            en: 'A caravan is the line of camels that CARRIES the silk. But Daru asked about the long DISTANCE the silk crossed — how far away it began. The distance is not the camels; it has its own word. Look at how wide his arms reached.',
            zh: 'caravan 是搬运丝绸的骆驼队。但 Daru 问的是丝绸跨过的那段长 DISTANCE（距离）——它从多远的地方出发。距离不是骆驼；它有自己的词。看他手臂张得多开。',
            es: 'Una caravana es la fila de camellos que LLEVA la seda. Pero Daru preguntó por la larga DISTANCIA que cruzó la seda: cuán lejos empezó. La distancia no son los camellos; tiene su propia palabra. Mira cuán amplios fueron sus brazos.',
          },
        },
      ],
      win: {
        pic: 'world',
        en: 'Daru nods. "FAR — yes!" He sets the silk beside the salt. "Near things and FAR things both come to one market. That is the wonder of trade." A lamp lights along the dunes road.',
        zh: 'Daru 点头。"far——对！"他把丝绸放在盐旁边。"近的东西和 far（远）的东西都来到同一个市场。这就是贸易的奇妙之处。"沙丘路边亮起一盏灯。',
        es: 'Daru asiente. "¡LEJOS, sí!" Pone la seda junto a la sal. "Las cosas cercanas y las LEJANAS llegan al mismo mercado. Esa es la maravilla del comercio." Una lámpara se enciende junto al camino de las dunas.',
      },
      codex: {
        id: 'd_wh_trade_far',
        group: 'Caravan Coast',
        title: 'Trade reaches far',
        idea: 'Far means a long distance away, the opposite of near, and trade matters because it brings together goods from far places and near places into the same market.',
        source: 'Daru, a dock-runner of the harbor',
      },
      light: 'You gave Daru the word FAR, and the dunes road is brighter.',
    },

    // ===== KEYSTONE 3 — SHIP (big boat that carries goods across the sea) =====
    {
      id: 'd-wh-trade-ks-ship',
      npcId: 'd-wh-trade-lina',
      island: 'wh-caravan',
      flag: 'dWhTradeHelpedShip',
      pic: 'boat',
      prompt: {
        en: 'Lina watches a great sail come in, low in the water with cargo. "Camels carry goods over the land. But this carries many goods across the SEA, from lands on the other side of the water." What is that big boat called?',
        zh: 'Lina 望着一艘满载的大帆船驶来，吃水很深。"骆驼在陆地上运货。但这个东西载着许多货物横渡 SEA（大海），从水那边的土地来。"那艘大船叫什么？',
        es: 'Lina observa entrar una gran vela, hundida en el agua por la carga. "Los camellos llevan bienes por tierra. Pero esto lleva muchos bienes a través del MAR, desde tierras al otro lado del agua." ¿Cómo se llama ese gran barco?',
      },
      choices: [
        {
          word: 'ship', pic: 'boat', right: true,
          label: 'Here is SHIP — a big boat that carries many goods across the sea.',
        },
        {
          // Plausible-but-wrong: the land version — camels, not a sea vessel.
          word: 'caravan', pic: 'camel', right: false,
          label: 'Here is CARAVAN — the line of camels that carries goods across the desert.',
          reteach: {
            en: 'A caravan crosses the LAND on legs. But Lina is pointing at the water — a great thing that carries goods across the SEA, where no camel can walk. The sea-traveler has its own word. Look at the waves again.',
            zh: 'caravan 用脚穿过 LAND（陆地）。但 Lina 指的是水面——一个横渡 SEA（大海）运货的大东西，那里骆驼走不了。海上的旅行者有自己的词。再看看海浪。',
            es: 'Una caravana cruza la TIERRA a pie. Pero Lina señala el agua: una gran cosa que lleva bienes a través del MAR, donde ningún camello puede caminar. El viajero del mar tiene su propia palabra. Mira las olas otra vez.',
          },
        },
        {
          // Plausible-but-wrong: the wind that pushes it, not the vessel.
          word: 'monsoon', pic: 'world', right: false,
          label: 'Here is MONSOON — the seasonal wind that blows across the ocean.',
          reteach: {
            en: 'The monsoon is the WIND that pushes the sails — but it is not the thing itself. Lina means the big wooden boat the wind carries, full of goods, crossing the sea. The boat has its own word. Look at what rides on the water.',
            zh: 'monsoon 是推动船帆的 WIND（风）——但它不是那个东西本身。Lina 说的是被风推着、满载货物、横渡大海的那艘大木船。那艘船有自己的词。看看水上行驶的是什么。',
            es: 'El monzón es el VIENTO que empuja las velas, pero no es la cosa en sí. Lina habla del gran barco de madera que el viento lleva, lleno de bienes, cruzando el mar. El barco tiene su propia palabra. Mira lo que navega sobre el agua.',
          },
        },
      ],
      win: {
        pic: 'boat',
        en: 'Lina claps. "SHIP — yes!" The great sail docks and sailors unload silk and spice. "By ship, lands far across the water can trade with us too." A lamp lights at the end of the quay.',
        zh: 'Lina 拍手。"ship——对！"那艘大帆船靠岸，水手们卸下丝绸和香料。"靠着船，水那边很远的土地也能和我们做贸易。"码头尽头亮起一盏灯。',
        es: 'Lina aplaude. "¡BARCO, sí!" La gran vela atraca y los marineros descargan seda y especias. "Por barco, las tierras lejanas al otro lado del agua también pueden comerciar con nosotros." Una lámpara se enciende al final del muelle.',
      },
      codex: {
        id: 'd_wh_trade_ship',
        group: 'Caravan Coast',
        title: 'Ships trade across water',
        idea: 'A ship is a large boat that carries many goods across the sea, so lands separated by water can trade with each other just as caravans let lands trade across the land.',
        source: 'Lina, a ship-watcher of the harbor',
      },
      achievement: 'd_wh_trade_ship_named',
      light: 'You gave Lina the word SHIP, and the quay is brighter.',
    },

    // ===== KEYSTONE 4 — NEED (you trade for what you must have) =====
    // Owned by Lina too; the quiet heart of the pack. Hadi points here.
    {
      id: 'd-wh-trade-ks-need',
      npcId: 'd-wh-trade-lina',
      island: 'wh-caravan',
      flag: 'dWhTradeHelpedNeed',
      pic: 'farm',
      prompt: {
        en: 'Lina sorts the cargo. "The captain WANTS a gold ring — but he can live without it. The whole town must have grain, or people go hungry. We trade hardest for the thing we cannot live without." What is that word — the must-have, not the just-want?',
        zh: 'Lina 整理着货物。"船长 WANT（想要）一枚金戒指——但没有它他也能活。可全镇必须有粮食，不然人们会挨饿。我们最拼命去换的，是离不开的东西。"那个词是什么——必须有的，而不是只是想要的？',
        es: 'Lina ordena la carga. "El capitán QUIERE un anillo de oro, pero puede vivir sin él. El pueblo entero debe tener grano, o la gente pasa hambre. Comerciamos con más fuerza por aquello sin lo que no podemos vivir." ¿Cuál es esa palabra: lo imprescindible, no lo que solo se desea?',
      },
      choices: [
        {
          word: 'need', pic: 'farm', right: true,
          label: 'Here is NEED — a thing you must have to live, like food or water.',
        },
        {
          // Plausible-but-wrong: the captain's gold ring — a WANT, not a need.
          word: 'want', pic: 'gem', right: false,
          label: 'Here is WANT — a thing you would like to have, like a shiny gold ring.',
          reteach: {
            en: 'A want is something nice you would LIKE — the captain can live without his gold ring. But Lina means the thing the town MUST have, or people go hungry: food, water. That must-have has its own word. Think of what you cannot live without.',
            zh: 'want 是你 LIKE（喜欢）的好东西——船长没有金戒指也能活。但 Lina 说的是全镇 MUST（必须）有的东西，不然人们会挨饿：食物、水。那个必须有的东西有自己的词。想想你离不开的是什么。',
            es: 'Un deseo es algo agradable que te GUSTARÍA tener: el capitán puede vivir sin su anillo de oro. Pero Lina habla de aquello que el pueblo DEBE tener, o la gente pasa hambre: comida, agua. Eso imprescindible tiene su propia palabra. Piensa en lo que no puedes vivir sin ello.',
          },
        },
        {
          // Plausible-but-wrong: extra food set aside, not the must-have itself.
          word: 'surplus', pic: 'farm', right: false,
          label: 'Here is SURPLUS — extra food left over after everyone has eaten.',
          reteach: {
            en: 'A surplus is the EXTRA left over once people are fed. But Lina asked about the thing the town MUST have first of all — without which there is no extra at all. The must-have comes before the leftover. Try the word for what you cannot live without.',
            zh: 'surplus 是大家吃饱后剩下的 EXTRA（多余的）。但 Lina 问的是全镇首先 MUST（必须）有的东西——没有它，就根本没有多余的。必须有的东西在多余之前。试试那个表示"离不开"的词。',
            es: 'Un excedente es lo EXTRA que sobra una vez que la gente ha comido. Pero Lina preguntó por aquello que el pueblo DEBE tener ante todo, sin lo cual no hay nada extra. Lo imprescindible viene antes que lo sobrante. Prueba la palabra para lo que no puedes vivir sin ello.',
          },
        },
      ],
      win: {
        pic: 'farm',
        en: 'Lina smiles softly. "NEED — yes!" She sets the grain at the front of the cargo. "People trade what they HAVE for what they NEED. That is why our docks are never quiet." The last lamp lights, and the whole dock glows warm.',
        zh: 'Lina 温柔地笑了。"need——对！"她把粮食放到货物的最前面。"人们用自己 HAVE（有）的，换自己 NEED（需要）的。所以我们的码头从不安静。"最后一盏灯亮起，整个码头都暖暖地发着光。',
        es: 'Lina sonríe con dulzura. "¡NECESITAR, sí!" Pone el grano al frente de la carga. "La gente cambia lo que TIENE por lo que NECESITA. Por eso nuestros muelles nunca están en silencio." Se enciende la última lámpara y todo el muelle brilla cálido.',
      },
      codex: {
        id: 'd_wh_trade_need',
        group: 'Caravan Coast',
        title: 'Why people trade: need',
        idea: 'A need is a thing you must have to live, like food or water, and trade exists most of all because people give what they have to get what they need, near and far.',
        source: 'Lina, a ship-watcher of the harbor',
      },
      achievement: 'd_wh_trade_docks_alight',
      light: 'You gave Lina the word NEED, and the whole dock glows warm.',
    },
  ],

  // ---- codex: every real idea this pack can teach (mirrors inlined ids) ----
  codex: [
    {
      id: 'd_wh_trade_market',
      group: 'Caravan Coast',
      title: 'What a market is',
      idea: 'A market is the busy place where many buyers and sellers gather, so people can trade many different goods together in one spot instead of searching one seller at a time.',
      source: 'Daru, a dock-runner of the harbor',
    },
    {
      id: 'd_wh_trade_far',
      group: 'Caravan Coast',
      title: 'Trade reaches far',
      idea: 'Far means a long distance away, the opposite of near, and trade matters because it brings together goods from far places and near places into the same market.',
      source: 'Daru, a dock-runner of the harbor',
    },
    {
      id: 'd_wh_trade_ship',
      group: 'Caravan Coast',
      title: 'Ships trade across water',
      idea: 'A ship is a large boat that carries many goods across the sea, so lands separated by water can trade with each other just as caravans let lands trade across the land.',
      source: 'Lina, a ship-watcher of the harbor',
    },
    {
      id: 'd_wh_trade_need',
      group: 'Caravan Coast',
      title: 'Why people trade: need',
      idea: 'A need is a thing you must have to live, like food or water, and trade exists most of all because people give what they have to get what they need, near and far.',
      source: 'Lina, a ship-watcher of the harbor',
    },
  ],

  // ---- achievements: sparse, meaningful milestones ----
  achievements: [
    { id: 'd_wh_trade_market_named', title: 'The market has a name', desc: 'You gave Daru the word MARKET — the place where the harbor trades.' },
    { id: 'd_wh_trade_ship_named', title: 'A sail on the water', desc: 'You gave Lina the word SHIP — how far lands across the sea reach our docks.' },
    { id: 'd_wh_trade_docks_alight', title: 'The docks are fully lit', desc: 'You gave the docks market, ship, far and need — and the whole harbor trades in light.' },
  ],
};

export default pack;
