// content.js — TRADE WINDS: the trading-empire game data for Global History 9.
// HONEST PEDAGOGY: every city, good, price spread, figure and event below is
// real history. Famous figures speak PARAPHRASE grounded in the record (laws,
// edicts, travel accounts) — nothing is presented as a verbatim quote.
// Eras: I River Valleys → II Classical → III Post-Classical → IV First Global Age.

export const ERAS = [
  null,
  { n: 1, name: 'River Valleys & First Cities', span: 'c. 3500-500 BCE' },
  { n: 2, name: 'The Classical World', span: 'c. 500 BCE-600 CE' },
  { n: 3, name: 'The Post-Classical Roads', span: 'c. 600-1450' },
  { n: 4, name: 'The First Global Age', span: 'c. 1450-1600' },
];

// era unlock gates (besides the herald quest, checked by the controller)
export const ERA_GATES = {
  2: { quest: 'lawcode', worth: 120 },
  3: { quest: 'heavenlyhorses', worth: 400 },
  4: { quest: 'longestjourney', worth: 1000 },
};

// ---------------- GOODS ----------------
// base = a fair "world price" in shekels. Cities multiply it: <1 at the
// source, >1 where the good is scarce and craved. Learning the real
// geography of supply and demand IS the game.
export const GOODS = [
  { id: 'barley', name: 'Barley', base: 4, era: 1, fact: 'Mesopotamia paid its workers in barley — grain was the first wage' },
  { id: 'wool', name: 'Wool', base: 6, era: 1, fact: 'Temple workshops at Ur wove wool by the ton for export' },
  { id: 'copper', name: 'Copper', base: 14, era: 1, fact: 'Shipped up the Gulf from Magan (Oman) through Dilmun to Sumer' },
  { id: 'lapis', name: 'Lapis Lazuli', base: 30, era: 1, fact: 'Mined only in Badakhshan; pharaohs were buried wearing it' },
  { id: 'obsidian', name: 'Obsidian', base: 10, era: 1, fact: 'Volcanic glass — the sharpest edge in the world before iron' },
  { id: 'cedar', name: 'Cedar Timber', base: 12, era: 1, fact: 'Lebanon cedar built the ships and temples of treeless Egypt and Sumer' },
  { id: 'papyrus', name: 'Papyrus', base: 8, era: 1, fact: 'Egypt\'s writing reed, shipped through Byblos — Greeks named the book "biblos" after the port' },
  { id: 'wine', name: 'Wine', base: 9, era: 1, fact: 'Traded in sealed clay amphorae stamped with the maker\'s mark' },
  { id: 'oliveoil', name: 'Olive Oil', base: 10, era: 2, fact: 'Athens\' liquid wealth — lamp fuel, soap, and food in one jar' },
  { id: 'pottery', name: 'Painted Pottery', base: 8, era: 2, fact: 'Attic black-figure vases were prized across the whole Mediterranean' },
  { id: 'silver', name: 'Silver', base: 24, era: 2, fact: 'The mines at Laurion paid for Athens\' navy — and the silver drain east never stopped' },
  { id: 'grain', name: 'Grain', base: 5, era: 2, fact: 'Athens could not feed itself; Black Sea grain fleets kept the city alive' },
  { id: 'cotton', name: 'Cotton Cloth', base: 12, era: 2, fact: 'India wove cotton so fine travelers called it woven wind' },
  { id: 'pepper', name: 'Pepper', base: 22, era: 2, fact: 'Rome\'s writers complained the empire bled gold for pepper from the Malabar coast' },
  { id: 'silk', name: 'Silk', base: 40, era: 2, fact: 'In Rome silk sold for its weight in gold; China guarded the secret for centuries' },
  { id: 'horses', name: 'Horses', base: 45, era: 2, fact: 'China and India both imported warhorses — steppe and western breeds commanded fortunes' },
  { id: 'porcelain', name: 'Porcelain', base: 28, era: 3, fact: 'Tang and Song kilns made "china" the world could not copy for 700 years' },
  { id: 'paper', name: 'Paper', base: 14, era: 3, fact: 'A Chinese invention that spread west after Talas (751) through Samarkand and Baghdad' },
  { id: 'tea', name: 'Tea', base: 16, era: 3, fact: 'Tang China swapped tea for steppe horses along the Tea-Horse roads' },
  { id: 'gold', name: 'Gold', base: 50, era: 3, fact: 'West African goldfields supplied much of the Old World\'s gold for centuries' },
  { id: 'salt', name: 'Salt', base: 18, era: 3, fact: 'Saharan slabs from Taghaza traveled south by camel — traded, legend said, weight for weight against gold' },
  { id: 'ivory', name: 'Ivory', base: 26, era: 3, fact: 'Carried from East Africa\'s Swahili ports to carvers in India and China' },
  { id: 'manuscripts', name: 'Manuscripts', base: 34, era: 3, fact: 'In Timbuktu, travelers reported, books out-earned every other merchandise' },
  { id: 'woolcloth', name: 'Wool Cloth', base: 20, era: 4, fact: 'Florence\'s Arte della Lana guild finished cloth that dressed half of Europe' },
  { id: 'glassware', name: 'Glassware', base: 26, era: 4, fact: 'Venetian cristallo from Murano — and fine glass was one luxury China imported' },
  { id: 'cloves', name: 'Cloves', base: 36, era: 4, fact: 'Until 1600 every clove on Earth grew on a few small Moluccan islands' },
  { id: 'printedbooks', name: 'Printed Books', base: 18, era: 4, fact: 'After Gutenberg (c. 1450) a book cost weeks of wages, not years' },
];

// ---------------- CITIES ----------------
// Anchored to the world's existing landmarks. mult <1 = source, >1 = demand.
export const CITIES = [
  {
    id: 'byblos', name: 'Byblos', era: 1, x: 0, z: 44, stationId: null, color: 0x46a3b0,
    tag: 'Phoenician harbor — eastern Mediterranean coast',
    blurb: 'The old port of the cedar trade. Your house keeps its ledgers here.',
    market: { cedar: 0.6, papyrus: 0.8, wine: 0.85, barley: 1.2, wool: 1.1, copper: 1.3, obsidian: 1.4, lapis: 1.8, salt: 0.8, glassware: 0.85, grain: 1.1, oliveoil: 1.1, manuscripts: 1.1, printedbooks: 1.2 },
  },
  {
    id: 'ur', name: 'Ur', era: 1, x: 150, z: -122, stationId: 'g9-rivers', color: 0xfbbf24,
    tag: 'Sumerian river city — between the Tigris and Euphrates',
    blurb: 'Ziggurat city of the moon god Nanna. Barley, wool and the eastern caravans.',
    market: { barley: 0.6, wool: 0.6, lapis: 0.7, copper: 0.85, cedar: 1.5, obsidian: 1.2, wine: 1.2, grain: 0.7, papyrus: 1.3, silver: 1.2, horses: 1.4 },
  },
  {
    id: 'catalhoyuk', name: 'Catalhoyuk', era: 1, x: -170, z: -140, stationId: 'g9-origins', color: 0xf59e0b,
    tag: 'Anatolian highland town — one of the world\'s first',
    blurb: 'Houses entered by rooftop ladders; obsidian knapped since before kings existed.',
    market: { obsidian: 0.5, wool: 0.9, barley: 1.3, copper: 1.2, cedar: 1.2, lapis: 1.5, horses: 0.8, wine: 1.15, grain: 1.2 },
  },
  {
    id: 'athens', name: 'Athens', era: 2, x: -212, z: 30, stationId: 'g9-classical', color: 0xf97316,
    tag: 'Greek polis — the Aegean coast',
    blurb: 'The agora hums under the acropolis. Oil and pottery out; grain and eastern luxuries in.',
    market: { oliveoil: 0.6, pottery: 0.6, silver: 0.7, wine: 0.8, grain: 1.7, silk: 2.4, pepper: 1.8, papyrus: 1.25, cotton: 1.4, horses: 1.3, manuscripts: 0.8, glassware: 1.1, woolcloth: 1.2, printedbooks: 1.1, cedar: 1.2 },
  },
  {
    id: 'varanasi', name: 'Varanasi', era: 2, x: 205, z: 25, stationId: 'g9-belief', color: 0xfb923c,
    tag: 'City on the Ganges — northern India',
    blurb: 'Pilgrims at the ghats, cotton on the looms, and the Buddha\'s first sermon preached nearby at Sarnath.',
    market: { cotton: 0.6, pepper: 0.7, silk: 1.3, horses: 1.9, salt: 1.3, ivory: 1.1, manuscripts: 1.2, lapis: 0.85, grain: 0.9, tea: 1.2, porcelain: 1.2, gold: 1.2 },
  },
  {
    id: 'changan', name: 'Chang\'an', era: 2, x: 140, z: -44, stationId: 'g9-postclassical', color: 0xea580c,
    tag: 'Imperial capital — eastern end of the Silk Road',
    blurb: 'Two million people inside grid-straight walls. Everything west begins or ends here.',
    market: { silk: 0.55, porcelain: 0.6, paper: 0.6, tea: 0.65, horses: 2.0, silver: 1.5, glassware: 1.8, woolcloth: 1.4, ivory: 1.4, pepper: 1.4, cotton: 1.2, grain: 0.9, gold: 1.3 },
  },
  {
    id: 'timbuktu', name: 'Timbuktu', era: 3, x: 40, z: 196, stationId: 'g9-silkroad', color: 0xeab308,
    tag: 'Mali — where the camel meets the canoe, edge of the Sahara',
    blurb: 'Gold from the south, salt from the north, and more books than either.',
    market: { gold: 0.6, ivory: 0.8, salt: 2.0, manuscripts: 1.8, horses: 1.7, woolcloth: 1.5, cotton: 1.3, printedbooks: 2.2, glassware: 1.4, grain: 1.2, copper: 1.3 },
  },
  {
    id: 'florence', name: 'Florence', era: 4, x: -64, z: -64, stationId: 'g9-renaissance', color: 0xf43f5e,
    tag: 'Tuscany — banking and wool republic of the Renaissance',
    blurb: 'The florin is good everywhere, the Duomo rises, and the Medici buy beauty wholesale.',
    market: { woolcloth: 0.6, printedbooks: 0.7, glassware: 0.8, wine: 0.8, oliveoil: 0.9, pepper: 2.0, cloves: 2.2, silk: 1.6, gold: 1.4, manuscripts: 1.6, salt: 1.0, ivory: 1.3, porcelain: 2.0, pottery: 1.1, silver: 1.1 },
  },
  {
    id: 'calicut', name: 'Calicut', era: 4, x: -150, z: 172, stationId: 'g9-encounters', color: 0x22d3ee,
    tag: 'Malabar coast — pepper port of the Indian Ocean',
    blurb: 'The Zamorin\'s harbor, where treasure fleets anchored and, in 1498, three Portuguese ships changed everything.',
    market: { pepper: 0.5, cloves: 0.75, cotton: 0.7, porcelain: 0.9, silk: 1.0, silver: 1.9, gold: 1.3, horses: 1.8, glassware: 1.2, ivory: 0.9, manuscripts: 1.1, woolcloth: 1.4, tea: 1.1 },
  },
];

// ---------------- TRANSPORTS ----------------
export const TRANSPORTS = [
  { id: 'donkey', name: 'Donkey', cap: 6, cost: 0, speed: 1, era: 1, note: 'The first beast of burden of the bronze-age caravans.' },
  { id: 'camel', name: 'Camel', cap: 10, cost: 150, speed: 1.06, era: 1, note: 'Days without water; the ship of the desert made the Sahara crossable.' },
  { id: 'cart', name: 'Horse Cart', cap: 16, cost: 450, speed: 1.12, era: 2, note: 'Wheels and good roads multiply what one trader can move.' },
  { id: 'caravan', name: 'Grand Caravan', cap: 26, cost: 1100, speed: 1.16, era: 3, note: 'A string of beasts, hired drivers, your house\'s banner in front.' },
];

// ---------------- PERKS ----------------
export const PERKS = [
  { id: 'packmule', name: 'Pack Master', max: 3, desc: '+3 cargo capacity per rank — load every animal the smart way.' },
  { id: 'haggler', name: 'Haggler', max: 3, desc: 'Buy and sell 3% better per rank. The bazaar respects a sharp tongue.' },
  { id: 'swift', name: 'Swift Feet', max: 2, desc: 'Move 7% faster per rank between cities.' },
  { id: 'scout', name: 'Route Scout', max: 1, desc: 'Road events mark the historically sound choice with a scout\'s tip.' },
  { id: 'ledger', name: 'Master Ledger', max: 1, desc: 'Markets show each good\'s fair world price, so spreads leap off the page.' },
];

