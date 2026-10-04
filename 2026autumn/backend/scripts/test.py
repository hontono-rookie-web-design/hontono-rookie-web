from unittest.mock import patch

from lib.vote_aggregation import aggregate_votes

from scripts.vote_aggregation_final import (
    convert_form_responses as convert_final_form_responses,
    update_final_rank,
    update_final_score,
)

from scripts.vote_aggregation_sp import (
    convert_form_responses as convert_sp_form_responses,
    update_sp_rank,
    update_sp_score,
)

# Fake Google Form data
# Googleフォームのダミーデータ

question_map = {
    "q1": "Song A_sm12345678",
    "q2": "Song B_sm87654321",
    "q3": "Song C_sm11111111",
}

responses = [
    {
        "answers": {
            "q1": {"textAnswers": {"answers": [{"value": "1位"}]}},
            "q2": {"textAnswers": {"answers": [{"value": "2位"}]}},
            "q3": {"textAnswers": {"answers": [{"value": "3位"}]}},
        }
    },
    {
        "answers": {
            "q1": {"textAnswers": {"answers": [{"value": "2位"}]}},
            "q2": {"textAnswers": {"answers": [{"value": "1位"}]}},
            "q3": {"textAnswers": {"answers": [{"value": "3位"}]}},
        }
    },
]


# Fake config
# ダミー設定

config = {
    "spreadsheets": {
        "score_list": {
            "name": "FAKE_SCORE_LIST",
            "sheet": "score_list",
        }
    }
}


# Capture spreadsheet writes
# キャプチャスプレッドシートの書き込み

written_data = []


def fake_update_sheet(worksheet, data):

    written_data.append(
        {
            "worksheet": worksheet,
            "data": data,
        }
    )


def fake_connect_sheet(credentials, name, sheet):

    return f"{name}/{sheet}"


# FINAL TEST
# 決勝のテスト

print("\n========================================")
print("FINAL TEST")
print("========================================")


# Convert Final Google Form responses
# 決勝のGoogleフォームを変換する

final_votes = convert_final_form_responses(
    responses,
    question_map,
)

print("\n===== Converted Final Votes =====")

for vote in final_votes:
    print(vote)


# Aggregate Final votes
# 決勝の集計

final_ranking = aggregate_votes(final_votes)

print("\n===== Final Ranking =====")

for row in final_ranking:
    print(row)


# Fake Final video_list
# 偽の決勝の動画リスト

final_video_data = [
    {
        "video_id": "sm12345678",
        "title": "Song A",
        "final_group_id": "1",
        "final_rank": "",
    },
    {
        "video_id": "sm87654321",
        "title": "Song B",
        "final_group_id": "1",
        "final_rank": "",
    },
    {
        "video_id": "sm11111111",
        "title": "Song C",
        "final_group_id": "1",
        "final_rank": "",
    },
]


# Test final_rank output
# 決勝の順位を出力のテスト

with patch(
    "scripts.vote_aggregation_final.sheet_client.update_sheet",
    side_effect=fake_update_sheet,
):

    update_final_rank(
        "FAKE_FINAL_VIDEO_SHEET",
        final_video_data,
        final_ranking,
    )


print("\n===== Final video_list output =====")

for video in final_video_data:
    print(
        video["video_id"],
        "final_group_id =",
        video["final_group_id"],
        "final_rank =",
        video["final_rank"],
    )


# Test final_score output
# 決勝の得点を出力のテスト

with (
    patch(
        "scripts.vote_aggregation_final.sheet_client.connect_sheet",
        side_effect=fake_connect_sheet,
    ),
    patch(
        "scripts.vote_aggregation_final.sheet_client.update_sheet",
        side_effect=fake_update_sheet,
    ),
):

    update_final_score(
        final_ranking,
        final_video_data,
        config,
    )


# SP TEST
# SPのテスト

print("\n========================================")
print("SP TEST")
print("========================================")


# Convert SP Google Form responses
# 決勝のGoogleフォームを変換する

sp_votes = convert_sp_form_responses(
    responses,
    question_map,
)

print("\n===== Converted SP Votes =====")

for vote in sp_votes:
    print(vote)


# Aggregate SP votes
# SPの集計

sp_ranking = aggregate_votes(sp_votes)

print("\n===== SP Ranking =====")

for row in sp_ranking:
    print(row)


# Fake SP video_list
# 偽の決勝の動画リスト

sp_video_data = [
    {
        "video_id": "sm12345678",
        "title": "Song A",
        "sp_group_id": "1",
        "sp_rank": "",
    },
    {
        "video_id": "sm87654321",
        "title": "Song B",
        "sp_group_id": "1",
        "sp_rank": "",
    },
    {
        "video_id": "sm11111111",
        "title": "Song C",
        "sp_group_id": "1",
        "sp_rank": "",
    },
]


# Test sp_rank output
# 決勝の順位を出力のテスト

with patch(
    "scripts.vote_aggregation_sp.sheet_client.update_sheet",
    side_effect=fake_update_sheet,
):

    update_sp_rank(
        "FAKE_SP_VIDEO_SHEET",
        sp_video_data,
        sp_ranking,
    )


print("\n===== SP video_list output =====")

for video in sp_video_data:
    print(
        video["video_id"],
        "sp_group_id =",
        video["sp_group_id"],
        "sp_rank =",
        video["sp_rank"],
    )


# Test sp_score output
# 決勝の得点を出力のテスト

with (
    patch(
        "scripts.vote_aggregation_sp.sheet_client.connect_sheet",
        side_effect=fake_connect_sheet,
    ),
    patch(
        "scripts.vote_aggregation_sp.sheet_client.update_sheet",
        side_effect=fake_update_sheet,
    ),
):

    update_sp_score(
        sp_ranking,
        sp_video_data,
        config,
    )


# Captured spreadsheet writes
# キャプチャされたスプレッドシートの書き込み

print("\n========================================")
print("CAPTURED SPREADSHEET WRITES")
print("========================================")

for write in written_data:

    print("\nWorksheet:", write["worksheet"])

    for row in write["data"]:
        print(row)


print("\n===== Manual Final/SP Test Completed =====")
