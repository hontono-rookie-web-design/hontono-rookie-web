import requests


def fetch_single_video(url, fields):
    endpoint = "https://www.youtube.com/oembed"
    params = {"url": url, "format": "json"}

    res = requests.get(endpoint, params=params)
    res.raise_for_status()

    data = res.json()

    def get(field):
        if field == "title":
            return data.get("title")

        if field in ["author_name", "channel_title"]:
            return data.get("author_name")

        if field == "thumbnail_url":
            return data.get("thumbnail_url")

        return None

    return {f: get(f) for f in fields}
