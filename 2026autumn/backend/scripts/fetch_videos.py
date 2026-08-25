import argparse
import datetime
import os
import warnings

from lib import niconico, sheet_client, utils

# video_listシートの全列名（他の処理が書き込むgroup_id・順位関連の列を含む）
HEADERS = [
    "video_id",
    "title",
    "user_id",
    "user_name",
    "posted_at",
    "description",
    "duration_time",
    "view_count",
    "like_count",
    "comment_count",
    "mylist_count",
    "video_url",
    "thumbnail_url",
    "status",
    "excluded",
    "prelim_group_id",
    "final_group_id",
    "sp_group_id",
    "prelim_rank",
    "final_rank",
    "sp_rank",
]


def connect_sheet(spreadsheet_name, sheet_name):
    # 環境変数からJSONパス取得
    credentials_path = os.environ["GOOGLE_APPLICATION_CREDENTIALS"]

    return sheet_client.connect_sheet(credentials_path, spreadsheet_name, sheet_name)


def fetch_video(tag: str, limit: int = 100):
    videos = niconico.fetch_all_videos(tag, limit)
    videos = niconico.attach_username_and_thumbnail(videos)
    return videos


def classify_videos(
    videos: list[dict],
    exclusion_list_sheet,
    status_during: str,
    status_before: str = None,
    start_period: datetime.datetime = None,
) -> list[dict]:
    """除外リストと投稿期間開始時刻をもとに、各動画にstatus・excludedを付与する
    1. 除外リストに存在するものは除外リストの移動先に従ってstatusを決定
      （移動先の指定がなければ除外扱いとし、statusは2.のルールで決定）
    2. 上記以外は、投稿時刻が投稿期間開始時刻より前か後かでstatusを決定
      （投稿期間開始時刻が渡されない場合はstatus_during）

    Args:
        videos (list[dict]): 動画リスト
        exclusion_list_sheet (worksheet): 除外リストのワークシート
        status_during (str): 投稿期間内（通常時）に付与するstatus
        status_before (str, optional): 投稿期間より前の動画に付与するstatus
            （Noneの場合は投稿時刻による振り分けを行わない）
        start_period (datetime.datetime, optional): 投稿期間開始時刻

    Returns:
        list[dict]: 各動画に"status"・"excluded"を付与したリスト
    """
    content_id_key = "video_id"
    destination_key = "move_to"

    data = sheet_client.fetch_sheet_data(exclusion_list_sheet)
    destinations = {row[content_id_key]: row.get(destination_key, None) for row in data}

    results = []

    for v in videos:
        excluded = False
        status = None

        if v["contentId"] in destinations:
            # 除外リストに入っている動画は除外リストにしたがって振り分け
            destination = destinations[v["contentId"]]
            if status_before is not None and destination in [
                "op",
                "OP",
                "オープニング",
                "ex",
                "EX",
            ]:
                status = status_before
            elif destination in ["rookie", "ROOKIE", "ルーキー"]:
                status = status_during
            else:
                excluded = True
                if destination not in [None, "", "除外"]:
                    warnings.warn(f"destination of {v["contentId"]}: {destination}.")

        if status is None:
            # 除外リスト未記載、または移動先の指定なしの場合は投稿時刻で振り分け
            if status_before is not None and start_period is not None:
                posting_time = datetime.datetime.fromisoformat(v["startTime"])
                status = status_before if posting_time < start_period else status_during
            else:
                status = status_during

        results.append({**v, "status": status, "excluded": excluded})

    return results


def build_row(v: dict) -> dict:
    video_id = v["contentId"]

    return {
        "video_id": video_id,
        "title": v["title"],
        "user_id": v["userId"],
        "user_name": v["userName"],
        "posted_at": v["startTime"],
        "description": v["description"],
        "duration_time": v["lengthSeconds"],
        "view_count": v["viewCounter"],
        "like_count": v.get("likeCounter", 0),
        "comment_count": v["commentCounter"],
        "mylist_count": v["mylistCounter"],
        "video_url": f"https://www.nicovideo.jp/watch/{video_id}",
        "thumbnail_url": v["thumbnailUrl"],
        "status": v["status"],
        "excluded": v["excluded"],
    }


