// read-aloud.js — Web Speech API helper for ENL / accessibility support.
// Pattern ported from the arcade's read-aloud engine, slimmed to this
// codebase: browser-native speechSynthesis ONLY (no network calls, no
// libraries, nothing leaves the device) and a graceful no-op everywhere
// when speech is unavailable. Any element with class `read-btn` is wired
// through one document-level listener:
//   data-text (required) — what to read
//   data-lang (optional) — BCP-47 tag, default "en-US"
const DEFAULT_LANG = 'en-US';
const DEFAULT_RATE = 0.95;

// Speaker glyph — monoline SVG, no emoji (house rule).
const SPEAKER_SVG =
  '<svg width="13" height="13" viewBox="0 0 24 24" fill="none"' +
  ' stroke="currentColor" stroke-width="1.9" stroke-linecap="round"' +
  ' stroke-linejoin="round" aria-hidden="true" focusable="false">' +
  '<path d="M5 10 H8 L12 6 V18 L8 14 H5 Z"/>' +
  '<path d="M15 9 C16.6 10.4 16.6 13.6 15 15"/>' +
  '<path d="M17.5 6.5 C20.5 9 20.5 15 17.5 17.5"/></svg>';

export function available() {
  return typeof window.speechSynthesis !== 'undefined' &&
         typeof window.SpeechSynthesisUtterance !== 'undefined';
}

// ---- voice selection (cached per language; Chrome loads voices async) ----
let voiceCache = {};
function pickVoice(lang) {
  if (!available()) return null;
  if (Object.prototype.hasOwnProperty.call(voiceCache, lang)) return voiceCache[lang];
  let voices = [];
  try { voices = window.speechSynthesis.getVoices() || []; } catch (e) { /* no-op */ }
  const lower = String(lang || DEFAULT_LANG).toLowerCase();
  const prefix = lower.split('-')[0];
  let exactLocal = null, exact = null, prefixLocal = null, prefixAny = null;
  for (const v of voices) {
    const vl = String(v.lang || '').toLowerCase().replace(/_/g, '-');
    if (vl === lower) {
      if (v.localService && !exactLocal) exactLocal = v;
      if (!exact) exact = v;
    } else if (vl.indexOf(prefix + '-') === 0 || vl === prefix) {
      if (v.localService && !prefixLocal) prefixLocal = v;
      if (!prefixAny) prefixAny = v;
    }
  }
  const best = exactLocal || exact || prefixLocal || prefixAny || null;
  voiceCache[lang] = best;
  return best;
}
if (available()) {
  try { window.speechSynthesis.addEventListener('voiceschanged', () => { voiceCache = {}; }); }
  catch (e) { /* no-op */ }
}

// ---- speak / stop ----
let currentBtn = null;

export function stop() {
  if (available()) {
    try { window.speechSynthesis.cancel(); } catch (e) { /* no-op */ }
  }
  if (currentBtn) {
    try { currentBtn.setAttribute('aria-pressed', 'false'); } catch (e) { /* no-op */ }
  }
  currentBtn = null;
}

export function speak(text, { lang = DEFAULT_LANG, rate = DEFAULT_RATE, button = null } = {}) {
  if (!available()) return false;
  text = String(text == null ? '' : text).trim();
  if (!text) return false;
  stop();
  try {
    const u = new window.SpeechSynthesisUtterance(text);
    u.lang = lang;
    const voice = pickVoice(lang);
    if (voice) u.voice = voice;
    u.rate = rate; u.pitch = 1; u.volume = 1;
    u.onend = () => { if (currentBtn === button || !button) stop(); };
    u.onerror = u.onend;
    if (button) {
      currentBtn = button;
      button.setAttribute('aria-pressed', 'true');
    }
    window.speechSynthesis.speak(u);
    return true;
  } catch (err) {
    stop();
    return false;
  }
}

// ---- button factory (returns '' when speech is unavailable) ----
function escAttr(s) {
  return String(s == null ? '' : s).replace(/&/g, '&amp;')
    .replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}
export function buttonHTML(text, { lang = DEFAULT_LANG, label = 'Read aloud', extraClass = '' } = {}) {
  if (!available()) return '';
  return `<button class="read-btn${extraClass ? ' ' + extraClass : ''}" type="button"` +
         ` aria-label="${escAttr(label)}" aria-pressed="false"` +
         ` data-text="${escAttr(text)}" data-lang="${escAttr(lang)}">${SPEAKER_SVG}</button>`;
}

// ---- document-level wiring ----
document.addEventListener('click', (e) => {
  const btn = e.target && e.target.closest && e.target.closest('.read-btn');
  if (!btn) return;
  e.preventDefault();
  e.stopPropagation();
  if (!available()) return;
  if (currentBtn === btn) { stop(); return; } // tap again = stop
  const text = btn.dataset.text || (btn.parentNode ? btn.parentNode.textContent : '');
  speak(text, { lang: btn.dataset.lang || DEFAULT_LANG, button: btn });
});

// Battery / sanity: never keep speaking when the page is hidden or gone.
window.addEventListener('pagehide', stop);
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'hidden') stop();
});
