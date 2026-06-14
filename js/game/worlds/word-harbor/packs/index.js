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
// AUTO-GENERATED registry: every *.js pack in this folder is imported below.

import { pack as geographyIsleSample } from './geography-isle.sample.js';
import { pack as beliefGrove } from './belief-grove.js';
import { pack as crossingIsle } from './crossing-isle.js';
import { pack as farShore } from './far-shore.js';
import { pack as riverLands } from './river-lands.js';
import { pack as timeTravelFestival } from './time-travel-festival.js';
import { pack as tradeDocks } from './trade-docks.js';

export const STORY_PACKS = [
  geographyIsleSample,
  beliefGrove,
  crossingIsle,
  farShore,
  riverLands,
  timeTravelFestival,
  tradeDocks,
  // ← add new packs here (one import above, one entry here)
];

export default STORY_PACKS;
