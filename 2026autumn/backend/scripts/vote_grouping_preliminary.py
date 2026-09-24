import os

from dotenv import load_dotenv
from lib import sheet_client, utils
from lib.content_grouper import ContentGrouper

load_dotenv()

GROUP_ID_COLUMN = "prelim_group_id"


def connect_sheet(spreadsheet_name, sheet_name):
    # 環境変数からJSONパス取得
    credentials_path = os.getenv("GOOGLE_APPLICATION_CREDENTIALS")

    return sheet_client.connect_sheet(credentials_path, spreadsheet_name, sheet_name)


def is_true(value) -> bool:
    """Google Sheetsから取得した真偽値を判定する。"""
    return value is True or str(value).strip().upper() == "TRUE"


def select_rookie_videos(video_data: list[dict], rookie_status: str) -> list[dict]:
    """予選グループ分けの対象となるルーキー動画だけを返す。"""
    return [
        row
        for row in video_data
        if row.get("status") == rookie_status
        and not is_true(row.get("excluded"))
        and not is_true(row.get("deleted"))
    ]


def create_group_assignments(
    rookie_videos: list[dict], group_num: int, seed: int | None = None
) -> dict[str, int]:
    """各グループが5～6曲になるよう、動画IDとグループIDの対応を作る。"""
    if not isinstance(group_num, int) or isinstance(group_num, bool) or group_num <= 0:
        raise ValueError("vote_grouping.group_num must be a positive integer")

    content_ids = [str(row.get("video_id", "")).strip() for row in rookie_videos]
    if any(not content_id for content_id in content_ids):
        raise ValueError("All rookie videos must have a video_id")
    if len(content_ids) != len(set(content_ids)):
        raise ValueError("Duplicate video_id found in rookie videos")

    grouper = ContentGrouper(content_ids, seed=seed)
    grouper.group_by_count(group_num)
    return {content_id: grouper.get_group_id(content_id) for content_id in content_ids}


def column_number_to_name(column_number: int) -> str:
    """1始まりの列番号をGoogle Sheetsの列名へ変換する。"""
    name = ""
    while column_number:
        column_number, remainder = divmod(column_number - 1, 26)
        name = chr(ord("A") + remainder) + name
    return name


def update_group_ids(
    video_list_sheet, video_data: list[dict], assignments: dict[str, int]
) -> None:
    """video_listのprelim_group_id列だけを更新する。"""
    headers = video_list_sheet.row_values(1)
    if GROUP_ID_COLUMN not in headers:
        raise ValueError(f"Column not found in video_list: {GROUP_ID_COLUMN}")

    if not video_data:
        return

    column_name = column_number_to_name(headers.index(GROUP_ID_COLUMN) + 1)
    values = [
        [assignments.get(str(row.get("video_id", "")).strip(), "")]
        for row in video_data
    ]
    video_list_sheet.update(
        values=values,
        range_name=f"{column_name}2:{column_name}{len(video_data) + 1}",
        value_input_option="USER_ENTERED",
    )


def main():
    config = utils.load_config()
    video_list_config = config["spreadsheets"]["video_list"]
    video_list_sheet = connect_sheet(
        video_list_config["name"], video_list_config["sheet"]
    )

    video_data = sheet_client.fetch_sheet_data(video_list_sheet)
    if not video_data:
        print(f"No data found in {video_list_config['sheet']}. Skipping.")
        return

    rookie_status = config["status"]["rookie"]
    rookie_videos = select_rookie_videos(video_data, rookie_status)
    group_num = config["vote_grouping"]["group_num"]
    seed = config["vote_grouping"]["random_seed"]
    print(
        f"Grouping {len(rookie_videos)} rookie videos into {group_num} groups "
        f"using random seed {seed}"
    )

    assignments = create_group_assignments(rookie_videos, group_num, seed)
    update_group_ids(video_list_sheet, video_data, assignments)

    group_sizes = {
        group_id: list(assignments.values()).count(group_id)
        for group_id in range(1, group_num + 1)
    }
    print(f"Group sizes: {group_sizes}")

    print(
        f"Successfully updated '{GROUP_ID_COLUMN}' in "
        f"'{video_list_config['sheet']}' of '{video_list_config['name']}'."
    )


if __name__ == "__main__":
    main()
