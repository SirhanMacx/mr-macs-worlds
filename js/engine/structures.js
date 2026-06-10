// structures.js — procedural landmark architecture for learning stations.
// Every station kind gets a DISTINCT silhouette so students can read the world
// at a glance. Each builder returns two baked geometries: `solid` (one
// vertex-colored draw) and `glow` (additive accent — windows, fires, lamps —
// whose material brightens when the station is cleared).
import * as THREE from 'three';
import { bakeParts } from './geo-kit.js';

const B = THREE.BoxGeometry, Cy = THREE.CylinderGeometry, Co = THREE.ConeGeometry,
  Sp = THREE.SphereGeometry, Ic = THREE.IcosahedronGeometry, Oc = THREE.OctahedronGeometry,
  To = THREE.TorusGeometry;

// horizontal triangular prism (pediments, roofs): 3-sided cylinder on its side
function prism(w, h, depth) {
  const g = new Cy(h, h, depth, 3, 1);
  g.rotateZ(Math.PI / 2);
  g.rotateX(Math.PI / 2);
  g.scale(w / h, 1, 1);
  return g;
}

const STONE = 0x9a917f, STONE_D = 0x7c7466, SAND = 0xc9a36b, SAND_D = 0xb5793f,
  WOOD = 0x7a5a33, WOOD_D = 0x5d452a, WHITE = 0xd8d2c2, CREAM = 0xcfc6ae,
  BRICK = 0xa86a4a, SLATE = 0x6b6f7e, DOME_T = 0x3f8f86;

