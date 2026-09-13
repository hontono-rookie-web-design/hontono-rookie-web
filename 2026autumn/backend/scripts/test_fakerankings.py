from scripts.vote_aggregation_preliminary import (
    initialize_oauth_credentials,
    get_forms_in_folder,
    get_question_map,
    extract_video_id,
)

import os
from lib import utils

from lib import sheet_client
from googleapiclient import discovery


def main():

    config = utils.load_config()

    creds = initialize_oauth_credentials()

    form_service = discovery.build(
        "forms",
        "v1",
        credentials=creds,
    )

    forms = get_forms_in_folder(
        creds,
        os.getenv("PRELIMINARY_FORMS_FOLDER_ID"),
    )

    forms = sorted(
        forms,
        key=lambda x: x["name"],
    )

    form = forms[0]

    print("Form:", form["name"])

    question_map = get_question_map(
        form_service,
        form["id"],
    )

    print("\n===== Question IDs =====")

    for title in question_map.values():

        print(repr(title))

        video_id = extract_video_id(title)

        print(video_id)

        print(video_id, "->", title)

    sheet_config = config["spreadsheets"]["video_list"]

    worksheet = sheet_client.connect_sheet(
        os.getenv("GOOGLE_APPLICATION_CREDENTIALS"),
        sheet_config["name"],
        sheet_config["sheet"],
    )

    video_data = sheet_client.fetch_sheet_data(
        worksheet,
    )

    sheet_ids = {row["video_id"] for row in video_data}

    print("\n===== Matching =====")

    matched = 0

    for title in question_map.values():

        print(repr(title))

        video_id = extract_video_id(title)

        print(video_id)

        if video_id in sheet_ids:
            print("✓", video_id)
            matched += 1
        else:
            print("✗", video_id)

    print(f"\nMatched {matched}/{len(question_map)}")

    test_ranking = [
        {
            "順位": 1,
            "曲名": "しおり/オキス feat.初音ミク_sm46180362",
            "得点": 100,
        },
        {
            "順位": 2,
            "曲名": "W@'s UP!!! feat.可不/小夜_sm46209895",
            "得点": 90,
        },
    ]

    rank_map = {}

    for row in test_ranking:

        video_id = extract_video_id(row["曲名"])

        rank_map[video_id] = row["順位"]

    print("\n===== Rank Matching =====")

    for video in video_data:

        video_id = video.get(
            "video_id",
            "",
        )

        if video_id in rank_map:
            print(
                "✓",
                video_id,
                "rank:",
                rank_map[video_id],
            )


if __name__ == "__main__":
    main()
