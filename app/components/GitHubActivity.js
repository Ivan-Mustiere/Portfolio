import { getContributions } from "@/lib/github";
import { getDict } from "@/lib/i18n";

const CELL = 10; // px, like GitHub
const GAP = 3;
const STEP = CELL + GAP;
const LEVEL_CLASS = ["bg-zinc-800/70", "bg-blue-900", "bg-blue-700", "bg-blue-500", "bg-blue-300"];

// GitHub-style contribution calendar (last 12 months): one column per week, Sunday on top.
// Server component: data comes from lib/github.js, cached a few hours; renders nothing if unavailable.
export default async function GitHubActivity({ lang = "fr" }) {
  const data = await getContributions();
  if (!data) return null;
  const t = getDict(lang).github;
  const locale = lang === "en" ? "en-US" : "fr-FR";
  const fmtDay = new Intl.DateTimeFormat(locale, { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" });
  const fmtMonth = new Intl.DateTimeFormat(locale, { month: "short", timeZone: "UTC" });
  const asDate = (iso) => new Date(`${iso}T00:00:00Z`);

  // Month label above the week holding the 1st of that month (skipped at the right edge, where it would overflow)
  const months = data.days
    .filter((d) => asDate(d.date).getUTCDate() === 1 && d.week < data.weeks - 2)
    .map((d) => ({ week: d.week, label: fmtMonth.format(asDate(d.date)) }));

  return (
    <div>
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 mb-4">
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

      <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-4 sm:p-5">
        {/* rtl wrapper: on narrow screens the scroll starts on the most recent weeks */}
        <div className="overflow-x-auto [direction:rtl] pb-1">
          <div className="inline-block [direction:ltr]">
            <div className="relative h-4 mb-1 text-[10px] text-zinc-500" style={{ marginLeft: 28 }} aria-hidden="true">
              {months.map((m) => (
                <span key={m.week} className="absolute top-0" style={{ left: m.week * STEP }}>{m.label}</span>
              ))}
            </div>
            <div className="flex">
              <div className="grid text-[10px] text-zinc-500 w-7 flex-shrink-0" style={{ gridTemplateRows: `repeat(7, ${CELL}px)`, rowGap: GAP }} aria-hidden="true">
                {[1, 3, 5].map((row, i) => (
                  <span key={row} className="leading-[10px]" style={{ gridRow: row + 1 }}>{t.weekdays[i]}</span>
                ))}
              </div>
              <div
                className="grid"
                style={{ gridTemplateRows: `repeat(7, ${CELL}px)`, gridTemplateColumns: `repeat(${data.weeks}, ${CELL}px)`, gap: GAP }}
                role="img"
                aria-label={t.total(data.total)}
              >
                {data.days.map((d) => (
                  <span
                    key={d.date}
                    className={`rounded-[2px] ${LEVEL_CLASS[d.level] ?? LEVEL_CLASS[0]}`}
                    style={{ gridRow: d.weekday + 1, gridColumn: d.week + 1 }}
                    title={t.day(d.count, fmtDay.format(asDate(d.date)))}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end mt-4 text-xs text-zinc-500">
          <div className="flex items-center gap-1" aria-hidden="true">
            <span className="mr-1">{t.less}</span>
            {LEVEL_CLASS.map((c) => (
              <span key={c} className={`rounded-[2px] ${c}`} style={{ width: CELL, height: CELL }} />
            ))}
            <span className="ml-1">{t.more}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
