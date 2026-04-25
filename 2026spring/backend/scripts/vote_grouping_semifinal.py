import os
import random

import pandas as pd
from lib import sheet_client, utils


def connect_sheet(spreadsheet_name, sheet_name):
    # 環境変数からJSONパス取得
    credentials_path = os.environ["GOOGLE_APPLICATION_CREDENTIALS"]

    return sheet_client.connect_sheet(credentials_path, spreadsheet_name, sheet_name)

def calc_semifinal_no(row,size):
    m=row["グループID"]-1
    r=row["順位"]-1
    return (m+r)%size+1

def main():

    # シートに接続
    config = utils.load_config()
    tag_config: dict[str, str] = config["tag"]

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

    #予選通過ボーダーより上をフィルタリング
    border = config["vote_semifinal"]["semifinal_border"]
    df = df[df["順位"] <= border].copy()

    semifinal_group_size = config["vote_grouping"]["group_size"]//2 #準決勝グループ数=予選グループ数の半分

    df["準決勝グループID"]=df.apply(calc_semifinal_no,axis=1,args=(semifinal_group_size,)) #準決勝グループID列を作成し更新


    #シートに書き込み
    semifinal_sheetname = ranking_sheet_config["semifinal_sheet"]
    output_sheet = connect_sheet(ranking_spreadsheetname,semifinal_sheetname)

    sheet_client.clear_sheet(output_sheet)  # 既存のデータをクリア
    sheet_client.update_sheet(output_sheet, df.to_dict(orient='records')) # orient='records'で[{列名: 値}, ...]の形式で辞書を作成

    print(f"Successfully updated '{semifinal_sheetname}' in '{ranking_spreadsheetname}' with grouped data.")

    

if __name__ == "__main__":
    main()