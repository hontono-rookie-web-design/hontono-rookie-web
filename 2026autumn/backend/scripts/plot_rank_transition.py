"""Google Forms の投票結果から日次の順位推移グラフを作成する。"""

import argparse
import os
import re
from collections import defaultdict
from datetime import datetime
from pathlib import Path

import matplotlib.pyplot as plt
from dotenv import load_dotenv
from google.oauth2.service_account import Credentials
from googleapiclient import discovery

DRIVE_FOLDER_MIME_TYPE = "application/vnd.google-apps.folder"
FORM_MIME_TYPE = "application/vnd.google-apps.form"
SCOPES = [
    "https://www.googleapis.com/auth/drive.readonly",
    "https://www.googleapis.com/auth/forms.responses.readonly",
]
FORM_NUMBER_PATTERN = re.compile(r"(\d+)\s*$")
RANK_PATTERN = re.compile(r"\d+")


def build_services(credentials_path: str):
    credentials = Credentials.from_service_account_file(
        credentials_path, scopes=SCOPES
    )
    drive_service = discovery.build("drive", "v3", credentials=credentials)
    forms_service = discovery.build("forms", "v1", credentials=credentials)
    return drive_service, forms_service


def find_folder_id(drive_service, folder_name: str) -> str:
    query = (
        f"name = '{folder_name.replace(chr(39), chr(92) + chr(39))}' "
        f"and mimeType = '{DRIVE_FOLDER_MIME_TYPE}' and trashed = false"
    )
    folders = list(
        drive_service.files()
        .list(q=query, spaces="drive", fields="files(id,name)", pageSize=1000)
        .execute()
        .get("files", [])
    )

    if not folders:
        raise RuntimeError(f"Google Drive にフォルダがありません: {folder_name}")
    if len(folders) > 1:
        ids = ", ".join(folder["id"] for folder in folders)
        raise RuntimeError(f"同名のフォルダが複数あります: {folder_name} ({ids})")
    return folders[0]["id"]


def fetch_forms(drive_service, folder_id: str) -> list[dict]:
    query = (
        f"'{folder_id}' in parents and mimeType = '{FORM_MIME_TYPE}' "
        "and trashed = false"
    )
    files = []
    page_token = None
    while True:
        response = (
            drive_service.files()
            .list(
                q=query,
                spaces="drive",
                fields="nextPageToken, files(id,name)",
                pageSize=1000,
                pageToken=page_token,
            )
            .execute()
        )
        files.extend(response.get("files", []))
        page_token = response.get("nextPageToken")
        if not page_token:
            break

    forms = []
    for form in files:
        match = FORM_NUMBER_PATTERN.search(form["name"])
        if match:
            forms.append({**form, "number": int(match.group(1))})

    return sorted(forms, key=lambda form: (form["number"], form["name"]))


def extract_rank(value) -> int | None:
    match = RANK_PATTERN.search(str(value or ""))
    return int(match.group()) if match else None


def extract_video_id(row_title: str) -> str:
    video_id = row_title.rsplit("_", 1)[-1].strip()
    if not video_id:
        raise ValueError(f"videoId を取得できない行タイトルです: {row_title}")
    return video_id


def fetch_form_votes(forms_service, form_id: str) -> tuple[dict[str, str], list[dict]]:
    form = forms_service.forms().get(formId=form_id).execute()
    row_question_ids = {}
    row_count = 0

    for item in form.get("items", []):
        for question in item.get("questionGroupItem", {}).get("questions", []):
            row_question = question.get("rowQuestion", {})
            question_id = question.get("questionId")
            row_title = row_question.get("title")
            if question_id and row_title:
                row_question_ids[question_id] = extract_video_id(row_title)
                row_count += 1

    if not row_question_ids:
        raise ValueError(f"グリッド形式の行が見つかりません: {form_id}")

    responses = []
    page_token = None
    while True:
        response = (
            forms_service.forms()
            .responses()
            .list(formId=form_id, pageToken=page_token)
            .execute()
        )
        responses.extend(response.get("responses", []))
        page_token = response.get("nextPageToken")
        if not page_token:
            break

    return row_question_ids, [{"row_count": row_count, **vote} for vote in responses]


