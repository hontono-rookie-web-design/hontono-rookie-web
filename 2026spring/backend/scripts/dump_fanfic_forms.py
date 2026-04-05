import os

from lib import forms_client, sheet_client, utils


# フォームから回答を取得する
def load_form_responses(forms_service, form_id: str) -> list[dict[str, str]]:
    pass

def main():

    config = utils.load_config()
    tag_config: dict[str, str] = config["tag"]

    # 1. 認証情報の読み込み
    credentials_path = os.environ["GOOGLE_APPLICATION_CREDENTIALS"]
    creds = forms_client.build_credentials(credentials_path)
    
    # APIサービスの構築
    forms_service = forms_client.build_forms_service(creds)

    # 2. フォームの設問（ヘッダー）情報を取得
    FANFIC_FORM_ID = os.environ["FANFIC_FORM_ID"]
    form_info = forms_client.get_form(forms_service, FANFIC_FORM_ID)
    questions = forms_client.get_questions(form_info)

    # 3. フォームの回答リストを取得
    responses = forms_client.list_responses(forms_service, FANFIC_FORM_ID)

    sheet_data = forms_client.build_response_records(
        responses,
        questions,
        include_meta=True,
        include_email=True,
    )

    # 4. スプレッドシートに書き込む
    result_fanfic_spreadsheetname = config["spreadsheets"]["forms_result_fanfic"]["name"]
    result_fanfic_sheetname = config["spreadsheets"]["forms_result_fanfic"]["sheet"]
    result_fanfic_sheet = sheet_client.connect_sheet(
        credentials_path, 
        result_fanfic_spreadsheetname, 
        result_fanfic_sheetname
    )

    sheet_client.clear_sheet(result_fanfic_sheet)

    sheet_client.update_sheet(result_fanfic_sheet, sheet_data) # 書き込み先のシートとデータを渡す

    print(f"{len(sheet_data)} 行のデータをスプレッドシートに書き込みました。")

if __name__ == '__main__':
    main()