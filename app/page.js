import Image from "next/image";
import Link from "next/link";
import Nav from "@/app/components/Nav";
import ProjectsGrid from "@/app/components/ProjectsGrid";
import { experiences, formations, skills } from "@/lib/data";

export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans">
      <Nav />

      <main className="max-w-5xl mx-auto px-4 sm:px-6">

        {/* Hero */}
        <section className="pt-32 md:pt-40 pb-16 md:pb-24">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8 md:gap-12">
            <div className="flex md:hidden justify-center">
              <div className="w-28 h-28 rounded-full overflow-hidden border-2 border-zinc-700">
                <Image src="/images/photo.webp" alt="Ivan Mustière" width={112} height={112} className="object-cover w-full h-full" priority />
              </div>
            </div>
            <div className="flex-1">
              <p className="text-xs sm:text-sm text-blue-400 uppercase tracking-widest mb-3">MLOps & Data Engineer</p>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-5">Ivan Mustière</h1>
              <p className="text-base md:text-lg text-zinc-400 max-w-lg leading-relaxed mb-8">
                Je souhaite contribuer à des projets alignés avec mes valeurs. Curieux et rigoureux,
                j'aime concevoir des solutions fiables et performantes. Je suis prêt à évoluer dans
                un environnement exigeant, tant sur le plan technique qu'humain.
              </p>
              <div className="flex flex-wrap gap-3">
                <a href="#experience" className="px-5 py-2.5 bg-zinc-100 text-zinc-900 rounded-full text-sm font-medium hover:bg-white transition-colors">
                  Mon parcours
                </a>
                <a
                  href="/cv/cv-ivan-mustiere.pdf"
                  download="CV_Ivan_Mustiere.pdf"
                  className="inline-flex items-center gap-2 px-5 py-2.5 border border-zinc-700 rounded-full text-sm font-medium hover:border-zinc-500 hover:text-zinc-100 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
                  </svg>
                  Télécharger mon CV
                </a>
                <a href="#contact" className="px-5 py-2.5 border border-zinc-700 rounded-full text-sm font-medium hover:border-zinc-500 hover:text-zinc-100 transition-colors">
                  Me contacter
                </a>
              </div>
            </div>
            <div className="hidden md:flex flex-shrink-0">
              <div className="w-40 h-40 rounded-full overflow-hidden border-2 border-zinc-700">
                <Image src="/images/photo.webp" alt="Ivan Mustière" width={160} height={160} className="object-cover w-full h-full" priority />
              </div>
            </div>
          </div>
        </section>

        {/* Ce que je fais */}
        <section className="py-14 md:py-20 border-t border-zinc-800">
          <h2 className="text-xl md:text-2xl font-semibold mb-8">Ce que je fais</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              {
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 5.625c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125" />
                  </svg>
                ),
                title: "Data Engineering",
                description: "Conception et opération de pipelines ETL/ELT robustes — ingestion, transformation et exposition des données aux équipes analytiques.",
              },
              {
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09Z" />
                  </svg>
                ),
                title: "MLOps",
                description: "Industrialisation de modèles ML : CI/CD, versioning avec MLflow, déploiement et monitoring en production.",
              },
              {
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 14.25h13.5m-13.5 0a3 3 0 0 1-3-3m3 3a3 3 0 1 0 6 0m-6 0H3m16.5 0a3 3 0 0 0 3-3m-3 3a3 3 0 1 1-6 0m6 0h1.5m-7.5-9a3 3 0 0 1 3 3m-3-3a3 3 0 1 0-6 0m6 0H3m16.5 0a3 3 0 0 0-3-3m3 3h1.5" />
                  </svg>
                ),
                title: "Infrastructure & DevOps",
                description: "Administration cloud (AWS, Azure), conteneurisation Docker/Kubernetes, monitoring et automatisation des déploiements.",
              },
            ].map((card) => (
              <div key={card.title} className="p-6 border border-zinc-800 rounded-xl flex flex-col gap-3">
                <div className="w-9 h-9 rounded-lg bg-blue-950 flex items-center justify-center text-blue-400">
                  {card.icon}
                </div>
                <div>
                  <h3 className="font-medium mb-1.5">{card.title}</h3>
                  <p className="text-sm text-zinc-500 leading-relaxed">{card.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Expérience */}
        <section id="experience" className="py-14 md:py-20 border-t border-zinc-800">
          <h2 className="text-xl md:text-2xl font-semibold mb-10">Expérience</h2>
          <div className="relative">
            <div className="absolute left-0 top-2 bottom-2 w-px bg-zinc-800" />
            <div className="flex flex-col gap-10 pl-8">
              {experiences.map((exp) => (
                <div key={exp.title} className="relative">
                  <span className="absolute -left-8 top-1.5 w-2 h-2 rounded-full bg-blue-500 ring-4 ring-zinc-950" />
                  <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1 mb-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{exp.title}</span>
                      <span className="text-xs px-2 py-0.5 bg-blue-950 text-blue-400 border border-blue-900/50 rounded">{exp.type}</span>
                    </div>
                    <span className="text-sm text-zinc-500">{exp.period}</span>
                  </div>
                  <p className="text-sm text-zinc-400 mb-4">{exp.company} · {exp.location}</p>
                  <ul className="flex flex-col gap-2 mb-4">
                    {exp.tasks.map((task) => (
                      <li key={task} className="flex items-start gap-2.5 text-sm text-zinc-400">
                        <span className="w-1 h-1 rounded-full bg-zinc-600 flex-shrink-0 mt-2" />
                        {task}
                      </li>
                    ))}
                  </ul>
                  {exp.stack && (
                    <div className="flex flex-wrap gap-2">
                      {exp.stack.map((tech) => (
                        <span key={tech} className="px-2 py-0.5 bg-blue-950/50 border border-blue-900/50 text-blue-300 rounded text-xs">
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Formation + Compétences */}
        <div className="border-t border-zinc-800 py-14 md:py-20 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">

          <section id="formation">
            <h2 className="text-xl md:text-2xl font-semibold mb-10">Formation</h2>
            <div className="relative">
              <div className="absolute left-0 top-2 bottom-2 w-px bg-blue-900/40" />
              <div className="flex flex-col gap-7 pl-8">
                {formations.map((f) => (
                  <div key={f.degree + f.period} className="relative">
                    <span className="absolute -left-8 top-1.5 w-2 h-2 rounded-full bg-indigo-500 ring-4 ring-zinc-950" />
                    <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1 mb-1">
                      <span className="font-medium">{f.degree}</span>
                      <span className="text-sm text-zinc-500">{f.period}</span>
                    </div>
                    <p className="text-sm text-zinc-400">{f.speciality}</p>
                    <p className="text-sm text-zinc-600">{f.school} · {f.location}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section id="skills">
            <h2 className="text-xl md:text-2xl font-semibold mb-10">Compétences</h2>
            <div className="flex flex-col gap-7">
              {skills.map((group) => (
                <div key={group.category}>
                  <h3 className="text-xs font-semibold text-blue-400 uppercase tracking-wider mb-3">{group.category}</h3>
                  <ul className="flex flex-col gap-2">
                    {group.items.map((item) => (
                      <li key={item} className="flex items-center gap-2.5 text-sm text-zinc-400">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500/70 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Projets interactifs */}
        <section className="py-14 md:py-20 border-t border-zinc-800">
          <div className="rounded-2xl border border-blue-900/50 bg-blue-950/10 px-6 py-8 md:px-10 md:py-10">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6 mb-8">
              <div>
                <div className="flex items-center gap-2.5 mb-3">
                  <span className="flex items-center gap-1.5 px-2.5 py-1 bg-blue-500/10 border border-blue-500/30 rounded-full text-xs text-blue-400 font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
                    Live
                  </span>
                </div>
                <h2 className="text-xl md:text-2xl font-semibold mb-2">Projets interactifs</h2>
                <p className="text-sm text-zinc-400 max-w-md leading-relaxed">
                  Lance n'importe quel projet directement dans le navigateur — un conteneur Docker démarre en quelques secondes, sans rien installer.
                </p>
              </div>
              <Link
                href="/projets"
                className="inline-flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300 transition-colors whitespace-nowrap flex-shrink-0"
              >
                Voir tous les projets
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                </svg>
              </Link>
            </div>

            <ProjectsGrid />
          </div>
        </section>

        {/* Contact */}
        <section id="contact" className="py-14 md:py-20 border-t border-zinc-800">
          <h2 className="text-xl md:text-2xl font-semibold mb-3">Contact</h2>
          <p className="text-zinc-500 mb-8 max-w-md text-sm">
            Disponible pour échanger sur des opportunités en CDI ou freelance.
          </p>

          <div className="flex flex-wrap gap-3">
            <a
              href="mailto:ivanmustiere.pro@gmail.com"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-zinc-100 text-zinc-900 rounded-full text-sm font-medium hover:bg-white transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
              </svg>
              ivanmustiere.pro@gmail.com
            </a>
            <a
              href="https://www.linkedin.com/in/ivan-mustiere/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 border border-zinc-700 rounded-full text-sm font-medium hover:border-zinc-500 hover:text-zinc-100 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
              LinkedIn
            </a>
            <a
              href="https://github.com/Ivan-Mustiere"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 border border-zinc-700 rounded-full text-sm font-medium hover:border-zinc-500 hover:text-zinc-100 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
              </svg>
              GitHub
            </a>
            <a
              href="/cv/cv-ivan-mustiere.pdf"
              download="CV_Ivan_Mustiere.pdf"
              className="inline-flex items-center gap-2 px-5 py-2.5 border border-zinc-700 rounded-full text-sm font-medium hover:border-zinc-500 hover:text-zinc-100 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
              </svg>
              Télécharger mon CV
            </a>
          </div>
        </section>
      </main>

      <footer className="border-t border-zinc-800">
        <div className="max-w-5xl mx-auto px-6 py-8 text-sm text-zinc-600 text-center">
          © {new Date().getFullYear()} Ivan Mustière
        </div>
      </footer>
    </div>
  );
}
