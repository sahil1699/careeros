import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { api } from "@/lib/api";
import type { CareerWin } from "@/lib/types";

export function useCareerWins() {
  return useQuery({ queryKey: ["career-wins"], queryFn: () => api.get<CareerWin[]>("/career-wins") });
}

export function useCreateCareerWin() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: Pick<CareerWin, "win_date" | "title"> & Partial<CareerWin>) =>
      api.post<CareerWin>("/career-wins", payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["career-wins"] }),
  });
}

export function useDeleteCareerWin() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => api.delete(`/career-wins/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["career-wins"] }),
  });
}
