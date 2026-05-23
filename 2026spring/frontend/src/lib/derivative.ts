import { fetchFanficSheet } from "@/lib/fetchSheet"
import { CONFIG } from "@/config/config"

export async function getDerivativeArrangements() {
  return await fetchFanficSheet(
    CONFIG.fanficsheets.arrangements.name
  )
}

export async function getDerivativeCoverSongs() {
  return await fetchFanficSheet(
    CONFIG.fanficsheets.coversongs.name
  )
}

export async function getDerivativeIllustrations() {
  return await fetchFanficSheet(
    CONFIG.fanficsheets.illustrations.name
  )
}

export async function getDerivativeOthers() {
  return await fetchFanficSheet(
    CONFIG.fanficsheets.others.name
  )
}

export async function getDerivativeStreams() {
  return await fetchFanficSheet(
    CONFIG.fanficsheets.streams.name
  )
}
