// u1-bio-more.js — STORY-PACK for The Mind Atlas · Unit 1 · Biological Bases.
//
// Two MORE Fog encounters in the Neural Caverns, beyond the gold-standard
// "ten-percent" pack (u1-ten-percent.js). Both are real, 2024-CED-scoped
// neuroscience, and both follow the exemplar craft bar exactly:
//
//   (a) THE LEFT-BRAIN / RIGHT-BRAIN FOG — the cosy idea that people are
//       "logical left-brained" or "creative right-brained" personalities.
//       Dispelled with real lateralization: hemispheres DO specialize (language
//       leans left, some spatial/face/prosody processing leans right), but they
//       are joined by the corpus callosum and work together constantly — there
//       is no "logical type" vs "creative type" of person.
//
//   (b) THE BURNED-OUT FOG — the despairing idea that drinking and aging just
//       kill brain cells you can never get back, so the brain only ever declines.
//       Dispelled with neuroplasticity (the brain rewires with experience) and
//       neurogenesis (new neurons form, notably in the hippocampus) — the brain
//       reorganizes and adapts across life; it is not a one-way burn-down.
//
// HONEST PEDAGOGY: every claim below is real and in scope. The teaching voice is
// a FICTIONAL mind-denizen (Hale, a corpus-callosum bridgekeeper of the Neural
// Caverns) so nothing is a fake quote attributed to a real person. Each Codex
// `source` names the in-world scene, never a real scientist.
//
// PURE DATA. No imports, no engine calls. This file is one `export const pack`.
// It plugs in via packs/index.js (two-line edit); the defensive loader registers
// it. See packs/CONTRACT.md for the full field-by-field spec.
//
// ID NAMESPACE: everything is prefixed `u1biomore_`/`cx_u1bio_`/`ach_u1bio_` so
// it can never collide with content.js denizens (glia/Astra…) or u1-ten-percent.

