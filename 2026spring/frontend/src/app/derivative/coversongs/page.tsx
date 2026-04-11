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

export default function Page() {
  const [data, setData] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/derivative/coversongs")
      .then((res) => res.json())
      .then(setData)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* ヘッダー */}
      <div className="text-center mb-10">
        <h1 className="text-3xl md:text-4xl font-bold">
          二次創作（歌ってみた）
        </h1>

        <p className="text-sm text-gray-600 mt-2">
          「{CONFIG.event.name}」の歌ってみた作品を掲載しています。
        </p>

        <div className="mt-4 border-b border-gray-200 max-w-xl mx-auto" />
      </div>

      {loading && <div className="text-center">Loading...</div>}

      {!loading && data.length === 0 && (
        <div className="text-center py-20 text-gray-600">
          二次創作（歌ってみた）はまだありません。
        </div>
      )}

      {!loading && data.length > 0 && (
        <div className="flex flex-col gap-6 items-center">
          {data.map((item, i) => {
            const img =
              item.imageUrl?.trim()
                ? item.imageUrl
                : CONFIG.images.defaultIllustration;

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
                    {/* タイトル・作者 */}
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
                      {/* 投稿先 */}
                      {item.service && item.service !== "その他" && (
                        <div>
                          <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-700 inline-block truncate max-w-full">
                            {item.service}
                          </span>
                        </div>
                      )}

                      {/* Original（常に枠表示） */}
                      <div className="bg-gray-50 px-3 py-2 rounded-lg text-xs text-gray-600 w-full min-w-0">
                        {item.originalTitle ? (
                          <a
                            href={item.originalUrl}
                            target="_blank"
                            className="block truncate underline hover:text-gray-800"
                          >
                            {item.originalTitle}
                            {item.originalAuthor && ` / ${item.originalAuthor}`}
                          </a>
                        ) : (
                          <span className="opacity-0 select-none">
                            placeholder
                          </span>
                        )}
                      </div>
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