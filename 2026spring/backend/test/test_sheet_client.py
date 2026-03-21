import gspread
import os


def test_sheet_access(path):
    try:
        gc = gspread.service_account(filename=path)
        gc.openall()  # ここで認証が走る
        print("OK")
    except Exception as e:
        print("NG:", e)


def main():
    credentials_path = os.environ["GOOGLE_APPLICATION_CREDENTIALS"]
    test_sheet_access(credentials_path)


if __name__ == "__main__":
    main()
