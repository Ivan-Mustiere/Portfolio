"use client";

import { useMemo, useState } from "react";
import { pastProjects as pastFr } from "@/lib/data";
import { pastProjects as pastEn } from "@/lib/data.en";
import { getDict } from "@/lib/i18n";

// Category keys are shared by both languages; labels come from i18n (past.categories)
const CATEGORIES = ["Pro", "École", "Perso"];
const CATEGORY_STYLE = {
  Pro: "text-blue-400 border-blue-500/30 bg-blue-500/10",
  École: "text-indigo-400 border-indigo-500/30 bg-indigo-500/10",
  Perso: "text-emerald-400 border-emerald-500/30 bg-emerald-500/10",
};

function Chip({ active, onClick, children, count }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-medium transition-colors ${
        active ? "border-zinc-100 bg-zinc-100 text-zinc-900" : "border-zinc-800 text-zinc-400 hover:border-zinc-600 hover:text-zinc-100"
      }`}
    >
      {children}
      {count !== undefined && <span className={active ? "text-zinc-600" : "text-zinc-500"}>{count}</span>}
    </button>
  );
}

export default function PastProjects({ lang = "fr" }) {
  const t = getDict(lang).past;
  const pastProjects = lang === "en" ? pastEn : pastFr;
  const [category, setCategory] = useState(null);
  const [tech, setTech] = useState(null);

  const counts = useMemo(
    () => Object.fromEntries(CATEGORIES.map((c) => [c, pastProjects.filter((p) => p.category === c).length])),
    [pastProjects]
  );

  const visible = pastProjects
    .filter((p) => !category || p.category === category)
    .filter((p) => !tech || p.stack.includes(tech))
    .sort((a, b) => CATEGORIES.indexOf(a.category) - CATEGORIES.indexOf(b.category));

  return (
    <div>
      <div className="flex flex-wrap items-center gap-2 mb-6" role="group" aria-label={t.filterLabel}>
        <Chip active={!category} onClick={() => setCategory(null)} count={pastProjects.length}>{t.all}</Chip>
        {CATEGORIES.map((c) => (
          <Chip key={c} active={category === c} onClick={() => setCategory(category === c ? null : c)} count={counts[c]}>
            {t.categories[c]}
          </Chip>
        ))}
        {tech && (
          <button
            type="button"
            onClick={() => setTech(null)}
            className="inline-flex items-center gap-1.5 ml-auto px-3 py-1.5 rounded-full border border-blue-500/40 bg-blue-500/10 text-xs text-blue-300 hover:bg-blue-500/20 transition-colors"
          >
            {tech}
            <span aria-hidden="true">✕</span>
            <span className="sr-only">{t.removeFilter}</span>
          </button>
        )}
      </div>

      <p className="sr-only" aria-live="polite">{t.shown(visible.length)}</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {visible.map((p) => (
          <article key={p.id} className="glow-card p-5 border border-zinc-800 rounded-xl flex flex-col gap-3">
            <div className="flex items-start justify-between gap-3">
              <h3 className="font-medium text-sm">{p.name}</h3>
              <span className={`px-2 py-0.5 rounded-full border text-[11px] whitespace-nowrap ${CATEGORY_STYLE[p.category]}`}>{t.categories[p.category]}</span>
            </div>
            <p className="text-sm text-zinc-500 leading-relaxed">{p.description}</p>
            {p.highlights && (
              <ul className="flex flex-col gap-1.5">
                {p.highlights.map((h) => (
                  <li key={h} className="flex items-start gap-2 text-xs text-zinc-500">
                    <span className="w-1 h-1 rounded-full bg-blue-500/70 flex-shrink-0 mt-1.5" />
                    {h}
                  </li>
                ))}
              </ul>
            )}
            <div className="flex flex-wrap gap-1.5 mt-auto pt-1">
              {p.stack.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setTech(tech === s ? null : s)}
                  aria-pressed={tech === s}
                  title={t.filterBy(s)}
                  className={`px-2 py-0.5 rounded text-xs border transition-colors ${
                    tech === s
                      ? "border-blue-500/40 bg-blue-500/10 text-blue-300"
                      : "bg-zinc-900 border-zinc-800 text-zinc-500 hover:text-zinc-300 hover:border-zinc-600"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </article>
        ))}
      </div>

      {visible.length === 0 && (
        <p className="text-sm text-zinc-500 p-6 border border-zinc-800 rounded-xl text-center">
          {t.none}{" "}
          <button type="button" onClick={() => { setCategory(null); setTech(null); }} className="text-blue-400 hover:text-blue-300 underline underline-offset-2">
            {t.reset}
          </button>
        </p>
      )}
    </div>
  );
}
