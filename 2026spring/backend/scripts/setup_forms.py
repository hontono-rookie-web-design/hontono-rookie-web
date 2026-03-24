import os

from apiclient import discovery
from google.oauth2 import service_account

SCOPES = SCOPES = [
    "https://www.googleapis.com/auth/forms.body",
    "https://www.googleapis.com/auth/forms.responses.readonly",
    "https://www.googleapis.com/auth/drive",
]
credentials_path = os.environ["GOOGLE_APPLICATION_CREDENTIALS"]
DISCOVERY_DOC = "https://forms.googleapis.com/$discovery/rest?version=v1"

creds = service_account.Credentials.from_service_account_file(
        credentials_path, scopes=SCOPES)
service = discovery.build('forms', 'v1', credentials=creds, discoveryServiceUrl=DISCOVERY_DOC, static_discovery=False)

form_id = os.environ["FORM_ID"]
# result = service.forms().responses().list(formId=form_id).execute()
result = service.forms().get(formId=form_id).execute()
print(result)