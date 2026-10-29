'use client';

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import CommandPalette from "@/app/components/CommandPalette";
import { getDict, homeHref, infraHref, otherLangPath, projectsHref } from "@/lib/i18n";

const CV_URL = "/cv/cv-ivan-mustiere.pdf";
// Homepage sections highlighted in the nav while scrolling (scrollspy); "home" otherwise
const SECTION_IDS = ["contact"];
const STATS_POLL_INTERVAL = 30000;

// Highlights the homepage section crossing the middle of the viewport; off on other pages
function useActiveSection(enabled) {
  const [active, setActive] = useState(null);
  useEffect(() => {
    if (!enabled || !("IntersectionObserver" in window)) return;
    const els = SECTION_IDS.map((id) => document.getElementById(id)).filter(Boolean);
    const visible = new Set();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const e of entries) e.isIntersecting ? visible.add(e.target.id) : visible.delete(e.target.id);
        setActive(SECTION_IDS.find((id) => visible.has(id)) ?? null);
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [enabled]);
  return active;
}

// Number of running demos (null while unknown or when the backend is unreachable)
function useLiveDemoCount() {
  const [count, setCount] = useState(null);
  useEffect(() => {
    let active = true;
    const load = () => {
      if (document.visibilityState !== "visible") return;
      fetch("/api/stats", { cache: "no-store" })
        .then((r) => (r.ok ? r.json() : Promise.reject()))
        .then((data) => { if (active) setCount(data.activeDemos?.length ?? 0); })
        .catch(() => { if (active) setCount(null); });
    };
    load();
    const id = setInterval(load, STATS_POLL_INTERVAL);
    return () => { active = false; clearInterval(id); };
  }, []);
  return count;
}