// guild exam topic scope, cumulative by era (exact bank topic strings)
export function topicsForEra(era) {
  const t1 = ['Early Humans', 'Farming Revolution', 'Early Worlds', 'Mesopotamia', 'Egypt + Indus', 'Shang China'];
  const t2 = ['Hinduism', 'Buddhism', 'Judaism + Christianity', 'Chinese Philosophies', 'Belief + Rule', 'Greek City-States', 'Alexander + Hellenism', 'Roman Republic + Empire', 'India + China', 'Maya + Decline', 'Classical + Trade'];
  const t3 = ['Islam', 'Silk Roads', 'Indian Ocean', 'Trans-Saharan Trade', 'African Trade Cities', 'Disease + Mongols', 'Byzantine Empire', 'Medieval Europe', 'Islamic Golden Age', 'Tang + Song China', 'Mongols + Japan', 'Islam + South Asia', 'Christian Schisms + Crusades', 'Black Death', 'Plague Effects', 'Conflict + Exchange'];
  const t4 = ['Renaissance', 'Reformation', 'Religious Wars', 'Absolute Monarchs', 'Scientific + Enlightenment Thinkers', 'Empires + States', 'Ottoman Conquest', 'Ottoman Government', 'Ming China', 'Foreign Contact', 'Isolation + Tribute', 'West + East Africa', 'African Beliefs', 'Aztec Empire', 'Inca Empire', 'Pre-Columbian Culture', 'Navigation', 'Exploration', 'Columbian Exchange', 'Conquest', 'Atlantic Labor', 'Early Modern Change'];
  let t = t1.slice();
  if (era >= 2) t = t.concat(t2);
  if (era >= 3) t = t.concat(t3);
  if (era >= 4) t = t.concat(t4);
  return t;
}

// ---------------- QUESTS ----------------
export const QUESTS = [
  {
    id: 'cedarrun', name: 'The First Honest Contract', era: 1, giver: 'anath',
    summary: 'The first road of your mother\'s house in a year: buy 2 cedar in Byblos and win the temple contract at Ur from the priestess Nin-Banda — before the Vell take it.',
    stages: [
      { objective: 'Carry 2 Cedar Timber to Nin-Banda at Ur — and win her trust', type: 'deliver', target: 'ninbanda', goods: { cedar: 2 }, targetCity: 'ur' },
      { objective: 'Return to Old Anath in Byblos', type: 'talk', target: 'anath', targetCity: 'byblos' },
    ],
    rewards: { coins: 45, xp: 45 },
  },
  {
    id: 'lawcode', name: 'The Law of the Land', era: 1, giver: 'hammurabi-envoy', requires: ['cedarrun'],
    summary: 'King Hammurabi of Babylon has carved 282 laws on a stone stele. Carry word of the code to Catalhoyuk and Byblos, then report back.',
    stages: [
      { objective: 'Proclaim the code in Catalhoyuk and Byblos', type: 'visit', cities: ['catalhoyuk', 'byblos'], targetCity: 'catalhoyuk' },
      { objective: 'Report back to the envoy at Ur', type: 'talk', target: 'hammurabi-envoy', targetCity: 'ur' },
    ],
    rewards: { coins: 70, xp: 70 },
  },
  {
    id: 'sharpedges', name: 'Sharp Edges', era: 1, giver: 'kamani',
    summary: 'Kamani\'s obsidian blades cut sharper than anything in the river cities. Carry 3 obsidian to Ur.',
    stages: [
      { objective: 'Deliver 3 Obsidian to Nin-Banda at Ur', type: 'deliver', target: 'ninbanda', goods: { obsidian: 3 }, targetCity: 'ur' },
    ],
    rewards: { coins: 40, xp: 40 },
  },
  {
    id: 'histories', name: 'The Histories', era: 2, giver: 'herodotus',
    summary: 'Herodotus is writing an inquiry — a "historia" — into all the peoples of the world. Gather accounts for him in Ur and Varanasi.',
    stages: [
      { objective: 'Gather accounts in Ur and Varanasi', type: 'visit', cities: ['ur', 'varanasi'], targetCity: 'varanasi' },
      { objective: 'Bring your notes to Herodotus in Athens', type: 'talk', target: 'herodotus', targetCity: 'athens' },
    ],
    rewards: { coins: 80, xp: 90 },
  },
  {
    id: 'edict', name: 'Edicts of Stone', era: 2, giver: 'ashoka-envoy',
    summary: 'After the slaughter at Kalinga, King Ashoka rules by dhamma. His thirteenth rock edict names even the Greek kings. Carry a copy west to Athens.',
    stages: [
      { objective: 'Read the edict aloud in Athens\' agora', type: 'visit', cities: ['athens'], targetCity: 'athens' },
      { objective: 'Return to the envoy at Varanasi', type: 'talk', target: 'ashoka-envoy', targetCity: 'varanasi' },
    ],
    rewards: { coins: 75, xp: 85 },
  },
  {
    id: 'heavenlyhorses', name: 'The Heavenly Horses', era: 2, giver: 'zhangqian', requires: ['lawcode'],
    summary: 'Zhang Qian, the Han envoy who opened the western roads, needs horses for the emperor — and wants Chinese silk seen in the far west.',
    stages: [
      { objective: 'Deliver 2 Horses to Zhang Qian at Chang\'an', type: 'deliver', target: 'zhangqian', goods: { horses: 2 }, targetCity: 'changan' },
      { objective: 'Sell silk in the west: deliver 2 Silk to Herodotus in Athens', type: 'deliver', target: 'herodotus', goods: { silk: 2 }, targetCity: 'athens' },
      { objective: 'Report back to Zhang Qian', type: 'talk', target: 'zhangqian', targetCity: 'changan' },
    ],
    rewards: { coins: 190, xp: 140 },
  },
  {
    id: 'goldenhajj', name: 'The Golden Hajj', era: 3, giver: 'mansamusa',
    summary: 'Mansa Musa of Mali is preparing the pilgrimage to Mecca. He needs gold for alms and salt for the road — and a merchant who understands markets.',
    stages: [
      { objective: 'Bring 4 Gold and 2 Salt to Mansa Musa at Timbuktu', type: 'deliver', target: 'mansamusa', goods: { gold: 4, salt: 2 }, targetCity: 'timbuktu' },
    ],
    rewards: { coins: 170, xp: 160 },
  },
  {
    id: 'longestjourney', name: 'The Longest Journey', era: 3, giver: 'ibnbattuta', requires: ['heavenlyhorses'],
    summary: 'Ibn Battuta has walked the world for decades — Delhi, the Swahili coast, China. Trace two legs of his road, then come tell him what has changed.',
    stages: [
      { objective: 'Walk his road: visit Varanasi and Chang\'an', type: 'visit', cities: ['varanasi', 'changan'], targetCity: 'varanasi' },
      { objective: 'Return to Ibn Battuta at Timbuktu', type: 'talk', target: 'ibnbattuta', targetCity: 'timbuktu' },
    ],
    rewards: { coins: 180, xp: 200 },
  },
  {
    id: 'treasurefleet', name: 'The Treasure Fleet', era: 4, giver: 'zhenghe',
    summary: 'Admiral Zheng He\'s fleet rides at anchor off Calicut — hundreds of ships, thousands of men. The admiral trades porcelain and silk for the harbor\'s goodwill.',
    stages: [
      { objective: 'Deliver 3 Porcelain and 1 Silk to Zheng He at Calicut', type: 'deliver', target: 'zhenghe', goods: { porcelain: 3, silk: 1 }, targetCity: 'calicut' },
    ],
    rewards: { coins: 260, xp: 230 },
  },
  {
    id: 'patron', name: 'Patron of the Arts', era: 4, giver: 'lorenzo',
    summary: 'Lorenzo de\' Medici hunts Greek manuscripts the way other princes hunt stags — and pays in florins. Florence\'s glory is built on ledgers like yours.',
    stages: [
      { objective: 'Bring 2 Manuscripts and 3 Gold to Lorenzo in Florence', type: 'deliver', target: 'lorenzo', goods: { manuscripts: 2, gold: 3 }, targetCity: 'florence' },
    ],
    rewards: { coins: 260, xp: 230 },
  },
];

// ---------------- COLD OPEN ----------------
// The inciting incident — plays once, before the player touches a control, on
// New Game. Goal (save the house), stakes (the name erased; the missing
// mother), mentor (Anath), and the looming rival (Vell) in ~90 seconds. This
// is the beat v3 never had. The controller appends a final controls beat.
// History is REAL: Byblos is the cedar port; the river valleys are treeless
// floodplains that imported timber — the fiction (house, mother, the Vell) is
// the wrapper around that true trade.
export const COLD_OPEN = [
  {
    tint: 'amber', art: 'candle', kicker: 'The House of the Open Road',
    text: 'For four generations your house has sailed every sea — since your great-grandmother first sold Byblos cedar to kings who had no forests of their own. Tonight, by one guttering candle, it owes more than it owns.',
  },
  {
    tint: 'amber', art: 'ledger',
    text: 'Last spring your mother — the house\'s master-trader — rode east with the caravan to settle the debt herself. The caravan came home. She did not. This is the last page she ever wrote, and it is not finished.',
  },
  {
    tint: 'cold', art: 'notice', kicker: 'The House of Vell',
    text: 'A notice is nailed to your door. The rival House of Vell offers to buy your name — your routes, your ledgers, your silence — and erase the House of the Open Road from every market on Earth. You have until the season\'s end to answer.',
  },
  {
    tint: 'dusk', art: 'portrait', palette: { robe: 0x9c6b2f, trim: 0x6b481d, skin: 0xb97f4e, hat: 0x5e3a1c },
    text: 'A knock. Old Anath — your mother\'s caravan-master, thirty years on her roads — presses the ledger back into your hands. "A house isn\'t dead while one donkey still walks," he says. "Get up, heir. We have a road to walk."',
  },
];

// ---------------- ERA-TRANSITION CUTSCENES ----------------
// When the player unlocks a new era, the story takes a breath: Anath frames the
// new age as the next leg of your mother's road east toward Chang'an, and the
// Vell escalate. Each plays ONCE (gated on a story flag in game.js). Palettes
// reuse Anath (amber/dusk) and the Vell steel-blue so faces stay consistent.
const ANATH_PAL = { robe: 0x9c6b2f, trim: 0x6b481d, skin: 0xb97f4e, hat: 0x5e3a1c };
const VELL_PAL = { robe: 0x2c4a6e, trim: 0x18304a, skin: 0xb98a5e, hat: 0x16283c };

export const ERA2_OPEN = [
  {
    tint: 'amber', kicker: 'Era II — The Classical World', art: 'portrait', palette: ANATH_PAL,
    text: 'Years pass on the river roads, and the house grows. One morning Anath unrolls your mother\'s map. "Her line runs on, heir — past Ur, past the steppe, into the lands of the Greeks and the great kings of India and Han China. The same word still underlined at the end: Chang\'an. We can reach the classical world now. We follow her."',
  },
  {
    tint: 'cold', kicker: 'The House of Vell', art: 'portrait', palette: VELL_PAL,
    text: 'But the Vell have not forgotten Ur. Word comes that they have opened a counting-house in every classical port ahead of you, buying up wharves and bribing scribes. "They mean to own the road before you walk it," Anath warns. "Beat them the only way you ever have — by understanding it better than they do."',
  },
];

export const ERA3_OPEN = [
  {
    tint: 'amber', kicker: 'Era III — The Post-Classical Roads', art: 'portrait', palette: ANATH_PAL,
    text: 'Generations turn. Camels now where donkeys walked; the world is wider than your great-grandmother dreamed. "The roads have changed since your mother rode them," Anath says, tracing a route that swings south to the gold cities and east along a road men are starting to call the Silk Road. "But the underlined word has not moved. Chang\'an still waits at the end of her line."',
  },
  {
    tint: 'dusk', kicker: 'The House of Vell', art: 'portrait', palette: VELL_PAL,
    text: 'The Vell have grown too — a banking house now, with armed factors on the desert and the sea. They are spreading a useful lie: that the old House of the Open Road died on the road with its master, your mother. "Every market you walk into has heard we are ghosts," Anath says grimly. "So prove them wrong, loudly, with every honest contract."',
  },
];

export const ERA4_OPEN = [
  {
    tint: 'amber', kicker: 'Era IV — The First Global Age', art: 'portrait', palette: ANATH_PAL,
    text: 'The world has become one ocean. Florins in Florence, fleets off Calicut, a single sea-road that touches every shore at once. Anath is old now; his hand shakes on the map. "This is the last leg, heir. Reach the eastern road your mother underlined, and we will finally know what became of her. Whatever we find — your house is no longer dying. It is the largest it has ever been."',
  },
  {
    tint: 'cold', kicker: 'The House of Vell', art: 'portrait', palette: VELL_PAL,
    text: 'And the Vell make their last move: a standing offer, to every port at once, to buy the House of the Open Road outright and bury the name forever. "They are afraid of you now," Anath says, almost smiling. "Houses do not pay to bury a ghost. One more road, done right, and it is THEY who vanish from the markets — not us."',
  },
];

