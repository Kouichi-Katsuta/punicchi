# ぷにっち育成

小さな生き物を育てて進化させるブラウザ育成ゲーム（React + Vite）。スマホ対応。

## ローカルで動かす

```bash
npm install
npm run dev        # http://localhost:5173
npm run dev -- --host   # 同じWi-Fiのスマホからも確認できる
```

## GitHub Pages で公開する（初回のみ）

1. GitHub で新しいリポジトリを作る（例: `punicchi`）
2. この `react-app` フォルダをリポジトリのルートとして push する
   ```bash
   cd react-app
   git init
   git add .
   git commit -m "first commit"
   git branch -M main
   git remote add origin https://github.com/<ユーザー名>/punicchi.git
   git push -u origin main
   ```
3. GitHub のリポジトリ画面で **Settings → Pages → Build and deployment → Source** を **GitHub Actions** にする
4. **Actions** タブでワークフロー「Deploy to GitHub Pages」が完了するのを待つ
   （3 の前に push して失敗していたら、Actions タブから **Re-run** する）
5. `https://<ユーザー名>.github.io/punicchi/` で公開される。この URL を友人に送れば OK

以降は `main` に push するたびに自動でビルド・公開される（`.github/workflows/deploy.yml`）。

## スマホで遊ぶ

- URL をスマホのブラウザで開くだけで遊べる
- **ホーム画面に追加**するとアプリのように全画面で起動できる
  - iPhone（Safari）: 共有ボタン → 「ホーム画面に追加」
  - Android（Chrome）: メニュー → 「ホーム画面に追加」
- セーブデータは端末のブラウザごとに保存される（端末間の引き継ぎはなし）
