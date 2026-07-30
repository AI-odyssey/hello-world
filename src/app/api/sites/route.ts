import { NextRequest, NextResponse } from "next/server";
import { createSite, listSites } from "@/lib/db";
import type { SiteScope } from "@/lib/types";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const scope = searchParams.get("scope") as SiteScope | null;
  const projectId = searchParams.get("projectId") ?? undefined;
  const sites = await listSites({
    scope: scope ?? undefined,
    projectId,
  });
  return NextResponse.json(sites);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const name = typeof body.name === "string" ? body.name.trim() : "";
  const url = typeof body.url === "string" ? body.url.trim() : "";
  if (!name || !url) {
    return NextResponse.json({ error: "name and url are required" }, { status: 400 });
  }
  const scope: SiteScope = body.scope === "project" ? "project" : "common";
  const projectId = scope === "project" && typeof body.projectId === "string" ? body.projectId : null;
  if (scope === "project" && !projectId) {
    return NextResponse.json({ error: "projectId is required for project-scoped sites" }, { status: 400 });
  }
  const category = typeof body.category === "string" ? body.category.trim() : "";
  const memo = typeof body.memo === "string" ? body.memo.trim() : "";
  const site = await createSite({ name, url, scope, projectId, category, memo });
  return NextResponse.json(site, { status: 201 });
}
