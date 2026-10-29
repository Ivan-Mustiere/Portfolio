import { FRANCE } from "@/lib/franceMap";
import { getDict } from "@/lib/i18n";

const startYear = (period) => Number(period.match(/\d{4}/)?.[0] ?? 0);
const endYear = (period) => Number(period.match(/\d{4}/g)?.at(-1) ?? 0);

// Overall years of one city, e.g. "2018 – 2023"; an ongoing job makes it open-ended
function cityPeriod(items, now) {
  const from = Math.min(...items.map((i) => startYear(i.period)));
  const to = items.some((i) => i.ongoing) ? now : Math.max(...items.map((i) => endYear(i.period)));
  return `${from} – ${to}`;
}

// Nantes → Paris, with the schools and jobs of each city listed beside the map (dates per city only).
// The route draws itself when revealed (.journey-* in globals.css).
export default function JourneyMap({ lang = "fr", experiences, formations }) {
  const t = getDict(lang).journey;
  const items = [
    ...experiences.map((e) => ({ title: e.title, org: e.company, period: e.period, location: e.location, kind: "job", ongoing: e.end === null })),
    ...formations.map((f) => ({ title: f.degree, org: f.school, period: f.period, location: f.location, kind: "school" })),
  ].sort((a, b) => startYear(a.period) - startYear(b.period));

  const stops = [
    { key: "nantes", label: t.nantes, items: items.filter((i) => i.location.includes("Nantes")) },
    { key: "paris", label: t.paris, items: items.filter((i) => !i.location.includes("Nantes")) },
  ];
  const [nx, ny] = FRANCE.cities.nantes;
  const [px, py] = FRANCE.cities.paris;
  // Gentle arc between the two cities, stopping short of Paris so the arrowhead sits beside the dot
  const [cx, cy] = [(nx + px) / 2 - 10, Math.min(ny, py) - 45];
  const len = Math.hypot(px - cx, py - cy);
  const [ux, uy] = [(px - cx) / len, (py - cy) / len]; // direction of travel at the end of the curve
  const [tipX, tipY] = [px - ux * 13, py - uy * 13];
  const route = `M${nx} ${ny} Q${cx} ${cy} ${tipX - ux * 6} ${tipY - uy * 6}`;
  const angle = (Math.atan2(uy, ux) * 180) / Math.PI;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-[minmax(0,220px)_1fr] gap-6 sm:gap-10 items-center p-5 sm:p-6 rounded-xl border border-zinc-800 bg-zinc-900/40 mb-12" data-reveal>
      <svg viewBox={FRANCE.viewBox} className="w-full max-w-[220px] mx-auto h-auto" role="img" aria-label={t.alt}>
        <path d={FRANCE.path} fill="var(--color-zinc-900)" stroke="var(--color-zinc-700)" strokeWidth="1.5" strokeLinejoin="round" />
        <path d={route} pathLength="1" className="journey-route" fill="none" stroke="var(--color-blue-400)" strokeWidth="3" strokeLinecap="round" />
        <path
          d="M0 0 L-11 -6.5 L-8 0 L-11 6.5 Z"
          transform={`translate(${tipX} ${tipY}) rotate(${angle})`}
          className="journey-arrow"
          fill="var(--color-blue-400)"
          strokeLinejoin="round"
        />
        {stops.map((s) => {
          const [x, y] = FRANCE.cities[s.key];
          return (
            <g key={s.key}>
              <circle cx={x} cy={y} r="9" className="journey-pulse" fill="var(--color-blue-500)" />
              <circle cx={x} cy={y} r="7" fill="var(--color-blue-400)" stroke="var(--color-zinc-950)" strokeWidth="3" />
            </g>
          );
        })}
      </svg>
      <ol className="flex flex-col gap-6">
        {stops.map((s, i) => (
          <li key={s.key}>
            <p className="flex items-center gap-2 text-sm font-medium mb-2">
              <span className="w-5 h-5 rounded-full bg-blue-500/15 border border-blue-500/40 text-blue-400 text-[10px] font-mono flex items-center justify-center">{i + 1}</span>
              {s.label}
              <span className="text-xs font-normal text-zinc-500">· {cityPeriod(s.items, t.now)}</span>
            </p>
            <ul className="flex flex-col gap-1.5 pl-7">
              {s.items.map((item) => (
                <li key={item.title + item.period} className="flex flex-wrap items-baseline gap-x-2 text-sm">
                  <span className={item.kind === "job" ? "text-zinc-200" : "text-zinc-400"}>{item.title}</span>
                  <span className="text-xs text-zinc-500">{item.org}</span>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ol>
    </div>
  );
}
