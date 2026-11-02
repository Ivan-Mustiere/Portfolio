"use client";

import { useEffect, useState } from "react";
import { getDict } from "@/lib/i18n";

const POLL_INTERVAL = 10000;

function formatUptime(seconds, dayUnit) {
  const d = Math.floor(seconds / 86400);
  const h = Math.floor((seconds % 86400) / 3600);
  if (d > 0) return `${d} ${dayUnit} ${h} h`;
  const m = Math.floor((seconds % 3600) / 60);
  return `${h} h ${m} min`;
}

function formatGb(bytes, lang) {
  return (bytes / 1024 ** 3).toLocaleString(lang, { minimumFractionDigits: 1, maximumFractionDigits: 1 });
}

function Meter({ value }) {
  const pct = Math.min(Math.max(value, 0), 1) * 100;
  const color = pct > 85 ? "bg-red-500" : pct > 65 ? "bg-orange-400" : "bg-blue-500";
  return (
    <div className="h-1 w-full rounded-full bg-zinc-800 overflow-hidden mt-3" aria-hidden="true">
      <div className={`h-full rounded-full ${color} transition-[width] duration-700`} style={{ width: `${pct}%` }} />
    </div>
  );
}

// Last 10 minutes as an area chart; falls back to a meter until there are two samples
function Sparkline({ values, current, label }) {
  if (!values || values.length < 2) return <Meter value={current} />;
  const max = Math.max(1, ...values);
  const pts = values.map((v, i) => [(i / (values.length - 1)) * 100, 30 - (Math.min(v, max) / max) * 28]);
  const line = pts.map(([x, y], i) => `${i ? "L" : "M"}${x.toFixed(2)} ${y.toFixed(2)}`).join(" ");
  const last = values.at(-1);
  const color = last > 0.85 ? "var(--color-red-500)" : last > 0.65 ? "var(--color-orange-400)" : "var(--color-blue-500)";
  return (
    <svg viewBox="0 0 100 32" preserveAspectRatio="none" className="w-full h-8 mt-3 overflow-visible" role="img" aria-label={label}>
      <path d={`${line} L100 32 L0 32 Z`} fill={color} opacity="0.15" />
      <path d={line} fill="none" stroke={color} strokeWidth="1.5" vectorEffect="non-scaling-stroke" strokeLinejoin="round" />
    </svg>
  );
}

function Tile({ label, value, sub, children }) {
  return (
    <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-900/40">
      <p className="text-xs text-zinc-500 uppercase tracking-wider">{label}</p>
      <p className="font-mono text-xl text-zinc-100 mt-2 tabular-nums">{value}</p>
      {sub && <p className="text-xs text-zinc-500 mt-1">{sub}</p>}
      {children}
    </div>
  );
}

export default function InfraStatus({ lang = "fr" }) {
  const t = getDict(lang).infra;
  const [stats, setStats] = useState(null);
  const [offline, setOffline] = useState(false);

  useEffect(() => {
    let active = true;
    const load = () =>
      fetch("/api/stats", { cache: "no-store" })
        .then((r) => (r.ok ? r.json() : Promise.reject()))
        .then((data) => { if (active) { setStats(data); setOffline(false); } })
        .catch(() => { if (active) setOffline(true); });
    load();
    const id = setInterval(load, POLL_INTERVAL);
    return () => { active = false; clearInterval(id); };
  }, []);

  const s = stats;
  const dash = "—";
  const demos = s?.activeDemos ?? [];

  return (
    <div>
      <div className="flex items-center gap-2 mb-4 text-xs">
        <span className={`w-1.5 h-1.5 rounded-full ${offline ? "bg-zinc-600" : s ? "bg-emerald-400 animate-pulse" : "bg-zinc-600"}`} />
        <span className="text-zinc-500" aria-live="polite">
          {offline ? t.offline : s ? t.live : t.connecting}
        </span>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <Tile
          label={t.demos}
          value={s ? demos.length : dash}
          sub={s ? (demos.length ? demos.map((d) => d.projectId).join(", ") : t.noDemo) : null}
        />
        <Tile
          label={t.cpu}
          value={s ? `${Math.round((s.load1 / s.cpuCount) * 100)} %` : dash}
          sub={s ? t.cores(s.cpuCount) : null}
        >
          {s && <Sparkline values={s.history?.cpu} current={s.load1 / s.cpuCount} label={t.cpuHistory} />}
        </Tile>
        <Tile
          label={t.memory}
          value={s ? `${formatGb(s.memUsed, lang)} ${t.gb}` : dash}
          sub={s ? t.memOf(formatGb(s.memTotal, lang)) : null}
        >
          {s && <Sparkline values={s.history?.mem} current={s.memUsed / s.memTotal} label={t.memHistory} />}
        </Tile>
        <Tile
          label={t.uptime}
          value={s ? formatUptime(s.uptimeSeconds, t.days) : dash}
          sub={s ? t.uptimeSub(s.containersRunning ?? dash, s.launchesToday) : null}
        />
      </div>
    </div>
  );
}
