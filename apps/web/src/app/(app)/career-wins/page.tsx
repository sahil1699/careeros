"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useCareerWins, useCreateCareerWin, useDeleteCareerWin } from "@/hooks/use-career-wins";

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

export default function CareerWinsPage() {
  const { data: wins } = useCareerWins();
  const createWin = useCreateCareerWin();
  const deleteWin = useDeleteCareerWin();
  const [title, setTitle] = useState("");

  function addWin() {
    if (!title.trim()) return;
    createWin.mutate({ win_date: today(), title: title.trim() });
    setTitle("");
  }

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6">
      <div>
        <h1 className="font-heading text-2xl font-semibold">🏆 Career Wins</h1>
        <p className="text-muted-foreground text-sm mt-1">
          On a bad day, read this page and see how much you&apos;ve actually grown.
        </p>
      </div>

      <div className="flex gap-2">
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addWin()}
          placeholder="Merged a difficult PR…"
        />
        <Button onClick={addWin} disabled={createWin.isPending}>
          Add
        </Button>
      </div>

      <div className="flex flex-col gap-2">
        {wins?.map((w) => (
          <Card key={w.id} size="sm">
            <CardContent className="flex items-center justify-between">
              <div>
                <span className="text-muted-foreground text-xs mr-2">{w.win_date}</span>
                <span className="text-sm">{w.title}</span>
              </div>
              <Button variant="ghost" size="sm" onClick={() => deleteWin.mutate(w.id)}>
                ✕
              </Button>
            </CardContent>
          </Card>
        ))}
        {wins?.length === 0 && <p className="text-muted-foreground text-sm">No wins logged yet — add your first one above.</p>}
      </div>
    </div>
  );
}
