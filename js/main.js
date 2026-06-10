// main.js — Mr. Mac's Worlds engine: hub + world loading + interaction + HUD.
import * as THREE from 'three';
import { Controls } from './controls.js';
import { loadWorldContent } from './content-loader.js';
import * as Progress from './progress.js';
import * as Stations from './skill-stations.js';
import { makeLabel } from './worlds/world-utils.js';
import { buildAppsychWorld } from './worlds/appsych-world.js';
import { buildGlobal9World } from './worlds/global9-world.js';

// ---- WebGL capability check ----
function webglOK() {
  try {
    const c = document.createElement('canvas');
    return !!(window.WebGLRenderingContext && (c.getContext('webgl') || c.getContext('experimental-webgl')));
  } catch (e) { return false; }
}

const App = {
  scene: null, camera: null, renderer: null, controls: null,
  clock: new THREE.Clock(),
  interactables: [],
  raycaster: new THREE.Raycaster(),
  pointer: new THREE.Vector2(),
  current: null,        // current world controller (hub or world)
  currentName: 'hub',
  content: null,
  paused: false,
  reducedMotion: false,
  hovered: null,
};

async function boot() {
  if (!webglOK()) { document.getElementById('webgl-fallback').style.display = 'flex'; return; }

  App.reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

  const canvas = document.getElementById('scene');
  App.renderer = new THREE.WebGLRenderer({ canvas, antialias: false, powerPreference: 'low-power' });
  App.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5)); // cap for Chromebooks
  App.renderer.setSize(window.innerWidth, window.innerHeight);

  App.scene = new THREE.Scene();
  App.camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 400);
  App.camera.position.set(0, 2.2, 28);

  App.controls = new Controls(App.camera, canvas, { reducedMotion: App.reducedMotion });

  Stations.setPauseHandlers(
    () => { App.paused = true; App.controls.enabled = false; },
    () => { App.paused = false; App.controls.enabled = true; }
  );

  App.content = await loadWorldContent();

  buildHUD();
  bindInteraction();
  bindResize();
  loadHub();

  document.getElementById('loading').style.display = 'none';

  // lightweight smoke-test hook (used by automated checks). Harmless in prod.
  window.MMW = {
    loadWorld, loadHub, activate,
    interactables: () => App.interactables.map(g => ({ kind: g.userData.kind, label: g.userData.label })),
    current: () => App.currentName,
  };

  animate();
}

// ---------------- HUB ----------------
function clearScene() {
  // dispose current world
  if (App.current && App.current.dispose) App.current.dispose();
  // remove everything
  while (App.scene.children.length) {
    const o = App.scene.children[0];
    App.scene.remove(o);
  }
  App.interactables = [];
  App.scene.fog = null;
}

function loadHub() {
  clearScene();
  App.currentName = 'hub';
  App.scene.background = new THREE.Color(0x070b16);
  App.scene.fog = new THREE.Fog(0x070b16, 50, 130);
  App.camera.position.set(0, 2.2, 30);
  App.controls.yaw = 0; App.controls.pitch = -0.05;

  // ground
  const ground = new THREE.Mesh(
    new THREE.CircleGeometry(80, 48),
    new THREE.MeshStandardMaterial({ color: 0x0c1430, roughness: 1 })
  );
  ground.rotation.x = -Math.PI / 2; App.scene.add(ground);
  const grid = new THREE.GridHelper(160, 40, 0x3355aa, 0x223377);
  grid.material.opacity = 0.18; grid.material.transparent = true; App.scene.add(grid);

  // central monument
  const monument = new THREE.Group();
  const pillar = new THREE.Mesh(
    new THREE.CylinderGeometry(1.4, 2, 9, 6),
    new THREE.MeshStandardMaterial({ color: 0x1b2a52, emissive: 0x16264f, emissiveIntensity: 0.4, flatShading: true })
  );
  pillar.position.y = 4.5; monument.add(pillar);
  const orb = new THREE.Mesh(
    new THREE.IcosahedronGeometry(2.2, 1),
    new THREE.MeshStandardMaterial({ color: 0x59b0ff, emissive: 0x2e7fd6, emissiveIntensity: 0.7, flatShading: true })
  );
  orb.position.y = 11; monument.add(orb);
  const title = makeLabel("Mr. Mac's Worlds", 'Choose a world to explore', '#9bd0ff');
  title.position.y = 15.5; title.scale.multiplyScalar(1.4); monument.add(title);
  App.scene.add(monument);

  // portals
  makePortal('appsych', App.content.appsych, [-16, 0, 4], 0x4fd1ff);
  makePortal('global9', App.content.global9, [16, 0, 4], 0xffb347);

  // a couple of "coming soon" stub portals
  makeStubPortal('AP World History', [-26, 0, -16], 0x66ddaa);
  makeStubPortal('Global History 10', [26, 0, -16], 0xddaa66);
  makeStubPortal('US History 11', [0, 0, -26], 0xcf88ff);

  // lights
  App.scene.add(new THREE.HemisphereLight(0x88aaff, 0x0a0f1a, 0.9));
  const d = new THREE.DirectionalLight(0xcfe0ff, 0.8); d.position.set(20, 40, 20); App.scene.add(d);
  const p = new THREE.PointLight(0x59b0ff, 0.7, 50); p.position.set(0, 12, 0); App.scene.add(p);

  App.current = {
    update(t, dt) {
      if (!App.reducedMotion) { orb.rotation.y += dt * 0.3; orb.position.y = 11 + Math.sin(t * 1.2) * 0.4; }
    },
    dispose() {}
  };

  setHudWorld('Hub');
}

