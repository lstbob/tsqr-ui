import { NextRequest, NextResponse } from "next/server";
import { getGatewayUrl } from "@lib/config";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const res = await fetch(`${getGatewayUrl()}/api/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({ message: "Registration failed" }));
    return NextResponse.json(data, { status: res.status });
  }

  const data = await res.json();
  return NextResponse.json(data);
}