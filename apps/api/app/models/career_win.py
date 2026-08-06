from datetime import date

from sqlalchemy import Date, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base
from app.models.mixins import TimestampMixin


class CareerWin(Base, TimestampMixin):
    """Running log of wins — read this on a bad day."""

    __tablename__ = "career_wins"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    win_date: Mapped[date] = mapped_column(Date, index=True)
    title: Mapped[str] = mapped_column(String(300))
    description: Mapped[str | None] = mapped_column(Text, default=None)
