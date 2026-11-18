# ぷにっち（React 版）

親フォルダの `index.html`（バニラ JS 版）を React + Vite で作り直したもの。ゲーム仕様は親フォルダの `CLAUDE.md` と同じ。

## コマンド

```bash
npm install     # 初回のみ
npm run dev     # 開発サーバー（http://localhost:5173）
npm run build   # dist/ に本番ビルド（base: "./" なので静的ホスティングにそのまま置ける）
```

## 公開（GitHub Pages）

- リポジトリのルートは親フォルダ。この `react-app` はサブフォルダ
- `main` に push すると、リポジトリ直下の `.github/workflows/deploy.yml` が `react-app/` をビルドして GitHub Pages に公開する（https://kouichi-katsuta.github.io/punicchi/）
- `vite.config.js` の `base: "./"` により、`/<リポジトリ名>/` 配下でもパスが壊れない。変更しないこと
- 手順の詳細は `README.md`

## ディレクトリ構成

```
../.github/workflows/deploy.yml   GitHub Pages 自動公開（リポジトリ直下）
public/                  manifest.webmanifest・アイコン（ホーム画面追加用）・favicon
src/
  main.jsx               エントリーポイント
  App.jsx                画面全体のレイアウト・オーバーレイの切り替え
  App.css                スタイル（バニラ版のCSSをほぼそのまま移植）
  game/
    constants.js         FORMS（形態定義）、EVOLVE_AT、ステータス表示情報など
    logic.js             純粋関数のゲームロジック（tick / feed / bath / 進化判定 / 保存）
  hooks/
    useGame.js           useReducer で状態管理 + メッセージ・エフェクト・アニメ・進化演出
    useFitScale.js       画面サイズに合わせて本体を縮小（スマホ対応）
  components/
    Pet.jsx              キャラクターの SVG 描画（形態ごとに JSX で定義）
    StatusBars.jsx       4つのゲージ
    Overlays.jsx         あそぶミニゲーム / 進化 / ゲームオーバー / ずかん
```

## 設計方針

- **ロジックと UI を分離**：`game/logic.js` は React に依存しない純粋関数。状態を受け取って新しい状態を返す。テストやバランス調整はここだけ見ればよい
- **状態管理**：`useGame` 内の `useReducer`。アクションは `TICK` / `FEED` / `BATH` / `TOGGLE_SLEEP` / `PLAY_RESULT` / `RESET`
- **演出は副作用として扱う**：進化ダイアログ・自動起床メッセージ・15秒ごとのつぶやきは、`useEffect` で前回の状態（`prev` ref）と比較して発火する
- **保存**：`localStorage` キー `punicchi`（バニラ版と共通。同じブラウザ・同じオリジンならデータ互換）。5秒ごと・操作時・進化時に保存
- オーバーレイの優先度は ゲームオーバー > 進化 > あそぶ / ずかん（`App.jsx`）

## 形態を追加するとき

1. `game/constants.js` の `FORMS` に追加
2. `components/Pet.jsx` の `Body` の `switch` に SVG を追加
3. `game/logic.js` の `nextForm()` に進化条件を追加

## スマホ対応

- 本体（`.device`）は 360px 固定幅のデザイン。`useFitScale` が画面に収まるよう `transform: scale()` で縮小する（拡大はしない）
- `body` で `touch-action: manipulation` などを指定し、ダブルタップ拡大・長押し選択を無効化
- レイアウトを変えたら 320×568（小型スマホ）でも収まるか確認する

## 注意

- 開発時は React.StrictMode により effect が 2 回走る。`useGame` の effect は `prev` ref 比較で重複発火しないようにしてある
- UI テキストはひらがな中心のトーンを維持する
