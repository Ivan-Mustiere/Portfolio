"use client";

import { useId, useState } from "react";

// Graph / Code switch for PipelineDag, like Airflow's own DAG view. Panels are rendered on the server.
export default function DagTabs({ title, legend, graph, code, labels }) {
  const [tab, setTab] = useState("graph");
  const id = useId();
  const tabs = [
    { key: "graph", label: labels.graph },
    { key: "code", label: labels.code },
  ];

  const onKeyDown = (e) => {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    e.preventDefault();
    const next = tab === "graph" ? "code" : "graph";
    setTab(next);
    document.getElementById(`${id}-${next}`)?.focus();
  };

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-2.5 border-b border-zinc-800 text-xs">
        <div className="flex items-center gap-4">
          {title}
          <div role="tablist" aria-label="Vue du DAG" className="flex p-0.5 rounded-lg border border-zinc-800 bg-zinc-950" onKeyDown={onKeyDown}>
            {tabs.map((t) => (
              <button
                key={t.key}
                id={`${id}-${t.key}`}
                type="button"
                role="tab"
                aria-selected={tab === t.key}
                aria-controls={`${id}-${t.key}-panel`}
                tabIndex={tab === t.key ? 0 : -1}
                onClick={() => setTab(t.key)}
                className={`px-2.5 py-1 rounded-md transition-colors ${tab === t.key ? "bg-zinc-800 text-zinc-100" : "text-zinc-500 hover:text-zinc-300"}`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>
        {tab === "graph" && legend}
      </div>
      <div id={`${id}-${tab}-panel`} role="tabpanel" aria-labelledby={`${id}-${tab}`}>
        {tab === "graph" ? graph : code}
      </div>
    </>
  );
}
