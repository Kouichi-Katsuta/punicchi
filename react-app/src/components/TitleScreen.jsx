import { useState } from "react";
import Pet from "./Pet.jsx";

// ロゴ画像。public/logo.svg を差し替えるか、ここのファイル名を変える（png / jpg なども可）
// 画像が読めないときは文字ロゴを表示する
const LOGO_SRC = `${import.meta.env.BASE_URL}logo.svg`;

export default function TitleScreen({ state, onStart }) {
  const [logoFailed, setLogoFailed] = useState(false);
  const hasSave = state.age > 0 && !state.dead;

  return (
    <div className="title-screen">
      {logoFailed ? (
        <div className="title-logo-text">ぷにっち</div>
      ) : (
        <img className="title-logo" src={LOGO_SRC} alt="ぷにっち" onError={() => setLogoFailed(true)} />
      )}
      <div className="title-pet">
        {/* anim="still" で本体用の bounce（translateX つき）を外す */}
        <Pet form={state.form} size={110} anim="still" className="static" />
      </div>
      <button className="title-start" onClick={onStart}>{hasSave ? "つづきから" : "はじめる"}</button>
    </div>
  );
}
