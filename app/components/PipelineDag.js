import DagTabs from "@/app/components/DagTabs";
import { DAG_CODE, highlightPython } from "@/lib/dagCode";
import { getDict } from "@/lib/i18n";

// Airflow-style graph view of a typical pipeline. Each stage goes queued → running → success in turn,
// then the whole run resets. Per-stage keyframes are generated below; reduced motion shows the final state.

const CYCLE = 11; // seconds
const STAGE_START = 1.6; // seconds between stages
const RUN = 1.2; // seconds a stage stays "running"
const RESET_AT = 10; // seconds: everything goes back to queued

const NODE_W = 150;
const NODE_H = 46;
const COL_GAP = 186;
const TASKS = [
  { id: "extract_crm_api", op: "HttpOperator", col: 0, y: 24 },
  { id: "extract_postgres", op: "SQLExecuteQuery", col: 0, y: 118 },
  { id: "transform_spark", op: "SparkSubmitOperator", col: 1, y: 71 },
  { id: "quality_checks", op: "SQLCheckOperator", col: 2, y: 71 },
  { id: "load_snowflake", op: "SnowflakeOperator", col: 3, y: 71 },
  { id: "refresh_qlik", op: "PythonOperator", col: 4, y: 24 },
  { id: "retrain_model", op: "MLflow", col: 4, y: 118 },
];
const EDGES = [
  ["extract_crm_api", "transform_spark"],
  ["extract_postgres", "transform_spark"],
  ["transform_spark", "quality_checks"],
  ["quality_checks", "load_snowflake"],
  ["load_snowflake", "refresh_qlik"],
  ["load_snowflake", "retrain_model"],
];
const STAGES = Math.max(...TASKS.map((t) => t.col)) + 1;
const WIDTH = (STAGES - 1) * COL_GAP + NODE_W + 2;
const HEIGHT = 190;

const pct = (s) => `${((s / CYCLE) * 100).toFixed(2)}%`;

function keyframes() {
  let css = "";
  for (let k = 0; k < STAGES; k++) {
    const start = k * STAGE_START;
    const done = start + RUN;
    css += `@keyframes dag-node-${k}{0%,${pct(start)}{stroke:var(--dag-queued);}${pct(start + 0.05)},${pct(done)}{stroke:var(--dag-running);}${pct(done + 0.05)},${pct(RESET_AT)}{stroke:var(--dag-success);}${pct(RESET_AT + 0.3)},100%{stroke:var(--dag-queued);}}`;
    css += `@keyframes dag-dot-${k}{0%,${pct(start)}{fill:var(--dag-queued);}${pct(start + 0.05)},${pct(done)}{fill:var(--dag-running);}${pct(done + 0.05)},${pct(RESET_AT)}{fill:var(--dag-success);}${pct(RESET_AT + 0.3)},100%{fill:var(--dag-queued);}}`;
    // An edge lights up once its upstream stage succeeds
    css += `@keyframes dag-edge-${k}{0%,${pct(done)}{stroke:var(--dag-edge);}${pct(done + 0.05)},${pct(RESET_AT)}{stroke:var(--dag-success);}${pct(RESET_AT + 0.3)},100%{stroke:var(--dag-edge);}}`;
  }
  for (let k = 0; k < STAGES; k++) {
    css += `.dag-node-${k}{animation:dag-node-${k} ${CYCLE}s linear infinite;}`;
    css += `.dag-dot-${k}{animation:dag-dot-${k} ${CYCLE}s linear infinite;}`;
    css += `.dag-edge-${k}{animation:dag-edge-${k} ${CYCLE}s linear infinite;}`;
  }
  css += `@media (prefers-reduced-motion: reduce){[class*="dag-node-"],[class*="dag-dot-"],[class*="dag-edge-"]{animation:none;}}`;
  return css;
}

const TOKEN_STYLE = {
  keyword: "text-indigo-400",
  class: "text-emerald-400",
  call: "text-blue-400",
  kwarg: "text-orange-400",
  string: "text-yellow-400",
  number: "text-orange-400",
  comment: "text-zinc-500 italic",
};

