# Next.js + FastAPI: how this codebase works

For someone who knows backend/APIs cold but hasn't worked in these two frameworks. Read this once, and any file in the repo should make sense from its path alone.

## 1. The big picture

```
Browser
  │  (session cookie only)
  ▼
Next.js server (apps/web)        <- runs on Vercel
  │  (internal API key, server-to-server, browser never sees this)
  ▼
FastAPI (apps/api)               <- runs on Railway
  │
  ▼
Postgres
```

The browser **never** talks to FastAPI directly. Every request from a page goes to Next.js first. This is a standard "BFF" (backend-for-frontend) pattern — it's why there's an `INTERNAL_API_KEY` that only two server processes know, never shipped to the browser.

## 2. Folder structure

```
Forge/
├── apps/
│   ├── web/                     Next.js app (the UI)
│   │   ├── src/
│   │   │   ├── app/              <- routing lives here (see §3)
│   │   │   │   ├── (app)/         route group: every authenticated page
│   │   │   │   │   ├── layout.tsx     shared nav shell for all pages in this group
│   │   │   │   │   ├── page.tsx       "/" (Home)
│   │   │   │   │   ├── mission/page.tsx    "/mission"
│   │   │   │   │   └── projects/[id]/page.tsx   "/projects/123" (dynamic segment)
│   │   │   │   ├── login/            "/login" — outside the (app) group, no nav
│   │   │   │   ├── api/[...path]/route.ts   the browser->FastAPI proxy (see §5)
│   │   │   │   └── layout.tsx        root layout: fonts, <html>, providers
│   │   │   ├── components/        shared React components (ui/ = shadcn primitives)
│   │   │   ├── hooks/              use-*.ts — TanStack Query hooks, one file per resource
│   │   │   ├── lib/                api.ts (fetch wrapper), types.ts (mirrors backend
│   │   │   │                       schemas), session.ts (auth), api-client.ts (server-only
│   │   │   │                       fetch to FastAPI), dates.ts, utils.ts
│   │   │   └── proxy.ts            route-protection (runs before every request; formerly
│   │   │                           called "middleware.ts" in older Next.js versions)
│   │   ├── package.json
│   │   └── .env.local             secrets (gitignored) — see .env.local.example
│   │
│   └── api/                      FastAPI app (the backend)
│       ├── app/
│       │   ├── main.py             entrypoint: creates the FastAPI() app, mounts routers
│       │   ├── models/             SQLAlchemy ORM classes — the DB table shape
│       │   ├── schemas/            Pydantic classes — the API request/response shape
│       │   ├── api/
│       │   │   ├── deps.py          shared dependencies (e.g. the auth check)
│       │   │   ├── router.py        collects every route file into one router
│       │   │   └── routes/          one file per resource (mission.py, projects.py, ...)
│       │   ├── db/                 session.py (DB connection), base.py (declarative base)
│       │   ├── core/config.py      env-var-backed settings (Pydantic BaseSettings)
│       │   └── seed.py             idempotent pre-seed script
│       ├── alembic/versions/       one file per migration, auto-generated, don't hand-edit
│       ├── requirements.txt
│       ├── Dockerfile              how Railway builds/runs this
│       └── .env                    secrets (gitignored)
│
├── docs/                          planning notes + this primer
└── .github/workflows/             CI/CD (web.yml, api.yml)
```

**Rule of thumb for "where does X live":** the DB shape is in `models/`, the API contract is in `schemas/`, the endpoint logic is in `api/routes/`. These are three separate files for the same "thing" on purpose — see §6.

## 3. Next.js App Router — the concepts actually used here

Next.js's router is **file-based**: the path under `src/app/` *is* the URL. No route-config file to go read.

| You'll see... | It means... |
| --- | --- |
| `app/mission/page.tsx` | The page at `/mission`. Every folder with a `page.tsx` is a route. |
| `app/projects/[id]/page.tsx` | Dynamic segment. `params.id` gives you whatever's in the URL (`/projects/42` → `id: "42"`). |
| `app/api/[...path]/route.ts` | Catch-all segment (`[...path]`) — matches `/api/anything/here`, `path` is `["anything", "here"]`. `route.ts` (not `page.tsx`) means it's an API endpoint, not a page — you export `GET`/`POST`/etc. functions instead of a default component. |
| `app/(app)/...` | Parentheses = **route group**. Groups routes under a shared `layout.tsx` (the nav sidebar) without adding `/app` to the actual URL. Purely organizational. |
| `layout.tsx` | Wraps every page below it in the tree. Root layout = whole app (fonts, `<html>`). `(app)/layout.tsx` = just the authenticated pages (adds the nav). |
| `"use client"` at the top of a file | Marks it a **Client Component** — ships JS to the browser, can use `useState`/`useEffect`/click handlers. Everything in this app that's interactive has this. |
| No `"use client"` | **Server Component** (the default) — renders on the server only, can't use hooks or handle clicks, but can `await` data directly. This project's pages are mostly Client Components because they're all interactive dashboards; Server Components matter more for content-heavy sites. |
| `"use server"` at the top of a function (see `app/login/actions.ts`) | **Server Action** — a function the browser can call directly (e.g. from a `<form action={...}>`) that actually runs on the server. Used for login/logout here instead of a hand-rolled API route. |
| `src/proxy.ts` | Runs **before every request**, on the server, before any page or route handler. This project uses it to check the session cookie and redirect to `/login` if you're not authenticated. (Next.js renamed this file from `middleware.ts` partway through v16 — same concept, new name.) |

