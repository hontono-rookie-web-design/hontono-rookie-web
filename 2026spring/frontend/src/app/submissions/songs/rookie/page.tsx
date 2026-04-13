"use client";

import { useEffect, useState } from "react";
import { CONFIG } from "@/config/config";

type Item = {
  title: string;
  creator: string;
  videoUrl: string;
  thumbnailUrl: string;
  publishedAt: string;
  description: string;
};

/* =========================
   日付整形
========================= */
function formatDate(dateStr?: string) {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return "";

  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");

  return `${y}/${m}/${d}`;
}

/* =========================
   概要欄整形
========================= */
function cleanDescription(text?: string) {
  if (!text) return "";
  return text
    .replace(/<br\s*\/?>/gi, " ")
    .replace(/\n/g, " ")
    .trim();
}

/* =========================
   日付パース
========================= */
function parseDate(dateStr?: string) {
  if (!dateStr) return 0;
  return new Date(dateStr).getTime();
}

/* =========================
   シャッフル
========================= */
function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/* =========================
   Skeleton
========================= */
function SkeletonCard() {
  return (
    <div className="w-full max-w-[760px] rounded-xl bg-white p-4 shadow-sm">
      <div className="flex gap-4">
        <div className="w-40 h-24 bg-gray-200 rounded-lg animate-pulse" />
        <div className="flex flex-col flex-1 gap-2">
          <div className="h-5 bg-gray-200 rounded w-3/4 animate-pulse" />
          <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse" />
          <div className="h-3 bg-gray-200 rounded w-24 animate-pulse" />
          <div className="h-4 bg-gray-200 rounded w-full animate-pulse" />
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

  const [sortType, setSortType] = useState<"new" | "old">("new");
  const [searchText, setSearchText] = useState("");
  const [isRandom, setIsRandom] = useState(false);

  /* 初期ロード */
  useEffect(() => {
    fetch("/api/submissions/songs/rookie")
      .then((res) => res.json())
      .then((res) => {
        setData(res);
        setLoading(false);
      });
  }, []);

  /* フィルタ + ソート */
  useEffect(() => {
    if (data.length === 0) return;

    // ✅ ランダム中は上書きしない
    if (isRandom) return;

    let filtered = [...data];

    if (searchText.trim()) {
      const q = searchText.toLowerCase();
      filtered = filtered.filter((item) =>
        (item.title + item.creator + item.description)
          .toLowerCase()
          .includes(q)
      );
    }

    if (sortType === "new") {
      filtered.sort(
        (a, b) => parseDate(b.publishedAt) - parseDate(a.publishedAt)
      );
    } else {
      filtered.sort(
        (a, b) => parseDate(a.publishedAt) - parseDate(b.publishedAt)
      );
    }

    setDisplayData(filtered);
  }, [data, sortType, searchText, isRandom]);

  /* =========================
     ランダム
  ========================= */
  const handleShuffle = () => {
    let base = [...data];

    // 検索中なら検索結果だけシャッフル
    if (searchText.trim()) {
      const q = searchText.toLowerCase();
      base = base.filter((item) =>
        (item.title + item.creator + item.description)
          .toLowerCase()
          .includes(q)
      );
    }

    setDisplayData(shuffleArray(base));
    setIsRandom(true);
  };

  /* =========================
     ソート変更
  ========================= */
  const handleSortChange = (value: "new" | "old") => {
    setSortType(value);
    setIsRandom(false);
  };

  /* =========================
     検索変更
  ========================= */
  const handleSearchChange = (value: string) => {
    setSearchText(value);
    setIsRandom(false);
  };

  return (
    <div className="p-4 sm:p-6 flex flex-col items-center">
      {/* ヘッダー */}
      <div className="text-center mb-8 w-full max-w-[760px]">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold">
          楽曲一覧 ルーキー
        </h1>

        <p className="text-xs sm:text-sm text-gray-600 mt-2">
          「{CONFIG.event.name}」のルーキー参加楽曲を掲載しています。
        </p>

        <div className="mt-4 border-b border-gray-200 w-full" />
      </div>

      {/* 検索 */}
      {!loading && (
        <div className="w-full max-w-[760px] mb-4 flex">
          <input
            type="text"
            placeholder="検索"
            value={searchText}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="w-48 border rounded px-2 py-1 text-sm"
          />
        </div>
      )}

      {/* 操作バー */}
      {!loading && data.length > 0 && (
        <div className="w-full max-w-[760px] flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <select
              value={isRandom ? "random" : sortType}
              onChange={(e) => {
                const val = e.target.value;
                if (val === "random") return;
                handleSortChange(val as "new" | "old");
              }}
              className="border rounded px-2 py-1 text-sm"
            >
              {isRandom && <option value="random">ランダム</option>}
              <option value="new">新しい順</option>
              <option value="old">古い順</option>
            </select>

            <button
              onClick={handleShuffle}
              className="px-2 py-1 text-sm rounded border active:scale-95 active:bg-gray-100 transition"
            >
              ランダムに並び替え
            </button>
          </div>

          <div className="text-sm text-gray-600">
            {displayData.length}件
          </div>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="flex flex-col gap-6 items-center w-full">
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      )}

      {/* Empty */}
      {!loading && displayData.length === 0 && (
        <div className="text-center py-20 text-gray-600 w-full max-w-[760px]">
          該当する動画がありません。
        </div>
      )}

      {/* Content */}
      {!loading && displayData.length > 0 && (
        <div className="flex flex-col gap-6 items-center w-full">
          {displayData.map((item, i) => (
            <div
              key={i}
              className="group w-full max-w-[760px] rounded-xl bg-white p-4 shadow-sm hover:shadow-md transition"
            >
              <div className="flex gap-4">
                <a
                  href={item.videoUrl}
                  target="_blank"
                  className="w-40 h-24 flex-shrink-0 overflow-hidden rounded-lg"
                >
                  <img
                    src={item.thumbnailUrl}
                    className="w-full h-full object-cover group-hover:scale-105 transition"
                  />
                </a>

                <div className="flex flex-col flex-1 min-w-0">
                  <a href={item.videoUrl} target="_blank">
                    <h2 className="text-base sm:text-lg font-bold leading-snug line-clamp-2 group-hover:underline">
                      {item.title}
                    </h2>
                  </a>

                  <p className="text-sm text-gray-700 font-medium mt-1 truncate">
                    {item.creator}
                  </p>

                  <p className="text-xs text-gray-500 mt-1">
                    {formatDate(item.publishedAt)}
                  </p>

                  <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                    {cleanDescription(item.description)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}