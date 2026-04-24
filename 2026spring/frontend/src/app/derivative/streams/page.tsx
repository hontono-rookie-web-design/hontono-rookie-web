"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { CONFIG } from "@/config/config";

type Item = {
  creator: string;
  service: string;
  workUrl: string;
  title: string;
  imageUrl: string;
  publishedAt: string;
};

/* =========================
   Skeleton
========================= */
function SkeletonTile() {
  return (
    <div className="w-full flex flex-col border border-gray-200 rounded-xl overflow-hidden">
      <div className="relative w-full aspect-video bg-gray-200 animate-pulse" />
      <div className="p-2 space-y-2">
        <div className="h-3 w-32 bg-gray-200 rounded animate-pulse" />
        <div className="space-y-1">
          <div className="h-4 w-full bg-gray-200 rounded animate-pulse" />
          <div className="h-4 w-5/6 bg-gray-200 rounded animate-pulse" />
        </div>
      </div>
    </div>
  );
}

/* =========================
   日付
========================= */
function parseDate(dt?: string) {
  if (!dt) return null;

  const cleaned = dt.replace(/^'/, "").trim();
  const match = cleaned.match(
    /^(\d{4})\/(\d{1,2})\/(\d{1,2})\s+(\d{1,2}):(\d{2})/
  );
  if (!match) return null;

  const [, y, m, d, h, min] = match;

  return {
    raw: new Date(
      Number(y),
      Number(m) - 1,
      Number(d),
      Number(h),
      Number(min)
    ),
    label: `${y}/${String(m).padStart(2, "0")}/${String(d).padStart(
      2,
      "0"
    )} ${String(h).padStart(2, "0")}:${min}`,
  };
}

function isFuture(date?: Date) {
  return date ? date.getTime() > Date.now() : false;
}

function getDayLabel(date?: Date) {
  if (!date) return null;

  const now = new Date();

  const t = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const n = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  const diff = Math.floor(
    (t.getTime() - n.getTime()) / (1000 * 60 * 60 * 24)
  );

  if (diff === 0) return "今日";
  if (diff === 1) return "明日";
  return null;
}

/* =========================
   カード
========================= */
function Card({
  item,
  showDate = true,
  showFutureBadge = true,
}: {
  item: Item;
  showDate?: boolean;
  showFutureBadge?: boolean;
}) {
  const img =
    item.imageUrl?.trim()
      ? item.imageUrl
      : CONFIG.images.defaultIllustration;

  const parsed = parseDate(item.publishedAt);
  const future = isFuture(parsed?.raw);
  const dayLabel = getDayLabel(parsed?.raw);

  return (
    <div className="min-w-[240px] max-w-[240px] flex flex-col border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
      <a href={item.workUrl} target="_blank">
        <div className="relative aspect-video">
          <img src={img} className="w-full h-full object-cover" />

          {future && showFutureBadge && (
            <span className="absolute top-2 left-2 bg-black/80 text-white text-[10px] px-2 py-0.5 rounded">
              予定
            </span>
          )}
        </div>

        <div className="p-2 space-y-1">
          {showDate && parsed && (
            <div className="flex items-center gap-1 flex-wrap">
              {dayLabel && (
                <span
                  className={`
                    text-[11px] font-bold px-2 py-0.5 rounded
                    ${
                      dayLabel === "今日"
                        ? "bg-red-100 text-red-600"
                        : "bg-orange-100 text-orange-600"
                    }
                  `}
                >
                  {dayLabel}
                </span>
              )}

              <span className="bg-blue-50 text-blue-700 text-[11px] font-semibold px-2 py-0.5 rounded">
                {parsed.label}
              </span>
            </div>
          )}

          <h2 className="text-sm font-semibold line-clamp-2">
            {item.title}
          </h2>

          <p className="text-[11px] text-gray-400 truncate">
            {item.creator}
          </p>
        </div>
      </a>
    </div>
  );
}

/* =========================
   Page
========================= */
export default function Page() {
  const [schedule, setSchedule] = useState<Item[]>([]);
  const [archive, setArchive] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);

  const scrollRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    Promise.all([
      fetch("/api/derivative/streams").then((r) => r.json()),
      fetch("/api/derivative/streams/archive").then((r) => r.json()),
    ]).then(([scheduleData, archiveData]) => {
      setSchedule(scheduleData);
      setArchive(archiveData);
      setLoading(false);
    });
  }, []);

  const sortedSchedule = useMemo(() => {
    return [...schedule].sort((a, b) => {
      const da = parseDate(a.publishedAt)?.raw?.getTime() || 0;
      const db = parseDate(b.publishedAt)?.raw?.getTime() || 0;
      return da - db;
    });
  }, [schedule]);

  useEffect(() => {
    const now = Date.now();
    const index = sortedSchedule.findIndex((item) => {
      const t = parseDate(item.publishedAt)?.raw?.getTime();
      return t && t >= now;
    });
    if (index >= 0) scrollToIndex(index);
  }, [sortedSchedule]);

  const monthlyMap = useMemo(() => {
    const map = new Map();

    sortedSchedule.forEach((item, i) => {
      const d = parseDate(item.publishedAt)?.raw;
      if (!d) return;

      const key = `${d.getFullYear()}-${d.getMonth()}`;

      if (!map.has(key)) {
        map.set(key, {
          year: d.getFullYear(),
          month: d.getMonth(),
          indexMap: new Map(),
        });
      }

      const entry = map.get(key);
      if (!entry.indexMap.has(d.getDate())) {
        entry.indexMap.set(d.getDate(), i);
      }
    });

    return [...map.values()];
  }, [sortedSchedule]);

  const scrollToIndex = (index: number) => {
    const el = scrollRef.current?.children[index] as HTMLElement;
    if (!el || !scrollRef.current || !sectionRef.current) return;

    const container = scrollRef.current;
    const offset =
      el.offsetLeft - container.clientWidth / 2 + el.clientWidth / 2;

    container.scrollTo({ left: offset, behavior: "smooth" });

    sectionRef.current.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const scrollBy = (dir: "left" | "right") => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({
      left: dir === "left" ? -280 : 280,
      behavior: "smooth",
    });
  };

  const today = new Date();

  return (
    <div className="p-4 sm:p-6 w-full flex flex-col items-center">
      {/* ヘッダー */}
      <div className="text-center mb-8 w-full max-w-6xl">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold">
          紹介配信
        </h1>

        <p className="text-xs sm:text-sm text-gray-600 mt-2">
          「{CONFIG.event.name}」の紹介配信を掲載しています。
        </p>

        <div className="mt-4 border-b border-gray-200 w-full" />
      </div>

      {loading && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-6xl">
          {Array.from({ length: 8 }).map((_, i) => (
            <SkeletonTile key={i} />
          ))}
        </div>
      )}

      {!loading && (
        <div className="w-full max-w-6xl space-y-10">
          {/* ========================= 予定 ========================= */}
          <div ref={sectionRef}>
            <h2 className="text-xl font-bold mb-4">紹介配信予定</h2>

            {sortedSchedule.length === 0 ? (
              <div className="text-center py-10 text-gray-500">
                紹介配信の予定はまだありません。
              </div>
            ) : (
              <>
                {/* カレンダー */}
                <div className="flex gap-6 overflow-x-auto pb-2 mb-6">
                  {monthlyMap.map((m: any, idx) => {
                    const { year, month, indexMap } = m;

                    const firstDay = new Date(year, month, 1).getDay();
                    const lastDate = new Date(year, month + 1, 0).getDate();

                    const daysArray = [
                      ...Array(firstDay).fill(null),
                      ...Array.from({ length: lastDate }, (_, i) => i + 1),
                    ];

                    return (
                      <div
                        key={idx}
                        className="min-w-[220px] bg-white border rounded-2xl p-3 shadow-sm"
                      >
                        <div className="text-sm font-semibold text-center mb-2">
                          {year}/{month + 1}
                        </div>

                        <div className="grid grid-cols-7 text-[10px] text-gray-400 mb-1 text-center">
                          {["日","月","火","水","木","金","土"].map((d) => (
                            <div key={d}>{d}</div>
                          ))}
                        </div>

                        <div className="grid grid-cols-7 gap-1 text-xs">
                          {daysArray.map((day, i) => {
                            if (!day) return <div key={i} />;

                            const index = indexMap.get(day);
                            const hasStream = index !== undefined;

                            const isToday =
                              today.getFullYear() === year &&
                              today.getMonth() === month &&
                              today.getDate() === day;

                            return (
                              <button
                                key={i}
                                onClick={() =>
                                  hasStream && scrollToIndex(index!)
                                }
                                className={`
                                  h-7 rounded-full flex items-center justify-center
                                  ${hasStream ? "bg-blue-100 hover:bg-blue-200 text-blue-700" : ""}
                                  ${isToday ? "ring-2 ring-blue-400" : ""}
                                `}
                              >
                                {day}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* 横スクロール */}
                <div className="relative group">
                  <button
                    onClick={() => scrollBy("left")}
                    className="absolute left-1 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-white/60 backdrop-blur border border-gray-200 text-gray-600 opacity-0 group-hover:opacity-100 transition"
                  >
                    ‹
                  </button>

                  <div
                    ref={scrollRef}
                    className="flex gap-4 overflow-x-auto px-6 pb-2"
                  >
                    {sortedSchedule.map((item, i) => (
                      <Card key={i} item={item} showDate showFutureBadge />
                    ))}
                  </div>

                  <button
                    onClick={() => scrollBy("right")}
                    className="absolute right-1 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-white/60 backdrop-blur border border-gray-200 text-gray-600 opacity-0 group-hover:opacity-100 transition"
                  >
                    ›
                  </button>
                </div>
              </>
            )}
          </div>

          {/* ========================= アーカイブ ========================= */}
          <div>
            <h2 className="text-xl font-bold mb-4">
              紹介配信アーカイブ
            </h2>

            {archive.length === 0 ? (
              <div className="text-center py-10 text-gray-500">
                紹介配信アーカイブはまだありません。
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {archive.map((item, i) => (
                  <Card
                    key={i}
                    item={item}
                    showDate={false}
                    showFutureBadge={false}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}