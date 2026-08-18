# Commit・Pull Request時の自動チェックについて

このRepositoryでは、コードの品質を保つために、Pull Requestの作成・更新時にGitHub Actionsによる **Status Check** が自動で実行されます。

また、任意でpre-commitを導入すると、Commit時にもコードフォーマットや基本的なファイルチェックを自動で実行できます。

基本的な流れは以下です。

```text
コードを変更
    ↓
git add
    ↓
git commit
    ↓
git push
    ↓
Pull Request
    ↓
Status Check
    ↓
Review・Merge
```

このページでは、それぞれのチェックと、`Failed` になった場合の対応方法を説明します。

<details>
<summary><strong>Commit時にpre-commitを使用する（任意）</strong></summary>

pre-commitを設定している場合は、`git commit` を実行するとCommitの前にpre-commitが自動で実行されます。

pre-commitでは、主に以下を行います。

- Black・isortによるPythonコードのフォーマット
- PrettierによるFrontendコードのフォーマット
- YAML / JSONなどの基本的な構文チェック
- merge conflictや秘密鍵などの基本的なチェック

pre-commitの使用は任意です。

導入していない場合は、通常どおり以下の操作でCommitできます。

```bash
git add <変更したファイル>
git commit -m "変更内容"
```

pre-commitのインストールやGit Hookの設定方法については、`setup-guide.md` を参照してください。

## Passedになった場合

以下のように、すべてのチェックが `Passed` になればCommitは完了します。

```text
isort...........................................................Passed
black...........................................................Passed
Prettier (Frontend).............................................Passed
```

そのままPushしてください。

```bash
git push origin <ブランチ名>
```

## Failedになった場合

`Failed` になった場合、Commitは完了していません。

エラーの内容を確認してから、再度Commitします。

### ファイルが自動修正された場合

Black、isort、Prettierなどがファイルを自動修正すると、例えば以下のように表示されます。

```text
Prettier (Frontend).............................................Failed
- files were modified by this hook
```

この場合は、修正内容を確認します。

```bash
git status
git diff
```

問題がなければ、修正されたファイルを再度ステージングしてCommitします。

```bash
git add <修正されたファイル>
git commit -m "変更内容"
```

```text
git commit
    ↓
pre-commitがファイルを修正
    ↓
Failed
    ↓
git add
    ↓
git commit
    ↓
Passed
    ↓
Commit完了
```

> [!NOTE]
> pre-commitがファイルを書き換えた場合、その変更をCommitに含めるために再度 `git add` が必要です。

### 自動修正されないエラーの場合

エラーメッセージを確認してコードを修正し、再度以下を実行してください。

```bash
git add <修正したファイル>
git commit -m "変更内容"
```

> [!NOTE]
> `git commit --no-verify` を使用すると、設定しているpre-commitを一時的にスキップできます。
>
> 通常はpre-commitで発生した問題を確認・修正してからCommitしてください。

</details>

## Pull Request時のStatus Check

Pull Requestを作成・更新すると、GitHub Actionsによる **Status Check** が自動で実行されます。

Frontendについては、以下の3つを確認します。

| Check | 内容 |
| --- | --- |
| `Frontend ESLint` | ESLintによる静的解析 |
| `Frontend Type Check` | TypeScriptの型チェック |
| `Frontend Build` | Next.jsのProduction Build |

3つはそれぞれ独立して実行されます。

例えば、

```text
✓ Frontend ESLint
✗ Frontend Type Check
✓ Frontend Build
```

となっている場合は、TypeScriptの型チェックに問題があります。

必要なStatus Checkがすべて成功してからPull RequestをMergeしてください。

## Status CheckがFailedになった場合

FailedになったCheckをGitHub上で開き、実行ログのエラーを確認してください。

コードを修正したら、通常と同じようにCommit・Pushします。

```bash
git add <修正したファイル>
git commit -m "エラーを修正"
git push origin <ブランチ名>
```

同じBranchへPushするとPull Requestが自動的に更新され、Status Checkも再実行されます。

**Pull Requestを作り直す必要はありません。**

```text
Status Check
    ↓
Failed
    ↓
エラーを確認・修正
    ↓
git add
    ↓
git commit
    ↓
git push
    ↓
Status Check再実行
```

## WarningとError

ESLintでは、問題によって `warning` または `error` が表示されます。

| 表示 | 扱い |
| --- | --- |
| `warning` | 警告は表示されるが、現在はCheckを失敗させない |
| `error` | CheckがFailedになるため修正が必要 |

例えば、

```text
✖ 10 problems (0 errors, 10 warnings)
```

であればCheckは成功します。

```text
✖ 10 problems (1 error, 9 warnings)
```

であればCheckは失敗します。

warningについても、必要に応じて順次修正してください。

<details>
<summary><strong>ローカルでStatus Checkと同じ確認をする（任意）</strong></summary>

GitHubへPushする前に、自分のPCでStatus Checkと同じ確認をすることもできます。

対象開催期のFrontendディレクトリへ移動します。

```bash
cd <開催期>/frontend
```

以下を実行します。

```bash
npm run lint
npm run typecheck
npm run build
```

それぞれ以下の確認を行います。

| コマンド | 内容 |
| --- | --- |
| `npm run lint` | ESLintによる静的解析 |
| `npm run typecheck` | TypeScriptの型チェック |
| `npm run build` | Production Build |

大きな変更を行った場合などは、Push前に実行しておくとエラーに早く気づくことができます。

</details>

## Frontendを変更していない場合

Frontendに変更がないPull RequestでもStatus Check自体は実行されます。

その場合は、

```text
No Frontend changes found.
```

として正常終了します。

## 困ったとき

まず現在の状態を確認します。

```bash
git status
```

変更内容を確認する場合は、以下を使用します。

```bash
git diff
```

ステージング済みの変更を確認する場合は、以下を使用します。

```bash
git diff --cached
```

解決できない場合は、以下を共有して他の開発者へ確認してください。

- 実行したコマンド
- 表示されたエラーメッセージ
- FailedになったCheck

## まとめ

このRepositoryでは、Pull Request時のStatus Checkによってコードを自動で確認します。

```text
Pull Request
↓
Status Check
├─ Frontend ESLint
├─ Frontend Type Check
└─ Frontend Build
```

必要に応じてpre-commitを導入すると、Commit時にもフォーマットや基本的なファイルチェックを自動化できます。

```text
Commit
↓
pre-commit（任意）
→ フォーマット・基本チェック
```

覚えておくポイントは以下です。

1. Pull Requestを作成・更新するとStatus Checkが自動で実行される
2. Status Checkが `Failed` の場合は、ログを確認して修正する
3. 修正後は同じBranchへCommit・Pushすれば、Status Checkが再実行される
4. 必要なStatus Checkがすべて成功してからMergeする
5. pre-commitは任意で導入できる
6. pre-commitを使用している場合、自動修正されたファイルは再度 `git add` → `git commit` する
