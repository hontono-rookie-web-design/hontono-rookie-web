import { CONFIG } from "@/config/config";
import { EVENT_PHASES, getCurrentPhase } from "@/config/phase";
import { unstable_rethrow } from "next/navigation";

type SheetRow = Record<string, unknown>;

const SHEET_INDEX = 1;
const ACTIVE_REVALIDATE_SECONDS = 600;
const AFTER_EVENT_REVALIDATE_SECONDS = 86400;

function getRevalidateSeconds() {
  return getCurrentPhase() === EVENT_PHASES.AFTER
    ? AFTER_EVENT_REVALIDATE_SECONDS
    : ACTIVE_REVALIDATE_SECONDS;
}

function asString(value: unknown): string {
  return typeof value === "string" ? value : value == null ? "" : String(value);
}

function asOptionalNumber(value: unknown): number | undefined {
  if (value === "" || value == null) return undefined;

  const number = Number(value);
  return Number.isFinite(number) ? number : undefined;
}

function isExcluded(value: unknown): boolean {
  return value === true || asString(value).toUpperCase() === "TRUE";
}

async function fetchSheetRows(
  spreadsheetId: string,
  label: string,
  revalidate = getRevalidateSeconds(),
): Promise<SheetRow[]> {
  if (!spreadsheetId) {
    console.error(`${label}: spreadsheet ID is not configured`);
    return [];
  }

  try {
    const url = `https://opensheet.elk.sh/${spreadsheetId}/${SHEET_INDEX}`;
    const response = await fetch(url, { next: { revalidate } });

    if (!response.ok) {
      console.error(`${label}: request failed with status ${response.status}`);
      return [];
    }

    const data: unknown = await response.json();
    if (!Array.isArray(data)) {
      console.error(`${label}: unexpected response (not an array)`);
      return [];
    }

    return data.filter(
      (row): row is SheetRow => typeof row === "object" && row !== null && !Array.isArray(row),
    );
  } catch (error) {
    unstable_rethrow(error);
    console.error(`${label}: failed to fetch sheet`, error);
    return [];
  }
}

export type DerivativeSheetItem = {
  creator: string;
  service: string;
  workUrl: string;
  title: string;
  imageUrl: string;
  originalUrl: string;
  publishedAt: string;
};

export async function fetchDerivativeSheet(category: string): Promise<DerivativeSheetItem[]> {
  const data = await fetchSheetRows(CONFIG.derivativesheets.spreadsheetId, "fetchDerivativeSheet");

  return data
    .filter((row) => asString(row.category) === category)
    .map((row) => ({
      creator: asString(row.creator_name),
      service: asString(row.posted_service),
      workUrl: asString(row.fanart_url),
      title: asString(row.fanart_title),
      imageUrl: asString(row.fanart_img_url),
      originalUrl: asString(row.original_id),
      publishedAt: asString(row.stream_at),
    }));
}

export type NoteSheetItem = {
  title: string;
  author: string;
  publishedAt: string;
  noteUrl: string;
  userUrl: string;
  eyecatchUrl: string;
  userProfileImageUrl: string;
};

export async function fetchNoteSheet(): Promise<NoteSheetItem[]> {
  const data = await fetchSheetRows(CONFIG.notesheets.spreadsheetId, "fetchNoteSheet");

  return data.map((row) => ({
    title: asString(row.article_title),
    author: asString(row.article_author),
    publishedAt: asString(row.posted_at),
    noteUrl: asString(row.article_url),
    userUrl: asString(row.author_url),
    eyecatchUrl: asString(row.eyecatch_url),
    userProfileImageUrl: asString(row.user_profile_img_url),
  }));
}

export type VideoStage = {
  group_id: string;
  rank: string;
};

export type VideoSheetItem = {
  videoId: string;
  title: string;
  creatorId: string;
  creator: string;
  publishedAt: string;
  description: string;
  videoUrl: string;
  thumbnailUrl: string;
  group?: number;
  rank?: number;
};

export async function fetchVideosSheet(
  status: string,
  stage?: VideoStage,
): Promise<VideoSheetItem[]> {
  const data = await fetchSheetRows(CONFIG.videosheets.spreadsheetId, "fetchVideosSheet");

  return data
    .filter((row) => asString(row.status) === status)
    .filter((row) => !isExcluded(row.excluded))
    .map((row) => ({
      videoId: asString(row.video_id),
      title: asString(row.title),
      creatorId: asString(row.user_id),
      creator: asString(row.user_name),
      publishedAt: asString(row.posted_at).replace(/^'/, ""),
      description: asString(row.description),
      videoUrl: asString(row.video_url),
      thumbnailUrl: asString(row.thumbnail_url),
      group: stage ? asOptionalNumber(row[stage.group_id]) : undefined,
      rank: stage ? asOptionalNumber(row[stage.rank]) : undefined,
    }));
}

export type VoteSheetItem = {
  group: number;
  formUrl: string;
  mylistUrl: string;
  voteStartsAt?: string;
  voteEndsAt?: string;
};

export async function fetchVotesSheet(stage: string): Promise<VoteSheetItem[]> {
  const data = await fetchSheetRows(CONFIG.voteformssheets.spreadsheetId, "fetchVotesSheet", 600);
  return data
    .filter((row) => asString(row.stage) === stage)
    .map((row) => ({
      group: asOptionalNumber(row.group_id) ?? 0,
      formUrl: asString(row.form_url),
      mylistUrl: asString(row.mylist_url),
      voteStartsAt: asString(row.vote_starts_at).replace(/^'/, "") || undefined,
      voteEndsAt: asString(row.vote_ends_at).replace(/^'/, "") || undefined,
    }))
    .filter((item) => item.group > 0);
}
