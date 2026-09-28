from dotenv import load_dotenv
from lib import sheet_client, utils, vote_grouping

load_dotenv()

GROUP_ID_COLUMN = "prelim_group_id"


def select_rookie_videos(video_data: list[dict], rookie_status: str) -> list[dict]:
    """予選グループ分けの対象となるルーキー動画だけを返す。"""
    return vote_grouping.select_eligible_videos(video_data, rookie_status)


def main():
    config = utils.load_config()
    video_list_config = config["spreadsheets"]["video_list"]
    video_list_sheet = sheet_client.connect_sheet_from_env(
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

    assignments = vote_grouping.create_group_assignments(
        rookie_videos, group_num, seed
    )
    vote_grouping.update_group_ids(
        video_list_sheet, video_data, assignments, GROUP_ID_COLUMN
    )

    group_sizes = vote_grouping.summarize_group_sizes(assignments, group_num)
    print(f"Group sizes: {group_sizes}")

    print(
        f"Successfully updated '{GROUP_ID_COLUMN}' in "
        f"'{video_list_config['sheet']}' of '{video_list_config['name']}'."
    )


if __name__ == "__main__":
    main()
