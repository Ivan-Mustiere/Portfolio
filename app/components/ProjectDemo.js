'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import LiveLogs from '@/app/components/LiveLogs';
import { getDict, localizeProject, otherLangPath, projectsHref } from '@/lib/i18n';

const POLL_INTERVAL = 3000;
const TTL_MINUTES = 15;
const MAX_EXTENSIONS = 3;

function StatusDot({ status }) {
  const colors = {
    idle: 'bg-zinc-600',
    stopping: 'bg-zinc-500 animate-pulse',
    stopped: 'bg-zinc-600',
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
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const elapsed = Math.max(0, Math.floor((now - startedAt) / 1000));

  const m = Math.floor(elapsed / 60);
  const s = elapsed % 60;
  const progress = estimatedSeconds ? Math.min(elapsed / estimatedSeconds, 1) : null;

  return (
    <div className="flex flex-col gap-1.5 w-full max-w-xs">
      <div className="flex items-center justify-between text-xs">
        <span className="font-mono text-yellow-500/70">{m > 0 ? `${m}m ` : ''}{s.toString().padStart(2, '0')}s</span>
        {estimatedSeconds && (
          <span className="text-zinc-500">
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

// Demo page for one project (/projets/<id> and /en/projets/<id>): presentation + live container
export default function ProjectDemo({ slug, lang = 'fr' }) {
  const t = getDict(lang).demo;
  const [project, setProject] = useState(null);
  const [tab, setTab] = useState('projet');
  const [state, setState] = useState({
    status: 'idle', sessionId: null, services: [],
    error: null, startedAt: null, extensions: 0,
  });

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

  const launch = async () => {
    setState((s) => ({ ...s, status: 'starting', sessionId: null, services: [], error: null, startedAt: Date.now(), extensions: 0 }));
    try {
      const res = await fetch('/api/demo/launch', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ projectId: slug }),
      });
      const data = await res.json();
      if (!res.ok) { setState((s) => ({ ...s, status: 'error', error: data.error || t.startError })); return; }
      setState((s) => ({ ...s, status: data.status || s.status, sessionId: data.sessionId, services: data.services || [], startedAt: data.startedAt || s.startedAt, extensions: data.extensions ?? 0 }));
    } catch {
      setState((s) => ({ ...s, status: 'error', error: t.backendDown }));
    }
  };

  // 'stopping' while docker compose down runs, then 'stopped' so the visitor can relaunch
  const stop = async () => {
    const { sessionId } = state;
    setState((s) => ({ ...s, status: 'stopping' }));
    if (sessionId) await fetch(`/api/demo/stop/${sessionId}`, { method: 'DELETE' }).catch(() => {});
    setState({ status: 'stopped', sessionId: null, services: [], error: null, startedAt: null, extensions: 0 });
  };

  const extend = async () => {
    const res = await fetch(`/api/demo/extend/${state.sessionId}`, { method: 'POST' });
    const data = await res.json();
    if (res.ok) setState((s) => ({ ...s, extensions: data.extensions, startedAt: Date.now() }));
  };

  // Charge les infos du projet puis démarre le conteneur automatiquement
  // (si une démo tourne déjà pour ce projet, le backend renvoie la session existante)
  useEffect(() => {
    fetch('/api/projects')
      .then((r) => r.json())
      .then((data) => {
        const found = Array.isArray(data) ? data.find((p) => p.id === slug) : null;
        setProject(found ? localizeProject(found, lang) : null);
        if (found) launch();
      })
      .catch(() => {});
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  const { status, services, error, startedAt, extensions } = state;

  if (!project) {
    return (
      <div className="min-h-screen bg-zinc-950 text-zinc-100 flex items-center justify-center">
        <p className="text-zinc-500 text-sm">{t.loading}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans flex flex-col">
      {/* Header */}
      <header className="flex-shrink-0 border-b border-zinc-800 bg-zinc-950/80 backdrop-blur z-10">
        <div className="max-w-screen-xl mx-auto px-6 py-3 flex items-center gap-4">
          <Link href={projectsHref(lang)} className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors">
            {t.back}
          </Link>
          <span className="text-zinc-700" aria-hidden="true">/</span>
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
                title={extensions >= MAX_EXTENSIONS ? t.maxReached : t.extendLeft(MAX_EXTENSIONS - extensions)}
                className="px-3 py-1.5 border border-zinc-700 rounded-full text-xs transition-colors disabled:opacity-30 disabled:cursor-not-allowed enabled:hover:border-zinc-400"
              >
                +15 min <span className="text-zinc-500">{extensions >= MAX_EXTENSIONS ? '✗' : `${MAX_EXTENSIONS - extensions}/3`}</span>
              </button>
            )}
            {(status === 'starting' || status === 'ready') && (
              <button onClick={stop} className="px-3 py-1.5 border border-zinc-700 rounded-full text-xs hover:border-zinc-500 transition-colors">
                {t.stop}
              </button>
            )}
            <Link
              href={otherLangPath(projectsHref(lang, slug), lang)}
              hrefLang={lang === 'en' ? 'fr' : 'en'}
              className="font-mono text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
              title={getDict(lang).nav.switchLang}
            >
              {getDict(lang).nav.langShort}
            </Link>
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
            {t.tabProject}
          </button>
          <button
            onClick={() => setTab('application')}
            className={`px-5 py-2.5 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${
              tab === 'application'
                ? 'border-zinc-100 text-zinc-100'
                : 'border-transparent text-zinc-500 hover:text-zinc-300'
            }`}
          >
            {t.tabApp}
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

        {/* Onglet Projet : contenu à gauche, carte de lancement collante à droite (lg) */}
        {tab === 'projet' && (
          <div className="max-w-5xl mx-auto px-6 py-12 w-full grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_18rem] gap-10 lg:gap-12 items-start">
            <div className="min-w-0">
              <div className="flex flex-wrap gap-2 mb-4">
                {(project.tags || []).map((tag) => (
                  <span key={tag} className="px-2 py-0.5 bg-zinc-800 text-zinc-400 rounded text-xs">{tag}</span>
                ))}
              </div>
              <h1 className="text-3xl font-bold tracking-tight mb-4">{project.name}</h1>
              <p className="text-zinc-400 leading-relaxed mb-10">
                {project.longDescription || project.description}
              </p>

              {/* Images */}
              {project.images && project.images.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12">
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

              {/* Ce que contient la démo (ex. panels du dashboard) */}
              {project.contents?.items?.length > 0 && (
                <section className="mb-12">
                  <h2 className="text-lg font-semibold mb-5">{project.contents.title}</h2>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {project.contents.items.map((item) => (
                      <li key={item.label} className="flex items-center justify-between gap-3 px-4 py-3 border border-zinc-800 rounded-lg bg-zinc-900/40">
                        <span className="text-sm text-zinc-300">{item.label}</span>
                        {item.tag && <span className="text-[11px] font-mono text-blue-400 whitespace-nowrap">{item.tag}</span>}
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              {/* Parcours guidé */}
              {project.tryIt?.length > 0 && (
                <section className="mb-12">
                  <h2 className="text-lg font-semibold mb-5">{t.tryIt}</h2>
                  <ol className="flex flex-col gap-4">
                    {project.tryIt.map((step, i) => (
                      <li key={step.title} className="flex gap-4">
                        <span className="flex-shrink-0 w-7 h-7 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-mono flex items-center justify-center">{i + 1}</span>
                        <div>
                          <h3 className="text-sm font-medium mb-0.5">{step.title}</h3>
                          <p className="text-sm text-zinc-500 leading-relaxed">{step.description}</p>
                        </div>
                      </li>
                    ))}
                  </ol>
                </section>
              )}

              {/* Points clés */}
              {project.highlights && project.highlights.length > 0 && (
                <section className="mb-12">
                  <h2 className="text-lg font-semibold mb-5">{t.features}</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {project.highlights.map((h, i) => (
                      <div key={i} className="p-4 border border-zinc-800 rounded-xl">
                        <h3 className="text-sm font-medium mb-1">{h.title}</h3>
                        <p className="text-sm text-zinc-500 leading-relaxed">{h.description}</p>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Comment la démo est construite */}
              {project.build?.length > 0 && (
                <section>
                  <h2 className="text-lg font-semibold mb-5">{t.build}</h2>
                  <dl className="flex flex-col divide-y divide-zinc-800 border-y border-zinc-800">
                    {project.build.map((row) => (
                      <div key={row.label} className="grid grid-cols-1 sm:grid-cols-[8rem_1fr] gap-1 sm:gap-4 py-3">
                        <dt className="text-xs font-mono text-zinc-500 sm:pt-0.5">{row.label}</dt>
                        <dd className="text-sm text-zinc-400 leading-relaxed">{row.value}</dd>
                      </div>
                    ))}
                  </dl>
                </section>
              )}
            </div>

            {/* Accès à l'app */}
            <aside className="lg:sticky lg:top-6 p-5 border border-zinc-800 rounded-xl bg-zinc-900/40">
              <div className="flex items-center gap-2 mb-3">
                <StatusDot status={status} />
                <span className="text-sm font-medium">
                  {status === 'idle' && error === 'expired' ? t.status.expired : t.status[status]}
                </span>
              </div>

              {status === 'starting' && startedAt && (
                <div className="mb-4">
                  <ElapsedTimer startedAt={startedAt} estimatedSeconds={project.estimatedStartSeconds} />
                </div>
              )}

              {status === 'starting' && state.sessionId && (
                <LiveLogs sessionId={state.sessionId} className="mb-4" collapsible lang={lang} />
              )}

              {status === 'error' && (
                <div className="mb-4">
                  <p className="text-red-400 text-sm mb-3">{error}</p>
                  <button onClick={launch} className="px-4 py-2 bg-zinc-100 text-zinc-900 rounded-full text-sm font-medium hover:bg-white transition-colors">
                    {t.retry}
                  </button>
                </div>
              )}

              {status === 'ready' && (
                <button
                  onClick={() => setTab('application')}
                  className="flex items-center gap-2 px-4 py-2 bg-zinc-100 text-zinc-900 rounded-full text-sm font-medium hover:bg-white transition-colors"
                >
                  {t.open}
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                  </svg>
                </button>
              )}

              {(status === 'stopped' || (status === 'idle' && error === 'expired')) && (
                <div>
                  <p className="text-xs text-zinc-500 mb-3">
                    {status === 'stopped' ? t.stoppedNote : t.expiredNote} {t.relaunchNote}
                  </p>
                  <button onClick={launch} className="px-4 py-2 bg-zinc-100 text-zinc-900 rounded-full text-sm font-medium hover:bg-white transition-colors">
                    {t.relaunch}
                  </button>
                </div>
              )}

              {project.services?.some((svc) => svc.credentials) && (
                <dl className="mt-5 pt-4 border-t border-zinc-800 flex flex-col gap-1.5 text-xs">
                  {project.services.filter((svc) => svc.credentials).map((svc) => (
                    <div key={svc.name} className="flex items-center justify-between gap-3">
                      <dt className="text-zinc-500">{t.credentials(svc.name)}</dt>
                      <dd className="font-mono text-zinc-300">{svc.credentials.user} / {svc.credentials.password}</dd>
                    </div>
                  ))}
                </dl>
              )}
            </aside>
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
                  <span className="text-sm">{t.startingFull}</span>
                  {startedAt && <ElapsedTimer startedAt={startedAt} estimatedSeconds={project.estimatedStartSeconds} />}
                </div>
                {state.sessionId && <LiveLogs sessionId={state.sessionId} className="w-full max-w-3xl" lang={lang} />}
              </div>
            )}

            {(status === 'stopping' || status === 'stopped' || (status === 'idle' && error === 'expired')) && (
              <div className="flex flex-col items-center justify-center flex-1 gap-4 px-6 text-center">
                <p className="text-sm text-zinc-400">
                  {status === 'stopping' ? t.status.stopping : status === 'stopped' ? t.stoppedFull : t.expiredFull}
                </p>
                {status !== 'stopping' && (
                  <button onClick={launch} className="px-5 py-2.5 bg-zinc-100 text-zinc-900 rounded-full text-sm font-medium hover:bg-white transition-colors">
                    {t.relaunch}
                  </button>
                )}
              </div>
            )}

            {status === 'error' && (
              <div className="flex flex-col items-center justify-center flex-1 gap-4 px-6">
                <p className="text-red-400 text-sm bg-red-950/30 border border-red-900 rounded-lg px-4 py-3">{error}</p>
                <button onClick={launch} className="px-5 py-2.5 bg-zinc-100 text-zinc-900 rounded-full text-sm font-medium hover:bg-white transition-colors">
                  {t.retry}
                </button>
              </div>
            )}

            {status === 'ready' && services.map((svc) => (
              <div key={svc.name} className="flex-1 flex flex-col min-h-0">
                <div className="flex-shrink-0 flex items-center gap-4 px-4 py-2 bg-zinc-900 border-b border-zinc-800 text-xs font-mono">
                  <span className="text-zinc-500">{svc.name}</span>
                  {svc.credentials && (
                    <>
                      <span className="text-zinc-500">{t.user} <span className="text-zinc-300">{svc.credentials.user}</span></span>
                      <span className="text-zinc-500">{t.pass} <span className="text-zinc-300">{svc.credentials.password}</span></span>
                    </>
                  )}
                  <a href={svc.url} target="_blank" rel="noopener noreferrer" className="ml-auto text-zinc-500 hover:text-zinc-300 transition-colors">
                    {t.newTab}
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
