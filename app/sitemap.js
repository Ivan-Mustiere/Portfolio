export default function sitemap() {
  const base = "https://ivan-mustiere.com";
  return [
    { url: base, lastModified: new Date(), changeFrequency: "monthly", priority: 1 },
    { url: `${base}/projets`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/projets/grafana`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/projets/airflow`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
  ];
}
