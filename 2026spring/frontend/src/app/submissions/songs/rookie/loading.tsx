import VideoCardSkeleton from "@/components/video/VideoCardSkeleton"
import styles from "@/components/video/VideoCard.module.css"

export default function Loading() {
  return (
    <div className={styles.grid}>
      {Array.from({ length: 6 }).map((_, i) => (
        <VideoCardSkeleton key={i} />
      ))}
    </div>
  )
}
