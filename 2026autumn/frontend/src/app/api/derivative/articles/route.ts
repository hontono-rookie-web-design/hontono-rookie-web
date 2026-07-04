import { fetchNoteSheet } from "@/lib/fetchSheet";
import { CONFIG } from "@/config/config";

/* =========================
   日付パース
========================= */
function parseDate(dateStr?: string) {
  if (!dateStr) return 0;

  const cleaned = dateStr.replace(/^'/, "").trim();

  const match = cleaned.match(
    /^(\d{4})\/(\d{1,2})\/(\d{1,2})\s*(\d{1,2})?:?(\d{2})?:?(\d{2})?/
  );

  if (!match) return 0;

  const [, y, m, d, h = "0", min = "0", s = "0"] = match;

  return new Date(
    Number(y),
    Number(m) - 1,
    Number(d),
    Number(h),
    Number(min),
    Number(s)
  ).getTime();
}

export async function GET() {
  try {
    const items = await fetchNoteSheet(CONFIG.notesheets.name);

    const notes = items
      // 空データ除外（任意）
      .filter((item) => item.noteUrl)
      // ソート（新しい順）
      .sort(
        (a, b) => parseDate(b.publishedAt) - parseDate(a.publishedAt)
      )
      // 整形
      .map((item) => ({
        title: item.title,
        author: item.author,
        noteUrl: item.noteUrl,
        userUrl: item.userUrl,
        eyecatchUrl: item.eyecatchUrl,
        userProfileImageUrl: item.userProfileImageUrl,
        publishedAt: item.publishedAt.replace(/^'/, ""),
      }));

    return new Response(JSON.stringify(notes), {
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
      },
    });
  } catch (e) {
    return new Response(
      JSON.stringify({ error: "Failed to fetch notes" }),
      { status: 500 }
    );
  }
}