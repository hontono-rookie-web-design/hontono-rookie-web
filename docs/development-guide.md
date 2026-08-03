# 開発ガイド

このドキュメントでは、このリポジトリで開発を行う際の基本的な流れとルールを説明します。

---

## 開発の流れ

### 1. Issueを作成する

作業を始める前に、まず **Issue** を作成してください。

Issueには、GitHubのIssueテンプレートに従って必要事項を記載してください。

---

### 2. IssueからBranchを作成する

Issueを作成したら、Issue画面右側の **Development** からBranchを作成します。

Branch名は以下の形式としてください。

```text
feature/Issue番号-簡単な説明
```

例

```text
feature/12-add-login-page
feature/35-fix-header-layout
feature/108-update-readme
```

---

### 3. Developmentを行う

作成したBranchでDevelopmentを行います。

作業が終わったら、変更をCommitし、GitHubへPushします。

#### 変更したファイルをStageする

変更したファイルを指定してStageします。

```bash
git add <Stageするファイル・フォルダ>
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
> `git add .` を使用すると、現在のディレクトリ以下にある変更ファイルをすべてStageします。
>
> 意図していない変更や不要なファイルまで含まれる可能性があるため、Stageするファイルを確認してからCommitしてください。

#### Commit

```bash
git commit -m "トップページを追加"
```

#### Push

```bash
git push
```

---

### 4. Pull Requestを作成する

Developmentが完了したら、`main` Branchへ向けてPull Requestを作成します。

Pull Requestには、GitHubのPRテンプレートに従って必要事項を記載してください。

---

### 5. Pull RequestをMergeする

Review・確認が完了したら、`main` BranchへMergeします。

---

## 開発フロー

```text
Issue作成
    ↓
IssueからBranch作成
    ↓
Development
    ↓
Commit
    ↓
Push
    ↓
Pull Request
    ↓
Review
    ↓
mainへMerge
```

---

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

> [!WARNING]
> 一度Gitで管理されたファイルは、あとから `.gitignore` に追加しても管理対象のままです。
>
> その場合は、以下のコマンドでGitの管理対象から外してください。
>
> ```bash
> git rm --cached ファイル名
> ```
>
> その後Commitすると、`.gitignore` の設定が有効になります。

---

## 開発ルール

### 必須

#### `main` Branchへ直接Pushしない

`main` Branchへの直接Pushは禁止です。

必ず作業BranchでDevelopmentし、Pull Requestを作成してからMergeしてください。

> [!WARNING]
> `main` Branchへ直接Pushすると、Reviewを経ずに変更が反映されてしまいます。
>
> 品質を保つため、必ずPull Request経由で変更を取り込んでください。

---

### 推奨

#### IssueとPull Requestを紐付ける

Pull Requestでは、対応するIssueと紐付けることを推奨します。

例

```text
Closes #12
```

Pull RequestがMergeされると、Issueも自動的にCloseされます。

---

#### 1つのIssueにつき1つのBranchにする

1つのBranchでは、1つのIssueのみ対応することを推奨します。

**良い例**

```text
Issue #10 → feature/10-add-login-page
Issue #11 → feature/11-fix-header-layout
```

**避けたい例**

```text
feature/work
```

IssueごとにBranchを分けることで、Reviewしやすくなり、変更履歴も追いやすくなります。

---

## お願い

- 作業前にIssueを作成する
- IssueからBranchを作成する
- `main` Branchへ直接Pushしない
- 秘密情報をGitHubへPushしない
- 作業完了後はPull Requestを作成する
- 1つのIssueにつき1つのBranchで作業する