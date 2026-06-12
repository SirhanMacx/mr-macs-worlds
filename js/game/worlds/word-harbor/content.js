// content.js — WORD HARBOR content database (Global 9 ENL).
// Everything here maps to Jon's REAL ENL course: Geography unit first, the
// 244-term trilingual glossary as the loot system, MODS-style practice as
// festival games, and the Time Travel Festival as the capstone.
// Simple-English rule: story lines stay at or under 12 words.
// De-identified: no student or colleague names anywhere. Zero emoji.

// ---------------- islands ----------------
// Which glossary categories drop their word-gems on which island.
// (Buildings below are keyed to whole categories; gems remember both.)
export const ISLANDS = [
  {
    id: 'home', name: 'Harbor Town',
    pick: ['region', 'century', 'timeline'],
    blurb: 'Your new home. Three words washed ashore with your boat.',
  },
  {
    id: 'wh-geo', name: 'Geography Isle', tutorial: true,
    cats: ['Skills + Exam Words'],
    pick: ['geography', 'climate', 'river valley', 'fertile', 'monsoon', 'subcontinent'],
    blurb: 'Start here. Learn the compass and the words historians use.',
  },
  {
    id: 'wh-paleo', name: 'Paleo Valley',
    pick: ['Paleolithic Era', 'Neolithic Revolution', 'agriculture', 'domestication', 'nomad',
      'hunter-gatherer', 'surplus', 'specialization', 'artifact', 'archaeologist'],
    blurb: 'Old hills where the first people hunted, gathered, then farmed.',
  },
  {
    id: 'wh-river', name: 'River Lands',
    pick: ['irrigation', 'civilization', 'city-state', 'empire', 'cultural diffusion', 'Mesopotamia',
      'cuneiform', 'ziggurat', 'Code of Hammurabi', 'law code', 'scribe', 'pharaoh', 'hieroglyphics',
      'papyrus', 'dynasty', 'Mandate of Heaven', 'filial piety'],
    cats: ['Belief Systems'],
    blurb: 'Green river fields where cities and beliefs first grew.',
  },
  {
    id: 'wh-classical', name: 'Classical Heights',
    cats: ['Classical Civilizations'],
    blurb: 'Marble heights of Greece, Rome, India and China.',
  },
  {
    id: 'wh-caravan', name: 'Caravan Coast',
    cats: ['Trade Networks + Encounters', 'Africa + the Americas'],
    blurb: 'Warm dunes where caravans and ships traded the world.',
  },
  {
    id: 'wh-ren', name: 'Renaissance Quay',
    cats: ['Medieval Worlds', 'Renaissance + Reformation + New Science'],
    blurb: 'A walled quay of castles, scholars and new ideas.',
  },
  {
    id: 'wh-explore', name: 'Exploration Point',
    cats: ['Exploration + Global Exchange'],
    blurb: 'A breezy headland where the great voyages began.',
  },
];

// ---------------- town buildings (one per glossary category) ----------------
// cost = how many word-gems of that category you must have collected.
// Building a house "moves the words in" — they stay browsable forever.
export const BUILDINGS = [
  { id: 'b-skills', cat: 'Skills + Exam Words', name: 'School of Scribes', kind: 'archive', color: 0x67c587, cost: 8, plot: [-14, 86], blurb: 'Where young historians learn the exam words.' },
  { id: 'b-geo', cat: 'Geography + First Civilizations', name: 'River Granary', kind: 'ziggurat', color: 0xe0b54e, cost: 8, plot: [14, 84], blurb: 'A granary for the first farming words.' },
  { id: 'b-belief', cat: 'Belief Systems', name: 'Quiet Temple', kind: 'shrine', color: 0xb78ee8, cost: 8, plot: [-28, 94], blurb: 'A calm home for the belief words.' },
  { id: 'b-classical', cat: 'Classical Civilizations', name: 'Marble Forum', kind: 'forum', color: 0xf09a62, cost: 8, plot: [28, 92], blurb: 'Columns for the classical words.' },
  { id: 'b-trade', cat: 'Trade Networks + Encounters', name: 'Caravan Market', kind: 'caravanserai', color: 0xe8c46a, cost: 8, plot: [-34, 106], blurb: 'A market where the trade words meet.' },
  { id: 'b-medieval', cat: 'Medieval Worlds', name: 'Harbor Keep', kind: 'citadel', color: 0x8a9bd8, cost: 8, plot: [34, 104], blurb: 'A small castle for the medieval words.' },
  { id: 'b-africa', cat: 'Africa + the Americas', name: 'Story Circle', kind: 'stonecircle', color: 0x6fbf9a, cost: 8, plot: [-20, 118], blurb: 'A circle of stones for the storytellers.' },
  { id: 'b-ren', cat: 'Renaissance + Reformation + New Science', name: 'Print Workshop', kind: 'stoa', color: 0xe87a8a, cost: 8, plot: [20, 118], blurb: 'A workshop for the new ideas.' },
  { id: 'b-explore', cat: 'Exploration + Global Exchange', name: 'Harbor Lighthouse', kind: 'lighthouse', color: 0x5fc4d8, cost: 8, plot: [0, 76], blurb: 'A light for every ship that arrives, like yours.' },
];

