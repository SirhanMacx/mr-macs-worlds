# assets/

Mr. Mac's Worlds is intentionally **asset-light** so it loads fast on low-end
Chromebooks:

- The favicon is an inline SVG data-URI in `index.html` (no file request).
- All in-world text labels (portal names, content-node titles, unit captions)
  are drawn at runtime onto `<canvas>` textures in `js/worlds/world-utils.js`
  — no font files or image atlases to download.
- World geometry is procedurally generated low-poly three.js primitives
  (icospheres, boxes, cones, tori), so there are **no model files**.

Drop optional textures, audio, or model files here later if you add richer
worlds. Keep them small and lazy-loaded to protect Chromebook performance.
