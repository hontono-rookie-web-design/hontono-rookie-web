import os
import random

import pandas as pd
from lib import sheet_client, utils


def connect_sheet(spreadsheet_name, sheet_name):
    # 環境変数からJSONパス取得
    credentials_path = os.environ["GOOGLE_APPLICATION_CREDENTIALS"]

    return sheet_client.connect_sheet(credentials_path, spreadsheet_name, sheet_name)

def main():

    # シートに接続
    config = utils.load_config()
    tag_config: dict[str, str] = config["tag"]

    ### 2026/4/23~
    ranking_sheet_config = config["spreadsheets"]["ranking_result"]
    ranking_spreadsheetname = ranking_sheet_config["name"]
    preliminary_sheetname = ranking_sheet_config["preliminary_sheet"]
    catalog_semifinal_sheet_config = config["spreadsheets"]["video_catalog_semifinal"]
    catalog_semifinal_spreadsheetname = catalog_semifinal_sheet_config["name"]
    

    #予選順位データ取得
    #シートに接続
    sheet = connect_sheet(ranking_spreadsheetname,preliminary_sheetname)
    preliminary_data = sheet_client.fetch_sheet_data(sheet)
    # 取得したデータが空であればスキップ
    if any(preliminary_data) == False:
        print(f"No data found in {preliminary_sheetname}. Skipping.")
    
    #データフレーム作成
    df = pd.DataFrame(preliminary_data)
    semifinal_group_size = config["vote_semifinal"]["semifinal_size"] #準決勝グループ数

    #準決勝グループ番号を割り振る
    for pre_group_no, pre_ranking in zip(df["グループID"],df["順位"]):
        pre_group_no = pre_group_no -1 #0スタートにする
        pre_ranking = pre_ranking -1 #0スタートにする
        semifinal_group_no = (pre_group_no+pre_ranking)%semifinal_group_size

        

    
    ###

    # catalog_sheet_config = config["spreadsheets"]["video_catalog"]
    # catalog_spreadsheetname = catalog_sheet_config["name"]

    # # for div in ["rookie", "op", "ex"]:
    # for div in tag_config.keys():

    #     catalog_excluded_sheetname = catalog_sheet_config[f"excluded_{div}_sheet"]

    #     # シートに接続
    #     excluded_sheet = connect_sheet(
    #         catalog_spreadsheetname, catalog_excluded_sheetname
    #     )

    #     # シートからデータを取得
    #     video_data = sheet_client.fetch_sheet_data(excluded_sheet)
    #     # print(video_data)

    #     # 取得したデータが空であればスキップ
    #     if any(video_data) == False:
    #         print(f"No data found in {catalog_excluded_sheetname}. Skipping.")
    #         continue

    #     # pandasのDataFrameに変換
    #     df = pd.DataFrame(video_data)
    #     # print(df)

    #     # content_idのリストを作成
    #     content_ids = df["動画ID"].tolist()
    #     # print(content_ids)

    #     # グループ分け
    #     seed = config["vote_grouping"]["random_seed"]
    #     print(f"Using random seed: {seed}")
    #     grouper = ContentGrouper(content_ids, seed=seed)

    #     # グループ一つあたりの人数（サイズ）によってグループ分け
    #     group_size = config["vote_grouping"]["group_size"]
    #     print(f"Grouping by size: {group_size} items per group")
    #     grouper.group_by_size(group_size)

    #     # DataFrameにグループ番号の列を追加
    #     df["グループID"] = df["動画ID"].apply(grouper.get_group_id)

    #     print(df)

    #     # グループ分けされたデータを新しいシートに書き込む
    #     output_spreadsheetname = config["vote_grouping"]["grouped_video_catalog"]["name"]
    #     output_sheetname = config["vote_grouping"]["grouped_video_catalog"][f"{div}_sheet"]
    #     output_sheet = connect_sheet(output_spreadsheetname, output_sheetname)
    #     sheet_client.clear_sheet(output_sheet)  # 既存のデータをクリア
    #     sheet_client.update_sheet(output_sheet, df.to_dict(orient='records')) # orient='records'で[{列名: 値}, ...]の形式で辞書を作成

    #     print(f"Successfully updated '{output_sheetname}' in '{output_spreadsheetname}' with grouped data.")

if __name__ == "__main__":
    main()