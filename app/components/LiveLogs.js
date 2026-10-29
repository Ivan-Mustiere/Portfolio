"use client";

import { useEffect, useRef, useState } from "react";
import { getDict } from "@/lib/i18n";

const POLL_INTERVAL = 1200;
const MAX_LINES = 300;

function lineClass(text) {
  if (/\b(error|fatal|failed|exception)\b/i.test(text)) return "text-red-400";
  if (/\b(warn|warning)\b/i.test(text)) return "text-orange-400";
  if (/^✔|\b(Started|Created|Pulled|ready|listening|Listening)\b/.test(text)) return "text-emerald-400";
  return "text-zinc-400";
}

// Tails the container's startup output (docker compose up + logs -f) while the demo starts.
// `collapsible` folds it into a closed <details> (logs keep streaming while folded).
export default function LiveLogs({ sessionId, className = "", collapsible = false, lang = "fr" }) {
  const t = getDict(lang).demo;
  const [lines, setLines] = useState([]);
  const sinceRef = useRef(0);
  const boxRef = useRef(null);
  const stickRef = useRef(true);

  useEffect(() => {
    if (!sessionId) return;
    let active = true;
    let timer;
    const poll = async () => {
      try {
        const res = await fetch(`/api/demo/logs/${sessionId}?since=${sinceRef.current}`, { cache: "no-store" });
        if (res.ok) {
          const data = await res.json();
          if (!active) return;
          if (data.lines?.length) {
            sinceRef.current = data.next;
            setLines((prev) => [...prev, ...data.lines].slice(-MAX_LINES));
          }
          if (data.status !== "starting") return;
        }
      } catch {}
      if (active) timer = setTimeout(poll, POLL_INTERVAL);
    };
    poll();
    return () => { active = false; clearTimeout(timer); };
  }, [sessionId]);

  // Follow the tail unless the visitor scrolled up to read
  useEffect(() => {
    const box = boxRef.current;
    if (box && stickRef.current) box.scrollTop = box.scrollHeight;
  }, [lines]);

  const onScroll = () => {
    const box = boxRef.current;
    stickRef.current = box.scrollHeight - box.scrollTop - box.clientHeight < 24;
  };

  const header = (
    <>
      <span className="font-mono">docker compose logs -f</span>
      <span className="flex items-center gap-1.5">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" aria-hidden="true" />
        live
        {collapsible && (
          <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 ml-1 transition-transform group-open/logs:rotate-180" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
          </svg>
        )}
      </span>
    </>
  );
  const headerClass = "flex items-center justify-between px-3 py-2 text-[11px] text-zinc-500";

  const box = (
    <div
      ref={boxRef}
      onScroll={onScroll}
      className="h-56 overflow-y-auto px-3 py-2 font-mono text-[11px] leading-relaxed border-t border-zinc-800"
      role="log"
      aria-live="off"
      aria-label={t.logsLabel}
    >
      {lines.length === 0 && <p className="text-zinc-500">{t.logsWaiting}</p>}
      {lines.map((l) => (
        <p key={l.n} className={`whitespace-pre-wrap break-all ${lineClass(l.text)}`}>{l.text}</p>
      ))}
    </div>
  );

  if (collapsible) {
    return (
      <details
        className={`group/logs rounded-lg border border-zinc-800 bg-zinc-950 overflow-hidden ${className}`}
        // The box had no height while folded: jump to the tail when unfolded
        onToggle={(e) => { if (e.currentTarget.open && boxRef.current) boxRef.current.scrollTop = boxRef.current.scrollHeight; }}
      >
        <summary className={`${headerClass} list-none cursor-pointer hover:text-zinc-300 transition-colors [&::-webkit-details-marker]:hidden`}>
          {header}
        </summary>
        {box}
      </details>
    );
  }

  return (
    <div className={`rounded-lg border border-zinc-800 bg-zinc-950 overflow-hidden ${className}`}>
      <div className={headerClass}>{header}</div>
      {box}
    </div>
  );
}
