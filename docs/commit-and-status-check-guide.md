# Editing Commit・Pull Request時の自動チェックについて

このRepositoryでは、コードの品質を保つために、**Commit時**と**Pull Request作成・更新時**に自動チェックが実行されます。

```text
コードを変更
    ↓
git add
    ↓
git commit
    ↓
pre-commit
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



## Commit時のpre-commit

`git commit` を実行すると、Commitの前に **pre-commit** が自動で実行されます。

pre-commitでは、主に以下を行います。

- Black・isortによるPythonコードのフォーマット
- PrettierによるFrontendコードのフォーマット
- YAML / JSONなどの基本的な構文チェック
- merge conflictや秘密鍵などの基本的なチェック

通常は、変更したファイルをステージングしてCommitします。

```bash
git add <変更したファイル>
git commit -m "変更内容"
```

### Passedになった場合

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



### Failedになった場合

`Failed` になった場合、**Commitは完了していません**。

エラーの内容を確認してから、再度Commitします。

#### ファイルが自動修正された場合

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

#### 自動修正されないエラーの場合

エラーメッセージを確認してコードを修正し、再度以下を実行してください。

```bash
git add <修正したファイル>
git commit -m "変更内容"
```

> [!WARNING]
> `git commit --no-verify` を使用するとpre-commitをスキップできますが、通常の開発では使用しないでください。



## Pull Request時のStatus Check

Pull Requestを作成・更新すると、GitHub Actionsによる **Status Check** が自動で実行されます。

Frontendに変更がある場合、以下の3つを確認します。

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

---

## ローカルでStatus Checkと同じ確認をする

GitHubへPushする前に、自分のPCで確認することもできます。

対象開催期のFrontendディレクトリで以下を実行します。

```bash
npm run lint
npm run typecheck
npm run build
```

それぞれ、

- `npm run lint`：ESLint
- `npm run typecheck`：TypeScriptの型チェック
- `npm run build`：Production Build

を実行します。

大きな変更を行った場合などは、Push前に確認しておくとエラーに早く気づくことができます。



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

変更内容を確認する場合は、

```bash
git diff
```

ステージング済みの変更を確認する場合は、

```bash
git diff --cached
```

を使用できます。

解決できない場合は、以下を共有して他の開発者へ確認してください。

- 実行したコマンド
- 表示されたエラーメッセージ
- FailedになったCheck



## まとめ

このRepositoryでは、以下の2段階で自動チェックを行います。

```text
Commit
↓
pre-commit
→ フォーマット・基本チェック

Pull Request
↓
Status Check
├─ Frontend ESLint
├─ Frontend Type Check
└─ Frontend Build
```

覚えておくポイントは以下です。

1. `git commit` するとpre-commitが自動で実行される
2. pre-commitが `Failed` の場合、Commitは完了していない
3. 自動修正された場合は、再度 `git add` → `git commit` する
4. Pull Requestを作成・更新するとStatus Checkが実行される
5. Status Checkが `Failed` の場合は、ログを確認して修正する
6. 修正後は同じBranchへCommit・Pushすれば、Status Checkが再実行される
7. 必要なStatus Checkがすべて成功してからMergeする
