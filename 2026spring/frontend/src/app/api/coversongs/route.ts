import { fetchSheet } from "@/lib/fetchSheet";
import { CONFIG } from "@/config/config";

export async function GET() {
  const items = await fetchSheet(CONFIG.sheets.coversongs.name);

  // 新着順
  return Response.json(items.reverse());
}