from googleapiclient import discovery
from lib import forms_client

# ==========================================
# 設定情報の入力
# ==========================================
CREDENTIALS_FILE = 'credentials.json' # ダウンロードしたJSONキーのパス
FORM_ID = 'あなたのForm_IDをここに入力'
SPREADSHEET_ID = 'あなたのSpreadsheet_IDをここに入力'
SHEET_RANGE = 'シート1!A1' # 書き込み先のシート名と開始セル



def main():
    # 1. 認証情報の読み込み
    creds = forms_client.build_credentials(CREDENTIALS_FILE)
    
    # APIサービスの構築
    forms_service = forms_client.build_forms_service(creds)
    sheets_service = discovery.build('sheets', 'v4', credentials=creds)

    # 2. フォームの設問（ヘッダー）情報を取得
    form_info = forms_client.get_form(forms_service, FORM_ID)
    questions = forms_client.get_questions(form_info)
    question_headers = forms_client.build_question_headers(questions)
    headers = ['タイムスタンプ'] + question_headers

    # 3. フォームの回答リストを取得
    responses = forms_client.list_responses(forms_service, FORM_ID)

    sheet_data = [headers] # スプレッドシートに書き込むデータの配列（1行目はヘッダー）

    for r in responses:
        row = [r.get('createTime')] # タイムスタンプ
        
        # 設問の順序に従って回答を並べる
        normalized = forms_client.build_response_record(r, questions, include_meta=False)
        for header in question_headers:
            row.append(normalized.get(header, ''))
                
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