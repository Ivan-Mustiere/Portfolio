"use client";

import { useId, useState } from "react";

// Accessible tabs whose panels are rendered on the server and passed in as nodes,
// so heavy server-only modules (e.g. logo paths) stay out of the client bundle.
export default function Tabs({ tabs, label, className = "" }) {
  const [active, setActive] = useState(tabs[0]?.key);
  const id = useId();
  const current = tabs.find((t) => t.key === active) ?? tabs[0];

  const onKeyDown = (e) => {
    const i = tabs.findIndex((t) => t.key === active);
    const delta = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
    if (!delta) return;
    e.preventDefault();
    const next = tabs[(i + delta + tabs.length) % tabs.length].key;
    setActive(next);
    document.getElementById(`${id}-${next}`)?.focus();
  };

  return (
    <div className={className}>
      <div role="tablist" aria-label={label} onKeyDown={onKeyDown} className="flex flex-wrap gap-1 p-1 mb-6 rounded-xl border border-zinc-800 bg-zinc-900/40 w-fit max-w-full">
        {tabs.map((t) => (
          <button
            key={t.key}
            id={`${id}-${t.key}`}
            type="button"
            role="tab"
            aria-selected={t.key === current.key}
            aria-controls={`${id}-panel`}
            tabIndex={t.key === current.key ? 0 : -1}
            onClick={() => setActive(t.key)}
            className={`px-3.5 py-1.5 rounded-lg text-sm transition-colors ${
              t.key === current.key ? "bg-zinc-100 text-zinc-900 font-medium" : "text-zinc-400 hover:text-zinc-100"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>
      <div id={`${id}-panel`} role="tabpanel" aria-labelledby={`${id}-${current.key}`} key={current.key} className="tab-panel">
        {current.panel}
      </div>
    </div>
  );
}
