import os
from typing import List, Dict

from lib import sheet_client
from lib import niconico
from lib import utils


def connect(spreadsheet_name: str, sheet_name: str):
    credentials_path = os.environ["GOOGLE_APPLICATION_CREDENTIALS"]
    return sheet_client.connect_sheet(credentials_path, spreadsheet_name, sheet_name)


def build_video_index(tag: str) -> dict:
    """
    snapshot APIから動画情報を辞書化
    """
    videos = niconico.fetch_all_videos(tag)
    videos = niconico.attach_username_and_thumbnail(videos)

    index = {}

    for v in videos:
        vid = v["contentId"]

        index[vid] = {
            "動画ID": vid,
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
            "URL": f"https://www.nicovideo.jp/watch/{vid}",
            "サムネイルURL": v["thumbnailUrl"],
        }

    return index


def main():
    config = utils.load_auxiliary_config()

    tag = config["tag"]["rookie"]

    input_conf = config["spreadsheets"]["grouped_video_catalog"]
    output_conf = config["spreadsheets"]["updated_video_catalog"]

    in_ws = connect(input_conf["name"], input_conf["sheet"])
    out_ws = connect(output_conf["name"], output_conf["sheet"])

    rows = sheet_client.fetch_sheet_data(in_ws)

    print("snapshot APIから動画取得中...")
    video_index = build_video_index(tag)
    print(f"{len(video_index)} 件取得")

    results: List[Dict] = []

    total = len(rows)

    for i, row in enumerate(rows, 1):
        video_id = str(row.get("動画ID"))
        group_id = row.get("グループID")

        if not video_id:
            continue

        print(f"[{i}/{total}] {video_id}")

        v = video_index.get(video_id)

        if not v:
            print(f"  → snapshot未取得（タグ漏れ or 反映遅延）")
            continue

        v["グループID"] = group_id
        results.append(v)

    sheet_client.update_sheet(out_ws, results)

    print("完了")


if __name__ == "__main__":
    main()
