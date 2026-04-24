"use client";

import { useEffect, useState } from "react";
import { CONFIG } from "@/config/config";

type Item = {
  creator: string;
  service: string;
  workUrl: string;
  title: string;
  imageUrl: string;
  originalUrl: string;
  originalTitle: string;
  originalAuthor: string;
};

/* =========================
   Skeleton Card
========================= */
function SkeletonCard() {
  return (
    <div className="w-full max-w-[760px] rounded-xl bg-white p-4 shadow-sm">
      <div className="flex gap-3 sm:gap-4 w-full">
        <div className="w-32 sm:w-44 h-20 sm:h-28 bg-gray-200 rounded-lg animate-pulse" />

        <div className="flex flex-col justify-between flex-1 min-w-0 gap-3">
          <div className="space-y-2">
            <div className="h-5 bg-gray-200 rounded w-3/4 animate-pulse" />
            <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse" />
          </div>

          <div className="space-y-2">
            <div className="h-5 bg-gray-200 rounded w-24 animate-pulse" />
            <div className="h-10 bg-gray-200 rounded w-full animate-pulse" />
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
    fetch("/api/derivative/others")
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
      <div className="text-center mb-8 w-full max-w-[760px]">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold">
          二次創作（その他）
        </h1>

        <p className="text-xs sm:text-sm text-gray-600 mt-2">
          「{CONFIG.event.name}」のその他の二次創作作品を掲載しています。
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
          二次創作（歌ってみた）はまだありません。
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
              item.imageUrl?.trim()
                ? item.imageUrl
                : CONFIG.images.defaultIllustration;

            return (
              <div
                key={i}
                className="group w-full max-w-[760px] rounded-xl bg-white p-3 sm:p-4 shadow-sm hover:shadow-md transition"
              >
                {/* 常に横並び */}
                <div className="flex gap-3 sm:gap-4 w-full">
                  {/* サムネ */}
                  <a
                    href={item.workUrl}
                    target="_blank"
                    className="w-32 sm:w-44 h-20 sm:h-28 flex-shrink-0 overflow-hidden rounded-lg"
                  >
                    <img
                      src={img}
                      className="w-full h-full object-cover group-hover:scale-105 transition"
                    />
                  </a>

                  {/* テキスト */}
                  <div className="flex flex-col justify-between flex-1 min-w-0">
                    <div className="min-w-0">
                      <a href={item.workUrl} target="_blank">
                        <h2 className="text-sm sm:text-base md:text-lg font-bold leading-snug line-clamp-2 h-[2.6em] overflow-hidden group-hover:underline">
                          {item.title}
                        </h2>
                      </a>

                      <div className="flex items-center justify-between mt-1 gap-2">
                        <p className="text-xs sm:text-sm text-gray-700 font-medium truncate">
                          {item.creator}
                        </p>

                        {item.service && item.service !== "その他" && (
                          <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-700 shrink-0">
                            {item.service}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="mt-2 sm:mt-3 flex flex-col gap-2 w-full">
                      {item.originalTitle && (
                        <div className="bg-gray-50 px-3 py-2 rounded-lg text-xs text-gray-600 w-full min-w-0">
                          <a
                            href={item.originalUrl}
                            target="_blank"
                            className="block truncate underline hover:text-gray-800"
                          >
                            {item.originalTitle}
                            {item.originalAuthor &&
                              ` / ${item.originalAuthor}`}
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                {/* ↑ここがポイント */}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}