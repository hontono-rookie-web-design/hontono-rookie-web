---
description: Verify frontend code by checking lint, build, and runtime errors
---
# フロントエンドコード検証ワークフロー

Next.jsやReactのコードを変更した後に、静的解析エラー・ビルドエラー・実行時エラーを見逃さないための総合的な検証手順です。

以下のステップに従って検証を実行してください。

1. フロントエンドのディレクトリに移動します。
// turbo-all
2. ESLintを使用した静的解析を実行します。警告やエラーがないか確認します。
```bash
cd /home/likr/work/hontono-rookie-web-design/hontono-rookie-web/2026spring/frontend
npm run lint
```
3. TypeScriptの型チェッカーを実行し、型エラーがないか確認します。
```bash
npm run typecheck || npx tsc --noEmit
```
4. Next.jsのプロダクションビルドテストを実行し、ページ構成等で致命的なエラーが発生しないか確認します。
```bash
npm run build
```
5. 開発サーバーの起動とハイドレーション確認
開発サーバー（`npm run dev`）を起動した状態で、ブラウザ（またはBrowser Agent）でページを開きます。画面左下や右下にNext.jsの『Issues（赤いバッジ）』のエラーオーバーレイが出ていないこと（ハイドレーション・ミスマッチがないか）を確認します。

6. 実行時エラー（Runtime Errors）の確認
ブラウザ上でUIを実際に操作し、実行時にエラーでクラッシュしないか検証します。
- ページ全体をスクロールしてもレンダリングエラーが起きないか
- アコーディオンやモーダル、ボタンなど主要なインタラクティブ要素を操作して、ブラウザのコンソールに新しいエラー（Console Error）が出力されないか
- 画面が突然白くなる（White Screen of Death）ようなクラッシュが発生しないか

すべてのCLIコマンドが `Exit code: 0` で終了し、ブラウザ上での実行時のエラー・警告表示も無いことを確認してからタスクを完了としてください。エラーが出た場合は内容を的確に分析して修正してください。
