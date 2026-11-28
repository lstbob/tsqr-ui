import { redirect } from "next/navigation";
import { getCurrentUser } from "@lib/currentUser";
import AppShell from "../_components/AppShell";
import PortalNav from "../_components/portal/PortalNav";

export default async function PortalLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  return (
    <AppShell
      user={user}
      nav={
        <PortalNav role={user.role} />
      }
    >
      {children}
    </AppShell>
  );
}