// ---------------- MOTHER-MYSTERY CUTSCENES ----------------
// The emotional spine, paid off on reaching the two cities at the far end of
// her line. Real-history plausible: she rode east settling the house's debt on
// a route that became the Silk Road's eastern reach, and the road kept her. Each
// plays once (gated by a story flag in game.js) and lifts House Standing.
export const CHANGAN_MOTHER = [
  {
    tint: 'cold', kicker: 'Chang\'an — the underlined word', art: 'notice',
    text: 'You stand at last inside the grid-straight walls your mother drew at the end of her ledger. In the Western Market, an old Sogdian factor squints at your house\'s banner and goes very still. "The Open Road... a trader-woman of that house came through here, years past. Settling an old debt, she said — paying it off the honest way, one leg of road at a time, further east than her own house had ever reached."',
  },
  {
    tint: 'dusk', art: 'portrait', palette: ANATH_PAL,
    text: '"She made the debt good here, every coin," the factor says, "and then rode on east with a small caravan, into the new country beyond the passes — the road we are only now learning to call the Silk Road. The winter closed the passes behind her. No one I know saw her come back." Anath bows his head. "So she didn\'t run from the debt. She walked east and PAID it — and kept walking. That is the mother I knew."',
  },
  {
    tint: 'amber', art: 'portrait', palette: ANATH_PAL,
    text: '"Finish her road, heir," Anath says, steadier now. "Not to bring her home — the passes kept her, the way they keep so many. But to carry her name the whole length of the line she drew, so that every market from Byblos to the eastern sea knows the House of the Open Road paid what it owed and never stopped walking." The grief settles into something like pride.',
  },
];

export const CALICUT_MOTHER = [
  {
    tint: 'cold', kicker: 'Calicut — the far shore', art: 'ledger',
    text: 'In Calicut, where every sea-road on earth now meets, a Gujarati shipowner recognizes your seal and brings out a thing he has kept for years: a single page in your mother\'s own hand, sold to him long ago by an eastern caravan. The last entry on it balances the house\'s old debt to the cowrie — paid in full, signed, dated on a road that had no name yet.',
  },
  {
    tint: 'amber', art: 'portrait', palette: ANATH_PAL,
    text: 'Anath reads it twice, then laughs through tears. "She closed the book, heir. The debt that nearly buried us — she settled it herself, at the far end of the world, and trusted the road to carry the page home to whoever finished her line. It found you." He presses the page into the back of your ledger, beside her underlined Chang\'an. "The House of the Open Road owes no one. Your mother saw to that."',
  },
];

// ---------------- VELL RESOLUTION ----------------
// The rivalry's payoff in Era IV: the Vell, who tried to buy and bury the name,
// are beaten not by undercutting but by a house that understood every road
// better than they did. Plays once when the keystones are won and the player
// confronts the senior Vell partner in Florence.
export const VELL_RESOLVE = [
  {
    tint: 'cold', kicker: 'The House of Vell — the last word', art: 'portrait', palette: VELL_PAL,
    text: 'In Florence the senior Vell partner himself waits, the standing offer to buy your name in his hand. But his factors are deserting to richer routes — the very roads you opened by understanding them: Ur, the Silk Road, Mali\'s gold, the monsoon sea. "Every road we tried to buy," he admits, "you had already learned. One cannot purchase that."',
  },
  {
    tint: 'amber', art: 'portrait', palette: ANATH_PAL,
    text: 'He tears the offer in two. The House of Vell withdraws from the great routes for good — beaten not by a cheaper price but by a house that knew WHY each road existed. Anath watches them go. "Your mother always said it: you do not win a road by owning it. You win it by understanding it. The House of the Open Road carries her name now, the whole length of the line she drew. We owe no one. We answer to no one. And we are not done walking."',
  },
];

