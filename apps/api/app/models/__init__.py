"""Importing every model module registers it on Base.metadata — this is what
Alembic's autogenerate (and `Base.metadata.create_all` in tests) relies on."""

from app.models.career import Application, Company, Interview, ResumeVersion  # noqa: F401
from app.models.career_win import CareerWin  # noqa: F401
from app.models.content import ContentIdea  # noqa: F401
from app.models.daily import DailyEntry  # noqa: F401
from app.models.learning import (  # noqa: F401
    AiTopic,
    DsaPattern,
    DsaQuestion,
    ReadingListItem,
    SystemDesignTopic,
)
from app.models.metrics import WeeklyMetric  # noqa: F401
from app.models.mission import Mission  # noqa: F401
from app.models.notes import NotePage  # noqa: F401
from app.models.project import Project, ProjectCard  # noqa: F401
from app.models.review import MonthlyReview, WeeklyReview  # noqa: F401

__all__ = [
    "Application",
    "Company",
    "Interview",
    "ResumeVersion",
    "CareerWin",
    "ContentIdea",
    "DailyEntry",
    "AiTopic",
    "DsaPattern",
    "DsaQuestion",
    "ReadingListItem",
    "SystemDesignTopic",
    "WeeklyMetric",
    "Mission",
    "NotePage",
    "Project",
    "ProjectCard",
    "MonthlyReview",
    "WeeklyReview",
]
