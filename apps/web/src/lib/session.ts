import { getIronSession, type IronSession, type SessionOptions } from "iron-session";
import type { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export interface SessionData {
  authenticated: boolean;
}

const sessionOptions: SessionOptions = {
  cookieName: "careeros_session",
  password: process.env.SESSION_SECRET ?? "",
  cookieOptions: {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 30, // 30 days — this is a single-user app, no need to force re-logins
  },
};

/** Server Components / Route Handlers / Server Actions: `next/headers` cookies(). */
export async function getSession(): Promise<IronSession<SessionData>> {
  return getIronSession<SessionData>(await cookies(), sessionOptions);
}

/** Middleware runs before the App Router request context exists, so it needs
 * iron-session's req/res overload instead of `next/headers`. */
export async function getSessionForMiddleware(
  request: NextRequest,
  response: NextResponse
): Promise<IronSession<SessionData>> {
  return getIronSession<SessionData>(request, response, sessionOptions);
}
