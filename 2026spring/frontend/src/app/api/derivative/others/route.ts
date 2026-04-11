import { fetchFanficSheet } from "@/lib/fetchSheet";
import { CONFIG } from "@/config/config";

export async function GET() {
  const items = await fetchFanficSheet(CONFIG.fanficsheets.others.name);

  // 新着順
  return Response.json(items.reverse());
}