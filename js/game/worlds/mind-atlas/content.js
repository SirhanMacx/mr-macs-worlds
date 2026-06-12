// content.js — MIND ATLAS: the mind-delver action-puzzle game data (AP Psych).
// HONEST PEDAGOGY + 2024 CED SCOPE: every concept, puzzle answer, wraith
// refutation and denizen line below is real, in-scope psychology. Deliberately
// EXCLUDED as gameplay-correct content (per the 2024 CED): Kohlberg's stages,
// Maslow's hierarchy, named emotion theories (James-Lange / Cannon-Bard /
// Schachter-Singer two-factor), Freud's psychosexual stages, and Gardner's
// multiple-intelligences taxonomy. None appear as a correct answer.
//
// The five restore-regions map to the CED content units; the Observatory
// (research methods) is the Case Files investigation hub.

// In-world deadline: the "Final Exam of the Self."
export const EXAM = { label: 'May 12', long: 'the Final Exam of the Self, May 12' };

// ---------------- ABILITIES (metroidvania gating) ----------------
// Earned by RESTORING a region (puzzle solved + wraith defeated). Each opens
// the gate to the next region in the suggested order — real concepts, used as
// traversal powers.
export const ABILITIES = {
  saltatory: {
    id: 'saltatory', name: 'Saltatory Conduction', icon: 'S',
    desc: 'Myelinated axons leap the signal node to node. You move faster through the mind.',
    concept: 'Myelin sheath speeds neural transmission; the action potential "jumps" between nodes of Ranvier.',
  },
  chunking: {
    id: 'chunking', name: 'Chunking', icon: 'C',
    desc: 'Group items into meaningful units. You carry more memory orbs at once.',
    concept: 'Chunking groups information into units, effectively expanding working-memory capacity beyond 7±2 items.',
  },
  habituation: {
    id: 'habituation', name: 'Habituation', icon: 'H',
    desc: 'A repeated, harmless stimulus stops grabbing you. You walk through distractor noise unbothered.',
    concept: 'Habituation is a decrease in responding to a repeated stimulus — the simplest form of learning.',
  },
  efficacy: {
    id: 'efficacy', name: 'Self-Efficacy', icon: 'E',
    desc: 'Belief in your own capability. You cross spans of self-doubt that stop others.',
    concept: "Bandura's self-efficacy: a person's belief in their capacity to succeed shapes the effort they will attempt.",
  },
  restructuring: {
    id: 'restructuring', name: 'Cognitive Restructuring', icon: 'R',
    desc: 'Catch a distorted thought and rebuild it on the evidence. Veils of distortion clear before you.',
    concept: 'Cognitive restructuring (from cognitive-behavioral therapy) replaces distorted automatic thoughts with balanced, evidence-based ones.',
  },
};

// ---------------- REGIONS (game config keyed to the world-def region ids) ----
// order = the suggested restore path; each region (after the first) is gated by
// the prior region's ability.
export const REGIONS = [
  {
    id: 'ap-bio', name: 'Neural Caverns', unit: 'Unit 1 · Biological Bases of Behavior',
    color: 0x22d3ee, puzzle: 'neuron', grants: 'saltatory', gateReq: null,
    blurb: 'Bioluminescent axons branch through the dark. Signals have stalled at the synapses — route them with the right neurotransmitter keys.',
    denizen: 'glia',
  },
  {
    id: 'ap-cognition', name: 'Memory Archipelago', unit: 'Unit 2 · Cognition',
    color: 0x818cf8, puzzle: 'memory', grants: 'chunking', gateReq: 'saltatory',
    blurb: 'Islands of memory ring a tidal bay. Carry the memory orbs to the long-term vault — but working memory holds only about seven at a time.',
    denizen: 'archivist',
  },
  {
    id: 'ap-dev', name: 'Learning Grove', unit: 'Unit 3 · Development & Learning',
    color: 0x34d399, puzzle: 'conditioning', grants: 'habituation', gateReq: 'chunking',
    blurb: 'An orchard that grows as you watch. A mind-creature waits to be conditioned — pair the signals and read the curve.',
    denizen: 'gardener',
  },
  {
    id: 'ap-social', name: 'Social Plaza', unit: 'Unit 4 · Social Psychology & Personality',
    color: 0xf87171, puzzle: 'attribution', grants: 'efficacy', gateReq: 'habituation',
    blurb: 'A ring of standing stones where a crowd of denizens murmurs. Judge each behavior fairly — situation or disposition — against the pull of bias.',
    denizen: 'chorus',
  },
  {
    id: 'ap-health', name: 'Clinic Springs', unit: 'Unit 5 · Mental & Physical Health',
    color: 0x2dd4bf, puzzle: 'restructure', grants: 'restructuring', gateReq: 'efficacy',
    blurb: 'Warm terraced springs, a place of recovery. Catch the distorted thoughts rising in the steam and rebuild them on the evidence.',
    denizen: 'steward',
    sensitive: true,
    support: 'This region handles mental-health content with care. If you or someone you know is struggling, support is available 24/7: call or text 988 (the Suicide & Crisis Lifeline). Psychological disorders are real, common, and treatable — seeking help is a sign of strength.',
  },
];

