from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Central app config, read from environment variables (.env locally)."""

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    # Postgres connection string, e.g. postgresql+psycopg://user:pass@host:5432/db
    database_url: str = "postgresql+psycopg://careeros:careeros@localhost:5432/careeros"

    # Shared secret the Next.js server must send on every request.
    # The browser never sees this — only server-to-server calls do.
    internal_api_key: str = "dev-only-change-me"

    environment: str = "development"


@lru_cache
def get_settings() -> Settings:
    return Settings()
