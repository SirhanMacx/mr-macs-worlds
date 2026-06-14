// density-u2-cognition.js — DENSITY STORY-PACK for The Mind Atlas, Unit 2 · Cognition.
//
// This is an ADDITIVE second pack for Unit 2 (the existing u2-cognition.js — "The
// Recorder Fog" — already teaches reconstructive memory, the misinformation
// effect, top-down perception / perceptual set, and the limits of an intelligence
// test). This pack does NOT repeat any of those. It deepens Unit 2 toward fuller
// 2024-CED coverage with four NEW understanding-beats in the Memory Archipelago:
//
//   (a) "you can do two demanding things at once — multitasking works" → ATTENTION
//       has a BOTTLENECK; what people call multitasking is mostly fast TASK-
//       SWITCHING, which carries a real switch cost (think selective attention /
//       the cocktail-party effect: one demanding channel at a time).
//   (b) "if the usual use of a thing is X, then X is all it can ever be" →
//       FUNCTIONAL FIXEDNESS, a problem-solving impediment: fixating on an
//       object's typical function blocks the novel use that solves the problem.
//   (c) "look only for what would prove you right" → CONFIRMATION BIAS: seeking
//       and weighing evidence that fits a held belief while ignoring evidence
//       that could disconfirm it — the cure is to deliberately test the belief
//       against what would break it.
//   (d) "cram it all in one long night and you'll know it" → the SPACING EFFECT
//       and the TESTING EFFECT: distributed practice and retrieval practice
//       (self-testing) produce far more durable learning than massed cramming or
//       passive rereading. (A meta beat: the player learns how to study.)
//
// CRAFT BAR (mirrors the gold standard u1-ten-percent.js and the shipped
// u2-cognition.js exactly):
//   - Keystone choices are FULL IN-CHARACTER SENTENCES (kind:'say'), never
//     "A/B/C", never a quiz stem, never "Question N of M", never a score.
//   - A WRONG choice is a CONSEQUENCE, not a red X: the Fog thickens (a small
//     Confidence cost) and a mentor RE-TEACHES the missing idea, then the SAME
//     keystone re-renders so the player answers from understanding (the loop).
//   - The RIGHT choice CHANGES THE WORLD: it writes a Codex entry ("Understood"),
//     lifts the Clarity meter, sets a story flag, unlocks an achievement, and a
//     mentor confirms WHY.
//   - Supporting NPCs branch on story flags (memory of the player's choices).
//
// HONEST PEDAGOGY: every claim is real, in-scope (2024-CED) cognition. The
// teaching voices (Focus, the lamplighter; Pivot, the locksmith) are FICTIONAL
// mind-denizens, so nothing is a fake quote attributed to a real person. The
// Codex `source` names the in-world scene, not a real scientist. All ids are
// namespaced 'd-ma-u2-' so they can NEVER collide with the world or other packs.
//
// PLACEMENT: all content sits at ap-cognition (Memory Archipelago, station center
// [205,60]). Existing occupants there: built-in Mnemo at offset [-7,5] and the
// first pack's Recall at [9,-7]. This pack's two NPCs take the free corners
// [-9,-7] and [9,7], dodging both. See packs/CONTRACT.md for the full spec.
// This file is pure DATA only — no imports, no engine calls; it cannot crash the
// world.

