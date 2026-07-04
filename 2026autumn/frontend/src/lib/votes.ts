// lib/votes.ts
import { fetchGroupedVideosSheet, fetchVotesSheet, fetchRankingSheet} from "@/lib/fetchSheet";
import { CONFIG } from "@/config/config";

/* =========================
   Preliminary
========================= */

export async function getPreliminarySongs() {
  const items = await fetchGroupedVideosSheet(
    CONFIG.groupedvideosheets.spreadsheetId,
    CONFIG.groupedvideosheets.rookie.name
  );
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

export async function getPreliminaryForms(){
  const items = await fetchVotesSheet(
    CONFIG.voteformssheets.preliminaries.name
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
export async function getPreliminaryRanks(){
  const items = await fetchRankingSheet(
    CONFIG.rankingsheets.preliminaries.name
  );
  return items
    .map((r) => ({
      videoId: r.videoId,
      group: r.group,
      rank: r.rank
    }));
}

/* =========================
   Semifinal
========================= */

export async function getSemifinalSongs() {
  const items = await fetchGroupedVideosSheet(
    CONFIG.groupedvideosheets_semifinal.spreadsheetId,
    CONFIG.groupedvideosheets_semifinal.rookie.name
  );
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
    CONFIG.rankingsheets.semifinals.name
  );
  return items
    .map((r) => ({
      videoId: r.videoId,
      group: r.group,
      rank: r.rank
    }));
}

/* =========================
   Final
========================= */

export async function getFinalSongs() {
  const items = await fetchGroupedVideosSheet(
    CONFIG.groupedvideosheets_final.spreadsheetId,
    CONFIG.groupedvideosheets_final.rookie.name
  );

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

export async function getFinalForms() {
  const items = await fetchVotesSheet(
    CONFIG.voteformssheets.finals.name
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

export async function getFinalRanks() {
  const items = await fetchRankingSheet(
    CONFIG.rankingsheets.finals.name
  );

  return items.map((r) => ({
    videoId: r.videoId,
    group: r.group,
    rank: r.rank,
  }));
}

/* =========================
   Ex
========================= */

export async function getExSongs() {
  const items = await fetchGroupedVideosSheet(
    CONFIG.groupedvideosheets_ex.spreadsheetId,
    CONFIG.groupedvideosheets_ex.rookie.name
  );

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

export async function getExForms() {
  const items = await fetchVotesSheet(
    CONFIG.voteformssheets.ex.name
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

export async function getExRanks() {
  const items = await fetchRankingSheet(
    CONFIG.rankingsheets.ex.name
  );

  return items.map((r) => ({
    videoId: r.videoId,
    group: r.group,
    rank: r.rank,
  }));
}