import Counting from "@/components/Counting";
import RandomGroupButton from "@/components/RandomGroupButton";
import TBA from "@/components/TBA";
import { CONFIG } from "@/config/config";
import { EVENT_PHASES, getCurrentPhase } from "@/config/phase";
import { fetchVideosSheet, fetchVotesSheet, type VideoSheetItem } from "@/lib/fetchSheet";
import { formatDate } from "@/lib/formatDate";
import Image from "next/image";
import Link from "next/link";

/* =========================
   表示ラベル
========================= */
const DISC_LABEL = "Disc";
const PHASE_LABEL = "予選";
const BASE_PATH = "/submissions/vote/preliminaries";

/* =========================
   表示フェーズ定義（安全化）
========================= */
const VIEW_PHASE = {
  BEFORE: "before",
  DURING: "during",
  AFTER: "after",
  COUNTING: "counting",
} as const;

function getViewPhase(phase: string) {
  switch (phase) {
    case EVENT_PHASES.BEFORE:
    case EVENT_PHASES.EXTRA:
    case EVENT_PHASES.ROOKIE:
      return VIEW_PHASE.BEFORE;

    case EVENT_PHASES.PRELIM:
      return VIEW_PHASE.DURING;

    case EVENT_PHASES.PRELIM_COUNTING:
      return VIEW_PHASE.COUNTING;

    case EVENT_PHASES.FINAL:
    case EVENT_PHASES.FINAL_COUNTING:
    case EVENT_PHASES.AFTER:
      return VIEW_PHASE.AFTER;

    default:
      return VIEW_PHASE.BEFORE;
  }
}

/* =========================
   型
========================= */
type Video = VideoSheetItem & { group: number };

/* =========================
   データ取得（サーバー側のみ）
========================= */
async function fetchVoteData() {
  const [songs, forms] = await Promise.all([
    fetchVideosSheet(CONFIG.videosheets.status.rookie.name, CONFIG.videosheets.stage.preliminaries),
    fetchVotesSheet(CONFIG.voteformssheets.preliminaries.name),
  ]);

  const videos = songs.filter((video): video is Video => video.group !== undefined);
  const groups = [...new Set(videos.map((v) => v.group))].sort((a, b) => a - b);

  return { videos, forms, groups };
}

export async function getGroups() {
  const { groups } = await fetchVoteData();
  return groups;
}

/* =========================
   util
========================= */
function cleanDescription(text?: string) {
  if (!text) return "";
  return text
    .replace(/<br\s*\/?>/gi, " ")
    .replace(/\n/g, " ")
    .trim();
}

function medalClass(rank: number) {
  if (rank === 1) return "bg-yellow-100";
  if (rank === 2) return "bg-gray-200";
  if (rank === 3) return "bg-orange-100";
  return "bg-gray-100";
}

