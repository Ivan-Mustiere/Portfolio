import ProjectDemo from "@/app/components/ProjectDemo";

export default async function ProjectDemoPage({ params }) {
  const { slug } = await params;
  return <ProjectDemo slug={slug} lang="en" />;
}
