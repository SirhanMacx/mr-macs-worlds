// index.js — the STORY-PACK registry for Trade Winds.
//
// The loader in ../game.js imports STORY_PACKS and registers each pack DEFENSIVELY
// (one broken pack can never crash the world — it is logged and skipped). To add a
// new content pack, a Workflow-2 author does exactly TWO one-line edits here:
//   1) import { pack as <name> } from './<file>.js';
//   2) add <name> to the STORY_PACKS array below.
// Nothing else in the engine changes. See CONTRACT.md for the pack shape.
//
// AUTO-GENERATED registry: every *.js pack in this folder is imported below.

import { pack as unit3BeliefSystems } from './unit3-belief-systems.js';
import { pack as u1Neolithic } from './u1-neolithic.js';
import { pack as u2RiverValleys } from './u2-river-valleys.js';
import { pack as u4Classical } from './u4-classical.js';
import { pack as u5Exchange } from './u5-exchange.js';
import { pack as u6Postclassical } from './u6-postclassical.js';
import { pack as u7RenaissanceReformation } from './u7-renaissance-reformation.js';
import { pack as u8Exploration } from './u8-exploration.js';
import { pack as u9EnduringIssues } from './u9-enduring-issues.js';

export const STORY_PACKS = [
  unit3BeliefSystems,
  u1Neolithic,
  u2RiverValleys,
  u4Classical,
  u5Exchange,
  u6Postclassical,
  u7RenaissanceReformation,
  u8Exploration,
  u9EnduringIssues,
  // ← add new packs here (one import above, one entry here)
];

export default STORY_PACKS;
