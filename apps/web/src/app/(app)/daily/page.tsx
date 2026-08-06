"use client";

import { useState } from "react";

import { Checklist } from "@/components/checklist";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useDailyHistory, useTodayEntry, useUpdateDailyEntry } from "@/hooks/use-daily";
import type { ChecklistItem, DailyEntry } from "@/lib/types";

function useDebouncedSave(save: (patch: Record<string, unknown>) => void) {
  const [timer, setTimer] = useState<ReturnType<typeof setTimeout> | null>(null);
  return (patch: Record<string, unknown>) => {
    if (timer) clearTimeout(timer);
    setTimer(setTimeout(() => save(patch), 600));
  };
}

export default function DailyPage() {
  const { data: today } = useTodayEntry();
  const { data: history } = useDailyHistory(14);

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6">
      <h1 className="font-heading text-2xl font-semibold">📅 Daily Dashboard</h1>

      {today && <TodayForm today={today} />}

      {history && history.length > 1 && (
        <Card>
          <CardHeader>
            <CardTitle>History</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-2 text-sm">
            {history
              .filter((d) => d.entry_date !== today?.entry_date)
              .map((d) => (
                <div key={d.id} className="flex gap-2">
                  <span className="text-muted-foreground shrink-0">{d.entry_date}</span>
                  <span>{d.win || <span className="text-muted-foreground">—</span>}</span>
                </div>
              ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

/** Mounted only once `today` has loaded, so win/learning/blocked_by can be
 * lazily-initialized from props directly — no effect needed to sync it in. */
function TodayForm({ today }: { today: DailyEntry }) {
  const updateToday = useUpdateDailyEntry(today.entry_date);
  const debouncedSave = useDebouncedSave((patch) => updateToday.mutate(patch));

  const [win, setWin] = useState(today.win ?? "");
  const [learning, setLearning] = useState(today.learning ?? "");
  const [blockedBy, setBlockedBy] = useState(today.blocked_by ?? "");

  function onChecklistChange(items: ChecklistItem[]) {
    updateToday.mutate({ checklist: items });
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Today&apos;s Goal</CardTitle>
        </CardHeader>
        <CardContent>
          <Checklist items={today.checklist} onChange={onChecklistChange} />
        </CardContent>
      </Card>

      <Card>
        <CardContent className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Today&apos;s Win</label>
            <Textarea
              value={win}
              onChange={(e) => {
                setWin(e.target.value);
                debouncedSave({ win: e.target.value });
              }}
              rows={2}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Today&apos;s Learning</label>
            <Textarea
              value={learning}
              onChange={(e) => {
                setLearning(e.target.value);
                debouncedSave({ learning: e.target.value });
              }}
              rows={2}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Blocked By</label>
            <Textarea
              value={blockedBy}
              onChange={(e) => {
                setBlockedBy(e.target.value);
                debouncedSave({ blocked_by: e.target.value });
              }}
              rows={2}
            />
          </div>
        </CardContent>
      </Card>
    </>
  );
}
