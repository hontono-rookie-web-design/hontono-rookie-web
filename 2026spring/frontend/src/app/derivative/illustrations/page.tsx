"use client";

import { useEffect, useState } from "react";
import { CONFIG } from "@/config/config";

type Item = {
  creator: string;
  workUrl: string;
  title: string;
  imageUrl: string;
  originalUrl: string;
  originalTitle: string;
  originalAuthor: string;
};

/* =========================
   Skeleton Card（グリッド用）
========================= */
function SkeletonCard() {
  return (
    <div className="flex flex-col">
      <div className="aspect-square bg-gray-200 rounded-xl animate-pulse" />

      <div className="mt-2 space-y-2">
        <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse" />
        <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse" />
      </div>

      <div className="mt-2 h-4 bg-gray-200 rounded w-1/3 animate-pulse" />
      <div className="mt-2 h-10 bg-gray-200 rounded w-full animate-pulse" />
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
    fetch("/api/derivative/illustrations")
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
        (
          item.title +
          item.creator +
          item.originalTitle +
          item.originalAuthor
        )
          .toLowerCase()
          .includes(q)
      );
    }

    setDisplayData(filtered);
  }, [searchText, data]);

  return (
    <div className="p-4 sm:p-6 flex flex-col items-center">
      {/* ヘッダー */}
      <div className="text-center mb-8 w-full max-w-6xl">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold">
          二次創作（イラスト）
        </h1>

        <p className="text-xs sm:text-sm text-gray-600 mt-2">
          「{CONFIG.event.name}」の二次創作イラストを掲載しています。
        </p>

        {/* 下線統一 */}
        <div className="mt-4 border-b border-gray-200 w-full" />
      </div>

      {/* 検索 */}
      {!loading && (
        <div className="w-full max-w-6xl mb-4">
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
        <div className="w-full max-w-6xl grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {Array.from({ length: 12 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      )}

      {/* EMPTY */}
      {!loading && displayData.length === 0 && (
        <div className="flex justify-center items-center min-h-[40vh] text-gray-600 w-full max-w-6xl">
          二次創作（イラスト）はまだありません。
        </div>
      )}

      {/* CONTENT */}
      {!loading && displayData.length > 0 && (
        <div
          className={`w-full max-w-6xl grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 transition-opacity duration-300 ${
            ready ? "opacity-100" : "opacity-0"
          }`}
        >
          {displayData.map((item, i) => {
            const img =
              item.imageUrl?.trim()
                ? item.imageUrl
                : CONFIG.images.defaultIllustration;

            return (
              <div key={i} className="group flex flex-col">
                {/* 画像 */}
                <a href={item.workUrl} target="_blank">
                  <div className="aspect-square overflow-hidden rounded-xl">
                    <img
                      src={img}
                      className="w-full h-full object-cover group-hover:scale-105 transition"
                    />
                  </div>
                </a>

                {/* タイトル */}
                <a href={item.workUrl} target="_blank">
                  <h2 className="mt-2 font-bold text-sm sm:text-sm md:text-base leading-snug line-clamp-2 min-h-[3rem] group-hover:underline">
                    {item.title}
                  </h2>
                </a>

                {/* 作者 */}
                <p className="text-xs sm:text-sm text-gray-700 mt-1 font-medium line-clamp-1 min-h-[1.5rem]">
                  {item.creator}
                </p>

                {/* Original */}
                {item.originalTitle && (
                  <p className="text-xs text-gray-500 mt-1 line-clamp-2 min-h-[2rem]">
                    Original:{" "}
                    <a
                      href={item.originalUrl}
                      target="_blank"
                      className="underline hover:text-gray-700"
                    >
                      {item.originalTitle}
                    </a>
                    {item.originalAuthor && ` / ${item.originalAuthor}`}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}