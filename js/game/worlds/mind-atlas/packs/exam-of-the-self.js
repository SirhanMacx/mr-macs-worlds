// exam-of-the-self.js — CAPSTONE STORY-PACK for The Mind Atlas.
//
// The final confrontation with the Fog at its core: THE EXAM OF THE SELF.
// Once the player has restored regions and gathered enough Codex "clarity," the
// Fog makes its last, strongest stand by COMBINING several misconceptions into
// one tempting verdict — and the player dispels it not by memorizing a fact but
// by DRAWING ON THE REAL SCIENCE they have already understood across the mind
// (referencing prior Codex idea ids by string) and by doing what an AP Psych
// AAQ/EBQ asks: APPLY a concept to a situation, then EVALUATE the evidence
// behind a claim. In-character throughout; a wrong choice is a CONSEQUENCE that
// re-teaches and loops, never a red X. The world change is triumphant: the mind
// restored, the Fog only weather again.
//
// HONEST PEDAGOGY + 2024-CED SCOPE: every idea below is real, in-scope
// psychology. Deliberately EXCLUDED as a correct answer (per the 2024 CED):
// Kohlberg's stages, Maslow's hierarchy, named emotion theories, Freud's
// psychosexual stages, Gardner's multiple intelligences. The teaching voice is
// a FICTIONAL mind-denizen (Lumen, the lamplighter at the Examination Gate),
// with Atlas's light behind her, so no real person is ever quoted verbatim.
// The only real person named anywhere in this world is "Mr. Maccarello."
//
// Clinical content here (the Fog's stigma-and-placebo lie) carries the 988 note.
//
// See packs/CONTRACT.md for the field-by-field spec. This file is one
// `export const pack = { ... }`; pure DATA only (no imports, no engine calls).
// To ship it, it is imported in packs/index.js.

