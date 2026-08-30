## TEST THE SHEET CONNECTION
# from lib.sheet_client import connect_sheet, fetch_sheet_data


# def main():
#     credentials_path = r"E:\Jean\Craetures\K Kalsen\Society\Real Rookie\Website 2026A\hontono-rookie-web\hontono-rookie-web-design-c51b792c3c76.json"

#     worksheet = connect_sheet(
#         credentials_path,
#         "人気投票順位_2026春",
#         "予選",
#     )

#     data = fetch_sheet_data(worksheet)

#     print("rows:", len(data))

#     for row in data[:5]:
#         print(row)


# if __name__ == "__main__":
#     main()



## TEST THE AGGREGATION FUNCTION
from lib.sheet_client import connect_sheet, fetch_sheet_data
from scripts.vote_aggregation import aggregate_votes


def main():

    # Change these to the spreadsheet you successfully tested before
    credentials_path = r"E:\Jean\Craetures\K Kalsen\Society\Real Rookie\Website 2026A\hontono-rookie-web\hontono-rookie-web-design-c51b792c3c76.json"

    spreadsheet_name = '本当のルーキー祭り2026春_Disc.1（回答）'

    worksheet_name = 'フォームの回答 1'


    worksheet = connect_sheet(
        credentials_path,
        spreadsheet_name,
        worksheet_name,
    )


    # Get spreadsheet data
    votes = fetch_sheet_data(worksheet)

    print("Number of votes:", len(votes))

# <<<<<<< HEAD
# <<<<<<< HEAD
#     # print("\nFirst vote:")
#     # print(votes[0])
# =======
#     print("\nFirst vote:")
#     print(votes[0])
# >>>>>>> 526f001 (Vote Aggregation Test 1)
# =======
    # print("\nFirst vote:")
    # print(votes[0])
# >>>>>>> 551ea46 (Update of test.py)


    # Aggregate
    ranking = aggregate_votes(votes)


    print("\n===== Ranking =====")

    for row in ranking:
        print(row)


if __name__ == "__main__":
    main()



## TEST THE SHEET CONNECTION AND DATAS
# import gspread
# from google.oauth2.service_account import Credentials


# # ===== Change these =====

# credentials_path = r"E:\Jean\Craetures\K Kalsen\Society\Real Rookie\Website 2026A\hontono-rookie-web\hontono-rookie-web-design-c51b792c3c76.json"

# # Spreadsheet title OR use open_by_key below
# spreadsheet_name = "本当のルーキー祭り2026春_Disc.1（回答）"

# # The worksheet(tab) name
# worksheet_name = "好きな作品を教えてください。"


# # =======================


# SCOPES = [
#     "https://www.googleapis.com/auth/spreadsheets",
#     "https://www.googleapis.com/auth/drive",
# ]


# def main():

#     print("Connecting...")

#     credentials = Credentials.from_service_account_file(
#         credentials_path,
#         scopes=SCOPES
#     )

#     client = gspread.authorize(credentials)

#     print("Authentication successful")


#     # Open spreadsheet
#     spreadsheet = client.open(spreadsheet_name)

#     print()
#     print("Spreadsheet:")
#     print(spreadsheet.title)


#     # Show all worksheets
#     print()
#     print("Available worksheets:")

#     worksheets = spreadsheet.worksheets()

#     for ws in worksheets:
#         print(
#             f"- {ws.title} "
#             f"({ws.row_count} rows x {ws.col_count} cols)"
#         )


#     # Select worksheet
#     worksheet = spreadsheet.worksheet(worksheet_name)


#     print()
#     print("Selected worksheet:")
#     print(worksheet.title)


#     # Raw data
#     values = worksheet.get_all_values()


#     print()
#     print("Number of rows:")
#     print(len(values))


#     print()
#     print("First 5 rows:")

#     for row in values[:5]:
#         print(row)



# if __name__ == "__main__":
#     main()