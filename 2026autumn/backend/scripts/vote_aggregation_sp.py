## SPの集計機能
## Vote Aggregation for SP

import os

from dotenv import load_dotenv
from googleapiclient import discovery
from oauth2client import client, file, tools

from lib import sheet_client, utils
from lib.vote_aggregation import aggregate_votes

load_dotenv()


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


# Update SP ranking by video_id.
# video_id別にSPの順位を更新する。


def update_sp_rank(
    worksheet,
    video_data,
    ranking,
):

    rank_map = {}

    for row in ranking:

        video_id = row["動画ID"]

        rank_map[video_id] = row["順位"]

    updated_count = 0

    for video in video_data:

        video_id = video.get("video_id", "")

        if video_id in rank_map:

            video["sp_rank"] = rank_map[video_id]

            updated_count += 1

    print(f"Updated {updated_count} videos.")

    sheet_client.update_sheet(
        worksheet,
        video_data,
    )

    print("Successfully updated sp_rank.")


# Update SP scores.
# SPのスコアを更新する。


def update_sp_score(
    ranking,
    video_data,
    config,
):

    video_by_id = {
        str(video.get("video_id", "")).strip(): video for video in video_data
    }

    score_data = []

    for row in ranking:

        video_id = str(row.get("動画ID", "")).strip()

        if not video_id:
            continue

        video = video_by_id.get(video_id, {})

        score_data.append(
            {
                "video_id": video_id,
                "sp_group_id": video.get("sp_group_id", ""),
                "sp_score": row["得点"],
                "sp_vote_count": row["投票数"],
                "sp_average_score": row["平均得点"],
            }
        )

    if not score_data:

        print("No SP scores found. Skipping score_list update.")

        return

    score_list_config = config["spreadsheets"]["score_list"]

    score_sheet = sheet_client.connect_sheet(
        os.getenv("GOOGLE_APPLICATION_CREDENTIALS"),
        score_list_config["name"],
        score_list_config["sheet"],
    )

    sheet_client.update_sheet(
        score_sheet,
        score_data,
    )

    print("Successfully updated sp_score.")


def main():

    config = utils.load_config()

    # Initialize OAuth
    # OAuthを初期化する

    creds = initialize_oauth_credentials()

    form_service = discovery.build(
        "forms",
        "v1",
        credentials=creds,
    )

    # Get SP forms from the folder.
    # フォルダからSPフォームを取得する。

    forms_folder_id = os.getenv("SP_FORMS_ID")

    if not forms_folder_id:
        print("SP_FORMS_ID is not set.")
        return

    forms = get_forms_in_folder(
        creds,
        forms_folder_id,
    )

    forms = sorted(forms, key=lambda x: x["name"])

    if not forms:
        print("No SP forms found.")
        return

    all_rankings = []

    for form in forms:

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
        # 回答を変換する。

        question_map = get_question_map(
            form_service,
            form_id,
        )

        votes = convert_form_responses(
            responses,
            question_map,
        )

        # Aggregate Votes
        # 集計する。

        ranking = aggregate_votes(votes)

        all_rankings.extend(ranking)

    # Load video_list sheet.
    # video_listを取得する。

    print("\n===== Updating video_list =====")

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

    # Update SP rank.
    # SP順位を更新する。

    update_sp_rank(
        video_sheet,
        video_data,
        all_rankings,
    )

    # Update SP score.
    # SPスコアを更新する。

    update_sp_score(
        all_rankings,
        video_data,
        config,
    )


if __name__ == "__main__":
    main()
