from functools import lru_cache

from pydantic import field_validator
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

    @field_validator("database_url")
    @classmethod
    def _use_psycopg3(cls, v: str) -> str:
        """Managed Postgres providers (Railway included) hand out bare
        `postgresql://` URLs, which make SQLAlchemy default to psycopg2 — a
        dependency we don't install (we use psycopg3). Normalize instead of
        relying on every provider/human to remember the `+psycopg` suffix."""
        if v.startswith("postgresql://"):
            return v.replace("postgresql://", "postgresql+psycopg://", 1)
        return v


@lru_cache
def get_settings() -> Settings:
    return Settings()
