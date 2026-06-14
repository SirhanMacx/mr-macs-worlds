// geography-isle.sample.js — THE GOLD-STANDARD Word Harbor story-pack.
//
// This is the file Workflow-2 authors copy. Read CONTRACT.md first, then read
// THIS, then write your own. It demonstrates EVERY field of the pack contract
// at the craft bar of the shipped world: a real neighbor added to an existing
// island, a one-time warm cutscene, a trigger that fires it, and — the heart of
// the pack — a gentle keystone whose CHOICES are full in-character offers of a
// word (never A/B/C stems), whose WRONG path re-teaches kindly and loops (never
// a red X, never a score), and whose RIGHT path visibly changes the world: a
// lamp lights, the town-light meter rises, and a Codex entry is written.
//
// Curriculum: Global 9 ENL, Geography Isle (the tutorial unit). The real idea
// taught is the FIRST idea historians teach an ENL ninth-grader: GEOGRAPHY —
// the land's shape and place — comes first, because WHERE people live shapes
// HOW they live (a river valley feeds farms; farms feed cities). The neighbor,
// Teku, is a young map-apprentice who has every word but the one that names the
// whole study. Picture-first so an emerging reader succeeds without decoding.
//
// De-identified: Teku and Mira are invented townsfolk; no real names. Honest:
// the concept is real geography; no invented verbatim quotes from real figures.
// Gentle: no fail states, no timers — wrong is "try again from understanding".

