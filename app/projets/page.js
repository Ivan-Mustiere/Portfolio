'use client';

import { useEffect, useState } from 'react';
import Nav from "@/app/components/Nav";
import { pastProjects } from "@/lib/data";

const CATEGORIES = ["École", "Perso", "Pro"];

export default function ProjetsPage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/projects')
      .then((r) => r.json())
      .then((data) => { setProjects(Array.isArray(data) ? data : []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans">
      <Nav activePage="projets" />

      <main className="max-w-4xl mx-auto px-6 pt-32 pb-24">

        {/* Démos interactives */}
        <div className="mb-12">
          <h1 className="text-3xl font-bold tracking-tight mb-3">Projets interactifs</h1>
          <p className="text-zinc-400 max-w-xl leading-relaxed">
            Lance n'importe quel projet directement depuis le navigateur. Un conteneur Docker démarre,
            tu accèdes à l'interface en quelques secondes — sans rien installer.
          </p>
          <p className="text-xs text-zinc-600 mt-3">Chaque session dure 15 minutes et est automatiquement supprimée.</p>
        </div>

        {loading && <p className="text-zinc-500 text-sm">Chargement…</p>}

        {!loading && projects.length === 0 && (
          <p className="text-zinc-500 text-sm p-6 border border-zinc-800 rounded-xl">
            Aucun projet trouvé. Ajoutez un dossier avec un <code className="text-zinc-400">portfolio.json</code> dans <code className="text-zinc-400">projets/</code>.
          </p>
        )}

        {!loading && projects.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {projects.map((p) => (
              <a
                key={p.id}
                href={`/projets/${p.id}`}
                className="group p-6 border border-zinc-800 rounded-xl hover:border-zinc-600 transition-colors flex flex-col gap-4"
              >
                <div>
                  <h3 className="font-medium mb-2 group-hover:text-white transition-colors">{p.name}</h3>
                  <p className="text-sm text-zinc-400 leading-relaxed">{p.description}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {(p.tags || []).map((tag) => (
                    <span key={tag} className="px-2 py-0.5 bg-zinc-800 text-zinc-400 rounded text-xs">{tag}</span>
                  ))}
                </div>
                <div className="flex items-center justify-between mt-auto pt-2">
                  <span className="text-xs text-zinc-500">
                    {p.estimatedStartSeconds
                      ? `~${p.estimatedStartSeconds < 60 ? `${p.estimatedStartSeconds}s` : `${Math.round(p.estimatedStartSeconds / 60)} min`} pour démarrer`
                      : 'Démo interactive'}
                  </span>
                  <span className="text-xs text-zinc-500 group-hover:text-zinc-300 transition-colors">Lancer →</span>
                </div>
              </a>
            ))}
          </div>
        )}

        {/* Projets passés */}
        <div className="mt-20 mb-12 border-t border-zinc-800 pt-16">
          <h2 className="text-2xl font-bold tracking-tight mb-3">Projets passés</h2>
          <p className="text-zinc-400 max-w-xl leading-relaxed text-sm">
            Projets réalisés en formation, en autonomie ou en contexte professionnel — sans démo interactive.
          </p>
        </div>

        <div className="flex flex-col gap-14">
          {CATEGORIES.map((cat) => {
            const items = pastProjects.filter((p) => p.category === cat);
            if (items.length === 0) return null;
            return (
              <div key={cat}>
                <h3 className="text-xs font-semibold text-blue-400 uppercase tracking-widest mb-6">{cat}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {items.map((p) => (
                    <div
                      key={p.id}
                      className="p-5 border border-zinc-800 rounded-xl flex flex-col gap-3"
                    >
                      <h4 className="font-medium text-sm">{p.name}</h4>
                      <p className="text-sm text-zinc-500 leading-relaxed">{p.description}</p>
                      {p.highlights && (
                        <ul className="flex flex-col gap-1.5">
                          {p.highlights.map((h) => (
                            <li key={h} className="flex items-start gap-2 text-xs text-zinc-600">
                              <span className="w-1 h-1 rounded-full bg-zinc-700 flex-shrink-0 mt-1.5" />
                              {h}
                            </li>
                          ))}
                        </ul>
                      )}
                      <div className="flex flex-wrap gap-1.5 mt-auto pt-1">
                        {p.stack.map((s) => (
                          <span key={s} className="px-2 py-0.5 bg-zinc-900 border border-zinc-800 text-zinc-500 rounded text-xs">{s}</span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

      </main>

      <footer className="border-t border-zinc-800">
        <div className="max-w-4xl mx-auto px-6 py-8 text-sm text-zinc-600 text-center">
          © {new Date().getFullYear()} Ivan Mustière
        </div>
      </footer>
    </div>
  );
}
