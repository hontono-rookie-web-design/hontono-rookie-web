import { Suspense } from "react"
import VoteContent from "./VoteContent"
import { getFinalSongs, getFinalForms, getFinalRanks } from "@/lib/votes"

export default async function Page() {
  const [songs,forms,ranks] = await Promise.all([
    getFinalSongs(),
    getFinalForms(),
    getFinalRanks(),
  ]) 

  return (
    <Suspense fallback={<div className="p-4">Loading...</div>}>
      <VoteContent 
        initialSongs={songs}
        initialForms={forms}
        initialRanks={ranks}
      />
    </Suspense>
  )
}