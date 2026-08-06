from fastapi import APIRouter

from app.api.routes import career_wins, daily, mission, projects, reviews

api_router = APIRouter()
api_router.include_router(mission.router)
api_router.include_router(daily.router)
api_router.include_router(projects.router)
api_router.include_router(career_wins.router)
api_router.include_router(reviews.router)
