import Link from "next/link";
import Nav from "@/app/components/Nav";
import PageEffects from "@/app/components/PageEffects";
import ProjectsGrid from "@/app/components/ProjectsGrid";
import PastProjects from "@/app/components/PastProjects";
import { getDict, homeHref, infraHref } from "@/lib/i18n";

// Step icons (Heroicons); titles and descriptions come from i18n (projectsPage.steps)
const STEP_ICONS = [
  "M15.042 21.672 13.684 16.6m0 0-2.51 2.225.569-9.47 5.227 7.917-3.286-.672ZM12 2.25V4.5m5.834.166-1.591 1.591M20.25 10.5H18M7.757 14.743l-1.59 1.59M6 10.5H3.75m4.007-4.243-1.59-1.59",
  "m21 7.5-9-5.25L3 7.5m18 0-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9",
  "M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z",
];

export default function ProjectsPage({ lang = "fr" }) {
  const t = getDict(lang).projectsPage;
  const live = getDict(lang).projects.live;
  return (
    <div className="relative min-h-screen bg-zinc-950 text-zinc-100 font-sans overflow-x-clip">
      <PageEffects lang={lang} />
      <div className="bg-grid absolute inset-x-0 top-0 h-[560px] pointer-events-none" aria-hidden="true" />
      <Nav activePage="projets" lang={lang} />

      <main id="main" className="relative max-w-5xl mx-auto px-4 sm:px-6 pt-32 pb-24">

        {/* En-tête */}
        <section data-halo className="relative mb-14">
          <div className="hero-halo absolute -inset-x-40 -inset-y-20 -z-10 pointer-events-none" aria-hidden="true" />
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 mb-4 bg-blue-500/10 border border-blue-500/30 rounded-full text-xs text-blue-400 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
            {live}
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">{t.title}</h1>
          <p className="text-zinc-400 max-w-xl leading-relaxed">{t.intro}</p>
          <ul className="flex flex-wrap gap-2 mt-6" aria-label={t.guaranteesLabel}>
            {t.guarantees.map((g) => (
              <li key={g} className="px-2.5 py-1 rounded-full border border-zinc-800 bg-zinc-900/60 text-xs text-zinc-400">{g}</li>
            ))}
          </ul>
        </section>

        {/* Démos */}
        <section aria-labelledby="demos-title" className="mb-16">
          <h2 id="demos-title" className="sr-only">{t.demosTitle}</h2>
          <ProjectsGrid lang={lang} placeholder emptyMessage={t.empty} />
        </section>

        {/* Comment ça marche */}
        <section aria-labelledby="how-title" className="mb-20">
          <h2 id="how-title" className="text-xl md:text-2xl font-semibold mb-8" data-reveal>{t.howTitle}</h2>
          <ol className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {t.steps.map((step, i) => (
              <li key={step.title} className="glow-card p-6 border border-zinc-800 rounded-xl flex flex-col gap-3" data-reveal style={{ "--d": i }}>
                <div className="flex items-center gap-3">
                  <span className="w-9 h-9 rounded-lg bg-blue-950 flex items-center justify-center text-blue-400">
                    <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d={STEP_ICONS[i]} />
                    </svg>
                  </span>
                  <span className="font-mono text-xs text-zinc-500">0{i + 1}</span>
                </div>
                <h3 className="font-medium">{step.title}</h3>
                <p className="text-sm text-zinc-500 leading-relaxed">{step.description}</p>
              </li>
            ))}
          </ol>
          <p className="text-sm text-zinc-500 mt-6" data-reveal>
            {t.infraTeaser}{" "}
            <Link href={infraHref(lang)} className="text-blue-400 hover:text-blue-300 underline underline-offset-2">{t.infraLink}</Link>
          </p>
        </section>

        {/* Projets passés */}
        <section aria-labelledby="past-title" className="border-t border-zinc-800 pt-16" data-reveal>
          <h2 id="past-title" className="text-xl md:text-2xl font-semibold mb-3">{t.pastTitle}</h2>
          <p className="text-zinc-400 max-w-xl leading-relaxed text-sm mb-8">{t.pastIntro}</p>
          <PastProjects lang={lang} />
        </section>

        {/* Contact */}
        <section className="mt-20 rounded-2xl border border-zinc-800 bg-zinc-900/40 px-6 py-8 md:px-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6" data-reveal>
          <div>
            <h2 className="text-lg font-semibold mb-1">{t.ctaTitle}</h2>
            <p className="text-sm text-zinc-500">{t.ctaText}</p>
          </div>
          <Link
            href={`${homeHref(lang)}#contact`}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-zinc-100 text-zinc-900 rounded-full text-sm font-medium hover:bg-white transition-colors whitespace-nowrap"
          >
            {t.ctaButton}
          </Link>
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
