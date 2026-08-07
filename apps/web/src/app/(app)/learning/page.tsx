"use client";

import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  useAiTopics,
  useCreateReadingListItem,
  useCreateSystemDesignTopic,
  useDeleteReadingListItem,
  useDsaPatterns,
  useReadingList,
  useSystemDesignTopics,
  useUpdateAiTopic,
  useUpdateDsaPattern,
  useUpdateReadingListItem,
  useUpdateSystemDesignTopic,
} from "@/hooks/use-learning";
import type { AiTopic, AiTopicStatus, DsaPattern, ReadingStatus, SystemDesignTopic } from "@/lib/types";

export default function LearningPage() {
  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-6">
      <h1 className="font-heading text-2xl font-semibold">🧠 Learning</h1>

      <Tabs defaultValue="system-design">
        <TabsList>
          <TabsTrigger value="system-design">System Design</TabsTrigger>
          <TabsTrigger value="dsa">DSA</TabsTrigger>
          <TabsTrigger value="ai">AI</TabsTrigger>
          <TabsTrigger value="reading">Reading List</TabsTrigger>
        </TabsList>

        <TabsContent value="system-design">
          <SystemDesignTab />
        </TabsContent>
        <TabsContent value="dsa">
          <DsaTab />
        </TabsContent>
        <TabsContent value="ai">
          <AiTab />
        </TabsContent>
        <TabsContent value="reading">
          <ReadingListTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}

// --- System Design ---

const SD_COLUMNS: { key: "read" | "diagram" | "notes" | "implemented"; label: string }[] = [
  { key: "read", label: "Read" },
  { key: "diagram", label: "Diagram" },
  { key: "notes", label: "Notes" },
  { key: "implemented", label: "Implemented" },
];

