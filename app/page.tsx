import Link from "next/link";
import { getGatewayUrl, SUPPORT_URL } from "@lib/config";

async function getStats() {
  try {
    const res = await fetch(`${getGatewayUrl()}/api/dashboard/stats`, { cache: "no-store" });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export default async function LandingPage() {
  const stats = await getStats();

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-emerald-900 via-green-800 to-teal-900 text-white">
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Cpattern id='grain' width='1' height='1'%3E%3Ccircle cx='50' cy='50' r='0.5' fill='white'/%3E%3C/pattern%3E%3Crect width='100' height='100' fill='url(%23grain)'/%3E%3C/svg%3E")`,
        }} />
        <div className="relative mx-auto max-w-6xl px-4 py-24">
          <div className="max-w-3xl">
            <h1 className="text-5xl font-bold tracking-tight sm:text-6xl">
              TownsSquare
            </h1>
            <p className="mt-4 text-xl text-emerald-100">
              Community-powered tool sharing for a more sustainable tomorrow.
              Borrow what you need, share what you have.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/portal/tools"
                className="rounded-lg bg-white px-6 py-3 text-sm font-semibold text-emerald-900 shadow-lg transition hover:bg-emerald-50"
              >
                Explore the Tool Library
              </Link>
              <Link
                href="/login"
                className="rounded-lg border border-white/30 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                Sign In
              </Link>
              <Link
                href="/register"
                className="rounded-lg border border-white/30 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                Create Account
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      {stats && (
        <section className="bg-white py-12">
          <div className="mx-auto grid max-w-6xl grid-cols-2 gap-6 px-4 md:grid-cols-5">
            <Stat value={stats.totalTools} label="Tools Available" />
            <Stat value={stats.totalMembers} label="Community Members" />
            <Stat value={stats.activeLoans} label="Active Loans" />
            <Stat value={stats.underMaintenance} label="In Maintenance" />
            <Stat value={stats.pendingReservations} label="Pending Reservations" />
          </div>
        </section>
      )}

      {/* Features */}
      <section className="bg-zinc-50 py-20">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="text-3xl font-bold text-zinc-900">Building stronger communities together</h2>
          <p className="mt-2 text-lg text-zinc-500">
            Three pillars that make TownsSquare more than just a tool library.
          </p>
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            <FeatureCard
              icon="🌱"
              title="Sustainability"
              description="Reduce waste by sharing instead of buying. Every tool borrowed is one less tool manufactured, shipped, and eventually discarded."
            />
            <FeatureCard
              icon="🤝"
              title="Community"
              description="Connect with neighbors through shared resources. Build trust, foster collaboration, and strengthen local networks."
            />
            <FeatureCard
              icon="🔧"
              title="Collaboration"
              description="Access the right tool for any job — from DIY projects to community gardens. Track availability and reserve tools online."
            />
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-4xl px-4">
          <h2 className="text-3xl font-bold text-zinc-900">How it works</h2>
          <div className="mt-12 grid gap-8 sm:grid-cols-3">
            <Step step="1" title="Browse" description="Search the catalog of available tools across all community locations." />
            <Step step="2" title="Reserve" description="Reserve a tool online and join the waitlist if it's currently loaned out." />
            <Step step="3" title="Pick up & return" description="Confirm pickup, use the tool, and return it when done — it's that simple." />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-emerald-900 py-20 text-white">
        <div className="mx-auto max-w-3xl px-4 text-center">
          <h2 className="text-3xl font-bold">Ready to join the community?</h2>
          <p className="mt-3 text-emerald-100">
            Create an account and start borrowing tools today.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Link href="/register" className="rounded-lg bg-white px-6 py-3 text-sm font-semibold text-emerald-900 shadow-lg transition hover:bg-emerald-50">
              Get Started
            </Link>
            <a href={SUPPORT_URL} target="_blank" rel="noopener noreferrer" className="rounded-lg border border-white/30 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10">
              Support Portal
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-200 bg-zinc-50 py-8">
        <div className="mx-auto max-w-6xl px-4 text-center text-sm text-zinc-500">
          <p>&copy; 2026 TownsSquare. A community tool sharing platform.</p>
        </div>
      </footer>
    </div>
  );
}

function Stat({ value, label }: { value: number; label: string }) {
  return (
    <div className="text-center">
      <p className="text-3xl font-bold text-emerald-900">{value}</p>
      <p className="mt-1 text-xs font-medium text-zinc-500">{label}</p>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: string; title: string; description: string }) {
  return (
    <div>
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 text-3xl">{icon}</div>
      <h3 className="mt-4 text-xl font-semibold text-zinc-900">{title}</h3>
      <p className="mt-2 text-zinc-500">{description}</p>
    </div>
  );
}

function Step({ step, title, description }: { step: string; title: string; description: string }) {
  return (
    <div>
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-lg font-bold text-emerald-700">
        {step}
      </div>
      <h3 className="mt-4 font-semibold text-zinc-900">{title}</h3>
      <p className="mt-1 text-sm text-zinc-500">{description}</p>
    </div>
  );
}