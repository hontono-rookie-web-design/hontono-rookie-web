import os
import re
import requests
from bs4 import BeautifulSoup

from lib import utils
from lib import sheet_client
from lib import niconico
from lib import youtube


HEADERS = {"User-Agent": "Mozilla/5.0"}


# ------------------------
# 共通：OGP取得
# ------------------------
def fetch_ogp(url):
    res = requests.get(url, headers=HEADERS, timeout=10)
    res.raise_for_status()

    soup = BeautifulSoup(res.text, "html.parser")

    def get(prop, attr="property"):
        tag = soup.find("meta", attrs={attr: prop})
        return tag["content"] if tag and tag.get("content") else None

    data = {
        "title": get("og:title"),
        "description": get("og:description"),
        "image": get("og:image"),
    }

    # fallback
    if not data["title"]:
        data["title"] = get("twitter:title", "name")
    if not data["description"]:
        data["description"] = get("twitter:description", "name")
    if not data["image"]:
        data["image"] = get("twitter:image", "name")

    return data


# ------------------------
# ニコニコ動画
# ------------------------
def fetch_niconico(url):
    fields = [
        "title",
        "description",
        "thumbnail_url",
    ]
    data = niconico.fetch_single_video(url, fields)
    data["image"] = data.pop("thumbnail_url")

    return data


# ------------------------
# YouTube
# ------------------------
def fetch_youtube(url):
    fields = [
        "title",
        "description",
        "thumbnail_url",
    ]
    data = youtube.fetch_single_video(url, fields)
    data["image"] = data.pop("thumbnail_url")

    return data


# ------------------------
# その他（Xなど）
# ------------------------
def fetch_others(url):
    # Xはスクレイピングを用いずに情報の取得が難しそうなため、取得しない

    return {
        "title": None,
        "description": None,
        "image": None,
    }


# ------------------------
# サービス振り分け
# ------------------------
def fetch_by_service(service, url):
    if service == "ニコニコ動画":
        return fetch_niconico(url)
    elif service == "YouTube":
        return fetch_youtube(url)
    elif service == "その他":
        return fetch_others(url)
    else:
        return None


# ------------------------
# 元動画情報取得
# ------------------------
def extract_video_id(url: str) -> str | None:
    pattern = r"(sm\d+|nm\d+|so\d+)"
    match = re.search(pattern, url)
    return match.group(1) if match else None


def find_videos_info(
    url_list: list[str], spreadsheet_name: str, credentials_path: str
) -> list[dict]:
    """
    URLリストを受け取り、list[dict]で返す
    """

    video_index = sheet_client.build_video_index(spreadsheet_name, credentials_path)

    results = []

    for url in url_list:
        video_id = extract_video_id(url)

        if video_id and video_id in video_index:
            results.append(video_index[video_id])
        else:
            results.append({"タイトル": None, "投稿者名": None})

    return results


# ------------------------
# メイン処理
# ------------------------
def main():
    table_keys = {
        "timestamp": "タイムスタンプ",
        "mail": "メールアドレス",
        "category": "分類",
        "release_time": "配信日時",
        "author": "二次創作者活動名",
        "service": "投稿先サービス",
        "url": "二次創作作品URL",
        "title": "タイトル",
        "image": "画像URL",
        "org_url": "元作品URL",
    }

    config = utils.load_config()
    spreadsheet_name = config["spreadsheets"]["forms_result_fanfic"]["name"]
    input_sheet_name = config["spreadsheets"]["forms_result_fanfic"]["forms_result"]
    output_sheet_name = config["spreadsheets"]["forms_result_fanfic"]["for_check"]
    video_catalog_spreadsheet_name = config["spreadsheets"]["video_catalog"]["name"]

    credentials_path = os.environ["GOOGLE_APPLICATION_CREDENTIALS"]

    # 入力取得
    input_ws = sheet_client.connect_sheet(
        credentials_path, spreadsheet_name, input_sheet_name
    )
    src_data = sheet_client.fetch_sheet_data(input_ws)

    output_ws = sheet_client.connect_sheet(
        credentials_path, spreadsheet_name, output_sheet_name
    )
    dest_data = sheet_client.fetch_sheet_data(output_ws)

    # 転記先に既にあるキーを集合で持つ
    key_columns = ["タイムスタンプ", "メールアドレス"]
    existing_keys = {tuple(str(row.get(k)) for k in key_columns) for row in dest_data}

    # 差分抽出
    new_rows = []
    for row in src_data:
        key = tuple(str(row.get(k)) for k in key_columns)
        if key and key not in existing_keys:
            new_rows.append(row)

    print(f"total: {len(new_rows)} items")

    # 元動画情報取得
    rows_org = find_videos_info(
        [row.get(table_keys["org_url"]) for row in new_rows],
        video_catalog_spreadsheet_name,
        credentials_path,
    )

    # 二次創作作品情報取得
    update_rows = []
    for row, row_org in zip(new_rows, rows_org):
        items = {k: row.get(v) for k, v in table_keys.items()}
        org_title = row_org.get("タイトル")
        org_author = row_org.get("投稿者名")

        url = items["url"]
        service = items["service"]
        category = items["category"]

        if not url or not service or not category:
            continue

        try:
            meta = fetch_by_service(service, url)
            if not meta:
                meta = {"title": None, "image": None}

            # タイトル・画像URL
            if service != "その他":
                items["title"] = meta["title"]
                items["image"] = meta["image"]

            row = {table_keys[k]: v for k, v in items.items()}
            row["元作品タイトル"] = org_title or ""
            row["元作品投稿者名"] = org_author or ""
            row["掲載可否"] = 0

            update_rows.append(row)

        except Exception as e:
            print(f"error: {url} -> {e}")

    # 追加
    if len(dest_data) == 0:
        sheet_client.update_sheet(output_ws, update_rows)
        print(f"{len(update_rows)} items")
        return

    if update_rows:
        sheet_client.append_sheet(output_ws, update_rows)
        print(f"{len(update_rows)} items")
    else:
        print("No items")


if __name__ == "__main__":
    main()
