"use client"

import { useEffect, useMemo, useState } from "react"
import { CONFIG } from "@/config/config"
import { getCurrentPhase, EVENT_PHASES } from "@/config/phase"
import TBA from "@/components/TBA"

/* =========================
   表示ラベル
========================= */
const PHASE_LABEL = "exステージ"

/* =========================
   表示フェーズ定義
========================= */
const VIEW_PHASE = {
  BEFORE: "before",
  DURING: "during",
  AFTER: "after",
} as const

function getViewPhase(phase: string) {
  switch (phase) {
    case EVENT_PHASES.BEFORE:
    case EVENT_PHASES.OPENING:
    case EVENT_PHASES.ROOKIE:
    case EVENT_PHASES.PRELIM:
    case EVENT_PHASES.SEMIFINAL:
      return VIEW_PHASE.BEFORE

    case EVENT_PHASES.FINAL:
      return VIEW_PHASE.DURING

    case EVENT_PHASES.AFTER:
      return VIEW_PHASE.AFTER

    default:
      return VIEW_PHASE.BEFORE
  }
}

/* =========================
   型
========================= */
type Video = {
  title: string
  creator: string
  videoUrl: string
  thumbnailUrl: string
  publishedAt?: string
  description?: string
  videoId?: string
}

type Vote = {
  formUrl?: string
  mylistUrl?: string
  deadline?: string
}

type Rank = {
  videoId: string
  rank: number
}

/* =========================
   util
========================= */
function formatDate(dateStr?: string) {
  if (!dateStr) return ""
  const d = new Date(dateStr)
  if (isNaN(d.getTime())) return ""

  return `${d.getFullYear()}/${String(d.getMonth() + 1).padStart(2, "0")}/${String(d.getDate()).padStart(2, "0")} ${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`
}

function cleanDescription(text?: string) {
  if (!text) return ""
  return text.replace(/<br\s*\/?>/gi, " ").replace(/\n/g, " ").trim()
}

function medalClass(rank: number) {
  if (rank === 1) return "bg-yellow-100"
  if (rank === 2) return "bg-gray-200"
  if (rank === 3) return "bg-orange-100"
  return "bg-gray-100"
}

/* =========================
   Skeleton
========================= */
function SkeletonCard() {
  return (
    <div className="w-full max-w-[900px] rounded-xl bg-white p-4 shadow-sm">
      <div className="flex gap-4">
        <div className="w-40 h-24 bg-gray-200 rounded animate-pulse" />
        <div className="flex flex-col flex-1 gap-2">
          <div className="h-5 bg-gray-200 rounded w-3/4 animate-pulse" />
          <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse" />
          <div className="h-3 bg-gray-200 rounded w-24 animate-pulse" />
          <div className="h-4 bg-gray-200 rounded w-full animate-pulse" />
        </div>
      </div>
    </div>
  )
}

