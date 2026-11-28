import ModuleCard from "../_components/ModuleCard";

export default function SoupKitchenHome() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-ui-50">Soup Kitchen</h1>
        <p className="mt-1 text-ui-200">Organize community meals, coordinate volunteers, and track donations.</p>
      </div>

      <h2 className="mb-4 text-lg font-semibold text-ui-100">Quick Access</h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <ModuleCard href="/soup-kitchen/events" title="Events" description="Plan and manage soup kitchen events." />
        <ModuleCard href="/soup-kitchen/meals" title="Meals" description="Plan meal menus and track quantities." />
        <ModuleCard href="/soup-kitchen/volunteers" title="Volunteers" description="Coordinate volunteer schedules." />
        <ModuleCard href="/soup-kitchen/donations" title="Donations" description="Track food and supply donations." />
        <ModuleCard href="/soup-kitchen/guests" title="Guests" description="Manage guest registrations." />
      </div>
    </div>
  );
}
