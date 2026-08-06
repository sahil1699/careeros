from sqlalchemy import JSON, Integer, String
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base
from app.models.mixins import TimestampMixin


class Mission(Base, TimestampMixin):
    """Singleton table — always exactly one row (id=1). Holds the north-star
    info shown at the top of the Home/Mission page."""

    __tablename__ = "mission"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    # [{"name": "OpenAI", "checked": false}, ...]
    target_companies: Mapped[list] = mapped_column(JSON, default=list)
    salary_goal: Mapped[str | None] = mapped_column(String(120), default=None)
    deadline: Mapped[str | None] = mapped_column(String(120), default=None)
    north_star: Mapped[str | None] = mapped_column(String(500), default=None)