## 4. TanStack Query — the client-side data layer

Every interactive page needs to fetch data and re-fetch it after a mutation. TanStack Query is the library handling that instead of hand-rolled `useEffect` + `fetch` + loading-state juggling.

Pattern, in every `hooks/use-*.ts` file:

```ts
// Read: give it a unique "key" and a fetch function. It handles caching,
// loading states, and re-fetching for you.
export function useMission() {
  return useQuery({ queryKey: ["mission"], queryFn: () => api.get<Mission>("/mission") });
}

// Write: call the API, then tell the cache what changed.
export function useUpdateMission() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload) => api.put<Mission>("/mission", payload),
    onSuccess: (data) => queryClient.setQueryData(["mission"], data), // patch the cache directly
    // or: queryClient.invalidateQueries({ queryKey: ["mission"] }) // refetch instead
  });
}
```

Pages just call `useMission()` and get `{ data, isLoading, error }` — no manual fetch/loading code in the page itself.

**One established rule in this codebase:** never sync query data into local edit-state with `useEffect` (the linter flags this — it causes extra renders). Instead, extract the editable form into a child component that only mounts once the data has loaded, and initialize its `useState` directly from props. See `apps/web/src/app/(app)/mission/page.tsx` for the reference pattern — copy it for any new edit form.

## 5. The `/api/[...path]` proxy — tracing one request end to end

Example: the Home page needs the mission data.

1. `apps/web/src/hooks/use-mission.ts` — `useMission()` calls `api.get("/mission")`
2. `apps/web/src/lib/api.ts` — that actually fetches `/api/mission` (same origin, browser-safe, no secrets)
3. `apps/web/src/app/api/[...path]/route.ts` — Next.js's server receives it, checks the session cookie is valid, then calls `apiFetch("/mission")`
4. `apps/web/src/lib/api-client.ts` — `apiFetch` adds the header `x-internal-api-key: <secret>` and calls the real FastAPI URL (`API_BASE_URL` env var, e.g. the Railway URL)
5. `apps/api/app/api/routes/mission.py` — FastAPI's `require_internal_key` dependency (in `app/api/deps.py`) checks that header matches, then the route function runs and queries Postgres via SQLAlchemy
6. Response flows back up through every layer unchanged

Any new resource (a new table/feature) repeats steps 3-6 automatically for free — you only ever add a new file in `api/routes/` (backend) and `hooks/` (frontend); the proxy and auth layer don't change.

## 6. FastAPI structure — why models/schemas/routes are separate files

- **`models/*.py`** (SQLAlchemy) — the actual Postgres table. `Mapped[int]`, `mapped_column(...)`, foreign keys, indexes. This is *storage* shape.
- **`schemas/*.py`** (Pydantic) — what the API accepts/returns over HTTP. Usually similar to the model but not identical — e.g. a `Create` schema omits `id` (the DB assigns it), an `Update` schema makes every field optional (partial updates). This is *contract* shape.
- **`api/routes/*.py`** — the actual endpoint functions. `@router.get("/mission")`, takes a DB session via `Depends(get_db)`, uses the model to query, validates/serializes through the schema, returns it.

Why not just use the SQLAlchemy model directly as the API response? Because the DB shape and the API shape *will* diverge (you don't want to accept a client-supplied `id` on create; you might want to hide an internal column; you might reshape nested data) — keeping them separate from day one avoids a painful split later.

`Depends(...)` is FastAPI's dependency injection — `Depends(get_db)` hands the route function a DB session for that one request (and closes it after); `Depends(require_internal_key)` runs the auth check before the route body executes at all.

## 7. Database migrations (Alembic)

You never write SQL `CREATE TABLE` by hand. Workflow for a schema change:

1. Edit/add a class in `apps/api/app/models/`
2. Add it to `apps/api/app/models/__init__.py` (so Alembic can see it)
3. `alembic revision --autogenerate -m "describe the change"` — diffs your models against the live DB and writes a migration file in `alembic/versions/`
4. Read the generated file (autogenerate isn't perfect — it can miss things), then `alembic upgrade head` to apply it
5. Commit the generated migration file — it's the source of truth for schema history, not the DB itself

## 8. Conventions to follow when adding anything new

- **New table** → model in `app/models/`, register in `__init__.py`, generate + run a migration.
- **New endpoint** → schema in `app/schemas/`, router in `app/api/routes/`, register in `app/api/router.py`. Every router gets `dependencies=[Depends(require_internal_key)]`.
- **New page** → folder + `page.tsx` under `app/(app)/` if it needs the nav shell. Add the link to `components/nav.tsx`.
- **New client-side data need** → a hook in `hooks/use-*.ts`, TS type mirrored in `lib/types.ts`.
- **Editable form fed by async data** → the lazy-init child-component pattern from §4, not `useEffect`.
- **Naming**: Python is `snake_case` (files, functions, variables) per PEP 8; TypeScript is `camelCase` for variables/functions, `PascalCase` for components/types; both sides use the same route/field names (e.g. `next_milestone`) so nothing gets lost in translation between the two languages.
- Run `ruff check .` (in `apps/api`, venv active) and `npm run lint && npm run build` (in `apps/web`) before considering anything done — both are wired into CI and will fail the pipeline otherwise.
