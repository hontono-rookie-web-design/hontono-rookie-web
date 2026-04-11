import { CONFIG } from "@/config/config";

export type SheetItem = {
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

export async function fetchSheet(sheetName: string): Promise<SheetItem[]> {
  const url = `https://opensheet.elk.sh/${CONFIG.sheets.spreadsheetId}/${sheetName}`;

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