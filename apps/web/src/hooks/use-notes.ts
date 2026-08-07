import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { api } from "@/lib/api";
import type { NotePage } from "@/lib/types";

export function useNotesPages() {
  return useQuery({ queryKey: ["notes-pages"], queryFn: () => api.get<NotePage[]>("/notes-pages") });
}

export function useNotesPage(id: number) {
  return useQuery({ queryKey: ["notes-pages", id], queryFn: () => api.get<NotePage>(`/notes-pages/${id}`) });
}

export function useCreateNotesPage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: Pick<NotePage, "topic"> & Partial<NotePage>) =>
      api.post<NotePage>("/notes-pages", payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["notes-pages"] }),
  });
}

export function useUpdateNotesPage(id: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: Partial<NotePage>) => api.patch<NotePage>(`/notes-pages/${id}`, payload),
    onSuccess: (data) => {
      queryClient.setQueryData(["notes-pages", id], data);
      queryClient.invalidateQueries({ queryKey: ["notes-pages"] });
    },
  });
}

export function useDeleteNotesPage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => api.delete(`/notes-pages/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["notes-pages"] }),
  });
}
