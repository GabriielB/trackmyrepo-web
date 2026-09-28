"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import {
  createProject,
  deleteProject,
  getProjects,
  refreshProject,
  updateProject,
} from "@/services/projects";

import { Project } from "@/types/project";

export type ProjectView = "all" | "favorites";

async function fetchProjectLists(view: ProjectView) {
  const [allProjects, favoriteProjects] = await Promise.all([
    getProjects(),
    view === "favorites" ? getProjects(true) : Promise.resolve(null),
  ]);

  return {
    allProjects,
    visibleProjects: favoriteProjects ?? allProjects,
  };
}

export function useProjects() {
  const [allProjects, setAllProjects] = useState<Project[]>([]);
  const [visibleProjects, setVisibleProjects] = useState<Project[]>([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState<string | null>(null);

  const [activeView, setActiveView] = useState<ProjectView>("all");
  const requestId = useRef(0);

  const loadProjects = useCallback(async () => {
    const currentRequestId = requestId.current + 1;
    requestId.current = currentRequestId;

    try {
      setError(null);

      const {
        allProjects: fetchedAllProjects,
        visibleProjects: fetchedVisibleProjects,
      } = await fetchProjectLists(activeView);

      if (currentRequestId !== requestId.current) {
        return;
      }

      setAllProjects(fetchedAllProjects);
      setVisibleProjects(fetchedVisibleProjects);
    } catch (error) {
      if (currentRequestId !== requestId.current) {
        return;
      }

      setError(
        error instanceof Error
          ? error.message
          : "Não foi possível carregar os projetos.",
      );
    } finally {
      if (currentRequestId === requestId.current) {
        setLoading(false);
      }
    }
  }, [activeView]);

  useEffect(() => {
    const currentRequestId = requestId.current + 1;
    requestId.current = currentRequestId;
    let cancelled = false;

    void fetchProjectLists(activeView)
      .then(
        ({
          allProjects: fetchedAllProjects,
          visibleProjects: fetchedVisibleProjects,
        }) => {
          if (cancelled || currentRequestId !== requestId.current) {
            return;
          }

          setAllProjects(fetchedAllProjects);
          setVisibleProjects(fetchedVisibleProjects);
        },
      )
      .catch((error: unknown) => {
        if (cancelled || currentRequestId !== requestId.current) {
          return;
        }

        setError(
          error instanceof Error
            ? error.message
            : "Não foi possível carregar os projetos.",
        );
      })
      .finally(() => {
        if (!cancelled && currentRequestId === requestId.current) {
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [activeView]);

  async function addProject(repository: string): Promise<boolean> {
    try {
      setError(null);

      await createProject({
        repository,
      });

      await loadProjects();

      return true;
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Não foi possível adicionar o projeto.";

      setError(message);

      return false;
    }
  }

  async function toggleFavorite(project: Project) {
    try {
      setError(null);

      await updateProject(project.id, {
        favorite: !project.favorite,
      });

      await loadProjects();
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Não foi possível atualizar o projeto.",
      );
    }
  }

  async function removeProject(project: Project) {
    try {
      setError(null);

      await deleteProject(project.id);

      await loadProjects();
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Não foi possível remover o projeto.",
      );
    }
  }

  async function syncProject(project: Project) {
    try {
      setError(null);

      await refreshProject(project.id);

      await loadProjects();
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Não foi possível atualizar os dados do GitHub.",
      );
    }
  }

  function changeView(view: ProjectView) {
    if (view !== activeView) {
      setError(null);
      setLoading(true);
      setActiveView(view);
    }
  }

  async function reloadProjects() {
    setLoading(true);
    await loadProjects();
  }

  return {
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
  };
}
