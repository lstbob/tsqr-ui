import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getGatewayUrl, ACCESS_TOKEN_COOKIE, REFRESH_TOKEN_COOKIE } from "@lib/config";

export async function GET() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get(ACCESS_TOKEN_COOKIE)?.value;

  if (!accessToken) {
    return NextResponse.json({ user: null }, { status: 401 });
  }

  const res = await fetch(`${getGatewayUrl()}/api/auth/me`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (res.status === 401) {
    // Try refresh
    const refreshToken = cookieStore.get(REFRESH_TOKEN_COOKIE)?.value;
    if (refreshToken) {
      const refreshRes = await fetch(`${getGatewayUrl()}/api/auth/refresh`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken }),
      });

      if (refreshRes.ok) {
        const data = await refreshRes.json();
        cookieStore.set(ACCESS_TOKEN_COOKIE, data.accessToken, { httpOnly: true, path: "/" });
        cookieStore.set(REFRESH_TOKEN_COOKIE, data.refreshToken, { httpOnly: true, path: "/" });

        const meRes = await fetch(`${getGatewayUrl()}/api/auth/me`, {
          headers: { Authorization: `Bearer ${data.accessToken}` },
        });
        if (meRes.ok) {
          const user = await meRes.json();
          return NextResponse.json({ user });
        }
      }
    }

    cookieStore.delete(ACCESS_TOKEN_COOKIE);
    cookieStore.delete(REFRESH_TOKEN_COOKIE);
    return NextResponse.json({ user: null }, { status: 401 });
  }

  const user = await res.json();
  return NextResponse.json({ user });
}