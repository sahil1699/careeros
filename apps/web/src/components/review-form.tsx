"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import type { ReviewFields } from "@/lib/types";

const QUESTIONS: { key: keyof ReviewFields; label: string }[] = [
  { key: "what_built", label: "What did I build?" },
  { key: "what_learned", label: "What did I learn?" },
  { key: "what_slowed", label: "What slowed me down?" },
  { key: "what_stop", label: "What should I stop doing?" },
  { key: "what_proud", label: "What am I proud of?" },
  { key: "what_next", label: "What will I build next?" },
];

/** Render with `key={initial?.id ?? "new"}` from the parent — that remounts
 * this fresh (re-running the lazy initializer) once async data arrives,
 * instead of syncing props into state via an effect. */
export function ReviewForm({
  initial,
  onSave,
  saving,
}: {
  initial: ReviewFields | undefined;
  onSave: (fields: Partial<ReviewFields>) => void;
  saving: boolean;
}) {
  const [fields, setFields] = useState<Partial<ReviewFields>>(() => initial ?? {});

  return (
    <div className="flex flex-col gap-4">
      {QUESTIONS.map((q) => (
        <div key={q.key} className="flex flex-col gap-2">
          <label className="text-sm font-medium">{q.label}</label>
          <Textarea
            value={fields[q.key] ?? ""}
            onChange={(e) => setFields((prev) => ({ ...prev, [q.key]: e.target.value }))}
            rows={2}
          />
        </div>
      ))}
      <Button onClick={() => onSave(fields)} disabled={saving} className="self-start">
        {saving ? "Saving…" : "Save"}
      </Button>
    </div>
  );
}
