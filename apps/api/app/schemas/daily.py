from datetime import date

from pydantic import BaseModel, ConfigDict


class ChecklistItem(BaseModel):
    label: str
    done: bool = False


class DailyEntryOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    entry_date: date
    checklist: list[ChecklistItem]
    win: str | None
    learning: str | None
    blocked_by: str | None


class DailyEntryUpdate(BaseModel):
    checklist: list[ChecklistItem] | None = None
    win: str | None = None
    learning: str | None = None
    blocked_by: str | None = None
