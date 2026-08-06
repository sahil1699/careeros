from pydantic import BaseModel, ConfigDict


class TargetCompany(BaseModel):
    name: str
    checked: bool = False


class MissionOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    target_companies: list[TargetCompany]
    salary_goal: str | None
    deadline: str | None
    north_star: str | None


class MissionUpdate(BaseModel):
    target_companies: list[TargetCompany] | None = None
    salary_goal: str | None = None
    deadline: str | None = None
    north_star: str | None = None
