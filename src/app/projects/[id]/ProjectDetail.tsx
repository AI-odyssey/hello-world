"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { Project, Site } from "@/lib/types";

export default function ProjectDetail({
  project,
  initialProjectSites,
  commonSites,
}: {
  project: Project;
  initialProjectSites: Site[];
  commonSites: Site[];
}) {
  const router = useRouter();

  const [purpose, setPurpose] = useState(project.purpose);
  const [keywords, setKeywords] = useState<string[]>(project.keywords);
  const [keywordInput, setKeywordInput] = useState("");
  const [savingMeta, setSavingMeta] = useState(false);
  const [savedMsg, setSavedMsg] = useState(false);

  const [projectSites, setProjectSites] = useState(initialProjectSites);
  const [siteName, setSiteName] = useState("");
  const [siteUrl, setSiteUrl] = useState("");
  const [siteCategory, setSiteCategory] = useState("");
  const [siteMemo, setSiteMemo] = useState("");
  const [siteError, setSiteError] = useState<string | null>(null);
  const [addingSite, setAddingSite] = useState(false);

  function addKeyword() {
    const kw = keywordInput.trim();
    if (kw && !keywords.includes(kw)) {
      setKeywords((prev) => [...prev, kw]);
    }
    setKeywordInput("");
  }

  function removeKeyword(kw: string) {
    setKeywords((prev) => prev.filter((k) => k !== kw));
  }

  async function saveMeta() {
    setSavingMeta(true);
    setSavedMsg(false);
    const res = await fetch(`/api/projects/${project.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ purpose, keywords }),
    });
    setSavingMeta(false);
    if (res.ok) {
      setSavedMsg(true);
      router.refresh();
      setTimeout(() => setSavedMsg(false), 2000);
    }
  }

  async function handleAddSite(e: React.FormEvent) {
    e.preventDefault();
    if (!siteName.trim() || !siteUrl.trim()) {
      setSiteError("사이트 이름과 URL은 필수입니다.");
      return;
    }
    setAddingSite(true);
    setSiteError(null);
    const res = await fetch("/api/sites", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: siteName,
        url: siteUrl,
        category: siteCategory,
        memo: siteMemo,
        scope: "project",
        projectId: project.id,
      }),
    });
    setAddingSite(false);
    if (!res.ok) {
      setSiteError("사이트 추가에 실패했습니다.");
      return;
    }
    const site: Site = await res.json();
    setProjectSites((prev) => [...prev, site]);
    setSiteName("");
    setSiteUrl("");
    setSiteCategory("");
    setSiteMemo("");
    router.refresh();
  }

  async function handleDeleteSite(id: string) {
    if (!confirm("이 사이트를 삭제할까요?")) return;
    const res = await fetch(`/api/sites/${id}`, { method: "DELETE" });
    if (res.ok) {
      setProjectSites((prev) => prev.filter((s) => s.id !== id));
      router.refresh();
    }
  }

  return (
    <div className="mx-auto max-w-5xl px-6 py-10">
      <Link href="/" className="text-sm text-zinc-500 hover:underline">
        ← 프로젝트 목록
      </Link>
      <h1 className="mt-2 text-2xl font-semibold">{project.name}</h1>

      <section className="mt-6 rounded-lg border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
        <h2 className="font-semibold">목적 &amp; 키워드</h2>
        <div className="mt-3">
          <label className="mb-1 block text-sm font-medium">목적</label>
          <textarea
            value={purpose}
            onChange={(e) => setPurpose(e.target.value)}
            rows={2}
            className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-950"
          />
        </div>
        <div className="mt-3">
          <label className="mb-1 block text-sm font-medium">키워드</label>
          <div className="mb-2 flex flex-wrap gap-1.5">
            {keywords.map((kw) => (
              <span
                key={kw}
                className="flex items-center gap-1 rounded-full bg-zinc-100 px-2 py-0.5 text-xs text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
              >
                {kw}
                <button onClick={() => removeKeyword(kw)} className="text-zinc-400 hover:text-red-600">
                  ×
                </button>
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              value={keywordInput}
              onChange={(e) => setKeywordInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addKeyword();
                }
              }}
              placeholder="키워드 입력 후 Enter"
              className="flex-1 rounded-md border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-950"
            />
            <button
              onClick={addKeyword}
              type="button"
              className="rounded-md border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700"
            >
              추가
            </button>
          </div>
        </div>
        <div className="mt-4 flex items-center gap-3">
          <button
            onClick={saveMeta}
            disabled={savingMeta}
            className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700 disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900"
          >
            {savingMeta ? "저장 중..." : "저장"}
          </button>
          {savedMsg && <span className="text-sm text-green-600">저장됨</span>}
        </div>
      </section>

      <section className="mt-6 rounded-lg border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
        <h2 className="font-semibold">프로젝트 전용 사이트</h2>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          이 프로젝트에서만 탐색할 사이트를 추가합니다. 공통 사이트는 아래 참고 목록을 확인하거나{" "}
          <Link href="/sites" className="underline">
            공통 사이트 관리
          </Link>
          에서 수정하세요.
        </p>

        <form onSubmit={handleAddSite} className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {siteError && <p className="text-sm text-red-600 sm:col-span-2">{siteError}</p>}
          <input
            value={siteName}
            onChange={(e) => setSiteName(e.target.value)}
            placeholder="사이트 이름"
            className="rounded-md border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-950"
          />
          <input
            value={siteUrl}
            onChange={(e) => setSiteUrl(e.target.value)}
            placeholder="https://..."
            className="rounded-md border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-950"
          />
          <input
            value={siteCategory}
            onChange={(e) => setSiteCategory(e.target.value)}
            placeholder="카테고리 (선택)"
            className="rounded-md border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-950"
          />
          <input
            value={siteMemo}
            onChange={(e) => setSiteMemo(e.target.value)}
            placeholder="메모 (선택)"
            className="rounded-md border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-950"
          />
          <div className="sm:col-span-2">
            <button
              type="submit"
              disabled={addingSite}
              className="rounded-md border border-zinc-300 px-4 py-2 text-sm font-medium hover:bg-zinc-50 disabled:opacity-50 dark:border-zinc-700 dark:hover:bg-zinc-800"
            >
              {addingSite ? "추가 중..." : "+ 전용 사이트 추가"}
            </button>
          </div>
        </form>

        {projectSites.length === 0 ? (
          <p className="mt-4 text-sm text-zinc-500">등록된 전용 사이트가 없습니다.</p>
        ) : (
          <ul className="mt-4 divide-y divide-zinc-200 dark:divide-zinc-800">
            {projectSites.map((site) => (
              <li key={site.id} className="flex items-center justify-between gap-4 py-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{site.name}</span>
                    {site.category && (
                      <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
                        {site.category}
                      </span>
                    )}
                  </div>
                  <a
                    href={site.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block truncate text-sm text-zinc-500 hover:underline"
                  >
                    {site.url}
                  </a>
                </div>
                <button
                  onClick={() => handleDeleteSite(site.id)}
                  className="shrink-0 text-xs text-zinc-400 hover:text-red-600"
                >
                  삭제
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="mt-6 rounded-lg border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
        <h2 className="font-semibold">공통 사이트 (참고)</h2>
        {commonSites.length === 0 ? (
          <p className="mt-2 text-sm text-zinc-500">등록된 공통 사이트가 없습니다.</p>
        ) : (
          <ul className="mt-3 space-y-1 text-sm text-zinc-600 dark:text-zinc-400">
            {commonSites.map((site) => (
              <li key={site.id}>
                <a href={site.url} target="_blank" rel="noopener noreferrer" className="hover:underline">
                  {site.name}
                </a>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
