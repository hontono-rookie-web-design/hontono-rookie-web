import datetime
import os

from google.oauth2 import service_account
from googleapiclient import discovery
from httplib2 import Http
from oauth2client import client, file, tools


# フォームの作成
def create_form(credentials_path):

    SCOPES = "https://www.googleapis.com/auth/forms.body"
    DISCOVERY_DOC = "https://forms.googleapis.com/$discovery/rest?version=v1"

    store = file.Storage("token.json")
    creds = None
    if not creds or creds.invalid:
        flow = client.flow_from_clientsecrets(credentials_path, SCOPES)
        creds = tools.run_flow(flow, store)

    form_service = discovery.build(
        "forms",
        "v1",
        http=creds.authorize(Http()),
        discoveryServiceUrl=DISCOVERY_DOC,
        static_discovery=False,
    )

    # Request body for creating a form
    NEW_FORM = {
        "info": {
            "title": "Quickstart form",
        }
    }

    # Request body to add a multiple-choice question
    NEW_QUESTION = {
        "requests": [
            {
                "createItem": {
                    "item": {
                        "title": (
                            "In what year did the United States land a mission on"
                            " the moon?"
                        ),
                        "questionItem": {
                            "question": {
                                "required": True,
                                "choiceQuestion": {
                                    "type": "RADIO",
                                    "options": [
                                        {"value": "1965"},
                                        {"value": "1967"},
                                        {"value": "1969"},
                                        {"value": "1971"},
                                    ],
                                    "shuffle": True,
                                },
                            }
                        },
                    },
                    "location": {"index": 0},
                }
            }
        ]
    }

    # Creates the initial form
    result = form_service.forms().create(body=NEW_FORM).execute()

    # Adds the question to the form
    question_setting = (
        form_service.forms()
        .batchUpdate(formId=result["formId"], body=NEW_QUESTION)
        .execute()
    )

    # Prints the result to show the question has been added
    get_result = form_service.forms().get(formId=result["formId"]).execute()
    print(get_result)
    return result["formId"]

# 新しいフォルダーを作成
def create_folder(creds, parent_folder_id):
    # Drive API v3のサービスを構築
    service = discovery.build('drive', 'v3', credentials=creds)

    new_folder_name = datetime.datetime.now().strftime("%Y-%m-%d_%H-%M-%S") # フォルダ名に日時を使用

    folder_metadata = {
        'name': new_folder_name,
        'mimeType': 'application/vnd.google-apps.folder',
        'parents': [parent_folder_id] # 親フォルダとして指定されたIDを指定
    }

    new_folder = service.files().create(body=folder_metadata, fields='id').execute()
    new_folder_id = new_folder.get('id')
    print(f"新しいフォルダ「{new_folder_name}」を作成しました。(ID: {new_folder_id})")
    return new_folder_id

def copy_form(creds, form_file_id, destination_folder_id):
    # Drive API v3のサービスを構築
    service = discovery.build('drive', 'v3', credentials=creds)

    new_form_name = f"コピーされたフォーム_{datetime.datetime.now().strftime('%Y-%m-%d_%H-%M-%S')}" # コピー後のフォーム名に日時を使用

    copy_metadata = {
        'name': new_form_name,
        'parents': [destination_folder_id] # 新しい保存先として指定されたフォルダIDを指定
    }

    copied_form = service.files().copy(
        fileId=form_file_id, # コピー元のGoogle FormのID
        body=copy_metadata,
        fields='id'
    ).execute()

    copied_form_id = copied_form.get('id')
    print(f"フォームをコピーしました。(新しいフォームID: {copied_form_id})")
    return copied_form_id

def main():
    service_account_credentials_path = os.environ["GOOGLE_APPLICATION_CREDENTIALS"]
    service_account_creds = service_account.Credentials.from_service_account_file(
        service_account_credentials_path,
        scopes=[
            "https://www.googleapis.com/auth/forms.body",
            "https://www.googleapis.com/auth/forms.responses.readonly",
            "https://www.googleapis.com/auth/drive",
        ]
    )

    # フォームの作成
    oauth_credentials_path = os.environ["GOOGLE_OAUTH_CREDENTIALS"]
    form_id = create_form(oauth_credentials_path)
    print(f"作成されたフォームのID: {form_id}")

    # parent_folder_id = os.environ["FORMS_FOLDER_ID"]
    # new_folder_id = create_folder(service_account_creds, parent_folder_id)

    # form_file_id = os.environ["FORM_ID"]
    # copy_form(service_account_creds, form_file_id, new_folder_id)

if __name__ == "__main__":
    main()