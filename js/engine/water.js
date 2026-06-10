// water.js — one subdivided water plane with a cheap animated shader.
// Per-vertex "depth under the surface" is pre-sampled from the terrain field,
// so shorelines tint and foam without any render-to-texture tricks. Gentle
// two-wave vertex bob + procedural sparkle in the fragment — no Water addon,
// no reflections, fog-aware, a single draw call.
import * as THREE from 'three';

export function buildWater(scene, field, def, { reducedMotion = false } = {}) {
  const cfg = def.water;
  const size = def.size * 1.25;
  const segs = 96;

  const geo = new THREE.PlaneGeometry(size, size, segs, segs);
  geo.rotateX(-Math.PI / 2);

  // pre-sample terrain depth at every water vertex (shore tinting + foam)
  const pos = geo.attributes.position;
  const depth = new Float32Array(pos.count);
  for (let i = 0; i < pos.count; i++) {
    const d = def.sea - field.height(pos.getX(i), pos.getZ(i));
    depth[i] = Math.max(0, d);
  }
  geo.setAttribute('aDepth', new THREE.BufferAttribute(depth, 1));

  const uniforms = THREE.UniformsUtils.merge([
    THREE.UniformsLib.fog,
    {
      uTime: { value: 0 },
      uDeep: { value: new THREE.Color(cfg.deep) },
      uShallow: { value: new THREE.Color(cfg.shallow) },
      uOpacity: { value: cfg.opacity },
      uAmp: { value: cfg.waveAmp * (reducedMotion ? 0.35 : 1) },
    },
  ]);

  const mat = new THREE.ShaderMaterial({
    uniforms,
    transparent: true,
    depthWrite: false,
    fog: true,
    vertexShader: `
      #include <fog_pars_vertex>
      uniform float uTime, uAmp;
      attribute float aDepth;
      varying float vDepth;
      varying vec3 vPos;
      void main() {
        vDepth = aDepth;
        vec3 p = position;
        p.y += sin(p.x * 0.045 + uTime * 0.9) * uAmp
              + cos(p.z * 0.06 + uTime * 0.7) * uAmp * 0.8;
        vPos = p;
        vec4 mvPosition = modelViewMatrix * vec4(p, 1.0);
        gl_Position = projectionMatrix * mvPosition;
        #include <fog_vertex>
      }`,
    fragmentShader: `
      #include <fog_pars_fragment>
      uniform vec3 uDeep, uShallow;
      uniform float uTime, uOpacity;
      varying float vDepth;
      varying vec3 vPos;

      float hash(vec2 p) {
        return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
      }
      float vnoise(vec2 p) {
        vec2 i = floor(p), f = fract(p);
        f = f * f * (3.0 - 2.0 * f);
        return mix(mix(hash(i), hash(i + vec2(1, 0)), f.x),
                   mix(hash(i + vec2(0, 1)), hash(i + vec2(1, 1)), f.x), f.y);
      }
      void main() {
        float shore = smoothstep(3.5, 0.4, vDepth);
        vec3 col = mix(uDeep, uShallow, shore);
        // two scrolling noise fields make moving "wavelets"
        float n = vnoise(vPos.xz * 0.16 + vec2(uTime * 0.06, uTime * 0.045))
                + vnoise(vPos.xz * 0.32 - vec2(uTime * 0.05, uTime * 0.08));
        col += vec3(0.10, 0.13, 0.13) * smoothstep(1.18, 1.45, n);
        // foam line right at the shore
        float foam = smoothstep(0.55, 0.12, vDepth) * (0.55 + 0.45 * sin(uTime * 1.6 + vPos.x * 0.3 + vPos.z * 0.2));
        col = mix(col, vec3(0.92, 0.97, 0.97), foam * 0.5);
        float alpha = uOpacity * mix(0.55, 1.0, smoothstep(0.0, 2.5, vDepth));
        gl_FragColor = vec4(col, alpha);
        #include <fog_fragment>
      }`,
  });

  const mesh = new THREE.Mesh(geo, mat);
  mesh.position.y = def.sea;
  mesh.renderOrder = 2;
  mesh.frustumCulled = false;
  scene.add(mesh);

  return {
    mesh,
    update(t) { uniforms.uTime.value = t; },
    dispose() { geo.dispose(); mat.dispose(); scene.remove(mesh); },
  };
}