def update_video_list_by_tag(
    tag: str,
    video_list_sheet,
    exclusion_list_sheet,
    status_during: str,
    status_before: str = None,
    start_period: datetime.datetime = None,
):
    """タグから動画情報を取得し、video_listシートを更新する（既存の行はキー一致で上書き、なければ追加）
    group_id・順位など他の処理が書き込む列は更新しない。

    Args:
        tag (str): タグ
        video_list_sheet (worksheet): video_listワークシート
        exclusion_list_sheet (worksheet): 除外リストのワークシート（全部門共通の単一シート）
        status_during (str): 投稿期間内（通常時）に付与するstatus
        status_before (str, optional): 投稿期間より前の動画に付与するstatus
        start_period (datetime.datetime, optional): 投稿期間開始時刻
    """
    videos = fetch_video(tag)
    print(f"{tag}: {len(videos)} videos")

    classified_videos = classify_videos(
        videos, exclusion_list_sheet, status_during, status_before, start_period
    )

    rows = [build_row(v) for v in classified_videos]

    sheet_client.upsert_sheet(video_list_sheet, rows, key="video_id", headers=HEADERS)

    print(f"{status_during}/{status_before or ''} update completed")


def main():
    parser = argparse.ArgumentParser(description="Fetch videos by tag keys")
    parser.add_argument(
        "--keys",
        nargs="*",
        help="実行するタグキー（例: rookie sp）。未指定の場合は全て実行",
    )
    args = parser.parse_args()

    config = utils.load_config()
    tag_config: dict[str, str] = config["tag"]
    status_config: dict[str, str] = config["status"]

    video_list_sheet_config = config["spreadsheets"]["video_list"]
    exclusion_sheet_config = config["spreadsheets"]["excluded_list"]

    # 環境変数EXCLUSION_LIST_SPREADSHEET_NAMEが設定されていればそちらを優先する
    # （ローカルでの開発用スプレッドシート向けテスト実行用。未設定時はsettings.ymlの値＝本番用を使う）
    exclusion_spreadsheetname = os.environ.get(
        "EXCLUSION_LIST_SPREADSHEET_NAME", exclusion_sheet_config["name"]
    )
    print(f"接続先スプレッドシート（除外リスト）: {exclusion_spreadsheetname}")

    exclusion_list_sheet = connect_sheet(
        exclusion_spreadsheetname, exclusion_sheet_config["sheet"]
    )

    start_period_rookie = datetime.datetime.fromisoformat(
        config["period"]["start_period"]
    )

    # このスクリプトが対象とする部門（rookie, sp）
    target_divs = ["rookie", "sp"]

    # 実行対象キーの決定
    if args.keys:
        target_keys = args.keys

        # 不正キーのチェック（安全性向上）
        invalid_keys = set(target_keys) - set(target_divs)
        if invalid_keys:
            raise ValueError(f"Invalid keys: {invalid_keys}")
    else:
        target_keys = target_divs

    # 環境変数VIDEO_LIST_SPREADSHEET_NAMEが設定されていればそちらを優先する
    # （ローカルでの開発用スプレッドシート向けテスト実行用。未設定時はsettings.ymlの値＝本番用を使う）
    video_list_spreadsheetname = os.environ.get(
        "VIDEO_LIST_SPREADSHEET_NAME", video_list_sheet_config["name"]
    )
    print(f"接続先スプレッドシート: {video_list_spreadsheetname}")

    video_list_sheet = connect_sheet(
        video_list_spreadsheetname, video_list_sheet_config["sheet"]
    )

    for div in target_keys:
        tag = tag_config[div]

        if div == "rookie":
            status_during = status_config["rookie"]
            status_before = status_config["ex"]
            start_period = start_period_rookie
        else:
            status_during = status_config["sp"]
            status_before = None
            start_period = None

        update_video_list_by_tag(
            tag,
            video_list_sheet,
            exclusion_list_sheet,
            status_during,
            status_before,
            start_period,
        )


if __name__ == "__main__":
    main()
