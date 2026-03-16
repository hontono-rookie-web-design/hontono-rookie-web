import os
import requests
import gspread
from google.oauth2.service_account import Credentials
from bs4 import BeautifulSoup


def fetch_all_videos(tag, limit=100):

    url = "https://snapshot.search.nicovideo.jp/api/v2/snapshot/video/contents/search"

    fields = [
        "contentId",
        "title",
        "userId",
        "description",
        "startTime",
        "viewCounter",
        "likeCounter",
        "commentCounter",
        "mylistCounter",
        "tags",
        "lengthSeconds",
    ]

    all_videos = []
    offset = 0

    while True:

        params = {
            "q": tag,
            "targets": "tagsExact",
            "fields": ",".join(fields),
            "_limit": limit,
            "_offset": offset,
            "_sort": "+startTime",
        }

        res = requests.get(url, params=params)
        res.raise_for_status()

        data = res.json()["data"]

        if not data:
            break

        all_videos.extend(data)

        print(f"{len(all_videos)} 件取得")

        offset += limit

    return all_videos


def get_username(user_id):
    url = f"https://www.nicovideo.jp/user/{user_id}"

    headers = {"User-Agent": "Mozilla/5.0"}

    res = requests.get(url, headers=headers)

    if res.status_code != 200:
        return None

    soup = BeautifulSoup(res.text, "html.parser")

    # ユーザー名は <meta property="profile:username"> に入っている
    meta = soup.find("meta", {"property": "profile:username"})
    if meta:
        return meta.get("content")

    # fallback: titleタグ
    if soup.title:
        return soup.title.text.replace(" - ニコニコ", "")

    return None


def attach_user_names(videos):

    user_cache = {}

    for video in videos:

        user_id = video.get("userId")

        if not user_id:
            video["userName"] = None
            continue

        if user_id not in user_cache:
            user_cache[user_id] = get_username(user_id)

        video["userName"] = user_cache[user_id]

    return videos


def connect_sheet(spreadsheet_name, sheet_name):

    scope = [
        "https://www.googleapis.com/auth/spreadsheets",
        "https://www.googleapis.com/auth/drive",
    ]

    # 環境変数からJSONパス取得
    credentials_path = os.environ["GOOGLE_APPLICATION_CREDENTIALS"]

    credentials = Credentials.from_service_account_file(credentials_path, scopes=scope)

    gc = gspread.authorize(credentials)

    spreadsheet = gc.open(spreadsheet_name)

    try:
        sheet = spreadsheet.worksheet(sheet_name)
    except gspread.WorksheetNotFound:
        sheet = spreadsheet.add_worksheet(title=sheet_name, rows=2000, cols=10)

    return sheet


def write_sheet(sheet, videos):

    header = [
        "動画ID",
        "タイトル",
        "投稿者ID",
        "投稿者名",
        "投稿日時",
        "概要欄",
        "動画時間",
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
                v["userId"],
                v["userName"],
                v["startTime"],
                v["description"],
                v["lengthSeconds"],
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
    # TAG = "本当のルーキー祭り2025秋"
    # SPREADSHEET_NAME = "video_catalog_2025autumn"
    TAG = "本当のルーキー祭り2026春"
    SPREADSHEET_NAME = "video_catalog_2026spring"
    SHEET_NAME = "videos"

    LIMIT = 100

    print("動画取得開始")

    videos = fetch_all_videos(TAG, LIMIT)
    videos = attach_user_names(videos)

    print(f"合計 {len(videos)} 件")

    sheet = connect_sheet(SPREADSHEET_NAME, SHEET_NAME)
    write_sheet(sheet, videos)

    print("スプレッドシート更新完了")


if __name__ == "__main__":
    main()
