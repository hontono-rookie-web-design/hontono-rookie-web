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
    assert all(song["グループ曲数"] == len(votes[0]) - 2 for song in result)

