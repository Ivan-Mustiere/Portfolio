import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Ivan Mustière — Data Engineer & MLOps",
  description:
    "Portfolio d'Ivan Mustière, Data Engineer & MLOps. Pipelines de données, orchestration Airflow, monitoring Grafana, Docker — avec démos interactives.",
  metadataBase: new URL("https://ivan-mustiere.com"),
  openGraph: {
    title: "Ivan Mustière — Data Engineer & MLOps",
    description:
      "Portfolio d'Ivan Mustière, Data Engineer & MLOps. Pipelines de données, orchestration Airflow, monitoring Grafana, Docker — avec démos interactives.",
    url: "https://ivan-mustiere.com",
    siteName: "Ivan Mustière",
    images: [{ url: "/images/photo.webp", width: 1603, height: 1612, alt: "Ivan Mustière" }],
    locale: "fr_FR",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Ivan Mustière — Data Engineer & MLOps",
    description: "Portfolio avec démos Docker interactives — Grafana, Airflow et plus.",
    images: ["/images/photo.webp"],
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="fr"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {children}
        {process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN && (
          <Script
            defer
            data-domain={process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN}
            src="https://plausible.io/js/script.js"
          />
        )}
      </body>
    </html>
  );
}
