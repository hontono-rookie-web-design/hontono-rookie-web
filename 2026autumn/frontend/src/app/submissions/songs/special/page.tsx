import VideoList from "./VideoList";
import { CONFIG } from "@/config/config";
import { fetchVideosSheet } from "@/lib/fetchSheet";
import { getCurrentPhaseSp, EVENT_PHASES_SP } from "@/config/phase";

export default async function Page() {
  const currentPhase = getCurrentPhaseSp();
  const rawVideos = await fetchVideosSheet(CONFIG.videosheets.status.sp.name);

  const mappedVideos = rawVideos.map((item) => ({
    title: item.title,
    author: item.creator, // creator を author にマッピング
    videoUrl: item.videoUrl,
    thumbnailUrl: item.thumbnailUrl,
    publishedAt: item.publishedAt,
    description: item.description,
  }));

  return <VideoList initialData={mappedVideos} initialPhase={currentPhase} />;
}
