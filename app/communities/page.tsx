import Link from "next/link";

export default function CommunitiesHome() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-zinc-900">Communities</h1>
        <p className="mt-1 text-zinc-500">Discover and manage neighbourhood communities across the globe.</p>
      </div>

      <h2 className="mb-4 text-lg font-semibold text-zinc-800">Quick Access</h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <ModuleCard href="/communities/browse" title="Browse Communities" description="Search and explore communities by country and city." icon="🌍" />
        <ModuleCard href="/communities/quick-register" title="Quick Register" description="Register a new community for admin approval." icon="📝" />
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
