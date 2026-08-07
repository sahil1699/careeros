import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { api } from "@/lib/api";
import type { ContentIdea } from "@/lib/types";

export function useContentIdeas() {
  return useQuery({ queryKey: ["content-ideas"], queryFn: () => api.get<ContentIdea[]>("/content-ideas") });
}

export function useCreateContentIdea() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: Pick<ContentIdea, "idea" | "content_type"> & Partial<ContentIdea>) =>
      api.post<ContentIdea>("/content-ideas", payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["content-ideas"] }),
  });
}

export function useUpdateContentIdea() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...payload }: { id: number } & Partial<ContentIdea>) =>
      api.patch<ContentIdea>(`/content-ideas/${id}`, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["content-ideas"] }),
  });
}

export function useDeleteContentIdea() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => api.delete(`/content-ideas/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["content-ideas"] }),
  });
}
