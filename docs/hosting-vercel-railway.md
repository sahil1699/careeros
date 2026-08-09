# Vercel + Railway: should you keep using these?

Numbers below are my best knowledge and may have shifted — both platforms change pricing often. Before committing a new project, check vercel.com/pricing and railway.app/pricing directly. Directional guidance is more reliable here than exact figures.

## Vercel (hosting `apps/web`)

- **Hobby plan is free, but personal-use only** — Vercel's ToS restrict the free plan to non-commercial projects. CareerOS (personal tool) qualifies. A SaaS you charge for doesn't.
- Free tier covers: reasonable bandwidth, serverless function execution, and build minutes for a low-traffic personal project. Static/serverless-ish apps like CareerOS's frontend barely register.
- **Limits are pooled per account, not per project** — every Hobby project you deploy shares one bucket of bandwidth/function-execution/build-minutes. Ten small personal projects is usually fine; one project that gets real traffic can eat the whole account's budget.
- No team collaborators on Hobby (that needs Pro, paid).
- **Verdict: yes, keep using Vercel for personal frontend projects.** Multiple projects on one account is a normal, supported pattern — just watch the account-wide usage dashboard if any one project starts getting traffic.

## Railway (hosting `apps/api` + Postgres)

- **Not indefinitely free.** Railway moved away from a standing free tier a while back. You get trial credit to start, then it's usage-based billing (a small monthly base, e.g. ~$5, plus metered compute/memory/egress on top).
- **The bill is about uptime, not requests.** A FastAPI service + Postgres that run 24/7 (they don't scale to zero on Railway) accrue cost continuously, unlike Vercel's request-based serverless model. For one small personal project this tends to land in the few-dollars-a-month range, but it does compound if you deploy several always-on services under one account.
- **Verdict: fine for this one project, be deliberate before stacking more.** If you spin up a second personal backend on Railway, expect the bill to roughly add up per service (each is its own always-on compute). Check your Railway usage/billing dashboard now to see what CareerOS is actually costing — that number tells you whether Railway scales for you as "one tool per side project."

## If you want a real always-free option for a future backend

| Need | Free-tier-friendly alternative | Why |
| --- | --- | --- |
| Just a Postgres DB (no custom backend logic) | **Supabase** or **Neon** | Both have a genuinely free tier that scales to zero — no cost when idle, unlike Railway's always-on Postgres. Neon is closest to a drop-in Postgres swap for this project's SQLAlchemy setup. |
| A small backend service, low/bursty traffic | **Fly.io** or **Render** (free tier) | Render's free web services spin down on idle (cold start on next request) — fine for a personal tool nobody else hits at 3am. Fly.io has a small perpetual free allowance. |
| Edge functions / very light API | **Cloudflare Workers/Pages** | Generous free tier, scales to zero, no idle cost. Overkill setup cost if you already know FastAPI though. |
| You end up with 3+ always-on side projects | A single **$5/mo VPS** (Hetzner, DigitalOcean) running Docker Compose for all of them | One flat fee instead of N always-on Railway bills. More ops work, but you already have Dockerfiles from this project. |

**Bottom line for your next project:** Vercel again without hesitation for the frontend. For the backend, if it's another "just for me" tracker like this one, consider Neon/Supabase + Render's free tier instead of Railway, specifically to avoid a second always-on compute bill — reach for Railway again only if you want managed simplicity more than you want to save a few dollars a month.
