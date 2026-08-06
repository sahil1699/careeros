from datetime import date

from pydantic import BaseModel, ConfigDict


class ReviewFields(BaseModel):
    what_built: str | None = None
    what_learned: str | None = None
    what_slowed: str | None = None
    what_stop: str | None = None
    what_proud: str | None = None
    what_next: str | None = None


class WeeklyReviewOut(ReviewFields):
    model_config = ConfigDict(from_attributes=True)

    id: int
    week_start: date


class WeeklyReviewUpsert(ReviewFields):
    pass


class MonthlyReviewOut(ReviewFields):
    model_config = ConfigDict(from_attributes=True)

    id: int
    month_start: date


class MonthlyReviewUpsert(ReviewFields):
    pass
