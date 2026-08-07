import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { api } from "@/lib/api";
import type { Application, Company, Interview, ResumeVersion } from "@/lib/types";

// Companies

export function useCompanies() {
  return useQuery({ queryKey: ["companies"], queryFn: () => api.get<Company[]>("/companies") });
}

export function useCompany(id: number) {
  return useQuery({ queryKey: ["companies", id], queryFn: () => api.get<Company>(`/companies/${id}`) });
}

export function useCreateCompany() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: Pick<Company, "name"> & Partial<Company>) => api.post<Company>("/companies", payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["companies"] }),
  });
}

export function useUpdateCompany(id: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: Partial<Company>) => api.patch<Company>(`/companies/${id}`, payload),
    onSuccess: (data) => {
      queryClient.setQueryData(["companies", id], data);
      queryClient.invalidateQueries({ queryKey: ["companies"] });
    },
  });
}

// Applications

export function useCreateApplication(companyId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: Pick<Application, "role"> & Partial<Application>) =>
      api.post<Application>(`/companies/${companyId}/applications`, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["companies"] }),
  });
}

export function useUpdateApplication() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ applicationId, ...payload }: { applicationId: number } & Partial<Application>) =>
      api.patch<Application>(`/companies/applications/${applicationId}`, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["companies"] }),
  });
}

export function useDeleteApplication() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (applicationId: number) => api.delete(`/companies/applications/${applicationId}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["companies"] }),
  });
}

// Interviews

export function useCreateInterview() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ applicationId, ...payload }: { applicationId: number } & Pick<Interview, "round"> & Partial<Interview>) =>
      api.post<Interview>(`/companies/applications/${applicationId}/interviews`, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["companies"] }),
  });
}

export function useUpdateInterview() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ interviewId, ...payload }: { interviewId: number } & Partial<Interview>) =>
      api.patch<Interview>(`/companies/interviews/${interviewId}`, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["companies"] }),
  });
}

export function useDeleteInterview() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (interviewId: number) => api.delete(`/companies/interviews/${interviewId}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["companies"] }),
  });
}

// Resume Versions

export function useResumeVersions() {
  return useQuery({ queryKey: ["resume-versions"], queryFn: () => api.get<ResumeVersion[]>("/resume-versions") });
}

export function useCreateResumeVersion() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: Pick<ResumeVersion, "label"> & Partial<ResumeVersion>) =>
      api.post<ResumeVersion>("/resume-versions", payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["resume-versions"] }),
  });
}

export function useUpdateResumeVersion() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...payload }: { id: number } & Partial<ResumeVersion>) =>
      api.patch<ResumeVersion>(`/resume-versions/${id}`, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["resume-versions"] }),
  });
}

export function useDeleteResumeVersion() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => api.delete(`/resume-versions/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["resume-versions"] }),
  });
}
