import json
from pathlib import Path

from lib.vote_aggregation import aggregate_votes


def test_aggregate_votes():

    data_path = Path(__file__).parent.parent / "data" / "test_vote_aggregation.json"

    with open(
        data_path,
        encoding="utf-8",
    ) as file:

        test_data = json.load(file)

    votes = test_data["votes"]

    expected = test_data["expected"]

    result = aggregate_votes(votes)

    assert result == expected


def test_aggregate_votes_includes_video_id():
    votes = [
        {
            "好きな作品を教えてください。[Song_Name_sm123]": "1位",
        }
    ]

    result = aggregate_votes(votes)

    assert result[0]["動画ID"] == "sm123"
    assert result[0]["曲名"] == "Song_Name"
