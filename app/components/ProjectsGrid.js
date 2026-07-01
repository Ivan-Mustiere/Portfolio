"use client";

import { useEffect, useState } from "react";

export default function ProjectsGrid() {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    fetch("/api/projects")
      .then((r) => r.json())
      .then((data) => setProjects(data))
      .catch(() => {});
  }, []);

  if (projects.length === 0) return null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {projects.map((p) => (
        <a
          key={p.id}
          href={`/projets/${p.id}`}
          className="group p-6 border border-zinc-800 rounded-xl hover:border-zinc-600 transition-colors flex flex-col gap-4"
        >
          <div>
            <h3 className="font-medium mb-2 group-hover:text-white transition-colors">{p.name}</h3>
            <p className="text-sm text-zinc-500 leading-relaxed">{p.description}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {(p.tags || []).map((tag) => (
              <span key={tag} className="px-2 py-0.5 bg-zinc-800 text-zinc-400 rounded text-xs">{tag}</span>
            ))}
          </div>
          <div className="flex items-center justify-between mt-auto pt-2">
            <span className="text-xs text-zinc-500">~{Math.round(p.estimatedStartTime / 60) || 1} min pour démarrer</span>
            <span className="text-xs text-zinc-500 group-hover:text-blue-400 transition-colors">Lancer →</span>
          </div>
        </a>
      ))}
    </div>
  );
}
