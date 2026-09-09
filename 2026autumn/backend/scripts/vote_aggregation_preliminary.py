## 予選の集計機能
## Vote Aggregation for Preliminary

# import json
import os, re

from lib import utils
from lib import sheet_client

from scripts.vote_aggregation import aggregate_votes

from googleapiclient import discovery
from oauth2client import client, file, tools
import sys

from dotenv import load_dotenv
load_dotenv()


# Google Form回答シートに接続する。
# Connect to Google Form response sheet.

def connect_vote_sheet(spreadsheet_name, sheet_name):


    credentials_path = os.getenv(
        "GOOGLE_APPLICATION_CREDENTIALS"
    )

    return sheet_client.connect_sheet(
        credentials_path,
        spreadsheet_name,
        sheet_name,
    )



# 予選通過作品を取得する。
# Select semifinal candidates.

def select_semifinal_candidates(ranking, border):
    
    return ranking[:border]


#  曲名から動画IDを取得する。
#  Extract video ID from song title.

#  Example:
#  sm461949900_タイトル
#  ->
#  sm461949900

## THIS FUNCTION IS FOR THE MATCHING-BY-ID FUNCTION. IT'S NOT USED CURRENTLY.
## この機能はIDによるマッチング機能のためのものです。現在は使用されていません。

def extract_video_id(song_name):
    
    match = re.match(
        r"(sm\d+|nm\d+|so\d+)_",
        song_name,
    )

    if match:
        return match.group(1)

    return None


# Initialize OAuth credentials for Google Forms API.
# Google Forms APIのOAuth認証情報を初期化します。

def initialize_oauth_credentials():


    oauth_credentials_path = os.environ[
        "GOOGLE_OAUTH_CREDENTIALS"
    ]

    SCOPES = [
        "https://www.googleapis.com/auth/forms.responses.readonly",
        "https://www.googleapis.com/auth/drive",
    ]

    store = file.Storage(
        "token.json"
    )

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

    result = drive_service.files().list(
        q=(
            f"'{folder_id}' in parents "
            "and mimeType='application/vnd.google-apps.form'"
        ),
        fields="files(id,name)",
    ).execute()

    return result.get(
        "files",
        []
    )

# Get the Disc.1 form from the list of forms.
# Disc1のフォームからデータを取得する

def get_disc1_form(forms):

    for form in forms:

        if "Disc.1" in form["name"]:
            return form

    return None

# Fetch Google Form Answers
# Googleフォームの回答を取得する

def fetch_form_responses(
    creds,
    form_id,
):

    form_service = discovery.build(
        "forms",
        "v1",
        credentials=creds,
    )

    response = (
        form_service.forms()
        .responses()
        .list(
            formId=form_id
        )
        .execute()
    )

    return response.get(
        "responses",
        []
    )

# Create question_id -> song_name map.
# Convert Google Form question IDs into song names.
# Googleフォームの質問IDを曲名に変換します。

def get_question_map(
    creds,
    form_id,
):


    form_service = discovery.build(
        "forms",
        "v1",
        credentials=creds,
    )

    form = (
        form_service.forms()
        .get(
            formId=form_id
        )
        .execute()
    )


    question_map = {}


    for item in form["items"]:

        if "questionGroupItem" not in item:
            continue


        for question in item["questionGroupItem"]["questions"]:

            question_id = question["questionId"]

            title = (
                question["rowQuestion"]["title"]
            )

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


        answers = response.get(
            "answers",
            {}
        )


        for question_id, answer in answers.items():

            if question_id not in question_map:
                continue


            song_name = question_map[question_id]


            value = (
                answer
                .get("textAnswers", {})
                .get("answers", [{}])[0]
                .get("value")
            )


            if value:

                vote[song_name] = value


        converted.append(
            vote
        )


    return converted


# Load video_list sheet.
# video_listを取得する。

def load_video_list(config):

    sheet_config = config["spreadsheets"]["video_list"]

    worksheet = sheet_client.connect_sheet(
        os.getenv(
            "GOOGLE_APPLICATION_CREDENTIALS"
        ),
        sheet_config["name"],
        sheet_config["sheet"],
    )

    data = sheet_client.fetch_sheet_data(
        worksheet
    )

    return worksheet, data


