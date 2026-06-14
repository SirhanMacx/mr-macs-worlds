// density-far-shore.js — an ADDITIVE density pack for WORD HARBOR's Exploration
// Point (Far Shore Isle). It DEEPENS the shipped far-shore.js pack toward fuller
// coverage of the gentle "newcomer's own journey" corner of the Exploration +
// Global Exchange unit — WITHOUT touching the repo or duplicating any idea the
// first pack already teaches.
//
// Read CONTRACT.md first, then geography-isle.sample.js (gold standard), then the
// shipped far-shore.js (so you do NOT repeat its ideas). This file copies that
// shape exactly and only changes the content. Pure DATA: no imports, no engine
// calls — the defensive loader does all the mechanics, so a typo here can never
// crash the world.
//
// WHAT THE FIRST PACK ALREADY TEACHES (do not repeat): BOAT (how people crossed
// the sea), NEW (a new shore is one you must learn), HOME (a far shore becomes
// home). Codex ids wh_far_shore_boat / _new / _home; achievement
// wh_far_shore_welcomed; npcs Pio + Salu.
//
// WHAT THIS DENSITY PACK ADDS (all NEW): the QUIET, true idea that people cross
// the sea, MEET one another, and make a new home TOGETHER — the human half of the
// great exchange, told with dignity through four small words an emerging reader
// can give:
//   • WELCOME  — the first word a stranger longs to hear at a new shore.
//   • HAND     — the open hand says "I mean you no harm; I want to meet you."
//   • NAME     — to ask and share a name is how two strangers stop being strangers.
//   • TOGETHER — many peoples crossed the seas and, side by side, built one town.
// Each is a single short word carrying one true history sentence in the Codex.
//
// De-identified: Neta (a dock-greeter) and Tomas (a newcomer child) are invented
// townsfolk; the only real person ever named in the world is "Mr. Maccarello".
// Honest pedagogy: the meeting of strangers across oceans and the building of new,
// mixed communities are real history; no invented verbatim quotes from any real
// figure. Gentle: no fail states, no timers, no score — a wrong word is "try
// again from understanding," and a kind neighbor re-teaches, picture-first.

