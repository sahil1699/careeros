import "server-only";

const API_BASE_URL = process.env.API_BASE_URL ?? "http://localhost:8000";
const INTERNAL_API_KEY = process.env.INTERNAL_API_KEY ?? "";

/**
 * Server-only fetch wrapper for the FastAPI backend. The browser never calls
 * this directly — either a Server Component calls it during render, or the
 * `/api/[...path]` proxy route calls it on behalf of a client-side request.
 * The internal API key never leaves the server.
 */
export async function apiFetch(path: string, init?: RequestInit): Promise<Response> {
  return fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: {
      "x-internal-api-key": INTERNAL_API_KEY,
      ...(init?.body ? { "Content-Type": "application/json" } : {}),
      ...init?.headers,
    },
    cache: "no-store", // this is a live tracker, not a static page
  });
}

/** Convenience helper for Server Components that just need parsed JSON. */
export async function apiGet<T>(path: string): Promise<T> {
  const res = await apiFetch(path);
  if (!res.ok) {
    throw new Error(`API GET ${path} failed: ${res.status} ${await res.text()}`);
  }
  return res.json() as Promise<T>;
}
