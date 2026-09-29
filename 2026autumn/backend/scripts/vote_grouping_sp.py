from dotenv import load_dotenv
from lib import sheet_client, utils, vote_grouping

load_dotenv()

GROUP_ID_COLUMN = "sp_group_id"


def select_sp_videos(video_data: list[dict], sp_status: str) -> list[dict]:
    """SPグループ分けの対象となる有効なSP動画だけを返す。"""
    return vote_grouping.select_eligible_videos(video_data, sp_status)


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

    sp_videos = select_sp_videos(video_data, config["status"]["sp"])
    if not sp_videos:
        print("No eligible SP videos found. Skipping.")
        return

    grouping_config = config["vote_grouping_sp"]
    group_num = grouping_config["group_num"]
    seed = grouping_config["random_seed"]
    print(
        f"Grouping {len(sp_videos)} SP videos into {group_num} groups "
        f"using random seed {seed}"
    )

    assignments = vote_grouping.create_group_assignments(
        sp_videos, group_num, seed
    )
    vote_grouping.update_group_ids(
        video_list_sheet, video_data, assignments, GROUP_ID_COLUMN
    )

    print(
        f"Group sizes: {vote_grouping.summarize_group_sizes(assignments, group_num)}"
    )
    print(
        f"Successfully updated '{GROUP_ID_COLUMN}' in "
        f"'{video_list_config['sheet']}' of '{video_list_config['name']}'."
    )


if __name__ == "__main__":
    main()
