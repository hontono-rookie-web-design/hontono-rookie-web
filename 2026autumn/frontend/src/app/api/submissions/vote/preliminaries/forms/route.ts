import { fetchVotesSheet } from "@/lib/fetchSheet";
import { CONFIG } from "@/config/config";

type Cache = {
  data: any;
  timestamp: number;
};

let cache: Cache | null = null;
const CACHE_TTL = 1000 * 60 * 5; // 5分

export async function GET() {
  const now = Date.now();

  // キャッシュ有効
  if (cache && now - cache.timestamp < CACHE_TTL) {
    return Response.json(cache.data);
  }

  // データ取得
  const data = await fetchVotesSheet(
    CONFIG.voteformssheets.preliminaries.name
  );

  // キャッシュ更新
  cache = {
    data,
    timestamp: now,
  };

  return Response.json(data);
}