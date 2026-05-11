// lib/votes.ts
import { fetchGroupedVideosSheet, fetchVotesSheet, fetchRankingSheet} from "@/lib/fetchSheet";
import { CONFIG } from "@/config/config";

export async function getPreliminarySongs() {
  const items = await fetchGroupedVideosSheet(
    CONFIG.groupedvideosheets.spreadsheetId,
    CONFIG.groupedvideosheets.rookie.name
  );

  // 転送量を減らすため、サーバーサイドで map を済ませる
  return items
    .filter((v) => v.videoUrl)
    .map((v) => ({
      title: v.title,
      creator: v.creator,
      videoUrl: v.videoUrl,
      thumbnailUrl: v.thumbnailUrl,
      publishedAt: v.publishedAt,
      description: v.description,
      group: Number(v.group || 0),
      videoId: v.videoId,
    }));
}
export async function getSemifinalSongs() {
  const items = await fetchGroupedVideosSheet(
    CONFIG.groupedvideosheets_semifinal.spreadsheetId,
    CONFIG.groupedvideosheets_semifinal.rookie.name
  );

  // 転送量を減らすため、サーバーサイドで map を済ませる
  return items
    .filter((v) => v.videoUrl)
    .map((v) => ({
      title: v.title,
      creator: v.creator,
      videoUrl: v.videoUrl,
      thumbnailUrl: v.thumbnailUrl,
      publishedAt: v.publishedAt,
      description: v.description,
      group: Number(v.group || 0),
      videoId: v.videoId,
    }));
}

export async function getSemifinalForms(){
  const items = await fetchVotesSheet(
    // CONFIG.voteformssheets.spreadsheetId,
    CONFIG.voteformssheets.semifinals.name
  );
  return items
    .filter((f) => f.formUrl)
    .map((f) => ({
      group: f.group,
      formUrl: f.formUrl,
      mylistUrl: f.mylistUrl,
      deadline: f.deadline,
    }));

}
export async function getSemifinalRanks(){
  const items = await fetchRankingSheet(
    // CONFIG.rankingsheets.spreadsheetId,
    CONFIG.rankingsheets.semifinals.name
  );
  return items
    .map((r) => ({
      videoId: r.videoId,
      group: r.group,
      rank: r.rank
    }));
}

export async function getFinalSongs() {
  const items = await fetchGroupedVideosSheet(
    CONFIG.videosheets_final.spreadsheetId,
    CONFIG.videosheets_final.rookie.name
  );

  // 転送量を減らすため、サーバーサイドで map を済ませる
  return items
    .filter((v) => v.videoUrl)
    .map((v) => ({
      title: v.title,
      creator: v.creator,
      videoUrl: v.videoUrl,
      thumbnailUrl: v.thumbnailUrl,
      publishedAt: v.publishedAt,
      description: v.description,
      group: Number(v.group || 0),
      videoId: v.videoId,
    }));
}