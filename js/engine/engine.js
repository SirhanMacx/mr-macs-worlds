// engine.js — boots a world: renderer, sky/fog, chunked terrain, water,
// instanced flora, stations, player, HUD; then runs the frame loop.
// Performance posture (Chromebook-first):
//   pixelRatio ≤ 1.5 desktop / 1 touch · no postprocessing · shadows opt-in (HQ)
//   one material per system → draw calls stay well under 100
//   exp2 fog + 700 far-plane do the distance culling
//   auto-degrade: if the first seconds run slow, pixelRatio drops to 1.
import * as THREE from 'three';
import { buildTerrain } from './terrain.js';
import { buildSky } from './sky.js';
import { buildWater } from './water.js';
import { buildScatter } from './scatter.js';
import { buildStations } from './stations.js';
import { buildHUD } from './hud.js';
import { Player } from './player.js';
import * as Panels from '../learn/panels.js';
import * as Progress from '../learn/progress.js';
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
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, isMobile ? 1 : 1.5));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.06;
  renderer.shadowMap.type = THREE.PCFShadowMap;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(isMobile ? 68 : 62, window.innerWidth / window.innerHeight, 0.3, 760);

  onProgress(0.04, 'Seeding the world…');
  const field = def.buildField();

  const sky = buildSky(scene, camera, def, { reducedMotion, clouds: isMobile ? 9 : 14 });
  scene.background = null; // dome handles it

  // ---- terrain, one chunk per frame behind the loading bar ----
  const terrain = buildTerrain(scene, field, {
    size: def.size,
    chunks: 5,
    segs: isMobile ? 38 : 54,
  });
  let done = 0;
  for (const job of terrain.jobs) {
    terrain.buildChunk(job);
    done++;
    onProgress(0.05 + 0.45 * (done / terrain.jobs.length), 'Shaping the land…');
    await nextFrame();
  }

  onProgress(0.55, 'Filling the sea…');
  const water = buildWater(scene, field, def, { reducedMotion });
  await nextFrame();

  onProgress(0.6, 'Raising the landmarks…');
  const stations = buildStations(scene, field, def);
  await nextFrame();

  onProgress(0.68, 'Planting the biomes…');
  const keepout = [
    ...def.regions.map(r => ({ x: r.center[0], z: r.center[1], r: 16 })),
    ...def.skills.map(s => ({ x: s.pos[0], z: s.pos[1], r: 15 })),
    { x: def.spawn[0], z: def.spawn[1], r: 10 },
  ];
  const scatter = buildScatter(scene, field, def, { isMobile, keepout });
  await nextFrame();

  onProgress(0.86, 'Waking the explorer…');
  const player = new Player(camera, canvas, field, def, { isMobile, reducedMotion });
  scene.add(player.group);

  // ---- audio + panels wiring ----
  Audio.setMuted(Progress.getSetting('muted', true));
  let paused = false;
  Panels.setHandlers({
    onOpen() { paused = true; player.enabled = false; player.releaseLock(); },
    onClose() { paused = false; player.enabled = true; stations.refreshVisuals(); },
    onStationCleared() { stations.refreshVisuals(); },
    chime: Audio.chime,
  });

  // ---- interactions ----
  const nodesById = {};
  (content[def.key].nodes || []).forEach(n => { nodesById[n.id] = n; });

  function interact(st) {
    if (!st) return;
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
    onSound: (on) => { Progress.setSetting('muted', !on); Audio.setMuted(!on); if (on) Audio.chime('good'); },
    onQuality: (on) => setQuality(on),
  });
  hud.paintMinimap(field);

  // ---- quality (shadows) ----
  function setQuality(hq) {
    Progress.setSetting('quality', hq ? 'hq' : 'auto');
    renderer.shadowMap.enabled = hq;
    sky.sun.castShadow = hq;
    if (hq) {
      const s = sky.sun.shadow;
      s.mapSize.set(isMobile ? 1024 : 2048, isMobile ? 1024 : 2048);
      s.camera.left = -90; s.camera.right = 90; s.camera.top = 90; s.camera.bottom = -90;
      s.camera.far = 420; s.bias = -0.0006;
      s.camera.updateProjectionMatrix();
      if (s.map) { s.map.dispose(); s.map = null; }
    }
    terrain.setShadows(true);
    scatter.setShadows(hq);
    player.setShadows(hq);
    // force material refresh so shadow shader chunks recompile
    scene.traverse(o => { if (o.isMesh && o.material) o.material.needsUpdate = true; });
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
  });

  onProgress(1, 'Ready.');

  // ---- loop ----
  const clock = new THREE.Clock();
  let frame = 0;
  let fpsAcc = 0, fpsN = 0, fpsAvg = 60, degraded = false;

  function animate() {
    requestAnimationFrame(animate);
    const dt = Math.min(clock.getDelta(), 0.05);
    const t = clock.elapsedTime;
    frame++;

    fpsAcc += dt; fpsN++;
    if (fpsAcc >= 1) { fpsAvg = fpsN / fpsAcc; fpsAcc = 0; fpsN = 0; }
    // graceful degrade: persistent slowness → drop the pixel ratio once
    if (!degraded && frame === 480 && fpsAvg < 30 && renderer.getPixelRatio() > 1) {
      degraded = true;
      renderer.setPixelRatio(1);
      Panels.toast('Tuned the graphics for this device.');
    }

    if (!paused) player.update(dt);
    sky.update(t);
    water.update(t);
    if (frame % 2 === 0 && !reducedMotion) scatter.update(t);

    const active = stations.update(t, player.pos, camera.position);
    hud.setPrompt(paused ? null : active);
    hud.update(t, player, stations.beaconTarget, frame);

    renderer.render(scene, camera);
  }
  animate();

  // debug/verification hook (harmless in prod)
  const api = {
    def, field, player, stations, renderer, scene, camera,
    interact,
    openStation: (id) => interact(stations.list.find(s => s.id === id)),
    teleport: (x, z) => player.teleport(x, z),
    info: () => ({
      calls: renderer.info.render.calls,
      triangles: renderer.info.render.triangles,
      fps: Math.round(fpsAvg),
      pos: { x: +player.pos.x.toFixed(1), y: +player.pos.y.toFixed(1), z: +player.pos.z.toFixed(1) },
    }),
  };
  return api;
}

function nextFrame() {
  return new Promise(r => requestAnimationFrame(() => r()));
}
