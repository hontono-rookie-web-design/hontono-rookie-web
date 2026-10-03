"""Google Forms の投票結果から日次の順位推移グラフを作成する。"""

import argparse
import os
import re
import textwrap
from collections import defaultdict
from datetime import date, datetime, timedelta
from pathlib import Path

import matplotlib.pyplot as plt
import matplotlib_fontja
from matplotlib.ticker import MaxNLocator
from dotenv import load_dotenv
from google.oauth2.service_account import Credentials
from googleapiclient import discovery

from zoneinfo import ZoneInfo

JST = ZoneInfo("Asia/Tokyo")

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

def fetch_forms(drive_service, folder_id: str) -> list[dict]:
    """Google Formを取得"""
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
    """「〇位」の文字列から順位を整数で返す"""
    match = RANK_PATTERN.search(str(value or ""))
    return int(match.group()) if match else None

def extract_video_id(row_title: str) -> str:
    """「曲名_ID」のテンプレからIDのみを返す"""
    video_id = row_title.rsplit("_", 1)[-1].strip()
    if not video_id:
        raise ValueError(f"videoId を取得できない行タイトルです: {row_title}")
    return video_id

def extract_video_title(row_title: str) -> str:
    """「曲名_ID」のテンプレから曲名のみを返す"""
    video_title = row_title.rsplit("_", 1)[0].strip()
    if not video_title:
        raise ValueError(f"曲名を取得できない行タイトルです: {row_title}")
    return video_title

def fetch_form_votes(
    forms_service, form_id: str
) -> tuple[dict[str, str], dict[str, str], list[dict]]:
    """各フォームの回答を取得"""
    form = forms_service.forms().get(formId=form_id).execute()
    row_question_ids = {}
    video_titles = {}
    row_count = 0

    for item in form.get("items", []):
        for question in item.get("questionGroupItem", {}).get("questions", []):
            row_question = question.get("rowQuestion", {})
            question_id = question.get("questionId")
            row_title = row_question.get("title")
            if question_id and row_title:
                video_id = extract_video_id(row_title)
                row_question_ids[question_id] = video_id
                video_titles[video_id] = extract_video_title(row_title)
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

    return row_question_ids, video_titles, [
        {"row_count": row_count, **vote} for vote in responses
    ]

def aggregate_daily_scores(
    forms_service, form: dict
) -> tuple[dict[str, dict[str, int]], dict[str, str]]:
    """各動画の日付ごとのスコアを集計する（票のない日の穴埋め・累計はbuild_cumulative_scoresで行う）"""
    daily_scores = defaultdict(lambda: defaultdict(int))

    row_question_ids, video_titles, responses = fetch_form_votes(forms_service, form["id"])
    for response in responses:
        submitted_at = datetime.fromisoformat(
            response["createTime"].replace("Z", "+00:00")
        ).astimezone(JST) #JSTに対応
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

    return {date: dict(scores) for date, scores in daily_scores.items()}, video_titles


def build_cumulative_scores(
    daily_scores: dict[str, dict[str, int]], first_date: date, last_date: date
) -> dict[str, dict[str, int]]:
    """指定した日付範囲（全フォーム共通）で、票のない日も含めて累計スコアを求める"""
    cumulative_scores = {}
    running_scores = defaultdict(int)
    for offset in range((last_date - first_date).days + 1):
        current_date = (first_date + timedelta(days=offset)).isoformat()
        for video_id, score in daily_scores.get(current_date, {}).items():
            running_scores[video_id] += score
        cumulative_scores[current_date] = dict(running_scores)  # その日時点のスナップショット

    return cumulative_scores


def build_daily_ranks(daily_scores: dict[str, dict[str, int]]) -> dict[str, dict[str, int]]:
    """当日までの累計獲得スコアを降順に並べ、順位を付与する"""
    daily_ranks = {}
    for date, scores in daily_scores.items():
        ordered = sorted(scores.items(), key=lambda item: -item[1])
        ranks = {}
        previous_score = None
        previous_rank = 0
        for position, (video_id, score) in enumerate(ordered, start=1):
            if score != previous_score:
                previous_rank = position
                previous_score = score
            ranks[video_id] = previous_rank
        daily_ranks[date] = ranks
    return daily_ranks