export const pack = {
  // ---- identity --------------------------------------------------------------
  id: 'u1-bio-more',
  unit: 'Unit 1 · Biological Bases of Behavior',
  title: 'More Fog in the Neural Caverns',

  // ---- extra characters added to the world -----------------------------------
  // Hale lives at the ap-bio station (center [150,-110]). Built-in Astra sits at
  // [7,5]; the ten-percent pack's Sef sits at [-9,-7]; Hale takes [9,-7] so no
  // one overlaps. A fictional mind-denizen — speaks paraphrase, never a real
  // person's words.
  npcs: [
    {
      id: 'u1biomore_bridgekeeper',
      name: 'Hale',
      title: 'a bridgekeeper of the Neural Caverns',
      region: 'ap-bio',
      offset: [9, -7],
      hatKind: 'hood',
      palette: { robe: 0x0e7490, trim: 0x164e63, skin: 0x9be7ff, hat: 0x164e63 },
      dialogue: {
        // Acknowledge whichever Fog is already cleared; otherwise open the lore.
        start: (ctx) => {
          if (ctx.is && ctx.is('u1biomore_plastic_cleared') && ctx.is('u1biomore_sides_cleared')) return 'after';
          return 'root';
        },
        nodes: {
          root: {
            text: 'You came to the deep galleries. Good — there are two old Fogs down here that I cannot put out alone, and both wear the face of comfort. I keep the bridge between the two halves of this mind: the corpus callosum, a cable of two hundred million fibres carrying traffic both ways, every second. The Fog hates that bridge. It would rather sell this mind two tidy stories. Which one shall we answer first?',
            choices: [
              { label: 'Tell me about the "two kinds of people" Fog.', next: 'sides_lore' },
              { label: 'Tell me about the Fog that says the brain only burns down.', next: 'plastic_lore' },
              { label: 'Why does the Fog love a tidy story so much?', next: 'why_tidy' },
            ],
          },
          sides_lore: {
            text: 'This one is flattering, so it sticks: "you are a left-brained, logical sort" or "she is a right-brained, creative sort." Half-true facts make the strongest lies. The halves DO specialize — language usually leans left; some spatial work, face reading, and the music in a voice lean right. But specialization is not personality. The bridge I keep means both halves are working on almost everything, together, all the time. Nobody runs on one hemisphere. Answer the Fog with the bridge and it loses the room.',
            choices: [
              { label: 'So I should answer it with lateralization, not personality types.', next: 'sides_send' },
              { label: 'And the other Fog — the one about burning down?', next: 'plastic_lore' },
            ],
          },
          plastic_lore: {
            text: 'This one is cruel because it sounds like surrender: "you drank, you got old, you lost cells you will never grow back — the brain only ever declines." It leans on a true fear and stops there. What it leaves out: the brain REWIRES. After damage or with practice, surviving circuits take on new jobs — that is neuroplasticity. And new neurons are still born, especially in the hippocampus — neurogenesis. The brain reorganizes across a whole life. Refuse the despair with that and the gallery lights again.',
            choices: [
              { label: 'So I answer it with plasticity and neurogenesis — the brain adapts.', next: 'plastic_send' },
              { label: 'And the "two kinds of people" Fog?', next: 'sides_lore' },
            ],
          },
          why_tidy: {
            text: 'Because a tidy story asks nothing of you. "You only use ten percent," "you are just a right-brained creative," "your cells are gone for good" — each one hands the mind permission to stop looking. The cure is never a tidier story. It is the messy, true one, checked against the evidence. That is the only thing a Fog cannot wear.',
            choices: [
              { label: 'Then point me at the first one. I will answer it.', next: 'root' },
            ],
          },
          sides_send: {
            text: 'Yes. It will offer you the comfortable labels like a gift. Hand them back: the hemispheres specialize but the bridge keeps them working as one — there is no logical type and no creative type, only one whole brain doing both. If it gets its hooks in, come back. I have re-strung this bridge more times than I can count.',
            choices: [],
          },
          plastic_send: {
            text: 'Yes. It will dress its despair as honesty. Answer with what the brain actually does — rewires after harm and practice, and grows new cells in the hippocampus. The decline it sells is not the whole story. If it talks you down, come back; there is no shame in a second crossing.',
            choices: [],
          },
          after: {
            text: 'Both galleries are lit and the bridge between them hums clean. You answered the way this mind needs to answer everything down here — not with the tidy story, but with the true one. The Caverns will remember it can change.',
            choices: [],
          },
        },
      },
    },
  ],

  // ---- named cutscenes (playCutscene beat arrays) -----------------------------
  cutscenes: {
    // Fires once on first entering ap-bio — frames the two deep galleries + Hale.
    U1BIOMORE_INTRO: [
      {
        tint: 'cold', kicker: 'The deep galleries of the Caverns',
        text: 'Past the lit synapses, two galleries face each other across a single bright cable. In one, a grey shape sorts denizens into two bins, "logical" and "creative," pleased with itself. In the other, a colder shape mutters over a heap of grey: "spent, all spent, nothing grows back."',
      },
      {
        tint: 'dusk',
        text: 'A bridgekeeper stands on the cable between them, holding both ends steady. "You feel the two Fogs," Hale says. "One flatters this mind, one mourns it. Both are lies. Come — the bridge will show you why."',
      },
    ],
  },

  // ---- triggers: WHEN a cutscene fires (once each) ----------------------------
  triggers: [
    { on: 'visit', value: 'ap-bio', play: 'U1BIOMORE_INTRO', reward: { clarity: 3, insight: 8 } },
  ],

  // ---- keystones: THE CORE ----------------------------------------------------
  keystones: [
    // (a) LEFT-BRAIN / RIGHT-BRAIN PERSONALITIES ------------------------------
    {
      id: 'u1biomore_ks_sides',
      npc: 'u1biomore_bridgekeeper',
      region: 'ap-bio',
      kicker: 'THE FOG · the two-kinds-of-people lie',
      title: 'The Left-Brain / Right-Brain Fog',
      taunt: 'The Fog peels off the sorting-bins and smiles like a careers counsellor. "Cartographer! Save yourself the trouble — people come in two kinds. Left-brained: logical, verbal, the planners. Right-brained: creative, artistic, the dreamers. This mind is one or the other; just pick its side and stop mapping. Tidy, isn’t it?"',
      ask: 'Hale stands on the bright cable between the galleries. "It always opens with that flattery. So tell it plainly — when this person reasons through a problem AND when they sketch or daydream, which side of the brain is actually doing the work? Answer with the bridge."',
      choices: [
        {
          kind: 'say',
          label: 'Both halves, working together. The hemispheres DO specialize — language usually leans left, some spatial work and reading faces and the tune in a voice lean right — but the corpus callosum links them, so almost every task uses both. There is no logical "type" and no creative "type" of person; one whole brain does it all.',
          correct: true,
        },
        {
          kind: 'say',
          label: 'You’re right — logical people run on the left brain and creative people run on the right, and this one is clearly a left-brained sort.',
          // WRONG: the personality-type myth. Re-teach lateralization, then loop.
          coach: 'The cable dims a notch and the cold bites — that is the Fog feeding on a flattering label. Hale steadies you, Atlas’s light behind him. "You bought the ‘two kinds of people’ story. There aren’t two kinds. Yes, functions lateralize — language leans left, some spatial and face and prosody work leans right — but the bridge I keep means BOTH halves work together on nearly everything. Logic and creativity are not hemispheres you’re born into. Tell it THAT and the bin breaks."',
        },
        {
          kind: 'say',
          label: 'The two halves are completely separate — the left does language and nothing else touches it, the right does art and never talks to the left.',
          // WRONG: over-strong "split" — ignores the bridge. Re-teach, then loop.
          coach: 'A panel gutters out and the haze presses in. Hale shakes his head, kindly. "Closer — specialization is real. But you sealed the halves off, and that is the part the Fog wants you to believe. In an intact brain the corpus callosum carries traffic both ways constantly; the halves share the work. Lateralization is a lean, not a wall. Answer with the bridge, not the wall."',
        },
      ],
      win: 'The Fog’s sorting-bins tip over and spill — there were never two kinds of denizen, only whole ones. "…Both sides. Always both." It thins to a grey thread and slips off the cable. Hale runs a hand along the humming bridge. "There. One brain, two halves, one mind. This person was never half of anything."',
      recordCodex: 'cx_u1bio_sides',
      flag: 'u1biomore_sides_cleared',
      achievement: 'ach_u1bio_sides',
      confidenceCost: 12,
    },

    // (b) NEUROPLASTICITY / NEUROGENESIS --------------------------------------
    {
      id: 'u1biomore_ks_plastic',
      npc: 'u1biomore_bridgekeeper',
      region: 'ap-bio',
      kicker: 'THE FOG · the burned-out lie',
      title: 'The Burned-Out Fog',
      taunt: 'The colder Fog rises off its heap of grey, almost gentle. "Cartographer. I’ll be honest with you, since no one else will: every drink, every year, kills cells you will never grow back. The brain only ever burns down. So why map a ruin? Sit. Mourn it with me."',
      ask: 'Hale crosses to the dim gallery and lifts a fallen circuit back into place. "It dresses despair as honesty. So answer it with what this brain actually does over a lifetime — can it change, rebuild, grow anything new? Tell it the truth, not the comfort of giving up."',
      choices: [
        {
          kind: 'say',
          label: 'No — the brain rewires. After damage or with practice, surviving circuits take on new jobs; that is neuroplasticity. And new neurons are still born, especially in the hippocampus — neurogenesis. The brain reorganizes and adapts across a whole life; it is not a one-way burn-down.',
          correct: true,
        },
        {
          kind: 'say',
          label: 'You’re right, there’s nothing to be done — the cells are gone, the brain is fixed at this point, and it can only get worse from here.',
          // WRONG: fatalist fixed-brain myth. Re-teach plasticity/neurogenesis, loop.
          coach: 'The gallery darkens and the cold deepens — the Fog feeds on surrender. Hale steadies you, Atlas’s light behind him. "You took the despair as fact. It isn’t. The adult brain is NOT fixed: it rewires with experience and after injury — neuroplasticity — and it still grows new neurons, notably in the hippocampus — neurogenesis. Loss is real, but so is rebuilding. Answer with the rebuilding and it loses its grip."',
        },
        {
          kind: 'say',
          label: 'Only children’s brains can change — once you’re grown the wiring is set, so plasticity stopped years ago.',
          // WRONG: "plasticity is childhood-only." Re-teach lifelong change, loop.
          coach: 'A circuit flickers and goes dark; the haze leans closer. Hale shakes his head. "Closer — a young brain is especially plastic, that’s true. But you walled change off at childhood, and that’s the Fog’s favourite trick. Plasticity continues into adulthood — learning a skill, recovering after a stroke — and neurogenesis carries on in the hippocampus. The brain keeps changing for life. Tell it the WHOLE life, not just the first chapter."',
        },
      ],
      win: 'The Fog’s heap of grey stirs — and the fallen circuits begin to relight, rerouting around the gaps, while a few faint new sparks kindle in the deep. "…It rebuilds. It actually rebuilds." The cold thins and is gone. Hale watches the gallery glow back to life. "There. Not a ruin — a thing that mends itself. This brain can change as long as it lives, and now it remembers that."',
      recordCodex: 'cx_u1bio_plastic',
      flag: 'u1biomore_plastic_cleared',
      achievement: 'ach_u1bio_plastic',
      confidenceCost: 12,
    },
  ],

  // ---- codex: the real ideas this pack teaches --------------------------------
  codex: [
    {
      id: 'cx_u1bio_sides',
      group: 'Biological Bases',
      title: 'There is no "left-brained" or "right-brained" personality',
      idea: 'Brain functions lateralize — language usually leans to the left hemisphere, and some spatial, face, and prosody processing leans right — but the corpus callosum links the hemispheres so they work together on nearly every task; "logical vs. creative people" is a myth, not a brain type.',
      source: 'Hale, bridgekeeper of the Neural Caverns',
    },
    {
      id: 'cx_u1bio_plastic',
      group: 'Biological Bases',
      title: 'The brain rewires and can grow new neurons',
      idea: 'The brain is not a one-way burn-down: neuroplasticity lets surviving circuits take on new jobs after damage or with practice, and neurogenesis produces new neurons (notably in the hippocampus), so the brain reorganizes and adapts across the whole lifespan, not only in childhood.',
      source: 'Hale, bridgekeeper of the Neural Caverns',
    },
  ],

  // ---- achievements: optional milestones --------------------------------------
  achievements: [
    {
      id: 'ach_u1bio_sides',
      title: 'One brain, two halves',
      desc: 'You answered the left-brain / right-brain Fog with real lateralization — the hemispheres specialize but work together across the bridge.',
    },
    {
      id: 'ach_u1bio_plastic',
      title: 'A mind that mends',
      desc: 'You answered the burned-out Fog with neuroplasticity and neurogenesis — the brain rewires and grows new cells across a lifetime.',
    },
  ],
};

export default pack;
