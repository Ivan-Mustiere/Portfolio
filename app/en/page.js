import HomePage from "@/app/components/HomePage";

// Key figures are computed at render: refresh daily (the GitHub calendar revalidates every 6 h)
export const revalidate = 86400;

const title = "Ivan Mustière — Data Engineer, MLOps & Systems Administrator";
const description =
  "Portfolio of Ivan Mustière, Data Engineer, MLOps and systems administrator. Data pipelines, Airflow orchestration, Linux & Windows, Kubernetes, Grafana monitoring — with interactive Docker demos.";

export const metadata = {
  title,
  description,
  alternates: { canonical: "/en", languages: { fr: "/", en: "/en" } },
  openGraph: { title, description, url: "https://ivan-mustiere.com/en", siteName: "Ivan Mustière", locale: "en_US", type: "website" },
  twitter: { card: "summary_large_image", title, description },
};

export default function HomeEn() {
  return <HomePage lang="en" />;
}
