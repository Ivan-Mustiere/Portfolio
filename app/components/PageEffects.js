"use client";

import { useEffect } from "react";

// Page-wide progressive enhancements, all driven by data attributes / CSS vars (see globals.css):
// - [data-reveal] elements get [data-visible] when scrolled into view
// - [data-halo] sections get --hx/--hy, .glow-card elements get --mx/--my from the pointer
// - <html lang> follows the page language (the root layout always renders "fr")
export default function PageEffects({ lang = "fr" }) {
  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  useEffect(() => {
    const els = document.querySelectorAll("[data-reveal]");
    if (!("IntersectionObserver" in window)) {
      els.forEach((el) => el.setAttribute("data-visible", ""));
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.setAttribute("data-visible", "");
          observer.unobserve(entry.target);
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.05 }
    );
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!matchMedia("(pointer: fine)").matches) return;
    let frame = 0;
    const onMove = (e) => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        const target = e.target instanceof Element ? e.target : null;
        const card = target?.closest(".glow-card");
        if (card) {
          const r = card.getBoundingClientRect();
          card.style.setProperty("--mx", `${e.clientX - r.left}px`);
          card.style.setProperty("--my", `${e.clientY - r.top}px`);
        }
        const halo = target?.closest("[data-halo]");
        if (halo) {
          const r = halo.getBoundingClientRect();
          halo.style.setProperty("--hx", `${e.clientX - r.left + 160}px`);
          halo.style.setProperty("--hy", `${e.clientY - r.top}px`);
        }
      });
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(frame);
    };
  }, []);

  return null;
}
