import { fetchFanficSheet } from "@/lib/fetchSheet";
import { CONFIG } from "@/config/config";

type Cache = {
  data: any;
  timestamp: number;
};

let cache: Cache | null = null;
const CACHE_TTL = 1000 * 60 * 5; // 5分

export async function GET() {
  const now = Date.now();

  // キャッシュが有効なら即返す
  if (cache && now - cache.timestamp < CACHE_TTL) {
    return Response.json(cache.data);
  }

  // 重い処理（Sheets取得）
  const items = await fetchFanficSheet(
    CONFIG.fanficsheets.others.name
  );

  const result = items.reverse();

  // キャッシュ更新
  cache = {
    data: result,
    timestamp: now,
  };

  return Response.json(result);
}