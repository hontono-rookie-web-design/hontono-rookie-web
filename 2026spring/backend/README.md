# backend

## 構成

`backend`内のディレクトリ構成を説明する。

```
backend
  ├ README.md
  ├ config
  │  └ settings.yml     設定ファイル
  ├ lib
  │  ├ __init__.py
  │  ├ sheet_client.py  スプレッドシート関連モジュール
  │  ├ niconico.py      ニコニコのAPI関連モジュール
  │  └ utils.py         共通モジュール
  ├ scripts             実行スクリプトディレクトリ
  │  └ fetch_videos.py  参加動画一覧更新スクリプト
  └ requirements.txt
```

## 環境

スクリプトの実行環境について説明する。

以下の環境での実行を想定。
- python: 3.12
- パッケージ管理: pip
- 仮想環境: venv

ローカルで実行する場合の環境設定方法

1. 仮想環境の作成
    ```
    cd 2026spring/backend
    python -m venv .venv
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

設定ファイルについて説明する。
`config/settings.yml`で、タグやスプレッドシート名などの情報を設定している。
次回開催時にコードを流用する場合にはこのファイルのみ変更すれば良い想定。

また、スクリプト内では、`lib.utils.load_config`を呼ぶことで、`dict`形式で`config/settings.yml`の内容が取得できる。

以下で、`config/settings.yml`で設定できるパラメータを項目ごとに説明する。

### `tag`

タグの情報を設定する。
| パラメータ名 | 内容 |
| --- | --- |
| `rookie` | ルーキー参加タグ | 
| `op` | opステージ参加タグ |
| `ex` | exステージ参加タグ |

### `spreadsheet`

スプレッドシートの情報を設定する。
各スプレッドシートについて、`name`でスプレッドシート名を設定し、その他で各シートのシート名を設定している。


## 実行

各処理の実行手順を説明する。

### 共通準備

1. `config/settings.yml`に必要な設定を記載する。

1. 環境変数`GOOGLE_APPLICATION_CREDENTIALS`に、Google API アクセストークンのJSONのPathを指定する。以下を実行すれば設定できる。
    ```
    export GOOGLE_APPLICATION_CREDENTIALS=<JSONのPath>
    ```

### 参加動画一覧更新 (`fetch_videos.py`)

1. 「動画除外リスト_*」のスプレッドシートに一覧から除外する動画のIDリストを作成する。

1. `backend`ディレクトリで以下を実行
    ```
    python -m scripts.fetch_videos
    ```


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