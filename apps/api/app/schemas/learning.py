from pydantic import BaseModel, ConfigDict

from app.models.learning import AiTopicStatus, ReadingStatus


class SystemDesignTopicOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    topic: str
    read: bool
    diagram: bool
    notes: bool
    implemented: bool


class SystemDesignTopicCreate(BaseModel):
    topic: str
    read: bool = False
    diagram: bool = False
    notes: bool = False
    implemented: bool = False


class SystemDesignTopicUpdate(BaseModel):
    topic: str | None = None
    read: bool | None = None
    diagram: bool | None = None
    notes: bool | None = None
    implemented: bool | None = None


class DsaPatternOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    pattern: str
    category: str | None
    understanding: int
    confidence: int
    needs_revision: bool
    notes: str | None


class DsaPatternCreate(BaseModel):
    pattern: str
    category: str | None = None
    understanding: int = 0
    confidence: int = 0
    needs_revision: bool = True
    notes: str | None = None


class DsaPatternUpdate(BaseModel):
    pattern: str | None = None
    category: str | None = None
    understanding: int | None = None
    confidence: int | None = None
    needs_revision: bool | None = None
    notes: str | None = None


class AiTopicOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    topic: str
    status: AiTopicStatus
    notes: str | None
    mini_project: str | None


class AiTopicCreate(BaseModel):
    topic: str
    status: AiTopicStatus = AiTopicStatus.not_started
    notes: str | None = None
    mini_project: str | None = None


class AiTopicUpdate(BaseModel):
    topic: str | None = None
    status: AiTopicStatus | None = None
    notes: str | None = None
    mini_project: str | None = None


class ReadingListItemOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    title: str
    source: str | None
    status: ReadingStatus
    notes: str | None


class ReadingListItemCreate(BaseModel):
    title: str
    source: str | None = None
    status: ReadingStatus = ReadingStatus.to_read
    notes: str | None = None


class ReadingListItemUpdate(BaseModel):
    title: str | None = None
    source: str | None = None
    status: ReadingStatus | None = None
    notes: str | None = None