// ---------------- sentence-bridges ----------------
// Each bridge spans a ford. `words` is the sentence IN ORDER; `gems` are the
// glossary terms inside it that you must have collected to start building.
// Wrong order = a friendly wobble and a free retry. Never a penalty.
export const BRIDGES = [
  {
    id: 'br-geo', from: 'home', to: 'wh-geo',
    a: [0, 36], b: [0, 6],
    name: 'Compass Bridge',
    words: ['This', 'region', 'is', 'our', 'new', 'home'],
    gems: ['region'],
    zh: '这个地区是我们的新家。', es: 'Esta region es nuestro nuevo hogar.',
  },
  {
    id: 'br-paleo', from: 'wh-geo', to: 'wh-paleo',
    a: [-40, -70], b: [-90, -96],
    name: 'Climate Bridge',
    words: ['Climate', 'shapes', 'how', 'people', 'live'],
    gems: ['climate'],
    zh: '气候决定人们怎样生活。', es: 'El clima determina como vive la gente.',
  },
  {
    id: 'br-river', from: 'wh-geo', to: 'wh-river',
    a: [40, -70], b: [90, -96],
    name: 'River Bridge',
    words: ['Fertile', 'river', 'valleys', 'gave', 'people', 'food'],
    gems: ['river valley', 'fertile'],
    zh: '肥沃的河谷给人们食物。', es: 'Los valles fertiles de los rios dieron comida a la gente.',
  },
  {
    id: 'br-classical', from: 'wh-paleo', to: 'wh-classical',
    a: [-174, -80], b: [-190, -40],
    name: 'Surplus Bridge',
    words: ['Farming', 'gave', 'people', 'a', 'food', 'surplus'],
    gems: ['surplus', 'agriculture'],
    zh: '农业给了人们多余的食物。', es: 'La agricultura dio a la gente un excedente de comida.',
  },
  {
    id: 'br-caravan', from: 'wh-river', to: 'wh-caravan',
    a: [174, -80], b: [190, -40],
    name: 'Empire Bridge',
    words: ['Trade', 'made', 'the', 'empire', 'rich'],
    gems: ['empire'],
    zh: '贸易让帝国变得富有。', es: 'El comercio hizo rico al imperio.',
  },
  {
    id: 'br-ren', from: 'wh-classical', to: 'wh-ren',
    a: [-184, 54], b: [-162, 110],
    name: 'Aqueduct Bridge',
    words: ['Rome', 'built', 'roads', 'and', 'aqueducts'],
    gems: ['aqueduct', 'republic'],
    zh: '罗马修建了道路和引水渠。', es: 'Roma construyo caminos y acueductos.',
  },
  {
    id: 'br-explore', from: 'wh-caravan', to: 'wh-explore',
    a: [184, 54], b: [162, 114],
    name: 'Navigator Bridge',
    words: ['Sailors', 'used', 'navigation', 'and', 'the', 'compass'],
    gems: ['navigation', 'compass'],
    zh: '水手使用导航和指南针。', es: 'Los marineros usaban la navegacion y la brujula.',
  },
];

