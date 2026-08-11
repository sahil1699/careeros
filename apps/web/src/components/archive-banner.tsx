"use client";

import { useArchiveStatus } from "@/hooks/use-daily";

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

export function ArchiveBanner() {
  const { data } = useArchiveStatus();
  const pending = data?.pending;
  if (!pending) return null;

  const label = `${MONTH_NAMES[pending.month - 1]} ${pending.year}`;

  return (
    <div className="flex items-center justify-between gap-3 border-b bg-amber-50 px-6 py-2 text-sm dark:bg-amber-950">
      <span>
        📦 <strong>{label}</strong>&apos;s daily log is ready to download — auto-deletes in{" "}
        <strong>{pending.days_left}</strong> day{pending.days_left === 1 ? "" : "s"}.
      </span>
      <a
        href={`/api/daily-entries/export/${pending.year}/${pending.month}`}
        className="shrink-0 underline underline-offset-4"
      >
        Download Excel
      </a>
    </div>
  );
}
