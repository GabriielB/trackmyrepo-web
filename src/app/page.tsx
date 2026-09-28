"use client";

import { useMemo } from "react";

import { MetricCard } from "@/components/dashboard/MetricCard";

import { ProjectCard } from "@/components/projects/ProjectCard";
import { ProjectForm } from "@/components/projects/ProjectForm";
import { ProjectsChart } from "@/components/projects/ProjectsChart";

import { useProjects } from "@/hooks/useProjects";

import { formatNumber } from "@/utils/format";

export default function Home() {
  const {
    projects,
    loading,
    error,

    showOnlyFavorites,

    addProject,
    toggleFavorite,
    removeProject,
    syncProject,
    changeFavoriteFilter,
  } = useProjects();

  const totalStars = useMemo(
    () =>
      projects.reduce((total, project) => total + project.repository.stars, 0),
    [projects],
  );

  const totalForks = useMemo(
    () =>
      projects.reduce((total, project) => total + project.repository.forks, 0),
    [projects],
  );

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <header className="mb-10">
          <h1 className="text-3xl font-bold">TrackMyRepo</h1>

          <p className="mt-2 text-slate-600">
            Acompanhe repositórios públicos do GitHub em um único dashboard.
          </p>
        </header>

        <section className="mb-8">
          <ProjectForm onSubmit={addProject} />
        </section>

        {error && (
          <div className="mb-8 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-700">
            {error}
          </div>
        )}

        <section className="mb-8 grid gap-4 sm:grid-cols-3">
          <MetricCard title="Projetos" value={String(projects.length)} />

          <MetricCard title="Total de stars" value={formatNumber(totalStars)} />

          <MetricCard title="Total de forks" value={formatNumber(totalForks)} />
        </section>

        {projects.length > 0 && (
          <section className="mb-8 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-6 text-xl font-semibold">Stars por projeto</h2>

            <ProjectsChart projects={projects} />
          </section>
        )}

        <section>
          <div className="mb-4 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
            <div>
              <h2 className="text-xl font-semibold">Projetos monitorados</h2>

              <p className="text-sm text-slate-500">
                Dados sincronizados com a API do GitHub.
              </p>
            </div>

            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={showOnlyFavorites}
                onChange={(event) => changeFavoriteFilter(event.target.checked)}
              />
              Apenas favoritos
            </label>
          </div>

          {loading ? (
            <p className="text-slate-500">Carregando projetos...</p>
          ) : projects.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center text-slate-500">
              Nenhum projeto encontrado.
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {projects.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  onFavorite={() => toggleFavorite(project)}
                  onRefresh={() => syncProject(project)}
                  onDelete={() => removeProject(project)}
                />
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