# Update ranking for preliminary by TITLE.
# タイトル別に予選の順位を更新する。

def update_prelim_rank(
    worksheet,
    video_data,
    ranking,
):

    rank_map = {}

    for row in ranking:

        rank_map[row["曲名"]] = row["順位"]


    updated_count = 0


    for video in video_data:

        title = video.get(
            "title",
            ""
        )


        if title in rank_map:

            video["prelim_rank"] = rank_map[title]

            updated_count += 1


    print(
        f"Updated {updated_count} videos."
    )


    sheet_client.update_sheet(
        worksheet,
        video_data,
    )


# Update ranking for preliminary by VIDEO ID.
# 動画ID別に予選の順位を更新する。
# Noting that there's no video_id information in google forms, this function is currently commented out. 
# Googleフォームにはvideo_id情報が含まれていないため、この関数は現在コメントアウトされています。

# def update_prelim_rank(
#     worksheet,
#     video_data,
#     ranking,
# ):
#     """
#     Update prelim_rank using video_id.
#     """

#     # title -> rank
#     rank_map = {}

#     for row in ranking:
#         rank_map[row["曲名"]] = row["順位"]


#     updated_count = 0


#     for video in video_data:

#         title = video.get(
#             "title",
#             ""
#         )

#         video_id = video.get(
#             "video_id",
#             ""
#         )


#         if not video_id:
#             continue


#         for song_title, rank in rank_map.items():

#             song_video_id = extract_video_id(
#                 song_title
#             )

#             if song_video_id == video_id:

#                 video["prelim_rank"] = rank
#                 updated_count += 1
#                 break


#     print(
#         f"Updated {updated_count} videos."
#     )


#     sheet_client.update_sheet(
#         worksheet,
#         video_data,
#     )

def main():

    config = utils.load_config()


    # Initialize OAuth
    # OAuthを初期化する

    creds = initialize_oauth_credentials()



    # Get Disc.1 Form
    # Disc.1のフォームを取得する

    print(
        "\n===== Getting Form ====="
    )


    forms_folder_id = os.getenv(
        "FORMS_FOLDER_ID"
    )


    forms = get_forms_in_folder(
        creds,
        forms_folder_id,
    )


    disc1_form = get_disc1_form(
        forms
    )


    if not disc1_form:

        print(
            "Disc.1 form not found."
        )

        return


    form_id = disc1_form["id"]


    print(
        "Form:",
        disc1_form["name"]
    )



    # Fetch Responses
    # 回答を取得する

    print(
        "\n===== Fetching Responses ====="
    )


    responses = fetch_form_responses(
        creds,
        form_id,
    )


    print(
        "Number of responses:",
        len(responses)
    )


    if not responses:

        print(
            "No responses found."
        )

        return



    # Convert Responses
    # 回答を変換する

    print(
        "\n===== Converting Responses ====="
    )


    question_map = get_question_map(
        creds,
        form_id,
    )


    votes = convert_form_responses(
        responses,
        question_map,
    )


    print(
        "Number of converted votes:",
        len(votes)
    )


    print(
        "\nFirst vote:"
    )

    print(
        votes[0]
    )



    # Aggregate Votes
    # 集計機能

    print(
        "\n===== Ranking ====="
    )


    ranking = aggregate_votes(
        votes
    )


    for row in ranking:

        print(
            row["順位"],
            row["曲名"],
            row["得点"],
        )



    # Select Semifinal Candidates
    # 準決勝進出候補を選出する

    semifinal_border = config[
        "vote_semifinal"
    ][
        "semifinal_border"
    ]


    candidates = select_semifinal_candidates(
        ranking,
        semifinal_border,
    )


    print(
        "\n===== Semifinal Candidates ====="
    )


    for row in candidates:

        print(
            row["順位"],
            row["曲名"],
        )



    # Update video_list
    # video_listを更新する

    print(
        "\n===== Updating video_list ====="
    )


    video_sheet, video_data = load_video_list(
        config
    )


    if not video_data:

        print(
            "No video data found."
        )

        return



    update_prelim_rank(
        video_sheet,
        video_data,
        ranking,
    )


    print(
        "Successfully updated prelim_rank."
    )


if __name__ == "__main__":
    main()