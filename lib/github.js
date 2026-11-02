// Public GitHub contribution calendar, scraped from the HTML fragment the profile page loads
// (no token needed). Returns null if GitHub is unreachable or its markup changes.

export const GITHUB_USER = "Ivan-Mustiere";
const REVALIDATE_SECONDS = 6 * 3600;

export async function getContributions(user = GITHUB_USER) {
  let html;
  try {
    const res = await fetch(`https://github.com/users/${user}/contributions`, {
      headers: { "User-Agent": "ivan-mustiere.com portfolio" },
      next: { revalidate: REVALIDATE_SECONDS },
    });
    if (!res.ok) return null;
    html = await res.text();
  } catch {
    return null;
  }

  // Cells: <td … data-date="YYYY-MM-DD" id="contribution-day-component-<weekday>-<week>" data-level="0-4">
  const cells = new Map();
  for (const [tag] of html.matchAll(/<td[^>]*data-date="[^"]*"[^>]*>/g)) {
    const date = tag.match(/data-date="([\d-]+)"/)?.[1];
    const pos = tag.match(/id="contribution-day-component-(\d+)-(\d+)"/);
    const level = Number(tag.match(/data-level="(\d)"/)?.[1] ?? 0);
    if (date && pos) cells.set(`contribution-day-component-${pos[1]}-${pos[2]}`, { date, weekday: Number(pos[1]), week: Number(pos[2]), level, count: 0 });
  }
  // Counts only live in the tooltips: "No contributions on …" / "3 contributions on …"
  for (const [, id, text] of html.matchAll(/<tool-tip[^>]*for="(contribution-day-component-[\d-]+)"[^>]*>([^<]*)<\/tool-tip>/g)) {
    const cell = cells.get(id);
    if (cell) cell.count = Number(text.match(/^(\d+)/)?.[1] ?? 0);
  }
  if (cells.size === 0) return null;

  const days = [...cells.values()].sort((a, b) => a.date.localeCompare(b.date));
  return {
    user,
    days,
    weeks: Math.max(...days.map((d) => d.week)) + 1,
    total: days.reduce((sum, d) => sum + d.count, 0),
  };
}
