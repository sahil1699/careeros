from datetime import date

from fastapi import APIRouter, Depends, Query
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.api.deps import require_internal_key
from app.db.session import get_db
from app.models.review import MonthlyReview, WeeklyReview
from app.schemas.review import (
    MonthlyReviewOut,
    MonthlyReviewUpsert,
    WeeklyReviewOut,
    WeeklyReviewUpsert,
)

router = APIRouter(prefix="/reviews", tags=["reviews"], dependencies=[Depends(require_internal_key)])


@router.get("/weekly", response_model=list[WeeklyReviewOut])
def list_weekly(limit: int = Query(default=52, le=200), db: Session = Depends(get_db)) -> list[WeeklyReview]:
    stmt = select(WeeklyReview).order_by(WeeklyReview.week_start.desc()).limit(limit)
    return list(db.scalars(stmt))


@router.put("/weekly/{week_start}", response_model=WeeklyReviewOut)
def upsert_weekly(week_start: date, payload: WeeklyReviewUpsert, db: Session = Depends(get_db)) -> WeeklyReview:
    review = db.scalar(select(WeeklyReview).where(WeeklyReview.week_start == week_start))
    if review is None:
        review = WeeklyReview(week_start=week_start)
        db.add(review)
    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(review, field, value)
    db.commit()
    db.refresh(review)
    return review


@router.get("/monthly", response_model=list[MonthlyReviewOut])
def list_monthly(limit: int = Query(default=24, le=200), db: Session = Depends(get_db)) -> list[MonthlyReview]:
    stmt = select(MonthlyReview).order_by(MonthlyReview.month_start.desc()).limit(limit)
    return list(db.scalars(stmt))


@router.put("/monthly/{month_start}", response_model=MonthlyReviewOut)
def upsert_monthly(month_start: date, payload: MonthlyReviewUpsert, db: Session = Depends(get_db)) -> MonthlyReview:
    review = db.scalar(select(MonthlyReview).where(MonthlyReview.month_start == month_start))
    if review is None:
        review = MonthlyReview(month_start=month_start)
        db.add(review)
    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(review, field, value)
    db.commit()
    db.refresh(review)
    return review
