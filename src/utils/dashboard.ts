import type { Project } from "@/types/project";

const DAY_IN_MILLISECONDS = 24 * 60 * 60 * 1000;

export interface DashboardSummary {
  monitoredProjects: number;
  favoriteProjects: number;
  activeProjects: number;
  differentLanguages: number;
}

export interface LanguageDistributionItem {
  language: string;
  count: number;
}

function getDaysSince(value: string, now: Date): number | null {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return Math.max(0, (now.getTime() - date.getTime()) / DAY_IN_MILLISECONDS);
}

export function getDashboardSummary(
  projects: Project[],
  now = new Date(),
): DashboardSummary {
  const languages = new Set(
    projects
      .map((project) => project.repository.language)
      .filter((language): language is string => Boolean(language)),
  );

  return {
    monitoredProjects: projects.length,
    favoriteProjects: projects.filter((project) => project.favorite).length,
    activeProjects: projects.filter((project) => {
      const pushedAt = project.repository.github_pushed_at;

      if (!pushedAt) {
        return false;
      }

      const daysSincePush = getDaysSince(pushedAt, now);

      return daysSincePush !== null && daysSincePush <= 30;
    }).length,
    differentLanguages: languages.size,
  };
}

export function getLanguageDistribution(
  projects: Project[],
): LanguageDistributionItem[] {
  const totals = projects.reduce<Map<string, number>>((distribution, project) => {
    const language = project.repository.language ?? "Não definida";

    distribution.set(language, (distribution.get(language) ?? 0) + 1);

    return distribution;
  }, new Map());

  const sortedLanguages = Array.from(totals, ([name, value]) => ({
    language: name,
    count: value,
  })).sort((first, second) => second.count - first.count);

  return sortedLanguages;
}
