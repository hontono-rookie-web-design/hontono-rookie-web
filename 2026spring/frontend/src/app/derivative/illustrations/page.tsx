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

export default function Page() {
  const [data, setData] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/derivative/illustrations")
      .then((res) => res.json())
      .then(setData)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-6">
      {/* タイトル */}
      <div className="text-center mb-10">
        <h1 className="text-3xl md:text-4xl font-bold">
          二次創作（イラスト）
        </h1>

        <p className="text-sm text-gray-600 mt-2">
          「{CONFIG.event.name}」の二次創作イラストを掲載しています。
        </p>

        <div className="mt-4 border-b border-gray-300 max-w-xl mx-auto" />
      </div>

      {/* ローディング */}
      {loading && <div className="text-center">Loading...</div>}

      {/* 空表示 */}
      {!loading && data.length === 0 && (
        <div className="flex justify-center items-center min-h-[40vh] text-gray-600">
          二次創作（イラスト）はまだありません。
        </div>
      )}

      {/* グリッド */}
      {!loading && data.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {data.map((item, i) => {
            const img =
              item.imageUrl?.trim()
                ? item.imageUrl
                : CONFIG.images.defaultIllustration;

            return (
              <div key={i} className="group flex flex-col">
                {/* 画像＋タイトル（作品リンク） */}
                <a href={item.workUrl} target="_blank">
                  <div className="aspect-square overflow-hidden rounded-xl">
                    <img
                      src={img}
                      className="w-full h-full object-cover group-hover:scale-105 transition"
                    />
                  </div>

                  <h2 className="mt-2 font-bold text-sm md:text-base leading-snug line-clamp-2 min-h-[3rem] group-hover:underline">
                    {item.title}
                  </h2>
                </a>

                {/* 作者（高さ固定） */}
                <p className="text-sm text-gray-700 mt-1 font-medium line-clamp-1 min-h-[1.5rem]">
                  {item.creator}
                </p>

                {/* Original（外に出すことで nested <a> 回避） */}
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