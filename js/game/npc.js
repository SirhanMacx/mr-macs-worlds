// npc.js — procedural low-poly people and pack animals. No rigs, no assets:
// capsule bodies, transform-keyed idle/walk/talk animation, palette + hat
// variety. NPCs farther than CULL_D from the camera are hidden so a town's
// worth of characters never blows the draw-call budget.
import * as THREE from 'three';
import { makeLabel } from '../engine/geo-kit.js';

const CULL_D = 80;

const HATS = {
  none: null,
  cap(mat) { const m = new THREE.Mesh(new THREE.SphereGeometry(0.24, 8, 5, 0, Math.PI * 2, 0, Math.PI / 2), mat); m.position.y = 1.78; return m; },
  brim(mat) {
    const g = new THREE.Group();
    const brim = new THREE.Mesh(new THREE.CylinderGeometry(0.37, 0.37, 0.045, 9), mat);
    brim.position.y = 1.78;
    const top = new THREE.Mesh(new THREE.CylinderGeometry(0.19, 0.23, 0.17, 9), mat);
    top.position.y = 1.87;
    g.add(brim, top); return g;
  },
  turban(mat) { const m = new THREE.Mesh(new THREE.SphereGeometry(0.27, 8, 6), mat); m.position.y = 1.8; m.scale.y = 0.72; return m; },
  crown(mat) { const m = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.21, 0.16, 8, 1, true), mat); m.position.y = 1.84; return m; },
  hood(mat) { const m = new THREE.Mesh(new THREE.ConeGeometry(0.3, 0.5, 8), mat); m.position.y = 1.82; return m; },
  scholar(mat) { const m = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.07, 0.5), mat); m.position.y = 1.8; return m; },
};

function std(hex) { return new THREE.MeshStandardMaterial({ color: hex, roughness: 0.85, metalness: 0, flatShading: true }); }

