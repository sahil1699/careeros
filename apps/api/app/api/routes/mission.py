from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.api.deps import require_internal_key
from app.db.session import get_db
from app.models.mission import Mission
from app.schemas.mission import MissionOut, MissionUpdate

router = APIRouter(prefix="/mission", tags=["mission"], dependencies=[Depends(require_internal_key)])

MISSION_ID = 1  # singleton row


def _get_or_create(db: Session) -> Mission:
    mission = db.get(Mission, MISSION_ID)
    if mission is None:
        mission = Mission(id=MISSION_ID, target_companies=[])
        db.add(mission)
        db.commit()
        db.refresh(mission)
    return mission


@router.get("", response_model=MissionOut)
def get_mission(db: Session = Depends(get_db)) -> Mission:
    return _get_or_create(db)


@router.put("", response_model=MissionOut)
def update_mission(payload: MissionUpdate, db: Session = Depends(get_db)) -> Mission:
    mission = _get_or_create(db)
    updates = payload.model_dump(exclude_unset=True)  # nested TargetCompany models become plain dicts here
    for field, value in updates.items():
        setattr(mission, field, value)
    db.commit()
    db.refresh(mission)
    return mission
