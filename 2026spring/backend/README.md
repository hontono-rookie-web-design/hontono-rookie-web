# backend

\<yyyyseoson\> は開催期（「2026春」「2026spring」など）に置き換えてください。

## 構成

### ディレクトリ構成

`2026spring/backend`内のディレクトリ構成は以下。

```
backend
├ README.md
├ config
│  └ settings.yml                 設定ファイル
├ lib
│  ├ __init__.py
│  ├ sheet_client.py              スプレッドシート関連モジュール
│  ├ niconico.py                  ニコニコ動画からの情報取得関連モジュール
│  ├ youtube.py                   YouTubeからの情報取得関連モジュール
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


### workflow

backend処理関連のworkflowは以下があり、workflowファイルは`.github/workflows`以下にある。
GitHub Actionsで実行する。

| workflow | workflowファイル | 処理内容 |
| --- | --- | --- |
| \<yyyyseoson\> Fetch Videos Rookie | `<yyyyseoson>_fetch_videos_rookie.yml` | Rookie、opステージの動画リストを更新する |
| \<yyyyseoson\> Fetch Videos ex | `<yyyyseoson>_fetch_videos_ex.yml` | exステージ（、二次創作）の動画リストを更新する |
| \<yyyyseoson\> Fetch Note | `<yyyyseoson>_fetch_note.yml` | Note記事リストを更新する |
| \<yyyyseoson\> Fetch Fanfic From Result | `<yyyyseoson>_fetch_fanfic_from_result.yml` | 二次創作作品提出フォーム回答リストを更新する |
| \<yyyyseoson\> Fetch Fanfic | `<yyyyseoson>_fetch_fanfic.yml` | 二次創作作品リストを更新する |

## 運用方法

想定する運用方法を説明する。

### 事前準備

#### スプレッドシートの作成

1. 本当のルーキー祭りWebデザイン部のGoogle Driveに以下のスプレッドシートを作成する。

   | スプレッドシート名 | 概要 |
   | --- | --- |
   | video_catalog_\<yyyyseoson\> | 参加作品動画リスト | 
   | grouped_video_catalog_\<yyyyseoson\> | 投票グループ分けした参加作品動画リスト | 
   | note_list_\<yyyyseoson\> | Note記事リスト | 
   | fanfic_list_\<yyyyseoson\> | 二次創作作品リスト | 
   | 動画除外リスト_\<yyyyseoson\> | 参加作品動画の除外リスト | 
   | 二次創作作品提出フォーム回答_\<yyyyseoson\> | 二次創作作品提出フォーム回答リスト | 

   スプレッドシートのシート名は`config/setting.yml`の`spreadsheets`の項目で設定するので、その名称のシートを用意しておくと良い。
   

#### workflow準備

1. `.github/workflows`にworkflowファイルを作成する。
   作成すべきファイルは、構成 workflowの項目を参照。

1. workflowの実行頻度を設定する。
   実行頻度は、`on:` > `schedule:` > `cron:`の項目で設定する。
   例えば、以下のように設定できる。
   | 記述 | 設定内容 |
   | --- | --- |
   | `'0 * * * *'` | 毎時実行 |
   | `'0 */3 * * *'` | 3時間おき実行 |
   | `'0 */6 * * *'` | 6時間おき実行 |
   | `'0 15 * * *'` | 毎日実行（日本時間0時） |

   実行頻度は、例えば以下のように設定すれば良いと思う。

   | 時期 | 作品動画リスト更新関連処理 | 二次創作作品・Noteリスト更新関連処理 |
   | --- | --- | -- |
   | 投稿期間 | 3時間おき実行 | 毎日実行 |
   | 投票期間 | 毎日実行（exステージのみ） | 毎日実行 |
   | 終了後 | 実行なし | たまに手動実行 |


#### 二次創作作品提出フォームの作成

1. 二次創作作品の情報を提出いただくGoogle Form（二次創作作品提出フォーム）を作成する。Note記事以外の二次創作作品は、このGoogle Formに回答いただいて情報を集め、リストを作成する。
   以下の情報を記入してもらうGoogle Formを作成する（形式は過去の二次創作作品提出フォームを参照）。
   二次創作者活動名、分類、配信日時、投稿先サービス、二次創作作品URL、元作品URL、タイトル、画像URL

1. 作成した二次創作作品提出フォームの回答を「二次創作作品提出フォーム回答リスト」スプレッドシートにリンクさせる。リンクさせるシート名は`config/setting.yml`の`spreadsheets`>`forms_result_fanfic`>`forms_result`で設定したものにする。

### 開催中処理

#### 除外動画の設定

1. 参加タグがついた動画の中で事情があり作品動画リストから除外する必要がある動画を、参加作品動画の除外リストに記載する。
   
   opステージ、ルーキー参加動画については「rookie」シート、exステージ参加動画は「ex」シートに以下のように記載する。
   - 期間外投稿動画、インスト動画などをリストから除外する場合
     | 動画ID | 移動先 |
     | --- | --- |
     | 除外する動画ID | (空欄) |
   - opステージ投稿期間より後（ルーキー作品投稿期間）に投稿された動画をopステージ参加動画に移動させる場合
     | 動画ID | 移動先 |
     | --- | --- |
     | 移動させる動画ID | op |
   - ルーキー作品投稿期間より前（opステージ投稿期間）に投稿された動画をルーキー参加動画に移動させる場合
     | 動画ID | 移動先 |
     | --- | --- |
     | 移動させる動画ID | ルーキー |
   「除外理由」欄はメモ用なので、備考がある場合は記載する。「動画ID」はsmなどから始まる番号。

#### 二次創作作品の確認

1. 二次創作作品の情報が、二次創作作品提出フォーム回答リストの二次創作作品情報確認用シート（`config/setting.yml`の`spreadsheets`>`forms_result_fanfic`>`for_check`で設定した名称のシート）に二次創作情報が追加されていくので、Webへの掲載可否を判断し、掲載して良いものは「掲載可否」の欄の数値を1に変更する。

1. 二次創作確認用シートで、欠損のある内容や間違っている内容があれば記入・訂正を行う。

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

各パラメータの説明は`config/settings.yml`ファイル内のコメントを参照。

スクリプト内では、`lib.utils.load_config`を呼ぶことで、`dict`形式で設定内容が取得できる。


## スプレッドシート

backendの処理で利用するGoogleスプレッドシートを説明する。
Googleスプレッドシートをデータベースとして利用している。

スプレッドシート名、シート名は、設定ファイル`config/settings.yml`で設定している。以下の表は、現在設定しているスプレッドシート名。

スプレッドシートは以下がある。

| スプレッドシート名 | 概要 | 更新workflow |
| --- | --- | --- |
| video_catalog_\<yyyyseoson\> | 参加作品動画リスト | \<yyyyseoson\> Fetch Videos Rookie、\<yyyyseoson\> Fetch Videos ex |
| grouped_video_catalog_\<yyyyseoson\> | 投票グループ分けした参加作品動画リスト | |
| note_list_\<yyyyseoson\> | Note記事リスト | \<yyyyseoson\> Fetch Note |
| fanfic_list_\<yyyyseoson\> | 二次創作作品リスト | \<yyyyseoson\> Fetch Videos Fanfic |
| 動画除外リスト_\<yyyyseoson\> | 参加作品動画の除外リスト |  |
| 二次創作作品提出フォーム回答_\<yyyyseoson\> | 二次創作作品提出フォーム回答リスト |  |

現状、workflowやスクリプトで更新するスプレッドシートは英語名、手動で更新するスプレッドシートは日本語名をつけている（この命名ルールは要議論）。


## 実行

各処理をローカルで実行する場合の手順を説明する。

### 共通準備

1. `config/settings.yml`に設定を記載する。

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
    参加作品動画リストが更新される。

### note記事一覧更新

1. `backend`ディレクトリで以下を実行
    ```
    python -m scripts.fetch_note
    ```
    Note記事リストが更新される。

### 二次創作作品一覧更新

1. `backend`ディレクトリで以下を実行
    ```
    python -m scripts.fetch_fanfic_forms_result
    ```
    二次創作作品提出フォーム回答リストの二次創作作品情報確認用シートが更新される。
1. 二次創作作品情報確認用シートを確認し、二次創作作品リストに載せる作品は「掲載可否」欄を1にする。
1. `backend`ディレクトリで以下を実行
    ```
    python -m scripts.fetch_fanfic
    ```
    二次創作作品リストが更新される。

### 投票グループ分け

### 投票Form作成

