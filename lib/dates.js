// "YYYY-MM" helpers for experience durations and the timeline. `null` means "now".

export function monthIndex(ym) {
  if (!ym) {
    const now = new Date();
    return now.getFullYear() * 12 + now.getMonth();
  }
  const [y, m] = ym.split("-").map(Number);
  return y * 12 + m - 1;
}

export function monthsBetween(start, end) {
  return Math.max(0, monthIndex(end) - monthIndex(start));
}
