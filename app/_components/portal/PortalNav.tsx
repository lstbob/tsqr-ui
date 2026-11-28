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
  { href: "/communities", label: "Communities" },
];

export default function PortalNav({}: { role: string }) {
  const pathname = usePathname();

  return (
    <nav className="flex flex-wrap items-center gap-1">
      {navItems.map((item) => {
        const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
        return (
          <Link
            key={item.href}
            href={item.href}
            className={
              isActive
                ? "rounded-md bg-ui-800 px-3 py-1.5 text-sm font-medium text-ui-50"
                : "rounded-md px-3 py-1.5 text-sm text-ui-300 transition-colors hover:text-ui-50"
            }
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
