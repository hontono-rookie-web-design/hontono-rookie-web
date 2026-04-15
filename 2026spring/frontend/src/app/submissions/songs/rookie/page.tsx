import VideoCard from "@/components/video/VideoCard"
import styles from "@/components/video/VideoCard.module.css"

async function getVideos() {
  try {
    const res = await fetch(
      "https://opensheet.elk.sh/12g05mItiwZ9v7htUAhRcqweLKGyIePRGFecc41_n990/rookie",
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
 　<main>
    <div className={styles.container}>
      
      <div className={styles.titleWrapper}>
 　　　　 <h1 className={styles.titleMain}>
  　　　  　楽曲一覧　ルーキー
  　　　　</h1>
 　　　 　<p className={styles.subtitle}>
   　 　　「本当のルーキー祭り2026春」のルーキー参加楽曲を掲載しています。
 　　　 　</p>
　　　　</div>

      <div className={styles.grid}>
        {videos.map((video: any, index: number) => (
          <VideoCard key={index} video={video} />
        ))}
      </div>

    </div>
  </main>
  )
}