// ---------------- NPCS ----------------
// Real figures carry real history; supporting characters carry period-true
// names and trades. Dialogue trees reference quest/econ state through ctx.
export const NPCS = [
  {
    id: 'zimrida', name: 'Zimrida', title: 'Harbormaster of Byblos', city: 'byblos', era: 1,
    offset: [6, 3], hatKind: 'cap', palette: { robe: 0x2f6f8f, trim: 0x1d4a61, skin: 0xc98a5b, hat: 0x1d4a61 },
    dialogue: {
      start: 'root',
      nodes: {
        root: {
          text: 'Your mother\'s child — I\'d know the face anywhere. Welcome back to the quay. Egypt has gold and grain but not one forest worth the name; every temple beam they raise is cedar from our hills. Sumer is the same. Buy timber cheap here, sell it where rivers rule and trees do not — that is the whole secret your house was built on.',
          choices: [
            { label: 'Where do I even start, with the debt this size?', next: 'anath' },
            { label: 'Tell me about this port.', next: 'lore' },
          ],
        },
        anath: { text: 'Start with the one man who never gave up on your house: Old Anath, your mother\'s caravan-master, waiting by your donkey at the end of the quay. Thirty years he drove her roads. He\'ll set you on your first one. Go to him.', choices: [] },
        lore: {
          text: 'Byblos is old beyond counting — we shipped papyrus so long that the Greeks call a book "biblos" after us. Phoenician ships out of these harbors carried an alphabet of twenty-two letters wherever they sold purple dye. Writing itself rode on trade, friend.',
          choices: [{ label: 'And my first road?', next: 'anath' }],
        },
      },
    },
  },
  {
    // MENTOR. Your mother's retired caravan-master. Teaches the first verb
    // (buy where it grows, sell where it can't), hands the goal, and recurs:
    // marks your ledger and reveals your mother's last road to Chang'an.
    id: 'anath', name: 'Old Anath', title: "Your mother's caravan-master", city: 'byblos', era: 1,
    offset: [-4, -7], hatKind: 'brim', palette: { robe: 0x9c6b2f, trim: 0x6b481d, skin: 0xb97f4e, hat: 0x5e3a1c },
    dialogue: {
      start: (ctx) => {
        if (ctx.quests.isDone('cedarrun')) return 'after';
        if (ctx.quests.isActive('cedarrun')) {
          if (ctx.quests.turnInReady('cedarrun', 'anath', ctx.econ)) return 'ledger';
          return ctx.story.is('vellWonRound') && !ctx.story.is('urWon') ? 'reteach' : 'during';
        }
        return 'mentor';
      },
      nodes: {
        mentor: {
          text: 'Look at the harbor, heir. Cedar — that great timber on the barges. We sit on the source, so here it\'s cheap as firewood. But Egypt and Sumer? Lands of mud and rivers, not a forest worth the name. Carry cedar east and it turns to silver. That is the whole secret your great-grandmother built this house on: buy where it grows, sell where it cannot.',
          choices: [
            { label: "Then let's rebuild the house — one road at a time.", effect: ctx => { ctx.quests.accept('cedarrun'); }, next: 'sendoff' },
            { label: "Why can't the river cities just grow their own trees?", next: 'geo' },
          ],
        },
        geo: {
          text: 'Because the great river valleys are floodplains, child — rich black soil the floods lay down every year, but flat as a table and treeless. No highland forests. No stone quarries. They grow grain enough to feed armies, and they must trade for everything else: timber, copper, lapis, all of it. That hunger is exactly why a road like ours can exist at all.',
          choices: [{ label: "Then let's begin. Our first road.", effect: ctx => { ctx.quests.accept('cedarrun'); }, next: 'sendoff' }],
        },
        sendoff: {
          text: 'A house is just a name that people trust — and we earn it back one honest contract at a time. Nin-Banda, priestess of Ur, needs cedar for the moon-god\'s temple roof. Buy two timbers in our market, follow the river road east. And heir — the House of Vell will already be there. They always are. Beat them with what you KNOW, not what you charge.',
          choices: [{ label: "I'll carry our name back to Ur.", next: '@close' }],
        },
        during: { text: 'Two cedar timbers, bought here, carried east to Nin-Banda at Ur — the river road runs past the steppe citadel. Win her with the truth of the trade, not a cheap price. Bring our name home.', choices: [] },
        reteach: {
          text: 'You went to Ur and came back with the cedar still on your donkey — and the Vell took the day. Don\'t carry that as shame; carry it as a lesson. Ur has soil and silver but no forests and no stone. A river city lives or dies by the roads that bring it wood and metal. THAT is what the priestess was asking you to understand. Go back. She\'ll see another caravan.',
          choices: [],
        },
        ledger: {
          text: 'So a market spoke our name aloud again — first time in a year. (He draws a worn ledger from his coat and, with a blunt reed pen, marks a single line.) There. The first honest line in a book that is finally yours, not your mother\'s, not the creditors\'. The House of the Open Road is breathing again.',
          choices: [{ label: 'What was she carrying, that last road east?', effect: ctx => { ctx.raiseHouse(1, 'The ledger is yours', 'Old Anath marks the first honest line in a year.'); }, next: 'mothersledger' }],
        },
        mothersledger: {
          text: '(He turns to the back of the book — a page in your mother\'s own hand. A half-drawn route runs further east than your house has ever traded, ending at a single word, underlined twice.) Chang\'an. I never knew why she meant to go so far. Rebuild the house, heir. Earn the caravan that can reach that far — and maybe, at the end of her road, we find out together.',
          choices: [{ label: "Then we keep walking her road.", effect: ctx => { ctx.story.flag('mothersLedgerSeen'); ctx.quests.advance('cedarrun'); }, next: '@close' }],
        },
        after: { text: 'The house has a name again, and a road to walk. When you hold real silver, the Merchants\' Guild at the Grand Stoa will examine new members — rank opens doors. But the Vell won\'t forget Ur. Neither will I.', choices: [] },
      },
    },
  },
  {
    // ANTAGONIST'S FACE. The recurring rival house, cold steel-blue. Taunts
    // before Ur; remembers being beaten after. Gives the rivalry a clock.
    id: 'vell-agent', name: 'Sarpa', title: 'Agent of the House of Vell', city: 'ur', era: 1,
    offset: [4, 5], hatKind: 'hood', palette: { robe: 0x2c4a6e, trim: 0x18304a, skin: 0xb98a5e, hat: 0x16283c },
    dialogue: {
      start: (ctx) => ctx.story.is('vellHumbledAtUr') ? 'beaten' : 'taunt',
      nodes: {
        taunt: {
          text: '(A man in Vell steel-blue looks you over the way a clerk looks at spoiled cargo.) So the old house crawls out of its grave. The House of Vell has already bought three of your mother\'s routes — we\'ll have the rest by the season\'s end. That cedar on your donkey? Save your feet. The priestess won\'t pay temple silver for green wood off a dead woman\'s child.',
          choices: [
            { label: "We'll see what the priestess decides.", next: '@close' },
            { label: 'My mother is missing, not dead.', next: 'jab' },
          ],
        },
        jab: { text: 'Missing on a road my house now owns. Funny, that. Run along, heir — bring your little donkey to the temple and watch a real house take the contract.', choices: [] },
        beaten: {
          text: '(The Vell agent\'s smile is thinner than before.) Nin-Banda took your cedar over ours. One contract. Don\'t mistake it for a war, heir — the House of Vell has a long memory and a longer purse, and we are on every road you have yet to walk. We\'ll meet again on a richer one.',
          choices: [{ label: 'Count on it.', next: '@close' }],
        },
      },
    },
  },
  {
    id: 'hammurabi-envoy', name: 'Mar-Sippar', title: 'Envoy of King Hammurabi', city: 'ur', era: 1,
    offset: [-7, 4], hatKind: 'turban', palette: { robe: 0x8f5a2f, trim: 0x5e3a1c, skin: 0xc98a5b, hat: 0x3c2a16 },
    dialogue: {
      start: (ctx) => ctx.quests.isDone('lawcode') ? 'after'
        : ctx.quests.isActive('lawcode') ? (ctx.quests.turnInReady('lawcode', 'hammurabi-envoy', ctx.econ) ? 'turnin' : 'during')
        : (ctx.quests.isAvailable('lawcode', ctx.era()) ? 'root' : 'locked'),
      nodes: {
        locked: { text: 'I serve Hammurabi, king of Babylon. I have work for a trader the harbormasters vouch for — earn a name on the cedar route first.', choices: [] },
        root: {
          text: 'Hear the king\'s word. Hammurabi has set 282 laws in stone — on a black stele tall as a man, where every citizen can see them. Punishments fixed in advance, not at a judge\'s whim. The king bids traders carry word of the code to every market: law travels the same roads as wool.',
          choices: [
            { label: 'I will carry the code to Catalhoyuk and Byblos.', effect: ctx => { ctx.quests.accept('lawcode'); }, next: 'accepted' },
            { label: 'What do the laws actually say?', next: 'lore' },
          ],
        },
        lore: {
          text: 'They cover wages, floods, stolen oxen, bad surgery. The famous rule: if a man puts out the eye of another man, his eye shall be put out. Equal harm for equal harm — though, in truth, the penalty bends by rank: a noble pays differently than a commoner. Carved law is still law with edges.',
          choices: [{ label: 'I will carry it. Catalhoyuk and Byblos.', effect: ctx => { ctx.quests.accept('lawcode'); }, next: 'accepted' }],
        },
        accepted: { text: 'Read it loud in their markets. Return when both cities have heard, and the king\'s silver will find your purse.', choices: [{ label: 'Done.', next: '@close' }] },
        during: { text: 'The code must be heard in Catalhoyuk, up in the western hills, and in Byblos on the coast. Return when it is done.', choices: [] },
        turnin: {
          text: 'Both markets have heard the code — good. One question before the king\'s silver is paid, so I know you understood what you carried. What principle holds the code together?',
          choices: [
            { label: 'Equal harm for equal harm — an eye for an eye, in writing for all to see.', effect: ctx => { ctx.bonus(25, 'You understood the stele'); ctx.quests.advance('lawcode'); }, next: 'right' },
            { label: 'Mercy first — every punishment can be forgiven by prayer.', effect: ctx => { ctx.quests.advance('lawcode'); }, next: 'wrong' },
            { label: 'The judge alone decides each case as he likes.', effect: ctx => { ctx.quests.advance('lawcode'); }, next: 'wrong' },
          ],
        },
        right: { text: 'Exactly. Written, posted, fixed in advance — that is what makes it LAW and not a king\'s mood. Babylon pays a bonus for a trader with a head.', choices: [] },
        wrong: { text: 'No — the opposite. The code\'s power is that punishment is FIXED and PUBLIC: an eye for an eye, written where all can read it. Remember that; examiners love it. The silver is still yours.', choices: [] },
        after: { text: 'The code outlives us all — four thousand years from now, they will still study the stele. Trade well under law, friend.', choices: [] },
      },
    },
  },
  {
    id: 'ninbanda', name: 'Nin-Banda', title: 'Priestess of Nanna', city: 'ur', era: 1,
    offset: [7, -3], hatKind: 'crown', palette: { robe: 0xb08c3c, trim: 0x6e5526, skin: 0xc9986b, hat: 0xd4af37 },
    dialogue: {
      start: (ctx) => {
        if (ctx.quests.turnInReady('cedarrun', 'ninbanda', ctx.econ)) return 'challenge';
        if (ctx.quests.turnInReady('sharpedges', 'ninbanda', ctx.econ)) return 'obsidian';
        return 'root';
      },
      nodes: {
        root: {
          text: 'You stand below the great ziggurat of Ur-Nammu — a mountain of mud brick raised to Nanna of the moon, in a land with no stone and no timber. Everything you see came up the rivers or down the caravan roads. Even our blue — the lapis on the temple door — walked here from mountains months to the east.',
          choices: [{ label: 'Tell me what Ur buys dear.', next: 'trade' }],
        },
        trade: { text: 'Timber, friend — cedar above all. Stone. Copper from Magan when the Dilmun boats are late. We pay in barley, wool and silver by weight: the shekel is a WEIGHT before it is ever a coin. Sell us what the rivers cannot grow.', choices: [] },
        // ★ THE KEYSTONE BEAT — you advance the STORY by understanding the
        // history, not by passing a quiz. The Vell agent has poisoned the deal;
        // you win the contract back only by knowing WHY a treeless river city
        // pays a fortune for foreign wood. Wrong answers re-route the story and
        // teach (through Anath), never a red X. No score, no "Question 1 of N".
        challenge: {
          text: 'A man in Vell steel-blue stands at the priestess\'s shoulder, and he has been talking. "Green and cracked, this newcomer\'s cedar," he says, "off a house that couldn\'t even keep its own master alive on the road." Nin-Banda lifts a hand for silence and turns to you, unconvinced. "The Vell speak well. So tell me, trader — why does a city like Ur, with all our barley and silver, pay a fortune for foreign wood at all? Convince me you understand the trade you claim to master."',
          choices: [
            {
              kind: 'say',
              label: 'Ur sits on a floodplain — rich soil, but no forests and no stone. A river city must import its timber, its copper, its lapis; that need is the very reason your trade roads exist. I don\'t sell wood — I sell what your land cannot grow.',
              effect: ctx => {
                ctx.story.flag('vellHumbledAtUr'); ctx.story.flag('urWon');
                ctx.quests.deliver('cedarrun', ctx.econ);
                ctx.raiseHouse(1, 'The house has a name again', 'A market speaks the House of the Open Road aloud — first time in a year.');
              },
              next: 'allywin',
            },
            {
              kind: 'say',
              label: 'My cedar is simply cheaper than the Vell\'s. For a temple roof, surely that is reason enough.',
              effect: ctx => { ctx.story.flag('vellWonRound'); },
              next: 'lostcheap',
            },
            {
              kind: 'say',
              label: 'Because the gods of Ur demand cedar, and no humbler wood will do for Nanna\'s house.',
              next: 'lostgods',
            },
          ],
        },
        allywin: {
          text: '(Nin-Banda\'s face warms; the Vell agent\'s jaw tightens and he melts back into the crowd.) "A trader who knows WHY, not only what. Your mother taught you well." She takes the timber into her own hands. "The temple\'s contract is yours — and your house\'s name will be spoken in this market again." See there, on the temple door — the lapis, blue as deep water? It walked here from mountains months to the east. Everything in Ur came up a river or down a road. Even our gods are imported.',
          choices: [{ label: 'Then I\'ll carry our name home to Anath.', next: '@close' }],
        },
        lostcheap: {
          text: '"Cheap wood for a god\'s roof?" Nin-Banda\'s mouth thins. "You sound like a peddler, not your mother\'s child." She turns away — and the Vell agent permits himself one small, cold smile as the steward waves HIS caravan forward instead.\n\n(At the city gate a hand settles on your shoulder. Old Anath, come up the river behind you — not angry.) "You answered like a man who hauls boxes. Your mother answered like one who knew WHY the boxes were worth hauling. Ur has soil and silver but no forests and no stone — a river city lives or dies by the roads that bring it timber and metal. THAT is what she was asking. Go back. She\'ll see another caravan."',
          choices: [{ label: 'Tomorrow, then — and I\'ll answer her true.', next: 'challenge' }],
        },
        lostgods: {
          text: '"The gods?" Nin-Banda almost smiles. "Cedar is prized for its great length, its sweet rot-resistant grain, and above all its scarcity here — not by any decree of Nanna. You have the reverence right and the reason wrong." The Vell agent slides smoothly into your silence.\n\n(Anath finds you after, by the gate.) "Close, heir — but lead with the ground under her feet. Ur sits on a floodplain with no forests and no stone; a river city MUST import its wood and metal. That need is why the roads exist, and why your cedar is worth a temple\'s silver. Try her again."',
          choices: [{ label: 'I understand now. I\'ll go back to her.', next: 'challenge' }],
        },
        obsidian: {
          text: 'Obsidian from the Anatolian hills — blades sharper than any bronze. The temple scribes will fight over these.',
          choices: [{ label: 'Hand over the blades.', effect: ctx => { ctx.quests.deliver('sharpedges', ctx.econ); }, next: 'thanks' }],
        },
        thanks: { text: 'The temple\'s thanks, and Nanna\'s light on your road. May your ledger always balance.', choices: [] },
      },
    },
  },
  {
    id: 'kamani', name: 'Kamani', title: 'Obsidian Knapper', city: 'catalhoyuk', era: 1,
    offset: [6, 4], hatKind: 'none', palette: { robe: 0x6e5b3c, trim: 0x4a3d28, skin: 0xb97f4e },
    dialogue: {
      start: (ctx) => ctx.quests.isDone('sharpedges') ? 'after' : (ctx.quests.isActive('sharpedges') ? 'during' : 'root'),
      nodes: {
        root: {
          text: 'Mind the ladder — in Catalhoyuk we walk on the roofs and climb down into our houses. My family has knapped obsidian since before anyone counted years: volcanic glass, fresh from the mountain, edges finer than a hair. Towns a month\'s walk away trade for it.',
          choices: [
            { label: 'I will carry 3 obsidian to Ur for you.', effect: ctx => { ctx.quests.accept('sharpedges'); }, next: 'accepted' },
            { label: 'How old is this town, truly?', next: 'lore' },
          ],
        },
        lore: { text: 'Older than kings, older than writing — thousands of years before the river cities had names. No palace, no temple-tower: just houses packed wall to wall, the dead buried under the floors, and trade in glass and grain. Cities did not need pharaohs to begin.', choices: [{ label: 'Remarkable. About that obsidian run —', effect: ctx => { ctx.quests.accept('sharpedges'); }, next: 'accepted' }] },
        accepted: { text: 'Buy the blades in our market — cheapest in the world, we sit on the source. Nin-Banda at Ur pays temple rates.', choices: [] },
        during: { text: 'Three obsidian, to Nin-Banda at Ur. Buy them here at the market if your packs are light.', choices: [] },
        after: { text: 'The temple paid? Good. Glass for grain, grain for glass — so it has gone for five thousand years.', choices: [] },
      },
    },
  },
  {
    id: 'herodotus', name: 'Herodotus', title: 'of Halicarnassus, writing his Inquiries', city: 'athens', era: 2,
    offset: [-7, 3], hatKind: 'none', palette: { robe: 0xd8d2c4, trim: 0x9a917f, skin: 0xd9a066 },
    dialogue: {
      start: (ctx) => {
        if (ctx.quests.turnInReady('heavenlyhorses', 'herodotus', ctx.econ)) return 'silk';
        if (ctx.quests.isDone('histories')) return 'after';
        if (ctx.quests.isActive('histories')) return ctx.quests.turnInReady('histories', 'herodotus', ctx.econ) ? 'turnin' : 'during';
        return 'root';
      },
      nodes: {
        root: {
          text: 'A trader! Sit, sit. I am writing an inquiry — historia, we say — so that the deeds of Greeks and barbarians alike are not erased by time. I have walked Egypt, where the river\'s flood is a calendar and the whole land, as I wrote, is the river\'s gift. But my notes on the far east are thin. Traders see what scholars only hear of.',
          choices: [
            { label: 'I will gather accounts in Ur and Varanasi for you.', effect: ctx => { ctx.quests.accept('histories'); }, next: 'accepted' },
            { label: 'Why write any of it down?', next: 'lore' },
          ],
        },
        lore: { text: 'Because memory dies and stories rot into legend. I check what I am told — when I cannot, I say so plainly and let the reader judge. Some call me the father of history for it. The method matters more than the name: ask, compare, doubt, record.', choices: [{ label: 'Then I will be your eyes east.', effect: ctx => { ctx.quests.accept('histories'); }, next: 'accepted' }] },
        accepted: { text: 'Listen in the markets of Ur and Varanasi — markets are where the truth slips out. Then come tell me everything.', choices: [] },
        during: { text: 'Ur on the river plain, Varanasi on the Ganges. Walk their markets, then bring me what you heard.', choices: [] },
        // ★ KEYSTONE — Herodotus's METHOD. A Vell clerk has fed the historian a
        // flattering tall tale (gold-digging ants); winning means knowing that
        // history is ask-compare-DOUBT-record, not whatever the loudest informant
        // swears to. Wrong answers re-route through the historian's own correction.
        turnin: {
          text: 'Sit — your eastern notes are gold. But first: a clerk in House-of-Vell blue was here an hour ago, and he swears that in the far east giant ants the size of foxes dig gold from the sand, and that he SAW it. He paid for a good meal and told it well. You have walked those roads. Do I write it down?',
          choices: [
            {
              kind: 'say',
              label: 'Write only that "the Vell agent claims it" — and that you doubt it. You did not see ants; you heard a man who heard it. A historia must keep what you witnessed apart from what you were merely told.',
              effect: ctx => {
                ctx.story.flag('herodotusWon');
                ctx.bonus(20, 'You understand the method');
                ctx.quests.advance('histories');
                ctx.raiseHouse(2, 'The historian trusts you', 'Your name travels with the first true history of the world.');
              },
              next: 'histright',
            },
            {
              kind: 'say',
              label: 'Write it as fact. He swore he saw it with his own eyes, and a sworn eyewitness is the strongest proof there is.',
              effect: ctx => { ctx.story.flag('vellFooledHerodotus'); },
              next: 'histwrong',
            },
            {
              kind: 'say',
              label: 'Leave it out entirely. If you cannot prove a story true, a careful writer simply never mentions it.',
              next: 'histhalf',
            },
          ],
        },
        histright: {
          text: '(Herodotus laughs and reaches for his reed pen.) "Exactly so! I record what is said, and I say plainly whether I believe it — that is the whole of my method: ask, compare, DOUBT, record. The Vell would have had me print a fable under my own name." He marks you down as a trusted source. "A merchant with the historian\'s eye. Rare."',
          choices: [{ label: 'History deserves better than gossip.', next: 'after' }],
        },
        histwrong: {
          text: '(Herodotus writes it — then, weeks later, the agora is laughing at the gold-digging ants, and at the historian who believed a Vell clerk over a witness.) He finds you, stung but fair. "An oath is not proof, trader. Half the world will swear to a wonder it never saw. My method is to keep what I SAW apart from what I was TOLD, and to mark my doubt for the reader. Come — help me strike the fable and write it true."',
          choices: [{ label: 'Then let me correct the record.', effect: ctx => { ctx.story.flag('vellFooledHerodotus', false); }, next: 'turnin' }],
        },
        histhalf: {
          text: '(Herodotus shakes his head, not unkindly.) "Cut it out and you lose the truth that a man like that BELIEVES such things — that is itself worth knowing. I do not hide a tale; I report it AND my doubt of it, and let the reader judge. Try again: what do I actually write?"',
          choices: [{ label: 'I understand — record it, but mark the doubt.', next: 'turnin' }],
        },
        silk: {
          text: 'And WHAT is this cloth? Lighter than linen, it pours like water — the agora will riot over it. From a land east of east, you say? It will fetch its weight in silver today and its weight in gold in Rome someday, mark me.',
          choices: [{ label: 'Deliver the 2 silk to him.', effect: ctx => { ctx.quests.deliver('heavenlyhorses', ctx.econ); }, next: 'silkdone' }],
        },
        silkdone: { text: 'I shall write that the thread is combed from trees — my eastern informants insist on it. If that is wrong, the fault is theirs; a good historian reports even what he doubts.', choices: [] },
        after: { text: 'The inquiry never ends. Cities that were great are now small, and cities now great were nothing once — fortune never stays. That line goes in the book.', choices: [] },
      },
    },
  },
  {
    id: 'ashoka-envoy', name: 'Devala', title: 'Dhamma Envoy of King Ashoka', city: 'varanasi', era: 2,
    offset: [6, -4], hatKind: 'turban', palette: { robe: 0xc4622d, trim: 0x8a3f1a, skin: 0xa9672f, hat: 0xe0a93c },
    dialogue: {
      start: (ctx) => ctx.quests.isDone('edict') ? 'after' : (ctx.quests.isActive('edict') ? (ctx.quests.turnInReady('edict', 'ashoka-envoy', ctx.econ) ? 'turnin' : 'during') : 'root'),
      nodes: {
        root: {
          text: 'Peace on your road. I carry the words of Ashoka, lord of the Mauryan lands. After his war on Kalinga — a hundred thousand dead — the king\'s heart turned. Now he carves edicts on rocks and pillars across the realm: conquer by dhamma, by right conduct, not by the sword. The thirteenth edict even names the Greek kings to the far west.',
          choices: [
            { label: 'I trade toward Athens — I will carry the edict west.', effect: ctx => { ctx.quests.accept('edict'); }, next: 'accepted' },
            { label: 'What does dhamma ask of a merchant?', next: 'lore' },
          ],
        },
        lore: { text: 'Honesty in the scales, kindness on the road, care for travelers — the king plants shade trees and digs wells along the trade routes for exactly your sake. Nearby, at Sarnath, the Buddha first set the wheel of teaching turning; the king\'s missionaries now carry it beyond India.', choices: [{ label: 'Then the edict travels with me.', effect: ctx => { ctx.quests.accept('edict'); }, next: 'accepted' }] },
        accepted: { text: 'Read it in the agora of Athens, where speakers are heard. Then return, and the king\'s treasury will thank you properly.', choices: [] },
        during: { text: 'West, to Athens. Read the edict where the Greeks gather, then return to me.', choices: [] },
        turnin: { text: 'So Greek ears have heard a Mauryan king renounce conquest. Whether they believed it hardly matters — the words now travel without us. The king\'s thanks, in silver.', choices: [{ label: 'Accept the reward.', effect: ctx => { ctx.quests.advance('edict'); }, next: 'after' }] },
        after: { text: 'Stone outlasts armies, trader. Twenty-two centuries on, the edicts will still be read. Walk gently.', choices: [] },
      },
    },
  },
  {
    id: 'zhangqian', name: 'Zhang Qian', title: 'Envoy of the Han Emperor Wu', city: 'changan', era: 2,
    offset: [-6, -4], hatKind: 'scholar', palette: { robe: 0x8a1f2d, trim: 0x4a1018, skin: 0xd9b07c, hat: 0x1c1c24 },
    dialogue: {
      start: (ctx) => ctx.quests.isDone('heavenlyhorses') ? 'after'
        : ctx.quests.isActive('heavenlyhorses') ? (ctx.quests.turnInReady('heavenlyhorses', 'zhangqian', ctx.econ) ? 'turnin' : 'during')
        : (ctx.quests.isAvailable('heavenlyhorses', ctx.era()) ? 'root' : 'locked'),
      nodes: {
        locked: { text: 'I am Zhang Qian. Thirteen years I was gone west for the emperor — ten of them a prisoner of the Xiongnu. When you are a trader of real name, come back; I have an errand worthy of the road.', choices: [] },
        root: {
          text: 'You know my story? Emperor Wu sent me west to find allies against the Xiongnu. I was captured, held ten years, escaped, and walked on — Ferghana, Bactria, lands no Han map had names for. I failed at alliances and succeeded at something larger: now the roads I scouted carry silk west and horses east. The emperor wants the great Ferghana horses — "heavenly horses," he calls them. And I want our silk seen in the far west.',
          choices: [
            { label: 'Horses east, silk west — I am your trader.', effect: ctx => { ctx.quests.accept('heavenlyhorses'); }, next: 'accepted' },
            { label: 'Why do horses matter so much to China?', next: 'lore' },
          ],
        },
        lore: { text: 'Because the steppe fights on horseback and we must answer in kind — and good cavalry mounts do not breed well in our wet rice country. So we trade what only we make for what we cannot raise: bolts of silk for strings of horses. Whole dynasties will balance on that exchange.', choices: [{ label: 'Then put me on the road.', effect: ctx => { ctx.quests.accept('heavenlyhorses'); }, next: 'accepted' }] },
        accepted: { text: 'Horses are sold in the western highlands — Anatolian stock at Catalhoyuk trades fair. Two good mounts to me here. Then carry two bolts of our silk to that Greek writer in Athens — let the west see what the east weaves. Buy the silk here; nowhere on earth is it cheaper.', choices: [] },
        during: { text: 'Two horses to me at Chang\'an; then two silk to Herodotus in Athens; then report back. The whole Silk Road, in one errand.', choices: [] },
        // ★ KEYSTONE — WHY the Silk Road exchange holds: complementary scarcity.
        // China alone makes silk; only the steppe/Ferghana breeds warhorses China
        // cannot raise in its wet rice country. A Vell trader has told the envoy
        // the road runs on whoever charges least; the player wins by naming the
        // real engine. Wrong answers re-route through Zhang Qian's correction.
        turnin: {
          text: 'The Greek raved about the cloth — good. But before the emperor\'s reward, settle a thing for me. A House-of-Vell trader stood here yesterday and offered to run this route cheaper than you. "It is all about price," he said. You have now carried silk west and horses east with your own hands. Tell me plainly: what truly makes this road WORK?',
          choices: [
            {
              kind: 'say',
              label: 'Not price — need. Only China makes silk, and only the western steppe breeds horses your wet rice country cannot raise. Each side has what the other simply cannot make. That is why silk flows west and horses east no matter who charges what.',
              effect: ctx => {
                ctx.story.flag('zhangqianWon');
                ctx.bonus(30, 'You understand the road');
                ctx.quests.advance('heavenlyhorses');
                ctx.raiseHouse(2, 'The Han court knows your name', 'Your house is written into the road that will outlive every empire on it.');
              },
              next: 'hhright',
            },
            {
              kind: 'say',
              label: 'Price is everything. Whoever sells silk and horses cheapest will own this road — the Vell trader is right.',
              effect: ctx => { ctx.story.flag('vellWonRound'); },
              next: 'hhwrong',
            },
            {
              kind: 'say',
              label: 'The road works because the emperor commands it to. Imperial will, not goods, keeps the caravans moving.',
              next: 'hhhalf',
            },
          ],
        },
        hhright: {
          text: '"Need, not price — yes." Zhang Qian almost smiles. "Cut your price to nothing and you still cannot conjure silk in Ferghana or warhorses in the rice paddies. Two lands, each with what the other lacks — that is the engine the Vell will never undercut. They will call this the Silk Road, and you were early, and you UNDERSTOOD it." He seals the emperor\'s bonus into your purse.',
          choices: [{ label: 'Collect the emperor\'s reward.', next: 'after' }],
        },
        hhwrong: {
          text: '(Zhang Qian sets down the silk and shakes his head.) "Then race the Vell to the bottom and you both starve. Think, trader: drop your price to a single coin — can you make warhorses appear in our wet south? Can the steppe weave silk for any sum? No. The road runs on what each land CANNOT make for itself; price is only the haggling on top. The Vell would have you forget that and lose everything. Tell me again — what makes it work?"',
          choices: [{ label: 'I see it now — let me answer true.', effect: ctx => { ctx.story.flag('vellWonRound', false); }, next: 'turnin' }],
        },
        hhhalf: {
          text: '(Zhang Qian raises a brow.) "The emperor wishes it, surely — but emperors have wished for many roads that never opened. This one opened because the goods are TRUE: silk only we can make, horses only the steppe can breed. Command cannot conjure what a land cannot grow. The need is the engine; the emperor only paid for the road. Answer me once more."',
          choices: [{ label: 'Complementary need — I have it now.', next: 'turnin' }],
        },
        after: { text: 'Grapes and alfalfa came back in my saddlebags; silk and paper go west in yours. Roads change the world more than battles do.', choices: [] },
      },
    },
  },
  {
    id: 'vandak', name: 'Vandak', title: 'Sogdian Caravan-Master', city: 'changan', era: 3,
    offset: [7, 4], hatKind: 'cap', palette: { robe: 0x3c6e4f, trim: 0x24452f, skin: 0xc98a5b, hat: 0x24452f },
    dialogue: {
      start: 'root',
      nodes: {
        root: {
          text: 'A western face in the Western Market — welcome, colleague. We Sogdians run the middle of the Silk Road; our letters and our credit move goods we never touch. Rule of the road: never carry one cargo when you can carry three, and never sleep outside a caravanserai.',
          choices: [
            { label: 'What is a caravanserai worth to me?', next: 'lore' },
            { label: 'Any trade tips for Chang\'an?', next: 'tips' },
          ],
        },
        lore: { text: 'Walled courtyard inns, a day\'s march apart along the whole road — water, fodder, guards, gossip. The toll stings; losing a season\'s cargo to raiders stings worse. Pay the wall, sleep inside it.', choices: [] },
        tips: { text: 'Silk, porcelain, paper and tea are cheapest on earth right here. Horses sell to the Son of Heaven at double. And bring GLASS if you ever pass the western workshops — fine glassware amazes even this city.', choices: [] },
      },
    },
  },
  {
    id: 'mansamusa', name: 'Mansa Musa', title: 'Lord of Mali, preparing the hajj', city: 'timbuktu', era: 3,
    offset: [-7, -4], hatKind: 'crown', palette: { robe: 0xe0b53c, trim: 0x9c7a1e, skin: 0x6b4226, hat: 0xffd700 },
    dialogue: {
      start: (ctx) => ctx.quests.isDone('goldenhajj') ? 'after' : (ctx.quests.isActive('goldenhajj') ? (ctx.quests.turnInReady('goldenhajj', 'mansamusa', ctx.econ) ? 'turnin' : 'during') : 'root'),
      nodes: {
        root: {
          text: 'Approach. I am Musa, mansa of Mali — and Mali, merchant, is where the camel meets the canoe: salt rides south across the sand, gold rides north, and we tax the meeting. I ride to Mecca on pilgrimage with sixty thousand souls. The caravan wants gold for alms and salt for the road, and I pay royal rates.',
          choices: [
            { label: 'Four gold, two salt — I will supply the hajj.', effect: ctx => { ctx.quests.accept('goldenhajj'); }, next: 'accepted' },
            { label: 'Is Timbuktu truly a city of books?', next: 'lore' },
          ],
        },
        lore: { text: 'Ask any trader on the square: manuscripts out-earn most cargo in this city. Scholars at Sankore copy law, astronomy, medicine. I bring back architects and book-chests from the east; gold buys many things, but a library keeps them.', choices: [{ label: 'Then let me supply the hajj.', effect: ctx => { ctx.quests.accept('goldenhajj'); }, next: 'accepted' }] },
        accepted: { text: 'Gold is cheapest here at the source — and salt, mark you, is DEAR here; the slabs walk in from Taghaza in the north. Buy your salt on the Mediterranean side and carry it down across the sand like a real azalai.', choices: [] },
        during: { text: 'Four gold, two salt, to my stewards here. The desert road north has salt at honest prices.', choices: [] },
        turnin: {
          text: 'Well supplied. Now advise your king, merchant — in Cairo I could scatter gold to every beggar in the city. Generosity honors God. What does it do to Cairo\'s gold price?',
          choices: [
            { label: 'Flooding the market will CRASH the price — give measured alms.', effect: ctx => { ctx.bonus(35, 'You understand supply and demand'); ctx.story.flag('mansaMusaWon'); ctx.quests.deliver('goldenhajj', ctx.econ); ctx.raiseHouse(2, 'A king takes your counsel', 'The mansa of Mali weighs your word — the House of the Open Road is named in gold.'); }, next: 'right' },
            { label: 'Gold is gold — the price cannot move. Scatter freely.', effect: ctx => { ctx.quests.deliver('goldenhajj', ctx.econ); }, next: 'wrong' },
          ],
        },
        right: { text: 'So my own treasurers warn me. (And yet I fear I shall scatter it anyway — kings are bad at small gestures. If Cairo\'s gold is cheap for a dozen years, historians may forgive me; the chroniclers will at least take notes.) A bonus for a merchant who thinks.', choices: [] },
        wrong: { text: 'My treasurers say otherwise: pour enough gold into one city and gold itself grows cheap — Cairo may feel my visit for years. Supply moves price, merchant. Remember it; your ledger depends on it.', choices: [] },
        after: { text: 'When I return I shall build: mosques, schools, the great library rooms. They will draw my face on maps of the world holding a gold coin. Let them — it is good advertising for Mali.', choices: [] },
      },
    },
  },
  {
    id: 'ibnbattuta', name: 'Ibn Battuta', title: 'Traveler of the Dar al-Islam', city: 'timbuktu', era: 3,
    offset: [7, 4], hatKind: 'turban', palette: { robe: 0xf0ead8, trim: 0xb8ad90, skin: 0xb97f4e, hat: 0xf0ead8 },
    dialogue: {
      start: (ctx) => ctx.quests.isDone('longestjourney') ? 'after'
        : ctx.quests.isActive('longestjourney') ? (ctx.quests.turnInReady('longestjourney', 'ibnbattuta', ctx.econ) ? 'turnin' : 'during')
        : (ctx.quests.isAvailable('longestjourney', ctx.era()) ? 'root' : 'locked'),
      nodes: {
        locked: { text: 'I left Tangier at twenty-one to make the pilgrimage and did not stop walking for nearly thirty years. When your own roads have hardened your feet, come — I have a commission for a real traveler.', choices: [] },
        root: {
          text: 'Sit, traveler, the shade is free. I have crossed the Sahara to this city of gold and books, judged law for the Sultan in Delhi, seen the Swahili ports and — God willing my memory serves — the harbors of China. A scribe in Fez will one day write it all down as my Rihla. But roads change behind a traveler. Walk two legs of my old road and tell me how they fare.',
          choices: [
            { label: 'Varanasi and Chang\'an — I will walk your road.', effect: ctx => { ctx.quests.accept('longestjourney'); }, next: 'accepted' },
            { label: 'How does one man cross so much world?', next: 'lore' },
          ],
        },
        lore: { text: 'By the Dar al-Islam, friend — from Morocco to the Malay seas, a traveler finds the same law, lodging at the madrasas, and qadis who need an extra judge. Faith built the road network; trade keeps it swept. I rarely paid for a bed in thirty years.', choices: [{ label: 'I will walk the two legs.', effect: ctx => { ctx.quests.accept('longestjourney'); }, next: 'accepted' }] },
        accepted: { text: 'To the Ganges, then to the Silk Road\'s eastern gate. Markets, tolls, who rules, what the bread costs — bring me the details. Details are what make a Rihla worth reading.', choices: [] },
        during: { text: 'Varanasi, then Chang\'an. Walk them, watch them, return. My knees thank you for the loan of yours.', choices: [] },
        // ★ KEYSTONE — the Dar al-Islam as a connected world. One traveler crossed
        // from Morocco to China because a shared faith, law, and language of lodging
        // knit the network together — culture and institutions, not armies, made it
        // one road. A Vell man insists only paid guards keep travelers alive; the
        // player wins by naming the real connective tissue. Wrong paths re-teach.
        turnin: {
          text: 'You walked my old road — good. Now answer the question I ask every traveler, because a Vell agent here gives me the wrong answer with great confidence. He says a man like me only survived thirty years of roads because someone PAID for guards every mile. But you have walked it now. HOW does one traveler cross half the world — Morocco to the Ganges to China — and find welcome the whole way?',
          choices: [
            {
              kind: 'say',
              label: 'Because it is one connected world, not a string of strangers. From Morocco to the Malay seas a traveler finds the same faith, the same law, madrasas that house him, and qadis who need a judge. Shared faith and law made the road one road — that is what carried you, not hired spears.',
              effect: ctx => {
                ctx.story.flag('ibnbattutaWon');
                ctx.bonus(30, 'You grasp the connected world');
                ctx.quests.advance('longestjourney');
                ctx.raiseHouse(2, 'A famed traveler vouches for you', 'Your house is known wherever the Dar al-Islam reaches — from the Sahara to the China seas.');
              },
              next: 'ljright',
            },
            {
              kind: 'say',
              label: 'Only paid guards. The roads are safe because someone bought enough spears — the Vell man is right; coin and steel keep a traveler alive, nothing more.',
              effect: ctx => { ctx.story.flag('vellWonRound'); },
              next: 'ljwrong',
            },
            {
              kind: 'say',
              label: 'Pure luck. You simply met kind strangers again and again across thirty years.',
              next: 'ljhalf',
            },
          ],
        },
        ljright: {
          text: '(Ibn Battuta presses both your hands.) "One world — yes, that is the whole secret. The Dar al-Islam is a fabric: the same prayer in Delhi and in Mali, the same law, the madrasas that fed and bedded me for nearly thirty years. I rarely paid for a roof. Faith built the network; trade keeps it swept. The Vell sees only the spears and misses the WORLD." He hands you a heavy purse. "Go look at all of it."',
          choices: [{ label: 'Accept his blessing and the purse.', next: 'after' }],
        },
        ljwrong: {
          text: '(Ibn Battuta laughs, but corrects you.) "Spears? I bought few and met fewer. Think: who fed me in Delhi, judged beside me in the Maldives, lodged me in Mali — strangers, all, yet not strangers. We shared a faith, a law, a tongue of prayer. That fabric — the Dar al-Islam — is what let one man cross half the earth. The Vell man counts guards and cannot see the world that made guards unnecessary. Answer me again."',
          choices: [{ label: 'I understand the fabric now — let me answer.', effect: ctx => { ctx.story.flag('vellWonRound', false); }, next: 'turnin' }],
        },
        ljhalf: {
          text: '(Ibn Battuta shakes his head gently.) "Luck thirty years running? No traveler is that fortunate. It was not luck but a CONNECTED world — one faith, one law, madrasas and qadis from Morocco to China, all expecting a fellow believer. That sameness is what carried me. Name it plainly and the purse is yours."',
          choices: [{ label: 'A shared world of faith and law — I have it.', next: 'turnin' }],
        },
        after: { text: 'I have seen more of the world than any man of my age, and the secret is shameful: I simply did not go home. May your roads be long, trader.', choices: [] },
      },
    },
  },
  {
    id: 'zhenghe', name: 'Zheng He', title: 'Admiral of the Ming Treasure Fleet', city: 'calicut', era: 4,
    offset: [-7, 4], hatKind: 'scholar', palette: { robe: 0x20406e, trim: 0x122844, skin: 0xd9b07c, hat: 0x122844 },
    dialogue: {
      start: (ctx) => ctx.quests.isDone('treasurefleet') ? 'after' : (ctx.quests.isActive('treasurefleet') ? (ctx.quests.turnInReady('treasurefleet', 'zhenghe', ctx.econ) ? 'turnin' : 'during') : 'root'),
      nodes: {
        root: {
          text: 'You stand in Calicut, pepper port of the Zamorin, and that forest of masts in the bay is the Ming treasure fleet — hundreds of hulls, the greatest ships afloat, and I, Zheng He, command them. The Yongle Emperor sends us not to conquer but to be SEEN: we trade porcelain and silk, collect tribute and wonders, and chart every coast from here to Africa. We even carried home a giraffe.',
          choices: [
            { label: 'I can supply porcelain and silk for the exchange.', effect: ctx => { ctx.quests.accept('treasurefleet'); }, next: 'accepted' },
            { label: 'How do hundreds of ships even navigate together?', next: 'lore' },
          ],
        },
        lore: { text: 'Compass, star charts, sounding lines — and above all the monsoon. The wind here is a CALENDAR: it blows toward India half the year and back the other half. Sail with it and the ocean is a highway; sail against it and the ocean is a wall.', choices: [{ label: 'Then let me supply the exchange.', effect: ctx => { ctx.quests.accept('treasurefleet'); }, next: 'accepted' }] },
        accepted: { text: 'Three porcelain, one silk, to the fleet\'s factors here. Chang\'an\'s markets sell both cheapest — a long haul, but you look like a trader who knows the roads by now.', choices: [] },
        during: { text: 'Three porcelain and one bolt of silk to the fleet here at Calicut. The kilns of the east price them best.', choices: [] },
        turnin: {
          text: 'Fine ware, well packed. Before the factors pay you — a navigator\'s question, since you sail these waters now. The fleet must return north and east to China. WHICH monsoon do we wait for?',
          choices: [
            { label: 'The summer southwest monsoon — it blows from the sea toward Asia.', effect: ctx => { ctx.bonus(40, 'You read the monsoon like a pilot'); ctx.story.flag('zhengheWon'); ctx.quests.deliver('treasurefleet', ctx.econ); ctx.raiseHouse(2, 'The admiral marks your chart', 'The greatest fleet on earth trusts your house with its course home.'); }, next: 'right' },
            { label: 'The winter northeast monsoon — it blows from Asia out to sea.', effect: ctx => { ctx.quests.deliver('treasurefleet', ctx.econ); }, next: 'wrong' },
          ],
        },
        right: { text: 'A pilot\'s answer. The southwest wind of summer carries hulls north and east toward China; the northeast wind of winter brings them back. Whole civilizations set their clocks by it. The factors add a navigator\'s bonus to your pay.', choices: [] },
        wrong: { text: 'Backwards, trader — the WINTER northeast wind blows away from Asia; it would pin us here. We wait for the SUMMER southwest monsoon to run home. No shame: every sailor learns it once. Your pay stands.', choices: [] },
        after: { text: 'One day the court will burn the sailing charts and turn inward, and the ocean we mapped will fill with other flags. Remember the fleet was here first — and came to trade.', choices: [] },
      },
    },
  },
  {
    id: 'lorenzo', name: 'Lorenzo de\' Medici', title: 'First citizen of Florence', city: 'florence', era: 4,
    offset: [6, -4], hatKind: 'cap', palette: { robe: 0x5e2434, trim: 0x3a1620, skin: 0xd9a066, hat: 0x3a1620 },
    dialogue: {
      start: (ctx) => ctx.quests.isDone('patron') ? 'after' : (ctx.quests.isActive('patron') ? (ctx.quests.turnInReady('patron', 'lorenzo', ctx.econ) ? 'turnin' : 'during') : 'root'),
      nodes: {
        root: {
          text: 'A merchant — good, Florence speaks your language. Our bank\'s branches stretch from London to Rome; the gold florin is trusted in ports that have never seen Tuscany. And what do I spend it on? Painters. Sculptors. And BOOKS — my agents hunt Greek manuscripts the way other princes hunt stags. A boy named Michelangelo eats at my table; the ancients should be on my shelves to teach him.',
          choices: [
            { label: 'Manuscripts and gold — I can supply both.', effect: ctx => { ctx.quests.accept('patron'); }, next: 'accepted' },
            { label: 'Why does a banker buy art at all?', next: 'lore' },
          ],
        },
        lore: { text: 'Three reasons, in honest order: glory for Florence, glory for God, and glory for the house of Medici. The rebirth around you — men call it a rinascita, a renaissance — runs on trade money. No ledgers, no Botticelli. Remember that when someone sneers at merchants.', choices: [{ label: 'Then let a merchant supply the rebirth.', effect: ctx => { ctx.quests.accept('patron'); }, next: 'accepted' }] },
        accepted: { text: 'Two Greek manuscripts — Athens\' copyists still sell them, and Timbuktu\'s book markets amaze my agents. And three measures of gold; the African route through Timbuktu prices it best. The library waits.', choices: [] },
        during: { text: 'Two manuscripts, three gold, to the palazzo. The library shelf I have in mind is exactly that wide.', choices: [] },
        turnin: { text: 'Aristotle in a Timbuktu binding — magnificent. The copyists go to work tonight; printed editions follow, and then no fire can ever take these words again. Your florins, trader, and Florence\'s thanks.', choices: [{ label: 'Accept the florins.', effect: ctx => { ctx.quests.deliver('patron', ctx.econ); }, next: 'after' }] },
        after: { text: 'They will call this century a golden age and forget it was bought one cargo at a time — by people exactly like you. The Medici remember.', choices: [] },
      },
    },
  },
  // ---- THE VELL, RECURRING ----
  // The rival house follows you era to era, each agent a colder shade of the
  // same steel-blue. They taunt before you've earned the era's keystone and
  // shrink after — gated on the keystone story flags so the rivalry has a clock.
  // Era IV's senior partner closes the arc with the resolution cutscene.
  {
    id: 'vell-east', name: 'Roshanak', title: 'Factor of the House of Vell', city: 'changan', era: 2,
    offset: [-7, 6], hatKind: 'hood', palette: VELL_PAL,
    dialogue: {
      start: (ctx) => (ctx.story.is('zhangqianWon') || ctx.story.is('herodotusWon')) ? 'beaten' : 'taunt',
      nodes: {
        taunt: {
          text: '(A Vell factor in travel-stained blue blocks the Western Market gate.) So the ghost-house reaches Chang\'an. We heard about your little win at Ur — one temple roof, how quaint. The House of Vell has counting-rooms in every port from here to the Greek sea now. Run your donkeys while you can, heir. The classical world is already ours.',
          choices: [
            { label: 'You said the same at Ur. How did that end?', next: 'jab' },
            { label: 'We will see whose name the road remembers.', next: '@close' },
          ],
        },
        jab: { text: 'A fluke. The priestess pitied a dead woman\'s child. It will not happen twice — we have bought the scribes who set the prices here. Enjoy the view of our wharves.', choices: [] },
        beaten: {
          text: '(The Vell factor will not quite meet your eye.) The Han court speaks your house\'s name now, and the Greek writer struck OUR story from his book and kept yours. Two roads we meant to own, and you understood both better than our gold could. (A pause.) The House of Vell does not forget. We will be waiting on the next road — and the next.',
          choices: [{ label: 'I will be on it before you.', next: '@close' }],
        },
      },
    },
  },
  {
    id: 'vell-south', name: 'Garai', title: 'Banker of the House of Vell', city: 'timbuktu', era: 3,
    offset: [6, 6], hatKind: 'hood', palette: VELL_PAL,
    dialogue: {
      start: (ctx) => (ctx.story.is('mansaMusaWon') || ctx.story.is('ibnbattutaWon')) ? 'beaten' : 'taunt',
      nodes: {
        taunt: {
          text: '(A Vell banker counts gold dust on a brass scale and does not look up.) The Open Road, in Timbuktu. We have been telling this city a simple truth, heir: your house died on the eastern road with its master. A ghost cannot hold a contract. The mansa\'s court, the salt caravans, the book markets — the House of Vell banks them all now. You are a rumor with a donkey.',
          choices: [
            { label: 'My mother is missing. The house is not.', next: 'jab' },
            { label: 'Spread your lie. I will spread honest contracts.', next: '@close' },
          ],
        },
        jab: { text: 'Missing. Died. The market hears no difference, and the market is all that matters. Go on — try to outbid a banking house with a string of camels.', choices: [] },
        beaten: {
          text: '(The banker\'s scale has stopped moving.) The mansa took your counsel on the gold price over ours. The famed traveler vouches for your house in every caravanserai from here to China. Our "ghost" story is dead — one cannot bury a house the whole Dar al-Islam is talking about. (Coldly.) There is one more road, heir. The sea-road, the new global one. The House of Vell will make its stand there.',
          choices: [{ label: 'Then I will meet you at the far shore.', next: '@close' }],
        },
      },
    },
  },
  {
    // ANTAGONIST'S RESOLUTION. The senior partner, in Florence. When the player
    // has won the late keystones, talking to him plays the VELL_RESOLVE cutscene
    // (via ctx.playStory) and secures the house's name for good.
    id: 'vell-master', name: 'Lord Vasht', title: 'Master of the House of Vell', city: 'florence', era: 4,
    offset: [-6, 6], hatKind: 'cap', palette: VELL_PAL,
    dialogue: {
      start: (ctx) => {
        if (ctx.story.is('vellBeaten')) return 'gone';
        const lateWins = (ctx.story.is('zhengheWon') ? 1 : 0) + (ctx.story.is('mansaMusaWon') ? 1 : 0) + (ctx.story.is('ibnbattutaWon') ? 1 : 0);
        return lateWins >= 2 ? 'reckoning' : 'taunt';
      },
      nodes: {
        taunt: {
          text: '(The master of the House of Vell receives you in a Florentine palazzo, the standing offer to buy your name laid on the table between you.) Sit, heir. I have watched my factors lose to you on three continents and I have decided you are worth a fair price. Sell me the House of the Open Road — the name, the routes, the ledger. Walk away rich. Refuse, and I will simply outspend you until you vanish.',
          choices: [
            { label: 'Win the sea-road first. Then we will talk about who buys whom.', next: 'wait' },
            { label: 'The house is not for sale. It never was.', next: 'wait' },
          ],
        },
        wait: { text: 'Bold. Prove it on the new ocean, then — the monsoon coast, the treasure fleets, Calicut. Come back when you have. I will still be here, and my offer will be lower.', choices: [] },
        reckoning: {
          text: '(The master of the House of Vell rises slowly. His factors are gone — defected to the very roads you opened. The standing offer is still on the table.) You have walked every road we tried to buy, and understood each one before our gold could reach it. I came to Florence to bury a name. Instead I find it carved into every market on Earth.',
          choices: [{ label: 'Then hear how it ends.', effect: ctx => { ctx.story.flag('vellBeaten'); ctx.playStory('vellResolveSeen', 'VELL_RESOLVE', 3, 'The name is secure', 'The House of Vell withdraws from the great routes. Your house carries the road now.'); }, next: '@close' }],
        },
        gone: { text: '(The Vell palazzo stands empty, the brass nameplate already pried from the door. The House of Vell has withdrawn from the great routes for good.) The market keeps no monument to a house that tried to buy what it could not understand. Yours, it will remember.', choices: [] },
      },
    },
  },
  // ---- ambient color (period-true, no famous-name claims) ----
  {
    id: 'potter-athens', name: 'Kallias', title: 'Potter of the Kerameikos', city: 'athens', era: 2,
    offset: [8, 5], hatKind: 'none', palette: { robe: 0x9a4f2f, trim: 0x6e3520, skin: 0xd9a066 }, wander: 6,
    dialogue: { start: 'root', nodes: { root: { text: 'Black-figure ware, fired three times — they dig our vases out of graves from Etruria to the Black Sea. Athens exports oil, silver and art, and imports its very bread. Strange city: rich in everything except food.', choices: [] } } },
  },
  {
    id: 'pilot-calicut', name: 'Kunjali', title: 'Harbor Pilot of the Zamorin', city: 'calicut', era: 4,
    offset: [8, -5], hatKind: 'cap', palette: { robe: 0x2d7a6e, trim: 0x1a4a42, skin: 0xa9672f, hat: 0x1a4a42 }, wander: 7,
    dialogue: { start: 'root', nodes: { root: { text: 'Pepper made this harbor, the monsoon runs it. Arab dhows, Chinese junks, and since \'98 the Portuguese — who came asking for Christians and spices and brought cannon for the bargaining. The ocean is getting crowded, friend.', choices: [] } } },
  },
  {
    id: 'printer-florence', name: 'Maestro Bernardo', title: 'Printer', city: 'florence', era: 4,
    offset: [-8, 5], hatKind: 'cap', palette: { robe: 0x3c4a6e, trim: 0x242e45, skin: 0xd9a066, hat: 0x242e45 }, wander: 6,
    dialogue: { start: 'root', nodes: { root: { text: 'Movable type, friend — a German goldsmith\'s trick, barely a lifetime old, and already a scribe\'s year of copying comes off my press in a week. A book once cost a farm. Soon every clerk will own ten. Ideas travel cheaper than pepper now.', choices: [] } } },
  },
];

