"use client";

import { use, useEffect, useState } from "react";

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
import type { ProjectStatus } from "@/lib/types";

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
  const debouncedUpdate = useDebounced((patch: Record<string, unknown>) => updateProject.mutate(patch));

  const [nextMilestone, setNextMilestone] = useState("");
  const [currentSprint, setCurrentSprint] = useState("");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (!project) return;
    setNextMilestone(project.next_milestone ?? "");
    setCurrentSprint(project.current_sprint ?? "");
    setNotes(project.notes ?? "");
  }, [project]);

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

      <KanbanBoard project={project} />
    </div>
  );
}
