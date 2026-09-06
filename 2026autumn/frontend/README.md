# 本当のルーキー祭り2026秋 Webサイト frontend

このサイトは[Next.js](https://nextjs.org)プロジェクトです。[`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app)により作成されました。

# 開発環境

## 開発サーバーの起動

開発サーバーを起動するには、以下のいずれかのコマンドを実行してください。

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

ブラウザで以下を開くと動作を確認できます。

```
http://localhost:3000
```

# イベントフェーズ管理

本サイトでは、イベントの進行状況に応じて画面表示を切り替えるため、環境変数によるフェーズ管理を行っています。

## 本戦フェーズ

本戦（exステージ〜決勝）は環境変数 `EVENT_PHASE` により制御します。

### 設定可能な値

| 値                | 内容               |
| ----------------- | ------------------ |
| `before`          | 開催前             |
| `extra`           | exステージ投稿期間 |
| `rookie`          | ルーキー投稿期間   |
| `prelim`          | 予選投票期間       |
| `prelim_counting` | 予選集計中         |
| `final`           | 決勝投票期間       |
| `final_counting`  | 決勝集計中         |
| `after`           | イベント終了後     |

## SPステージフェーズ

SPステージは本戦とは独立しており、`EVENT_PHASE_SP` により制御します。

### 設定可能な値

| 値           | 内容     |
| ------------ | -------- |
| `before`     | 開催前   |
| `submission` | 投稿期間 |
| `voting`     | 投票期間 |
| `counting`   | 集計中   |
| `after`      | 終了後   |

詳しくは `frontend/src/config/phase.ts`を参照してください

## フェーズの変更方法

ローカル開発をする場合、まずGoogleドライブ共有フォルダからフロンドエンドの `.env.development.example` をダウンロードしてください。

それをこのフォルダ内に配置し、名前を `.env.development` に変更してください。

ファイルの中身のうち、`<>`で囲まれているところがあれば、あなたの環境に合わせて書き換えてください。

例：

```env
# 本戦
EVENT_PHASE="final"

# SPステージ
EVENT_PHASE_SP="voting"
```

### 本番環境のデータで試す場合

1. `.env.production.example` をダウンロードしてください
2. `.env.production` という名前に変えてください
3. 適宜内容を変更してください
4. `npm run build && npm run start` で本番モードで起動してください

## Cloudflareにおける環境変数の設定

CloudflareのdashboardからGUIで設定してください。

# Next.jsについて

Next.js の詳細については、以下のリソースを参照してください。

- [Next.js Documentation](https://nextjs.org/docs) - Learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - An interactive Next.js tutorial.

You can check out the [Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!
