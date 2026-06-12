// pics.js — procedural picture-first illustrations for WORD HARBOR.
// Flat, warm 2D canvas scenes (zero assets, zero emoji). Every story line,
// festival card and time-travel beat keys one of these scene kinds.
const P = {
  sky: '#cfe6ef', skyWarm: '#f6e3c4', sun: '#ffd166', ground: '#a8c686', sand: '#e6d29a',
  sea: '#5fb8bd', seaDeep: '#2a6e86', stone: '#cfc4b0', stoneDark: '#9a8f7a', wood: '#9a6a3f',
  dark: '#3c3a34', red: '#d96a5a', green: '#6fae6a', gold: '#e8b84a', cloth: '#7a9cc6',
  skin: '#d9a066', white: '#f6f3ea', purple: '#b78ee8',
};

function base(x, W, H, warm) {
  x.fillStyle = warm ? P.skyWarm : P.sky;
  x.fillRect(0, 0, W, H);
  x.fillStyle = P.sun;
  x.beginPath(); x.arc(W * 0.82, H * 0.2, W * 0.08, 0, Math.PI * 2); x.fill();
}
function groundBand(x, W, H, c = P.ground, frac = 0.68) {
  x.fillStyle = c;
  x.fillRect(0, H * frac, W, H * (1 - frac));
}
function seaBand(x, W, H, frac = 0.62) {
  x.fillStyle = P.sea;
  x.fillRect(0, H * frac, W, H * (1 - frac));
  x.fillStyle = 'rgba(255,255,255,0.35)';
  for (let i = 0; i < 4; i++) x.fillRect(W * (0.08 + i * 0.24), H * (frac + 0.07 + (i % 2) * 0.1), W * 0.12, 2);
}
function rect(x, X, Y, W, H, c) { x.fillStyle = c; x.fillRect(X, Y, W, H); }
function tri(x, x1, y1, x2, y2, x3, y3, c) {
  x.fillStyle = c; x.beginPath(); x.moveTo(x1, y1); x.lineTo(x2, y2); x.lineTo(x3, y3); x.closePath(); x.fill();
}
function circ(x, cx, cy, r, c) { x.fillStyle = c; x.beginPath(); x.arc(cx, cy, r, 0, Math.PI * 2); x.fill(); }
function person(x, cx, cy, s, robe) {
  circ(x, cx, cy - s * 1.5, s * 0.55, P.skin);
  x.fillStyle = robe || P.cloth;
  x.beginPath(); x.moveTo(cx - s * 0.7, cy + s); x.lineTo(cx, cy - s * 1.05); x.lineTo(cx + s * 0.7, cy + s); x.closePath(); x.fill();
}
function boatShape(x, cx, cy, s) {
  x.fillStyle = P.wood;
  x.beginPath(); x.moveTo(cx - s, cy); x.lineTo(cx + s, cy); x.lineTo(cx + s * 0.6, cy + s * 0.45); x.lineTo(cx - s * 0.6, cy + s * 0.45); x.closePath(); x.fill();
  rect(x, cx - 2, cy - s * 1.3, 4, s * 1.3, P.dark);
  tri(x, cx + 2, cy - s * 1.3, cx + 2, cy - s * 0.25, cx + s * 0.95, cy - s * 0.35, P.white);
}

