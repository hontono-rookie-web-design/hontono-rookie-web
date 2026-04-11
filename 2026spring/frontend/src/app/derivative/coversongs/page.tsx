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
    fetch("/api/coversongs")
      .then((res) => res.json())
      .then(setData)
      .finally(() => setLoading(false));
  }, []);

  const getServiceBadge = (service: string) => {
    if (!service || service === "その他") return null;

    return (
      <span className="text-xs px-2 py-1 rounded-full bg-gray-100 border">
        {service}
      </span>
    );
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* タイトル */}
      <div className="text-center mb-10">
        <h1 className="text-3xl md:text-4xl font-bold">
          二次創作（歌ってみた）
        </h1>

        <p className="text-sm text-gray-600 mt-2">
          「{CONFIG.event.name}」の歌ってみた作品を掲載しています。
        </p>

        <div className="mt-4 border-b border-gray-300 max-w-xl mx-auto" />
      </div>

      {/* ローディング */}
      {loading && <div className="text-center">Loading...</div>}

      {/* 空表示 */}
      {!loading && data.length === 0 && (
        <div className="text-center py-20 text-gray-600">
          二次創作（歌ってみた）はまだありません。
        </div>
      )}

      {/* リスト */}
      {!loading && data.length > 0 && (
        <div className="flex flex-col gap-6">
          {data.map((item, i) => {
            const img =
              item.imageUrl?.trim()
                ? item.imageUrl
                : CONFIG.images.defaultIllustration;

            return (
              <div
                key={i}
                className="group rounded-xl border bg-white p-4 shadow-sm hover:shadow-md transition"
              >
                <div className="flex gap-4">
                  {/* サムネ（リンク） */}
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

                  {/* メイン情報 */}
                  <div className="flex flex-col justify-between w-full">
                    {/* タイトル＋作者（リンク） */}
                    <div>
                      <a
                        href={item.workUrl}
                        target="_blank"
                        className="block"
                      >
                        <h2 className="text-lg md:text-xl font-bold leading-snug group-hover:underline">
                          {item.title}
                        </h2>
                      </a>

                      <p className="text-sm text-gray-700 mt-1 font-medium">
                        {item.creator}
                      </p>
                    </div>

                    {/* メタ情報 */}
                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      {/* 投稿先 */}
                      {getServiceBadge(item.service)}

                      {/* Original（別リンク） */}
                      {item.originalTitle && (
                        <span className="text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded">
                          Original:{" "}
                          <a
                            href={item.originalUrl}
                            target="_blank"
                            className="underline hover:text-gray-700"
                          >
                            {item.originalTitle}
                          </a>
                          {item.originalAuthor &&
                            ` / ${item.originalAuthor}`}
                        </span>
                      )}
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