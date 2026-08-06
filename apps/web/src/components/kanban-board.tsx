"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCreateCard, useDeleteCard, useUpdateCard } from "@/hooks/use-projects";
import type { KanbanColumn, Project, ProjectCard } from "@/lib/types";

const COLUMNS: { key: KanbanColumn; label: string }[] = [
  { key: "ideas", label: "Ideas" },
  { key: "todo", label: "Todo" },
  { key: "in_progress", label: "In Progress" },
  { key: "done", label: "Done" },
];

export function KanbanBoard({ project }: { project: Project }) {
  const updateCard = useUpdateCard(project.id);
  const deleteCard = useDeleteCard(project.id);

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {COLUMNS.map((col) => {
        const cards = project.cards
          .filter((c) => c.column === col.key)
          .sort((a, b) => a.position - b.position);
        return (
          <div key={col.key} className="flex flex-col gap-3">
            <h3 className="text-muted-foreground text-sm font-medium">
              {col.label} <span className="text-xs">({cards.length})</span>
            </h3>
            <div className="flex flex-col gap-2">
              {cards.map((card) => (
                <KanbanCard
                  key={card.id}
                  card={card}
                  onMove={(column) => updateCard.mutate({ cardId: card.id, column })}
                  onDelete={() => deleteCard.mutate(card.id)}
                />
              ))}
            </div>
            <NewCardInput projectId={project.id} column={col.key} />
          </div>
        );
      })}
    </div>
  );
}

function KanbanCard({
  card,
  onMove,
  onDelete,
}: {
  card: ProjectCard;
  onMove: (column: KanbanColumn) => void;
  onDelete: () => void;
}) {
  return (
    <Card size="sm">
      <CardHeader>
        <CardTitle className="text-sm">{card.title}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        {card.description && <p className="text-muted-foreground text-xs">{card.description}</p>}
        <div className="flex items-center gap-1">
          <Select value={card.column} onValueChange={(v) => onMove(v as KanbanColumn)}>
            <SelectTrigger className="h-7 flex-1 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {COLUMNS.map((c) => (
                <SelectItem key={c.key} value={c.key}>
                  {c.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button variant="ghost" size="sm" className="h-7 px-2 text-xs" onClick={onDelete}>
            ✕
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function NewCardInput({ projectId, column }: { projectId: number; column: KanbanColumn }) {
  const [title, setTitle] = useState("");
  const createCard = useCreateCard(projectId);

  function submit() {
    if (!title.trim()) return;
    createCard.mutate({ column, title: title.trim() });
    setTitle("");
  }

  return (
    <Input
      value={title}
      onChange={(e) => setTitle(e.target.value)}
      onKeyDown={(e) => e.key === "Enter" && submit()}
      onBlur={submit}
      placeholder="+ Add card"
      className="h-8 text-xs"
    />
  );
}
