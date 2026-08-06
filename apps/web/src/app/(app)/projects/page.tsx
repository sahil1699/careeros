"use client";

import Link from "next/link";
import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useCreateProject, useProjects } from "@/hooks/use-projects";
import type { ProjectStatus } from "@/lib/types";

const STATUS_VARIANT: Record<ProjectStatus, "default" | "secondary" | "outline"> = {
  idea: "outline",
  in_progress: "default",
  paused: "secondary",
  done: "secondary",
};

export default function ProjectsPage() {
  const { data: projects } = useProjects();
  const createProject = useCreateProject();
  const [newName, setNewName] = useState("");

  function addProject() {
    if (!newName.trim()) return;
    createProject.mutate({ name: newName.trim() });
    setNewName("");
  }

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-6">
      <h1 className="font-heading text-2xl font-semibold">💻 Projects</h1>

      <div className="flex gap-2">
        <Input
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addProject()}
          placeholder="New project name…"
        />
        <Button onClick={addProject} disabled={createProject.isPending}>
          Add
        </Button>
      </div>

      <div className="flex flex-col gap-3">
        {projects?.map((p) => (
          <Link key={p.id} href={`/projects/${p.id}`}>
            <Card className="hover:bg-accent/50 transition-colors">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{p.name}</span>
                  <Badge variant={STATUS_VARIANT[p.status]}>{p.status.replace("_", " ")}</Badge>
                </CardTitle>
              </CardHeader>
              {p.next_milestone && (
                <CardContent className="text-muted-foreground text-sm">
                  Next: {p.next_milestone}
                </CardContent>
              )}
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
