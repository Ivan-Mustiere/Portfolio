import Link from "next/link";
import { getDict, projectsHref } from "@/lib/i18n";

// Each line appears at `at` seconds; commands are typed over `type` seconds.
// Pure CSS (see .term-* in globals.css): no JS, and fully shown with reduced motion.
const lines = (t) => [
  { kind: "cmd", text: "docker compose -p demo-grafana up -d", at: 0.4, type: 1.6 },
  { kind: "out", text: "[+] Running 2/2", at: 2.3 },
  { kind: "ok", text: "✔ Network demo-grafana_default  Created", at: 2.6 },
  { kind: "ok", text: "✔ Container demo-grafana-1      Started", at: 3.0 },
  { kind: "cmd", text: "curl -s localhost:3000/api/health", at: 3.6, type: 1.2 },
  { kind: "out", text: '{"database":"ok","version":"12.0.0"}', at: 5.0 },
  { kind: "note", text: t.note, at: 5.5 },
];
const BUTTON_AT = 6.0;

const LINE_STYLE = {
  out: "text-zinc-400",
  ok: "text-emerald-400",
  note: "text-zinc-500",
};

export default function HeroTerminal({ lang = "fr" }) {
  const t = getDict(lang).terminal;
  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 shadow-2xl shadow-blue-950/20 overflow-hidden">
      <div className="flex items-center gap-2 px-4 py-2.5 border-b border-zinc-800 bg-zinc-900">
        <span className="w-2.5 h-2.5 rounded-full bg-zinc-700" />
        <span className="w-2.5 h-2.5 rounded-full bg-zinc-700" />
        <span className="w-2.5 h-2.5 rounded-full bg-zinc-700" />
        <span className="ml-2 text-xs text-zinc-500 font-mono" aria-hidden="true">ivan@vps: ~/portfolio</span>
      </div>
      <div className="px-4 py-4 font-mono text-xs sm:text-sm leading-relaxed overflow-x-auto">
        {lines(t).map((line) => (
          <div
            key={line.text}
            className="term-line whitespace-pre"
            style={{ "--at": `${line.at}s` }}
          >
            {line.kind === "cmd" ? (
              <>
                <span className="text-blue-400">$ </span>
                <span
                  className="term-type text-zinc-100"
                  style={{ "--chars": line.text.length, "--dur": `${line.type}s` }}
                >
                  {line.text}
                </span>
              </>
            ) : (
              <span className={LINE_STYLE[line.kind]}>{line.text}</span>
            )}
          </div>
        ))}
        <div className="term-line flex flex-wrap items-center gap-3 mt-3" style={{ "--at": `${BUTTON_AT}s` }}>
          <span className="text-blue-400">$</span>
          <span className="term-cursor" aria-hidden="true" />
          <Link
            href={projectsHref(lang, "grafana")}
            className="ml-auto inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/40 text-blue-300 font-sans text-xs font-medium hover:bg-blue-500/20 hover:text-blue-200 transition-colors"
          >
            {t.cta}
            <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}
