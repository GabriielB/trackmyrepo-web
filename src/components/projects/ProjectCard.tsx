"use client";

import { useState } from "react";

import { Project } from "@/types/project";

import { formatDate, formatNumber, formatRelativeDate } from "@/utils/format";

interface ProjectCardProps {
  project: Project;

  onFavorite: () => Promise<void>;
  onRefresh: () => Promise<void>;
  onDelete: () => Promise<void>;
}

type PendingAction = "favorite" | "refresh" | "delete" | null;

export function ProjectCard({
  project,
  onFavorite,
  onRefresh,
  onDelete,
}: ProjectCardProps) {
  const repository = project.repository;
  const [pendingAction, setPendingAction] = useState<PendingAction>(null);

  async function runAction(
    action: Exclude<PendingAction, null>,
    callback: () => Promise<void>,
  ) {
    setPendingAction(action);

    try {
      await callback();
    } finally {
      setPendingAction(null);
    }
  }

  async function handleDelete() {
    const confirmed = window.confirm(`Deseja remover ${repository.full_name}?`);

    if (confirmed) {
      await runAction("delete", onDelete);
    }
  }

  return (
    <article className="flex h-full flex-col rounded-xl border border-slate-200 bg-white p-5 transition-colors hover:border-slate-300 sm:p-6">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="truncate text-lg font-semibold tracking-tight text-slate-950">
              {project.display_name ?? repository.name}
            </h3>

            {repository.archived && (
              <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-800">
                Arquivado
              </span>
            )}
          </div>

          <a
            href={repository.html_url}
            target="_blank"
            rel="noreferrer"
            aria-label={`Abrir ${repository.full_name} no GitHub em uma nova aba`}
            className="mt-1 block max-w-full truncate text-sm font-medium text-blue-700 hover:text-blue-800 hover:underline focus-visible:rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
          >
            {repository.full_name}
          </a>
        </div>

        <button
          type="button"
          onClick={() => runAction("favorite", onFavorite)}
          disabled={pendingAction !== null}
          aria-pressed={project.favorite}
          aria-label={
            project.favorite
              ? "Remover dos favoritos"
              : "Adicionar aos favoritos"
          }
          title={
            project.favorite
              ? "Remover dos favoritos"
              : "Adicionar aos favoritos"
          }
          className={`inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-lg px-3 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 disabled:opacity-60 ${
            project.favorite
              ? "bg-amber-100 text-amber-900 hover:bg-amber-200"
              : "border border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50 hover:text-slate-950"
          }`}
        >
          <span className="text-lg leading-none" aria-hidden="true">
            {project.favorite ? "★" : "☆"}
          </span>
          <span className="hidden sm:inline">
            {pendingAction === "favorite"
              ? "Salvando..."
              : project.favorite
                ? "Favorito"
                : "Favoritar"}
          </span>
        </button>
      </div>

      <p className="mt-4 line-clamp-3 text-sm leading-6 text-slate-600">
        {repository.description ?? "Este repositório não possui descrição."}
      </p>

      <div className="mt-4 flex flex-wrap gap-2">
        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700">
          {repository.language ?? "Linguagem não definida"}
        </span>
      </div>

      <dl className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-sm">
        <div className="flex items-baseline gap-1.5">
          <dt className="text-slate-500">Stars</dt>
          <dd className="font-semibold tabular-nums text-slate-950">
            {formatNumber(repository.stars)}
          </dd>
        </div>

        <div className="flex items-baseline gap-1.5">
          <dt className="text-slate-500">Forks</dt>
          <dd className="font-semibold tabular-nums text-slate-950">
            {formatNumber(repository.forks)}
          </dd>
        </div>

        <div className="flex items-baseline gap-1.5">
          <dt className="text-slate-500">Issues abertas</dt>
          <dd className="font-semibold tabular-nums text-slate-950">
            {formatNumber(repository.open_issues_count)}
          </dd>
        </div>
      </dl>

      <dl className="mt-4 grid gap-3 text-xs text-slate-500 sm:grid-cols-2">
        <div>
          <dt>Último push</dt>
          <dd
            className="mt-1 font-medium text-slate-700"
            title={formatDate(repository.github_pushed_at)}
          >
            {formatRelativeDate(repository.github_pushed_at)}
          </dd>
        </div>

        <div>
          <dt>Última sincronização</dt>
          <dd className="mt-1 font-medium text-slate-700">
            {formatDate(repository.last_synced_at)}
          </dd>
        </div>
      </dl>

      <div className="mt-auto flex gap-2 pt-5">
        <button
          type="button"
          onClick={() => runAction("refresh", onRefresh)}
          disabled={pendingAction !== null}
          className="inline-flex h-10 items-center justify-center rounded-lg border border-slate-300 px-3.5 text-sm font-medium text-slate-700 transition-colors hover:border-slate-400 hover:bg-slate-50 hover:text-slate-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 disabled:opacity-60"
        >
          {pendingAction === "refresh" ? "Atualizando..." : "Atualizar dados"}
        </button>

        <button
          type="button"
          onClick={handleDelete}
          disabled={pendingAction !== null}
          className="inline-flex h-10 items-center justify-center rounded-lg px-3.5 text-sm font-medium text-red-700 transition-colors hover:bg-red-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600 focus-visible:ring-offset-2 disabled:opacity-60"
        >
          {pendingAction === "delete" ? "Removendo..." : "Remover"}
        </button>
      </div>
    </article>
  );
}
