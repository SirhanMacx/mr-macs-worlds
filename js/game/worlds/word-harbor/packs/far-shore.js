// far-shore.js — a Word Harbor story-pack for EXPLORATION POINT (Far Shore Isle).
//
// Read CONTRACT.md first, then geography-isle.sample.js (the gold standard);
// this file copies that shape exactly and only changes the content. Pure DATA:
// no imports, no engine calls — the defensive loader does all the mechanics, so
// a typo here can never crash the world.
//
// Curriculum: Global 9 ENL, the Exploration + Global Exchange unit. But this is
// the GENTLE, picture-first corner of it — Far Shore Isle — and it mirrors the
// newcomer's OWN journey with dignity: people crossed seas in boats, reached new
// shores, and met new neighbors who welcomed them. The quiet, true idea is that
// arriving somewhere new and being greeted as a neighbor is the whole warm heart
// of the great exchange. Three tiny word-keystones — BOAT, NEW, HOME — each a
// single short word an emerging reader can give, each carrying a real history
// sentence in the Codex.
//
// De-identified: Salu (a quay-greeter), Pio (a ferry-child) and the Navigator
// are invented townsfolk; the only real person ever named in the world is
// "Mr. Maccarello". Honest: the concept is real — long-distance sea voyages and
// the meeting of strangers across oceans are real history; no invented verbatim
// quotes from any real figure. Gentle: no fail states, no timers, no score —
// a wrong word is "try again from understanding," and a kind neighbor re-teaches.

