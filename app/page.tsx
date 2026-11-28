import Link from "next/link";
import { getGatewayUrl, SUPPORT_URL } from "@lib/config";

export const dynamic = "force-dynamic";

interface CommunityStats {
  totalCommunities: number;
  active: number;
}

interface PlatformStats {
  totalTools: number;
  totalMembers: number;
}

async function fetchStats<T>(path: string): Promise<T | null> {
  try {
    const res = await fetch(`${getGatewayUrl()}${path}`, { cache: "no-store" });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

async function getStats() {
  const [communities, platform] = await Promise.all([
    fetchStats<CommunityStats>("/api/communities/dashboard/stats"),
    fetchStats<PlatformStats>("/api/dashboard/stats"),
  ]);
  return { communities, platform };
}

const navLinkClass =
  "text-zinc-600 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100";
const primaryButtonClass =
  "rounded-lg bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300";
const secondaryButtonClass =
  "rounded-lg border border-zinc-300 px-5 py-2.5 text-sm font-medium transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-800";
const cardClass =
  "rounded-xl border border-zinc-200 p-5 transition-colors hover:border-zinc-400 dark:border-zinc-800 dark:hover:border-zinc-600";
const mutedClass = "text-zinc-600 dark:text-zinc-400";

const areas = [
  {
    href: "/communities",
    title: "Community Hub",
    text: "Find your neighbourhood on the map, join a community, or start a new one.",
  },
  {
    href: "/tools",
    title: "Tool Library",
    text: "Borrow drills, ladders and garden tools from your neighbours instead of buying them.",
  },
  {
    href: "/soup-kitchen",
    title: "Soup Kitchen",
    text: "Plan meal events, register guests, sign up to volunteer and record donations.",
  },
];

const pillars = [
  {
    title: "Sustainability",
    text: "Reduce waste by sharing instead of buying. Every item borrowed is one less item made, shipped and thrown away.",
  },
  {
    title: "Community",
    text: "Connect with neighbors through shared resources. Build trust, foster collaboration, and strengthen local networks.",
  },
  {
    title: "Collaboration",
    text: "Organise mutual aid together, from community kitchens to garden days. See what is available and who can help.",
  },
];

const steps = [
  { title: "Join", text: "Create an account and join the community where you live." },
  { title: "Take part", text: "Borrow and lend tools, volunteer at a kitchen, or register for a meal." },
  { title: "Give back", text: "Return what you borrowed, share what you have, and help the next neighbour." },
];

export default async function LandingPage() {
  const { communities, platform } = await getStats();
  const hasStats = communities !== null || platform !== null;

  return (
    <div className="landing relative min-h-screen text-zinc-900 dark:text-zinc-100">
      {/* Header */}
      <header className="relative z-10 border-b border-zinc-200 bg-white/80 backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/80">
        <nav className="mx-auto flex max-w-3xl items-center justify-between px-4 py-4">
          <Link href="/" className="text-lg font-semibold tracking-tight">
            TownsSquare
          </Link>
          <ul className="flex flex-wrap items-center justify-end gap-x-6 gap-y-2 text-sm">
            <li>
              <Link href="/communities" className={navLinkClass}>Communities</Link>
            </li>
            <li>
              <Link href="/tools" className={navLinkClass}>Tool Library</Link>
            </li>
            <li>
              <Link href="/soup-kitchen" className={navLinkClass}>Soup Kitchen</Link>
            </li>
            <li>
              <Link href="/login" className={navLinkClass}>Sign in</Link>
            </li>
          </ul>
        </nav>
      </header>

      <main className="relative z-10 mx-auto flex max-w-3xl flex-col gap-16 px-4 py-10">
        {/* Hero */}
        <section className="flex flex-col gap-6 pt-8">
          <div style={{ animation: "fadeIn 1.2s ease-out 0.3s forwards", opacity: 0 }}>
            <div className="rotate-graph h-12 w-12 text-zinc-400 dark:text-zinc-600">
              <svg viewBox="0 0 100 100">
                <line className="edge" x1="50" y1="50" x2="50" y2="10" stroke="currentColor" strokeWidth="1.5" opacity="0.5" />
                <line className="edge" x1="50" y1="50" x2="85" y2="30" stroke="currentColor" strokeWidth="1.5" opacity="0.5" />
                <line className="edge" x1="50" y1="50" x2="90" y2="65" stroke="currentColor" strokeWidth="1.5" opacity="0.5" />
                <line className="edge" x1="50" y1="50" x2="70" y2="90" stroke="currentColor" strokeWidth="1.5" opacity="0.5" />
                <line className="edge" x1="50" y1="50" x2="30" y2="90" stroke="currentColor" strokeWidth="1.5" opacity="0.5" />
                <line className="edge" x1="50" y1="50" x2="10" y2="65" stroke="currentColor" strokeWidth="1.5" opacity="0.5" />
                <line className="edge" x1="50" y1="50" x2="15" y2="30" stroke="currentColor" strokeWidth="1.5" opacity="0.5" />
                <circle cx="50" cy="50" r="5" className="fill-zinc-900 dark:fill-zinc-100" />
                <circle cx="50" cy="10" r="3.5" className="fill-zinc-400 dark:fill-zinc-500" />
                <circle cx="85" cy="30" r="3.5" className="fill-zinc-400 dark:fill-zinc-500" />
                <circle cx="90" cy="65" r="3.5" className="fill-zinc-400 dark:fill-zinc-500" />
                <circle cx="70" cy="90" r="3.5" className="fill-zinc-400 dark:fill-zinc-500" />
                <circle cx="30" cy="90" r="3.5" className="fill-zinc-400 dark:fill-zinc-500" />
                <circle cx="10" cy="65" r="3.5" className="fill-zinc-400 dark:fill-zinc-500" />
                <circle cx="15" cy="30" r="3.5" className="fill-zinc-400 dark:fill-zinc-500" />
              </svg>
            </div>
          </div>
          <h1
            className="text-4xl font-bold tracking-tight sm:text-5xl"
            style={{ animation: "fadeIn 1.2s ease-out 0.6s forwards", opacity: 0 }}
          >
            TownsSquare
          </h1>
          <p
            className="text-xs font-medium uppercase tracking-[0.1em] text-zinc-500 dark:text-zinc-400"
            style={{ animation: "fadeIn 1.2s ease-out 0.9s forwards", opacity: 0 }}
          >
            Community &middot; Sustainability &middot; Collaboration
          </p>
          <p
            className="max-w-2xl text-lg text-zinc-600 dark:text-zinc-400"
            style={{ animation: "fadeIn 1.2s ease-out 0.8s forwards", opacity: 0 }}
          >
            A neighbourhood toolkit for sharing and mutual aid. Borrow what you need, share what you have, and help the people around you.
          </p>
          <div
            className="flex flex-wrap gap-4 pt-2"
            style={{ animation: "fadeIn 1.2s ease-out 1.1s forwards", opacity: 0 }}
          >
            <Link href="/register" className={primaryButtonClass}>Create account</Link>
            <Link href="/login" className={secondaryButtonClass}>Sign in</Link>
          </div>
        </section>

        {/* Stats */}
        {hasStats && (
          <section className="grid grid-cols-2 gap-6 border-y border-zinc-200 py-8 sm:grid-cols-4 dark:border-zinc-800">
            {communities && <Stat value={communities.totalCommunities} label="Communities" />}
            {communities && <Stat value={communities.active} label="Active communities" />}
            {platform && <Stat value={platform.totalTools} label="Shared tools" />}
            {platform && <Stat value={platform.totalMembers} label="Verified members" />}
          </section>
        )}

        {/* Areas */}
        <section className="flex flex-col gap-4">
          <h2 className="text-xl font-semibold tracking-tight">What you can do</h2>
          <div className="grid gap-4 sm:grid-cols-3">
            {areas.map((area) => (
              <Link key={area.href} href={area.href} className={cardClass}>
                <h3 className="font-semibold">{area.title}</h3>
                <p className={`mt-1 text-sm ${mutedClass}`}>{area.text}</p>
              </Link>
            ))}
          </div>
        </section>

        {/* Pillars */}
        <section className="flex flex-col gap-4">
          <h2 className="text-xl font-semibold tracking-tight">Building stronger communities together</h2>
          <p className={mutedClass}>Three pillars that make TownsSquare more than a single service.</p>
          <div className="grid gap-6 sm:grid-cols-3">
            {pillars.map((pillar) => (
              <div key={pillar.title}>
                <h3 className="font-semibold">{pillar.title}</h3>
                <p className={`mt-1 text-sm ${mutedClass}`}>{pillar.text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* How it works */}
        <section className="flex flex-col gap-4">
          <h2 className="text-xl font-semibold tracking-tight">How it works</h2>
          <ol className="grid gap-6 sm:grid-cols-3">
            {steps.map((step, i) => (
              <li key={step.title}>
                <div className="flex h-8 w-8 items-center justify-center rounded-full border border-zinc-300 text-sm font-medium tabular-nums dark:border-zinc-700">
                  {i + 1}
                </div>
                <h3 className="mt-3 font-semibold">{step.title}</h3>
                <p className={`mt-1 text-sm ${mutedClass}`}>{step.text}</p>
              </li>
            ))}
          </ol>
        </section>

        {/* CTA */}
        <section className="flex flex-col gap-4 rounded-xl border border-zinc-200 p-6 dark:border-zinc-800">
          <h2 className="text-xl font-semibold tracking-tight">Ready to join your neighbours?</h2>
          <p className={mutedClass}>Create an account and find your community.</p>
          <div className="flex flex-wrap gap-4 pt-2">
            <Link href="/register" className={primaryButtonClass}>Get started</Link>
            <a href={SUPPORT_URL} target="_blank" rel="noopener noreferrer" className={secondaryButtonClass}>
              Support Portal
            </a>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="relative z-10 mt-16 border-t border-zinc-200 py-8 text-sm text-zinc-500 dark:border-zinc-800 dark:text-zinc-400">
        <div className="mx-auto max-w-3xl px-4">
          <p>&copy; {new Date().getFullYear()} TownsSquare. A neighbourhood toolkit for sharing and mutual aid.</p>
        </div>
      </footer>
    </div>
  );
}

function Stat({ value, label }: { value: number; label: string }) {
  return (
    <div>
      <p className="text-2xl font-semibold tracking-tight tabular-nums">{value}</p>
      <p className="text-sm text-zinc-500 dark:text-zinc-400">{label}</p>
    </div>
  );
}
