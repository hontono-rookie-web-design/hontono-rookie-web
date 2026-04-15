import VideoCard from "@/components/video/VideoCard"
import styles from "@/components/video/VideoCard.module.css"

async function getVideos() {
  try {
    const res = await fetch(
      "https://opensheet.elk.sh/12g05mItiwZ9v7htUAhRcqweLKGyIePRGFecc41_n990/ex",
      { cache: "no-store" }
    )

    if (!res.ok) return []

    const data = await res.json()

    return data.map((row: any) => ({
      title: row["タイトル"],
      author: row["投稿者名"],
      videoUrl: row["URL"],
      thumbnailUrl: row["サムネイルURL"]
    }))
  } catch (e) {
    console.error(e)
    return []
  }
}

export default async function Page() {
  const videos = await getVideos()

  return (
  <main style={{ padding: "40px" }}>
    <div className={styles.container}>
      
      <h1 className={styles.titleMain}>
        楽曲一覧（EXステージ）
      </h1>

      <div className={styles.grid}>
        {videos.map((video: any, index: number) => (
          <VideoCard key={index} video={video} />
        ))}
      </div>

    </div>
  </main>
  )
}
