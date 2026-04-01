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
# メイン処理
# ------------------------
def main():

    config = utils.load_config()
    spreadsheet_name = config["spreadsheets"]["fanfic_list"]["name"]
    input_spreadsheet_name = config["spreadsheets"]["forms_result_fanfic"]["name"]
    input_sheet_name = config["spreadsheets"]["forms_result_fanfic"]["sheet"]

    credentials_path = os.environ["GOOGLE_APPLICATION_CREDENTIALS"]

    # 入力取得
    input_ws = sheet_client.connect_sheet(
        credentials_path, input_spreadsheet_name, input_sheet_name
    )
    rows = sheet_client.fetch_sheet_data(input_ws)
    print(f"total: {len(rows)} items")

    grouped = defaultdict(list)

    for row in rows:
        category = row.get("分類")
        author = row.get("投稿者名")
        service = row.get("投稿先")
        title_input = row.get("タイトル")
        description_input = row.get("コメント")
        image_input = row.get("画像URL")
        url = row.get("URL")

        if not url or not service or not category:
            continue

        try:
            meta = fetch_by_service(service, url)

            if not meta:
                continue

            # --- タイトル・コメント・画像URL ---
            if service == "X":
                title = title_input  # 入力をそのまま
                description = description_input
                image = image_input
            else:
                title = meta["title"]
                description = meta["description"]
                image = meta["image"]

            grouped[category].append(
                {
                    "タイトル": title or "",
                    "投稿者名": author or "",
                    "コメント": description or "",
                    "投稿先": service,
                    "URL": url,
                    "画像URL": image or "",
                }
            )

        except Exception as e:
            print(f"error: {url} -> {e}")

    # ------------------------
    # シート書き込み
    # ------------------------
    for category, data in grouped.items():
        print(f"{category}: {len(data)} items")
        ws = sheet_client.connect_sheet(credentials_path, spreadsheet_name, category)
        sheet_client.update_sheet(ws, data)


if __name__ == "__main__":
    main()
