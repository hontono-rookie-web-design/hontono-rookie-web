# 開発ガイド

このドキュメントでは、このリポジトリで開発を行う際の基本的な流れとルールを説明します。

---

## 開発の流れ

### 1. Issueを作成する

作業を始める前に、まず **Issue** を作成してください。

Issueには、GitHubのIssueテンプレートに従って必要事項を記載してください。

---

### 2. Issueからブランチを作成する

Issueを作成したら、Issueの **Development** からブランチを作成します。

ブランチ名は以下の形式としてください。

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

### 3. 開発を行う

作成したブランチで開発を行います。

作業が終わったら、変更をコミットし、GitHubへPushします。

#### 変更したファイルをステージング

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
> 意図していない変更や不要なファイルまで含まれる可能性があるため、ステージングするファイルを確認してからコミットしてください。

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

開発が完了したら、`main` ブランチへ向けてPull Requestを作成します。

Pull Requestには、GitHubのPRテンプレートに従って必要事項を記載してください。

---

### 5. Pull Requestをマージする

レビュー・確認が完了したら、`main` ブランチへマージします。

---

## 開発フロー

```text
Issue作成
    ↓
Issueからブランチ作成
    ↓
開発
    ↓
Commit
    ↓
Push
    ↓
Pull Request
    ↓
レビュー
    ↓
mainへマージ
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
> その後コミットすると、`.gitignore` の設定が有効になります。

---

## 開発ルール

### 必須

#### `main` ブランチへ直接Pushしない

`main` ブランチへの直接Pushは禁止です。

必ず作業ブランチで開発し、Pull Requestを作成してからマージしてください。

> [!WARNING]
> `main` ブランチへ直接Pushすると、レビューを経ずに変更が反映されてしまいます。
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

Pull Requestがマージされると、Issueも自動的にクローズされます。

---

#### 1つのIssueにつき1つのブランチにする

1つのブランチでは、1つのIssueのみ対応することを推奨します。

**良い例**

```text
Issue #10 → feature/10-add-login-page
Issue #11 → feature/11-fix-header-layout
```

**避けたい例**

```text
feature/work
```

Issueごとにブランチを分けることで、レビューしやすくなり、変更履歴も追いやすくなります。

---

## お願い

- 作業前にIssueを作成する
- Issueからブランチを作成する
- `main` ブランチへ直接Pushしない
- 秘密情報をGitHubへPushしない
- 作業完了後はPull Requestを作成する
- 1つのIssueにつき1つのブランチで作業する