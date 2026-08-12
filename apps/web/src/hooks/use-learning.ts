import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { api } from "@/lib/api";
import type { AiTopic, DsaPattern, DsaQuestion, ReadingListItem, SystemDesignTopic } from "@/lib/types";

// System Design Topics

export function useSystemDesignTopics() {
  return useQuery({
    queryKey: ["system-design-topics"],
    queryFn: () => api.get<SystemDesignTopic[]>("/system-design-topics"),
  });
}

export function useCreateSystemDesignTopic() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: Pick<SystemDesignTopic, "topic"> & Partial<SystemDesignTopic>) =>
      api.post<SystemDesignTopic>("/system-design-topics", payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["system-design-topics"] }),
  });
}

export function useUpdateSystemDesignTopic() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...payload }: { id: number } & Partial<SystemDesignTopic>) =>
      api.patch<SystemDesignTopic>(`/system-design-topics/${id}`, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["system-design-topics"] }),
  });
}

export function useDeleteSystemDesignTopic() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => api.delete(`/system-design-topics/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["system-design-topics"] }),
  });
}

// DSA Patterns

export function useDsaPatterns() {
  return useQuery({ queryKey: ["dsa-patterns"], queryFn: () => api.get<DsaPattern[]>("/dsa-patterns") });
}

export function useUpdateDsaPattern() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...payload }: { id: number } & Partial<DsaPattern>) =>
      api.patch<DsaPattern>(`/dsa-patterns/${id}`, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["dsa-patterns"] }),
  });
}

// DSA Questions — one row (link + notes) per practiced question, under a pattern

export function useCreateDsaQuestion() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ patternId, ...payload }: { patternId: number } & Partial<DsaQuestion>) =>
      api.post<DsaQuestion>(`/dsa-patterns/${patternId}/questions`, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["dsa-patterns"] }),
  });
}

export function useUpdateDsaQuestion() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...payload }: { id: number } & Partial<DsaQuestion>) =>
      api.patch<DsaQuestion>(`/dsa-patterns/questions/${id}`, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["dsa-patterns"] }),
  });
}

export function useDeleteDsaQuestion() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => api.delete(`/dsa-patterns/questions/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["dsa-patterns"] }),
  });
}

// AI Topics

export function useAiTopics() {
  return useQuery({ queryKey: ["ai-topics"], queryFn: () => api.get<AiTopic[]>("/ai-topics") });
}

export function useUpdateAiTopic() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...payload }: { id: number } & Partial<AiTopic>) =>
      api.patch<AiTopic>(`/ai-topics/${id}`, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["ai-topics"] }),
  });
}

// Reading List

export function useReadingList() {
  return useQuery({ queryKey: ["reading-list"], queryFn: () => api.get<ReadingListItem[]>("/reading-list") });
}

export function useCreateReadingListItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: Pick<ReadingListItem, "title"> & Partial<ReadingListItem>) =>
      api.post<ReadingListItem>("/reading-list", payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["reading-list"] }),
  });
}

export function useUpdateReadingListItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...payload }: { id: number } & Partial<ReadingListItem>) =>
      api.patch<ReadingListItem>(`/reading-list/${id}`, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["reading-list"] }),
  });
}

export function useDeleteReadingListItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => api.delete(`/reading-list/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["reading-list"] }),
  });
}
