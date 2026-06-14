// cinematic.js — the "first ten seconds" AWE layer for Mr. Mac's Worlds.
//
// Jon's brief: "I want my students to GASP IN AWE." The gasp = an audio+visual
// sync at a reveal. A slow cinematic camera frames a signature golden-hour vista,
// the swelling cinePad chord lands on the framing beat (Sfx.cineHit), the vista is
// ALIVE (a drifting sun-shaft, lamps glowing, a soft dust puff), then a seamless
// hand-off into the cold-open cutscene.
//
// HARD CONSTRAINTS (honored here, verified by the awe harness):
//  • ~0 PERSISTENT draw calls. The sweep RE-RENDERS the already-built scene (no new
//    geometry); the only additions are a handful of transient additive Sprites that
//    are DISPOSED on hand-off. Worst case +≤6 draw calls for ~6s, then back to
//    baseline. Holds the LOW-tier 90-call ceiling.
//  • Camera is owned for free: the engine writes the camera ONLY in player.update,
//    which runs only when !paused. We api.setPaused(true), then write
//    camera.position/lookAt from an api.onFrame hook. On hand-off we end the sweep
//    AT the player's chase pose so setPaused(false) resumes with no pop.
//  • Golden hour is pinned deterministically: api.pauseClock(true)+api.setClock(t)
//    where t = def.sky.cycleSec * goldenFrac (clock<0.45 is day→golden in sky.js).
//  • Reduced motion (api.reducedMotion): NO sweep, NO flashing — a still golden
//    hero frame held ~900ms, vignette fade, then settle to chase pose.
//  • Mute-aware audio (Sfx is mute-aware); skips the glow sprites when the composer
//    already blooms (qual.bloom) so we never double-cost.
//
// Returns a Promise that resolves to { stopPad } once control hands back. The
// caller drives ONE cinePad across sweep→cutscene by passing { pad:false } to
// playCutscene and calling stopPad() AFTER the cutscene resolves.
//
// Imports three + ../game/sfx.js ONLY (disjoint from the engine graphics build).

import * as THREE from 'three';
import * as Sfx from '../game/sfx.js';

// ---------- math helpers ----------
const easeInOutCubic = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const clamp01 = (t) => (t < 0 ? 0 : t > 1 ? 1 : t);

// Centripetal-ish Catmull-Rom through an array of Vector3, u in [0,1] across the
// whole spline. Duplicates the endpoints so the curve passes through p0 and pN.
function catmull(points, u, out) {
  const n = points.length - 1;
  const s = clamp01(u) * n;
  const i = Math.min(Math.floor(s), n - 1);
  const t = s - i;
  const p0 = points[Math.max(0, i - 1)];
  const p1 = points[i];
  const p2 = points[i + 1];
  const p3 = points[Math.min(n, i + 2)];
  const t2 = t * t, t3 = t2 * t;
  out.set(
    0.5 * ((2 * p1.x) + (-p0.x + p2.x) * t + (2 * p0.x - 5 * p1.x + 4 * p2.x - p3.x) * t2 + (-p0.x + 3 * p1.x - 3 * p2.x + p3.x) * t3),
    0.5 * ((2 * p1.y) + (-p0.y + p2.y) * t + (2 * p0.y - 5 * p1.y + 4 * p2.y - p3.y) * t2 + (-p0.y + 3 * p1.y - 3 * p2.y + p3.y) * t3),
    0.5 * ((2 * p1.z) + (-p0.z + p2.z) * t + (2 * p0.z - 5 * p1.z + 4 * p2.z - p3.z) * t2 + (-p0.z + 3 * p1.z - 3 * p2.z + p3.z) * t3),
  );
  return out;
}

