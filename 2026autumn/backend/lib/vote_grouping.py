from lib import sheet_client
from lib.content_grouper import ContentGrouper


def select_eligible_videos(
    video_data: list[dict],
    status: str,
    rank_column: str | None = None,
    max_rank: int | None = None,
) -> list[dict]:
    """部門・除外状態・順位を指定して対象動画を抽出する。"""
    selected = [
        row
        for row in video_data
        if row.get("status") == status
        and not sheet_client.is_true(row.get("excluded"))
        and not sheet_client.is_true(row.get("deleted"))
    ]

    if rank_column is None:
        return selected

    if not isinstance(max_rank, int) or isinstance(max_rank, bool) or max_rank <= 0:
        raise ValueError("max_rank must be a positive integer")

    ranked_videos = []
    for row in selected:
        try:
            rank = _positive_integer(row.get(rank_column), rank_column)
        except ValueError:
            continue
        if rank <= max_rank:
            ranked_videos.append(row)
    return ranked_videos


def create_group_assignments(
    videos: list[dict],
    group_num: int,
    seed: int | None = None,
) -> dict[str, int]:
    """動画を均等に分け、動画IDとグループIDの対応を返す。"""
    if not isinstance(group_num, int) or isinstance(group_num, bool) or group_num <= 0:
        raise ValueError("group_num must be a positive integer")

    content_ids = [str(row.get("video_id", "")).strip() for row in videos]
    if any(not content_id for content_id in content_ids):
        raise ValueError("All videos must have a video_id")
    if len(content_ids) != len(set(content_ids)):
        raise ValueError("Duplicate video_id found in videos")

    grouper = ContentGrouper(content_ids, seed=seed)
    grouper.group_by_count(group_num)
    return {content_id: grouper.get_group_id(content_id) for content_id in content_ids}


def create_final_group_assignments(
    videos: list[dict],
    group_num: int,
    prelim_group_column: str = "prelim_group_id",
    prelim_rank_column: str = "prelim_rank",
) -> dict[str, int]:
    """予選グループと順位をもとに決勝グループIDを作る。"""
    if not isinstance(group_num, int) or isinstance(group_num, bool) or group_num <= 0:
        raise ValueError("group_num must be a positive integer")

    content_ids = [str(row.get("video_id", "")).strip() for row in videos]
    if any(not content_id for content_id in content_ids):
        raise ValueError("All videos must have a video_id")
    if len(content_ids) != len(set(content_ids)):
        raise ValueError("Duplicate video_id found in videos")

    assignments = {}
    for row, content_id in zip(videos, content_ids):
        prelim_group_id = _positive_integer(
            row.get(prelim_group_column), prelim_group_column
        )
        prelim_rank = _positive_integer(
            row.get(prelim_rank_column), prelim_rank_column
        )
        assignments[content_id] = (
            (prelim_group_id - 1) + (prelim_rank - 1)
        ) % group_num + 1
    return assignments


def _positive_integer(value, column_name: str) -> int:
    """シートから取得した値を正の整数へ変換する。"""
    if isinstance(value, bool):
        raise ValueError(f"{column_name} must be a positive integer")

    try:
        number = float(str(value).strip())
    except (TypeError, ValueError):
        raise ValueError(f"{column_name} must be a positive integer") from None

    if not number.is_integer() or number <= 0:
        raise ValueError(f"{column_name} must be a positive integer")
    return int(number)


def update_group_ids(
    video_list_sheet,
    video_data: list[dict],
    assignments: dict[str, int],
    group_id_column: str,
) -> None:
    """video_listの指定したグループID列だけを更新する。"""
    rows = [
        {
            **row,
            group_id_column: assignments.get(
                str(row.get("video_id", "")).strip(), ""
            ),
        }
        for row in video_data
    ]
    sheet_client.update_sheet_columns(video_list_sheet, rows, [group_id_column])


def summarize_group_sizes(
    assignments: dict[str, int], group_num: int
) -> dict[int, int]:
    """全グループの曲数をグループID順に返す。"""
    return {
        group_id: list(assignments.values()).count(group_id)
        for group_id in range(1, group_num + 1)
    }
