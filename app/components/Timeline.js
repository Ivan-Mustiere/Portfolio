import TechLogo from "@/app/components/TechLogo";
import { monthIndex } from "@/lib/dates";
import { getDict } from "@/lib/i18n";

// Schools only have years: place them in September for ordering against jobs
const sortKey = (item) => item.start ?? `${item.period.match(/\d{4}/)?.[0] ?? "0000"}-09`;
// ...and end them in September of their last year, so consecutive schools touch on the axis (`end` overrides)
const schoolEnd = (f) => f.end ?? `${f.period.match(/\d{4}/g)?.at(-1) ?? "0000"}-09`;

// Gantt axis cell of one row. The row covers [from, to) months, newest at the top and mapped
// linearly onto the row's height, so the scale varies per row but bars stay beside their cards.
function GanttCell({ from, to, bars, multiRow }) {
  const range = Math.max(1, to - from);
  const pct = (m) => ((to - m) / range) * 100;
  const years = [];
  for (let y = Math.ceil(from / 12); y * 12 < to; y++) years.push(y);
  return (
    <div
      className={`relative row-start-1 col-start-1 md:col-start-2 self-stretch ${multiRow ? "row-span-2 md:row-span-1" : ""}`}
      aria-hidden="true"
    >
      {bars.map((bar) => {
        const start = Math.max(bar.start, from);
        const end = Math.min(bar.end, to);
        if (end <= start) return null;
        return (
          <span
            key={bar.key}
            className={`gantt-bar absolute w-1 ${bar.kind === "job" ? "left-[calc(50%-6px)] bg-blue-500" : "left-[calc(50%+2px)] bg-indigo-400"} ${bar.end <= to ? "rounded-t-full" : ""} ${bar.start >= from ? "rounded-b-full" : ""}`}
            style={{ top: `${pct(end)}%`, height: `${pct(start) - pct(end)}%` }}
          />
        );
      })}
      {years.map((y) => (
        <span key={y} className="absolute inset-x-0 flex items-center justify-center -translate-y-1/2" style={{ top: `${pct(y * 12)}%` }}>
          <span className="w-3 h-px bg-zinc-600 md:hidden" />
          <span className="hidden md:block px-1 rounded bg-zinc-950 text-[9px] leading-tight tabular-nums text-zinc-500">{y}</span>
        </span>
      ))}
    </div>
  );
}

function TaskList({ tasks, className = "" }) {
  return (
    <ul className={`flex flex-col gap-2 ${className}`}>
      {tasks.map((task) => (
        <li key={task} className="flex items-start gap-2.5 text-sm text-zinc-400">
          <span className="w-1 h-1 rounded-full bg-zinc-600 flex-shrink-0 mt-2" />
          {task}
        </li>
      ))}
    </ul>
  );
}

const Chevron = () => (
  <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 mt-1 flex-shrink-0 text-zinc-500 transition-transform group-open/card:rotate-180" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
  </svg>
);

// Jobs with successive positions (`roles`) list each one with its own period instead of a flat task list
function JobCard({ exp, open }) {
  return (
    <details className="group/card glow-card rounded-xl border border-zinc-800 bg-zinc-900/40" open={open}>
      <summary className="list-none cursor-pointer p-5 [&::-webkit-details-marker]:hidden">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span className="font-medium">{exp.title}</span>
              <span className="text-xs px-2 py-0.5 bg-blue-950 text-blue-400 border border-blue-900/50 rounded">{exp.type}</span>
            </div>
            <p className="text-sm text-zinc-400">{exp.company}</p>
          </div>
          <Chevron />
        </div>
      </summary>
      <div className="px-5 pb-5">
        <p className="text-xs text-zinc-500 mb-3">{exp.location}</p>
        {exp.roles ? (
          <ol className="flex flex-col gap-4 mb-4 border-l border-zinc-800 pl-4">
            {exp.roles.map((role) => (
              <li key={role.title} className="relative">
                <span className="absolute -left-[21px] top-1.5 w-2 h-2 rounded-full bg-blue-500" aria-hidden="true" />
                <p className="text-sm font-medium text-zinc-200">
                  {role.title} <span className="font-normal text-xs text-zinc-500">· {role.period}</span>
                </p>
                <TaskList tasks={role.tasks} className="mt-2" />
              </li>
            ))}
          </ol>
        ) : (
          <TaskList tasks={exp.tasks} className="mb-4" />
        )}
        {exp.stack && (
          <div className="flex flex-wrap gap-2">
            {exp.stack.map((tech) => (
              <span key={tech} className="group inline-flex items-center gap-1.5 px-2 py-1 bg-blue-950/50 border border-blue-900/50 text-blue-300 rounded text-xs">
                <TechLogo name={tech.toLowerCase()} className="w-3.5 h-3.5" />
                {tech}
              </span>
            ))}
          </div>
        )}
      </div>
    </details>
  );
}

const SpecialityBadge = ({ children }) => (
  <span className="text-xs px-2 py-0.5 bg-indigo-950 text-indigo-400 border border-indigo-900/50 rounded">{children}</span>
);

