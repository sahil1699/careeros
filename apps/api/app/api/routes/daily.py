from datetime import date

from fastapi import APIRouter, Depends, Query
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.api.deps import require_internal_key
from app.db.session import get_db
from app.models.daily import DailyEntry
from app.schemas.daily import DailyEntryOut, DailyEntryUpdate

router = APIRouter(prefix="/daily-entries", tags=["daily"], dependencies=[Depends(require_internal_key)])


def _get_or_create(db: Session, entry_date: date) -> DailyEntry:
    entry = db.scalar(select(DailyEntry).where(DailyEntry.entry_date == entry_date))
    if entry is None:
        entry = DailyEntry(entry_date=entry_date, checklist=[])
        db.add(entry)
        db.commit()
        db.refresh(entry)
    return entry


@router.get("/today", response_model=DailyEntryOut)
def get_today(db: Session = Depends(get_db)) -> DailyEntry:
    return _get_or_create(db, date.today())


@router.get("", response_model=list[DailyEntryOut])
def list_entries(limit: int = Query(default=30, le=200), db: Session = Depends(get_db)) -> list[DailyEntry]:
    stmt = select(DailyEntry).order_by(DailyEntry.entry_date.desc()).limit(limit)
    return list(db.scalars(stmt))


@router.get("/{entry_date}", response_model=DailyEntryOut)
def get_entry(entry_date: date, db: Session = Depends(get_db)) -> DailyEntry:
    return _get_or_create(db, entry_date)


@router.put("/{entry_date}", response_model=DailyEntryOut)
def upsert_entry(entry_date: date, payload: DailyEntryUpdate, db: Session = Depends(get_db)) -> DailyEntry:
    entry = _get_or_create(db, entry_date)
    updates = payload.model_dump(exclude_unset=True)
    for field, value in updates.items():
        setattr(entry, field, value)
    db.commit()
    db.refresh(entry)
    return entry
