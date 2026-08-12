from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session, selectinload

from app.api.deps import require_internal_key
from app.db.session import get_db
from app.models.learning import AiTopic, DsaPattern, DsaQuestion, ReadingListItem, SystemDesignTopic
from app.schemas.learning import (
    AiTopicCreate,
    AiTopicOut,
    AiTopicUpdate,
    DsaPatternCreate,
    DsaPatternOut,
    DsaPatternUpdate,
    DsaQuestionCreate,
    DsaQuestionOut,
    DsaQuestionUpdate,
    ReadingListItemCreate,
    ReadingListItemOut,
    ReadingListItemUpdate,
    SystemDesignTopicCreate,
    SystemDesignTopicOut,
    SystemDesignTopicUpdate,
)

system_design_router = APIRouter(
    prefix="/system-design-topics", tags=["learning"], dependencies=[Depends(require_internal_key)]
)
dsa_router = APIRouter(prefix="/dsa-patterns", tags=["learning"], dependencies=[Depends(require_internal_key)])
ai_topics_router = APIRouter(prefix="/ai-topics", tags=["learning"], dependencies=[Depends(require_internal_key)])
reading_list_router = APIRouter(prefix="/reading-list", tags=["learning"], dependencies=[Depends(require_internal_key)])


@system_design_router.get("", response_model=list[SystemDesignTopicOut])
def list_system_design_topics(db: Session = Depends(get_db)) -> list[SystemDesignTopic]:
    stmt = select(SystemDesignTopic).order_by(SystemDesignTopic.topic)
    return list(db.scalars(stmt))


@system_design_router.post("", response_model=SystemDesignTopicOut, status_code=status.HTTP_201_CREATED)
def create_system_design_topic(
    payload: SystemDesignTopicCreate, db: Session = Depends(get_db)
) -> SystemDesignTopic:
    topic = SystemDesignTopic(**payload.model_dump())
    db.add(topic)
    db.commit()
    db.refresh(topic)
    return topic


@system_design_router.patch("/{topic_id}", response_model=SystemDesignTopicOut)
def update_system_design_topic(
    topic_id: int, payload: SystemDesignTopicUpdate, db: Session = Depends(get_db)
) -> SystemDesignTopic:
    topic = db.get(SystemDesignTopic, topic_id)
    if topic is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "System design topic not found")
    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(topic, field, value)
    db.commit()
    db.refresh(topic)
    return topic


@system_design_router.delete("/{topic_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_system_design_topic(topic_id: int, db: Session = Depends(get_db)) -> None:
    topic = db.get(SystemDesignTopic, topic_id)
    if topic is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "System design topic not found")
    db.delete(topic)
    db.commit()


@dsa_router.get("", response_model=list[DsaPatternOut])
def list_dsa_patterns(db: Session = Depends(get_db)) -> list[DsaPattern]:
    stmt = select(DsaPattern).options(selectinload(DsaPattern.questions)).order_by(DsaPattern.pattern)
    return list(db.scalars(stmt))


@dsa_router.post("", response_model=DsaPatternOut, status_code=status.HTTP_201_CREATED)
def create_dsa_pattern(payload: DsaPatternCreate, db: Session = Depends(get_db)) -> DsaPattern:
    pattern = DsaPattern(**payload.model_dump())
    db.add(pattern)
    db.commit()
    db.refresh(pattern)
    return pattern


@dsa_router.patch("/{pattern_id}", response_model=DsaPatternOut)
def update_dsa_pattern(pattern_id: int, payload: DsaPatternUpdate, db: Session = Depends(get_db)) -> DsaPattern:
    pattern = db.get(DsaPattern, pattern_id)
    if pattern is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "DSA pattern not found")
    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(pattern, field, value)
    db.commit()
    db.refresh(pattern)
    return pattern


