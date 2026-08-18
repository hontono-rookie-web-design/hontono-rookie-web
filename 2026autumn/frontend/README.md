# 本当のルーキー祭り2026春 Webサイト frontend

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

---

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

## ページの編集

ページは `app/page.tsx` を編集することで更新できます。

ファイルを保存すると、開発サーバー上で自動的に反映されます。

## フォント

本プロジェクトでは、`next/font` を利用して Vercel の **Geist** フォントを自動的に最適化・読み込みしています。

---

# イベントフェーズ管理

本サイトでは、イベントの進行状況に応じて画面表示を切り替えるため、環境変数によるフェーズ管理を行っています。

## 本戦フェーズ

本戦（オープニングステージ~決勝）は 環境変数`NEXT_PUBLIC_EVENT_PHASE` により制御します。

### 設定可能な値

| 値                   | 内容                         |
| -------------------- | ---------------------------- |
| `before`             | 開催前                       |
| `opening`            | オープニングステージ投稿期間 |
| `rookie`             | ルーキー投稿期間             |
| `prelim`             | 予選投票期間                 |
| `prelim_counting`    | 予選集計中                   |
| `semifinal`          | 準決勝投票期間               |
| `semifinal_counting` | 準決勝集計中                 |
| `final`              | 決勝投票期間                 |
| `final_counting`     | 決勝集計中                   |
| `after`              | イベント終了後               |

### 設定例

```env
NEXT_PUBLIC_EVENT_PHASE=prelim
```

---

## Exステージフェーズ

Exステージは本戦とは独立しており、`NEXT_PUBLIC_EVENT_PHASE_EX` により制御します。

### 設定可能な値

| 値           | 内容     |
| ------------ | -------- |
| `before`     | 開催前   |
| `submission` | 投稿期間 |
| `voting`     | 投票期間 |
| `counting`   | 集計中   |
| `after`      | 終了後   |

### 設定例

```env
NEXT_PUBLIC_EVENT_PHASE_EX=submission
```

---

## フェーズの変更方法

ローカル開発では `.env.local` の環境変数を変更してください。

例：

```env
# 本戦
NEXT_PUBLIC_EVENT_PHASE=final

# Exステージ
NEXT_PUBLIC_EVENT_PHASE_EX=voting
```

本番環境では、デプロイ先の環境変数を変更してください。

環境変数を変更した場合は、開発サーバーを再起動すると反映されます。

```bash
npm run dev
```

---

## コードでの利用方法

現在のフェーズは以下の関数から取得できます。

### 本戦

```ts
const phase = getCurrentPhase();
```

### Exステージ

```ts
const phase = getCurrentPhaseEx();
```

各ページでは取得したイベントフェーズをページ固有の表示フェーズへ変換し、その値に応じて表示内容を切り替えています。

例：

```ts
const viewPhase = getViewPhase(phase);
```

これにより、開催前・投稿期間・投票期間・集計中・終了後など、イベントの進行状況に応じた画面表示を実現しています。

---

# Learn More

Next.js の詳細については、以下のリソースを参照してください。

- [Next.js Documentation](https://nextjs.org/docs) - Learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - An interactive Next.js tutorial.

You can check out the [Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

---

# Deploy on Vercel

このプロジェクトは Vercel へのデプロイをサポートしています。

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

詳細については、以下のドキュメントを参照してください。

- [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying)