export const ORDER = REGIONS.map(r => r.id);

// Observatory (research methods) — not a puzzle/wraith region; the Case Files hub.
export const CASE_REGION = 'ap-methods';

// ---------------- NEUROTRANSMITTERS (neuron-routing keys) ----------------
export const NEUROTRANSMITTERS = [
  { id: 'acetylcholine', name: 'Acetylcholine', role: 'muscle action, memory', icon: 'ACh', color: 0x9be7ff },
  { id: 'dopamine', name: 'Dopamine', role: 'reward, movement, motivation', icon: 'DA', color: 0xffd166 },
  { id: 'serotonin', name: 'Serotonin', role: 'mood, sleep, appetite', icon: '5-HT', color: 0xa8e6cf },
  { id: 'gaba', name: 'GABA', role: 'main inhibitory — calms', icon: 'GABA', color: 0x7aa2ff },
  { id: 'glutamate', name: 'Glutamate', role: 'main excitatory — fires', icon: 'Glu', color: 0xff9e6b },
  { id: 'norepinephrine', name: 'Norepinephrine', role: 'arousal, alertness', icon: 'NE', color: 0xff7eb6 },
  { id: 'endorphins', name: 'Endorphins', role: 'pain relief, reward', icon: 'END', color: 0xc4a8ff },
];

// neuron-routing puzzle: a chain of synapse gates. Each gate names what the
// downstream cell needs; the player selects the matching neurotransmitter key.
export const NEURON_PUZZLE = {
  intro: 'A stalled signal sits at the soma. Carry it down the axon, choosing the right transmitter for each synapse so the message arrives intact.',
  gates: [
    { clue: 'A skeletal muscle fiber waits at this junction. Fire the key that makes muscles contract.', answer: 'acetylcholine',
      why: 'Acetylcholine is released at the neuromuscular junction to trigger muscle contraction.' },
    { clue: 'This relay must EXCITE the next neuron — push it toward threshold with the brain\'s main "go" transmitter.', answer: 'glutamate',
      why: 'Glutamate is the brain\'s primary excitatory neurotransmitter, driving neurons toward an action potential.' },
    { clue: 'The circuit downstream is firing out of control. Quiet it with the brain\'s main "stop" transmitter.', answer: 'gaba',
      why: 'GABA is the brain\'s primary inhibitory neurotransmitter, reducing the likelihood that a neuron fires.' },
    { clue: 'A reward-and-movement pathway has gone dim. Light it with the transmitter tied to motivation and movement.', answer: 'dopamine',
      why: 'Dopamine is central to reward, motivation, and the control of movement.' },
  ],
};

