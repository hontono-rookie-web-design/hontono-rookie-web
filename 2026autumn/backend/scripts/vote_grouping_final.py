from dotenv import load_dotenv
from lib import sheet_client, utils, vote_grouping

load_dotenv()

GROUP_ID_COLUMN = "final_group_id"
PRELIM_GROUP_ID_COLUMN = "prelim_group_id"
PRELIM_RANK_COLUMN = "prelim_rank"


def select_final_videos(
    video_data: list[dict], rookie_status: str, final_border: int
) -> list[dict]:
    """予選順位が決勝進出ボーダー以内の有効な動画を返す。"""
    return vote_grouping.select_eligible_videos(
        video_data,
        rookie_status,
        rank_column=PRELIM_RANK_COLUMN,
        max_rank=final_border,
    )


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

    grouping_config = config["vote_grouping_final"]
    final_border = grouping_config["final_border"]
    final_videos = select_final_videos(
        video_data, config["status"]["rookie"], final_border
    )
    if not final_videos:
        print("No eligible final videos found. Skipping.")
        return

    group_num = grouping_config["group_num"]
    print(
        f"Grouping {len(final_videos)} videos ranked {final_border} or higher "
        f"into {group_num} final groups"
    )

    assignments = vote_grouping.create_final_group_assignments(
        final_videos,
        group_num,
        prelim_group_column=PRELIM_GROUP_ID_COLUMN,
        prelim_rank_column=PRELIM_RANK_COLUMN,
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
