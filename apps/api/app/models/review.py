from datetime import date

from sqlalchemy import Date, Integer, Text
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base
from app.models.mixins import TimestampMixin


class ReviewFieldsMixin:
    """The same 6 reflective questions drive both weekly and monthly reviews —
    just a different cadence, so one shape covers both."""

    what_built: Mapped[str | None] = mapped_column(Text, default=None)
    what_learned: Mapped[str | None] = mapped_column(Text, default=None)
    what_slowed: Mapped[str | None] = mapped_column(Text, default=None)
    what_stop: Mapped[str | None] = mapped_column(Text, default=None)
    what_proud: Mapped[str | None] = mapped_column(Text, default=None)
    what_next: Mapped[str | None] = mapped_column(Text, default=None)


class WeeklyReview(Base, TimestampMixin, ReviewFieldsMixin):
    __tablename__ = "weekly_reviews"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    week_start: Mapped[date] = mapped_column(Date, unique=True, index=True)


class MonthlyReview(Base, TimestampMixin, ReviewFieldsMixin):
    __tablename__ = "monthly_reviews"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    month_start: Mapped[date] = mapped_column(Date, unique=True, index=True)
