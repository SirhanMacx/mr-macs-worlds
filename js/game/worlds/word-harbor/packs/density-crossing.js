// density-crossing.js — a gentle, picture-first Word Harbor DENSITY pack for the
// POST-CLASSICAL crossing era, set on CARAVAN COAST (wh-caravan, "Trade Networks
// + Encounters"). This is the SECOND, denser pack for this unit: it ADDS to the
// shipped crossing-isle pack (travel / book / care) and the trade-docks pack
// (trade / coin / road / market) WITHOUT repeating any of those ideas.
//
// Read CONTRACT.md first, then geography-isle.sample.js (the gold standard) and
// crossing-isle.js + trade-docks.js (the two existing Caravan Coast packs whose
// ideas we must NOT duplicate). This pack copies that proven shape exactly: real
// neighbors added to the existing island (wh-caravan, centered [208,8], r=52), a
// one-time warm cutscene, a trigger that fires it, and — the heart — THREE
// picture-first word-keystones whose CHOICES are full in-character offers of a
// word (never A/B/C stems), whose NOT-QUITE path re-teaches kindly and loops
// (never a red X, never a score, no fail state), and whose RIGHT path visibly
// changes the world: a lamp lights, the town-light meter rises, and a Codex entry
// is written.
//
// Curriculum: Global 9 ENL, post-classical Trade Networks + Encounters. The
// quiet, true idea — kept very simple for a newcomer reader: WHEN TRAVELERS AND
// NEIGHBORS MEET ON THE ROAD, THEY BECOME FRIENDS, SHARE WHAT THEY HAVE, AND
// CARRY HOME NEW IDEAS. Two people who walked the same road become FRIENDs; at the
// long table a cook does not sell her food and ideas but SHAREs them freely; and
// a weaver who met travelers from far away learns a NEW pattern she never knew.
// Each keystone gives the neighbor the ONE word whose picture matches what they
// mean. These are the human side of trade: encounters spread not only goods but
// friendship, sharing, and new ideas — the cultural diffusion at the center of
// the unit, said in three small, warm words.
//
// De-identified: Ami, Reta and Nuri are invented townsfolk; no real names. The
// only real person ever nameable is "Mr. Maccarello", unused here. Honest
// pedagogy: the history is real (post-classical encounters along trade routes
// spread ideas, food, faith and skills between very different peoples, and built
// lasting friendships) — no invented verbatim quotes from any real figure; every
// teaching voice is a fictional denizen, so nothing is mis-attributed. Picture-
// first so an emerging reader succeeds without decoding text; bilingual zh + es
// throughout; gentle — a not-quite choice gets a kind retry and the keystone
// loops, never a fail.
//
// Pictures used are REAL pics.js scene kinds (verified against pics.js): friend →
// the 'pray' scene (two people side by side under a warm light); share → the
// 'farm' scene (the grain / food people put on the table; 'gem' = treasure foil,
// 'town' = the place foil); new → the 'world' scene (the wide world of new
// places; 'wall' = the old closed way foil, 'camel' = the same caravan as before).
//
// IDs are all namespaced 'd-wh-cross-*' so they can NEVER collide with the shipped
// content (st-caravan, the Caravan Keeper at [202,14]) or with the existing packs
// (wh-cross-* in crossing-isle.js, wh-trade-* in trade-docks.js, wh-river-*,
// wh-belief-*, wh-geo-*). NPCs sit on Caravan Coast well clear of every existing
// neighbor: the Keeper [202,14], Yusra [226,22], Bashir [222,-8], Cira [200,30],
// Sumi [196,-22] (each new NPC is >=16 units from all of them and inside r=52).

