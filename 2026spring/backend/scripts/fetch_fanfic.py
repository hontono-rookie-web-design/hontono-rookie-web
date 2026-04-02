import os
import re
import requests
from bs4 import BeautifulSoup
from collections import defaultdict
import xml.etree.ElementTree as ET

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
# X
# ------------------------
def fetch_x(url):
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
    elif service == "X":
        return fetch_x(url)
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


def rename_key(rows: list[dict]):
    return rows


def deduplicate_by_url(data: list[dict]) -> list[dict]:
    """
    URLをキーに重複削除（後ろを残す）
    """

    url_map = {}

    for item in data:
        url = item.get("二次創作作品URL")
        if url is not None:
            url_map[url] = item  # 後ろの要素で上書き

    return list(url_map.values())


# ------------------------
# メイン処理
# ------------------------
def main():

    config = utils.load_config()
    spreadsheet_name = config["spreadsheets"]["fanfic_list"]["name"]
    input_spreadsheet_name = config["spreadsheets"]["forms_result_fanfic"]["name"]
    input_sheet_name = config["spreadsheets"]["forms_result_fanfic"]["sheet"]
    video_catalog_spreadsheet_name = config["spreadsheets"]["video_catalog"]["name"]

    credentials_path = os.environ["GOOGLE_APPLICATION_CREDENTIALS"]

    # 入力取得
    input_ws = sheet_client.connect_sheet(
        credentials_path, input_spreadsheet_name, input_sheet_name
    )
    rows = sheet_client.fetch_sheet_data(input_ws)
    rows = rename_key(rows)
    print(f"total: {len(rows)} items")

    # 重複削除
    rows = deduplicate_by_url(rows)
    print(f"total: {len(rows)} items")

    grouped = defaultdict(list)

    # 元動画情報取得
    rows_org = find_videos_info(
        [row.get("元動画URL") for row in rows],
        video_catalog_spreadsheet_name,
        credentials_path,
    )

    # 二次創作作品情報取得
    for row, row_org in zip(rows, rows_org):
        category = row.get("分類")
        author = row.get("二次創作者名")
        service = row.get("投稿先")
        title_input = row.get("タイトル")
        image_input = row.get("画像URL")
        url = row.get("二次創作作品URL")
        url_org = row.get("元動画URL")
        title_org = row_org.get("タイトル")
        author_org = row_org.get("投稿者名")

        if not url or not service or not category:
            continue

        try:
            meta = fetch_by_service(service, url)

            if not meta:
                continue

            # --- タイトル・コメント・画像URL ---
            if service == "X":
                title = title_input  # 入力をそのまま
                image = image_input
            else:
                title = meta["title"]
                image = meta["image"]

            grouped[category].append(
                {
                    "タイトル": title or "",
                    "二次創作者名": author or "",
                    "投稿先": service,
                    "二次創作作品URL": url,
                    "画像URL": image or "",
                    "元動画URL": url_org or "",
                    "元動画タイトル": title_org or "",
                    "元動画投稿者名": author_org or "",
                }
            )

        except Exception as e:
            print(f"error: {url} -> {e}")

    # シート書き込み
    for category, data in grouped.items():
        print(f"{category}: {len(data)} items")
        ws = sheet_client.connect_sheet(credentials_path, spreadsheet_name, category)
        sheet_client.update_sheet(ws, data)


if __name__ == "__main__":
    main()