// ---------- tiny canvas textures (≤128px, shared per-call, disposed) ----------
function radialTexture(inner, outer) {
  const c = document.createElement('canvas'); c.width = c.height = 128;
  const x = c.getContext('2d');
  const g = x.createRadialGradient(64, 64, 0, 64, 64, 64);
  g.addColorStop(0, inner); g.addColorStop(0.5, outer); g.addColorStop(1, 'rgba(0,0,0,0)');
  x.fillStyle = g; x.fillRect(0, 0, 128, 128);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
}

function makeSprite(tex, scale, color, opacity) {
  const m = new THREE.SpriteMaterial({ map: tex, color, transparent: true, opacity: opacity ?? 1, blending: THREE.AdditiveBlending, depthWrite: false, depthTest: false });
  const s = new THREE.Sprite(m); s.scale.set(scale, scale, 1); return s;
}

// ---------- the opening-shot config per world (hero vistas are real landmarks) ----------
// Crane envelopes are kept deliberately tight: a higher/wider camera pulls more
// distant chunks into the frustum (terrain/scatter cull anchors on the stationary
// player at spawn), which can push the LOW draw-call ceiling. These values are
// tuned so the peak during the sweep stays ≤90 on the low tier (verified).
export const OPENING_SHOTS = {
  // High crane behind the cedar quay descending toward the river-delta ziggurat.
  'trade-winds': {
    dur: 6.5, goldenFrac: 0.42, revealU: 0.46,
    hero: [150, -122], heroH: 26, sideSign: 1,
    startBack: 118, startSide: 88, startHeight: 70, midHeight: 28,
    glow: '#ffcaa0',
  },
  // Low skim across the mind-sea toward the retrieval lighthouse; crane up at the glow.
  'mind-atlas': {
    dur: 7.0, goldenFrac: 0.43, revealU: 0.48,
    hero: [205, 60], heroH: 30, sideSign: -1,
    startBack: 150, startSide: 84, startHeight: 60, midHeight: 20,
    glow: '#cfe0ff',
  },
  // Orbit the incoming boat rising to reveal the quay and plaza; lamps ignite.
  'word-harbor': {
    dur: 6.0, goldenFrac: 0.44, revealU: 0.50,
    hero: [0, 95], heroH: 16, sideSign: 1,
    // Word Harbor's plaza is draw-dense — gameplay look-around already sits at ~83,
    // only 7 under the LOW ceiling. So this shot is a LOW near-eye-level dolly (not a
    // crane that would see over buildings into the busy islands), with a trimmed FX
    // set (2 big glow sprites, no dust), to hold ≤90. NOTE: lampIgnite via
    // stations.setNight() turns on night-emissive meshes (~+15 draws) — omitted; the
    // additive glow sprites carry the "lamps glowing" gasp instead.
    // Word Harbor's plaza is the densest in the game (gameplay look-around already
    // ~83, only 7 under ceiling). Pulling the camera BACK to frame the quay adds ~9
    // draws from the wider frustum — over budget. So this is a position-STABLE
    // pan/reveal: the camera barely leaves the resting chase pose while the GAZE
    // sweeps across the golden harbor and lands on you, the lamps glowing, the pad
    // swelling to a cineHit. Stays ~baseline draws. (lampIgnite omitted; glow sprite.)
    startBack: 8, startSide: 6, startHeight: 4, midHeight: 3,
    glowBright: 1.0, glowN: 1, dust: false, noShaft: true, glow: '#ffe0a8',
  },
};

function nextFrame() { return new Promise((r) => requestAnimationFrame(() => r())); }

// ---------- CSS letterbox + vignette (pure DOM, 0 GPU) ----------
function makeCinemaBars() {
  const wrap = document.createElement('div');
  wrap.style.cssText = 'position:fixed;inset:0;z-index:60;pointer-events:none;opacity:0;transition:opacity .6s ease;';
  wrap.innerHTML =
    '<div style="position:absolute;left:0;right:0;top:0;height:9%;background:#000"></div>' +
    '<div style="position:absolute;left:0;right:0;bottom:0;height:9%;background:#000"></div>' +
    '<div style="position:absolute;inset:0;box-shadow:inset 0 0 240px 60px rgba(0,0,0,0.55)"></div>';
  document.body.appendChild(wrap);
  requestAnimationFrame(() => { wrap.style.opacity = '1'; });
  return {
    fadeOut() {
      wrap.style.opacity = '0';
      setTimeout(() => { try { wrap.remove(); } catch (e) {} }, 700);
    },
  };
}

