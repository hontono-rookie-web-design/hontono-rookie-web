import os

from google.oauth2.service_account import Credentials
from googleapiclient import discovery

SCOPES = [
    "https://www.googleapis.com/auth/forms.body",
    "https://www.googleapis.com/auth/forms.responses.readonly",
    "https://www.googleapis.com/auth/drive",
]
DISCOVERY_DOC = "https://forms.googleapis.com/$discovery/rest?version=v1"
credentials_path = os.environ["GOOGLE_APPLICATION_CREDENTIALS"]

creds = Credentials.from_service_account_file(credentials_path, scopes=SCOPES)

form_service = discovery.build(
    "forms",
    "v1",
    credentials=creds,
    discoveryServiceUrl=DISCOVERY_DOC,
    static_discovery=False,
)

# Request body for creating a form
NEW_FORM = {
    "info": {
        "title": "Quickstart form",
    }
}

# Request body to add a multiple-choice question
NEW_QUESTION = {
    "requests": [
        {
            "createItem": {
                "item": {
                    "title": (
                        "In what year did the United States land a mission on"
                        " the moon?"
                    ),
                    "questionItem": {
                        "question": {
                            "required": True,
                            "choiceQuestion": {
                                "type": "RADIO",
                                "options": [
                                    {"value": "1965"},
                                    {"value": "1967"},
                                    {"value": "1969"},
                                    {"value": "1971"},
                                ],
                                "shuffle": True,
                            },
                        }
                    },
                },
                "location": {"index": 0},
            }
        }
    ]
}

# Creates the initial form
print(f"Creating form with doc: {DISCOVERY_DOC}")
result = form_service.forms().create(body=NEW_FORM).execute()

# form_id = '{form_id}'
# result = form_service.forms().responses().list(formId=form_id).execute()
print(result)


# # Adds the question to the form
# question_setting = (
#     form_service.forms()
#     .batchUpdate(formId=result["formId"], body=NEW_QUESTION)
#     .execute()
# )

# # Prints the result to show the question has been added
# get_result = form_service.forms().get(formId=result["formId"]).execute()
# print(get_result)