"use client"

import { useEffect, useState } from "react"
import { CONFIG } from "@/config/config"
import { getCurrentPhase, EVENT_PHASES } from "@/config/phase"
import TBA from "@/components/TBA"

type Video = {
  title: string
  author: string
  videoUrl: string
  thumbnailUrl: string
  publishedAt?: string
  description?: string
}

/* =========================
   表示フェーズ定義（安全化）
========================= */
const VIEW_PHASE = {
  BEFORE: "before",
  DURING: "during",
} as const

function getViewPhase(phase: string) {
  switch (phase) {
    case EVENT_PHASES.BEFORE:
    case EVENT_PHASES.OPENING:
      return VIEW_PHASE.BEFORE

    case EVENT_PHASES.ROOKIE:
    case EVENT_PHASES.PRELIM:
    case EVENT_PHASES.SEMIFINAL:
    case EVENT_PHASES.FINAL:
    case EVENT_PHASES.AFTER:
      return VIEW_PHASE.DURING

    default:
      return VIEW_PHASE.BEFORE
  }
}

/* =========================
   日付パース
========================= */
function parseDate(dateStr?: string) {
  if (!dateStr) return 0
  return new Date(dateStr).getTime()
}

/* =========================
   シャッフル
========================= */
function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array]
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

export default function Page() {
  const [data, setData] = useState<Video[]>([])
  const [displayData, setDisplayData] = useState<Video[]>([])
  const [loading, setLoading] = useState(true)

  const [searchText, setSearchText] = useState("")
  const [sortType, setSortType] = useState<"new" | "old">("new")
  const [isRandom, setIsRandom] = useState(false)

  const phase = getCurrentPhase()
  const viewPhase = getViewPhase(phase)  

  /* =========================
     初期ロード（旧API）
  ========================= */
  useEffect(() => {
    fetch("/api/submissions/songs/extra")
      .then(res => res.json())
      .then(res => {
        const mapped = res.map((item: any) => ({
          title: item.title,
          author: item.creator,
          videoUrl: item.videoUrl,
          thumbnailUrl: item.thumbnailUrl,
          publishedAt: item.publishedAt,
          description: item.description
        }))
        setData(mapped)
        setLoading(false)
      })
  }, [])

  /* =========================
     フィルタ + ソート
  ========================= */
  useEffect(() => {
    if (data.length === 0) return
    if (isRandom) return

    let filtered = [...data]

    if (searchText.trim()) {
      const q = searchText.toLowerCase()
      filtered = filtered.filter(v =>
        (v.title + v.author).toLowerCase().includes(q)
      )
    }

    if (sortType === "new") {
      filtered.sort((a, b) => parseDate(b.publishedAt) - parseDate(a.publishedAt))
    } else {
      filtered.sort((a, b) => parseDate(a.publishedAt) - parseDate(b.publishedAt))
    }

    setDisplayData(filtered)
  }, [data, searchText, sortType, isRandom])

  /* =========================
     ランダム
  ========================= */
  const handleShuffle = () => {
    let base = [...data]

    if (searchText.trim()) {
      const q = searchText.toLowerCase()
      base = base.filter(v =>
        (v.title + v.author).toLowerCase().includes(q)
      )
    }

    setDisplayData(shuffleArray(base))
    setIsRandom(true)
  }

  /* =========================
     ソート変更
  ========================= */
  const handleSortChange = (val: "new" | "old") => {
    setSortType(val)
    setIsRandom(false)
  }

  /* =========================
     検索変更
  ========================= */
  const handleSearchChange = (val: string) => {
    setSearchText(val)
    setIsRandom(false)
  }

  /* =========================
        BEFORE
    ========================= */
  if (viewPhase === VIEW_PHASE.BEFORE) {
    return <TBA title={`楽曲一覧 exステージ`} />
  }

  return (
    <main className="flex justify-center">
      <div className="w-full max-w-6xl px-4 py-6">

        {/* ヘッダー */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold leading-tight">
            楽曲一覧 exステージ
          </h1>

          <p className="text-sm text-gray-500 mt-1">
            「{CONFIG.event.name}」のexステージ参加楽曲を掲載しています。
          </p>

          <div className="mt-4 border-b border-gray-200 w-full" />
        </div>

        {/* 操作バー */}
        {!loading && (
          <div className="flex flex-col gap-3 mb-4">

            {/* 上段：検索（左寄せ） */}
            <div className="flex justify-start">
              <input
                type="text"
                placeholder="検索（タイトル・投稿者）"
                value={searchText}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="w-full sm:w-72 border rounded px-3 py-1.5 text-sm"
              />
            </div>

            {/* 下段：ソート + ボタン */}
            <div className="flex items-center justify-between">

              <div className="flex items-center gap-2">
                <select
                  value={isRandom ? "random" : sortType}
                  onChange={(e) => {
                    const val = e.target.value
                    if (val === "random") return
                    handleSortChange(val as "new" | "old")
                  }}
                  className="border rounded px-2 py-1 text-sm"
                >
                  {isRandom && <option value="random">ランダム</option>}
                  <option value="new">新しい順</option>
                  <option value="old">古い順</option>
                </select>

                <button
                  onClick={handleShuffle}
                  className="px-3 py-1 text-sm rounded border bg-gray-100 hover:bg-gray-200 active:scale-95 transition"
                >
                  ランダムに並び替え
                </button>
              </div>

              <div className="text-sm text-gray-600">
                {displayData.length}件
              </div>
            </div>
          </div>
        )}

        {/* ローディング */}
        {loading && (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="flex flex-col border border-gray-200 rounded-xl overflow-hidden"
              >
                <div className="aspect-video bg-gray-200 animate-pulse" />

                <div className="p-2 space-y-2">
                  <div className="h-3 w-24 bg-gray-200 rounded animate-pulse" />
                  <div className="h-4 bg-gray-200 rounded animate-pulse" />
                  <div className="h-3 w-1/2 bg-gray-200 rounded animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 空 */}
        {!loading && displayData.length === 0 && (
          <div className="text-center py-20 text-gray-600">
            該当する楽曲がありません。
          </div>
        )}

        {/* グリッド */}
        {!loading && displayData.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {displayData.map((video, i) => (
              <div
                key={i}
                className="flex flex-col group border border-gray-200 rounded-xl overflow-hidden transition hover:shadow-md"
              >
                <a href={video.videoUrl} target="_blank" className="flex flex-col">

                  {/* サムネ */}
                  <div className="relative aspect-video overflow-hidden">
                    <img
                      src={video.thumbnailUrl}
                      className="w-full h-full object-cover transition group-hover:scale-105"
                    />
                  </div>

                  {/* テキスト */}
                  <div className="flex flex-col mt-2 px-2 pb-2">
                    <h2 className="text-sm font-bold leading-snug line-clamp-2 min-h-[2.8rem] group-hover:underline">
                      {video.title}
                    </h2>

                    <p className="text-xs text-gray-600 mt-1 truncate">
                      {video.author}
                    </p>
                  </div>

                </a>
              </div>
            ))}
          </div>
        )}

      </div>
    </main>
  )
}