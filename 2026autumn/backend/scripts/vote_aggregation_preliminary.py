## 予選の集計機能
## Vote Aggregation for Preliminary

import json
import os
import json


from lib import utils
from lib.sheet_client import connect_sheet, fetch_sheet_data

from scripts.vote_aggregation import aggregate_votes

from dotenv import load_dotenv
load_dotenv()



def connect_vote_sheet(spreadsheet_name, sheet_name):
    """
    Google Form回答シートに接続する。

    Connect to Google Form response sheet.
    """

    credentials_path = os.getenv(
        "GOOGLE_APPLICATION_CREDENTIALS"
    )

    return connect_sheet(
        credentials_path,
        spreadsheet_name,
        sheet_name,
    )


# エクスポートされたランキングを、後続の処理で使用するためにJSONファイルに書き出す場合。
# In case the exported ranking should be written to a JSON file for further usage. 

# def export_ranking(ranking_data):
#     """
#     Export ranking data for frontend.
#     """

#     output_path = "preliminary_ranking.json"

#     with open(
#         output_path,
#         "w",
#         encoding="utf-8",
#     ) as f:
#         json.dump(
#             ranking_data,
#             f,
#             ensure_ascii=False,
#             indent=2,
#         )

#     print(
#         f"Ranking exported to {output_path}"
#     )



def select_semifinal_candidates(ranking, border):
    """
    予選通過作品を取得する。

    Select semifinal candidates.
    """

    return ranking[:border]



def main():

    config = utils.load_config()

    number_of_discs = config["vote_grouping"]["group_num"]

    # テスト用
    # For testing
    # number_of_discs = 2


    # 予選のシートを取得する
    # Get sheets of prelim

    sheets = [
        {
            "disc": i,
            "spreadsheet_name": f'{config["vote_form"]["prelim"]["title"]}{i}（回答）',

            # テストするには、settings.development.yml の 88 行目を item_title: "フォームの回答 1" に変更し、次の行を実行してください。
            # For testing, please change the line 88 in settings.development.yml to: item_title: "フォームの回答 1" and then run the following line. 
            "worksheet_name": config["vote_form"]["prelim"]["item_title"],

        }
        for i in range(1, number_of_discs + 1)
    ]


    # 全Discのランキング保存用
    # Store all disc rankings
    # エクスポートされたランキングを、後続の処理で使用するためにJSONファイルに書き出す場合。
    # In case the exported ranking should be written to a JSON file for further usage. 
    # preliminary_rankings = []


    semifinal_border = config["vote_semifinal"]["semifinal_border"]



    # 各シートのランキングを出力
    # Print the ranking of each sheet

    for sheet in sheets:

        print(
            f"\n===== Disc {sheet['disc']} ====="
        )


        worksheet = connect_vote_sheet(
            sheet["spreadsheet_name"],
            sheet["worksheet_name"],
        )


        # 投票数を取得
        # Get the number of votes

        votes = fetch_sheet_data(
            worksheet
        )


        print(
            "Number of votes:",
            len(votes)
        )


        # 投票なしの場合
        # Skip if no votes

        if len(votes) == 0:

            print(
                "No votes found. Skip."
            )

            continue



        # 投票を集計する
        # Aggregate votes

        ranking = aggregate_votes(
            votes
        )

        # 最終順位を出力
        # Print final ranking

        print(
            "\n===== Ranking ====="
        )


        print(
            [
                {
                    "曲名": row["曲名"],
                    "順位": row["順位"],
                }
                for row in ranking
            ]
        )



        # 準決勝進出作品
        # Semifinal candidates

        candidates = select_semifinal_candidates(
            ranking,
            semifinal_border,
        )


        print(
            "\n===== Semifinal Candidates ====="
        )


        print(
            [
                {
                    "曲名": row["曲名"],
                    "順位": row["順位"],
                }
                for row in candidates
            ]
        )

        
        # エクスポートされたランキングを、後続の処理で使用するためにJSONファイルに書き出す場合。
        # In case the exported ranking should be written to a JSON file for further usage. 
        # preliminary_rankings.append(
        #     {
        #         "disc": sheet["disc"],
        #         "ranking": [
        #             {
        #                 "曲名": row["曲名"],
        #                 "順位": row["順位"]
        #             }
        #             for row in ranking
        #         ]
        #     }
        # )

        # export_ranking(preliminary_rankings)


if __name__ == "__main__":
    main()