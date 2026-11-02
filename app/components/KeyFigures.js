"use client";

import { useEffect, useRef, useState } from "react";

const DURATION = 1400;

// Counts up from 0 when first scrolled into view. Server HTML has the final values (no-JS, SEO);
// if the block is already visible on load it simply stays as is.
function Counter({ value, suffix = "" }) {
  const ref = useRef(null);
  const [display, setDisplay] = useState(value);

  useEffect(() => {
    const el = ref.current;
    if (!el || matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) return;
    let frame = 0;
    let armed = false;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) {
        // Below the fold on first check: reset so it can count up later
        if (!armed) { armed = true; setDisplay(0); }
        return;
      }
      observer.disconnect();
      if (!armed) return;
      const t0 = performance.now();
      const tick = (now) => {
        const p = Math.min((now - t0) / DURATION, 1);
        setDisplay(Math.round(value * (1 - Math.pow(1 - p, 3))));
        if (p < 1) frame = requestAnimationFrame(tick);
      };
      frame = requestAnimationFrame(tick);
    }, { threshold: 0.4 });
    observer.observe(el);
    return () => { observer.disconnect(); cancelAnimationFrame(frame); };
  }, [value]);

  return <span ref={ref} className="tabular-nums">{display}{suffix}</span>;
}

export default function KeyFigures({ figures, liveLabel }) {
  const [demos, setDemos] = useState(null);

  useEffect(() => {
    fetch("/api/projects")
      .then((r) => r.json())
      .then((data) => setDemos(Array.isArray(data) ? data.length : 0))
      .catch(() => {});
  }, []);

  const all = demos ? [...figures, { value: demos, label: liveLabel, live: true }] : figures;

  return (
    <dl className={`grid grid-cols-2 ${all.length > 3 ? "md:grid-cols-4" : "md:grid-cols-3"} gap-3`}>
      {all.map((f) => (
        <div key={f.label} className="glow-card p-5 rounded-xl border border-zinc-800 bg-zinc-900/40">
          <dt className="text-xs text-zinc-500 flex items-center gap-1.5">
            {f.live && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" aria-hidden="true" />}
            {f.label}
          </dt>
          <dd className="text-3xl md:text-4xl font-semibold tracking-tight mt-1 text-zinc-100">
            <Counter value={f.value} suffix={f.suffix} />
          </dd>
        </div>
      ))}
    </dl>
  );
}
