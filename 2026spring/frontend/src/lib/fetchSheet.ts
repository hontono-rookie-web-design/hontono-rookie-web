import { CONFIG } from "@/config/config";

export type FanficSheetItem = {
  creator: string;
  service: string;
  workUrl: string;
  title: string;
  imageUrl: string;
  originalUrl: string;
  originalTitle: string;
  originalAuthor: string;
  publishedAt: string;
};

export async function fetchFanficSheet(
  sheetName: string,
): Promise<FanficSheetItem[]> {
  const url = `https://opensheet.elk.sh/${CONFIG.fanficsheets.spreadsheetId}/${sheetName}`;

  const res = await fetch(url);
  const data = await res.json();

  return data.map((row: any) => ({
    creator: row["二次創作者活動名"] ?? "",
    service: row["投稿先サービス"] ?? "",
    workUrl: row["二次創作作品URL"] ?? "",
    title: row["タイトル"] ?? "",
    imageUrl: row["画像URL"] ?? "",
    originalUrl: row["元作品URL"] ?? "",
    originalTitle: row["元作品タイトル"] ?? "",
    originalAuthor: row["元作品投稿者名"] ?? "",
    publishedAt: row["配信日時"] ?? "",
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

export async function fetchNoteSheet(
  sheetName: string,
): Promise<NoteSheetItem[]> {
  const url = `https://opensheet.elk.sh/${CONFIG.notesheets.spreadsheetId}/${sheetName}`;

  const res = await fetch(url, {
    next: { revalidate: 60 }, // ISR（キャッシュ）
  });

  const data = await res.json();

  return data.map((row: any) => ({
    title: row["Title"] ?? "",
    author: row["Author"] ?? "",
    publishedAt: row["Published Date"] ?? "",
    noteUrl: row["note_url"] ?? "",
    userUrl: row["user_url"] ?? "",
    eyecatchUrl: row["eyecatch_url"] ?? "",
    userProfileImageUrl: row["user_profile_img_url"] ?? "",
  }));
}

// lib/fetchSheet.ts に追加

export type VideoSheetItem = {
  videoId: string;
  title: string;
  creatorId: string;
  creator: string;
  publishedAt: string;
  description: string;
  videoUrl: string;
  thumbnailUrl: string;
};

export async function fetchVideosSheet(
  sheetName: string,
): Promise<VideoSheetItem[]> {
  const url = `https://opensheet.elk.sh/${CONFIG.videosheets.spreadsheetId}/${sheetName}`;

  const res = await fetch(url, {
    next: { revalidate: 60 },
  });

  const data = await res.json();

  return data.map((row: any) => ({
    videoId: row["動画ID"] ?? "",
    title: row["タイトル"] ?? "",
    creatorId: row["投稿者ID"] ?? "",
    creator: row["投稿者名"] ?? "",
    publishedAt: (row["投稿日時"] ?? "").replace(/^'/, ""),
    description: row["概要欄"] ?? "",
    videoUrl: row["URL"] ?? "",
    thumbnailUrl: row["サムネイルURL"] ?? "",
  }));
}

export type GroupedVideoSheetItem = {
  videoId: string;
  title: string;
  creatorId: string;
  creator: string;
  publishedAt: string;
  description: string;
  videoUrl: string;
  thumbnailUrl: string;
  group: number;
};

export async function fetchGroupedVideosSheet(
  spreadsheetId: string,
  sheetName: string,
): Promise<GroupedVideoSheetItem[]> {
  const url = `https://opensheet.elk.sh/${spreadsheetId}/${sheetName}`;

  const res = await fetch(url, {
    next: { revalidate: 86400 }, // 24時間キャッシュ
  });

  const data = await res.json();

  return data.map((row: any) => ({
    videoId: row["動画ID"] ?? "",
    title: row["タイトル"] ?? "",
    creatorId: row["投稿者ID"] ?? "",
    creator: row["投稿者名"] ?? "",
    publishedAt: (row["投稿日時"] ?? "").replace(/^'/, ""),
    description: row["概要欄"] ?? "",
    videoUrl: row["URL"] ?? "",
    thumbnailUrl: row["サムネイルURL"] ?? "",
    group: Number(row["グループID"] ?? 0), // ← 追加
  }));
}

export type VoteSheetItem = {
  group: number;
  formUrl: string;
  mylistUrl: string;
  deadline?: string;
};

export async function fetchVotesSheet(
  sheetName: string,
): Promise<VoteSheetItem[]> {
  const url = `https://opensheet.elk.sh/${CONFIG.voteformssheets.spreadsheetId}/${sheetName}`;

  const res = await fetch(url, {
    next: { revalidate: 60 },
  });

  const data = await res.json();

  return data.map((row: any) => ({
    group: Number(row["グループID"] ?? 0),
    formUrl: row["人気投票FormURL"] ?? "",
    mylistUrl: row["マイリストURL"] ?? "",
    deadline: (row["投票締切"] ?? "").replace(/^'/, ""),
  }));
}

export type RankingItem = {
  videoId: string;
  group: number;
  rank?: number;
};

export async function fetchRankingSheet(
  sheetName: string,
): Promise<RankingItem[]> {
  const url = `https://opensheet.elk.sh/${CONFIG.rankingsheets.spreadsheetId}/${sheetName}`;

  const res = await fetch(url, {
    next: { revalidate: 60 },
  });

  const data = await res.json();

  return data.map((row: any) => ({
    videoId: row["動画ID"] ?? "",
    group: Number(row["グループID"] ?? 0),
    rank: row["順位"] ? Number(row["順位"]) : undefined,
  }));
}
