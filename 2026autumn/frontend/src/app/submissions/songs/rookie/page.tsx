import { CONFIG } from "@/config/config";
import { getCurrentPhase } from "@/config/phase";
import { fetchVideosSheet } from "@/lib/fetchSheet";
import VideoList from "./VideoList";

export default async function Page() {
  const currentPhase = getCurrentPhase();
  const rawVideos = await fetchVideosSheet(CONFIG.videosheets.status.rookie.name);

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
