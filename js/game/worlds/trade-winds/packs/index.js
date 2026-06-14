// index.js — the STORY-PACK registry for Trade Winds.
//
// The loader in ../game.js imports STORY_PACKS and registers each pack DEFENSIVELY
// (one broken pack can never crash the world — it is logged and skipped). To add a
// new content pack, a Workflow-2 author does exactly TWO one-line edits here:
//   1) import { pack as <name> } from './<file>.js';
//   2) add <name> to the STORY_PACKS array below.
// Nothing else in the engine changes. See CONTRACT.md for the pack shape.

import { pack as unit3BeliefSystems } from './unit3-belief-systems.js';

export const STORY_PACKS = [
  unit3BeliefSystems,
  // ↑ add new packs here, one line each (and one import line above).
];

export default STORY_PACKS;
