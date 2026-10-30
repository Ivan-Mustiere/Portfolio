import HomePage from "@/app/components/HomePage";

// Key figures are computed at render: refresh daily (the GitHub calendar revalidates every 6 h)
export const revalidate = 86400;

const title = "Ivan Mustière — Data Engineer with an infra & DevOps background";
const description =
  "Portfolio of Ivan Mustière, Data Engineer with a strong infra and DevOps background. ETL/ELT pipelines, Snowflake, Airflow orchestration, Docker & Kubernetes — with interactive Docker demos hosted on my own VPS.";

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
