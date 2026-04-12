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

  // 初期値は固定（←これ重要）
  const [sortType, setSortType] = useState<"new" | "old">("new");
  const [isShuffled, setIsShuffled] = useState(false);

  // ボタンアニメ用
  const [shuffleActive, setShuffleActive] = useState(false);

  /* =========================
     データ取得
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
     localStorage 復元（クライアントのみ）
  ========================= */
  useEffect(() => {
    const savedSort = localStorage.getItem("video_sort");
    const savedShuffle = localStorage.getItem("video_shuffle");
    const savedData = localStorage.getItem("video_order");

    if (savedSort === "new" || savedSort === "old") {
      setSortType(savedSort);
    }

    if (savedShuffle === "true" && savedData) {
      setDisplayData(JSON.parse(savedData));
      setIsShuffled(true);
    }
  }, []);

  /* =========================
     ソート処理
  ========================= */
  useEffect(() => {
    if (data.length === 0) return;
    if (isShuffled) return;

    let sorted = [...data];

    if (sortType === "new") {
      sorted.sort(
        (a, b) => parseDate(b.publishedAt) - parseDate(a.publishedAt)
      );
    } else {
      sorted.sort(
        (a, b) => parseDate(a.publishedAt) - parseDate(b.publishedAt)
      );
    }

    setDisplayData(sorted);

    localStorage.setItem("video_sort", sortType);
    localStorage.setItem("video_shuffle", "false");
  }, [data, sortType, isShuffled]);

  /* =========================
     ランダム
  ========================= */
  const handleShuffle = () => {
    const shuffled = shuffleArray(data);

    setDisplayData(shuffled);
    setIsShuffled(true);

    localStorage.setItem("video_shuffle", "true");
    localStorage.setItem("video_order", JSON.stringify(shuffled));

    // 押した感（軽いスケール）
    setShuffleActive(true);
    setTimeout(() => setShuffleActive(false), 150);
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
        <div className="flex items-center justify-between mb-6">
          {/* 左側（操作） */}
          <div className="flex items-center gap-3">
            <select
              value={isShuffled ? "random" : sortType}
              onChange={(e) => {
                const value = e.target.value;

                if (value === "random") return;

                setSortType(value as "new" | "old");
                setIsShuffled(false);
              }}
              className="border rounded px-3 py-1 text-sm"
            >
              <option value="new">新しい順</option>
              <option value="old">古い順</option>
              <option value="random">ランダム</option>
            </select>

            <button
              onClick={handleShuffle}
              className={`px-3 py-1 text-sm rounded border transition-transform duration-150 ${
                shuffleActive ? "scale-95 bg-gray-200" : "bg-white"
              }`}
            >
              ランダムに並び替え
            </button>
          </div>

          {/* 右側（件数） */}
          <div className="text-sm text-gray-600">
            全 {displayData.length} 件
          </div>
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
                  <a href={item.videoUrl} target="_blank">
                    <h2 className="text-lg font-bold truncate group-hover:underline">
                      {item.title}
                    </h2>
                  </a>

                  <p className="text-sm text-gray-800 font-medium mt-1 truncate">
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