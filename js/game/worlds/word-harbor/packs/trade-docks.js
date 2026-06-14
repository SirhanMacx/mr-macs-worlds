// trade-docks.js — a Word Harbor story-pack for the TRADE & CLASSICAL ISLE.
//
// Curriculum: Global 9 ENL, Trade Networks + Encounters (Caravan Coast, the
// warm trading-dunes isle centered at [208,8] — see worlds/word-harbor.js
// ISLES; the shipped Caravan Keeper sits at [202,14]). This pack adds a small
// market corner at the docks and ONE gentle market neighbor — Sumi, a young
// stall-helper — who has every word but the one she needs.
//
// The quiet idea this pack teaches, in three picture-first keystones:
//   1) TRADE — people gave what they HAD for what they NEEDED (not "free", not
//      "steal"); both walk away with the thing they wanted. (the heart of it)
//   2) COIN  — one small metal piece everyone agrees has worth, so you do not
//      have to swap fish for cloth for pots; money makes trading easy.
//   3) ROAD  — the long path that joins far places, so goods from far away can
//      reach a near market.
//
// Built to the craft bar of geography-isle.sample.js: choices are FULL
// in-character offers of a word (never A/B/C stems); a WRONG choice never fails
// — the neighbor re-teaches gently, picture-first, and the keystone LOOPS so the
// player answers again from understanding; the RIGHT choice opens a warm `win`,
// lights a lamp (the meter rises), and writes a true one-sentence Codex idea.
//
// De-identified: Sumi is an invented townsperson; no real people are named.
// Honest: the concepts are real economic geography — no real figures are named
// and no invented verbatim quotes are put in anyone's mouth; every teaching
// voice is the invented neighbor Sumi. Gentle: no fail
// states, no timers, no scores — wrong is "try again from understanding".
//
// Every id is namespaced with the pack id (wh-trade-docks / wh_trade_*) so it
// can never collide with the shipped content or any sibling pack.

