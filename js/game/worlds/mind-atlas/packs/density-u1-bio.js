// density-u1-bio.js — DENSITY STORY-PACK for The Mind Atlas · Unit 1 · Biological
// Bases of Behavior. A SECOND, denser pack for Unit 1, additive on top of the
// gold-standard ten-percent pack (u1-ten-percent.js) and the bio-more pack
// (u1-bio-more.js). It deepens the unit toward full curriculum coverage with
// THREE new Fog misconceptions that the existing two packs do NOT cover:
//
//   (a) THE WIRED-AT-BIRTH FOG — the comfortable idea that the brain is "fixed
//       and hardwired at birth," that who you are is set in the wiring you were
//       born with. Dispelled with experience-dependent development: the newborn
//       brain is built to be SHAPED by experience (overproduction of synapses
//       followed by experience-driven synaptic pruning), and plasticity is the
//       brain's design, not a repair afterthought. (Distinct from u1-bio-more's
//       "burned-out / decline" Fog — that one is about adult loss + repair after
//       damage; THIS one is about the START: the brain is wired BY experience,
//       never finished at birth.)
//
//   (b) THE DOPAMINE = PLEASURE FOG — the pop-science idea that dopamine is the
//       brain's "pleasure chemical," the hit of feeling good. Dispelled with the
//       real role: dopamine is central to REWARD, MOTIVATION, and movement — it
//       drives wanting and the pursuit of a reward (reward-prediction/learning),
//       which is not the same as the liking/pleasure of getting it. (No existing
//       Unit 1 pack touches a neurotransmitter myth; content.js itself lists
//       dopamine's role as "reward, movement, motivation," so this is in-scope.)
//
//   (c) THE NATURE-OR-NURTURE FOG — the tidy either/or that a trait is caused by
//       genes OR by environment, so you just have to pick the side. Dispelled
//       with the real position: nature and nurture INTERACT; genes and experience
//       work together (genes shape how we respond to environments and
//       environments shape how genes are expressed) — it was never a contest with
//       a winner.
//
// HONEST PEDAGOGY: every claim is real and in 2024-CED scope. The teaching voices
// are FICTIONAL mind-denizens (Cira, a synapse-pruner of the Neural Caverns; and
// Veda, a twin-keeper of the Caverns) so nothing is a fake quote attributed to a
// real person. Each Codex `source` names the in-world scene, never a real
// scientist. Excluded-as-correct content (Freud stages, Maslow, etc.) appears
// only as a Fog lie, never as a right answer.
//
// PURE DATA. No imports, no engine calls — physically cannot crash the world.
// This file is one `export const pack = { ... }` plugged in later via index.js;
// the defensive loader registers it. See packs/CONTRACT.md for the full spec.
//
// ID NAMESPACE: every id is prefixed `d-ma-u1-` so it can NEVER collide with
// content.js denizens (glia/Astra…), u1-ten-percent (brainmapper/Sef), or
// u1-bio-more (u1biomore_bridgekeeper/Hale).
//
// PLACEMENT: region ap-bio (Neural Caverns), station center [150,-110]. Occupied
// offsets: Astra [7,5] (built-in), Sef [-9,-7] (ten-percent), Hale [9,-7]
// (bio-more). This pack's NPCs take [-9,7] and [9,7] — both free.

