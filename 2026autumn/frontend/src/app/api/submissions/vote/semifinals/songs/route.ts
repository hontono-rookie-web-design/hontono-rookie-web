// app/api/videos/op/route.ts

import { fetchGroupedVideosSheet } from "@/lib/fetchSheet";
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
   description 最大文字数
========================= */
const DESCRIPTION_MAX_LENGTH = 180; // 概要欄取得文字数

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
   description整形
========================= */
function trimDescription(text?: string) {
  if (!text) return "";

  const cleaned = text
    .replace(/<br\s*\/?>/gi, " ")
    .replace(/\n/g, " ")
    .trim();

  if (cleaned.length <= DESCRIPTION_MAX_LENGTH) {
    return cleaned;
  }

  // 少し手前で切る（単語途中防止のゆる対策）
  const slicePoint = DESCRIPTION_MAX_LENGTH - 10;
  const truncated = cleaned.slice(0, slicePoint);

  // 最後のスペース位置まで戻す（英語対策）
  const lastSpace = truncated.lastIndexOf(" ");

  const safeText =
    lastSpace > slicePoint - 20
      ? truncated.slice(0, lastSpace)
      : truncated;

  return safeText + "…";
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
    const items = await fetchGroupedVideosSheet(
      CONFIG.groupedvideosheets_semifinal.spreadsheetId, 
      CONFIG.groupedvideosheets_semifinal.rookie.name,
    );

    const videos = items
      .filter((item) => item.videoUrl)
      .sort(
        (a, b) => parseDate(b.publishedAt) - parseDate(a.publishedAt)
      )
      .map((v) => ({
        title: v.title,
        creator: v.creator,
        videoUrl: v.videoUrl,
        thumbnailUrl: v.thumbnailUrl,
        publishedAt: v.publishedAt,
        group: Number(v.group || 0),
        description: trimDescription(v.description),
      }));

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