// Mirrors apps/api/app/schemas/*.py. Kept manually in sync (no codegen for v1 —
// small enough surface that a generator would be more ceremony than it saves).

export interface TargetCompany {
  name: string;
  checked: boolean;
}

export interface Mission {
  id: number;
  target_companies: TargetCompany[];
  salary_goal: string | null;
  deadline: string | null;
  north_star: string | null;
}

export interface ChecklistItem {
  label: string;
  done: boolean;
}

export interface DailyEntry {
  id: number;
  entry_date: string; // YYYY-MM-DD
  checklist: ChecklistItem[];
  win: string | null;
  learning: string | null;
  blocked_by: string | null;
}

export type KanbanColumn = "ideas" | "todo" | "in_progress" | "done";
export type ProjectStatus = "idea" | "in_progress" | "paused" | "done";

export interface ProjectCard {
  id: number;
  project_id: number;
  column: KanbanColumn;
  title: string;
  description: string | null;
  position: number;
}

export interface Project {
  id: number;
  name: string;
  status: ProjectStatus;
  current_sprint: string | null;
  next_milestone: string | null;
  notes: string | null;
  github_url: string | null;
  cards: ProjectCard[];
}

export interface CareerWin {
  id: number;
  win_date: string;
  title: string;
  description: string | null;
}

export interface ReviewFields {
  what_built: string | null;
  what_learned: string | null;
  what_slowed: string | null;
  what_stop: string | null;
  what_proud: string | null;
  what_next: string | null;
}

export interface WeeklyReview extends ReviewFields {
  id: number;
  week_start: string;
}

export interface MonthlyReview extends ReviewFields {
  id: number;
  month_start: string;
}
