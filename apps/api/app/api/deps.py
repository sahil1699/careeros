from fastapi import Header, HTTPException, status

from app.core.config import get_settings

settings = get_settings()


def require_internal_key(x_internal_api_key: str = Header(default="")) -> None:
    """Every route depends on this. Only the Next.js server (never the browser)
    knows INTERNAL_API_KEY and attaches it as a header on server-to-server calls."""
    if x_internal_api_key != settings.internal_api_key:
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Invalid or missing internal API key")
