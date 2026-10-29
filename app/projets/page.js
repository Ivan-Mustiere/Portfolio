import ProjectsPage from "@/app/components/ProjectsPage";
import { getDict } from "@/lib/i18n";

const t = getDict("fr").projectsPage;

export const metadata = {
  title: t.metaTitle,
  description: t.metaDescription,
  alternates: { canonical: "/projets", languages: { fr: "/projets", en: "/en/projets" } },
};

export default function Projects() {
  return <ProjectsPage lang="fr" />;
}