function SystemDesignTab() {
  const { data: topics } = useSystemDesignTopics();
  const updateTopic = useUpdateSystemDesignTopic();
  const createTopic = useCreateSystemDesignTopic();
  const [newTopic, setNewTopic] = useState("");

  function addTopic() {
    if (!newTopic.trim()) return;
    createTopic.mutate({ topic: newTopic.trim() });
    setNewTopic("");
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>System Design Topics</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="flex gap-2">
          <Input
            value={newTopic}
            onChange={(e) => setNewTopic(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addTopic()}
            placeholder="Add a topic (e.g. Rate Limiter)…"
            className="h-8"
          />
          <Button type="button" size="sm" variant="secondary" onClick={addTopic}>
            Add
          </Button>
        </div>

        {topics && topics.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b text-left text-muted-foreground">
                  <th className="py-2 pr-2 font-medium">Topic</th>
                  {SD_COLUMNS.map((c) => (
                    <th key={c.key} className="px-2 py-2 text-center font-medium">
                      {c.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {topics.map((topic: SystemDesignTopic) => (
                  <tr key={topic.id} className="border-b last:border-0">
                    <td className="py-2 pr-2">{topic.topic}</td>
                    {SD_COLUMNS.map((c) => (
                      <td key={c.key} className="px-2 py-2 text-center">
                        <Checkbox
                          checked={topic[c.key]}
                          onCheckedChange={(checked) =>
                            updateTopic.mutate({ id: topic.id, [c.key]: checked === true })
                          }
                        />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {topics && topics.length === 0 && (
          <p className="text-sm text-muted-foreground">No topics yet — add one above.</p>
        )}
      </CardContent>
    </Card>
  );
}

// --- DSA ---

function DsaTab() {
  const { data: patterns } = useDsaPatterns();

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {patterns?.map((pattern) => <DsaPatternCard key={pattern.id} pattern={pattern} />)}
    </div>
  );
}

function DsaPatternCard({ pattern }: { pattern: DsaPattern }) {
  const updatePattern = useUpdateDsaPattern();
  const [notes, setNotes] = useState(pattern.notes ?? "");

  return (
    <Card size="sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm">{pattern.pattern}</CardTitle>
          <label className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Checkbox
              checked={pattern.needs_revision}
              onCheckedChange={(checked) =>
                updatePattern.mutate({ id: pattern.id, needs_revision: checked === true })
              }
            />
            Needs revision
          </label>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <StarRating
          label="Understanding"
          value={pattern.understanding}
          onChange={(v) => updatePattern.mutate({ id: pattern.id, understanding: v })}
        />
        <StarRating
          label="Confidence"
          value={pattern.confidence}
          onChange={(v) => updatePattern.mutate({ id: pattern.id, confidence: v })}
        />
        <Textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          onBlur={() => updatePattern.mutate({ id: pattern.id, notes: notes || null })}
          placeholder="Notes…"
          rows={2}
          className="text-xs"
        />
      </CardContent>
    </Card>
  );
}

function StarRating({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void }) {
  return (
    <div className="flex items-center justify-between text-xs">
      <span className="text-muted-foreground">{label}</span>
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => onChange(n === value ? 0 : n)}
            className="text-base leading-none"
            aria-label={`${label} ${n} star${n === 1 ? "" : "s"}`}
          >
            {n <= value ? "★" : "☆"}
          </button>
        ))}
      </div>
    </div>
  );
}

// --- AI Topics ---

const AI_STATUS_LABEL: Record<AiTopicStatus, string> = {
  not_started: "Not Started",
  in_progress: "In Progress",
  done: "Done",
};

function AiTab() {
  const { data: topics } = useAiTopics();

  return (
    <div className="flex flex-col gap-3">
      {topics?.map((topic) => <AiTopicCard key={topic.id} topic={topic} />)}
    </div>
  );
}

function AiTopicCard({ topic }: { topic: AiTopic }) {
  const updateTopic = useUpdateAiTopic();
  const [notes, setNotes] = useState(topic.notes ?? "");
  const [miniProject, setMiniProject] = useState(topic.mini_project ?? "");

  return (
    <Card size="sm">
      <CardHeader>
        <div className="flex items-center justify-between gap-2">
          <CardTitle className="text-sm">{topic.topic}</CardTitle>
          <Select
            value={topic.status}
            onValueChange={(v) => updateTopic.mutate({ id: topic.id, status: v as AiTopicStatus })}
          >
            <SelectTrigger className="h-7 w-36 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {(Object.keys(AI_STATUS_LABEL) as AiTopicStatus[]).map((s) => (
                <SelectItem key={s} value={s}>
                  {AI_STATUS_LABEL[s]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-muted-foreground">Notes</label>
          <Textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            onBlur={() => updateTopic.mutate({ id: topic.id, notes: notes || null })}
            rows={2}
            className="text-xs"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-muted-foreground">Mini Project</label>
          <Input
            value={miniProject}
            onChange={(e) => setMiniProject(e.target.value)}
            onBlur={() => updateTopic.mutate({ id: topic.id, mini_project: miniProject || null })}
            className="h-8 text-xs"
          />
        </div>
      </CardContent>
    </Card>
  );
}

// --- Reading List ---

const READING_STATUS_LABEL: Record<ReadingStatus, string> = {
  to_read: "To Read",
  reading: "Reading",
  done: "Done",
};

function ReadingListTab() {
  const { data: items } = useReadingList();
  const createItem = useCreateReadingListItem();
  const updateItem = useUpdateReadingListItem();
  const deleteItem = useDeleteReadingListItem();
  const [title, setTitle] = useState("");
  const [source, setSource] = useState("");

  function addItem() {
    if (!title.trim()) return;
    createItem.mutate({ title: title.trim(), source: source.trim() || undefined });
    setTitle("");
    setSource("");
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Reading List</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="flex gap-2">
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addItem()}
            placeholder="Title…"
            className="h-8"
          />
          <Input
            value={source}
            onChange={(e) => setSource(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addItem()}
            placeholder="Source (optional)"
            className="h-8 w-48"
          />
          <Button type="button" size="sm" variant="secondary" onClick={addItem}>
            Add
          </Button>
        </div>

        <div className="flex flex-col gap-2">
          {items?.map((item) => (
            <div key={item.id} className="flex items-center justify-between gap-2 rounded-md border px-3 py-2">
              <div className="flex flex-col">
                <span className="text-sm font-medium">{item.title}</span>
                {item.source && <span className="text-xs text-muted-foreground">{item.source}</span>}
              </div>
              <div className="flex items-center gap-2">
                <Select
                  value={item.status}
                  onValueChange={(v) => updateItem.mutate({ id: item.id, status: v as ReadingStatus })}
                >
                  <SelectTrigger className="h-7 w-28 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {(Object.keys(READING_STATUS_LABEL) as ReadingStatus[]).map((s) => (
                      <SelectItem key={s} value={s}>
                        {READING_STATUS_LABEL[s]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Badge variant="outline">{READING_STATUS_LABEL[item.status]}</Badge>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 px-2 text-xs"
                  onClick={() => deleteItem.mutate(item.id)}
                >
                  ✕
                </Button>
              </div>
            </div>
          ))}
          {items && items.length === 0 && (
            <p className="text-sm text-muted-foreground">Nothing on the list yet — add something above.</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
