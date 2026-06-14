// index.js — the STORY-PACK registry for The Mind Atlas.
//
// This is the ONE file a content author edits to plug a new pack into the world.
// Adding a pack is a TWO-LINE edit (see packs/CONTRACT.md §"Shipping a pack"):
//   1. import its module here, and
//   2. add it to the STORY_PACKS array below.
// The world's loader (game.js) imports STORY_PACKS and registers each pack
// DEFENSIVELY — one malformed pack can never crash the world; it is logged and
// skipped, and every other pack still loads.
//
// Order matters only cosmetically (it is the order packs register and the order
// their NPCs/triggers are installed). Ids must be unique across packs; the loader
// de-dupes by id and warns on a collision.
//
// AUTO-GENERATED registry: every *.js pack in this folder is imported below.

import { pack as u1TenPercent } from './u1-ten-percent.js';
import { pack as examOfTheSelf } from './exam-of-the-self.js';
import { pack as u1BioMore } from './u1-bio-more.js';
import { pack as u2Cognition } from './u2-cognition.js';
import { pack as u3DevLearning } from './u3-dev-learning.js';
import { pack as u4SocialPersonality } from './u4-social-personality.js';
import { pack as u5Health } from './u5-health.js';

export const STORY_PACKS = [
  u1TenPercent,
  examOfTheSelf,
  u1BioMore,
  u2Cognition,
  u3DevLearning,
  u4SocialPersonality,
  u5Health,
  // ← add new packs here (one import above, one entry here)
];

export default STORY_PACKS;
