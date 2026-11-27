import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  getGatewayUrl,
  ACCESS_TOKEN_COOKIE,
  REFRESH_TOKEN_COOKIE,
  TOKEN_COOKIE_OPTIONS,
} from "@lib/config";

export async function POST(request: NextRequest) {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get(REFRESH_TOKEN_COOKIE)?.value;

  if (!refreshToken) {
    return NextResponse.json({ error: "No refresh token" }, { status: 401 });
  }

  const res = await fetch(`${getGatewayUrl()}/api/auth/refresh`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refreshToken }),
  });

  if (!res.ok) {
    cookieStore.delete(ACCESS_TOKEN_COOKIE);
    cookieStore.delete(REFRESH_TOKEN_COOKIE);
    return NextResponse.json({ error: "Session expired" }, { status: 401 });
  }

  const data = await res.json();

  cookieStore.set(ACCESS_TOKEN_COOKIE, data.accessToken, {
    ...TOKEN_COOKIE_OPTIONS,
    maxAge: data.expiresIn,
  });
  cookieStore.set(REFRESH_TOKEN_COOKIE, data.refreshToken, {
    ...TOKEN_COOKIE_OPTIONS,
    maxAge: 7 * 24 * 60 * 60,
  });

  return NextResponse.json({ ok: true });
}