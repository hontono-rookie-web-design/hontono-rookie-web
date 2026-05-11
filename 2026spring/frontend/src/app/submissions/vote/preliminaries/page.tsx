import { Suspense } from "react"
import VoteContent from "./VoteContent"
import { getPreliminarySongs, getPreliminaryForms, getPreliminaryRanks } from "@/lib/votes"

export default async function Page() {
  // songsデータだけサーバーサイドで事前に取得
  const [songs,forms,ranks] = await Promise.all([
    getPreliminarySongs(),
    getPreliminaryForms(),
    getPreliminaryRanks(),
  ]) 

  return (
    <Suspense fallback={<div className="p-4">Loading...</div>}>
      {/* 楽曲データだけ先に渡す */}
      <VoteContent 
        initialSongs={songs}
        initialForms={forms}
        initialRanks={ranks}
      />
    </Suspense>
  )
}