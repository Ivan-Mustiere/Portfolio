import InfraPage from "@/app/components/InfraPage";
import { getDict } from "@/lib/i18n";

const t = getDict("en").infra;

export const metadata = {
  title: t.metaTitle,
  description: t.metaDescription,
  alternates: { canonical: "/en/infra", languages: { fr: "/infra", en: "/en/infra" } },
};

export default function InfraEn() {
  return <InfraPage lang="en" />;
}
