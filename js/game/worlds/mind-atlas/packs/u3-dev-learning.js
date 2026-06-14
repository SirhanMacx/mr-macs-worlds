// u3-dev-learning.js — STORY-PACK for The Mind Atlas.
//
// Unit 3 · Development & Learning. FOUR Fog-encounters set in the Learning Grove
// (region id: ap-dev). Each dispels a comfortable, wrong belief with real,
// 2024-CED-scoped psychology:
//   (a) "punishment is the best teacher"  → reinforcement shapes behavior more
//       reliably than punishment; positive/negative reinforcement vs punishment.
//   (b) "babies are blank slates"          → newborns arrive with real perceptual
//       and temperamental predispositions.
//   (c) "classical = operant"              → the real distinction: an involuntary
//       association between two stimuli vs the consequences of voluntary behavior.
//   (d) "attachment is just about feeding" → Harlow's contact comfort: the bond
//       rides on comfort and security, not the food bowl.
//
// HOW THIS PLUGS IN (matches the gold-standard u1-ten-percent.js + CONTRACT.md):
//   - Each keystone is an in-character encounter with THE FOG. The player picks a
//     FULL IN-CHARACTER SENTENCE (kind:'say') — never an A/B/C stem, never a quiz,
//     never "Question N of M", never a score or a red X.
//   - A WRONG choice is a CONSEQUENCE: the Fog thickens (a small confidence cost),
//     a mentor (a fictional Grove denizen this pack adds) COACHES the real science,
//     then the SAME keystone re-renders so the player answers from understanding.
//   - The RIGHT choice CHANGES THE WORLD: a Codex entry is written, the Clarity
//     meter lifts, a story flag opens, and an achievement may unlock.
//
// The loader gives each NPC the keystone it OWNS (one keystone per NPC, matched by
// npc id). So this pack adds FOUR mentor denizens, one per Fog-encounter, placed
// around the Learning Grove station (ap-dev center [-180,40]; the built-in tender
// Pavla sits at [7,-5], so these four take other corners).
//
// HONEST PEDAGOGY: every claim below is real, in-scope psychology. The figures
// who teach (the Grove denizens) are FICTIONAL mind-denizens, so nothing is a fake
// quote attributed to a real person. Real researchers are described in PARAPHRASE
// of the published record; the Codex `source` names the in-world scene, never a
// real scientist. The only real person named anywhere in the world is "Mr.
// Maccarello." Pure DATA — no imports, no engine calls.

