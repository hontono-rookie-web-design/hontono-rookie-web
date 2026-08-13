# 開発ガイド

このドキュメントでは、このリポジトリで開発を行う際の基本的な流れとルールを説明します。


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

| 種類 | 用途 |
| --- | --- |
| `feature` | 新機能の追加 |
| `fix` | バグ修正 |
| `refactor` | リファクタリング |
| `perf` | パフォーマンス改善 |
| `docs` | ドキュメント作成 |


### 3. 開発を行う

作成したBranchで開発を行います。

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

コミットメッセージの指定はありません。変更内容が理解しやすい日本語で記述してください


#### Push

```bash
git push origin <ブランチ名>
# 例）git push origin feature/12-add-login-page
```


### 4. Pull Requestを作成する

開発が完了したら、`main` Branchへ向けてPull Requestを作成します。

Pull Requestには、GitHubのPRテンプレートに従って必要事項を記載してください。

デプロイ対象のフロントエンドに変更がある場合、Pull Requestの作成・更新にあわせてPreview環境へのデプロイが自動で実行されます。

デプロイが完了すると、Repositoryの **Deployments** から、変更内容が反映されたPreviewページを確認できます。

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

デプロイの仕組みやPreviewページの確認方法については、`deployment-guide.md`を参照してください。


### 5. Pull RequestをMergeする

Review・確認が完了したら、`main` BranchへMergeします。

デプロイ対象のフロントエンドに変更がある場合、`main`へのMerge後にProduction環境へのデプロイが自動で実行されます。

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

また、MergeされたPull Requestに対応するPreview Deploymentは自動で`inactive`になります。

デプロイの仕組みやProductionページの確認方法については、`deployment-guide.md`を参照してください。



## 開発フロー

通常の開発は、以下の流れで行います。

`（自動）`と記載されている工程はGitHub Actionsによって自動で実行されるため、操作は不要です。

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
（自動）Preview環境へデプロイ
    ↓
DeploymentsからPreviewページを確認
    ↓
Review・動作確認
    ↓
mainへMerge
    ↓
（自動）Preview Deploymentをinactive化
    ↓
（自動）Production環境へデプロイ
    ↓
DeploymentsからProductionページを確認
```



## `.gitignore`について

このリポジトリは **Public（公開）** リポジトリです。

APIキーや認証情報などの秘密情報は、絶対にGitHubへPushしないでください。

例えば、以下のようなファイルはGitで管理しないようにします。

- `.env`
- `.env.local`
- APIキーやアクセストークンを含む設定ファイル
- 認証情報を含むJSONファイル
- その他、公開してはいけない情報

これらは `.gitignore` に追加することで、Gitの管理対象から除外できます。

例

```text
.env
.env.local
credentials.json
config.secret.json
```