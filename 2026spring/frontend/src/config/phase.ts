export const EVENT_PHASES = {
  BEFORE: "before",                  // 開催前

  OPENING: "opening",                // opステージ投稿期間
  ROOKIE: "rookie",                  // ルーキー投稿期間

  PRELIM: "prelim",                  // 予選投票期間
  PRELIM_COUNTING: "prelim_counting", // 予選集計中

  SEMIFINAL: "semifinal",            // 準決勝
  SEMIFINAL_COUNTING: "semifinal_counting", // 準決勝集計中

  FINAL: "final",                    // 決勝
  FINAL_COUNTING: "final_counting",  // 決勝集計中

  AFTER: "after",                    // 終了後
} as const;

export type EventPhase =
  typeof EVENT_PHASES[keyof typeof EVENT_PHASES];

export function getCurrentPhase(): EventPhase {
  const env = process.env.NEXT_PUBLIC_EVENT_PHASE as EventPhase | undefined;

  if (env && Object.values(EVENT_PHASES).includes(env)) {
    return env;
  }

  return EVENT_PHASES.BEFORE;
}