import { fetchRankingSheet } from "@/lib/fetchSheet";
import { CONFIG } from "@/config/config";

let cache: any = null;
let timestamp = 0;
const TTL = 1000 * 60 * 5;

export async function GET() {
  const now = Date.now();

  if (cache && now - timestamp < TTL) {
    return Response.json(cache);
  }

  const data = await fetchRankingSheet(
    CONFIG.rankingsheets.finals.name
  );

  cache = data;
  timestamp = now;

  return Response.json(data);
}