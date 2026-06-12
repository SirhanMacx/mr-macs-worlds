// main-world.js — entry for world.html?w=<world>. Picks the world definition,
// loads the learning content, boots the engine, drives the loading screen.
import { loadWorldContent } from './learn/content-loader.js';
import { def as tradeWinds } from './worlds/trade-winds.js';
import { def as mindAtlas } from './worlds/mind-atlas.js';
import { createEngine } from './engine/engine.js';

const WORLDS = {
  'global9': tradeWinds, 'trade-winds': tradeWinds,
  'appsych': mindAtlas, 'mind-atlas': mindAtlas,
};

function webglOK() {
  try {
    const c = document.createElement('canvas');
    return !!(window.WebGLRenderingContext && (c.getContext('webgl2') || c.getContext('webgl') || c.getContext('experimental-webgl')));
  } catch (e) { return false; }
}

async function boot() {
  const params = new URLSearchParams(window.location.search);
  const key = (params.get('w') || 'global9').toLowerCase();
  const def = WORLDS[key];
  if (!def) { window.location.replace('./'); return; }

  document.title = `${def.title} — Mr. Mac's Worlds`;
  const loadTitle = document.querySelector('#loading h1');
  const loadMsg = document.getElementById('load-msg');
  const loadBar = document.getElementById('load-bar-fill');
  if (loadTitle) loadTitle.textContent = def.title;

  if (!webglOK()) {
    document.getElementById('loading').style.display = 'none';
    document.getElementById('webgl-fallback').style.display = 'flex';
    return;
  }

  try {
    const content = await loadWorldContent();
    const engine = await createEngine(def, content, {
      onProgress(frac, msg) {
        if (loadBar) loadBar.style.width = Math.round(frac * 100) + '%';
        if (loadMsg) loadMsg.textContent = msg;
      },
    });
    window.MMW = engine; // smoke-test / debug hook

    // Worlds that ship a full game layer (Wave 1+) boot it here. Worlds
    // without one (Mind Atlas, for now) keep the classic explorer behavior.
    if (def.game) {
      const mod = await import(def.game);
      await mod.initGame(engine);
    }

    const lo = document.getElementById('loading');
    lo.classList.add('done');
    setTimeout(() => { lo.style.display = 'none'; }, 650);
  } catch (err) {
    console.error('World failed to load:', err);
    if (loadMsg) loadMsg.textContent = 'Something went wrong loading the world. Refresh to try again.';
    if (loadBar) loadBar.style.background = '#e05b5b';
  }
}

window.addEventListener('DOMContentLoaded', boot);