/* =========================
   Page
========================= */
export default async function VoteContent({ group }: { group?: number }) {
  const viewPhase = getViewPhase(getCurrentPhase());

  /* =========================
     Counting
  ========================= */
  if (viewPhase === VIEW_PHASE.COUNTING) {
    return <Counting title={`人気投票 ${PHASE_LABEL}`} />;
  }

  /* =========================
     BEFORE
  ========================= */
  if (viewPhase === VIEW_PHASE.BEFORE) {
    return <TBA title={`人気投票 ${PHASE_LABEL}`} />;
  }

  const { videos, forms, groups } = await fetchVoteData();

  /* =========================
     group
  ========================= */
  const activeGroup = group !== undefined && groups.includes(group) ? group : (groups[0] ?? null);

  const displayVideos = activeGroup === null ? [] : videos.filter((v) => v.group === activeGroup);

  const voteInfo = forms.find((v) => v.group === activeGroup);

  // 結果発表後のみ、cutoff 以内の順位だけを扱う
  const rankedVideos =
    viewPhase === VIEW_PHASE.AFTER
      ? displayVideos
          .filter(
            (v): v is Video & { rank: number } =>
              v.rank !== undefined &&
              (CONFIG.ranking.prelim_cutoff === null || v.rank <= CONFIG.ranking.prelim_cutoff),
          )
          .sort((a, b) => a.rank - b.rank)
      : [];

  return (
    <div className="p-4 sm:p-6 flex flex-col items-center">
      {/* TITLE */}

      <div className="text-center mb-6 w-full max-w-[900px]">
        <h1 className="text-3xl md:text-4xl font-bold">人気投票 {PHASE_LABEL}</h1>

        <p className="text-sm text-gray-600 mt-2">
          「{CONFIG.event.name}」参加楽曲を
          {DISC_LABEL}
          ごとに掲載しています。
        </p>

        {viewPhase === VIEW_PHASE.DURING && voteInfo?.voteEndsAt && (
          <p className="mt-2 text-sm font-semibold text-red-600">
            投票締切：
            {formatDate(voteInfo.voteEndsAt)}
          </p>
        )}

        {viewPhase === VIEW_PHASE.AFTER && (
          <p className="mt-2 text-sm font-semibold text-gray-700">人気投票は終了しました</p>
        )}

        <div className="mt-4 border-b border-gray-200 w-full" />
      </div>
      {/* DISC SELECT */}

      <div className="w-full max-w-[900px]">
        {/* Discボタン群 */}

        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2 mb-2">
          {groups.map((g) => (
            <Link
              key={g}
              href={`${BASE_PATH}/${g}`}
              prefetch={false}
              scroll={false}
              className={`text-xs py-1 rounded-md border text-center
                ${activeGroup === g ? "bg-black text-white" : "bg-white text-gray-700"}
              `}
            >
              <span className="font-medium">{DISC_LABEL} </span>

              <span className="font-extrabold text-sm">{g}</span>
            </Link>
          ))}
        </div>
        {/* ランダムボタン（下中央） */}

        <div className="flex justify-center mb-4">
          <RandomGroupButton basePath={BASE_PATH} groups={groups} label={DISC_LABEL} />
        </div>
      </div>

      <div className="w-full max-w-[900px] border-b border-gray-200 mb-6" />
      {/* RANK */}

      {rankedVideos.length > 0 && (
        <div className="w-full max-w-[900px] mb-6">
          <h2 className="font-bold mb-2">
            {DISC_LABEL}
            {activeGroup}
            人気投票結果
          </h2>
          {/* ヘッダー */}

          <div
            className="
              grid
              grid-cols-[40px_56px_1fr_90px]
              sm:grid-cols-[60px_60px_1fr_160px]
              gap-2
              text-sm mb-1 font-semibold text-gray-600
            "
          >
            <div>順位</div>
            <div></div>
            <div>タイトル</div>
            <div>投稿者</div>
          </div>

          <div className="flex flex-col gap-1">
            {rankedVideos.map((video) => (
              <a
                key={video.videoId}
                href={video.videoUrl}
                target="_blank"
                className={`
                  group grid
                  grid-cols-[40px_56px_1fr_90px]
                  sm:grid-cols-[60px_60px_1fr_160px]
                  items-center gap-2 px-2 py-1 rounded
                  transition-all duration-200
                  hover:shadow-md hover:-translate-y-[1px]
                  ${medalClass(video.rank)}
                `}
              >
                {/* 順位 */}

                <div
                  className={`
                    text-center font-bold
                    text-base sm:text-lg
                    ${video.rank <= 3 ? "text-lg sm:text-xl" : ""}
                  `}
                >
                  {video.rank}
                </div>
                {/* サムネ */}

                <div className="overflow-hidden rounded relative w-14 h-10 sm:w-12 sm:h-8">
                  <Image
                    src={video.thumbnailUrl}
                    alt={video.title}
                    fill
                    sizes="56px"
                    className="object-cover transition-transform duration-200 group-hover:scale-105"
                    unoptimized
                  />
                </div>
                {/* タイトル */}

                <div
                  className="
                    text-sm sm:text-base
                    leading-tight
                    line-clamp-2 sm:line-clamp-1
                    break-words
                    group-hover:underline
                  "
                >
                  {video.title}
                </div>
                {/* 投稿者 */}
                <div className="truncate text-xs sm:text-base">{video.creator}</div>
              </a>
            ))}
          </div>
        </div>
      )}
      {/* BUTTONS */}

      <div className="flex flex-wrap gap-3 mb-6 justify-center">
        {viewPhase === VIEW_PHASE.DURING && voteInfo?.formUrl && voteInfo.formUrl !== "NaN" && (
          <a
            href={voteInfo.formUrl}
            target="_blank"
            className="
              px-6 py-2 rounded
              bg-blue-500 text-white text-sm
              min-w-[260px]
              text-center
            "
          >
            {DISC_LABEL}
            {activeGroup}
            の人気投票はこちら
          </a>
        )}

        {voteInfo?.mylistUrl && voteInfo.mylistUrl !== "NaN" && (
          <a
            href={voteInfo.mylistUrl}
            target="_blank"
            className="
              px-6 py-2 rounded
              bg-red-400 text-white text-sm
              min-w-[260px]
              text-center
            "
          >
            {DISC_LABEL}
            {activeGroup}
            楽曲マイリストはこちら
          </a>
        )}
      </div>
      {/* LIST */}

      <div className="flex flex-col gap-6 items-center w-full">
        {displayVideos.map((item) => (
          <a
            key={item.videoId}
            href={item.videoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="
              group w-full max-w-[900px]
              rounded-xl bg-white p-4 shadow-sm
              transition-all duration-200
              hover:shadow-md hover:-translate-y-[1px]
              block
            "
          >
            <div className="flex gap-4">
              <div className="overflow-hidden rounded relative w-40 h-24">
                <Image
                  src={item.thumbnailUrl}
                  alt={item.title}
                  fill
                  sizes="160px"
                  className="object-cover group-hover:scale-105"
                  unoptimized
                />
              </div>

              <div className="flex flex-col flex-1 min-w-0">
                <h2 className="font-bold line-clamp-2 group-hover:underline">{item.title}</h2>
                <p className="text-sm text-gray-700 truncate">{item.creator}</p>

                <p className="text-xs text-gray-500">{formatDate(item.publishedAt)}</p>

                <p className="text-sm text-gray-600 mt-2 line-clamp-2 break-words">
                  {cleanDescription(item.description)}
                </p>
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
