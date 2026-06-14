// u1-neolithic.js — STORY-PACK: Unit 1, Early Humans & the Neolithic Revolution.
//
// Pure DATA module (no imports, no engine calls) — it cannot crash the world on
// its own. The defensive loader in ../game.js wires everything below into the
// live game (adds the NPCs, fires the cutscene once, makes each keystone
// reachable, records the Codex entry, lifts House Standing, unlocks the
// achievement). See CONTRACT.md for the authoritative field-by-field spec; this
// file COPIES the structure of the gold-standard unit3-belief-systems.js.
//
// THIS PACK teaches two real Global-History-9, Unit 1 keystones at Catalhoyuk,
// one of the world's first towns (real: rooftop-entry houses, dead buried under
// the floors, and — crucially — NO palace, NO temple, NO chief's quarter; an
// unusually EGALITARIAN early settlement):
//
//   (a) THE NEOLITHIC REVOLUTION. Farming's real, society-changing gift is not
//       "more food" — it is a food SURPLUS. A surplus frees some people from
//       producing food, which lets them specialize (potters, weavers, priests,
//       soldiers, scribes), which produces social hierarchy and, eventually, the
//       first cities. (Wrong path: "farming just meant more food" → the mentor
//       corrects: it is the SURPLUS that reorganizes society, not the calories.)
//
//   (b) THE TRADE-OFF OF SETTLING VS. FORAGING. Settling down is a bargain, not
//       a free win: you gain stored wealth and permanence, but you also take on
//       crowd disease, harder grinding labor, dependence on a few crops, and —
//       once there is stored surplus to OWN — inequality. Foragers owned little
//       and shared widely; settled farmers could hoard, and so some grew richer
//       than others. Catalhoyuk's flat, palace-free layout is the real evidence
//       that this inequality was a process, not an instant.
//
// Honest pedagogy: Catalhoyuk and the Neolithic record are real; the speakers
// are fictional in-world denizens (a town elder and a visiting forager) so no
// real person is given invented words. The only real person ever named in the
// whole world is "Mr. Maccarello" — and he is not named here.

