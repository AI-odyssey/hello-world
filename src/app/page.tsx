import { listProjects, listSites } from "@/lib/db";
import DashboardHome from "./DashboardHome";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [projects, allSites] = await Promise.all([listProjects(), listSites()]);
  const commonSiteCount = allSites.filter((s) => s.scope === "common").length;
  const projectsWithCounts = projects.map((project) => ({
    ...project,
    projectSiteCount: allSites.filter((s) => s.scope === "project" && s.projectId === project.id).length,
  }));

  return <DashboardHome initialProjects={projectsWithCounts} commonSiteCount={commonSiteCount} />;
}
