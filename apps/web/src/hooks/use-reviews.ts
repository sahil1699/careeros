import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { api } from "@/lib/api";
import type { MonthlyReview, ReviewFields, WeeklyReview } from "@/lib/types";

export function useWeeklyReviews() {
  return useQuery({ queryKey: ["reviews", "weekly"], queryFn: () => api.get<WeeklyReview[]>("/reviews/weekly") });
}

export function useUpsertWeeklyReview(weekStart: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: Partial<ReviewFields>) => api.put<WeeklyReview>(`/reviews/weekly/${weekStart}`, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["reviews", "weekly"] }),
  });
}

export function useMonthlyReviews() {
  return useQuery({ queryKey: ["reviews", "monthly"], queryFn: () => api.get<MonthlyReview[]>("/reviews/monthly") });
}

export function useUpsertMonthlyReview(monthStart: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: Partial<ReviewFields>) => api.put<MonthlyReview>(`/reviews/monthly/${monthStart}`, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["reviews", "monthly"] }),
  });
}
