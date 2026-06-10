// controls.js — first-person-ish ground navigation for Mr. Mac's Worlds.
// Desktop: WASD/arrows to move, mouse drag (or pointer-lock) to look.
// Touch / Chromebook: left on-screen joystick to move, drag right half to look,
// and tap-to-move toward an object. Works without pointer lock so it runs on
// locked-down school devices.
import * as THREE from 'three';

export class Controls {
  constructor(camera, domElement, opts = {}) {
    this.camera = camera;
    this.dom = domElement;
    this.enabled = true;
    this.speed = opts.speed ?? 12;          // units / second
    this.lookSpeed = opts.lookSpeed ?? 0.0024;
    this.touchLookSpeed = opts.touchLookSpeed ?? 0.005;
    this.eyeHeight = opts.eyeHeight ?? 2.2;
    this.bounds = opts.bounds ?? 70;        // soft world radius
    this.reducedMotion = opts.reducedMotion ?? false;

    this.yaw = 0;
    this.pitch = 0;
    this.move = { f: 0, b: 0, l: 0, r: 0 };
    this.joyVec = { x: 0, y: 0 };           // -1..1 from touch joystick
    this._keyLook = { x: 0, y: 0 };
    this._velocity = new THREE.Vector3();
    this._dragging = false;
    this._lastPointer = { x: 0, y: 0 };
    this._dragId = null;

    // tap-to-move target (set externally by the engine on object tap)
    this.autoTarget = null;

    this._bindKeyboard();
    this._bindMouse();
    this._buildTouchUI();
    this.isTouch = matchMedia('(pointer: coarse)').matches || 'ontouchstart' in window;
    if (this.isTouch) this.touchUI.style.display = 'block';
  }

  setReducedMotion(v) { this.reducedMotion = v; }

  // ---------- keyboard ----------
  _bindKeyboard() {
    const down = (e) => {
      if (!this.enabled) return;
      switch (e.code) {
        case 'KeyW': case 'ArrowUp': this.move.f = 1; break;
        case 'KeyS': case 'ArrowDown': this.move.b = 1; break;
        case 'KeyA': this.move.l = 1; break;
        case 'KeyD': this.move.r = 1; break;
        case 'ArrowLeft': this._keyLook.x = -1; break;
        case 'ArrowRight': this._keyLook.x = 1; break;
        default: return;
      }
      this.autoTarget = null;
    };
    const up = (e) => {
      switch (e.code) {
        case 'KeyW': case 'ArrowUp': this.move.f = 0; break;
        case 'KeyS': case 'ArrowDown': this.move.b = 0; break;
        case 'KeyA': this.move.l = 0; break;
        case 'KeyD': this.move.r = 0; break;
        case 'ArrowLeft': case 'ArrowRight': this._keyLook.x = 0; break;
      }
    };
    // store so we can detach if needed
    this._kd = down; this._ku = up;
    window.addEventListener('keydown', down);
    window.addEventListener('keyup', up);
  }

  // ---------- mouse look (drag; no pointer-lock requirement) ----------
  _bindMouse() {
    const el = this.dom;
    el.addEventListener('pointerdown', (e) => {
      if (!this.enabled || e.pointerType === 'touch') return;
      // don't start look-drag when clicking UI
      if (e.target.closest('.ui-block, #joystick, #touch-look')) return;
      this._dragging = true;
      this._lastPointer = { x: e.clientX, y: e.clientY };
      el.setPointerCapture?.(e.pointerId);
    });
    el.addEventListener('pointermove', (e) => {
      if (!this._dragging || e.pointerType === 'touch') return;
      const dx = e.clientX - this._lastPointer.x;
      const dy = e.clientY - this._lastPointer.y;
      this._lastPointer = { x: e.clientX, y: e.clientY };
      this.yaw -= dx * this.lookSpeed;
      this.pitch -= dy * this.lookSpeed;
      this._clampPitch();
    });
    const stop = () => { this._dragging = false; };
    el.addEventListener('pointerup', stop);
    el.addEventListener('pointercancel', stop);
    el.addEventListener('pointerleave', stop);
  }

