import Link from "next/link";
import Nav from "@/app/components/Nav";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans">
      <Nav />
      <main className="max-w-5xl mx-auto px-6 flex flex-col items-center justify-center min-h-[80vh] text-center">
        <p className="text-xs text-blue-400 uppercase tracking-widest mb-4">Erreur 404</p>
        <h1 className="text-5xl font-bold tracking-tight mb-4">Page introuvable</h1>
        <p className="text-zinc-500 max-w-sm leading-relaxed mb-10">
          Cette page n'existe pas ou a été déplacée. Revenez à l'accueil pour continuer.
        </p>
        <div className="flex gap-3">
          <Link
            href="/"
            className="px-5 py-2.5 bg-zinc-100 text-zinc-900 rounded-full text-sm font-medium hover:bg-white transition-colors"
          >
            Retour à l'accueil
          </Link>
          <Link
            href="/projets"
            className="px-5 py-2.5 border border-zinc-700 rounded-full text-sm font-medium hover:border-zinc-500 transition-colors"
          >
            Voir les projets
          </Link>
        </div>
      </main>
    </div>
  );
}
