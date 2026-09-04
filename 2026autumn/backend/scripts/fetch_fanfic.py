import os

import requests
from bs4 import BeautifulSoup
from dotenv import load_dotenv
from lib import niconico, sheet_client, utils, youtube

load_dotenv()

HTTP_HEADERS = {"User-Agent": "Mozilla/5.0"}

# derivative_listシートの全列名（checkは承認作業用の列。新規行のみ0で初期化し、
# 既存行の値はイベント期間中スタッフが手動で1に切り替えるため上書きしない）
HEADERS = [
    "derivative_id",
    "creator_name",
    "category",
    "posted_service",
    "derivative_title",
    "derivative_url",
    "derivative_img_url",
    "original_id",
    "stream_at",
    "check",
]

# フォーム回答シートの列名 → 中間キーの対応
TABLE_KEYS = {
    "category": "分類",
    "release_time": "配信日時",
    "author": "二次創作者活動名",
    "service": "投稿先サービス",
    "url": "二次創作作品URL",
    "title": "タイトル",
    "image": "画像URL",
    "org_url": "元作品URL",
}


def deduplicate_by_url(data: list[dict]) -> list[dict]:
    """
    URLをキーに重複削除（後ろを残す）
    """

    url_map = {}

    for item in data:
        url = item.get(TABLE_KEYS["url"])
        if url is not None:
            url_map[url] = item  # 後ろの要素で上書き

    return list(url_map.values())


def fetch_niconico(url):
    fields = ["title", "description", "thumbnail_url"]
    data = niconico.fetch_single_video(url, fields)
    data["image"] = data.pop("thumbnail_url")

    return data


def fetch_youtube(url):
    fields = ["title", "description", "thumbnail_url"]
    data = youtube.fetch_single_video(url, fields)
    data["image"] = data.pop("thumbnail_url")

    return data


def fetch_others(url):
    # Xはスクレイピングを用いずに情報の取得が難しそうなため、取得しない
    return {"title": None, "description": None, "image": None}


def fetch_by_service(service, url):
    try:
        if service == "ニコニコ動画":
            return fetch_niconico(url)
        elif service == "YouTube":
            return fetch_youtube(url)
        elif service == "その他":
            return fetch_others(url)
        else:
            return None
    except Exception as e:
        print(f"error: {url} -> {e}")
    return None


def build_row(item: dict) -> dict:
    fields = {k: item.get(v) for k, v in TABLE_KEYS.items()}

    # ニコニコ動画・YouTubeはOGP相当の情報を取得してタイトル・画像を補完する
    # （Xなどその他サービスはフォーム回答のタイトル・画像URLをそのまま使う）
    if fields["service"] != "その他":
        meta = fetch_by_service(fields["service"], fields["url"])
        if meta:
            fields["title"] = meta.get("title") or fields["title"]
            fields["image"] = meta.get("image") or fields["image"]

    return {
        "creator_name": fields["author"],
        "category": fields["category"],
        "posted_service": fields["service"],
        "derivative_title": fields["title"],
        "derivative_url": fields["url"],
        "derivative_img_url": fields["image"],
        "original_id": fields["org_url"],
        "stream_at": fields["release_time"],
    }


def apply_new_entry_defaults(
    rows: list[dict], existing_ids_by_url: dict[str, int]
) -> list[dict]:
    """
    derivative_url単位で、既存の行は既存のderivative_idを引き継ぎcheckは触らない。
    新規のURLには連番のderivative_idを割り振り、checkを未承認の0で初期化する。
    """

    next_id = max(existing_ids_by_url.values(), default=0) + 1

    result = []
    for row in rows:
        url = row["derivative_url"]
        if url in existing_ids_by_url:
            result.append(row)
        else:
            result.append({**row, "derivative_id": next_id, "check": 0})
            next_id += 1

    return result


# ------------------------
# メイン処理
# ------------------------
def main():
    config = utils.load_config()
    derivative_list_config = config["spreadsheets"]["derivative_list"]
    input_spreadsheet_name = config["spreadsheets"]["forms_result_fanfic"]["name"]
    input_sheet_name = config["spreadsheets"]["forms_result_fanfic"]["forms_result"]

    derivative_list_spreadsheetname = derivative_list_config["name"]
    print(f"接続先スプレッドシート: {derivative_list_spreadsheetname}")

    credentials_path = os.getenv("GOOGLE_APPLICATION_CREDENTIALS")

    # フォーム回答生データを取得
    input_ws = sheet_client.connect_sheet(
        credentials_path, input_spreadsheet_name, input_sheet_name
    )
    rows = sheet_client.fetch_sheet_data(input_ws)
    print(f"total: {len(rows)} items")

    # URL・分類が未回答のものを除外
    rows = [
        row
        for row in rows
        if row.get(TABLE_KEYS["url"]) and row.get(TABLE_KEYS["category"])
    ]

    # 重複削除
    rows = deduplicate_by_url(rows)
    print(f"total: {len(rows)} items")

    total = len(rows)
    new_rows = []
    for i, item in enumerate(rows, 1):
        print(f"[{i}/{total}] {item.get(TABLE_KEYS['url'])}")
        new_rows.append(build_row(item))

    # 書き込み（derivative_urlをキーに更新・追加。checkなど承認作業で使う列は新規行以外上書きしない）
    derivative_list_ws = sheet_client.connect_sheet(
        credentials_path,
        derivative_list_spreadsheetname,
        derivative_list_config["sheet"],
    )
    existing_rows = sheet_client.fetch_sheet_data(derivative_list_ws)
    existing_ids_by_url = {
        row["derivative_url"]: row["derivative_id"]
        for row in existing_rows
        if row.get("derivative_url")
    }

    new_rows = apply_new_entry_defaults(new_rows, existing_ids_by_url)

    sheet_client.upsert_sheet(
        derivative_list_ws, new_rows, key="derivative_url", headers=HEADERS
    )

    print(f"{len(new_rows)} items")


if __name__ == "__main__":
    main()
