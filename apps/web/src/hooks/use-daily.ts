import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { api } from "@/lib/api";
import type { DailyEntry } from "@/lib/types";

export function useTodayEntry() {
  return useQuery({ queryKey: ["daily", "today"], queryFn: () => api.get<DailyEntry>("/daily-entries/today") });
}

export function useDailyHistory(limit = 14) {
  return useQuery({
    queryKey: ["daily", "history", limit],
    queryFn: () => api.get<DailyEntry[]>(`/daily-entries?limit=${limit}`),
  });
}

export interface ArchiveStatus {
  pending: { year: number; month: number; days_left: number } | null;
}

/** Called once per app load (see AppLayout). Also runs the server-side
 * grace-period cleanup as a side effect — see archive_status in daily.py. */
export function useArchiveStatus() {
  return useQuery({
    queryKey: ["daily", "archive-status"],
    queryFn: () => api.get<ArchiveStatus>("/daily-entries/archive-status"),
    staleTime: 60 * 60 * 1000, // once per hour is plenty for a once-a-month event
  });
}

export function useUpdateDailyEntry(entryDate: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: Partial<Omit<DailyEntry, "id" | "entry_date">>) =>
      api.put<DailyEntry>(`/daily-entries/${entryDate}`, payload),
    onSuccess: (data) => {
      queryClient.setQueryData(["daily", "today"], data);
      queryClient.invalidateQueries({ queryKey: ["daily", "history"] });
    },
  });
}
