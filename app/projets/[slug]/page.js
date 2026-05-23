'use client';

import { useEffect, useState, useCallback, use } from 'react';

const POLL_INTERVAL = 3000;
const TTL_MINUTES = 15;
const MAX_EXTENSIONS = 3;

function StatusDot({ status }) {
  const colors = {
    idle: 'bg-zinc-600',
    starting: 'bg-yellow-500 animate-pulse',
    ready: 'bg-green-500',
    error: 'bg-red-500',
  };
  return <span className={`inline-block w-2 h-2 rounded-full ${colors[status] || colors.idle}`} />;
}

function CountdownBadge({ startedAt }) {
  const [leftMs, setLeftMs] = useState(TTL_MINUTES * 60 * 1000);

  useEffect(() => {
    const update = () => setLeftMs(TTL_MINUTES * 60 * 1000 - (Date.now() - startedAt));
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, [startedAt]);

  if (leftMs <= 0) return null;
  const m = Math.floor(leftMs / 60000);
  const s = Math.floor((leftMs % 60000) / 1000);
  const label = `${m}:${s.toString().padStart(2, '0')}`;
  const critical = leftMs < 60 * 1000;
  const warning = leftMs < 2 * 60 * 1000;

  return (
    <span className={`flex items-center gap-1.5 text-xs font-mono px-2 py-0.5 rounded-full border transition-colors
      ${critical
        ? 'text-red-400 border-red-800 bg-red-950/40 animate-pulse'
        : warning
          ? 'text-orange-400 border-orange-800 bg-orange-950/30'
          : 'text-zinc-500 border-zinc-800'
      }`}
    >
      {critical && <span>⚠</span>}
      {label}
    </span>
  );
}

function ElapsedTimer({ startedAt, estimatedSeconds }) {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    setElapsed(Math.floor((Date.now() - startedAt) / 1000));
    const id = setInterval(() => setElapsed(Math.floor((Date.now() - startedAt) / 1000)), 1000);
    return () => clearInterval(id);
  }, [startedAt]);

  const m = Math.floor(elapsed / 60);
  const s = elapsed % 60;
  const progress = estimatedSeconds ? Math.min(elapsed / estimatedSeconds, 1) : null;

  return (
    <div className="flex flex-col gap-1.5 w-full max-w-xs">
      <div className="flex items-center justify-between text-xs">
        <span className="font-mono text-yellow-500/70">{m > 0 ? `${m}m ` : ''}{s.toString().padStart(2, '0')}s</span>
        {estimatedSeconds && (
          <span className="text-zinc-600">
            ~{estimatedSeconds < 60 ? `${estimatedSeconds}s` : `${Math.round(estimatedSeconds / 60)} min`}
          </span>
        )}
      </div>
      {progress !== null && (
        <div className="h-1 w-full bg-zinc-800 rounded-full overflow-hidden">
          <div className="h-full bg-yellow-500/60 rounded-full transition-all duration-1000" style={{ width: `${progress * 100}%` }} />
        </div>
      )}
    </div>
  );
}