export const BUILDERS = {
  // hub portal — paired pillars + floating ring
  gateway(c) {
    return {
      solid: [
        { geo: new Cy(2.6, 3.0, 0.7, 12), color: STONE_D, y: 0.35 },
        { geo: new B(0.9, 6.2, 0.9), color: STONE, x: -2.4, y: 3.4 },
        { geo: new B(0.9, 6.2, 0.9), color: STONE, x: 2.4, y: 3.4 },
        { geo: new B(6.4, 0.8, 1.0), color: STONE_D, y: 6.8 },
      ],
      glow: [
        { geo: new To(1.7, 0.16, 8, 28), color: c, y: 3.6 },
        { geo: new THREE.CircleGeometry(1.5, 24), color: c, y: 3.6 },
      ],
      labelY: 9.4, r: 7,
    };
  },

  // origins — standing stones + fire
  stones(c) {
    const solid = [{ geo: new Cy(4.6, 5.2, 0.5, 10), color: 0x8a7c5e, y: 0.25 }];
    for (let i = 0; i < 5; i++) {
      const a = (i / 5) * Math.PI * 2 + 0.4;
      solid.push({
        geo: new B(1.3, 3.6 + (i % 2) * 1.2, 0.9), color: i % 2 ? STONE : STONE_D,
        x: Math.cos(a) * 3.4, y: 1.9, z: Math.sin(a) * 3.4, ry: -a, rz: (i % 2 ? 1 : -1) * 0.05,
      });
    }
    solid.push({ geo: new B(2.8, 0.7, 1.0), color: STONE_D, x: 0, y: 4.4, z: -3.3, ry: 0.35 });
    return {
      solid,
      glow: [
        { geo: new Co(0.7, 1.2, 6), color: c, y: 0.9 },
        { geo: new Oc(0.34, 0), color: 0xffd9a0, y: 1.5 },
      ],
      labelY: 8.2, r: 7,
    };
  },

  // river delta — stepped ziggurat with a fire altar
  ziggurat(c) {
    const solid = [];
    const steps = 5;
    for (let i = 0; i < steps; i++) {
      const w = 10.5 - i * 1.85;
      solid.push({ geo: new B(w, 1.5, w), color: i % 2 ? SAND_D : SAND, y: 0.75 + i * 1.5 });
    }
    solid.push({ geo: new B(2.4, 1.4, 5.6), color: SAND, y: 0.7, z: 6.6 }); // ramp base
    solid.push({ geo: new B(2.2, 0.4, 7.8), color: SAND_D, y: 2.4, z: 5.6, rx: 0.5 }); // ramp
    return {
      solid,
      glow: [{ geo: new B(1.6, 0.9, 1.6), color: c, y: 8.0 }],
      labelY: 11.5, r: 9,
    };
  },

  // belief crossroads — stupa + pagoda + arch on one plinth
  shrine(c) {
    return {
      solid: [
        { geo: new Cy(5.6, 6.2, 0.6, 12), color: STONE, y: 0.3 },
        // stupa
        { geo: new Sp(2.0, 12, 9), color: WHITE, x: -2.6, y: 2.4, sy: 0.95 },
        { geo: new Cy(0.3, 0.5, 1.7, 6), color: SAND, x: -2.6, y: 4.6 },
        // pagoda
        { geo: new Cy(1.9, 2.2, 0.5, 8), color: BRICK, x: 2.7, y: 1.3 },
        { geo: new Cy(1.5, 1.8, 0.5, 8), color: BRICK, x: 2.7, y: 2.5 },
        { geo: new Cy(1.1, 1.4, 0.5, 8), color: BRICK, x: 2.7, y: 3.7 },
        { geo: new Co(1.0, 1.2, 8), color: SLATE, x: 2.7, y: 4.9 },
        // arch between
        { geo: new B(0.6, 4.4, 0.6), color: STONE_D, x: -0.8, y: 2.5, z: 2.4 },
        { geo: new B(0.6, 4.4, 0.6), color: STONE_D, x: 0.9, y: 2.5, z: 2.4 },
        { geo: new B(2.6, 0.55, 0.7), color: STONE, x: 0.05, y: 4.9, z: 2.4 },
      ],
      glow: [
        { geo: new Oc(0.42, 0), color: c, x: -2.6, y: 5.8 },
        { geo: new Oc(0.34, 0), color: c, x: 2.7, y: 5.8 },
      ],
      labelY: 8.8, r: 8,
    };
  },

  // classical coast — colonnaded temple
  temple(c) {
    const solid = [
      { geo: new B(11, 0.7, 7.5), color: WHITE, y: 0.35 },
      { geo: new B(9.8, 0.5, 6.4), color: CREAM, y: 0.95 },
      { geo: new B(10.6, 0.7, 7.0), color: WHITE, y: 5.1 },
      { geo: prism(5.6, 1.5, 11.2), color: CREAM, y: 6.2, ry: Math.PI / 2 },
    ];
    for (let i = 0; i < 5; i++) {
      const x = -4.2 + i * 2.1;
      solid.push({ geo: new Cy(0.42, 0.5, 3.8, 8), color: WHITE, x, y: 3.0, z: 2.7 });
      solid.push({ geo: new Cy(0.42, 0.5, 3.8, 8), color: WHITE, x, y: 3.0, z: -2.7 });
    }
    return {
      solid,
      glow: [{ geo: new B(2.2, 1.1, 0.4), color: c, y: 2.2, z: 0 }],
      labelY: 10, r: 9,
    };
  },

  // oasis — walled caravanserai with tents
  caravanserai(c) {
    return {
      solid: [
        { geo: new B(12, 2.2, 0.8), color: SAND, y: 1.1, z: -5.6 },
        { geo: new B(12, 2.2, 0.8), color: SAND, y: 1.1, z: 5.6 },
        { geo: new B(0.8, 2.2, 11), color: SAND, x: -5.6, y: 1.1 },
        { geo: new B(0.8, 2.2, 4.0), color: SAND, x: 5.6, y: 1.1, z: -3.5 },
        { geo: new B(0.8, 2.2, 4.0), color: SAND, x: 5.6, y: 1.1, z: 3.5 },
        { geo: new B(0.9, 3.6, 0.9), color: SAND_D, x: 5.6, y: 1.8, z: -1.6 },
        { geo: new B(0.9, 3.6, 0.9), color: SAND_D, x: 5.6, y: 1.8, z: 1.6 },
        { geo: new B(1.0, 0.7, 3.4), color: SAND_D, x: 5.6, y: 3.8 },
        { geo: new Co(2.0, 2.6, 7), color: 0xb3593a, x: -2.4, y: 1.3, z: -1.8 },
        { geo: new Co(1.7, 2.2, 7), color: 0xc9764f, x: 1.6, y: 1.1, z: 2.2 },
        { geo: new Co(1.4, 1.9, 7), color: 0xa84a30, x: -1.4, y: 0.95, z: 2.8 },
      ],
      glow: [
        { geo: new Oc(0.4, 0), color: c, y: 1.4, x: 2.2, z: -2.0 },
        { geo: new B(1.6, 0.5, 0.2), color: c, x: 5.6, y: 3.0, z: 0 },
      ],
      labelY: 8.4, r: 9,
    };
  },

  // steppe — domed citadel + yurts
  citadel(c) {
    return {
      solid: [
        { geo: new Cy(3.4, 3.8, 4.4, 10), color: 0xb8a88e, y: 2.2 },
        { geo: new Sp(3.0, 12, 8), color: DOME_T, y: 4.6, sy: 0.8 },
        { geo: new Cy(0.9, 1.1, 3.2, 8), color: 0xb8a88e, x: -3.8, y: 1.6, z: 1.8 },
        { geo: new Sp(0.95, 8, 6), color: DOME_T, x: -3.8, y: 3.3, z: 1.8, sy: 0.8 },
        { geo: new Cy(0.9, 1.1, 3.2, 8), color: 0xb8a88e, x: 3.8, y: 1.6, z: 1.8 },
        { geo: new Sp(0.95, 8, 6), color: DOME_T, x: 3.8, y: 3.3, z: 1.8, sy: 0.8 },
        // yurts out front
        { geo: new Cy(1.5, 1.5, 1.0, 9), color: 0xd9cdb8, x: -5.5, y: 0.5, z: 6.0 },
        { geo: new Co(1.7, 1.0, 9), color: 0xb8a88e, x: -5.5, y: 1.5, z: 6.0 },
        { geo: new Cy(1.2, 1.2, 0.9, 9), color: 0xd9cdb8, x: 5.8, y: 0.45, z: 5.4 },
        { geo: new Co(1.4, 0.9, 9), color: 0xb8a88e, x: 5.8, y: 1.3, z: 5.4 },
      ],
      glow: [
        { geo: new To(2.6, 0.12, 6, 20), color: c, y: 4.0, rx: Math.PI / 2 },
        { geo: new Oc(0.4, 0), color: c, y: 7.4 },
      ],
      labelY: 10.2, r: 9,
    };
  },

  // renaissance — walled hill town with campanile
  walledTown(c) {
    const solid = [];
    const n = 8, R = 7.2;
    for (let i = 0; i < n; i++) {
      const a0 = (i / n) * Math.PI * 2, a1 = ((i + 1) / n) * Math.PI * 2;
      const mx = Math.cos((a0 + a1) / 2) * R, mz = Math.sin((a0 + a1) / 2) * R;
      const len = 2 * R * Math.sin(Math.PI / n);
      solid.push({ geo: new B(len, 2.6, 0.8), color: 0xb8a890, x: mx, y: 1.3, z: mz, ry: -((a0 + a1) / 2) + Math.PI / 2 });
    }
    for (let i = 0; i < 4; i++) {
      const a = (i / 4) * Math.PI * 2 + Math.PI / 8;
      solid.push({ geo: new Cy(1.0, 1.2, 3.6, 7), color: 0xa89878, x: Math.cos(a) * R, y: 1.8, z: Math.sin(a) * R });
      solid.push({ geo: new Co(1.25, 1.1, 7), color: BRICK, x: Math.cos(a) * R, y: 4.1, z: Math.sin(a) * R });
    }
    solid.push(
      { geo: new B(2.0, 9.5, 2.0), color: CREAM, x: 1.8, y: 4.75, z: 0.6 },          // campanile
      { geo: new Co(1.7, 2.2, 4), color: BRICK, x: 1.8, y: 10.6, z: 0.6, ry: Math.PI / 4 },
      { geo: new B(3.6, 3.0, 3.0), color: 0xcabd9f, x: -2.4, y: 1.5, z: -0.8 },      // duomo block
      { geo: new Sp(1.7, 10, 8), color: 0xa8542f, x: -2.4, y: 3.4, z: -0.8, sy: 0.85 }, // dome
      { geo: new B(1.6, 2.2, 1.6), color: 0xcabd9f, x: -0.2, y: 1.1, z: 3.2 },
      { geo: prism(0.9, 0.8, 1.7), color: BRICK, x: -0.2, y: 2.5, z: 3.2 }
    );
    return {
      solid,
      glow: [
        { geo: new B(0.9, 1.2, 0.2), color: c, x: 1.8, y: 8.6, z: 1.62 },
        { geo: new B(0.9, 1.2, 0.2), color: c, x: 1.8, y: 8.6, z: -0.42 },
        { geo: new Oc(0.35, 0), color: c, x: -2.4, y: 5.0, z: -0.8 },
      ],
      labelY: 13.6, r: 11,
    };
  },

  // SW coast — harbor with dock + caravel
  harbor(c) {
    const solid = [
      // quay + warehouse
      { geo: new B(7.0, 1.4, 4.6), color: 0xb8a890, x: -2.5, y: 0.7 },
      { geo: prism(2.4, 1.2, 7.2), color: BRICK, x: -2.5, y: 1.9, ry: Math.PI / 2 },
      // dock planks heading to sea (+z)
      { geo: new B(2.6, 0.35, 12), color: WOOD, x: 1.5, y: 0.45, z: 7.4 },
    ];
    for (let i = 0; i < 4; i++) {
      solid.push({ geo: new Cy(0.16, 0.2, 1.4, 5), color: WOOD_D, x: 0.4, y: 0.2, z: 2.8 + i * 3.2 });
      solid.push({ geo: new Cy(0.16, 0.2, 1.4, 5), color: WOOD_D, x: 2.6, y: 0.2, z: 2.8 + i * 3.2 });
    }
    // caravel moored at the dock end
    solid.push(
      { geo: new B(2.2, 1.1, 5.6), color: WOOD_D, x: 5.2, y: 0.45, z: 11.5 },
      { geo: new B(1.8, 0.8, 1.6), color: WOOD, x: 5.2, y: 1.15, z: 13.6 },
      { geo: new Cy(0.12, 0.16, 4.6, 5), color: WOOD_D, x: 5.2, y: 3.0, z: 11.3 },
      { geo: prism(1.5, 1.7, 0.22), color: 0xe8e0c9, x: 5.2, y: 3.3, z: 11.3, ry: Math.PI / 2 },
      { geo: new Cy(0.6, 0.8, 2.2, 6), color: STONE_D, x: -0.6, y: 1.0, z: 13.4 } // mooring tower
    );
    return {
      solid,
      glow: [
        { geo: new Oc(0.4, 0), color: c, x: -0.6, y: 2.6, z: 13.4 },
        { geo: new B(1.2, 0.8, 0.2), color: c, x: -2.5, y: 1.4, z: 2.32 },
      ],
      labelY: 7.6, r: 10,
    };
  },

  // document lab — domed archive with portico
  archive(c) {
    const solid = [
      { geo: new Cy(3.4, 3.7, 3.6, 12), color: CREAM, y: 1.8 },
      { geo: new Sp(3.0, 12, 9), color: SLATE, y: 4.0, sy: 0.75 },
      { geo: new B(4.6, 0.5, 2.2), color: WHITE, y: 0.25, z: 4.0 },
    ];
    for (let i = 0; i < 3; i++) {
      solid.push({ geo: new Cy(0.3, 0.36, 2.8, 7), color: WHITE, x: -1.6 + i * 1.6, y: 1.65, z: 4.6 });
    }
    solid.push({ geo: new B(4.6, 0.6, 2.4), color: WHITE, y: 3.2, z: 4.2 });
    return {
      solid,
      glow: [{ geo: new B(1.4, 2.0, 0.25), color: c, y: 1.6, z: 3.45 }],
      labelY: 8.2, r: 8,
    };
  },

  // MCQ hall — long colonnaded stoa
  stoa(c) {
    const solid = [
      { geo: new B(15, 0.8, 6), color: CREAM, y: 0.4 },
      { geo: new B(14.2, 0.6, 5.2), color: WHITE, y: 4.4 },
      { geo: prism(2.8, 1.3, 14.8), color: BRICK, y: 5.3, ry: Math.PI / 2 },
      { geo: new B(14.2, 3.4, 0.7), color: CREAM, y: 2.5, z: -2.2 },
    ];
    for (let i = 0; i < 7; i++) {
      solid.push({ geo: new Cy(0.4, 0.48, 3.4, 8), color: WHITE, x: -6.3 + i * 2.1, y: 2.5, z: 2.2 });
    }
    return {
      solid,
      glow: [{ geo: new B(13.8, 0.5, 0.2), color: c, y: 4.05, z: 2.4 }],
      labelY: 9, r: 10,
    };
  },

  // enduring issues — ring of six engraved stones
  forum(c) {
    const solid = [{ geo: new Cy(6.4, 7.0, 0.6, 12), color: STONE, y: 0.3 }];
    for (let i = 0; i < 6; i++) {
      const a = (i / 6) * Math.PI * 2;
      solid.push({ geo: new B(1.7, 4.4, 0.8), color: i % 2 ? STONE_D : 0x8a8076, x: Math.cos(a) * 4.6, y: 2.5, z: Math.sin(a) * 4.6, ry: -a + Math.PI / 2 });
    }
    solid.push({ geo: new Cy(1.0, 1.2, 1.3, 8), color: STONE_D, y: 0.95 });
    return {
      solid,
      glow: [{ geo: new Oc(0.6, 0), color: c, y: 2.4 }],
      labelY: 8.6, r: 9,
    };
  },

  // mind atlas — research observatory
  observatory(c) {
    return {
      solid: [
        { geo: new Cy(3.2, 3.6, 3.0, 12), color: 0x8d90a8, y: 1.5 },
        { geo: new Sp(3.0, 14, 10), color: 0xb9bdd4, y: 3.4, sy: 0.9 },
        { geo: new B(1.1, 2.6, 3.4), color: 0x6f7390, y: 4.6, rx: 0.0 },
        { geo: new Cy(0.5, 0.62, 4.2, 8), color: 0x5d6180, x: 0.4, y: 5.0, z: 0.6, rx: -0.7, ry: 0.4 },
        { geo: new B(3.8, 0.5, 2.0), color: 0x8d90a8, y: 0.25, z: 3.6 },
      ],
      glow: [{ geo: new B(0.5, 2.4, 3.0), color: c, y: 4.7 }],
      labelY: 9, r: 8,
    };
  },

  // biopsych — the Great Neuron
  neuronTree(c) {
    const solid = [
      { geo: new Cy(0.7, 1.4, 7.5, 7), color: 0x4a3b56, y: 3.75 },
      { geo: new Ic(2.4, 1), color: 0x3f7d8f, y: 8.4 },
    ];
    const glow = [];
    for (let i = 0; i < 7; i++) {
      const a = (i / 7) * Math.PI * 2;
      const dx = Math.cos(a), dz = Math.sin(a);
      solid.push({
        geo: new Cy(0.1, 0.3, 3.4, 5), color: 0x57a3ad,
        x: dx * 2.6, y: 9.4, z: dz * 2.6,
        rz: -dx * 1.0, rx: dz * 1.0,
      });
      glow.push({ geo: new Oc(0.3, 0), color: c, x: dx * 4.0, y: 10.6, z: dz * 4.0 });
    }
    glow.push({ geo: new Oc(0.5, 0), color: c, y: 8.4 });
    return { solid, glow, labelY: 13.4, r: 9 };
  },

  // cognition — retrieval lighthouse
  lighthouse(c) {
    return {
      solid: [
        { geo: new Ic(1.6, 0), color: 0x6f6e82, x: 1.9, y: 0.3, sy: 0.6 },
        { geo: new Ic(1.2, 0), color: 0x7d7f96, x: -1.7, y: 0.2, z: 1.0, sy: 0.6 },
        { geo: new Cy(1.6, 2.2, 7.0, 10), color: 0xd8d2c2, y: 3.5 },
        { geo: new Cy(1.65, 1.65, 1.3, 10), color: 0x8f4f3f, y: 2.2 },
        { geo: new Cy(1.65, 1.65, 1.3, 10), color: 0x8f4f3f, y: 5.0 },
        { geo: new Cy(1.2, 1.3, 1.5, 8), color: 0x5d6180, y: 7.8 },
        { geo: new Co(1.5, 1.2, 8), color: 0x8f4f3f, y: 9.2 },
      ],
      glow: [{ geo: new Cy(1.0, 1.0, 1.1, 8), color: c, y: 7.8 }],
      labelY: 12, r: 8,
    };
  },

  // development — ascending milestone steles
  milestones(c) {
    const solid = [{ geo: new Cy(5.2, 5.8, 0.5, 12), color: 0x8a9a7c, y: 0.25 }];
    const glow = [];
    for (let i = 0; i < 5; i++) {
      const a = -0.9 + i * 0.45;
      const h = 1.4 + i * 0.95;
      const x = Math.cos(a) * 3.6, z = Math.sin(a) * 3.6;
      solid.push({ geo: new B(1.2, h, 0.7), color: i % 2 ? 0x9aa88c : 0x86977a, x, y: h / 2 + 0.4, z, ry: -a });
      glow.push({ geo: new B(0.5, 0.5, 0.12), color: c, x: x * 0.94, y: h + 0.15, z: z * 0.94, ry: -a });
    }
    return { solid, glow, labelY: 8, r: 8 };
  },

  // social — standing-stone circle with dolmen table
  stonecircle(c) {
    const solid = [{ geo: new Cy(6.0, 6.6, 0.5, 14), color: 0x9d8f9a, y: 0.25 }];
    for (let i = 0; i < 7; i++) {
      const a = (i / 7) * Math.PI * 2;
      solid.push({ geo: new B(1.4, 3.4 + (i % 3) * 0.7, 0.8), color: i % 2 ? 0x8a7f92 : 0x776d85, x: Math.cos(a) * 4.4, y: 1.9, z: Math.sin(a) * 4.4, ry: -a });
    }
    solid.push(
      { geo: new B(1.0, 1.6, 1.0), color: 0x776d85, x: -0.8, y: 0.8 },
      { geo: new B(1.0, 1.6, 1.0), color: 0x776d85, x: 0.8, y: 0.8 },
      { geo: new B(3.0, 0.5, 2.0), color: 0x8a7f92, y: 1.85 }
    );
    return {
      solid,
      glow: [{ geo: new Oc(0.5, 0), color: c, y: 2.8 }],
      labelY: 7.8, r: 9,
    };
  },

  // health — terraced wellness springs
  springs(c) {
    return {
      solid: [
        { geo: new Cy(5.4, 6.0, 1.0, 12), color: 0x9aa89a, y: 0.5 },
        { geo: new Cy(3.8, 4.4, 1.0, 12), color: 0x8a9a8c, y: 1.5 },
        { geo: new Cy(2.3, 2.8, 1.0, 12), color: 0x7a8a7e, y: 2.5 },
        { geo: new Ic(0.9, 0), color: 0x7d7f96, x: 4.4, y: 0.9, sy: 0.7 },
        { geo: new Ic(0.7, 0), color: 0x8d90a8, x: -4.2, y: 0.8, z: 1.6, sy: 0.7 },
      ],
      glow: [
        { geo: new THREE.CircleGeometry(1.7, 16), color: c, y: 3.02, rx: -Math.PI / 2 },
        { geo: new THREE.CircleGeometry(1.1, 14), color: c, x: 2.9, y: 2.02, z: 1.2, rx: -Math.PI / 2 },
        { geo: new THREE.CircleGeometry(0.9, 12), color: c, x: -2.9, y: 2.02, z: -1.0, rx: -Math.PI / 2 },
      ],
      labelY: 7.4, r: 9,
    };
  },

  // FRQ — writing pavilion
  pavilion(c) {
    return {
      solid: [
        { geo: new B(7.0, 0.6, 7.0), color: 0x8d90a8, y: 0.3 },
        { geo: new B(0.5, 3.6, 0.5), color: 0x5d4a66, x: -2.8, y: 2.1, z: -2.8 },
        { geo: new B(0.5, 3.6, 0.5), color: 0x5d4a66, x: 2.8, y: 2.1, z: -2.8 },
        { geo: new B(0.5, 3.6, 0.5), color: 0x5d4a66, x: -2.8, y: 2.1, z: 2.8 },
        { geo: new B(0.5, 3.6, 0.5), color: 0x5d4a66, x: 2.8, y: 2.1, z: 2.8 },
        { geo: new Co(5.6, 1.8, 4), color: 0x8f6a9a, y: 4.8, ry: Math.PI / 4 },
        { geo: new B(2.6, 0.9, 1.4), color: 0x7a5a33, y: 1.0 },
      ],
      glow: [{ geo: new Oc(0.35, 0), color: c, y: 3.4 }],
      labelY: 7.6, r: 8,
    };
  },

  // mixed MCQ — grand exam arch
  examgate(c) {
    return {
      solid: [
        { geo: new B(1.4, 7.0, 1.4), color: 0x8d90a8, x: -3.2, y: 3.5 },
        { geo: new B(1.4, 7.0, 1.4), color: 0x8d90a8, x: 3.2, y: 3.5 },
        { geo: new B(8.4, 1.2, 1.6), color: 0x6f7390, y: 7.3 },
        { geo: new B(1.2, 1.0, 1.5), color: 0xb9bdd4, y: 8.4 },
      ],
      glow: [
        { geo: new B(5.0, 0.4, 0.3), color: c, y: 6.5 },
        { geo: new Oc(0.4, 0), color: c, y: 8.4 },
      ],
      labelY: 11, r: 8,
    };
  },
};

// Build a station's meshes. Returns { group, glowMat, labelY, r }.
export function buildStationMeshes(kind, accentHex, solidMat) {
  const builder = BUILDERS[kind] || BUILDERS.gateway;
  const { solid, glow, labelY, r } = builder(accentHex);
  const group = new THREE.Group();

  const solidGeo = bakeParts(solid);
  const solidMesh = new THREE.Mesh(solidGeo, solidMat);
  solidMesh.castShadow = false;
  group.add(solidMesh);

  let glowMat = null;
  if (glow && glow.length) {
    const glowGeo = bakeParts(glow);
    glowMat = new THREE.MeshBasicMaterial({ vertexColors: true, transparent: true, opacity: 0.92 });
    const glowMesh = new THREE.Mesh(glowGeo, glowMat);
    group.add(glowMesh);
  }
  return { group, glowMat, labelY, r };
}
