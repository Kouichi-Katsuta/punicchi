import { useEffect, useState } from "react";
import { FORMS } from "../game/constants.js";
import Pet from "./Pet.jsx";

function Overlay({ children }) {
  return <div className="overlay">{children}</div>;
}

// あそぶ：左右どっちを向くか当てるミニゲーム（3 ラウンド）
export function PlayGame({ onFinish }) {
  const [round, setRound] = useState(0);
  const [wins, setWins] = useState(0);
  const [result, setResult] = useState(null); // { ans, hit }

  useEffect(() => {
    if (!result) return;
    const id = setTimeout(() => { setResult(null); setRound((r) => r + 1); }, 800);
    return () => clearTimeout(id);
  }, [result]);

  const guess = (d) => {
    const ans = Math.random() < 0.5 ? 0 : 1;
    const hit = d === ans;
    if (hit) setWins((w) => w + 1);
    setResult({ ans, hit });
  };

  if (result) {
    return (
      <Overlay>
        <div style={{ fontSize: 40 }}>{result.ans ? "➡️" : "⬅️"}</div>
        <div style={{ fontSize: 18 }}>{result.hit ? "あたり！🎉" : "はずれ…"}</div>
      </Overlay>
    );
  }
  if (round >= 3) {
    return (
      <Overlay>
        <div style={{ fontSize: 18 }}>{wins}/3 あたり！</div>
        <div>きげん +{10 + wins * 10}</div>
        <button className="pill" onClick={() => onFinish(wins)}>OK</button>
      </Overlay>
    );
  }
  return (
    <Overlay>
      <div>どっちを向くかな？（{round + 1}/3）</div>
      <div className="row">
        <button className="pill big" onClick={() => guess(0)}>⬅️</button>
        <button className="pill big" onClick={() => guess(1)}>➡️</button>
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