function makePortal(key, world, pos, color) {
  const group = new THREE.Group();
  group.position.set(pos[0], 0, pos[2]);

  const ring = new THREE.Mesh(
    new THREE.TorusGeometry(3, 0.45, 10, 32),
    new THREE.MeshStandardMaterial({ color, emissive: color, emissiveIntensity: 0.75, flatShading: true, roughness: 0.4 })
  );
  ring.position.y = 3.6; group.add(ring);
  const fill = new THREE.Mesh(
    new THREE.CircleGeometry(2.7, 28),
    new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.2, side: THREE.DoubleSide })
  );
  fill.position.y = 3.6; group.add(fill);
  const base = new THREE.Mesh(
    new THREE.CylinderGeometry(3.2, 3.6, 0.6, 20),
    new THREE.MeshStandardMaterial({ color: 0x121d3a, roughness: 0.9 })
  );
  base.position.y = 0.3; group.add(base);

  const label = makeLabel(world.title, world.subtitle, '#' + color.toString(16).padStart(6, '0'));
  label.position.y = 8; group.add(label);

  group.userData = { kind: 'portal', data: { key }, label: world.title, marker: true, ring };
  App.scene.add(group);
  App.interactables.push(group);
}

function makeStubPortal(name, pos, color) {
  const group = new THREE.Group();
  group.position.set(pos[0], 0, pos[2]);
  const ring = new THREE.Mesh(
    new THREE.TorusGeometry(2.2, 0.3, 8, 24),
    new THREE.MeshStandardMaterial({ color: 0x2a3550, emissive: color, emissiveIntensity: 0.12, flatShading: true })
  );
  ring.position.y = 2.8; group.add(ring);
  const base = new THREE.Mesh(
    new THREE.CylinderGeometry(2.4, 2.7, 0.5, 16),
    new THREE.MeshStandardMaterial({ color: 0x0f1730, roughness: 1 })
  );
  base.position.y = 0.25; group.add(base);
  const label = makeLabel(name, 'Coming soon', '#7e8aa6');
  label.position.y = 5.6; group.add(label);
  group.userData = { kind: 'stub', data: { name }, label: name, marker: true };
  App.scene.add(group);
  App.interactables.push(group);
}

// ---------------- WORLD LOADING ----------------
function loadWorld(key) {
  clearScene();
  App.currentName = key;
  App.camera.position.set(0, 2.2, 26);
  App.controls.yaw = 0; App.controls.pitch = -0.05;
  App.controls.setAutoTarget(null);

  const content = App.content[key];
  if (key === 'appsych') App.current = buildAppsychWorld(App.scene, App.interactables, content, App.reducedMotion);
  else App.current = buildGlobal9World(App.scene, App.interactables, content, App.reducedMotion);

  setHudWorld(content.title);
  Stations.toast(`Entered ${content.title}. Walk up to a glowing crystal to learn.`);
}

