import Image from "next/image";
import Link from "next/link";
import { projects } from "@/lib/projects";

const experiences = [
  {
    title: "Data Analyst",
    type: "Alternance",
    company: "Groupe Henner",
    location: "Neuilly-sur-Seine, Île-de-France",
    period: "Sept. 2023 – Aujourd'hui",
    tasks: [
      "Conception de pipelines ETL & ELT de données",
      "Préparation et analyse de données pour le reporting interne",
      "Mise en place et gestion de conteneurs Docker",
      "Gestion et administration de serveurs cloud",
    ],
  },
  {
    title: "Administrateur Systèmes / DevOps",
    type: "Alternance",
    company: "Kosmos",
    location: "Nantes, Pays de la Loire",
    period: "Août 2021 – Sept. 2023",
    tasks: [
      "Administration des systèmes et gestion des environnements DevOps",
      "Déploiement et suivi des applications",
      "Création de procédures et automatisation des tâches",
    ],
  },
];

const formations = [
  {
    degree: "Master Informatique",
    speciality: "Spécialisation Data Engineer",
    school: "Paris Ynov Campus",
    location: "Nanterre, Île-de-France",
    period: "2024 – 2026",
  },
  {
    degree: "Bachelor Informatique",
    speciality: "Spécialisation Data",
    school: "Paris Ynov Campus",
    location: "Nanterre, Île-de-France",
    period: "2023 – 2024",
  },
  {
    degree: "BTS Systèmes Numériques",
    speciality: "Programmation Informatique",
    school: "St Félix-La Salle",
    location: "Nantes, Pays de la Loire",
    period: "2021 – 2023",
  },
  {
    degree: "Baccalauréat Professionnel",
    speciality: "Informatique",
    school: "St Félix-La Salle",
    location: "Nantes, Pays de la Loire",
    period: "2018 – 2021",
  },
];

