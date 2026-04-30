import { Suspense } from "react"
import VoteContent from "./VoteContent"

export default function Page() {
  return (
    <Suspense fallback={<div className="p-4">Loading...</div>}>
      <VoteContent />
    </Suspense>
  )
}