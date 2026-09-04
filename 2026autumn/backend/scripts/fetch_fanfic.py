import os

from dotenv import load_dotenv
from lib import sheet_client, utils

load_dotenv()

# derivative_listシートの全列名（checkは承認作業用の列で、このスクリプトは書き込まない）
HEADERS = [
    "derivative_id",
    "creator_name",
    "category",
    "posted_service",
    "derivative_title",
    "derivative_url",
    "derivative_img_url",
    "original_id",
    "stream_at",
    "check",
]


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


def build_row(item: dict) -> dict:
    return {
        "creator_name": item.get("二次創作者活動名"),
        "category": item.get("分類"),
        "posted_service": item.get("投稿先サービス"),
        "derivative_title": item.get("タイトル"),
        "derivative_url": item.get("二次創作作品URL"),
        "derivative_img_url": item.get("画像URL"),
        "original_id": item.get("元作品URL"),
        "stream_at": item.get("配信日時"),
    }


def assign_derivative_ids(
    rows: list[dict], existing_ids_by_url: dict[str, int]
) -> list[dict]:
    """
    derivative_url単位で既存のderivative_idを引き継ぎ、新規のURLには連番のIDを新たに割り振る
    """

    next_id = max(existing_ids_by_url.values(), default=0) + 1

    result = []
    for row in rows:
        url = row["derivative_url"]
        if url in existing_ids_by_url:
            result.append(row)
        else:
            result.append({**row, "derivative_id": next_id})
            next_id += 1

    return result


# ------------------------
# メイン処理
# ------------------------
def main():
    config = utils.load_config()
    derivative_list_config = config["spreadsheets"]["derivative_list"]
    input_spreadsheet_name = config["spreadsheets"]["forms_result_fanfic"]["name"]
    input_sheet_name = config["spreadsheets"]["forms_result_fanfic"]["for_check"]

    derivative_list_spreadsheetname = derivative_list_config["name"]
    print(f"接続先スプレッドシート: {derivative_list_spreadsheetname}")

    credentials_path = os.getenv("GOOGLE_APPLICATION_CREDENTIALS")

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

    new_rows = [build_row(item) for item in rows if item.get("二次創作作品URL")]

    # 書き込み（derivative_urlをキーに更新・追加。checkなど他の作業で使う列は上書きしない）
    derivative_list_ws = sheet_client.connect_sheet(
        credentials_path,
        derivative_list_spreadsheetname,
        derivative_list_config["sheet"],
    )
    existing_rows = sheet_client.fetch_sheet_data(derivative_list_ws)
    existing_ids_by_url = {
        row["derivative_url"]: row["derivative_id"]
        for row in existing_rows
        if row.get("derivative_url")
    }

    new_rows = assign_derivative_ids(new_rows, existing_ids_by_url)

    sheet_client.upsert_sheet(
        derivative_list_ws, new_rows, key="derivative_url", headers=HEADERS
    )

    print(f"{len(new_rows)} items")


if __name__ == "__main__":
    main()