// ---------------- INTERACTION ----------------
function bindInteraction() {
  const canvas = document.getElementById('scene');
  let downXY = null;
  canvas.addEventListener('pointerdown', (e) => { downXY = { x: e.clientX, y: e.clientY, t: performance.now() }; });
  canvas.addEventListener('pointerup', (e) => {
    if (App.paused || !downXY) return;
    // treat as a "click/tap" only if the pointer barely moved (not a look-drag)
    const moved = Math.hypot(e.clientX - downXY.x, e.clientY - downXY.y);
    const quick = performance.now() - downXY.t < 500;
    downXY = null;
    if (moved > 12 || !quick) return;
    if (e.target.closest('.ui-block, #joystick, #touch-look, #hud, #panel-overlay')) return;
    handleClick(e.clientX, e.clientY);
  });
}

function handleClick(x, y) {
  App.pointer.x = (x / window.innerWidth) * 2 - 1;
  App.pointer.y = -(y / window.innerHeight) * 2 + 1;
  App.raycaster.setFromCamera(App.pointer, App.camera);
  const hit = App.raycaster.intersectObjects(App.interactables, true)[0];
  if (!hit) return;
  const group = findMarkerGroup(hit.object);
  if (!group) return;

  // distance gate: must be reasonably close (walk up to it) — but allow tap-to-walk
  const dist = App.camera.position.distanceTo(group.position);
  const ud = group.userData;

  if (dist > 12 && (ud.kind === 'content' || ud.kind === 'mcq' || ud.kind === 'frq' || ud.kind === 'crq' || ud.kind === 'ei')) {
    // too far — walk toward it (tap-to-move), then it'll be in range
    App.controls.setAutoTarget(group.position);
    Stations.toast('Walking over… tap again when you arrive.');
    return;
  }

  activate(ud);
}

function activate(ud) {
  switch (ud.kind) {
    case 'portal': loadWorld(ud.data.key); break;
    case 'stub': Stations.toast(`${ud.data.name} — coming soon! The two v1 worlds are live now.`); break;
    case 'hub': loadHub(); break;
    case 'content': Stations.openContentNode(ud.data.node); break;
    case 'mcq': Stations.openMCQ(ud.data.course, ud.data.cfg); break;
    case 'frq': Stations.openFRQ(ud.data.cfg); break;
    case 'crq': Stations.openCRQ(ud.data.cfg); break;
    case 'ei': Stations.openEI(ud.data.cfg); break;
  }
}

function findMarkerGroup(obj) {
  let o = obj;
  while (o) { if (o.userData && o.userData.marker) return o; o = o.parent; }
  return null;
}

// update hover hint + proximity prompt
function updateHover() {
  if (App.paused) { setHint(''); return; }
  // find nearest interactable in front of camera
  let nearest = null, nd = Infinity;
  for (const g of App.interactables) {
    const d = App.camera.position.distanceTo(g.position);
    if (d < nd) { nd = d; nearest = g; }
  }
  if (nearest && nd < 9) {
    const ud = nearest.userData;
    const verb = ud.kind === 'portal' ? 'enter' : ud.kind === 'hub' ? 'return' : ud.kind === 'stub' ? 'preview' : 'open';
    setHint(`Tap / click to ${verb}: ${ud.label}`);
    nearest.userData._near = true;
  } else {
    setHint('');
  }
}

// ---------------- HUD ----------------
function buildHUD() {
  const hud = document.getElementById('hud');
  hud.innerHTML = `
    <div class="hud-left ui-block">
      <button id="btn-hub" class="hud-btn" title="Return to hub">⌂ Hub</button>
      <span id="hud-world" class="hud-world"></span>
    </div>
    <div class="hud-right ui-block">
      <span class="hud-xp" title="Experience points">★ <b id="hud-xp">0</b> XP</span>
      <span class="hud-stars" title="Things mastered">◆ <b id="hud-stars">0</b></span>
      <button id="btn-help" class="hud-btn" title="How to play">?</button>
      <button id="btn-rm" class="hud-btn" title="Toggle reduced motion">RM</button>
    </div>
    <div id="hint" class="hint"></div>
  `;
  document.getElementById('btn-hub').addEventListener('click', () => { if (App.currentName !== 'hub') loadHub(); });
  document.getElementById('btn-help').addEventListener('click', showHelp);
  document.getElementById('btn-rm').addEventListener('click', toggleRM);

  Progress.onChange(syncHUD);
  syncHUD(Progress.getState());
}

