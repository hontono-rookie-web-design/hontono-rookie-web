import requests


def fetch_single_video(url, fields):
    endpoint = "https://www.youtube.com/oembed"
    params = {"url": url, "format": "json"}

    res = requests.get(endpoint, params=params)
    res.raise_for_status()

    data = res.json()

    return {f: data.get(f) for f in fields}