export const pack = {
  // ---- identity ----
  id: 'wh-trade-docks',
  unit: 'Caravan Coast',                       // curriculum unit / island label
  title: 'The Market Corner and Three Trading Words',

  // ---- npcs: a market neighbor placed on the trade isle ----
  // Caravan Coast is centered at [208,8], radius 52. The shipped Caravan Keeper
  // is at [202,14]. Place Sumi on the docks south of the Keeper, clear of it,
  // so both markers are reachable without overlap.
  npcs: [
    {
      id: 'wh-trade-sumi',
      name: 'Sumi',
      title: 'A young market-helper',
      pos: [196, -22],
      palette: { robe: 0xd98a4e, trim: 0x9a5a2c, skin: 0xc88a52, hat: 0xe8c46a },
      hatKind: 'cap',
      keystone: 'wh-trade-sumi-trade',         // tapping Sumi opens the first keystone
    },
  ],

  // ---- cutscenes: named playCutscene beat-sequences (one short line each) ----
  cutscenes: {
    WH_TRADE_SUMI_ARRIVES: [
      {
        tint: 'amber', kicker: 'Caravan Coast',
        text: 'At a little stall by the docks, a girl stacks baskets of figs and stares at a strange word on a sign.',
      },
      {
        tint: 'amber', art: 'portrait',
        palette: { robe: 0xd98a4e, trim: 0x9a5a2c, skin: 0xc88a52, hat: 0xe8c46a },
        kicker: 'Sumi, the market-helper',
        text: 'She waves you over. "You collect words. I run a stall, but I am missing the words for what I do all day."',
        cta: 'Help at the stall',
      },
    ],
  },

  // ---- triggers: fire each cutscene once (gated by a story flag) ----
  triggers: [
    { on: 'visit', value: 'wh-caravan', play: 'WH_TRADE_SUMI_ARRIVES' },
  ],

  // ---- keystones: THE CORE — three gentle, picture-first understanding beats ----
  keystones: [
    // ===== KEYSTONE 1 — TRADE (the heart: had ↔ needed) =====
    {
      id: 'wh-trade-sumi-trade',
      npcId: 'wh-trade-sumi',
      island: 'wh-caravan',
      flag: 'whTradeHelpedSumiTrade',
      pic: 'camel',
      prompt: {
        en: 'Sumi has many figs but no cloth. A neighbor has cloth but no figs. "We each give what we HAVE, and get what we NEED," she says. "What is that ONE word?" Which word do you give?',
        zh: 'Sumi 有很多无花果，却没有布。邻居有布，却没有无花果。她说："我们各自给出自己 HAVE 的，换到自己 NEED 的。""那一个词是什么？"你给哪个词？',
        es: 'Sumi tiene muchos higos pero no tela. Una vecina tiene tela pero no higos. "Cada una da lo que TIENE y recibe lo que NECESITA", dice. "¿Cuál es esa palabra?" ¿Qué palabra le das?',
      },
      choices: [
        {
          word: 'trade', pic: 'camel', right: true,
          label: 'Here is TRADE — you give what you have for what you need, and the other person does too.',
        },
        {
          // Plausible-but-wrong: a generous-sounding word, but trade is an
          // EXCHANGE, not a one-way gift. The re-teach restores the two sides.
          word: 'gift', pic: 'gem', right: false,
          label: 'Here is GIFT — you give a thing and ask for nothing back.',
          reteach: {
            en: 'A gift goes ONE way — no swap. But Sumi GIVES figs AND GETS cloth; both sides give and both sides get. That two-way swap has its own word. Look at the stall again.',
            zh: 'gift 只是单向的——没有交换。但 Sumi 既给出无花果，又得到布；双方都给，双方都得。这种双向交换有自己的词。再看看摊位。',
            es: 'Un regalo va en UN solo sentido, sin intercambio. Pero Sumi DA higos Y RECIBE tela; ambas dan y ambas reciben. Ese intercambio de dos lados tiene su propia palabra. Mira el puesto otra vez.',
          },
        },
        {
          // Plausible-but-wrong: taking without giving. The re-teach contrasts
          // "fair both-give" with "take from one side".
          word: 'steal', pic: 'sad', right: false,
          label: 'Here is STEAL — you take a thing and give nothing.',
          reteach: {
            en: 'To steal is to TAKE and leave the other person with nothing. But here BOTH neighbors walk away happy — each gave, each got. That fair, two-way swap is the word Sumi needs. Look once more.',
            zh: 'steal 是只拿走、什么也不给，让对方一无所有。但这里两位邻居都满意地离开——各自给了，各自得了。这种公平的双向交换，才是 Sumi 要的词。再看一次。',
            es: 'Robar es TOMAR y dejar a la otra persona sin nada. Pero aquí AMBAS vecinas se van contentas: cada una dio y cada una recibió. Ese intercambio justo de dos lados es la palabra que Sumi necesita. Mira otra vez.',
          },
        },
      ],
      win: {
        pic: 'camel',
        en: 'Sumi claps. "TRADE — yes!" She swaps a basket of figs for a roll of cloth, and both neighbors smile. A lamp lights over the market corner.',
        zh: 'Sumi 拍手。"trade——对！"她用一篮无花果换来一卷布，两位邻居都笑了。市场角落上方亮起一盏灯。',
        es: 'Sumi aplaude. "¡COMERCIO, sí!" Cambia una cesta de higos por un rollo de tela, y ambas vecinas sonríen. Una lámpara se enciende sobre el rincón del mercado.',
      },
      codex: {
        id: 'wh_trade_what_is_trade',
        group: 'Caravan Coast',
        title: 'What trade really is',
        idea: 'Trade is a two-way swap: people give what they have for what they need, so both sides walk away with the thing they wanted.',
        source: 'Sumi, a market-helper of the harbor',
      },
      achievement: 'wh_trade_first_word',
      light: 'You gave Sumi the word TRADE, and the market corner is brighter.',
    },

    // ===== KEYSTONE 2 — COIN (money makes trading easy) =====
    {
      id: 'wh-trade-sumi-coin',
      npcId: 'wh-trade-sumi',
      island: 'wh-caravan',
      flag: 'whTradeHelpedSumiCoin',
      pic: 'gem',
      prompt: {
        en: 'Sumi sighs. "A man wants figs, but I do not need his pots. So he hands me one small metal piece everyone agrees is worth something — I can spend it on anything later." What is that piece called?',
        zh: 'Sumi 叹气："一个人想要无花果，但我不需要他的罐子。于是他给我一小块金属——大家都同意它值钱——我以后可以用它买任何东西。"这块东西叫什么？',
        es: 'Sumi suspira. "Un hombre quiere higos, pero yo no necesito sus ollas. Así que me da una pequeña pieza de metal que todos aceptan como valiosa: luego puedo gastarla en lo que sea." ¿Cómo se llama esa pieza?',
      },
      choices: [
        {
          word: 'coin', pic: 'gem', right: true,
          label: 'Here is COIN — one small metal piece everyone agrees has worth, so you can buy anything later.',
        },
        {
          // Plausible-but-wrong: real, but it is the ACT, not the metal piece.
          word: 'barter', pic: 'camel', right: false,
          label: 'Here is BARTER — swapping one good straight for another, with no money.',
          reteach: {
            en: 'Barter is figs-for-cloth with NO money in between. But the man did not want to swap goods — he gave Sumi a small metal piece she can spend ANYWHERE. The thing in her hand has its own word. Look at her hand again.',
            zh: 'barter 是无花果直接换布，中间没有钱。但那个人不想用货物交换——他给了 Sumi 一小块金属，她可以用它在任何地方买东西。她手里的那个东西有自己的词。再看看她的手。',
            es: 'El trueque es higos-por-tela SIN dinero en medio. Pero el hombre no quería intercambiar bienes: le dio a Sumi una pequeña pieza de metal que puede gastar EN CUALQUIER LUGAR. Lo que tiene en la mano tiene su propia palabra. Mira su mano otra vez.',
          },
        },
        {
          // Plausible-but-wrong: a thing she trades, not the money itself.
          word: 'basket', pic: 'farm', right: false,
          label: 'Here is BASKET — the woven holder she carries her figs in.',
          reteach: {
            en: 'A basket holds her figs — it is a GOOD she trades, not what she is paid WITH. The man paid her with one small round metal piece worth something to everyone. That has its own word. Look once more.',
            zh: '篮子用来装无花果——它是她交易的货物，不是付给她的东西。那个人用一小块圆圆的、大家都觉得值钱的金属付给她。那有自己的词。再看一次。',
            es: 'Una cesta sostiene sus higos: es un BIEN que comercia, no aquello con lo que le pagan. El hombre le pagó con una pequeña pieza redonda de metal que vale para todos. Eso tiene su propia palabra. Mira otra vez.',
          },
        },
      ],
      win: {
        pic: 'gem',
        en: 'Sumi grins. "COIN — yes!" She drops it in her pouch. "Now I can sell figs to anyone and buy what I want later." A second lamp lights along the docks.',
        zh: 'Sumi 笑了。"coin——对！"她把它放进钱袋。"现在我可以把无花果卖给任何人，以后再买我想要的东西。"码头边又亮起一盏灯。',
        es: 'Sumi sonríe. "¡MONEDA, sí!" La guarda en su bolsa. "Ahora puedo vender higos a cualquiera y comprar lo que quiera después." Una segunda lámpara se enciende junto a los muelles.',
      },
      codex: {
        id: 'wh_trade_coin',
        group: 'Caravan Coast',
        title: 'Why people use coins',
        idea: 'A coin is a small piece of metal everyone agrees has worth, so people can buy and sell easily instead of always swapping one good straight for another.',
        source: 'Sumi, a market-helper of the harbor',
      },
      light: 'You gave Sumi the word COIN, and the docks are brighter.',
    },

    // ===== KEYSTONE 3 — ROAD (far places joined) =====
    {
      id: 'wh-trade-sumi-road',
      npcId: 'wh-trade-sumi',
      island: 'wh-caravan',
      flag: 'whTradeHelpedSumiRoad',
      pic: 'road',
      prompt: {
        en: 'Sumi points inland. "My silk comes from a city many days away. Camels and carts walk one long, worn path the whole way here." She traces it with her finger. "What is that long path called?"',
        zh: 'Sumi 指向内陆。"我的丝绸来自很多天路程之外的一座城市。骆驼和马车沿着一条又长又旧的小路一路走到这里。"她用手指描出那条路。"那条长长的路叫什么？"',
        es: 'Sumi señala tierra adentro. "Mi seda viene de una ciudad a muchos días de aquí. Camellos y carros recorren un largo camino gastado hasta aquí." Lo traza con el dedo. "¿Cómo se llama ese largo camino?"',
      },
      choices: [
        {
          word: 'road', pic: 'road', right: true,
          label: 'Here is ROAD — the long worn path that joins far places, so goods can travel from a faraway city to your market.',
        },
        {
          // Plausible-but-wrong: real glossary term, but it is the PLACE you
          // sell, not the path that brings the goods.
          word: 'market', pic: 'town', right: false,
          label: 'Here is MARKET — the busy place where people meet to buy and sell.',
          reteach: {
            en: 'A market is WHERE you sell, the end of the journey. But Sumi asked about the long path the silk TRAVELS along to GET here. The path is not the market — it has its own word. Follow her finger again.',
            zh: 'market 是你卖东西的地方，是旅途的终点。但 Sumi 问的是丝绸一路走来的那条长路。那条路不是市场——它有自己的词。再顺着她的手指看。',
            es: 'Un mercado es DÓNDE vendes, el final del viaje. Pero Sumi preguntó por el largo camino por el que VIAJA la seda para LLEGAR aquí. El camino no es el mercado: tiene su propia palabra. Sigue su dedo otra vez.',
          },
        },
        {
          // Plausible-but-wrong: a group that travels the road, not the road.
          word: 'caravan', pic: 'camel', right: false,
          label: 'Here is CARAVAN — the line of camels and carts that travels together for safety.',
          reteach: {
            en: 'A caravan is the line of camels that WALKS the path. But Sumi asked about the path ITSELF — the long worn track under their feet. The camels travel ON it; the thing they travel on has its own word. Look at the ground again.',
            zh: 'caravan 是走在路上的骆驼队。但 Sumi 问的是那条路本身——脚下又长又旧的路。骆驼在它上面走；它们走的那条东西有自己的词。再看看地面。',
            es: 'Una caravana es la fila de camellos que RECORRE el camino. Pero Sumi preguntó por el camino EN SÍ: el largo sendero gastado bajo sus pies. Los camellos viajan SOBRE él; aquello sobre lo que viajan tiene su propia palabra. Mira el suelo otra vez.',
          },
        },
      ],
      win: {
        pic: 'road',
        en: 'Sumi nods slowly. "ROAD — yes!" She looks down the long track to the dunes. "Far cities and our little harbor — joined by one road. That is how the world trades." A third lamp lights, and the whole market corner glows warm.',
        zh: 'Sumi 慢慢点头。"road——对！"她望向通往沙丘的长路。"远方的城市和我们的小港口——被一条路连在一起。世界就是这样做贸易的。"第三盏灯亮起，整个市场角落都暖暖地发着光。',
        es: 'Sumi asiente despacio. "¡CAMINO, sí!" Mira el largo sendero hacia las dunas. "Ciudades lejanas y nuestro pequeño puerto, unidos por un camino. Así comercia el mundo." Una tercera lámpara se enciende y todo el rincón del mercado brilla cálido.',
      },
      codex: {
        id: 'wh_trade_road',
        group: 'Caravan Coast',
        title: 'How roads connect far places',
        idea: 'A road is a long path that joins faraway places to nearby ones, so goods, money and ideas can travel between distant cities and a small market.',
        source: 'Sumi, a market-helper of the harbor',
      },
      achievement: 'wh_trade_corner_lit',
      light: 'You gave Sumi the word ROAD, and the market corner is fully lit.',
    },
  ],

  // ---- codex: every real idea this pack can teach (mirrors the inlined ids) ----
  codex: [
    {
      id: 'wh_trade_what_is_trade',
      group: 'Caravan Coast',
      title: 'What trade really is',
      idea: 'Trade is a two-way swap: people give what they have for what they need, so both sides walk away with the thing they wanted.',
      source: 'Sumi, a market-helper of the harbor',
    },
    {
      id: 'wh_trade_coin',
      group: 'Caravan Coast',
      title: 'Why people use coins',
      idea: 'A coin is a small piece of metal everyone agrees has worth, so people can buy and sell easily instead of always swapping one good straight for another.',
      source: 'Sumi, a market-helper of the harbor',
    },
    {
      id: 'wh_trade_road',
      group: 'Caravan Coast',
      title: 'How roads connect far places',
      idea: 'A road is a long path that joins faraway places to nearby ones, so goods, money and ideas can travel between distant cities and a small market.',
      source: 'Sumi, a market-helper of the harbor',
    },
  ],

  // ---- achievements: sparse, meaningful milestones ----
  achievements: [
    { id: 'wh_trade_first_word', title: 'The first trading word', desc: 'You gave Sumi the word TRADE — what every market is built on.' },
    { id: 'wh_trade_corner_lit', title: 'The market corner is lit', desc: 'You gave Sumi trade, coin and road — and lit the whole market corner.' },
  ],
};

export default pack;
