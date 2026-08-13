# 環境構築ガイド

このドキュメントでは、RepositoryをCloneした後、開発を開始するために必要な環境構築について説明します。

GitHubへのSSH接続やRepositoryのCloneが完了していない場合は、先に `github-setup-guide.md` を参照してください。

MacおよびWindowsのWSLなど、bashを利用できる環境を想定しています。

## 1. 必要なツールを確認する

以下のツールを使用します。

* Python
* pip
* Node.js
* npm

以下のコマンドで利用できることを確認します。

```bash
python --version
python -m pip --version
node --version
npm --version
```

環境によってPythonのコマンドが `python3` の場合は、以降の `python` を `python3` に読み替えてください。

## 2. Pythonのバージョンを確認する

開発で使用するPythonのバージョンを確認してください。

Backendで使用するPythonのバージョンについては、対象開催期の `backend/README.md` を参照してください。

pyenvなどのPythonバージョン管理ツールを利用しても構いません。

例えばPython 3.12を使用する場合、以下のように確認します。

```bash
python --version
```

表示されたPythonのバージョンが、対象開催期で使用するバージョンと一致していることを確認してください。

## 3. Pythonの仮想環境を作成する

このRepositoryでは、**開催期ごとにPythonの仮想環境を作成します。**

対象開催期のディレクトリへ移動します。

```bash
cd <開催期>
```

`<開催期>` には、例えば `2026spring` や `2026autumn` など、対象となる開催期のディレクトリ名を指定します。

開催期名は `spring` / `autumn` に限定しません。

対象開催期の直下に `.venv` を作成します。

```bash
python -m venv .venv
```

仮想環境を有効にします。

Mac / Linux / WSLでは以下を実行します。

```bash
source .venv/bin/activate
```

仮想環境が有効になると、Terminal上に `.venv` などが表示されます。

使用しているPythonを確認する場合は、以下を実行します。

```bash
which python
```

対象開催期の `.venv` を指していれば問題ありません。

例

```text
.../hontono-rookie-web/2026autumn/.venv/bin/python
```

> [!NOTE]
> `.venv` は各開発者のローカル環境で作成するため、Gitでは管理しません。
>
> 開催期ごとに `.venv` を分けることで、開催期によってPythonや依存パッケージのバージョンが異なる場合でも、それぞれ独立した環境として管理できます。

## 4. Pythonの依存パッケージをインストールする

仮想環境を有効にした状態で、対象開催期直下の `requirements.txt` を使用して必要なPythonパッケージをインストールします。

```bash
python -m pip install -r requirements.txt
```

対象開催期直下の `requirements.txt` は、開発環境を構築するための入口となるファイルです。

以下のように、Backendの実行に必要なパッケージと、開発用のパッケージを読み込みます。

```text
-r backend/requirements.txt
-r requirements-dev.txt
```

それぞれの役割は以下です。

| ファイル                             | 用途                               |
| -------------------------------- | -------------------------------- |
| `<開催期>/requirements.txt`         | 開発環境全体の依存パッケージをインストールするための入口     |
| `<開催期>/backend/requirements.txt` | Backendの実行に必要なPythonパッケージ        |
| `<開催期>/requirements-dev.txt`     | pre-commitなど、開発時に使用するPythonパッケージ |

`requirements-dev.txt` に含まれているpre-commitがインストールされていることを確認します。

```bash
pre-commit --version
```

## 5. Repository共通のNode.js依存パッケージをインストールする

Repository共通のNode.js依存パッケージをインストールします。

Repositoryルートへ移動します。

```bash
cd ..
```

Repositoryルートで以下を実行します。

```bash
npm ci
```

Repositoryルートの `package.json` / `package-lock.json` では、PrettierなどのRepository共通の開発用ツールを管理しています。

Frontend本体の依存パッケージとは別に管理されているため、対象開催期のFrontendを開発する場合は、後述の手順でFrontend側でも `npm ci` を実行します。

## 6. pre-commitを設定する

このRepositoryでは、Commit時のコードフォーマットや基本的なファイルチェックにpre-commitを使用します。

対象開催期の `.venv` が有効になっている状態で、Repositoryルートから以下を実行します。

```bash
pre-commit install
```

成功すると、Gitのpre-commit Hookが設定されます。

設定ファイルに問題がないことを確認する場合は、以下を実行します。

```bash
pre-commit validate-config
```

すべてのファイルに対してチェックを実行する場合は、以下を使用できます。

