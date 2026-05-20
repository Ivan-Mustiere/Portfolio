export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans">
      {/* Nav */}
      <header className="fixed top-0 w-full border-b border-zinc-800 bg-zinc-950/80 backdrop-blur z-10">
        <div className="max-w-4xl mx-auto px-6 py-4 flex justify-between items-center">
          <span className="font-semibold tracking-tight">Ivan Mustière</span>
          <nav className="flex gap-6 text-sm text-zinc-400">
            <a href="#about" className="hover:text-zinc-100 transition-colors">À propos</a>
            <a href="/projets" className="hover:text-zinc-100 transition-colors">Projets</a>
            <a href="#contact" className="hover:text-zinc-100 transition-colors">Contact</a>
          </nav>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6">
        {/* Hero */}
        <section className="pt-40 pb-24">
          <p className="text-sm text-zinc-500 uppercase tracking-widest mb-4">Data Engineer</p>
          <h1 className="text-5xl font-bold tracking-tight mb-6">
            Ivan Mustière
          </h1>
          <p className="text-xl text-zinc-400 max-w-xl leading-relaxed">
            Je conçois et opère des pipelines de données robustes — de l'ingestion à la mise à disposition,
            avec un focus sur la fiabilité et l'observabilité.
          </p>
          <div className="mt-8 flex gap-4">
            <a
              href="#projects"
              className="px-5 py-2.5 bg-zinc-100 text-zinc-900 rounded-full text-sm font-medium hover:bg-white transition-colors"
            >
              Voir les projets
            </a>
            <a
              href="#contact"
              className="px-5 py-2.5 border border-zinc-700 rounded-full text-sm font-medium hover:border-zinc-500 transition-colors"
            >
              Me contacter
            </a>
          </div>
        </section>

        {/* About */}
        <section id="about" className="py-20 border-t border-zinc-800">
          <h2 className="text-2xl font-semibold mb-8">À propos</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <p className="text-zinc-400 leading-relaxed">
              Data Engineer passionné par la construction d'infrastructures de données scalables.
              J'interviens sur tout le cycle de vie de la donnée : ingestion, transformation,
              orchestration et exposition aux équipes analytiques.
            </p>
            <div className="flex flex-col gap-3">
              {["Python", "SQL", "Apache Spark", "dbt", "Airflow / Prefect", "Docker & Kubernetes", "GCP / AWS"].map((skill) => (
                <div key={skill} className="flex items-center gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-zinc-500 flex-shrink-0" />
                  <span className="text-zinc-300 text-sm">{skill}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Projects */}
        <section id="projects" className="py-20 border-t border-zinc-800">
          <h2 className="text-2xl font-semibold mb-8">Projets</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                title: "Pipeline temps réel",
                description: "Ingestion et transformation de flux événementiels avec Kafka et Spark Streaming.",
                tags: ["Kafka", "Spark", "Python"],
              },
              {
                title: "Data warehouse dbt",
                description: "Modélisation dimensionnelle et tests de qualité automatisés sur BigQuery.",
                tags: ["dbt", "BigQuery", "SQL"],
              },
              {
                title: "Orchestration Airflow",
                description: "DAGs de traitement batch avec alerting et retry automatique.",
                tags: ["Airflow", "Docker", "Python"],
              },
              {
                title: "Observabilité données",
                description: "Monitoring de la qualité des données avec Great Expectations et dashboards Grafana.",
                tags: ["Great Expectations", "Grafana", "PostgreSQL"],
              },
            ].map((project) => (
              <div
                key={project.title}
                className="p-6 border border-zinc-800 rounded-xl hover:border-zinc-600 transition-colors"
              >
                <h3 className="font-medium mb-2">{project.title}</h3>
                <p className="text-sm text-zinc-400 mb-4 leading-relaxed">{project.description}</p>
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <span key={tag} className="px-2 py-0.5 bg-zinc-800 text-zinc-400 rounded text-xs">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Contact */}
        <section id="contact" className="py-20 border-t border-zinc-800">
          <h2 className="text-2xl font-semibold mb-4">Contact</h2>
          <p className="text-zinc-400 mb-6">
            Disponible pour des missions freelance ou des opportunités en CDI.
          </p>
          <a
            href="mailto:yiforcex@gmail.com"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-zinc-100 text-zinc-900 rounded-full text-sm font-medium hover:bg-white transition-colors"
          >
            yiforcex@gmail.com
          </a>
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
