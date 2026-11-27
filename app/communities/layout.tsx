import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { getGatewayUrl, ACCESS_TOKEN_COOKIE, SUPPORT_URL } from "@lib/config";
import UserInfo from "../_components/portal/UserInfo";
import { ConnectionLines } from "../_components/decorations";

async function getCurrentUser() {
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

export default async function CommunitiesLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  return (
    <div className="min-h-screen bg-forest-950">
      <ConnectionLines />
      <header className="sticky top-0 z-50 border-b border-forest-800 bg-forest-900/95 backdrop-blur-sm">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
          <div className="flex items-center gap-8">
            <a href="/portal" className="text-xl font-bold tracking-tight text-forest-50">
              TownsSquare
            </a>
            <nav className="flex items-center gap-1">
              <Link
                href="/dashboard"
                className="rounded-md px-3 py-1.5 text-sm font-medium text-forest-200 hover:text-forest-50 hover:bg-forest-800"
              >
                Dashboard
              </Link>
              <Link
                href="/tools"
                className="rounded-md px-3 py-1.5 text-sm font-medium text-forest-200 hover:text-forest-50 hover:bg-forest-800"
              >
                Tools
              </Link>
              <Link
                href="/soup-kitchen"
                className="rounded-md px-3 py-1.5 text-sm font-medium text-forest-200 hover:text-forest-50 hover:bg-forest-800"
              >
                Soup Kitchen
              </Link>
              <Link
                href="/communities"
                className="rounded-md bg-forest-800 px-3 py-1.5 text-sm font-medium text-forest-100"
              >
                Communities
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <a
              href={SUPPORT_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-forest-200 hover:text-forest-50"
            >
              Support
            </a>
            <a href="/portal" className="text-sm font-medium text-forest-200 hover:text-forest-50">
              Dashboard
            </a>
            <UserInfo name={user.fullName} role={user.role} />
          </div>
        </div>
      </header>
      <main className="relative z-10 mx-auto max-w-7xl px-4 py-8">{children}</main>
    </div>
  );
}
