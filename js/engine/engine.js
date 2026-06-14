// engine.js — boots a world: renderer, sky/fog, chunked terrain, water,
// instanced flora, stations, player, HUD; then runs the frame loop.
//
// GRAPHICS OVERHAUL (integrator): everything expensive is gated behind a device
// QUALITY TIER (js/engine/quality.js). The `low` tier ≈ today's shipped renderer
// (pixelRatio 1.0, NO EffectComposer — direct render(), NO shadows, today's
// water/sky/terrain), so a weak school Chromebook never regresses below the
// known-60fps path. medium/high layer on a composer (bloom/AA/SSAO/grade),
// shadows, water glitter/fresnel/reflection, veg wind, etc.
//
// Performance posture (Chromebook-first):
//   • low: direct render(), pixelRatio hard-capped 1.0, no shadow/composer targets.
//   • medium: composer = bloom-lite(÷4)+FXAA+vignette, optional 1024 shadows.
//   • high: composer = bloom(÷2)+SMAA+SSAO+grade, 2048 PCFSoft player-following
//           shadows, water planar reflection, god-rays, dust motes.
//   • a DEMOTE-ONLY fps watchdog (quality.tick) steps a misclassified-fast
//     device down one tier (rebuilds the composer/shadows) — never up.
//   • exp2 fog + ~760 far-plane do the distance culling on every tier.
//
// COLOR/TONE-MAP CONTRACT (see postfx.js header): ColorManagement on,
// outputColorSpace = sRGB, ACES kept on the renderer. OutputPass (when a
// composer exists) reads renderer.toneMapping and applies ACES + sRGB ONCE at
// the end of the chain, so we do NOT switch to NoToneMapping — doing so would
// disable ACES entirely in this three.js build. On low (no composer) the
// renderer's own ACES tone-map runs as today.
import * as THREE from 'three';
import { buildTerrain } from './terrain.js';
import { buildSky } from './sky.js';
import { buildWater } from './water.js';
import { buildScatter } from './scatter.js';
import { buildStations } from './stations.js';
import { buildHUD } from './hud.js';
import { Player } from './player.js';
import { createQuality } from './quality.js';
import { buildPostFX, buildMotes } from './postfx.js';
import * as Panels from '../learn/panels.js';
import * as Progress from '../learn/progress.js';
import * as Glossary from '../learn/glossary.js';
import * as Audio from './audio.js';