export const pack = {
  // ---- identity --------------------------------------------------------------
  id: 'u3-dev-learning',
  unit: 'Unit 3 · Development & Learning',
  title: 'The Tangle of the Learning Grove',

  // ---- extra characters added to the world -----------------------------------
  // Four mentors, each owning one Fog-encounter. All in ap-dev (Learning Grove,
  // station center [-180,40]); offsets chosen to avoid Pavla's [7,-5] and each
  // other. Procedural portraits (zero assets). Each start() is ctx-aware so a
  // mentor acknowledges its Fog once its keystone is cleared.
  npcs: [
    {
      id: 'u3dl_keeper',
      name: 'Reed',
      title: 'a keeper of the Grove’s creatures',
      region: 'ap-dev',
      offset: [-9, 7],
      hatKind: 'brim',
      palette: { robe: 0x2f8f5a, trim: 0x1c5a38, skin: 0xd9a066, hat: 0x1c5a38 },
      dialogue: {
        start: (ctx) => (ctx.is && ctx.is('u3dl_punish_cleared')) ? 'after' : 'root',
        nodes: {
          root: {
            text: 'You found my training-ring — and the Fog got here first. It sits by the gate purring the oldest lie a teacher ever fell for: "if you want a behavior to stop, hurt it; punishment is the best teacher there is." I shape these creatures for a living, and I can tell you that lie costs more than it ever teaches. Will you help me answer it?',
            choices: [
              { label: 'What does the record actually say about punishment?', next: 'why' },
              { label: 'What should I do instead, if not punish?', next: 'instead' },
              { label: 'Point me at the Fog. I will answer it.', next: 'sendin' },
            ],
          },
          why: {
            text: 'Punishment can suppress a behavior in the moment, but it is unreliable and it teaches by fear: it shows what NOT to do without ever showing what TO do. It can breed avoidance of the punisher, aggression, and only works if it is immediate, certain, and consistent — which it almost never is. Decades of operant work show that REINFORCEMENT — strengthening the behavior you want — shapes conduct far more durably.',
            choices: [
              { label: 'So reinforcing the right behavior beats punishing the wrong one.', next: 'sendin' },
              { label: 'What should I do instead, then?', next: 'instead' },
            ],
          },
          instead: {
            text: 'Reinforce the behavior you actually want. Positive reinforcement ADDS something pleasant after the good behavior — a treat, praise. Negative reinforcement REMOVES something unpleasant when the good behavior appears — the nagging alarm stops once you get up. Both make the wanted behavior MORE likely. Punishment only tries to make the unwanted one less likely, and clumsily at that.',
            choices: [
              { label: 'Then I will answer the Fog with reinforcement, not fear.', next: 'sendin' },
            ],
          },
          sendin: {
            text: 'Good. It will offer you the satisfying cruelty of punishment as if it were wisdom. Refuse it with what the work actually shows — reinforce the behavior you want, and shape it. If it sinks its hooks in you, come back. There is no shame in a second pass; I have re-trained every creature in this ring twice over.',
            choices: [],
          },
          after: {
            text: 'The training-ring is calm again. The creatures come for the reward, not from fear of the rod — exactly the way this mind should learn anything. The Grove remembers it now.',
            choices: [],
          },
        },
      },
    },
    {
      id: 'u3dl_midwife',
      name: 'Wynn',
      title: 'a tender of the Grove’s newest sprouts',
      region: 'ap-dev',
      offset: [9, 7],
      hatKind: 'hood',
      palette: { robe: 0x3aa06a, trim: 0x1f5e3c, skin: 0xc98a5b, hat: 0x1f5e3c },
      dialogue: {
        start: (ctx) => (ctx.is && ctx.is('u3dl_blankslate_cleared')) ? 'after' : 'root',
        nodes: {
          root: {
            text: 'Here in the nursery-corner the youngest sprouts are just unfolding — and the Fog leans over the cradle whispering the cosiest lie about beginnings: "a baby is a blank slate, an empty page; it can do nothing and knows nothing until the world writes on it." I have tended these from the first hour. That is not what I see at all. Will you answer it?',
            choices: [
              { label: 'What can a newborn actually do?', next: 'why' },
              { label: 'What do you mean by temperament?', next: 'temp' },
              { label: 'Point me at the Fog. I will answer it.', next: 'sendin' },
            ],
          },
          why: {
            text: 'A great deal, from the start. Newborns turn toward voices and prefer the human face; reflexes like rooting and grasping run on day one. Studies that simply watch where babies LOOK find they prefer faces and patterns over blanks, and that very young infants pull back from the deep side of a clear "visual cliff" — depth perception is arriving early, not learned from scratch. The page is not blank; it is already written in part.',
            choices: [
              { label: 'So newborns have real perceptual abilities, not none.', next: 'sendin' },
              { label: 'And you said temperament — what is that?', next: 'temp' },
            ],
          },
          temp: {
            text: 'Temperament is the inborn style of a baby — its baseline emotional reactivity and mood. From very early on, some infants are easy and adaptable, some slow to warm up, some difficult and intense — and that style shows real stability over time. It is biological raw material the world then shapes, but it is THERE before the world has had its say.',
            choices: [
              { label: 'Then I will answer the Fog — the slate is not blank.', next: 'sendin' },
            ],
          },
          sendin: {
            text: 'Good. It will offer you the helpless empty baby like a gentle truth. Refuse it: newborns arrive with perception, reflexes, and a temperament of their own. If it muddles you, come back to the cradle. We will look at a real infant together and answer again.',
            choices: [],
          },
          after: {
            text: 'The nursery-corner is bright. The sprouts reach and turn and startle, each in its own style — never blank, never empty. The Grove will not forget that beginnings already carry something.',
            choices: [],
          },
        },
      },
    },
    {
      id: 'u3dl_untangler',
      name: 'Bram',
      title: 'an untangler of the Grove’s learning-vines',
      region: 'ap-dev',
      offset: [-9, -9],
      hatKind: 'scholar',
      palette: { robe: 0x1f7a55, trim: 0x114a33, skin: 0x9be7ff, hat: 0x114a33 },
      dialogue: {
        start: (ctx) => (ctx.is && ctx.is('u3dl_condfuse_cleared')) ? 'after' : 'root',
        nodes: {
          root: {
            text: 'Two great vines of learning grow through this grove, and the Fog has knotted them together on purpose, hissing: "classical, operant — what is the difference, really? A signal, a treat, a creature learns. It is all one blur; do not bother pulling it apart." I untangle these vines for a living. They are NOT one thing. Will you help me pull them apart?',
            choices: [
              { label: 'So what is the real difference between them?', next: 'why' },
              { label: 'Give me a clean example of each.', next: 'eg' },
              { label: 'Point me at the Fog. I will answer it.', next: 'sendin' },
            ],
          },
          why: {
            text: 'Classical conditioning is learning an association between two STIMULI: a neutral signal comes to trigger an INVOLUNTARY, automatic response — a reflex, like salivation or fear — because it was paired with something that already triggered it. Operant conditioning is about VOLUNTARY behavior and its CONSEQUENCES: a behavior grows or shrinks depending on whether it is reinforced or punished. Stimulus-and-reflex versus behavior-and-consequence — that is the seam.',
            choices: [
              { label: 'So one is automatic association, the other is consequences of choice.', next: 'sendin' },
              { label: 'Show me each with an example.', next: 'eg' },
            ],
          },
          eg: {
            text: 'Classical: a chime always rings just before food, and soon the chime ALONE makes the creature drool — it did not choose to drool; the response is automatic. Operant: the creature presses a lever, food appears, and it presses MORE — that pressing is a voluntary behavior strengthened by its consequence. The first links two signals; the second links an action to what follows it.',
            choices: [
              { label: 'Then I will answer the Fog — they are two different learnings.', next: 'sendin' },
            ],
          },
          sendin: {
            text: 'Good. It will offer you the comfortable blur, as if precision were fussiness. Refuse it: classical is involuntary association between stimuli; operant is voluntary behavior shaped by consequences. If it knots you up, come back to the vines. We will trace each one and answer again.',
            choices: [],
          },
          after: {
            text: 'The two vines hang clear and separate now, each climbing its own trellis. The Grove remembers there are two kinds of learning here, not one muddled rope.',
            choices: [],
          },
        },
      },
    },
    {
      id: 'u3dl_bondkeeper',
      name: 'Mira',
      title: 'a keeper of the Grove’s first bonds',
      region: 'ap-dev',
      offset: [9, -9],
      hatKind: 'none',
      palette: { robe: 0x2f9d6e, trim: 0x176046, skin: 0xd9a066, hat: 0x176046 },
      dialogue: {
        start: (ctx) => (ctx.is && ctx.is('u3dl_attach_cleared')) ? 'after' : 'root',
        nodes: {
          root: {
            text: 'Down by the rooting-pools is where the first bonds form — and the Fog coils around the cradle here too, murmuring the most reductive lie about love: "an infant only clings to whoever holds the food bowl. Attachment is just feeding, plain and simple. Whoever feeds it, it loves." I keep the first bonds of this mind. That is not why they hold. Will you answer it?',
            choices: [
              { label: 'If attachment isn’t about feeding, what is it about?', next: 'why' },
              { label: 'Wasn’t there a famous experiment on this?', next: 'study' },
              { label: 'Point me at the Fog. I will answer it.', next: 'sendin' },
            ],
          },
          why: {
            text: 'It is about COMFORT and security, not the food bowl. The body craves the feel of a warm, soft, holding presence — what the research calls contact comfort — and a safe base to return to. Feeding matters for the body, but the BOND rides on closeness and comfort. A fed infant with no warmth does not bond to the feeder; a comforting presence is what it clings to and runs back to when afraid.',
            choices: [
              { label: 'So the bond is built on contact comfort, not on who feeds.', next: 'sendin' },
              { label: 'And there was a study showing this?', next: 'study' },
            ],
          },
          study: {
            text: 'There was. Infant monkeys were given two surrogate "mothers": one of bare wire that DISPENSED the milk, and one of soft cloth that gave no food. The infants drank from the wire one only as long as they had to — then spent nearly all their time clinging to the soft cloth mother, and ran to HER when frightened. If attachment were just feeding, they would have loved the wire that fed them. They loved the comfort instead.',
            choices: [
              { label: 'Then I will answer the Fog — comfort, not feeding, makes the bond.', next: 'sendin' },
            ],
          },
          sendin: {
            text: 'Good. It will offer you the tidy lie that love follows the food. Refuse it with the truth of contact comfort. If it pulls you back to the feeding story, come back to the pools. We will sit by a first bond and answer again.',
            choices: [],
          },
          after: {
            text: 'The rooting-pools are warm and still. The bonds here hold to comfort and safety, the way the first bond of any mind truly does. The Grove remembers that love was never just the food bowl.',
            choices: [],
          },
        },
      },
    },
  ],

  // ---- named cutscenes (playCutscene beat arrays) -----------------------------
  cutscenes: {
    // Fires once when the player first enters the Learning Grove — frames the four
    // Fog-encounters waiting among the vines, and points at the mentors.
    U3DL_INTRO: [
      {
        tint: 'cold', kicker: 'The Tangle of the Learning Grove',
        text: 'The Learning Grove climbs in two great vines — one of signals, one of consequences — but the Fog has wound through both, knotting them grey. Around the orchard the youngest sprouts unfold in a nursery-corner, creatures wait in a training-ring, and bonds form by the rooting-pools. Wherever a mind LEARNS or GROWS, the Fog has left a comfortable lie.',
      },
      {
        tint: 'dusk',
        text: 'Four keepers wait among the vines — one for the training-ring, one for the cradle, one for the tangled vines, one for the first bonds. "Four lies took root here," one calls. "Help us answer each, and the whole Grove comes back green."',
      },
    ],
  },

  // ---- triggers: WHEN a cutscene fires (once each) ----------------------------
  triggers: [
    { on: 'visit', value: 'ap-dev', play: 'U3DL_INTRO', reward: { clarity: 4, insight: 10 } },
  ],

  // ---- keystones: THE CORE ----------------------------------------------------
  // Four in-character UNDERSTANDING beats. One per mentor NPC (matched by npc id).
  // Each: taunt (the Fog's comfortable lie) → ask (the mentor's in-character
  // challenge) → say-choices (exactly one correct; wrongs carry a teaching coach
  // that loops back). On the right choice the world changes: Codex + Clarity +
  // flag + achievement + payoff.
  keystones: [
    // (a) punishment is the best teacher --------------------------------------
    {
      id: 'u3dl_ks_punishment',
      npc: 'u3dl_keeper',
      region: 'ap-dev',
      kicker: 'THE FOG · the lie that fear teaches best',
      title: 'The Best-Teacher Fog',
      taunt: 'The Fog drapes itself across the training-ring gate, smiling like an old coach. "Cartographer. Here is hard-won wisdom, free: if you want a behavior to STOP, you hurt it. Punishment is the best teacher there is — swift, certain, satisfying. Reward is for the soft. Pain is how anything truly learns."',
      ask: 'Reed sets down the rod he never uses and looks to you. "It always opens with that one. So tell it plainly — when you want to change a creature’s behavior for good, what actually works better: punishing what you don’t want, or reinforcing what you do?"',
      choices: [
        {
          kind: 'say',
          label: 'Reinforcement works better. Punishment only suppresses a behavior in the moment, by fear, and teaches what NOT to do without showing what TO do — reinforcing the behavior you want shapes conduct far more reliably and lastingly.',
          correct: true,
        },
        {
          kind: 'say',
          label: 'You’re right — punishment is best, because nothing changes a behavior faster than making it hurt.',
          // WRONG: confuses momentary suppression with durable learning.
          coach: 'The ring goes cold and the creatures cringe — that is the Fog feeding on the satisfying cruelty. Reed steadies you, Atlas’s light behind him. "You reached for the rod. Punishment can suppress a behavior for a moment, but it teaches by fear: it shows what NOT to do without ever showing what TO do, and it only bites if it is immediate, certain, and consistent — which it almost never is. The durable lever is REINFORCEMENT: strengthen the behavior you want. Tell it THAT."',
        },
        {
          kind: 'say',
          label: 'Negative reinforcement is just punishment by another name — so either way, the way to teach is by taking something good away.',
          // WRONG: conflates negative reinforcement with punishment.
          coach: 'A vine gutters grey and the haze presses in. Reed shakes his head, kindly. "Close to a real trap. Negative reinforcement is NOT punishment. Negative reinforcement REMOVES something unpleasant when the wanted behavior appears — the alarm stops once you get up — and that makes the behavior MORE likely. Punishment tries to make a behavior LESS likely. Both kinds of reinforcement, positive and negative, STRENGTHEN behavior; punishment WEAKENS it. Answer with reinforcement."',
        },
      ],
      win: 'The Fog flinches from the calm of the ring and pulls back off the gate. The creatures come forward — not from fear of the rod, but for the reward of doing right. "…Reinforce what you want. Not punish what you don’t." It thins to a wisp and slips into the grass. Reed lifts the reward-pouch, not the rod. "There. This mind will learn the way anything truly learns — by being shown what works, and rewarded for it."',
      recordCodex: 'u3dl_cx_punishment',
      flag: 'u3dl_punish_cleared',
      achievement: 'u3dl_ach_punishment',
      confidenceCost: 12,
    },

    // (b) babies are blank slates ---------------------------------------------
    {
      id: 'u3dl_ks_blankslate',
      npc: 'u3dl_midwife',
      region: 'ap-dev',
      kicker: 'THE FOG · the lie of the blank slate',
      title: 'The Blank-Slate Fog',
      taunt: 'The Fog folds gently over the cradle, soft as a lullaby. "Cartographer. Look how helpless it is — an empty page, a blank slate. A newborn can do nothing, knows nothing, prefers nothing. Whatever it becomes, the world writes from scratch. There is nothing here yet to map."',
      ask: 'Wynn lifts a sprout to the light and turns to you. "It always sings that lullaby over the youngest. So answer it true — when a baby is brand new, before the world has taught it anything, what does it already arrive with?"',
      choices: [
        {
          kind: 'say',
          label: 'Real predispositions, from the start. Newborns prefer the human face and turn toward voices, very young infants show early depth perception at a visual cliff, and each arrives with an inborn temperament — a baseline emotional style. The slate is not blank.',
          correct: true,
        },
        {
          kind: 'say',
          label: 'You’re right — a newborn is a blank slate, and every ability it ever has gets written in later by experience.',
          // WRONG: ignores inborn perception, reflexes, and temperament.
          coach: 'The cradle dims and the cold creeps in — the Fog feeding on the empty-baby story. Wynn steadies you, Atlas’s light behind her. "You handed it the blank page. But watch a real newborn: it turns to voices, prefers the human face over a blank, has rooting and grasping reflexes on day one, and very young infants already pull back from the deep side of a visual cliff. And each baby comes with its own temperament — an inborn emotional style. There is plenty here already. Tell it THAT."',
        },
        {
          kind: 'say',
          label: 'Newborns can perceive a little, sure — but temperament is purely something parents create later, so personality starts at zero.',
          // WRONG: gets perception but denies inborn temperament.
          coach: 'A sprout wilts and the haze gathers. Wynn shakes her head, gently. "Closer — you saw the perception. But temperament is not written by parents from zero. From the very first weeks some infants are easy, some slow to warm, some intense and difficult — and that inborn style shows real stability over time. It is biological raw material the world then shapes, not something invented later. Answer with perception AND temperament both arriving from the start."',
        },
      ],
      win: 'The Fog recoils from the reaching, turning, startling sprouts and lifts off the cradle. "…Not blank. It was never blank." It thins and drifts out of the nursery-corner. Wynn cradles the sprout, which grips her finger of its own accord. "There. This mind began with eyes that prefer a face and a temperament all its own. Beginnings already carry something — and now the Grove knows it."',
      recordCodex: 'u3dl_cx_blankslate',
      flag: 'u3dl_blankslate_cleared',
      achievement: 'u3dl_ach_blankslate',
      confidenceCost: 12,
    },

    // (c) classical vs operant (confused) -------------------------------------
    {
      id: 'u3dl_ks_conditioning',
      npc: 'u3dl_untangler',
      region: 'ap-dev',
      kicker: 'THE FOG · the lie that all learning is one blur',
      title: 'The Tangle Fog',
      taunt: 'The Fog knots itself through the two great vines, easy and amused. "Cartographer. Classical, operant — why fuss over labels? A signal, a treat, a creature changes. It is all one learning, one blur. Pulling it apart is a scholar’s vanity. Let it all be the same."',
      ask: 'Bram sets a hand on each vine and looks to you. "It always sells the blur. So untangle it for the Fog — what is the REAL difference between classical and operant conditioning?"',
      choices: [
        {
          kind: 'say',
          label: 'Classical conditioning is an INVOLUNTARY association between two stimuli — a neutral signal comes to trigger an automatic, reflexive response. Operant conditioning is about VOLUNTARY behavior and its CONSEQUENCES — a behavior grows or shrinks depending on whether it’s reinforced or punished.',
          correct: true,
        },
        {
          kind: 'say',
          label: 'You’re right — they’re basically the same. Both are just a creature getting a treat and learning from it.',
          // WRONG: erases the stimulus/consequence distinction.
          coach: 'The vines snarl tighter and the cold bites — the Fog feeding on the blur. Bram steadies you, Atlas’s light behind him. "You let it blur. They are NOT the same. Classical conditioning links two STIMULI, so a signal triggers an INVOLUNTARY, automatic response — a reflex. Operant conditioning links a VOLUNTARY behavior to its CONSEQUENCE — reinforced behaviors grow, punished ones shrink. Stimulus-and-reflex versus behavior-and-consequence. Tell it THAT seam."',
        },
        {
          kind: 'say',
          label: 'The difference is that classical conditioning uses rewards and operant conditioning uses punishments.',
          // WRONG: a real but wrong axis — reward/punishment live inside operant.
          coach: 'A leaf curls grey and the haze presses closer. Bram shakes his head, kindly. "Closer, but you split it on the wrong seam. Rewards AND punishments both live inside OPERANT conditioning — that is the consequences-of-behavior vine. The real divide is different: classical is an INVOLUNTARY association between two stimuli (a reflex triggered by a signal); operant is VOLUNTARY behavior shaped by its consequences. Answer on THAT line."',
        },
      ],
      win: 'The Fog cannot hold a blur against a clean distinction. The two vines pull apart in your hands and climb their separate trellises — one of signals, one of consequences. "…Two learnings. Not one." It loses its grip and slides off into the grass. Bram steps back from the untangled vines. "There. Involuntary association on this side, consequences of behavior on that. The Grove will not muddle them again."',
      recordCodex: 'u3dl_cx_conditioning',
      flag: 'u3dl_condfuse_cleared',
      achievement: 'u3dl_ach_conditioning',
      confidenceCost: 12,
    },

    // (d) attachment is just about feeding ------------------------------------
    {
      id: 'u3dl_ks_attachment',
      npc: 'u3dl_bondkeeper',
      region: 'ap-dev',
      kicker: 'THE FOG · the lie that love follows the food',
      title: 'The Food-Bowl Fog',
      taunt: 'The Fog coils low around the rooting-pools, sensible and cold. "Cartographer. Strip the sentiment away: an infant clings to whoever holds the food bowl. Attachment is feeding, nothing more. Fill the belly and you have the bond. Comfort, warmth — pretty words for the same hunger."',
      ask: 'Mira kneels by a first bond at the pool’s edge and looks to you. "It always reduces love to the food bowl. So answer it true — what actually builds the bond between an infant and its caregiver: being fed, or something else?"',
      choices: [
        {
          kind: 'say',
          label: 'Contact comfort builds the bond, not feeding. When infant monkeys had a wire mother that gave milk and a soft cloth mother that gave none, they clung to the comforting cloth mother and ran to her when frightened — the bond rides on warmth, comfort, and a safe base, not the food bowl.',
          correct: true,
        },
        {
          kind: 'say',
          label: 'You’re right — whoever feeds the baby is who the baby bonds to, because attachment really is just about getting fed.',
          // WRONG: the food-bowl theory the Harlow work refuted.
          coach: 'The pools go grey and the cold seeps up — the Fog feeding on the tidy story that love follows food. Mira steadies you, Atlas’s light behind her. "You handed it the food bowl. But infant monkeys with a wire mother that DISPENSED milk and a soft cloth mother that gave NONE drank from the wire only as long as they had to — then spent nearly all their time clinging to the soft cloth, and ran to HER when afraid. If feeding made the bond, they would have loved the wire. They loved the comfort. Tell it THAT."',
        },
        {
          kind: 'say',
          label: 'It’s really about safety from danger — feeding and comfort have nothing to do with it; the baby just bonds to whoever protects it.',
          // WRONG: a safe base matters, but contact comfort is the core finding.
          coach: 'A ripple darkens the pool and the haze gathers. Mira shakes her head, kindly. "There’s truth in the safe base — the infant does run to its caregiver when frightened. But what the work actually isolated was CONTACT COMFORT: the soft, warm, holding presence itself. The cloth mother gave no protection and no food, yet the infants clung to it for the comfort of its touch and used it as their secure base. The bond is built on comfort, not the food bowl. Answer with contact comfort."',
        },
      ],
      win: 'The Fog cannot hold the food-bowl lie against a cloth mother that fed no one and was loved anyway. It uncoils from the pools and shrinks back. "…Comfort. Not the food bowl." It thins and sinks into the still water, gone. Mira gathers the first bond close. "There. The first bond of any mind holds to warmth and safety, not to whoever fills the belly. The Grove remembers what love is made of now."',
      recordCodex: 'u3dl_cx_attachment',
      flag: 'u3dl_attach_cleared',
      achievement: 'u3dl_ach_attachment',
      confidenceCost: 12,
    },
  ],

  // ---- codex: the real ideas this pack teaches (fed to the shared Codex) -------
  // One entry per keystone (recordCodex points here). idea = the one human
  // sentence understood; source names the in-world scene, NOT a real person.
  codex: [
    {
      id: 'u3dl_cx_punishment',
      group: 'Development & Learning',
      title: 'Reinforcement teaches better than punishment',
      idea: 'Reinforcement shapes behavior more reliably than punishment: positive reinforcement adds something pleasant and negative reinforcement removes something unpleasant — both STRENGTHEN a behavior — while punishment only weakens a behavior, by fear, in the moment, and only when it is immediate, certain, and consistent.',
      source: 'Reed, keeper of the Grove’s training-ring',
    },
    {
      id: 'u3dl_cx_blankslate',
      group: 'Development & Learning',
      title: 'Newborns are not blank slates',
      idea: 'Newborns arrive with real predispositions: they prefer the human face and turn toward voices, show early depth perception (pulling back from a visual cliff), have reflexes from birth, and each has an inborn temperament — a baseline emotional style — so development builds on these, not on an empty page.',
      source: 'Wynn, tender of the Grove’s newest sprouts',
    },
    {
      id: 'u3dl_cx_conditioning',
      group: 'Development & Learning',
      title: 'Classical and operant conditioning differ',
      idea: 'Classical conditioning is an involuntary association between two stimuli (a signal comes to trigger an automatic, reflexive response), while operant conditioning concerns voluntary behavior and its consequences (behaviors grow when reinforced and shrink when punished) — stimulus-and-reflex versus behavior-and-consequence.',
      source: 'Bram, untangler of the Grove’s learning-vines',
    },
    {
      id: 'u3dl_cx_attachment',
      group: 'Development & Learning',
      title: 'Attachment is built on contact comfort',
      idea: 'Attachment is built on contact comfort and security, not on feeding: infant monkeys given a wire mother that dispensed milk and a soft cloth mother that gave none clung to the comforting cloth mother and used her as a safe base, showing the bond rides on warmth and comfort rather than the food bowl.',
      source: 'Mira, keeper of the Grove’s first bonds',
    },
  ],

  // ---- achievements: optional milestones (fed to the shared Achievements) ------
  achievements: [
    {
      id: 'u3dl_ach_punishment',
      title: 'The reward, not the rod',
      desc: 'You put out the best-teacher Fog by answering with reinforcement instead of punishment.',
    },
    {
      id: 'u3dl_ach_blankslate',
      title: 'Never a blank page',
      desc: 'You dispelled the blank-slate Fog with the real perception, reflexes, and temperament a newborn arrives with.',
    },
    {
      id: 'u3dl_ach_conditioning',
      title: 'Two vines, untangled',
      desc: 'You pulled classical and operant conditioning apart and answered the Fog on the real seam between them.',
    },
    {
      id: 'u3dl_ach_attachment',
      title: 'More than the food bowl',
      desc: 'You answered the food-bowl Fog with contact comfort — the real foundation of the first bond.',
    },
  ],
};

export default pack;
