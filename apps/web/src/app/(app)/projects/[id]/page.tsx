"use client";

import { use, useState } from "react";

import { KanbanBoard } from "@/components/kanban-board";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useProject, useUpdateProject } from "@/hooks/use-projects";
import type { Project, ProjectStatus } from "@/lib/types";

function useDebounced<T extends (...args: never[]) => void>(fn: T, delay = 600) {
  const [timer, setTimer] = useState<ReturnType<typeof setTimeout> | null>(null);
  return (...args: Parameters<T>) => {
    if (timer) clearTimeout(timer);
    setTimer(setTimeout(() => fn(...args), delay));
  };
}

export default function ProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const projectId = Number(id);
  const { data: project } = useProject(projectId);
  const updateProject = useUpdateProject(projectId);

  if (!project) return null;

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="font-heading text-2xl font-semibold">{project.name}</h1>
        <Select
          value={project.status}
          onValueChange={(v) => updateProject.mutate({ status: v as ProjectStatus })}
        >
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="idea">Idea</SelectItem>
            <SelectItem value="in_progress">In Progress</SelectItem>
            <SelectItem value="paused">Paused</SelectItem>
            <SelectItem value="done">Done</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <ProjectDetailsForm key={project.id} project={project} onSave={(patch) => updateProject.mutate(patch)} />

      <KanbanBoard project={project} />
    </div>
  );
}

/** Keyed by project.id in the parent, so it remounts (and re-runs its lazy
 * initializers) when the loaded project changes — no effect needed. */
function ProjectDetailsForm({
  project,
  onSave,
}: {
  project: Project;
  onSave: (patch: Partial<Project>) => void;
}) {
  const debouncedUpdate = useDebounced((patch: Record<string, unknown>) => onSave(patch));

  const [nextMilestone, setNextMilestone] = useState(project.next_milestone ?? "");
  const [currentSprint, setCurrentSprint] = useState(project.current_sprint ?? "");
  const [notes, setNotes] = useState(project.notes ?? "");

  return (
    <Card>
      <CardContent className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium">Current Sprint</label>
          <Textarea
            value={currentSprint}
            onChange={(e) => {
              setCurrentSprint(e.target.value);
              debouncedUpdate({ current_sprint: e.target.value });
            }}
            rows={2}
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium">Next Milestone</label>
          <Input
            value={nextMilestone}
            onChange={(e) => {
              setNextMilestone(e.target.value);
              debouncedUpdate({ next_milestone: e.target.value });
            }}
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium">Notes / Ideas</label>
          <Textarea
            value={notes}
            onChange={(e) => {
              setNotes(e.target.value);
              debouncedUpdate({ notes: e.target.value });
            }}
            rows={3}
          />
        </div>
      </CardContent>
    </Card>
  );
}
