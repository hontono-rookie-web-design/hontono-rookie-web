## 集計機能

from collections import defaultdict
from lib.sheet_client import connect_sheet, fetch_sheet_data
import re, os


# シート上のデータの前処理
# Pretreatments of the datas in the sheets. 

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


# 得点計算

def calculate_score(rank, total_songs) -> int:

    return total_songs - rank + 1


# 得点とランキングを集計

def aggregate_votes(votes: list[dict]) -> list[dict]:
    """
    Aggregate Google Form votes.

    Input example:

    [{
        "タイムスタンプ": "...",
        "メールアドレス": "...",
        "好きな作品を教えてください。[Song A]": "1位",
        "好きな作品を教えてください。[Song B]": "2位"
    },
    ...
    ]


    Output example:

    [{
        "曲名": "Song A",
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


            song_name = clean_song_name(column)


            songs[song_name]["得点"] += calculate_score(rank, total_songs)

            songs[song_name]["投票数"] += 1



    ranking = []

    # 計算されたデータ
    # Calculated datas
    for song_name, data in songs.items():

        ranking.append(
            {
                "曲名": song_name,
                "得点": data ["得点"],
                "投票数": data["投票数"],
                "平均得点": round(data["得点"] / data["投票数"], 2)
            }
        )


    # 得点順に並べ替え（降順）
    # Sort by scores (decreasing)
    ranking.sort(
        key=lambda x: x["得点"],
        reverse=True
    )


    # 最終順位の番号を追加する
    # Add final ranking number
    for index, item in enumerate(ranking):
        item["順位"] = index + 1


    return ranking


## 最終的なランキングリストを出力します
## Output the final list

credentials_path = os.environ["GOOGLE_APPLICATION_CREDENTIALS"]

def main():

    # ディスク枚数
    # Number of Discs
    ## 現在はテスト用に「3」に設定しています！！！ 
    ## I CURRENTLY SET IT TO 3 FOR TESTING!!!
    number_of_discs = 3

    # シーツを取得する
    # Get sheets
    sheets = [
        {
            "disc": i,
            "spreadsheet_name": f"本当のルーキー祭り2026春_Disc.{i}（回答）",
            "worksheet_name": "フォームの回答 1",
        }
        for i in range(1, number_of_discs + 1)
    ]

    # 各シートのランキングを出力します
    # Print the ranking of each sheets
    for sheet in sheets:

        print(f"\n===== Disc {sheet['disc']} =====")

        worksheet = connect_sheet(
            credentials_path,
            sheet["spreadsheet_name"],
            sheet["worksheet_name"],
        )

        # 投票数を取得する
        # Get the number of votes
        votes = fetch_sheet_data(worksheet)

        print("Number of votes:", len(votes))

        # しきい値
        # Threshold
        if len(votes) == 0:
            print("No votes found. Skip.")
            continue

        # 投票を集計する
        # Aggregate votes
        ranking = aggregate_votes(votes)

        print("\n===== Ranking =====")

        # 最終順位を出力する
        # Print the final rankings
        print([
            { 
            '曲名': row['曲名'], 
            '順位': row['順位'], 
            } 
            for row in ranking
            ])

if __name__ == "__main__":
    main()

