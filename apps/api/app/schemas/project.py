from pydantic import BaseModel, ConfigDict

from app.models.project import KanbanColumn, ProjectStatus


class ProjectCardOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    project_id: int
    column: KanbanColumn
    title: str
    description: str | None
    position: float


class ProjectCardCreate(BaseModel):
    column: KanbanColumn
    title: str
    description: str | None = None
    position: float = 0


class ProjectCardUpdate(BaseModel):
    column: KanbanColumn | None = None
    title: str | None = None
    description: str | None = None
    position: float | None = None


class ProjectOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    status: ProjectStatus
    current_sprint: str | None
    next_milestone: str | None
    notes: str | None
    github_url: str | None
    cards: list[ProjectCardOut]


class ProjectCreate(BaseModel):
    name: str
    status: ProjectStatus = ProjectStatus.idea
    current_sprint: str | None = None
    next_milestone: str | None = None
    notes: str | None = None
    github_url: str | None = None


class ProjectUpdate(BaseModel):
    name: str | None = None
    status: ProjectStatus | None = None
    current_sprint: str | None = None
    next_milestone: str | None = None
    notes: str | None = None
    github_url: str | None = None
