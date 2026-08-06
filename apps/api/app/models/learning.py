import enum

from sqlalchemy import Boolean, Enum, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base
from app.models.mixins import TimestampMixin


class SystemDesignTopic(Base, TimestampMixin):
    """The Read/Diagram/Notes/Implemented columns from the notes.md table —
    the goal is "Implemented", not "Read"."""

    __tablename__ = "system_design_topics"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    topic: Mapped[str] = mapped_column(String(200), unique=True)
    read: Mapped[bool] = mapped_column(Boolean, default=False)
    diagram: Mapped[bool] = mapped_column(Boolean, default=False)
    notes: Mapped[bool] = mapped_column(Boolean, default=False)
    implemented: Mapped[bool] = mapped_column(Boolean, default=False)


class DsaPattern(Base, TimestampMixin):
    """Tracks patterns, not individual LeetCode numbers — per notes.md."""

    __tablename__ = "dsa_patterns"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    pattern: Mapped[str] = mapped_column(String(200), unique=True)
    category: Mapped[str | None] = mapped_column(String(120), default=None)
    understanding: Mapped[int] = mapped_column(Integer, default=0)  # 1-5 stars
    confidence: Mapped[int] = mapped_column(Integer, default=0)  # 1-5 stars
    needs_revision: Mapped[bool] = mapped_column(Boolean, default=True)
    notes: Mapped[str | None] = mapped_column(Text, default=None)


class AiTopicStatus(enum.StrEnum):
    not_started = "not_started"
    in_progress = "in_progress"
    done = "done"


class AiTopic(Base, TimestampMixin):
    __tablename__ = "ai_topics"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    topic: Mapped[str] = mapped_column(String(200), unique=True)
    status: Mapped[AiTopicStatus] = mapped_column(
        Enum(AiTopicStatus, name="ai_topic_status"), default=AiTopicStatus.not_started
    )
    notes: Mapped[str | None] = mapped_column(Text, default=None)
    mini_project: Mapped[str | None] = mapped_column(String(300), default=None)


class ReadingStatus(enum.StrEnum):
    to_read = "to_read"
    reading = "reading"
    done = "done"


class ReadingListItem(Base, TimestampMixin):
    __tablename__ = "reading_list"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    title: Mapped[str] = mapped_column(String(300))
    source: Mapped[str | None] = mapped_column(String(300), default=None)
    status: Mapped[ReadingStatus] = mapped_column(
        Enum(ReadingStatus, name="reading_status"), default=ReadingStatus.to_read
    )
    notes: Mapped[str | None] = mapped_column(Text, default=None)
