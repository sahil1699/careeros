from datetime import date

from sqlalchemy import JSON, Date, Integer, String
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base
from app.models.mixins import TimestampMixin


class DailyEntry(Base, TimestampMixin):
    """One row per day — the Daily Dashboard page. `checklist` is a small
    freeform list so the items themselves stay editable without a migration."""

    __tablename__ = "daily_entries"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    entry_date: Mapped[date] = mapped_column(Date, unique=True, index=True)
    # [{"label": "30 min System Design", "done": true}, ...]
    checklist: Mapped[list] = mapped_column(JSON, default=list)
    win: Mapped[str | None] = mapped_column(String(1000), default=None)
    learning: Mapped[str | None] = mapped_column(String(1000), default=None)
    blocked_by: Mapped[str | None] = mapped_column(String(1000), default=None)
