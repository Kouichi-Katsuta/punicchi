import { useCallback, useEffect, useReducer, useRef, useState } from "react";
import * as L from "../game/logic.js";

function reducer(state, action) {
  switch (action.type) {
    case "TICK":         return L.tick(state);
    case "FEED":         return L.feed(state);
    case "BATH":         return L.bath(state);
    case "TOGGLE_SLEEP": return L.toggleSleep(state);
    case "PLAY_RESULT":  return L.playResult(state, action.wins);
    case "RESET":        return L.createInitialState(state.seen);
    default:             return state;
  }
}

// ゲーム状態と UI 演出（メッセージ・エフェクト・アニメ）をまとめて管理するフック
export function useGame({ paused = false } = {}) {
  const [state, dispatch] = useReducer(reducer, undefined, L.loadState);
  const [message, setMessage] = useState("");
  const [effects, setEffects] = useState([]);   // { id, emoji, left }
  const [anim, setAnim] = useState(null);       // "jump" | "shake" | null
  const [evolution, setEvolution] = useState(null); // { from, to }

  const msgTimer = useRef();
  const animTimer = useRef();
  const prev = useRef(state);

  const say = useCallback((text) => {
    setMessage(text);
    clearTimeout(msgTimer.current);
    msgTimer.current = setTimeout(() => setMessage(""), 2500);
  }, []);

  const fx = useCallback((emoji) => {
    const id = Math.random().toString(36).slice(2);
    setEffects((e) => [...e, { id, emoji, left: 110 + Math.random() * 60 }]);
    setTimeout(() => setEffects((e) => e.filter((x) => x.id !== id)), 1500);
  }, []);

  const animate = useCallback((name) => {
    setAnim(null);
    requestAnimationFrame(() => setAnim(name));
    clearTimeout(animTimer.current);
    animTimer.current = setTimeout(() => setAnim(null), 1300);
  }, []);

  // ゲーム開始時（タイトル画面をぬけたとき）のあいさつ
  useEffect(() => {
    if (paused) return;
    say(state.form === "egg" ? "たまごがうまれそう…" : "おかえり！");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paused]);

  // 1 秒ごとの時間経過（タイトル画面のあいだは止める）
  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => dispatch({ type: "TICK" }), 1000);
    return () => clearInterval(id);
  }, [paused]);

  // 状態変化に応じた演出と保存
  useEffect(() => {
    const p = prev.current;
    if (p.form !== state.form && state.age > 0 && p.age > 0) {
      setEvolution({ from: p.form, to: state.form });
    }
    if (p.sleeping && !state.sleeping && state.energy >= 100) say("よくねた！おはよう！");
    if (state.age !== p.age && state.age % 15 === 0 && !state.sleeping && state.form !== "egg") {
      const hint = L.hintMessage(state);
      if (hint) say(hint);
    }
    if (state.age % 5 === 0 || state.age === p.age || p.form !== state.form) L.saveState(state);
    prev.current = state;
  }, [state, say]);

  const actions = {
    feed() {
      if (state.hunger >= 95) { say("もうおなかいっぱい…"); animate("shake"); return; }
      dispatch({ type: "FEED" }); fx("🍙"); animate("jump"); say("もぐもぐ… おいしい！");
    },
    bath() {
      dispatch({ type: "BATH" }); fx("🫧"); setTimeout(() => fx("🫧"), 300);
      animate("jump"); say("さっぱり〜♪");
    },
    toggleSleep() {
      const willSleep = !state.sleeping;
      dispatch({ type: "TOGGLE_SLEEP" });
      say(willSleep ? "おやすみなさい…" : state.energy < 60 ? "まだねむい…" : "おはよう！");
    },
    canPlay() {
      if (state.energy < 15) { say("つかれてあそべない…"); animate("shake"); return false; }
      return true;
    },
    finishPlay(wins) {
      dispatch({ type: "PLAY_RESULT", wins }); fx("🎵"); animate("jump");
    },
    reset() {
      dispatch({ type: "RESET" }); setEvolution(null); say("あたらしいたまごだ！");
    },
    closeEvolution: () => setEvolution(null),
  };

  return { state, message, effects, anim, evolution, actions };
}
