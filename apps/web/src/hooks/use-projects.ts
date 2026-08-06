import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { api } from "@/lib/api";
import type { Project, ProjectCard } from "@/lib/types";

export function useProjects() {
  return useQuery({ queryKey: ["projects"], queryFn: () => api.get<Project[]>("/projects") });
}

export function useProject(id: number) {
  return useQuery({ queryKey: ["projects", id], queryFn: () => api.get<Project>(`/projects/${id}`) });
}

export function useCreateProject() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: Pick<Project, "name"> & Partial<Project>) => api.post<Project>("/projects", payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["projects"] }),
  });
}

export function useUpdateProject(id: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: Partial<Project>) => api.patch<Project>(`/projects/${id}`, payload),
    onSuccess: (data) => {
      queryClient.setQueryData(["projects", id], data);
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });
}

export function useCreateCard(projectId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: Pick<ProjectCard, "column" | "title"> & Partial<ProjectCard>) =>
      api.post<ProjectCard>(`/projects/${projectId}/cards`, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["projects", projectId] }),
  });
}

export function useUpdateCard(projectId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ cardId, ...payload }: { cardId: number } & Partial<ProjectCard>) =>
      api.patch<ProjectCard>(`/projects/cards/${cardId}`, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["projects", projectId] }),
  });
}

export function useDeleteCard(projectId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (cardId: number) => api.delete(`/projects/cards/${cardId}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["projects", projectId] }),
  });
}
