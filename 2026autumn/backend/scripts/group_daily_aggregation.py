import argparse
import os
import re
from datetime import datetime
from zoneinfo import ZoneInfo

import pandas as pd
from dotenv import load_dotenv
from google.oauth2.service_account import Credentials
from googleapiclient import discovery
from lib import sheet_client, utils

load_dotenv()

# 共有用URL（例: https://docs.google.com/forms/d/e/<公開ID>/viewform）から公開IDを取り出す
PUBLIC_FORM_ID_PATTERN = re.compile(r"/d/e/([a-zA-Z0-9_-]+)")

# Drive/Forms APIをサービスアカウントで読み取るためのスコープ
FORMS_API_SCOPES = [
    "https://www.googleapis.com/auth/drive.readonly",
    "https://www.googleapis.com/auth/forms.body.readonly",
    "https://www.googleapis.com/auth/forms.responses.readonly",
]

FORMS_DISCOVERY_DOC = "https://forms.googleapis.com/$discovery/rest?version=v1"

STAGE_CHOICES = ["prelim", "final", "sp"]


def connect_sheet(spreadsheet_name, sheet_name):
    # 環境変数からJSONパス取得
    credentials_path = os.getenv("GOOGLE_APPLICATION_CREDENTIALS")

    return sheet_client.connect_sheet(credentials_path, spreadsheet_name, sheet_name)


def build_google_api_services(credentials_path: str):
    """サービスアカウント認証で、Drive APIとForms APIのサービスをそれぞれ構築する。"""
    credentials = Credentials.from_service_account_file(
        credentials_path, scopes=FORMS_API_SCOPES
    )

    drive_service = discovery.build("drive", "v3", credentials=credentials)
    forms_service = discovery.build(
        "forms",
        "v1",
        credentials=credentials,
        discoveryServiceUrl=FORMS_DISCOVERY_DOC,
        static_discovery=False,
    )

    return drive_service, forms_service


def extract_public_form_id(form_url: str) -> str:
    """フォームの共有用URLから公開ID（/d/e/<ID>/形式）を取り出す。"""
    match = PUBLIC_FORM_ID_PATTERN.search(str(form_url))
    if not match:
        raise ValueError(f"共有用URLから公開IDを取得できませんでした: {form_url}")
    return match.group(1)


def select_stage_group_form_urls(
    form_list_df: pd.DataFrame, stage_label: str
) -> dict[str, str]:
    """フォームURL一覧（forms_listシート）から対象ステージの行を絞り込み、
    group_id→form_urlの対応を作る。group_idの欠番・対象範囲はこのシートが正となる。
    """
    stage_df = form_list_df[form_list_df["stage"].astype(str).str.strip().eq(stage_label)].copy()

    stage_df["group_id"] = stage_df["group_id"].astype(str).str.strip()
    stage_df["form_url"] = stage_df["form_url"].astype(str).str.strip()

    # group_idまたはform_urlが空の行を除外する
    stage_df = stage_df[stage_df["group_id"].astype(bool) & stage_df["form_url"].astype(bool)]

    return dict(zip(stage_df["group_id"], stage_df["form_url"]))


def resolve_form_id(
    drive_service, forms_service, title: str, expected_public_id: str
) -> str:
    """タイトル完全一致でGoogleフォームを検索し、formIdを返す。

    Googleフォームの場合、Driveのファイル id がそのままForms APIの formId として使える。
    同じタイトルのフォームが複数見つかった場合は、各候補の回答用URL（responderUri）から
    公開IDを取り出し、forms_listシートに記録されている公開IDと一致するものだけを採用する。
    """
    escaped_title = title.replace("'", "\\'")
    query = (
        "mimeType='application/vnd.google-apps.form' "
        "and trashed=false "
        f"and name='{escaped_title}'"
    )

    response = drive_service.files().list(q=query, fields="files(id, name)").execute()
    files = response.get("files", [])

    if not files:
        raise ValueError(f"タイトル'{title}'に一致するフォームが見つかりませんでした")

    if len(files) == 1:
        return files[0]["id"]

    print(
        f"[WARNING]\tタイトル'{title}'に一致するフォームが{len(files)}件見つかりました。"
        "URLで絞り込みます。"
    )
    for file in files:
        form_id = file["id"]
        form = forms_service.forms().get(formId=form_id).execute()
        match = PUBLIC_FORM_ID_PATTERN.search(form.get("responderUri", ""))
        if match and match.group(1) == expected_public_id:
            return form_id

    raise ValueError(
        f"タイトル'{title}'に一致するフォームの中に、forms_listシートのURLと一致するものが"
        "見つかりませんでした"
    )


def count_form_responses(forms_service, form_id: str) -> int:
    """Forms APIで指定フォームの回答数を取得する（ページングに対応）。"""
    count = 0
    page_token = None

    while True:
        response = (
            forms_service.forms()
            .responses()
            .list(formId=form_id, pageToken=page_token,
                  fields="responses/responseId,nextPageToken")
            .execute()
        )
        count += len(response.get("responses", []))

        page_token = response.get("nextPageToken")
        if not page_token:
            break

    return count