export const pack = {
  // ---- identity --------------------------------------------------------------
  id: 'd-ma-u2-cognition-density',
  unit: 'Unit 2 · Cognition',
  title: 'The Scatter Fog',

  // ---- extra characters added to the world -----------------------------------
  npcs: [
    {
      // Focus — the attention/study mentor. Delivers keystones (a) and (d).
      id: 'd-ma-u2-lamplighter',
      name: 'Focus',
      title: 'a lamplighter of the Memory Archipelago',
      region: 'ap-cognition',
      offset: [-9, -7],            // free corner; Mnemo [-7,5], Recall [9,-7]
      hatKind: 'hood',
      palette: { robe: 0x2a5d8c, trim: 0x163a57, skin: 0xe6c79c, hat: 0x163a57 },
      dialogue: {
        start: (ctx) => {
          if (ctx.is && ctx.is('d-ma-u2-study-cleared')) return 'after';
          if (ctx.is && ctx.is('d-ma-u2-attention-cleared')) return 'midway';
          return 'root';
        },
        nodes: {
          root: {
            text: 'I tend the lamps along the narrow channels of the Archipelago — and lately the Fog keeps spreading the light too thin, so nothing in the wing is ever fully bright. It has this mind convinced of two cosy things: that it can do a dozen demanding jobs at once, and that one long panicked night of cramming will fix anything. Both feel productive. Both leave the galleries half-dark. Will you help me set them right?',
            choices: [
              { label: 'Can\'t a mind really do two demanding things at the same time?', next: 'attn' },
              { label: 'And what is wrong with one long night of cramming?', next: 'study' },
              { label: 'You said you tend the channels — what does attention actually do?', next: 'channels' },
              { label: 'Point me at the first Fog. I will answer it.', next: 'sendin' },
            ],
          },
          attn: {
            text: 'Not two DEMANDING things, no. Attention runs through a bottleneck — a mind can only deeply process so much at once. What people proudly call "multitasking" is usually fast switching between tasks, and every switch costs a beat of reorientation. Selective attention is real: you can ride one channel clearly while others go to background hum — that is the cocktail-party effect, hearing your own name across a noisy room. But ride two demanding channels at once and BOTH blur.',
            choices: [
              { label: 'So it is switching, not true parallel work — and switching costs. I will answer the Fog.', next: 'sendin' },
              { label: 'Then how should this mind actually study, if not all at once?', next: 'study' },
            ],
          },
          study: {
            text: 'Cramming feels like work because it is exhausting — but exhaustion is not learning. Two things make memory last. SPACING: the same study time spread across days beats one massed block, even though massing FEELS like it is sinking in deeper. And the TESTING effect: retrieving the answer from your own head — self-quizzing, closing the book — locks it in far better than rereading the page until it looks familiar. Familiar is not the same as known. The Fog adores that confusion.',
            choices: [
              { label: 'So space it out and test myself instead of rereading. I am ready.', next: 'sendin' },
              { label: 'Why does rereading feel like it works when it doesn\'t?', next: 'fluency' },
            ],
          },
          fluency: {
            text: 'Because rereading makes the words feel FLUENT — smooth, recognizable — and the mind mistakes that smooth feeling for mastery. It is a confidence trick the page plays on you. Retrieval breaks the trick: when you make yourself produce the answer with the book shut, you find out what you actually hold, and the effort of finding it is exactly what strengthens it. Struggling to recall is not failing to study — it IS the studying.',
            choices: [
              { label: 'So I should trust retrieval over recognition. Send me to the Fog.', next: 'sendin' },
            ],
          },
          channels: {
            text: 'Think of attention as a single bright lamp you carry down dark channels. Selective attention points it: whatever it lands on becomes vivid, and the rest of the wing drops to shadow — which is why you can miss something obvious while concentrated elsewhere. The lamp is not weak; it is FOCUSED, and focus is a spotlight, not a floodlight. The Fog wants you to believe it is a floodlight that lights everything at once. It never was.',
            choices: [
              { label: 'A spotlight, not a floodlight. I understand. Point me at the Fog.', next: 'sendin' },
            ],
          },
          sendin: {
            text: 'Good. The Fog will hand you the easy belief like a favour — "do it all at once," "cram it all tonight." Refuse it with what attention and learning actually do — one demanding channel at a time, study spaced and self-tested — and the channels light clean. If it gets a hook in you, come back. I have relit these lamps more times than there are tides.',
            choices: [],
          },
          midway: {
            text: 'The switching-lie is out — this mind has felt the cost of trying to ride two demanding channels at once, and chosen one clear lamp instead. But the Fog still sits in the study-rooms, promising that one frantic night will hold. Will you walk on to that one?',
            choices: [
              { label: 'Remind me why cramming fails and spacing wins.', next: 'study' },
              { label: 'Point me at the cramming Fog.', next: 'sendin' },
            ],
          },
          after: {
            text: 'Both my channels run bright now — the single clear lamp of attention, and the spaced, self-tested way this mind has learned to learn. The Fog cannot scatter the light here anymore. You taught it how to hold its own focus; that is a lamp it will carry into every other wing.',
            choices: [],
          },
        },
      },
    },
    {
      // Pivot — the problem-solving / reasoning mentor. Delivers (b) and (c).
      id: 'd-ma-u2-locksmith',
      name: 'Pivot',
      title: 'a locksmith of the Memory Archipelago',
      region: 'ap-cognition',
      offset: [9, 7],              // free corner; Mnemo [-7,5], Recall [9,-7]
      hatKind: 'brim',
      palette: { robe: 0x6b4a8c, trim: 0x3a2a57, skin: 0xc98a5b, hat: 0x3a2a57 },
      dialogue: {
        start: (ctx) => {
          if (ctx.is && ctx.is('d-ma-u2-confirmation-cleared')) return 'after';
          if (ctx.is && ctx.is('d-ma-u2-fixedness-cleared')) return 'midway';
          return 'root';
        },
        nodes: {
          root: {
            text: 'I pick the locks the Fog leaves on the doors of this wing — and the cleverest ones it builds are not made of iron. They are made of HABITS of thought. Two of them have this mind boxed in: it only ever sees a thing for its usual job, and it only ever goes looking for proof it is already right. Both feel like sound thinking. Both keep the doors shut. Come — I will show you the picks.',
            choices: [
              { label: 'How does "only seeing a thing for its usual job" trap a mind?', next: 'fixed' },
              { label: 'And "only looking for proof you\'re right" — what\'s wrong with that?', next: 'confirm' },
              { label: 'Why do these traps feel like good thinking?', next: 'why' },
              { label: 'Point me at the first locked door. I will answer the Fog.', next: 'sendin' },
            ],
          },
          fixed: {
            text: 'That is functional fixedness — fixating on an object\'s ordinary function so hard you cannot see a new one, even when the new use is the only thing that opens the door. The classic shape of it: you need to do a job, the tool is right in front of you, but because the tool is "for" something else, your mind files it as useless. A coin is money — until the screw needs turning and the coin becomes a screwdriver. The block is in the thinking, not the object.',
            choices: [
              { label: 'So I must look past a thing\'s usual job to its other uses. I am ready.', next: 'sendin' },
              { label: 'And the other trap — the looking-for-proof one?', next: 'confirm' },
            ],
          },
          confirm: {
            text: 'Confirmation bias — seeking, noticing, and trusting the evidence that fits what you already believe, while sliding right past the evidence that could prove you wrong. It is not stupidity; it is comfort. A held belief feels safer when you only feed it agreement. The cure is uncomfortable on purpose: deliberately go hunting for what would DISCONFIRM your idea. A belief that survives an honest attempt to break it is one you can actually trust.',
            choices: [
              { label: 'So I should test my belief against what would break it. Send me in.', next: 'sendin' },
            ],
          },
          why: {
            text: 'Because both are SHORTCUTS that usually work — and a shortcut that usually works is the hardest kind to question. A thing\'s usual job is usually the right job; evidence for your belief usually is more available. The Fog does not invent new errors; it takes a useful habit and lets it run past the one moment you needed to override it. The fix is never "stop thinking" — it is "notice the habit, and on the hard problem, choose the harder path on purpose."',
            choices: [
              { label: 'Then I will override the habit when it counts. Point me at the door.', next: 'sendin' },
            ],
          },
          sendin: {
            text: 'Good. The Fog will offer the comfortable move: keep the thing in its box, keep the belief unchallenged. Refuse it — see the second use, hunt the disconfirming evidence — and the lock springs. If it catches you, come back. There is no shame in a second pass; every lock on this wing has beaten me at least once.',
            choices: [],
          },
          midway: {
            text: 'The first door is open — this mind has learned to look past a thing\'s usual job and find the use that solves the problem. But the Fog still holds the door of belief, whispering "only look for what proves you right." Will you pick that one too?',
            choices: [
              { label: 'Remind me how to beat the looking-for-proof trap.', next: 'confirm' },
              { label: 'Point me at the locked belief-door.', next: 'sendin' },
            ],
          },
          after: {
            text: 'Both doors stand open. This mind can see a tool for more than its label, and it knows to test a belief against what would break it rather than only what would flatter it. The Fog has no locks left here that I cannot pick — because you taught the mind to pick them itself.',
            choices: [],
          },
        },
      },
    },
  ],

  // ---- named cutscenes (playCutscene beat arrays) -----------------------------
  cutscenes: {
    // Fires once when the player enters the Memory Archipelago AFTER the first
    // pack's reconstructive-memory beat is cleared — so it deepens, rather than
    // competes with, that pack's intro. (Trigger is on the 'flag' it sets.)
    'D-MA-U2-SCATTER-INTRO': [
      {
        tint: 'cold', kicker: 'The narrow channels of the Archipelago',
        text: 'Past the galleries you have already lit, the Memory Archipelago narrows into a maze of dim channels and shut study-rooms. The lamps here flicker — never dark, never bright — as if the light itself were being asked to be in six places at once.',
      },
      {
        tint: 'dusk',
        text: 'Two denizens wait where the channels fork. A lamplighter shields a guttering flame: "It tells this mind to do everything at once and learn everything overnight." Beside her, a locksmith turns a useless-looking pick between two fingers. "And to keep every tool in its box, and to look only for what flatters it. Come — we will show you the picks that open all of it."',
      },
    ],
  },

  // ---- triggers: WHEN a cutscene fires (once each) ----------------------------
  triggers: [
    // Deepen-after: fires when the first pack's reconstructive-memory flag is set,
    // so this density layer arrives once the player has begun the Archipelago.
    { on: 'flag', value: 'u2c_memory_cleared', play: 'D-MA-U2-SCATTER-INTRO', reward: { clarity: 4, insight: 10 } },
  ],

  // ---- keystones: THE CORE ----------------------------------------------------
  keystones: [
    // (a) ATTENTION BOTTLENECK / TASK-SWITCHING COST ----------------------------
    {
      id: 'd-ma-u2-ks-attention',
      npc: 'd-ma-u2-lamplighter',
      region: 'ap-cognition',
      kicker: 'THE FOG · the mind that does everything at once',
      title: 'The Floodlight',
      taunt: 'The Fog fans out across a dozen flickering channels at once, proud of itself. "Cartographer — look how capable this mind is! It can read, and listen, and solve, and watch, all at the same time, every channel at full attention. Multitasking is just being efficient. Why ever do one thing when a clever mind can do them all together?"',
      ask: 'Focus cups her guttering lamp. "It calls attention a floodlight. So tell it plainly — when this mind tries to do two DEMANDING things at the very same instant, what is actually happening, and what does it cost?"',
      choices: [
        {
          kind: 'say',
          label: 'Attention runs through a bottleneck, so it is not truly doing both at once — it is switching fast between them, and every switch carries a real cost; selective attention lets it ride one demanding channel clearly while the rest drop to background, but two at full attention both blur.',
          correct: true,
        },
        {
          kind: 'say',
          label: 'You are right — a mind can give full, deep attention to several demanding tasks at the exact same moment, with no cost at all.',
          // WRONG: denies the bottleneck. Re-teach switch cost, loop.
          coach: 'The channels flicker dimmer and the cold seeps in — the Fog feeds on the flattering idea of a limitless floodlight. Focus steadies you, Atlas\'s light behind her. "There is no floodlight. Attention has a bottleneck — deep processing happens in one main channel at a time. What looks like multitasking is rapid SWITCHING, and each switch costs a beat of reorientation that adds up to slower, sloppier work. Tell the Fog: switching, not parallel — and switching costs."',
        },
        {
          kind: 'say',
          label: 'It can do both perfectly as long as it just tries harder and concentrates twice as much.',
          // WRONG: effort doesn't dissolve the bottleneck. Re-teach, loop.
          coach: 'A lamp gutters out and the haze closes in. Focus shakes her head, kindly. "Effort is not the missing piece — the limit is structural, not a matter of willpower. You cannot will a single bottleneck into being two. Concentrating harder on two demanding channels still forces the mind to switch between them and still pays the switch cost; it just makes the switching tiring as well as slow. Answer with the bottleneck and the cost of switching."',
        },
      ],
      win: 'The Fog\'s dozen channels collapse into one steady, brilliant beam at your word, and the maze ahead lights clean. "…One lamp. One clear channel at a time. The rest was only ever flicker." It thins to a thread and slips down a dark passage. Focus lifts her lamp, bright now. "There. Not a floodlight — a spotlight, and a strong one. This mind will stop scattering itself and learn to point its light."',
      recordCodex: 'd-ma-u2-cx-attention',
      flag: 'd-ma-u2-attention-cleared',
      achievement: 'd-ma-u2-ach-attention',
      clarity: 8,
      confidenceCost: 12,
    },

    // (b) FUNCTIONAL FIXEDNESS --------------------------------------------------
    {
      id: 'd-ma-u2-ks-fixedness',
      npc: 'd-ma-u2-locksmith',
      region: 'ap-cognition',
      kicker: 'THE FOG · the thing that is only ever one thing',
      title: 'The Boxed Tool',
      taunt: 'The Fog settles over a locked door with a coin resting useless beside it. "Cartographer, be sensible. A coin is money. A spoon is for soup. A box is for holding things. A thing is FOR what it is for — that is just common sense. Whatever the problem is, the answer is never the spoon. Leave the tools in their boxes where they belong."',
      ask: 'Pivot turns the coin in the lamplight; the door\'s screw sits loose, no screwdriver in sight. "It wants every tool stuck to its label. So tell it — when the obvious tool is missing but a familiar object could do the job a new way, what habit is stopping the mind from seeing it, and what is it called?"',
      choices: [
        {
          kind: 'say',
          label: 'That is functional fixedness — fixating on an object\'s usual function so I cannot see a novel use, even when that new use is what solves the problem; the block is in my thinking, not the object, so a coin becomes a screwdriver the moment I let it.',
          correct: true,
        },
        {
          kind: 'say',
          label: 'You are right — a tool can only ever do its one proper job, so if the right tool is missing the problem simply cannot be solved.',
          // WRONG: endorses fixedness. Re-teach, loop.
          coach: 'The door\'s lock tightens and the cold presses in — the Fog loves a mind that keeps every tool in its box. Pivot catches your hand. "That surrender IS the trap. The problem is solvable; what is stuck is the assumption that an object equals its usual job. Functional fixedness is exactly that fixation — and it is in the thinking, not the thing. The coin beside the loose screw is a screwdriver waiting for permission. Name the habit, then break it."',
        },
        {
          kind: 'say',
          label: 'The trouble is just that the mind hasn\'t memorized enough facts about coins yet — with more facts it would automatically know what to do.',
          // WRONG: it's not a knowledge gap; it's fixation. Re-teach, loop.
          coach: 'A second lock clicks shut and the haze thickens. Pivot shakes his head gently. "More facts will not pick this lock. The mind already knows everything it needs about the coin — that is the cruel part. Functional fixedness is not a gap in knowledge; it is a FIXATION on the object\'s ordinary use that hides the novel one in plain sight. The fix is to look past the label, not to study harder. Answer with the fixation."',
        },
      ],
      win: 'You name the habit, and Pivot sets the coin\'s edge to the loose screw — it turns, and the door swings wide on a bright room. "…The tool was never the problem. The box around my thinking was." The Fog peels off the doorframe and frays away. Pivot pockets the coin with a grin. "There. This mind has learned to see a thing for more than its label — and that, cartographer, opens nearly every door there is."',
      recordCodex: 'd-ma-u2-cx-fixedness',
      flag: 'd-ma-u2-fixedness-cleared',
      achievement: 'd-ma-u2-ach-fixedness',
      clarity: 8,
      confidenceCost: 12,
    },

    // (c) CONFIRMATION BIAS -----------------------------------------------------
    {
      id: 'd-ma-u2-ks-confirmation',
      npc: 'd-ma-u2-locksmith',
      region: 'ap-cognition',
      kicker: 'THE FOG · the proof that only ever agrees',
      title: 'The Mirror Lock',
      taunt: 'The Fog pools at a door that reflects the player back. "Here is the easiest wisdom of all, cartographer: once you believe a thing, gather the proof that you are right. Notice every fact that agrees. Skip the ones that don\'t — they are just noise. A belief grows strong on agreement. Why would a sensible mind ever go looking for reasons it is wrong?"',
      ask: 'Pivot lays out two stacks of evidence — one that flatters a belief, one that could break it. "It wants the mind to read only the flattering stack. So tell it — what is that habit called, and what must a careful mind do INSTEAD to know whether a belief is actually true?"',
      choices: [
        {
          kind: 'say',
          label: 'That habit is confirmation bias — seeking and trusting only the evidence that fits what I already believe while ignoring what could disconfirm it; so instead I should deliberately hunt the evidence that would prove me wrong, because a belief that survives an honest attempt to break it is the only kind I can trust.',
          correct: true,
        },
        {
          kind: 'say',
          label: 'You are right — gathering more and more evidence that supports a belief is exactly how you prove it true, so the disconfirming stack can be safely ignored.',
          // WRONG: piling up confirming evidence isn't a test. Re-teach, loop.
          coach: 'The mirror-door darkens and the cold tightens — the Fog feasts on a belief that is only ever fed agreement. Pivot steadies you. "Piling up the flattering stack is not a test; it is a comfort. You can find SOME supporting evidence for almost any belief, true or false — that is why confirmation alone proves nothing. The real test is the stack you wanted to ignore: go after what would DISCONFIRM the belief. Tell the Fog to hunt for what would break it."',
        },
        {
          kind: 'say',
          label: 'The careful thing is to simply trust my first instinct and never reconsider it, since changing your mind is a sign of weak thinking.',
          // WRONG: overcorrects into stubbornness. Re-teach openness-to-test, loop.
          coach: 'The lock grinds and the haze closes in — now the Fog tempts you the other way, into stubbornness. Pivot shakes his head. "No. Refusing to reconsider is the same trap wearing a braver mask — it just protects the belief by never testing it at all. Careful thinking is not loyalty to a first instinct; it is willingness to put the instinct in front of evidence that could break it, and to update if it does. Answer with hunting the disconfirming evidence, not clinging."',
        },
      ],
      win: 'You reach past the flattering stack for the one that could break the belief — and the mirror-door clears, showing the room as it truly is, not as the mind wished it. "…I was only ever asking the question that already agreed with me." The Fog loses its reflection and frays to nothing. Pivot nods. "There. This mind will test its beliefs against what could break them now — and trust only the ones that survive."',
      recordCodex: 'd-ma-u2-cx-confirmation',
      flag: 'd-ma-u2-confirmation-cleared',
      achievement: 'd-ma-u2-ach-confirmation',
      clarity: 8,
      confidenceCost: 12,
    },

    // (d) SPACING EFFECT + TESTING EFFECT (the meta "how to study" beat) ---------
    {
      id: 'd-ma-u2-ks-study',
      npc: 'd-ma-u2-lamplighter',
      region: 'ap-cognition',
      kicker: 'THE FOG · the one long night',
      title: 'The Cram',
      taunt: 'The Fog crowds into a shut study-room, warm and urgent. "Cartographer — the exam is tomorrow, so here is the plan: stay up all night, reread the pages until every line looks familiar, pour it ALL in at once. Cramming is how serious minds learn. Spreading it out is just procrastinating, and quizzing yourself only shows you what you don\'t know. Reread, all night, and you\'ll be ready."',
      ask: 'Focus sets her lamp on the heaped, dog-eared pages. "It sells the all-night cram and the endless reread. So tell it — what actually makes learning LAST: how should study be spaced across time, and what should the mind do besides reread?"',
      choices: [
        {
          kind: 'say',
          label: 'Learning lasts when practice is spaced out across days instead of massed in one night — that is the spacing effect — and when the mind tests itself by retrieving the answers from memory instead of just rereading, which is the testing effect; rereading only feels like learning because it makes the material fluent and familiar.',
          correct: true,
        },
        {
          kind: 'say',
          label: 'You are right — cramming it all into one long night and rereading until it looks familiar is the most effective way to make knowledge stick.',
          // WRONG: endorses cram + reread. Re-teach spacing+testing, loop.
          coach: 'The pages blur grey and the cold seeps in — the Fog thrives on the comfort of the all-nighter. Focus steadies you, Atlas\'s light behind her. "Cramming and rereading feel productive and fade fast. Two things make memory durable: SPACING — the same time spread across days beats one massed block — and the TESTING effect — retrieving the answer from your own head locks it in far better than rereading. Familiar is not known. Tell the Fog: space it out, and self-test."',
        },
        {
          kind: 'say',
          label: 'The trick is just to reread the pages even MORE times until every word feels totally familiar — that familiarity proves the mind has learned it.',
          // WRONG: fluency illusion. Re-teach retrieval over recognition, loop.
          coach: 'A page curls grey in your hand and the haze thickens. Focus shakes her head gently. "That familiar feeling is the trap itself — rereading makes the words FLUENT, and the mind mistakes smooth-and-recognizable for known. Recognition is not retrieval. The way to find out, and to strengthen it, is to shut the book and make yourself produce the answer; the effort of recalling is what builds the memory. Answer with retrieval practice, not more rereading."',
        },
      ],
      win: 'The Fog\'s heaped pages settle into a calm, spaced schedule with a covered answer-key beside it, and the study-room floods with steady light. "…Spread out. Tested. Not one frantic night of looking at words." It thins to nothing and is gone. Focus lifts her lamp to the bright room. "There. This mind has learned how to learn — spaced, and self-tested. That is a lamp it carries out of this wing and into every subject it will ever face."',
      recordCodex: 'd-ma-u2-cx-study',
      flag: 'd-ma-u2-study-cleared',
      achievement: 'd-ma-u2-ach-study',
      clarity: 8,
      confidenceCost: 12,
    },
  ],

  // ---- codex: the real ideas this pack teaches (fed to the shared Codex) -------
  codex: [
    {
      id: 'd-ma-u2-cx-attention',
      group: 'Cognition',
      title: 'Multitasking is really fast switching',
      idea: 'Attention has a bottleneck, so a mind cannot deeply process two demanding tasks at once; what looks like multitasking is rapid task-switching that carries a real switch cost, while selective attention lets one demanding channel be processed clearly at a time.',
      source: 'Focus, lamplighter of the Memory Archipelago',
    },
    {
      id: 'd-ma-u2-cx-fixedness',
      group: 'Cognition',
      title: 'Functional fixedness boxes the mind',
      idea: 'Functional fixedness is a problem-solving impediment: fixating on an object\'s usual function blocks seeing a novel use that would solve the problem, so the obstacle lives in the thinking, not the object.',
      source: 'Pivot, locksmith of the Memory Archipelago',
    },
    {
      id: 'd-ma-u2-cx-confirmation',
      group: 'Cognition',
      title: 'Confirmation bias only reads agreement',
      idea: 'Confirmation bias is seeking and weighting evidence that fits a held belief while ignoring evidence that could disconfirm it; the corrective is to deliberately test the belief against what would prove it wrong and keep only beliefs that survive.',
      source: 'Pivot, locksmith of the Memory Archipelago',
    },
    {
      id: 'd-ma-u2-cx-study',
      group: 'Cognition',
      title: 'Space it out and test yourself',
      idea: 'The spacing effect (distributed practice across days) and the testing effect (retrieving answers from memory) produce far more durable learning than massed cramming or rereading, which only creates a misleading feeling of fluency.',
      source: 'Focus, lamplighter of the Memory Archipelago',
    },
  ],

  // ---- achievements: optional milestones (fed to the shared Achievements) ------
  achievements: [
    {
      id: 'd-ma-u2-ach-attention',
      title: 'Spotlight, not floodlight',
      desc: 'You showed the Scatter Fog that attention has a bottleneck — multitasking is fast switching with a real cost — and lit the channels of the Archipelago clean.',
    },
    {
      id: 'd-ma-u2-ach-fixedness',
      title: 'The coin that turned a screw',
      desc: 'You named functional fixedness and looked past a tool\'s usual job to the use that solved the problem.',
    },
    {
      id: 'd-ma-u2-ach-confirmation',
      title: 'Hunting for the break',
      desc: 'You refused the flattering evidence and tested a belief against what could disconfirm it, picking the Mirror Lock open.',
    },
    {
      id: 'd-ma-u2-ach-study',
      title: 'How to learn',
      desc: 'You answered the all-night cram with the spacing and testing effects, teaching the mind a way to learn that lasts.',
    },
  ],
};

export default pack;