// ---------------- MEMORY ORB CARRY (7±2 working memory) ----------------
export const MEMORY_PUZZLE = {
  intro: 'Working memory holds only about 7 items (give or take 2). Load orbs into your working-memory tray, rehearse, and deposit them in the long-term vault. Try to hold too many and the oldest slips away.',
  baseCapacity: 7,          // Miller's "magical number seven"
  chunkBonus: 4,            // with the Chunking ability the tray groups items
  target: 9,                // more than fits at once — you MUST deposit in batches
  orbs: ['7', 'H', '2', 'Q', '9', 'K', '4', 'M', '5', 'T', '3', 'R'],
};

// ---------------- CONDITIONING (classical) + REINFORCEMENT (operant) ----------
export const CONDITIONING = {
  intro: 'A mind-creature flinches at nothing yet. Pair the neutral CHIME with FEED until the chime alone stirs it (acquisition). Then ring the chime alone until the response fades (extinction).',
  // labels kept to real CED terms
  terms: { ns: 'Chime (neutral → conditioned stimulus)', us: 'Feed (unconditioned stimulus)', cr: 'Stir (conditioned response)' },
  acquireTo: 0.8,
  extinguishTo: 0.2,
  gainPerPair: 0.16,        // acquisition step
  dropPerAlone: 0.18,       // extinction step
};

export const REINFORCEMENT = {
  intro: 'Four reward machines, four schedules. Pull each lever a few times, watch the payout pattern, then name which schedule keeps a behavior going the longest once rewards stop.',
  schedules: [
    { id: 'fr', name: 'Fixed-Ratio', desc: 'Pays after every 4th pull — steady, with a short pause after each reward.' },
    { id: 'vr', name: 'Variable-Ratio', desc: 'Pays after an unpredictable number of pulls — high, steady rates and the hardest to extinguish.' },
    { id: 'fi', name: 'Fixed-Interval', desc: 'Pays for the first pull after a set time — responding speeds up as the time nears.' },
    { id: 'vi', name: 'Variable-Interval', desc: 'Pays for the first pull after an unpredictable time — slow, steady responding.' },
  ],
  answer: 'vr',
  why: 'Variable-ratio schedules produce the highest, steadiest response rates and the greatest resistance to extinction — which is exactly why gambling is so persistent.',
};

// ---------------- SORT PUZZLES (Social / Clinic) ----------------
export const ATTRIBUTION = {
  intro: 'Sort each behavior by its likely cause. The crowd will tempt you to blame character every time — that pull is the fundamental attribution error. Judge on the evidence.',
  bins: [
    { id: 'disp', name: 'Dispositional', sub: 'caused by the person\'s traits' },
    { id: 'situ', name: 'Situational', sub: 'caused by the circumstances' },
  ],
  cards: [
    { text: 'A driver swerves around you, then you see the "ORGAN TRANSPORT" sign on the car.', answer: 'situ', why: 'The circumstance (an emergency delivery) explains the behavior far better than "bad driver."' },
    { text: 'A classmate aces every exam after studying two hours nightly all semester.', answer: 'disp', why: 'A stable pattern of effort points to the person\'s own conscientiousness.' },
    { text: 'A new employee freezes during a fire drill on their first day.', answer: 'situ', why: 'A novel, high-stress situation — not a personality flaw — drives the freeze response.' },
    { text: 'A friend is short with you the day after their flight was cancelled and they slept three hours.', answer: 'situ', why: 'Sleep loss and travel stress are situational; assuming they\'re "rude" is the fundamental attribution error.' },
    { text: 'A volunteer shows up early to every shift for years, even in bad weather.', answer: 'disp', why: 'Consistent behavior across many situations reflects a dispositional trait.' },
    { text: 'A student bombs a test the week their family was evicted.', answer: 'situ', why: 'A severe life circumstance, not low ability, best explains the one-time drop.' },
  ],
};

