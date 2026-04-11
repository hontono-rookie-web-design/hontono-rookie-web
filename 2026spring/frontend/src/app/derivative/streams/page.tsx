"use client";

import { useEffect, useState } from "react";
import { CONFIG } from "@/config/config";

type Item = {
  creator: string;
  service: string;
  workUrl: string;
  title: string;
  imageUrl: string;
  publishedAt: string;
};

/* =========================
   Skeleton（枠付き）
========================= */
function SkeletonTile() {
  return (
    <div className="w-full flex flex-col border border-gray-200 rounded-xl overflow-hidden">
      {/* サムネ */}
      <div className="relative w-full aspect-video bg-gray-200 animate-pulse" />

      {/* テキスト */}
      <div className="p-2 space-y-2">
        <div className="h-3 w-32 bg-gray-200 rounded animate-pulse" />

        <div className="space-y-1">
          <div className="h-4 w-full bg-gray-200 rounded animate-pulse" />
          <div className="h-4 w-5/6 bg-gray-200 rounded animate-pulse" />
        </div>

        <div className="h-3 w-1/2 bg-gray-200 rounded animate-pulse" />
      </div>
    </div>
  );
}

/* =========================
   日付パース
========================= */
function parseDate(dt?: string) {
  if (!dt) return null;

  const cleaned = dt.replace(/^'/, "").trim();

  const match = cleaned.match(
    /^(\d{4})\/(\d{1,2})\/(\d{1,2})\s+(\d{1,2}):(\d{2})/
  );

  if (!match) return null;

  const [, y, m, d, h, min] = match;

  const date = new Date(
    Number(y),
    Number(m) - 1,
    Number(d),
    Number(h),
    Number(min)
  );

  const weekday = ["日", "月", "火", "水", "木", "金", "土"][date.getDay()];

  return {
    raw: date,
    label: `${y}/${String(m).padStart(2, "0")}/${String(d).padStart(
      2,
      "0"
    )}（${weekday}）${String(h).padStart(2, "0")}:${min}`,
  };
}

/* =========================
   ラベル
========================= */
function getDayLabel(date?: Date) {
  if (!date) return null;

  const now = new Date();

  const t = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const n = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  const diff = Math.floor(
    (t.getTime() - n.getTime()) / (1000 * 60 * 60 * 24)
  );

  if (diff === 0) return "今日";
  if (diff === 1) return "明日";
  return null;
}

function isFuture(date?: Date) {
  if (!date) return false;
  return date.getTime() > Date.now();
}

/* =========================
   Page
========================= */
export default function Page() {
  const [data, setData] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/derivative/streams")
      .then((res) => res.json())
      .then((res) => {
        setData(res);
        setLoading(false);
      });
  }, []);

  return (
    <div className="p-6 w-full max-w-6xl mx-auto">
      {/* ヘッダー */}
      <div className="text-center mb-10">
        <h1 className="text-3xl md:text-4xl font-bold">
          紹介配信
        </h1>

        <p className="text-sm text-gray-600 mt-2">
          「{CONFIG.event.name}」の紹介配信を掲載しています。
        </p>

        <div className="mt-4 border-b border-gray-200 max-w-xl mx-auto" />
      </div>

      {/* LOADING */}
      {loading && (
        <div className="w-full">
          <div className="grid w-full grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <SkeletonTile key={i} />
            ))}
          </div>
        </div>
      )}

      {/* EMPTY */}
      {!loading && data.length === 0 && (
        <div className="text-center py-20 text-gray-600">
          紹介配信はまだありません。
        </div>
      )}

      {/* GRID */}
      {!loading && data.length > 0 && (
        <div className="grid w-full grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {data.map((item, i) => {
            const img =
              item.imageUrl?.trim()
                ? item.imageUrl
                : CONFIG.images.defaultIllustration;

            const parsed = parseDate(item.publishedAt);
            const dayLabel = getDayLabel(parsed?.raw);
            const future = isFuture(parsed?.raw);

            return (
              <div
                key={i}
                className="flex flex-col group border border-gray-200 rounded-xl overflow-hidden transition hover:shadow-md"
              >
                <a
                  href={item.workUrl}
                  target="_blank"
                  className="flex flex-col"
                >
                  {/* サムネ */}
                  <div className="relative aspect-video overflow-hidden">
                    <img
                      src={img}
                      className="w-full h-full object-cover group-hover:scale-105 transition"
                    />

                    {/* 予定 */}
                    {future && (
                      <span className="absolute top-2 left-2 bg-black/80 text-white text-xs px-2 py-1 rounded">
                        予定
                      </span>
                    )}
                  </div>

                  {/* テキスト */}
                  <div className="flex flex-col mt-2 px-2 pb-2">
                    <div className="text-xs text-gray-700 font-medium min-h-[1.2rem]">
                      {parsed && (
                        <>
                          {dayLabel && (
                            <span className="mr-1 text-blue-600 font-semibold">
                              {dayLabel}
                            </span>
                          )}
                          {parsed.label}
                        </>
                      )}
                    </div>

                    <h2 className="mt-1 text-sm font-bold leading-snug line-clamp-2 min-h-[2.8rem] group-hover:underline">
                      {item.title}
                    </h2>

                    <p className="text-xs text-gray-600 mt-1 truncate min-h-[1rem]">
                      {item.creator}
                    </p>
                  </div>
                </a>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}