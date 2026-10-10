import TBA from "@/components/TBA";
import VideoList, { type VideoListItem } from "@/components/video/VideoList";
import { CONFIG } from "@/config/config";
import { EVENT_PHASES_SP, getCurrentPhaseSp } from "@/config/phase";
import { fetchVideosSheet } from "@/lib/fetchSheet";

export const dynamic = "force-static";
export const revalidate = false;

const TITLE = "楽曲一覧 SPステージ";

function isBeforePhase(phase: string) {
  switch (phase) {
    case EVENT_PHASES_SP.BEFORE:
      return true;
    default:
      return false;
  }
}

export default async function Page() {
  // 公開前はデータを取得・送信せずに TBA を表示する
  if (isBeforePhase(getCurrentPhaseSp())) {
    return <TBA title={TITLE} />;
  }

  const rawVideos = await fetchVideosSheet(CONFIG.videosheets.status.sp.name);

  // クライアントには表示に必要な項目のみを渡す
  const videos: VideoListItem[] = rawVideos.map((item) => ({
    title: item.title,
    author: item.creator,
    videoUrl: item.videoUrl,
    thumbnailUrl: item.thumbnailUrl,
    publishedAt: item.publishedAt,
  }));

  return (
    <main className="flex justify-center">
      <div className="w-full max-w-6xl px-4 py-6">
        {/* ヘッダー */}

        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold leading-tight">{TITLE}</h1>

          <p className="text-sm text-gray-500 mt-1">
            「{CONFIG.event.name}
            」のSPステージ参加楽曲を掲載しています。
          </p>

          <div className="mt-4 border-b border-gray-200 w-full" />
        </div>

        <VideoList videos={videos} emptyMessage="SPステージ楽曲はまだありません。" />
      </div>
    </main>
  );
}
