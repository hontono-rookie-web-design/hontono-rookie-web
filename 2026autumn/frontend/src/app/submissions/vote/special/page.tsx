import { Suspense } from "react";
import VoteContent from "./VoteContent";
import { fetchVideosSheet, fetchVotesSheet } from "@/lib/fetchSheet";
import { CONFIG } from "@/config/config";

export default async function Page() {
  const [songs, forms] = await Promise.all([
    fetchVideosSheet(CONFIG.videosheets.status.sp.name, CONFIG.videosheets.stage.sp),
    fetchVotesSheet(CONFIG.voteformssheets.sp.name),
  ]);

  return (
    <Suspense fallback={<div className="p-4">Loading...</div>}>
      <VoteContent initialSongs={songs} initialForms={forms} />
    </Suspense>
  );
}