export function createNPCSystem(scene, field, camera) {
  const npcs = [];

  function addNPC(spec) {
    // spec: {id, name, title, x, z, palette:{robe,trim,skin,hat}, hatKind, face, wander, scale}
    const g = new THREE.Group();
    const p = spec.palette || {};
    const robe = std(p.robe ?? 0x7a6a4f);
    const trim = std(p.trim ?? 0x4a3b28);
    const skin = std(p.skin ?? 0xd9a066);
    const hatM = std(p.hat ?? p.trim ?? 0x4a3b28);

    const body = new THREE.Mesh(new THREE.CapsuleGeometry(0.3, 0.55, 3, 8), robe);
    body.position.y = 1.0;
    const head = new THREE.Mesh(new THREE.SphereGeometry(0.21, 9, 7), skin);
    head.position.y = 1.62;
    g.add(body, head);

    const armGeo = new THREE.CapsuleGeometry(0.075, 0.32, 2, 6);
    armGeo.translate(0, -0.22, 0);
    const armL = new THREE.Mesh(armGeo, trim); armL.position.set(-0.36, 1.3, 0);
    const armR = new THREE.Mesh(armGeo.clone(), trim); armR.position.set(0.36, 1.3, 0);
    g.add(armL, armR);

    const legGeo = new THREE.CapsuleGeometry(0.1, 0.3, 2, 6);
    legGeo.translate(0, -0.24, 0);
    const legL = new THREE.Mesh(legGeo, trim); legL.position.set(-0.12, 0.58, 0);
    const legR = new THREE.Mesh(legGeo.clone(), trim); legR.position.set(0.12, 0.58, 0);
    g.add(legL, legR);

    let hat = null;
    const hatFn = HATS[spec.hatKind || 'none'];
    if (hatFn) { hat = hatFn(hatM); g.add(hat); }

    // soft blob shadow
    const blob = new THREE.Mesh(
      new THREE.CircleGeometry(0.5, 12),
      new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.26, depthWrite: false })
    );
    blob.rotation.x = -Math.PI / 2;
    blob.position.y = 0.06;
    g.add(blob);

    const y = field.height(spec.x, spec.z);
    g.position.set(spec.x, y, spec.z);
    if (spec.scale) g.scale.setScalar(spec.scale);
    scene.add(g);

    let label = null;
    if (spec.name) {
      label = makeLabel(spec.name, spec.title || '', spec.labelColor || '#ffd9a0', 0.022);
      label.position.set(spec.x, y + 2.5, spec.z);
      scene.add(label);
    }

    const npc = {
      ...spec, group: g, label, head, armL, armR, legL, legR, body,
      homeX: spec.x, homeZ: spec.z, y,
      phase: Math.random() * Math.PI * 2,
      talking: false, heading: spec.face ?? Math.random() * Math.PI * 2,
      wanderT: 2 + Math.random() * 4, tx: spec.x, tz: spec.z, moving: false,
    };
    g.rotation.y = npc.heading;
    npcs.push(npc);
    return npc;
  }

  function remove(npc) {
    scene.remove(npc.group);
    if (npc.label) scene.remove(npc.label);
    const i = npcs.indexOf(npc);
    if (i >= 0) npcs.splice(i, 1);
  }

  const V = new THREE.Vector3();
  function update(dt, t, playerPos) {
    for (const n of npcs) {
      // distance cull (also culls the label)
      const dx = camera.position.x - n.group.position.x;
      const dz = camera.position.z - n.group.position.z;
      const camD2 = dx * dx + dz * dz;
      const vis = camD2 < CULL_D * CULL_D && !n.hidden;
      n.group.visible = vis;
      if (n.label) n.label.visible = vis && camD2 < 55 * 55;
      if (!vis) continue;

      const pdx = playerPos.x - n.group.position.x;
      const pdz = playerPos.z - n.group.position.z;
      const pD2 = pdx * pdx + pdz * pdz;

      // face the player when close
      if (pD2 < 64) {
        const want = Math.atan2(pdx, pdz);
        let d = want - n.heading;
        d = ((d + Math.PI * 3) % (Math.PI * 2)) - Math.PI;
        n.heading += d * Math.min(1, dt * 6);
        n.moving = false;
      } else if (n.wander) {
        // pick a new stroll target every few seconds
        n.wanderT -= dt;
        if (n.wanderT <= 0) {
          n.wanderT = 4 + Math.random() * 5;
          const a = Math.random() * Math.PI * 2;
          const r = Math.random() * n.wander;
          n.tx = n.homeX + Math.cos(a) * r;
          n.tz = n.homeZ + Math.sin(a) * r;
        }
        const mx = n.tx - n.group.position.x, mz = n.tz - n.group.position.z;
        const md = Math.hypot(mx, mz);
        if (md > 0.4) {
          n.moving = true;
          const sp = 1.1;
          n.group.position.x += (mx / md) * sp * dt;
          n.group.position.z += (mz / md) * sp * dt;
          n.group.position.y = field.height(n.group.position.x, n.group.position.z);
          if (n.label) n.label.position.set(n.group.position.x, n.group.position.y + 2.5, n.group.position.z);
          const want = Math.atan2(mx, mz);
          let d = want - n.heading;
          d = ((d + Math.PI * 3) % (Math.PI * 2)) - Math.PI;
          n.heading += d * Math.min(1, dt * 5);
        } else n.moving = false;
      }
      n.group.rotation.y = n.heading;

      // animation: walk swing / idle sway / talk gesture
      n.phase += dt * (n.moving ? 7 : 1.6);
      if (n.moving) {
        const s = Math.sin(n.phase) * 0.5;
        n.legL.rotation.x = s; n.legR.rotation.x = -s;
        n.armL.rotation.x = -s * 0.7; n.armR.rotation.x = s * 0.7;
      } else if (n.talking) {
        n.armR.rotation.x = -0.7 + Math.sin(t * 5.2) * 0.25;
        n.armL.rotation.x = Math.sin(t * 3.1) * 0.12;
        n.legL.rotation.x = n.legR.rotation.x = 0;
        n.head.position.y = 1.62 + Math.sin(t * 6) * 0.012;
      } else {
        const s = Math.sin(n.phase) * 0.045;
        n.body.scale.y = 1 + s * 0.5;
        n.armL.rotation.x = s; n.armR.rotation.x = -s;
        n.legL.rotation.x = n.legR.rotation.x = 0;
        n.armR.rotation.z = 0;
        // occasional head turn
        n.head.rotation.y = Math.sin(t * 0.4 + n.phase) * 0.4;
      }
    }
  }

  return { addNPC, remove, update, npcs };
}