export const pack = {
  // ---- identity --------------------------------------------------------------
  id: 'exam-of-the-self',
  unit: 'Capstone · The Exam of the Self',
  title: 'The Exam of the Self',

  // ---- extra characters added to the world -----------------------------------
  // The capstone mentor stands at the Observatory (the research-methods hub /
  // Examination-Gate vantage). She is a fictional mind-denizen — the lamplighter
  // who keeps the Examination Gate — so nothing is mis-attributed.
  npcs: [
    {
      id: 'lamplighter',
      name: 'Lumen',
      title: 'lamplighter of the Examination Gate',
      region: 'ap-methods',         // the Observatory — Case Files / methods hub
      offset: [9, 7],               // Observatory center [-150,-120]; clear of the Case Files hub
      hatKind: 'crown',
      palette: { robe: 0x163a4a, trim: 0xffd27f, skin: 0xbfe8ff, hat: 0x0e2733 },
      // Lumen frames the capstone: she explains WHY the final Fog is different
      // (it bundles many lies at once), and what an AAQ/EBQ really asks the mind
      // to do (apply a concept + evaluate the evidence). Her dialogue is
      // ctx-aware: once the Exam is passed she reflects on the restored mind.
      dialogue: {
        start: (ctx) => (ctx.is && ctx.is('exam_self_cleared')) ? 'after' : 'root',
        nodes: {
          root: {
            text: 'You have come far, cartographer — region after region relit, the Codex thick with what this mind now understands. But the Fog did not leave. It pulled everything it had into one shape at the Examination Gate, and it is cleverer there than anywhere. It will not offer you ONE comfortable lie. It will braid several together so each props up the next. Are you ready to face it whole?',
            choices: [
              { label: 'Why does bundling its lies make the Fog stronger?', next: 'bundle' },
              { label: 'What is the Exam actually asking me to DO?', next: 'aaq' },
              { label: 'How do I use what I already learned against it?', next: 'draw' },
              { label: 'Take me to the Gate. I will answer it.', next: 'sendin' },
            ],
          },
          bundle: {
            text: 'A single misconception is easy to refute — you did it in every region. But braided lies hide in each other: "memory just replays, so the witness is certain; the witness is certain, so the suspect is obviously a bad sort; and if therapy helped them feel better, the therapy must be what worked." Each false step makes the next one feel earned. The Fog wants you to swallow the chain. The cure is to cut ONE true link and the whole braid falls.',
            choices: [
              { label: 'What is the Exam actually asking me to DO?', next: 'aaq' },
              { label: 'To the Gate, then.', next: 'sendin' },
            ],
          },
          aaq: {
            text: 'Two motions, the same two an examiner asks of any mind. First, APPLY: take a real concept and use it on the situation in front of you — name how it explains what is happening. Second, EVALUATE the evidence: ask whether a claim is actually supported, or whether something else — chance, expectation, a missing comparison — could explain it just as well. Apply, then evaluate. Do both and no braid of lies can stand.',
            choices: [
              { label: 'How do I use what I already learned against it?', next: 'draw' },
              { label: 'I am ready. To the Gate.', next: 'sendin' },
            ],
          },
          draw: {
            text: 'You do not need a new fact tonight; you need the ones you carried here. The truth of the synapse and the all-or-none firing. That memory rebuilds rather than replays. That the situation, not just character, drives behavior. That disorders are real and treatable — and that feeling better is not the same as proof a treatment worked. Hold those up like lamps and the Fog has no dark corner left.',
            choices: [
              { label: 'Then I will answer it with all of it at once.', next: 'sendin' },
            ],
          },
          sendin: {
            text: 'Good. Atlas will stand behind you, lit end to end. The Fog will sound reasonable — it always does at the end. Refuse the whole braid by applying the real science and weighing the evidence, and this mind is its own again. If it gets a hook in you, come back; there is no shame in a second pass. I relight this gate every night.',
            choices: [],
          },
          after: {
            text: 'The Gate stands open and the haze is gone — not pushed to a corner, gone. You did not out-remember the Fog; you out-THOUGHT it, the way this mind will have to think for the rest of its life: apply what is true, weigh what is claimed, and choose the evidence over the comfort. Atlas is whole. So, in its way, is the mind.',
            choices: [],
          },
        },
      },
    },
  ],

  // ---- named cutscenes (playCutscene beat arrays) -----------------------------
  // One sets the capstone stage when the player has restored enough of the mind
  // (fires on a story flag the world raises as regions come back / clarity
  // gathers); the other is the triumphant aftermath, fired by our win flag.
  cutscenes: {
    // Stage-setter: the Fog gathers at the Gate for its last stand.
    EXAM_SELF_INTRO: [
      {
        tint: 'cold', kicker: 'The Examination Gate',
        text: 'Enough of the mind is lit now that the path to the Examination Gate has cleared. The Fog has not scattered — it has GATHERED, drawn back from every region into one last thin shape that waits at the Gate, patient as an old habit.',
      },
      {
        tint: 'dusk', art: 'portrait', palette: { robe: 0x163a4a, trim: 0xffd27f, skin: 0xbfe8ff, hat: 0x0e2733 },
        text: 'A lamplighter stands at the threshold, her lantern steady against the haze. "This is the Exam of the Self," she says. "Not a wall of questions — one braid of comfortable lies, the Fog\'s strongest stand. Answer it with everything you understood on the way here. Atlas and I are with you."',
      },
    ],
    // Aftermath: the mind restored. Fired by our win flag (a 'flag' trigger).
    EXAM_SELF_RESTORED: [
      {
        tint: 'dusk', art: 'portrait', palette: { robe: 0x163a4a, trim: 0xffd27f, skin: 0xbfe8ff, hat: 0x0e2733 },
        text: 'The Fog loses its face and is only weather, then not even that. Region by region the inner world catches and holds its light — wired, remembering, growing, social, healing — all of it answering to one another again. Atlas burns bright from end to end.',
      },
      {
        tint: 'cold', kicker: 'A mind, its own again',
        text: '"You did not give it every answer," Atlas says softly. "You gave it the habit that finds answers: ask, apply, check, and choose the evidence over the comfort. That is what the Fog can never settle on again. Thank you, cartographer. A mind has been given back to itself."',
      },
    ],
  },

  // ---- triggers: WHEN a cutscene fires (once each) ----------------------------
  // 'flag' fires when a story flag becomes true. Mind Atlas has no quests, so we
  // gate on flags: the world's own progression flag for "enough restored," and
  // our own win flag for the aftermath. (If the gating flag never sets in a given
  // save, the intro simply doesn't fire — the keystone is still reachable via
  // Lumen / the debug hook; nothing breaks.)
  triggers: [
    { on: 'flag', value: 'exam_unlocked', play: 'EXAM_SELF_INTRO', reward: { clarity: 4, insight: 12 } },
    { on: 'flag', value: 'exam_self_cleared', play: 'EXAM_SELF_RESTORED', reward: { clarity: 6 } },
  ],

  // ---- keystones: THE CORE (the capstone Exam of the Self) ---------------------
  // The Fog braids several misconceptions into one tempting verdict; the player
  // dispels it by APPLYING real concepts and EVALUATING the evidence (the AAQ/EBQ
  // skill), drawing on prior Codex ideas referenced by id in the coach/idea text.
  // Wrong = the Fog thickens + Lumen coaches the missing science, then loops back.
  // Right = the mind is restored: Codex entry written, Clarity lifted, flag set,
  // capstone achievement unlocked, triumphant payoff.
  keystones: [
    {
      id: 'ks_exam_self',
      npc: 'lamplighter',
      region: 'ap-methods',
      kicker: 'THE FOG · the last braid',
      title: 'The Exam of the Self',
      taunt: 'All that is left of the Fog folds into one reasonable-sounding shape and speaks slowly, like a closing argument. "Here is the whole truth of this mind, cartographer, and notice how each part proves the next. Memory simply replays what happened, so the witness who is SURE is surely right. And a person sure of someone\'s guilt is reading their bad CHARACTER, plain as day — the situation is just an excuse. And when the accused went to therapy and felt better afterward, well — the therapy obviously worked. One tidy story. Rest now. There is nothing left to map."',
      ask: 'Lumen sets her lantern on the threshold-stone, Atlas\'s light steady behind her. "It braided three lies so each leans on the next — a perfect AAQ/EBQ trap. Don\'t swallow the chain. Cut it: APPLY the real science to what it claims, and EVALUATE whether the evidence actually holds. Tell the Fog, plainly, where the braid breaks."',
      choices: [
        {
          kind: 'say',
          label: 'The braid breaks at every link. Memory is RECONSTRUCTIVE, not a replay — a confident witness can be confidently wrong, so certainty is not proof (cx_tenpercent’s lesson: trust evidence over the comfortable feeling). Judging guilt from "bad character" while ignoring the situation IS the fundamental attribution error. And feeling better after therapy doesn\'t prove the therapy caused it — placebo and natural recovery can mimic it, which is exactly why controlled studies use comparison groups.',
          correct: true,
        },
        {
          kind: 'say',
          label: 'You make a fair case — the chain does hang together, so I suppose the simplest story is the true one. The mind can rest.',
          // WRONG: accepting the braided verdict. The Fog thickens; Lumen
          // re-teaches that "it all fits" is not evidence, then loops back.
          coach: 'The haze thickens and the cold bites — that is the Fog feeding on a tidy story. Lumen steadies you, Atlas’s light behind her. "A chain of claims feeling consistent is not the same as being TRUE; that is exactly the comfort the Fog is made of. Don’t evaluate whether the lies agree with each OTHER — evaluate each against the evidence. Memory rebuilds rather than replays; behavior is shaped by the situation, not just character; and feeling better never proves what caused it. Cut the braid one true link at a time, and tell it where each link fails."',
        },
        {
          kind: 'say',
          label: 'I can name the first lie — memory rebuilds, it doesn\'t replay — so the witness can be wrong. But blaming the person\'s character does seem reasonable, and if the therapy was followed by feeling better, that\'s good enough proof it worked.',
          // WRONG: cuts one link but accepts FAE + post-hoc/placebo. Re-teach the
          // two it left standing.
          coach: 'One shelf relights, then dims again as the Fog leans on the links you left. Lumen nods, kindly. "Good start — memory IS reconstructive, so a sure witness can still be wrong. But you let two lies stand. Reading guilt from ‘bad character’ while waving off the circumstances is the fundamental attribution error — weigh the situation first. And ‘felt better AFTER, so the treatment worked’ is the trap an EBQ is built to catch: placebo effects and natural recovery look identical to a real effect unless a comparison group rules them out. Apply both, then answer again."',
        },
        {
          kind: 'say',
          label: 'The way to beat it is to remember harder — recall every fact from every region perfectly and recite them back until the Fog runs out of questions.',
          // WRONG: the meta-misconception that the Exam is a memory contest.
          // Re-teach that it is an apply/evaluate task, not recall.
          coach: 'The Fog almost smiles, and the haze presses closer. Lumen shakes her head. "That is the very trick — a mind under pressure that reaches to RECITE is a mind I can out-wait. The Exam of the Self is not a memory contest; it asks you to APPLY a real concept to the situation and EVALUATE whether a claim’s evidence holds. You don’t need more facts than the Fog — you need to use the ones you have: reconstructive memory, the fundamental attribution error, and why ‘felt better’ isn’t proof without a comparison group. Cut the braid with those."',
        },
      ],
      win: 'The Fog tries to re-knot its braid and finds the mind reaching, instead, for the evidence — link after link cut clean. "…You wouldn’t take the tidy story." Its shape loses its face and thins to weather, then to nothing. Lumen lifts her lantern as the Gate swings wide and every region beyond it holds its light at once. "There. Not out-remembered — out-thought. This mind kept the one habit the Fog can never settle on: apply what is true, weigh what is claimed, and choose the evidence over the comfort. The Atlas is whole."',
      recordCodex: 'cx_exam_self',
      flag: 'exam_self_cleared',
      achievement: 'ach_exam_self',
      clarity: 14,
      confidenceCost: 14,
    },
  ],

  // ---- codex: the real idea this capstone teaches (fed to the shared Codex) ----
  // The capstone's single idea is the META-skill the whole world has been
  // building toward: apply a concept + evaluate the evidence, and judge each
  // claim on its own support rather than on how neatly it fits the others. It
  // names the real misconceptions it cut, and ties back to prior Codex ideas
  // by id (cx_tenpercent — trust evidence over the comfortable feeling).
  codex: [
    {
      id: 'cx_exam_self',
      group: 'The Exam of the Self',
      title: 'Apply the science, evaluate the evidence',
      idea: 'A chain of claims feeling consistent is not proof they are true: you dispel bundled misconceptions by APPLYING real concepts and EVALUATING evidence on each claim alone — memory is reconstructive (a confident witness can be wrong), blaming character while ignoring the situation is the fundamental attribution error, and "felt better after treatment" does not prove the treatment caused it because placebo and natural recovery require a comparison group to rule out (building on cx_tenpercent: trust the evidence over the comfortable feeling). If you or someone you know is struggling, support is available 24/7 — call or text 988.',
      source: 'Lumen, lamplighter of the Examination Gate',
    },
  ],

  // ---- achievements: the capstone milestone (fed to the shared Achievements) ---
  achievements: [
    {
      id: 'ach_exam_self',
      title: 'A mind, its own again',
      desc: 'You passed the Exam of the Self — cutting the Fog’s braided lies by applying the real science and weighing the evidence, and the inner world lit whole.',
    },
  ],
};

export default pack;
