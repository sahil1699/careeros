from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session, selectinload

from app.api.deps import require_internal_key
from app.db.session import get_db
from app.models.project import Project, ProjectCard
from app.schemas.project import (
    ProjectCardCreate,
    ProjectCardOut,
    ProjectCardUpdate,
    ProjectCreate,
    ProjectOut,
    ProjectUpdate,
)

router = APIRouter(prefix="/projects", tags=["projects"], dependencies=[Depends(require_internal_key)])


def _get_project_or_404(db: Session, project_id: int) -> Project:
    project = db.scalar(
        select(Project).options(selectinload(Project.cards)).where(Project.id == project_id)
    )
    if project is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Project not found")
    return project


@router.get("", response_model=list[ProjectOut])
def list_projects(db: Session = Depends(get_db)) -> list[Project]:
    stmt = select(Project).options(selectinload(Project.cards)).order_by(Project.created_at.desc())
    return list(db.scalars(stmt))


@router.post("", response_model=ProjectOut, status_code=status.HTTP_201_CREATED)
def create_project(payload: ProjectCreate, db: Session = Depends(get_db)) -> Project:
    project = Project(**payload.model_dump())
    db.add(project)
    db.commit()
    db.refresh(project)
    return project


@router.get("/{project_id}", response_model=ProjectOut)
def get_project(project_id: int, db: Session = Depends(get_db)) -> Project:
    return _get_project_or_404(db, project_id)


@router.patch("/{project_id}", response_model=ProjectOut)
def update_project(project_id: int, payload: ProjectUpdate, db: Session = Depends(get_db)) -> Project:
    project = _get_project_or_404(db, project_id)
    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(project, field, value)
    db.commit()
    db.refresh(project)
    return project


@router.delete("/{project_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_project(project_id: int, db: Session = Depends(get_db)) -> None:
    project = db.get(Project, project_id)
    if project is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Project not found")
    db.delete(project)
    db.commit()


@router.post("/{project_id}/cards", response_model=ProjectCardOut, status_code=status.HTTP_201_CREATED)
def create_card(project_id: int, payload: ProjectCardCreate, db: Session = Depends(get_db)) -> ProjectCard:
    _get_project_or_404(db, project_id)  # 404s cleanly instead of a raw FK-violation
    card = ProjectCard(project_id=project_id, **payload.model_dump())
    db.add(card)
    db.commit()
    db.refresh(card)
    return card


@router.patch("/cards/{card_id}", response_model=ProjectCardOut)
def update_card(card_id: int, payload: ProjectCardUpdate, db: Session = Depends(get_db)) -> ProjectCard:
    card = db.get(ProjectCard, card_id)
    if card is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Card not found")
    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(card, field, value)
    db.commit()
    db.refresh(card)
    return card


@router.delete("/cards/{card_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_card(card_id: int, db: Session = Depends(get_db)) -> None:
    card = db.get(ProjectCard, card_id)
    if card is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Card not found")
    db.delete(card)
    db.commit()