export default function ProjetDemoPage({ params }) {
  const { slug } = use(params);
  const [project, setProject] = useState(null);
  const [tab, setTab] = useState('projet');
  const [state, setState] = useState({
    status: 'idle', sessionId: null, services: [],
    error: null, startedAt: null, extensions: 0,
  });

  // Charge les infos du projet
  useEffect(() => {
    fetch('/api/projects')
      .then((r) => r.json())
      .then((data) => {
        const found = Array.isArray(data) ? data.find((p) => p.id === slug) : null;
        setProject(found || null);
      })
      .catch(() => {});
  }, [slug]);

  // Vérifie si une session tourne déjà
  useEffect(() => {
    fetch(`/api/demo/running/${slug}`)
      .then((r) => r.ok ? r.json() : null)
      .then((data) => {
        if (data && (data.status === 'starting' || data.status === 'ready')) {
          setState({ status: data.status, sessionId: data.sessionId, services: data.services || [], error: null, startedAt: data.startedAt, extensions: data.extensions ?? 0 });
        }
      })
      .catch(() => {});
  }, [slug]);

  const poll = useCallback(async (sessionId) => {
    try {
      const res = await fetch(`/api/demo/status/${sessionId}`);
      if (!res.ok) {
        setState({ status: 'idle', sessionId: null, services: [], error: 'expired', startedAt: null, extensions: 0 });
        return false;
      }
      const data = await res.json();
      setState((s) => ({ ...s, status: data.status, services: data.services || s.services, error: data.error, startedAt: data.startedAt || s.startedAt, extensions: data.extensions ?? s.extensions }));
      return data.status === 'starting';
    } catch { return false; }
  }, []);

  useEffect(() => {
    if (state.status !== 'starting' || !state.sessionId) return;
    let active = true;
    const id = setInterval(async () => {
      if (!active) return;
      const still = await poll(state.sessionId);
      if (!still) clearInterval(id);
    }, POLL_INTERVAL);
    return () => { active = false; clearInterval(id); };
  }, [state.status, state.sessionId, poll]);

  // Démarre le conteneur automatiquement dès que le projet est chargé
  useEffect(() => {
    if (!project || state.status !== 'idle' || state.error === 'expired') return;
    launch();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [project]);

  const launch = async () => {
    setState((s) => ({ ...s, status: 'starting', sessionId: null, services: [], error: null, startedAt: Date.now(), extensions: 0 }));
    try {
      const res = await fetch('/api/demo/launch', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ projectId: slug }),
      });
      const data = await res.json();
      if (!res.ok) { setState((s) => ({ ...s, status: 'error', error: data.error || 'Erreur de démarrage' })); return; }
      setState((s) => ({ ...s, sessionId: data.sessionId, services: data.services || [], startedAt: data.startedAt || s.startedAt }));
    } catch {
      setState((s) => ({ ...s, status: 'error', error: 'Backend indisponible' }));
    }
  };

  const stop = async () => {
    if (state.sessionId) await fetch(`/api/demo/stop/${state.sessionId}`, { method: 'DELETE' });
    setState({ status: 'idle', sessionId: null, services: [], error: null, startedAt: null, extensions: 0 });
  };

  const extend = async () => {
    const res = await fetch(`/api/demo/extend/${state.sessionId}`, { method: 'POST' });
    const data = await res.json();
    if (res.ok) setState((s) => ({ ...s, extensions: data.extensions, startedAt: Date.now() }));
  };

  const { status, services, error, startedAt, extensions } = state;

  if (!project) {
    return (
      <div className="min-h-screen bg-zinc-950 text-zinc-100 flex items-center justify-center">
        <p className="text-zinc-500 text-sm">Chargement…</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans flex flex-col">
      {/* Header */}
      <header className="flex-shrink-0 border-b border-zinc-800 bg-zinc-950/80 backdrop-blur z-10">
        <div className="max-w-screen-xl mx-auto px-6 py-3 flex items-center gap-4">
          <a href="/projets" className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors">
            ← Projets
          </a>
          <span className="text-zinc-700">/</span>
          <div className="flex items-center gap-2">
            <StatusDot status={status} />
            <span className="font-medium text-sm">{project.name}</span>
          </div>
          <div className="flex items-center gap-3 ml-auto">
            {status === 'ready' && startedAt && <CountdownBadge startedAt={startedAt} />}
            {status === 'ready' && (
              <button
                onClick={extend}
                disabled={extensions >= MAX_EXTENSIONS}
                title={extensions >= MAX_EXTENSIONS ? 'Maximum atteint' : `+15 min (${MAX_EXTENSIONS - extensions} restante${MAX_EXTENSIONS - extensions > 1 ? 's' : ''})`}
                className="px-3 py-1.5 border border-zinc-700 rounded-full text-xs transition-colors disabled:opacity-30 disabled:cursor-not-allowed enabled:hover:border-zinc-400"
              >
                +15 min <span className="text-zinc-500">{extensions >= MAX_EXTENSIONS ? '✗' : `${MAX_EXTENSIONS - extensions}/3`}</span>
              </button>
            )}
            {(status === 'starting' || status === 'ready') && (
              <button onClick={stop} className="px-3 py-1.5 border border-zinc-700 rounded-full text-xs hover:border-zinc-500 transition-colors">
                Arrêter
              </button>
            )}
          </div>
        </div>

        {/* Onglets */}
        <div className="max-w-screen-xl mx-auto px-6 flex gap-0 border-t border-zinc-800/50">
          <button
            onClick={() => setTab('projet')}
            className={`px-5 py-2.5 text-sm font-medium border-b-2 transition-colors ${
              tab === 'projet'
                ? 'border-zinc-100 text-zinc-100'
                : 'border-transparent text-zinc-500 hover:text-zinc-300'
            }`}
          >
            Projet
          </button>
          <button
            onClick={() => setTab('application')}
            className={`px-5 py-2.5 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${
              tab === 'application'
                ? 'border-zinc-100 text-zinc-100'
                : 'border-transparent text-zinc-500 hover:text-zinc-300'
            }`}
          >
            Application
            {status === 'starting' && (
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-yellow-500 animate-pulse" />
            )}
            {status === 'ready' && (
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-500" />
            )}
          </button>
        </div>
      </header>

      {/* Contenu */}
      <div className="flex-1 flex flex-col">

        {/* Onglet Projet */}
        {tab === 'projet' && (
          <div className="max-w-3xl mx-auto px-6 py-12 w-full">
            {/* Header */}
            <div className="flex flex-wrap gap-2 mb-4">
              {(project.tags || []).map((t) => (
                <span key={t} className="px-2 py-0.5 bg-zinc-800 text-zinc-400 rounded text-xs">{t}</span>
              ))}
            </div>
            <h1 className="text-3xl font-bold tracking-tight mb-4">{project.name}</h1>
            <p className="text-zinc-400 leading-relaxed mb-8">
              {project.longDescription || project.description}
            </p>

            {/* Images */}
            {project.images && project.images.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
                {project.images.map((img, i) => (
                  <div key={i} className="rounded-xl overflow-hidden border border-zinc-800">
                    <img
                      src={img.src}
                      alt={img.alt || project.name}
                      className="w-full object-cover"
                    />
                    {img.caption && (
                      <p className="px-3 py-2 text-xs text-zinc-500">{img.caption}</p>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Points clés */}
            {project.highlights && project.highlights.length > 0 && (
              <div className="mb-10">
                <h2 className="text-lg font-semibold mb-5">Fonctionnalités</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {project.highlights.map((h, i) => (
                    <div key={i} className="p-4 border border-zinc-800 rounded-xl">
                      <h3 className="text-sm font-medium mb-1">{h.title}</h3>
                      <p className="text-sm text-zinc-500 leading-relaxed">{h.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Accès à l'app */}
            <div className="p-5 border border-zinc-800 rounded-xl">
              <div className="flex items-center gap-2 mb-3">
                <StatusDot status={status} />
                <span className="text-sm font-medium">
                  {status === 'idle' && 'Démarrage…'}
                  {status === 'starting' && 'Démarrage en cours'}
                  {status === 'ready' && 'Application prête'}
                  {status === 'error' && 'Erreur de démarrage'}
                </span>
              </div>

              {status === 'starting' && startedAt && (
                <div className="mb-4">
                  <ElapsedTimer startedAt={startedAt} estimatedSeconds={project.estimatedStartSeconds} />
                </div>
              )}

              {status === 'error' && (
                <div className="mb-4">
                  <p className="text-red-400 text-sm mb-3">{error}</p>
                  <button onClick={launch} className="px-4 py-2 bg-zinc-100 text-zinc-900 rounded-full text-sm font-medium hover:bg-white transition-colors">
                    Réessayer
                  </button>
                </div>
              )}

              {status === 'ready' && (
                <button
                  onClick={() => setTab('application')}
                  className="flex items-center gap-2 px-4 py-2 bg-zinc-100 text-zinc-900 rounded-full text-sm font-medium hover:bg-white transition-colors"
                >
                  Ouvrir l'application
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                  </svg>
                </button>
              )}

              {status === 'idle' && error === 'expired' && (
                <div>
                  <p className="text-xs text-zinc-600 mb-3">Session expirée — relancer la démo ?</p>
                  <button onClick={launch} className="px-4 py-2 bg-zinc-100 text-zinc-900 rounded-full text-sm font-medium hover:bg-white transition-colors">
                    Relancer
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Onglet Application */}
        {tab === 'application' && (
          <div className="flex-1 flex flex-col">
            {status === 'starting' && (
              <div className="flex flex-col items-center justify-center flex-1 gap-6 px-6">
                <div className="flex flex-col items-center gap-4 text-yellow-400">
                  <svg className="animate-spin h-6 w-6" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  <span className="text-sm">Démarrage en cours…</span>
                  {startedAt && <ElapsedTimer startedAt={startedAt} estimatedSeconds={project.estimatedStartSeconds} />}
                </div>
              </div>
            )}

            {status === 'error' && (
              <div className="flex flex-col items-center justify-center flex-1 gap-4 px-6">
                <p className="text-red-400 text-sm bg-red-950/30 border border-red-900 rounded-lg px-4 py-3">{error}</p>
                <button onClick={launch} className="px-5 py-2.5 bg-zinc-100 text-zinc-900 rounded-full text-sm font-medium hover:bg-white transition-colors">
                  Réessayer
                </button>
              </div>
            )}

            {status === 'ready' && services.map((svc) => (
              <div key={svc.name} className="flex-1 flex flex-col min-h-0">
                <div className="flex-shrink-0 flex items-center gap-4 px-4 py-2 bg-zinc-900 border-b border-zinc-800 text-xs font-mono">
                  <span className="text-zinc-500">{svc.name}</span>
                  {svc.credentials && (
                    <>
                      <span className="text-zinc-600">user <span className="text-zinc-300">{svc.credentials.user}</span></span>
                      <span className="text-zinc-600">pass <span className="text-zinc-300">{svc.credentials.password}</span></span>
                    </>
                  )}
                  <a href={svc.url} target="_blank" rel="noopener noreferrer" className="ml-auto text-zinc-500 hover:text-zinc-300 transition-colors">
                    ↗ nouvel onglet
                  </a>
                </div>
                <iframe
                  src={svc.url}
                  title={svc.name}
                  className="flex-1 w-full bg-zinc-950 border-0"
                  style={{ minHeight: '80vh' }}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
