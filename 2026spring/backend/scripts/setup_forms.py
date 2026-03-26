import datetime
import os

from google.oauth2 import service_account
from googleapiclient import discovery

# SCOPES = SCOPES = [
#     "https://www.googleapis.com/auth/forms.body",
#     "https://www.googleapis.com/auth/forms.responses.readonly",
#     "https://www.googleapis.com/auth/drive",
# ]
# credentials_path = os.environ["GOOGLE_APPLICATION_CREDENTIALS"]
# DISCOVERY_DOC = "https://forms.googleapis.com/$discovery/rest?version=v1"

# creds = service_account.Credentials.from_service_account_file(
#         credentials_path, scopes=SCOPES)
# service = discovery.build('forms', 'v1', credentials=creds, discoveryServiceUrl=DISCOVERY_DOC, static_discovery=False)

# form_id = os.environ["FORM_ID"]
# # result = service.forms().responses().list(formId=form_id).execute()
# result = service.forms().get(formId=form_id).execute()
# print(result)

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
    credentials_path = os.environ["GOOGLE_APPLICATION_CREDENTIALS"]
    creds = service_account.Credentials.from_service_account_file(
        credentials_path,
        scopes=[
            "https://www.googleapis.com/auth/forms.body",
            "https://www.googleapis.com/auth/forms.responses.readonly",
            "https://www.googleapis.com/auth/drive",
        ]
    )

    parent_folder_id = os.environ["FORMS_FOLDER_ID"]
    new_folder_id = create_folder(creds, parent_folder_id)

    # form_file_id = os.environ["FORM_ID"]
    # copy_form(creds, form_file_id, new_folder_id)

if __name__ == "__main__":
    main()