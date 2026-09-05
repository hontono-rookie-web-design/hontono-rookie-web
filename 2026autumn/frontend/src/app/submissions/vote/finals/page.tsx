import { CONFIG } from "@/config/config";
import { getCurrentPhase } from "@/config/phase";
import { fetchVideosSheet, fetchVotesSheet } from "@/lib/fetchSheet";
import { Suspense } from "react";
import VoteContent from "./VoteContent";

export default async function Page() {
  const currentPhase = getCurrentPhase();
  const [songs, forms] = await Promise.all([
    fetchVideosSheet(CONFIG.videosheets.status.rookie.name, CONFIG.videosheets.stage.finals),
    fetchVotesSheet(CONFIG.voteformssheets.finals.name),
  ]);

  return (
    <Suspense fallback={<div className="p-4">Loading...</div>}>
      <VoteContent initialSongs={songs} initialForms={forms} initialPhase={currentPhase} />
    </Suspense>
  );
}
