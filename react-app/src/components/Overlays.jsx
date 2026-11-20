import { useEffect, useState } from "react";
import { FORMS, QUIZ } from "../game/constants.js";
import Pet from "./Pet.jsx";

function Overlay({ children }) {
  return <div className="overlay">{children}</div>;
}

// あそぶ：○×クイズ（3 もん）
export function PlayGame({ onFinish }) {
  const [questions] = useState(() => [...QUIZ].sort(() => Math.random() - 0.5).slice(0, 3));
  const [round, setRound] = useState(0);
  const [wins, setWins] = useState(0);
  const [result, setResult] = useState(null); // { hit }

  useEffect(() => {
    if (!result) return;
    const id = setTimeout(() => { setResult(null); setRound((r) => r + 1); }, 1500);
    return () => clearTimeout(id);
  }, [result]);

  const answer = (a) => {
    const hit = a === questions[round][1];
    if (hit) setWins((w) => w + 1);
    setResult({ hit });
  };

  if (result) {
    const [, ans, note] = questions[round];
    return (
      <Overlay>
        <div style={{ fontSize: 18 }}>{result.hit ? "せいかい！🎉" : "ざんねん…"}</div>
        <div style={{ fontSize: 36 }}>{ans ? "⭕" : "❌"}</div>
        <div>{note}</div>
      </Overlay>
    );
  }
  if (round >= 3) {
    return (
      <Overlay>
        <div style={{ fontSize: 18 }}>{wins}/3 せいかい！</div>
        <div>きげん +{10 + wins * 10}</div>
        <button className="pill" onClick={() => onFinish(wins)}>OK</button>
      </Overlay>
    );
  }
  return (
    <Overlay>
      <div>○×クイズ（{round + 1}/3）</div>
      <div style={{ fontSize: 17, fontWeight: "bold" }}>{questions[round][0]}</div>
      <div className="row">
        <button className="pill big" onClick={() => answer(true)}>⭕</button>
        <button className="pill big" onClick={() => answer(false)}>❌</button>
      </div>
    </Overlay>
  );
}

export function EvolutionDialog({ from, to, onClose }) {
  return (
    <Overlay>
      <div style={{ fontSize: 24 }}>✨</div>
      <div>{FORMS[from].name} は</div>
      <Pet form={to} size={70} className="static" />
      <div style={{ fontSize: 20, fontWeight: "bold" }}>{FORMS[to].name}</div>
      <div>にしんかした！</div>
      <button className="pill" onClick={onClose}>OK</button>
    </Overlay>
  );
}

export function GameOverDialog({ form, onReset }) {
  return (
    <Overlay>
      <div style={{ fontSize: 30 }}>👼</div>
      <div>{FORMS[form].name} は<br />おそらへ旅立ってしまった…</div>
      <button className="pill big" onClick={onReset}>🥚</button>
    </Overlay>
  );
}

export function DexDialog({ seen, onClose }) {
  const entries = Object.entries(FORMS);
  return (
    <Overlay>
      <div style={{ fontWeight: "bold" }}>📖 ずかん（{seen.length}/{entries.length}）</div>
      <div className="dex-grid">
        {entries.map(([k, f]) => (
          <div key={k} className="dex-item">
            {seen.includes(k) ? (
              <><Pet form={k} size={36} className="static" /><span>{f.name}</span></>
            ) : (
              <><div className="unknown">？</div><span>？？？</span></>
            )}
          </div>
        ))}
      </div>
      <div className="dex-note">お世話のしかたで進化先が変わるよ</div>
      <button className="pill" onClick={onClose}>とじる</button>
    </Overlay>
  );
}