export default function Nav({ activePage, lang = "fr" }) {
  const [open, setOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const t = getDict(lang);
  const home = homeHref(lang);
  // Same page in the other language (falls back to its home page outside the app router, e.g. 404)
  const pathname = usePathname();
  const otherLangHref = pathname ? otherLangPath(pathname, lang) : homeHref(lang === "en" ? "fr" : "en");
  const activeSection = useActiveSection(!activePage);
  const current = activePage ?? activeSection ?? "home";
  const liveDemos = useLiveDemoCount();

  const links = [
    { id: "home", label: t.nav.home, href: home },
    { id: "projets", label: t.nav.projects, href: projectsHref(lang), live: true },
    { id: "infra", label: t.nav.infra, href: infraHref(lang) },
  ];
  const contactHref = `${home}#contact`;

  const liveBadge = liveDemos > 0 && (
    <span className="inline-flex items-center gap-1 ml-1.5 text-[11px] text-emerald-400 tabular-nums" title={t.nav.liveDemos(liveDemos)}>
      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" aria-hidden="true" />
      {liveDemos}
      <span className="sr-only">{t.nav.liveDemos(liveDemos)}</span>
    </span>
  );

  const cvIcon = (
    <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
    </svg>
  );

  const paletteButton = (
    <button
      type="button"
      onClick={() => setPaletteOpen(true)}
      aria-label={t.palette.open}
      aria-haspopup="dialog"
      className="inline-flex items-center gap-2 text-zinc-400 hover:text-zinc-100 transition-colors md:px-2.5 md:py-1 md:border md:border-zinc-800 md:hover:border-zinc-600 md:rounded-lg p-1"
    >
      <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
      </svg>
      <kbd className="hidden md:inline font-mono text-[11px]">Ctrl K</kbd>
    </button>
  );

  return (
    <>
    <header className="fixed top-0 w-full border-b border-zinc-800 bg-zinc-950/90 backdrop-blur z-50">
      <a href="#main" className="skip-link">{t.skip}</a>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex justify-between items-center">
        <Link href={home} className="font-semibold tracking-tight hover:text-zinc-300 transition-colors">
          Ivan Mustière
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex gap-6 text-sm text-zinc-400 items-center">
          {links.map(({ id, label, href, live }) => (
            <Link
              key={id}
              href={href}
              aria-current={current === id ? (activePage || id === "home" ? "page" : "location") : undefined}
              className={`inline-flex items-center transition-colors ${current === id ? 'text-zinc-100' : 'hover:text-zinc-100'}`}
            >
              {label}
              {live && liveBadge}
            </Link>
          ))}
          <span className="w-px h-4 bg-zinc-800" aria-hidden="true" />
          <a href={CV_URL} download="CV_Ivan_Mustiere.pdf" className="inline-flex items-center gap-1.5 hover:text-zinc-100 transition-colors">
            {cvIcon}
            {t.nav.cv}
          </a>
          <Link
            href={contactHref}
            aria-current={current === "contact" ? "location" : undefined}
            className="px-3.5 py-1.5 bg-zinc-100 text-zinc-900 rounded-full font-medium hover:bg-white transition-colors"
          >
            {t.nav.contact}
          </Link>
          <a href="https://github.com/Ivan-Mustiere" target="_blank" rel="noopener noreferrer" className="hidden lg:block hover:text-zinc-100 transition-colors" aria-label="GitHub">
            <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
            </svg>
          </a>
          <a href="https://www.linkedin.com/in/ivan-mustiere/" target="_blank" rel="noopener noreferrer" className="hidden lg:block hover:text-zinc-100 transition-colors" aria-label="LinkedIn">
            <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
            </svg>
          </a>
          <Link href={otherLangHref} hrefLang={lang === "en" ? "fr" : "en"} className="font-mono text-xs hover:text-zinc-100 transition-colors" aria-label={t.nav.switchLang} title={t.nav.switchLang}>
            {t.nav.langShort}
          </Link>
          {paletteButton}
        </nav>

        {/* Mobile : icônes sociales + hamburger */}
        <div className="flex md:hidden items-center gap-4">
          <a href="https://github.com/Ivan-Mustiere" target="_blank" rel="noopener noreferrer" className="text-zinc-400 hover:text-zinc-100 transition-colors" aria-label="GitHub">
            <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
            </svg>
          </a>
          <a href="https://www.linkedin.com/in/ivan-mustiere/" target="_blank" rel="noopener noreferrer" className="text-zinc-400 hover:text-zinc-100 transition-colors" aria-label="LinkedIn">
            <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
            </svg>
          </a>
          {paletteButton}
          <button
            type="button"
            onClick={() => setOpen(!open)}
            className="text-zinc-400 hover:text-zinc-100 transition-colors p-1"
            aria-label={t.nav.menu}
            aria-expanded={open}
            aria-controls="mobile-menu"
          >
            {open ? (
              <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Menu mobile déroulant */}
      {open && (
        <nav id="mobile-menu" className="md:hidden border-t border-zinc-800 bg-zinc-950 px-4 py-4 flex flex-col gap-1">
          {links.map(({ id, label, href, live }) => (
            <Link
              key={id}
              href={href}
              onClick={() => setOpen(false)}
              aria-current={current === id ? (activePage || id === "home" ? "page" : "location") : undefined}
              className={`inline-flex items-center px-3 py-2.5 text-sm hover:text-zinc-100 hover:bg-zinc-900 rounded-lg transition-colors ${current === id ? "text-zinc-100" : "text-zinc-400"}`}
            >
              {label}
              {live && liveBadge}
            </Link>
          ))}
          <a
            href={CV_URL}
            download="CV_Ivan_Mustiere.pdf"
            onClick={() => setOpen(false)}
            className="inline-flex items-center gap-2 px-3 py-2.5 text-sm text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900 rounded-lg transition-colors"
          >
            {cvIcon}
            {t.nav.cv}
          </a>
          <Link
            href={contactHref}
            onClick={() => setOpen(false)}
            className="mt-2 px-3 py-2.5 text-center text-sm font-medium bg-zinc-100 text-zinc-900 rounded-full hover:bg-white transition-colors"
          >
            {t.nav.contact}
          </Link>
          <Link
            href={otherLangHref}
            hrefLang={lang === "en" ? "fr" : "en"}
            onClick={() => setOpen(false)}
            className="px-3 py-2.5 text-sm text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900 rounded-lg transition-colors"
          >
            {t.nav.switchLang}
          </Link>
        </nav>
      )}
    </header>
    {/* Outside <header>: its backdrop-filter would trap the fixed overlay inside the bar */}
    <CommandPalette lang={lang} open={paletteOpen} onOpenChange={setPaletteOpen} />
    </>
  );
}
