import VideoCard from "@/components/video/VideoCard"

async function getVideos() {
  const res = await fetch("http://localhost:3000/api/videos", {
    cache: "no-store"
  })
  return res.json()
}

export default async function VideosPage() {
  const videos = await getVideos()

  return (
    <main style={{ padding: "40px" }}>
      <h1 style={{ marginBottom: "30px" }}>動画一覧</h1>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
        gap: "20px"
      }}>
        {videos.map((video: any, index: number) => (
          <VideoCard key={index} video={video} />
        ))}
      </div>
    </main>
  )
}
