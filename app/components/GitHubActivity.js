import { getContributions } from "@/lib/github";
import { getDict } from "@/lib/i18n";

const LEVEL_CLASS = ["bg-zinc-800/70", "bg-blue-900", "bg-blue-700", "bg-blue-500", "bg-blue-300"];
const LABEL_COL = 28; // px, weekday labels column

// GitHub-style contribution calendar (last 12 months) that stretches to the full width,
// followed by key figures and a per-month histogram.
// Server component: data comes from lib/github.js, cached a few hours; renders nothing if unavailable.
export default async function GitHubActivity({ lang = "fr" }) {
  const data = await getContributions();
  if (!data) return null;
  const t = getDict(lang).github;
  const locale = lang === "en" ? "en-US" : "fr-FR";
  const fmtDay = new Intl.DateTimeFormat(locale, { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" });
  const fmtMonth = new Intl.DateTimeFormat(locale, { month: "short", timeZone: "UTC" });
  const fmtMonthYear = new Intl.DateTimeFormat(locale, { month: "long", year: "numeric", timeZone: "UTC" });
  const fmtNum = new Intl.NumberFormat(locale);
  const asDate = (iso) => new Date(`${iso}T00:00:00Z`);

  // Month label above the week holding the 1st of that month (skipped at the right edge, where it would overflow)
  const monthLabels = data.days
    .filter((d) => asDate(d.date).getUTCDate() === 1 && d.week < data.weeks - 2)
    .map((d) => ({ week: d.week, label: fmtMonth.format(asDate(d.date)) }));

  // Per-month totals (the first month of the window is usually partial)
  const byMonth = new Map();
  for (const d of data.days) {
    const key = d.date.slice(0, 7);
    byMonth.set(key, (byMonth.get(key) ?? 0) + d.count);
  }
  const months = [...byMonth].map(([key, count]) => ({ key, count, date: asDate(`${key}-01`) }));
  const maxMonth = Math.max(1, ...months.map((m) => m.count));
  const bestMonth = months.reduce((best, m) => (m.count > best.count ? m : best), months[0]);
  const bestDay = data.days.reduce((best, d) => (d.count > best.count ? d : best), data.days[0]);
  const weeklyAvg = data.total / data.weeks;

  const stats = [
    { label: t.statTotal, value: fmtNum.format(data.total) },
    { label: t.statBestMonth, value: fmtNum.format(bestMonth.count), sub: fmtMonthYear.format(bestMonth.date) },
    { label: t.statBestDay, value: fmtNum.format(bestDay.count), sub: fmtDay.format(asDate(bestDay.date)) },
    { label: t.statWeekly, value: fmtNum.format(Math.round(weeklyAvg * 10) / 10) },
  ];

  return (
    <div>
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 mb-6">
        <p className="text-sm text-zinc-400">{t.total(data.total)}</p>
        <a
          href={`https://github.com/${data.user}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
        >
          {t.profile}
        </a>
      </div>

      {/* Key figures */}
      <dl className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-xl border border-zinc-800 bg-zinc-900/40 px-4 py-3">
            <dt className="text-xs text-zinc-500">{s.label}</dt>
            <dd className="mt-1 text-2xl font-semibold text-zinc-100 tabular-nums">{s.value}</dd>
            {s.sub && <dd className="text-xs text-zinc-500 truncate">{s.sub}</dd>}
          </div>
        ))}
      </dl>

      {/* Calendar: fluid cells filling the card; below ~720px it scrolls, starting on the most recent weeks */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-4 sm:p-5 mb-4">
        <div className="overflow-x-auto [direction:rtl] pb-1">
          <div className="min-w-[720px] [direction:ltr]">
            <div
              className="grid gap-[3px]"
              style={{ gridTemplateColumns: `${LABEL_COL}px repeat(${data.weeks}, minmax(0, 1fr))` }}
            >
              {/* Month labels (row 1) */}
              <div className="relative h-4 text-[10px] text-zinc-500" style={{ gridColumn: `2 / span ${data.weeks}`, gridRow: 1 }} aria-hidden="true">
                {monthLabels.map((m) => (
                  <span key={m.week} className="absolute top-0 whitespace-nowrap" style={{ left: `${(m.week / data.weeks) * 100}%` }}>
                    {m.label}
                  </span>
                ))}
              </div>
              {/* Weekday labels (column 1) */}
              {[1, 3, 5].map((row, i) => (
                <span
                  key={row}
                  className="self-center text-[10px] leading-none text-zinc-500"
                  style={{ gridColumn: 1, gridRow: row + 2 }}
                  aria-hidden="true"
                >
                  {t.weekdays[i]}
                </span>
              ))}
              {/* Days */}
              {data.days.map((d) => (
                <span
                  key={d.date}
                  className={`aspect-square rounded-[3px] transition-[filter] hover:brightness-150 ${LEVEL_CLASS[d.level] ?? LEVEL_CLASS[0]}`}
                  style={{ gridRow: d.weekday + 2, gridColumn: d.week + 2 }}
                  title={t.day(d.count, fmtDay.format(asDate(d.date)))}
                />
              ))}
            </div>
            <div className="flex justify-end mt-4 text-xs text-zinc-500">
              <div className="flex items-center gap-1" aria-hidden="true">
                <span className="mr-1">{t.less}</span>
                {LEVEL_CLASS.map((c) => (
                  <span key={c} className={`w-3 h-3 rounded-[3px] ${c}`} />
                ))}
                <span className="ml-1">{t.more}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contributions per month */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-4 sm:p-5">
        <p className="text-xs text-zinc-500 mb-4">{t.perMonth}</p>
        <div className="flex items-end gap-1.5 sm:gap-2 h-36">
          {months.map((m) => {
            const isBest = m === bestMonth && m.count > 0;
            return (
              <div
                key={m.key}
                className="group flex-1 h-full flex flex-col justify-end items-center min-w-0"
                title={t.monthTotal(m.count, fmtMonthYear.format(m.date))}
              >
                <span className={`text-[10px] tabular-nums mb-1 ${isBest ? "text-blue-300" : "text-zinc-500 opacity-0 group-hover:opacity-100 transition-opacity"}`}>
                  {m.count}
                </span>
                <div className="flex-1 w-full flex items-end">
                  <div
                    className={`w-full rounded-t-[3px] transition-colors ${isBest ? "bg-blue-400" : "bg-blue-700/80 group-hover:bg-blue-500"}`}
                    style={{ height: `${Math.max((m.count / maxMonth) * 100, m.count ? 3 : 1)}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
        <div className="flex gap-1.5 sm:gap-2 mt-2 border-t border-zinc-800 pt-2" aria-hidden="true">
          {months.map((m) => (
            <span key={m.key} className="flex-1 min-w-0 text-center text-[10px] text-zinc-500 truncate">
              {fmtMonth.format(m.date)}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
