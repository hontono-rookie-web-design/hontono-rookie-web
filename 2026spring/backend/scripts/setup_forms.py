import datetime
import os

import pandas as pd
from googleapiclient import discovery
from httplib2 import Http
from lib import sheet_client, utils
from oauth2client import client, file, tools


# フォームをマイドライブに作成
def create_form(creds, title):

    DISCOVERY_DOC = "https://forms.googleapis.com/$discovery/rest?version=v1"

    form_service = discovery.build(
        "forms",
        "v1",
        http=creds.authorize(Http()),
        discoveryServiceUrl=DISCOVERY_DOC,
        static_discovery=False,
    )

    # フォーム作成のためのリクエストボディ
    NEW_FORM = {
        "info": {
            "title": title,
        }
    }

    # 初期フォームを作成
    result = form_service.forms().create(body=NEW_FORM).execute()

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

def rename_drive_file(creds, file_id, new_file_name):
    """
    Google Drive上で表示されるファイル名（フォーム名）を変更します。
    """
    # Drive API v3のサービスを構築
    drive_service = discovery.build('drive', 'v3', credentials=creds)

    # 変更したいファイル名を設定
    file_metadata = {
        'name': new_file_name
    }

    # updateメソッドでファイル名を更新
    updated_file = drive_service.files().update(
        fileId=file_id,
        body=file_metadata,
        fields='id, name'
    ).execute()

    print(f"Drive上のファイル名を「{updated_file.get('name')}」に変更しました。")
    return updated_file

def update_vote_form(creds, form_id, items):
    DISCOVERY_DOC = "https://forms.googleapis.com/$discovery/rest?version=v1"

    form_service = discovery.build(
        "forms",
        "v1",
        http=creds.authorize(Http()),
        discoveryServiceUrl=DISCOVERY_DOC,
        static_discovery=False,
    )

    update = {
        "requests": [
            {
                "createItem": {
                    "item": {
                        "title": "Homework video",
                        "description": "Quizzes in Google Forms",
                        "videoItem": {
                            "video": {
                                "youtubeUri": (
                                    "https://www.youtube.com/watch?v=Lt5HqPvM-eI"
                                )
                            }
                        },
                    },
                    "location": {"index": 0},
                }
            }
        ]
    }

    # Add the video to the form
    question_setting = (
        form_service.forms()
        .batchUpdate(formId=form_id, body=update)
        .execute()
    )

    # Print the result to see it now has a video
    result = form_service.forms().get(formId=form_id).execute()
    return form_id

def main():

    service_account_credentials_path = os.environ["GOOGLE_APPLICATION_CREDENTIALS"]
    oauth_credentials_path = os.environ["GOOGLE_OAUTH_CREDENTIALS"]

    SCOPES = [
            "https://www.googleapis.com/auth/forms.body",
            "https://www.googleapis.com/auth/forms.responses.readonly",
            "https://www.googleapis.com/auth/drive",
    ]

    store = file.Storage("token.json")
    creds = None
    if not creds or creds.invalid:
        flow = client.flow_from_clientsecrets(oauth_credentials_path, SCOPES)
        creds = tools.run_flow(flow, store)

    # configの読み込み
    config = utils.load_config()

    # ルーキーのスプレッドシート読み込み
    video_spreadsheetname = config["vote_grouping"]["grouped_video_catalog"]["name"]
    video_sheetname = config["vote_grouping"]["grouped_video_catalog"]["rookie_sheet"]
    video_sheet = sheet_client.connect_sheet(service_account_credentials_path, video_spreadsheetname, video_sheetname)
    video_data = sheet_client.fetch_sheet_data(video_sheet)

    # 取得したデータが空であればスキップ
    if any(video_data) == False:
        print(f"No data found in {video_sheetname}. Skipping.")
        return

    # pandasのDataFrameに変換
    df = pd.DataFrame(video_data)

    # 投票フォームの作成
    # Formsフォルダに新しいフォルダを作成
    parent_folder_id = os.environ["FORMS_FOLDER_ID"]
    new_folder_id = create_folder(creds, parent_folder_id)

    # 種類数（NaNは除外）
    n_groups = df["グループID"].nunique(dropna=True)
    print(f"グループIDの種類数: {n_groups}")

    # グループIDごとに処理
    for group_id, group_df in df.groupby("グループID", dropna=True, sort=True):
        print(f"処理中 group_id={group_id}, 件数={len(group_df)}")
        
        title = f'{config["vote_form"]["title"]}{group_id}'
        # フォームの作成
        form_id = create_form(creds, title)
        # print(f"作成されたフォームのID: {form_id}")

        # フォームを共有フォルダに移動
        move_file_to_folder(creds, form_id, new_folder_id)

        # フォームの名前を変更
        rename_drive_file(creds, form_id, title)

        # フォームを更新
        update_vote_form(creds, form_id, group_df)

if __name__ == "__main__":
    main()