export const RESTRUCTURE = {
  intro: 'Distorted automatic thoughts rise from the springs. For each, choose the balanced, evidence-based reframe — the work of cognitive restructuring. Be kind; be accurate.',
  items: [
    {
      thought: '"I failed one quiz, so I\'m going to fail the whole course."',
      distortion: 'Catastrophizing / overgeneralizing',
      choices: [
        { text: 'One quiz is a small slice of the grade; I can review what I missed and use spaced practice before the next one.', correct: true },
        { text: 'I\'m just not a school person and never will be.', correct: false },
        { text: 'The quiz was rigged, so it doesn\'t count.', correct: false },
      ],
      why: 'A balanced reframe checks the evidence and names a concrete next step, instead of generalizing one event into a verdict.',
    },
    {
      thought: '"My friend didn\'t text back, so they must be angry with me."',
      distortion: 'Mind-reading / jumping to conclusions',
      choices: [
        { text: 'There are many reasons people don\'t reply right away; I can ask them directly instead of assuming.', correct: true },
        { text: 'Everyone always abandons me eventually.', correct: false },
        { text: 'I should cut them off first before they hurt me.', correct: false },
      ],
      why: 'Restructuring replaces an assumed motive with the evidence and a workable action.',
    },
    {
      thought: '"I felt anxious giving the presentation, so it was a total disaster."',
      distortion: 'Emotional reasoning',
      choices: [
        { text: 'Feeling nervous is normal and doesn\'t equal failing; I delivered my main points and can ask for feedback.', correct: true },
        { text: 'If I feel bad, the outcome must be bad.', correct: false },
        { text: 'I should never speak in public again.', correct: false },
      ],
      why: 'Emotional reasoning treats a feeling as proof; the reframe separates the emotion from the evidence of performance.',
    },
  ],
};

