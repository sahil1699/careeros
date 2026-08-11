import { NextRequest, NextResponse } from "next/server";

import { apiFetch } from "@/lib/api-client";
import { getSession } from "@/lib/session";

/**
 * Single proxy for every browser -> API call. TanStack Query hooks fetch
 * `/api/<whatever>` from the client; this checks the passphrase session,
 * then forwards to FastAPI server-side with the internal API key attached.
 * The browser never sees API_BASE_URL or INTERNAL_API_KEY.
 */
async function handler(req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  const session = await getSession();
  if (!session.authenticated) {
    return NextResponse.json({ detail: "Not authenticated" }, { status: 401 });
  }

  const { path } = await params;
  const upstreamPath = `/${path.join("/")}${req.nextUrl.search}`;
  const hasBody = req.method !== "GET" && req.method !== "HEAD" && req.method !== "DELETE";

  const upstream = await apiFetch(upstreamPath, {
    method: req.method,
    body: hasBody ? await req.text() : undefined,
  });

  // arrayBuffer (not text) so binary responses — e.g. the .xlsx export —
  // pass through untouched instead of being mangled by text re-encoding.
  const body = await upstream.arrayBuffer();
  const headers: Record<string, string> = {
    "Content-Type": upstream.headers.get("Content-Type") ?? "application/json",
  };
  const disposition = upstream.headers.get("Content-Disposition");
  if (disposition) headers["Content-Disposition"] = disposition;

  return new NextResponse(body, { status: upstream.status, headers });
}

export {
  handler as GET,
  handler as POST,
  handler as PUT,
  handler as PATCH,
  handler as DELETE,
};
