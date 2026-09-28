import axios from "axios";

import { api } from "@/lib/api";

import { Project, ProjectCreate, ProjectUpdate } from "@/types/project";

function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const detail = error.response?.data?.detail;

    if (typeof detail === "string") {
      return detail;
    }

    if (error.code === "ECONNABORTED") {
      return "A API demorou muito para responder.";
    }

    if (!error.response) {
      return "Não foi possível conectar à API.";
    }
  }

  return "Ocorreu um erro inesperado.";
}

export async function getProjects(favorite?: boolean): Promise<Project[]> {
  try {
    const response = await api.get<Project[]>("/projects", {
      params: favorite === undefined ? undefined : { favorite },
    });

    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
}

export async function createProject(data: ProjectCreate): Promise<Project> {
  try {
    const response = await api.post<Project>("/projects", data);

    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
}

export async function updateProject(
  projectId: number,
  data: ProjectUpdate,
): Promise<Project> {
  try {
    const response = await api.put<Project>(`/projects/${projectId}`, data);

    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
}

export async function deleteProject(projectId: number): Promise<void> {
  try {
    await api.delete(`/projects/${projectId}`);
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
}

export async function refreshProject(projectId: number): Promise<Project> {
  try {
    const response = await api.post<Project>(`/projects/${projectId}/refresh`);

    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
}
