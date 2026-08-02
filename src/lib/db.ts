import { promises as fs } from "fs";
import path from "path";
import { randomUUID } from "crypto";
import type { Database, Project, Site, SiteScope } from "@/lib/types";

const DB_PATH = path.join(process.cwd(), "data", "db.json");

const EMPTY_DB: Database = { projects: [], sites: [] };

async function readDb(): Promise<Database> {
  try {
    const raw = await fs.readFile(DB_PATH, "utf-8");
    return JSON.parse(raw) as Database;
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === "ENOENT") {
      await writeDb(EMPTY_DB);
      return EMPTY_DB;
    }
    throw err;
  }
}

async function writeDb(db: Database): Promise<void> {
  await fs.mkdir(path.dirname(DB_PATH), { recursive: true });
  await fs.writeFile(DB_PATH, JSON.stringify(db, null, 2), "utf-8");
}

// --- Projects ---

export async function listProjects(): Promise<Project[]> {
  const db = await readDb();
  return db.projects;
}

export async function getProject(id: string): Promise<Project | null> {
  const db = await readDb();
  return db.projects.find((p) => p.id === id) ?? null;
}

export async function createProject(input: {
  name: string;
  purpose: string;
  keywords: string[];
}): Promise<Project> {
  const db = await readDb();
  const now = new Date().toISOString();
  const project: Project = {
    id: randomUUID(),
    name: input.name,
    purpose: input.purpose,
    keywords: input.keywords,
    createdAt: now,
    updatedAt: now,
  };
  db.projects.push(project);
  await writeDb(db);
  return project;
}

export async function updateProject(
  id: string,
  patch: Partial<Pick<Project, "name" | "purpose" | "keywords">>
): Promise<Project | null> {
  const db = await readDb();
  const project = db.projects.find((p) => p.id === id);
  if (!project) return null;
  Object.assign(project, patch, { updatedAt: new Date().toISOString() });
  await writeDb(db);
  return project;
}

export async function deleteProject(id: string): Promise<boolean> {
  const db = await readDb();
  const before = db.projects.length;
  db.projects = db.projects.filter((p) => p.id !== id);
  db.sites = db.sites.filter((s) => s.projectId !== id);
  await writeDb(db);
  return db.projects.length < before;
}

// --- Sites ---

export async function listSites(filter?: {
  scope?: SiteScope;
  projectId?: string;
}): Promise<Site[]> {
  const db = await readDb();
  let sites = db.sites;
  if (filter?.scope) {
    sites = sites.filter((s) => s.scope === filter.scope);
  }
  if (filter?.projectId) {
    sites = sites.filter((s) => s.projectId === filter.projectId);
  }
  return sites;
}

export async function createSite(input: {
  name: string;
  url: string;
  scope: SiteScope;
  projectId: string | null;
  category: string;
  memo: string;
}): Promise<Site> {
  const db = await readDb();
  const now = new Date().toISOString();
  const site: Site = {
    id: randomUUID(),
    name: input.name,
    url: input.url,
    scope: input.scope,
    projectId: input.scope === "project" ? input.projectId : null,
    category: input.category,
    memo: input.memo,
    createdAt: now,
    updatedAt: now,
  };
  db.sites.push(site);
  await writeDb(db);
  return site;
}

export async function updateSite(
  id: string,
  patch: Partial<Pick<Site, "name" | "url" | "category" | "memo">>
): Promise<Site | null> {
  const db = await readDb();
  const site = db.sites.find((s) => s.id === id);
  if (!site) return null;
  Object.assign(site, patch, { updatedAt: new Date().toISOString() });
  await writeDb(db);
  return site;
}

export async function deleteSite(id: string): Promise<boolean> {
  const db = await readDb();
  const before = db.sites.length;
  db.sites = db.sites.filter((s) => s.id !== id);
  await writeDb(db);
  return db.sites.length < before;
}
