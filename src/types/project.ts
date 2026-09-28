export interface GitHubRepository {
  id: number;
  github_id: number;

  owner: string;
  name: string;
  full_name: string;

  description: string | null;
  language: string | null;

  stars: number;
  forks: number;
  open_issues_count: number;

  default_branch: string | null;
  archived: boolean;
  visibility: string | null;

  html_url: string;

  github_updated_at: string | null;
  github_pushed_at: string | null;
  last_synced_at: string;
}

export interface Project {
  id: number;

  display_name: string | null;
  notes: string | null;
  favorite: boolean;

  created_at: string;
  updated_at: string;

  repository: GitHubRepository;
}

export interface ProjectCreate {
  repository: string;
  display_name?: string;
  notes?: string;
  favorite?: boolean;
}

export interface ProjectUpdate {
  display_name?: string | null;
  notes?: string | null;
  favorite?: boolean;
}

export interface ProjectFormValues {
  repository: string;
}
