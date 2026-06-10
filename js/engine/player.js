// player.js — third-person explorer: a small procedural avatar, a smoothed
// orbit chase camera, and terrain-following movement that samples the SAME
// analytic height field the mesh was built from — collision is exact and free.
// Desktop: WASD/arrows + drag-look or click-to-pointer-lock, Shift run, Space hop,
// wheel zoom. Touch: left virtual joystick (push far to run) + right drag-look.
import * as THREE from 'three';

const UP = new THREE.Vector3(0, 1, 0);

export class Player {
  constructor(camera, dom, field, def, { isMobile = false, reducedMotion = false } = {}) {
    this.camera = camera;
    this.dom = dom;
    this.field = field;
    this.def = def;
    this.isMobile = isMobile;
    this.reducedMotion = reducedMotion;
    this.enabled = true;

    this.pos = new THREE.Vector3(def.spawn[0], 0, def.spawn[1]);
    this.pos.y = field.height(this.pos.x, this.pos.z);
    this.vel = new THREE.Vector3();
    this.vy = 0;
    this.grounded = true;
    this.heading = def.spawnYaw ?? 0;     // avatar facing
    this.walkPhase = 0;
    this.speedNow = 0;

    this.camYaw = def.spawnYaw ?? 0;
    this.camPitch = 0.32;
    this.camDist = isMobile ? 8.2 : 7.4;
    this._camTarget = new THREE.Vector3().copy(this.pos);

    this.keys = { f: 0, b: 0, l: 0, r: 0, run: 0 };
    this.joy = { x: 0, y: 0, mag: 0 };
    this.locked = false;
    this.onBound = null;

    this.group = this._buildAvatar(def.avatar);
    this.group.position.copy(this.pos);

    this._bindKeyboard();
    this._bindMouse();
    if (isMobile) this._buildTouchUI();
    this._snapCamera();
  }