// ---------------- MISCONCEPTION WRAITHS ----------------
// HP = your confidence's mirror; each wraith voices common, tempting MISTAKES
// (the kind that show up as exam distractors). Choose the correct refutation to
// damage it; a wrong choice costs your confidence. Every claim is a real
// misconception with an in-scope correction.
export const WRAITHS = {
  'ap-bio': {
    name: 'The Wire Wraith', tag: 'a misconception of the synapse',
    claims: [
      {
        claim: 'Neurons are soldered together like wires — electricity passes straight from one into the next with nothing in between.',
        refutations: [
          { text: 'Neurons are separated by a tiny synaptic gap; they signal by releasing neurotransmitters across it.', correct: true },
          { text: 'Neurons share one continuous membrane, so the current never stops.', correct: false },
          { text: 'The endocrine system carries the impulse from neuron to neuron.', correct: false },
        ],
        why: 'Within a neuron the signal is electrical (the action potential), but BETWEEN neurons it crosses the synapse chemically, via neurotransmitters.',
      },
      {
        claim: 'A stronger stimulus makes a single neuron fire a bigger action potential.',
        refutations: [
          { text: 'Action potentials are all-or-none; a stronger stimulus changes how OFTEN a neuron fires, not how big each spike is.', correct: true },
          { text: 'Yes — bigger stimulus, bigger single spike, every time.', correct: false },
          { text: 'Stronger stimuli are carried only by the endocrine system.', correct: false },
        ],
        why: 'The all-or-none principle: once threshold is reached the neuron fires at full strength; intensity is coded by firing rate and number of neurons.',
      },
    ],
  },
  'ap-cognition': {
    name: 'The Recorder Wraith', tag: 'a misconception of memory',
    claims: [
      {
        claim: 'Memory works like a video camera: it records events exactly and plays them back unchanged.',
        refutations: [
          { text: 'Memory is reconstructive — it can be reshaped by later, misleading information (the misinformation effect).', correct: true },
          { text: 'Once an event reaches long-term memory it can never be altered.', correct: false },
          { text: 'Forgetting happens only because memories slowly decay over time.', correct: false },
        ],
        why: "Research on the misinformation effect (e.g., Loftus) shows that exposure to misleading details after an event can distort what people \"remember.\"",
      },
      {
        claim: 'Working memory is basically unlimited — you can hold as many things in mind at once as you want.',
        refutations: [
          { text: 'Working memory is sharply limited — roughly 7 items (give or take 2); chunking helps you stretch that.', correct: true },
          { text: 'Working memory holds at least a hundred items at a time.', correct: false },
          { text: 'Working memory and long-term memory have the exact same capacity.', correct: false },
        ],
        why: "Miller's \"magical number seven\" describes the small capacity of working memory; chunking groups items so more can be held.",
      },
    ],
  },
  'ap-dev': {
    name: 'The Tangle Wraith', tag: 'a misconception of learning',
    claims: [
      {
        claim: 'Classical conditioning is when a learner\'s behavior earns a reward — like a rat pressing a lever for food.',
        refutations: [
          { text: 'That\'s operant conditioning. Classical conditioning is learning an association between two stimuli, not behavior-and-consequence.', correct: true },
          { text: 'Classical and operant conditioning are exactly the same process.', correct: false },
          { text: 'Classical conditioning only works if you use punishment.', correct: false },
        ],
        why: 'Classical conditioning pairs stimuli (a tone with food); operant conditioning links a voluntary behavior with its consequence (reinforcement or punishment).',
      },
      {
        claim: 'Negative reinforcement is just a fancy name for punishment.',
        refutations: [
          { text: 'No — negative reinforcement removes something unpleasant to INCREASE a behavior; punishment DECREASES a behavior.', correct: true },
          { text: 'Correct, they both make a behavior less likely.', correct: false },
          { text: 'Negative reinforcement only happens in classical conditioning.', correct: false },
        ],
        why: 'Reinforcement (positive or negative) strengthens behavior; punishment weakens it. "Negative" means a stimulus is removed, not that it is bad.',
      },
    ],
  },
  'ap-social': {
    name: 'The Blame Wraith', tag: 'a misconception of social judgment',
    claims: [
      {
        claim: 'When people mess up, it\'s almost always their character. The situation hardly ever matters.',
        refutations: [
          { text: 'Overweighting character and ignoring the situation IS the fundamental attribution error.', correct: true },
          { text: 'Right — and people always blame the situation, never the person.', correct: false },
          { text: 'Attributions don\'t actually affect how we treat people.', correct: false },
        ],
        why: 'The fundamental attribution error is the tendency, when judging others, to overestimate disposition and underestimate situational causes.',
      },
      {
        claim: 'In Milgram\'s obedience studies, the people who shocked the learner were just unusually cruel individuals.',
        refutations: [
          { text: 'The power was in the SITUATION — ordinary people obeyed an authority; it wasn\'t about cruel personalities.', correct: true },
          { text: 'Yes, only sadistic volunteers would ever obey like that.', correct: false },
          { text: 'The study showed obedience is impossible to produce in a lab.', correct: false },
        ],
        why: "Milgram's results highlight how situational pressure and authority can lead ordinary people to harmful obedience.",
      },
    ],
  },
  'ap-health': {
    name: 'The Stigma Wraith', tag: 'a misconception of mental health',
    claims: [
      {
        claim: 'People with psychological disorders just aren\'t trying hard enough — disorders aren\'t real conditions.',
        refutations: [
          { text: 'Disorders involve real distress or impairment with biological, cognitive, and social roots — and effective, evidence-based treatments exist.', correct: true },
          { text: 'Right, a disorder is simply a choice someone makes.', correct: false },
          { text: 'Therapy and medication never help anyone.', correct: false },
        ],
        why: 'Psychological disorders are defined by significant distress or impairment; the biopsychosocial model and evidence-based treatments (therapy, medication) address them. Stigma is itself a barrier to care.',
      },
      {
        claim: 'If a treatment makes someone feel better, it must be because the treatment itself works — there\'s no other explanation.',
        refutations: [
          { text: 'Improvement can also reflect the placebo effect or natural recovery, which is why controlled studies use comparison groups.', correct: true },
          { text: 'Feeling better always proves the specific treatment caused it.', correct: false },
          { text: 'Comparison groups have nothing to do with testing treatments.', correct: false },
        ],
        why: 'Placebo effects and natural improvement can mimic treatment effects; randomized controlled trials with comparison groups separate real effects from expectation.',
      },
    ],
  },
};

// optional final boss for the Trial gauntlet (cumulative)
export const TRIAL = {
  name: 'Trial of the Self',
  blurb: 'The whole mind, mixed and shuffled. Answer to prove the atlas is whole before the exam.',
  perRound: 12, needFrac: 0.7,
};

