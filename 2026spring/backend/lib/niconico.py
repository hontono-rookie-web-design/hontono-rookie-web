import requests
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
