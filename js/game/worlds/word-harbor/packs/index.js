// index.js — the WORD HARBOR story-pack registry.
//
// Every curriculum content pack is a small ES module that exports `pack`
// (see CONTRACT.md for the exact shape, and geography-isle.sample.js for the
// gold-standard example). The world's game controller imports STORY_PACKS at
// boot and registers each one DEFENSIVELY — one broken pack can never crash the
// world; it is logged and skipped.
//
// TO ADD A PACK (Workflow-2 authors): this is a ONE-LINE edit.
//   1. Drop your pack file in this folder, e.g. ./river-lands.js
//   2. Add ONE import line, and ONE entry to the STORY_PACKS array below.
// That is the whole integration. The loader does the rest.
//
//   import { pack as riverLands } from './river-lands.js';
//   ...
//   export const STORY_PACKS = [ geographyIsleSample, riverLands ];

import { pack as geographyIsleSample } from './geography-isle.sample.js';

export const STORY_PACKS = [
  geographyIsleSample,
  // ← add new packs here (one import above, one entry here)
];

export default STORY_PACKS;
