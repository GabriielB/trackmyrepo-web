"use client";

import { Project } from "@/types/project";

import { formatDate, formatNumber } from "@/utils/format";

interface ProjectCardProps {
  project: Project;

  onFavorite: () => void;
  onRefresh: () => void;
  onDelete: () => void;
}

export function ProjectCard({
  project,
  onFavorite,
  onRefresh,
  onDelete,
}: ProjectCardProps) {
  const repository = project.repository;

  function handleDelete() {
    const confirmed = window.confirm(`Deseja remover ${repository.full_name}?`);

    if (confirmed) {
      onDelete();
    }
  }

  return (
    <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">
            {project.display_name ?? repository.name}
          </h3>

          <a
            href={repository.html_url}
            target="_blank"
            rel="noreferrer"
            className="text-sm text-blue-600 hover:underline"
          >
            {repository.full_name}
          </a>
        </div>

        <button
          type="button"
          onClick={onFavorite}
          title={
            project.favorite
              ? "Remover dos favoritos"
              : "Adicionar aos favoritos"
          }
          className="text-2xl text-yellow-500"
        >
          {project.favorite ? "★" : "☆"}
        </button>
      </div>

      {repository.description && (
        <p className="mt-4 text-sm leading-6 text-slate-600">
          {repository.description}
        </p>
      )}

      <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-sm text-slate-600">
        <span>{repository.language ?? "Sem linguagem principal"}</span>

        <span>★ {formatNumber(repository.stars)}</span>

        <span>Forks {formatNumber(repository.forks)}</span>

        <span>Issues {formatNumber(repository.open_issues_count)}</span>
      </div>

      <div className="mt-4 text-xs text-slate-400">
        Última sincronização: {formatDate(repository.last_synced_at)}
      </div>

      <div className="mt-5 flex gap-2 border-t border-slate-100 pt-4">
        <button
          type="button"
          onClick={onRefresh}
          className="rounded-md border border-slate-300 px-3 py-2 text-sm transition hover:bg-slate-50"
        >
          Atualizar
        </button>

        <button
          type="button"
          onClick={handleDelete}
          className="rounded-md border border-red-200 px-3 py-2 text-sm text-red-600 transition hover:bg-red-50"
        >
          Remover
        </button>
      </div>
    </article>
  );
}
