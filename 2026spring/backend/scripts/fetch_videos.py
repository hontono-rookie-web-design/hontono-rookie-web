import os
import datetime
import warnings
import argparse

from lib import sheet_client
from lib import niconico
from lib import utils


def connect_sheet(spreadsheet_name, sheet_name):
    # 環境変数からJSONパス取得
    credentials_path = os.environ["GOOGLE_APPLICATION_CREDENTIALS"]

    return sheet_client.connect_sheet(credentials_path, spreadsheet_name, sheet_name)


def fetch_video(tag: str, limit: int = 100):
    videos = niconico.fetch_all_videos(tag, limit)
    videos = niconico.attach_username_and_thumbnail(videos)
    return videos


def split_videos_by_exclusion(
    videos: list[dict],
    exclusion_list_sheet,
    start_period: datetime.datetime = None,
) -> tuple[list[dict], list[dict], list[dict]]:
    """除外リストと投稿期間開始時刻によって、動画を期間前/期間内/除外の3つに振り分ける
    1. 除外リストに存在するものは除外リストの移動先に従って振り分け（移動先の指定がなければ除外）
    2. 上記以外は、投稿時刻が投稿期間開始時刻より前か後かで期間前/期間内に振り分け
      （投稿期間開始時刻が渡されない場合は期間内に振り分け）

    Args:
        videos (list[dict]): 動画リスト
        exclusion_list_sheet (worksheet): 除外リストのワークシート
        start_period (datetime.datetime, optional): 投稿期間開始時刻

    Returns:
        tuple[list[dict], list[dict], list[dict]]: 期間前/期間内/除外の動画リスト
    """
    content_id_key = "動画ID"
    destination_key = "移動先"

    data = sheet_client.fetch_sheet_data(exclusion_list_sheet)
    destinations = {row[content_id_key]: row.get(destination_key, None) for row in data}

    before_period = []
    during_period = []
    excluded = []

    for v in videos:
        if v["contentId"] in destinations.keys():
            # 除外リストに入っている動画は除外リストにしたがって振り分け
            destination = destinations[v["contentId"]]
            if destination in ["op", "OP", "オープニング"]:
                before_period.append(v)
            elif destination in ["rookie", "ROOKIE", "ルーキー"]:
                during_period.append(v)
            else:
                excluded.append(v)
                if destination not in [None, "", "除外"]:
                    warnings.warn(f"destination of {v["contentId"]}: {destination}.")
            continue

        # 投稿時刻で振り分け
        if start_period is None:
            during_period.append(v)
            continue

        posting_time = datetime.datetime.fromisoformat(v["startTime"])
        if posting_time < start_period:
            before_period.append(v)
        else:
            during_period.append(v)

    return before_period, during_period, excluded


def write_sheet(sheet, videos: list[dict]):

    data = []
    for v in videos:

        video_id = v["contentId"]

        data.append(
            {
                "動画ID": video_id,
                "タイトル": v["title"],
                "投稿者ID": v["userId"],
                "投稿者名": v["userName"],
                "投稿日時": v["startTime"],
                "概要欄": v["description"],
                "動画時間": v["lengthSeconds"],
                "再生数": v["viewCounter"],
                "いいね": v.get("likeCounter", 0),
                "コメント": v["commentCounter"],
                "マイリスト": v["mylistCounter"],
                "URL": f"https://www.nicovideo.jp/watch/{video_id}",
                "サムネイルURL": v["thumbnailUrl"],
            }
        )

    sheet_client.update_sheet(sheet, data)


