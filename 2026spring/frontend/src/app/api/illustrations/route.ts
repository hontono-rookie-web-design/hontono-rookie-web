export async function GET() {
  const res = await fetch(
    "https://opensheet.elk.sh/17Qc7vH5BuCfiurEad6uekzMjsMl_MmGIP9i9AEMhcf8/イラスト"
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

  return new Response(JSON.stringify(illustrations), {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
  });
}