export const pack = {
  // ---- identity ----
  id: 'u1-neolithic',
  unit: 'Unit 1 — Early Humans & the Neolithic Revolution', // Codex group + label
  title: 'The First Surplus: Why Settling Down Changed Everything',

  // ---- extra characters added to the world ----
  // Both placed at Catalhoyuk (era 1). Çatalhöyük's real obsidian knapper Kamani
  // already sits at offset [6,4], so these two take the far side of the town:
  //   • Hodja — the town elder / granary-keeper who carries the SURPLUS keystone.
  //   • Yarra — a visiting forager whose old life is the living comparison; she
  //     carries the SETTLING-TRADE-OFF keystone and re-teaches on a wrong answer.
  // Each NPC's keystoneId points its conversation at a keystone tree below. The
  // loader builds: intro the first times, the challenge while unwon, and a warm
  // "after" once understood.
  npcs: [
    {
      id: 'u1-elder-hodja',
      name: 'Hodja',
      title: 'Keeper of the Town Granary',
      city: 'catalhoyuk',                // must be an existing CITIES id
      era: 1,                            // visible from the first era
      offset: [-6, 5],                   // far side from Kamani at [6,4]
      hatKind: 'none',
      palette: { robe: 0x8a6f3c, trim: 0x5e4a26, skin: 0xb97f4e },
      keystoneId: 'ks-neolithic-surplus',
      introText: 'Climb down off the roofs, trader, and mind the ladder — in Catalhoyuk we live shoulder to shoulder and bury our dead beneath our own floors. I keep the granary. See those sealed bins of grain? My grandmother\'s grandmother did not have such a thing; her people followed the herds and ate what the day gave them. The grain in those bins is not just dinner. It is the reason this whole town exists. Stay a moment — there is a thing about that grain worth understanding before you trade another sack of it.',
      afterText: 'You have it now: the bins are not full of dinner, they are full of FREEDOM — the few hands that no longer have to grow food. From those freed hands come the knapper, the weaver, the priest, the headman, the city itself. A pile of extra grain is the quiet beginning of everything you will sell on every road from here. Walk well, trader.',
    },
    {
      id: 'u1-forager-yarra',
      name: 'Yarra',
      title: 'A Forager Visiting the Town',
      city: 'catalhoyuk',
      era: 1,
      offset: [-7, -5],                  // clear of Kamani [6,4] and Hodja [-6,5]
      hatKind: 'cap',
      palette: { robe: 0x6e7a4a, trim: 0x47502c, skin: 0xc98a5b, hat: 0x47502c },
      keystoneId: 'ks-settling-tradeoff',
      introText: 'I am not of this town, trader — I came up the hills to trade hides for grain, and I go where the deer go. My people carry our whole world on our backs and own almost nothing, so we share almost everything. These townsfolk look at us with pity and call us poor. Maybe. But before you envy their full bins and their warm packed houses, sit with me. I have watched both lives. Settling down is a TRADE, not a gift — and I would have you understand the price of it.',
      afterText: 'Yes — a trade, not a triumph. They gained walls, full bins, and a place to keep their dead close. They also gained the coughing sickness that runs through crowded rooms, backs bent from the grinding stone, and the slow truth that once there is grain to OWN, some come to own more of it than others. My people stayed poor and stayed equal. They grew rich and grew unequal. Neither life is free. Now you know what to weigh.',
    },
  ],

  // ---- named story-beat sequences (playCutscene format) ----
  // Beats: { kicker, text, tint, art, palette, cta }. tint ∈ amber|dusk|cold|stone,
  // art ∈ candle|ledger|notice|portrait|null. The loader plays one ONCE when a
  // matching trigger fires.
  cutscenes: {
    // Fires the first time the player reaches Catalhoyuk — frames the unit
    // question ("why did anyone settle down at all?") before meeting the elders.
    U1_INTRO: [
      {
        tint: 'stone', kicker: 'Catalhoyuk — One of the First Towns', art: 'notice',
        text: 'There are no streets here. The houses are packed wall to wall, and you walk across the rooftops and climb down ladders into the rooms below, where the dead lie buried under the sleeping platforms. There is no palace. There is no temple-tower. There is no chief\'s great hall lording over the rest. Just a thousand small homes of equals, sealed grain bins, and the oldest obsidian trade in the world — a town older than kings, older than writing, raised before anyone thought a city needed a ruler.',
      },
      {
        tint: 'amber', kicker: 'A question at the granary', art: 'portrait',
        palette: { robe: 0x8a6f3c, trim: 0x5e4a26, skin: 0xb97f4e },
        text: 'An old keeper waves you down from the rooftops toward a row of sealed grain bins. "You trade for a living," she says, "so you understand value. Then answer me this riddle and you will understand how every town you will ever sell to was BORN: for two million years our kind hunted and gathered and never built a place like this. Then, here and in a handful of valleys, people stopped wandering, planted seed, and stayed. Why? What did that grain give them that a good hunt never could?" Her name is Hodja. Go and reason it out with her.',
        cta: 'Go to the granary',
      },
    ],
  },

  // ---- triggers: when each cutscene fires (once) ----
  triggers: [
    {
      on: 'visit', value: 'catalhoyuk', play: 'U1_INTRO',
      reward: { house: 1, title: 'A town older than kings', sub: 'Catalhoyuk sets you a riddle about why anyone ever settled down.' },
    },
  ],

  // ---- THE CORE: keystones ----
  // Each is the moment the player UNDERSTANDS, built to the exemplar bar (the
  // Nin-Banda pattern in content.js): choices are FULL IN-CHARACTER SENTENCES
  // (kind:'say'); the RIGHT choice records the Codex entry + lifts House Standing
  // + sets a flag / unlocks an achievement and a mentor confirms WHY; each WRONG
  // choice is a CONSEQUENCE that re-teaches the missing idea and LOOPS back to
  // `challenge`. No score, no "Question N of M", no failure screen.
  keystones: [
    // ===================================================================
    // KEYSTONE 1 — THE NEOLITHIC REVOLUTION: surplus, not calories.
    // ===================================================================
    {
      id: 'ks-neolithic-surplus',
      npc: 'u1-elder-hodja',
      codexId: 'cx-neolithic-surplus',
      house: 2,
      houseTitle: 'You read the meaning of the grain',
      houseSub: 'The keeper of Catalhoyuk\'s granary marks the House of the Open Road as one that understands why farming built towns.',
      flag: 'u1SurplusUnderstood',
      achievement: 'ach-the-first-surplus',
      start: 'challenge',
      nodes: {
        challenge: {
          text: 'Hodja rests her hand on a sealed grain bin. "Here is the riddle, trader. A good hunting band could eat very well on the day of a great kill — better, some seasons, than we eat here. So farming did not simply mean MORE on the table; some years it meant less, and harder work to get it. And yet wherever people learned to farm, towns like this one rose, and the hunting life faded. There is something in these grain bins that no hunt ever left behind. Tell me — what does stored, planted grain give a people that the richest hunt never could?"',
          choices: [
            {
              kind: 'say',
              // ★ RIGHT — surplus → frees hands → specialization → hierarchy → cities.
              label: 'It gives a SURPLUS — grain left over after everyone is fed, stored against the lean season. A surplus frees some hands from growing food, so they can become knappers, weavers, priests, headmen, traders. That division of labor is what builds a town and stacks it into ranks. A great hunt feeds you for a day; a surplus lets a people become something more than food-finders.',
              right: true,
              next: 'won',
            },
            {
              kind: 'say',
              // ✗ WRONG (the central misread the assignment names) — "just more food."
              label: 'It simply gives more food. Farming feeds more bellies than hunting can, and that is the whole of it — full bins mean a fuller town, nothing more clever than that.',
              setFlag: 'u1MoreFoodMisread',
              next: 'reteachMoreFood',
            },
            {
              kind: 'say',
              // ✗ WRONG (the other common misread) — "the gods rewarded farmers."
              label: 'It gives the favor of the gods. Those who tend the seed and the harvest please the powers of the earth, and so their towns are blessed to grow — it is heaven\'s reward, not anything in the grain itself.',
              next: 'reteachGods',
            },
          ],
        },

        // ---- RIGHT PATH: the world changes ----
        won: {
          onEnter: 'reward',
          text: '(Hodja smiles the way a teacher smiles at a student who has gone past her.) "Surplus. You said the true word. A hunt is eaten and gone; surplus STAYS, and what stays can free hands. With grain in the bins, not everyone must chase food — so some knap the obsidian you came to buy, some weave, some keep the count, some learn to lead. One full bin makes one free pair of hands; a thousand bins make a town of them, and a town of freed hands sorts itself into high and low. THAT is why farming made cities, and a hunt never could — not because of the food, but because of what the EXTRA food set people free to become." She presses a handful of grain into your palm. "Carry that understanding, trader. You will see it under every market you ever walk into."',
          choices: [
            { label: 'Then I\'ll carry the meaning of the grain with me.', next: '@close' },
          ],
        },

        // ---- WRONG PATH 1: consequence + re-teach + LOOP back ----
        reteachMoreFood: {
          text: '(Hodja shakes her head slowly, but kindly.) "More food — yes, sometimes. But \'more food\' alone would only mean more eaters, and we would all still be bent over the same task: getting fed. Look around you, trader. The knapper does not grow grain. The weaver does not grow grain. I keep the bins instead of hunting. How is that possible, if all this grain only ever turns into more mouths? It is the LEFTOVER grain — the surplus that need not be eaten today — that pays for hands to do something other than farm. Do not count the calories. Ask what the EXTRA buys. Weigh it again."',
          choices: [
            { label: 'I see — it is the leftover, the surplus, that frees hands to do other work. Let me answer again.', clearFlag: 'u1MoreFoodMisread', next: 'challenge' },
          ],
        },
        // ---- WRONG PATH 2: consequence + re-teach + LOOP back ----
        reteachGods: {
          text: '(Hodja gives a patient half-smile.) "We honor the powers of the earth, trader, and we thank them at every harvest. But look — there is no temple-tower over Catalhoyuk, no priests\' palace, no shrine raised above the homes. The grain did not come because heaven chose us; the grain came because someone planted, weeded, and STORED it. And it is the storing — the bin that holds food past the season it was grown — that does the real work. Set the gods aside for a moment and think like a trader counting stock. What does a bin of EXTRA grain let a people do that a band who eats each day\'s catch never can? Try once more."',
          choices: [
            { label: 'Of course — it is the stored, extra grain doing the work, not heaven. Let me try again.', next: 'challenge' },
          ],
        },
      },
    },

    // ===================================================================
    // KEYSTONE 2 — THE TRADE-OFF OF SETTLING: stored wealth + disease +
    // inequality. Grounded in Catalhoyuk's real egalitarian layout.
    // ===================================================================
    {
      id: 'ks-settling-tradeoff',
      npc: 'u1-forager-yarra',
      codexId: 'cx-settling-tradeoff',
      house: 2,
      houseTitle: 'You weighed the price of settling down',
      houseSub: 'A forager marks the House of the Open Road as one that sees both sides of the bargain that made the first towns.',
      flag: 'u1TradeoffUnderstood',
      achievement: 'ach-the-price-of-walls',
      start: 'challenge',
      nodes: {
        challenge: {
          text: 'Yarra crouches on her heels by the town wall, watching the rooftops. "So. These townsfolk pity me — no walls, no full bins, no fixed roof. And it is true they have things my people never will. But I have buried no one to the coughing sickness that races through their crowded rooms; my back is not yet bent by the grinding stone; and among my people there is no one who eats while another starves — we own little, so we share all. Tell me, trader, since you weigh things for a living: when a wandering people settles down behind walls like these, what do they truly GAIN, and what do they pay for it?"',
          choices: [
            {
              kind: 'say',
              // ★ RIGHT — settling is a genuine TRADE: stored wealth & permanence
              // GAINED; disease, harder labor, crop-dependence & INEQUALITY paid.
              label: 'They gain real things — stored grain to outlast a bad season, permanent homes, and wealth they can keep. But they pay for it: packed together, they breed sickness that a roving band escapes; their bodies wear out grinding grain; they hang their lives on a few crops that can fail. And because there is now stored surplus to OWN, some come to own more than others — settling buys wealth, but it also buys disease, toil, and the first inequality.',
              right: true,
              next: 'won',
            },
            {
              kind: 'say',
              // ✗ WRONG (the progress-myth misread) — "settling is pure progress."
              label: 'They gain everything and pay nothing. Settling is simply the better life — full bins, warm walls, safety. The wandering life was only hardship people were glad to leave behind; there is no real price to settling down.',
              setFlag: 'u1ProgressMisread',
              next: 'reteachProgress',
            },
            {
              kind: 'say',
              // ✗ WRONG (the cynic's misread) — "settling is pure loss."
              label: 'They gain nothing worth having and lose their freedom entirely. Walls are a cage; the bins are a trap; the wandering life was better in every way. Settling down was a pure mistake with nothing to show for it.',
              next: 'reteachLoss',
            },
          ],
        },

        // ---- RIGHT PATH: the world changes ----
        won: {
          onEnter: 'reward',
          text: '(Yarra nods, slow and grave.) "You see it whole — most do not. A trade, both ways. They won the full bin, the kept roof, the wealth that stays. And they took on the coughing sickness of crowded rooms, the bent back of the grinding stone, the gamble of betting all on the barley. And the last cost is the quietest: once there is grain to OWN, the sharing breaks. My people stay poor and stay equal because we have nothing to hoard. Look hard at this town, though — no palace, no chief\'s hall, the homes near alike. The hoarding has not yet hardened here; the breaking is only beginning. That is the true history, trader: settling down was a bargain, not a triumph — and you weighed both pans of it." She stands, shouldering her pack. "Go knowing the price of walls."',
          choices: [
            { label: 'Then I\'ll carry both sides of the bargain with me.', next: '@close' },
          ],
        },

        // ---- WRONG PATH 1: consequence + re-teach + LOOP back ----
        reteachProgress: {
          text: '(Yarra laughs, not unkindly.) "Everything for nothing? No bargain in the world runs that way, trader, and you know it. Then why do my people still walk the hills, if the walled life is pure gain? Because the walls have a price. Crowd a thousand bodies into rooms entered by ladders and a cough becomes a death that runs the whole town. Bend over a grinding stone every day and your spine pays the bill. Stake your year on the barley and one bad harvest starves you all. And once there is grain in a bin to OWN — well. Some bins fill higher than others. Look again, and this time name what settling COSTS. Weigh it once more."',
          choices: [
            { label: 'I see — settling buys real things but also costs disease, toil, and inequality. Let me answer again.', clearFlag: 'u1ProgressMisread', next: 'challenge' },
          ],
        },
        // ---- WRONG PATH 2: consequence + re-teach + LOOP back ----
        reteachLoss: {
          text: '(Yarra tilts her head.) "You have the price right and the gain wrong, trader. Walls are not only a cage. Ask yourself why anyone settled at all, if it were pure loss — and why these towns spread across the world while bands like mine grew fewer. The bin that outlasts a bad winter is no trap; it is survival my people would envy in a hungry year. The kept roof shelters a child too small to travel. The stored wealth is real wealth. Do not mistake the COST for the whole story — there is true gain here too, bought at a true price. Name BOTH pans of the scale. Try again."',
          choices: [
            { label: 'Of course — there is real gain too: stored wealth, permanence, surviving the lean year. Let me try again.', next: 'challenge' },
          ],
        },
      },
    },
  ],

  // ---- Codex: the real ideas this pack teaches ----
  // group equals the pack's `unit` so entries bucket together. ids are globally
  // unique (namespaced with the pack id).
  codex: [
    {
      id: 'cx-neolithic-surplus',
      group: 'Unit 1 — Early Humans & the Neolithic Revolution',
      title: 'Why the Neolithic Revolution changed society — surplus, not just food',
      idea: 'Farming\'s society-changing gift was not more food but a food SURPLUS: stored extra grain freed some people from producing food, letting them specialize as crafters, priests, and leaders, which produced social hierarchy and the first cities.',
      source: 'Hodja, keeper of the town granary at Catalhoyuk (on the Neolithic Revolution)',
    },
    {
      id: 'cx-settling-tradeoff',
      group: 'Unit 1 — Early Humans & the Neolithic Revolution',
      title: 'The trade-off of settling down vs. foraging',
      idea: 'Settling into farming villages was a trade, not a pure gain: people won stored wealth and permanent homes but took on crowd disease, harder grinding labor, dependence on a few crops, and — once there was surplus to own — the inequality that foraging\'s share-everything life had avoided. Catalhoyuk\'s palace-free, near-equal layout shows that inequality was a slow process, not an instant.',
      source: 'Yarra, a forager visiting Catalhoyuk (on settled vs. foraging life)',
    },
  ],

  // ---- Achievements: optional milestones ----
  achievements: [
    {
      id: 'ach-the-first-surplus',
      title: 'The First Surplus',
      desc: 'You understood that farming built towns not by feeding more bellies but by leaving a surplus — extra grain that freed hands to specialize and stack a society into ranks.',
    },
    {
      id: 'ach-the-price-of-walls',
      title: 'The Price of Walls',
      desc: 'You understood that settling down was a bargain, not a triumph — stored wealth and permanence bought with disease, toil, and the first inequality.',
    },
  ],
};

export default pack;
