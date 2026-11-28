import ModuleCard from "../_components/ModuleCard";

export default function CommunitiesHome() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-ui-50">Communities</h1>
        <p className="mt-1 text-ui-200">Discover and manage neighbourhood communities across the globe.</p>
      </div>

      <h2 className="mb-4 text-lg font-semibold text-ui-100">Quick Access</h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <ModuleCard href="/communities/browse" title="Browse Communities" description="Search and explore communities by country and city." />
        <ModuleCard href="/communities/quick-register" title="Quick Register" description="Register a new community for admin approval." />
      </div>
    </div>
  );
}
