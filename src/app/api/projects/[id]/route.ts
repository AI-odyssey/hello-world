import { NextRequest, NextResponse } from "next/server";
import { deleteProject, getProject, updateProject } from "@/lib/db";

export async function GET(_req: NextRequest, ctx: RouteContext<"/api/projects/[id]">) {
  const { id } = await ctx.params;
  const project = await getProject(id);
  if (!project) {
    return NextResponse.json({ error: "not found" }, { status: 404 });
  }
  return NextResponse.json(project);
}

export async function PATCH(request: NextRequest, ctx: RouteContext<"/api/projects/[id]">) {
  const { id } = await ctx.params;
  const body = await request.json();
  const patch: { name?: string; purpose?: string; keywords?: string[] } = {};
  if (typeof body.name === "string") patch.name = body.name.trim();
  if (typeof body.purpose === "string") patch.purpose = body.purpose.trim();
  if (Array.isArray(body.keywords)) {
    patch.keywords = body.keywords.filter(
      (k: unknown): k is string => typeof k === "string" && k.trim() !== ""
    );
  }
  const project = await updateProject(id, patch);
  if (!project) {
    return NextResponse.json({ error: "not found" }, { status: 404 });
  }
  return NextResponse.json(project);
}

export async function DELETE(_req: NextRequest, ctx: RouteContext<"/api/projects/[id]">) {
  const { id } = await ctx.params;
  const ok = await deleteProject(id);
  if (!ok) {
    return NextResponse.json({ error: "not found" }, { status: 404 });
  }
  return NextResponse.json({ ok: true });
}
