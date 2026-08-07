from pydantic import BaseModel, ConfigDict

from app.models.content import ContentStage, ContentType


class ContentIdeaOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    idea: str
    stage: ContentStage
    content_type: ContentType
    notes: str | None
    repurposed_from_id: int | None


class ContentIdeaCreate(BaseModel):
    idea: str
    stage: ContentStage = ContentStage.idea
    content_type: ContentType
    notes: str | None = None
    repurposed_from_id: int | None = None


class ContentIdeaUpdate(BaseModel):
    idea: str | None = None
    stage: ContentStage | None = None
    content_type: ContentType | None = None
    notes: str | None = None
    repurposed_from_id: int | None = None
