"use client";

import { useEffect, useState } from "react";
import { CONFIG } from "@/config/config";

type Item = {
  title: string;
  author: string;
  noteUrl: string;
  userUrl: string;
  eyecatchUrl: string;
  userProfileImageUrl: string;
  publishedAt: string;
};

/* =========================
   日付整形
========================= */
function formatDate(dateStr?: string) {
  if (!dateStr) return "";

  const cleaned = dateStr.replace(/^'/, "").trim();

  const match = cleaned.match(
    /^(\d{4})\/(\d{1,2})\/(\d{1,2})\s*(\d{1,2})?:?(\d{2})?/
  );

  if (!match) return cleaned;

  const [, y, m, d] = match;

  return `${y}/${m.padStart(2, "0")}/${d.padStart(2, "0")}`;
}

/* =========================
   Skeleton Card
========================= */
function SkeletonCard() {
  return (
    <div className="w-full max-w-[760px] rounded-xl bg-white p-4 shadow-sm">
      <div className="flex gap-4 w-full">
        <div className="w-32 sm:w-44 h-20 sm:h-28 bg-gray-200 rounded-lg animate-pulse" />

        <div className="flex flex-col justify-between flex-1 min-w-0 gap-3">
          <div className="space-y-2">
            <div className="h-5 bg-gray-200 rounded w-3/4 animate-pulse" />
            <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse" />
            <div className="h-3 bg-gray-200 rounded w-24 animate-pulse" />
          </div>

          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse" />
            <div className="h-4 bg-gray-200 rounded w-24 animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
}

/* =========================
   Page
========================= */
export default function Page() {
  const [data, setData] = useState<Item[]>([]);
  const [displayData, setDisplayData] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [ready, setReady] = useState(false);

  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    fetch("/api/derivative/articles")
      .then((res) => res.json())
      .then((res) => {
        setData(res);
        setDisplayData(res);
        setLoading(false);
        setTimeout(() => setReady(true), 50);
      });
  }, []);

  /* =========================
     検索
  ========================= */
  useEffect(() => {
    let filtered = [...data];

    if (searchText.trim()) {
      const q = searchText.toLowerCase();
      filtered = filtered.filter((item) =>
        (item.title + item.author).toLowerCase().includes(q)
      );
    }

    setDisplayData(filtered);
  }, [searchText, data]);

  return (
    <div className="p-4 sm:p-6 flex flex-col items-center">
      {/* ヘッダー */}
      <div className="text-center mb-8 w-full max-w-[760px]">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold">
          note記事
        </h1>

        <p className="text-xs sm:text-sm text-gray-600 mt-2">
          「{CONFIG.event.name}」に関するnote記事を掲載しています。
        </p>

        {/* 下線統一 */}
        <div className="mt-4 border-b border-gray-200 w-full" />
      </div>

      {/* 検索 */}
      {!loading && (
        <div className="w-full max-w-[760px] mb-4 flex">
          <input
            type="text"
            placeholder="検索"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="w-40 sm:w-56 border rounded px-2 py-1 text-sm"
          />
        </div>
      )}

      {/* LOADING */}
      {loading && (
        <div className="flex flex-col gap-6 items-center w-full">
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      )}

      {/* EMPTY */}
      {!loading && displayData.length === 0 && (
        <div className="text-center py-20 text-gray-600 w-full max-w-[760px]">
          note記事はまだありません。
        </div>
      )}

      {/* CONTENT */}
      {!loading && displayData.length > 0 && (
        <div
          className={`flex flex-col gap-4 sm:gap-6 items-center w-full transition-opacity duration-300 ${
            ready ? "opacity-100" : "opacity-0"
          }`}
        >
          {displayData.map((item, i) => {
            const img =
              item.eyecatchUrl?.trim()
                ? item.eyecatchUrl
                : CONFIG.images.defaultIllustration;

            return (
              <div
                key={i}
                className="group w-full max-w-[760px] rounded-xl bg-white p-3 sm:p-4 shadow-sm hover:shadow-md transition"
              >
                <div className="flex gap-3 sm:gap-4 w-full">
                  {/* 画像 */}
                  <a
                    href={item.noteUrl}
                    target="_blank"
                    className="w-full sm:w-44 h-48 sm:h-28 flex-shrink-0 overflow-hidden rounded-lg"
                  >
                    <img
                      src={img}
                      className="w-full h-full object-cover group-hover:scale-105 transition"
                    />
                  </a>

                  {/* テキスト */}
                  <div className="flex flex-col justify-between flex-1 min-w-0">
                    <div className="min-w-0">
                      {/* タイトル */}
                      <a href={item.noteUrl} target="_blank">
                        <h2 className="text-base sm:text-lg md:text-xl font-bold leading-snug line-clamp-2 group-hover:underline">
                          {item.title}
                        </h2>
                      </a>

                      {/* 投稿者 */}
                      <div className="mt-2 flex items-center gap-2 min-w-0">
                        {item.userProfileImageUrl && (
                          <img
                            src={item.userProfileImageUrl}
                            className="w-8 h-8 rounded-full object-cover"
                          />
                        )}

                        <a
                          href={item.userUrl}
                          target="_blank"
                          className="text-sm text-gray-700 font-medium truncate hover:underline"
                        >
                          {item.author}
                        </a>
                      </div>

                      {/* 投稿日 */}
                      <p className="text-xs text-gray-500 mt-1">
                        {formatDate(item.publishedAt)}
                      </p>
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