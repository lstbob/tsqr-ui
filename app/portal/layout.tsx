import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getGatewayUrl, ACCESS_TOKEN_COOKIE, SUPPORT_URL } from "@lib/config";
import PortalNav from "../_components/portal/PortalNav";
import UserInfo from "../_components/portal/UserInfo";

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

export default async function PortalLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  return (
    <div className="min-h-screen bg-zinc-50">
      <header className="sticky top-0 z-50 border-b border-zinc-200 bg-white">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
          <div className="flex items-center gap-8">
            <a href="/portal" className="text-xl font-bold tracking-tight text-emerald-900">
              TownsSquare
            </a>
            <PortalNav role={user.role} />
          </div>
          <div className="flex items-center gap-4">
            <a
              href={SUPPORT_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-zinc-500 hover:text-zinc-900"
            >
              Support
            </a>
            <UserInfo name={user.fullName} role={user.role} />
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-4 py-8">{children}</main>
    </div>
  );
}