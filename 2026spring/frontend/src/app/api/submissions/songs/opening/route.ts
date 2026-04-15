export async function GET() {
  const res = await fetch(
    "https://docs.google.com/spreadsheets/d/12g05mItiwZ9v7htUAhRcqweLKGyIePRGFecc41_n990/edit?gid=2032122122#gid=2032122122"
  )

  const data = await res.json()

  const videos = data.map((row: any) => ({
    title: row["タイトル"],
    author: row["投稿者名"],
    videoUrl: row["URL"],
    thumbnailUrl: row["サムネイルURL"]
  }))

  return new Response(JSON.stringify(videos), {
    headers: {
      "Content-Type": "application/json; charset=utf-8"
    }
  })
}