export const pack = {
  // ---- identity ----
  id: 'd-wh-cross-density',
  unit: 'Caravan Coast',
  title: 'Friends on the Road: Share and the New',

  // ---- npcs: extra characters placed at an existing island ----
  // Caravan Coast is centered at [208,8], radius 52 (see worlds/word-harbor.js
  // ISLES). Placed clear of the Keeper [202,14] and of every pack NPC, along the
  // warm road's south edge and the long table.
  npcs: [
    {
      id: 'd-wh-cross-ami',
      name: 'Ami',
      title: 'A child who walked the long road with you',
      pos: [208, 44],
      palette: { robe: 0xe8b46a, trim: 0xb5803a, skin: 0xd9a066, hat: 0xf0d8a0 },
      hatKind: 'cap',
      keystone: 'd-wh-cross-ks-friend',   // tapping Ami opens the FRIEND keystone
    },
    {
      id: 'd-wh-cross-reta',
      name: 'Reta',
      title: 'A cook at the long traveler table',
      pos: [178, 2],
      palette: { robe: 0x5aa07d, trim: 0x356b50, skin: 0xc78a52, hat: 0xd8e6c8 },
      hatKind: 'brim',
      keystone: 'd-wh-cross-ks-share',     // tapping Reta opens the SHARE keystone
    },
    {
      id: 'd-wh-cross-nuri',
      name: 'Nuri',
      title: 'A weaver who met travelers from far away',
      pos: [230, -26],
      palette: { robe: 0x6f7ad0, trim: 0x434d9a, skin: 0x8a5a33, hat: 0xc8cef0 },
      hatKind: 'turban',
      keystone: 'd-wh-cross-ks-new',       // tapping Nuri opens the NEW keystone
    },
  ],

  // ---- cutscenes: named playCutscene beat-sequences (ONE short line each) ----
  cutscenes: {
    DWH_CROSS_TABLE: [
      {
        tint: 'amber', kicker: 'Caravan Coast',
        text: 'By the road a long table is set. People who walked from far lands sit down together to eat.',
      },
      {
        tint: 'amber', art: 'portrait',
        palette: { robe: 0xe8b46a, trim: 0xb5803a, skin: 0xd9a066, hat: 0xf0d8a0 },
        kicker: 'Ami, who walked beside you',
        text: '"We walked the same road, you and me. Come — there are warm words to find at this table."',
        cta: 'Sit at the table',
      },
    ],
  },

  // ---- triggers: when each cutscene fires (once) ----
  // Gated behind whCrossTravelGiven (set by the shipped crossing-isle TRAVEL
  // keystone): this denser table opens once the player has first met a traveler,
  // so the two packs read as one warm afternoon. If that flag never sets, the
  // table also opens on a plain visit (the loader fires whichever comes first,
  // once), so the pack is never stranded.
  triggers: [
    { on: 'flag', value: 'whCrossTravelGiven', play: 'DWH_CROSS_TABLE' },
    { on: 'visit', value: 'wh-caravan', play: 'DWH_CROSS_TABLE' },
  ],

  // ---- keystones: THE CORE — three gentle, picture-first word moments ----
  // Each: the player GIVES the word whose PICTURE matches what the neighbor means.
  // A not-quite choice is never a fail — its `reteach` is read aloud (picture
  // first), then the same keystone loops so the player tries again from
  // understanding. The right word opens a warm `win`, lights a lamp, lifts the
  // town-light meter, and writes the real idea to the Field Journal Codex.
  keystones: [
    // ---------- KEYSTONE 1: FRIEND ----------
    {
      id: 'd-wh-cross-ks-friend',
      npcId: 'd-wh-cross-ami',
      island: 'wh-caravan',
      flag: 'dWhCrossFriendGiven',
      pic: 'pray',
      prompt: {
        en: 'Ami points at the two of you. "When we started, we did not know each other. Now we walked the whole road together, sharing water and stories. What is the word for someone you like and trust like this?" Which word do you give?',
        zh: 'Ami 指着你们两个。"一开始，我们互不相识。现在我们一起走完了整条路，分享水和故事。像这样你喜欢、信任的人，用哪个词来说？" 你给哪个词？',
        es: 'Ami los señala a los dos. "Al principio no nos conocíamos. Ahora caminamos todo el camino juntos, compartiendo agua e historias. ¿Cuál es la palabra para alguien a quien quieres y en quien confías así?" ¿Qué palabra le das?',
      },
      choices: [
        {
          word: 'friend', pic: 'pray', right: true,
          label: 'Here is FRIEND — someone you like and trust, who walks beside you.',
        },
        {
          // Not-quite: a STRANGER is what a friend was BEFORE — the opposite now.
          word: 'stranger', pic: 'sad', right: false,
          label: 'Here is STRANGER — a person you do not know yet.',
          reteach: {
            en: 'A stranger is someone you do NOT know yet. But you and Ami DO know each other now — you walked the whole road together. What do we call a person you like and trust? Try again.',
            zh: '陌生人是你还不认识的人。但你和 Ami 现在已经认识了——你们一起走完了整条路。你喜欢、信任的人叫什么？再试一次。',
            es: 'Un extraño es alguien que TODAVÍA no conoces. Pero tú y Ami YA se conocen: caminaron juntos todo el camino. ¿Cómo se llama a alguien a quien quieres y en quien confías? Intenta otra vez.',
          },
        },
        {
          // Not-quite: a GUEST is only passing through; a friend is a lasting bond.
          word: 'guest', pic: 'town', right: false,
          label: 'Here is GUEST — a visitor who stays a short while, then leaves.',
          reteach: {
            en: 'A guest visits for a little while and then goes home. But Ami means a bond that stays, even after the road ends. What is the word for someone you like and trust for a long time? Try again.',
            zh: '客人只待一小会儿就回家了。但 Ami 说的是一种留得住的情谊，就算路走完了也还在。长久喜欢、信任的人叫什么？再试一次。',
            es: 'Un invitado se queda un rato y luego se va a casa. Pero Ami se refiere a un lazo que perdura, aun cuando el camino termina. ¿Cuál es la palabra para alguien a quien quieres y en quien confías por mucho tiempo? Intenta otra vez.',
          },
        },
      ],
      win: {
        pic: 'pray',
        en: 'Ami beams and links arms with you. "FRIEND — yes! That is what we are now." The two of you stand together under a warm light, and a lamp lights over the road you shared.',
        zh: 'Ami 笑开了，挽住你的手臂。"朋友——对！我们现在就是朋友。"你们俩在温暖的灯光下并肩站着，你们一起走过的路上亮起一盏灯。',
        es: 'Ami sonríe de oreja a oreja y te toma del brazo. "¡AMIGO, sí! Eso somos ahora." Los dos se quedan juntos bajo una luz cálida, y una lámpara se enciende sobre el camino que compartieron.',
      },
      codex: {
        id: 'd_wh_cross_friend',
        group: 'Caravan Coast',
        title: 'Travelers became friends',
        idea: 'A friend is someone you like and trust who walks beside you — along the trade roads, people from very different lands met as strangers and became lasting friends.',
        source: 'Ami, who walked the road with you',
      },
      achievement: 'd_wh_cross_warm_table',
      light: 'You gave Ami the word FRIEND, and the shared road is brighter.',
    },

    // ---------- KEYSTONE 2: SHARE ----------
    {
      id: 'd-wh-cross-ks-share',
      npcId: 'd-wh-cross-reta',
      island: 'wh-caravan',
      flag: 'dWhCrossShareGiven',
      pic: 'farm',
      prompt: {
        en: 'Reta sets bread and warm grain in the middle of the long table for everyone to take freely — and tells the travelers how she cooks it, asking nothing back. "When you give what you have so others can have some too, what is the word?" Which word do you give?',
        zh: 'Reta 把面包和热乎的谷物放在长桌中间，让大家自由拿取——还把做法告诉旅人，什么都不要回报。"把自己有的东西给出去，让别人也能有一些，叫什么？" 你给哪个词？',
        es: 'Reta pone pan y grano caliente en medio de la mesa larga para que todos tomen libremente, y les cuenta a los viajeros cómo lo cocina, sin pedir nada a cambio. "Cuando das lo que tienes para que otros también tengan, ¿cuál es la palabra?" ¿Qué palabra le das?',
      },
      choices: [
        {
          word: 'share', pic: 'farm', right: true,
          label: 'Here is SHARE — to give some of what you have so others can have it too.',
        },
        {
          // Not-quite: to SELL wants money back — but Reta asks nothing in return.
          word: 'sell', pic: 'gem', right: false,
          label: 'Here is SELL — to give a thing only if someone pays you for it.',
          reteach: {
            en: 'To sell, you ask for money back. But Reta asks for NOTHING — the food and the recipe are free for everyone. What is the word for giving so others can have some too? Try again.',
            zh: '卖东西要别人付钱。但 Reta 什么都不要——食物和做法都免费给大家。把东西给出去，让别人也能有一些，叫什么？再试一次。',
            es: 'Para vender, pides dinero a cambio. Pero Reta no pide NADA: la comida y la receta son gratis para todos. ¿Cuál es la palabra para dar para que otros también tengan? Intenta otra vez.',
          },
        },
        {
          // Not-quite: to KEEP is the opposite — holding it all for yourself.
          word: 'keep', pic: 'town', right: false,
          label: 'Here is KEEP — to hold a thing only for yourself.',
          reteach: {
            en: 'To keep means you hold it all for yourself, and no one else gets any. But Reta puts the food in the MIDDLE for everyone. What is the word for giving so others can have some too? Try again.',
            zh: '"留着"是说全都自己拿着，别人一点也得不到。但 Reta 把食物放在中间，给所有人。把东西给出去让别人也能有，叫什么？再试一次。',
            es: 'Guardar significa quedarte con todo para ti, y nadie más recibe. Pero Reta pone la comida EN MEDIO para todos. ¿Cuál es la palabra para dar para que otros también tengan? Intenta otra vez.',
          },
        },
      ],
      win: {
        pic: 'farm',
        en: 'Reta nods, pleased. "SHARE — yes!" Hands reach in from every land at the table, and everyone eats. A lamp lights over the long table, warm and full.',
        zh: 'Reta 满意地点点头。"分享——对！"来自各地的手一起伸向桌子，每个人都吃上了。长桌上方亮起一盏灯，温暖又满足。',
        es: 'Reta asiente, contenta. "¡COMPARTIR, sí!" Manos de todas las tierras se acercan a la mesa, y todos comen. Una lámpara se enciende sobre la mesa larga, cálida y llena.',
      },
      codex: {
        id: 'd_wh_cross_share',
        group: 'Caravan Coast',
        title: 'Encounters spread ideas freely',
        idea: 'To share is to give some of what you have so others can have it too — at the crossroads of trade, people shared not only food but also recipes, faith, and ideas, freely passing them between distant cultures.',
        source: 'Reta, a cook at the traveler table',
      },
      achievement: 'd_wh_cross_warm_table',
      light: 'You gave Reta the word SHARE, and the long table is brighter.',
    },

    // ---------- KEYSTONE 3: NEW ----------
    {
      id: 'd-wh-cross-ks-new',
      npcId: 'd-wh-cross-nuri',
      island: 'wh-caravan',
      flag: 'dWhCrossNewGiven',
      pic: 'world',
      prompt: {
        en: 'Nuri holds up her cloth. "All my life I wove the same pattern my grandmother taught me. Then travelers from a far land showed me one I had never seen — and now I weave it too. What is the word for a thing you have not met before?" Which word do you give?',
        zh: 'Nuri 举起她的布。"我一辈子都织奶奶教我的那个老花样。后来远方来的旅人给我看了一个我从没见过的花样——现在我也会织了。一样你以前没遇见过的东西，用哪个词？" 你给哪个词？',
        es: 'Nuri levanta su tela. "Toda mi vida tejí el mismo patrón que me enseñó mi abuela. Luego unos viajeros de tierra lejana me mostraron uno que nunca había visto, y ahora también lo tejo. ¿Cuál es la palabra para algo que no conocías antes?" ¿Qué palabra le das?',
      },
      choices: [
        {
          word: 'new', pic: 'world', right: true,
          label: 'Here is NEW — something you have not met or known before.',
        },
        {
          // Not-quite: OLD is the pattern she already knew — the opposite of new.
          word: 'old', pic: 'wall', right: false,
          label: 'Here is OLD — something from long ago that you have always known.',
          reteach: {
            en: 'Old is the pattern Nuri ALREADY knew, from her grandmother. But the travelers showed her one she had NEVER seen before. What is the word for a thing you have not met before? Try again.',
            zh: '"旧"是 Nuri 早就会的、奶奶教的那个花样。但旅人给她看的是她从没见过的。一样你以前没遇见过的东西叫什么？再试一次。',
            es: 'Viejo es el patrón que Nuri YA conocía, de su abuela. Pero los viajeros le mostraron uno que NUNCA había visto. ¿Cuál es la palabra para algo que no conocías antes? Intenta otra vez.',
          },
        },
        {
          // Not-quite: SAME means nothing changed — but the travelers brought change.
          word: 'same', pic: 'camel', right: false,
          label: 'Here is SAME — not different; just like it was before.',
          reteach: {
            en: 'Same means nothing changed — but the travelers brought Nuri a pattern that was DIFFERENT from hers. What is the word for a thing you have not met before? Try again.',
            zh: '"一样"是说什么都没变——但旅人给 Nuri 带来的是和她不同的花样。一样你以前没遇见过的东西叫什么？再试一次。',
            es: 'Igual significa que nada cambió, pero los viajeros le trajeron a Nuri un patrón DISTINTO al suyo. ¿Cuál es la palabra para algo que no conocías antes? Intenta otra vez.',
          },
        },
      ],
      win: {
        pic: 'world',
        en: 'Nuri laughs and weaves the fresh pattern into her cloth. "NEW — yes! The road brought me something new." Her loom fills with both patterns, near and far together. A lamp lights over her weaving.',
        zh: 'Nuri 笑了，把新花样织进布里。"新的——对！这条路给我带来了新东西。"她的织机上，远近两种花样交织在一起。她的织布上方亮起一盏灯。',
        es: 'Nuri ríe y teje el patrón fresco en su tela. "¡NUEVO, sí! El camino me trajo algo nuevo." Su telar se llena de ambos patrones, lo cercano y lo lejano juntos. Una lámpara se enciende sobre su tejido.',
      },
      codex: {
        id: 'd_wh_cross_new',
        group: 'Caravan Coast',
        title: 'New ideas crossed between cultures',
        idea: 'Something new is something you have not met before — when travelers met people from far lands, they learned new skills, patterns, and ideas and carried them home, so each culture grew by meeting others.',
        source: 'Nuri, a weaver of the trade road',
      },
      achievement: 'd_wh_cross_warm_table',
      light: 'You gave Nuri the word NEW, and her loom is brighter.',
    },
  ],

  // ---- codex: every real idea this pack can teach (mirrors the inlined ones) ----
  codex: [
    {
      id: 'd_wh_cross_friend',
      group: 'Caravan Coast',
      title: 'Travelers became friends',
      idea: 'A friend is someone you like and trust who walks beside you — along the trade roads, people from very different lands met as strangers and became lasting friends.',
      source: 'Ami, who walked the road with you',
    },
    {
      id: 'd_wh_cross_share',
      group: 'Caravan Coast',
      title: 'Encounters spread ideas freely',
      idea: 'To share is to give some of what you have so others can have it too — at the crossroads of trade, people shared not only food but also recipes, faith, and ideas, freely passing them between distant cultures.',
      source: 'Reta, a cook at the traveler table',
    },
    {
      id: 'd_wh_cross_new',
      group: 'Caravan Coast',
      title: 'New ideas crossed between cultures',
      idea: 'Something new is something you have not met before — when travelers met people from far lands, they learned new skills, patterns, and ideas and carried them home, so each culture grew by meeting others.',
      source: 'Nuri, a weaver of the trade road',
    },
  ],

  // ---- achievements: one sparse, meaningful milestone ----
  achievements: [
    {
      id: 'd_wh_cross_warm_table',
      title: 'A warm table on the road',
      desc: 'You found the warm words of the crossing: a friend, a thing to share, and something new.',
    },
  ],
};

export default pack;
