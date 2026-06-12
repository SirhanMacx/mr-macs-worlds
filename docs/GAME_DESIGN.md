# Mr. Mac's Worlds v3 — "Real Game" Design Document

**Mandate (Jon, verbatim intent):** a REAL video game, not simple Q&A. Game-developer's perspective. Best possible ed-tech open-world game. ONE WORLD PER PREP (three: Global 9R, AP Psych, Global 9 ENL). Fully immersive and fun. Constraint: school Chromebooks (60fps budget), touch + keyboard, static GitHub Pages, no logins, no spending.

## Design pillars
1. **Knowledge is the mechanic, not the interruption.** No modal quiz that pauses "the game." Knowing things makes you richer/stronger/faster IN the game verbs. Wrong answers cost in-game resources, not red X's.
2. **A real core loop with stakes**: goal → risk → reward → upgrade → bigger goal. Always a "what do I do next" the player chose.
3. **Juice everywhere**: particles, tweens, screen-shake (subtle), SFX (WebAudio, synthesized — no assets to license), day/night, animated characters. Feel > fidelity.
4. **Session-shaped for class**: meaningful progress in 8 minutes; auto-save every action (localStorage); resume instantly.
5. **Honest pedagogy**: every fact/claim in dialogue, goods, prices, NPC names is historically/psychologically REAL (reuse the verified banks + curricula as the content DB). 2024 CED scope holds for AP. De-identified.

## Shared engine upgrades (Wave 1 — applies to all worlds)
- **Graphics**: low-poly stylized but COHESIVE — warm hemisphere+sun, color-graded fog per biome, water with animated normals + shore foam ring, instanced vegetation w/ wind sway shader, distance-batched props, gradient-banded sky w/ sun disc + clouds (billboards), day/night cycle (slow), emissive windows at night, soft blob shadows (cheap) + single directional shadow on desktop only.
- **Characters**: procedural low-poly humanoids (capsule+head+limbs) with transform-based walk/idle/talk animation (no rigs needed), variety via palette+hat/prop slots. Player avatar visible (3rd person), NPCs wander on paths, face player on interact.
- **Game systems** (one shared module set): inventory + currency; XP/levels w/ perk choices; quest log w/ chains (talk→do→return); dialogue system (branching, choices w/ consequences); vendor/trade UI; map w/ fog-of-war unlock; toasts/feedback; particles (coin burst, sparkle, dust); WebAudio SFX synth (footsteps, coins, UI, ambient bird/wind/market loops); save/load slots.
- **Perf budget**: ≤120 draw calls, instancing everywhere, pixelRatio clamp, LOD by distance-fade, zero external assets (all procedural/inline), 60fps Chromebook target.

## World 1 — TRADE WINDS (Global 9R): *a trading-empire game*
**Fantasy**: you are a young merchant in 3000 BCE with one donkey. Build a trade empire across 4,500 years of history.
**Core loop**: buy goods cheap → travel a route (real geography: river delta → Mediterranean → Silk Road steppe → Sahara → Indian Ocean → Renaissance ports) → event en route (bandits/monsoon/toll — answered by APPLYING knowledge: "The monsoon blows NE in winter — sail to Calicut now or wait?" right call = safe passage) → sell high in the right market (knowing that silk is precious in Rome but cheap in Chang'an IS the game knowledge) → upgrade caravan/ship → unlock the next ERA (River Valleys → Classical → Post-Classical → Exploration), each opening new map regions, goods, and NPCs.
**Knowledge verbs**: price intuition (real trade goods/routes), NPC quests from real figures (Hammurabi wants his code posted — deliver tablets and answer his law riddle; Mansa Musa's hajj needs a gold logistics plan; Zheng He recruits navigators), navigation decisions (geography), barter dialogues where the better historical claim wins the deal. Bank MCQs become **"Guild Exams"** — optional, diegetic (rank up: Peddler→Merchant→Magnate), reusing the 275-q bank as exam content, taken at guild halls, never forced.
**Win state**: complete all era sagas + reach Magnate rank. Endless mode after.

## World 2 — MIND ATLAS (AP Psych): *a mind-delver action-puzzle adventure*
**Fantasy**: you are a Mind Cartographer shrunk into a vast inner world, restoring a fragmented mind before the "Final Exam of the Self" (May 12, in-world).
**Core loop**: explore a unit-region (Neural Caverns / Memory Archipelago / Learning Grove / Social Plaza / Clinic Springs) → solve **mechanic-puzzles built from the actual concepts**: route signals through neuron bridges (axon→synapse gates need the right neurotransmitter key); encode/store/retrieve — literally carry "memory orbs" through working-memory slots (limit 7±2!) to long-term vaults; condition a creature companion (pair bell+food beats, watch acquisition/extinction curves live); schedule-of-reinforcement slot machines teach variable-ratio viscerally → defeat **Misconception Wraiths** (mini "boss" encounters: a wraith states a tempting-wrong claim; you beat it by choosing the correct refutation — distractor-busting as combat, HP = confidence) → restore region, gain a psych-themed ABILITY (e.g., "Chunking": carry more; "Habituation": ignore distractor noise zones) that opens new areas (metroidvania gating).
**AAQ/EBQ** = **Case Files**: investigate an in-world mystery (find the 3 evidence scrolls, build the claim in a drag-together UI) — the existing FRQ rubric logic scores it diegetically.
**Win state**: all five regions restored + pass the in-world mock (the 75-Q bank fuels an optional "Trial of the Self" gauntlet). 2024 CED scope enforced.

## World 3 — WORD HARBOR (Global 9 ENL): *a gentle builder-collector adventure* (NEW)
**Fantasy**: you arrive by boat at a new land (mirrors the newcomer experience with warmth). Build your harbor town and learn the world's story.
**Core loop**: explore islands themed to HIS units (Geography Isle is the tutorial!) → **collect word-gems** (each = a real glossary term; tap to hear EN/中文/ES — TTS + the 244-term glossary ARE the loot system) → **spend words to build**: sentence-bridges (arrange word-gems into a frame sentence to span a gap — sentence frames as physical bridges), town buildings (each building = a vocab category; building it plays its terms) → story quests retell unit content in simple English with picture-first dialogue → MODS-style challenges as friendly festival games (no fail states; retry freely).
**Design**: lowest text density, biggest icons, every string TTS-able, 中文/Español tooltips throughout, slower movement, no timers, no death. Same engine, kinder tuning.
**Win state**: town fully built + the Time Travel Festival (mirrors his capstone).

## Build waves
W1 engine+systems (+Trade Winds gets them first as proof) → W2 Trade Winds full game → W3 Mind Atlas full game → W4 Word Harbor (new) → W5 hub rework (3 worlds, game-style menu), cross-world polish, perf pass, full verify, ship.
Each wave: headless-browser verified (0 console errors, playable loop demonstrated, screenshots), pushed only when green. Keep existing URLs working; keep banks/labs available inside the games (guild exams / trials / festivals).
