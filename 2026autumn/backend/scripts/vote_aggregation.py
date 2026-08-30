# scripts/vote_aggregation.py

from collections import defaultdict
import re

# from scripts.score_calculator import calculate_score


IGNORE_COLUMNS = [
    "タイムスタンプ",
    "メールアドレス",
]


def clean_song_name(column_name: str) -> str:
    """
    Extract song name from Google Form question column.

    Example:
    好きな作品を教えてください。 [アヤツリ/まやかし]

    ->
    アヤツリ/まやかし
    """

    if "[" in column_name and "]" in column_name:
        return column_name.split("[", 1)[1].rstrip("]")

    return column_name



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



def aggregate_votes(votes: list[dict]) -> list[dict]:
    """
    Aggregate Google Form votes.

    Input example:

    {
        "タイムスタンプ": "...",
        "メールアドレス": "...",
        "好きな作品を教えてください。[Song A]": "1位",
        "好きな作品を教えてください。[Song B]": "2位"
    }


    Output example:

    {
        "曲名": "Song A",
        "得点": 1000,
        "投票数": 298,
        "順位合計": 500,
        "平均順位": 1.67,
        "順位": 1
    }

    """

    songs = defaultdict(
        lambda: {
            "得点": 0,
            "投票数": 0,
            "順位合計": 0,
        }
    )


    for vote in votes:

        for column, value in vote.items():

            # Ignore timestamp/email
            if column in IGNORE_COLUMNS:
                continue


            rank = extract_rank(value)

            # Ignore empty/invalid answers
            if rank is None:
                continue


            song_name = clean_song_name(column)


            # songs[song_name]["得点"] += calculate_score(rank)

            songs[song_name]["投票数"] += 1

            songs[song_name]["順位合計"] += rank



    ranking = []


    for song_name, data in songs.items():

        average_rank = (
            data["順位合計"] / data["投票数"]
            if data["投票数"] > 0
            else 0
        )


        ranking.append(
            {
                "曲名": song_name,
                # "得点": data["得点"],
                "投票数": data["投票数"],
                "順位合計": data["順位合計"],
                "平均順位": round(average_rank, 2),
            }
        )


    # Sort by average_rank (higher is better)
    ranking.sort(
        key=lambda x: x["平均順位"],
        reverse=True
    )


    # Add final ranking number

    for index, item in enumerate(ranking):
        item["順位"] = index + 1


    return ranking