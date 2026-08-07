"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useCreateNotesPage, useNotesPages } from "@/hooks/use-notes";

export default function NotesPage() {
  const { data: pages } = useNotesPages();
  const createPage = useCreateNotesPage();
  const router = useRouter();
  const [topic, setTopic] = useState("");

  function createAndOpen() {
    if (!topic.trim()) return;
    createPage.mutate(
      { topic: topic.trim() },
      { onSuccess: (page) => router.push(`/notes/${page.id}`) }
    );
    setTopic("");
  }

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6">
      <h1 className="font-heading text-2xl font-semibold">📖 Notes</h1>

      <div className="flex gap-2">
        <Input
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && createAndOpen()}
          placeholder="New topic (e.g. Redis)…"
          className="h-8"
        />
        <Button type="button" size="sm" variant="secondary" onClick={createAndOpen}>
          New Page
        </Button>
      </div>

      <div className="flex flex-col gap-2">
        {pages?.map((page) => (
          <Link key={page.id} href={`/notes/${page.id}`}>
            <Card size="sm" className="transition-colors hover:bg-accent">
              <CardHeader>
                <CardTitle className="text-sm">{page.topic}</CardTitle>
              </CardHeader>
              {(page.content || page.tags.length > 0) && (
                <CardContent className="flex flex-col gap-2">
                  {page.content && (
                    <p className="line-clamp-2 text-xs text-muted-foreground">{page.content}</p>
                  )}
                  {page.tags.length > 0 && (
                    <div className="flex gap-1">
                      {page.tags.map((tag) => (
                        <Badge key={tag} variant="outline">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                </CardContent>
              )}
            </Card>
          </Link>
        ))}
        {pages && pages.length === 0 && (
          <p className="text-sm text-muted-foreground">No notes yet — create your first topic page above.</p>
        )}
      </div>
    </div>
  );
}
