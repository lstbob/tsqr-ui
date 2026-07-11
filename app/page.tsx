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

function Leaves() {
  const leaves = Array.from({ length: 10 }, (_, i) => (
    <div key={i} className="leaf">
      <div className="leaf-inner">
        <svg viewBox="0 0 24 24">
          <path d="M12 2C8 6 6 12 12 22C18 12 16 6 12 2Z" />
        </svg>
      </div>
    </div>
  ));
  return <div className="leaves">{leaves}</div>;
}

function ConnectionLines() {
  return (
    <div className="connection-lines">
      <svg viewBox="0 0 1920 1080" preserveAspectRatio="none">
        <line x1="200" y1="200" x2="600" y2="400" />
        <line x1="600" y1="400" x2="1000" y2="300" />
        <line x1="1000" y1="300" x2="1400" y2="500" />
        <line x1="1400" y1="500" x2="1700" y2="200" />
        <line x1="600" y1="400" x2="800" y2="700" />
        <line x1="800" y1="700" x2="1200" y2="800" />
        <line x1="1200" y1="800" x2="1400" y2="500" />
        <line x1="200" y1="200" x2="800" y2="700" />
      </svg>
    </div>
  );
}

export default async function LandingPage() {
  const stats = await getStats();

  return (
    <div className="relative">
      <Leaves />
      <ConnectionLines />

      {/* Hero */}
      <section className="relative z-10 overflow-hidden bg-gradient-to-br from-forest-950 via-forest-900 to-forest-950 text-forest-50">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:py-28 lg:py-32">
          <div className="max-w-3xl">
            <div className="mb-8 flex items-center gap-3" style={{animation: "fadeIn 1.2s ease-out 0.3s forwards", opacity: 0}}>
              <div className="h-16 w-16" style={{animation: "spin 20s linear infinite"}}>
                <svg viewBox="0 0 100 100">
                  <line className="edge" x1="50" y1="50" x2="50" y2="10" stroke="#4a7c3a" strokeWidth="1.5" opacity="0.5" />
                  <line className="edge" x1="50" y1="50" x2="85" y2="30" stroke="#4a7c3a" strokeWidth="1.5" opacity="0.5" />
                  <line className="edge" x1="50" y1="50" x2="90" y2="65" stroke="#4a7c3a" strokeWidth="1.5" opacity="0.5" />
                  <line className="edge" x1="50" y1="50" x2="70" y2="90" stroke="#4a7c3a" strokeWidth="1.5" opacity="0.5" />
                  <line className="edge" x1="50" y1="50" x2="30" y2="90" stroke="#4a7c3a" strokeWidth="1.5" opacity="0.5" />
                  <line className="edge" x1="50" y1="50" x2="10" y2="65" stroke="#4a7c3a" strokeWidth="1.5" opacity="0.5" />
                  <line className="edge" x1="50" y1="50" x2="15" y2="30" stroke="#4a7c3a" strokeWidth="1.5" opacity="0.5" />
                  <circle cx="50" cy="50" r="5" fill="#a8d88a" stroke="#6a9e4a" strokeWidth="1.5" />
                  <circle cx="50" cy="10" r="3.5" fill="#8ab96a" stroke="#4a7c3a" strokeWidth="1" />
                  <circle cx="85" cy="30" r="3.5" fill="#8ab96a" stroke="#4a7c3a" strokeWidth="1" />
                  <circle cx="90" cy="65" r="3.5" fill="#8ab96a" stroke="#4a7c3a" strokeWidth="1" />
                  <circle cx="70" cy="90" r="3.5" fill="#8ab96a" stroke="#4a7c3a" strokeWidth="1" />
                  <circle cx="30" cy="90" r="3.5" fill="#8ab96a" stroke="#4a7c3a" strokeWidth="1" />
                  <circle cx="10" cy="65" r="3.5" fill="#8ab96a" stroke="#4a7c3a" strokeWidth="1" />
                  <circle cx="15" cy="30" r="3.5" fill="#8ab96a" stroke="#4a7c3a" strokeWidth="1" />
                </svg>
              </div>
            </div>
            <h1 className="text-5xl font-bold tracking-tight sm:text-6xl text-forest-50" style={{animation: "fadeIn 1.2s ease-out 0.6s forwards", opacity: 0}}>
              TownsSquare
            </h1>
            <p className="mt-2 text-sm uppercase tracking-[0.1em] text-forest-600" style={{animation: "fadeIn 1.2s ease-out 0.9s forwards", opacity: 0}}>
              Community &middot; Sustainability &middot; Collaboration
            </p>
            <p className="mt-4 text-xl text-forest-200" style={{animation: "fadeIn 1.2s ease-out 0.8s forwards", opacity: 0}}>
              Community-powered tool sharing for a more sustainable tomorrow.
              Borrow what you need, share what you have.
            </p>
            <div className="mt-8 flex flex-wrap gap-4" style={{animation: "fadeIn 1.2s ease-out 1.1s forwards", opacity: 0}}>
              <Link
                href="/portal/tools"
                className="rounded-lg bg-forest-500 px-6 py-3 text-sm font-semibold text-forest-950 shadow-lg shadow-black/30 transition hover:bg-forest-400"
              >
                Explore the Tool Library
              </Link>
              <Link
                href="/login"
                className="rounded-lg border border-forest-600/50 px-6 py-3 text-sm font-semibold text-forest-100 transition hover:bg-forest-800/50"
              >
                Sign In
              </Link>
              <Link
                href="/register"
                className="rounded-lg border border-forest-600/50 px-6 py-3 text-sm font-semibold text-forest-100 transition hover:bg-forest-800/50"
              >
                Create Account
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      {stats && (
        <section className="relative z-10 border-t border-forest-800 bg-forest-950 py-12">
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
      <section className="relative z-10 border-t border-forest-800 bg-forest-900 py-20">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="text-3xl font-bold text-forest-50">Building stronger communities together</h2>
          <p className="mt-2 text-lg text-forest-200">
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
      <section className="relative z-10 border-t border-forest-800 bg-forest-950 py-20">
        <div className="mx-auto max-w-4xl px-4">
          <h2 className="text-3xl font-bold text-forest-50">How it works</h2>
          <div className="mt-12 grid gap-8 sm:grid-cols-3">
            <Step step="1" title="Browse" description="Search the catalog of available tools across all community locations." />
            <Step step="2" title="Reserve" description="Reserve a tool online and join the waitlist if it's currently loaned out." />
            <Step step="3" title="Pick up & return" description="Confirm pickup, use the tool, and return it when done — it's that simple." />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative z-10 border-t border-forest-800 bg-forest-900 py-20 text-forest-50">
        <div className="mx-auto max-w-3xl px-4 text-center">
          <h2 className="text-3xl font-bold">Ready to join the community?</h2>
          <p className="mt-3 text-forest-200">
            Create an account and start borrowing tools today.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Link href="/register" className="rounded-lg bg-forest-500 px-6 py-3 text-sm font-semibold text-forest-950 shadow-lg shadow-black/30 transition hover:bg-forest-400">
              Get Started
            </Link>
            <a href={SUPPORT_URL} target="_blank" rel="noopener noreferrer" className="rounded-lg border border-forest-600/50 px-6 py-3 text-sm font-semibold text-forest-100 transition hover:bg-forest-800/50">
              Support Portal
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-forest-800 bg-forest-950 py-8">
        <div className="mx-auto max-w-6xl px-4 text-center text-sm text-forest-600">
          <p>&copy; 2026 TownsSquare. A community tool sharing platform.</p>
        </div>
      </footer>
    </div>
  );
}

function Stat({ value, label }: { value: number; label: string }) {
  return (
    <div className="text-center">
      <p className="text-3xl font-bold text-forest-50">{value}</p>
      <p className="mt-1 text-xs font-medium text-forest-400">{label}</p>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: string; title: string; description: string }) {
  return (
    <div className="rounded-lg border border-forest-700 bg-forest-900 p-6 shadow-sm shadow-black/20">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-forest-800 text-3xl">{icon}</div>
      <h3 className="mt-4 text-xl font-semibold text-forest-50">{title}</h3>
      <p className="mt-2 text-forest-200">{description}</p>
    </div>
  );
}

function Step({ step, title, description }: { step: string; title: string; description: string }) {
  return (
    <div>
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-forest-800 text-lg font-bold text-forest-300">
        {step}
      </div>
      <h3 className="mt-4 font-semibold text-forest-50">{title}</h3>
      <p className="mt-1 text-sm text-forest-200">{description}</p>
    </div>
  );
}