// ---------- pack animal: the player's caravan, upgraded over the eras ----------
// kinds: donkey | camel | cart (horse-drawn) — follows ~2.6 units behind.
export function createPackAnimal(scene, field) {
  let group = null, kind = null, parts = null;

  function build(newKind) {
    if (group) { scene.remove(group); group = null; }
    kind = newKind;
    if (!kind) return;
    group = new THREE.Group();
    parts = {};
    const hide = std(kind === 'camel' ? 0xc2a36b : kind === 'cart' ? 0x6e4f35 : 0x8d8378);
    const dark = std(0x5d5247);
    const packM = std(0x9a5f33);

    if (kind === 'cart') {
      // horse + two-wheel cart
      const body = new THREE.Mesh(new THREE.CapsuleGeometry(0.3, 0.8, 3, 8), hide);
      body.rotation.z = Math.PI / 2; body.position.y = 0.85;
      const head = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.3, 0.5), hide);
      head.position.set(0, 1.25, 0.72);
      const neck = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.5, 0.22), hide);
      neck.position.set(0, 1.05, 0.55); neck.rotation.x = 0.5;
      group.add(body, head, neck);
      parts.legs = [];
      for (const [lx, lz] of [[-0.16, 0.3], [0.16, 0.3], [-0.16, -0.3], [0.16, -0.3]]) {
        const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.05, 0.8, 6), dark);
        leg.position.set(lx, 0.42, lz);
        parts.legs.push(leg); group.add(leg);
      }
      const bed = new THREE.Mesh(new THREE.BoxGeometry(1.0, 0.16, 1.2), packM);
      bed.position.set(0, 0.8, -1.25);
      const sideL = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.3, 1.2), packM);
      sideL.position.set(-0.46, 1.0, -1.25);
      const sideR = sideL.clone(); sideR.position.x = 0.46;
      const wheelG = new THREE.CylinderGeometry(0.42, 0.42, 0.08, 10);
      wheelG.rotateZ(Math.PI / 2);
      parts.wheels = [];
      for (const wx of [-0.58, 0.58]) {
        const w = new THREE.Mesh(wheelG.clone(), dark);
        w.position.set(wx, 0.42, -1.25);
        parts.wheels.push(w); group.add(w);
      }
      group.add(bed, sideL, sideR);
      parts.cargo = mkCargo(packM, 0, 1.05, -1.25);
      group.add(parts.cargo);
    } else {
      const isCamel = kind === 'camel';
      const body = new THREE.Mesh(new THREE.CapsuleGeometry(isCamel ? 0.34 : 0.27, isCamel ? 0.85 : 0.6, 3, 8), hide);
      body.rotation.z = Math.PI / 2;
      body.position.y = isCamel ? 1.05 : 0.72;
      group.add(body);
      if (isCamel) {
        const hump = new THREE.Mesh(new THREE.SphereGeometry(0.3, 8, 6), hide);
        hump.position.set(0, 1.45, -0.05); hump.scale.set(0.9, 0.8, 1.1);
        group.add(hump);
      }
      const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.13, isCamel ? 0.85 : 0.5, 6), hide);
      neck.position.set(0, isCamel ? 1.5 : 1.0, isCamel ? 0.55 : 0.42);
      neck.rotation.x = isCamel ? 0.35 : 0.6;
      const head = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.22, isCamel ? 0.42 : 0.4), hide);
      head.position.set(0, isCamel ? 1.85 : 1.2, isCamel ? 0.72 : 0.62);
      const earL = new THREE.Mesh(new THREE.ConeGeometry(0.05, isCamel ? 0.1 : 0.22, 5), dark);
      earL.position.set(-0.09, isCamel ? 2.0 : 1.38, isCamel ? 0.66 : 0.52);
      const earR = earL.clone(); earR.position.x = 0.09;
      group.add(neck, head, earL, earR);
      parts.legs = [];
      const legLen = isCamel ? 1.0 : 0.66;
      for (const [lx, lz] of [[-0.18, 0.28], [0.18, 0.28], [-0.18, -0.28], [0.18, -0.28]]) {
        const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.045, legLen, 6), dark);
        leg.position.set(lx, legLen / 2, lz);
        parts.legs.push(leg); group.add(leg);
      }
      parts.cargo = mkCargo(packM, 0, isCamel ? 1.35 : 1.0, -0.15);
      group.add(parts.cargo);
    }

    const blob = new THREE.Mesh(
      new THREE.CircleGeometry(0.7, 12),
      new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.24, depthWrite: false })
    );
    blob.rotation.x = -Math.PI / 2;
    blob.position.y = 0.06;
    group.add(blob);
    scene.add(group);
  }

  function mkCargo(mat, x, y, z) {
    const g = new THREE.Group();
    const b1 = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.26, 0.34), mat);
    b1.position.set(x - 0.26, y, z);
    const b2 = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.3, 0.3), mat);
    b2.position.set(x + 0.26, y + 0.02, z + 0.05);
    const sack = new THREE.Mesh(new THREE.SphereGeometry(0.18, 7, 5), std(0xb9a06a));
    sack.position.set(x, y + 0.18, z - 0.1);
    g.add(b1, b2, sack);
    return g;
  }

  let phase = 0;
  const pos = new THREE.Vector3();
  let heading = 0;
  let snapNext = true;

  function update(dt, playerPos, playerHeading, speed, cargoCount) {
    if (!group) return;
    // follow point: behind the player
    const bx = playerPos.x - Math.sin(playerHeading) * 2.7;
    const bz = playerPos.z - Math.cos(playerHeading) * 2.7;
    if (snapNext) { pos.set(bx, 0, bz); snapNext = false; }
    const k = 1 - Math.exp(-dt * 3.2);
    pos.x += (bx - pos.x) * k;
    pos.z += (bz - pos.z) * k;
    pos.y = field.height(pos.x, pos.z);
    group.position.copy(pos);
    const mdx = playerPos.x - pos.x, mdz = playerPos.z - pos.z;
    if (mdx * mdx + mdz * mdz > 0.4) {
      const want = Math.atan2(mdx, mdz);
      let d = want - heading;
      d = ((d + Math.PI * 3) % (Math.PI * 2)) - Math.PI;
      heading += d * Math.min(1, dt * 5);
      group.rotation.y = heading;
    }
    // legs trot with the player's speed; wheels roll
    phase += dt * (1 + speed * 1.1);
    if (parts.legs) {
      const s = Math.sin(phase * 2.6) * Math.min(0.5, speed * 0.07);
      parts.legs.forEach((leg, i) => { leg.rotation.x = (i % 2 ? s : -s); });
    }
    if (parts.wheels) parts.wheels.forEach(w => { w.rotation.x += speed * dt * 0.9; });
    if (parts.cargo) parts.cargo.visible = cargoCount > 0;
  }

  return {
    setKind(k) { build(k); snapNext = true; },
    update,
    get kind() { return kind; },
    teleportBehind() { snapNext = true; },
  };
}
