import { Suspense } from "react"
import VoteContent from "./VoteContent"
import { getPreliminarySongs } from "@/lib/votes"

export default async function Page() {
  // songsデータだけサーバーサイドで事前に取得
  const initialSongs = await getPreliminarySongs();

  return (
    <Suspense fallback={<div className="p-4">Loading...</div>}>
      {/* 楽曲データだけ先に渡す */}
      <VoteContent initialSongs={initialSongs} />
    </Suspense>
  )
}