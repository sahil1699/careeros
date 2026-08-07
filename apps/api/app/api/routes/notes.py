from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.api.deps import require_internal_key
from app.db.session import get_db
from app.models.notes import NotePage
from app.schemas.notes import NotePageCreate, NotePageOut, NotePageUpdate

router = APIRouter(prefix="/notes-pages", tags=["notes"], dependencies=[Depends(require_internal_key)])


@router.get("", response_model=list[NotePageOut])
def list_notes_pages(db: Session = Depends(get_db)) -> list[NotePage]:
    stmt = select(NotePage).order_by(NotePage.topic)
    return list(db.scalars(stmt))


@router.post("", response_model=NotePageOut, status_code=status.HTTP_201_CREATED)
def create_notes_page(payload: NotePageCreate, db: Session = Depends(get_db)) -> NotePage:
    page = NotePage(**payload.model_dump())
    db.add(page)
    db.commit()
    db.refresh(page)
    return page


@router.get("/{page_id}", response_model=NotePageOut)
def get_notes_page(page_id: int, db: Session = Depends(get_db)) -> NotePage:
    page = db.get(NotePage, page_id)
    if page is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Notes page not found")
    return page


@router.patch("/{page_id}", response_model=NotePageOut)
def update_notes_page(page_id: int, payload: NotePageUpdate, db: Session = Depends(get_db)) -> NotePage:
    page = db.get(NotePage, page_id)
    if page is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Notes page not found")
    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(page, field, value)
    db.commit()
    db.refresh(page)
    return page


@router.delete("/{page_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_notes_page(page_id: int, db: Session = Depends(get_db)) -> None:
    page = db.get(NotePage, page_id)
    if page is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Notes page not found")
    db.delete(page)
    db.commit()
