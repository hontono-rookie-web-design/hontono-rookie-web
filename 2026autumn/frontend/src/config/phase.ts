export const EVENT_PHASES = {
  BEFORE: "before", // 開催前

  EXTRA: "extra", // exステージ投稿期間
  ROOKIE: "rookie", // ルーキー投稿期間

  PRELIM: "prelim", // 予選投票期間
  PRELIM_COUNTING: "prelim_counting", // 予選集計中

  FINAL: "final", // 決勝
  FINAL_COUNTING: "final_counting", // 決勝集計中

  AFTER: "after", // 終了後
} as const;

export type EventPhase = (typeof EVENT_PHASES)[keyof typeof EVENT_PHASES];

export function getCurrentPhase(): EventPhase {
  const env = process.env.NEXT_PUBLIC_EVENT_PHASE as EventPhase | undefined;

  if (env && Object.values(EVENT_PHASES).includes(env)) {
    return env;
  }

  return EVENT_PHASES.BEFORE;
}

export const EVENT_PHASES_SP = {
  BEFORE: "before", // 開催前

  SUBMISSION: "submission", // sp投稿期間

  VOTING: "voting", // sp投票期間
  COUNTING: "counting", // sp集計中

  AFTER: "after", // 終了後
} as const;

export type EventPhaseSp = (typeof EVENT_PHASES_SP)[keyof typeof EVENT_PHASES_SP];

export function getCurrentPhaseSp(): EventPhaseSp {
  const env = process.env.NEXT_PUBLIC_EVENT_PHASE_SP as
    | EventPhaseSp
    | undefined;

  if (env && Object.values(EVENT_PHASES_SP).includes(env)) {
    return env;
  }

  return EVENT_PHASES_SP.BEFORE;
}
