## 集計機能

from collections import defaultdict
import re

# シート上のデータの前処理
# Pretreatments of the datas in the sheets.

IGNORE_COLUMNS = [
    "タイムスタンプ",
    "メールアドレス",
]


def extract_song_name_and_video_id(column_name: str) -> tuple[str, str | None]:
    """
    Extract song name and video ID from Google Form question column.
    Googleフォームの質問列から曲名と動画IDを抽出する。

    Example:
    好きな作品を教えてください。 [アヤツリ/まやかし_sm12345678]

    ->
    アヤツリ/まやかし, sm12345678
    """

    # [と]の間の文字列を抽出する
    if "[" in column_name and "]" in column_name:
        song_name_and_video_id = column_name.split("[", 1)[1].split("]", 1)[0]
    else:
        song_name_and_video_id = column_name

    # アンダーバーで区切る
    parts = song_name_and_video_id.rsplit("_", 1)
    if len(parts) == 1:
        return song_name_and_video_id, None

    song_name, video_id = parts
    return song_name, video_id or None


def extract_rank(value: str):
    """
    Convert ranking answer into integer.

    Examples:
    "1位" -> 1
    "10位" -> 10
    """

    if not value:
        return None

    match = re.search(r"\d+", str(value))

    if match:
        return int(match.group())

    return None


# 得点計算


def calculate_score(rank, total_songs) -> int:

    return total_songs - rank + 1


# 同点の場合は同じ順位にする
# Competition ranking
def assign_ranking(ranking):

    previous_score = None
    previous_rank = 0

    for index, item in enumerate(ranking):

        if item["得点"] == previous_score:

            item["順位"] = previous_rank

        else:

            item["順位"] = index + 1
            previous_rank = item["順位"]
            previous_score = item["得点"]

    return ranking


# 得点とランキングを集計


def aggregate_votes(votes: list[dict]) -> list[dict]:
    """
    Aggregate Google Form votes.

    Input example:

    [{
        "タイムスタンプ": "...",
        "メールアドレス": "...",
        "好きな作品を教えてください。[Song A_sm12345678]": "1位",
        "好きな作品を教えてください。[Song B_sm87654321]": "2位"
    },
    ...
    ]


    Output example:

    [{
        "曲名": "Song A",
        "動画ID": "sm12345678",
        "得点": 1000,
        "投票数": 298,
        "順位合計": 500,
        "平均順位": 1.67,
        "順位": 1
    },
    ...
    ]

    """

    songs = defaultdict(
        lambda: {
            "得点": 0,
            "投票数": 0,
            "順位合計": 0,
        }
    )

    total_songs = len(votes[0]) - len(IGNORE_COLUMNS)

    for vote in votes:

        for column, value in vote.items():

            # 前処理
            # Pretreatments
            if column in IGNORE_COLUMNS:
                continue

            rank = extract_rank(value)

            # しきい値
            # Threshold
            if rank is None:
                continue

            song_name, video_id = extract_song_name_and_video_id(column)

            if video_id:
                songs[song_name]["動画ID"] = video_id
            else:
                print(f"Warning: No video ID found for song '{song_name}' in column '{column}'.")

            songs[song_name]["得点"] += calculate_score(rank, total_songs)

            songs[song_name]["投票数"] += 1

    ranking = []

    # 計算されたデータ
    # Calculated datas
    for song_name, data in songs.items():

        ranking.append(
            {
                "曲名": song_name,
                "動画ID": data["動画ID"],
                "得点": data["得点"],
                "投票数": data["投票数"],
                "平均得点": round(data["得点"] / data["投票数"], 2),
            }
        )

    # 得点順に並べ替え（降順）
    # Sort by scores (decreasing)
    ranking.sort(key=lambda x: x["得点"], reverse=True)

    # 同点の場合は同じ順位にする
    # Competition ranking
    return assign_ranking(ranking)
