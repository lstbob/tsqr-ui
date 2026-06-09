import Link from "next/link";
import StatsCard from "./_components/StatsCard";

interface DashboardStats {
  totalTools: number;
  totalMembers: number;
  activeLoans: number;
  underMaintenance: number;
  pendingReservations: number;
}

const API_URL = process.env.API_URL ?? "http://localhost:5000";

async function getStats(): Promise<DashboardStats> {
  const res = await fetch(`${API_URL}/api/dashboard/stats`, {
    cache: "no-store",
  });
  if (!res.ok) {
    return { totalTools: 0, totalMembers: 0, activeLoans: 0, underMaintenance: 0, pendingReservations: 0 };
  }
  return res.json();
}

export default async function Home() {
  const stats = await getStats();

  return (
    <div>
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-zinc-900">TSQR Platform</h1>
        <p className="mt-2 text-lg text-zinc-500">
          Tool Sharing &amp; Quick Reservation — manage tools, members, reservations, and maintenance.
        </p>
      </div>

      <div className="mb-12 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
        <StatsCard label="Total Tools" value={stats.totalTools} icon="🔧" />
        <StatsCard label="Members" value={stats.totalMembers} icon="👥" />
        <StatsCard label="Active Loans" value={stats.activeLoans} icon="📦" />
        <StatsCard label="Under Maintenance" value={stats.underMaintenance} icon="🔨" />
        <StatsCard label="Pending Reservations" value={stats.pendingReservations} icon="📅" />
      </div>

      <h2 className="mb-4 text-xl font-semibold text-zinc-800">Modules</h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <ModuleCard
          href="/tools"
          title="Tool Library"
          description="Browse, search, and manage the full tool catalog. View details, scarcity, and availability."
          icon="🔧"
        />
        <ModuleCard
          href="#"
          title="Members"
          description="Manage member registrations, memberships, and verification status."
          icon="👥"
          locked
        />
        <ModuleCard
          href="#"
          title="Reservations"
          description="Handle tool reservations, confirm pickups, and manage waitlists."
          icon="📅"
          locked
        />
        <ModuleCard
          href="#"
          title="Inventory"
          description="Track tool conditions, loan history, and current holders."
          icon="📋"
          locked
        />
        <ModuleCard
          href="#"
          title="Maintenance"
          description="Report and track repairs, maintenance history, and condition updates."
          icon="🔨"
          locked
        />
        <ModuleCard
          href="#"
          title="Loans"
          description="Active and past loans, due dates, fines, and return processing."
          icon="📦"
          locked
        />
      </div>
    </div>
  );
}

function ModuleCard({
  href,
  title,
  description,
  icon,
  locked = false,
}: {
  href: string;
  title: string;
  description: string;
  icon: string;
  locked?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`relative rounded-lg border p-5 shadow-sm transition ${
        locked
          ? "cursor-not-allowed border-zinc-200 bg-zinc-50 opacity-60"
          : "border-zinc-200 bg-white hover:shadow-md hover:border-zinc-300"
      }`}
      onClick={locked ? (e) => e.preventDefault() : undefined}
    >
      {locked && (
        <span className="absolute right-3 top-3 rounded bg-zinc-200 px-2 py-0.5 text-xs font-medium text-zinc-500">
          Coming Soon
        </span>
      )}
      <span className="text-2xl">{icon}</span>
      <h3 className="mt-2 font-semibold text-zinc-900">{title}</h3>
      <p className="mt-1 text-sm text-zinc-500">{description}</p>
    </Link>
  );
}