export const pack = {
  // ---- identity ----
  id: 'wh-far-shore',
  unit: 'Exploration Point',                 // the island / unit label shown in panels
  title: 'The Boat, the New Shore, and the Warm Welcome',

  // ---- npcs: extra characters placed on Exploration Point (center [132,156], r50) ----
  // The shipped Navigator sits at [126,150]; place ours clear of that, on the
  // breezy headland. Pio waits down by the water (the boat keystone); Salu, the
  // quay-greeter, stands a little inland with two gentle words to give.
  npcs: [
    {
      id: 'wh-far-shore-pio',
      name: 'Pio',
      title: 'A ferry-child of the harbor',
      pos: [120, 168],
      palette: { robe: 0x5fc4d8, trim: 0x3a8aa0, skin: 0xd9b07c, hat: 0xeae0d0 },
      hatKind: 'cap',
      keystone: 'wh-far-shore-ks-boat',        // tapping Pio opens the BOAT keystone
    },
    {
      id: 'wh-far-shore-salu',
      name: 'Salu',
      title: 'A quay-greeter who welcomes every ship',
      pos: [144, 162],
      palette: { robe: 0xe8b84a, trim: 0xb98a2a, skin: 0xcf9a66, hat: 0xf3ead4 },
      hatKind: 'brim',
      keystone: 'wh-far-shore-ks-new',         // tapping Salu opens the NEW keystone
                                                //   (the HOME keystone unlocks after it)
    },
  ],

  // ---- cutscenes: gentle, ONE short line per beat, dusk/amber for warmth ----
  cutscenes: {
    FAR_SHORE_WELCOME: [
      {
        tint: 'dusk', kicker: 'Exploration Point',
        text: 'A child waves from a small ferry. A greeter stands on the quay, hand raised in welcome.',
      },
      {
        tint: 'amber', art: 'portrait',
        palette: { robe: 0xe8b84a, trim: 0xb98a2a, skin: 0xcf9a66, hat: 0xf3ead4 },
        kicker: 'Salu, the quay-greeter',
        text: 'Salu smiles. "You came a long way over the water. Help me find three small words — you already know them."',
        cta: 'Step onto the shore',
      },
    ],
  },

  // ---- triggers: fire the welcome once, the first time the island is entered ----
  triggers: [
    { on: 'visit', value: 'wh-explore', play: 'FAR_SHORE_WELCOME' },
  ],

  // ---- keystones: THE CORE — three tiny word-gifts ----
  // Each follows the gold-standard shape: prompt {en,zh,es}; FULL in-character
  // word-offers (not stems); a WRONG choice never fails — its `reteach` is read
  // aloud, picture-first, and the keystone loops; the RIGHT choice opens `win`,
  // lights a lamp, and writes one true Codex sentence. Bilingual throughout.
  keystones: [
    // ---------- 1) BOAT ----------
    {
      id: 'wh-far-shore-ks-boat',
      npcId: 'wh-far-shore-pio',
      island: 'wh-explore',
      pic: 'boat',
      prompt: {
        en: 'Pio points at the wide sea. "People crossed all THAT water to reach a new shore. What did they ride across the sea?" Which word do you give?',
        zh: 'Pio 指着宽阔的大海。"人们越过那么多的水，才到达新的岸边。他们坐什么过海？"你给哪个词？',
        es: 'Pio señala el ancho mar. "La gente cruzó TODA esa agua para llegar a una orilla nueva. ¿En qué cruzaron el mar?" ¿Qué palabra le das?',
      },
      choices: [
        {
          word: 'boat', pic: 'boat', right: true,
          label: 'Here is BOAT — the thing that carries people across the water.',
        },
        {
          // Plausible-but-wrong: a real tool sailors used, but it is not what
          // carries you — it only helps you find the way. Reteach: tool vs. vessel.
          word: 'compass', pic: 'compass', right: false,
          label: 'Here is COMPASS — the little tool that shows which way is north.',
          reteach: {
            en: 'A compass shows the WAY, but it does not carry you. To cross the sea you need the thing you ride IN. Look at the water again — what floats?',
            zh: 'compass 指方向，但它不载你。要过海，你需要可以坐进去的那个东西。再看看水面——什么会漂在水上？',
            es: 'La brújula muestra el CAMINO, pero no te lleva. Para cruzar el mar necesitas algo en lo que viajas. Mira el agua otra vez: ¿qué flota?',
          },
        },
        {
          // Plausible-but-wrong: the destination, not the vehicle. Reteach:
          // where you arrive vs. what carried you there.
          word: 'shore', pic: 'town', right: false,
          label: 'Here is SHORE — the edge of the land where the sea ends.',
          reteach: {
            en: 'The shore is WHERE you arrive — it is the land, not the ride. Pio asks what carried people OVER the water. Look at the sea once more.',
            zh: 'shore 是你到达的地方——它是陆地，不是工具。Pio 问的是什么载着人们越过水面。再看一次大海。',
            es: 'La orilla es DONDE llegas: es la tierra, no el medio. Pio pregunta qué llevó a la gente SOBRE el agua. Mira el mar una vez más.',
          },
        },
      ],
      win: {
        pic: 'boat',
        en: 'Pio claps. "BOAT — yes!" A little ferry rocks at the dock, ready. A lamp lights on the shore, and you understand how every traveler — and you — first came.',
        zh: 'Pio 拍手。"boat——对！"一只小船在码头上轻轻摇晃，准备好了。岸边一盏灯亮了，你明白了每个旅人——还有你——最初是怎么来的。',
        es: 'Pio aplaude. "¡BOTE, sí!" Un pequeño transbordador se mece en el muelle, listo. Una lámpara se enciende en la orilla, y entiendes cómo llegó cada viajero, y tú también.',
      },
      codex: {
        id: 'wh_far_shore_boat',
        group: 'Exploration Point',
        title: 'How people crossed the sea',
        idea: 'For most of history the only way to reach a far shore was by boat — so the boat is what carried travelers, traders, and newcomers across the open water to new lands.',
        source: 'Pio, a ferry-child of the harbor',
      },
      achievement: 'wh_far_shore_welcomed',
      light: 'You gave Pio the word BOAT, and the far shore is brighter.',
    },

    // ---------- 2) NEW ----------
    {
      id: 'wh-far-shore-ks-new',
      npcId: 'wh-far-shore-salu',
      island: 'wh-explore',
      flag: 'whFarShoreNew',                  // set on success; gates the HOME keystone hint
      pic: 'world',
      prompt: {
        en: 'Salu gestures at the unfamiliar hills. "When the boat lands, the place is not the one you left. Everything is _____ to you. Which word fits?"',
        zh: 'Salu 指着陌生的山丘。"船靠岸时，这里不是你离开的地方。对你来说，一切都是 _____ 的。哪个词合适？"',
        es: 'Salu señala las colinas desconocidas. "Cuando el bote llega, el lugar no es el que dejaste. Para ti, todo es _____. ¿Qué palabra encaja?"',
      },
      choices: [
        {
          word: 'new', pic: 'world', right: true,
          label: 'Here is NEW — something you have not seen or known before.',
        },
        {
          // Plausible-but-wrong opposite: a real, common word, but it means the
          // place you already know. Reteach: opposite meaning, gently.
          word: 'old', pic: 'town', right: false,
          label: 'Here is OLD — something that has been here a long time and you know well.',
          reteach: {
            en: 'OLD means the place you already know — your home before. But the far shore is one you have NOT seen yet. What is the opposite of old? Try once more.',
            zh: 'old 是你已经熟悉的地方——你以前的家。但远处的岸是你还没见过的。old 的反义词是什么？再试一次。',
            es: 'VIEJO es el lugar que ya conoces, tu hogar de antes. Pero la orilla lejana aún NO la has visto. ¿Cuál es lo contrario de viejo? Inténtalo otra vez.',
          },
        },
        {
          // Plausible-but-wrong: describes distance, not unfamiliarity.
          word: 'far', pic: 'compass', right: false,
          label: 'Here is FAR — a long way away from where you are.',
          reteach: {
            en: 'FAR tells how big the DISTANCE is. But Salu means the shore is one you do not KNOW yet — strange and unseen. What word means "not known before"? Look again.',
            zh: 'far 说的是距离有多远。但 Salu 的意思是这片岸你还不认识——陌生、没见过。哪个词表示"以前不知道"？再看看。',
            es: 'LEJOS dice qué tan grande es la DISTANCIA. Pero Salu quiere decir que la orilla aún no la CONOCES: extraña y nunca vista. ¿Qué palabra significa "no conocido antes"? Mira otra vez.',
          },
        },
      ],
      win: {
        pic: 'world',
        en: 'Salu nods warmly. "NEW — yes." The strange hills feel a little friendlier now. A lamp lights, and the far shore becomes a place you can begin to learn.',
        zh: 'Salu 温暖地点点头。"new——对。"陌生的山丘现在感觉亲切了一点。一盏灯亮了，远处的岸成了你可以开始认识的地方。',
        es: 'Salu asiente con calidez. "NUEVO, sí." Las colinas extrañas se sienten un poco más amables ahora. Una lámpara se enciende, y la orilla lejana se vuelve un lugar que puedes empezar a conocer.',
      },
      codex: {
        id: 'wh_far_shore_new',
        group: 'Exploration Point',
        title: 'A new shore is one you must learn',
        idea: 'When sea voyages brought people to lands they had never seen, everything — the plants, the food, the neighbors — was new, and learning that new place is how a stranger slowly becomes a settler.',
        source: 'Salu, a quay-greeter of the harbor',
      },
      achievement: 'wh_far_shore_welcomed',
      light: 'You gave Salu the word NEW, and the far shore is brighter.',
    },

    // ---------- 3) HOME ----------
    {
      id: 'wh-far-shore-ks-home',
      npcId: 'wh-far-shore-salu',
      island: 'wh-explore',
      pic: 'town',
      prompt: {
        en: 'Salu opens both arms to the little town. "You crossed the water. You met new neighbors. Now this place can become _____ to you, too. Which word do you give?"',
        zh: 'Salu 向小镇张开双臂。"你越过了水。你遇见了新邻居。现在这里也可以成为你的 _____。你给哪个词？"',
        es: 'Salu abre los brazos hacia el pueblito. "Cruzaste el agua. Conociste vecinos nuevos. Ahora este lugar también puede volverse tu _____. ¿Qué palabra le das?"',
      },
      choices: [
        {
          word: 'home', pic: 'town', right: true,
          label: 'Here is HOME — the place where you belong and people welcome you.',
        },
        {
          // Plausible-but-wrong: where you arrived, but not yet a place of belonging.
          word: 'shore', pic: 'world', right: false,
          label: 'Here is SHORE — the edge of the land where your boat first touched.',
          reteach: {
            en: 'The shore is where you LANDED — the first step. But Salu means the place that becomes YOURS, where neighbors know you. What word means the place you belong? Try again.',
            zh: 'shore 是你上岸的地方——第一步。但 Salu 说的是变成你自己的、邻居认识你的地方。哪个词表示你归属的地方？再试一次。',
            es: 'La orilla es donde DESEMBARCASTE: el primer paso. Pero Salu quiere decir el lugar que se vuelve TUYO, donde los vecinos te conocen. ¿Qué palabra es el lugar al que perteneces? Inténtalo otra vez.',
          },
        },
        {
          // Plausible-but-wrong: a stranger you have not met, the opposite of belonging.
          word: 'stranger', pic: 'sad', right: false,
          label: 'Here is STRANGER — a person you do not know yet.',
          reteach: {
            en: 'You WERE a stranger when your boat first landed — but Salu and your neighbors welcomed you. Now you are not strange here. What does a welcomed place become? Look once more.',
            zh: '你的船刚靠岸时，你曾是 stranger——但 Salu 和邻居们欢迎了你。现在你在这里不陌生了。一个被欢迎的地方会变成什么？再看一次。',
            es: 'ERAS un desconocido cuando tu bote llegó, pero Salu y tus vecinos te dieron la bienvenida. Ahora ya no eres extraño aquí. ¿En qué se convierte un lugar que te acoge? Mira una vez más.',
          },
        },
      ],
      win: {
        pic: 'town',
        en: 'Salu\'s eyes shine. "HOME — yes. Welcome." Lamps glow all along the little street. The far shore is no longer far: it is where you belong now, neighbor.',
        zh: 'Salu 眼里闪着光。"home——对。欢迎你。"小街上一盏盏灯亮起来。远处的岸不再遥远：现在它是你归属的地方，邻居。',
        es: 'Los ojos de Salu brillan. "HOGAR, sí. Bienvenido." Las lámparas iluminan toda la callecita. La orilla lejana ya no está lejos: ahora es el lugar al que perteneces, vecino.',
      },
      codex: {
        id: 'wh_far_shore_home',
        group: 'Exploration Point',
        title: 'A far shore becomes home',
        idea: 'People who crossed the seas met new neighbors and, over time, made the new land their home — which is why the meeting of strangers across oceans is also a story of welcome, not only of voyages.',
        source: 'Salu, a quay-greeter of the harbor',
      },
      achievement: 'wh_far_shore_welcomed',
      light: 'You gave Salu the word HOME, and the whole far shore glows with welcome.',
    },
  ],

  // ---- codex: every real idea this pack can teach (mirrors the inlined ids) ----
  codex: [
    {
      id: 'wh_far_shore_boat',
      group: 'Exploration Point',
      title: 'How people crossed the sea',
      idea: 'For most of history the only way to reach a far shore was by boat — so the boat is what carried travelers, traders, and newcomers across the open water to new lands.',
      source: 'Pio, a ferry-child of the harbor',
    },
    {
      id: 'wh_far_shore_new',
      group: 'Exploration Point',
      title: 'A new shore is one you must learn',
      idea: 'When sea voyages brought people to lands they had never seen, everything — the plants, the food, the neighbors — was new, and learning that new place is how a stranger slowly becomes a settler.',
      source: 'Salu, a quay-greeter of the harbor',
    },
    {
      id: 'wh_far_shore_home',
      group: 'Exploration Point',
      title: 'A far shore becomes home',
      idea: 'People who crossed the seas met new neighbors and, over time, made the new land their home — which is why the meeting of strangers across oceans is also a story of welcome, not only of voyages.',
      source: 'Salu, a quay-greeter of the harbor',
    },
  ],

  // ---- achievements: one sparse, meaningful milestone ----
  achievements: [
    { id: 'wh_far_shore_welcomed', title: 'Welcome to the far shore', desc: 'You gave the three small words — boat, new, home — and a newcomer became a neighbor.' },
  ],
};

export default pack;
