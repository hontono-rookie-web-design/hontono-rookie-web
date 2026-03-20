export const EVENT_PHASES = {
  BEFORE: "before", // 開催前（エントリー受付中など）
  DURING: "during", // 開催中（投票受付中など）
  AFTER: "after",   // 終了後（結果発表）
} as const;

export type EventPhase = typeof EVENT_PHASES[keyof typeof EVENT_PHASES];

// 現在のフェーズを取得する（環境変数などから取得できるように）
export function getCurrentPhase(): EventPhase {
  // デフォルトは "before" とする。
  // 実際は process.env.NEXT_PUBLIC_EVENT_PHASE などを参照する想定。
  const envPhase = process.env.NEXT_PUBLIC_EVENT_PHASE as EventPhase | undefined;
  
  if (envPhase && Object.values(EVENT_PHASES).includes(envPhase)) {
    return envPhase;
  }
  
  return EVENT_PHASES.BEFORE;
}
