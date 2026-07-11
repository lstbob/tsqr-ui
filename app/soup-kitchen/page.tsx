import Link from "next/link";

export default function SoupKitchenHome() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-forest-50">Soup Kitchen</h1>
        <p className="mt-1 text-forest-200">Organize community meals, coordinate volunteers, and track donations.</p>
      </div>

      <h2 className="mb-4 text-lg font-semibold text-forest-100">Quick Access</h2>
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
    <Link href={href} className="rounded-lg border border-forest-700 bg-forest-900 p-5 shadow-sm shadow-black/20 transition hover:shadow-md hover:shadow-black/30 hover:border-forest-500">
      <span className="text-2xl">{icon}</span>
      <h3 className="mt-2 font-semibold text-forest-50">{title}</h3>
      <p className="mt-1 text-sm text-forest-200">{description}</p>
    </Link>
  );
}
