"use client";

import { useCallback, useEffect, useState } from "react";

import {
  createProject,
  deleteProject,
  getProjects,
  refreshProject,
  updateProject,
} from "@/services/projects";

import { Project } from "@/types/project";

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState<string | null>(null);

  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);

  const loadProjects = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await getProjects(showOnlyFavorites ? true : undefined);

      setProjects(data);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Não foi possível carregar os projetos.",
      );
    } finally {
      setLoading(false);
    }
  }, [showOnlyFavorites]);

  useEffect(() => {
    loadProjects();
  }, [loadProjects]);

  async function addProject(repository: string) {
    try {
      setError(null);

      await createProject({
        repository,
      });

      await loadProjects();
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Não foi possível adicionar o projeto.";

      setError(message);

      throw error;
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

  function changeFavoriteFilter(enabled: boolean) {
    setShowOnlyFavorites(enabled);
  }

  return {
    projects,
    loading,
    error,

    showOnlyFavorites,

    addProject,
    toggleFavorite,
    removeProject,
    syncProject,
    changeFavoriteFilter,
  };
}
