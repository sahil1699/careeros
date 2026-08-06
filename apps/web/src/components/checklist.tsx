"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import type { ChecklistItem } from "@/lib/types";

const DEFAULT_ITEMS = [
  "30 min System Design",
  "20 min DSA",
  "40 min Project",
  "Tweet",
  "Read one article",
  "Commit code",
];

export function Checklist({
  items,
  onChange,
}: {
  items: ChecklistItem[];
  onChange: (items: ChecklistItem[]) => void;
}) {
  const [newLabel, setNewLabel] = useState("");
  const list = items.length > 0 ? items : DEFAULT_ITEMS.map((label) => ({ label, done: false }));

  function toggle(index: number) {
    onChange(list.map((item, i) => (i === index ? { ...item, done: !item.done } : item)));
  }

  function addItem() {
    if (!newLabel.trim()) return;
    onChange([...list, { label: newLabel.trim(), done: false }]);
    setNewLabel("");
  }

  return (
    <div className="flex flex-col gap-2">
      {list.map((item, i) => (
        <label key={i} className="flex items-center gap-2 text-sm">
          <Checkbox checked={item.done} onCheckedChange={() => toggle(i)} />
          <span className={item.done ? "text-muted-foreground line-through" : ""}>{item.label}</span>
        </label>
      ))}
      <div className="mt-1 flex gap-2">
        <Input
          value={newLabel}
          onChange={(e) => setNewLabel(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addItem()}
          placeholder="Add an item…"
          className="h-8"
        />
        <Button type="button" size="sm" variant="secondary" onClick={addItem}>
          Add
        </Button>
      </div>
    </div>
  );
}
