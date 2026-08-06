from sqlalchemy import JSON, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base
from app.models.mixins import TimestampMixin


class NotePage(Base, TimestampMixin):
    """One page per topic (e.g. "Redis") instead of scattered notes — per
    notes.md's "Learning Notes" section. `content` is markdown."""

    __tablename__ = "notes_pages"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    topic: Mapped[str] = mapped_column(String(200), unique=True)
    content: Mapped[str | None] = mapped_column(Text, default=None)
    tags: Mapped[list] = mapped_column(JSON, default=list)
