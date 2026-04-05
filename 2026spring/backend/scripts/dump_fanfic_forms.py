import os

from lib import forms_client, sheet_client, utils


# フォームから回答を取得する
def load_form_responses(credentials_path: str) -> list[dict[str, str]]:
    # 1. 認証情報の読み込み
    creds = forms_client.build_credentials(credentials_path)
    
    # APIサービスの構築
    forms_service = forms_client.build_forms_service(creds)

    # 2. フォームの設問（ヘッダー）情報を取得
    FANFIC_FORM_ID = os.environ["FANFIC_FORM_ID"]
    form_info = forms_client.get_form(forms_service, FANFIC_FORM_ID)
    questions = forms_client.get_questions(form_info)

    # 3. フォームの回答リストを取得
    responses = forms_client.list_responses(forms_service, FANFIC_FORM_ID)

    response_records = forms_client.build_response_records(
        responses,
        questions,
        include_meta=True,
        include_email=True,
    )
    return response_records

def write_to_sheet(credentials_path: str, config: dict, response_records: list[dict[str, str]]):
    # 4. スプレッドシートに書き込む
    result_fanfic_spreadsheetname = config["spreadsheets"]["forms_result_fanfic"]["name"]
    result_fanfic_sheetname = config["spreadsheets"]["forms_result_fanfic"]["sheet"]
    result_fanfic_sheet = sheet_client.connect_sheet(
        credentials_path, 
        result_fanfic_spreadsheetname, 
        result_fanfic_sheetname
    )

    sheet_client.clear_sheet(result_fanfic_sheet)

    sheet_client.update_sheet(result_fanfic_sheet, response_records) # 書き込み先のシートとデータを渡す

    print(f"{len(response_records)} 行のデータをスプレッドシートに書き込みました。")

    return


def main():

    config = utils.load_config()

    credentials_path = os.environ["GOOGLE_APPLICATION_CREDENTIALS"]
    
    response_records = load_form_responses(credentials_path)

    write_to_sheet(credentials_path, config, response_records)
    
if __name__ == '__main__':
    main()