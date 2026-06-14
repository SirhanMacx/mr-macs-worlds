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

import { pack as u1TenPercent } from './u1-ten-percent.js';

export const STORY_PACKS = [
  u1TenPercent,
  // Workflow-2 authors: add your imported pack here, one per line. Example:
  //   import { pack as u2Recorder } from './u2-memory-recorder.js';
  //   ...then add `u2Recorder,` to this array.
];

export default STORY_PACKS;
