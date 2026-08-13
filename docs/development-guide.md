# 開発ガイド

このドキュメントでは、このRepositoryでコードの変更などを行う際の基本的な流れとルールを説明します。

初めて開発に参加する場合は、先に `github-setup-guide.md` および `setup-guide.md` を参照してください。

## 開発の流れ

### 1. Issueを作成する

作業を始める前に、まず **Issue** を作成してください。

Repositoryの **Issues → New issue** をクリックすると、Issueテンプレートの選択画面が表示されます。

この画面では **Issue** を選択して、テンプレートを使用してIssueを作成してください。

**Blank issue** はテンプレートを使用せずにIssueを作成するため、通常の開発では使用しません。

Issueには、GitHubのIssueテンプレートに従って必要事項を記載してください。

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

| 種類         | 用途        |
| ---------- | --------- |
| `feature`  | 新機能の追加    |
| `fix`      | バグ修正      |
| `refactor` | リファクタリング  |
| `perf`     | パフォーマンス改善 |
| `docs`     | ドキュメント作成  |

### 3. 開発を行う

作成したBranchで開発を行います。

Pythonを使用する場合は、対象開催期の仮想環境を使用します。

Repositoryルートから以下を実行します。

```bash
source <開催期>/.venv/bin/activate
```

例

```bash
source 2026autumn/.venv/bin/activate
```

仮想環境の作成や依存パッケージのインストール方法については、`setup-guide.md` を参照してください。

Frontendを開発する場合は、対象開催期のFrontendディレクトリで作業します。

```bash
cd <開催期>/frontend
npm run dev
```

作業が終わったら、変更をCommitし、GitHubへPushします。

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
> 意図していない変更や不要なファイルまで含まれる可能性があるため、ステージングするファイルを確認してからCommitしてください。

#### Commit

```bash
git commit -m "トップページを追加"
```

コミットメッセージの指定はありません。

変更内容が理解しやすい日本語で記述してください。

Commit時には **pre-commitが自動で実行**され、基本的なファイルチェックやコードフォーマットが行われます。

pre-commitの処理によってファイルが自動修正された場合、Commitは一度中断されますので、修正内容を確認したうえで、修正されたファイルをステージングして再度Commitしてください。

```bash
git add <修正されたファイル>
git commit -m "トップページを追加"
```

> [!NOTE]
> `git commit --no-verify` を使用するとpre-commitをスキップできますが、通常の開発では使用しないでください。

#### Push

```bash
git push origin <ブランチ名>
```

例

```bash
git push origin feature/12-add-login-page
```

### 4. Pull Requestを作成する

開発が完了したら、`main` Branchへ向けてPull Requestを作成します。

Pull Requestには、GitHubのPRテンプレートに従って必要事項を記載してください。

デプロイ対象のFrontendに変更がある場合、Pull Requestの作成・更新にあわせてPreview環境へのデプロイが自動で実行されます。

デプロイが完了すると、Repositoryの **Deployments** から変更内容が反映されたPreviewページを確認できます。

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

`main`へMergeする前に、Previewページで問題なく動作することを確認してください。

デプロイの仕組みやPreviewページの確認方法については、`deployment-guide.md` を参照してください。

### 5. Reviewを依頼する

Pull Requestを作成したら、他の開発者にReviewを依頼します。

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

Review・動作確認が完了したら、`main` BranchへMergeします。

通常はRulesetによって、必要なReviewやStatus Checkなどの条件を満たしたPull RequestのみMergeできます。

緊急時などにRulesetをBypassする必要がある場合は、Bypass権限を持つ開発者が必要性を判断して実行してください。

デプロイ対象のFrontendに変更がある場合、`main`へのMerge後にProduction環境へのデプロイが自動で実行されます。

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
Commit（pre-commitが自動実行）
    ↓
Push
    ↓
Pull Request作成
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

## pre-commitについて

pre-commitの設定は、Repositoryルートの `.pre-commit-config.yaml` で管理しています。

pre-commit本体は、対象開催期のPython仮想環境にインストールされています。

通常はCommit時に自動で実行されるため、個別に実行する必要はありません。

手動でpre-commitを実行する場合は、対象開催期の仮想環境を有効にしてください。

Repositoryルートから以下を実行します。

```bash
source <開催期>/.venv/bin/activate
```

すべてのファイルに対して手動でチェックを実行したい場合は、以下を使用できます。

```bash
pre-commit run --all-files
```

pre-commitの設定ファイルを確認する場合は、以下を使用できます。

```bash
pre-commit validate-config
```

pre-commitのインストールやGit Hookの設定方法については、`setup-guide.md` を参照してください。

## `.gitignore`について

このRepositoryは **Public（公開）** リポジトリです。

APIキーや認証情報などの秘密情報は、絶対にGitHubへPushしないでください。

例えば、以下のようなファイル・ディレクトリはGitで管理しないようにします。

* `.env`
* `.env.local`
* 各開催期の `.venv`
* APIキーやアクセストークンを含む設定ファイル
* 認証情報を含むJSONファイル
* その他、公開してはいけない情報

これらは `.gitignore` に追加することで、Gitの管理対象から除外します。

秘密情報を含むファイルを新しく使用する場合は、Commitする前に必ず `.gitignore` の対象になっていることを確認してください。