function syncHUD(st) {
  const xp = document.getElementById('hud-xp'); if (xp) xp.textContent = st.xp;
  const stars = document.getElementById('hud-stars'); if (stars) stars.textContent = Object.keys(st.stars).length;
}
function setHudWorld(name) { const el = document.getElementById('hud-world'); if (el) el.textContent = name; }
function setHint(t) { const el = document.getElementById('hint'); if (el && el.textContent !== t) el.textContent = t; }

function toggleRM() {
  App.reducedMotion = !App.reducedMotion;
  App.controls.setReducedMotion(App.reducedMotion);
  document.getElementById('btn-rm').classList.toggle('on', App.reducedMotion);
  Stations.toast('Reduced motion ' + (App.reducedMotion ? 'ON' : 'OFF'));
  // rebuild current scene to apply density changes
  if (App.currentName === 'hub') loadHub(); else loadWorld(App.currentName);
}

function showHelp() {
  Stations.openPanel(`
    <div class="panel-head"><div><h2>How to explore</h2></div><button class="panel-close" aria-label="Close">✕</button></div>
    <div class="help">
      <p><strong>Move:</strong> <kbd>W</kbd><kbd>A</kbd><kbd>S</kbd><kbd>D</kbd> or arrow keys. On a touchscreen or Chromebook, drag the <b>joystick</b> (bottom-left) and swipe the right side to look around.</p>
      <p><strong>Look:</strong> drag the mouse. <strong>Tap-to-walk:</strong> tap a faraway crystal or gate and you'll walk toward it — tap again when you arrive to open it.</p>
      <p><strong>Learn:</strong> walk up to a glowing <b>crystal</b> to read the key terms for that unit (+XP). Step into a <b>gate / arch</b> to start a skill station.</p>
      <p><strong>AP Psychology — The Mind Atlas:</strong> 6 brain regions of CED content, an <b>MCQ Portal</b>, and a <b>Free-Response Lab</b> (AAQ + EBQ practice with model answers and the 7-point rubric).</p>
      <p><strong>Global History 9 — The Trade Winds World:</strong> 6 eras from the river valleys to the Silk Road, a <b>Stimulus MCQ Hall</b>, a <b>Document Lab</b> (CRQ), and the <b>Enduring Issues Quest</b>.</p>
      <p><strong>?</strong> reopens this help. <strong>RM</strong> toggles reduced motion. Audio is off by default.</p>
    </div>
  `);
  document.querySelector('#panel-root .panel-close').addEventListener('click', Stations.closePanel);
}

// ---------------- RESIZE + LOOP ----------------
function bindResize() {
  window.addEventListener('resize', () => {
    App.camera.aspect = window.innerWidth / window.innerHeight;
    App.camera.updateProjectionMatrix();
    App.renderer.setSize(window.innerWidth, window.innerHeight);
    App.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
  });
}

let _hoverThrottle = 0;
function animate() {
  requestAnimationFrame(animate);
  const dt = Math.min(App.clock.getDelta(), 0.05);
  const t = App.clock.elapsedTime;
  if (!App.paused) App.controls.update(dt);
  if (App.current && App.current.update) App.current.update(t, dt);
  // spin gate/portal rings for life
  for (const g of App.interactables) {
    if (g.userData.ring && !App.reducedMotion) g.userData.ring.rotation.z += dt * 0.4;
    if (g.userData.torus && !App.reducedMotion) g.userData.torus.rotation.z += dt * 0.5;
    if (g.userData.crystal && !App.reducedMotion) g.userData.crystal.rotation.y += dt * 0.8;
  }
  _hoverThrottle += dt;
  if (_hoverThrottle > 0.12) { updateHover(); _hoverThrottle = 0; }
  App.renderer.render(App.scene, App.camera);
}

window.addEventListener('DOMContentLoaded', boot);
