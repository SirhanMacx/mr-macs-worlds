// u2-cognition.js — STORY-PACK for The Mind Atlas, Unit 2 · Cognition.
//
// Four Fog-encounters in the Memory Archipelago, each the moment a player
// UNDERSTANDS a real 2024-CED cognition idea — never a quiz:
//   (a) "memory is a video recording you replay" → memory is RECONSTRUCTIVE
//       (the mind rebuilds the past each time and can distort it).
//   (b) "eyewitness memory is reliable, the tape doesn't lie" → the
//       MISINFORMATION EFFECT (misleading information AFTER an event reshapes
//       what is "remembered").
//   (c) "we see the world objectively, exactly as it is" → TOP-DOWN perception
//       and PERCEPTUAL SET (expectation and context shape what we perceive).
//   (d) "intelligence is one number — your IQ score is the whole of you" →
//       intelligence is broader than a single score and tests have real limits
//       (validity, reliability, cultural bias). CED-SCOPED: Gardner's multiple
//       intelligences is offered as the Fog's TEMPTING WRONG belief, NOT the
//       correct answer.
//
// CRAFT BAR (copied from the gold standard u1-ten-percent.js):
//   - Keystone choices are FULL IN-CHARACTER SENTENCES (kind:'say'), never
//     "A/B/C", never a quiz stem, never "Question N of M", never a score.
//   - A WRONG choice is a CONSEQUENCE, not a red X: the Fog thickens (a small
//     Confidence cost) and the mentor (Recall, a fictional archive-walker this
//     pack adds, with Atlas's light behind her) re-teaches the missing idea,
//     then the SAME keystone re-renders so the player answers from understanding.
//   - The RIGHT choice CHANGES THE WORLD: writes a Codex entry ("Understood"),
//     lifts the Clarity meter, sets a story flag, unlocks an achievement, and a
//     mentor confirms WHY.
//
// HONEST PEDAGOGY: every claim is real, in-scope cognition. The teaching voice
// (Recall) is a FICTIONAL mind-denizen so nothing is a fake quote attributed to
// a real person. Codex `source` names the in-world scene, not a real scientist.
// All ids are namespaced 'u2c_' so they never collide with the world or other
// packs. See packs/CONTRACT.md for the full spec. This file is pure DATA only.

