## 予選の集計機能
## Vote Aggregation for Preliminary

import os, re

from lib import utils
from lib import sheet_client

from lib.vote_aggregation import aggregate_votes

from googleapiclient import discovery
from oauth2client import client, file, tools

from dotenv import load_dotenv

load_dotenv()


#  曲名から動画IDを取得する。
#  Extract video ID from song title.


def extract_video_id(song_name):

    match = re.search(
        r"(sm\d+|nm\d+|so\d+)",
        song_name,
    )

    if match:
        return match.group(1)

    return None


# Initialize OAuth credentials for Google Forms API.
# Google Forms APIのOAuth認証情報を初期化します。


def initialize_oauth_credentials():

    oauth_credentials_path = os.environ["GOOGLE_OAUTH_CREDENTIALS"]

    SCOPES = [
        "https://www.googleapis.com/auth/forms.responses.readonly",
        "https://www.googleapis.com/auth/drive",
    ]

    store = file.Storage("token.json")

    creds = store.get()

    if not creds or creds.invalid:
        flow = client.flow_from_clientsecrets(
            oauth_credentials_path,
            SCOPES,
        )

        creds = tools.run_flow(
            flow,
            store,
        )

    return creds


# Get all Google Forms in the folder.
# フォルダ内のすべてのGoogleフォームを取得します。


def get_forms_in_folder(creds, folder_id):

    drive_service = discovery.build(
        "drive",
        "v3",
        credentials=creds,
    )

    result = (
        drive_service.files()
        .list(
            q=(
                f"'{folder_id}' in parents "
                "and mimeType='application/vnd.google-apps.form'"
            ),
            fields="files(id,name)",
        )
        .execute()
    )

    return result.get("files", [])


def fetch_form_responses(
    form_service,
    form_id,
):

    response = form_service.forms().responses().list(formId=form_id).execute()

    return response.get("responses", [])


# Create question_id -> song_name map.
# Convert Google Form question IDs into song names.
# Googleフォームの質問IDを曲名に変換します。


def get_question_map(
    form_service,
    form_id,
):

    form = form_service.forms().get(formId=form_id).execute()

    question_map = {}

    for item in form["items"]:

        if "questionGroupItem" not in item:
            continue

        for question in item["questionGroupItem"]["questions"]:

            question_id = question["questionId"]

            title = question["rowQuestion"]["title"]

            question_map[question_id] = title

    return question_map


# Convert Google Forms API responses into aggregate_votes format.
# Google Forms APIのレスポンスをaggregate_votes形式に変換します。


def convert_form_responses(
    responses,
    question_map,
):

    converted = []

    for response in responses:

        vote = {}

        answers = response.get("answers", {})

        for question_id, answer in answers.items():

            if question_id not in question_map:
                continue

            song_name = question_map[question_id]

            value = answer.get("textAnswers", {}).get("answers", [{}])[0].get("value")

            if value:

                vote[song_name] = value

        converted.append(vote)

    return converted


# Update ranking for preliminary by video_id.
# video_id 別に予選の順位を更新する。


def update_prelim_rank(
    worksheet,
    video_data,
    ranking,
):

    # video_idを使用してprelim_rankを更新する。
    # Update prelim_rank using video_id.

    rank_map = {}

    for row in ranking:

        video_id = extract_video_id(row["曲名"])

        if video_id:

            rank_map[video_id] = row["順位"]

    updated_count = 0

    for video in video_data:

        video_id = video.get("video_id", "")

        if video_id in rank_map:

            video["prelim_rank"] = rank_map[video_id]

            updated_count += 1

    print(f"Updated {updated_count} videos.")

    sheet_client.update_sheet(
        worksheet,
        video_data,
    )


def main():

    config = utils.load_config()

    # Initialize OAuth
    # OAuthを初期化する

    creds = initialize_oauth_credentials()

    # Get forms from the folder
    # フォルダーからフォームを取得する

    form_service = discovery.build(
        "forms",
        "v1",
        credentials=creds,
    )

    forms_folder_id = os.getenv("PRELIMINARY_FORMS_FOLDER_ID")

    forms = get_forms_in_folder(
        creds,
        forms_folder_id,
    )

    forms = sorted(forms, key=lambda x: x["name"])

    number_of_discs = config["vote_grouping"]["group_num"]

    all_rankings = []

    for form in forms[:number_of_discs]:

        print(f"\n===== {form['name']} =====")

        form_id = form["id"]

        responses = fetch_form_responses(
            form_service,
            form_id,
        )

        print("Number of responses:", len(responses))

        if not responses:

            print("No responses found. Skip.")

            continue

        # Convert Responses
        # 回答を変換する

        question_map = get_question_map(
            form_service,
            form_id,
        )

        votes = convert_form_responses(
            responses,
            question_map,
        )

        # Aggregate Votes
        # 集計機能

        ranking = aggregate_votes(votes)

        all_rankings.extend(ranking)

    # Update video_list
    # video_listを更新する

    print("\n===== Updating video_list =====")

    # Load video_list sheet.
    # video_listを取得する。

    sheet_config = config["spreadsheets"]["video_list"]

    video_sheet = sheet_client.connect_sheet(
        os.getenv("GOOGLE_APPLICATION_CREDENTIALS"),
        sheet_config["name"],
        sheet_config["sheet"],
    )

    video_data = sheet_client.fetch_sheet_data(video_sheet)

    if not video_data:

        print("No video data found.")

        return

    update_prelim_rank(
        video_sheet,
        video_data,
        all_rankings,
    )

    print("Successfully updated prelim_rank.")


if __name__ == "__main__":
    main()
