import Image from "next/image";
import Link from "next/link";
import Nav from "@/app/components/Nav";
import ProjectsGrid from "@/app/components/ProjectsGrid";
import HeroTerminal from "@/app/components/HeroTerminal";
import Architecture from "@/app/components/Architecture";
import PageEffects from "@/app/components/PageEffects";
import TechMarquee from "@/app/components/TechMarquee";
import TechLogo, { techTitle } from "@/app/components/TechLogo";
import PipelineDag from "@/app/components/PipelineDag";
import JourneyMap from "@/app/components/JourneyMap";
import Timeline from "@/app/components/Timeline";
import Tabs from "@/app/components/Tabs";
import SkillCards from "@/app/components/SkillCards";
import KeyFigures from "@/app/components/KeyFigures";
import GitHubActivity from "@/app/components/GitHubActivity";
import { monthsBetween } from "@/lib/dates";
import * as dataFr from "@/lib/data";
import * as dataEn from "@/lib/data.en";
import { getDict, infraHref, projectsHref } from "@/lib/i18n";

export default function HomePage({ lang = "fr" }) {
  const t = getDict(lang);
  const { experiences, formations, skills } = lang === "en" ? dataEn : dataFr;

  const firstStart = experiences.map((e) => e.start).sort()[0];
  const figures = [
    { value: Math.floor(monthsBetween(firstStart, null) / 12), suffix: "+", label: t.figures.years },
    { value: dataFr.pastProjects.length, label: t.figures.projects },
    { value: skills.flatMap((g) => g.logos || []).length, label: t.figures.techs },
  ];

  return (
    <div className="relative min-h-screen bg-zinc-950 text-zinc-100 font-sans overflow-x-clip">
      <PageEffects lang={lang} />
      <div className="bg-grid absolute inset-x-0 top-0 h-[720px] pointer-events-none" aria-hidden="true" />
      <Nav lang={lang} />

      <main id="main" className="relative max-w-5xl mx-auto px-4 sm:px-6">

        {/* Hero */}
        <section data-halo className="relative pt-32 md:pt-40 pb-16 md:pb-24">
          <div className="hero-halo absolute -inset-x-40 inset-y-0 -z-10 pointer-events-none" aria-hidden="true" />
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8 md:gap-12">
            <div className="flex md:hidden justify-center">
              <div className="w-28 h-28 rounded-full overflow-hidden border-2 border-zinc-700">
                <Image src="/images/photo.webp" alt="Ivan Mustière" width={112} height={112} className="object-cover w-full h-full" priority />
              </div>
            </div>
            <div className="flex-1">
              <p className="text-xs sm:text-sm text-blue-400 uppercase tracking-widest mb-3">{t.hero.eyebrow}</p>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-5">Ivan Mustière</h1>
              <p className="text-base md:text-lg text-zinc-400 max-w-lg leading-relaxed mb-8">
                {t.hero.bio}
              </p>
              <div className="flex flex-wrap gap-3">
                <a href="#experience" className="px-5 py-2.5 bg-zinc-100 text-zinc-900 rounded-full text-sm font-medium hover:bg-white transition-colors">
                  {t.hero.journey}
                </a>
                <a
                  href="/cv/cv-ivan-mustiere.pdf"
                  download="CV_Ivan_Mustiere.pdf"
                  className="inline-flex items-center gap-2 px-5 py-2.5 border border-zinc-700 rounded-full text-sm font-medium hover:border-zinc-500 hover:text-zinc-100 transition-colors"
                >
                  <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
                  </svg>
                  {t.hero.cv}
                </a>
                <a href="#contact" className="px-5 py-2.5 border border-zinc-700 rounded-full text-sm font-medium hover:border-zinc-500 hover:text-zinc-100 transition-colors">
                  {t.hero.contact}
                </a>
              </div>
            </div>
            <div className="hidden md:flex flex-shrink-0">
              <div className="w-40 h-40 rounded-full overflow-hidden border-2 border-zinc-700">
                <Image src="/images/photo.webp" alt="Ivan Mustière" width={160} height={160} className="object-cover w-full h-full" priority />
              </div>
            </div>
          </div>
          <div className="mt-12 md:mt-16">
            <HeroTerminal lang={lang} />
          </div>
        </section>

        <TechMarquee logos={skills.flatMap((g) => g.logos || [])} />

        {/* Ce que je fais */}
        <section className="py-14 md:py-20 border-t border-zinc-800">
          <h2 className="text-xl md:text-2xl font-semibold mb-8" data-reveal>{t.whatIDo.title}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              {
                icon: (
                  <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125" />
                  </svg>
                ),
                ...t.whatIDo.cards[0],
              },
              {
                icon: (
                  <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z" />
                  </svg>
                ),
                ...t.whatIDo.cards[1],
              },
              {
                icon: (
                  <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 14.25h13.5m-13.5 0a3 3 0 0 1-3-3m3 3a3 3 0 1 0 0 6h13.5a3 3 0 1 0 0-6m-16.5-3a3 3 0 0 1 3-3h13.5a3 3 0 0 1 3 3m-19.5 0a4.5 4.5 0 0 1 .9-2.7L5.737 5.1a3.375 3.375 0 0 1 2.7-1.35h7.126c1.062 0 2.062.5 2.7 1.35l2.587 3.45a4.5 4.5 0 0 1 .9 2.7m0 0a3 3 0 0 1-3 3m0 3h.008v.008h-.008v-.008Zm0-6h.008v.008h-.008v-.008Zm-3 6h.008v.008h-.008v-.008Zm0-6h.008v.008h-.008v-.008Z" />
                  </svg>
                ),
                ...t.whatIDo.cards[2],
              },
            ].map((card, i) => (
              <div key={card.title} className="glow-card p-6 border border-zinc-800 rounded-xl flex flex-col gap-3" data-reveal style={{ "--d": i }}>
                <div className="w-9 h-9 rounded-lg bg-blue-950 flex items-center justify-center text-blue-400">
                  {card.icon}
                </div>
                <div>
                  <h3 className="font-medium mb-1.5">{card.title}</h3>
                  <p className="text-sm text-zinc-500 leading-relaxed">{card.description}</p>
                </div>
              </div>
            ))}
          </div>
          <p className="text-sm text-zinc-400 mt-10 mb-4" data-reveal>{t.dag.intro}</p>
          <div data-reveal>
            <PipelineDag lang={lang} />
          </div>
        </section>

        {/* Chiffres clés */}
        <section className="pb-14 md:pb-20" aria-label={t.figures.years} data-reveal>
          <KeyFigures figures={figures} liveLabel={t.figures.demos} />
        </section>

        {/* Parcours : expérience + formation */}
        <section id="experience" className="py-14 md:py-20 border-t border-zinc-800">
          <h2 className="text-xl md:text-2xl font-semibold mb-10" data-reveal>{t.sections.journey}</h2>
          <JourneyMap lang={lang} experiences={experiences} formations={formations} />
          <Timeline lang={lang} experiences={experiences} formations={formations} />
        </section>

        {/* Compétences */}
        <section id="skills" className="py-14 md:py-20 border-t border-zinc-800">
          <h2 className="text-xl md:text-2xl font-semibold mb-8" data-reveal>{t.sections.skills}</h2>
          <div data-reveal>
            <Tabs
              label={t.sections.skills}
              tabs={skills.map((group) => ({
                key: group.category,
                label: group.category,
                panel: group.cards ? <SkillCards cards={group.cards} /> : (
                  <div className={group.logos ? "grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6 lg:gap-10" : ""}>
                    {group.logos && (
                      <ul className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-7 gap-2.5">
                        {group.logos.map((name) => (
                          <li
                            key={name}
                            className="group glow-card flex flex-col items-center gap-2 px-1 py-4 rounded-xl border border-zinc-800 bg-zinc-900/40 text-zinc-400 hover:border-zinc-600 transition-colors"
                          >
                            <TechLogo name={name} className="w-8 h-8" />
                            <span className="text-[11px] text-zinc-500 group-hover:text-zinc-300 text-center leading-tight transition-colors">{techTitle(name).replace(/^Apache /, "")}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                    <ul className={group.logos ? "flex flex-col gap-2.5" : "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3"}>
                      {group.items.map((item) => (
                        <li
                          key={item}
                          className={group.logos
                            ? "flex items-center gap-2.5 text-sm text-zinc-400"
                            : "glow-card flex items-center gap-2.5 text-sm text-zinc-300 p-4 rounded-xl border border-zinc-800 bg-zinc-900/40"}
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-500/70 flex-shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                ),
              }))}
            />
          </div>
        </section>

        {/* Projets interactifs */}
        <section className="py-14 md:py-20 border-t border-zinc-800">
          <div className="rounded-2xl border border-blue-900/50 bg-blue-950/10 px-6 py-8 md:px-10 md:py-10" data-reveal>
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6 mb-8">
              <div>
                <div className="flex items-center gap-2.5 mb-3">
                  <span className="flex items-center gap-1.5 px-2.5 py-1 bg-blue-500/10 border border-blue-500/30 rounded-full text-xs text-blue-400 font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
                    {t.projects.live}
                  </span>
                </div>
                <h2 className="text-xl md:text-2xl font-semibold mb-2">{t.projects.title}</h2>
                <p className="text-sm text-zinc-400 max-w-md leading-relaxed">
                  {t.projects.intro}
                </p>
              </div>
              <Link
                href={projectsHref(lang)}
                className="inline-flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300 transition-colors whitespace-nowrap flex-shrink-0"
              >
                {t.projects.all}
                <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                </svg>
              </Link>
            </div>

            <ProjectsGrid lang={lang} />
          </div>
        </section>

        {/* Activité GitHub */}
        <section className="py-14 md:py-20 border-t border-zinc-800">
          <h2 className="text-xl md:text-2xl font-semibold mb-2" data-reveal>{t.github.title}</h2>
          <div data-reveal>
            <GitHubActivity lang={lang} />
          </div>
        </section>

        {/* Sous le capot */}
        <section id="infra" className="py-14 md:py-20 border-t border-zinc-800">
          <h2 className="text-xl md:text-2xl font-semibold mb-2" data-reveal>{t.infra.title}</h2>
          <p className="text-sm text-zinc-400 max-w-xl leading-relaxed mb-8" data-reveal>
            {t.infra.teaser}
          </p>
          <div data-reveal>
            <Architecture lang={lang} />
          </div>
          <Link href={infraHref(lang)} className="inline-block mt-8 text-sm text-blue-400 hover:text-blue-300 underline underline-offset-2" data-reveal>
            {t.infra.more}
          </Link>
        </section>

        {/* Contact */}
        <section id="contact" className="py-14 md:py-20 border-t border-zinc-800">
          <h2 className="text-xl md:text-2xl font-semibold mb-3" data-reveal>{t.contactSection.title}</h2>
          <p className="text-zinc-500 mb-8 max-w-md text-sm" data-reveal>
            {t.contactSection.intro}
          </p>

          <div className="flex flex-wrap gap-3" data-reveal>
            <a
              href="mailto:ivanmustiere.pro@gmail.com"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-zinc-100 text-zinc-900 rounded-full text-sm font-medium hover:bg-white transition-colors"
            >
              <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
              </svg>
              ivanmustiere.pro@gmail.com
            </a>
            <a
              href="https://www.linkedin.com/in/ivan-mustiere/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 border border-zinc-700 rounded-full text-sm font-medium hover:border-zinc-500 hover:text-zinc-100 transition-colors"
            >
              <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
              LinkedIn
            </a>
            <a
              href="https://github.com/Ivan-Mustiere"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 border border-zinc-700 rounded-full text-sm font-medium hover:border-zinc-500 hover:text-zinc-100 transition-colors"
            >
              <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
              </svg>
              GitHub
            </a>
            <a
              href="/cv/cv-ivan-mustiere.pdf"
              download="CV_Ivan_Mustiere.pdf"
              className="inline-flex items-center gap-2 px-5 py-2.5 border border-zinc-700 rounded-full text-sm font-medium hover:border-zinc-500 hover:text-zinc-100 transition-colors"
            >
              <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
              </svg>
              {t.hero.cv}
            </a>
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