const skills = [
  {
    category: "Data & MLOps",
    items: ["ETL & pipelines (Airflow, Talend)", "MLOps (CI/CD, MLflow)", "Big Data (Spark, Kafka, Snowflake)", "Modèles ML (pandas, scikit-learn)", "Deep Learning (TensorFlow, PyTorch)"],
  },
  {
    category: "Infrastructure",
    items: ["Conteneurs (Docker, Kubernetes)", "Cloud (AWS, Azure)", "Administration Windows & Linux", "Monitoring & alerting (Grafana, PRTG)", "Automatisation de workflows (n8n)"],
  },
  {
    category: "Développement",
    items: ["Traitement de données (NumPy, Matplotlib)", "Développement applis web & mobile", "Développement de daemon", "Création de capteur embarqué", "Gestion d'équipements réseaux"],
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans">
      {/* Nav */}
      <header className="fixed top-0 w-full border-b border-zinc-800 bg-zinc-950/80 backdrop-blur z-10">
        <div className="max-w-4xl mx-auto px-6 py-4 flex justify-between items-center">
          <span className="font-semibold tracking-tight">Ivan Mustière</span>
          <nav className="flex gap-6 text-sm text-zinc-400 items-center">
            <a href="#experience" className="hover:text-zinc-100 transition-colors">Expérience</a>
            <a href="#skills" className="hover:text-zinc-100 transition-colors">Compétences</a>
            <a href="#projects" className="hover:text-zinc-100 transition-colors">Projets</a>
            <a href="#contact" className="hover:text-zinc-100 transition-colors">Contact</a>
            <a href="https://github.com/Ivan-Mustiere" target="_blank" rel="noopener noreferrer" className="hover:text-zinc-100 transition-colors" aria-label="GitHub">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
              </svg>
            </a>
            <a href="https://www.linkedin.com/in/ivan-mustiere/" target="_blank" rel="noopener noreferrer" className="hover:text-zinc-100 transition-colors" aria-label="LinkedIn">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
            </a>
          </nav>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6">
        {/* Hero */}
        <section className="pt-40 pb-24">
          <div className="flex flex-col-reverse md:flex-row md:items-center md:justify-between gap-10">
            <div className="flex-1">
              <p className="text-sm text-zinc-500 uppercase tracking-widest mb-4">MLOps & Data Engineer</p>
              <h1 className="text-5xl font-bold tracking-tight mb-6">Ivan Mustière</h1>
              <p className="text-lg text-zinc-400 max-w-xl leading-relaxed mb-3">
                Curieux et rigoureux, je conçois des solutions de données fiables et performantes —
                de l'ingestion à la mise en production, avec un focus sur la qualité et l'observabilité.
              </p>
              <p className="text-sm text-zinc-500 mb-8">
                Actuellement en mission · Disponible à partir d'octobre 2026
              </p>
              <div className="flex flex-wrap gap-3">
                <a href="#experience" className="px-5 py-2.5 bg-zinc-100 text-zinc-900 rounded-full text-sm font-medium hover:bg-white transition-colors">
                  Mon parcours
                </a>
                <a
                  href="/cv/cv-ivan-mustiere.pdf"
                  download="CV_Ivan_Mustiere.pdf"
                  className="inline-flex items-center gap-2 px-5 py-2.5 border border-zinc-700 rounded-full text-sm font-medium hover:border-zinc-400 hover:text-zinc-100 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
                  </svg>
                  Télécharger mon CV
                </a>
                <a href="#contact" className="px-5 py-2.5 border border-zinc-700 rounded-full text-sm font-medium hover:border-zinc-400 hover:text-zinc-100 transition-colors">
                  Me contacter
                </a>
              </div>
            </div>
            <div className="flex-shrink-0">
              <div className="w-36 h-36 md:w-44 md:h-44 rounded-full overflow-hidden border-2 border-zinc-700">
                <Image
                  src="/images/photo.png"
                  alt="Ivan Mustière"
                  width={176}
                  height={176}
                  className="object-cover w-full h-full"
                  priority
                />
              </div>
            </div>
          </div>
        </section>

        {/* Expérience */}
        <section id="experience" className="py-20 border-t border-zinc-800">
          <h2 className="text-2xl font-semibold mb-12">Expérience</h2>
          <div className="relative">
            <div className="absolute left-0 top-2 bottom-2 w-px bg-zinc-800" />
            <div className="flex flex-col gap-12 pl-8">
              {experiences.map((exp) => (
                <div key={exp.title} className="relative">
                  <span className="absolute -left-8 top-1.5 w-2 h-2 rounded-full bg-zinc-500 ring-4 ring-zinc-950" />
                  <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1 mb-3">
                    <div>
                      <span className="font-medium">{exp.title}</span>
                      <span className="ml-2 text-xs px-2 py-0.5 bg-zinc-800 text-zinc-400 rounded">{exp.type}</span>
                    </div>
                    <span className="text-sm text-zinc-500 flex-shrink-0">{exp.period}</span>
                  </div>
                  <p className="text-sm text-zinc-400 mb-3">{exp.company} · {exp.location}</p>
                  <ul className="flex flex-col gap-1.5">
                    {exp.tasks.map((task) => (
                      <li key={task} className="flex items-start gap-2 text-sm text-zinc-400">
                        <span className="w-1 h-1 rounded-full bg-zinc-600 flex-shrink-0 mt-2" />
                        {task}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Formation */}
        <section id="formation" className="py-20 border-t border-zinc-800">
          <h2 className="text-2xl font-semibold mb-12">Formation</h2>
          <div className="relative">
            <div className="absolute left-0 top-2 bottom-2 w-px bg-zinc-800" />
            <div className="flex flex-col gap-8 pl-8">
              {formations.map((f) => (
                <div key={f.degree + f.period} className="relative">
                  <span className="absolute -left-8 top-1.5 w-2 h-2 rounded-full bg-zinc-700 ring-4 ring-zinc-950" />
                  <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1 mb-1">
                    <span className="font-medium">{f.degree}</span>
                    <span className="text-sm text-zinc-500 flex-shrink-0">{f.period}</span>
                  </div>
                  <p className="text-sm text-zinc-400">{f.speciality}</p>
                  <p className="text-sm text-zinc-600">{f.school} · {f.location}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Compétences */}
        <section id="skills" className="py-20 border-t border-zinc-800">
          <h2 className="text-2xl font-semibold mb-10">Compétences</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {skills.map((group) => (
              <div key={group.category}>
                <h3 className="text-sm font-medium text-zinc-300 uppercase tracking-wider mb-4">{group.category}</h3>
                <ul className="flex flex-col gap-2.5">
                  {group.items.map((item) => (
                    <li key={item} className="flex items-center gap-2.5 text-sm text-zinc-400">
                      <span className="w-1.5 h-1.5 rounded-full bg-zinc-600 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* Projets */}
        <section id="projects" className="py-20 border-t border-zinc-800">
          <h2 className="text-2xl font-semibold mb-8">Projets</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {projects.map((project) => (
              <Link
                key={project.slug}
                href={`/projects/${project.slug}`}
                className="p-6 border border-zinc-800 rounded-xl hover:border-zinc-600 transition-colors group"
              >
                <h3 className="font-medium mb-2 group-hover:text-white transition-colors flex items-center justify-between">
                  {project.title}
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-zinc-600 group-hover:text-zinc-400 transition-colors" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                  </svg>
                </h3>
                <p className="text-sm text-zinc-400 mb-4 leading-relaxed">{project.description}</p>
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <span key={tag} className="px-2 py-0.5 bg-zinc-800 text-zinc-400 rounded text-xs">{tag}</span>
                  ))}
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Contact */}
        <section id="contact" className="py-20 border-t border-zinc-800">
          <h2 className="text-2xl font-semibold mb-4">Contact</h2>
          <p className="text-zinc-400 mb-6 max-w-md">
            Actuellement en mission, disponible à partir d'octobre 2026 pour des opportunités en CDI ou freelance.
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
              className="inline-flex items-center gap-2 px-5 py-2.5 border border-zinc-700 rounded-full text-sm font-medium hover:border-zinc-400 hover:text-zinc-100 transition-colors"
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
              className="inline-flex items-center gap-2 px-5 py-2.5 border border-zinc-700 rounded-full text-sm font-medium hover:border-zinc-400 hover:text-zinc-100 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
              </svg>
              GitHub
            </a>
            <a
              href="/cv/cv-ivan-mustiere.pdf"
              download="CV_Ivan_Mustiere.pdf"
              className="inline-flex items-center gap-2 px-5 py-2.5 border border-zinc-700 rounded-full text-sm font-medium hover:border-zinc-400 hover:text-zinc-100 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
              </svg>
              Télécharger mon CV
            </a>
          </div>
        </section>
      </main>

      <footer className="border-t border-zinc-800 mt-8">
        <div className="max-w-4xl mx-auto px-6 py-8 text-sm text-zinc-600 text-center">
          © {new Date().getFullYear()} Ivan Mustière
        </div>
      </footer>
    </div>
  );
}
