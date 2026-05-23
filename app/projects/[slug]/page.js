import Link from "next/link";
import { projects, getProjectBySlug } from "@/lib/projects";
import { notFound } from "next/navigation";

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export function generateMetadata({ params }) {
  const project = getProjectBySlug(params.slug);
  if (!project) return {};
  return { title: `${project.title} — Ivan Mustière` };
}

export default function ProjectPage({ params }) {
  const project = getProjectBySlug(params.slug);
  if (!project) notFound();

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans">
      {/* Nav */}
      <header className="fixed top-0 w-full border-b border-zinc-800 bg-zinc-950/80 backdrop-blur z-10">
        <div className="max-w-4xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/" className="font-semibold tracking-tight hover:text-zinc-300 transition-colors">
            Ivan Mustière
          </Link>
          <Link href="/#projects" className="text-sm text-zinc-400 hover:text-zinc-100 transition-colors flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
            </svg>
            Retour
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 pt-36 pb-24">
        {/* Header projet */}
        <div className="mb-12">
          <div className="flex flex-wrap gap-2 mb-4">
            {project.tags.map((tag) => (
              <span key={tag} className="px-2 py-0.5 bg-zinc-800 text-zinc-400 rounded text-xs">
                {tag}
              </span>
            ))}
          </div>
          <h1 className="text-4xl font-bold tracking-tight mb-4">{project.title}</h1>
          <p className="text-lg text-zinc-400 leading-relaxed max-w-2xl">{project.longDescription}</p>
        </div>

        {/* Points clés */}
        <section className="mb-12">
          <h2 className="text-lg font-semibold mb-6">Points clés</h2>
          <ul className="flex flex-col gap-4">
            {project.highlights.map((highlight) => (
              <li key={highlight} className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-zinc-500 flex-shrink-0 mt-2" />
                <span className="text-zinc-400">{highlight}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Lien GitHub */}
        <div className="flex gap-3">
          <a
            href={project.github}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-zinc-100 text-zinc-900 rounded-full text-sm font-medium hover:bg-white transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
            </svg>
            Voir sur GitHub
          </a>
          <Link
            href="/#projects"
            className="inline-flex items-center gap-2 px-5 py-2.5 border border-zinc-700 rounded-full text-sm font-medium hover:border-zinc-400 hover:text-zinc-100 transition-colors"
          >
            Autres projets
          </Link>
        </div>
      </main>
    </div>
  );
}
