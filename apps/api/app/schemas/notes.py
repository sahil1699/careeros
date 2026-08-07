from pydantic import BaseModel, ConfigDict


class NotePageOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    topic: str
    content: str | None
    tags: list[str]


class NotePageCreate(BaseModel):
    topic: str
    content: str | None = None
    tags: list[str] = []


class NotePageUpdate(BaseModel):
    topic: str | None = None
    content: str | None = None
    tags: list[str] | None = None