@dsa_router.delete("/{pattern_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_dsa_pattern(pattern_id: int, db: Session = Depends(get_db)) -> None:
    pattern = db.get(DsaPattern, pattern_id)
    if pattern is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "DSA pattern not found")
    db.delete(pattern)
    db.commit()


@dsa_router.post("/{pattern_id}/questions", response_model=DsaQuestionOut, status_code=status.HTTP_201_CREATED)
def create_dsa_question(pattern_id: int, payload: DsaQuestionCreate, db: Session = Depends(get_db)) -> DsaQuestion:
    if db.get(DsaPattern, pattern_id) is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "DSA pattern not found")
    question = DsaQuestion(pattern_id=pattern_id, **payload.model_dump())
    db.add(question)
    db.commit()
    db.refresh(question)
    return question


@dsa_router.patch("/questions/{question_id}", response_model=DsaQuestionOut)
def update_dsa_question(question_id: int, payload: DsaQuestionUpdate, db: Session = Depends(get_db)) -> DsaQuestion:
    question = db.get(DsaQuestion, question_id)
    if question is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Question not found")
    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(question, field, value)
    db.commit()
    db.refresh(question)
    return question


@dsa_router.delete("/questions/{question_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_dsa_question(question_id: int, db: Session = Depends(get_db)) -> None:
    question = db.get(DsaQuestion, question_id)
    if question is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Question not found")
    db.delete(question)
    db.commit()


@ai_topics_router.get("", response_model=list[AiTopicOut])
def list_ai_topics(db: Session = Depends(get_db)) -> list[AiTopic]:
    stmt = select(AiTopic).order_by(AiTopic.topic)
    return list(db.scalars(stmt))


@ai_topics_router.post("", response_model=AiTopicOut, status_code=status.HTTP_201_CREATED)
def create_ai_topic(payload: AiTopicCreate, db: Session = Depends(get_db)) -> AiTopic:
    topic = AiTopic(**payload.model_dump())
    db.add(topic)
    db.commit()
    db.refresh(topic)
    return topic


@ai_topics_router.patch("/{topic_id}", response_model=AiTopicOut)
def update_ai_topic(topic_id: int, payload: AiTopicUpdate, db: Session = Depends(get_db)) -> AiTopic:
    topic = db.get(AiTopic, topic_id)
    if topic is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "AI topic not found")
    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(topic, field, value)
    db.commit()
    db.refresh(topic)
    return topic


@ai_topics_router.delete("/{topic_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_ai_topic(topic_id: int, db: Session = Depends(get_db)) -> None:
    topic = db.get(AiTopic, topic_id)
    if topic is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "AI topic not found")
    db.delete(topic)
    db.commit()


@reading_list_router.get("", response_model=list[ReadingListItemOut])
def list_reading_list(db: Session = Depends(get_db)) -> list[ReadingListItem]:
    stmt = select(ReadingListItem).order_by(ReadingListItem.created_at.desc())
    return list(db.scalars(stmt))


@reading_list_router.post("", response_model=ReadingListItemOut, status_code=status.HTTP_201_CREATED)
def create_reading_list_item(payload: ReadingListItemCreate, db: Session = Depends(get_db)) -> ReadingListItem:
    item = ReadingListItem(**payload.model_dump())
    db.add(item)
    db.commit()
    db.refresh(item)
    return item


@reading_list_router.patch("/{item_id}", response_model=ReadingListItemOut)
def update_reading_list_item(
    item_id: int, payload: ReadingListItemUpdate, db: Session = Depends(get_db)
) -> ReadingListItem:
    item = db.get(ReadingListItem, item_id)
    if item is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Reading list item not found")
    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(item, field, value)
    db.commit()
    db.refresh(item)
    return item


@reading_list_router.delete("/{item_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_reading_list_item(item_id: int, db: Session = Depends(get_db)) -> None:
    item = db.get(ReadingListItem, item_id)
    if item is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Reading list item not found")
    db.delete(item)
    db.commit()
