import { NextRequest, NextResponse } from "next/server";
import { deleteSite, updateSite } from "@/lib/db";

export async function PATCH(request: NextRequest, ctx: RouteContext<"/api/sites/[id]">) {
  const { id } = await ctx.params;
  const body = await request.json();
  const patch: { name?: string; url?: string; category?: string; memo?: string } = {};
  if (typeof body.name === "string") patch.name = body.name.trim();
  if (typeof body.url === "string") patch.url = body.url.trim();
  if (typeof body.category === "string") patch.category = body.category.trim();
  if (typeof body.memo === "string") patch.memo = body.memo.trim();
  const site = await updateSite(id, patch);
  if (!site) {
    return NextResponse.json({ error: "not found" }, { status: 404 });
  }
  return NextResponse.json(site);
}

export async function DELETE(_req: NextRequest, ctx: RouteContext<"/api/sites/[id]">) {
  const { id } = await ctx.params;
  const ok = await deleteSite(id);
  if (!ok) {
    return NextResponse.json({ error: "not found" }, { status: 404 });
  }
  return NextResponse.json({ ok: true });
}
