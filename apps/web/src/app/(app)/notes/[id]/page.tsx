"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { use, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useDeleteNotesPage, useNotesPage, useUpdateNotesPage } from "@/hooks/use-notes";
import type { NotePage } from "@/lib/types";

function useDebounced<T extends (...args: never[]) => void>(fn: T, delay = 600) {
  const [timer, setTimer] = useState<ReturnType<typeof setTimeout> | null>(null);
  return (...args: Parameters<T>) => {
    if (timer) clearTimeout(timer);
    setTimer(setTimeout(() => fn(...args), delay));
  };
}

export default function NotesPageDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const pageId = Number(id);
  const { data: page } = useNotesPage(pageId);
  const updatePage = useUpdateNotesPage(pageId);
  const deletePage = useDeleteNotesPage();
  const router = useRouter();

  if (!page) return null;

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-6">
      <div className="flex items-center justify-between">
        <Link href="/notes" className="text-sm text-muted-foreground hover:underline">
          ← Notes
        </Link>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => deletePage.mutate(page.id, { onSuccess: () => router.push("/notes") })}
        >
          Delete page
        </Button>
      </div>

      <NotePageForm key={page.id} page={page} onSave={(patch) => updatePage.mutate(patch)} />
    </div>
  );
}

/** Mounted only once `page` has loaded, keyed by id in the parent so it
 * remounts (re-running lazy initializers) if the loaded page changes. */
function NotePageForm({ page, onSave }: { page: NotePage; onSave: (patch: Partial<NotePage>) => void }) {
  const debouncedSave = useDebounced((patch: Record<string, unknown>) => onSave(patch));

  const [topic, setTopic] = useState(page.topic);
  const [content, setContent] = useState(page.content ?? "");
  const [tagsInput, setTagsInput] = useState(page.tags.join(", "));

  return (
    <>
      <Input
        value={topic}
        onChange={(e) => {
          setTopic(e.target.value);
          debouncedSave({ topic: e.target.value });
        }}
        className="font-heading text-xl font-semibold"
      />

      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-muted-foreground">Tags (comma-separated)</label>
        <Input
          value={tagsInput}
          onChange={(e) => {
            setTagsInput(e.target.value);
            const tags = e.target.value
              .split(",")
              .map((t) => t.trim())
              .filter(Boolean);
            debouncedSave({ tags });
          }}
          placeholder="db, cache, infra"
          className="h-8"
        />
        {page.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 pt-1">
            {page.tags.map((tag) => (
              <Badge key={tag} variant="outline">
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </div>

      <Card>
        <CardContent>
          <Textarea
            value={content}
            onChange={(e) => {
              setContent(e.target.value);
              debouncedSave({ content: e.target.value });
            }}
            placeholder="Write your notes in markdown…"
            rows={20}
            className="font-mono text-sm"
          />
        </CardContent>
      </Card>
    </>
  );
}
