import { CONFIG } from "@/config/config";
import { getCurrentPhaseSp } from "@/config/phase";
import { fetchVideosSheet } from "@/lib/fetchSheet";
import VideoList from "./VideoList";

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
