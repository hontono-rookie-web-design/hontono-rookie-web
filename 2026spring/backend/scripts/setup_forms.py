import argparse
import datetime
import os
import sys

import pandas as pd
from googleapiclient import discovery
from httplib2 import Http
from lib import sheet_client, utils
from oauth2client import client, file, tools


def create_folder(creds, parent_folder_id):
    """
    指定した親フォルダIDの下に、新しいフォルダを作成します。
    """
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
    print(f"[INFO]\t新しいフォルダ「{new_folder_name}」を作成しました。(ID: {new_folder_id})")
    return new_folder_id

def copy_file(creds, file_id, name):
    """
    指定したファイルを、指定したフォルダにコピーします。
    """
    # Drive API v3のサービスを構築
    service = discovery.build('drive', 'v3', credentials=creds)

    copied_file = {
        "name": name
    }

    results = service.files().copy(fileId=file_id, body=copied_file).execute()

    print(f"[INFO]\tファイル (ID: {file_id}) をコピーしました。新しいファイルID: {results['id']}")
    return results["id"]

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

    print(f"[INFO]\tファイル (ID: {file_id}) を指定フォルダ (ID: {target_folder_id}) に移動しました")
    return moved_file

def update_vote_form(creds, form_id, title, item_title, video_titles):
    """
    フォームのタイトルと質問を更新します。
    """
    if len(video_titles) == 0:
        print(f"[WARNING]\t動画がありません。終了します。")
        return form_id
    
    DISCOVERY_DOC = "https://forms.googleapis.com/$discovery/rest?version=v1"

    form_service = discovery.build(
        "forms",
        "v1",
        http=creds.authorize(Http()),
        discoveryServiceUrl=DISCOVERY_DOC,
        static_discovery=False,
    )

    # ItemIDを取得
    item_id = form_service.forms().get(formId=form_id).execute()["items"][0]["itemId"]
    # print(f"取得したItemID: {item_id}")

    questions = []
    for video_title in video_titles:
        questions.append({
            "required": True,
            "rowQuestion": {
                "title": video_title
            }
        })

    options = []
    for i in range(len(video_titles)):
        options.append({
            "value": f"{i+1}位"
        })

    update = {
        "requests": [
            {
                "updateFormInfo": {
                    "info": {
                        "title": title
                    },
                    "updateMask": "title"
                }
            },
            {
                "updateItem": {
                    "item": {
                        "itemId": item_id,
                        "title": item_title,
                        "questionGroupItem": {
                            "questions": questions,
                            "grid": {
                                "columns": {
                                    "type": "RADIO",
                                    "options": options,
                                    "shuffle": False
                                },
                                "shuffleQuestions": False
                            }
                        },
                    },
                    "location": {"index": 0},
                    "updateMask": "title,questionGroupItem"
                }
            }
        ]
    }

    # フォームを更新
    question_setting = (
        form_service.forms()
        .batchUpdate(formId=form_id, body=update)
        .execute()
    )

    # getresult = form_service.forms().get(formId=form_id).execute()
    # print(getresult)

    print(f"[INFO]\tフォーム (ID: {form_id}) を更新しました。")
    return form_id

def initialize_oauth_credentials():
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

    return creds

def load_spreadsheet(config, phase):
    
    service_account_credentials_path = os.environ["GOOGLE_APPLICATION_CREDENTIALS"]

    # ルーキーのスプレッドシート読み込み
    # 「グループID」「タイトル」という列が最低でも必要
    if phase == "prelim":
        video_spreadsheetname = config["vote_grouping"]["grouped_video_catalog"]["name"]
        video_sheetname = config["vote_grouping"]["grouped_video_catalog"]["rookie_sheet"]
    elif phase == "semifinal":
        video_spreadsheetname = config["vote_semifinal"]["grouped_video_catalog_semifinal"]["name"]
        video_sheetname = config["vote_semifinal"]["grouped_video_catalog_semifinal"]["rookie_sheet"]
    elif phase == "final":
        video_spreadsheetname = config["spreadsheets"]["video_catalog_final"]["name"]
        video_sheetname = config["spreadsheets"]["video_catalog_final"]["rookie_sheet"]
    elif phase == "ex":
        video_spreadsheetname = config["spreadsheets"]["video_catalog"]["name"]
        video_sheetname = config["spreadsheets"]["video_catalog"][f"ex_sheet"]
    
    video_sheet = sheet_client.connect_sheet(service_account_credentials_path, video_spreadsheetname, video_sheetname)
    video_data = sheet_client.fetch_sheet_data(video_sheet)

    # 取得したデータが空であればスキップ
    if any(video_data) == False:
        print(f"[WARNING]\t{video_sheetname}にデータが見つかりません。スキップします。")
        return

    # pandasのDataFrameに変換
    df = pd.DataFrame(video_data)

    return df

def create_vote_forms(creds, config, df, phase):

    template_form_id = os.environ["TEMPLATE_FORM_ID"]
    # Formsフォルダに新しいフォルダを作成
    parent_folder_id = os.environ["FORMS_FOLDER_ID"]
    new_folder_id = create_folder(creds, parent_folder_id)

    # グループIDごとに処理
    for group_id, group_df in df.groupby("グループID", dropna=True, sort=True):
        print(f"[INFO]\t処理中 group_id={group_id}, 件数={len(group_df)}")
        
        title = f'{config["vote_form"][phase]["title"]}{group_id}'
        item_title = config["vote_form"][phase]["item_title"]

        # テンプレートフォームをコピー
        new_form_id = copy_file(creds, template_form_id, title)

        # フォームを共有フォルダに移動
        move_file_to_folder(creds, new_form_id, new_folder_id)

        # フォームを更新
        update_vote_form(creds, new_form_id, title, item_title, group_df["タイトル"].tolist())


def main():
    parser = argparse.ArgumentParser(description="Set up vote forms")
    parser.add_argument(
        "--phase",
        type=str,
        required=True,
        help="対象フェーズ（例: prelim, semifinal, final, ex）",
    )
    args = parser.parse_args()
    phase = args.phase

    # OAuth認証情報の初期化
    oauth_creds = initialize_oauth_credentials()

    # configの読み込み
    config = utils.load_config()

    # スプレッドシートからデータを読み込む
    df = load_spreadsheet(config, phase)

    # 投票フォームの作成
    create_vote_forms(oauth_creds, config, df, phase)

if __name__ == "__main__":
    main()