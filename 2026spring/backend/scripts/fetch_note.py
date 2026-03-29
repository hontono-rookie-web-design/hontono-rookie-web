import sys 
import os 
sys.path.append(os.path.join(os.path.dirname(__file__), '../'))

from lib import utils
from lib import sheet_client
from gspread_dataframe import set_with_dataframe
import pandas as pd 
import datetime
import requests
import time

def connect_sheet(spreadsheet_name, sheet_name):
    # 環境変数からJSONパス取得
    credentials_path = os.environ["GOOGLE_APPLICATION_CREDENTIALS"]
    
    return sheet_client.connect_sheet(credentials_path, spreadsheet_name, sheet_name)

#記事の総数を取得
def get_note_count(hashtag):
    url = f"https://note.com/api/v3/hashtags/{hashtag}/notes"
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    }

    for i in range(6):
        try:
            time.sleep(1)
            
            response = requests.get(url, headers=headers, timeout=10)
            response.raise_for_status()
            
            res = response.json()
            count = res.get('data', {}).get('count', 0)
            return count

        except requests.exceptions.RequestException as e:
            print(f"リトライ中 ({i+1}/6): エラーが発生しました - {e}")
            time.sleep(5)
        else:
            break
    else:      
        print("最大試行回数に到達しました。")
        raise

#記事の情報を取得
def get_data(hashtag, count):
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    }
    
    page_num = (count // 50) + 1 #1回のリクエストで50件まで情報取得できる仕様
    
    i = 0
    data_list = []
    
    with requests.Session() as session:
        session.headers.update(headers)

        for page in range(1, page_num + 1):
            url = f"https://note.com/api/v3/hashtags/{hashtag}/notes?page={page}"
            
            # リトライ処理
            for attempt in range(6):
                try:
                    # 3. サーバーへの負荷軽減のため、リクエスト前に少し待機（重要）
                    time.sleep(1.5) 
                    
                    response = session.get(url, headers=headers,timeout=10) 
                    response.raise_for_status()
                    res = response.json()
                    
                    notes = res.get('data', {}).get('notes', [])
                    if not notes:
                        break # データが空なら終了

                    for notedata in notes:
                        i += 1
                        title = notedata.get('name')
                        user = notedata.get('user', {})
                        author_name = user.get('name')
                        author_urlname = user.get('urlname')
                        note_key = notedata.get('key')
                        
                        published_date = datetime.datetime.fromisoformat(notedata['publish_at']).date()
                        user_url = f"https://note.com/{author_urlname}"
                        note_url = f"{user_url}/n/{note_key}"
                        eyecatch_url = notedata.get('eyecatch_url')
                        user_profile_img_url = user.get('user_profile_image_url')

                        data_list.append([i, title, author_name, published_date, note_url, user_url, eyecatch_url, user_profile_img_url])
                        
                        if i >= count: # 指定数に達したら終了
                            break
                    
                    break # 成功したらリトライループを抜ける

                except requests.exceptions.RequestException as e:
                    print(f"リトライ中 ({attempt+1}/6): {e}")
                    time.sleep(5) 
            if i >= count:
                break
    df = pd.DataFrame(data_list, columns=["No.", "Title", "Author", "Published Date", "note_url", "user_url", "eyecatch_url", "user_profile_img_url"])
    return df

def update_sheet(spreadsheetname,sheetname,data):
    sheet = connect_sheet(spreadsheetname,sheetname)
    sheet.clear() 
    set_with_dataframe(sheet,data,row=1,col=1)

def main():
    # シートに接続
    config = utils.load_config()
    tag_config: dict[str, str] = config["tag"]
    catalog_sheet_config = config["spreadsheets"]["note_list"]
    catalog_spreadsheetname = catalog_sheet_config["name"]
    catalog_sheetname = catalog_sheet_config["list_sheet"]

    # hashtag = "本当のルーキー祭り2025秋"
    hashtag = tag_config["rookie"]
    
    #記事の総数を取得
    note_count = get_note_count(hashtag)

    #記事情報取得
    note_data = get_data(hashtag,note_count)

    #スプレッドシートに書き込み
    update_sheet(catalog_spreadsheetname,catalog_sheetname,note_data)

if __name__=="__main__":
    main()