import { fetchFanficSheet } from "@/lib/fetchSheet"
import { CONFIG } from "@/config/config"

export async function getDerivativeSongs() {
  return await fetchFanficSheet(
    CONFIG.fanficsheets.music.name
  )
}