def filter_public_ranks(
    daily_ranks: dict[str, dict[str, int]], top_n: None
) -> dict[str, dict[str, int]]:
    """最終順位が公開対象（上位top_n位以内）の動画のみに絞り込む"""
    if not daily_ranks:
        return daily_ranks

    last_date = max(daily_ranks)
    public_video_ids = {
        video_id for video_id, rank in daily_ranks[last_date].items() if rank <= top_n
    }
    return {
        date: {
            video_id: rank
            for video_id, rank in ranks.items()
            if video_id in public_video_ids
        }
        for date, ranks in daily_ranks.items()
    }

def plot_rank_transition(
    daily_ranks: dict[str, dict[str, int]],
    form_name: str,
    output_path: Path,
    total_video_count: int | None = None,
    video_titles: dict[str, str] | None = None,
):
    """順位推移のグラフを描画し保存"""
    dates = sorted(daily_ranks)
    video_ids = sorted({video_id for ranks in daily_ranks.values() for video_id in ranks})
    # 縦軸の範囲は絞り込み前の全動画数で統一する（未指定時は表示対象の動画数をそのまま使う）
    y_max = total_video_count if total_video_count is not None else len(video_ids)
    colors = plt.get_cmap("viridis")(  # 白地で見づらい黄色域(0.85超)を避けて0〜0.75の範囲でサンプリング
        [0.75 * index / max(len(video_ids) - 1, 1) for index in range(len(video_ids))]
    )

    plt.style.use("seaborn-v0_8-whitegrid")
    matplotlib_fontja.japanize()  # style.use でリセットされる日本語フォント設定を再適用
    figure, axis = plt.subplots(figsize=(14, 9), constrained_layout=True)
    final_positions = {}  # video_id -> (最終有効値のx位置インデックス, 順位)
    for color, video_id in zip(colors, video_ids):
        ranks = [daily_ranks[date].get(video_id) for date in dates]
        axis.plot(
            dates,
            ranks,
            marker="o",
            linewidth=2.8,
            markersize=8,
            color=color,
        )
        for index in range(len(ranks) - 1, -1, -1):
            if ranks[index] is not None:
                final_positions[video_id] = (index, ranks[index])
                break

    # 同着（最終順位が同じ）の動画同士はラベルが重なるので縦にずらして配置する
    same_rank_groups = defaultdict(list)
    for video_id, (_, rank) in final_positions.items():
        same_rank_groups[rank].append(video_id)
    label_y_offsets = {}
    line_spacing = 16  # ラベル間の縦方向の間隔（ポイント単位）
    for ids in same_rank_groups.values():
        ids.sort()
        count = len(ids)
        for position, video_id in enumerate(ids):
            label_y_offsets[video_id] = (position - (count - 1) / 2) * line_spacing

    # 凡例枠の代わりに、最終日のプロットの右側に曲名ラベルを直接添える
    for color, video_id in zip(colors, video_ids):
        if video_id not in final_positions:
            continue
        index, rank = final_positions[video_id]
        label_text = (video_titles or {}).get(video_id, video_id)
        wrapped_label = textwrap.fill(label_text, width=15)  # 曲名が長い場合に折り返して横に伸びすぎないようにする
        axis.annotate(
            wrapped_label,
            xy=(dates[index], rank),
            xytext=(10, label_y_offsets[video_id]),
            textcoords="offset points",
            va="center",
            fontsize=11,
            color=color,
        )

    axis.set_ylim(y_max + 0.5, 0.5)  # 1位を上端、動画数分を下端に固定（絞り込み時も範囲を変えない）
    axis.yaxis.set_major_locator(MaxNLocator(integer=True))  # 順位は整数のみ目盛りに表示
    axis.set_xlabel("投票日", fontsize=16, labelpad=12)
    axis.set_ylabel("順位", fontsize=16, labelpad=12)
    axis.set_title(form_name, fontsize=22, fontweight="bold", pad=18)
    axis.tick_params(axis="both", labelsize=13)
    axis.set_xticks(dates)
    axis.tick_params(axis="x", rotation=35)
    axis.spines["top"].set_visible(False)
    axis.spines["right"].set_visible(False)
    figure.savefig(output_path, dpi=180, bbox_inches="tight")
    plt.close(figure)


