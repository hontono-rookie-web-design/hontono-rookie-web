import { CONFIG } from "@/config/config";
import { EVENT_PHASES, getCurrentPhase } from "@/config/phase";

export type FanficSheetItem = {
  creator: string;
  service: string;
  workUrl: string;
  title: string;
  imageUrl: string;
  originalUrl: string;
  publishedAt: string;
};

export async function fetchFanficSheet(category: string): Promise<FanficSheetItem[]> {
  const url = `https://opensheet.elk.sh/${CONFIG.fanficsheets.spreadsheetId}/1`;

  const rev = getCurrentPhase() === EVENT_PHASES.AFTER ? 86400 : 600; // 開催終了後は1日キャッシュ、それ以外は10分キャッシュ
  const res = await fetch(url, {
    next: { revalidate: rev },
  });
  const data = await res.json();

  if (!Array.isArray(data)) {
    console.error("fetchFanficSheet: unexpected response (not array)", data);
    return [];
  }

  return data
    .filter((row: any) => row["category"] === category)
    .map((row: any) => ({
      creator: row["creator_name"] ?? "",
      service: row["posted_service"] ?? "",
      workUrl: row["fanart_url"] ?? "",
      title: row["fanart_title"] ?? "",
      imageUrl: row["fanart_img_url"] ?? "",
      originalUrl: row["original_id"] ?? "",
      publishedAt: row["stream_at"] ?? "",
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
  const url = `https://opensheet.elk.sh/${CONFIG.notesheets.spreadsheetId}/1`;

  const rev = getCurrentPhase() === EVENT_PHASES.AFTER ? 86400 : 600; // 開催終了後は1日キャッシュ、それ以外は10分キャッシュ
  const res = await fetch(url, {
    next: { revalidate: rev }, // ISR（キャッシュ）
  });
  const data = await res.json();

  if (!Array.isArray(data)) {
    console.error("fetchNoteSheet: unexpected response (not array)", data);
    return [];
  }

  return data.map((row: any) => ({
    title: row["article_title"] ?? "",
    author: row["article_author"] ?? "",
    publishedAt: row["posted_at"] ?? "",
    noteUrl: row["article_url"] ?? "",
    userUrl: row["author_url"] ?? "",
    eyecatchUrl: row["eyecatch_url"] ?? "",
    userProfileImageUrl: row["user_profile_img_url"] ?? "",
  }));
}

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

export async function fetchVideosSheet(status: string, stage?: any): Promise<VideoSheetItem[]> {
  const url = `https://opensheet.elk.sh/${CONFIG.videosheets.spreadsheetId}/1`;

  const rev = getCurrentPhase() === EVENT_PHASES.AFTER ? false : 86400; // 開催終了後はキャッシュ無効、それ以外は24時間キャッシュ
  const res = await fetch(url, {
    next: { revalidate: rev },
  });
  const data = await res.json();

  if (!Array.isArray(data)) {
    console.error("fetchVideosSheet: unexpected response (not array)", data);
    return [];
  }

  return data
    .filter((row: any) => row["status"] === status)
    .filter((row: any) => row["excluded"] !== "TRUE")
    .map((row: any) => ({
      videoId: row["video_id"] ?? "",
      title: row["title"] ?? "",
      creatorId: row["user_id"] ?? "",
      creator: row["user_name"] ?? "",
      publishedAt: (row["posted_at"] ?? "").replace(/^'/, ""),
      description: row["description"] ?? "",
      videoUrl: row["video_url"] ?? "",
      thumbnailUrl: row["thumbnail_url"] ?? "",
      group: stage ? row[stage.group_id] ? Number(row[stage.group_id]) : undefined : undefined,
      rank: stage ? row[stage.rank] ? Number(row[stage.rank]) : undefined : undefined,
    }));
}

export type VoteSheetItem = {
  group: number;
  formUrl: string;
  mylistUrl: string;
  vote_starts_at?: string;
  vote_ends_at?: string;
};

export async function fetchVotesSheet(stage: string): Promise<VoteSheetItem[]> {
  const url = `https://opensheet.elk.sh/${CONFIG.voteformssheets.spreadsheetId}/1`;

  const res = await fetch(url, {
    next: { revalidate: false },
  });
  const data = await res.json();

  if (!Array.isArray(data)) {
    console.error("fetchVotesSheet: unexpected response (not array)", data);
    return [];
  }

  return data
    .filter((row: any) => row["stage"] === stage)
    .map((row: any) => ({
      group: Number(row["group_id"] ?? 0),
      formUrl: row["form_url"] ?? "",
      mylistUrl: row["mylist_url"] ?? "",
      vote_starts_at: (row["vote_starts_at"] ?? "").replace(/^'/, ""),
      vote_ends_at: (row["vote_ends_at"] ?? "").replace(/^'/, ""),
    }));
}