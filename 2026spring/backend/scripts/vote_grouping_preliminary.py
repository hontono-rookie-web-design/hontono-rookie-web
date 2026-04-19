import csv
import os
import random

import pandas as pd
from lib import sheet_client, utils


# 動画のコンテンツIDをグループ化するクラス
class ContentGrouper:
    def __init__(self, content_ids, seed=None):
        self.content_ids = list(content_ids)
        self.content_to_group = {}
        self.group_to_contents = {}
        self.rng = random.Random(seed)

    def _reset_groups(self):
        self.content_to_group = {}
        self.group_to_contents = {}

    def _populate_lookups(self, groups):
        """
        グループのルックアップテーブル（）を更新
        groups: リストのリスト。各サブリストはグループ内のcontent_idを含む。
        例）[['id1', 'id2'], ['id3', 'id4', 'id5'], ...]
        """
        self._reset_groups()
        for idx, group in enumerate(groups):
            group_id = idx + 1  # グループIDは1始まり
            self.group_to_contents[group_id] = group
            for content_id in group:
                self.content_to_group[content_id] = group_id

    def group_by_size(self, size):
        """
        グループをsizeで与えられた数ごとに分割
        （最後のグループはsizeより小さい可能性がある）
        """
        if size <= 0:
            raise ValueError("Size must be positive")
            
        shuffled = self.content_ids[:] # 元のリストを変更しないようにコピー
        self.rng.shuffle(shuffled) # IDをランダムにシャッフル
        
        # 実際にグループ分けを行い、リストのリストを作成
        groups = []
        for i in range(0, len(shuffled), size):
            groups.append(shuffled[i:i + size])
            
        # content_to_groupとgroup_to_contentsを更新
        self._populate_lookups(groups)
        return self.group_to_contents

    def group_by_count(self, count):
        """
        countで与えられた数だけのグループに分割
        なるべく均等に分割されるようにする（最後のグループは他より1つ多い可能性がある）
        """
        if count <= 0:
            raise ValueError("Count must be positive")
        if count > len(self.content_ids):
             raise ValueError("Count cannot be larger than number of items")

        shuffled = self.content_ids[:] # 元のリストを変更しないようにコピー
        self.rng.shuffle(shuffled) # IDをランダムにシャッフル
        
        # グループ分け後に生成されるリストのリストを作成
        groups = [[] for _ in range(count)]
        for i, item in enumerate(shuffled):
            # idを前から順番にグループに割り当てる
            groups[i % count].append(item)
            
        # content_to_groupとgroup_to_contentsを更新
        self._populate_lookups(groups)
        return self.group_to_contents

    def get_group_id(self, content_id):
        """コンテンツIDに対応するグループIDを取得"""
        return self.content_to_group.get(content_id)

    def get_members(self, group_id):
        """指定されたグループの全要素を取得"""
        return self.group_to_contents.get(group_id, [])

    def export_to_csv(self, filename):
        """Exports the grouping to a CSV file."""
        if not self.content_to_group:
            print("No grouping has been performed yet.")
            return

        with open(filename, mode='w', newline='', encoding='utf-8') as f:
            writer = csv.writer(f)
            writer.writerow(['content_id', 'group_id'])
            for content_id, group_id in self.content_to_group.items():
                writer.writerow([content_id, group_id])
        print(f"Exported to {filename}")

def connect_sheet(spreadsheet_name, sheet_name):
    # 環境変数からJSONパス取得
    credentials_path = os.environ["GOOGLE_APPLICATION_CREDENTIALS"]

    return sheet_client.connect_sheet(credentials_path, spreadsheet_name, sheet_name)

def main():

    # シートに接続
    config = utils.load_config()
    catalog_sheet_config = config["spreadsheets"]["video_catalog"]
    catalog_spreadsheetname = catalog_sheet_config["name"]

    for div in ["rookie"]:

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

        # グループ数によってグループ分け
        group_num = config["vote_grouping"]["group_num"]
        print(f"Grouping by number: {group_num} groups")
        grouper.group_by_count(group_num)

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