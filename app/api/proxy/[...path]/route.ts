import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  getGatewayUrl,
  ACCESS_TOKEN_COOKIE,
  REFRESH_TOKEN_COOKIE,
  TOKEN_COOKIE_OPTIONS,
} from "@lib/config";

// Authenticated BFF proxy: forwards all /api/proxy/<path> requests to the
// gateway at <GATEWAY_URL>/api/<path> with the Bearer token from the cookie.
// Handles 401 by attempting a refresh once, then retrying.
async function handler(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const { path } = await params;
  const targetPath = path.join("/");
  const url = `${getGatewayUrl()}/api/${targetPath}`;

  const cookieStore = await cookies();
  const accessToken = cookieStore.get(ACCESS_TOKEN_COOKIE)?.value;

  const headers = new Headers(request.headers);
  if (accessToken) {
    headers.set("Authorization", `Bearer ${accessToken}`);
  }
  // Don't forward the cookie header to the gateway — we've extracted the
  // token and put it in the Authorization header instead.
  headers.delete("cookie");

  const body =
    request.method !== "GET" && request.method !== "HEAD"
      ? await request.text()
      : undefined;

  let res = await fetch(url, {
    method: request.method,
    headers,
    body,
  });

  if (res.status === 401 && cookieStore.get(REFRESH_TOKEN_COOKIE)?.value) {
    const refreshToken = cookieStore.get(REFRESH_TOKEN_COOKIE)!.value;
    const refreshRes = await fetch(`${getGatewayUrl()}/api/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
    });

    if (refreshRes.ok) {
      const data = await refreshRes.json();
      cookieStore.set(ACCESS_TOKEN_COOKIE, data.accessToken, {
        ...TOKEN_COOKIE_OPTIONS,
        maxAge: data.expiresIn,
      });
      cookieStore.set(REFRESH_TOKEN_COOKIE, data.refreshToken, {
        ...TOKEN_COOKIE_OPTIONS,
        maxAge: 7 * 24 * 60 * 60,
      });

      // Retry the original request with the new token
      headers.set("Authorization", `Bearer ${data.accessToken}`);
      res = await fetch(url, {
        method: request.method,
        headers,
        body,
      });
    }
  }

  const responseHeaders = new Headers(res.headers);
  responseHeaders.delete("transfer-encoding");
  return new NextResponse(res.body, {
    status: res.status,
    headers: responseHeaders,
  });
}

export const GET = handler;
export const POST = handler;
export const PUT = handler;
export const PATCH = handler;
export const DELETE = handler;