const JST_FORMATTER = new Intl.DateTimeFormat("ja-JP", {
  timeZone: "Asia/Tokyo",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  hourCycle: "h23",
});

function pad(n: number) {
  return String(n).padStart(2, "0");
}

/**
 * "YYYY/MM/DD HH:mm" 形式で日時を表示する。
 * サーバー（UTC）で描画しても日本時間で表示されるように、
 * タイムゾーン付きの文字列は Asia/Tokyo に変換し、
 * タイムゾーンなしの文字列は記載された値をそのまま表示する。
 */
export function formatDate(dateStr?: string) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return "";

  const hasTimezone = /(Z|[+-]\d{2}:?\d{2})$/i.test(dateStr.trim());
  if (!hasTimezone) {
    return `${d.getFullYear()}/${pad(d.getMonth() + 1)}/${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
  }

  const parts = Object.fromEntries(JST_FORMATTER.formatToParts(d).map((p) => [p.type, p.value]));
  return `${parts.year}/${parts.month}/${parts.day} ${parts.hour}:${parts.minute}`;
}
