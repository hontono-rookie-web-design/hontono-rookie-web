"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";

// クライアントに渡すのは表示に必要な項目のみ
export type VideoListItem = {
  title: string;
  author: string;
  videoUrl: string;
  thumbnailUrl: string;
  publishedAt: string;
};

type SortType = "new" | "old";

function parseDate(dateStr?: string) {
  if (!dateStr) return 0;
  return new Date(dateStr).getTime();
}

function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function filterVideos(videos: VideoListItem[], searchText: string) {
  if (!searchText.trim()) return videos;
  const q = searchText.toLowerCase();
  return videos.filter((v) => (v.title + v.author).toLowerCase().includes(q));
}

const PAGE_SIZE = 24;

export default function VideoList({
  videos,
  emptyMessage,
}: {
  videos: VideoListItem[];
  emptyMessage: string;
}) {
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [searchText, setSearchText] = useState("");
  const [sortType, setSortType] = useState<SortType>("new");
  const [randomOrder, setRandomOrder] = useState<VideoListItem[] | null>(null);

  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  /* フィルタ + ソート */
  const displayData = useMemo(() => {
    if (randomOrder) return randomOrder;

    const filtered = [...filterVideos(videos, searchText)];
    if (sortType === "new") {
      filtered.sort((a, b) => parseDate(b.publishedAt) - parseDate(a.publishedAt));
    } else {
      filtered.sort((a, b) => parseDate(a.publishedAt) - parseDate(b.publishedAt));
    }
    return filtered;
  }, [videos, searchText, sortType, randomOrder]);

  /* ランダム */
  const handleShuffle = () => {
    setRandomOrder(shuffleArray(filterVideos(videos, searchText)));
    setVisibleCount(PAGE_SIZE);
  };

  const handleSortChange = (val: SortType) => {
    setSortType(val);
    setRandomOrder(null);
    setVisibleCount(PAGE_SIZE);
  };

  const handleSearchChange = (val: string) => {
    setSearchText(val);
    setRandomOrder(null);
    setVisibleCount(PAGE_SIZE);
  };

  /* 無限スクロール */
  useEffect(() => {
    if (!loadMoreRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setVisibleCount((prev) => prev + PAGE_SIZE);
        }
      },
      { rootMargin: "200px" },
    );

    observer.observe(loadMoreRef.current);
    return () => observer.disconnect();
  }, [displayData]);

  const visibleItems = displayData.slice(0, visibleCount);

  return (
    <>
      {/* 操作バー */}

      <div className="flex flex-col gap-3 mb-4">
        <div className="flex justify-start">
          <input
            type="text"
            placeholder="検索（タイトル・投稿者）"
            value={searchText}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="w-full sm:w-72 border rounded px-3 py-1.5 text-sm"
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <select
              value={randomOrder ? "random" : sortType}
              onChange={(e) => {
                const val = e.target.value;
                if (val === "random") return;
                handleSortChange(val as SortType);
              }}
              className="border rounded px-2 py-1 text-sm"
            >
              {randomOrder && <option value="random">ランダム</option>}

              <option value="new">新しい順</option>

              <option value="old">古い順</option>
            </select>

            <button
              onClick={handleShuffle}
              className="
                border rounded
                px-3 py-1
                text-sm
                bg-blue-50 text-blue-700
                hover:bg-blue-100
                font-semibold
                active:scale-95 transition
              "
            >
              ランダムに並び替え
            </button>
          </div>
          <div className="text-sm text-gray-600">{displayData.length}件</div>
        </div>
      </div>
      {/* 空 */}

      {displayData.length === 0 && (
        <div className="text-center py-20 text-gray-600">{emptyMessage}</div>
      )}
      {/* グリッド */}

      {displayData.length > 0 && (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {visibleItems.map((video) => (
              <div
                key={video.videoUrl}
                className="flex flex-col group border border-gray-200 rounded-xl overflow-hidden transition hover:shadow-md"
              >
                <a href={video.videoUrl} target="_blank" className="flex flex-col">
                  <div className="relative aspect-video overflow-hidden">
                    <Image
                      src={video.thumbnailUrl}
                      alt={video.title}
                      fill
                      sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                      className="object-cover transition group-hover:scale-105"
                      loading="lazy"
                      unoptimized
                    />
                  </div>

                  <div className="flex flex-col mt-2 px-2 pb-2">
                    <h2 className="text-sm font-bold leading-snug line-clamp-2 min-h-[2.8rem] group-hover:underline">
                      {video.title}
                    </h2>

                    <p className="text-xs text-gray-600 mt-1 truncate">{video.author}</p>
                  </div>
                </a>
              </div>
            ))}
          </div>
          {/* 無限スクロール */}

          <div ref={loadMoreRef} className="h-10" />
        </>
      )}
    </>
  );
}
