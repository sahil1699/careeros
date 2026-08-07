"use client";

import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import {
  useCompanies,
  useCreateApplication,
  useCreateCompany,
  useCreateInterview,
  useCreateResumeVersion,
  useDeleteApplication,
  useDeleteInterview,
  useDeleteResumeVersion,
  useResumeVersions,
  useUpdateApplication,
  useUpdateCompany,
  useUpdateInterview,
  useUpdateResumeVersion,
} from "@/hooks/use-career";
import type { Application, ApplicationStatus, Company, CompanyStatus, Interview, ResumeVersion } from "@/lib/types";

const COMPANY_STATUSES: { key: CompanyStatus; label: string }[] = [
  { key: "researching", label: "Researching" },
  { key: "target", label: "Target" },
  { key: "applied", label: "Applied" },
  { key: "interviewing", label: "Interviewing" },
  { key: "offer", label: "Offer" },
  { key: "rejected", label: "Rejected" },
];

const APPLICATION_STATUSES: { key: ApplicationStatus; label: string }[] = [
  { key: "applied", label: "Applied" },
  { key: "screening", label: "Screening" },
  { key: "interviewing", label: "Interviewing" },
  { key: "offer", label: "Offer" },
  { key: "rejected", label: "Rejected" },
  { key: "withdrawn", label: "Withdrawn" },
];

export default function CareerPage() {
  const { data: companies } = useCompanies();
  const [companyId, setCompanyId] = useState<number | null>(null);
  const [applicationId, setApplicationId] = useState<number | null>(null);

  const selectedCompany = companies?.find((c) => c.id === companyId) ?? null;
  const selectedApplication = selectedCompany?.applications.find((a) => a.id === applicationId) ?? null;

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-6">
      <h1 className="font-heading text-2xl font-semibold">🎯 Applications</h1>

      {selectedApplication && selectedCompany ? (
        <ApplicationDetail
          key={selectedApplication.id}
          company={selectedCompany}
          application={selectedApplication}
          onBack={() => setApplicationId(null)}
        />
      ) : selectedCompany ? (
        <CompanyDetail
          key={selectedCompany.id}
          company={selectedCompany}
          onBack={() => setCompanyId(null)}
          onOpenApplication={setApplicationId}
        />
      ) : (
        <CompaniesList companies={companies} onOpenCompany={setCompanyId} />
      )}

      <Separator />
      <ResumeVersionsSection />
    </div>
  );
}

// --- Companies list ---

function CompaniesList({
  companies,
  onOpenCompany,
}: {
  companies: Company[] | undefined;
  onOpenCompany: (id: number) => void;
}) {
  const createCompany = useCreateCompany();
  const [name, setName] = useState("");

  function addCompany() {
    if (!name.trim()) return;
    createCompany.mutate({ name: name.trim() });
    setName("");
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex gap-2">
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addCompany()}
          placeholder="Add a company…"
          className="h-8"
        />
        <Button type="button" size="sm" variant="secondary" onClick={addCompany}>
          Add
        </Button>
      </div>

      {companies?.map((company) => (
        <CompanyRow key={company.id} company={company} onOpen={() => onOpenCompany(company.id)} />
      ))}
      {companies && companies.length === 0 && (
        <p className="text-sm text-muted-foreground">No companies yet — add one above.</p>
      )}
    </div>
  );
}

