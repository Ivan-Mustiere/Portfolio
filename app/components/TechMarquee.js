import TechLogo, { techTitle } from "@/app/components/TechLogo";

// Decorative: the same techs are listed, with names, in the Skills section.
// The track holds the list twice and slides by -50% for a seamless loop (.marquee-* in globals.css).
export default function TechMarquee({ logos }) {
  const row = (copy) =>
    logos.map((name) => (
      <li key={`${copy}-${name}`} className="group flex items-center gap-2.5 text-zinc-500 hover:text-zinc-200 transition-colors">
        <TechLogo name={name} className="w-5 h-5" />
        <span className="text-sm whitespace-nowrap">{techTitle(name)}</span>
      </li>
    ));

  return (
    <div className="marquee relative overflow-hidden py-6 border-y border-zinc-800/70" aria-hidden="true">
      <ul className="marquee-track flex w-max gap-10 pr-10">
        {row("a")}
        {row("b")}
      </ul>
    </div>
  );
}
