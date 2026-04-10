"use client";

import { useEffect, useState } from "react";
import { CONFIG } from "@/config/config";

type Illustration = {
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
  const [data, setData] = useState<Illustration[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/illustrations")
      .then((res) => res.json())
      .then((json) => setData(json))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="p-6">
      {/* ===== タイトルエリア ===== */}
      <div className="text-center mb-10">
        <h1 className="text-3xl md:text-4xl font-bold">
          二次創作（イラスト）
        </h1>

        <p className="text-sm text-gray-600 mt-2">
          「{CONFIG.event.name}」の二次創作イラストを掲載しています。
        </p>

        <div className="mt-4 border-b border-gray-300 w-full max-w-xl mx-auto"></div>
      </div>

      {/* ===== グリッド ===== */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {data.map((item, index) => {
          const imageSrc =
            item.imageUrl && item.imageUrl.trim() !== ""
              ? item.imageUrl
              : CONFIG.images.defaultIllustration;

          return (
            <div key={index} className="group flex flex-col">
              {/* ===== 画像＋タイトル ===== */}
              <a
                href={item.workUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col"
              >
                {/* 画像 */}
                <div className="overflow-hidden rounded-xl shadow-md aspect-square">
                  <img
                    src={imageSrc}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>

                {/* タイトル（高さ固定） */}
                <h2
                  className="mt-2 font-semibold group-hover:underline line-clamp-2 min-h-[3rem]"
                  title={item.title}
                >
                  {item.title}
                </h2>
              </a>

              {/* 二次創作者（高さ固定） */}
              <p
                className="text-sm text-gray-700 line-clamp-1 min-h-[1.25rem]"
                title={item.creator}
              >
                {item.creator}
              </p>

              {/* 元作品（存在する場合のみ表示） */}
              {item.originalTitle && item.originalTitle.trim() !== "" && (
                <p
                  className="text-xs text-gray-500 mt-1 line-clamp-2 min-h-[2rem]"
                  title={`${item.originalTitle} / ${item.originalAuthor}`}
                >
                  Original:{" "}
                  <a
                    href={item.originalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline"
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
    </div>
  );
}