function CompanyRow({ company, onOpen }: { company: Company; onOpen: () => void }) {
  const updateCompany = useUpdateCompany(company.id);

  return (
    <Card size="sm">
      <CardContent className="flex items-center justify-between gap-2">
        <button type="button" onClick={onOpen} className="flex flex-1 flex-col items-start text-left">
          <span className="text-sm font-medium hover:underline">{company.name}</span>
          <span className="text-xs text-muted-foreground">
            {company.applications.length} application{company.applications.length === 1 ? "" : "s"}
          </span>
        </button>
        <Select
          value={company.status}
          onValueChange={(v) => updateCompany.mutate({ status: v as CompanyStatus })}
        >
          <SelectTrigger className="h-7 w-36 text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {COMPANY_STATUSES.map((s) => (
              <SelectItem key={s.key} value={s.key}>
                {s.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardContent>
    </Card>
  );
}

// --- Company detail (applications) ---

function CompanyDetail({
  company,
  onBack,
  onOpenApplication,
}: {
  company: Company;
  onBack: () => void;
  onOpenApplication: (id: number) => void;
}) {
  const updateCompany = useUpdateCompany(company.id);
  const createApplication = useCreateApplication(company.id);
  const deleteApplication = useDeleteApplication(company.id);
  const [url, setUrl] = useState(company.url ?? "");
  const [notes, setNotes] = useState(company.notes ?? "");
  const [role, setRole] = useState("");

  function addApplication() {
    if (!role.trim()) return;
    createApplication.mutate({ role: role.trim() });
    setRole("");
  }

  return (
    <div className="flex flex-col gap-4">
      <button type="button" onClick={onBack} className="self-start text-sm text-muted-foreground hover:underline">
        ← Companies
      </button>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between gap-2">
            <CardTitle>{company.name}</CardTitle>
            <Select
              value={company.status}
              onValueChange={(v) => updateCompany.mutate({ status: v as CompanyStatus })}
            >
              <SelectTrigger className="h-8 w-40 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {COMPANY_STATUSES.map((s) => (
                  <SelectItem key={s.key} value={s.key}>
                    {s.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-muted-foreground">URL</label>
            <Input
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onBlur={() => updateCompany.mutate({ url: url || null })}
              placeholder="https://…"
              className="h-8"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-muted-foreground">Notes</label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              onBlur={() => updateCompany.mutate({ notes: notes || null })}
              rows={2}
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-col gap-2">
        <h3 className="text-sm font-medium text-muted-foreground">Applications</h3>
        <div className="flex gap-2">
          <Input
            value={role}
            onChange={(e) => setRole(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addApplication()}
            placeholder="Role (e.g. Backend Engineer)…"
            className="h-8"
          />
          <Button type="button" size="sm" variant="secondary" onClick={addApplication}>
            Add
          </Button>
        </div>
        {company.applications.map((application) => (
          <Card key={application.id} size="sm">
            <CardContent className="flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={() => onOpenApplication(application.id)}
                className="flex flex-1 flex-col items-start text-left"
              >
                <span className="text-sm font-medium hover:underline">{application.role}</span>
                <span className="text-xs text-muted-foreground">
                  {application.applied_date ?? "no date"} · {application.interviews.length} interview
                  {application.interviews.length === 1 ? "" : "s"}
                </span>
              </button>
              <Badge variant="outline">
                {APPLICATION_STATUSES.find((s) => s.key === application.status)?.label}
              </Badge>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 px-2 text-xs"
                onClick={() => deleteApplication.mutate(application.id)}
              >
                ✕
              </Button>
            </CardContent>
          </Card>
        ))}
        {company.applications.length === 0 && (
          <p className="text-sm text-muted-foreground">No applications yet — add one above.</p>
        )}
      </div>
    </div>
  );
}

// --- Application detail (interviews) ---

function ApplicationDetail({
  company,
  application,
  onBack,
}: {
  company: Company;
  application: Application;
  onBack: () => void;
}) {
  const updateApplication = useUpdateApplication(company.id);
  const createInterview = useCreateInterview(company.id);
  const updateInterview = useUpdateInterview(company.id);
  const deleteInterview = useDeleteInterview(company.id);
  const [notes, setNotes] = useState(application.notes ?? "");
  const [round, setRound] = useState("");

  function addInterview() {
    if (!round.trim()) return;
    createInterview.mutate({ applicationId: application.id, round: round.trim() });
    setRound("");
  }

  return (
    <div className="flex flex-col gap-4">
      <button type="button" onClick={onBack} className="self-start text-sm text-muted-foreground hover:underline">
        ← {company.name}
      </button>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between gap-2">
            <CardTitle>{application.role}</CardTitle>
            <Select
              value={application.status}
              onValueChange={(v) =>
                updateApplication.mutate({ applicationId: application.id, status: v as ApplicationStatus })
              }
            >
              <SelectTrigger className="h-8 w-40 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {APPLICATION_STATUSES.map((s) => (
                  <SelectItem key={s.key} value={s.key}>
                    {s.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-muted-foreground">Notes</label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              onBlur={() => updateApplication.mutate({ applicationId: application.id, notes: notes || null })}
              rows={2}
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-col gap-2">
        <h3 className="text-sm font-medium text-muted-foreground">Interview Rounds</h3>
        <div className="flex gap-2">
          <Input
            value={round}
            onChange={(e) => setRound(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addInterview()}
            placeholder="Round (e.g. Phone Screen)…"
            className="h-8"
          />
          <Button type="button" size="sm" variant="secondary" onClick={addInterview}>
            Add
          </Button>
        </div>
        {application.interviews.map((interview) => (
          <InterviewRow
            key={interview.id}
            interview={interview}
            onUpdate={(patch) => updateInterview.mutate({ interviewId: interview.id, ...patch })}
            onDelete={() => deleteInterview.mutate(interview.id)}
          />
        ))}
        {application.interviews.length === 0 && (
          <p className="text-sm text-muted-foreground">No interview rounds yet — add one above.</p>
        )}
      </div>
    </div>
  );
}

function InterviewRow({
  interview,
  onUpdate,
  onDelete,
}: {
  interview: Interview;
  onUpdate: (patch: Partial<Interview>) => void;
  onDelete: () => void;
}) {
  const [notes, setNotes] = useState(interview.notes ?? "");
  const [outcome, setOutcome] = useState(interview.outcome ?? "");

  return (
    <Card size="sm">
      <CardContent className="flex flex-col gap-2">
        <div className="flex items-center justify-between gap-2">
          <span className="text-sm font-medium">{interview.round}</span>
          <div className="flex items-center gap-2">
            <Input
              value={outcome}
              onChange={(e) => setOutcome(e.target.value)}
              onBlur={() => onUpdate({ outcome: outcome || null })}
              placeholder="Outcome"
              className="h-7 w-32 text-xs"
            />
            <Button variant="ghost" size="sm" className="h-7 px-2 text-xs" onClick={onDelete}>
              ✕
            </Button>
          </div>
        </div>
        <Textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          onBlur={() => onUpdate({ notes: notes || null })}
          placeholder="Notes…"
          rows={2}
          className="text-xs"
        />
      </CardContent>
    </Card>
  );
}

// --- Resume versions ---

function ResumeVersionsSection() {
  const { data: versions } = useResumeVersions();
  const createVersion = useCreateResumeVersion();
  const [label, setLabel] = useState("");

  function addVersion() {
    if (!label.trim()) return;
    createVersion.mutate({ label: label.trim() });
    setLabel("");
  }

  return (
    <div className="flex flex-col gap-3">
      <h2 className="font-heading text-lg font-semibold">Resume Versions</h2>
      <div className="flex gap-2">
        <Input
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addVersion()}
          placeholder="Label (e.g. v3 - AI systems focus)…"
          className="h-8"
        />
        <Button type="button" size="sm" variant="secondary" onClick={addVersion}>
          Add
        </Button>
      </div>
      <div className="flex flex-col gap-2">
        {versions?.map((version) => (
          <ResumeVersionRow key={version.id} version={version} />
        ))}
        {versions && versions.length === 0 && (
          <p className="text-sm text-muted-foreground">No resume versions yet — add one above.</p>
        )}
      </div>
    </div>
  );
}

function ResumeVersionRow({ version }: { version: ResumeVersion }) {
  const updateVersion = useUpdateResumeVersion();
  const deleteVersion = useDeleteResumeVersion();
  const [fileUrl, setFileUrl] = useState(version.file_url ?? "");
  const [notes, setNotes] = useState(version.notes ?? "");

  return (
    <Card size="sm">
      <CardContent className="flex flex-col gap-2">
        <div className="flex items-center justify-between gap-2">
          <span className="text-sm font-medium">{version.label}</span>
          <Button variant="ghost" size="sm" className="h-7 px-2 text-xs" onClick={() => deleteVersion.mutate(version.id)}>
            ✕
          </Button>
        </div>
        <Input
          value={fileUrl}
          onChange={(e) => setFileUrl(e.target.value)}
          onBlur={() => updateVersion.mutate({ id: version.id, file_url: fileUrl || null })}
          placeholder="File URL…"
          className="h-7 text-xs"
        />
        <Input
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          onBlur={() => updateVersion.mutate({ id: version.id, notes: notes || null })}
          placeholder="Notes…"
          className="h-7 text-xs"
        />
      </CardContent>
    </Card>
  );
}
