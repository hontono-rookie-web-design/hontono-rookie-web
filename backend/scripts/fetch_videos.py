import os
import requests
import gspread
from google.oauth2.service_account import Credentials


TAG = "本当のルーキー祭り2025秋"
SPREADSHEET_NAME = "video_catalog_2025autumn"
SHEET_NAME = "videos"

LIMIT = 100


def fetch_all_videos(tag):

    url = "https://snapshot.search.nicovideo.jp/api/v2/snapshot/video/contents/search"

    fields = [
        "contentId",
        "title",
        "startTime",
        "viewCounter",
        "likeCounter",
        "commentCounter",
        "mylistCounter",
        "tags",
    ]

    all_videos = []
    offset = 0

    while True:

        params = {
            "q": tag,
            "targets": "tagsExact",
            "fields": ",".join(fields),
            "_limit": LIMIT,
            "_offset": offset,
            "_sort": "+startTime",
            # "_context": "rookie_tag_collection_script",
        }

        # headers = {"User-Agent": "niconico-rookie-script", "X-Frontend-Id": "6"}

        res = requests.get(url, params=params)
        # res = requests.get(url, params=params, headers=headers)
        res.raise_for_status()

        data = res.json()["data"]

        if not data:
            break

        all_videos.extend(data)

        print(f"{len(all_videos)} 件取得")

        offset += LIMIT

    return all_videos


def connect_sheet():

    scope = [
        "https://www.googleapis.com/auth/spreadsheets",
        "https://www.googleapis.com/auth/drive",
    ]

    # 環境変数からJSONパス取得
    credentials_path = os.environ["GOOGLE_APPLICATION_CREDENTIALS"]

    credentials = Credentials.from_service_account_file(credentials_path, scopes=scope)

    gc = gspread.authorize(credentials)

    spreadsheet = gc.open(SPREADSHEET_NAME)

    try:
        sheet = spreadsheet.worksheet(SHEET_NAME)
    except gspread.WorksheetNotFound:
        sheet = spreadsheet.add_worksheet(title=SHEET_NAME, rows=2000, cols=10)

    return sheet


def write_sheet(sheet, videos):

    header = [
        "動画ID",
        "タイトル",
        "投稿日",
        "再生数",
        "いいね",
        "コメント",
        "マイリスト",
        "URL",
    ]

    rows = [header]

    for v in videos:

        video_id = v["contentId"]

        rows.append(
            [
                video_id,
                v["title"],
                v["startTime"],
                v["viewCounter"],
                v.get("likeCounter", 0),
                v["commentCounter"],
                v["mylistCounter"],
                f"https://www.nicovideo.jp/watch/{video_id}",
            ]
        )

    sheet.clear()
    sheet.update(rows)


def main():

    print("動画取得開始")

    videos = fetch_all_videos(TAG)

    print(f"合計 {len(videos)} 件")

    sheet = connect_sheet()

    write_sheet(sheet, videos)

    print("スプレッドシート更新完了")


if __name__ == "__main__":
    main()
