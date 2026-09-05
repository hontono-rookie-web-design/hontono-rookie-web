import { CONFIG } from "@/config/config";
import { fetchVideosSheet } from "@/lib/fetchSheet";
import { getCurrentPhase, EVENT_PHASES } from "@/config/phase";
import VideoList from "./VideoList";

export default async function Page() {
  const currentPhase = getCurrentPhase();
  const rawVideos = await fetchVideosSheet(CONFIG.videosheets.status.ex.name);

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
