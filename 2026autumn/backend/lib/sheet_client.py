import os

import gspread
from google.oauth2.service_account import Credentials

SCOPES = [
    "https://www.googleapis.com/auth/spreadsheets",
    "https://www.googleapis.com/auth/drive",
]


def connect_sheet(credentials_path: str, spreadsheet_name: str, worksheet_name: str):
    """
    スプレッドシートへ接続
    """
    credentials = Credentials.from_service_account_file(credentials_path, scopes=SCOPES)

    client = gspread.authorize(credentials)
    spreadsheet = client.open(spreadsheet_name)

    try:
        worksheet = spreadsheet.worksheet(worksheet_name)
    except:
        worksheet = spreadsheet.add_worksheet(title=worksheet_name, rows=1000, cols=10)

    return worksheet


def connect_sheet_from_env(spreadsheet_name: str, worksheet_name: str):
    """環境変数の認証情報を使ってシートへ接続する。"""
    credentials_path = os.getenv("GOOGLE_APPLICATION_CREDENTIALS")
    if not credentials_path:
        raise ValueError("GOOGLE_APPLICATION_CREDENTIALS is not set")

    return connect_sheet(credentials_path, spreadsheet_name, worksheet_name)


def is_true(value) -> bool:
    """Google Sheetsから取得した値を真偽値として判定する。"""
    return value is True or str(value).strip().upper() == "TRUE"


def column_number_to_name(column_number: int) -> str:
    """1始まりの列番号をGoogle Sheetsの列名へ変換する。"""
    if (
        not isinstance(column_number, int)
        or isinstance(column_number, bool)
        or column_number <= 0
    ):
        raise ValueError("column_number must be a positive integer")

    name = ""
    while column_number:
        column_number, remainder = divmod(column_number - 1, 26)
        name = chr(ord("A") + remainder) + name
    return name


def update_sheet_columns(
    worksheet, data: list[dict], column_names: list[str]
) -> None:
    """list[dict]のうち、指定列だけを行順を保って更新する。"""
    if not data or not column_names:
        return

    headers = worksheet.row_values(1)
    missing_columns = [name for name in column_names if name not in headers]
    if missing_columns:
        raise ValueError(
            f"Columns not found in worksheet: {', '.join(missing_columns)}"
        )

    last_row = len(data) + 1
    for column_name in column_names:
        column_letter = column_number_to_name(headers.index(column_name) + 1)
        values = [[row.get(column_name, "")] for row in data]
        worksheet.update(
            values=values,
            range_name=f"{column_letter}2:{column_letter}{last_row}",
            value_input_option="USER_ENTERED",
        )


def update_sheet(worksheet, data: list[dict]):
    """
    スプレッドシートをlist[dict]で完全更新
    """
    if not data:
        return

    headers = list(data[0].keys())

    rows = [headers]

    for item in data:
        rows.append([item.get(h, "") for h in headers])

    worksheet.update(values=rows, range_name="A1", value_input_option="USER_ENTERED")


def upsert_sheet(
    worksheet,
    data: list[dict],
    key: str,
    headers: list[str],
    deleted_flag_column: str = None,
    deleted_scope=None,
):
    """
    key列の値をもとに、シートの内容をlist[dict]で更新（一致する行は上書き、なければ追加）する。
    data内のdictに含まれない列（他の処理が書き込む列など）は、既存の値をそのまま保持する。

    Args:
        worksheet: 更新対象のワークシート
        data (list[dict]): 更新するデータ
        key (str): 行を一意に識別するキーの列名
        headers (list[str]): シートの全列名（出力時の列順）
        deleted_flag_column (str, optional): 指定すると、既存行のうちdeleted_scopeの対象で
            今回のdataに含まれない行にTrueを、dataに含まれる行にFalseをセットする列名。
            （例: 取得元から消えた＝削除された行に印を付ける用途）
        deleted_scope (Callable[[dict], bool], optional): 既存行（dict）を受け取り、
            削除判定の対象にするかどうかを返す関数。Noneの場合は全既存行が対象。
            data内のdictが一部門分しか含まないケース（複数回に分けてupsert_sheetを呼ぶ場合）で、
            他部門の行まで誤って削除扱いにしないために使う。
    """
    existing_rows = worksheet.get_all_records()
    index = {str(row[key]): dict(row) for row in existing_rows}

    touched_keys = set()
    for item in data:
        row_key = str(item[key])
        touched_keys.add(row_key)
        if row_key in index:
            index[row_key].update(item)
        else:
            row = {h: "" for h in headers}
            row.update(item)
            index[row_key] = row

    if deleted_flag_column:
        for row_key, row in index.items():
            if row_key in touched_keys:
                row[deleted_flag_column] = False
            elif deleted_scope is None or deleted_scope(row):
                row[deleted_flag_column] = True

    rows = [headers]
    for row in index.values():
        rows.append([row.get(h, "") for h in headers])

    worksheet.update(values=rows, range_name="A1", value_input_option="USER_ENTERED")


def clear_sheet(worksheet):
    """
    スプレッドシートのデータを全削除
    """
    worksheet.clear()


def append_sheet(worksheet, data: dict | list[dict]):
    """
    スプレッドシートへデータ追加
    dict または list[dict]
    """

    if isinstance(data, dict):
        data = [data]

    headers = worksheet.row_values(1)

    rows = []
    for item in data:
        rows.append([item.get(h, "") for h in headers])

    worksheet.append_rows(rows)


def delete_rows_by_key(worksheet, keys: str | list[str]):
    """
    1列目をキーとして行削除
    """

    if isinstance(keys, str):
        keys = [keys]

    records = worksheet.get_all_values()

    header = records[0]
    rows = records[1:]

    new_rows = [header]

    for row in rows:
        if row[0] not in keys:
            new_rows.append(row)

    worksheet.clear()
    worksheet.update(new_rows)


def fetch_sheet_data(worksheet) -> list[dict]:
    """
    スプレッドシートの内容を list[dict] で取得
    """
    return worksheet.get_all_records()


def fetch_sheet_values(worksheet) -> list[list[str]]:
    """
    スプレッドシートの内容を2次元配列（ヘッダー行含む）で取得
    """
    return worksheet.get_all_values()


def update_sheet_rows(worksheet, rows: list[list]):
    """
    スプレッドシートを2次元配列（ヘッダー行含む）で上書き
    """
    if not rows:
        return

    worksheet.update(values=rows, range_name="A1", value_input_option="USER_ENTERED")


def build_video_index(
    spreadsheet_name: str,
    credentials_path: str,
    target_sheets: list[str] = ["rookie", "op", "ex"],
) -> dict:
    """
    スプレッドシート全体を読み込んで
    {動画ID: {"タイトル": ..., "投稿者名": ...}} の辞書を作成
    """

    gc = gspread.service_account(filename=credentials_path)
    sh = gc.open(spreadsheet_name)

    video_index = {}

    for sheet_name in target_sheets:
        try:
            worksheet = sh.worksheet(sheet_name)
        except gspread.exceptions.WorksheetNotFound:
            continue

        records = worksheet.get_all_records()

        for row in records:
            video_id = str(row.get("動画ID"))
            video_index[video_id] = {
                "タイトル": row.get("タイトル"),
                "投稿者名": row.get("投稿者名"),
            }

    return video_index
