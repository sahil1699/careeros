from fastapi import FastAPI

from app.core.config import get_settings

settings = get_settings()

app = FastAPI(title="CareerOS API", version="0.1.0")


@app.get("/health")
def health() -> dict[str, str]:
    """Unauthenticated — used by Railway/uptime checks, not by the frontend."""
    return {"status": "ok", "environment": settings.environment}
