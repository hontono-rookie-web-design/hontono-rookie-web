import os
import gspread
from google.oauth2.service_account import Credentials

from backend.lib import sheet_client
from backend.lib import niconico
from backend.lib import utils


def connect_sheet(spreadsheet_name, sheet_name):
    # 環境変数からJSONパス取得
    credentials_path = os.environ["GOOGLE_APPLICATION_CREDENTIALS"]

    return sheet_client.connect_sheet(credentials_path, spreadsheet_name, sheet_name)


def fetch_video(tag: str, limit: int = 100):
    videos = niconico.fetch_all_videos(tag, limit)
    videos = niconico.attach_user_names(videos)
    return videos


def split_videos_by_exclusion(videos, exclusion_list_sheet):

    data = sheet_client.fetch_sheet_data(exclusion_list_sheet)
    exclusion_list = [row["動画ID"] for row in data]

    included = []
    excluded = []

    for v in videos:
        if v["contentId"] in exclusion_list:
            excluded.append(v)
        else:
            included.append(v)

    return included, excluded


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
            }
        )

    sheet_client.update_sheet(sheet, data)


def main():
    config = utils.load_config()
    tag = config["niconico"]["tag"]
    spreadsheet_name = config["spreadsheets"]["video_catalog"]["name"]
    sheet_name = config["spreadsheets"]["video_catalog"]["sheet"]
    excluded_sheet_name = config["spreadsheets"]["video_catalog"]["excluded_sheet"]
    exclusion_list_spreadsheet_name = config["spreadsheets"]["video_exclusion_list"][
        "name"
    ]
    exclusion_list_sheet_name = config["spreadsheets"]["video_exclusion_list"]["sheet"]

    # 動画情報の取得
    print("動画取得開始")
    videos = fetch_video(tag)
    print(f"合計 {len(videos)} 件")

    # 対象動画と除外動画を分離
    exclusion_list_sheet = connect_sheet(
        exclusion_list_spreadsheet_name, exclusion_list_sheet_name
    )
    included, excluded = split_videos_by_exclusion(videos, exclusion_list_sheet)

    # 対象動画をシートに出力
    sheet = connect_sheet(spreadsheet_name, sheet_name)
    write_sheet(sheet, included)

    # 除外動画をシートに出力
    excluded_sheet = connect_sheet(spreadsheet_name, excluded_sheet_name)
    write_sheet(excluded_sheet, excluded)

    print("動画一覧更新完了")


if __name__ == "__main__":
    main()