// ---------------- TRAVEL EVENT ZONES + EVENTS ----------------
export const ZONES = [
  { id: 'z-river', name: 'The River Road', x: 148, z: -90, r: 15, cool: 0, events: ['riverflood', 'rivertoll'] },
  { id: 'z-steppe', name: 'The Steppe Road', x: 70, z: -30, r: 15, cool: 0, events: ['caravanserai', 'paiza'] },
  { id: 'z-desert', name: 'The Sahara Crossing', x: 20, z: 130, r: 17, cool: 0, events: ['desertheat', 'saltcaravan'] },
  { id: 'z-medsea', name: 'The Coastal Passage', x: -186, z: 58, r: 15, cool: 0, events: ['seastorm', 'sailingseason'] },
  { id: 'z-highland', name: 'The Highland Pass', x: -120, z: -104, r: 15, cool: 0, events: ['passguide'] },
  { id: 'z-tuscany', name: 'The Hill Road', x: -34, z: -40, r: 14, cool: 0, events: ['quarantine', 'tollgate'] },
  { id: 'z-monsoon', name: 'The Monsoon Coast', x: -124, z: 180, r: 15, cool: 0, events: ['monsoon', 'convoy'] },
  { id: 'z-crossroads', name: 'The Eastern Crossroads', x: 176, z: -10, r: 14, cool: 0, events: ['pilgrims', 'bazaarrumor'] },
];

