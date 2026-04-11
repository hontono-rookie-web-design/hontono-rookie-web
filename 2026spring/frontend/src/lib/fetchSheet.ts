import { CONFIG } from "@/config/config";

export type FanficSheetItem = {
  creator: string;
  service: string;
  workUrl: string;
  title: string;
  imageUrl: string;
  originalUrl: string;
  originalTitle: string;
  originalAuthor: string;
  publishedAt: string;
};

export async function fetchFanficSheet(sheetName: string): Promise<FanficSheetItem[]> {
  const url = `https://opensheet.elk.sh/${CONFIG.fanficsheets.spreadsheetId}/${sheetName}`;

  const res = await fetch(url);
  const data = await res.json();

  return data.map((row: any) => ({
    creator: row["二次創作者活動名"] ?? "",
    service: row["投稿先サービス"] ?? "",
    workUrl: row["二次創作作品URL"] ?? "",
    title: row["タイトル"] ?? "",
    imageUrl: row["画像URL"] ?? "",
    originalUrl: row["元作品URL"] ?? "",
    originalTitle: row["元作品タイトル"] ?? "",
    originalAuthor: row["元作品投稿者名"] ?? "",
    publishedAt: row["配信日時"] ?? "",
  }));
}

export type NoteSheetItem = {
  title: string;
  author: string;
  publishedAt: string;
  noteUrl: string;
  userUrl: string;
  eyecatchUrl: string;
  userProfileImageUrl: string;
};

export async function fetchNoteSheet(
  sheetName: string
): Promise<NoteSheetItem[]> {
  const url = `https://opensheet.elk.sh/${CONFIG.notesheets.spreadsheetId}/${sheetName}`;

  const res = await fetch(url, {
    next: { revalidate: 60 }, // ISR（キャッシュ）
  });

  const data = await res.json();

  return data.map((row: any) => ({
    title: row["Title"] ?? "",
    author: row["Author"] ?? "",
    publishedAt: row["Published Date"] ?? "",
    noteUrl: row["note_url"] ?? "",
    userUrl: row["user_url"] ?? "",
    eyecatchUrl: row["eyecatch_url"] ?? "",
    userProfileImageUrl: row["user_profile_img_url"] ?? "",
  }));
}