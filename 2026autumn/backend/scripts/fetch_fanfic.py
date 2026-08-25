import os

from lib import sheet_client, utils

# fanart_listシートの全列名（checkは承認作業用の列で、このスクリプトは書き込まない）
HEADERS = [
    "fanart_id",
    "creator_name",
    "category",
    "posted_service",
    "fanart_title",
    "fanart_url",
    "fanart_img_url",
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
        "fanart_title": item.get("タイトル"),
        "fanart_url": item.get("二次創作作品URL"),
        "fanart_img_url": item.get("画像URL"),
        "original_id": item.get("元作品URL"),
        "stream_at": item.get("配信日時"),
    }


def assign_fanart_ids(
    rows: list[dict], existing_ids_by_url: dict[str, int]
) -> list[dict]:
    """
    fanart_url単位で既存のfanart_idを引き継ぎ、新規のURLには連番のIDを新たに割り振る
    """

    next_id = max(existing_ids_by_url.values(), default=0) + 1

    result = []
    for row in rows:
        url = row["fanart_url"]
        if url in existing_ids_by_url:
            result.append(row)
        else:
            result.append({**row, "fanart_id": next_id})
            next_id += 1

    return result


# ------------------------
# メイン処理
# ------------------------
def main():
    config = utils.load_config()
    fanart_list_config = config["spreadsheets"]["fanart_list"]
    input_spreadsheet_name = config["spreadsheets"]["forms_result_fanfic"]["name"]
    input_sheet_name = config["spreadsheets"]["forms_result_fanfic"]["for_check"]

    # 環境変数FANART_LIST_SPREADSHEET_NAMEが設定されていればそちらを優先する
    # （ローカルでの開発用スプレッドシート向けテスト実行用。未設定時はsettings.ymlの値＝本番用を使う）
    fanart_list_spreadsheetname = os.environ.get(
        "FANART_LIST_SPREADSHEET_NAME", fanart_list_config["name"]
    )
    print(f"接続先スプレッドシート: {fanart_list_spreadsheetname}")

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

    new_rows = [build_row(item) for item in rows if item.get("二次創作作品URL")]

    # 書き込み（fanart_urlをキーに更新・追加。checkなど他の作業で使う列は上書きしない）
    fanart_list_ws = sheet_client.connect_sheet(
        credentials_path, fanart_list_spreadsheetname, fanart_list_config["sheet"]
    )
    existing_rows = sheet_client.fetch_sheet_data(fanart_list_ws)
    existing_ids_by_url = {
        row["fanart_url"]: row["fanart_id"]
        for row in existing_rows
        if row.get("fanart_url")
    }

    new_rows = assign_fanart_ids(new_rows, existing_ids_by_url)

    sheet_client.upsert_sheet(
        fanart_list_ws, new_rows, key="fanart_url", headers=HEADERS
    )

    print(f"{len(new_rows)} items")


if __name__ == "__main__":
    main()
