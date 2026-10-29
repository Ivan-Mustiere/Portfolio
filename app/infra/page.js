import InfraPage from "@/app/components/InfraPage";
import { getDict } from "@/lib/i18n";

const t = getDict("fr").infra;

export const metadata = {
  title: t.metaTitle,
  description: t.metaDescription,
  alternates: { canonical: "/infra", languages: { fr: "/infra", en: "/en/infra" } },
};

export default function Infra() {
  return <InfraPage lang="fr" />;
}
