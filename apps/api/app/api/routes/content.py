from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.api.deps import require_internal_key
from app.db.session import get_db
from app.models.content import ContentIdea
from app.schemas.content import ContentIdeaCreate, ContentIdeaOut, ContentIdeaUpdate

router = APIRouter(prefix="/content-ideas", tags=["content"], dependencies=[Depends(require_internal_key)])


@router.get("", response_model=list[ContentIdeaOut])
def list_content_ideas(db: Session = Depends(get_db)) -> list[ContentIdea]:
    stmt = select(ContentIdea).order_by(ContentIdea.created_at.desc())
    return list(db.scalars(stmt))


@router.post("", response_model=ContentIdeaOut, status_code=status.HTTP_201_CREATED)
def create_content_idea(payload: ContentIdeaCreate, db: Session = Depends(get_db)) -> ContentIdea:
    idea = ContentIdea(**payload.model_dump())
    db.add(idea)
    db.commit()
    db.refresh(idea)
    return idea


@router.patch("/{idea_id}", response_model=ContentIdeaOut)
def update_content_idea(idea_id: int, payload: ContentIdeaUpdate, db: Session = Depends(get_db)) -> ContentIdea:
    idea = db.get(ContentIdea, idea_id)
    if idea is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Content idea not found")
    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(idea, field, value)
    db.commit()
    db.refresh(idea)
    return idea


@router.delete("/{idea_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_content_idea(idea_id: int, db: Session = Depends(get_db)) -> None:
    idea = db.get(ContentIdea, idea_id)
    if idea is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Content idea not found")
    db.delete(idea)
    db.commit()
