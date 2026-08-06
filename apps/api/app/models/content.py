import enum

from sqlalchemy import Enum, ForeignKey, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base
from app.models.mixins import TimestampMixin


class ContentStage(enum.StrEnum):
    idea = "idea"
    writing = "writing"
    scheduled = "scheduled"
    posted = "posted"


class ContentType(enum.StrEnum):
    tweet = "tweet"
    linkedin = "linkedin"
    blog = "blog"
    readme = "readme"


class ContentIdea(Base, TimestampMixin):
    """One idea can become several rows via `repurposed_from_id` — e.g. a
    LinkedIn post that gets repurposed into a Twitter thread. Never waste an idea."""

    __tablename__ = "content_ideas"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    idea: Mapped[str] = mapped_column(String(500))
    stage: Mapped[ContentStage] = mapped_column(
        Enum(ContentStage, name="content_stage"), default=ContentStage.idea
    )
    content_type: Mapped[ContentType] = mapped_column(Enum(ContentType, name="content_type"))
    notes: Mapped[str | None] = mapped_column(Text, default=None)
    repurposed_from_id: Mapped[int | None] = mapped_column(
        ForeignKey("content_ideas.id", ondelete="SET NULL"), default=None
    )
