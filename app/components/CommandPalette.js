"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { getDict, homeHref, infraHref, localizeProject, otherLangPath, projectsHref } from "@/lib/i18n";
import { toggleTheme } from "@/lib/theme";

const EMAIL = "ivanmustiere.pro@gmail.com";
const CV_URL = "/cv/cv-ivan-mustiere.pdf";

function normalize(str) {
  return str.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
}

function downloadCv() {
  const a = document.createElement("a");
  a.href = CV_URL;
  a.download = "CV_Ivan_Mustiere.pdf";
  a.click();
}

export default function CommandPalette({ lang = "fr", open, onOpenChange }) {
  const dict = getDict(lang);
  const t = dict.palette;
  const router = useRouter();
  const pathname = usePathname();
  const inputRef = useRef(null);
  const restoreFocusRef = useRef(null);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const [projects, setProjects] = useState([]);
  const [toast, setToast] = useState(null);

  // Ctrl/Cmd+K anywhere toggles the palette
  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        onOpenChange(!open);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onOpenChange]);

  useEffect(() => {
    if (!open) return;
    restoreFocusRef.current = document.activeElement;
    inputRef.current?.focus();
    fetch("/api/projects")
      .then((r) => r.json())
      .then((data) => setProjects(Array.isArray(data) ? data : []))
      .catch(() => {});
    return () => restoreFocusRef.current?.focus?.();
  }, [open]);

  const close = useCallback(() => {
    onOpenChange(false);
    setQuery("");
    setActive(0);
  }, [onOpenChange]);

  const home = homeHref(lang);
  const commands = useMemo(() => {
    const go = (href) => () => router.push(href);
    return [
      { group: t.groups.nav, label: t.goTo(dict.nav.experience), run: go(`${home}#experience`) },
      { group: t.groups.nav, label: t.goTo(dict.nav.skills), run: go(`${home}#skills`) },
      { group: t.groups.nav, label: t.goTo(dict.infra.title), run: go(infraHref(lang)) },
      { group: t.groups.nav, label: t.goTo(dict.nav.contact), run: go(`${home}#contact`) },
      ...projects.map((p) => ({ group: t.groups.demos, label: t.launch(localizeProject(p, lang).name), run: go(projectsHref(lang, p.id)) })),
      { group: t.groups.demos, label: t.allProjects, run: go(projectsHref(lang)) },
      { group: t.groups.links, label: t.cv, run: downloadCv },
      {
        group: t.groups.links,
        label: t.email,
        keepOpen: true,
        run: () => navigator.clipboard?.writeText(EMAIL).then(() => setToast(t.copied)).catch(() => {}),
      },
      { group: t.groups.links, label: "LinkedIn", run: () => window.open("https://www.linkedin.com/in/ivan-mustiere/", "_blank", "noopener") },
      { group: t.groups.links, label: "GitHub", run: () => window.open("https://github.com/Ivan-Mustiere", "_blank", "noopener") },
      { group: t.groups.prefs, label: t.theme, keepOpen: true, run: toggleTheme },
      { group: t.groups.prefs, label: t.lang, run: go(pathname ? otherLangPath(pathname, lang) : homeHref(lang === "en" ? "fr" : "en")) },
    ];
  }, [t, dict, home, lang, pathname, projects, router]);

  const results = useMemo(() => {
    const q = normalize(query.trim());
    return q ? commands.filter((c) => normalize(`${c.label} ${c.group}`).includes(q)) : commands;
  }, [commands, query]);

  const activeIndex = Math.min(active, Math.max(results.length - 1, 0));

  const runAt = (index) => {
    const cmd = results[index];
    if (!cmd) return;
    cmd.run();
    if (!cmd.keepOpen) close();
  };

  useEffect(() => {
    if (!toast) return;
    const id = setTimeout(() => setToast(null), 1800);
    return () => clearTimeout(id);
  }, [toast]);

  useEffect(() => {
    document.getElementById(`cmd-${activeIndex}`)?.scrollIntoView({ block: "nearest" });
  }, [activeIndex]);

  if (!open) return null;

  const onKeyDown = (e) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((activeIndex + 1) % Math.max(results.length, 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((activeIndex - 1 + results.length) % Math.max(results.length, 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      runAt(activeIndex);
    } else if (e.key === "Escape") {
      e.preventDefault();
      close();
    } else if (e.key === "Tab") {
      // Single focusable element: keep focus inside the dialog
      e.preventDefault();
    }
  };

  let lastGroup = null;

  return (
    <div className="fixed inset-0 z-[60] flex items-start justify-center px-4 pt-[15vh]" onKeyDown={onKeyDown}>
      <div className="absolute inset-0 bg-zinc-950/70 backdrop-blur-sm" onClick={close} aria-hidden="true" />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={t.open}
        className="relative w-full max-w-lg rounded-xl border border-zinc-800 bg-zinc-900 shadow-2xl overflow-hidden"
      >
        <div className="flex items-center gap-3 px-4 border-b border-zinc-800">
          <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-zinc-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
          </svg>
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => { setQuery(e.target.value); setActive(0); }}
            placeholder={t.placeholder}
            className="w-full bg-transparent py-3.5 text-sm text-zinc-100 placeholder:text-zinc-500 outline-none"
            role="combobox"
            aria-expanded="true"
            aria-controls="cmd-list"
            aria-activedescendant={results.length ? `cmd-${activeIndex}` : undefined}
            aria-autocomplete="list"
          />
          <kbd className="hidden sm:block text-[10px] text-zinc-500 border border-zinc-700 rounded px-1.5 py-0.5 font-mono">Esc</kbd>
        </div>
        <ul id="cmd-list" role="listbox" aria-label={t.open} className="max-h-80 overflow-y-auto py-2">
          {results.length === 0 && <li className="px-4 py-6 text-sm text-zinc-500 text-center">{t.empty}</li>}
          {results.map((cmd, i) => {
            const header = cmd.group !== lastGroup ? cmd.group : null;
            lastGroup = cmd.group;
            return (
              <li key={`${cmd.group}-${cmd.label}`} role="presentation">
                {header && <p className="px-4 pt-2 pb-1 text-[11px] uppercase tracking-wider text-zinc-500" aria-hidden="true">{header}</p>}
                <div
                  id={`cmd-${i}`}
                  role="option"
                  aria-selected={i === activeIndex}
                  onMouseMove={() => setActive(i)}
                  onClick={() => runAt(i)}
                  className={`mx-2 px-3 py-2 rounded-lg text-sm cursor-pointer ${i === activeIndex ? "bg-zinc-800 text-zinc-100" : "text-zinc-400"}`}
                >
                  {cmd.label}
                </div>
              </li>
            );
          })}
        </ul>
        {toast && (
          <p role="status" className="absolute bottom-3 right-3 px-3 py-1.5 rounded-full bg-blue-500/15 border border-blue-500/40 text-xs text-blue-300">
            {toast}
          </p>
        )}
      </div>
    </div>
  );
}