// ---------------- story quests ----------------
// Picture-first dialogues in simple English. Every line is at most 12 words,
// TTS-able, and carries a 中文 + Español hint. `pic` keys a procedural scene.
// Speakers are friendly invented townsfolk — no real people, de-identified.
export const STORIES = [
  {
    id: 'st-arrive', island: 'home', npc: 'The Harbor Guide',
    title: 'You Arrive', npcPos: [4, 112],
    palette: { robe: 0x4d8f86, trim: 0x2f4f4a, skin: 0xd9a066, hat: 0xd8b27a }, hatKind: 'brim',
    lines: [
      { pic: 'boat', en: 'Welcome. You came by boat, like many of us.',
        zh: '欢迎。你坐船来，和我们很多人一样。', es: 'Bienvenido. Llegaste en barco, como muchos de nosotros.' },
      { pic: 'town', en: 'This town is new. We build it with words.',
        zh: '这个镇是新的。我们用词语来建造它。', es: 'Este pueblo es nuevo. Lo construimos con palabras.' },
      { pic: 'gem', en: 'Find word-gems. Tap them to hear each word.',
        zh: '找到词语宝石。点一下就能听到词语。', es: 'Busca gemas de palabras. Tocalas para escuchar cada palabra.' },
      { pic: 'compass', en: 'Go north to Geography Isle. Learn the compass first.',
        zh: '往北去地理岛。先学指南针。', es: 'Ve al norte, a la Isla de Geografia. Aprende la brujula primero.' },
    ],
  },
  {
    id: 'st-geo', island: 'wh-geo', npc: 'The Mapmaker',
    title: 'The Compass and the World', npcPos: [6, -32],
    palette: { robe: 0x5a7d4f, trim: 0x39512f, skin: 0xb97f4e, hat: 0x6b8f5d }, hatKind: 'scholar',
    lines: [
      { pic: 'compass', en: 'A map shows the land. A compass shows direction.',
        zh: '地图显示土地。指南针显示方向。', es: 'Un mapa muestra la tierra. Una brujula muestra la direccion.' },
      { pic: 'world', en: 'Our world has seven continents and five oceans.',
        zh: '我们的世界有七大洲和五大洋。', es: 'Nuestro mundo tiene siete continentes y cinco oceanos.' },
      { pic: 'river', en: 'People settle near rivers. Water means life.',
        zh: '人们在河边定居。水就是生命。', es: 'La gente vive cerca de los rios. El agua es vida.' },
      { pic: 'gem', en: 'Collect the skill words here. Historians use them daily.',
        zh: '在这里收集技能词。历史学家每天都用。', es: 'Reune las palabras de destrezas aqui. Los historiadores las usan.' },
    ],
  },
  {
    id: 'st-paleo', island: 'wh-paleo', npc: 'The Old Forager',
    title: 'Before the Farms', npcPos: [-132, -120],
    palette: { robe: 0x8a6a44, trim: 0x5d472e, skin: 0x8a5a33, hat: 0x6e5638 }, hatKind: 'hood',
    lines: [
      { pic: 'fire', en: 'Long ago, people moved with the animals.',
        zh: '很久以前，人们跟着动物迁移。', es: 'Hace mucho tiempo, la gente se movia con los animales.' },
      { pic: 'hunt', en: 'We hunted, we gathered. We were nomads.',
        zh: '我们打猎，我们采集。我们是游牧民。', es: 'Cazabamos y recolectabamos. Eramos nomadas.' },
      { pic: 'farm', en: 'Then we learned to farm. Everything changed.',
        zh: '后来我们学会了耕种。一切都变了。', es: 'Luego aprendimos a cultivar. Todo cambio.' },
      { pic: 'town', en: 'With extra food, villages grew. Jobs became special.',
        zh: '有了多余的食物，村庄长大了。工作变得专门。', es: 'Con comida extra, los pueblos crecieron. Los trabajos se especializaron.' },
    ],
  },
  {
    id: 'st-river', island: 'wh-river', npc: 'The River Scribe',
    title: 'Cities by the Water', npcPos: [132, -120],
    palette: { robe: 0xc9a25e, trim: 0x8a6a3a, skin: 0xd9a066, hat: 0x3c3428 }, hatKind: 'cap',
    lines: [
      { pic: 'river', en: 'The river floods. The soil turns rich and fertile.',
        zh: '河水泛滥。土壤变得肥沃。', es: 'El rio se desborda. La tierra se vuelve fertil.' },
      { pic: 'ziggurat', en: 'We built cities, temples and the first writing.',
        zh: '我们建造了城市、神庙和最早的文字。', es: 'Construimos ciudades, templos y la primera escritura.' },
      { pic: 'law', en: 'Hammurabi wrote laws on a tall stone.',
        zh: '汉谟拉比把法律刻在高高的石头上。', es: 'Hammurabi escribio leyes en una piedra alta.' },
      { pic: 'pray', en: 'By these rivers, great beliefs were born too.',
        zh: '在这些河边，伟大的信仰也诞生了。', es: 'Junto a estos rios tambien nacieron grandes creencias.' },
    ],
  },
  {
    id: 'st-classical', island: 'wh-classical', npc: 'The Stoneworker',
    title: 'Marble and Law', npcPos: [-202, 14],
    palette: { robe: 0xe8e2d4, trim: 0x9a8f7a, skin: 0xd9b07c, hat: 0x9a8f7a }, hatKind: 'none',
    lines: [
      { pic: 'temple', en: 'Greece tried democracy. Citizens voted in the city.',
        zh: '希腊尝试了民主。公民在城里投票。', es: 'Grecia probo la democracia. Los ciudadanos votaban en la ciudad.' },
      { pic: 'law', en: 'Rome wrote its laws on Twelve Tables.',
        zh: '罗马把法律写在十二铜表上。', es: 'Roma escribio sus leyes en las Doce Tablas.' },
      { pic: 'road', en: 'Roman roads and aqueducts connected the empire.',
        zh: '罗马的道路和引水渠连接了帝国。', es: 'Los caminos y acueductos romanos conectaban el imperio.' },
      { pic: 'wall', en: 'Far away, China built walls and golden ages.',
        zh: '在远方，中国修建长城，迎来盛世。', es: 'Lejos, China construyo murallas y edades de oro.' },
    ],
  },
  {
    id: 'st-caravan', island: 'wh-caravan', npc: 'The Caravan Keeper',
    title: 'Roads of Gold and Silk', npcPos: [202, 14],
    palette: { robe: 0xb97f4e, trim: 0x7a5a33, skin: 0x8a5a33, hat: 0xd8b27a }, hatKind: 'turban',
    lines: [
      { pic: 'camel', en: 'Camels crossed the desert with gold and salt.',
        zh: '骆驼带着黄金和盐穿过沙漠。', es: 'Los camellos cruzaban el desierto con oro y sal.' },
      { pic: 'boat', en: 'Ships followed the monsoon winds across the ocean.',
        zh: '船跟着季风穿过大海。', es: 'Los barcos seguian los vientos monzones por el oceano.' },
      { pic: 'king', en: 'Mansa Musa carried so much gold to Mecca.',
        zh: '曼萨·穆萨带着很多黄金去麦加。', es: 'Mansa Musa llevo muchisimo oro a La Meca.' },
      { pic: 'gem', en: 'Trade moved goods, ideas and, sadly, disease.',
        zh: '贸易带来货物、思想，可惜也带来疾病。', es: 'El comercio movio bienes, ideas y, tristemente, enfermedades.' },
    ],
  },
  {
    id: 'st-ren', island: 'wh-ren', npc: 'The Printer',
    title: 'New Ideas', npcPos: [-126, 146],
    palette: { robe: 0x8a5d5d, trim: 0x5d3c3c, skin: 0xd9a066, hat: 0x3c3428 }, hatKind: 'brim',
    lines: [
      { pic: 'castle', en: 'In the Middle Ages, lords and knights ruled manors.',
        zh: '在中世纪，领主和骑士统治庄园。', es: 'En la Edad Media, senores y caballeros gobernaban las haciendas.' },
      { pic: 'book', en: 'Then artists and scholars looked at people again.',
        zh: '后来，艺术家和学者重新关注人。', es: 'Luego los artistas y eruditos volvieron a mirar al ser humano.' },
      { pic: 'press', en: 'My printing press copies a book in days.',
        zh: '我的印刷机几天就能印一本书。', es: 'Mi imprenta copia un libro en dias.' },
      { pic: 'world', en: 'Cheap books spread new ideas across Europe fast.',
        zh: '便宜的书让新思想快速传遍欧洲。', es: 'Los libros baratos difundieron ideas nuevas por Europa.' },
    ],
  },
  {
    id: 'st-explore', island: 'wh-explore', npc: 'The Navigator',
    title: 'Across the Ocean', npcPos: [126, 150],
    palette: { robe: 0x33658a, trim: 0x234a66, skin: 0xd9b07c, hat: 0x234a66 }, hatKind: 'brim',
    lines: [
      { pic: 'astrolabe', en: 'With a compass and astrolabe, we crossed oceans.',
        zh: '靠指南针和星盘，我们横渡大洋。', es: 'Con brujula y astrolabio cruzamos los oceanos.' },
      { pic: 'boat', en: 'New foods crossed the sea in both directions.',
        zh: '新的食物从海的两边来来往往。', es: 'Nuevas comidas cruzaron el mar en ambas direcciones.' },
      { pic: 'sad', en: 'But many people were hurt. Honest history remembers them.',
        zh: '但许多人受到伤害。诚实的历史记住他们。', es: 'Pero muchas personas sufrieron. La historia honesta las recuerda.' },
      { pic: 'town', en: 'The whole world became connected, like your new town.',
        zh: '整个世界连在了一起，就像你的新镇。', es: 'El mundo entero quedo conectado, como tu nuevo pueblo.' },
    ],
  },
];