/**
 * Play the opening hero shot for one world, then resolve once control hands back.
 * @param {object} api   the engine handle (window.MMW): camera, scene, player,
 *                       field, def, qual, reducedMotion, onFrame, setPaused,
 *                       pauseClock, setClock, stations.
 * @param {object} shot  one entry from OPENING_SHOTS.
 * @param {object} [opts] { returning:boolean } — short establishing variant.
 * @returns {Promise<{stopPad:Function}>}
 */
export async function playOpeningShot(api, shot, opts = {}) {
  const noop = { stopPad: () => {} };
  if (!api || !shot || !api.camera || !api.scene) return noop;
  const { camera, scene, field, player } = api;
  const qual = api.qual || {};
  const returning = !!opts.returning;

  // --- pin golden hour deterministically ---
  const cycleSec = (api.def && api.def.sky && api.def.sky.cycleSec) || 600;
  const goldenT = cycleSec * (shot.goldenFrac || 0.43);
  try { api.setPaused(true); } catch (e) {}
  try { api.pauseClock(true); api.setClock(goldenT); } catch (e) {}

  // --- start the swelling pad (caller stops it after the cutscene) ---
  let stopPad = () => {};
  try { if (Sfx.cinePad) stopPad = Sfx.cinePad() || stopPad; } catch (e) {}
  const result = { stopPad };

  // --- world-space anchors ---
  const hh = (x, z) => { try { return field.height(x, z); } catch (e) { return 0; } };
  const spawn = (api.def && api.def.spawn) || [0, 0];
  const S = new THREE.Vector3(spawn[0], hh(spawn[0], spawn[1]) + 1.55, spawn[1]);
  const H = new THREE.Vector3(shot.hero[0], hh(shot.hero[0], shot.hero[1]) + (shot.heroH || 20), shot.hero[1]);

  // direction spawn→hero on the ground plane; back = away, side = perpendicular
  const dir = new THREE.Vector3(H.x - S.x, 0, H.z - S.z); dir.y = 0;
  if (dir.lengthSq() < 1e-3) dir.set(0, 0, -1); dir.normalize();
  const side = new THREE.Vector3(-dir.z, 0, dir.x).multiplyScalar(shot.sideSign || 1);
  const yAt = (p, extra) => Math.max(p.y, hh(p.x, p.z) + (extra || 0));

  // --- the chase pose we will END on, computed to MATCH player.update() so the
  //     hand-off has no pop (player writes camera from these same fields). ---
  const camYaw = (player && player.camYaw != null) ? player.camYaw : 0;
  const camPitch = (player && player.camPitch != null) ? player.camPitch : 0.32;
  const camDist = (player && player.camDist != null) ? player.camDist : 11;
  const endTarget = S.clone();
  const cp = Math.cos(camPitch), sp = Math.sin(camPitch);
  const endPos = new THREE.Vector3(
    endTarget.x + Math.sin(camYaw) * camDist * cp,
    endTarget.y + camDist * sp,
    endTarget.z + Math.cos(camYaw) * camDist * cp,
  );
  endPos.y = Math.max(endPos.y, hh(endPos.x, endPos.z) + 0.7);

  // --- waypoints for the position arc (high crane → descend → settle to chase) ---
  const P0 = new THREE.Vector3().copy(S).addScaledVector(dir, -shot.startBack).addScaledVector(side, shot.startSide);
  P0.y = yAt(P0, shot.startHeight);
  const P1 = new THREE.Vector3().copy(S).addScaledVector(dir, -shot.startBack * 0.35).addScaledVector(side, shot.startSide * 0.45);
  P1.y = yAt(P1, shot.startHeight * 0.6);
  const P2 = new THREE.Vector3().copy(S).addScaledVector(dir, shot.startBack * 0.08).addScaledVector(side, shot.startSide * 0.12);
  P2.y = yAt(P2, shot.midHeight);
  const path = [P0, P1, P2, endPos];

  // --- transient FX (all additive, disposed on hand-off; ~0 persistent) ---
  const fxGroup = new THREE.Group();
  scene.add(fxGroup);
  const textures = [];
  let sunShaft = null;
  if (!shot.noShaft) {
    const shaftTex = radialTexture('rgba(255,236,200,0.9)', 'rgba(255,196,120,0.35)'); textures.push(shaftTex);
    sunShaft = makeSprite(shaftTex, 60, new THREE.Color(0xfff0d2), 0.0);
    fxGroup.add(sunShaft);
  }
  // lamp/lighthouse glow near the hero — SKIP when the composer already blooms.
  const glows = [];
  if (!qual.bloom) {
    const glowTex = radialTexture('rgba(255,224,180,0.95)', 'rgba(255,180,110,0.4)'); textures.push(glowTex);
    const gc = new THREE.Color(shot.glow || '#ffd9a0');
    const n = shot.glowN || 3;
    const gsize = 7 * (shot.glowBright ? 1.4 : 1);
    for (let i = 0; i < n; i++) {
      const s = makeSprite(glowTex, gsize, gc, 0.0);
      const a = (i / n) * Math.PI * 2;
      s.position.set(H.x + Math.cos(a) * 10, hh(H.x, H.z) + 4 + (i % 2) * 3, H.z + Math.sin(a) * 10);
      fxGroup.add(s); glows.push(s);
    }
  }
  // one-shot dust puff at the hero vista, fired at the reveal (skippable on dense
  // worlds via shot.dust:false to claw back a draw call under the LOW ceiling).
  let dust = null;
  if (shot.dust !== false) {
    const dustTex = radialTexture('rgba(224,206,170,0.8)', 'rgba(196,170,120,0.3)'); textures.push(dustTex);
    dust = makeSprite(dustTex, 14, new THREE.Color(0xe8d6b0), 0.0);
    dust.position.set(H.x, hh(H.x, H.z) + 6, H.z);
    fxGroup.add(dust);
  }

  const bars = makeCinemaBars();
  const tmpLook = new THREE.Vector3();

  // sun screen-anchor: place the shaft a little above the hero, toward the sky.
  const placeShaft = () => {
    if (!sunShaft) return;
    sunShaft.position.set(H.x * 0.6 + camera.position.x * 0.4, hh(H.x, H.z) + 60, H.z * 0.6 + camera.position.z * 0.4);
  };

  // helper: dispose everything and resume the world at the chase pose.
  let cleaned = false;
  const handOff = () => {
    if (cleaned) return; cleaned = true;
    try { scene.remove(fxGroup); } catch (e) {}
    fxGroup.traverse((o) => { if (o.material) { if (o.material.map) o.material.map.dispose(); o.material.dispose(); } });
    textures.forEach((t) => { try { t.dispose(); } catch (e) {} });
    bars.fadeOut();
    try { api.setClock(null); api.pauseClock(false); } catch (e) {}
    try { api.setPaused(false); } catch (e) {}
  };

  // ---------------- reduced motion: a single still hero frame, no sweep ----------------
  if (api.reducedMotion) {
    // frame the hero from the mid waypoint; hold; settle to chase; cineHit once.
    camera.position.copy(P2);
    camera.lookAt(H.x, H.y, H.z);
    placeShaft(); if (sunShaft) sunShaft.material.opacity = 0.5; glows.forEach((g) => (g.material.opacity = 0.7));
    try { Sfx.cineHit && Sfx.cineHit(); } catch (e) {}
    await new Promise((r) => setTimeout(r, 900));
    // brief settle to the chase pose (position lerp, no flashing)
    const from = camera.position.clone();
    const t0 = performance.now(), settle = 700;
    await new Promise((resolve) => {
      const unsub = api.onFrame(() => {
        const u = clamp01((performance.now() - t0) / settle);
        const e = easeInOutCubic(u);
        camera.position.lerpVectors(from, endPos, e);
        tmpLook.lerpVectors(H, endTarget, e);
        camera.lookAt(tmpLook);
        if (u >= 1) { unsub(); resolve(); }
      });
    });
    handOff();
    return result;
  }

  // ---------------- returning player: short establishing settle (3.2s) ----------------
  const dur = returning ? 3.2 : (shot.dur || 6.0);
  const revealU = returning ? 0.5 : (shot.revealU || 0.62);
  // For the returning variant, start lower/closer so it reads as "back home".
  if (returning) {
    P0.copy(P2).addScaledVector(dir, -40); P0.y = yAt(P0, shot.midHeight + 24);
    P1.copy(P2).addScaledVector(dir, -16); P1.y = yAt(P1, shot.midHeight + 8);
  }

  // ---------------- the sweep ----------------
  let firedHit = false;
  const t0 = performance.now();
  await new Promise((resolve) => {
    const unsub = api.onFrame(() => {
      const raw = clamp01((performance.now() - t0) / (dur * 1000));
      const posU = easeInOutCubic(raw);
      catmull(path, posU, camera.position);
      camera.position.y = Math.max(camera.position.y, hh(camera.position.x, camera.position.z) + 0.7);
      // The gaze DWELLS on the hero vista through the descent (so the signature
      // landmark + golden sky stay framed for the gasp), then sweeps to the player
      // only in the final third for a clean settle into the chase pose.
      const lookU = easeInOutCubic(clamp01((raw - 0.55) / 0.4));
      tmpLook.lerpVectors(H, endTarget, lookU);
      camera.lookAt(tmpLook);

      // FX envelopes (fade in to the reveal, ease out after)
      placeShaft();
      if (sunShaft) {
        const shaftEnv = Math.sin(Math.min(1, raw / revealU) * Math.PI * 0.5) * (1 - 0.4 * raw);
        sunShaft.material.opacity = 0.55 * Math.max(0, shaftEnv);
      }
      const glowEnv = clamp01((raw - revealU * 0.4) / (1 - revealU * 0.4));
      const gMax = 0.8 * (shot.glowBright || 0.85);
      glows.forEach((g, i) => { g.material.opacity = gMax * glowEnv; const a = raw * 0.6 + (i / glows.length) * Math.PI * 2; g.position.x = H.x + Math.cos(a) * 10; g.position.z = H.z + Math.sin(a) * 10; });

      // the GASP: cineHit + dust puff exactly at the reveal beat
      if (!firedHit && raw >= revealU) {
        firedHit = true;
        try { Sfx.cineHit && Sfx.cineHit(); } catch (e) {}
      }
      if (dust && raw >= revealU) {
        const d = clamp01((raw - revealU) / 0.25);
        dust.material.opacity = 0.7 * Math.sin(d * Math.PI);
        dust.scale.setScalar(14 + d * 16);
        dust.position.y = hh(H.x, H.z) + 6 + d * 10;
      }
      // word-harbor: ignite the lamps over the last 1.5s (one-shot ramp)
      if (shot.lampIgnite && api.stations && api.stations.setNight) {
        const nf = clamp01((raw - (1 - 1.5 / dur)) / (1.5 / dur)) * 0.85;
        if (nf > 0) { try { api.stations.setNight(nf); } catch (e) {} }
      }

      if (raw >= 1) { unsub(); resolve(); }
    });
  });

  handOff();
  return result;
}

export default { OPENING_SHOTS, playOpeningShot };
