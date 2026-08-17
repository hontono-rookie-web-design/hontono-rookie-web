# 開発ガイド

このドキュメントでは、このRepositoryでコードの変更などを行う際の基本的な流れとルールを説明します。

初めて開発に参加する場合は、先に `github-setup-guide.md` および `setup-guide.md` を参照してください。

## 開発の流れ

### 1. Issueを作成する

作業を始める前に、まず **Issue** を作成してください。

Issue一覧は以下から確認できます。

https://github.com/hontono-rookie-web-design/hontono-rookie-web/issues

Repositoryの **Issues → New issue** をクリックすると、Issueテンプレートの選択画面が表示されます。

**Issue** を選択して、テンプレートに従って必要事項を記載してください。

**Blank issue** は通常の開発では使用しません。

### 2. IssueからBranchを作成する

Issueを作成したら、Issue画面右側の **Development** からBranchを作成します。

Branch名は以下の形式としてください。

```text
<種類>/Issue番号-簡単な説明
```

例

```text
feature/12-add-login-page
fix/35-fix-header-layout
refactor/42-refactor-user-service
perf/56-optimize-search
docs/108-update-readme
```

Branch名の `<種類>` には、作業内容に応じて以下を使用してください。

| 種類 | 用途 |
| --- | --- |
| `feature` | 新機能の追加 |
| `fix` | バグ修正 |
| `refactor` | リファクタリング |
| `perf` | パフォーマンス改善 |
| `docs` | ドキュメント作成 |

### 3. 開発を行う

作成したBranchで開発を行います。

#### Backendを開発する場合

対象開催期の仮想環境を有効にします。

Repositoryルートから以下を実行します。

```bash
source <開催期>/backend/.venv/bin/activate
```

例

```bash
source 2026autumn/backend/.venv/bin/activate
```

対象開催期のBackendディレクトリで作業します。

```bash
cd <開催期>/backend
```

仮想環境の作成や依存パッケージのインストール方法については、`setup-guide.md` を参照してください。

#### Frontendを開発する場合

対象開催期のFrontendディレクトリで作業します。

```bash
cd <開催期>/frontend
npm run dev
```

作業が終わったら、変更をCommitしてGitHubへPushします。

#### 変更したファイルをステージングする

変更したファイルを指定してステージングします。

```bash
git add <ステージングするファイル・フォルダ>
```

例

```bash
git add 2026spring/frontend/src
git add README.md
```

複数のファイルをまとめて指定することもできます。

```bash
git add 2026spring/frontend/src README.md
```

> [!NOTE]
> `git add .` を使用すると、現在のディレクトリ以下にある変更ファイルをすべてステージングします。
>
> 意図していない変更まで含まれないよう、Commit前に変更内容を確認してください。

#### Commit

以下のようにCommitします。

```bash
git commit -m "トップページを追加"
```

コミットメッセージの形式に指定はありません。

変更内容が分かりやすい日本語で記述してください。

<details>
<summary><strong>pre-commitを使用している場合（任意）</strong></summary>

pre-commitを設定している場合は、`git commit` 時にコードフォーマットや基本的なファイルチェックが自動で実行されます。

すべてのチェックが `Passed` になれば、そのままCommitが完了します。

Black、isort、Prettierなどによってファイルが自動修正された場合は、Commitが一度中断されます。

修正内容を確認し、修正されたファイルを再度ステージングしてCommitしてください。

```bash
git add <修正されたファイル>
git commit -m "トップページを追加"
```

pre-commitはBackendのPython仮想環境とは独立してインストールされているため、pre-commitを使用するために `.venv` を有効にする必要はありません。

pre-commitの導入方法については、`setup-guide.md` を参照してください。

</details>

#### Push

Commitした内容をGitHubへPushします。

```bash
git push origin <ブランチ名>
```

例

```bash
git push origin feature/12-add-login-page
```

### 4. Pull Requestを作成する

開発が完了したら、`main` Branchへ向けてPull Requestを作成します。

Pull Request一覧は以下から確認できます。

https://github.com/hontono-rookie-web-design/hontono-rookie-web/pulls

Pull Requestには、PRテンプレートに従って必要事項を記載してください。

Pull Requestを作成する際は、以下も指定してください。

- **Reviewer**：Reviewを依頼する開発者
- **Assignee**：Pull Requestの対応担当者

通常は、Pull Request作成者自身をAssigneeに指定し、Reviewを依頼する開発者をReviewerに指定してください。

#### Status Checkを確認する

Pull Requestを作成・更新すると、GitHub ActionsによるStatus Checkが自動で実行されます。

Frontendについては、以下を確認します。

| Check | 内容 |
| --- | --- |
| `Frontend ESLint` | ESLintによる静的解析 |
| `Frontend Type Check` | TypeScriptの型チェック |
| `Frontend Build` | Production Build |

