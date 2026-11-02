"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Nav from "@/app/components/Nav";
import { getDict, homeHref, projectsHref } from "@/lib/i18n";

// One 404 for both languages: English under /en/…
export default function NotFound() {
  const pathname = usePathname() ?? "";
  const lang = /^\/en(\/|$)/.test(pathname) ? "en" : "fr";
  const t = getDict(lang).notFound;
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans">
      <Nav lang={lang} activePage="404" />
      <main id="main" className="max-w-5xl mx-auto px-6 flex flex-col items-center justify-center min-h-[80vh] text-center">
        <p className="text-xs text-blue-400 uppercase tracking-widest mb-4">{t.eyebrow}</p>
        <h1 className="text-5xl font-bold tracking-tight mb-4">{t.title}</h1>
        <p className="text-zinc-500 max-w-sm leading-relaxed mb-10">{t.text}</p>
        <div className="flex gap-3">
          <Link
            href={homeHref(lang)}
            className="px-5 py-2.5 bg-zinc-100 text-zinc-900 rounded-full text-sm font-medium hover:bg-white transition-colors"
          >
            {t.home}
          </Link>
          <Link
            href={projectsHref(lang)}
            className="px-5 py-2.5 border border-zinc-700 rounded-full text-sm font-medium hover:border-zinc-500 transition-colors"
          >
            {t.projects}
          </Link>
        </div>
      </main>
    </div>
  );
}
