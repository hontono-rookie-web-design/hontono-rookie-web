from __future__ import annotations

from collections import Counter
from typing import Any

from google.oauth2.service_account import Credentials
from googleapiclient import discovery

# Google Forms の読み取りに必要なAPIスコープ
SCOPES = [
    "https://www.googleapis.com/auth/forms.responses.readonly",
    "https://www.googleapis.com/auth/forms.body.readonly",
]


def build_credentials(credentials_path: str, scopes: list[str] | None = None) -> Credentials:
    """
    サービスアカウントの認証情報を生成する。
    """
    return Credentials.from_service_account_file(credentials_path, scopes=scopes or SCOPES)


def build_forms_service(credentials: Credentials):
    """
    Forms API クライアントを生成する。
    """
    return discovery.build("forms", "v1", credentials=credentials)


def get_form(forms_service, form_id: str) -> dict[str, Any]:
    """
    フォーム本体情報を取得する。
    """
    return forms_service.forms().get(formId=form_id).execute()


def get_questions(form_info: dict[str, Any]) -> list[dict[str, str]]:
    """
    フォームの設問一覧を取得する。

    Returns:
        [
            {
                "question_id": "...",
                "title": "...",
                "item_id": "...",
                "type": "textQuestion",
            },
            ...
        ]
    """
    questions: list[dict[str, str]] = []

    for item in form_info.get("items", []):
        question_item = item.get("questionItem", {})
        question = question_item.get("question")

        if not question:
            continue

        question_type = _detect_question_type(question)
        questions.append(
            {
                "question_id": question.get("questionId", ""),
                "title": item.get("title", ""),
                "item_id": item.get("itemId", ""),
                "type": question_type,
            }
        )

    return questions


def list_responses(forms_service, form_id: str, page_size: int = 500) -> list[dict[str, Any]]:
    """
    フォーム回答を全件取得する（ページネーション対応）。
    """
    responses: list[dict[str, Any]] = []
    page_token = None

    while True:
        result = (
            forms_service.forms()
            .responses()
            .list(formId=form_id, pageSize=page_size, pageToken=page_token)
            .execute()
        )
        responses.extend(result.get("responses", []))

        page_token = result.get("nextPageToken")
        if not page_token:
            break

    return responses


def build_question_headers(questions: list[dict[str, str]]) -> list[str]:
    """
    回答整形で利用するユニークな設問ヘッダーを作成する。
    同名設問がある場合は question_id を末尾に付与する。
    """
    titles = [q.get("title", "") for q in questions]
    duplicate_titles = {title for title, count in Counter(titles).items() if title and count > 1}

    headers: list[str] = []
    for question in questions:
        title = question.get("title", "")
        question_id = question.get("question_id", "")

        if title in duplicate_titles:
            headers.append(f"{title} ({question_id})")
        else:
            headers.append(title or question_id)

    return headers


def build_response_record(
    response: dict[str, Any],
    questions: list[dict[str, str]],
    *,
    include_meta: bool = True,
    include_email: bool = False,
    answer_delimiter: str = ", ",
) -> dict[str, str]:
    """
    1件のフォーム回答を list[dict] で扱いやすい形に整形する。
    """
    question_headers = build_question_headers(questions)
    record: dict[str, str] = {}

    if include_meta:
        record["responseId"] = response.get("responseId", "")
        record["createTime"] = response.get("createTime", "")
        record["lastSubmittedTime"] = response.get("lastSubmittedTime", "")

    if include_email:
        respondent_email = response.get("respondentEmail", "")
        record["respondentEmail"] = respondent_email
    
    answer_map = response.get("answers", {})
    for header, question in zip(question_headers, questions):
        question_id = question.get("question_id", "")
        answer = answer_map.get(question_id, {})
        values = parse_answer_values(answer)
        record[header] = answer_delimiter.join(values)

    return record


def build_response_records(
    responses: list[dict[str, Any]],
    questions: list[dict[str, str]],
    *,
    include_meta: bool = True,
    include_email: bool = False,
    answer_delimiter: str = ", ",
) -> list[dict[str, str]]:
    """
    複数件のフォーム回答を list[dict] へ整形する。
    """
    return [
        build_response_record(
            response,
            questions,
            include_meta=include_meta,
            include_email=include_email,
            answer_delimiter=answer_delimiter,
        )
        for response in responses
    ]


def parse_answer_values(answer: dict[str, Any]) -> list[str]:
    """
    Google Forms API の回答形式を文字列リストへ変換する。
    """
    if not answer:
        return []

    text_answers = answer.get("textAnswers", {}).get("answers", [])
    if text_answers:
        return [a.get("value", "") for a in text_answers if a.get("value") is not None]

    file_upload_answers = answer.get("fileUploadAnswers", {}).get("answers", [])
    if file_upload_answers:
        return [a.get("fileId", "") for a in file_upload_answers if a.get("fileId")]

    return []


def _detect_question_type(question: dict[str, Any]) -> str:
    for key in (
        "choiceQuestion",
        "textQuestion",
        "scaleQuestion",
        "dateQuestion",
        "timeQuestion",
        "fileUploadQuestion",
        "rowQuestion",
        "ratingQuestion",
    ):
        if key in question:
            return key

    return "unknown"

