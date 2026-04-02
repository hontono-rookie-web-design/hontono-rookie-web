import re
from bs4 import BeautifulSoup
import xml.etree.ElementTree as ET
import requests


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

        # print(f"{len(all_videos)} 件取得")

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


def get_thumbnail_url(
    video_id: str, use_large: bool = True, fallback: bool = True
) -> str:
    """
    ニコニコ動画の動画IDからサムネイルURLを取得する

    Parameters:
        video_id (str): sm12345678 などの動画ID
        use_large (bool): Trueなら高解像度(.L.jpg)を優先
        fallback (bool): Trueならthumbinfo APIでフォールバック

    Returns:
        str: サムネイルURL
    """

    # ① CDN URLを組み立て
    base_url = f"https://nicovideo.cdn.nimg.jp/thumbnails/{video_id}/{video_id}"

    if use_large:
        large_url = f"{base_url}.L.jpg"
        if _url_exists(large_url):
            return large_url

    normal_url = f"{base_url}.jpg"
    if _url_exists(normal_url):
        return normal_url

    # ② fallback（thumbinfo API）
    if fallback:
        try:
            return _get_thumbnail_from_thumbinfo(video_id)
        except Exception:
            pass

    # ③ 最終的に通常URLを返す（存在しない可能性あり）
    return normal_url


def _url_exists(url: str) -> bool:
    """URLが存在するか軽量チェック（HEAD）"""
    try:
        res = requests.head(url, timeout=3)
        return res.status_code == 200
    except requests.RequestException:
        return False


def _get_thumbnail_from_thumbinfo(video_id: str) -> str:
    """thumbinfo APIからサムネイルURL取得"""
    url = f"https://ext.nicovideo.jp/api/getthumbinfo/{video_id}"
    res = requests.get(url, timeout=5)
    res.raise_for_status()

    root = ET.fromstring(res.text)
    thumbnail = root.find(".//thumbnail_url")

    if thumbnail is None:
        raise ValueError("thumbnail_url not found")

    return thumbnail.text


def attach_username_and_thumbnail(videos):

    user_cache = {}

    for video in videos:

        # ユーザーID追加
        user_id = video.get("userId")

        if not user_id:
            video["userName"] = None
        else:
            if user_id not in user_cache:
                user_cache[user_id] = get_username(user_id)

            video["userName"] = user_cache[user_id]

        # サムネイルURL追加
        video_id = video.get("contentId")

        if not video_id:
            video["thumbnailUrl"] = None
        else:
            video["thumbnailUrl"] = get_thumbnail_url(video_id)

    return videos


def fetch_single_video(url, fields):

    m = re.search(r"(sm\d+)", url)
    if not m:
        return None

    video_id = m.group(1)

    api = f"https://ext.nicovideo.jp/api/getthumbinfo/{video_id}"

    res = requests.get(api)
    res.raise_for_status()

    root = ET.fromstring(res.text)

    def get(tag):
        el = root.find(f".//{tag}")
        return el.text if el is not None else None

    return {f: get(f) for f in fields}
