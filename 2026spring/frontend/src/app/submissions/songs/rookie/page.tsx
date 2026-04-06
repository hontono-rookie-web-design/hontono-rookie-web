import VideoCard from "@/components/video/VideoCard"

async function getVideos() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/videos`, {
    cache: "no-store"
  })

  if (!res.ok) {
    console.error("API error:", res.status)
    return []
  }

  const data = await res.json()
  return Array.isArray(data) ? data : []
}

export default async function Page() {
  const videos = await getVideos()

  return (
    <main style={{ padding: "40px" }}>
      <h1>楽曲一覧（ルーキー）</h1>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
        gap: "20px"
      }}>
        {videos.map((video: any, index: number) => (
          <VideoCard key={index} video={video} />
        ))}
      </div>
    </main>
  )
}
