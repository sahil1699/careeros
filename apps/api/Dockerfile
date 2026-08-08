FROM python:3.12-slim

WORKDIR /app

# System deps for psycopg (binary wheel covers most of this, but keep libpq for safety)
RUN apt-get update && apt-get install -y --no-install-recommends libpq5 \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8000

# Railway sets $PORT; default to 8000 for local `docker run`.
# `app.seed` is idempotent — safe to run on every boot, and it's how the
# managed prod DB gets the pre-seed content without needing external access.
CMD ["sh", "-c", "alembic upgrade head && python -m app.seed && uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8000}"]
