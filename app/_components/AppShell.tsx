import Link from "next/link";
import { SUPPORT_URL } from "@lib/config";
import type { CurrentUser } from "@lib/currentUser";
import UserInfo from "./portal/UserInfo";

export default function AppShell({
  user,
  nav,
  children,
}: {
  user: CurrentUser;
  nav: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen">
      <header className="sticky top-0 z-50 border-b border-ui-700 bg-ui-950/80 backdrop-blur">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-4 px-4 py-4">
          <div className="flex flex-wrap items-center gap-6">
            <Link href="/portal" className="text-lg font-semibold tracking-tight text-ui-50">
              TownsSquare
            </Link>
            {nav}
          </div>
          <div className="flex items-center gap-4">
            <a
              href={SUPPORT_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-ui-300 transition-colors hover:text-ui-50"
            >
              Support
            </a>
            <UserInfo name={user.fullName} role={user.role} />
          </div>
        </div>
      </header>
      <main className="relative z-10 mx-auto max-w-5xl px-4 py-10">{children}</main>
      <footer className="relative z-10 mt-16 border-t border-ui-700 py-8 text-sm text-ui-400">
        <div className="mx-auto max-w-5xl px-4">
          <p>&copy; {new Date().getFullYear()} TownsSquare. A neighbourhood toolkit for sharing and mutual aid.</p>
        </div>
      </footer>
    </div>
  );
}