export const pack = {
  // ---- identity ---- (namespace: every id begins d-wh-far- so it can't collide)
  id: 'd-wh-far-density',
  unit: 'Exploration Point',                 // the island / unit label shown in panels
  title: 'The Open Hand, the Shared Name, and the Town Built Together',

  // ---- npcs: placed on Exploration Point (center [132,156], r50) ----
  // Occupied already: the shipped Navigator [126,150]; far-shore.js Pio [120,168]
  // and Salu [144,162]. We place ours CLEAR of all three: Neta on the east-south
  // dock-step, Tomas on the west path by the water — both well inside the isle.
  npcs: [
    {
      id: 'd-wh-far-neta',
      name: 'Neta',
      title: 'A dock-greeter with an open hand',
      pos: [150, 144],
      palette: { robe: 0xe06f8a, trim: 0xa84762, skin: 0xcf9a66, hat: 0xf3ead4 },
      hatKind: 'brim',
      keystone: 'd-wh-far-ks-welcome',         // tapping Neta opens the WELCOME keystone
                                                //   (the HAND keystone is hers too, after it)
    },
    {
      id: 'd-wh-far-tomas',
      name: 'Tomas',
      title: 'A newcomer child learning every neighbor',
      pos: [112, 152],
      palette: { robe: 0x6db58f, trim: 0x3f7d5d, skin: 0xd9b07c, hat: 0xeae0d0 },
      hatKind: 'cap',
      keystone: 'd-wh-far-ks-name',            // tapping Tomas opens the NAME keystone
                                                //   (the TOGETHER keystone is his too, after it)
    },
  ],

  // ---- cutscenes: gentle, ONE short line per beat, dusk/amber for warmth ----
  cutscenes: {
    D_WH_FAR_MEETING: [
      {
        tint: 'dusk', kicker: 'Exploration Point',
        text: 'Two newcomers stand at the dock — one raises an open hand, one waits to learn your name.',
      },
      {
        tint: 'amber', art: 'portrait',
        palette: { robe: 0xe06f8a, trim: 0xa84762, skin: 0xcf9a66, hat: 0xf3ead4 },
        kicker: 'Neta, a dock-greeter',
        text: 'Neta smiles and lifts her hand. "Crossing the sea is only half the story. The other half is meeting each other. Help me find the warm words."',
        cta: 'Meet them on the dock',
      },
    ],
  },

  // ---- triggers: fire the meeting once, after the player has crossed to the isle
  // and heard the shipped explore story (so it follows, not pre-empts, the welcome).
  triggers: [
    { on: 'questDone', value: 'st-explore', play: 'D_WH_FAR_MEETING' },
  ],

  // ---- keystones: THE CORE — four NEW tiny word-gifts ----
  // Each follows the gold-standard shape: prompt {en,zh,es}; FULL in-character
  // word-offers (not stems); a WRONG choice never fails — its `reteach` is read
  // aloud, picture-first, and the keystone loops; the RIGHT choice opens `win`,
  // lights a lamp, and writes one true Codex sentence. Bilingual throughout.
  keystones: [
    // ---------- 1) WELCOME ----------
    {
      id: 'd-wh-far-ks-welcome',
      npcId: 'd-wh-far-neta',
      island: 'wh-explore',
      flag: 'dWhFarWelcome',                  // set on success; gates the HAND keystone hint
      pic: 'pray',                            // two people, warm light: a greeting
      prompt: {
        en: 'Neta watches a tired family step off a boat. "After the long crossing, what is the ONE word a stranger most wants to hear at a new shore?" Which word do you give?',
        zh: 'Neta 看着一家疲惫的人下船。"长途航行之后，陌生人在新的岸边最想听到哪一个词？"你给哪个词？',
        es: 'Neta ve a una familia cansada bajar de un bote. "Tras la larga travesía, ¿cuál es la ÚNICA palabra que un desconocido más quiere oír en una orilla nueva?" ¿Qué palabra le das?',
      },
      choices: [
        {
          word: 'welcome', pic: 'pray', right: true,
          label: 'Here is WELCOME — the word that says "I am glad you came; you may stay."',
        },
        {
          // Plausible-but-wrong: a real, true farewell — but it sends people AWAY,
          // the opposite of greeting them in. Reteach: arriving vs. leaving.
          word: 'goodbye', pic: 'boat', right: false,
          label: 'Here is GOODBYE — the word you say when someone is leaving.',
          reteach: {
            en: 'GOODBYE is for when a boat sails AWAY. But this family just ARRIVED — they are staying. What word greets someone who has come, not someone who is going? Try again.',
            zh: 'goodbye 是船要离开时说的。但这家人刚刚到达——他们要留下来。哪个词是欢迎来到的人，而不是要走的人？再试一次。',
            es: 'ADIÓS es para cuando un bote se va. Pero esta familia acaba de LLEGAR: se quedan. ¿Qué palabra saluda a quien ha venido, no a quien se marcha? Inténtalo otra vez.',
          },
        },
        {
          // Plausible-but-wrong: a cautious word a frightened stranger might fear —
          // it tells them to STOP, not that they may stay. Reteach: closed vs. open.
          word: 'wait', pic: 'compass', right: false,
          label: 'Here is WAIT — the word that tells someone to stop and not come closer yet.',
          reteach: {
            en: 'WAIT asks them to stop outside. After crossing a whole sea, a stranger longs to hear the door is OPEN. What warm word invites them in? Look once more.',
            zh: 'wait 是叫人先停在外面。越过整片大海后，陌生人最想听到门是开着的。哪个温暖的词请他们进来？再看一次。',
            es: 'ESPERA les pide quedarse afuera. Tras cruzar un mar entero, un desconocido anhela oír que la puerta está ABIERTA. ¿Qué palabra cálida los invita a pasar? Mira una vez más.',
          },
        },
      ],
      win: {
        pic: 'pray',
        en: 'Neta calls out warmly. "WELCOME!" The tired family lifts their heads and smiles. A lamp lights on the dock, and the first warm word of every meeting is yours.',
        zh: 'Neta 温暖地喊道。"welcome——欢迎你！"疲惫的一家人抬起头，露出微笑。码头上一盏灯亮了，每一次相遇的第一个暖词，是你的了。',
        es: 'Neta llama con calidez. "¡BIENVENIDOS!" La familia cansada levanta la cabeza y sonríe. Una lámpara se enciende en el muelle, y la primera palabra cálida de todo encuentro es tuya.',
      },
      codex: {
        id: 'd_wh_far_welcome',
        group: 'Exploration Point',
        title: 'The word a new shore waits to say',
        idea: 'Across history, whether a far shore became a place of safety or sorrow often turned on one human choice — whether the people already there greeted newcomers with welcome or with fear.',
        source: 'Neta, a dock-greeter of the harbor',
      },
      achievement: 'd_wh_far_neighbors',
      light: 'You gave Neta the word WELCOME, and the far shore is warmer.',
    },

    // ---------- 2) HAND ----------
    {
      id: 'd-wh-far-ks-hand',
      npcId: 'd-wh-far-neta',
      island: 'wh-explore',
      pic: 'pray',
      prompt: {
        en: 'Neta holds out her open palm to a wary traveler. "Long ago, people who could not yet share words still showed they meant no harm. What part of the body, held open, says \'let us meet in peace\'?" Which word do you give?',
        zh: 'Neta 向一位警惕的旅人摊开手掌。"很久以前，还不能用言语交流的人，也能表示自己没有恶意。身体的哪个部位，张开来，表示\'让我们和平相见\'？"你给哪个词？',
        es: 'Neta extiende la palma abierta a un viajero receloso. "Hace mucho, quienes aún no compartían palabras igual mostraban que no querían hacer daño. ¿Qué parte del cuerpo, abierta, dice \'reunámonos en paz\'?" ¿Qué palabra le das?',
      },
      choices: [
        {
          word: 'hand', pic: 'pray', right: true,
          label: 'Here is HAND — held open and empty, it shows you carry no weapon and want to meet.',
        },
        {
          // Plausible-but-wrong: a real tool of crossing, but it is a thing, not a
          // greeting gesture. Reteach: a tool you hold vs. the open hand itself.
          word: 'compass', pic: 'compass', right: false,
          label: 'Here is COMPASS — the little tool that shows which way is north.',
          reteach: {
            en: 'A compass helps you FIND the shore, but it does not greet the people there. Neta means a part of YOU, held open, that says "peace." What do you reach out to a new neighbor? Try again.',
            zh: 'compass 帮你找到岸，但它不会向那里的人打招呼。Neta 说的是你身上张开的、表示"和平"的部位。你向新邻居伸出什么？再试一次。',
            es: 'Una brújula te ayuda a HALLAR la orilla, pero no saluda a la gente. Neta habla de una parte de TI, abierta, que dice "paz". ¿Qué le tiendes a un vecino nuevo? Inténtalo otra vez.',
          },
        },
        {
          // Plausible-but-wrong: a barrier, the opposite of an open hand. Reteach:
          // closed/keeping-out vs. open/meeting.
          word: 'wall', pic: 'wall', right: false,
          label: 'Here is WALL — the high stone that keeps strangers out.',
          reteach: {
            en: 'A WALL keeps people apart — it is the opposite of meeting. Neta wants the open, empty thing you hold out to say "come, let us be friends." Look at her palm once more.',
            zh: 'wall 把人隔开——它和相见正相反。Neta 想要的是你张开、空着伸出来、表示"来吧，做朋友"的东西。再看看她的手掌。',
            es: 'Un MURO separa a la gente: es lo contrario de un encuentro. Neta quiere lo abierto y vacío que tiendes para decir "ven, seamos amigos". Mira su palma una vez más.',
          },
        },
      ],
      win: {
        pic: 'pray',
        en: 'The wary traveler sees Neta\'s open HAND and slowly opens his own. Their palms meet. A lamp lights, and you see how strangers first said "peace" without a single shared word.',
        zh: '警惕的旅人看见 Neta 张开的 hand，也慢慢张开了自己的手。两只手掌相握。一盏灯亮了，你明白了陌生人是怎样不用一个共同的词就说出"和平"的。',
        es: 'El viajero receloso ve la MANO abierta de Neta y abre la suya despacio. Sus palmas se encuentran. Una lámpara se enciende, y ves cómo los desconocidos dijeron "paz" sin una sola palabra compartida.',
      },
      codex: {
        id: 'd_wh_far_hand',
        group: 'Exploration Point',
        title: 'How strangers met before they shared words',
        idea: 'When peoples who spoke no common language met across the seas, gestures like the open, empty hand were the first language of trust — a way to say "I mean no harm" before any word could be exchanged.',
        source: 'Neta, a dock-greeter of the harbor',
      },
      achievement: 'd_wh_far_neighbors',
      light: 'You gave Neta the word HAND, and two strangers met in peace.',
    },

    // ---------- 3) NAME ----------
    {
      id: 'd-wh-far-ks-name',
      npcId: 'd-wh-far-tomas',
      island: 'wh-explore',
      flag: 'dWhFarName',                     // set on success; gates the TOGETHER keystone hint
      pic: 'book',                            // a name written down
      prompt: {
        en: 'Tomas points to himself, then to you. "We met. We are not enemies. But I am still \'the new child\' and you are still \'the stranger.\' What one thing do we share so we stop being strangers?" Which word do you give?',
        zh: 'Tomas 指指自己，再指指你。"我们见过面了。我们不是敌人。但我还是\'那个新来的孩子\'，你还是\'那个陌生人\'。我们交换哪一样东西，就不再是陌生人了？"你给哪个词？',
        es: 'Tomas se señala a sí mismo, luego a ti. "Nos conocimos. No somos enemigos. Pero yo sigo siendo \'el niño nuevo\' y tú sigues siendo \'el desconocido\'. ¿Qué cosa compartimos para dejar de ser extraños?" ¿Qué palabra le das?',
      },
      choices: [
        {
          word: 'name', pic: 'book', right: true,
          label: 'Here is NAME — the word that is only yours, that I can learn and call you by.',
        },
        {
          // Plausible-but-wrong: a thing you can trade, but trading goods is not
          // the same as becoming known to each other. Reteach: goods vs. identity.
          word: 'gift', pic: 'gem', right: false,
          label: 'Here is GIFT — a nice thing you hand to someone.',
          reteach: {
            en: 'A GIFT is kind, but you can hand a gift to a stranger and STILL not know who they are. Tomas wants the word that turns "the stranger" into a real person you can call. Try again.',
            zh: 'gift 很好，但你可以把礼物给陌生人，却仍然不知道他是谁。Tomas 想要的是把"陌生人"变成一个你能叫得出口的真人的那个词。再试一次。',
            es: 'Un REGALO es amable, pero puedes darle un regalo a un desconocido y AÚN así no saber quién es. Tomas quiere la palabra que convierte "el desconocido" en una persona real a quien puedes llamar. Inténtalo otra vez.',
          },
        },
        {
          // Plausible-but-wrong: a real word for a non-native, but it labels people
          // as outsiders rather than letting them be known. Reteach: a label that
          // keeps distance vs. a name that closes it.
          word: 'foreigner', pic: 'sad', right: false,
          label: 'Here is FOREIGNER — a word for a person who came from far away.',
          reteach: {
            en: 'FOREIGNER still keeps you at a distance — it says "from somewhere else," not "this is who you are." Tomas wants the personal word that lets you really know each other. Look once more.',
            zh: 'foreigner 仍然把人推得很远——它说"从别处来的"，而不是"你就是你"。Tomas 想要那个属于个人、能让你们真正认识彼此的词。再看一次。',
            es: 'EXTRANJERO todavía te mantiene a distancia: dice "de otro lugar", no "esto es quién eres". Tomas quiere la palabra personal que les permita conocerse de verdad. Mira una vez más.',
          },
        },
      ],
      win: {
        pic: 'book',
        en: 'Tomas grins. "NAME — yes!" He tells you his, and waits for yours. A lamp lights: now neither of you is "the stranger" — you are two people who know each other.',
        zh: 'Tomas 咧嘴一笑。"name——对！"他告诉你他的名字，等着你的。一盏灯亮了：现在你们谁都不再是"那个陌生人"——你们是认识彼此的两个人。',
        es: 'Tomas sonríe. "¡NOMBRE, sí!" Te dice el suyo y espera el tuyo. Una lámpara se enciende: ya ninguno es "el desconocido": son dos personas que se conocen.',
      },
      codex: {
        id: 'd_wh_far_name',
        group: 'Exploration Point',
        title: 'Sharing a name ends the word "stranger"',
        idea: 'Asking and sharing a name is the small first act that turns two strangers into neighbors — which is why the history of crowded port towns is, at its heart, millions of people learning one another\'s names.',
        source: 'Tomas, a newcomer child of the harbor',
      },
      achievement: 'd_wh_far_neighbors',
      light: 'You gave Tomas the word NAME, and two strangers became known to each other.',
    },

    // ---------- 4) TOGETHER ----------
    {
      id: 'd-wh-far-ks-together',
      npcId: 'd-wh-far-tomas',
      island: 'wh-explore',
      pic: 'town',                            // people + houses: a shared town
      prompt: {
        en: 'Tomas waves at the busy little port: people from many far shores, building one town. "No single family could raise all of this alone. How did they build it?" Which word do you give?',
        zh: 'Tomas 指着热闹的小港口：来自许多远方海岸的人们，正在共同建一座镇。"没有哪一家能独自盖起这一切。他们是怎么建起来的？"你给哪个词？',
        es: 'Tomas saluda al puerto bullicioso: gente de muchas orillas lejanas levantando un solo pueblo. "Ninguna familia sola pudo construir todo esto. ¿Cómo lo construyeron?" ¿Qué palabra le das?',
      },
      choices: [
        {
          word: 'together', pic: 'town', right: true,
          label: 'Here is TOGETHER — many different people, working side by side as one.',
        },
        {
          // Plausible-but-wrong: the opposite — each apart. Reteach: alone vs. side by side.
          word: 'alone', pic: 'sad', right: false,
          label: 'Here is ALONE — just one person, with no one beside them.',
          reteach: {
            en: 'ALONE is one person by themselves — but this town was raised by MANY peoples helping each other. What word means "side by side, as one"? Look at the busy port again.',
            zh: 'alone 是一个人单独——但这座镇是许多民族互相帮助盖起来的。哪个词表示"肩并肩，合为一体"？再看看热闹的港口。',
            es: 'SOLO es una persona por sí misma, pero este pueblo lo levantaron MUCHOS pueblos ayudándose. ¿Qué palabra significa "lado a lado, como uno"? Mira el puerto bullicioso otra vez.',
          },
        },
        {
          // Plausible-but-wrong: a real word for one group only, the opposite of a
          // mixed town built by many. Reteach: one people apart vs. many as one.
          word: 'separate', pic: 'wall', right: false,
          label: 'Here is SEPARATE — kept apart, each group in its own place.',
          reteach: {
            en: 'SEPARATE keeps each group walled off in its own corner. But look — these peoples mixed and built ONE shared town. What word means "different people as one"? Look once more.',
            zh: 'separate 是把每一群人都隔在自己的角落里。但你看——这些民族融合在一起，建起了一座共有的镇。哪个词表示"不同的人合为一体"？再看一次。',
            es: 'SEPARADO mantiene a cada grupo amurallado en su rincón. Pero mira: estos pueblos se mezclaron y construyeron UN pueblo compartido. ¿Qué palabra significa "gente distinta como una"? Mira una vez más.',
          },
        },
      ],
      win: {
        pic: 'town',
        en: 'Tomas throws his arms wide. "TOGETHER — yes!" Lamps glow all across the port at once. You see it whole now: people crossed the sea, met, shared names, and built this new home together.',
        zh: 'Tomas 张开双臂。"together——对！"整个港口的灯一下子都亮了。现在你看到了全部：人们越过大海，相遇，交换名字，一起建起了这个新家。',
        es: 'Tomas abre los brazos de par en par. "¡JUNTOS, sí!" Las lámparas se encienden por todo el puerto a la vez. Ahora lo ves entero: la gente cruzó el mar, se conoció, compartió nombres y construyó este nuevo hogar junta.',
      },
      codex: {
        id: 'd_wh_far_together',
        group: 'Exploration Point',
        title: 'A new home is built together',
        idea: 'Port towns and new lands across history were rarely the work of one people — they were built together by newcomers and old neighbors of many origins, so the meeting of strangers is also the story of how mixed communities are made.',
        source: 'Tomas, a newcomer child of the harbor',
      },
      achievement: 'd_wh_far_neighbors',
      light: 'You gave Tomas the word TOGETHER, and the whole port glows as one town.',
    },
  ],

  // ---- codex: every real idea this pack can teach (mirrors the inlined ids) ----
  codex: [
    {
      id: 'd_wh_far_welcome',
      group: 'Exploration Point',
      title: 'The word a new shore waits to say',
      idea: 'Across history, whether a far shore became a place of safety or sorrow often turned on one human choice — whether the people already there greeted newcomers with welcome or with fear.',
      source: 'Neta, a dock-greeter of the harbor',
    },
    {
      id: 'd_wh_far_hand',
      group: 'Exploration Point',
      title: 'How strangers met before they shared words',
      idea: 'When peoples who spoke no common language met across the seas, gestures like the open, empty hand were the first language of trust — a way to say "I mean no harm" before any word could be exchanged.',
      source: 'Neta, a dock-greeter of the harbor',
    },
    {
      id: 'd_wh_far_name',
      group: 'Exploration Point',
      title: 'Sharing a name ends the word "stranger"',
      idea: 'Asking and sharing a name is the small first act that turns two strangers into neighbors — which is why the history of crowded port towns is, at its heart, millions of people learning one another\'s names.',
      source: 'Tomas, a newcomer child of the harbor',
    },
    {
      id: 'd_wh_far_together',
      group: 'Exploration Point',
      title: 'A new home is built together',
      idea: 'Port towns and new lands across history were rarely the work of one people — they were built together by newcomers and old neighbors of many origins, so the meeting of strangers is also the story of how mixed communities are made.',
      source: 'Tomas, a newcomer child of the harbor',
    },
  ],

  // ---- achievements: one sparse, meaningful milestone ----
  achievements: [
    { id: 'd_wh_far_neighbors', title: 'Strangers no more', desc: 'You gave the four warm words — welcome, hand, name, together — and a shore of strangers became one town of neighbors.' },
  ],
};

export default pack;
