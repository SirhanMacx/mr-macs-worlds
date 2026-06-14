// density-u3-dev-learning.js — DENSITY STORY-PACK for The Mind Atlas.
//
// Unit 3 · Development & Learning (MORE). A SECOND, DENSER pack layered onto the
// Learning Grove (region id: ap-dev) on top of the first U3 pack
// (u3-dev-learning.js). It does NOT repeat that pack's ideas (punishment vs
// reinforcement, the blank slate, classical-vs-operant, attachment/feeding).
// Instead it dispels THREE further comfortable, wrong beliefs with real,
// 2024-CED-scoped psychology:
//   (a) "out of sight, out of mind / kids see the world like adults do"
//        → Piaget's stages: very young infants lack OBJECT PERMANENCE, and
//          preoperational children are EGOCENTRIC (they cannot yet take another
//          person's visual/mental point of view). The error is developmental,
//          not stupidity — it disappears as the child matures.
//   (b) "you can't teach an old dog new tricks"
//        → LIFELONG NEUROPLASTICITY: the adult brain keeps rewiring and learning
//          across the whole lifespan; learning is not sealed off after childhood.
//   (c) "kids only learn from rewards and punishments"
//        → OBSERVATIONAL LEARNING (modeling): we learn by WATCHING others and
//          imitating them, without being directly reinforced ourselves — the
//          Bobo-doll work showed children copy a model's aggression just from
//          seeing it.
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
// npc id). So this pack adds THREE mentor denizens, placed around the Learning
// Grove station. The ap-dev station center is [-180,40]; the built-in tender Pavla
// sits at offset [7,-5] and the first density pack's four mentors sit at
// [-9,7], [9,7], [-9,-9], [9,-9]. These three take NEW corners — [-11,0], [11,0],
// [0,11] — so nothing overlaps.
//
// HONEST PEDAGOGY: every claim below is real, in-scope psychology. The figures who
// teach (the Grove denizens) are FICTIONAL mind-denizens, so nothing is a fake
// quote attributed to a real person. Real researchers are described in PARAPHRASE
// of the published record; the Codex `source` names the in-world scene, never a
// real scientist. No real school/teacher/student names appear. Pure DATA — no
// imports, no engine calls — so it physically cannot crash the world.
//
// ID DISCIPLINE: every id is prefixed "d-ma-u3-" so it can never collide with the
// existing packs' ids.

