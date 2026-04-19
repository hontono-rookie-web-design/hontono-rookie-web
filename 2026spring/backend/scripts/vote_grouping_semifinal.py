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
    catalog_sheet_config = config["spreadsheets"]["video_catalog"]
    catalog_spreadsheetname = catalog_sheet_config["name"]

    # for div in ["rookie", "op", "ex"]:
    for div in tag_config.keys():

        catalog_excluded_sheetname = catalog_sheet_config[f"excluded_{div}_sheet"]

        # シートに接続
        excluded_sheet = connect_sheet(
            catalog_spreadsheetname, catalog_excluded_sheetname
        )

        # シートからデータを取得
        video_data = sheet_client.fetch_sheet_data(excluded_sheet)
        # print(video_data)

        # 取得したデータが空であればスキップ
        if any(video_data) == False:
            print(f"No data found in {catalog_excluded_sheetname}. Skipping.")
            continue

        # pandasのDataFrameに変換
        df = pd.DataFrame(video_data)
        # print(df)

        # content_idのリストを作成
        content_ids = df["動画ID"].tolist()
        # print(content_ids)

        # グループ分け
        seed = config["vote_grouping"]["random_seed"]
        print(f"Using random seed: {seed}")
        grouper = ContentGrouper(content_ids, seed=seed)

        # グループ一つあたりの人数（サイズ）によってグループ分け
        group_size = config["vote_grouping"]["group_size"]
        print(f"Grouping by size: {group_size} items per group")
        grouper.group_by_size(group_size)

        # DataFrameにグループ番号の列を追加
        df["グループID"] = df["動画ID"].apply(grouper.get_group_id)

        print(df)

        # グループ分けされたデータを新しいシートに書き込む
        output_spreadsheetname = config["vote_grouping"]["grouped_video_catalog"]["name"]
        output_sheetname = config["vote_grouping"]["grouped_video_catalog"][f"{div}_sheet"]
        output_sheet = connect_sheet(output_spreadsheetname, output_sheetname)
        sheet_client.clear_sheet(output_sheet)  # 既存のデータをクリア
        sheet_client.update_sheet(output_sheet, df.to_dict(orient='records')) # orient='records'で[{列名: 値}, ...]の形式で辞書を作成

        print(f"Successfully updated '{output_sheetname}' in '{output_spreadsheetname}' with grouped data.")

if __name__ == "__main__":
    main()