```bash
pre-commit run --all-files
```

pre-commitの設定は、Repositoryルートの `.pre-commit-config.yaml` で管理しています。

Blackやisortの共通設定は、Repositoryルートの `pyproject.toml` で管理しています。

Prettierの共通設定は、Repositoryルートの `.prettierrc.json` および `.prettierignore` で管理しています。

> [!NOTE]
> `.pre-commit-config.yaml` はGitで管理されていますが、Git Hook自体はRepositoryをCloneしただけでは有効になりません。
>
> RepositoryをCloneした後、各開発者が一度 `pre-commit install` を実行してください。

> [!NOTE]
> `.venv` を削除して作り直した場合は、Pythonパッケージを再インストールしたうえで `pre-commit install` も再度実行してください。

## 7. Frontendの環境を構築する

Frontendを開発する場合は、対象開催期のFrontendディレクトリへ移動します。

Repositoryルートから以下を実行します。

```bash
cd <開催期>/frontend
```

Frontend固有の依存パッケージをインストールします。

```bash
npm ci
```

対象Frontendの `package.json` / `package-lock.json` では、Next.js、React、ESLintなど、Frontend本体で使用する依存パッケージを管理しています。

開発サーバを起動する場合は、通常以下を使用します。

```bash
npm run dev
```

利用できるコマンドの詳細は、対象Frontendの `package.json` やREADMEを確認してください。

## 8. Backendの環境を確認する

Backendでは、対象開催期の直下に作成した `.venv` を使用します。

仮想環境が有効になっていない場合は、Repositoryルートから以下を実行します。

```bash
source <開催期>/.venv/bin/activate
```

Backendのスクリプトを実行する場合は、対象開催期のBackendディレクトリへ移動します。

```bash
cd <開催期>/backend
```

`scripts` ディレクトリにBackendでの実行スクリプトが格納されています。

これらを実行するには、`backend` ディレクトリ直下から以下のように実行します。

```bash
python -m scripts.<ファイル名>
```

必要な設定や環境変数、各スクリプトの詳細については、対象開催期の `backend/README.md` を参照してください。

## 9. Backendをローカルで実行する場合の認証情報

Backendの一部の処理では、Google APIやGoogleスプレッドシートを利用します。

必要な処理をローカルで実行する場合は、BackendのREADMEに従って環境変数を設定してください。

例えば、Google APIのサービスアカウントを利用する場合は以下のように設定します。

```bash
export GOOGLE_APPLICATION_CREDENTIALS=<JSONのPath>
```

OAuth認証やGoogle Formsを利用する処理では、追加で以下のような環境変数を使用する場合があります。

```bash
export GOOGLE_OAUTH_CREDENTIALS=<JSONのPath>
export FORMS_FOLDER_ID=<folder_id>
export TEMPLATE_FORM_ID=<forms_id>
```

> [!WARNING]
> APIキー、アクセストークン、サービスアカウントのJSONなどの秘密情報はGitHubへCommitしないでください。

## 10. 環境構築後の動作確認

Repositoryルートでpre-commitを確認します。

対象開催期の `.venv` が有効になっていることを確認したうえで、以下を実行します。

```bash
pre-commit run --all-files
```

Frontendを開発する場合は、対象Frontendで必要に応じて以下を確認します。

```bash
npm run lint
npm run build
```

Backendについては、対象開催期の `backend/README.md` に記載されている方法で必要なスクリプトを確認してください。

## 11. 2回目以降の開発

一度環境構築が完了していれば、Pythonを使用する際は対象開催期の仮想環境を有効にします。

Repositoryルートから以下を実行します。

```bash
source <開催期>/.venv/bin/activate
```

例えば、`2026autumn` の環境を使用する場合は以下です。

```bash
source 2026autumn/.venv/bin/activate
```

Frontendの依存パッケージやPythonの仮想環境を毎回作り直す必要はありません。

`requirements.txt` や `package-lock.json` が更新された場合は、必要に応じて依存パッケージを再インストールしてください。

Pythonの依存パッケージを更新する場合は、対象開催期で以下を実行します。

```bash
python -m pip install -r requirements.txt
```

Repository共通のNode.js依存パッケージを更新する場合は、Repositoryルートで以下を実行します。

```bash
npm ci
```

Frontendの依存パッケージを更新する場合は、対象Frontendで以下を実行します。

```bash
npm ci
```

環境構築後の通常の開発手順については、`development-guide.md` を参照してください。
