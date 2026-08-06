"use client";

import { useEffect, useState } from "react";

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

export function ReviewForm({
  initial,
  onSave,
  saving,
}: {
  initial: ReviewFields | undefined;
  onSave: (fields: Partial<ReviewFields>) => void;
  saving: boolean;
}) {
  const [fields, setFields] = useState<Partial<ReviewFields>>({});

  useEffect(() => {
    setFields(initial ?? {});
  }, [initial]);

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