const SCENES = {
  boat(x, W, H) { base(x, W, H); seaBand(x, W, H); boatShape(x, W * 0.5, H * 0.62, W * 0.22); },
  town(x, W, H) {
    base(x, W, H); groundBand(x, W, H);
    rect(x, W * 0.12, H * 0.46, W * 0.2, H * 0.26, P.stone); tri(x, W * 0.1, H * 0.46, W * 0.34, H * 0.46, W * 0.22, H * 0.32, P.red);
    rect(x, W * 0.42, H * 0.5, W * 0.18, H * 0.22, P.sand); tri(x, W * 0.4, H * 0.5, W * 0.62, H * 0.5, W * 0.51, H * 0.38, P.wood);
    rect(x, W * 0.68, H * 0.44, W * 0.2, H * 0.28, P.white); tri(x, W * 0.66, H * 0.44, W * 0.9, H * 0.44, W * 0.78, H * 0.3, P.green);
    person(x, W * 0.5, H * 0.82, W * 0.05);
  },
  gem(x, W, H) {
    base(x, W, H, true); groundBand(x, W, H, P.sand);
    const cx = W / 2, cy = H * 0.52, s = W * 0.18;
    tri(x, cx - s, cy, cx + s, cy, cx, cy - s * 1.1, P.purple);
    tri(x, cx - s, cy, cx + s, cy, cx, cy + s * 1.1, '#9a6fd0');
    tri(x, cx - s * 0.4, cy - s * 0.5, cx, cy - s * 1.05, cx + s * 0.32, cy - s * 0.4, '#dcc8f5');
    circ(x, cx + s * 0.9, cy - s * 1.2, 3, P.white); circ(x, cx - s * 1.1, cy - s * 0.4, 2.4, P.white);
  },
  compass(x, W, H) {
    base(x, W, H); groundBand(x, W, H, P.sand);
    const cx = W / 2, cy = H * 0.52, r = W * 0.24;
    circ(x, cx, cy, r, P.white); circ(x, cx, cy, r - 3, '#efe7d4');
    tri(x, cx - r * 0.18, cy, cx + r * 0.18, cy, cx, cy - r * 0.78, P.red);
    tri(x, cx - r * 0.18, cy, cx + r * 0.18, cy, cx, cy + r * 0.78, P.stoneDark);
    x.fillStyle = P.dark; x.font = `700 ${Math.round(W * 0.09)}px system-ui`; x.textAlign = 'center';
    x.fillText('N', cx, cy - r - 5);
  },
  world(x, W, H) {
    base(x, W, H);
    circ(x, W / 2, H * 0.52, W * 0.27, P.sea);
    x.fillStyle = P.green;
    x.beginPath(); x.ellipse(W * 0.42, H * 0.42, W * 0.1, H * 0.08, 0.4, 0, Math.PI * 2); x.fill();
    x.beginPath(); x.ellipse(W * 0.58, H * 0.6, W * 0.08, H * 0.1, -0.4, 0, Math.PI * 2); x.fill();
    x.beginPath(); x.ellipse(W * 0.44, H * 0.66, W * 0.05, H * 0.05, 0, 0, Math.PI * 2); x.fill();
  },
  river(x, W, H) {
    base(x, W, H); groundBand(x, W, H, P.ground, 0.5);
    x.fillStyle = P.sea;
    x.beginPath(); x.moveTo(W * 0.42, H * 0.5); x.lineTo(W * 0.58, H * 0.5);
    x.bezierCurveTo(W * 0.5, H * 0.7, W * 0.7, H * 0.8, W * 0.66, H); x.lineTo(W * 0.3, H);
    x.bezierCurveTo(W * 0.42, H * 0.8, W * 0.36, H * 0.66, W * 0.42, H * 0.5); x.closePath(); x.fill();
    tri(x, W * 0.1, H * 0.5, W * 0.3, H * 0.5, W * 0.2, H * 0.34, P.stoneDark);
    tri(x, W * 0.68, H * 0.5, W * 0.9, H * 0.5, W * 0.8, H * 0.32, P.stoneDark);
  },
  fire(x, W, H) {
    base(x, W, H, true); groundBand(x, W, H, '#8a7a5c');
    rect(x, W * 0.38, H * 0.68, W * 0.24, 5, P.wood);
    tri(x, W * 0.42, H * 0.68, W * 0.58, H * 0.68, W * 0.5, H * 0.4, P.gold);
    tri(x, W * 0.46, H * 0.68, W * 0.54, H * 0.68, W * 0.5, H * 0.5, P.red);
    person(x, W * 0.24, H * 0.78, W * 0.05, '#8a6a44'); person(x, W * 0.76, H * 0.78, W * 0.05, '#6e5638');
  },
  hunt(x, W, H) {
    base(x, W, H); groundBand(x, W, H);
    person(x, W * 0.3, H * 0.76, W * 0.055, '#8a6a44');
    x.strokeStyle = P.dark; x.lineWidth = 3;
    x.beginPath(); x.moveTo(W * 0.34, H * 0.78); x.lineTo(W * 0.48, H * 0.52); x.stroke();
    // deer-ish shape, running away — gentle, no harm shown
    rect(x, W * 0.62, H * 0.6, W * 0.16, H * 0.09, '#b08a5a');
    rect(x, W * 0.74, H * 0.52, W * 0.05, H * 0.1, '#b08a5a');
    circ(x, W * 0.78, H * 0.52, W * 0.035, '#b08a5a');
  },
  farm(x, W, H) {
    base(x, W, H); groundBand(x, W, H, '#b59a5e', 0.55);
    x.strokeStyle = '#7a9c4f'; x.lineWidth = 4;
    for (let i = 0; i < 5; i++) {
      x.beginPath(); x.moveTo(W * (0.15 + i * 0.16), H * 0.95); x.lineTo(W * (0.15 + i * 0.16), H * 0.62); x.stroke();
      circ(x, W * (0.15 + i * 0.16), H * 0.6, 5, P.gold);
    }
    person(x, W * 0.85, H * 0.8, W * 0.05, P.green);
  },
  ziggurat(x, W, H) {
    base(x, W, H, true); groundBand(x, W, H, P.sand);
    rect(x, W * 0.2, H * 0.58, W * 0.6, H * 0.14, '#c9a25e');
    rect(x, W * 0.3, H * 0.46, W * 0.4, H * 0.12, '#d4b06e');
    rect(x, W * 0.4, H * 0.34, W * 0.2, H * 0.12, '#e0bd7e');
    rect(x, W * 0.47, H * 0.6, W * 0.06, H * 0.12, P.dark);
  },
  law(x, W, H) {
    base(x, W, H, true); groundBand(x, W, H, P.sand);
    x.fillStyle = P.stoneDark;
    x.beginPath(); x.moveTo(W * 0.36, H * 0.78); x.lineTo(W * 0.36, H * 0.3);
    x.arc(W * 0.5, H * 0.3, W * 0.14, Math.PI, 0); x.lineTo(W * 0.64, H * 0.78); x.closePath(); x.fill();
    x.strokeStyle = '#e8e2d4'; x.lineWidth = 2;
    for (let i = 0; i < 5; i++) { x.beginPath(); x.moveTo(W * 0.41, H * (0.36 + i * 0.08)); x.lineTo(W * 0.59, H * (0.36 + i * 0.08)); x.stroke(); }
  },
  pray(x, W, H) {
    base(x, W, H, true); groundBand(x, W, H);
    person(x, W * 0.35, H * 0.78, W * 0.055, P.purple);
    person(x, W * 0.65, H * 0.78, W * 0.055, P.cloth);
    circ(x, W * 0.5, H * 0.3, W * 0.07, P.gold);
  },
  temple(x, W, H) {
    base(x, W, H); groundBand(x, W, H, P.stone, 0.74);
    rect(x, W * 0.2, H * 0.66, W * 0.6, H * 0.06, P.white);
    for (let i = 0; i < 5; i++) rect(x, W * (0.24 + i * 0.12), H * 0.42, W * 0.05, H * 0.24, P.white);
    tri(x, W * 0.16, H * 0.42, W * 0.84, H * 0.42, W * 0.5, H * 0.26, P.white);
  },
  road(x, W, H) {
    base(x, W, H); groundBand(x, W, H);
    x.fillStyle = P.stone;
    x.beginPath(); x.moveTo(W * 0.42, H); x.lineTo(W * 0.58, H); x.lineTo(W * 0.53, H * 0.5); x.lineTo(W * 0.47, H * 0.5); x.closePath(); x.fill();
    rect(x, W * 0.14, H * 0.5, W * 0.18, H * 0.05, P.stoneDark);
    for (let i = 0; i < 3; i++) { x.beginPath(); x.arc(W * (0.17 + i * 0.06), H * 0.55, W * 0.028, Math.PI, 0, true); x.fillStyle = P.stoneDark; x.fill(); }
  },
  wall(x, W, H) {
    base(x, W, H); groundBand(x, W, H);
    x.fillStyle = P.stoneDark;
    x.beginPath(); x.moveTo(0, H * 0.62); x.bezierCurveTo(W * 0.3, H * 0.5, W * 0.6, H * 0.68, W, H * 0.52);
    x.lineTo(W, H * 0.66); x.bezierCurveTo(W * 0.6, H * 0.8, W * 0.3, H * 0.62, 0, H * 0.74); x.closePath(); x.fill();
    rect(x, W * 0.46, H * 0.46, W * 0.1, H * 0.16, P.stoneDark);
  },
  camel(x, W, H) {
    base(x, W, H, true); groundBand(x, W, H, P.sand, 0.72);
    tri(x, W * 0.05, H * 0.72, W * 0.4, H * 0.72, W * 0.22, H * 0.56, '#d9c08a');
    const cy = H * 0.62, s = W * 0.05;
    rect(x, W * 0.5, cy, W * 0.22, H * 0.08, '#c2a36b');
    circ(x, W * 0.56, cy - H * 0.05, s, '#c2a36b'); circ(x, W * 0.66, cy - H * 0.05, s, '#c2a36b');
    rect(x, W * 0.72, cy - H * 0.08, W * 0.035, H * 0.1, '#c2a36b');
    circ(x, W * 0.74, cy - H * 0.1, s * 0.6, '#c2a36b');
    rect(x, W * 0.52, cy + H * 0.08, W * 0.025, H * 0.1, '#a8895a');
    rect(x, W * 0.66, cy + H * 0.08, W * 0.025, H * 0.1, '#a8895a');
  },
  king(x, W, H) {
    base(x, W, H, true); groundBand(x, W, H, P.sand);
    person(x, W * 0.5, H * 0.72, W * 0.085, '#8a5d9e');
    rect(x, W * 0.43, H * 0.36, W * 0.14, H * 0.045, P.gold);
    tri(x, W * 0.43, H * 0.36, W * 0.47, H * 0.36, W * 0.45, H * 0.3, P.gold);
    tri(x, W * 0.48, H * 0.36, W * 0.52, H * 0.36, W * 0.5, H * 0.29, P.gold);
    tri(x, W * 0.53, H * 0.36, W * 0.57, H * 0.36, W * 0.55, H * 0.3, P.gold);
    circ(x, W * 0.26, H * 0.78, W * 0.035, P.gold); circ(x, W * 0.74, H * 0.8, W * 0.03, P.gold);
  },
  castle(x, W, H) {
    base(x, W, H); groundBand(x, W, H);
    rect(x, W * 0.3, H * 0.4, W * 0.4, H * 0.32, P.stoneDark);
    rect(x, W * 0.22, H * 0.34, W * 0.12, H * 0.38, P.stone);
    rect(x, W * 0.66, H * 0.34, W * 0.12, H * 0.38, P.stone);
    for (let i = 0; i < 4; i++) rect(x, W * (0.32 + i * 0.1), H * 0.36, W * 0.045, H * 0.04, P.stoneDark);
    rect(x, W * 0.46, H * 0.56, W * 0.08, H * 0.16, P.dark);
    tri(x, W * 0.22, H * 0.34, W * 0.34, H * 0.34, W * 0.28, H * 0.24, P.red);
    tri(x, W * 0.66, H * 0.34, W * 0.78, H * 0.34, W * 0.72, H * 0.24, P.red);
  },
  book(x, W, H) {
    base(x, W, H, true); groundBand(x, W, H, P.sand);
    x.fillStyle = P.white;
    x.beginPath(); x.moveTo(W * 0.5, H * 0.36); x.lineTo(W * 0.2, H * 0.42); x.lineTo(W * 0.2, H * 0.7); x.lineTo(W * 0.5, H * 0.64); x.closePath(); x.fill();
    x.beginPath(); x.moveTo(W * 0.5, H * 0.36); x.lineTo(W * 0.8, H * 0.42); x.lineTo(W * 0.8, H * 0.7); x.lineTo(W * 0.5, H * 0.64); x.closePath(); x.fill();
    x.strokeStyle = P.stoneDark; x.lineWidth = 2;
    for (let i = 0; i < 3; i++) {
      x.beginPath(); x.moveTo(W * 0.26, H * (0.47 + i * 0.07)); x.lineTo(W * 0.45, H * (0.44 + i * 0.07)); x.stroke();
      x.beginPath(); x.moveTo(W * 0.55, H * (0.44 + i * 0.07)); x.lineTo(W * 0.74, H * (0.47 + i * 0.07)); x.stroke();
    }
  },
  press(x, W, H) {
    base(x, W, H, true); groundBand(x, W, H, '#8a7a5c');
    rect(x, W * 0.3, H * 0.3, W * 0.4, H * 0.08, P.wood);
    rect(x, W * 0.34, H * 0.38, W * 0.06, H * 0.34, P.wood);
    rect(x, W * 0.6, H * 0.38, W * 0.06, H * 0.34, P.wood);
    rect(x, W * 0.45, H * 0.38, W * 0.1, H * 0.16, P.dark);
    rect(x, W * 0.38, H * 0.58, W * 0.24, H * 0.05, P.stone);
    rect(x, W * 0.41, H * 0.52, W * 0.18, H * 0.06, P.white);
  },
  astrolabe(x, W, H) {
    base(x, W, H); seaBand(x, W, H, 0.7);
    const cx = W / 2, cy = H * 0.44, r = W * 0.2;
    x.strokeStyle = P.gold; x.lineWidth = 5;
    x.beginPath(); x.arc(cx, cy, r, 0, Math.PI * 2); x.stroke();
    x.lineWidth = 3;
    x.beginPath(); x.arc(cx, cy, r * 0.62, 0, Math.PI * 2); x.stroke();
    x.beginPath(); x.moveTo(cx - r, cy); x.lineTo(cx + r, cy); x.stroke();
    x.beginPath(); x.moveTo(cx, cy - r); x.lineTo(cx, cy + r); x.stroke();
    circ(x, cx, cy, 5, P.gold);
  },
  sad(x, W, H) {
    // a quiet remembering scene: two people, a candle — honest but gentle
    x.fillStyle = '#b8c4d6'; x.fillRect(0, 0, W, H);
    groundBand(x, W, H, '#8a93a4');
    person(x, W * 0.35, H * 0.78, W * 0.055, '#5d6e8a');
    person(x, W * 0.65, H * 0.78, W * 0.055, '#6e5d8a');
    rect(x, W * 0.48, H * 0.6, W * 0.04, H * 0.12, P.white);
    tri(x, W * 0.47, H * 0.6, W * 0.53, H * 0.6, W * 0.5, H * 0.52, P.gold);
  },
};

// paint a scene into a canvas (devicePixelRatio aware)
export function paintPic(kind, canvas) {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const W = canvas.clientWidth || canvas.width, H = canvas.clientHeight || canvas.height;
  canvas.width = W * dpr; canvas.height = H * dpr;
  const x = canvas.getContext('2d');
  x.setTransform(dpr, 0, 0, dpr, 0, 0);
  const fn = SCENES[kind] || SCENES.gem;
  fn(x, W, H);
  // soft card frame
  x.strokeStyle = 'rgba(60,58,52,0.25)';
  x.lineWidth = 2;
  x.strokeRect(1, 1, W - 2, H - 2);
}

export const PIC_KINDS = Object.keys(SCENES);