export const EVENTS = [
  {
    id: 'riverflood', minEra: 1, needCargo: true,
    title: 'The river is rising',
    text: 'Brown water climbs the levee and the ferrymen argue. Unlike the Nile, which floods on a calendar, the Tigris and Euphrates flood violently and WITHOUT warning. Your cargo is on the bank.',
    choices: [
      { label: 'Haul everything to the high levee and wait it out', hint: 'Mesopotamian villages were built on raised mounds for a reason', outcome: { good: true, xp: 18, text: 'The flood takes the road and spares the levee. You lose an afternoon and nothing else.', why: 'Mesopotamia\'s rivers flooded unpredictably — its cities and granaries stood on raised ground and levees precisely for this.' } },
      { label: 'Press on along the bank — time is money', outcome: { good: false, loseCargo: 2, text: 'The bank dissolves under the second surge. Two cargo packs vanish downstream.', why: 'Unpredictable flooding is the defining fact of the Tigris-Euphrates — it is why Mesopotamian religion and law sound so anxious compared to Egypt\'s.' } },
    ],
  },
  {
    id: 'rivertoll', minEra: 1, needCargo: true,
    title: 'The customs post of the river kings',
    text: 'A reed barrier and bored soldiers: the river kingdom taxes all cargo at one-tenth. The clerk\'s scale waits — and you notice the next channel is unguarded.',
    choices: [
      { label: 'Declare honestly and pay the tithe', hint: 'Cities kept written tariffs — and written blacklists', outcome: { good: true, coinsPct: -0.08, xp: 14, text: 'The clerk stamps your manifest in wet clay. Caravans with clean seals move faster at every post after this one.', why: 'River-valley states ran on recorded taxes — cuneiform tablets are mostly receipts. A trader\'s seal and reputation WERE his credit.' } },
      { label: 'Slip down the unguarded channel', outcome: { good: false, coinsPct: -0.2, text: 'The "unguarded" channel is the inspection trap. The fine is double the tithe, paid while the clerk reads you the relevant law.', why: 'Hammurabi-era law codes fixed punishments for evasion in advance — written law meant written fines.' } },
    ],
  },
  {
    id: 'caravanserai', minEra: 2, needCargo: true,
    title: 'Dust on the horizon',
    text: 'Riders shadow your caravan across the steppe. A walled caravanserai sits a half-day ahead — its keeper charges a stiff toll. The open shortcut through the gullies would save the fee and a full day.',
    choices: [
      { label: 'Pay the toll and sleep behind the walls', hint: 'There is a reason these inns stand a day\'s march apart', outcome: { good: true, coins: -10, xp: 18, text: 'The riders circle the walls once and melt away. Inside: water, fodder and the best route gossip on the road.', why: 'Caravanserais — fortified inns spaced roughly a day\'s travel apart — are what made Silk Road trade survivable. The toll was insurance.' } },
      { label: 'Take the gully shortcut and save the fee', outcome: { good: false, loseCargo: 2, coins: -15, text: 'The riders were waiting where the gullies narrow. They take what they can carry and leave you the lesson.', why: 'Banditry was the Silk Road\'s constant tax — which is why merchants paid for walls, guards and, later, Mongol protection.' } },
    ],
  },
  {
    id: 'paiza', minEra: 3, needCargo: true,
    title: 'Riders of the Great Khan',
    text: 'Mongol cavalry block the road — not raiders: officials. Under the Pax Mongolica the khan\'s peace protects traders who carry a paiza, the metal passport-tablet, and pay the registered duty.',
    choices: [
      { label: 'Pay the duty and ride under the khan\'s peace', hint: 'One empire now runs the whole road', outcome: { good: true, coinsPct: -0.06, xp: 20, text: 'Stamped, sealed, escorted to the next station. The road has never been this safe in a thousand years.', why: 'The Mongol Empire made the Silk Road safer than ever — one law from China to Persia. Marco Polo\'s family traveled exactly this way.' } },
      { label: 'Refuse — no steppe horseman taxes you', outcome: { good: false, loseCargo: 2, coinsPct: -0.1, text: 'It goes as badly as everyone watching expected. They confiscate "the duty, with penalties" and let you keep your teeth.', why: 'Mongol protection was real but absolutely not optional. Traders who registered prospered; the Pax Mongolica was peace with paperwork.' } },
    ],
  },
  {
    id: 'desertheat', minEra: 1, needCargo: true,
    title: 'The sand sea ahead',
    text: 'The Sahara crossing to the gold country takes weeks. The veteran drivers are arguing with a new man who wants to push hard through the daylight hours and "get it over with."',
    choices: [
      { label: 'Travel by night and dawn; rest through the furnace hours', hint: 'Ask why the azalai caravans move under the stars', outcome: { good: true, xp: 18, text: 'Cold stars, steady camels, water discipline. The crossing costs sweat and nothing else.', why: 'Saharan caravans — the azalai — moved by night and early morning and navigated by stars; daytime travel killed animals and men.' } },
      { label: 'March hard through the day and finish faster', outcome: { good: false, loseCargo: 2, text: 'By the third noon two pack animals are down and their loads stay in the sand.', why: 'Midday Sahara heat is lethal to loaded animals. Every desert people that survived learned the night-travel rule.' } },
    ],
  },
  {
    id: 'saltcaravan', minEra: 3, needCargo: false,
    title: 'The azalai passes',
    text: 'A salt caravan from the Taghaza mines — hundreds of camels, each under two great slabs — heads south. The master offers you a slab at the desert price, far below what the gold country pays.',
    choices: [
      { label: 'Buy salt (15 shekels) — the south pays dearly for it', hint: 'Where salt is scarce, it trades against gold', outcome: { good: true, coins: -15, gainGood: 'salt', xp: 14, text: 'One slab, lashed tight. In Timbuktu this is treasure; further south, legend says, they once traded it weight for weight against gold.', why: 'Trans-Saharan trade ran on exactly this exchange: northern salt south, southern gold north, and Mali taxing the meeting point.' } },
      { label: 'Decline — it is only salt', outcome: { good: false, xp: 4, text: 'The caravan master shrugs and the camels sway on south, carrying your profit margin with them.', why: 'In the West African forest belt salt was scarce and essential — "only salt" was the most profitable cargo on the whole route.' } },
    ],
  },
  {
    id: 'seastorm', minEra: 1, needCargo: true,
    title: 'Black sky over the strait',
    text: 'The wind is turning foul and the swell is building. The fishermen are already running for the beach. Open water would be the straight line home; the coast crawls but offers coves.',
    choices: [
      { label: 'Hug the coast and duck into the first cove', hint: 'How did sailors survive before deep-water navigation?', outcome: { good: true, xp: 16, text: 'You ride it out on a beach with a driftwood fire while the strait rages. The cargo never gets wet.', why: 'Ancient Mediterranean sailors hugged coastlines and beached at night — deep-water runs in storm season sank fleets, including kings\' fleets.' } },
      { label: 'Run the open water before it gets worse', outcome: { good: false, loseCargo: 2, text: 'A green wave takes the deck cargo. The boat survives; your margin does not.', why: 'The Mediterranean sailing season was roughly May to October for good reason — winter storms ended voyages and empires\' grain supplies alike.' } },
    ],
  },
  {
    id: 'sailingseason', minEra: 2, needCargo: false,
    title: 'The grain fleet weighs anchor',
    text: 'In the harbor a Black Sea grain convoy loads for Athens — the city cannot feed itself and pays premium for imported wheat. A captain offers you cheap deck space for one cargo of grain if you buy now.',
    choices: [
      { label: 'Buy grain (8 shekels) and ride the convoy', hint: 'Athens\' hunger is the steadiest market in the Aegean', outcome: { good: true, coins: -8, gainGood: 'grain', xp: 12, text: 'Wheat aboard, convoy sails. Athens pays top rates for exactly this cargo.', why: 'Athens imported most of its grain — protecting the Black Sea grain route was a pillar of Athenian naval policy.' } },
      { label: 'Pass — grain is a peasant\'s cargo', outcome: { good: false, xp: 4, text: 'The convoy leaves without you. Somewhere ahead, Athens pays someone else.', why: 'Staples beat luxuries surprisingly often: the steady, certain demand of a hungry city was the safest profit in the ancient sea trade.' } },
    ],
  },
  {
    id: 'passguide', minEra: 1, needCargo: true,
    title: 'Fog on the high pass',
    text: 'The highland trail to the old towns disappears into freezing fog. A local herder offers to walk you over the saddle for a few shekels; your driver insists he remembers the way.',
    choices: [
      { label: 'Hire the herder who walks this pass weekly', hint: 'Local knowledge is the oldest trade good', outcome: { good: true, coins: -6, xp: 14, text: 'He leads you past two drop-offs you would never have seen. Worth every shekel.', why: 'Long-distance trade always ran on chains of LOCAL experts — guides, pilots, interpreters. No caravan crossed unfamiliar country alone.' } },
      { label: 'Trust the driver\'s memory and push through', outcome: { good: false, loseCargo: 1, coins: -5, text: 'Six hours lost in the fog and one pack animal lamed on the scree. The herder waves as you finally stagger past.', why: 'Mountain passes killed more cargo than bandits did. Hiring local guides was standard practice on every overland route in history.' } },
    ],
  },
  {
    id: 'quarantine', minEra: 3, needCargo: true,
    title: 'Plague banners at the gate',
    text: 'Word runs down the road: pestilence in the ports. The city ahead now holds arriving traders forty days outside the walls — quaranta giorni, they call it. A back path over the vineyards would skip the wait.',
    choices: [
      { label: 'Submit to the forty days', hint: 'The Black Death taught harbor cities this arithmetic', outcome: { good: true, xp: 20, coins: -8, text: 'Forty dull days of dice and vineyard wine. Your seal is stamped CLEAN, and gates open for you everywhere after.', why: 'Quarantine — from quaranta giorni, forty days — was invented by Adriatic ports during the Black Death. It is the plague\'s most durable legacy.' } },
      { label: 'Take the vineyard path into the city tonight', outcome: { good: false, coinsPct: -0.25, text: 'Caught inside the cordon, your goods are impounded for fumigation and you pay the violation fine — far more than forty days would have cost.', why: 'Plague-era cities enforced cordons ruthlessly; after 1347 perhaps a third of Europe had died, and ports stopped gambling.' } },
    ],
  },
  {
    id: 'tollgate', minEra: 1, needCargo: true,
    title: 'The count\'s new toll',
    text: 'A timber gate where none stood last season, and men-at-arms with a ledger. The local lord now takes a toll "for the upkeep of the road" — which, you note, has visibly not been kept up.',
    choices: [
      { label: 'Pay, smile, and note it in the ledger', hint: 'Tolls were the price of every land route', outcome: { good: true, coins: -8, xp: 10, text: 'Stamped through. The guard, friendlier after payment, mentions which fairs pay best this season.', why: 'Medieval land routes crossed dozens of toll jurisdictions — one reason sea and river transport stayed dramatically cheaper than carts.' } },
      { label: 'Argue jurisdiction with the men-at-arms', outcome: { good: false, coins: -16, xp: 4, text: 'You win the argument and pay the doubled "administrative" toll anyway. The men-at-arms had the better argument all along: pikes.', why: 'Fragmented feudal authority meant fragmented (and arbitrary) tolls — exactly the friction that made merchants back strong central monarchs later.' } },
    ],
  },
  {
    id: 'monsoon', minEra: 2, needCargo: true,
    title: 'The wind calendar',
    text: 'At the dhow harbor, sailing masters read the sky. Your cargo is bound northeast across the ocean toward India. One captain sails TODAY on the rising southwest wind; another says wait for the calmer northeast wind of winter.',
    choices: [
      { label: 'Sail now, with the summer southwest monsoon', hint: 'Which wind blows TOWARD India?', outcome: { good: true, xp: 20, text: 'The southwest monsoon fills the sail like a paid hand and the crossing is fast and fat.', why: 'The summer SW monsoon blows from sea toward Asia — it carried ships TO India; the winter NE monsoon carried them back. The Indian Ocean ran on this schedule for two thousand years.' } },
      { label: 'Wait for the winter northeast wind', outcome: { good: false, coins: -12, xp: 6, text: 'You wait months, then beat against a contrary wind the whole way. Harbor fees and feed costs eat your margin.', why: 'The winter NE monsoon blows FROM Asia — perfect for the return run, dead wrong for the outbound. Monsoon literacy was a merchant\'s survival skill.' } },
    ],
  },
  {
    id: 'convoy', minEra: 4, needCargo: true,
    title: 'Sails on the horizon — too many',
    text: 'Pirates work this coast, and lately worse: armed European ships demanding cartazes — paid passes — from all local shipping. A merchant convoy with hired guns leaves tonight; joining costs a fee.',
    choices: [
      { label: 'Pay the convoy fee and sail in company', hint: 'The fleet that sails together arrives together', outcome: { good: true, coins: -12, xp: 18, text: 'Twelve hulls and bristling rails. The strange sails shadow the convoy for a day and then go hunt easier prey.', why: 'After 1500, armed convoy became the norm on Indian Ocean routes as Portuguese cartaz licensing turned the open sea into contested space.' } },
      { label: 'Sail alone and trust your speed', outcome: { good: false, loseCargo: 2, coins: -10, text: 'You outrun the first sail and not the second. They take a "toll" at gunpoint and call it licensing.', why: 'The First Global Age militarized the sea lanes — the era when trade routes started being enforced by cannon.' } },
    ],
  },
  {
    id: 'pilgrims', minEra: 2, needCargo: false,
    title: 'Monks on the westward road',
    text: 'A band of Buddhist monks rests at the crossroads, carrying scripture scrolls toward the Silk Road oases and on to China. Their water bag is torn and the next well is far.',
    choices: [
      { label: 'Give them your spare waterskin and walk a while together', hint: 'Religions traveled the same roads as cargo', outcome: { good: true, coins: 20, xp: 16, text: 'They share road-knowledge worth more than the waterskin — which tolls to skip, which inns are honest — and a blessing besides. A grateful pilgrim presses silver on you at parting.', why: 'Buddhism reached China along the trade routes — monks, merchants and scriptures shared the same caravans. Faiths spread at the speed of trade.' } },
      { label: 'Trade moves on schedule — wish them luck', outcome: { good: false, xp: 4, text: 'They bow without complaint. The road feels longer the rest of the day.', why: 'Travelers\' mutual aid was the unwritten law of the long routes — caravans that helped pilgrims bought goodwill at every stop ahead.' } },
    ],
  },
  {
    id: 'bazaarrumor', minEra: 2, needCargo: false,
    title: 'Tea-house intelligence',
    text: 'In the crossroads tea-house, a Sogdian letter-courier sells more than letters: he knows which markets are short of what, this very season, for the price of a good meal.',
    choices: [
      { label: 'Buy him the meal (6 shekels)', hint: 'Information was the Sogdians\' real cargo', outcome: { good: true, coins: -6, xp: 14, priceTip: true, text: 'Between mouthfuls he maps the season\'s shortages city by city. Your next route plans itself.', why: 'Sogdian merchant networks ran on letters and market intelligence — surviving "Ancient Letters" from the 4th century are mostly business reports.' } },
      { label: 'Keep your shekels and your own counsel', outcome: { good: false, xp: 4, text: 'He shrugs and sells the season\'s secrets to the table behind you.', why: 'On the Silk Road, knowing prices two cities ahead WAS the profit margin. Intelligence usually out-earned cargo.' } },
    ],
  },
];

// per-city ambient walker counts (procedural villagers, no dialogue)
export const AMBIENT_PER_CITY = 2;
