function updateFormResponseCounts() {
  writeCountsUsingDrive();
}

function getConfig() {
  const props = PropertiesService.getScriptProperties();

  const config = {
    FORM_RESPONSE_COUNT_SPREADSHEET_ID: props.getProperty(
      "FORM_RESPONSE_COUNT_SPREADSHEET_ID"
    ),
  };

  if (!config.FORM_RESPONSE_COUNT_SPREADSHEET_ID) {
    throw new Error(
      "Script Property 'FORM_RESPONSE_COUNT_SPREADSHEET_ID' が設定されていません"
    );
  }

  return config;
}

function writeCountsUsingDrive() {
  const config = getConfig();

  // ===== 設定 =====
  const SOURCE_SHEET_NAME = "決勝";
  const GROUP_ID_COLUMN = "グループID";
  const FORM_URL_COLUMN = "人気投票FormURL";
  const TARGET_SHEET_NAME = SOURCE_SHEET_NAME;

  const startTime = new Date();

  // ===== 元データ取得 =====
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(SOURCE_SHEET_NAME);
  const data = sheet.getDataRange().getValues();

  const headers = data[0];
  const groupIndex = headers.indexOf(GROUP_ID_COLUMN);
  const urlIndex = headers.indexOf(FORM_URL_COLUMN);

  if (groupIndex === -1 || urlIndex === -1) {
    throw new Error("カラム名が見つかりません");
  }

  // ===== Driveからフォームマップ作成 =====
  Logger.log("フォーム一覧取得開始...");
  const formMap = buildFormMapFromDrive();
  Logger.log(`フォーム数: ${Object.keys(formMap).length}`);

  // ===== 集計 =====
  const results = [];
  const total = data.length - 1;

  for (let i = 1; i < data.length; i++) {
    const groupId = data[i][groupIndex];
    const url = data[i][urlIndex];

    if (!url) {
      continue;
    }

    try {
      const publicId = extractPublicId(url);
      const file = formMap[publicId];

      if (!file) {
        throw new Error("Drive上に該当フォームなし");
      }

      const form = FormApp.openById(file.getId());
      const count = form.getResponses().length;

      results.push([groupId, count, startTime]);
    } catch (e) {
      Logger.log(`ERROR at ${groupId}: ${e.message}`);
      results.push([groupId, "ERROR", startTime]);
    }

    // ===== 進捗表示 =====
    if (i % 5 === 0 || i === total) {
      Logger.log(`進捗: ${i}/${total} (${Math.floor((i / total) * 100)}%)`);
    }
  }

  // ===== 書き込み =====
  const targetSS = SpreadsheetApp.openById(
    config.FORM_RESPONSE_COUNT_SPREADSHEET_ID
  );

  let targetSheet = targetSS.getSheetByName(TARGET_SHEET_NAME);

  if (!targetSheet) {
    targetSheet = targetSS.insertSheet(TARGET_SHEET_NAME);
  }

  targetSheet.clear();
  targetSheet.appendRow(["グループID", "回答数", "取得日時"]);

  if (results.length > 0) {
    targetSheet.getRange(2, 1, results.length, 3).setValues(results);
  }

  Logger.log("完了");
}

function buildFormMapFromDrive() {
  const files = DriveApp.getFilesByType(MimeType.GOOGLE_FORMS);
  const map = {};

  while (files.hasNext()) {
    const file = files.next();

    try {
      const form = FormApp.openById(file.getId());
      const url = form.getPublishedUrl();
      const publicId = extractPublicId(url);

      map[publicId] = file;
    } catch (e) {
      // 権限がないフォームはスキップ
      continue;
    }
  }

  return map;
}

function extractPublicId(url) {
  const match = url.match(/\/d\/e\/([a-zA-Z0-9_-]+)/);

  if (match) {
    return match[1];
  }

  throw new Error(`公開ID取得失敗: ${url}`);
}