  // ---------------- avatar ----------------
  _buildAvatar(c) {
    const g = new THREE.Group();
    const mat = hex => new THREE.MeshStandardMaterial({ color: hex, roughness: 0.85, metalness: 0, flatShading: true });
    const jacket = mat(c.jacket), pants = mat(c.pants), skin = mat(c.skin), hat = mat(c.hat), pack = mat(c.pack);

    const body = new THREE.Mesh(new THREE.CapsuleGeometry(0.27, 0.5, 3, 8), jacket);
    body.position.y = 1.05;
    g.add(body);
    this._body = body;

    const head = new THREE.Mesh(new THREE.SphereGeometry(0.22, 10, 8), skin);
    head.position.y = 1.66;
    g.add(head);
    this._head = head;

    const brim = new THREE.Mesh(new THREE.CylinderGeometry(0.36, 0.36, 0.05, 10), hat);
    brim.position.y = 1.8;
    const top = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.24, 0.18, 10), hat);
    top.position.y = 1.9;
    g.add(brim, top);

    const backpack = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.42, 0.18), pack);
    backpack.position.set(0, 1.12, -0.3);
    g.add(backpack);

    const legGeo = new THREE.CapsuleGeometry(0.11, 0.34, 2, 6);
    legGeo.translate(0, -0.26, 0);
    this._legL = new THREE.Mesh(legGeo, pants);
    this._legL.position.set(-0.13, 0.62, 0);
    this._legR = new THREE.Mesh(legGeo.clone(), pants);
    this._legR.position.set(0.13, 0.62, 0);
    g.add(this._legL, this._legR);

    const armGeo = new THREE.CapsuleGeometry(0.08, 0.34, 2, 6);
    armGeo.translate(0, -0.24, 0);
    this._armL = new THREE.Mesh(armGeo, jacket);
    this._armL.position.set(-0.36, 1.34, 0);
    this._armR = new THREE.Mesh(armGeo.clone(), jacket);
    this._armR.position.set(0.36, 1.34, 0);
    g.add(this._armL, this._armR);

    // soft blob shadow — grounds the avatar without shadow maps
    const blob = new THREE.Mesh(
      new THREE.CircleGeometry(0.55, 16),
      new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.3, depthWrite: false })
    );
    blob.rotation.x = -Math.PI / 2;
    blob.renderOrder = 3;
    this._blob = blob;
    g.add(blob);

    g.traverse(o => { if (o.isMesh) o.castShadow = false; });
    return g;
  }

  setShadows(on) {
    this.group.traverse(o => { if (o.isMesh && o !== this._blob) o.castShadow = on; });
  }

  // ---------------- input ----------------
  _bindKeyboard() {
    this._kd = (e) => {
      if (!this.enabled) return;
      switch (e.code) {
        case 'KeyW': case 'ArrowUp': this.keys.f = 1; break;
        case 'KeyS': case 'ArrowDown': this.keys.b = 1; break;
        case 'KeyA': case 'ArrowLeft': this.keys.l = 1; break;
        case 'KeyD': case 'ArrowRight': this.keys.r = 1; break;
        case 'ShiftLeft': case 'ShiftRight': this.keys.run = 1; break;
        case 'Space':
          if (this.grounded) { this.vy = 7.6; this.grounded = false; }
          e.preventDefault();
          break;
        default: return;
      }
    };
    this._ku = (e) => {
      switch (e.code) {
        case 'KeyW': case 'ArrowUp': this.keys.f = 0; break;
        case 'KeyS': case 'ArrowDown': this.keys.b = 0; break;
        case 'KeyA': case 'ArrowLeft': this.keys.l = 0; break;
        case 'KeyD': case 'ArrowRight': this.keys.r = 0; break;
        case 'ShiftLeft': case 'ShiftRight': this.keys.run = 0; break;
      }
    };
    window.addEventListener('keydown', this._kd);
    window.addEventListener('keyup', this._ku);
  }

  _bindMouse() {
    const el = this.dom;
    let dragging = false, lx = 0, ly = 0, moved = 0;

    el.addEventListener('pointerdown', (e) => {
      if (!this.enabled || e.pointerType === 'touch') return;
      if (e.target !== el) return;
      dragging = true; moved = 0; lx = e.clientX; ly = e.clientY;
      el.setPointerCapture?.(e.pointerId);
    });
    el.addEventListener('pointermove', (e) => {
      if (e.pointerType === 'touch') return;
      if (this.locked) {
        this.camYaw -= e.movementX * 0.0024;
        this.camPitch += e.movementY * 0.002;
        this._clampPitch();
        return;
      }
      if (!dragging) return;
      const dx = e.clientX - lx, dy = e.clientY - ly;
      moved += Math.abs(dx) + Math.abs(dy);
      lx = e.clientX; ly = e.clientY;
      this.camYaw -= dx * 0.0042;
      this.camPitch += dy * 0.0034;
      this._clampPitch();
    });
    const stop = (e) => {
      if (e && e.pointerType === 'touch') return;
      // a clean click (no drag) on desktop captures the mouse for smooth look
      if (dragging && moved < 6 && !this.isMobile && this.enabled) {
        el.requestPointerLock?.();
      }
      dragging = false;
    };
    el.addEventListener('pointerup', stop);
    el.addEventListener('pointercancel', stop);

    document.addEventListener('pointerlockchange', () => {
      this.locked = document.pointerLockElement === el;
      document.body.classList.toggle('locked', this.locked);
    });

    el.addEventListener('wheel', (e) => {
      if (!this.enabled) return;
      this.camDist = THREE.MathUtils.clamp(this.camDist + Math.sign(e.deltaY) * 0.8, 4.2, 13);
      e.preventDefault();
    }, { passive: false });
  }

  releaseLock() { if (this.locked) document.exitPointerLock?.(); }

  _clampPitch() {
    this.camPitch = THREE.MathUtils.clamp(this.camPitch, -0.12, 1.15);
  }

  _buildTouchUI() {
    const wrap = document.createElement('div');
    wrap.id = 'touch-ui';
    wrap.innerHTML = `
      <div id="joystick" aria-label="Move"><div id="joystick-knob"></div></div>
      <div id="touch-look" aria-hidden="true"></div>`;
    document.body.appendChild(wrap);
    this.touchUI = wrap;

    const joy = wrap.querySelector('#joystick');
    const knob = wrap.querySelector('#joystick-knob');
    let joyId = null, cx = 0, cy = 0, R = 52;

    const setJoy = (t) => {
      let dx = t.clientX - cx, dy = t.clientY - cy;
      const d = Math.hypot(dx, dy) || 1;
      const cl = Math.min(d, R);
      dx = (dx / d) * cl; dy = (dy / d) * cl;
      knob.style.transform = `translate(${dx}px, ${dy}px)`;
      this.joy.x = dx / R; this.joy.y = dy / R;
      this.joy.mag = cl / R;
    };
    joy.addEventListener('touchstart', (e) => {
      e.preventDefault();
      const t = e.changedTouches[0];
      joyId = t.identifier;
      const r = joy.getBoundingClientRect();
      cx = r.left + r.width / 2; cy = r.top + r.height / 2; R = r.width / 2;
      setJoy(t);
    }, { passive: false });
    joy.addEventListener('touchmove', (e) => {
      e.preventDefault();
      for (const t of e.changedTouches) if (t.identifier === joyId) setJoy(t);
    }, { passive: false });
    const endJoy = () => {
      joyId = null;
      this.joy.x = this.joy.y = this.joy.mag = 0;
      knob.style.transform = 'translate(0,0)';
    };
    joy.addEventListener('touchend', endJoy);
    joy.addEventListener('touchcancel', endJoy);

    const look = wrap.querySelector('#touch-look');
    let lookId = null, lkx = 0, lky = 0;
    look.addEventListener('touchstart', (e) => {
      const t = e.changedTouches[0];
      lookId = t.identifier; lkx = t.clientX; lky = t.clientY;
    }, { passive: true });
    look.addEventListener('touchmove', (e) => {
      for (const t of e.changedTouches) {
        if (t.identifier !== lookId) continue;
        this.camYaw -= (t.clientX - lkx) * 0.0052;
        this.camPitch += (t.clientY - lky) * 0.0042;
        this._clampPitch();
        lkx = t.clientX; lky = t.clientY;
      }
    }, { passive: true });
    const endLook = () => { lookId = null; };
    look.addEventListener('touchend', endLook);
    look.addEventListener('touchcancel', endLook);
  }

  teleport(x, z) {
    this.pos.set(x, this.field.height(x, z), z);
    this._snapCamera();
  }

  // ---------------- per-frame ----------------
  update(dt) {
    const f = this.field;

    // input → camera-relative move vector
    let mx = 0, mz = 0, run = false;
    if (this.enabled) {
      mx = (this.keys.r - this.keys.l) + this.joy.x;
      mz = (this.keys.f - this.keys.b) - this.joy.y;
      run = !!this.keys.run || this.joy.mag > 0.88;
    }
    const len = Math.hypot(mx, mz);
    if (len > 1) { mx /= len; mz /= len; }

    const sin = Math.sin(this.camYaw), cos = Math.cos(this.camYaw);
    // camYaw 0 looks toward -z; forward = (-sin, -cos)
    const dirX = -sin * mz + cos * mx;
    const dirZ = -cos * mz - sin * mx;

    const baseSpeed = run ? 13.5 : 7;
    let target = Math.hypot(dirX, dirZ) > 0.01 ? baseSpeed : 0;

    // uphill slope damping (sampled along motion)
    if (target > 0) {
      const ahead = f.height(this.pos.x + dirX * 1.6, this.pos.z + dirZ * 1.6);
      const rise = (ahead - this.pos.y) / 1.6;
      if (rise > 0.45) target *= THREE.MathUtils.clamp(1 - (rise - 0.45) * 1.3, 0.22, 1);
    }

    // velocity smoothing
    const accel = 1 - Math.exp(-dt * 9);
    this.vel.x += (dirX * target - this.vel.x) * accel;
    this.vel.z += (dirZ * target - this.vel.z) * accel;
    this.speedNow = Math.hypot(this.vel.x, this.vel.z);

    this.pos.x += this.vel.x * dt;
    this.pos.z += this.vel.z * dt;

    // soft circular world bound
    const rr = Math.hypot(this.pos.x, this.pos.z);
    if (rr > this.def.boundR) {
      const s = this.def.boundR / rr;
      this.pos.x *= s; this.pos.z *= s;
      this.onBound && this.onBound();
    }

    // ground / jump
    const groundY = f.height(this.pos.x, this.pos.z);
    if (!this.grounded) {
      this.vy -= 22 * dt;
      this.pos.y += this.vy * dt;
      if (this.pos.y <= groundY) { this.pos.y = groundY; this.grounded = true; this.vy = 0; }
    } else {
      // glue to terrain with a fast smooth (softens stair-steps)
      this.pos.y += (groundY - this.pos.y) * (1 - Math.exp(-dt * 18));
    }

    // avatar orientation + walk cycle
    if (this.speedNow > 0.25) {
      const want = Math.atan2(this.vel.x, this.vel.z);
      let d = want - this.heading;
      d = ((d + Math.PI * 3) % (Math.PI * 2)) - Math.PI;
      this.heading += d * Math.min(1, dt * 10);
    }
    this.group.position.copy(this.pos);
    this.group.rotation.y = this.heading;

    const animSpeed = this.reducedMotion ? 0 : this.speedNow;
    this.walkPhase += dt * (2.1 + animSpeed * 0.9);
    const swing = Math.sin(this.walkPhase * 3.2) * Math.min(0.62, animSpeed * 0.09);
    this._legL.rotation.x = swing;
    this._legR.rotation.x = -swing;
    this._armL.rotation.x = -swing * 0.85;
    this._armR.rotation.x = swing * 0.85;
    const bob = this.reducedMotion ? 0 : Math.abs(Math.sin(this.walkPhase * 3.2)) * Math.min(0.06, animSpeed * 0.01);
    this._body.position.y = 1.05 + bob;
    this._head.position.y = 1.66 + bob;
    if (!this.grounded) { this._legL.rotation.x = 0.45; this._legR.rotation.x = -0.3; }

    // blob shadow hugs the ground even mid-jump
    this._blob.position.y = (groundY - this.pos.y) + 0.06;
    const air = THREE.MathUtils.clamp(1 - (this.pos.y - groundY) * 0.18, 0.4, 1);
    this._blob.scale.setScalar(air);
    this._blob.material.opacity = 0.3 * air;

    // ---- chase camera ----
    this._camTarget.lerp(new THREE.Vector3(this.pos.x, this.pos.y + 1.55, this.pos.z), 1 - Math.exp(-dt * 9));
    const cp = Math.cos(this.camPitch), sp = Math.sin(this.camPitch);
    const cx = this._camTarget.x + Math.sin(this.camYaw) * this.camDist * cp;
    const cz = this._camTarget.z + Math.cos(this.camYaw) * this.camDist * cp;
    let cy = this._camTarget.y + this.camDist * sp;
    cy = Math.max(cy, f.height(cx, cz) + 0.7);
    this.camera.position.set(cx, cy, cz);
    this.camera.lookAt(this._camTarget.x, this._camTarget.y + 0.35, this._camTarget.z);
  }

  _snapCamera() {
    this._camTarget.set(this.pos.x, this.pos.y + 1.55, this.pos.z);
    const cp = Math.cos(this.camPitch), sp = Math.sin(this.camPitch);
    this.camera.position.set(
      this._camTarget.x + Math.sin(this.camYaw) * this.camDist * cp,
      this._camTarget.y + this.camDist * sp,
      this._camTarget.z + Math.cos(this.camYaw) * this.camDist * cp
    );
    this.camera.lookAt(this._camTarget);
  }
}
