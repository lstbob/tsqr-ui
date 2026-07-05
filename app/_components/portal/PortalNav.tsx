"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/portal", label: "Dashboard" },
  { href: "/tools", label: "Tool Library" },
  { href: "/portal/members", label: "Members" },
  { href: "/portal/reservations", label: "Reservations" },
  { href: "/portal/loans", label: "Loans" },
  { href: "/portal/inventory", label: "Inventory" },
  { href: "/soup-kitchen", label: "Soup Kitchen" },
];

export default function PortalNav({ role }: { role: string }) {
  const pathname = usePathname();

  return (
    <nav className="flex items-center gap-1">
      {navItems.map((item) => {
        const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`rounded-md px-3 py-1.5 text-sm font-medium transition ${
              isActive
                ? "bg-emerald-100 text-emerald-800"
                : "text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100"
            }`}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
