"use client";

import { KeyboardEvent, useMemo, useRef } from "react";

import { MetricCard } from "@/components/dashboard/MetricCard";

import { ProjectCard } from "@/components/projects/ProjectCard";
import { ProjectForm } from "@/components/projects/ProjectForm";
import { ProjectsChart } from "@/components/projects/ProjectsChart";

import { useProjects } from "@/hooks/useProjects";

import { getDashboardSummary } from "@/utils/dashboard";

export default function Home() {
  const {
    allProjects,
    visibleProjects,
    loading,
    error,

    activeView,

    addProject,
    toggleFavorite,
    removeProject,
    syncProject,
    changeView,
    reloadProjects,
  } = useProjects();

  const summary = useMemo(
    () => getDashboardSummary(allProjects),
    [allProjects],
  );

  const isFavoritesView = activeView === "favorites";
  const allTabRef = useRef<HTMLButtonElement>(null);
  const favoritesTabRef = useRef<HTMLButtonElement>(null);

  function handleTabKeyDown(
    event: KeyboardEvent<HTMLButtonElement>,
    nextView: "all" | "favorites",
  ) {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") {
      return;
    }

    event.preventDefault();
    changeView(nextView);

    if (nextView === "all") {
      allTabRef.current?.focus();
    } else {
      favoritesTabRef.current?.focus();
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <h1 className="text-xl font-bold tracking-tight text-slate-950 sm:text-2xl">
            TrackMyRepo
          </h1>

          <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-600">
            Acompanhe seus repositórios públicos do GitHub em um só lugar.
          </p>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
        <section aria-label="Cadastro de repositório">
          <ProjectForm onSubmit={addProject} />
        </section>

        {error && (
          <div
            role="alert"
            className="mt-6 flex flex-col gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3.5 text-sm text-red-800 sm:flex-row sm:items-center sm:justify-between"
          >
            <span>{error}</span>

            <button
              type="button"
              onClick={reloadProjects}
              className="self-start rounded-lg px-3 py-1.5 font-semibold text-red-800 transition-colors hover:bg-red-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600 focus-visible:ring-offset-2 focus-visible:ring-offset-red-50 sm:self-auto"
            >
              Tentar novamente
            </button>
          </div>
        )}

        <section
          aria-label="Resumo dos projetos"
          className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4"
        >
          <MetricCard
            title="Projetos monitorados"
            value={
              loading && allProjects.length === 0
                ? "—"
                : String(summary.monitoredProjects)
            }
          />

          <MetricCard
            title="Favoritos"
            value={
              loading && allProjects.length === 0
                ? "—"
                : String(summary.favoriteProjects)
            }
          />

          <MetricCard
            title="Ativos nos últimos 30 dias"
            value={
              loading && allProjects.length === 0
                ? "—"
                : String(summary.activeProjects)
            }
          />

          <MetricCard
            title="Linguagens diferentes"
            value={
              loading && allProjects.length === 0
                ? "—"
                : String(summary.differentLanguages)
            }
          />
        </section>

        {allProjects.length > 0 && (
          <section
            aria-labelledby="languages-heading"
            className="mt-6 rounded-xl border border-slate-200 bg-white p-5 sm:p-6"
          >
            <div className="mb-4">
              <h2
                id="languages-heading"
                className="text-base font-semibold text-slate-950"
              >
                Distribuição por linguagem
              </h2>
              <p className="mt-1 text-sm leading-6 text-slate-600">
                Linguagem principal de todos os projetos monitorados.
              </p>
            </div>

            <ProjectsChart projects={allProjects} />
          </section>
        )}

        <section className="mt-10" aria-labelledby="projects-heading">
          <div className="flex flex-col justify-between gap-4 border-b border-slate-200 sm:flex-row sm:items-end">
            <div>
              <h2
                id="projects-heading"
                className="text-lg font-semibold tracking-tight text-slate-950"
              >
                Projetos monitorados
              </h2>

              <p className="mt-1 text-sm leading-6 text-slate-600">
                Consulte os dados sincronizados e gerencie sua lista.
              </p>
            </div>

            <div
              role="tablist"
              aria-label="Filtrar projetos"
              className="flex gap-6"
            >
              <button
                ref={allTabRef}
                id="tab-all"
                type="button"
                role="tab"
                aria-selected={activeView === "all"}
                aria-controls="projects-panel"
                tabIndex={activeView === "all" ? 0 : -1}
                onClick={() => changeView("all")}
                onKeyDown={(event) => handleTabKeyDown(event, "favorites")}
                className={`relative -mb-px inline-flex min-h-11 items-center border-b-2 px-0.5 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 ${
                  activeView === "all"
                    ? "border-blue-600 text-blue-700"
                    : "border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-800"
                }`}
              >
                Todos
              </button>

              <button
                ref={favoritesTabRef}
                id="tab-favorites"
                type="button"
                role="tab"
                aria-selected={activeView === "favorites"}
                aria-controls="projects-panel"
                tabIndex={activeView === "favorites" ? 0 : -1}
                onClick={() => changeView("favorites")}
                onKeyDown={(event) => handleTabKeyDown(event, "all")}
                className={`relative -mb-px inline-flex min-h-11 items-center border-b-2 px-0.5 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 ${
                  activeView === "favorites"
                    ? "border-blue-600 text-blue-700"
                    : "border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-800"
                }`}
              >
                Favoritos
              </button>
            </div>
          </div>

          <div
            id="projects-panel"
            role="tabpanel"
            aria-labelledby={isFavoritesView ? "tab-favorites" : "tab-all"}
            aria-busy={loading}
            className="pt-5"
          >
            {loading ? (
              <div
                className="grid gap-4 md:grid-cols-2"
                aria-live="polite"
                aria-label="Carregando projetos"
              >
                <span className="sr-only">Carregando projetos...</span>
                {[0, 1, 2, 3].map((item) => (
                  <div
                    key={item}
                    aria-hidden="true"
                    className="h-64 animate-pulse rounded-xl border border-slate-200 bg-white p-6"
                  >
                    <div className="h-5 w-2/5 rounded bg-slate-200" />
                    <div className="mt-3 h-3 w-1/3 rounded bg-slate-100" />
                    <div className="mt-8 h-3 w-full rounded bg-slate-100" />
                    <div className="mt-2 h-3 w-4/5 rounded bg-slate-100" />
                    <div className="mt-8 h-14 rounded bg-slate-100" />
                  </div>
                ))}
              </div>
            ) : error && visibleProjects.length === 0 ? (
              <div className="rounded-xl border border-red-200 bg-red-50 px-6 py-10 text-center">
                <h3 className="font-semibold text-red-950">
                  Não foi possível carregar os projetos.
                </h3>
                <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-red-800">
                  Verifique se a API está disponível e tente novamente pelo aviso
                  acima.
                </p>
              </div>
            ) : visibleProjects.length === 0 ? (
              <div className="rounded-xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center">
                <h3 className="font-semibold text-slate-950">
                  {isFavoritesView
                    ? "Nenhum projeto favoritado ainda."
                    : "Nenhum projeto monitorado ainda."}
                </h3>
                <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-600">
                  {isFavoritesView
                    ? "Marque projetos com a estrela para encontrá-los rapidamente nesta aba."
                    : "Adicione um repositório público no formulário acima para começar."}
                </p>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {visibleProjects.map((project) => (
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
          </div>
        </section>
      </div>
    </main>
  );
}
