export const EVENT_PHASES = {
  BEFORE: "before",
  PRELIM: "prelim",        // 予選投票期間
  SEMIFINAL: "semifinal",  // 準決勝
  FINAL: "final",          // 決勝
  AFTER: "after",
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