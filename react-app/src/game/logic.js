// ゲームロジック（React に依存しない純粋関数）
import { EVOLVE_AT, FORMS, STORAGE_KEY } from "./constants.js";

export const clamp = (v) => Math.max(0, Math.min(100, v));

export function createInitialState(seen = ["egg"]) {
  return {
    form: "egg", age: 0,
    hunger: 80, happy: 80, clean: 80, energy: 80,
    sleeping: false, careSum: 0, careN: 0, dead: false, seen,
  };
}

export function loadState() {
  try {
    const d = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (d && d.form && FORMS[d.form]) return { ...createInitialState(), ...d };
  } catch (e) { /* 無視 */ }
  return createInitialState();
}

export function saveState(s) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(s)); } catch (e) { /* 無視 */ }
}

export const careScore = (s) => (s.careN ? s.careSum / s.careN : 50);

export const isSad = (s) =>
  !s.sleeping && Math.min(s.hunger, s.happy, s.clean, s.energy) < 25;

// 進化先を返す（進化しないなら null）
export function nextForm(s) {
  const avg = careScore(s);
  const stage = FORMS[s.form].stage;
  if (s.form === "egg" && s.age >= EVOLVE_AT.egg) return "baby";
  if (s.form === "baby" && s.age >= EVOLVE_AT.baby) return avg >= 60 ? "childG" : "childB";
  if (stage === 2 && s.age >= EVOLVE_AT.child) {
    if (avg >= 75 && s.form === "childG") return "adultS";
    return avg >= 55 ? "adultG" : "adultB";
  }
  return null;
}

function applyEvolution(s) {
  const to = nextForm(s);
  if (!to) return s;
  const resetCare = FORMS[to].stage <= 2; // こども期までは進化ごとにスコアをリセット
  return {
    ...s,
    form: to,
    seen: s.seen.includes(to) ? s.seen : [...s.seen, to],
    ...(resetCare ? { careSum: 0, careN: 0 } : {}),
  };
}

// 1 秒ぶんの時間経過
export function tick(s) {
  if (s.dead) return s;
  let n = { ...s, age: s.age + 1 };
  if (n.form !== "egg") {
    if (n.sleeping) {
      n.energy = clamp(n.energy + 2);
      n.hunger = clamp(n.hunger - 0.3);
      if (n.energy >= 100) n.sleeping = false;
    } else {
      n.hunger = clamp(n.hunger - 0.6);
      n.happy = clamp(n.happy - 0.5);
      n.clean = clamp(n.clean - 0.4);
      n.energy = clamp(n.energy - 0.35);
      if (n.clean < 30) n.happy = clamp(n.happy - 0.3);
    }
    n.careSum += (n.hunger + n.happy + n.clean + n.energy) / 4;
    n.careN += 1;
    if (n.hunger <= 0 && n.happy <= 0) return { ...n, dead: true };
  }
  return applyEvolution(n);
}

export const feed = (s) => ({
  ...s,
  hunger: clamp(s.hunger + 30),
  energy: clamp(s.energy + 5),
  clean: clamp(s.clean - 5),
});

export const bath = (s) => ({ ...s, clean: 100, happy: clamp(s.happy + 5) });

export const toggleSleep = (s) => ({ ...s, sleeping: !s.sleeping });

// あそぶの結果を反映（wins: 0〜3）
export const playResult = (s, wins) => ({
  ...s,
  happy: clamp(s.happy + 10 + wins * 10),
  energy: clamp(s.energy - 15),
  hunger: clamp(s.hunger - 10),
});

// 15 秒ごとのつぶやき
export function hintMessage(s) {
  if (s.hunger < 25) return "おなかすいた…🍙";
  if (s.clean < 25) return "からだがかゆい…🛁";
  if (s.energy < 20) return "ねむい…🌙";
  if (s.happy < 25) return "たいくつ…⚽";
  return null;
}
