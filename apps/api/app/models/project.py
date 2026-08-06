import enum

from sqlalchemy import Enum, ForeignKey, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base
from app.models.mixins import TimestampMixin


class ProjectStatus(enum.StrEnum):
    idea = "idea"
    in_progress = "in_progress"
    paused = "paused"
    done = "done"


class KanbanColumn(enum.StrEnum):
    ideas = "ideas"
    todo = "todo"
    in_progress = "in_progress"
    done = "done"


class Project(Base, TimestampMixin):
    __tablename__ = "projects"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    name: Mapped[str] = mapped_column(String(200))
    status: Mapped[ProjectStatus] = mapped_column(
        Enum(ProjectStatus, name="project_status"), default=ProjectStatus.idea
    )
    current_sprint: Mapped[str | None] = mapped_column(Text, default=None)
    next_milestone: Mapped[str | None] = mapped_column(String(300), default=None)
    notes: Mapped[str | None] = mapped_column(Text, default=None)
    github_url: Mapped[str | None] = mapped_column(String(300), default=None)

    cards: Mapped[list["ProjectCard"]] = relationship(
        back_populates="project", cascade="all, delete-orphan", order_by="ProjectCard.position"
    )


class ProjectCard(Base, TimestampMixin):
    """One Kanban card. `position` is a float so a card can be dropped between
    two others by averaging, without renumbering the whole column."""

    __tablename__ = "project_cards"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    project_id: Mapped[int] = mapped_column(
        ForeignKey("projects.id", ondelete="CASCADE"), index=True
    )
    column: Mapped[KanbanColumn] = mapped_column(Enum(KanbanColumn, name="kanban_column"))
    title: Mapped[str] = mapped_column(String(300))
    description: Mapped[str | None] = mapped_column(Text, default=None)
    position: Mapped[float] = mapped_column(default=0)

    project: Mapped[Project] = relationship(back_populates="cards")
