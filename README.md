# CareerOS

> An AI-powered operating system for software engineers — a personal, low-maintenance tracker for a focused 6-month plan to grow from backend engineer to AI systems engineer.

**Live**: https://careeros-virid-nine.vercel.app (passphrase-gated) · **API**: https://courteous-creativity-production-78ee.up.railway.app

Built for daily use, not as a demo: a single page to open every morning (today's checklist, active project, mission), plus dedicated trackers for projects, system design, DSA patterns, AI topics, content, notes, and job applications — all backed by a real Postgres database instead of another Notion doc.

## Features

- **🏠 Home** — today's checklist, active project snapshot, mission reminder, recent wins
- **🎯 Mission** — target companies, salary goal, deadline, north star
- **📅 Daily Dashboard** — daily checklist + win/learning/blocked-by, with history
- **💻 Projects** — a Kanban board (Ideas → Todo → In Progress → Done) per project
- **📈 Reviews** — weekly and monthly reflection (what I built / learned / stopped doing / am proud of)
- **🏆 Career Wins** — a running log for the days motivation runs low
- **🧠 Learning** — System Design (read/diagram/notes/implemented), DSA patterns (understanding & confidence ratings), AI topics, reading list
- **✍️ Content** — a Kanban pipeline (Idea → Writing → Scheduled → Posted) for tweets/LinkedIn/blog/README updates
- **📖 Notes** — one markdown page per topic, instead of scattered notes
- **🎯 Applications** — companies → applications → interview rounds, plus resume versions

## Architecture

```
apps/
  web/   Next.js 16 (App Router, TypeScript, Tailwind, shadcn/ui, TanStack Query)
  api/   FastAPI + SQLAlchemy + Alembic, Postgres
docs/    The planning notes CareerOS was built from
```

Single-user, passphrase-gated. The browser only ever talks to the Next.js server:

```
Browser --(session cookie)--> Next.js (/api/[...path] proxy) --(internal API key)--> FastAPI --> Postgres
```

`INTERNAL_API_KEY` never reaches the browser — Next.js attaches it server-side on every call it forwards to FastAPI. There's no user table and no third-party auth provider; a single shared passphrase is enough for one person, and it's a clean seam to swap in real auth (Clerk, per the original spec) if this ever opens up to other engineers.

## Deployment

- **Web** → [Vercel](https://vercel.com), root directory `apps/web`
- **API** → [Railway](https://railway.app), root directory `apps/api`, built from its `Dockerfile`, with a managed Postgres plugin
- **CI/CD** → `.github/workflows/web.yml` and `api.yml`: lint + typecheck + build (web) / lint + migrate + test (api) on every push, then deploy on `main`

## Running locally

**API** (`apps/api`):
```bash
cd apps/api
python3 -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env   # fill in DATABASE_URL for a local Postgres
alembic upgrade head
python -m app.seed     # pre-seeds the 6-month plan content (idempotent)
uvicorn app.main:app --reload
```

**Web** (`apps/web`):
```bash
cd apps/web
npm install
cp .env.local.example .env.local   # fill in API_BASE_URL / INTERNAL_API_KEY / SESSION_PASSPHRASE / SESSION_SECRET
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000) and log in with the passphrase from `.env.local`.
