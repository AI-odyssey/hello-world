import { listSites } from "@/lib/db";
import CommonSitesManager from "./CommonSitesManager";

export const dynamic = "force-dynamic";

export default async function SitesPage() {
  const sites = await listSites({ scope: "common" });
  return <CommonSitesManager initialSites={sites} />;
}
