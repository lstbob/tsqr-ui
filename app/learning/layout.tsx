import { redirect } from "next/navigation";
import Link from "next/link";
import { getCurrentUser } from "@lib/currentUser";
import AppShell from "../_components/AppShell";

export default async function LearningLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  return (
    <AppShell
      user={user}
      nav={
      <nav className="flex flex-wrap items-center gap-1">
        <Link href="/learning" className="rounded-md bg-ui-800 px-3 py-1.5 text-sm font-medium text-ui-50">
          Learning
        </Link>
        <Link href="/learning/practice" className="rounded-md px-3 py-1.5 text-sm text-ui-300 transition-colors hover:text-ui-50">
          Practice
        </Link>
        <Link href="/learning/decks" className="rounded-md px-3 py-1.5 text-sm text-ui-300 transition-colors hover:text-ui-50">
          Decks
        </Link>
        <Link href="/portal" className="rounded-md px-3 py-1.5 text-sm text-ui-300 transition-colors hover:text-ui-50">
          Dashboard
        </Link>
      </nav>
      }
    >
      {children}
    </AppShell>
  );
}