export const pack = {
  // ---- identity ----
  id: 'wh-geo-sample',
  unit: 'Geography Isle',                 // the curriculum unit / island label
  title: 'The Apprentice and the First Word',

  // ---- npcs: extra characters placed at an existing island ----
  // Each npc joins the world like the shipped story NPCs: a procedural body at
  // [x,z] (world coords near its island), a portrait palette, and EITHER a
  // `dialogue` tree (openDialogue format) OR `keystone: '<id>'` to make tapping
  // them open a keystone from `keystones` below. A green marker bobs over an NPC
  // that has an unfinished keystone, and goes dark once it is understood.
  npcs: [
    {
      id: 'teku',
      name: 'Teku',
      title: 'A young map-apprentice',
      // Geography Isle is centered at [0,-38] (see worlds/word-harbor.js ISLES).
      // Place Teku on the isle's south path, clear of the Mapmaker at [6,-32].
      pos: [-10, -20],
      palette: { robe: 0x5a7d4f, trim: 0x39512f, skin: 0xd9b07c, hat: 0xcdbf7a },
      hatKind: 'scholar',
      keystone: 'teku-first-word',         // tapping Teku opens this keystone
    },
  ],

  // ---- cutscenes: named playCutscene beat-sequences ----
  // Keyed by a FLAG name. Each is an array of cutscene beats (see cutscene.js:
  // tint amber|dusk|cold|stone, art portrait|candle|ledger|notice|null,
  // palette for portraits, kicker, text, cta). Fired once by a trigger below.
  // Keep Word Harbor's gentle density: ONE short line per beat.
  cutscenes: {
    TEKU_ARRIVES: [
      {
        tint: 'dusk', kicker: 'Geography Isle',
        text: 'A young apprentice sits by the path, a half-drawn map on their knees.',
      },
      {
        tint: 'dusk', art: 'portrait',
        palette: { robe: 0x5a7d4f, trim: 0x39512f, skin: 0xd9b07c, hat: 0xcdbf7a },
        kicker: 'Teku, the map-apprentice',
        text: 'They look up at you, hopeful. "You collect words. I am missing one."',
        cta: 'Sit with Teku',
      },
    ],
  },

  // ---- triggers: when each cutscene fires (once) ----
  // on: 'visit'  value=islandId      → first time the player enters that island
  //     'flag'   value=storyFlag     → when story.is(flag) becomes true
  //     'questDone' value=storyId    → when a story (st-*) is heard
  //     'enter'  value=null/'boot'   → once at boot (rare; use sparingly)
  // play: the cutscenes key to run. reward (optional): { light: <sub-line> }
  // lifts the town-light meter (lightLamp) after the beats finish.
  triggers: [
    { on: 'visit', value: 'wh-geo', play: 'TEKU_ARRIVES' },
  ],

  // ---- keystones: THE CORE — in-character understanding beats ----
  // A keystone is a gentle, picture-first NPC moment. The player advances the
  // warm story by GIVING the word whose MEANING matches what the neighbor needs.
  // Mirrors the shipped Bula keystone shape so the loader can render it with
  // zero new UI. Fields:
  //   id        unique; the npc points at it via `keystone`
  //   npcId     which npc owns it (for marker + re-entry)
  //   island    island id (for the trigger/“where” context)
  //   pic       the scene picture (pics.js kind) shown above the prompt
  //   prompt    { en, zh, es } — the question, simple English, TTS-able
  //   choices   FULL in-character offers of a word (NOT stems). Each:
  //               { word, pic, right:true|false, label, reteach?:{en,zh,es} }
  //             A WRONG choice never fails — `reteach` is read aloud and the
  //             player tries again from understanding (loop). The RIGHT choice
  //             opens `win` and fires the rewards.
  //   win       { pic, en, zh, es } — the warm scene that opens on success.
  //   codex     the Codex entry recorded on success (the real idea understood):
  //               { id, group, title, idea, source }
  //   achievement (optional) id from `achievements` below, unlocked on success.
  //   light     (optional) the lightLamp sub-line shown when the meter rises.
  keystones: [
    {
      id: 'teku-first-word',
      npcId: 'teku',
      island: 'wh-geo',
      pic: 'world',
      prompt: {
        en: 'Teku has drawn rivers, hills and a coast — but cannot name the whole study. "What is the ONE word for the land\'s shape and place?" Which word do you give?',
        zh: 'Teku 画了河流、山丘和海岸，却说不出这门学问的名字。"land 的形状和位置，用哪一个词来说？"你给哪个词？',
        es: 'Teku dibujó ríos, colinas y una costa, pero no sabe nombrar todo el estudio. "¿Cuál es la palabra para la forma y el lugar de la tierra?" ¿Qué palabra le das?',
      },
      choices: [
        {
          word: 'geography', pic: 'world', right: true,
          label: 'Here is GEOGRAPHY — the study of the land\'s shape and place.',
        },
        {
          // Plausible-but-wrong: a real glossary term that names ONE feature,
          // not the whole study. The re-teach narrows from part → whole.
          word: 'river valley', pic: 'river', right: false,
          label: 'Here is RIVER VALLEY — the low green land beside a river.',
          reteach: {
            en: 'A river valley is ONE place on your map. Teku needs the word for ALL of it — the rivers, the hills, the coast together. Look at the whole map again.',
            zh: 'river valley 只是地图上的一个地方。Teku 需要表示全部的词——河流、山丘、海岸合在一起。再看看整张地图。',
            es: 'Un valle fluvial es UN solo lugar del mapa. Teku necesita la palabra para TODO: los ríos, las colinas y la costa juntos. Mira el mapa entero otra vez.',
          },
        },
        {
          // Plausible-but-wrong: another real term, the TOOL not the study.
          // The re-teach distinguishes the tool from what it helps you study.
          word: 'compass', pic: 'compass', right: false,
          label: 'Here is COMPASS — the tool that shows which way is north.',
          reteach: {
            en: 'A compass helps you READ a map, but it is not the study itself. Teku wants the word for learning the land — its shape and where things are. Look once more.',
            zh: 'compass 帮你看地图，但它不是这门学问本身。Teku 想要"研究 land——它的形状和位置"的那个词。再看一次。',
            es: 'Una brújula te ayuda a LEER un mapa, pero no es el estudio en sí. Teku quiere la palabra para estudiar la tierra: su forma y dónde está cada cosa. Mira otra vez.',
          },
        },
      ],
      win: {
        pic: 'world',
        en: 'Teku\'s eyes go wide. "GEOGRAPHY — yes!" They title the map and run to show the Mapmaker. A lamp lights on Geography Isle, and the first word of every history is yours.',
        zh: 'Teku 眼睛一亮。"geography——对！"他们给地图写上标题，跑去给制图师看。地理岛上一盏灯亮了，每段历史的第一个词，是你的了。',
        es: 'Los ojos de Teku se abren. "¡GEOGRAFÍA, sí!" Titulan el mapa y corren a mostrárselo al Cartógrafo. Una lámpara se enciende en la Isla de Geografía, y la primera palabra de toda historia es tuya.',
      },
      // The real idea this keystone teaches — written to the shared Codex on
      // success. `group` buckets it under the unit in the Field Journal.
      codex: {
        id: 'wh_geo_first_word',
        group: 'Geography Isle',
        title: 'Why geography comes first',
        idea: 'Geography is the land\'s shape and place — historians learn it first because WHERE people live shapes HOW they live: a river valley feeds farms, and farms feed cities.',
        source: 'Teku, a map-apprentice of the harbor',
      },
      achievement: 'wh_teku_helped',
      light: 'You gave Teku the first word, and Geography Isle is brighter.',
    },
  ],

  // ---- codex: every real idea this pack can teach ----
  // The loader pre-loads NONE of these; each is recorded only when its keystone
  // is understood (the keystone references it by inlined `codex`, OR by id here
  // if you prefer to keep the prose in one place). Listing them here documents
  // the pack's learning payload and lets a future "study guide" read the set.
  codex: [
    {
      id: 'wh_geo_first_word',
      group: 'Geography Isle',
      title: 'Why geography comes first',
      idea: 'Geography is the land\'s shape and place — historians learn it first because WHERE people live shapes HOW they live: a river valley feeds farms, and farms feed cities.',
      source: 'Teku, a map-apprentice of the harbor',
    },
  ],

  // ---- achievements: optional sparse milestones ----
  achievements: [
    { id: 'wh_teku_helped', title: 'The map has a title', desc: 'You gave Teku the first word of every history.' },
  ],
};

export default pack;