  // ---------- touch UI: joystick (move) + right-half look ----------
  _buildTouchUI() {
    const wrap = document.createElement('div');
    wrap.id = 'touch-ui';
    wrap.style.display = 'none';
    wrap.innerHTML = `
      <div id="joystick" aria-label="Move joystick"><div id="joystick-knob"></div></div>
      <div id="touch-look" aria-hidden="true"></div>
    `;
    document.body.appendChild(wrap);
    this.touchUI = wrap;

    const joy = wrap.querySelector('#joystick');
    const knob = wrap.querySelector('#joystick-knob');
    let joyId = null, cx = 0, cy = 0, R = 48;

    const startJoy = (e) => {
      const t = e.changedTouches ? e.changedTouches[0] : e;
      joyId = t.identifier ?? 'mouse';
      const r = joy.getBoundingClientRect();
      cx = r.left + r.width / 2; cy = r.top + r.height / 2; R = r.width / 2;
      this.autoTarget = null;
      moveJoy(e);
    };
    const moveJoy = (e) => {
      if (joyId === null) return;
      let t = null;
      if (e.changedTouches) { for (const c of e.changedTouches) if (c.identifier === joyId) t = c; }
      else t = e;
      if (!t) return;
      let dx = t.clientX - cx, dy = t.clientY - cy;
      const d = Math.hypot(dx, dy) || 1;
      const cl = Math.min(d, R);
      dx = dx / d * cl; dy = dy / d * cl;
      knob.style.transform = `translate(${dx}px, ${dy}px)`;
      this.joyVec.x = dx / R;
      this.joyVec.y = dy / R;
    };
    const endJoy = (e) => {
      joyId = null; this.joyVec.x = 0; this.joyVec.y = 0;
      knob.style.transform = 'translate(0,0)';
    };
    joy.addEventListener('touchstart', (e) => { e.preventDefault(); startJoy(e); }, { passive: false });
    joy.addEventListener('touchmove', (e) => { e.preventDefault(); moveJoy(e); }, { passive: false });
    joy.addEventListener('touchend', endJoy);
    joy.addEventListener('touchcancel', endJoy);
    // also let mouse drive the joystick (Chromebook trackpad / testing)
    joy.addEventListener('mousedown', (e) => { e.preventDefault(); startJoy(e);
      const mm = (ev) => moveJoy(ev); const mu = () => { endJoy(); window.removeEventListener('mousemove', mm); window.removeEventListener('mouseup', mu); };
      window.addEventListener('mousemove', mm); window.addEventListener('mouseup', mu); });

    // right half = look
    const look = wrap.querySelector('#touch-look');
    let lookId = null, lx = 0, ly = 0;
    look.addEventListener('touchstart', (e) => {
      const t = e.changedTouches[0]; lookId = t.identifier; lx = t.clientX; ly = t.clientY;
      this.autoTarget = null;
    }, { passive: true });
    look.addEventListener('touchmove', (e) => {
      let t = null; for (const c of e.changedTouches) if (c.identifier === lookId) t = c;
      if (!t) return;
      this.yaw -= (t.clientX - lx) * this.touchLookSpeed;
      this.pitch -= (t.clientY - ly) * this.touchLookSpeed;
      this._clampPitch();
      lx = t.clientX; ly = t.clientY;
    }, { passive: true });
    const endLook = () => { lookId = null; };
    look.addEventListener('touchend', endLook);
    look.addEventListener('touchcancel', endLook);
  }

  _clampPitch() {
    const lim = Math.PI / 2 - 0.05;
    this.pitch = Math.max(-lim, Math.min(lim, this.pitch));
  }

  // set a world-space tap target; camera will glide toward it
  setAutoTarget(v3) { this.autoTarget = v3 ? v3.clone() : null; }

  update(dt) {
    if (!this.enabled) return;
    // arrow-key look
    this.yaw -= this._keyLook.x * 1.6 * dt;

    // orientation
    const q = new THREE.Quaternion().setFromEuler(new THREE.Euler(this.pitch, this.yaw, 0, 'YXZ'));
    this.camera.quaternion.copy(q);

    // movement basis (flatten to ground plane)
    const forward = new THREE.Vector3(0, 0, -1).applyQuaternion(q); forward.y = 0; forward.normalize();
    const right = new THREE.Vector3(1, 0, 0).applyQuaternion(q); right.y = 0; right.normalize();

    let fb = (this.move.f - this.move.b) - this.joyVec.y; // joystick up = forward
    let lr = (this.move.r - this.move.l) + this.joyVec.x;

    const dir = new THREE.Vector3();

    // tap-to-move auto navigation (mobile-friendly)
    if (this.autoTarget && Math.abs(fb) < 0.05 && Math.abs(lr) < 0.05) {
      const to = this.autoTarget.clone(); to.y = 0;
      const here = this.camera.position.clone(); here.y = 0;
      const delta = to.sub(here);
      const dist = delta.length();
      if (dist > 3.2) {
        delta.normalize();
        dir.add(delta);
        // gently steer view toward the target
        const want = Math.atan2(delta.x, delta.z) + Math.PI;
        let d = ((want - this.yaw + Math.PI * 3) % (Math.PI * 2)) - Math.PI;
        this.yaw += d * Math.min(1, dt * 2.2);
      } else {
        this.autoTarget = null;
      }
    } else {
      dir.addScaledVector(forward, fb).addScaledVector(right, lr);
    }

    if (dir.lengthSq() > 0) {
      dir.normalize();
      this._velocity.copy(dir).multiplyScalar(this.speed * dt);
      this.camera.position.add(this._velocity);
    }

    // keep on the ground & inside soft bounds
    this.camera.position.y = this.eyeHeight;
    const r = Math.hypot(this.camera.position.x, this.camera.position.z);
    if (r > this.bounds) {
      const s = this.bounds / r;
      this.camera.position.x *= s; this.camera.position.z *= s;
    }
  }
}