// Same card as JobCard. No dates: the Gantt axis carries them, except for grouped programs (`programs`),
// which are listed in the accordion with their own years like JobCard roles; a single school has no accordion
function SchoolCard({ f }) {
  const header = (
    <>
      <div className="flex flex-wrap items-center gap-2 mb-1">
        <span className="font-medium">{f.degree}</span>
        {f.speciality && <SpecialityBadge>{f.speciality}</SpecialityBadge>}
      </div>
      <p className="text-sm text-zinc-400">{f.school} · <span className="text-zinc-500">{f.location}</span></p>
    </>
  );
  if (!f.programs) return <div className="glow-card rounded-xl border border-zinc-800 bg-zinc-900/40 p-5">{header}</div>;
  return (
    <details className="group/card glow-card rounded-xl border border-zinc-800 bg-zinc-900/40" open>
      <summary className="list-none cursor-pointer p-5 [&::-webkit-details-marker]:hidden">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">{header}</div>
          <Chevron />
        </div>
      </summary>
      <div className="px-5 pb-5">
        <ol className="flex flex-col gap-3 border-l border-zinc-800 pl-4">
          {f.programs.map((p) => (
            <li key={p.degree} className="relative">
              <span className="absolute -left-[21px] top-1.5 w-2 h-2 rounded-full bg-indigo-400" aria-hidden="true" />
              <p className="text-sm font-medium text-zinc-200">
                {p.degree} <span className="font-normal text-xs text-zinc-500">· {p.period}</span>
              </p>
              {p.speciality && <div className="mt-1.5"><SpecialityBadge>{p.speciality}</SpecialityBadge></div>}
            </li>
          ))}
        </ol>
      </div>
    </details>
  );
}

// Jobs on the left, schools on the right, newest first: schools attended during a job sit beside it.
// The middle line is a Gantt axis (see GanttCell). Single column with the axis on the left below md.
export default function Timeline({ lang = "fr", experiences, formations }) {
  const t = getDict(lang).timeline;

  // One row per job, holding the schools started during it (work-study); other schools get their own row.
  // A grouped school is placed by its latest program and stretches the row back to its own start.
  const byStartDesc = (x, y) => y.start.localeCompare(x.start);
  const rows = experiences
    .map((exp) => ({ key: `job-${exp.start}`, start: exp.start, end: exp.end, job: [{ key: `job-${exp.start}`, start: exp.start, exp }], school: [] }));
  for (const f of formations) {
    const item = { key: `school-${f.degree}-${f.period}`, start: sortKey(f), f };
    const anchor = f.programs ? sortKey(f.programs[0]) : item.start;
    const row = rows.find((r) => r.job.length && r.job[0].start <= anchor && (r.end === null || anchor < r.end));
    if (row) {
      row.school.push(item);
      if (item.start < row.start) row.start = item.start;
    } else rows.push({ key: item.key, start: item.start, job: [], school: [item] });
  }
  rows.sort(byStartDesc);
  rows.forEach((row) => row.school.sort(byStartDesc));

  const bars = [
    ...experiences.map((exp) => ({ key: `job-${exp.start}`, kind: "job", start: monthIndex(exp.start), end: monthIndex(exp.end) })),
    ...formations.map((f) => ({ key: `school-${f.degree}`, kind: "school", start: monthIndex(sortKey(f)), end: monthIndex(schoolEnd(f)) })),
  ];
  // Each row spans from its start up to the next (newer) row's start; the top row up to the latest end
  const axisTop = Math.max(monthIndex(null), ...bars.map((b) => b.end));

  return (
    <div className="relative">
      <div className="hidden md:grid grid-cols-[1fr_3rem_1fr] mb-6 text-xs font-semibold uppercase tracking-wider">
        <p className="text-right text-blue-400">{t.work}</p>
        <span />
        <p className="text-indigo-400">{t.school}</p>
      </div>
      <div className="timeline-line absolute top-10 bottom-0 left-[7px] md:left-1/2 md:-translate-x-px w-px bg-zinc-800" data-reveal aria-hidden="true" />
      <ol className="flex flex-col">
        {rows.map((row, i) => (
          <li
            key={row.key}
            className="relative grid grid-cols-[1rem_1fr] md:grid-cols-[1fr_3rem_1fr] gap-x-4 md:gap-x-0 gap-y-6 items-start pb-10 md:pb-14 last:pb-0"
            data-reveal
          >
            <GanttCell
              from={monthIndex(row.start)}
              to={i === 0 ? axisTop : monthIndex(rows[i - 1].start)}
              bars={bars}
              multiRow={row.job.length > 0 && row.school.length > 0}
            />
            {row.job.length > 0 && (
              <div className="row-start-1 col-start-2 md:col-start-1 md:pr-2 flex flex-col gap-6">
                {row.job.map((item) => (
                  <div key={item.key}>
                    <p className="md:hidden text-[11px] font-semibold uppercase tracking-wider mb-1.5 text-zinc-500">{t.work} · {item.start.slice(0, 4)}</p>
                    <JobCard exp={item.exp} open />
                  </div>
                ))}
              </div>
            )}
            {row.school.length > 0 && (
              <div className={`col-start-2 md:col-start-3 md:row-start-1 md:pl-2 flex flex-col gap-6 ${row.job.length ? "row-start-2" : "row-start-1"}`}>
                {row.school.map((item) => (
                  <div key={item.key}>
                    <p className="md:hidden text-[11px] font-semibold uppercase tracking-wider mb-1.5 text-zinc-500">{t.school}{row.job.length ? "" : ` · ${row.start.slice(0, 4)}`}</p>
                    <SchoolCard f={item.f} />
                  </div>
                ))}
              </div>
            )}
          </li>
        ))}
      </ol>
    </div>
  );
}
