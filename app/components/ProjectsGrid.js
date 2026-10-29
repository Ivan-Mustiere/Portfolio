"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { getDict, localizeProject, projectsHref } from "@/lib/i18n";

const STATS_POLL_INTERVAL = 15000;

function formatDuration(seconds) {
  if (!seconds) return "1 min";
  return seconds < 60 ? `${seconds} s` : `${Math.round(seconds / 60)} min`;
}

function SkeletonCard() {
  return (
    <div className="p-6 border border-zinc-800 rounded-xl flex flex-col gap-4 animate-pulse" aria-hidden="true">
      <div className="aspect-[16/9] -mx-6 -mt-6 mb-1 rounded-t-xl bg-zinc-900" />
      <div className="h-4 w-1/2 rounded bg-zinc-800" />
      <div className="h-3 w-full rounded bg-zinc-900" />
      <div className="h-3 w-4/5 rounded bg-zinc-900" />
    </div>
  );
}

// Screenshot from portfolio.json `images[0]` (a path under public/), else a generated header
function CardMedia({ project }) {
  const src = project.images?.[0];
  if (src) {
    return (
      <div className="relative aspect-[16/9] -mx-6 -mt-6 mb-1 overflow-hidden rounded-t-xl border-b border-zinc-800">
        <Image src={src} alt="" fill sizes="(min-width: 640px) 420px, 100vw" className="object-cover object-top transition-transform duration-500 group-hover:scale-[1.03]" />
      </div>
    );
  }
  return (
    <div className="relative aspect-[16/9] -mx-6 -mt-6 mb-1 overflow-hidden rounded-t-xl border-b border-zinc-800 bg-zinc-900 bg-grid" aria-hidden="true">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,color-mix(in_oklab,var(--color-blue-500)_22%,transparent),transparent_60%)]" />
      <span className="absolute left-6 bottom-4 font-mono text-sm text-zinc-400">
        <span className="text-blue-400">$</span> docker compose up {project.id}
      </span>
    </div>
  );
}

// placeholder: show skeletons while loading; emptyMessage: shown when no demo exists (else renders nothing)
export default function ProjectsGrid({ lang = "fr", placeholder = false, emptyMessage = null }) {
  const t = getDict(lang).projects;
  const [projects, setProjects] = useState(null);
  const [running, setRunning] = useState({});

  useEffect(() => {
    fetch("/api/projects")
      .then((r) => r.json())
      .then((data) => setProjects(Array.isArray(data) ? data : []))
      .catch(() => setProjects([]));
  }, []);

  // Live badge: which demos already have an instance up (from the infra stats endpoint)
  useEffect(() => {
    let active = true;
    const load = () =>
      fetch("/api/stats", { cache: "no-store" })
        .then((r) => (r.ok ? r.json() : Promise.reject()))
        .then((data) => {
          if (!active) return;
          setRunning(Object.fromEntries((data.activeDemos || []).map((d) => [d.projectId, d.status])));
        })
        .catch(() => {});
    load();
    const id = setInterval(load, STATS_POLL_INTERVAL);
    return () => { active = false; clearInterval(id); };
  }, []);

  if (projects === null) {
    return placeholder ? (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4"><SkeletonCard /><SkeletonCard /></div>
    ) : null;
  }
  if (projects.length === 0) {
    return emptyMessage ? <p className="text-zinc-500 text-sm p-6 border border-zinc-800 rounded-xl">{emptyMessage}</p> : null;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {projects.map((raw) => {
        const p = localizeProject(raw, lang);
        const status = running[p.id];
        return (
          <Link
            key={p.id}
            href={projectsHref(lang, p.id)}
            className="group glow-card p-6 border border-zinc-800 rounded-xl hover:border-zinc-600 transition-colors flex flex-col gap-4 overflow-hidden"
          >
            <CardMedia project={p} />
            <div>
              <div className="flex items-center justify-between gap-3 mb-2">
                <h3 className="font-medium group-hover:text-white transition-colors">{p.name}</h3>
                {status && (
                  <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-xs whitespace-nowrap">
                    <span className={`w-1.5 h-1.5 rounded-full bg-emerald-400 ${status === "starting" ? "animate-pulse" : ""}`} />
                    {t.online}
                  </span>
                )}
              </div>
              <p className="text-sm text-zinc-500 leading-relaxed">{p.description}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {(p.tags || []).map((tag) => (
                <span key={tag} className="px-2 py-0.5 bg-zinc-800 text-zinc-400 rounded text-xs">{tag}</span>
              ))}
            </div>
            <div className="flex items-center justify-between mt-auto pt-2">
              <span className="text-xs text-zinc-500">{t.startTime(formatDuration(p.estimatedStartSeconds))}</span>
              <span className="text-xs text-zinc-500 group-hover:text-blue-400 transition-colors" aria-hidden="true">{t.launch}</span>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
