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
