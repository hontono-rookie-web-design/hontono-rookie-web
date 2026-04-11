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
   Skeleton Card
========================= */
function SkeletonCard() {
  return (
    <div className="w-[760px] max-w-full rounded-xl bg-white p-4 shadow-sm">
      <div className="flex gap-4 w-full">
        <div className="w-44 h-28 bg-gray-200 rounded-lg animate-pulse" />

        <div className="flex flex-col justify-between flex-1 min-w-0 gap-3">
          <div className="space-y-2">
            <div className="h-5 bg-gray-200 rounded w-3/4 animate-pulse" />
            <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse" />
          </div>

          <div className="space-y-2">
            <div className="h-6 bg-gray-200 rounded w-40 animate-pulse" />
            <div className="h-5 bg-gray-200 rounded w-24 animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
}

/* =========================
   STRICT Date Parser（完全安定）
========================= */
function parseSafeDate(dt?: string) {
  if (!dt) return null;

  // ① Google Sheetsの ' を除去
  const cleaned = dt.replace(/^'/, "").trim();

  // ② 完全に構造化パース（ここが重要）
  const match = cleaned.match(
    /^(\d{4})\/(\d{1,2})\/(\d{1,2})\s+(\d{1,2}):(\d{2})(?::\d{2})?$/
  );

  if (!match) return null;

  const [, y, m, d, h, min] = match;

  const year = Number(y);
  const month = Number(m);
  const day = Number(d);
  const hour = Number(h);
  const minute = Number(min);

  const date = new Date(year, month - 1, day, hour, minute);

  const weekday = ["日", "月", "火", "水", "木", "金", "土"][date.getDay()];

  return {
    label: `${year}/${String(month).padStart(2, "0")}/${String(
      day
    ).padStart(2, "0")}（${weekday}）${String(hour).padStart(
      2,
      "0"
    )}:${String(minute).padStart(2, "0")}`,
  };
}

/* =========================
   今日・昨日ラベル
========================= */
function getRelativeLabel(dt?: string) {
  if (!dt) return null;

  const cleaned = dt.replace(/^'/, "").trim();

  const match = cleaned.match(
    /^(\d{4})\/(\d{1,2})\/(\d{1,2})\s+(\d{1,2}):(\d{2})/
  );

  if (!match) return null;

  const [, y, m, d] = match;

  const target = new Date(Number(y), Number(m) - 1, Number(d));
  const now = new Date();

  const today = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate()
  );

  const diff = Math.floor(
    (today.getTime() - target.getTime()) / (1000 * 60 * 60 * 24)
  );

  if (diff === 0) return "今日";
  if (diff === 1) return "昨日";
  return null;
}

/* =========================
   Page
========================= */
export default function Page() {
  const [data, setData] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    fetch("/api/derivative/streams")
      .then((res) => res.json())
      .then((res) => {
        setData(res);
        setLoading(false);
        setTimeout(() => setReady(true), 50);
      });
  }, []);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* ヘッダー */}
      <div className="text-center mb-10">
        <h1 className="text-3xl md:text-4xl font-bold">
          紹介配信（ストリーム）
        </h1>

        <p className="text-sm text-gray-600 mt-2">
          「{CONFIG.event.name}」の紹介配信一覧です。
        </p>

        <div className="mt-4 border-b border-gray-200 max-w-xl mx-auto" />
      </div>

      {/* LOADING */}
      {loading && (
        <div className="flex flex-col gap-6 items-center">
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      )}

      {/* EMPTY */}
      {!loading && data.length === 0 && (
        <div className="text-center py-20 text-gray-600">
          紹介配信はまだありません。
        </div>
      )}

      {/* CONTENT */}
      {!loading && data.length > 0 && (
        <div
          className={`flex flex-col gap-6 items-center transition-opacity duration-300 ${
            ready ? "opacity-100" : "opacity-0"
          }`}
        >
          {data.map((item, i) => {
            const img =
              item.imageUrl?.trim()
                ? item.imageUrl
                : CONFIG.images.defaultIllustration;

            const parsed = parseSafeDate(item.publishedAt);
            const label = getRelativeLabel(item.publishedAt);

            return (
              <div
                key={i}
                className="group w-[760px] max-w-full rounded-xl bg-white p-4 shadow-sm hover:shadow-md transition"
              >
                <div className="flex gap-4 w-full">
                  {/* サムネ */}
                  <a
                    href={item.workUrl}
                    target="_blank"
                    className="w-44 h-28 flex-shrink-0 overflow-hidden rounded-lg"
                  >
                    <img
                      src={img}
                      className="w-full h-full object-cover group-hover:scale-105 transition"
                    />
                  </a>

                  {/* テキスト */}
                  <div className="flex flex-col justify-between flex-1 min-w-0">
                    {/* タイトル */}
                    <div className="min-w-0">
                      <a href={item.workUrl} target="_blank">
                        <h2 className="text-lg md:text-xl font-bold leading-snug truncate group-hover:underline">
                          {item.title}
                        </h2>
                      </a>

                      <p className="text-sm text-gray-700 mt-1 font-medium truncate">
                        {item.creator}
                      </p>
                    </div>

                    {/* メタ */}
                    <div className="mt-3 flex flex-col gap-2 w-full">
                      {/* 配信日時 */}
                      {parsed && (
                        <div className="flex items-center gap-2 flex-wrap">
                          {/* 今日・昨日 */}
                          {label && (
                            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-md font-medium">
                              {label}
                            </span>
                          )}

                          {/* 日時（完全表示） */}
                          <span className="text-sm bg-gray-100 px-3 py-1 rounded-md font-semibold text-gray-700">
                            {parsed.label}
                          </span>
                        </div>
                      )}

                      {/* 投稿先 */}
                      {item.service && item.service !== "その他" && (
                        <div>
                          <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-700 inline-block truncate max-w-full">
                            {item.service}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}