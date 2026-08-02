export type Project = {
  id: string;
  name: string;
  purpose: string;
  keywords: string[];
  createdAt: string;
  updatedAt: string;
};

export type SiteScope = "common" | "project";

export type Site = {
  id: string;
  name: string;
  url: string;
  scope: SiteScope;
  projectId: string | null;
  category: string;
  memo: string;
  createdAt: string;
  updatedAt: string;
};

export type Database = {
  projects: Project[];
  sites: Site[];
};
