"""One-time (idempotent) seed of the planning content from docs/MyRoughPreeSeedData.md
and docs/notes.md, so CareerOS is usable on day one instead of an empty shell.

Run with: python -m app.seed
"""

from datetime import date

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.db.session import SessionLocal
from app.models.career import Company
from app.models.career_win import CareerWin
from app.models.learning import AiTopic, DsaPattern
from app.models.mission import Mission
from app.models.project import Project, ProjectCard

TARGET_COMPANIES = [
    "OpenAI",
    "Anthropic",
    "Stripe",
    "Uber",
    "Rippling",
    "Datadog",
    "Atlassian",
    "Microsoft",
]

DSA_PATTERNS = [
    "Two Pointer",
    "Sliding Window",
    "Binary Search",
    "DFS",
    "BFS",
    "Backtracking",
    "Union Find",
    "Trie",
    "Heap",
    "Intervals",
    "Graphs",
]

AI_TOPICS = [
    "GPT-5 / Responses API",
    "Anthropic Claude API",
    "LangGraph",
    "Model Context Protocol (MCP)",
    "OpenAI Agents SDK",
    "PydanticAI",
    "LiteLLM",
    "Qdrant",
    "Redis",
    "Temporal",
]

FLAGSHIP_PROJECT_CARDS = [
    ("todo", "V1: AI chat + diagram generation (Mermaid, React Flow)"),
    ("ideas", "V2: Drag & drop, AI understands the diagram"),
    ("ideas", "V3: Performance simulation (100 -> 1M -> 100M users)"),
    ("ideas", "V4: Interview mode (like HelloInterview)"),
    ("ideas", "V5: Share architecture publicly"),
]


def seed_mission(db: Session) -> None:
    if db.get(Mission, 1) is not None:
        return
    db.add(
        Mission(
            id=1,
            target_companies=[{"name": name, "checked": False} for name in TARGET_COMPANIES],
            salary_goal="35+ LPA",
            deadline="February 2027",
            north_star="Every week become slightly better than last week.",
        )
    )


def seed_flagship_project(db: Session) -> None:
    if db.scalar(select(Project).where(Project.name == "AI System Design Studio")) is not None:
        return
    project = Project(
        name="AI System Design Studio",
        status="in_progress",
        current_sprint="Authentication, AI Chat, React Flow",
        next_milestone="Diagram Generation",
        notes=(
            "Not another Excalidraw clone — an AI that designs, explains, scores, and generates "
            "HLD/LLD/API/DB/Kafka/Terraform/K8s for a system."
        ),
    )
    db.add(project)
    db.flush()  # assigns project.id
    for i, (column, title) in enumerate(FLAGSHIP_PROJECT_CARDS):
        db.add(ProjectCard(project_id=project.id, column=column, title=title, position=float(i)))


def seed_dsa_patterns(db: Session) -> None:
    existing = {p for (p,) in db.execute(select(DsaPattern.pattern))}
    for pattern in DSA_PATTERNS:
        if pattern not in existing:
            db.add(DsaPattern(pattern=pattern))


def seed_ai_topics(db: Session) -> None:
    existing = {t for (t,) in db.execute(select(AiTopic.topic))}
    for topic in AI_TOPICS:
        if topic not in existing:
            db.add(AiTopic(topic=topic))


def seed_companies(db: Session) -> None:
    existing = {n for (n,) in db.execute(select(Company.name))}
    for name in TARGET_COMPANIES:
        if name not in existing:
            db.add(Company(name=name, status="target"))


def seed_starter_win(db: Session) -> None:
    if db.scalar(select(CareerWin).where(CareerWin.title == "Started CareerOS")) is not None:
        return
    db.add(CareerWin(win_date=date.today(), title="Started CareerOS", description="Shipped the v1 scaffold."))


def main() -> None:
    db = SessionLocal()
    try:
        seed_mission(db)
        seed_flagship_project(db)
        seed_dsa_patterns(db)
        seed_ai_topics(db)
        seed_companies(db)
        seed_starter_win(db)
        db.commit()
        print("Seed complete.")
    finally:
        db.close()


if __name__ == "__main__":
    main()
