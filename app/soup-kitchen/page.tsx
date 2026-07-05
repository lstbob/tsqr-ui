import Link from "next/link";

export default function SoupKitchenHome() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-zinc-900">Soup Kitchen</h1>
        <p className="mt-1 text-zinc-500">Organize community meals, coordinate volunteers, and track donations.</p>
      </div>

      <h2 className="mb-4 text-lg font-semibold text-zinc-800">Quick Access</h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <ModuleCard href="/soup-kitchen/events" title="Events" description="Plan and manage soup kitchen events." icon="📅" />
        <ModuleCard href="/soup-kitchen/meals" title="Meals" description="Plan meal menus and track quantities." icon="🍽️" />
        <ModuleCard href="/soup-kitchen/volunteers" title="Volunteers" description="Coordinate volunteer schedules." icon="🤝" />
        <ModuleCard href="/soup-kitchen/donations" title="Donations" description="Track food and supply donations." icon="🎁" />
        <ModuleCard href="/soup-kitchen/guests" title="Guests" description="Manage guest registrations." icon="👥" />
      </div>
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