// ---------------- festival games ----------------
// Picture-match pairs: glossary term → procedural icon. Gentle, no timers.
export const PICTURE_PAIRS = [
  { term: 'compass', pic: 'compass' },
  { term: 'river valley', pic: 'river' },
  { term: 'ziggurat', pic: 'ziggurat' },
  { term: 'pharaoh', pic: 'king' },
  { term: 'caravan', pic: 'camel' },
  { term: 'Great Wall', pic: 'wall' },
  { term: 'printing press', pic: 'press' },
  { term: 'caravel', pic: 'boat' },
  { term: 'astrolabe', pic: 'astrolabe' },
  { term: 'mosque', pic: 'temple' },
  { term: 'knight', pic: 'castle' },
  { term: 'irrigation', pic: 'farm' },
];

// Word-sort: rounds of two friendly category bins.
export const SORT_ROUNDS = [
  {
    a: { label: 'Geography words', cat: 'Geography + First Civilizations' },
    b: { label: 'Belief words', cat: 'Belief Systems' },
    terms: [
      { en: 'irrigation', cat: 'Geography + First Civilizations' },
      { en: 'monsoon', cat: 'Geography + First Civilizations' },
      { en: 'fertile', cat: 'Geography + First Civilizations' },
      { en: 'cuneiform', cat: 'Geography + First Civilizations' },
      { en: 'monotheism', cat: 'Belief Systems' },
      { en: 'reincarnation', cat: 'Belief Systems' },
      { en: 'Torah', cat: 'Belief Systems' },
      { en: 'Five Pillars of Islam', cat: 'Belief Systems' },
    ],
  },
  {
    a: { label: 'Trade words', cat: 'Trade Networks + Encounters' },
    b: { label: 'Exploration words', cat: 'Exploration + Global Exchange' },
    terms: [
      { en: 'caravan', cat: 'Trade Networks + Encounters' },
      { en: 'Silk Roads', cat: 'Trade Networks + Encounters' },
      { en: 'barter', cat: 'Trade Networks + Encounters' },
      { en: 'oasis', cat: 'Trade Networks + Encounters' },
      { en: 'caravel', cat: 'Exploration + Global Exchange' },
      { en: 'Columbian Exchange', cat: 'Exploration + Global Exchange' },
      { en: 'colony', cat: 'Exploration + Global Exchange' },
      { en: 'cartography', cat: 'Exploration + Global Exchange' },
    ],
  },
  {
    a: { label: 'Classical words', cat: 'Classical Civilizations' },
    b: { label: 'Medieval words', cat: 'Medieval Worlds' },
    terms: [
      { en: 'democracy', cat: 'Classical Civilizations' },
      { en: 'republic', cat: 'Classical Civilizations' },
      { en: 'aqueduct', cat: 'Classical Civilizations' },
      { en: 'senate', cat: 'Classical Civilizations' },
      { en: 'feudalism', cat: 'Medieval Worlds' },
      { en: 'knight', cat: 'Medieval Worlds' },
      { en: 'samurai', cat: 'Medieval Worlds' },
      { en: 'Magna Carta', cat: 'Medieval Worlds' },
    ],
  },
];

