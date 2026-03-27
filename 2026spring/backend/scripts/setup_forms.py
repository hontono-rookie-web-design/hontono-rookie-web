import datetime
import os

from googleapiclient import discovery
from httplib2 import Http
from oauth2client import client, file, tools


# フォームをマイドライブに作成
def create_form(creds):

    DISCOVERY_DOC = "https://forms.googleapis.com/$discovery/rest?version=v1"

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

def move_file_to_folder(creds, file_id, target_folder_id):
    """
    指定したファイルを、指定したフォルダに移動します。
    """
    # Drive API v3のサービスを構築
    service = discovery.build('drive', 'v3', credentials=creds)

    # 1. ファイルの現在の親フォルダ（移動元の場所）を取得する
    file = service.files().get(
        fileId=file_id,
        fields='parents'
    ).execute()
    
    # 親フォルダのリストをカンマ区切りの文字列に変換（APIの仕様上必要）
    previous_parents = ",".join(file.get('parents', []))

    # 2. 親フォルダを付け替えて「移動」を実行する
    moved_file = service.files().update(
        fileId=file_id,
        addParents=target_folder_id,     # 新しい移動先のフォルダIDを指定
        removeParents=previous_parents,  # 古い親フォルダIDを指定して解除
        fields='id, parents'
    ).execute()

    print(f"ファイル (ID: {file_id}) を指定フォルダ (ID: {target_folder_id}) に移動しました")
    return moved_file

def main():

    credentials_path = os.environ["GOOGLE_OAUTH_CREDENTIALS"]

    SCOPES = [
            "https://www.googleapis.com/auth/forms.body",
            "https://www.googleapis.com/auth/forms.responses.readonly",
            "https://www.googleapis.com/auth/drive",
    ]

    store = file.Storage("token.json")
    creds = None
    if not creds or creds.invalid:
        flow = client.flow_from_clientsecrets(credentials_path, SCOPES)
        creds = tools.run_flow(flow, store)

    # Formsフォルダに新しいフォルダを作成
    parent_folder_id = os.environ["FORMS_FOLDER_ID"]
    new_folder_id = create_folder(creds, parent_folder_id)

    # フォームの作成
    form_id = create_form(creds)
    # print(f"作成されたフォームのID: {form_id}")

    # フォームを共有フォルダに移動
    move_file_to_folder(creds, form_id, new_folder_id)

if __name__ == "__main__":
    main()