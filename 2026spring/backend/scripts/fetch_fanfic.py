import os
from collections import defaultdict

from lib import utils
from lib import sheet_client


def deduplicate_by_url(data: list[dict]) -> list[dict]:
    """
    URLをキーに重複削除（後ろを残す）
    """

    url_map = {}

    for item in data:
        url = item.get("二次創作作品URL")
        if url is not None:
            url_map[url] = item  # 後ろの要素で上書き

    return list(url_map.values())


def remove_invalid(data: list[dict]) -> list[dict]:
    """
    使用しない行・列を削除
    """

    valid_data = []
    for item in data:
        is_valid = item["掲載可否"]
        if not is_valid or is_valid in ["否", "不可", "×", "x"]:
            continue

        valid_data.append(
            {
                k: v
                for k, v in item.items()
                if k not in ["タイムスタンプ", "メールアドレス", "掲載可否", "メモ"]
            }
        )

    return valid_data


# ------------------------
# メイン処理
# ------------------------
def main():

    config = utils.load_config()
    spreadsheet_name = config["spreadsheets"]["fanfic_list"]["name"]
    input_spreadsheet_name = config["spreadsheets"]["forms_result_fanfic"]["name"]
    input_sheet_name = config["spreadsheets"]["forms_result_fanfic"]["for_check"]

    credentials_path = os.environ["GOOGLE_APPLICATION_CREDENTIALS"]

    # 入力取得
    input_ws = sheet_client.connect_sheet(
        credentials_path, input_spreadsheet_name, input_sheet_name
    )
    rows = sheet_client.fetch_sheet_data(input_ws)
    print(f"total: {len(rows)} items")

    # 掲載不可のものを削除
    rows = remove_invalid(rows)

    # 重複削除
    rows = deduplicate_by_url(rows)
    print(f"total: {len(rows)} items")

    grouped = defaultdict(list)

    # 二次創作作品情報取得
    for row in rows:
        url = row["二次創作作品URL"]
        category = row["分類"]

        if not url or not category:
            continue

        grouped[category].append({k: v for k, v in row.items() if k not in ["分類"]})

    # シート書き込み
    for category, data in grouped.items():
        print(f"{category}: {len(data)} items")
        ws = sheet_client.connect_sheet(credentials_path, spreadsheet_name, category)
        sheet_client.update_sheet(ws, data)


if __name__ == "__main__":
    main()
