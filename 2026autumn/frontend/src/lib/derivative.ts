import { fetchDerivativeSheet } from "@/lib/fetchSheet";
import { fetchNoteSheet } from "@/lib/fetchSheet";
import { CONFIG } from "@/config/config";

export async function getDerivativeArrangements() {
  return await fetchDerivativeSheet(CONFIG.derivativesheets.arrangements.name);
}

export async function getDerivativeCoverSongs() {
  return await fetchDerivativeSheet(CONFIG.derivativesheets.coversongs.name);
}

export async function getDerivativeIllustrations() {
  return await fetchDerivativeSheet(CONFIG.derivativesheets.illustrations.name);
}

export async function getDerivativeOthers() {
  return await fetchDerivativeSheet(CONFIG.derivativesheets.others.name);
}

export async function getDerivativeStreams() {
  return await fetchDerivativeSheet(CONFIG.derivativesheets.streams.name);
}

export async function getDerivativeArchives() {
  return await fetchDerivativeSheet(CONFIG.derivativesheets.archive.name);
}

export async function getDerivativeArticles() {
  return await fetchNoteSheet();
}
