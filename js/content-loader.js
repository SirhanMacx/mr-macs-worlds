// content-loader.js — fetches and caches the question banks + world content.
const cache = {};

async function getJSON(path) {
  if (cache[path]) return cache[path];
  const res = await fetch(path);
  if (!res.ok) throw new Error(`Failed to load ${path}: ${res.status}`);
  const data = await res.json();
  cache[path] = data;
  return data;
}

export async function loadWorldContent() {
  return getJSON('./data/world-content.json');
}

export async function loadBank(course) {
  const file = course === 'appsych' ? './data/appsych-bank.json' : './data/global9-bank.json';
  return getJSON(file);
}

// Fisher–Yates
export function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Pull N questions from a loaded bank, optionally filtered by topic.
export function drawQuestions(bank, n, topic = null) {
  let pool = bank.questions;
  if (topic) pool = pool.filter(q => q.topic === topic);
  if (pool.length === 0) pool = bank.questions;
  return shuffle(pool).slice(0, Math.min(n, pool.length));
}
