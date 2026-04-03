import os

from google.oauth2.service_account import Credentials
from googleapiclient import discovery

# ==========================================
# 設定情報の入力
# ==========================================
CREDENTIALS_FILE = 'credentials.json' # ダウンロードしたJSONキーのパス
FORM_ID = 'あなたのForm_IDをここに入力'
SPREADSHEET_ID = 'あなたのSpreadsheet_IDをここに入力'
SHEET_RANGE = 'シート1!A1' # 書き込み先のシート名と開始セル

# 必要なAPIのスコープ
SCOPES = [
    "https://www.googleapis.com/auth/forms.responses.readonly",
    "https://www.googleapis.com/auth/forms.body.readonly",
    "https://www.googleapis.com/auth/spreadsheets"
]

def main():
    # 1. 認証情報の読み込み
    creds = Credentials.from_service_account_file(CREDENTIALS_FILE, scopes=SCOPES)
    
    # APIサービスの構築
    forms_service = discovery.build('forms', 'v1', credentials=creds)
    sheets_service = discovery.build('sheets', 'v4', credentials=creds)

    # 2. フォームの設問（ヘッダー）情報を取得
    form_info = forms_service.forms().get(formId=FORM_ID).execute()
    items = form_info.get('items', [])
    
    question_ids = []
    headers = ['タイムスタンプ']
    
    for item in items:
        if 'questionItem' in item:
            q_id = item['questionItem']['question']['questionId']
            question_ids.append(q_id)
            headers.append(item['title']) # 設問のタイトルをヘッダーにする

    # 3. フォームの回答リストを取得
    responses_result = forms_service.forms().responses().list(formId=FORM_ID).execute()
    responses = responses_result.get('responses', [])

    sheet_data = [headers] # スプレッドシートに書き込むデータの配列（1行目はヘッダー）

    for r in responses:
        row = [r.get('createTime')] # タイムスタンプ
        answers = r.get('answers', {})
        
        # 設問の順序に従って回答を並べる
        for q_id in question_ids:
            ans = answers.get(q_id)
            if ans:
                # 複数選択肢などの場合を考慮して結合
                text_values = [a.get('value', '') for a in ans.get('textAnswers', {}).get('answers', [])]
                row.append(', '.join(text_values))
            else:
                row.append('') # 無回答の場合
                
        sheet_data.append(row)

    # 4. スプレッドシートへ書き込み（上書き更新）
    body = {
        'values': sheet_data
    }
    
    # clear() で一旦シートを綺麗にしてから書き込む（任意）
    sheets_service.spreadsheets().values().clear(
        spreadsheetId=SPREADSHEET_ID, range='シート1'
    ).execute()

    result = sheets_service.spreadsheets().values().update(
        spreadsheetId=SPREADSHEET_ID, 
        range=SHEET_RANGE,
        valueInputOption='USER_ENTERED', 
        body=body
    ).execute()

    print(f"{result.get('updatedRows')} 行のデータをスプレッドシートに書き込みました。")

if __name__ == '__main__':
    main()