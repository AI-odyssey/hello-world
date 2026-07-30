"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { Project } from "@/lib/types";

type ProjectWithCounts = Project & { projectSiteCount: number };

export default function DashboardHome({
  initialProjects,
  commonSiteCount,
}: {
  initialProjects: ProjectWithCounts[];
  commonSiteCount: number;
}) {
  const router = useRouter();
  const [projects, setProjects] = useState(initialProjects);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [purpose, setPurpose] = useState("");
  const [keywordsInput, setKeywordsInput] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) {
      setError("프로젝트 이름을 입력해주세요.");
      return;
    }
    setSubmitting(true);
    setError(null);
    const keywords = keywordsInput
      .split(",")
      .map((k) => k.trim())
      .filter(Boolean);
    const res = await fetch("/api/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, purpose, keywords }),
    });
    setSubmitting(false);
    if (!res.ok) {
      setError("프로젝트 생성에 실패했습니다.");
      return;
    }
    const project: Project = await res.json();
    setProjects((prev) => [...prev, { ...project, projectSiteCount: 0 }]);
    setName("");
    setPurpose("");
    setKeywordsInput("");
    setShowForm(false);
    router.refresh();
  }

  async function handleDelete(id: string) {
    if (!confirm("이 프로젝트를 삭제할까요? 전용 사이트도 함께 삭제됩니다.")) return;
    const res = await fetch(`/api/projects/${id}`, { method: "DELETE" });
    if (res.ok) {
      setProjects((prev) => prev.filter((p) => p.id !== id));
      router.refresh();
    }
  }

  return (
    <div className="mx-auto max-w-5xl px-6 py-10">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">프로젝트</h1>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            프로젝트별로 목적과 키워드를 할당하고, 모니터링 대상 사이트를 관리합니다. 모든 프로젝트는
            공통 사이트 {commonSiteCount}개를 기본으로 공유합니다.
          </p>
        </div>
        <button
          onClick={() => setShowForm((v) => !v)}
          className="shrink-0 rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
        >
          {showForm ? "취소" : "+ 새 프로젝트"}
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleCreate}
          className="mb-8 space-y-4 rounded-lg border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900"
        >
          {error && <p className="text-sm text-red-600">{error}</p>}
          <div>
            <label className="mb-1 block text-sm font-medium">프로젝트 이름</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-950"
              placeholder="예: A 의원실 모니터링"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">목적</label>
            <textarea
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-950"
              placeholder="이 프로젝트의 모니터링 목적을 적어주세요"
              rows={2}
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">키워드 (쉼표로 구분)</label>
            <input
              value={keywordsInput}
              onChange={(e) => setKeywordsInput(e.target.value)}
              className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-950"
              placeholder="예: 국회의원, 상임위, 법안"
            />
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700 disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900"
          >
            {submitting ? "생성 중..." : "프로젝트 생성"}
          </button>
        </form>
      )}

      {projects.length === 0 ? (
        <div className="rounded-lg border border-dashed border-zinc-300 p-10 text-center text-sm text-zinc-500 dark:border-zinc-700">
          아직 프로젝트가 없습니다. &ldquo;+ 새 프로젝트&rdquo;로 첫 프로젝트를 만들어보세요.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {projects.map((project) => (
            <div
              key={project.id}
              className="flex flex-col justify-between rounded-lg border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900"
            >
              <div>
                <div className="flex items-start justify-between">
                  <h2 className="font-semibold">{project.name}</h2>
                  <button
                    onClick={() => handleDelete(project.id)}
                    className="text-xs text-zinc-400 hover:text-red-600"
                  >
                    삭제
                  </button>
                </div>
                {project.purpose && (
                  <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">{project.purpose}</p>
                )}
                {project.keywords.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {project.keywords.map((kw) => (
                      <span
                        key={kw}
                        className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
                      >
                        {kw}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <div className="mt-4 flex items-center justify-between border-t border-zinc-100 pt-3 text-xs text-zinc-500 dark:border-zinc-800">
                <span>
                  대상 사이트 {commonSiteCount + project.projectSiteCount}개 (공통 {commonSiteCount} +
                  전용 {project.projectSiteCount})
                </span>
                <Link href={`/projects/${project.id}`} className="font-medium text-zinc-900 hover:underline dark:text-zinc-100">
                  자세히 보기 →
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
