from datetime import date

from sqlalchemy import Date, Integer
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base
from app.models.mixins import TimestampMixin

# Weekly goal targets from the notes.md metrics table. Not a DB table —
# these are constants the UI compares actuals against for the progress bars.
WEEKLY_METRIC_GOALS = {
    "git_commits": 5,
    "project_features": 2,
    "dsa_patterns_revised": 2,
    "system_design_topics": 2,
    "twitter_posts": 7,
    "linkedin_posts": 1,
    "blog_updates": 1,
    "books_articles": 2,
    "mock_interviews": 1,  # from month 3 onward
}


class WeeklyMetric(Base, TimestampMixin):
    __tablename__ = "weekly_metrics"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    week_start: Mapped[date] = mapped_column(Date, unique=True, index=True)
    git_commits: Mapped[int] = mapped_column(Integer, default=0)
    project_features: Mapped[int] = mapped_column(Integer, default=0)
    dsa_patterns_revised: Mapped[int] = mapped_column(Integer, default=0)
    system_design_topics: Mapped[int] = mapped_column(Integer, default=0)
    twitter_posts: Mapped[int] = mapped_column(Integer, default=0)
    linkedin_posts: Mapped[int] = mapped_column(Integer, default=0)
    blog_updates: Mapped[int] = mapped_column(Integer, default=0)
    books_articles: Mapped[int] = mapped_column(Integer, default=0)
    mock_interviews: Mapped[int] = mapped_column(Integer, default=0)
