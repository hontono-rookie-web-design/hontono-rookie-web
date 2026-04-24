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
   日付
========================= */
function parseDate(dt?: string) {
  if (!dt) return null;

  const m = dt.replace(/^'/, "").match(
    /^(\d{4})\/(\d{1,2})\/(\d{1,2})\s+(\d{1,2}):(\d{2})/
  );
  if (!m) return null;

  const [, y, mo, d, h, mi] = m;

  return {
    raw: new Date(+y, +mo - 1, +d, +h, +mi),
    label: `${y}/${mo.padStart(2, "0")}/${d.padStart(
      2,
      "0"
    )} ${h.padStart(2, "0")}:${mi}`,
  };
}

function isFuture(date?: Date) {
  return date ? date.getTime() > Date.now() : false;
}

function getDayLabel(date?: Date) {
  if (!date) return null;

  const now = new Date();
  const diff =
    new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime() -
    new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();

  const d = diff / (1000 * 60 * 60 * 24);

  if (d === 0) return "今日";
  if (d === 1) return "明日";
  return null;
}

function isSameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
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
  const parsed = parseDate(item.publishedAt);
  const future = isFuture(parsed?.raw);
  const dayLabel = getDayLabel(parsed?.raw);

  const img =
    item.imageUrl?.trim() || CONFIG.images.defaultIllustration;

  return (
    <div className="flex flex-col group border border-gray-200 rounded-xl overflow-hidden transition hover:shadow-md bg-white">
      <a href={item.workUrl} target="_blank" className="flex flex-col">
        <div className="relative aspect-video overflow-hidden">
          <img
            src={img}
            className="w-full h-full object-cover group-hover:scale-105 transition"
          />

          {future && showFutureBadge && (
            <span className="absolute top-2 left-2 bg-black/80 text-white text-xs px-2 py-1 rounded">
              予定
            </span>
          )}
        </div>

        <div className="flex flex-col mt-2 px-2 pb-2">
          {showDate && parsed && (
            <div className="flex flex-wrap gap-1 mb-1">
              {dayLabel && (
                <span
                  className={`text-xs font-bold px-2 py-0.5 rounded ${
                    dayLabel === "今日"
                      ? "bg-red-100 text-red-600"
                      : "bg-orange-100 text-orange-600"
                  }`}
                >
                  {dayLabel}
                </span>
              )}

              <span className="bg-blue-50 text-blue-700 text-xs px-2 py-0.5 rounded font-semibold">
                {parsed.label}
              </span>
            </div>
          )}

          <h2 className="text-sm font-bold leading-snug line-clamp-2 min-h-[2.8rem]">
            {item.title}
          </h2>

          <p className="text-xs text-gray-600 mt-1 truncate">
            {item.creator}
          </p>
        </div>
      </a>
    </div>
  );
}

/* =========================
   Skeleton
========================= */
function SkeletonCard() {
  return (
    <div className="flex flex-col border border-gray-200 rounded-xl overflow-hidden">
      <div className="aspect-video bg-gray-200 animate-pulse" />
      <div className="p-2 space-y-2">
        <div className="h-3 w-24 bg-gray-200 rounded animate-pulse" />
        <div className="h-4 bg-gray-200 rounded animate-pulse" />
        <div className="h-3 w-1/2 bg-gray-200 rounded animate-pulse" />
      </div>
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

  useEffect(() => {
    Promise.all([
      fetch("/api/derivative/streams").then((r) => r.json()),
      fetch("/api/derivative/streams/archive").then((r) => r.json()),
    ]).then(([s, a]) => {
      setSchedule(s);
      setArchive(a);
      setLoading(false);
    });
  }, []);

  const sorted = useMemo(() => {
    return [...schedule].sort(
      (a, b) =>
        (parseDate(a.publishedAt)?.raw?.getTime() || 0) -
        (parseDate(b.publishedAt)?.raw?.getTime() || 0)
    );
  }, [schedule]);

  /* =========================
     カレンダー
  ========================= */
  const today = new Date();

  const calendar = useMemo(() => {
    const map = new Map();

    sorted.forEach((item, i) => {
      const d = parseDate(item.publishedAt)?.raw;
      if (!d) return;

      const key = `${d.getFullYear()}-${d.getMonth()}`;

      if (!map.has(key)) {
        map.set(key, {
          year: d.getFullYear(),
          month: d.getMonth(),
          days: new Map(),
        });
      }

      map.get(key).days.set(d.getDate(), i);
    });

    return [...map.values()];
  }, [sorted]);

  const scrollTo = (i: number) => {
    const el = scrollRef.current?.children[i] as HTMLElement;
    if (!el || !scrollRef.current) return;

    scrollRef.current.scrollTo({
      left: el.offsetLeft - 16,
      behavior: "smooth",
    });
  };

  const scrollBy = (dir: number) => {
    scrollRef.current?.scrollBy({
      left: dir * 260,
      behavior: "smooth",
    });
  };

  return (
    <div className="p-4 sm:p-6 flex flex-col items-center">
      <div className="w-full max-w-6xl space-y-10">

        {/* 予定 */}
        <div>
          <h2 className="text-xl font-bold mb-4">紹介配信予定</h2>

          {!loading && sorted.length > 0 && (
            <>
              {/* カレンダー */}
              <div className="flex gap-4 overflow-x-auto mb-6">
                {calendar.map((m: any, idx) => {
                  const { year, month, days } = m;
                  const last = new Date(year, month + 1, 0).getDate();

                  return (
                    <div key={idx} className="min-w-[220px] border rounded-xl p-3">
                      <div className="text-sm font-semibold text-center mb-2">
                        {year}/{month + 1}
                      </div>

                      <div className="grid grid-cols-7 gap-1 text-xs">
                        {Array.from({ length: last }, (_, i) => {
                          const d = i + 1;
                          const index = days.get(d);

                          const dateObj = new Date(year, month, d);
                          const isToday = isSameDay(dateObj, today);

                          return (
                            <button
                              key={d}
                              onClick={() =>
                                index !== undefined && scrollTo(index)
                              }
                              className={`h-7 rounded flex items-center justify-center
                                ${index !== undefined ? "bg-blue-100 hover:bg-blue-200" : ""}
                                ${isToday ? "ring-2 ring-blue-400 font-bold" : ""}
                              `}
                            >
                              {d}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* 横スクロール */}
              <div className="flex gap-4 overflow-x-auto" ref={scrollRef}>
                {sorted.map((item, i) => (
                  <div key={i} className="w-1/2 sm:w-[240px] flex-shrink-0">
                    <Card item={item} />
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

      </div>
    </div>
  );
}