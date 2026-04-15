"use client"

import { useEffect, useState } from "react"

type Video = {
  title: string
  author: string
  videoUrl: string
  thumbnailUrl: string
}

export default function Page() {
  const [videos, setVideos] = useState<Video[]>([])
  const [loading, setLoading] = useState(true)
  const [searchText, setSearchText] = useState("")
  const [sortType, setSortType] = useState("new")
  const filteredVideos = videos
  .filter(video => {
  const q = searchText.toLowerCase()
    return (
      video.title.toLowerCase().includes(q) ||
      video.author.toLowerCase().includes(q)
    )
  })
  .sort((a, b) => {
    if (sortType === "new") return 0 // 今は日付ないのでそのまま
    if (sortType === "title") return a.title.localeCompare(b.title, "ja")
    if (sortType === "author") return a.author.localeCompare(b.author, "ja")
    return 0
  })

  useEffect(() => {
    fetch("https://opensheet.elk.sh/12g05mItiwZ9v7htUAhRcqweLKGyIePRGFecc41_n990/rookie")
      .then(res => res.json())
      .then(data => {
        const mapped = data.map((row: any) => ({
          title: row["タイトル"],
          author: row["投稿者名"],
          videoUrl: row["URL"],
          thumbnailUrl: row["サムネイルURL"]
        }))
        setVideos(mapped)
        setLoading(false)
      })
  }, [])

  return (
    <main className="flex justify-center">
      <div className="w-full max-w-6xl px-4 py-6">

        {/* ヘッダー */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold leading-tight">
            楽曲一覧 ルーキー
          </h1>

          <p className="text-sm text-gray-500 mt-1">
            「本当のルーキー祭り2026春」のルーキー参加楽曲を掲載しています。
          </p>

          <div className="mt-4 border-b border-gray-200 w-full" />
        </div>

       <div className="w-full mb-4 flex flex-col sm:flex-row gap-3 sm:items-center">

 　　　 {/* 検索 */}
 　　　　 <input
 　　　   type="text"
        placeholder="検索（タイトル・投稿者）"
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        className="border rounded px-3 py-1 text-sm w-full sm:w-64"
        />

 　　　 {/* 並び替え */}
 　　　 <select
       value={sortType}
       onChange={(e) => setSortType(e.target.value)}
       className="border rounded px-2 py-1 text-sm w-full sm:w-40"
 　　　　 >
  　  <option value="new">おすすめ順</option>
   　 <option value="title">タイトル順</option>
   　 <option value="author">投稿者順</option>
 　　 </select>

     </div>

        {/* ローディング */}
        {loading && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="flex flex-col border border-gray-200 rounded-xl overflow-hidden"
              >
                <div className="aspect-video bg-gray-200 animate-pulse" />

                <div className="p-2 space-y-2">
                  <div className="h-3 w-24 bg-gray-200 rounded animate-pulse" />

                  <div className="space-y-1">
                    <div className="h-4 bg-gray-200 rounded animate-pulse" />
                    <div className="h-4 w-5/6 bg-gray-200 rounded animate-pulse" />
                  </div>

                  <div className="h-3 w-1/2 bg-gray-200 rounded animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 空状態 */}
        {!loading && videos.length === 0 && (
          <div className="text-center py-20 text-gray-600">
            楽曲はまだありません。
          </div>
        )}

        {/* グリッド */}
        {!loading && videos.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {filteredVideos.map((video, i) => (
              <div
                key={i}
                className="flex flex-col group border border-gray-200 rounded-xl overflow-hidden transition hover:shadow-md"
              >
                <a href={video.videoUrl} target="_blank" className="flex flex-col">

                  {/* サムネ */}
                  <div className="relative aspect-video overflow-hidden">
                    <img
                      src={video.thumbnailUrl}
                      className="w-full h-full object-cover transition group-hover:scale-105"
                    />
                  </div>

                  {/* テキスト */}
                  <div className="flex flex-col mt-2 px-2 pb-2">

                    {/* タイトル */}
                    <h2 className="mt-1 text-sm font-bold leading-snug line-clamp-2 min-h-[2.8rem] group-hover:underline">
                      {video.title}
                    </h2>

                    {/* 投稿者 */}
                    <p className="text-xs text-gray-600 mt-1 truncate min-h-[1rem]">
                      {video.author}
                    </p>

                  </div>
                </a>
              </div>
            ))}
          </div>
        )}

      </div>
    </main>
  )
}
