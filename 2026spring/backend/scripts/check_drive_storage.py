import os
import sys

from google.oauth2.service_account import Credentials
from googleapiclient.discovery import build

# サービスアカウントキーのファイルパス ※実際のパスに置き換えてください
SERVICE_ACCOUNT_FILE = os.environ["GOOGLE_APPLICATION_CREDENTIALS"]
SCOPES = ['https://www.googleapis.com/auth/drive']

# 認証情報を作成
creds = Credentials.from_service_account_file(SERVICE_ACCOUNT_FILE, scopes=SCOPES)
drive_service = build('drive', 'v3', credentials=creds)

# aboutリソースから storageQuota フィールドを取得
try:
    about = drive_service.about().get(fields="storageQuota").execute()
    print(about)
except Exception as e:
    print(f"ストレージ情報の取得中にエラーが発生しました: {e}")
    print(f"ストレージ情報の取得中にエラーが発生しました: {e}")
