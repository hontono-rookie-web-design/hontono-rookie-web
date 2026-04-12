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
    <div className="w-[760px] max-w-full rounded-xl bg-white p-4 shadow-sm">
      <div className="flex gap-4">
        <div className="w-44 h-28 bg-gray-200 rounded-lg animate-pulse" />

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
  const [isShuffled, setIsShuffled] = useState(false);

  /* =========================
     初期読み込み
  ========================= */
  useEffect(() => {
    fetch("/api/submissions/songs/opening")
      .then((res) => res.json())
      .then((res) => {
        setData(res);
        setLoading(false);
      });
  }, []);

  /* =========================
     localStorage復元
  ========================= */
  useEffect(() => {
    const savedSort = localStorage.getItem("video_sort");
    const savedShuffle = localStorage.getItem("video_shuffle");

    if (savedSort === "new" || savedSort === "old") {
      setSortType(savedSort);
    }

    if (savedShuffle === "true") {
      setIsShuffled(true);
    }
  }, []);

  /* =========================
     並び替え処理
  ========================= */
  useEffect(() => {
    if (data.length === 0) return;

    let result = [...data];

    if (isShuffled) {
      const saved = localStorage.getItem("video_order");

      if (saved) {
        const order: string[] = JSON.parse(saved);
        result.sort(
          (a, b) =>
            order.indexOf(a.videoUrl) - order.indexOf(b.videoUrl)
        );
      } else {
        result = shuffleArray(data);
      }
    } else {
      if (sortType === "new") {
        result.sort(
          (a, b) => parseDate(b.publishedAt) - parseDate(a.publishedAt)
        );
      } else {
        result.sort(
          (a, b) => parseDate(a.publishedAt) - parseDate(b.publishedAt)
        );
      }
    }

    setDisplayData(result);
  }, [data, sortType, isShuffled]);

  /* =========================
     ランダム
  ========================= */
  const handleShuffle = () => {
    const shuffled = shuffleArray(data);

    setDisplayData(shuffled);
    setIsShuffled(true);

    localStorage.setItem("video_shuffle", "true");
    localStorage.setItem(
      "video_order",
      JSON.stringify(shuffled.map((v) => v.videoUrl))
    );
  };

  /* =========================
     ソート変更
  ========================= */
  const handleSortChange = (value: "new" | "old") => {
    setSortType(value);
    setIsShuffled(false);

    localStorage.setItem("video_sort", value);
    localStorage.setItem("video_shuffle", "false");
    localStorage.removeItem("video_order");
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* ヘッダー */}
      <div className="text-center mb-10">
        <h1 className="text-3xl md:text-4xl font-bold">
          楽曲一覧 オープニング
        </h1>

        <p className="text-sm text-gray-600 mt-2">
          「{CONFIG.event.name}」のオープニングステージ参加楽曲を掲載しています。
        </p>

        <div className="mt-4 border-b border-gray-200 max-w-xl mx-auto" />
      </div>

      {/* 操作バー */}
      {!loading && data.length > 0 && (
        <div className="flex items-center gap-3 mb-6">
          <select
            value={isShuffled ? "random" : sortType}
            onChange={(e) => {
              const value = e.target.value;

              if (value === "random") return;

              handleSortChange(value as "new" | "old");
            }}
            className="border rounded px-3 py-1 text-sm"
          >
            {isShuffled && <option value="random">ランダム</option>}
            <option value="new">新しい順</option>
            <option value="old">古い順</option>
          </select>

          <button
            onClick={handleShuffle}
            className="px-3 py-1 text-sm rounded border bg-white hover:bg-gray-100 active:scale-95 transition"
          >
            ランダムに並び替え
          </button>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="flex flex-col gap-6 items-center">
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      )}

      {/* Content */}
      {!loading && displayData.length > 0 && (
        <div className="flex flex-col gap-6 items-center">
          {displayData.map((item, i) => (
            <div
              key={i}
              className="group w-[760px] max-w-full rounded-xl bg-white p-4 shadow-sm hover:shadow-md transition"
            >
              <div className="flex gap-4">
                {/* サムネ */}
                <a
                  href={item.videoUrl}
                  target="_blank"
                  className="w-44 h-28 flex-shrink-0 overflow-hidden rounded-lg"
                >
                  <img
                    src={item.thumbnailUrl}
                    className="w-full h-full object-cover group-hover:scale-105 transition"
                  />
                </a>

                {/* テキスト */}
                <div className="flex flex-col flex-1 min-w-0">
                  {/* タイトル */}
                  <a href={item.videoUrl} target="_blank">
                    <h2 className="text-lg font-bold truncate group-hover:underline">
                      {item.title}
                    </h2>
                  </a>

                  {/* 投稿者 */}
                  <p className="text-sm text-gray-700 mt-1 truncate">
                    {item.creator}
                  </p>

                  {/* 投稿日 */}
                  <p className="text-xs text-gray-500 mt-1">
                    {formatDate(item.publishedAt)}
                  </p>

                  {/* 概要 */}
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