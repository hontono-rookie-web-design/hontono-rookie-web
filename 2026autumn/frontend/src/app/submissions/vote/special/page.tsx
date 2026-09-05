import { Suspense } from "react";
import VoteContent from "./VoteContent";
import { fetchVideosSheet, fetchVotesSheet } from "@/lib/fetchSheet";
import { CONFIG } from "@/config/config";
import { getCurrentPhaseSp, EVENT_PHASES_SP } from "@/config/phase";

export default async function Page() {
  const currentPhase = getCurrentPhaseSp();
  const [songs, forms] = await Promise.all([
    fetchVideosSheet(CONFIG.videosheets.status.sp.name, CONFIG.videosheets.stage.sp),
    fetchVotesSheet(CONFIG.voteformssheets.sp.name),
  ]);

  return (
    <Suspense fallback={<div className="p-4">Loading...</div>}>
      <VoteContent initialSongs={songs} initialForms={forms} initialPhase={currentPhase} />
    </Suspense>
  );
}