Checkが `Failed` になった場合は、該当するCheckのログを確認して修正してください。

修正後、同じBranchへCommit・PushするとStatus Checkが再実行されます。

```bash
git add <修正したファイル>
git commit -m "エラーを修正"
git push origin <ブランチ名>
```

必要なStatus Checkがすべて成功していることを確認してください。

#### Previewページを確認する

デプロイ対象のFrontendに変更がある場合、Pull Requestの作成・更新にあわせてPreview環境へのデプロイが自動で実行されます。

デプロイが完了すると、Repositoryの **Deployments** からPreviewページを確認できます。

```text
Repository
↓
Deployments
↓
対象開催期のPreview Environment
↓
対象のDeployment
↓
Previewページ
```

`main` へMergeする前に、Previewページで問題なく動作することを確認してください。

デプロイの仕組みやPreviewページの確認方法については、`deployment-guide.md` を参照してください。

### 5. Reviewを依頼する

Pull Requestを作成したら、Reviewerに指定した開発者へReviewを依頼します。

指摘があった場合は、同じBranchで修正してPushしてください。

```bash
git add <変更したファイル>
git commit -m "レビュー指摘を修正"
git push origin <ブランチ名>
```

Pull Requestは自動的に更新されます。

原則として、必要なApproveを取得してからMergeしてください。

ReviewのConversationが残っている場合は、対応内容を確認したうえでResolveしてください。

### 6. Pull RequestをMergeする

Review・Status Check・動作確認が完了したら、`main` BranchへMergeします。

通常はRulesetによって、必要なReviewやStatus Checkなどの条件を満たしたPull RequestのみMergeできます。

緊急時などにRulesetをBypassする必要がある場合は、Bypass権限を持つ開発者が必要性を判断して実行してください。

デプロイ対象のFrontendに変更がある場合、`main` へのMerge後にProduction環境へのデプロイが自動で実行されます。

デプロイが完了すると、Repositoryの **Deployments** からProductionページを確認できます。

```text
Repository
↓
Deployments
↓
対象開催期のProduction Environment
↓
最新のDeployment
↓
Productionページ
```

また、MergeされたPull Requestに対応するPreview Deploymentは自動で `inactive` になります。

デプロイの仕組みやProductionページの確認方法については、`deployment-guide.md` を参照してください。

## 開発フロー

通常の開発は、以下の流れで行います。

`（自動）` と記載されている工程は自動で実行されるため、操作は不要です。

```text
Issue作成
    ↓
IssueからBranch作成
    ↓
開発
    ↓
Commit
    ↓
Push
    ↓
Pull Request作成
    ↓
Reviewer・Assigneeを指定
    ↓
（自動）Status Check
    ↓
（自動）Preview環境へデプロイ
    ↓
DeploymentsからPreviewページを確認
    ↓
Review・動作確認
    ↓
Approve
    ↓
mainへMerge
    ↓
（自動）Preview Deploymentをinactive化
    ↓
（自動）Production環境へデプロイ
    ↓
DeploymentsからProductionページを確認
```

<details>
<summary><strong>pre-commitについて（任意）</strong></summary>

pre-commitを使用すると、Commit時にコードフォーマットや基本的なファイルチェックを自動で実行できます。

主に以下の処理を行います。

- BlackによるPythonコードのフォーマット
- isortによるPythonのimport順序の整理
- PrettierによるFrontendコードのフォーマット
- YAML / JSONなどの基本的なファイルチェック

pre-commitの設定は、Repositoryルートの `.pre-commit-config.yaml` で管理しています。

pre-commit本体はBackendの `.venv` にはインストールせず、各開発者のPCにインストールします。

そのため、pre-commitを実行するためにBackendの仮想環境を有効にする必要はありません。

すべての対象ファイルをチェックする場合は、Repositoryルートで以下を実行します。

```bash
pre-commit run --all-files
```

設定ファイルを確認する場合は、以下を実行します。

```bash
pre-commit validate-config
```

pre-commitのインストールやGit Hookの設定方法については、`setup-guide.md` を参照してください。

> [!NOTE]
> pre-commitの使用は任意です。
>
> `pre-commit install` を実行していない場合でも、通常どおりCommit・Push・Pull Requestを行うことができます。

</details>

## `.gitignore`について

このRepositoryは **Public（公開）** リポジトリです。

APIキーや認証情報などの秘密情報は、絶対にGitHubへPushしないでください。

例えば、以下のようなファイル・ディレクトリはGitで管理しないようにします。

- `.env`
- `.env.local`
- 各開催期の `backend/.venv`
- APIキーやアクセストークンを含む設定ファイル
- 認証情報を含むJSONファイル
- その他、公開してはいけない情報

これらは `.gitignore` に追加することでGitの管理対象から除外します。

秘密情報を含むファイルを新しく使用する場合は、Commitする前に必ず `.gitignore` の対象になっていることを確認してください。
