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

// --- Slice 2: Learning trackers ---

export interface SystemDesignTopic {
  id: number;
  topic: string;
  read: boolean;
  diagram: boolean;
  notes: boolean;
  implemented: boolean;
}

export interface DsaPattern {
  id: number;
  pattern: string;
  category: string | null;
  understanding: number; // 0-5 stars
  confidence: number; // 0-5 stars
  needs_revision: boolean;
  notes: string | null;
}

export type AiTopicStatus = "not_started" | "in_progress" | "done";

export interface AiTopic {
  id: number;
  topic: string;
  status: AiTopicStatus;
  notes: string | null;
  mini_project: string | null;
}

export type ReadingStatus = "to_read" | "reading" | "done";

export interface ReadingListItem {
  id: number;
  title: string;
  source: string | null;
  status: ReadingStatus;
  notes: string | null;
}

// --- Slice 3: Content tracker + Notes ---

export type ContentStage = "idea" | "writing" | "scheduled" | "posted";
export type ContentType = "tweet" | "linkedin" | "blog" | "readme";

export interface ContentIdea {
  id: number;
  idea: string;
  stage: ContentStage;
  content_type: ContentType;
  notes: string | null;
  repurposed_from_id: number | null;
}

export interface NotePage {
  id: number;
  topic: string;
  content: string | null;
  tags: string[];
}

// --- Slice 4: Career / Applications ---

export type CompanyStatus = "researching" | "target" | "applied" | "interviewing" | "offer" | "rejected";
export type ApplicationStatus = "applied" | "screening" | "interviewing" | "offer" | "rejected" | "withdrawn";

export interface Interview {
  id: number;
  application_id: number;
  round: string;
  interview_date: string | null;
  notes: string | null;
  outcome: string | null;
}

export interface Application {
  id: number;
  company_id: number;
  role: string;
  applied_date: string | null;
  status: ApplicationStatus;
  notes: string | null;
  interviews: Interview[];
}

export interface Company {
  id: number;
  name: string;
  status: CompanyStatus;
  url: string | null;
  notes: string | null;
  applications: Application[];
}

export interface ResumeVersion {
  id: number;
  label: string;
  file_url: string | null;
  notes: string | null;
}
