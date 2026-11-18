# ぷにっち育成

小さな生き物を育てて進化させるブラウザ育成ゲーム（React + Vite）。スマホ対応。

## ローカルで動かす

```bash
npm install
npm run dev        # http://localhost:5173
npm run dev -- --host   # 同じWi-Fiのスマホからも確認できる
```

## GitHub Pages で公開する（初回のみ）

リポジトリ: https://github.com/Kouichi-Katsuta/punicchi （この `react-app` はリポジトリ内のサブフォルダ）

1. GitHub のリポジトリ画面で **Settings → Pages → Build and deployment → Source** を **GitHub Actions** にする
2. **Actions** タブでワークフロー「Deploy to GitHub Pages」が完了するのを待つ
   （1 の前に push して失敗していたら、Actions タブから **Re-run all jobs** する）
3. https://kouichi-katsuta.github.io/punicchi/ で公開される。この URL を友人に送れば OK

以降は `main` に push するたびに自動でビルド・公開される（リポジトリ直下の `.github/workflows/deploy.yml` が `react-app/` をビルドする）。

## スマホで遊ぶ

- URL をスマホのブラウザで開くだけで遊べる
- **ホーム画面に追加**するとアプリのように全画面で起動できる
  - iPhone（Safari）: 共有ボタン → 「ホーム画面に追加」
  - Android（Chrome）: メニュー → 「ホーム画面に追加」
- セーブデータは端末のブラウザごとに保存される（端末間の引き継ぎはなし）
