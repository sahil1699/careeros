import calendar
import io
from datetime import date, timedelta

from fastapi import APIRouter, Depends, HTTPException, Query, status
from fastapi.responses import StreamingResponse
from openpyxl import Workbook
from sqlalchemy import delete, select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.api.deps import require_internal_key
from app.db.session import get_db
from app.models.daily import DailyEntry
from app.schemas.daily import DailyEntryOut, DailyEntryUpdate

router = APIRouter(prefix="/daily-entries", tags=["daily"], dependencies=[Depends(require_internal_key)])

GRACE_DAYS = 10  # days into the following month before an unexported month is auto-deleted


def _get_or_create(db: Session, entry_date: date) -> DailyEntry:
    entry = db.scalar(select(DailyEntry).where(DailyEntry.entry_date == entry_date))
    if entry is not None:
        return entry

    # Home and Daily can both call GET /today within the same instant on
    # first load, so a plain select-then-insert can lose a race: catch the
    # unique-constraint violation and read back whichever request won it.
    entry = DailyEntry(entry_date=entry_date, checklist=[])
    db.add(entry)
    try:
        db.commit()
    except IntegrityError:
        db.rollback()
        entry = db.scalar(select(DailyEntry).where(DailyEntry.entry_date == entry_date))
        assert entry is not None, "insert raced with a delete, not just another insert"
        return entry
    db.refresh(entry)
    return entry


def _month_bounds(year: int, month: int) -> tuple[date, date]:
    last_day = calendar.monthrange(year, month)[1]
    return date(year, month, 1), date(year, month, last_day)


def _next_month(year: int, month: int) -> tuple[int, int]:
    return (year + 1, 1) if month == 12 else (year, month + 1)


def _grace_deadline(year: int, month: int) -> date:
    """The month's data is deletable once today reaches this date — the
    GRACE_DAYS-th day of the month after it."""
    ny, nm = _next_month(year, month)
    return date(ny, nm, 1) + timedelta(days=GRACE_DAYS)


# --- literal/specific routes first — see projects.py for why order matters
# when a route also declares a catch-all like /{entry_date} ---


@router.get("/today", response_model=DailyEntryOut)
def get_today(db: Session = Depends(get_db)) -> DailyEntry:
    return _get_or_create(db, date.today())


@router.get("/archive-status")
def archive_status(db: Session = Depends(get_db)) -> dict:
    """Called on app load. Deletes any month that's past its grace period,
    and reports the most recent still-pending month (if any) so the UI can
    show a "download this before it's gone" banner. At most one month is
    ever pending at a time — anything older would already be expired."""
    today = date.today()
    current_month_start = date(today.year, today.month, 1)

    old_dates = db.scalars(select(DailyEntry.entry_date).where(DailyEntry.entry_date < current_month_start)).all()
    months_present = {(d.year, d.month) for d in old_dates}

    pending_candidates = []
    for year, month in months_present:
        deadline = _grace_deadline(year, month)
        if today >= deadline:
            start, end = _month_bounds(year, month)
            db.execute(delete(DailyEntry).where(DailyEntry.entry_date >= start, DailyEntry.entry_date <= end))
        else:
            pending_candidates.append((year, month, deadline))
    db.commit()

    pending = None
    if pending_candidates:
        year, month, deadline = max(pending_candidates, key=lambda t: (t[0], t[1]))
        pending = {"year": year, "month": month, "days_left": (deadline - today).days}
    return {"pending": pending}


@router.get("/export/{year}/{month}")
def export_month(year: int, month: int, db: Session = Depends(get_db)) -> StreamingResponse:
    """Streams the month as an .xlsx, then deletes it — the file *is* the
    archive from here on, not a copy of it."""
    today = date.today()
    if (year, month) >= (today.year, today.month):
        raise HTTPException(status.HTTP_400_BAD_REQUEST, "Can only export a fully completed past month")

    start, end = _month_bounds(year, month)
    stmt = (
        select(DailyEntry)
        .where(DailyEntry.entry_date >= start, DailyEntry.entry_date <= end)
        .order_by(DailyEntry.entry_date)
    )
    entries = list(db.scalars(stmt))
    if not entries:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "No data for that month")

    wb = Workbook()
    ws = wb.active
    ws.title = "Daily Log"
    ws.append(["Date", "Completed Tasks", "Win", "Learning", "Blocked By"])
    for entry in entries:
        completed = ", ".join(item.get("label", "") for item in (entry.checklist or []) if item.get("done"))
        ws.append(
            [entry.entry_date.isoformat(), completed, entry.win or "", entry.learning or "", entry.blocked_by or ""]
        )

    buffer = io.BytesIO()
    wb.save(buffer)
    buffer.seek(0)

    db.execute(delete(DailyEntry).where(DailyEntry.entry_date >= start, DailyEntry.entry_date <= end))
    db.commit()

    filename = f"{calendar.month_name[month]} {year}.xlsx"
    return StreamingResponse(
        buffer,
        media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        headers={"Content-Disposition": f'attachment; filename="{filename}"'},
    )


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