// ---------------- CASE FILES (AAQ / EBQ investigations) ----------------
// Each case reuses an item from data/world-content.json (appsych.frq.items):
// scatter 3 "evidence scrolls" near the Observatory, then assemble the claim.
export const CASE_FILES = [
  {
    id: 'case-aaq', frqIndex: 0, type: 'AAQ',
    name: 'The Sleep Study', tag: 'Article Analysis investigation',
    intro: 'A researcher\'s notes lie scattered near the Observatory. Gather the three evidence scrolls, then reconstruct the study and answer the field questions.',
    scrolls: [
      { label: 'Design scroll', note: 'Sixty students were randomly assigned to sleep 8 hours or stay awake after learning 40 word pairs.' },
      { label: 'Measure scroll', note: 'The next morning everyone\'s recall of the word pairs was tested.' },
      { label: 'Result scroll', note: 'Sleep group recalled 31 pairs; sleep-deprived recalled 22 (p < .01).' },
    ],
  },
  {
    id: 'case-ebq', frqIndex: 1, type: 'EBQ',
    name: 'The Spacing Question', tag: 'Evidence-Based investigation',
    intro: 'Three sources on how people study turned up in the archive. Gather them, then build an argument the evidence can defend.',
    scrolls: [
      { label: 'Lab scroll', note: 'Across 250+ experiments, spaced review beat massed cramming on delayed tests.' },
      { label: 'Survey scroll', note: 'Students who spaced study averaged 88 on exams; crammers averaged 79.' },
      { label: 'Classroom scroll', note: 'A spaced class scored 18% higher on a surprise quiz two weeks later.' },
    ],
  },
];