export async function createEngine(def, content, { onProgress = () => {} } = {}) {
  const isMobile = matchMedia('(pointer: coarse)').matches || 'ontouchstart' in window;
  const reducedMotion = Progress.getSetting('rm', null) ?? matchMedia('(prefers-reduced-motion: reduce)').matches;

  const canvas = document.getElementById('scene');
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: !isMobile,
    powerPreference: 'high-performance',
  });

  // ---- color management (all tiers, pinned first) ----
  THREE.ColorManagement.enabled = true;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;     // OutputPass also reads this on medium/high
  // Per-biome exposure (D1, free, every tier): each world authors def.light.exposure
  // so the warm ACES tone is tuned to its mood (Trade Winds runs a touch hotter for
  // a sun-baked Mediterranean key). Falls back to the prior 1.06 if unauthored.
  renderer.toneMappingExposure = (def.light && typeof def.light.exposure === 'number') ? def.light.exposure : 1.06;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  // ---- per-frame draw-call accounting (PERF HOOK) -------------------------
  // The composer's OutputPass (and any extra full-screen passes) call
  // renderer.render() internally, which by default RESETS renderer.info each
  // call — so renderer.info.render.calls would only report the LAST render
  // (the OutputPass quad) instead of the whole frame (scene + composer +
  // reflection + shadow). We turn autoReset OFF and reset ONCE at the very top
  // of the animate loop, so window.MMW.info().calls is the TRUE per-frame total
  // across every pass. (Costs nothing; just changes when the counter zeroes.)
  renderer.info.autoReset = false;

  renderer.setSize(window.innerWidth, window.innerHeight);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(isMobile ? 68 : 62, window.innerWidth / window.innerHeight, 0.3, 760);

  // ---- DEVICE QUALITY TIER (the linchpin) --------------------------------
  // Created BEFORE the scene is built so every builder receives the resolved
  // tier flags. onChange fires on a watchdog demotion OR a manual GFX cycle /
  // forceTier and only rebuilds the *runtime-swappable* parts: the composer,
  // the shadow configuration and the pixel ratio. (Tier flags that gate scene
  // geometry — reflection RT, terrain density, veg species — are baked at build
  // time; a demotion still drops the costly composer/shadow/pixelRatio, which is
  // exactly the GPU-time relief a struggling device needs.)
  let pf = null;                 // post-processing chain (null on low)
  let rebuilding = false;
  const qual = createQuality(renderer, {
    onChange() { if (!rebuilding) applyTierRuntime(); },
  });

  // pixelRatio per the (current) tier — hard-capped 1.0 on low inside quality.js.
  function applyPixelRatio() {
    const pr = Math.min(qual.pixelRatio || 1, window.devicePixelRatio || 1);
    renderer.setPixelRatio(pr);
  }
  applyPixelRatio();

  onProgress(0.04, 'Seeding the world…');
  const field = def.buildField();

  const sky = buildSky(scene, camera, def, { reducedMotion, clouds: isMobile ? 9 : 14, qual });
  scene.background = null; // dome handles it

  // ---- terrain, one chunk per frame behind the loading bar ----
  // segs:null lets the tier table pick density (low/med/high = 38/54/64). On
  // mobile we still cap the explicit segment count so a phone never over-densifies.
  const terrain = buildTerrain(scene, field, {
    size: def.size,
    chunks: 5,
    segs: isMobile ? 38 : null,
    qual,
    grade: def.light && def.light.grade,   // free cinematic grade + night (all tiers)
  });
  let done = 0;
  for (const job of terrain.jobs) {
    terrain.buildChunk(job);
    done++;
    onProgress(0.05 + 0.45 * (done / terrain.jobs.length), 'Shaping the land…');
    await nextFrame();
  }

  onProgress(0.55, 'Filling the sea…');
  const water = buildWater(scene, field, def, { reducedMotion, qual, sky });
  await nextFrame();

  onProgress(0.6, 'Raising the landmarks…');
  const stations = buildStations(scene, field, def, { qual });
  await nextFrame();

  onProgress(0.68, 'Planting the biomes…');
  const keepout = [
    ...def.regions.map(r => ({ x: r.center[0], z: r.center[1], r: 16 })),
    ...def.skills.map(s => ({ x: s.pos[0], z: s.pos[1], r: 15 })),
    { x: def.spawn[0], z: def.spawn[1], r: 10 },
  ];
  const scatter = buildScatter(scene, field, def, { isMobile, keepout, qual, grade: def.light && def.light.grade });
  await nextFrame();

  onProgress(0.86, 'Waking the explorer…');
  const player = new Player(camera, canvas, field, def, { isMobile, reducedMotion, qual });
  scene.add(player.group);

  // ---- high-tier extras: dust motes (one additive draw call, gated) ----
  let motes = null;
  if (qual.motes) {
    motes = buildMotes({ count: 200, area: def.size * 0.5, height: 22, center: [def.spawn[0], def.sea + 6, def.spawn[1]] });
    motes.points.layers.disable(water.reflectionLayer); // never reflect motes
    scene.add(motes.points);
  }

  // ---- planar-reflection layer: the sky dome opts in (high only) ----------
  // The water's reflection pass renders ONLY objects on its reflectionLayer.
  // The sky dome makes the cheapest, highest-value reflection; structures could
  // be added by the world layer but the dome alone reads convincingly.
  if (water.needsReflection) {
    scene.traverse(o => {
      // the sky dome is a BackSide sphere with renderOrder -2; flag it + the sun.
      if (o.isMesh && o.material && o.material.side === THREE.BackSide && o.renderOrder === -2) {
        o.layers.enable(water.reflectionLayer);
      }
    });
  }

  // ---- post-processing composer (null on low — hard branch in buildPostFX) --
  buildComposer();
  function buildComposer() {
    if (pf) { try { pf.dispose(); } catch (e) {} pf = null; }
    pf = buildPostFX(renderer, scene, camera, qual); // null when !qual.composer
  }

  // ---- shadows (configured only when qual.shadows; high tier) -------------
  function configureShadows() {
    const on = !!qual.shadows && qual.tier === 'high';
    renderer.shadowMap.enabled = on;
    sky.sun.castShadow = on;
    if (on) {
      const s = sky.sun.shadow;
      const sz = qual.shadowSize || 2048;
      s.mapSize.set(sz, sz);
      s.camera.left = -90; s.camera.right = 90; s.camera.top = 90; s.camera.bottom = -90;
      s.camera.near = 0.5; s.camera.far = 420; s.bias = -0.0006;
      s.camera.updateProjectionMatrix();
      if (s.map) { s.map.dispose(); s.map = null; }
    }
    terrain.setShadows(on);
    scatter.setShadows(on);
    player.setShadows(on);
    // recompile materials so shadow shader chunks toggle in/out
    scene.traverse(o => { if (o.isMesh && o.material) { o.material.needsUpdate = true; } });
  }
  configureShadows();

  // Runtime re-apply after a tier change (watchdog demotion / GFX cycle /
  // forceTier). Rebuilds the swappable GPU-time costs without rebuilding the
  // whole scene. Re-entrancy guarded so onChange firing inside here is ignored.
  function applyTierRuntime() {
    rebuilding = true;
    try {
      applyPixelRatio();
      buildComposer();
      configureShadows();
      if (pf) renderer.toneMapping = THREE.ACESFilmicToneMapping; // OutputPass applies ACES
    } finally {
      rebuilding = false;
    }
  }

  // ---- audio + panels wiring ----
  Audio.setMuted(Progress.getSetting('muted', true));
  let paused = false;
  Panels.setHandlers({
    onOpen() { paused = true; player.enabled = false; player.releaseLock(); },
    onClose() { paused = false; player.enabled = true; stations.refreshVisuals(); },
    onStationCleared() { stations.refreshVisuals(); },
    chime: Audio.chime,
  });

  // ---- trilingual glossary (ENL support — worlds that declare one) ----
  if (def.glossary) {
    Glossary.init(def.glossary, {
      onOpen() { paused = true; player.enabled = false; player.releaseLock(); },
      onClose() { if (!Panels.isOpen()) { paused = false; player.enabled = true; } },
    });
  }

  // ---- interactions ----
  const nodesById = {};
  (content[def.key].nodes || []).forEach(n => { nodesById[n.id] = n; });

  function interact(st) {
    if (!st) return;
    if (st.onInteract) { st.onInteract(st); return; }
    const c = content[def.key];
    switch (st.type) {
      case 'unit': {
        const node = nodesById[st.region.nodeId];
        if (node) Panels.openUnitStation(def.key, st.region, node);
        break;
      }
      case 'mcq': Panels.openMCQ(def.key, c.mcq, st.id); break;
      case 'frq': Panels.openFRQ(def.key, c.frq, st.id); break;
      case 'crq': Panels.openCRQ(def.key, c.crq, st.id); break;
      case 'ei': Panels.openEI(def.key, c.ei, st.id); break;
      case 'hub': window.location.href = './'; break;
    }
  }

  // ---- HUD ----
  const hud = buildHUD({
    def, stations, isMobile,
    onInteract: interact,
    onHelp: () => Panels.openHelp(def),
    onGlossary: def.glossary ? () => (Glossary.isOpen() ? Glossary.close() : Glossary.open()) : null,
    onSound: (on) => { Progress.setSetting('muted', !on); Audio.setMuted(!on); if (on) Audio.chime('good'); },
    onQuality: (on) => setQuality(on),
    // GFX cycle button: low → med → high → low (touch caps at med). quality.js
    // owns the cycle + persistence; onChange rebuilds the composer/shadows. We
    // return the new effective tier name so the button label stays live.
    onGfx: () => { const name = qual.cycleCeiling(); return name; },
    gfxTier: qual.name,
  });
  hud.paintMinimap(field);

  // ---- legacy "HQ" toggle (shadows on the current high path) --------------
  // Kept for back-compat: the HQ button now just nudges the ceiling toward high
  // (so shadows can come on) or back to auto. On a low/medium device the tier
  // detection still governs — HQ can't force a Chromebook past its safe tier
  // because the GFX cycle and watchdog remain authoritative.
  function setQuality(hq) {
    Progress.setSetting('quality', hq ? 'hq' : 'auto');
    if (hq) {
      qual.setCeiling('high');
    } else {
      qual.setCeiling(null);
    }
  }
  if (Progress.getSetting('quality', 'auto') === 'hq') setQuality(true);

  // ---- bounds toast ----
  let lastBound = 0;
  player.onBound = () => {
    const now = performance.now();
    if (now - lastBound > 9000) { lastBound = now; Panels.toast(def.boundsMsg); }
  };

  // Escape closes panels (and pointer lock exits natively first)
  window.addEventListener('keydown', (e) => {
    if (e.code === 'Escape' && Panels.isOpen()) Panels.closePanel();
  });

  // ---- resize ----
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    if (pf) pf.setSize(window.innerWidth, window.innerHeight);
  });

  onProgress(1, 'Ready.');

  // ---- loop ----
  const clock = new THREE.Clock();
  let frame = 0;
  let fpsAcc = 0, fpsN = 0, fpsAvg = 60;
  const frameHooks = [];   // game-layer per-frame callbacks (dt, t, frame)

  // Deterministic-clock hooks (verification screenshots): pauseClock(true)
  // freezes the world time so a forced tier renders a fixed frame; setClock(t)
  // pins an absolute world time. Normal play leaves both off.
  let clockPaused = false;
  let clockOverride = null;   // absolute seconds, or null
  let frozenT = 0;            // last world time captured when the clock pauses

  function applyShadowFollow() {
    // player-following ortho: re-center the shadow frustum on the player every
    // ~10 frames at high so the 2048 map covers where the player actually is.
    if (!renderer.shadowMap.enabled) return;
    if (frame % 10 !== 0) return;
    const s = sky.sun;
    // sky.js places sun.position relative to the camera each frame; aim its
    // target at the player so the cascade tracks the avatar.
    s.target.position.set(player.pos.x, player.pos.y, player.pos.z);
    s.target.updateMatrixWorld();
  }

  function animate() {
    requestAnimationFrame(animate);
    // Zero the renderer's draw-call/triangle counters ONCE per frame (autoReset
    // is off — set above). Every render() this frame — the reflection pass, the
    // shadow pass, the scene RenderPass and every composer full-screen pass —
    // then accumulates into renderer.info, so window.MMW.info().calls reflects
    // the WHOLE frame, not just the final OutputPass.
    renderer.info.reset();
    const dtRaw = clock.getDelta();
    const dt = Math.min(dtRaw, 0.05);
    frame++;

    // world time: override → pinned absolute; paused → frozen at capture; else
    // the running clock. (Deterministic for verification screenshots.)
    let worldT;
    if (clockOverride != null) worldT = clockOverride;
    else if (clockPaused) worldT = frozenT;
    else { worldT = clock.elapsedTime; frozenT = worldT; }

    // fps tracking + demote-only watchdog (replaces the old frame-480 block)
    fpsAcc += dt; fpsN++;
    if (fpsAcc >= 1) { fpsAvg = fpsN / fpsAcc; fpsAcc = 0; fpsN = 0; }
    qual.tick(dtRaw * 1000);

    if (!paused && !clockPaused) player.update(dt);
    for (let i = 0; i < frameHooks.length; i++) frameHooks[i](dt, worldT, frame);

    // drive every animated material's time uniform + lighting/night each frame
    sky.update(worldT);
    water.update(worldT, camera);
    terrain.update(worldT);
    if (!reducedMotion) scatter.update(worldT);
    if (motes) motes.update(worldT);

    // feed the sky's night factor to the structures' window/lantern glow AND to
    // the free terrain/scatter grade (so the whole world deepens + cools at dusk
    // on every tier — the noon≠dusk win, no composer required).
    const nf = sky.getNightFactor();
    stations.setNight(nf);
    terrain.setNight(nf);
    scatter.setNight(nf);

    const active = stations.update(worldT, player.pos, camera.position);
    hud.setPrompt(paused ? null : active);
    hud.update(worldT, player, stations.beaconTarget, frame);

    // player-following shadow frustum (high only; no-op otherwise)
    applyShadowFollow();

    // ---- present: composer when present, else direct render ----
    if (pf) pf.render(dt);
    else renderer.render(scene, camera);
  }
  animate();

  // debug/verification hook (harmless in prod) — this object becomes window.MMW
  const api = {
    def, field, player, stations, renderer, scene, camera, content, hud, isMobile, reducedMotion,
    qual,
    interact,
    onFrame(fn) { frameHooks.push(fn); return () => { const i = frameHooks.indexOf(fn); if (i >= 0) frameHooks.splice(i, 1); }; },
    setPaused(p) { paused = p; player.enabled = !p; if (p) player.releaseLock(); },
    isPaused: () => paused,
    openStation: (id) => interact(stations.list.find(s => s.id === id)),
    teleport: (x, z) => player.teleport(x, z),

    // ---- graphics debug hooks (verify-gfx harness) ----
    // forceTier: hard-pin a tier regardless of detection (bypasses touch cap)
    // so a headless GPU (swiftshader = low) can still exercise med/high paths.
    // Rebuilds composer/shadows/pixelRatio and returns the new effective tier.
    forceTier(name) {
      const n = qual.forceTier(name);  // triggers onChange → applyTierRuntime()
      return n;
    },
    // deterministic clock for fixed-frame screenshots
    setClock(seconds) { clockOverride = (seconds == null) ? null : +seconds; },
    pauseClock(on) { clockPaused = !!on; },

    info: () => ({
      calls: renderer.info.render.calls,
      triangles: renderer.info.render.triangles,
      fps: Math.round(fpsAvg),
      tier: qual.name,
      pos: { x: +player.pos.x.toFixed(1), y: +player.pos.y.toFixed(1), z: +player.pos.z.toFixed(1) },
    }),
  };
  return api;
}

function nextFrame() {
  return new Promise(r => requestAnimationFrame(() => r()));
}
