import { CONFIG } from "@/config/config";

export async function GET() {
  const { id, name } = CONFIG.sheets.illustrations;

  const res = await fetch(
    `https://opensheet.elk.sh/${id}/${name}`
  );

  const data = await res.json();

  const illustrations = data.map((row: any) => ({
    creator: row["二次創作者活動名"] ?? "",
    service: row["投稿先サービス"] ?? "",
    workUrl: row["二次創作作品URL"] ?? "",
    title: row["タイトル"] ?? "",
    imageUrl: row["画像URL"] ?? "",
    originalUrl: row["元作品URL"] ?? "",
    originalTitle: row["元作品タイトル"] ?? "",
    originalAuthor: row["元作品投稿者名"] ?? "",
  }));

  const reversed = illustrations.reverse();

  return new Response(JSON.stringify(reversed), {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
  });
}