/* =========================
   Page
========================= */
export default function Page() {
  const phase = getCurrentPhase()
  const viewPhase = getViewPhase(phase)

  const [videos, setVideos] = useState<Video[]>([])
  const [vote, setVote] = useState<Vote | null>(null)
  const [ranks, setRanks] = useState<Rank[]>([])
  const [loading, setLoading] = useState(true)

  /* =========================
     fetch
  ========================= */
  useEffect(() => {
    Promise.all([
      fetch("/api/submissions/vote/extra/songs").then(r => r.json()),
      fetch("/api/submissions/vote/extra/forms").then(r => r.json()),
      fetch("/api/submissions/vote/extra/ranks").then(r => r.json()),
    ]).then(([videoRes, voteRes, rankRes]) => {

      const mappedVideos: Video[] = videoRes.map((v: any) => ({
        title: v.title,
        creator: v.creator,
        videoUrl: v.videoUrl,
        thumbnailUrl: v.thumbnailUrl,
        publishedAt: v.publishedAt,
        description: v.description,
        videoId: v.videoId,
      }))

      setVideos(mappedVideos)
      setVote(voteRes?.[0] ?? null)
      setRanks(rankRes)

      setLoading(false)
    })
  }, [])

  const rankedVideos = useMemo(() => {
    return [...ranks]
      .sort((a, b) => a.rank - b.rank)
      .map(r => {
        const video = videos.find(v => v.videoId === r.videoId)
        if (!video) return null
        return { ...r, video }
      })
      .filter((v): v is { rank: number; video: Video } => v !== null)
  }, [ranks, videos])

  /* =========================
     BEFORE
  ========================= */
  if (viewPhase === VIEW_PHASE.BEFORE) {
    return <TBA title={`人気投票 ${PHASE_LABEL}`} />
  }

  return (
    <div className="p-4 sm:p-6 flex flex-col items-center">

      {/* TITLE */}
      <div className="text-center mb-6 w-full max-w-[900px]">
        <h1 className="text-3xl md:text-4xl font-bold">
          人気投票 {PHASE_LABEL}
        </h1>

        <p className="text-sm text-gray-600 mt-2">
          「本当のルーキー祭り2026春」{PHASE_LABEL}の楽曲を掲載しています。
        </p>

        {viewPhase === VIEW_PHASE.DURING && vote?.deadline && (
          <p className="mt-2 text-sm font-semibold text-red-600">
            投票締切：{formatDate(vote.deadline)}
          </p>
        )}

        {viewPhase === VIEW_PHASE.AFTER && (
          <p className="mt-2 text-sm font-semibold text-gray-700">
            人気投票は終了しました
          </p>
        )}

        <div className="mt-4 border-b border-gray-200 w-full" />
      </div>

      {/* RANK */}
      {viewPhase === VIEW_PHASE.AFTER && rankedVideos.length > 0 && (
        <div className="w-full max-w-[900px] mb-6">

          <h2 className="font-bold mb-2">
            人気投票結果
          </h2>

          <div className="grid grid-cols-[60px_60px_1fr_160px] text-sm mb-1 font-semibold text-gray-600">
            <div>順位</div>
            <div></div>
            <div>タイトル</div>
            <div>投稿者</div>
          </div>

          <div className="flex flex-col gap-1">
            {rankedVideos.map(({ rank, video }) => (
              <a
                key={video.videoId}
                href={video.videoUrl}
                target="_blank"
                className={`
                  group grid grid-cols-[60px_60px_1fr_160px]
                  items-center gap-2 px-2 py-1 rounded
                  transition-all duration-200
                  hover:shadow-md hover:-translate-y-[1px]
                  ${medalClass(rank)}
                `}
              >
                <div className={`text-center font-bold ${rank <= 3 ? "text-lg" : ""}`}>
                  {rank}
                </div>

                <div className="overflow-hidden rounded">
                  <img
                    src={video.thumbnailUrl}
                    className="w-12 h-8 object-cover transition-transform duration-200 group-hover:scale-105"
                  />
                </div>

                <div className="truncate group-hover:underline">
                  {video.title}
                </div>

                <div className="truncate">
                  {video.creator}
                </div>
              </a>
            ))}
          </div>
        </div>
      )}

      {/* BUTTONS */}
      <div className="flex flex-wrap gap-3 mb-6 justify-center">

        {viewPhase === VIEW_PHASE.DURING && vote?.formUrl && (
          <a
            href={vote.formUrl}
            target="_blank"
            className="px-6 py-2 rounded bg-blue-500 text-white text-sm"
          >
            人気投票はこちら
          </a>
        )}

        {vote?.mylistUrl && (
          <a
            href={vote.mylistUrl}
            target="_blank"
            className="px-6 py-2 rounded bg-red-400 text-white text-sm"
          >
            {PHASE_LABEL}楽曲マイリストはこちら
          </a>
        )}

        <a
          href={CONFIG.links.voteGuide}
          target="_blank"
          className="px-6 py-2 rounded bg-gray-500 text-white text-sm"
        >
          人気投票の詳細はこちら
        </a>

      </div>

      {/* LIST */}
      {loading ? (
        <div className="flex flex-col gap-6 items-center w-full">
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-6 items-center w-full">
          {videos.map((item, i) => (
            <a
              key={i}
              href={item.videoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="
                group w-full max-w-[900px]
                rounded-xl bg-white p-4 shadow-sm
                transition-all duration-200
                hover:shadow-md hover:-translate-y-[1px]
                block
              "
            >
              <div className="flex gap-4">

                <div className="overflow-hidden rounded">
                  <img
                    src={item.thumbnailUrl}
                    className="w-40 h-24 object-cover transition-transform duration-200 group-hover:scale-105"
                  />
                </div>

                <div className="flex flex-col flex-1 min-w-0">
                  <h2 className="font-bold line-clamp-2 group-hover:underline">
                    {item.title}
                  </h2>

                  <p className="text-sm text-gray-700 truncate">
                    {item.creator}
                  </p>

                  <p className="text-xs text-gray-500">
                    {formatDate(item.publishedAt)}
                  </p>

                  <p className="text-sm text-gray-600 mt-2 line-clamp-2 break-words">
                    {cleanDescription(item.description)}
                  </p>
                </div>

              </div>
            </a>
          ))}
        </div>
      )}

    </div>
  )
}