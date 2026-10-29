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
  title: "Ivan Mustière — Data Engineer, MLOps & Admin Systèmes",
  description:
    "Portfolio d'Ivan Mustière, Data Engineer, MLOps et administrateur systèmes. Pipelines de données, orchestration Airflow, Linux & Windows, Kubernetes, monitoring Grafana — avec démos Docker interactives.",
  metadataBase: new URL("https://ivan-mustiere.com"),
  openGraph: {
    title: "Ivan Mustière — Data Engineer, MLOps & Admin Systèmes",
    description:
      "Portfolio d'Ivan Mustière, Data Engineer, MLOps et administrateur systèmes. Pipelines de données, orchestration Airflow, Linux & Windows, Kubernetes, monitoring Grafana — avec démos Docker interactives.",
    url: "https://ivan-mustiere.com",
    siteName: "Ivan Mustière",
    locale: "fr_FR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ivan Mustière — Data Engineer, MLOps & Admin Systèmes",
    description: "Portfolio avec démos Docker interactives — Grafana, Airflow et plus.",
  },
  alternates: { canonical: "/", languages: { fr: "/", en: "/en" } },
  robots: { index: true, follow: true },
};

// Runs before paint so the saved/system theme applies without a flash.
const themeScript = `(function(){try{var t=localStorage.getItem("theme");if(t!=="light"&&t!=="dark")t=matchMedia("(prefers-color-scheme: light)").matches?"light":"dark";document.documentElement.dataset.theme=t}catch(e){document.documentElement.dataset.theme="dark"}})()`;

export default function RootLayout({ children }) {
  return (
    <html
      lang="fr"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      data-theme="dark"
      // data-theme and lang are adjusted on the client (theme script, /en page)
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      {/* Browser extensions (e.g. ColorZilla) inject attributes on <body> before hydration */}
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
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
