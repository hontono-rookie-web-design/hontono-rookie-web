import os

from lib import sheet_client
from lib import niconico
from lib import utils


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


def update_video_sheet_by_tag(
    tag: str,
    video_catalog_spreadsheetname: str,
    video_catalog_sheetname: str,
    video_catalog_excluded_sheetname: str,
    exclusion_list_spreadsheetname: str,
    exclusion_list_sheetname: str,
):

    videos = fetch_video(tag)
    print(f"{tag}: {len(videos)} videos")

    # 対象動画と除外動画を分離
    exclusion_list_sheet = connect_sheet(
        exclusion_list_spreadsheetname, exclusion_list_sheetname
    )
    included, excluded = split_videos_by_exclusion(videos, exclusion_list_sheet)

    # 対象動画をシートに出力
    video_catalog_sheet = connect_sheet(
        video_catalog_spreadsheetname, video_catalog_sheetname
    )
    write_sheet(video_catalog_sheet, included)

    # 除外動画をシートに出力
    excluded_sheet = connect_sheet(
        video_catalog_spreadsheetname, video_catalog_excluded_sheetname
    )
    write_sheet(excluded_sheet, excluded)

    print(f"{tag} update completed")


def main():
    config = utils.load_config()
    tag_config: dict[str, str] = config["tag"]
    catalog_sheet_config = config["spreadsheets"]["video_catalog"]
    exclusion_sheet_config = config["spreadsheets"]["video_exclusion_list"]

    catalog_spreadsheetname = catalog_sheet_config["name"]
    exclusion_spreadsheetname = exclusion_sheet_config["name"]

    # for div in ["rookie", "op", "ex"]:
    for div in tag_config.keys():

        tag = tag_config[div]
        catalog_sheetname = catalog_sheet_config[f"{div}_sheet"]
        catalog_excluded_sheetname = catalog_sheet_config[f"excluded_{div}_sheet"]
        exclusion_sheetname = exclusion_sheet_config[f"{div}_sheet"]

        update_video_sheet_by_tag(
            tag,
            catalog_spreadsheetname,
            catalog_sheetname,
            catalog_excluded_sheetname,
            exclusion_spreadsheetname,
            exclusion_sheetname,
        )


if __name__ == "__main__":
    main()
