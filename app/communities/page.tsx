import Link from "next/link";

export default function CommunitiesHome() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-forest-50">Communities</h1>
        <p className="mt-1 text-forest-200">Discover and manage neighbourhood communities across the globe.</p>
      </div>

      <h2 className="mb-4 text-lg font-semibold text-forest-100">Quick Access</h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <ModuleCard href="/communities/browse" title="Browse Communities" description="Search and explore communities by country and city." icon="🌍" />
        <ModuleCard href="/communities/quick-register" title="Quick Register" description="Register a new community for admin approval." icon="📝" />
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
