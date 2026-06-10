// global9-world.js — "The Trade Winds World": a sun-warm Silk Road / river-valley map.
// Low-poly dunes, a winding trade route, content markers at each unit, and three
// skill-station gates (Stimulus MCQ Hall, Document Lab/CRQ, Enduring Issues Quest).
import * as THREE from 'three';
import { makeMarker, makeGround, makeLabel, scatterInstanced } from './world-utils.js';

export function buildGlobal9World(scene, interactables, content, reducedMotion) {
  const group = new THREE.Group();
  scene.add(group);

  // --- atmosphere: warm desert sky ---
  scene.background = new THREE.Color(0x2a1a0f);
  scene.fog = new THREE.Fog(0x3a2415, 70, 150);

  makeGround(scene, 0x6b4a25, 0xffcf8a, 80);

  // a great central ziggurat/landmark (stepped pyramid)
  const zig = new THREE.Group();
  const steps = 5;
  for (let i = 0; i < steps; i++) {
    const w = 11 - i * 1.9;
    const step = new THREE.Mesh(
      new THREE.BoxGeometry(w, 1.6, w),
      new THREE.MeshStandardMaterial({ color: i % 2 ? 0xb5793f : 0xc98b4d, roughness: 1, flatShading: true })
    );
    step.position.y = 0.8 + i * 1.6;
    zig.add(step);
  }
  zig.position.set(0, 0, 0);
  group.add(zig);

  // a "river/trade route" — a flat curved ribbon of water-blue running through
  const route = new THREE.Mesh(
    new THREE.RingGeometry(26, 30, 48, 1, 0, Math.PI * 1.5),
    new THREE.MeshStandardMaterial({ color: 0x2b8fb5, transparent: true, opacity: 0.55, roughness: 0.4, side: THREE.DoubleSide })
  );
  route.rotation.x = -Math.PI / 2; route.position.y = 0.05;
  group.add(route);

  // dunes — instanced low-poly cones
  scatterInstanced(
    scene,
    new THREE.ConeGeometry(3.2, 2.4, 4),
    new THREE.MeshStandardMaterial({ color: 0x8a5e30, roughness: 1, flatShading: true }),
    reducedMotion ? 28 : 48, 34, 76, 1.1, 0.6
  );

  // palms / caravan posts — instanced thin cylinders
  scatterInstanced(
    scene,
    new THREE.CylinderGeometry(0.18, 0.22, 4, 5),
    new THREE.MeshStandardMaterial({ color: 0x5a3d1e, roughness: 1, flatShading: true }),
    18, 18, 60, 2, 0.4
  );

  // content markers
  content.nodes.forEach(n => {
    makeMarker(scene, interactables, {
      pos: n.pos, color: n.color, label: n.label, sublabel: n.unit,
      kind: 'content', data: { node: n, starId: 'node:' + n.id }
    });
  });

  // skill-station gates (3 for Global)
  makeStationGate(scene, interactables, {
    pos: [-14, 0, 30], color: 0xfbbf24, label: content.mcq.station, sub: 'Stimulus MCQ',
    kind: 'mcq', data: { course: 'global9', cfg: content.mcq }
  });
  makeStationGate(scene, interactables, {
    pos: [0, 0, 33], color: 0xf97316, label: content.crq.station, sub: 'CRQ documents',
    kind: 'crq', data: { cfg: content.crq }
  });
  makeStationGate(scene, interactables, {
    pos: [14, 0, 30], color: 0xef4444, label: content.ei.station, sub: 'The Essay',
    kind: 'ei', data: { cfg: content.ei }
  });
  makeStationGate(scene, interactables, {
    pos: [0, 0, -34], color: 0xffe9b0, label: 'Return to Hub', sub: '', kind: 'hub', data: {}
  });

  // sun + warm light
  const hemi = new THREE.HemisphereLight(0xffe0b0, 0x3a2410, 0.85);
  scene.add(hemi);
  const sun = new THREE.DirectionalLight(0xfff0d0, 1.0);
  sun.position.set(30, 50, -10);
  scene.add(sun);

  // a stylized low sun disc
  const sunDisc = new THREE.Mesh(
    new THREE.CircleGeometry(8, 32),
    new THREE.MeshBasicMaterial({ color: 0xffcf6a, transparent: true, opacity: 0.85 })
  );
  sunDisc.position.set(0, 30, -78);
  group.add(sunDisc);

  return {
    group,
    update(t, dt) {
      if (!reducedMotion) {
        route.material.opacity = 0.5 + Math.sin(t * 1.5) * 0.08;
        zig.rotation.y = Math.sin(t * 0.1) * 0.02;
      }
    },
    dispose() { scene.remove(group); }
  };
}

function makeStationGate(scene, interactables, { pos, color, label, sub, kind, data }) {
  const group = new THREE.Group();
  group.position.set(pos[0], pos[1] ?? 0, pos[2]);

  // a "trade arch" — two pillars + lintel
  const mat = new THREE.MeshStandardMaterial({ color: 0xc98b4d, roughness: 1, flatShading: true });
  const emat = new THREE.MeshStandardMaterial({ color, emissive: color, emissiveIntensity: 0.6, flatShading: true, roughness: 0.5 });
  const pL = new THREE.Mesh(new THREE.BoxGeometry(0.9, 5, 0.9), mat); pL.position.set(-2.2, 2.5, 0);
  const pR = pL.clone(); pR.position.x = 2.2;
  const lintel = new THREE.Mesh(new THREE.BoxGeometry(5.6, 0.9, 0.9), emat); lintel.position.set(0, 5.4, 0);
  group.add(pL, pR, lintel);

  const disc = new THREE.Mesh(
    new THREE.PlaneGeometry(4.2, 4.6),
    new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.16, side: THREE.DoubleSide })
  );
  disc.position.set(0, 2.8, 0); group.add(disc);

  const sprite = makeLabel(label, sub, '#' + color.toString(16).padStart(6, '0'));
  sprite.position.y = 7; group.add(sprite);

  group.userData = { kind, data, label, marker: true, lintel, isGate: true };
  scene.add(group);
  interactables.push(group);
  return group;
}
