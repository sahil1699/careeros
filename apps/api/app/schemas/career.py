from datetime import date

from pydantic import BaseModel, ConfigDict

from app.models.career import ApplicationStatus, CompanyStatus


class InterviewOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    application_id: int
    round: str
    interview_date: date | None
    notes: str | None
    outcome: str | None


class InterviewCreate(BaseModel):
    round: str
    interview_date: date | None = None
    notes: str | None = None
    outcome: str | None = None


class InterviewUpdate(BaseModel):
    round: str | None = None
    interview_date: date | None = None
    notes: str | None = None
    outcome: str | None = None


class ApplicationOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    company_id: int
    role: str
    applied_date: date | None
    status: ApplicationStatus
    notes: str | None
    interviews: list[InterviewOut]


class ApplicationCreate(BaseModel):
    role: str
    applied_date: date | None = None
    status: ApplicationStatus = ApplicationStatus.applied
    notes: str | None = None


class ApplicationUpdate(BaseModel):
    role: str | None = None
    applied_date: date | None = None
    status: ApplicationStatus | None = None
    notes: str | None = None


class CompanyOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    status: CompanyStatus
    url: str | None
    notes: str | None
    applications: list[ApplicationOut]


class CompanyCreate(BaseModel):
    name: str
    status: CompanyStatus = CompanyStatus.target
    url: str | None = None
    notes: str | None = None


class CompanyUpdate(BaseModel):
    name: str | None = None
    status: CompanyStatus | None = None
    url: str | None = None
    notes: str | None = None


class ResumeVersionOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    label: str
    file_url: str | None
    notes: str | None


class ResumeVersionCreate(BaseModel):
    label: str
    file_url: str | None = None
    notes: str | None = None


class ResumeVersionUpdate(BaseModel):
    label: str | None = None
    file_url: str | None = None
    notes: str | None = None
