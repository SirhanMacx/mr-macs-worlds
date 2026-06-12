// particles.js — one pooled THREE.Points system for all game juice:
// coin bursts, sparkles, dust puffs, confetti. CPU-simulated (≤256 particles),
// a single draw call, additive blending, no textures beyond a tiny canvas dot.
import * as THREE from 'three';

const MAX = 256;

export function createParticles(scene) {
  const geo = new THREE.BufferGeometry();
  const pos = new Float32Array(MAX * 3);
  const col = new Float32Array(MAX * 3);
  const sz = new Float32Array(MAX);
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  geo.setAttribute('color', new THREE.BufferAttribute(col, 3));
  geo.setAttribute('size', new THREE.BufferAttribute(sz, 1));

  const mat = new THREE.ShaderMaterial({
    transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
    uniforms: { uTex: { value: dotTexture() } },
    vertexShader: `
      attribute float size;
      varying vec3 vColor;
      void main() {
        vColor = color;
        vec4 mv = modelViewMatrix * vec4(position, 1.0);
        gl_PointSize = size * (160.0 / -mv.z);
        gl_Position = projectionMatrix * mv;
      }`,
    fragmentShader: `
      uniform sampler2D uTex;
      varying vec3 vColor;
      void main() {
        vec4 t = texture2D(uTex, gl_PointCoord);
        gl_FragColor = vec4(vColor, t.a);
      }`,
    vertexColors: true,
  });

  const points = new THREE.Points(geo, mat);
  points.frustumCulled = false;
  points.renderOrder = 6;
  scene.add(points);

  // particle slots
  const P = [];
  for (let i = 0; i < MAX; i++) P.push({ life: 0 });
  let cursor = 0;

  function spawn(x, y, z, vx, vy, vz, r, g, b, size, life, grav, drag) {
    const p = P[cursor];
    cursor = (cursor + 1) % MAX;
    p.x = x; p.y = y; p.z = z;
    p.vx = vx; p.vy = vy; p.vz = vz;
    p.r = r; p.g = g; p.b = b;
    p.size = size; p.life = life; p.max = life;
    p.grav = grav; p.drag = drag;
  }

  const C = new THREE.Color();
  function burst(kind, x, y, z, n = 14) {
    for (let i = 0; i < n; i++) {
      const a = Math.random() * Math.PI * 2;
      const sp = 1.5 + Math.random() * 3;
      switch (kind) {
        case 'coin':
          C.set(Math.random() < 0.5 ? 0xffd166 : 0xffe9a0);
          spawn(x, y + 1, z, Math.cos(a) * sp, 3 + Math.random() * 3.5, Math.sin(a) * sp, C.r, C.g, C.b, 0.55 + Math.random() * 0.3, 0.8 + Math.random() * 0.4, -9, 0.9);
          break;
        case 'sparkle':
          C.setHSL(0.12 + Math.random() * 0.1, 0.9, 0.7);
          spawn(x + (Math.random() - 0.5) * 1.4, y + 0.6 + Math.random() * 1.8, z + (Math.random() - 0.5) * 1.4,
            Math.cos(a) * 0.5, 0.8 + Math.random() * 1.4, Math.sin(a) * 0.5, C.r, C.g, C.b, 0.4 + Math.random() * 0.3, 1 + Math.random() * 0.7, 0.4, 0.96);
          break;
        case 'dust':
          C.set(0xcdb184);
          spawn(x + (Math.random() - 0.5) * 0.5, y + 0.12, z + (Math.random() - 0.5) * 0.5,
            Math.cos(a) * 0.7, 0.5 + Math.random() * 0.7, Math.sin(a) * 0.7, C.r, C.g, C.b, 0.45 + Math.random() * 0.3, 0.45 + Math.random() * 0.25, 0.5, 0.9);
          break;
        case 'confetti':
          C.setHSL(Math.random(), 0.85, 0.62);
          spawn(x + (Math.random() - 0.5) * 2, y + 2.2 + Math.random() * 1.5, z + (Math.random() - 0.5) * 2,
            Math.cos(a) * 2, 2 + Math.random() * 4, Math.sin(a) * 2, C.r, C.g, C.b, 0.5 + Math.random() * 0.35, 1.4 + Math.random() * 0.8, -4.5, 0.94);
          break;
        case 'smoke':
          C.set(0x8a8a8a);
          spawn(x, y + 0.4, z, Math.cos(a) * 0.4, 1 + Math.random(), Math.sin(a) * 0.4, C.r, C.g, C.b, 0.8 + Math.random() * 0.6, 1 + Math.random() * 0.6, 0.8, 0.95);
          break;
      }
    }
  }

  function update(dt) {
    let any = false;
    for (let i = 0; i < MAX; i++) {
      const p = P[i];
      const j = i * 3;
      if (p.life <= 0) { sz[i] = 0; continue; }
      any = true;
      p.life -= dt;
      p.vy += p.grav * dt;
      p.vx *= p.drag; p.vz *= p.drag;
      p.x += p.vx * dt; p.y += p.vy * dt; p.z += p.vz * dt;
      pos[j] = p.x; pos[j + 1] = p.y; pos[j + 2] = p.z;
      const f = Math.max(0, p.life / p.max);
      col[j] = p.r * f; col[j + 1] = p.g * f; col[j + 2] = p.b * f;
      sz[i] = p.size * (0.6 + 0.4 * f);
    }
    if (any) {
      geo.attributes.position.needsUpdate = true;
      geo.attributes.color.needsUpdate = true;
      geo.attributes.size.needsUpdate = true;
    }
    points.visible = any;
  }

  return { burst, update };
}

function dotTexture() {
  const c = document.createElement('canvas');
  c.width = c.height = 32;
  const ctx = c.getContext('2d');
  const g = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
  g.addColorStop(0, 'rgba(255,255,255,1)');
  g.addColorStop(0.5, 'rgba(255,255,255,0.6)');
  g.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 32, 32);
  const tex = new THREE.CanvasTexture(c);
  return tex;
}