def aggregate_daily_scores(forms_service, forms: list[dict]) -> dict[str, dict[str, int]]:
    daily_scores = defaultdict(lambda: defaultdict(int))

    for form in forms:
        row_question_ids, responses = fetch_form_votes(forms_service, form["id"])
        for response in responses:
            submitted_at = datetime.fromisoformat(
                response["createTime"].replace("Z", "+00:00")
            )
            vote_date = submitted_at.date().isoformat()
            for question_id, answer in response.get("answers", {}).items():
                video_id = row_question_ids.get(question_id)
                if not video_id:
                    continue
                answers = answer.get("textAnswers", {}).get("answers", [])
                rank = extract_rank(answers[0].get("value")) if answers else None
                if rank is None or not 1 <= rank <= response["row_count"]:
                    continue
                daily_scores[vote_date][video_id] += response["row_count"] - rank + 1

    return {date: dict(scores) for date, scores in daily_scores.items()}


def build_daily_ranks(daily_scores: dict[str, dict[str, int]]) -> dict[str, dict[str, int]]:
    daily_ranks = {}
    for date, scores in daily_scores.items():
        ordered = sorted(scores.items(), key=lambda item: (-item[1], item[0]))
        daily_ranks[date] = {
            video_id: rank for rank, (video_id, _) in enumerate(ordered, start=1)
        }
    return daily_ranks


def plot_rank_transition(daily_ranks: dict[str, dict[str, int]], output_path: Path):
    dates = sorted(daily_ranks)
    video_ids = sorted({video_id for ranks in daily_ranks.values() for video_id in ranks})
    colors = plt.get_cmap("viridis")(  # 明示的なカラーマップで線を区別する
        [index / max(len(video_ids) - 1, 1) for index in range(len(video_ids))]
    )

    plt.style.use("seaborn-v0_8-whitegrid")
    figure, axis = plt.subplots(figsize=(14, 9), constrained_layout=True)
    for color, video_id in zip(colors, video_ids):
        ranks = [daily_ranks[date].get(video_id) for date in dates]
        axis.plot(
            dates,
            ranks,
            marker="o",
            linewidth=2.8,
            markersize=8,
            color=color,
            label=video_id,
        )

    axis.invert_yaxis()
    axis.set_xlabel("投票日", fontsize=16, labelpad=12)
    axis.set_ylabel("順位", fontsize=16, labelpad=12)
    axis.set_title("動画順位の推移", fontsize=22, fontweight="bold", pad=18)
    axis.tick_params(axis="both", labelsize=13)
    axis.set_xticks(dates)
    axis.tick_params(axis="x", rotation=35)
    axis.legend(title="videoId", fontsize=11, title_fontsize=12, bbox_to_anchor=(1.02, 1), loc="upper left")
    axis.spines["top"].set_visible(False)
    axis.spines["right"].set_visible(False)
    figure.savefig(output_path, dpi=180, bbox_inches="tight")
    plt.close(figure)


def main():
    parser = argparse.ArgumentParser(description="Google Forms の日次順位推移を描画します")
    parser.add_argument("folder_name", help="Google Drive 上のフォーム格納フォルダ名")
    parser.add_argument(
        "-o",
        "--output",
        default="rank_transition.png",
        type=Path,
        help="出力するPNGファイルのパス（既定: rank_transition.png）",
    )
    args = parser.parse_args()

    load_dotenv()
    credentials_path = os.getenv("GOOGLE_APPLICATION_CREDENTIALS")
    if not credentials_path:
        raise RuntimeError("GOOGLE_APPLICATION_CREDENTIALS が設定されていません")

    drive_service, forms_service = build_services(credentials_path)
    folder_id = find_folder_id(drive_service, args.folder_name)
    forms = fetch_forms(drive_service, folder_id)
    if not forms:
        raise RuntimeError(f"フォルダ内に対象フォームがありません: {args.folder_name}")

    print("処理するフォーム:")
    for form in forms:
        print(f"  Disc.{form['number']}: {form['name']}")

    daily_scores = aggregate_daily_scores(forms_service, forms)
    if not daily_scores:
        raise RuntimeError("投票回答がありません")
    plot_rank_transition(build_daily_ranks(daily_scores), args.output)
    print(f"グラフを出力しました: {args.output}")


if __name__ == "__main__":
    main()