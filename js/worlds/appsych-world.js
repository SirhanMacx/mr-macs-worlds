// appsych-world.js — "The Mind Atlas": an explorable brain-scape.
// Low-poly: one big translucent brain hull, glowing synapse arcs, content markers,
// and two skill-station gates (MCQ portal + Free-Response Lab).
import * as THREE from 'three';
import { makeMarker, makeGround, makeLabel, scatterInstanced } from './world-utils.js';

export function buildAppsychWorld(scene, interactables, content, reducedMotion) {
  const group = new THREE.Group();
  scene.add(group);

  // --- atmosphere: deep neural blue ---
  scene.background = new THREE.Color(0x05080f);
  scene.fog = new THREE.Fog(0x05080f, 60, 140);

  // ground
  makeGround(scene, 0x0a1322, 0x1e90ff, 80);

  // central "brain" — a low-poly icosphere, translucent, slowly pulsing
  const brainMat = new THREE.MeshStandardMaterial({
    color: 0x2a4a7f, emissive: 0x1b3a6b, emissiveIntensity: 0.4,
    transparent: true, opacity: 0.5, flatShading: true, roughness: 0.6
  });
  const brain = new THREE.Mesh(new THREE.IcosahedronGeometry(7, 1), brainMat);
  brain.position.set(0, 9, 0);
  brain.scale.set(1.25, 1, 1.1);
  group.add(brain);

  // a wireframe overlay for the "neural" look
  const wire = new THREE.Mesh(
    new THREE.IcosahedronGeometry(7.1, 1),
    new THREE.MeshBasicMaterial({ color: 0x4fd1ff, wireframe: true, transparent: true, opacity: 0.18 })
  );
  wire.position.copy(brain.position); wire.scale.copy(brain.scale);
  group.add(wire);

  // floating "neuron" particles around the brain (instanced, cheap)
  const neurons = scatterInstanced(
    scene,
    new THREE.OctahedronGeometry(0.18, 0),
    new THREE.MeshBasicMaterial({ color: 0x7fdbff, transparent: true, opacity: 0.7 }),
    reducedMotion ? 60 : 140, 10, 34, 2, 22
  );

  // content markers (one per CED unit)
  content.nodes.forEach(n => {
    makeMarker(scene, interactables, {
      pos: n.pos, color: n.color, label: n.label, sublabel: n.unit,
      kind: 'content', data: { node: n, starId: 'node:' + n.id }
    });
  });

  // skill stations as glowing gates
  makeStationGate(scene, interactables, {
    pos: [-8, 0, 30], color: 0x38bdf8,
    label: content.mcq.station, sub: 'MCQ Portal',
    kind: 'mcq', data: { course: 'appsych', cfg: content.mcq }
  });
  makeStationGate(scene, interactables, {
    pos: [8, 0, 30], color: 0xa78bfa,
    label: content.frq.station, sub: 'AAQ + EBQ',
    kind: 'frq', data: { cfg: content.frq }
  });

  // a "back to hub" portal
  makeStationGate(scene, interactables, {
    pos: [0, 0, -34], color: 0xffd27f,
    label: 'Return to Hub', sub: '', kind: 'hub', data: {}
  });

  // lighting
  const hemi = new THREE.HemisphereLight(0x88aaff, 0x0a0f1a, 0.8);
  scene.add(hemi);
  const key = new THREE.DirectionalLight(0xbfd8ff, 0.9);
  key.position.set(20, 40, 20);
  scene.add(key);
  const fill = new THREE.PointLight(0x4fd1ff, 0.6, 60);
  fill.position.set(0, 12, 0);
  scene.add(fill);

  return {
    group,
    update(t, dt) {
      if (!reducedMotion) {
        const s = 1 + Math.sin(t * 1.3) * 0.03;
        brain.scale.set(1.25 * s, 1.0 * s, 1.1 * s);
        wire.scale.copy(brain.scale);
        wire.rotation.y += dt * 0.05;
        neurons.rotation.y += dt * 0.03;
      }
      fill.intensity = 0.6 + (reducedMotion ? 0 : Math.sin(t * 2.2) * 0.15);
    },
    dispose() { scene.remove(group); }
  };
}

function makeStationGate(scene, interactables, { pos, color, label, sub, kind, data }) {
  const group = new THREE.Group();
  group.position.set(pos[0], pos[1] ?? 0, pos[2]);

  // torus "portal"
  const torus = new THREE.Mesh(
    new THREE.TorusGeometry(2.4, 0.35, 8, 28),
    new THREE.MeshStandardMaterial({ color, emissive: color, emissiveIntensity: 0.7, flatShading: true, roughness: 0.4 })
  );
  torus.position.y = 3; group.add(torus);

  const disc = new THREE.Mesh(
    new THREE.CircleGeometry(2.2, 24),
    new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.18, side: THREE.DoubleSide })
  );
  disc.position.y = 3; group.add(disc);

  const base = new THREE.Mesh(
    new THREE.CylinderGeometry(2.6, 3, 0.5, 16),
    new THREE.MeshStandardMaterial({ color: 0x16213a, roughness: 0.9 })
  );
  base.position.y = 0.25; group.add(base);

  const sprite = makeLabel(label, sub, '#' + color.toString(16).padStart(6, '0'));
  sprite.position.y = 6.4; group.add(sprite);

  group.userData = { kind, data, label, marker: true, torus, isGate: true };
  scene.add(group);
  interactables.push(group);
  return group;
}
