from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.api.deps import require_internal_key
from app.db.session import get_db
from app.models.career_win import CareerWin
from app.schemas.career_win import CareerWinCreate, CareerWinOut

router = APIRouter(prefix="/career-wins", tags=["career-wins"], dependencies=[Depends(require_internal_key)])


@router.get("", response_model=list[CareerWinOut])
def list_wins(limit: int = Query(default=100, le=500), db: Session = Depends(get_db)) -> list[CareerWin]:
    stmt = select(CareerWin).order_by(CareerWin.win_date.desc(), CareerWin.id.desc()).limit(limit)
    return list(db.scalars(stmt))


@router.post("", response_model=CareerWinOut, status_code=status.HTTP_201_CREATED)
def create_win(payload: CareerWinCreate, db: Session = Depends(get_db)) -> CareerWin:
    win = CareerWin(**payload.model_dump())
    db.add(win)
    db.commit()
    db.refresh(win)
    return win


@router.delete("/{win_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_win(win_id: int, db: Session = Depends(get_db)) -> None:
    win = db.get(CareerWin, win_id)
    if win is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Career win not found")
    db.delete(win)
    db.commit()
