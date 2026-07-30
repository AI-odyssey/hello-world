"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { Site } from "@/lib/types";

export default function CommonSitesManager({ initialSites }: { initialSites: Site[] }) {
  const router = useRouter();
  const [sites, setSites] = useState(initialSites);
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [category, setCategory] = useState("");
  const [memo, setMemo] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !url.trim()) {
      setError("사이트 이름과 URL은 필수입니다.");
      return;
    }
    setSubmitting(true);
    setError(null);
    const res = await fetch("/api/sites", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, url, category, memo, scope: "common" }),
    });
    setSubmitting(false);
    if (!res.ok) {
      setError("사이트 추가에 실패했습니다.");
      return;
    }
    const site: Site = await res.json();
    setSites((prev) => [...prev, site]);
    setName("");
    setUrl("");
    setCategory("");
    setMemo("");
    router.refresh();
  }

  async function handleDelete(id: string) {
    if (!confirm("이 사이트를 삭제할까요?")) return;
    const res = await fetch(`/api/sites/${id}`, { method: "DELETE" });
    if (res.ok) {
      setSites((prev) => prev.filter((s) => s.id !== id));
      router.refresh();
    }
  }

  return (
    <div className="mx-auto max-w-5xl px-6 py-10">
      <h1 className="text-2xl font-semibold">공통 사이트 관리</h1>
      <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
        모든 프로젝트가 공통으로 모니터링하는 대상 사이트입니다. 프로젝트별 전용 사이트는 각 프로젝트
        상세 페이지에서 관리합니다.
      </p>

      <form
        onSubmit={handleCreate}
        className="mt-6 grid grid-cols-1 gap-3 rounded-lg border border-zinc-200 bg-white p-5 sm:grid-cols-2 dark:border-zinc-800 dark:bg-zinc-900"
      >
        {error && <p className="text-sm text-red-600 sm:col-span-2">{error}</p>}
        <div>
          <label className="mb-1 block text-sm font-medium">사이트 이름</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-950"
            placeholder="예: 열린국회정보"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">URL</label>
          <input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-950"
            placeholder="https://..."
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">카테고리</label>
          <input
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-950"
            placeholder="예: 공공 API, 뉴스"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">메모</label>
          <input
            value={memo}
            onChange={(e) => setMemo(e.target.value)}
            className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-950"
            placeholder="선택 입력"
          />
        </div>
        <div className="sm:col-span-2">
          <button
            type="submit"
            disabled={submitting}
            className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700 disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900"
          >
            {submitting ? "추가 중..." : "+ 사이트 추가"}
          </button>
        </div>
      </form>

      {sites.length === 0 ? (
        <div className="mt-6 rounded-lg border border-dashed border-zinc-300 p-10 text-center text-sm text-zinc-500 dark:border-zinc-700">
          아직 등록된 공통 사이트가 없습니다.
        </div>
      ) : (
        <ul className="mt-6 divide-y divide-zinc-200 rounded-lg border border-zinc-200 bg-white dark:divide-zinc-800 dark:border-zinc-800 dark:bg-zinc-900">
          {sites.map((site) => (
            <li key={site.id} className="flex items-center justify-between gap-4 p-4">
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
                {site.memo && <p className="mt-0.5 text-xs text-zinc-400">{site.memo}</p>}
              </div>
              <button
                onClick={() => handleDelete(site.id)}
                className="shrink-0 text-xs text-zinc-400 hover:text-red-600"
              >
                삭제
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