function CodeView() {
  const lines = [[]];
  for (const tok of highlightPython(DAG_CODE.trimEnd())) {
    // Split tokens on newlines so each source line becomes its own row (for line numbers)
    tok.text.split("\n").forEach((part, i) => {
      if (i > 0) lines.push([]);
      if (part) lines.at(-1).push({ ...tok, text: part });
    });
  }
  return (
    <pre className="max-h-[360px] overflow-auto py-3 text-[12px] leading-relaxed font-mono">
      <code>
        {lines.map((toks, i) => (
          <span key={i} className="flex">
            <span className="select-none w-10 pr-3 text-right text-zinc-600 flex-shrink-0" aria-hidden="true">{i + 1}</span>
            <span className="whitespace-pre pr-4 text-zinc-300">
              {toks.map((tok, j) => (
                <span key={j} className={TOKEN_STYLE[tok.kind]}>{tok.text}</span>
              ))}
            </span>
          </span>
        ))}
      </code>
    </pre>
  );
}

const byId = Object.fromEntries(TASKS.map((t) => [t.id, t]));
const nodeX = (t) => 1 + t.col * COL_GAP;

export default function PipelineDag({ lang = "fr" }) {
  const t = getDict(lang).dag;

  const legend = (
    <span className="flex items-center gap-4 text-zinc-500" aria-hidden="true">
      <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[var(--dag-queued)]" />queued</span>
      <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[var(--dag-running)]" />running</span>
      <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[var(--dag-success)]" />success</span>
    </span>
  );

  const graph = (
    <div className="overflow-x-auto">
      <svg
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        className="min-w-[680px] w-full h-auto px-4 py-3"
        role="img"
        aria-label={t.alt}
      >
        {EDGES.map(([from, to]) => {
          const a = byId[from];
          const b = byId[to];
          const x1 = nodeX(a) + NODE_W;
          const y1 = a.y + NODE_H / 2;
          const x2 = nodeX(b);
          const y2 = b.y + NODE_H / 2;
          const mx = (x1 + x2) / 2;
          return (
            <path
              key={`${from}-${to}`}
              d={`M${x1} ${y1} C${mx} ${y1} ${mx} ${y2} ${x2 - 6} ${y2}`}
              fill="none"
              strokeWidth="1.5"
              markerEnd="url(#dag-arrow)"
              className={`dag-edge-${a.col}`}
              style={{ stroke: "var(--dag-success)" }}
            />
          );
        })}
        <defs>
          <marker id="dag-arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M0 0 L10 5 L0 10 z" fill="var(--color-zinc-600)" />
          </marker>
        </defs>
        {TASKS.map((task) => (
          <g key={task.id} transform={`translate(${nodeX(task)} ${task.y})`}>
            <rect
              width={NODE_W}
              height={NODE_H}
              rx="8"
              strokeWidth="1.5"
              fill="var(--color-zinc-950)"
              className={`dag-node-${task.col}`}
              style={{ stroke: "var(--dag-success)" }}
            />
            <circle cx="14" cy="17" r="4" className={`dag-dot-${task.col}`} style={{ fill: "var(--dag-success)" }} />
            <text x="25" y="21" className="font-mono" fontSize="12" fill="var(--color-zinc-100)">{task.id}</text>
            <text x="14" y="36" fontSize="10" fill="var(--color-zinc-500)">{task.op}</text>
          </g>
        ))}
      </svg>
    </div>
  );

  return (
    <figure className="dag rounded-xl border border-zinc-800 bg-zinc-900/40 overflow-hidden">
      <style>{keyframes()}</style>
      <DagTabs
        title={
          <span className="font-mono text-zinc-300">
            <span className="text-zinc-500">DAG </span>daily_reporting
          </span>
        }
        legend={legend}
        graph={graph}
        code={<CodeView />}
        labels={{ graph: "Graph", code: "Code" }}
      />
      <figcaption className="px-4 py-3 border-t border-zinc-800 text-xs text-zinc-500 leading-relaxed">{t.caption}</figcaption>
    </figure>
  );
}
