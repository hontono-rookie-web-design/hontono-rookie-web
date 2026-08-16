# 環境構築ガイド

このドキュメントでは、RepositoryをCloneした後、開発を開始するために必要な環境構築について説明します。

GitHubへのSSH接続やRepositoryのCloneが完了していない場合は、先に `github-setup-guide.md` を参照してください。

MacおよびWindowsのWSLなど、bashを利用できる環境を想定しています。

## 1. 必要なツールを確認する

以下のツールを使用します。

- Python
- pip
- Node.js
- npm

以下のコマンドで利用できることを確認します。

```bash
python --version
python -m pip --version
node --version
npm --version
```

環境によってPythonのコマンドが `python3` の場合は、以降の `python` を `python3` に読み替えてください。

## 2. Pythonのバージョンを確認する

Backendで使用するPythonのバージョンは、対象開催期の `backend/README.md` を確認してください。

```bash
python --version
```

必要に応じて、pyenvなどのPythonバージョン管理ツールを利用しても構いません。

## 3. Pythonの仮想環境を作成する

このRepositoryでは、開催期ごとにPythonの仮想環境を作成します。

Repositoryルートから対象開催期のディレクトリへ移動します。

```bash
cd <開催期>
```

例えば、`2026autumn` の場合は以下です。

```bash
cd 2026autumn
```

仮想環境 `.venv` を作成します。

```bash
python -m venv .venv
```

仮想環境を有効にします。

```bash
source .venv/bin/activate
```

使用しているPythonを確認する場合は、以下を実行します。

```bash
which python
```

対象開催期の `.venv` を指していれば問題ありません。

```text
.../hontono-rookie-web/2026autumn/.venv/bin/python
```

> [!NOTE]
> `.venv` は各開発者のローカル環境で作成するため、Gitでは管理しません。

## 4. Pythonの依存パッケージをインストールする

仮想環境を有効にした状態で、対象開催期の `requirements.txt` を使用します。

```bash
python -m pip install -r requirements.txt
```

`requirements.txt` から、Backendの実行や開発に必要なPythonパッケージがインストールされます。

インストール後、Repositoryルートへ戻ります。

```bash
cd ..
```

## 5. Frontendの環境を構築する

Frontendを開発する場合は、Repositoryルートから対象開催期のFrontendディレクトリへ移動します。

```bash
cd <開催期>/frontend
```

例えば、`2026autumn` の場合は以下です。

```bash
cd 2026autumn/frontend
```

Frontendの依存パッケージをインストールします。

```bash
npm ci
```

各Frontendの `package.json` / `package-lock.json` で、Next.js、React、ESLint、TypeScript、Prettierなどの依存パッケージを管理しています。

開発サーバを起動する場合は以下を実行します。

```bash
npm run dev
```

その他のコマンドについては、対象Frontendの `package.json` やREADMEを確認してください。


<details>
<summary><strong>6. pre-commitを設定する（任意）</strong></summary>


## 6. pre-commitを設定する（任意）

pre-commitを使用すると、Commit時にコードフォーマットや基本的なファイルチェックを自動で実行できます。

**pre-commitの使用は任意です。使用しない場合、この手順は不要です。**

pre-commitでは、主に以下を実行します。

- BlackによるPythonコードのフォーマット
- isortによるPythonのimport順序の整理
- PrettierによるFrontendコードのフォーマット
- YAML / JSONなどの基本的なチェック

FrontendのPrettierは、各開催期の `frontend` にインストールされたものを使用します。

そのため、Frontendを開発する場合は、先に対象Frontendで以下を実行しておいてください。

```bash
npm ci
```

対象開催期の `.venv` を有効にした状態で、Repositoryルートから以下を実行します。

```bash
pre-commit install
```

これ以降、このRepositoryで `git commit` を実行するとpre-commitが自動で実行されます。

設定を確認する場合は以下を実行できます。

```bash
pre-commit validate-config
```

すべての対象ファイルに対して手動でチェックする場合は、以下を実行します。

```bash
pre-commit run --all-files
```

pre-commitを使用しない状態へ戻す場合は、以下を実行します。

```bash
pre-commit uninstall
```

設定ファイルはRepositoryルートで管理しています。

- `.pre-commit-config.yaml`：pre-commitの設定
- `pyproject.toml`：Black・isortの設定
- `.prettierrc.json` / `.prettierignore`：Prettierの設定

> [!NOTE]
> `.pre-commit-config.yaml` が存在していても、`pre-commit install` を実行しなければCommit時にpre-commitは実行されません。

</details>

## 7. Backendの環境を確認する

Backendでは、対象開催期の直下に作成した `.venv` を使用します。

仮想環境が有効になっていない場合は、Repositoryルートから以下を実行します。

```bash
source <開催期>/.venv/bin/activate
```

対象開催期のBackendディレクトリへ移動します。

```bash
cd <開催期>/backend
```

`scripts` ディレクトリのスクリプトは、以下のように実行します。

```bash
python -m scripts.<ファイル名>
```

必要な設定や環境変数については、対象開催期の `backend/README.md` を参照してください。

## 8. Backendをローカルで実行する場合の認証情報

Backendの一部の処理では、Google APIやGoogleスプレッドシートを利用します。

Repositoryルートに `data` ディレクトリを作成し、共有フォルダ内のJSONファイルを格納してください。

そのファイルのPathを環境変数に設定します。

```bash
export GOOGLE_APPLICATION_CREDENTIALS=<JSONのPath>
```

> [!WARNING]
> APIキー、アクセストークン、サービスアカウントのJSONなどの秘密情報はGitHubへCommitしないでください。

## 9. 環境構築後の動作確認

Frontendを開発する場合は、対象Frontendで開発サーバが起動できることを確認します。

```bash
npm run dev
```

必要に応じて、Pull Request時のStatus Checkと同じ確認をローカルで実行できます。

```bash
npm run lint
npm run typecheck
npm run build
```

それぞれ以下を確認します。

| コマンド | 内容 |
| --- | --- |
| `npm run lint` | ESLintによる静的解析 |
| `npm run typecheck` | TypeScriptの型チェック |
| `npm run build` | Production Build |

Backendについては、対象開催期の `backend/README.md` を参照してください。

## 10. 2回目以降の開発

一度環境構築が完了していれば、毎回仮想環境や依存パッケージを作り直す必要はありません。

Pythonを使用する場合は、Repositoryルートから対象開催期の仮想環境を有効にします。

```bash
source <開催期>/.venv/bin/activate
```

例えば、`2026autumn` の場合は以下です。

```bash
source 2026autumn/.venv/bin/activate
```

`requirements.txt` が更新された場合は、対象開催期のディレクトリで以下を実行します。

```bash
python -m pip install -r requirements.txt
```

Frontendの `package-lock.json` が更新された場合は、対象Frontendのディレクトリで以下を実行します。

```bash
npm ci
```

環境構築後の通常の開発手順については、`development-guide.md` を参照してください。
