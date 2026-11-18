import { useState } from "react";
import { FORMS, STAGE_NAMES } from "./game/constants.js";
import { isSad } from "./game/logic.js";
import { useGame } from "./hooks/useGame.js";
import { useFitScale } from "./hooks/useFitScale.js";
import Pet from "./components/Pet.jsx";
import StatusBars from "./components/StatusBars.jsx";
import { DexDialog, EvolutionDialog, GameOverDialog, PlayGame } from "./components/Overlays.jsx";

const DIRT_POS = [[40, 220], [250, 230], [70, 150]];

export default function App() {
  const { state, message, effects, anim, evolution, actions } = useGame();
  const [modal, setModal] = useState(null); // "play" | "dex" | null
  const [deviceRef, scale] = useFitScale();

  const form = FORMS[state.form];
  const isEgg = state.form === "egg";
  const disabled = state.sleeping || isEgg || state.dead;
  const dirtCount = state.clean < 30 ? 3 : state.clean < 60 ? 1 : 0;

  const startPlay = () => { if (actions.canPlay()) setModal("play"); };
  const reset = () => { actions.reset(); setModal(null); };

  // 表示するオーバーレイ（優先度順）
  let overlay = null;
  if (state.dead) overlay = <GameOverDialog form={state.form} onReset={reset} />;
  else if (evolution) overlay = <EvolutionDialog {...evolution} onClose={actions.closeEvolution} />;
  else if (modal === "play") overlay = <PlayGame onFinish={(w) => { actions.finishPlay(w); setModal(null); }} />;
  else if (modal === "dex") overlay = <DexDialog seen={state.seen} onClose={() => setModal(null)} />;

  return (
    <div className="device" ref={deviceRef} style={{ transform: `scale(${scale})` }}>
      <div className="title">ぷにっち</div>
      <div className={`screen ${state.sleeping ? "night" : ""}`}>
        <StatusBars state={state} />
        <div className="info">
          {form.name}（{STAGE_NAMES[form.stage]}） {Math.floor(state.age / 60)}分{state.age % 60}秒
        </div>

        {DIRT_POS.slice(0, dirtCount).map(([x, y], i) => (
          <div key={i} className="dirt" style={{ left: x, top: y }}>💩</div>
        ))}
        {state.sleeping && <div className="zzz">💤</div>}

        <Pet form={state.form} sleeping={state.sleeping} sad={isSad(state)} anim={anim} />

        {effects.map((e) => (
          <div key={e.id} className="fx" style={{ left: e.left, top: 120 }}>{e.emoji}</div>
        ))}
        <div className="msg">{message}</div>
        {overlay}
      </div>

      <div className="buttons">
        <button disabled={disabled} onClick={actions.feed}>🍙<span>ごはん</span></button>
        <button disabled={disabled} onClick={startPlay}>⚽<span>あそぶ</span></button>
        <button disabled={disabled} onClick={actions.bath}>🛁<span>おふろ</span></button>
        <button disabled={isEgg || state.dead} onClick={actions.toggleSleep}>
          {state.sleeping ? <>☀️<span>おきる</span></> : <>🌙<span>ねる</span></>}
        </button>
      </div>
      <div className="sub">
        <button onClick={() => setModal("dex")}>📖 ずかん</button>
        <button onClick={() => { if (confirm("さいしょからやりなおす？")) reset(); }}>🥚 さいしょから</button>
      </div>
    </div>
  );
}