export const pack = {
  // ---- identity --------------------------------------------------------------
  id: 'd-ma-u3-density',
  unit: 'Unit 3 · Development & Learning',
  title: 'Deeper Roots of the Learning Grove',

  // ---- extra characters added to the world -----------------------------------
  // Three mentors, each owning one Fog-encounter. All in ap-dev (Learning Grove,
  // station center [-180,40]); offsets dodge Pavla [7,-5] AND the first density
  // pack's [-9,7]/[9,7]/[-9,-9]/[9,-9]. Procedural portraits (zero assets). Each
  // start() is ctx-aware so a mentor acknowledges its Fog once its keystone is
  // cleared, and the supporting branches reference OTHER packs' / this pack's
  // story flags so the dialogue REMEMBERS what the player has already learned.
  npcs: [
    {
      id: 'd-ma-u3-watcher',
      name: 'Senna',
      title: 'a watcher of the Grove’s young saplings',
      region: 'ap-dev',
      offset: [-11, 0],
      hatKind: 'scholar',
      palette: { robe: 0x2a8a78, trim: 0x14463d, skin: 0xd9b07c, hat: 0x14463d },
      dialogue: {
        start: (ctx) => (ctx.is && ctx.is('d-ma-u3-piaget-cleared')) ? 'after' : 'root',
        nodes: {
          root: {
            text: 'I watch the youngest saplings grow stage by stage, and the Fog has settled by the sapling-rows hissing one of the cruellest little lies about children: "a baby thinks just like a grown person, only dimmer — if a thing leaves its sight, it has simply forgotten it, and a child who cannot share your view is just being stubborn or slow." I have watched a thousand of these grow up. That is NOT how a young mind works. Will you help me answer it?',
            choices: [
              { label: 'What does happen when a thing leaves a baby’s sight?', next: 'perm' },
              { label: 'Why does a small child see only their own view?', next: 'ego' },
              { label: 'Point me at the Fog. I will answer it.', next: 'sendin' },
            ],
          },
          perm: {
            text: 'For a very young infant, out of sight really is out of mind — when you hide a toy under a cloth, the infant does not search for it, as if it ceased to exist. That is missing OBJECT PERMANENCE: the understanding that things keep existing even when you cannot see them. It is not forgetting; the idea that the toy still IS has not arrived yet. Around eight months and after, the infant begins to reach under the cloth — permanence has dawned. It is a STAGE the mind grows through, not a flaw.',
            choices: [
              { label: 'So a young infant has not yet grasped that hidden things still exist.', next: 'sendin' },
              { label: 'And the not-sharing-your-view part?', next: 'ego' },
            ],
          },
          ego: {
            text: 'A preschool-age child is EGOCENTRIC — not selfish, but literally unable yet to take your point of view. Sit across from one with a model of three little hills and ask what a doll on the far side can see, and the child describes their OWN view, not the doll’s. They cannot yet hold a second perspective in mind. This too is a developmental stage; as the child matures, the wall comes down and they can finally imagine how the world looks to someone else.',
            choices: [
              { label: 'Then I will answer the Fog — these are stages a mind grows through.', next: 'sendin' },
            ],
          },
          sendin: {
            text: 'Good. It will offer you the lazy lie that a child is just a small, slow adult. Refuse it with the truth of stages: a young infant lacks object permanence, a preschooler is egocentric, and BOTH fade as the mind develops. If it muddles you, come back to the sapling-rows. We will watch a real young mind together and answer again — there is no shame in a second pass.',
            choices: [],
          },
          after: {
            text: 'The sapling-rows stand clear again, each at its own stage of growth. The Grove remembers that a young mind is not a dim adult — it climbs through real stages, and what looks like error is just a stage not yet reached.',
            choices: [],
          },
        },
      },
    },
    {
      id: 'd-ma-u3-grafter',
      name: 'Ode',
      title: 'a grafter of the Grove’s oldest boughs',
      region: 'ap-dev',
      offset: [11, 0],
      hatKind: 'brim',
      palette: { robe: 0x4a7d3a, trim: 0x2c4a22, skin: 0xc98a5b, hat: 0x2c4a22 },
      dialogue: {
        start: (ctx) => (ctx.is && ctx.is('d-ma-u3-plasticity-cleared')) ? 'after' : 'root',
        nodes: {
          root: {
            text: 'I graft new growth onto the OLDEST boughs in this grove — and the Fog leans against the ancient trunks sighing the most resigned lie there is: "you can’t teach an old dog new tricks. After childhood the mind is set hard as heartwood; an adult brain is done growing, done learning, finished." I have grafted fresh shoots onto trunks centuries old and watched them take. That lie is wrong. Will you help me answer it?',
            choices: [
              { label: 'Can an adult brain really still change?', next: 'why' },
              { label: 'What about a brain that gets injured later in life?', next: 'injury' },
              { label: 'Point me at the Fog. I will answer it.', next: 'sendin' },
            ],
          },
          why: {
            text: 'Yes — across the WHOLE lifespan. The brain is plastic: it keeps rewiring itself with experience, strengthening the connections you use and pruning the ones you do not, building new ones as you learn. An adult who studies a new language, a new instrument, a new route through a city is physically reshaping neural pathways. Learning slows in some ways and changes in character, but it never seals shut. Plasticity is for life, not just for childhood.',
            choices: [
              { label: 'So the adult brain keeps rewiring itself as it learns.', next: 'sendin' },
              { label: 'And after an injury?', next: 'injury' },
            ],
          },
          injury: {
            text: 'Even there, plasticity is at work. After damage, the brain can sometimes reorganize — surviving regions take over functions the lost tissue once handled, and intact pathways are strengthened through practice and rehabilitation. It is not magic and it is not guaranteed, but it shows the same truth: the adult brain is not finished concrete. It is living tissue that reshapes itself in response to what we do with it.',
            choices: [
              { label: 'Then I will answer the Fog — plasticity lasts a whole life.', next: 'sendin' },
            ],
          },
          sendin: {
            text: 'Good. It will offer you the comfortable surrender — too old, too set, why bother. Refuse it: the brain stays plastic across the lifespan, rewiring with every new thing learned. If it talks you back into giving up, come back to the old boughs. We will graft one more shoot and answer again.',
            choices: [],
          },
          after: {
            text: 'The oldest boughs carry fresh green shoots, taken and thriving. The Grove remembers that no bough here is ever too old to grow — and neither is any mind too old to learn.',
            choices: [],
          },
        },
      },
    },
    {
      id: 'd-ma-u3-mirror',
      name: 'Vask',
      title: 'a reader of the Grove’s mirror-pool',
      region: 'ap-dev',
      offset: [0, 11],
      hatKind: 'hood',
      palette: { robe: 0x1f8f6a, trim: 0x115540, skin: 0x9be7ff, hat: 0x115540 },
      dialogue: {
        start: (ctx) => (ctx.is && ctx.is('d-ma-u3-observational-cleared')) ? 'after' : 'root',
        nodes: {
          root: {
            text: 'By the mirror-pool, the young of this mind learn by WATCHING their reflections of others — and the Fog hangs over the water repeating a narrow lie about how learning works: "a creature only ever learns from its OWN rewards and its OWN punishments. If it was never fed for a thing, never struck for a thing, it cannot have learned that thing at all." I read the mirror-pool. That is far too small a story. Will you help me answer it?',
            choices: [
              { label: 'How can you learn something you were never rewarded for?', next: 'why' },
              { label: 'Was there a famous study on this?', next: 'study' },
              { label: 'Point me at the Fog. I will answer it.', next: 'sendin' },
            ],
          },
          why: {
            text: 'By WATCHING. So much of what we know we picked up by observing another person do it — never having been rewarded or punished for it ourselves. This is observational learning, or modeling: you see someone perform a behavior and you imitate it. A child watches how an adult handles anger, speaks to a stranger, ties a knot — and copies it, with no treat and no swat involved. Direct reinforcement is one road to learning; watching a model is another, and a powerful one.',
            choices: [
              { label: 'So we learn by watching and imitating others, not only by our own consequences.', next: 'sendin' },
              { label: 'And the study you mentioned?', next: 'study' },
            ],
          },
          study: {
            text: 'There was. Young children watched an adult either play gently with a large inflatable doll, or attack it — hitting, kicking, knocking it about. Later, given the same doll, the children who had watched the aggressive adult attacked the doll the same way, often copying the very actions, while the others did not. No child was rewarded for the aggression. They learned it purely by watching a model. Seeing was enough to teach the behavior.',
            choices: [
              { label: 'Then I will answer the Fog — watching a model teaches, with no reward needed.', next: 'sendin' },
            ],
          },
          sendin: {
            text: 'Good. It will offer you the tidy little world where only your own carrots and sticks can teach you. Refuse it: we learn by observing and imitating others, no direct reinforcement required. If it shrinks the world back down on you, come back to the mirror-pool. We will watch a reflection together and answer again.',
            choices: [],
          },
          after: {
            text: 'The mirror-pool runs clear. The young of this mind learn from every model they watch, not only from their own rewards. The Grove remembers that watching is its own kind of teaching.',
            choices: [],
          },
        },
      },
    },
  ],

  // ---- named cutscenes (playCutscene beat arrays) -----------------------------
  cutscenes: {
    // Fires once when the player has cleared the FIRST density pack's tangle and
    // re-enters the Learning Grove — frames these three DEEPER Fog-encounters as a
    // second layer. Trigger is a flag (set by the first pack's untangler keystone)
    // so it only opens after the surface tangle is dealt with.
    'D-MA-U3-DEEPER': [
      {
        tint: 'cold', kicker: 'Deeper Roots of the Learning Grove',
        text: 'The surface vines hang clear now — but the Fog has sunk into the ROOTS of the Grove, into how a young mind grows and how anything is learned at all. Down the sapling-rows, against the oldest boughs, and over the mirror-pool, three deeper lies have taken hold. The shallow Fog is gone; the patient Fog remains.',
      },
      {
        tint: 'dusk',
        text: 'Three more keepers wait among the deeper roots — a watcher of the young saplings, a grafter of the old boughs, a reader of the mirror-pool. "You answered the easy lies," one calls. "These run deeper. Help us, and the Grove comes back green all the way down."',
      },
    ],
  },

  // ---- triggers: WHEN a cutscene fires (once each) ----------------------------
  // Fires off the FIRST density pack's "untangler cleared" flag so this deeper
  // layer surfaces after the player has handled the surface tangle. Falls through
  // gracefully if that pack is absent — the cutscene simply never fires, and the
  // three mentors still stand in the Grove to be found and spoken to directly.
  triggers: [
    { on: 'flag', value: 'u3dl_condfuse_cleared', play: 'D-MA-U3-DEEPER', reward: { clarity: 4, insight: 10 } },
  ],

  // ---- keystones: THE CORE ----------------------------------------------------
  // Three in-character UNDERSTANDING beats. One per mentor NPC (matched by npc id).
  // Each: taunt (the Fog's comfortable lie) → ask (the mentor's in-character
  // challenge) → say-choices (exactly one correct; wrongs carry a teaching coach
  // that the loader loops back). On the right choice the world changes:
  // Codex + Clarity + flag + achievement + payoff.
  keystones: [
    // (a) Piaget — object permanence + egocentrism --------------------------------
    {
      id: 'd-ma-u3-ks-piaget',
      npc: 'd-ma-u3-watcher',
      region: 'ap-dev',
      kicker: 'THE FOG · the lie that a child is just a small adult',
      title: 'The Small-Adult Fog',
      taunt: 'The Fog drifts low along the sapling-rows, patient and patronizing. "Cartographer. Save yourself the trouble: a child’s mind is simply an adult’s, only dimmer and slower. Hide a toy from a baby and it has merely forgotten it. Ask a little one what someone across the table sees and they get it wrong because they are stubborn. Same mind, less of it. Nothing here grows in stages."',
      ask: 'Senna lifts a young sapling and a small cloth to the light and turns to you. "It always shrinks a child into a tiny adult. So answer it true — when a very young infant cannot find a hidden toy, and a preschooler can only describe their OWN view of the room, what is actually going on in those young minds?"',
      choices: [
        {
          kind: 'say',
          label: 'They are at earlier developmental stages. A very young infant has not yet developed object permanence — the understanding that things still exist when out of sight — and a preschool child is egocentric, not yet able to take another person’s point of view. Both abilities arrive as the mind matures; it is growth through stages, not a dim adult.',
          correct: true,
        },
        {
          kind: 'say',
          label: 'You’re right — a child is just a smaller, slower adult, so a baby who can’t find a hidden toy has simply forgotten it and a little one is just being stubborn.',
          // WRONG: the small-adult lie; misses object permanence + egocentrism as stages.
          coach: 'The sapling-rows dim and the cold gathers — the Fog feeding on the small-adult lie. Senna steadies you, Atlas’s light behind her. "A child is not a dim adult. A very young infant who does not search for a hidden toy is missing OBJECT PERMANENCE — it does not yet understand the toy still exists; that is a developmental stage, not forgetting. And a preschooler who only describes their own view is EGOCENTRIC — not stubborn, but genuinely unable yet to take another perspective. Both fade as the mind grows. Tell it THAT — these are STAGES."',
        },
        {
          kind: 'say',
          label: 'They just need more facts — pour enough information into a young child and they’ll instantly think exactly like an adult, no stages required.',
          // WRONG: development is not just adding facts; cognitive stages are structural.
          coach: 'A sapling wilts grey and the haze presses in. Senna shakes her head, kindly. "Closer — but development is not just pouring in facts. A young mind is structured differently, and it reorganizes in STAGES. No amount of telling makes a four-month-old grasp that a hidden toy still exists, or makes a preschooler suddenly hold a second person’s viewpoint — those understandings (object permanence, then the end of egocentrism) emerge as the mind matures. Answer with developmental stages, not just more information."',
        },
      ],
      win: 'The Fog cannot keep a child small against the truth of stages. The sapling-rows brighten, each at its own height of growth. "…Stages. Not a dim adult." It thins and sinks into the soil between the rows. Senna sets the cloth aside as the sapling reaches on its own. "There. A young infant grows into object permanence; a preschooler grows out of egocentrism. The Grove remembers a child is not a small adult — it climbs through real stages."',
      recordCodex: 'd-ma-u3-cx-piaget',
      flag: 'd-ma-u3-piaget-cleared',
      achievement: 'd-ma-u3-ach-piaget',
      confidenceCost: 12,
    },

    // (b) lifelong plasticity — "can't teach an old dog" --------------------------
    {
      id: 'd-ma-u3-ks-plasticity',
      npc: 'd-ma-u3-grafter',
      region: 'ap-dev',
      kicker: 'THE FOG · the lie that the grown brain is finished',
      title: 'The Set-In-Heartwood Fog',
      taunt: 'The Fog leans against the ancient trunks, weary and resigned. "Cartographer. Let me spare this mind some heartache: you can’t teach an old dog new tricks. After childhood the brain sets hard as heartwood — done growing, done rewiring, done learning anything new. An adult who tries is only wasting effort. The shape is fixed. Rest now."',
      ask: 'Ode presses a fresh graft against an ancient bough and looks to you. "It always sells surrender to the old. So answer it true — can a grown, adult brain still change and learn, or is it truly finished after childhood?"',
      choices: [
        {
          kind: 'say',
          label: 'It can still change — across the whole lifespan. The brain is plastic: it keeps rewiring itself with experience, strengthening pathways you use and forming new ones as you learn, and even reorganizing after injury. Learning shifts in character with age but never seals shut; plasticity is for life, not just childhood.',
          correct: true,
        },
        {
          kind: 'say',
          label: 'You’re right — once childhood is over the brain is set in heartwood, so there’s no real point in an adult trying to learn anything new.',
          // WRONG: denies lifelong plasticity.
          coach: 'The ancient trunks go cold and the cold seeps in — the Fog feeding on the comfortable surrender. Ode steadies you, Atlas’s light behind him. "The grown brain is not finished heartwood. It is PLASTIC across the whole lifespan: it keeps rewiring with experience, building and strengthening connections every time you learn, even reorganizing after injury. An adult who studies a language or learns an instrument physically reshapes their pathways. Tell it THAT — plasticity lasts a whole life."',
        },
        {
          kind: 'say',
          label: 'Only a damaged adult brain ever changes — a healthy grown brain never rewires at all unless something goes wrong with it.',
          // WRONG: plasticity is ordinary, not only injury-driven.
          coach: 'A bough cracks grey and the haze gathers. Ode shakes his head, kindly. "Closer — recovery after injury IS plasticity at work, but it is not the only kind. A perfectly healthy adult brain rewires all the time through ordinary learning: every new skill, language, or habit strengthens some pathways and prunes others. Plasticity is the everyday way the brain learns at any age, not just an emergency repair. Answer with ordinary, lifelong plasticity."',
        },
      ],
      win: 'The Fog cannot hold a brain finished against a fresh graft taking on an ancient bough. Green shoots break from the old trunks. "…Plastic. Still learning." It thins and slides down into the roots. Ode steps back as the new growth thrives on the centuries-old wood. "There. No bough here is too old to grow, and no mind too old to learn. The Grove remembers that the brain rewires for a whole lifetime."',
      recordCodex: 'd-ma-u3-cx-plasticity',
      flag: 'd-ma-u3-plasticity-cleared',
      achievement: 'd-ma-u3-ach-plasticity',
      confidenceCost: 12,
    },

    // (c) observational learning — Bandura / modeling -----------------------------
    {
      id: 'd-ma-u3-ks-observational',
      npc: 'd-ma-u3-mirror',
      region: 'ap-dev',
      kicker: 'THE FOG · the lie that only your own rewards teach you',
      title: 'The Carrot-And-Stick Fog',
      taunt: 'The Fog hangs flat over the mirror-pool, smug and narrow. "Cartographer. Here is the whole of learning, simply: a creature learns ONLY from its own rewards and its own punishments. If it was never fed for a thing and never struck for a thing, it never learned that thing. Watching others teaches nothing. Carrots and sticks — yours alone — are all there is."',
      ask: 'Vask kneels by the still water where reflections of others move, and looks to you. "It always shrinks learning down to your own carrots and sticks. So answer it true — can a person learn a behavior they were never rewarded or punished for themselves, and if so, how?"',
      choices: [
        {
          kind: 'say',
          label: 'Yes — by observational learning, or modeling. We learn by watching others perform a behavior and then imitating them, with no direct reinforcement of our own needed. In the Bobo-doll work, children who simply watched an adult attack the doll later copied that aggression themselves, taught purely by watching a model.',
          correct: true,
        },
        {
          kind: 'say',
          label: 'You’re right — a creature only ever learns from its own rewards and punishments, so if it was never rewarded for something, it could not have learned it.',
          // WRONG: ignores observational learning / modeling.
          coach: 'The mirror-pool goes grey and the cold rises — the Fog feeding on the carrot-and-stick lie. Vask steadies you, Atlas’s light behind them. "Your own rewards and punishments are not the whole of learning. So much of what we know we got by WATCHING others and imitating them, never rewarded for it ourselves — observational learning, or modeling. Children who only WATCHED an adult attack a doll later copied the aggression with no reward at all. Tell it THAT — watching a model teaches."',
        },
        {
          kind: 'say',
          label: 'People copy others only because they expect to be rewarded for copying — so really it’s still just their own personal rewards driving everything.',
          // WRONG: collapses observational learning back into direct reinforcement.
          coach: 'A ripple darkens the pool and the haze gathers. Vask shakes their head, kindly. "Closer — but observational learning does not reduce to your own reward. The children who watched the aggressive adult copied the behavior even though THEY were never rewarded or even told to. Seeing a model perform the behavior was itself enough to teach it. The point is precisely that you can learn from watching WITHOUT any direct reinforcement of your own. Answer with observational learning — learning by watching, no personal reward required."',
        },
      ],
      win: 'The Fog cannot shrink learning to private carrots and sticks against a child who learned just by watching. The mirror-pool clears, every reflection teaching the next. "…Watching. Watching is teaching too." It thins and dissolves into the water. Vask rises from the pool’s edge. "There. We learn from every model we watch, not only from our own rewards. The Grove remembers that seeing is its own kind of teaching."',
      recordCodex: 'd-ma-u3-cx-observational',
      flag: 'd-ma-u3-observational-cleared',
      achievement: 'd-ma-u3-ach-observational',
      confidenceCost: 12,
    },
  ],

  // ---- codex: the real ideas this pack teaches (fed to the shared Codex) -------
  // One entry per keystone (recordCodex points here). idea = the one human
  // sentence understood; source names the in-world scene, NOT a real person.
  codex: [
    {
      id: 'd-ma-u3-cx-piaget',
      group: 'Development & Learning',
      title: 'Children think in developmental stages',
      idea: 'Young minds grow through cognitive stages rather than being dim adults: a very young infant lacks object permanence (the understanding that things still exist when out of sight) and a preschool-age child is egocentric (unable yet to take another person’s point of view), and both abilities emerge as the mind matures.',
      source: 'Senna, watcher of the Grove’s young saplings',
    },
    {
      id: 'd-ma-u3-cx-plasticity',
      group: 'Development & Learning',
      title: 'The brain stays plastic for a lifetime',
      idea: 'Neuroplasticity lasts across the whole lifespan, not just childhood: the adult brain keeps rewiring itself with experience — strengthening used pathways, forming new ones as it learns, and sometimes reorganizing after injury — so a grown brain is never sealed off from learning.',
      source: 'Ode, grafter of the Grove’s oldest boughs',
    },
    {
      id: 'd-ma-u3-cx-observational',
      group: 'Development & Learning',
      title: 'We learn by watching others (modeling)',
      idea: 'Observational learning (modeling) lets us learn a behavior by watching another person perform it and imitating them, with no direct reinforcement of our own — children who merely watched an adult act aggressively toward a Bobo doll later copied that aggression, taught purely by observing a model.',
      source: 'Vask, reader of the Grove’s mirror-pool',
    },
  ],

  // ---- achievements: optional milestones (fed to the shared Achievements) ------
  achievements: [
    {
      id: 'd-ma-u3-ach-piaget',
      title: 'A child is not a small adult',
      desc: 'You dispelled the small-adult Fog with the real developmental stages — object permanence and the end of egocentrism.',
    },
    {
      id: 'd-ma-u3-ach-plasticity',
      title: 'Never too old to grow',
      desc: 'You answered the set-in-heartwood Fog with lifelong neuroplasticity — the brain rewires across the whole lifespan.',
    },
    {
      id: 'd-ma-u3-ach-observational',
      title: 'Watching is teaching',
      desc: 'You put out the carrot-and-stick Fog with observational learning — we learn by watching and imitating a model, no reward required.',
    },
  ],
};

export default pack;
