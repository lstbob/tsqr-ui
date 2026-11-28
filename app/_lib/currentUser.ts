import { cookies } from "next/headers";
import { getGatewayUrl, ACCESS_TOKEN_COOKIE } from "@lib/config";

export interface CurrentUser {
  fullName: string;
  role: string;
}

export async function getCurrentUser(): Promise<CurrentUser | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(ACCESS_TOKEN_COOKIE)?.value;
  if (!token) return null;

  try {
    const res = await fetch(`${getGatewayUrl()}/api/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}