export const pack = {
  // ---- identity --------------------------------------------------------------
  id: 'd-ma-u1-bio-density',
  unit: 'Unit 1 · Biological Bases of Behavior',
  title: 'The Wiring of the Self (Density Pack)',

  // ---- extra characters added to the world -----------------------------------
  npcs: [
    // Cira — synapse-pruner. Delivers the wired-at-birth Fog AND the dopamine Fog.
    {
      id: 'd-ma-u1-npc-pruner',
      name: 'Cira',
      title: 'a synapse-pruner of the Neural Caverns',
      region: 'ap-bio',
      offset: [-9, 7],            // free corner of the ap-bio station
      hatKind: 'scholar',
      palette: { robe: 0x0d7d6e, trim: 0x0a4f47, skin: 0x9be7ff, hat: 0x0a4f47 },
      dialogue: {
        start: (ctx) => {
          if (ctx.is && ctx.is('d-ma-u1-flag-born') && ctx.is('d-ma-u1-flag-dopamine')) return 'after';
          return 'root';
        },
        nodes: {
          root: {
            text: 'You came to the nursery galleries — where this mind first wired itself. I am a pruner: when this brain was new it grew far MORE connections than it could ever use, and my work was to keep the ones experience lit and let the unused ones fade. The Fog hates that story. It would rather tell this mind two flattering lies down here. Which shall we answer first?',
            choices: [
              { label: 'Tell me about the Fog that says the brain is fixed at birth.', next: 'born_lore' },
              { label: 'Tell me about the Fog wearing the dopamine molecule.', next: 'dopa_lore' },
              { label: 'Why does the Fog gather in the nursery galleries?', next: 'why_here' },
            ],
          },
          born_lore: {
            text: 'This one whispers, "you were finished the day you were born — the wiring is set, the person is decided, nothing you do can change it." It is a comfortable surrender dressed as biology. The truth runs the other way: the newborn brain is BUILT to be shaped. It overproduces synapses, then experience does the carving — the connections you use are strengthened, the ones you do not are pruned away. The brain is not hardwired at birth; it is wired BY living. Answer the Fog with that and the nursery lights.',
            choices: [
              { label: 'So I answer it with experience shaping the wiring — not a fixed start.', next: 'born_send' },
              { label: 'And the dopamine Fog?', next: 'dopa_lore' },
            ],
          },
          dopa_lore: {
            text: 'This one wears a single bright molecule like a crown and calls itself "the pleasure chemical — the hit of feeling good." Half a truth, which is what the Fog loves. Dopamine is real and it is everywhere in reward, motivation, and movement — but its job is closer to WANTING than to liking. It drives the pursuit of a reward and the learning of what predicts one; it is the engine of going-after, not the warm glow of having. Tell the Fog the difference and the molecule stops being a lie.',
            choices: [
              { label: 'So dopamine is reward, motivation, movement — wanting, not just pleasure.', next: 'dopa_send' },
              { label: 'And the fixed-at-birth Fog?', next: 'born_lore' },
            ],
          },
          why_here: {
            text: 'Because this is where the mind is most tempted to stop trying. A nursery is full of "it was always going to be this way." The Fog sells that as comfort: you were set at birth, your chemistry decides your joy, your fate was a coin already flipped. Every one of those hands the mind permission to give up on itself. The cure is never the tidy story — it is the true one, that this brain was made to keep changing.',
            choices: [
              { label: 'Then point me at the first Fog. I will answer it.', next: 'root' },
            ],
          },
          born_send: {
            text: 'Yes. It will offer you the finished, hardwired brain like a fact of nature. Hand it back: the brain overproduces connections and then experience prunes and strengthens them — it is wired BY living, not set at birth. If it talks you down, come back. I have re-pruned this nursery more times than I can count.',
            choices: [],
          },
          dopa_send: {
            text: 'Yes. It will sell you dopamine as a pleasure-button — and then it spelled it right, "pleasure," and still got the science wrong. Answer with the real role: reward, motivation, movement; the wanting that drives pursuit and learning. If it gets its hooks in you, there is no shame in a second pass.',
            choices: [],
          },
          after: {
            text: 'Both nursery galleries are lit and the young circuits hum clean. You answered the way this mind needs to answer everything down here — not with the fate the Fog offered, but with the truth that it was built to keep changing. The Caverns will remember that nothing here was ever finished.',
            choices: [],
          },
        },
      },
    },

    // Veda — twin-keeper. Delivers the nature-vs-nurture false-dichotomy Fog.
    {
      id: 'd-ma-u1-npc-twinkeeper',
      name: 'Veda',
      title: 'a twin-keeper of the Neural Caverns',
      region: 'ap-bio',
      offset: [9, 7],             // the other free corner of the ap-bio station
      hatKind: 'hood',
      palette: { robe: 0x115e7a, trim: 0x0b3a4c, skin: 0x9be7ff, hat: 0x0b3a4c },
      dialogue: {
        start: (ctx) => (ctx.is && ctx.is('d-ma-u1-flag-interact')) ? 'after' : 'root',
        nodes: {
          root: {
            text: 'I keep the twin-vaults — where this mind studies what made it itself: the genes it was handed and the life it has lived. There is a Fog in here that never tires, and it always asks the same trap: "which one made you — your nature or your nurture? Pick a side." I have watched it split this mind down the middle for years. Will you help me answer it properly?',
            choices: [
              { label: 'How is "nature OR nurture" a trap, exactly?', next: 'trap' },
              { label: 'What do twins actually show us about it?', next: 'twins' },
              { label: 'Point me at the Fog. I will answer it.', next: 'send' },
            ],
          },
          trap: {
            text: 'Because it forces a contest that does not exist. Nature and nurture are not two competitors with a winner — they INTERACT. Genes shape how we respond to our environments, and environments shape how our genes are expressed. A trait you might call "born" still needed experience to switch on, and a trait you might call "learned" still ran on the equipment genes built. The honest answer is never a percentage on one side; it is the interaction. Answer with that and the trap springs empty.',
            choices: [
              { label: 'So it is the interaction — genes and experience together.', next: 'send' },
              { label: 'What do twins actually show us?', next: 'twins' },
            ],
          },
          twins: {
            text: 'Twin and adoption studies are how this field even asks the question — they let us see how much of the difference between people tracks shared genes versus shared environments. And what they keep finding is not a victory for either side: identical twins are strikingly similar AND not identical, because environments still differ and genes still need experiences to express. The studies measure heritability, not destiny. They point straight at the interaction. Carry that to the Fog.',
            choices: [
              { label: 'So even twins show genes and environment working together.', next: 'send' },
              { label: 'Remind me why the either/or is a trap.', next: 'trap' },
            ],
          },
          send: {
            text: 'Good. It will demand you pick a winner like it is the only fair question. Refuse the contest: nature and nurture interact, every time, on every trait — genes shape responses to environments and environments shape gene expression. If the trap closes on you, come back; I have reopened this vault more times than I can say.',
            choices: [],
          },
          after: {
            text: 'The twin-vault stands open and steady, both sides of it lit at once. You answered the Fog the way this mind needs to understand itself — not as a winner and a loser, but as nature and nurture woven together. The Caverns will not be split down the middle again.',
            choices: [],
          },
        },
      },
    },
  ],

  // ---- named cutscenes (playCutscene beat arrays) -----------------------------
  cutscenes: {
    // Frames the nursery + twin galleries and points at Cira + Veda.
    'D-MA-U1-INTRO': [
      {
        tint: 'cold', kicker: 'The nursery galleries of the Caverns',
        text: 'Below the lit synapses lie the oldest rooms in this mind — the nursery galleries, where it first wired itself, and the twin-vaults, where it studies what made it itself. Grey shapes drift among them: one murmuring "you were finished at birth," one wearing a single bright molecule and calling it pleasure, one demanding the vault pick a side, nature or nurture.',
      },
      {
        tint: 'dusk',
        text: 'A pruner steadies a young circuit; a twin-keeper holds two threads side by side. "You feel the Fogs of the beginning," they say. "Each one tells this mind it was already decided. None of them is true. Come — we will show you how this self was actually made."',
      },
    ],
  },

  // ---- triggers: WHEN a cutscene fires (once each) ----------------------------
  triggers: [
    { on: 'visit', value: 'ap-bio', play: 'D-MA-U1-INTRO', reward: { clarity: 3, insight: 8 } },
  ],

  // ---- keystones: THE CORE ----------------------------------------------------
  keystones: [
    // (a) WIRED AT BIRTH ------------------------------------------------------
    {
      id: 'd-ma-u1-ks-born',
      npc: 'd-ma-u1-npc-pruner',
      region: 'ap-bio',
      kicker: 'THE FOG · the wired-at-birth lie',
      title: 'The Wired-At-Birth Fog',
      taunt: 'The Fog settles over the youngest circuits, soft as a lullaby. "Cartographer. Rest your pencil. This brain was finished the day it was born — the wiring set, the person decided. Whatever it became, it was always going to. So stop carving; there was never anything for experience to do here."',
      ask: 'Cira kneels by an overgrown tangle of young connections, more than the mind could ever use. "It always starts with that — the finished baby. So answer it plainly: when this brain was new, was it hardwired and done, or was it built to be shaped by what the person lived? Tell the Fog how a self actually gets wired."',
      choices: [
        {
          kind: 'say',
          label: 'It was built to be shaped. The newborn brain overproduces connections, and then experience does the carving — the synapses the person uses get strengthened and the unused ones are pruned away. The brain is not hardwired at birth; it is wired BY living, and it keeps changing.',
          correct: true,
        },
        {
          kind: 'say',
          label: 'You\'re right — the wiring is fixed at birth, so who this person is was settled before they ever lived a single day.',
          // WRONG: the genetic-determinism / fixed-brain myth. Re-teach experience-dependent wiring, then loop.
          coach: 'The young circuits dim and the cold settles in — that is the Fog feeding on a comfortable fate. Cira steadies you, Atlas\'s light behind her. "You took the finished baby as fact. It isn\'t. A newborn brain grows FAR more connections than it needs, then experience prunes and strengthens them — what the person uses survives, what they don\'t fades. The brain is wired BY living, not finished at birth. Tell it THAT and the nursery lights."',
        },
        {
          kind: 'say',
          label: 'It came mostly empty and blank, and experience just poured everything in from scratch — the genes did almost nothing.',
          // WRONG: blank-slate over-correction — ignores the genetic scaffold/overproduction. Re-teach, then loop.
          coach: 'A circuit gutters and the haze leans closer. Cira shakes her head, kindly. "Closer — experience matters enormously, but you erased the equipment. The newborn brain is not blank: genes build the scaffold and OVERPRODUCE the connections first, and then experience carves them. It is genes laying the wiring and experience shaping which of it stays. Answer with both — the overgrowth and the pruning — not a blank slate."',
        },
      ],
      win: 'The Fog\'s lullaby falters — and across the nursery the overgrown tangles begin to resolve, used pathways brightening, unused ones quietly thinning, the way a real mind is carved. "…Shaped. It was being shaped all along." It thins to a wisp and slips out. Cira rests a hand on a glowing, well-pruned branch. "There. Not finished at birth — built to be made. This person was always becoming themselves."',
      recordCodex: 'd-ma-u1-cx-born',
      flag: 'd-ma-u1-flag-born',
      achievement: 'd-ma-u1-ach-born',
      confidenceCost: 12,
    },

    // (b) DOPAMINE = PLEASURE -------------------------------------------------
    {
      id: 'd-ma-u1-ks-dopamine',
      npc: 'd-ma-u1-npc-pruner',
      region: 'ap-bio',
      kicker: 'THE FOG · the pleasure-chemical lie',
      title: 'The Dopamine Fog',
      taunt: 'The Fog lifts a single bright molecule and turns it like a jewel. "Cartographer. Here is the simplest truth in the whole brain, free of charge: this is dopamine — the pleasure chemical. The hit of feeling good. More of it, more happiness. That is all it is, and all it does. Tidy, no?"',
      ask: 'Cira watches the molecule glint. "It loves to make this one a single bright button — press it, feel good. So answer it carefully: what is dopamine actually doing in this brain — is it the FEELING of pleasure, or something else? Tell the Fog the real job."',
      choices: [
        {
          kind: 'say',
          label: 'It is not simply "pleasure." Dopamine is central to reward, motivation, and movement — it drives the WANTING and the pursuit of a reward and the learning of what predicts one. That craving-and-going-after is not the same as the liking of getting it; dopamine is the engine of motivation, not just a feel-good hit.',
          correct: true,
        },
        {
          kind: 'say',
          label: 'You\'re right — dopamine just is pleasure, so more dopamine simply means more happiness and that\'s the whole story.',
          // WRONG: the "pleasure chemical" pop myth. Re-teach reward/motivation/movement, then loop.
          coach: 'The molecule flares and the cold bites — that is the Fog feeding on a tidy slogan. Cira steadies you, Atlas\'s light behind her. "You bought the pleasure-button. Dopamine is bigger and stranger than that: it is central to reward, motivation, and movement — it drives WANTING, the pursuit of a reward, and learning what predicts one. Wanting is not the same as liking. Tell it the motivation, not the feel-good myth, and the jewel goes dull."',
        },
        {
          kind: 'say',
          label: 'Dopamine has nothing to do with reward at all — it only controls muscle movement and that is its single job.',
          // WRONG: over-correction that strips the reward/motivation role. Re-teach, then loop.
          coach: 'A panel flickers out and the haze presses in. Cira shakes her head. "Closer on one thing — dopamine truly does matter for movement; losing it shows up as movement disorders. But you cut out the rest. It is ALSO central to reward, motivation, and learning what predicts a reward — that is its most famous role. It does movement AND motivation; don\'t trade one half-truth for another. Answer with both."',
        },
      ],
      win: 'The Fog\'s jewel cracks — what looked like a single pleasure-button opens into a web of pathways for wanting, pursuing, learning, and moving. "…Not the feeling. The drive." The molecule dims and the Fog with it. Cira watches the web settle into the Caverns\' map. "There. Not a happiness-switch — the engine that makes this mind go after what matters. Now it knows the difference between wanting and liking."',
      recordCodex: 'd-ma-u1-cx-dopamine',
      flag: 'd-ma-u1-flag-dopamine',
      achievement: 'd-ma-u1-ach-dopamine',
      confidenceCost: 12,
    },

    // (c) NATURE-VS-NURTURE FALSE DICHOTOMY -----------------------------------
    {
      id: 'd-ma-u1-ks-interact',
      npc: 'd-ma-u1-npc-twinkeeper',
      region: 'ap-bio',
      kicker: 'THE FOG · the pick-a-side lie',
      title: 'The Nature-or-Nurture Fog',
      taunt: 'The Fog stands between two great vault-doors and gestures at both. "Cartographer. One question and you can close half this room forever: which one made this person — their nature or their nurture? Their genes, or their upbringing? Pick the winner. It is always one or the other; smart people simply choose a side."',
      ask: 'Veda holds two glowing threads, one from each vault, and will not let either drop. "It always demands a winner. So answer it the honest way: was this person made by their genes OR by their environment — or is the question itself wrong? Tell the Fog how nature and nurture really work."',
      choices: [
        {
          kind: 'say',
          label: 'The question is the trap. Nature and nurture are not rivals — they INTERACT. Genes shape how a person responds to their environments, and environments shape how genes are expressed; every trait comes from both working together. There is no winner to pick, only the interaction.',
          correct: true,
        },
        {
          kind: 'say',
          label: 'You\'re right, you have to pick — and clearly it was nature, so this person\'s genes alone decided who they became.',
          // WRONG: genetic determinism — picks a side. Re-teach interaction, then loop.
          coach: 'The vault-threads dim and the cold settles — that is the Fog feeding on a clean winner. Veda steadies you, Atlas\'s light behind her. "You picked a side, and the side itself was the lie. Genes are not destiny on their own: they shape how a person RESPONDS to environments, and environments shape how genes are EXPRESSED. Take away either one and the trait never appears. Answer with the interaction, not the winner, and the trap springs empty."',
        },
        {
          kind: 'say',
          label: 'You\'re right, you have to pick — and clearly it was nurture, so the environment alone made this person who they are with genes playing no part.',
          // WRONG: pure environmentalism — the other side of the same trap. Re-teach interaction, then loop.
          coach: 'A vault-thread flickers and the haze presses closer. Veda shakes her head, kindly. "You chose the other side of the same trap. Environment matters enormously — but it acts ON the brain genes built, and genes need experiences to express. Twin and adoption studies don\'t crown nurture either; they keep pointing at both at once. It is never one alone. Answer with nature AND nurture, interacting."',
        },
      ],
      win: 'The Fog\'s two vault-doors swing open together instead of one slamming shut — and the two threads in Veda\'s hands wind into a single bright cord, neither thread the winner. "…Both. Woven. Of course." The grey thins between the doors and is gone. Veda lifts the braided cord. "There. Not a contest with a winner — nature and nurture, woven into one self. This mind will not let itself be split in two again."',
      recordCodex: 'd-ma-u1-cx-interact',
      flag: 'd-ma-u1-flag-interact',
      achievement: 'd-ma-u1-ach-interact',
      confidenceCost: 12,
    },
  ],

  // ---- codex: the real ideas this pack teaches --------------------------------
  codex: [
    {
      id: 'd-ma-u1-cx-born',
      group: 'Biological Bases',
      title: 'The brain is wired by experience, not fixed at birth',
      idea: 'The newborn brain is built to be shaped: it overproduces synaptic connections and then experience carves them, strengthening the pathways the person uses and pruning away the unused ones — so the brain is wired by living rather than hardwired and finished at birth.',
      source: 'Cira, synapse-pruner of the Neural Caverns',
    },
    {
      id: 'd-ma-u1-cx-dopamine',
      group: 'Biological Bases',
      title: 'Dopamine is reward and motivation, not just "pleasure"',
      idea: 'Dopamine is not simply a "pleasure chemical": it is central to reward, motivation, and movement, driving the wanting and pursuit of a reward and the learning of what predicts one — and that wanting is distinct from the liking of actually getting the reward.',
      source: 'Cira, synapse-pruner of the Neural Caverns',
    },
    {
      id: 'd-ma-u1-cx-interact',
      group: 'Biological Bases',
      title: 'Nature and nurture interact — it is not either/or',
      idea: 'Nature versus nurture is a false dichotomy: genes and environment interact, with genes shaping how a person responds to their environments and environments shaping how genes are expressed, so every trait arises from both working together rather than one winning.',
      source: 'Veda, twin-keeper of the Neural Caverns',
    },
  ],

  // ---- achievements: optional milestones --------------------------------------
  achievements: [
    {
      id: 'd-ma-u1-ach-born',
      title: 'Built to be made',
      desc: 'You answered the wired-at-birth Fog with experience-dependent development — the brain overproduces connections and experience prunes them.',
    },
    {
      id: 'd-ma-u1-ach-dopamine',
      title: 'Wanting, not liking',
      desc: 'You answered the dopamine Fog with its real role — reward, motivation, and movement — instead of the "pleasure chemical" myth.',
    },
    {
      id: 'd-ma-u1-ach-interact',
      title: 'Woven, not chosen',
      desc: 'You answered the nature-or-nurture Fog with interaction — genes and environment work together; there was never a side to pick.',
    },
  ],
};

export default pack;
