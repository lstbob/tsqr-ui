"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function UserInfo({ name, role }: { name: string; role: string }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
    router.refresh();
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm hover:bg-forest-800"
      >
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-forest-500 text-xs font-bold text-forest-950">
          {name.charAt(0).toUpperCase()}
        </div>
        <span className="font-medium text-forest-100">{name}</span>
        <span className="rounded bg-forest-800 px-1.5 py-0.5 text-xs text-forest-300">{role}</span>
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-1 w-44 rounded-lg border border-forest-700 bg-forest-900 py-1 shadow-lg shadow-black/30">
          <Link
            href="/portal/profile"
            onClick={() => setOpen(false)}
            className="block w-full px-4 py-2 text-left text-sm text-forest-200 hover:bg-forest-800"
          >
            My Profile
          </Link>
          <hr className="my-1 border-forest-700" />
          <button
            onClick={logout}
            className="w-full px-4 py-2 text-left text-sm text-forest-200 hover:bg-forest-800"
          >
            Sign Out
          </button>
        </div>
      )}
    </div>
  );
}
