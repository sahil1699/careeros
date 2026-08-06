import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { api } from "@/lib/api";
import type { Mission } from "@/lib/types";

export function useMission() {
  return useQuery({ queryKey: ["mission"], queryFn: () => api.get<Mission>("/mission") });
}

export function useUpdateMission() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: Partial<Omit<Mission, "id">>) => api.put<Mission>("/mission", payload),
    onSuccess: (data) => queryClient.setQueryData(["mission"], data),
  });
}
