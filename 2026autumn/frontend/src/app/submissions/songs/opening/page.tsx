import VideoList from "./VideoList"
import { CONFIG } from "@/config/config"
import { fetchVideosSheet } from "@/lib/fetchSheet"


export default async function Page() {
  const rawVideos = await fetchVideosSheet(
    CONFIG.videosheets.op.name
  )

  const mappedVideos = rawVideos.map((item) => ({
    title: item.title,
    author: item.creator, // creator を author にマッピング
    videoUrl: item.videoUrl,
    thumbnailUrl: item.thumbnailUrl,
    publishedAt: item.publishedAt,
    description: item.description
  }))

  return <VideoList initialData={mappedVideos} />
}