def main():
    parser = argparse.ArgumentParser(
        description="Google Drive フォルダ内の各Google Formの日次順位推移を描画します"
    )
    parser.add_argument(
        "--limit",
        type=int,
        default=None,
        help="処理するフォーム数の上限。未指定時はすべて処理します",
    )
    parser.add_argument(
        "-o",
        "--output",
        default=Path("images/prelim_rank_transition"),
        type=Path,
        help="フォームごとのPNGを出力するディレクトリ（既定: images/prelim_rank_transition）",
    )
    parser.add_argument(
        "--rank",
        type=int,
        help="最終順位が指定した順位以内の動画のみをグラフに表示します",
    )
    args = parser.parse_args()

    load_dotenv()
    credentials_path = os.getenv("GOOGLE_APPLICATION_CREDENTIALS")
    if not credentials_path:
        raise RuntimeError("GOOGLE_APPLICATION_CREDENTIALS が設定されていません")
    folder_id = os.getenv("PRELIM_FORMS_FOLDER_ID")
    if not folder_id:
        raise RuntimeError("PRELIM_FORMS_FOLDER_ID が設定されていません")
    if args.limit is not None and args.limit < 1:
        raise ValueError("--limit は1以上を指定してください")
    if args.rank is not None and args.rank < 1:
        raise ValueError("--rank は1以上を指定してください")

    drive_service, forms_service = build_services(credentials_path)
    forms = fetch_forms(drive_service, folder_id)
    if not forms:
        raise RuntimeError(f"フォルダ内に対象フォームがありません: {folder_id}")
    if args.limit is not None:
        forms = forms[: args.limit]
    args.output.mkdir(parents=True, exist_ok=True)

    print("横軸範囲を取得中...")

    # 1周目: 全フォームの日時スコアを集計しつつ、横軸範囲を揃えるため全フォーム共通の最小・最大投票日を求める
    forms_data = []
    global_first_date = None
    global_last_date = None
    for form in forms:
        daily_scores, video_titles = aggregate_daily_scores(forms_service, form)
        if daily_scores:
            form_first_date = date.fromisoformat(min(daily_scores))
            form_last_date = date.fromisoformat(max(daily_scores))
            global_first_date = (
                form_first_date
                if global_first_date is None
                else min(global_first_date, form_first_date)
            )
            global_last_date = (
                form_last_date
                if global_last_date is None
                else max(global_last_date, form_last_date)
            )
        forms_data.append((form, daily_scores, video_titles))

    print(f"全フォーム共通の横軸範囲: {global_first_date} 〜 {global_last_date}")

    # 2周目: 共通の日付範囲で累計スコアを求め、順位の遷移集計・グラフ化
    print("処理するフォーム:")
    for form, daily_scores, video_titles in forms_data:
        print(f"  Disc.{form['number']}: {form['name']}")
        if not daily_scores:
            print("  投票回答がないためスキップします")
            continue

        cumulative_scores = build_cumulative_scores(
            daily_scores, global_first_date, global_last_date
        )

        # 出力ファイルパス
        output_path = args.output / f"Disc.{form['number']}_{form['name']}.png"

        daily_ranks = build_daily_ranks(cumulative_scores)
        total_video_count = len(
            {video_id for ranks in daily_ranks.values() for video_id in ranks}
        )
        if args.rank:
            daily_ranks = filter_public_ranks(daily_ranks,args.rank)
        plot_rank_transition(
            daily_ranks,
            form["name"],
            output_path,
            total_video_count=total_video_count,
            video_titles=video_titles,
        )
        print(f"  グラフを出力しました: {output_path}")


if __name__ == "__main__":
    main()