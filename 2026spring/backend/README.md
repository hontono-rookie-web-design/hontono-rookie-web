# backend

## 構成

`2026spring/backend`内のディレクトリ構成は以下。

```
backend
  ├ README.md
  ├ config
  │  └ settings.yml                 設定ファイル
  ├ lib
  │  ├ __init__.py
  │  ├ sheet_client.py              スプレッドシート関連モジュール
  │  ├ niconico.py                  ニコニコのAPI関連モジュール
  │  └ utils.py                     共通モジュール
  ├ scripts
  │  ├ fetch_videos.py              参加動画一覧更新スクリプト
  │  ├ fetch_note.py                note記事一覧更新スクリプト
  │  ├ fetch_fanfic_forms_result.py 二次創作情報確認用シート更新スクリプト
  │  ├ fetch_fanfic.py              二次創作一覧更新スクリプト
  │  ├ vote_grouping.py             投票グループ作成スクリプト
  │  └ setup_forms.py               投票Form作成スクリプト           
  └ requirements.txt
```

backend処理関連のworkflowは以下がある。
workflowファイルは、`.github/workflows`の中にある。

| workflow | workflowファイル | 処理内容 |
| --- | --- | --- |
| 2026spring Fetch Videos Rookie | `2026spring_fetch_videos_rookie.yml` | Rookie、opステージの動画一覧スプレッドシートを更新する |
| 2026spring Fetch Videos ex | `2026spring_fetch_videos_ex.yml` | exステージ（、二次創作）の動画一覧スプレッドシートを更新する |
| 2026spring Fetch Note | `2026spring_fetch_note.yml` | Note記事一覧スプレッドシートを更新する |
| 2026spring Fetch Fanfic From Result | `2026spring_fetch_fanfic_from_result.yml` | 二次創作情報確認用スプレッドシートを更新する |
| 2026spring Fetch Fanfic | `2026spring_fetch_fanfic.yml` | 二次創作一覧スプレッドシートを更新する |

## 運用方法

ここに想定する運用方法を書く

### スプレッドシートの作成

### workflow準備

### 除外動画の設定

### 二次創作作品の確認

## 環境

### 実行想定環境

- Python: 3.12
- パッケージ管理: pip
- 仮想環境: venv

### ローカルで実行する場合の環境設定手順

1. pyenvなどでPython 3.12をインストール
    ```
    pyenv install 3.12

    cd 2026spring/backend
    pyenv local 3.12
    ```

1. 仮想環境を作成し、仮想環境に入る
    ```
    python -m venv .venv
    source .venv/bin/activate
    ```

1. `requirements.txt`を使って必要なパッケージをインストール
    ```
    pip install -r requirements.txt
    ```

1. パッケージが新たに必要になった場合は以下のようにしてインストール

    requirements.txtも更新
    ```
    pip install [パッケージ名]
    pip freeze > requirements.txt
    ```

## 設定

`config/settings.yml`で、タグやスプレッドシート名などの情報を設定している。
次回開催時にコードを流用する場合にはこのファイルのみ変更すれば良いはず。

スクリプト内では、`lib.utils.load_config`を呼ぶことで、`dict`形式で`config/settings.yml`の内容が取得できる。

### `config/settings.yml` で設定できるパラメータ

#### `tag`

タグの情報を設定する。

| パラメータ名 | 内容 | 2026春での設定値 |
| --- | --- | --- |
| `rookie` | ルーキー参加タグ | `本当のルーキー祭り2026春` |
| `ex` | exステージ参加タグ |　`本当のルーキー祭り2026春ex` |
| `fanfic` | 二次創作タグ | `本当のルーキー祭り2026春二次創作` |

#### `period`

投稿期間の情報を設定する。

| パラメータ名 | 内容 | 2026春での設定値 |
| --- | --- | --- |
| `start_period` | ルーキー投稿期間開始時刻。opステージとルーキー作品を分けるために使用。ISO形式 | `2026-04-22T17:00:00+09:00` |

#### `spreadsheet`

スプレッドシートの情報を設定する。
各スプレッドシートについて、`name`でスプレッドシート名を設定し、その他で各シートのシート名を設定している。

スプレッドシートの詳細については、「スプレッドシート」の項目を参照。

