from datetime import date

from pydantic import BaseModel, ConfigDict


class CareerWinOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    win_date: date
    title: str
    description: str | None


class CareerWinCreate(BaseModel):
    win_date: date
    title: str
    description: str | None = None
