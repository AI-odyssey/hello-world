import { notFound } from "next/navigation";
import { getProject, listSites } from "@/lib/db";
import ProjectDetail from "./ProjectDetail";

export const dynamic = "force-dynamic";

export default async function ProjectPage({ params }: PageProps<"/projects/[id]">) {
  const { id } = await params;
  const project = await getProject(id);
  if (!project) {
    notFound();
  }
  const [projectSites, commonSites] = await Promise.all([
    listSites({ scope: "project", projectId: id }),
    listSites({ scope: "common" }),
  ]);

  return <ProjectDetail project={project} initialProjectSites={projectSites} commonSites={commonSites} />;
}