def update_video_sheet_by_tag(
    tag: str,
    video_catalog_spreadsheetname: str,
    video_catalog_sheetname: str,
    video_catalog_excluded_sheetname: str,
    exclusion_list_spreadsheetname: str,
    exclusion_list_sheetname: str,
    video_catalog_op_sheetname: str = None,
    start_period: datetime.datetime = None,
):
    """タグから動画情報を取得し、動画一覧スプレッドシートを更新する
    除外リスト、投稿期間開始時刻によって、動画を期間前/期間内/除外の3つのワークシートに振り分ける

    Args:
        tag (str): タグ
        video_catalog_spreadsheetname (str): 動画一覧スプレッドシート名
        video_catalog_sheetname (str): （期間内）動画一覧ワークシート名
        video_catalog_excluded_sheetname (str): 除外動画ワークシート名
        exclusion_list_spreadsheetname (str): 除外リストスプレッドシート名
        exclusion_list_sheetname (str): 除外リストワークシート名
        video_catalog_op_sheetname (str, optional): 期間前動画一覧ワークシート名
        start_period (datetime.datetime, optional): 投稿期間開始時刻
    """
    if video_catalog_op_sheetname is not None:
        assert start_period is not None, f"{video_catalog_op_sheetname}, {start_period}"

    videos = fetch_video(tag)
    print(f"{tag}: {len(videos)} videos")

    # 対象動画と除外動画を分離
    exclusion_list_sheet = connect_sheet(
        exclusion_list_spreadsheetname, exclusion_list_sheetname
    )
    before_period, during_period, excluded = split_videos_by_exclusion(
        videos, exclusion_list_sheet, start_period
    )

    # 期間前動画をシートに出力
    if video_catalog_op_sheetname is not None:
        video_catalog_op_sheet = connect_sheet(
            video_catalog_spreadsheetname, video_catalog_op_sheetname
        )
        write_sheet(video_catalog_op_sheet, before_period)

    # 期間内動画をシートに出力
    video_catalog_sheet = connect_sheet(
        video_catalog_spreadsheetname, video_catalog_sheetname
    )
    write_sheet(video_catalog_sheet, during_period)

    # 除外動画をシートに出力
    excluded_sheet = connect_sheet(
        video_catalog_spreadsheetname, video_catalog_excluded_sheetname
    )
    write_sheet(excluded_sheet, excluded)

    print(f"{video_catalog_spreadsheetname} update completed")


def main():
    parser = argparse.ArgumentParser(description="Fetch videos by tag keys")
    parser.add_argument(
        "--keys",
        nargs="*",
        help="実行するタグキー（例: ex fanfic）。未指定の場合は全て実行",
    )

    args = parser.parse_args()

    config = utils.load_config()
    tag_config: dict[str, str] = config["tag"]
    catalog_sheet_config = config["spreadsheets"]["video_catalog"]
    exclusion_sheet_config = config["spreadsheets"]["video_exclusion_list"]

    catalog_spreadsheetname = catalog_sheet_config["name"]
    exclusion_spreadsheetname = exclusion_sheet_config["name"]

    start_period_rookie = datetime.datetime.fromisoformat(
        config["period"]["start_period"]
    )

    # 実行対象キーの決定
    if args.keys:
        target_keys = args.keys

        # 不正キーのチェック（安全性向上）
        invalid_keys = set(target_keys) - set(tag_config.keys())
        if invalid_keys:
            raise ValueError(f"Invalid keys: {invalid_keys}")
    else:
        target_keys = tag_config.keys()

    # for div in ["rookie", "op", "ex"]:
    for div in tag_config.keys():
        tag = tag_config[div]
        catalog_sheetname = catalog_sheet_config[f"{div}_sheet"]
        catalog_excluded_sheetname = catalog_sheet_config[f"excluded_{div}_sheet"]
        exclusion_sheetname = exclusion_sheet_config[f"{div}_sheet"]

        if div == "rookie":
            catalog_op_sheetname = catalog_sheet_config["op_sheet"]
            start_period = start_period_rookie
        else:
            catalog_op_sheetname = None
            start_period = None

        update_video_sheet_by_tag(
            tag,
            catalog_spreadsheetname,
            catalog_sheetname,
            catalog_excluded_sheetname,
            exclusion_spreadsheetname,
            exclusion_sheetname,
            catalog_op_sheetname,
            start_period,
        )


if __name__ == "__main__":
    main()