// ---------------- Time Travel Festival (the capstone) ----------------
// Mirrors the real ENL final: pick a civilization, "visit" it through a
// picture-dialogue, then present three sentences you built on the bridges.
export const TIME_TRAVEL = [
  {
    id: 'tt-egypt', name: 'Ancient Egypt', pic: 'king',
    visit: [
      { pic: 'river', en: 'You travel back. The Nile shines under the sun.',
        zh: '你回到过去。尼罗河在阳光下闪闪发光。', es: 'Viajas al pasado. El Nilo brilla bajo el sol.' },
      { pic: 'ziggurat', en: 'Workers raise great stone monuments for the pharaoh.',
        zh: '工人为法老建造巨大的石头纪念碑。', es: 'Los trabajadores levantan grandes monumentos de piedra para el faraon.' },
      { pic: 'law', en: 'Scribes write with hieroglyphics on papyrus.',
        zh: '书吏用象形文字写在纸莎草上。', es: 'Los escribas escriben con jeroglificos sobre papiro.' },
    ],
  },
  {
    id: 'tt-rome', name: 'Ancient Rome', pic: 'temple',
    visit: [
      { pic: 'road', en: 'You travel back. Every road leads to Rome.',
        zh: '你回到过去。条条大路通罗马。', es: 'Viajas al pasado. Todos los caminos llevan a Roma.' },
      { pic: 'temple', en: 'The senate argues. The forum is loud and alive.',
        zh: '元老院在辩论。广场热闹而有活力。', es: 'El senado debate. El foro esta lleno de vida.' },
      { pic: 'law', en: 'Laws on Twelve Tables protect the citizens.',
        zh: '十二铜表上的法律保护公民。', es: 'Las leyes de las Doce Tablas protegen a los ciudadanos.' },
    ],
  },
  {
    id: 'tt-mali', name: 'The Mali Empire', pic: 'camel',
    visit: [
      { pic: 'camel', en: 'You travel back. A gold caravan crosses the sand.',
        zh: '你回到过去。一支黄金商队穿过沙漠。', es: 'Viajas al pasado. Una caravana de oro cruza la arena.' },
      { pic: 'king', en: 'Mansa Musa rides to Mecca with shining gifts.',
        zh: '曼萨·穆萨带着闪亮的礼物去麦加。', es: 'Mansa Musa viaja a La Meca con regalos brillantes.' },
      { pic: 'book', en: 'In Timbuktu, scholars fill libraries with books.',
        zh: '在廷巴克图，学者把图书馆装满书。', es: 'En Tombuctu, los eruditos llenan bibliotecas de libros.' },
    ],
  },
  {
    id: 'tt-china', name: 'Song China', pic: 'wall',
    visit: [
      { pic: 'wall', en: 'You travel back. China hums with invention.',
        zh: '你回到过去。中国充满了发明。', es: 'Viajas al pasado. China esta llena de inventos.' },
      { pic: 'press', en: 'Movable type prints pages. Gunpowder lights the sky.',
        zh: '活字印刷出书页。火药点亮天空。', es: 'Los tipos moviles imprimen paginas. La polvora ilumina el cielo.' },
      { pic: 'boat', en: 'Great ships sail with the compass you know.',
        zh: '大船带着你认识的指南针远航。', es: 'Grandes barcos navegan con la brujula que conoces.' },
    ],
  },
];

// ---------------- compass tutorial (Geography Isle) ----------------
export const COMPASS = {
  dirs: [
    { id: 'N', en: 'north', zh: '北', es: 'norte' },
    { id: 'E', en: 'east', zh: '东', es: 'este' },
    { id: 'S', en: 'south', zh: '南', es: 'sur' },
    { id: 'W', en: 'west', zh: '西', es: 'oeste' },
  ],
  asks: ['E', 'S', 'N', 'W'],
};

// gentle Question Lanterns stall draws bank questions from these topics only
export const LANTERN_TOPICS = ['Early Humans', 'Farming Revolution', 'Mesopotamia', 'Egypt + Indus', 'Silk Roads', 'Exploration'];
