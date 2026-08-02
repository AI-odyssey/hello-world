import { NextRequest, NextResponse } from "next/server";
import { createProject, listProjects } from "@/lib/db";

export async function GET() {
  const projects = await listProjects();
  return NextResponse.json(projects);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const name = typeof body.name === "string" ? body.name.trim() : "";
  if (!name) {
    return NextResponse.json({ error: "name is required" }, { status: 400 });
  }
  const purpose = typeof body.purpose === "string" ? body.purpose.trim() : "";
  const keywords = Array.isArray(body.keywords)
    ? body.keywords.filter((k: unknown): k is string => typeof k === "string" && k.trim() !== "")
    : [];
  const project = await createProject({ name, purpose, keywords });
  return NextResponse.json(project, { status: 201 });
}
