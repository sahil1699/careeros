from fastapi import APIRouter

from app.api.routes import career, career_wins, content, daily, learning, mission, notes, projects, reviews

api_router = APIRouter()
api_router.include_router(mission.router)
api_router.include_router(daily.router)
api_router.include_router(projects.router)
api_router.include_router(career_wins.router)
api_router.include_router(reviews.router)
api_router.include_router(learning.system_design_router)
api_router.include_router(learning.dsa_router)
api_router.include_router(learning.ai_topics_router)
api_router.include_router(learning.reading_list_router)
api_router.include_router(content.router)
api_router.include_router(notes.router)
api_router.include_router(career.router)
api_router.include_router(career.resume_router)
