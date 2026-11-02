import Link from "next/link";
import Nav from "@/app/components/Nav";
import PageEffects from "@/app/components/PageEffects";
import Architecture from "@/app/components/Architecture";
import InfraStatus from "@/app/components/InfraStatus";
import { getDict, homeHref, projectsHref } from "@/lib/i18n";

// "Under the hood" page: live server status, request path, demo isolation and the site's stack
export default function InfraPage({ lang = "fr" }) {
  const t = getDict(lang).infra;
  const home = homeHref(lang);

  return (
    <div className="relative min-h-screen bg-zinc-950 text-zinc-100 font-sans overflow-x-clip">
      <PageEffects lang={lang} />
      <div className="bg-grid absolute inset-x-0 top-0 h-[560px] pointer-events-none" aria-hidden="true" />
      <Nav activePage="infra" lang={lang} />

      <main id="main" className="relative max-w-5xl mx-auto px-4 sm:px-6 pt-32 pb-24">

        {/* En-tête + état du serveur */}
        <section data-halo className="relative mb-20">
          <div className="hero-halo absolute -inset-x-40 -inset-y-20 -z-10 pointer-events-none" aria-hidden="true" />
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">{t.title}</h1>
          <p className="text-zinc-400 max-w-xl leading-relaxed mb-10">{t.intro}</p>
          <h2 className="text-xl md:text-2xl font-semibold mb-6">{t.statusTitle}</h2>
          <InfraStatus lang={lang} />
        </section>

        {/* Chemin d'une requête */}
        <section aria-labelledby="arch-title" className="mb-20">
          <h2 id="arch-title" className="text-xl md:text-2xl font-semibold mb-8" data-reveal>{t.archTitle}</h2>
          <div data-reveal>
            <Architecture lang={lang} />
          </div>
        </section>

        {/* Isolation des démos */}
        <section aria-labelledby="security-title" className="mb-20">
          <h2 id="security-title" className="text-xl md:text-2xl font-semibold mb-2" data-reveal>{t.security.title}</h2>
          <p className="text-sm text-zinc-400 max-w-xl leading-relaxed mb-8" data-reveal>{t.security.intro}</p>
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {t.security.items.map((item, i) => (
              <li key={item.title} className="glow-card p-5 rounded-xl border border-zinc-800 bg-zinc-900/40 flex flex-col gap-2" data-reveal style={{ "--d": i }}>
                <div className="flex items-center gap-2.5">
                  <span className="font-mono text-xs text-blue-400">0{i + 1}</span>
                  <h3 className="font-medium">{item.title}</h3>
                </div>
                <p className="text-sm text-zinc-500 leading-relaxed">{item.text}</p>
              </li>
            ))}
          </ul>
        </section>

        {/* Stack */}
        <section aria-labelledby="stack-title" className="mb-20">
          <h2 id="stack-title" className="text-xl md:text-2xl font-semibold mb-8" data-reveal>{t.stack.title}</h2>
          <dl className="flex flex-col divide-y divide-zinc-800 border-y border-zinc-800" data-reveal>
            {t.stack.rows.map((row) => (
              <div key={row.label} className="grid grid-cols-1 sm:grid-cols-[10rem_1fr] gap-2 sm:gap-6 py-4">
                <dt className="text-sm text-zinc-500">{row.label}</dt>
                <dd className="flex flex-wrap gap-2">
                  {row.items.map((item) => (
                    <span key={item} className="px-2.5 py-1 rounded-full border border-zinc-800 bg-zinc-900/60 text-xs text-zinc-300">{item}</span>
                  ))}
                </dd>
              </div>
            ))}
          </dl>
        </section>

        {/* CTA */}
        <section className="rounded-2xl border border-zinc-800 bg-zinc-900/40 px-6 py-8 md:px-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6" data-reveal>
          <div>
            <h2 className="text-lg font-semibold mb-1">{t.cta.title}</h2>
            <p className="text-sm text-zinc-500">{t.cta.text}</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href={projectsHref(lang)}
              className="inline-flex items-center justify-center px-5 py-2.5 bg-zinc-100 text-zinc-900 rounded-full text-sm font-medium hover:bg-white transition-colors whitespace-nowrap"
            >
              {t.cta.launch}
            </Link>
            <Link
              href={`${home}#contact`}
              className="inline-flex items-center justify-center px-5 py-2.5 border border-zinc-700 rounded-full text-sm font-medium hover:border-zinc-500 hover:text-zinc-100 transition-colors whitespace-nowrap"
            >
              {t.cta.contact}
            </Link>
          </div>
        </section>
      </main>

      <footer className="border-t border-zinc-800">
        <div className="max-w-5xl mx-auto px-6 py-8 text-sm text-zinc-500 text-center">
          © {new Date().getFullYear()} Ivan Mustière
        </div>
      </footer>
    </div>
  );
}