export const pack = {
  // ---- identity --------------------------------------------------------------
  id: 'u2-cognition',
  unit: 'Unit 2 · Cognition',
  title: 'The Recorder Fog',

  // ---- extra characters added to the world -----------------------------------
  // Placed at ap-cognition (Memory Archipelago, station center [205,60]). The
  // built-in keeper Mnemo sits at offset [-7,5], so Recall takes [9,-7] — a
  // clear, non-colliding spot. Recall speaks paraphrase; she is fictional.
  npcs: [
    {
      id: 'u2c_archivewalker',
      name: 'Recall',
      title: 'an archive-walker of the Memory Archipelago',
      region: 'ap-cognition',
      offset: [9, -7],
      hatKind: 'scholar',
      palette: { robe: 0x4b3f8c, trim: 0x2a2360, skin: 0xe6c79c, hat: 0x2a2360 },
      // Recall is the pack's mentor voice: lore + the on-ramps to all four
      // keystones. The loader auto-appends the "answer the Fog" launcher to any
      // terminal node, so the player walks from talk straight into a keystone.
      dialogue: {
        start: (ctx) => (ctx.is && ctx.is('u2c_iq_cleared')) ? 'after'
          : ((ctx.is && ctx.is('u2c_memory_cleared')) ? 'midway' : 'root'),
        nodes: {
          root: {
            text: 'You came to the Archipelago at the right tide. The Fog here has stopped pretending to be clever — now it just whispers the cosiest lie a mind tells about itself: "your memory is a tape, your eyes are a window, and your worth is one number." Mnemo guards the storage-trays; I walk the older galleries, where the records get rewritten when no one is watching. Four of these galleries have gone grey. Will you help me light them?',
            choices: [
              { label: 'How can a memory get rewritten? Isn\'t it just stored and replayed?', next: 'recon' },
              { label: 'What about eyewitnesses — surely a clear memory of a thing is reliable?', next: 'misinfo' },
              { label: 'And you said the eyes are not a window. What does that mean?', next: 'perceive' },
              { label: 'You mentioned "one number." What is the Fog doing with intelligence?', next: 'iq' },
              { label: 'Point me at the first Fog. I will answer it.', next: 'sendin' },
            ],
          },
          recon: {
            text: 'Because memory is RECONSTRUCTIVE. The mind does not file a finished tape and play it back — it keeps the gist and a few cues, and rebuilds the scene fresh each time you recall it, patching the gaps with what makes sense now. That is why two honest people remember the same dinner differently, and why your own childhood "memories" quietly shift. Useful, fast, flexible — and exactly why it can be fooled.',
            choices: [
              { label: 'So recall is reconstruction, not replay. I am ready for the Fog.', next: 'sendin' },
              { label: 'Then how does misleading information get IN after the fact?', next: 'misinfo' },
            ],
          },
          misinfo: {
            text: 'The misinformation effect. Feed someone a misleading detail AFTER an event — a leading question, a rumor, a "the broken glass" that was never there — and it can weave itself into the memory as if it had always belonged. The person is not lying; the reconstruction has genuinely changed. It is why eyewitness confidence and eyewitness accuracy are not the same thing.',
            choices: [
              { label: 'So a confident witness can be confidently wrong. I will answer that Fog.', next: 'sendin' },
            ],
          },
          perceive: {
            text: 'We like to think perception is bottom-up — raw light and sound arriving clean. But it is also TOP-DOWN: your brain runs on expectation, context, and prior knowledge, and that shapes what you actually perceive. A perceptual set primes you to see one thing and miss another; the same ambiguous shape reads as a "B" between letters and a "13" between numbers. The eyes feed data; the mind decides what it means.',
            choices: [
              { label: 'So context and expectation steer perception. Send me to that Fog.', next: 'sendin' },
            ],
          },
          iq: {
            text: 'The Fog loves a single number — it makes a person easy to shelve. But intelligence is broader than any one score, and the tests have real limits: a test must be standardized, reliable, and valid, and even a good one can carry cultural bias and never captures everything a mind can do. Careful: the Fog will try to trade you ONE comfortable oversimplification for another. Do not swap the single-number lie for an untested slogan. Trust what the evidence actually supports.',
            choices: [
              { label: 'So a score is a narrow, limited measure — not the whole mind. I am ready.', next: 'sendin' },
            ],
          },
          sendin: {
            text: 'Good. Each gallery the Fog will offer you the easy belief like a gift. Refuse it with what cognition actually does — rebuild, mislead, expect, and measure-with-limits — and the record stays honest. If it gets its hooks in you, come back. There is no shame in a second pass; I have re-shelved this archive more times than the tide has turned.',
            choices: [],
          },
          midway: {
            text: 'The first galleries are bright again — the record knows it can be rewritten, and that knowing is its best protection. But the Fog still sits in the far rooms, whispering about windows and numbers. Will you walk on?',
            choices: [
              { label: 'Tell me again how perception is not a clean window.', next: 'perceive' },
              { label: 'And the trap the Fog sets around intelligence?', next: 'iq' },
              { label: 'Point me at the next Fog.', next: 'sendin' },
            ],
          },
          after: {
            text: 'Every gallery is lit now — the rebuilt record, the misled witness, the expecting eye, the measured-but-not-summed mind. You answered the Archipelago the way it needed: honest about its own limits. The Fog has no record left to forge here.',
            choices: [],
          },
        },
      },
    },
  ],

  // ---- named cutscenes (playCutscene beat arrays) -----------------------------
  cutscenes: {
    // Fires once when the player first enters the Memory Archipelago — frames the
    // grey galleries and points at Recall, so the keystones have a setting.
    U2C_INTRO: [
      {
        tint: 'cold', kicker: 'The grey galleries of the Archipelago',
        text: 'Past Mnemo\'s storage-trays, the older galleries of the Memory Archipelago run on into haze. The shelves here are not empty — they are full of records being quietly rewritten, edges smudged, captions changed, as if the past could not be trusted to stay still.',
      },
      {
        tint: 'dusk',
        text: 'An archive-walker steps out of the murk, a lantern in one hand and a stack of half-corrected pages in the other. "You feel it," she says. "The Fog has the whole wing believing it is a tape, a window, and a single number. Come — I will show you what a mind actually does with what it knows."',
      },
    ],
  },

  // ---- triggers: WHEN a cutscene fires (once each) ----------------------------
  triggers: [
    { on: 'visit', value: 'ap-cognition', play: 'U2C_INTRO', reward: { clarity: 4, insight: 10 } },
  ],

  // ---- keystones: THE CORE ----------------------------------------------------
  // Four in-character UNDERSTANDING beats. Each: the Fog taunts with the
  // comfortable lie; Recall poses the ask; the player picks a full sentence;
  // exactly one is correct (records codex + lifts Clarity + sets flag); the
  // others carry a teaching coach (Fog thickens, mentor re-teaches, loop back).
  keystones: [
    // (a) RECONSTRUCTIVE MEMORY -------------------------------------------------
    {
      id: 'u2c_ks_reconstructive',
      npc: 'u2c_archivewalker',
      region: 'ap-cognition',
      kicker: 'THE FOG · the tape that never lies',
      title: 'The Recorder',
      taunt: 'The Fog pools over a grey shelf, warm and reassuring. "Cartographer. Relax — your memory is a camera. It records exactly what happens and plays it back, unchanged, forever. Whatever you remember is what was. Trust your tape. Why would it ever lie to you?"',
      ask: 'Recall sets her lantern on a half-rewritten page. "It always opens with the tape. So tell it plainly — when this mind reaches back for last week\'s dinner, is it playing a recording, or doing something else? Say what recall really is."',
      choices: [
        {
          kind: 'say',
          label: 'It is not a recording — memory is reconstructive. The mind keeps the gist and a few cues, then rebuilds the scene fresh each time and fills the gaps with what makes sense now, which is exactly why honest people remember the same event differently.',
          correct: true,
        },
        {
          kind: 'say',
          label: 'You are right — once an event reaches long-term memory it is locked in, stored exactly, and can never be altered.',
          // WRONG: storage is not a sealed tape. Re-teach reconstruction, loop.
          coach: 'The shelf dims a shade and the cold presses in — that is the Fog feeding on the comfort of a sealed tape. Recall steadies you, Atlas\'s light behind her. "There is no locked recording. Long-term memory is not a vault of finished films; it is a set of traces the mind RECONSTRUCTS each time you recall, patching gaps as it goes. That is why memories drift even when no one means to lie. Tell the Fog that — rebuilt, not replayed."',
        },
        {
          kind: 'say',
          label: 'The tape is fine — memories only ever go wrong because they slowly fade and decay with time.',
          // WRONG: decay isn't the issue; distortion at reconstruction is. Loop.
          coach: 'A page curls grey in your hand and the haze thickens. Recall shakes her head, kindly. "Forgetting is real, but that is not the trap here. The point is not that memories fade — it is that they are REBUILT. Each recall reconstructs the scene and can quietly reshape it, gaps and all. A faded tape is still a tape; this is no tape at all. Answer with reconstruction."',
        },
      ],
      win: 'The Fog flinches as the page corrects itself in your hands, and the gallery catches light. "…It rebuilds. Every time. So it can be touched." It thins to a thread and slips into the tide. Recall lifts her lantern. "There. Not a recorder — a maker, working in good faith. This mind knows now that its own past is something it builds, not something it merely owns."',
      recordCodex: 'u2c_cx_reconstructive',
      flag: 'u2c_memory_cleared',
      achievement: 'u2c_ach_reconstructive',
      clarity: 8,
      confidenceCost: 12,
    },

    // (b) MISINFORMATION EFFECT -------------------------------------------------
    {
      id: 'u2c_ks_misinformation',
      npc: 'u2c_archivewalker',
      region: 'ap-cognition',
      kicker: 'THE FOG · the witness who cannot be wrong',
      title: 'The Reliable Witness',
      taunt: 'The Fog drapes itself over a gallery of testimony. "Here is a sturdier truth, cartographer: an eyewitness who SAW it remembers it true. The more sure they are, the more right they are. Memory of a real event is reliable — what fell in afterward could never change what already happened."',
      ask: 'Recall lays out two versions of the same testimony, one altered after the fact. "It hides behind confidence. So tell it — after an event is over, can a misleading detail dropped in later actually change what a witness remembers? And what is that called?"',
      choices: [
        {
          kind: 'say',
          label: 'Yes — that is the misinformation effect: misleading information introduced AFTER an event, like a leading question or a rumor, can be woven into the memory so the witness genuinely recalls it wrong, which is why high confidence does not guarantee accuracy.',
          correct: true,
        },
        {
          kind: 'say',
          label: 'No — only the event itself can shape a memory; nothing that happens afterward can reach back and alter what was already stored.',
          // WRONG: post-event information is exactly the mechanism. Loop.
          coach: 'The testimony blurs and the cold bites — the Fog loves the idea of a sealed-off past. Recall steadies you. "But the past is not sealed. The misinformation effect is precisely about what comes AFTER: a leading question, a misleading caption, another person\'s version — any of it can fold into the reconstruction until the witness recalls something that never happened. Tell it that later information CAN reach back."',
        },
        {
          kind: 'say',
          label: 'A witness who is very confident is therefore very accurate — confidence and accuracy rise together.',
          // WRONG: confidence/accuracy decoupling is the whole lesson. Loop.
          coach: 'A page of testimony goes grey and the haze closes in. Recall shakes her head gently. "That is the most dangerous part of the lie. Confidence and accuracy can come apart — a witness can be utterly sure of a detail that misinformation planted. Sureness is a feeling; accuracy is a fact, and the misinformation effect drives a wedge between them. Answer with that wedge."',
        },
      ],
      win: 'The Fog recoils as the altered testimony separates from the true one before your eyes. "…So the witness can be sure and still be wrong. Inconvenient." It frays and is gone, and the gallery brightens. Recall nods. "There. This mind will hold its memories with more humility now — and weigh confidence and accuracy as the two different things they are."',
      recordCodex: 'u2c_cx_misinformation',
      flag: 'u2c_misinfo_cleared',
      achievement: 'u2c_ach_misinformation',
      clarity: 8,
      confidenceCost: 12,
    },

    // (c) TOP-DOWN PERCEPTION / PERCEPTUAL SET ----------------------------------
    {
      id: 'u2c_ks_perception',
      npc: 'u2c_archivewalker',
      region: 'ap-cognition',
      kicker: 'THE FOG · the window that shows everything',
      title: 'The Clear Window',
      taunt: 'The Fog spreads thin across a gallery of images. "Forget memory — perception, at least, is honest. Your eyes are a clean window: light comes in, the world goes straight through, and you see exactly what is there. No filter, no opinion. Just the world, objectively. Comforting, isn\'t it?"',
      ask: 'Recall holds up an ambiguous shape that reads two ways. "It calls the eyes a window. So tell it — when this mind looks at the world, is it just receiving raw data, or is something else shaping what it perceives? Name what is really going on."',
      choices: [
        {
          kind: 'say',
          label: 'It is not just a window — perception is also top-down: expectation, context, and prior knowledge shape what we perceive, so a perceptual set can prime the mind to see one thing and miss another, like the same shape reading as a B among letters and a 13 among numbers.',
          correct: true,
        },
        {
          kind: 'say',
          label: 'You are right — perception is purely bottom-up; the eyes just deliver raw light and the mind adds nothing of its own.',
          // WRONG: ignores top-down processing. Re-teach, loop.
          coach: 'The image flattens to grey and the cold seeps in — the Fog likes a mind that thinks it adds nothing. Recall steadies you, Atlas\'s light behind her. "Bottom-up is real — the eyes do feed in raw data. But perception is ALSO top-down: your expectations, context, and prior knowledge actively shape what you end up perceiving. That is why the same input can be read two ways. Tell it that the mind is not a passive window."',
        },
        {
          kind: 'say',
          label: 'Whatever you expect to see, you literally see — so perception is just imagination and the actual sensory data does not matter at all.',
          // WRONG: overcorrects to "data doesn't matter." Re-teach balance, loop.
          coach: 'The gallery wavers and the haze thickens — now the Fog tempts you the OTHER way. Recall shakes her head. "Careful. Expectation shapes perception, but it does not replace the data — perception is bottom-up AND top-down working together. A perceptual set primes and biases what you notice; it does not make the world up from nothing. Answer with both halves: the data arrives, and the mind\'s expectations shape what it means."',
        },
      ],
      win: 'The Fog loses its grip as the ambiguous shape resolves — then resolves the other way, on your command. "…So what it sees depends on what it expects. The window was never clean." It thins and drifts off, and the gallery glows. Recall lifts her lantern. "There. This mind will trust its eyes a little more wisely now — and remember that it is always part of what it sees."',
      recordCodex: 'u2c_cx_perception',
      flag: 'u2c_perception_cleared',
      achievement: 'u2c_ach_perception',
      clarity: 8,
      confidenceCost: 12,
    },

    // (d) INTELLIGENCE — MORE THAN ONE NUMBER / TEST LIMITS ---------------------
    // CED-SCOPED: Gardner's multiple intelligences is the Fog's TEMPTING WRONG
    // belief here, NOT the correct answer. The correct answer is the CED-safe
    // one: intelligence is broader than any single score, and tests have real
    // limits (standardization, reliability, validity, cultural bias).
    {
      id: 'u2c_ks_intelligence',
      npc: 'u2c_archivewalker',
      region: 'ap-cognition',
      kicker: 'THE FOG · the single number',
      title: 'The One Number',
      taunt: 'The Fog condenses to a single glowing digit above the last grey gallery. "Here is the cleanest truth of all, cartographer: a person is one number. Their IQ. Measure it once and you know their worth, their future, their ceiling — all of it, settled, on a single line. So tidy. So final."',
      ask: 'Recall sets down a stack of test booklets, each measuring something different. "It wants to shelve this whole mind under one digit. So tell it the truth about that number — what does a single intelligence score actually capture, and what are the limits of the test that produced it?"',
      choices: [
        {
          kind: 'say',
          label: 'A single score is a narrow, limited measure — intelligence is broader than any one number, and even a well-built test only counts as good if it is standardized, reliable, and valid, and it can still carry cultural bias and never captures everything a mind can do.',
          correct: true,
        },
        {
          kind: 'say',
          label: 'You are right that one number says it all — the IQ score is fixed, captures a person\'s entire intelligence, and predicts everything about who they will become.',
          // WRONG: endorses the single-number lie. Re-teach test limits, loop.
          coach: 'The digit flares brighter and the cold tightens — the Fog feeds on the comfort of a settled verdict. Recall steadies you, Atlas\'s light behind her. "No single number settles a mind. A score measures a slice under specific conditions; a test is only worth trusting if it is standardized, reliable, and valid, and even then it can carry cultural bias and miss whole capacities. It is a limited measure, not a sentence. Tell the Fog the number has limits."',
        },
        {
          kind: 'say',
          // CED TRAP: Gardner's multiple intelligences offered as the "fix."
          label: 'The real answer is that there are eight separate intelligences — musical, bodily, interpersonal and the rest — and each person just has a different set; that theory is the proven truth that replaces the single number.',
          // WRONG (CED-scoped): do NOT endorse Gardner as the correct answer.
          coach: 'The Fog grins — it offered you THIS one on purpose. Recall catches your arm. "Careful. You felt the single-number lie was too narrow and reached for a tidy slogan to replace it — but do not trade one untested oversimplification for another. The honest answer is not a fixed list of separate intelligences; it is humbler than that. Intelligence is broader than one score, AND the tests that measure it have real limits — standardization, reliability, validity, and cultural bias. Answer with the limits of the measure, not a slogan."',
        },
      ],
      win: 'The Fog\'s single digit fractures into a dozen dimmer readings, none of them the whole story, and the last gallery floods with light. "…Not one number. Not a tidy list either. A limited measure of a vast thing." It thins to nothing. Recall closes her booklets. "There. This mind will not let itself be shelved under a digit — and it will ask, every time, what the test could and could not see."',
      recordCodex: 'u2c_cx_intelligence',
      flag: 'u2c_iq_cleared',
      achievement: 'u2c_ach_intelligence',
      clarity: 8,
      confidenceCost: 12,
    },
  ],

  // ---- codex: the real ideas this pack teaches (fed to the shared Codex) -------
  codex: [
    {
      id: 'u2c_cx_reconstructive',
      group: 'Cognition',
      title: 'Memory rebuilds, it does not replay',
      idea: 'Memory is reconstructive, not a video recording: the mind stores gist and cues and rebuilds the scene fresh each time it recalls, filling gaps with current expectations — which is why honest memories drift and differ.',
      source: 'Recall, archive-walker of the Memory Archipelago',
    },
    {
      id: 'u2c_cx_misinformation',
      group: 'Cognition',
      title: 'Eyewitness memory can be reshaped',
      idea: 'The misinformation effect: misleading information introduced after an event can be folded into a memory so the person genuinely recalls it wrong, which is why a confident eyewitness is not necessarily an accurate one.',
      source: 'Recall, archive-walker of the Memory Archipelago',
    },
    {
      id: 'u2c_cx_perception',
      group: 'Cognition',
      title: 'Perception is top-down, not a clean window',
      idea: 'Perception combines bottom-up sensory data with top-down processing: expectation, context, and prior knowledge shape what we perceive, so a perceptual set can prime the mind to see one thing and miss another.',
      source: 'Recall, archive-walker of the Memory Archipelago',
    },
    {
      id: 'u2c_cx_intelligence',
      group: 'Cognition',
      title: 'A test score is a limited measure',
      idea: 'Intelligence is broader than any single score, and a test is only trustworthy when it is standardized, reliable, and valid — and even then it can carry cultural bias and cannot capture everything a mind can do.',
      source: 'Recall, archive-walker of the Memory Archipelago',
    },
  ],

  // ---- achievements: optional milestones (fed to the shared Achievements) ------
  achievements: [
    {
      id: 'u2c_ach_reconstructive',
      title: 'The honest forger',
      desc: 'You showed the Recorder Fog that memory rebuilds rather than replays, and lit the first grey gallery of the Archipelago.',
    },
    {
      id: 'u2c_ach_misinformation',
      title: 'The wedge between sure and right',
      desc: 'You proved that misleading information after an event can reshape a memory — and that confidence is not the same as accuracy.',
    },
    {
      id: 'u2c_ach_perception',
      title: 'Part of what it sees',
      desc: 'You answered the Clear-Window Fog with top-down perception, showing that expectation and context shape what a mind perceives.',
    },
    {
      id: 'u2c_ach_intelligence',
      title: 'More than a digit',
      desc: 'You refused both the single-number lie and the tidy slogan, answering with the real limits of an intelligence test.',
    },
  ],
};

export default pack;
