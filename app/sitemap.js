// Every page exists in French (root) and English (/en): list both with their alternates
const PATHS = [
  { path: "", priority: 1 },
  { path: "/projets", priority: 0.8 },
  { path: "/projets/grafana", priority: 0.6 },
  { path: "/projets/airflow", priority: 0.6 },
  { path: "/infra", priority: 0.7 },
];

export default function sitemap() {
  const base = "https://ivan-mustiere.com";
  return PATHS.flatMap(({ path, priority }) => {
    const fr = `${base}${path || "/"}`;
    const en = `${base}/en${path}`;
    const common = { lastModified: new Date(), changeFrequency: "monthly", alternates: { languages: { fr, en } } };
    return [
      { url: fr, priority, ...common },
      { url: en, priority: Math.round(priority * 9) / 10, ...common },
    ];
  });
}
