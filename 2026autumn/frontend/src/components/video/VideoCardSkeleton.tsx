import styles from "./VideoCard.module.css"

export default function VideoCardSkeleton() {
  return (
    <div className={styles.card}>
      <div className={styles.skeletonThumbnail}></div>
      <div className={styles.skeletonText}></div>
      <div className={styles.skeletonTextSmall}></div>
    </div>
  )
}
