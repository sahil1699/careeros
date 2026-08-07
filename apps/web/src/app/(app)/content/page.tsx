"use client";

import { useState } from "react";

import { Badge } from "@/components/ui/badge";
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
import {
  useContentIdeas,
  useCreateContentIdea,
  useDeleteContentIdea,
  useUpdateContentIdea,
} from "@/hooks/use-content";
import type { ContentIdea, ContentStage, ContentType } from "@/lib/types";

const STAGES: { key: ContentStage; label: string }[] = [
  { key: "idea", label: "Idea" },
  { key: "writing", label: "Writing" },
  { key: "scheduled", label: "Scheduled" },
  { key: "posted", label: "Posted" },
];

const CONTENT_TYPES: { key: ContentType; label: string }[] = [
  { key: "tweet", label: "Tweet" },
  { key: "linkedin", label: "LinkedIn" },
  { key: "blog", label: "Blog" },
  { key: "readme", label: "README" },
];

export default function ContentPage() {
  const { data: ideas } = useContentIdeas();
  const updateIdea = useUpdateContentIdea();
  const deleteIdea = useDeleteContentIdea();

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-6">
      <h1 className="font-heading text-2xl font-semibold">✍️ Content</h1>

      <NewIdeaForm />

      {ideas && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {STAGES.map((stage) => {
            const stageIdeas = ideas.filter((i) => i.stage === stage.key);
            return (
              <div key={stage.key} className="flex flex-col gap-3">
                <h3 className="text-sm font-medium text-muted-foreground">
                  {stage.label} <span className="text-xs">({stageIdeas.length})</span>
                </h3>
                <div className="flex flex-col gap-2">
                  {stageIdeas.map((idea) => (
                    <ContentCard
                      key={idea.id}
                      idea={idea}
                      onMove={(newStage) => updateIdea.mutate({ id: idea.id, stage: newStage })}
                      onDelete={() => deleteIdea.mutate(idea.id)}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function ContentCard({
  idea,
  onMove,
  onDelete,
}: {
  idea: ContentIdea;
  onMove: (stage: ContentStage) => void;
  onDelete: () => void;
}) {
  return (
    <Card size="sm">
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-sm">{idea.idea}</CardTitle>
          <Badge variant="secondary">{CONTENT_TYPES.find((t) => t.key === idea.content_type)?.label}</Badge>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        {idea.notes && <p className="text-xs text-muted-foreground">{idea.notes}</p>}
        {idea.repurposed_from_id && (
          <p className="text-xs text-muted-foreground">↳ repurposed from #{idea.repurposed_from_id}</p>
        )}
        <div className="flex items-center gap-1">
          <Select value={idea.stage} onValueChange={(v) => onMove(v as ContentStage)}>
            <SelectTrigger className="h-7 flex-1 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {STAGES.map((s) => (
                <SelectItem key={s.key} value={s.key}>
                  {s.label}
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

function NewIdeaForm() {
  const createIdea = useCreateContentIdea();
  const [idea, setIdea] = useState("");
  const [contentType, setContentType] = useState<ContentType>("tweet");

  function submit() {
    if (!idea.trim()) return;
    createIdea.mutate({ idea: idea.trim(), content_type: contentType });
    setIdea("");
  }

  return (
    <div className="flex gap-2">
      <Input
        value={idea}
        onChange={(e) => setIdea(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && submit()}
        placeholder="New content idea…"
        className="h-8"
      />
      <Select value={contentType} onValueChange={(v) => setContentType(v as ContentType)}>
        <SelectTrigger className="h-8 w-32 text-xs">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {CONTENT_TYPES.map((t) => (
            <SelectItem key={t.key} value={t.key}>
              {t.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button type="button" size="sm" variant="secondary" onClick={submit}>
        Add
      </Button>
    </div>
  );
}
