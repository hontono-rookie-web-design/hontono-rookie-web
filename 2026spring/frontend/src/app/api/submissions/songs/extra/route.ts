// app/api/videos/op/route.ts

import { fetchVideosSheet } from "@/lib/fetchSheet";
import { CONFIG } from "@/config/config";

/* =========================
   キャッシュ
========================= */
type Cache = {
  data: any;
  timestamp: number;
};

let cache: Cache | null = null;
const CACHE_TTL = 1000 * 60 * 5; // 5分

/* =========================
   日付パース
========================= */
function parseDate(dateStr?: string) {
  if (!dateStr) return 0;

  const cleaned = dateStr.replace(/^'/, "").trim();

  const match = cleaned.match(
    /^(\d{4})\/(\d{1,2})\/(\d{1,2})\s*(\d{1,2})?:?(\d{2})?/
  );

  if (!match) return 0;

  const [, y, m, d, h = "0", min = "0"] = match;

  return new Date(
    Number(y),
    Number(m) - 1,
    Number(d),
    Number(h),
    Number(min)
  ).getTime();
}

/* =========================
   API
========================= */
export async function GET() {
  try {
    const now = Date.now();

    // ✔ キャッシュが有効なら返す
    if (cache && now - cache.timestamp < CACHE_TTL) {
      return Response.json(cache.data);
    }

    // ✔ Sheets取得
    const items = await fetchVideosSheet(CONFIG.videosheets.ex.name);

    const videos = items
      .filter((item) => item.videoUrl)
      .sort(
        (a, b) => parseDate(b.publishedAt) - parseDate(a.publishedAt)
      );

    // ✔ キャッシュ更新
    cache = {
      data: videos,
      timestamp: now,
    };

    return Response.json(videos);
  } catch {
    return new Response(
      JSON.stringify({ error: "Failed to fetch videos" }),
      { status: 500 }
    );
  }
}