def collect_group_response_counts(
    drive_service,
    forms_service,
    title_prefix: str,
    group_form_urls: dict[str, str],
) -> dict[str, int | str]:
    """forms_listシートから得たgroup_id一覧について、フォームを解決して回答数を取得する。

    グループ単位でエラーが起きても他のグループの処理は継続し、"ERROR"を記録する。
    """
    group_response_counts: dict[str, int | str] = {}

    for group_id, form_url in group_form_urls.items():
        title = f"{title_prefix}{group_id}"
        print(f"[INFO]\t処理中... (group_id: {group_id}, title: {title})")

        try:
            expected_public_id = extract_public_form_id(form_url)
            form_id = resolve_form_id(drive_service, forms_service, title, expected_public_id)
            count = count_form_responses(forms_service, form_id)
            group_response_counts[group_id] = count
            print(f"  -> 回答数={count}")
        except Exception as e:
            print(f"[WARNING]\t処理に失敗しました (group_id: {group_id}): {e}")
            group_response_counts[group_id] = "ERROR"

    return group_response_counts


def add_response_count_column(
    existing_rows: list[list[str]],
    group_response_counts: dict[str, int | str],
    column_header: str,
) -> list[list[str]]:
    """公開先シートの既存データ（1列目がグループID、2列目以降が過去の取得日時ごとの
    回答数）に、新しい日時列を1列追加した2次元配列を作る。

    既存の行・列はそのまま保持し、まだシートに無いグループIDは新しい行として追加する。
    """
    if existing_rows:
        header, data_rows = existing_rows[0], existing_rows[1:]
    else:
        header, data_rows = ["グループID"], []

    column_count = len(header)
    rows_by_group_id: dict[str, list[str]] = {}
    group_id_order: list[str] = []

    for row in data_rows:
        # 列数がヘッダーより少ない行があれば空文字で埋めて揃える
        padded_row = row + [""] * (column_count - len(row))
        group_id = padded_row[0]
        rows_by_group_id[group_id] = padded_row
        group_id_order.append(group_id)

    for group_id in group_response_counts:
        if group_id not in rows_by_group_id:
            rows_by_group_id[group_id] = [group_id] + [""] * (column_count - 1)
            group_id_order.append(group_id)

    def sort_key(group_id: str):
        return (0, int(group_id)) if group_id.isdigit() else (1, group_id)

    group_id_order = sorted(group_id_order, key=sort_key)

    new_rows = [header + [column_header]]
    for group_id in group_id_order:
        count = group_response_counts.get(group_id, "")
        new_rows.append(rows_by_group_id[group_id] + [str(count)])

    return new_rows


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="人気投票フォームの回答数を集計し、公開用スプレッドシートに追記する"
    )
    parser.add_argument(
        "--stage",
        type=str,
        required=False,
        default=None,
        choices=STAGE_CHOICES,
        help="対象ステージ（予選: prelim, 決勝: final, SP: sp。省略時は全ステージを順に処理）",
    )
    parser.add_argument(
        "--output-spreadsheet-name",
        type=str,
        default=None,
        help=(
            "書き込み先スプレッドシート名を一時的に上書きする"
            "（省略時はsettings.ymlのvote_response_counts.nameを使用）"
        ),
    )
    return parser.parse_args()


def process_stage(
    stage: str,
    config: dict,
    drive_service,
    forms_service,
    output_spreadsheet_name_override: str | None,
) -> None:
    """1ステージ分の「フォームURL一覧の読み込み→回答数取得→シート書き込み」を行う。"""
    stage_labels = config["vote_response_aggregation"]["stage_labels"]
    stage_label = stage_labels[stage]
    title_prefix = config["vote_form"][stage]["title"]

    print(f"対象ステージ: {stage}（{stage_label}）")

    form_list_config = config["spreadsheets"]["vote_form_list"]
    form_list_sheet = connect_sheet(form_list_config["name"], form_list_config["sheet"])
    form_list_df = pd.DataFrame(sheet_client.fetch_sheet_data(form_list_sheet))
    group_form_urls = select_stage_group_form_urls(form_list_df, stage_label)
    print(f"対象グループ数: {len(group_form_urls)}")

    if not group_form_urls:
        print(
            f"'{stage_label}'の対象グループがforms_listに無いため、"
            "スプレッドシートへの書き込みはスキップします。"
        )
        return

    group_response_counts = collect_group_response_counts(
        drive_service, forms_service, title_prefix, group_form_urls
    )
    print(group_response_counts)

    success_count = sum(1 for count in group_response_counts.values() if count != "ERROR")
    if success_count == 0:
        print(
            f"'{stage_label}'のフォームが1件も取得できなかったため、"
            "スプレッドシートへの書き込みはスキップします。"
        )
        return

    # スプレッドシートにはERRORをそのまま書かず、空欄にする
    sheet_ready_counts = {
        group_id: ("" if count == "ERROR" else count)
        for group_id, count in group_response_counts.items()
    }

    output_config = config["spreadsheets"]["vote_response_counts"]
    output_spreadsheet_name = output_spreadsheet_name_override or output_config["name"]
    output_sheet = connect_sheet(output_spreadsheet_name, stage_label)

    existing_rows = sheet_client.fetch_sheet_values(output_sheet)
    timestamp_column = datetime.now(ZoneInfo("Asia/Tokyo")).isoformat(timespec="seconds")
    new_rows = add_response_count_column(existing_rows, sheet_ready_counts, timestamp_column)

    sheet_client.update_sheet_rows(output_sheet, new_rows)
    print(f"'{output_spreadsheet_name}'の'{stage_label}'シートに'{timestamp_column}'列を追加しました。")


def main():
    args = parse_args()
    config = utils.load_config()

    stages = [args.stage] if args.stage else STAGE_CHOICES

    credentials_path = os.getenv("GOOGLE_APPLICATION_CREDENTIALS")
    drive_service, forms_service = build_google_api_services(credentials_path)

    for stage in stages:
        process_stage(
            stage, config, drive_service, forms_service, args.output_spreadsheet_name
        )
        print()


if __name__ == "__main__":
    main()
