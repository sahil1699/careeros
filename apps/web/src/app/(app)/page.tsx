"use client";

import Link from "next/link";

import { Checklist } from "@/components/checklist";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCareerWins } from "@/hooks/use-career-wins";
import { useTodayEntry, useUpdateDailyEntry } from "@/hooks/use-daily";
import { useMission } from "@/hooks/use-mission";
import { useProjects } from "@/hooks/use-projects";
import type { ChecklistItem } from "@/lib/types";

export default function HomePage() {
  const { data: mission } = useMission();
  const { data: today } = useTodayEntry();
  const { data: projects } = useProjects();
  const { data: wins } = useCareerWins();
  const updateToday = useUpdateDailyEntry(today?.entry_date ?? "");

  const activeProject = projects?.find((p) => p.status === "in_progress");

  function onChecklistChange(items: ChecklistItem[]) {
    if (!today) return;
    updateToday.mutate({ checklist: items });
  }

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-6">
      <div>
        <h1 className="font-heading text-2xl font-semibold">Today&apos;s Focus</h1>
        {mission?.north_star && <p className="text-muted-foreground text-sm mt-1">{mission.north_star}</p>}
      </div>

      <Card>
        <CardContent>{today && <Checklist items={today.checklist} onChange={onChecklistChange} />}</CardContent>
      </Card>

      {activeProject && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>🚀 {activeProject.name}</span>
              <Badge variant="secondary">In Progress</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-2 text-sm">
            {activeProject.next_milestone && (
              <p>
                <span className="text-muted-foreground">Next milestone: </span>
                {activeProject.next_milestone}
              </p>
            )}
            <Link href={`/projects/${activeProject.id}`} className="text-sm underline underline-offset-4">
              Open board →
            </Link>
          </CardContent>
        </Card>
      )}

      {mission && mission.target_companies.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>🎯 Mission</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            {mission.target_companies.map((c) => (
              <Badge key={c.name} variant={c.checked ? "default" : "outline"}>
                {c.name}
              </Badge>
            ))}
          </CardContent>
        </Card>
      )}

      {wins && wins.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>🏆 Recent Wins</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-1 text-sm">
            {wins.slice(0, 3).map((w) => (
              <p key={w.id}>
                <span className="text-muted-foreground">{w.win_date}</span> — {w.title}
              </p>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
