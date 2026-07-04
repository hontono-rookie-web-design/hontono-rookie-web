"use client";

import { useEffect, useState, useRef } from "react";
import { CONFIG } from "@/config/config";
import Image from "next/image";

export type Item = {
  creator: string;
  workUrl: string;
  title: string;
  imageUrl: string;
  originalUrl: string;
  originalTitle: string;
  originalAuthor: string;
};

export function SkeletonCard() {
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

type Props = {
  initialItems: Item[];
};

const PAGE_SIZE = 24;

export default function IllustrationsContent({ initialItems }: Props) {
  const [data] = useState<Item[]>(initialItems);
  const [displayData, setDisplayData] = useState<Item[]>(initialItems);
  const [ready, setReady] = useState(false);
  const [searchText, setSearchText] = useState("");

  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const loadMoreRef = useRef<HTMLDivElement>(null);

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
    setVisibleCount(PAGE_SIZE);
  }, [searchText, data]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setReady(true);
    }, 50);

    return () => clearTimeout(timer);
  }, []);

  /* 無限スクロール */
  useEffect(() => {
    if (!loadMoreRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setVisibleCount((prev) =>
            Math.min(prev + PAGE_SIZE, displayData.length)
          );
        }
      },
      { rootMargin: "200px" }
    );

    observer.observe(loadMoreRef.current);

    return () => observer.disconnect();
  }, [displayData]);

  const visibleItems = displayData.slice(0, visibleCount);

  return (
    <div className="p-4 sm:p-6 flex flex-col items-center w-full">
      {/* 検索 */}
      <div className="w-full max-w-6xl mb-4">
        <input
          type="text"
          placeholder="検索"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          className="w-40 sm:w-56 border rounded px-2 py-1 text-sm"
        />
      </div>

      {/* EMPTY */}
      {displayData.length === 0 && (
        <div className="flex justify-center items-center min-h-[40vh] text-gray-600 w-full max-w-6xl">
          二次創作（イラスト）はまだありません。
        </div>
      )}

      {/* CONTENT */}
      {displayData.length > 0 && (
        <div
          className={`w-full max-w-6xl grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 transition-opacity duration-300 ${
            ready ? "opacity-100" : "opacity-0"
          }`}
        >
          {visibleItems.map((item, i) => {
            const img =
              item.imageUrl?.trim()
                ? item.imageUrl
                : CONFIG.images.defaultIllustration;

            return (
              <div key={i} className="group flex flex-col">
                {/* 画像 */}
                <a href={item.workUrl} target="_blank">
                  <div className="aspect-square overflow-hidden rounded-xl relative">
                    <Image
                      src={img}
                      alt={item.title}
                      fill
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      className="object-cover group-hover:scale-105 transition"
                      unoptimized
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

      {/* 無限スクロール監視用 */}
      {displayData.length > visibleCount && (
        <div ref={loadMoreRef} className="h-10 w-full" />
      )}
    </div>
  );
}
