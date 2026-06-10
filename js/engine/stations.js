// stations.js — places every learning station in the world, manages the
// proximity prompt, interaction rings, cleared-state glow, distance-faded
// labels and the guiding beacon. Stations sit on terrain flats the height
// field carved for them, so structures never float or sink.
import * as THREE from 'three';
import { buildStationMeshes } from './structures.js';
import { makeLabel } from './geo-kit.js';
import * as Progress from '../learn/progress.js';

const GOLD = 0xffd166;

export function buildStations(scene, field, def) {
  const group = new THREE.Group();
  group.name = 'stations';
  scene.add(group);

  const solidMat = new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.85, metalness: 0.04, flatShading: true });
  const list = [];

  function add(spec) {
    const [x, z] = spec.posXZ;
    const y = field.height(x, z);
    const { group: g, glowMat, labelY, r } = buildStationMeshes(spec.stationKind, spec.color, solidMat);
    g.position.set(x, y, z);
    if (spec.faceCenter !== false) g.rotation.y = Math.atan2(x - 0, z - 0) + Math.PI; // face the world center
    group.add(g);

    const labelSprite = makeLabel(spec.label, spec.sub || '', '#' + spec.color.toString(16).padStart(6, '0'));
    labelSprite.position.set(x, y + labelY, z);
    labelSprite.material.opacity = 0;
    group.add(labelSprite);

    const st = {
      ...spec,
      pos: new THREE.Vector3(x, y, z),
      mesh: g, glowMat, labelSprite, labelY, interactR: Math.max(r, 7),
    };
    list.push(st);
    return st;
  }

  // unit stations from regions
  for (const region of def.regions) {
    add({
      id: region.id, type: 'unit', stationKind: region.stationKind,
      posXZ: region.center, color: region.color,
      label: region.name, sub: 'Learning station', region,
    });
  }
  // skill stations
  for (const s of def.skills) {
    add({
      id: s.id, type: s.kind, stationKind: s.stationKind,
      posXZ: s.pos, color: s.color, label: s.label, sub: s.sub, skill: s,
    });
  }

  // ---- interaction rings: one InstancedMesh for all stations ----
  const ringGeo = new THREE.RingGeometry(2.6, 3.3, 28);
  ringGeo.rotateX(-Math.PI / 2);
  const ringMat = new THREE.MeshBasicMaterial({ transparent: true, opacity: 0.5, depthWrite: false });
  const rings = new THREE.InstancedMesh(ringGeo, ringMat, list.length);
  rings.frustumCulled = false;
  const dummy = new THREE.Object3D();
  const col = new THREE.Color();
  list.forEach((st, i) => {
    dummy.position.set(st.pos.x, st.pos.y + 0.12, st.pos.z);
    dummy.updateMatrix();
    rings.setMatrixAt(i, dummy.matrix);
    rings.setColorAt(i, col.set(st.color));
  });
  rings.instanceColor.needsUpdate = true;
  group.add(rings);

  // ---- guiding beacon (light pillar at the suggested next station) ----
  const beacon = new THREE.Mesh(
    new THREE.CylinderGeometry(1.1, 1.5, 90, 10, 1, true),
    new THREE.MeshBasicMaterial({
      color: 0xffe9b0, transparent: true, opacity: 0.16,
      blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide,
    })
  );
  beacon.renderOrder = 5;
  group.add(beacon);

  let beaconTarget = null;       // station object
  let manualTarget = null;       // user override from quest log

  function clearedOf(st) {
    if (st.type === 'unit') return Progress.unitCleared(def.key, st.id);
    if (st.type === 'hub') return false;
    return Progress.stationDone(def.key, st.id);
  }

  function refreshVisuals() {
    list.forEach((st, i) => {
      const done = clearedOf(st);
      if (st.glowMat) {
        st.glowMat.opacity = done ? 1 : 0.85;
        st.glowMat.color.set(done ? GOLD : 0xffffff); // tints vertex colors gold when cleared
      }
      rings.setColorAt(i, col.set(done ? GOLD : st.color));
    });
    rings.instanceColor.needsUpdate = true;
    retarget();
  }

  function retarget() {
    if (manualTarget && !clearedOf(manualTarget)) { setBeacon(manualTarget); return; }
    manualTarget = null;
    const next = def.order.map(id => list.find(s => s.id === id)).find(s => s && !clearedOf(s));
    setBeacon(next || null);
  }

  function setBeacon(st) {
    beaconTarget = st;
    beacon.visible = !!st;
    if (st) beacon.position.set(st.pos.x, st.pos.y + 45, st.pos.z);
  }

  function guideTo(id) {
    const st = list.find(s => s.id === id);
    if (st) { manualTarget = st; setBeacon(st); }
  }

  // ---- per-frame ----
  const v = new THREE.Vector3();
  function update(t, playerPos, camPos) {
    // nearest in interact range
    let near = null, nd = Infinity;
    for (const st of list) {
      const d = playerPos.distanceTo(st.pos);
      if (d < nd) { nd = d; near = st; }
    }
    const active = near && nd < near.interactR ? near : null;

    // rings pulse on the active one
    list.forEach((st, i) => {
      const s = st === active ? 1 + Math.sin(t * 4) * 0.08 : 1;
      dummy.position.set(st.pos.x, st.pos.y + 0.12, st.pos.z);
      dummy.scale.setScalar(s);
      dummy.updateMatrix();
      rings.setMatrixAt(i, dummy.matrix);
    });
    rings.instanceMatrix.needsUpdate = true;

    // labels: fade by camera distance (only nearby ones draw)
    for (const st of list) {
      const d = camPos.distanceTo(st.pos);
      const o = 1 - THREE.MathUtils.smoothstep(d, 60, 95);
      st.labelSprite.material.opacity = o;
      st.labelSprite.visible = o > 0.02;
    }

    // beacon shimmer
    if (beaconTarget) {
      beacon.material.opacity = 0.13 + Math.sin(t * 2.2) * 0.05;
      beacon.rotation.y = t * 0.25;
    }
    return active;
  }

  refreshVisuals();

  return {
    list, update, refreshVisuals, guideTo, retarget,
    get beaconTarget() { return beaconTarget; },
    clearedOf,
  };
}
