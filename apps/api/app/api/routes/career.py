from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session, selectinload

from app.api.deps import require_internal_key
from app.db.session import get_db
from app.models.career import Application, Company, Interview, ResumeVersion
from app.schemas.career import (
    ApplicationCreate,
    ApplicationOut,
    ApplicationUpdate,
    CompanyCreate,
    CompanyOut,
    CompanyUpdate,
    InterviewCreate,
    InterviewOut,
    InterviewUpdate,
    ResumeVersionCreate,
    ResumeVersionOut,
    ResumeVersionUpdate,
)

router = APIRouter(prefix="/companies", tags=["career"], dependencies=[Depends(require_internal_key)])
resume_router = APIRouter(
    prefix="/resume-versions", tags=["career"], dependencies=[Depends(require_internal_key)]
)


def _company_query():
    return select(Company).options(selectinload(Company.applications).selectinload(Application.interviews))


def _get_company_or_404(db: Session, company_id: int) -> Company:
    company = db.scalar(_company_query().where(Company.id == company_id))
    if company is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Company not found")
    return company


def _get_application_or_404(db: Session, application_id: int) -> Application:
    application = db.scalar(
        select(Application)
        .options(selectinload(Application.interviews))
        .where(Application.id == application_id)
    )
    if application is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Application not found")
    return application


@router.get("", response_model=list[CompanyOut])
def list_companies(db: Session = Depends(get_db)) -> list[Company]:
    stmt = _company_query().order_by(Company.name)
    return list(db.scalars(stmt))


@router.post("", response_model=CompanyOut, status_code=status.HTTP_201_CREATED)
def create_company(payload: CompanyCreate, db: Session = Depends(get_db)) -> Company:
    company = Company(**payload.model_dump())
    db.add(company)
    db.commit()
    db.refresh(company)
    return _get_company_or_404(db, company.id)


@router.get("/{company_id}", response_model=CompanyOut)
def get_company(company_id: int, db: Session = Depends(get_db)) -> Company:
    return _get_company_or_404(db, company_id)


@router.patch("/{company_id}", response_model=CompanyOut)
def update_company(company_id: int, payload: CompanyUpdate, db: Session = Depends(get_db)) -> Company:
    company = _get_company_or_404(db, company_id)
    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(company, field, value)
    db.commit()
    db.refresh(company)
    return _get_company_or_404(db, company_id)


@router.delete("/{company_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_company(company_id: int, db: Session = Depends(get_db)) -> None:
    company = db.get(Company, company_id)
    if company is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Company not found")
    db.delete(company)
    db.commit()


@router.post("/{company_id}/applications", response_model=ApplicationOut, status_code=status.HTTP_201_CREATED)
def create_application(
    company_id: int, payload: ApplicationCreate, db: Session = Depends(get_db)
) -> Application:
    _get_company_or_404(db, company_id)
    application = Application(company_id=company_id, **payload.model_dump())
    db.add(application)
    db.commit()
    db.refresh(application)
    return _get_application_or_404(db, application.id)


@router.patch("/applications/{application_id}", response_model=ApplicationOut)
def update_application(
    application_id: int, payload: ApplicationUpdate, db: Session = Depends(get_db)
) -> Application:
    application = _get_application_or_404(db, application_id)
    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(application, field, value)
    db.commit()
    db.refresh(application)
    return _get_application_or_404(db, application_id)


@router.delete("/applications/{application_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_application(application_id: int, db: Session = Depends(get_db)) -> None:
    application = db.get(Application, application_id)
    if application is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Application not found")
    db.delete(application)
    db.commit()


@router.post(
    "/applications/{application_id}/interviews",
    response_model=InterviewOut,
    status_code=status.HTTP_201_CREATED,
)
def create_interview(application_id: int, payload: InterviewCreate, db: Session = Depends(get_db)) -> Interview:
    _get_application_or_404(db, application_id)
    interview = Interview(application_id=application_id, **payload.model_dump())
    db.add(interview)
    db.commit()
    db.refresh(interview)
    return interview


@router.patch("/interviews/{interview_id}", response_model=InterviewOut)
def update_interview(interview_id: int, payload: InterviewUpdate, db: Session = Depends(get_db)) -> Interview:
    interview = db.get(Interview, interview_id)
    if interview is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Interview not found")
    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(interview, field, value)
    db.commit()
    db.refresh(interview)
    return interview


@router.delete("/interviews/{interview_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_interview(interview_id: int, db: Session = Depends(get_db)) -> None:
    interview = db.get(Interview, interview_id)
    if interview is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Interview not found")
    db.delete(interview)
    db.commit()


@resume_router.get("", response_model=list[ResumeVersionOut])
def list_resume_versions(db: Session = Depends(get_db)) -> list[ResumeVersion]:
    stmt = select(ResumeVersion).order_by(ResumeVersion.created_at.desc())
    return list(db.scalars(stmt))


@resume_router.post("", response_model=ResumeVersionOut, status_code=status.HTTP_201_CREATED)
def create_resume_version(payload: ResumeVersionCreate, db: Session = Depends(get_db)) -> ResumeVersion:
    version = ResumeVersion(**payload.model_dump())
    db.add(version)
    db.commit()
    db.refresh(version)
    return version


@resume_router.patch("/{version_id}", response_model=ResumeVersionOut)
def update_resume_version(
    version_id: int, payload: ResumeVersionUpdate, db: Session = Depends(get_db)
) -> ResumeVersion:
    version = db.get(ResumeVersion, version_id)
    if version is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Resume version not found")
    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(version, field, value)
    db.commit()
    db.refresh(version)
    return version


@resume_router.delete("/{version_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_resume_version(version_id: int, db: Session = Depends(get_db)) -> None:
    version = db.get(ResumeVersion, version_id)
    if version is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Resume version not found")
    db.delete(version)
    db.commit()
