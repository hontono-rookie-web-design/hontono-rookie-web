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
    worksheet = spreadsheet.worksheet(worksheet_name)

    return worksheet


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

    worksheet.clear()
    worksheet.update(rows)


def clear_sheet(worksheet):
    """
    スプレッドシートのデータを全削除
    """
    worksheet.clear()


def append_sheet(worksheet, data):
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


def delete_rows_by_key(worksheet, keys):
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