#### `vote_grouping`

投票グループ分けの情報を設定する

| パラメータ名 | 内容 | 2026春での設定値 |
| --- | --- | --- |
| `random_seed` | ランダムシード | 42 |
| `group_size` | 1グループの人数 | 10? |
| `grouped_video_catalog` | グループ分けされた動画一覧を出力するスプレッドシート情報 | |

#### `vote_form`

投票フォームの情報を設定する

| パラメータ名 | 内容 | 2026春での設定値 |
| --- | --- | --- |
| `title` | 投票フォームタイトル | `本当のルーキー祭り2026春_Disc`（予選） |
| `item_title` | 質問内容 | `好きな作品を教えてください。` |


## 実行

各処理をローカルで実行する場合の手順を説明する。

### 共通準備

1. `config/settings.yml`に必要な設定を記載する。

1. 環境変数`GOOGLE_APPLICATION_CREDENTIALS`に、Google API アクセストークンのJSONのPathを指定する。以下を実行すれば設定できる。
    ```
    export GOOGLE_APPLICATION_CREDENTIALS=<JSONのPath>
    ```

### 参加動画一覧更新

1. 「動画除外リスト_2026春」のスプレッドシートに一覧から除外する動画のIDリストを作成する。

1. `backend`ディレクトリで以下を実行
    ```
    python -m scripts.fetch_videos
    ```

### note記事一覧更新

1. `backend`ディレクトリで以下を実行
    ```
    python -m scripts.fetch_note
    ```

### 二次創作作品一覧更新

### 投票グループ分け

### 投票Form作成


## スプレッドシート

backendの処理で利用するGoogleスプレッドシートを説明する。
Googleスプレッドシートをデータベースとして利用している。

スプレッドシート名、シート名は、設定ファイル`config/settings.yml`で設定しているので、設定ファイルを書き換えれば変更できるが、ここでは、現在設定されているスプレッドシート名、シート名を想定して説明する。

現状、workflowで更新するスプレッドシートは英語名、手動で更新するスプレッドシートは日本語名をつけている（この命名ルールは要議論）。
スプレッドシート名の「*」には開催期（「2026spring」、「2026春」など）が入る。

スプレッドシートは以下がある。
| スプレッドシート | 内容 | 更新スクリプト |
| --- | --- | --- |
| video_catalog_* | 参加動画一覧 | `scripts/fetch_videos.py` |
| 動画除外リスト_* | 参加動画のうち一覧から除外する動画のIDリスト | 手動 |

以下で、各スプレッドシートについて内容を説明する。
( )内は`config/settings.yml`内での名称。

### video_catalog_* (`video_catalog`)

参加動画一覧。`scripts/fetch_videos.py`で更新する。

| シート | 内容 | 列 |
| --- | --- | --- |
| rookie | ルーキー参加動画一覧 | 動画ID, タイトル, 投稿者ID, 投稿者名, 投稿日時, 概要欄, 動画時間, 再生数, いいね, コメント, マイリスト, URL |
| op | opステージ参加動画一覧 | 同上 |
| ex | exステージ参加動画一覧 | 同上 |
| excluded_rookie | ルーキー参加タグがついた動画のうち、ルーキー参加動画一覧から除外された動画一覧 | 同上 |
| excluded_op | opステージ参加タグがついた動画のうち、opステージ参加動画一覧から除外された動画一覧 | 同上|
| excluded_ex | exステージ参加タグがついた動画のうち、exステージ参加動画一覧から除外された動画一覧 | 同上 |

### 動画除外リスト_* (`video_exclusion_list`) 

参加動画のうち一覧から除外する動画のIDリスト。
手動で更新する。

メモ用に「除外理由」の列を作っているが、スクリプトでは使用されない。

| シート | 内容 | 列 |
| --- | --- | --- |
| ルーキー | ルーキー参加タグがついた動画のうち、ルーキー参加動画一覧から除外する動画のIDリスト | 動画ID, 除外理由 |
| OP | opステージ参加タグがついた動画のうち、opステージ参加動画一覧から除外する動画のIDリスト | 同上 |
| EX | exステージ参加タグがついた動画のうち、exステージ参加動画一覧から除外する動画のIDリスト | 同上 |