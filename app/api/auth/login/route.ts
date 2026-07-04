import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  getGatewayUrl,
  ACCESS_TOKEN_COOKIE,
  REFRESH_TOKEN_COOKIE,
  TOKEN_COOKIE_OPTIONS,
} from "@lib/config";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const res = await fetch(`${getGatewayUrl()}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const data = await res.text();
    return NextResponse.json(
      { error: "Invalid email or password" },
      { status: res.status },
    );
  }

  const data = await res.json();
  const cookieStore = await cookies();

  cookieStore.set(ACCESS_TOKEN_COOKIE, data.accessToken, {
    ...TOKEN_COOKIE_OPTIONS,
    maxAge: data.expiresIn,
  });
  cookieStore.set(REFRESH_TOKEN_COOKIE, data.refreshToken, {
    ...TOKEN_COOKIE_OPTIONS,
    maxAge: 7 * 24 * 60 * 60,
  });

  return NextResponse.json({ user: data.user });
}