import Link from "next/link";
import { cookies } from "next/headers";
import { getGatewayUrl, ACCESS_TOKEN_COOKIE } from "@lib/config";

async function getDashboard() {
  const cookieStore = await cookies();
  const token = cookieStore.get(ACCESS_TOKEN_COOKIE)?.value;

  try {
    const res = await fetch(`${getGatewayUrl()}/api/bff/dashboard`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export default async function PortalHome() {
  const dashboard = await getDashboard();

  const stats = dashboard?.stats;
  const soupKitchenStats = dashboard?.soupKitchenStats;
  const user = dashboard?.user;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-zinc-900">
          Welcome back, {user?.fullName?.split(" ")[0] || "there"}!
        </h1>
        <p className="mt-1 text-zinc-500">Manage your community tool library from here.</p>
      </div>

      {stats && (
        <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
          <StatCard label="Total Tools" value={stats.totalTools} />
          <StatCard label="Members" value={stats.totalMembers} />
          <StatCard label="Active Loans" value={stats.activeLoans} />
          <StatCard label="Under Maintenance" value={stats.underMaintenance} />
          <StatCard label="Pending Reservations" value={stats.pendingReservations} />
        </div>
      )}

      {soupKitchenStats && (
        <>
          <h2 className="mb-3 text-lg font-semibold text-zinc-800">Soup Kitchen Overview</h2>
          <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-5">
            <StatCard label="Total Events" value={soupKitchenStats.totalEvents} />
            <StatCard label="Upcoming" value={soupKitchenStats.upcomingEvents} />
            <StatCard label="Volunteers" value={soupKitchenStats.totalVolunteers} />
            <StatCard label="Donations" value={soupKitchenStats.totalDonations} />
            <StatCard label="Guests" value={soupKitchenStats.totalGuests} />
          </div>
        </>
      )}

      <h2 className="mb-4 text-lg font-semibold text-zinc-800">Quick Access</h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <ModuleCard href="/tools" title="Tool Library" description="Browse, search, and manage the tool catalog." icon="🔧" />
        <ModuleCard href="/portal/members" title="Members" description="Manage registrations, verification, and membership status." icon="👥" />
        <ModuleCard href="/portal/reservations" title="Reservations" description="View and manage tool reservations and waitlists." icon="📅" />
        <ModuleCard href="/portal/loans" title="Loans" description="Track active loans and process returns." icon="📦" />
        <ModuleCard href="/portal/inventory" title="Inventory" description="Monitor tool conditions and maintenance." icon="📋" />
        <ModuleCard href="/soup-kitchen" title="Soup Kitchen" description="Organize community meals and track donations." icon="🍲" />
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm">
      <p className="text-2xl font-bold text-zinc-900">{value}</p>
      <p className="text-sm text-zinc-500">{label}</p>
    </div>
  );
}

function ModuleCard({ href, title, description, icon }: { href: string; title: string; description: string; icon: string }) {
  return (
    <Link href={href} className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm transition hover:shadow-md hover:border-zinc-300">
      <span className="text-2xl">{icon}</span>
      <h3 className="mt-2 font-semibold text-zinc-900">{title}</h3>
      <p className="mt-1 text-sm text-zinc-500">{description}</p>
    </Link>
  );
}