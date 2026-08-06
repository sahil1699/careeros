# CareerOS

A personal operating system for a 6-month engineering growth plan — daily focus, project tracking, learning trackers, content pipeline, and weekly/monthly reviews, all in one low-maintenance place.

> Work in progress — this README grows alongside the build. See `docs/` for the original planning notes.

## Structure

```
apps/
  web/   Next.js (TypeScript, Tailwind, shadcn/ui) — the UI, deployed on Vercel
  api/   FastAPI (SQLAlchemy, Alembic, Postgres) — the backend, deployed on Railway
docs/    Planning notes this project was built from
```

## Running locally

**API** (`apps/api`):
```bash
cd apps/api
python3 -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env   # then fill in DATABASE_URL
alembic upgrade head
uvicorn app.main:app --reload
```

**Web** (`apps/web`):
```bash
cd apps/web
npm install
npm run dev
```
