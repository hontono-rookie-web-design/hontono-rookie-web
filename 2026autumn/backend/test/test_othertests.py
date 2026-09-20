import json
from pathlib import Path

from lib.vote_aggregation import (
    aggregate_votes,
    clean_song_name,
)

from lib.vote_aggregation import (
    calculate_score,
    extract_rank,
)


def load_test_data():

    data_path = Path(__file__).parent.parent / "data" / "test_vote_aggregation.json"

    with open(
        data_path,
        encoding="utf-8",
    ) as file:

        return json.load(file)


# Googleフォームで曲名が無効な場合
# If the name of songs are invalid in google forms
def test_invalid_answers():

    test_data = load_test_data()

    votes = test_data["votes"]

    votes[0]["好きな作品を教えてください。[Song B]"] = ""

    votes[0]["好きな作品を教えてください。[Song C]"] = "abc"

    result = aggregate_votes(votes)

    song_a = result[0]

    assert song_a["曲名"] == "Song A"

    assert song_a["得点"] == 5


# 不要なデータについて
# About unnecessary datas
def test_ignore_form_metadata_columns():

    test_data = load_test_data()

    result = aggregate_votes(test_data["votes"])

    for song in result:

        assert "タイムスタンプ" not in song

        assert "メールアドレス" not in song


def test_clean_song_name():

    test_data = load_test_data()

    column_name = list(test_data["votes"][0].keys())[2]

    assert clean_song_name(column_name) == "Song A"


# 「順位」内の数値が適切に区切られている場合
# If the numbers in 'rank' are separeted properly
def test_extract_rank():

    assert extract_rank("1位") == 1

    assert extract_rank("10位") == 10

    assert extract_rank("") is None

    assert extract_rank("abc") is None

    assert extract_rank(None) is None


# 得点システムをテストする
# Test the scoring system
def test_calculate_score():

    assert calculate_score(1, 5) == 5

    assert calculate_score(2, 5) == 4

    assert calculate_score(3, 5) == 3

    assert calculate_score(5, 5) == 1
