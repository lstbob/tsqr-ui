import Link from "next/link";

export default function NavBar() {
  return (
    <nav className="border-b border-zinc-200 bg-white">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="text-xl font-bold tracking-tight text-zinc-900">
          TSQR Platform
        </Link>
        <div className="flex items-center gap-6">
          <Link href="/" className="text-sm font-medium text-zinc-600 hover:text-zinc-900">
            Dashboard
          </Link>
          <Link href="/tools" className="text-sm font-medium text-zinc-600 hover:text-zinc-900">
            Tool Library
          </Link>
        </div>
      </div>
    </nav>
  );
}
