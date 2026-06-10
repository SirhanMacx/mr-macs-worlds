# assets/

Mr. Mac's Worlds is intentionally **asset-light** so it loads fast on low-end
Chromebooks:

- The favicon is an inline SVG data-URI in `index.html` / `world.html` (no
  file request).
- All in-world text labels (station names, prompts) are drawn at runtime onto
  `<canvas>` textures in `js/engine/geo-kit.js` — no font files or image
  atlases to download.
- Terrain, water, sky, flora, and every landmark building are **procedurally
  generated** from seeded noise and low-poly three.js primitives — there are
  **no model, texture, or audio files** (chimes are synthesized WebAudio).

Drop optional assets here later only if a future world truly needs them. Keep
them small and lazy-loaded to protect Chromebook performance.