// ---------------- MIND DENIZENS (NPCs with dialogue) ----------------
// One guide per region: lore + a hint, period-true to the science. Palettes are
// procedural (zero assets).
export const DENIZENS = {
  glia: {
    id: 'glia', name: 'Astra', title: 'a glial guide of the Neural Caverns', region: 'ap-bio',
    offset: [7, 5], hatKind: 'hood', palette: { robe: 0x1e5a6e, trim: 0x123a47, skin: 0x9be7ff, hat: 0x123a47 },
    dialogue: {
      start: 'root',
      nodes: {
        root: {
          text: 'Welcome to the caverns, cartographer. Every glowing thread here is an axon. The signal inside a neuron is electrical — the action potential — but it cannot leap the gaps between cells on its own. At each synapse it must become CHEMICAL: a neurotransmitter, released across the cleft to the next cell.',
          choices: [
            { label: 'How do I choose the right transmitter?', next: 'hint' },
            { label: 'What makes a neuron fire at all?', next: 'fire' },
          ],
        },
        hint: { text: 'Read what the downstream cell NEEDS. A muscle needs acetylcholine to contract. To excite, send glutamate; to calm, send GABA. Reward and movement run on dopamine. Match the need to the key and the message arrives.', choices: [] },
        fire: { text: 'Threshold, friend. Enough excitation and the neuron fires all-or-none — full strength or not at all. A bigger stimulus does not make a bigger spike; it makes MORE spikes. Restore the routes and the caverns will light again.', choices: [] },
      },
    },
  },
  archivist: {
    id: 'archivist', name: 'Mnemo', title: 'keeper of the Memory Archipelago', region: 'ap-cognition',
    offset: [-7, 5], hatKind: 'scholar', palette: { robe: 0x3a3f8c, trim: 0x23275e, skin: 0xd9b07c, hat: 0x23275e },
    dialogue: {
      start: 'root',
      nodes: {
        root: {
          text: 'The orbs are memories waiting to be stored. But mind the tray, traveler — working memory holds only about seven things at once, give or take two. Reach for an eighth and the oldest slips into the tide.',
          choices: [
            { label: 'Seven is so few — how does anyone remember a phone number?', next: 'chunk' },
            { label: 'Why do some memories come back wrong?', next: 'errors' },
          ],
        },
        chunk: { text: 'Chunking. Group the items into meaningful units — 1-9-9-8 becomes "1998," one chunk, not four. Master that here and you will carry far more across the bay. Deposit in batches until the vault is full.', choices: [] },
        errors: { text: 'Because memory rebuilds rather than replays. Feed it a misleading detail afterward and it weaves the lie into the cloth — the misinformation effect. A recorder this is not.', choices: [] },
      },
    },
  },
  gardener: {
    id: 'gardener', name: 'Pavla', title: 'tender of the Learning Grove', region: 'ap-dev',
    offset: [7, -5], hatKind: 'brim', palette: { robe: 0x2f7d4f, trim: 0x1c4d30, skin: 0xc98a5b, hat: 0x1c4d30 },
    dialogue: {
      start: 'root',
      nodes: {
        root: {
          text: 'Meet your companion. It stirs at nothing yet. Ring the chime, then feed it — again and again. Soon the chime ALONE will rouse it. That is classical conditioning: a neutral signal, paired with a meaningful one, comes to trigger the response by itself.',
          choices: [
            { label: 'And if I ring the chime but stop feeding it?', next: 'ext' },
            { label: 'How is that different from training tricks for treats?', next: 'op' },
          ],
        },
        ext: { text: 'Then the link fades — extinction. The conditioned response weakens until the chime means nothing again. Rest a while and a flicker may return on its own: spontaneous recovery. Watch the curve; it tells the whole story.', choices: [] },
        op: { text: 'Sharp question. Treats-for-tricks is OPERANT conditioning — a behavior shaped by its consequences. Our chime-and-feed is CLASSICAL — an association between two stimuli. The machines past the orchard will show you reinforcement schedules.', choices: [] },
      },
    },
  },
  chorus: {
    id: 'chorus', name: 'Sol', title: 'a voice of the Social Plaza', region: 'ap-social',
    offset: [-7, -5], hatKind: 'none', palette: { robe: 0x8a3030, trim: 0x551c1c, skin: 0xd9a066 },
    dialogue: {
      start: 'root',
      nodes: {
        root: {
          text: 'Hear the crowd? It judges fast and judges the person: "they\'re lazy, they\'re rude, they\'re weak." That reflex — blaming character and forgetting the situation — is the fundamental attribution error. Your task is to judge fairly.',
          choices: [
            { label: 'How do I resist the crowd\'s pull?', next: 'hint' },
            { label: 'Does the situation really matter that much?', next: 'sit' },
          ],
        },
        hint: { text: 'Ask one question of every card: would a decent person ALSO act this way in this situation? If yes, the cause is situational. Save "dispositional" for patterns that hold across many situations.', choices: [] },
        sit: { text: 'More than we admit. Calm volunteers delivered shocks because an authority told them to — the situation, not cruel hearts. Power lives in circumstances. Read them before you read the person.', choices: [] },
      },
    },
  },
  steward: {
    id: 'steward', name: 'Wren', title: 'steward of Clinic Springs', region: 'ap-health',
    offset: [7, 5], hatKind: 'hood', palette: { robe: 0x1f7a6e, trim: 0x124a42, skin: 0xc98a5b, hat: 0x124a42 },
    dialogue: {
      start: 'root',
      nodes: {
        root: {
          text: 'Easy now — this is a place of recovery, not judgment. The steam carries distorted thoughts: "one slip means total failure," "they must hate me." Cognitive restructuring catches each one and rebuilds it on the evidence. That is real therapeutic work.',
          choices: [
            { label: 'How do I rebuild a distorted thought?', next: 'hint' },
            { label: 'Are disorders really treatable?', next: 'treat' },
          ],
        },
        hint: { text: 'Name the distortion, then test it: what is the evidence? what would I tell a friend? what is one concrete next step? The balanced thought is kinder AND more accurate — both at once.', choices: [] },
        treat: { text: 'Yes. Disorders are real conditions with biological, cognitive, and social roots — and evidence-based treatments help. If the steam ever feels heavy: 988 reaches the Suicide & Crisis Lifeline, any hour. Asking for help is strength, not weakness.', choices: [] },
      },
    },
  },
};
