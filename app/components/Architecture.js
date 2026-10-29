import { getDict } from "@/lib/i18n";

// Request path when a visitor launches a demo. The packet animation lives in globals.css (.arch-*).
export default function Architecture({ lang = "fr" }) {
  const t = getDict(lang).infra;
  const names = [t.browser, "nginx", "Next.js", "docker-backend", "Docker"];
  const NODES = names.map((name, i) => ({ name, detail: t.nodes[i] }));

  return (
    <div>
      <ol className="flex flex-col md:flex-row md:items-stretch">
        {NODES.map((node, i) => (
          <li key={node.name} className="contents">
            <div className="glow-card flex-1 min-w-0 p-4 rounded-xl border border-zinc-800 bg-zinc-900/40">
              <p className="font-mono text-sm text-zinc-100">{node.name}</p>
              <p className="text-xs text-zinc-500 leading-relaxed mt-1">{node.detail}</p>
            </div>
            {i < NODES.length - 1 && (
              <div className="arch-link" style={{ "--i": i }} aria-hidden="true">
                <span className="arch-packet" />
              </div>
            )}
          </li>
        ))}
      </ol>
      <p className="text-xs text-zinc-500 mt-4 leading-relaxed">{t.caption}</p>
    </div>
  );
}
