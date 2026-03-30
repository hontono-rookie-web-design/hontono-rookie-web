"use client"

import styles from "./VideoCard.module.css" 

type Video = {
  title: string
  author: string
  videoUrl: string
  thumbnailUrl: string
}

export default function VideoCard({ video }: { video: Video }) {
  return (
    <a href={video.videoUrl} target="_blank" rel="noopener noreferrer">
      <div className={styles.card}> 
        <img src={video.thumbnailUrl} className={styles.thumbnail} />

        <div className={styles.info}>
          <h3 className={styles.title}>{video.title}</h3>
          <p className={styles.author}>{video.author}</p>
        </div>
      </div>
    </a>
  )
}
