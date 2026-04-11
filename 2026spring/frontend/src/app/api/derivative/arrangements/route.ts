import { fetchFanficSheet } from "@/lib/fetchSheet";
import { CONFIG } from "@/config/config";

export async function GET() {
  const items = await fetchFanficSheet(CONFIG.fanficsheets.arrangements.name);

  // 新着順
  return Response.json(items.reverse());
}