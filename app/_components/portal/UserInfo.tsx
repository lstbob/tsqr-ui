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
        className="flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm hover:bg-ui-800"
      >
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-ui-50 text-xs font-bold text-ui-950">
          {name.charAt(0).toUpperCase()}
        </div>
        <span className="font-medium text-ui-100">{name}</span>
        <span className="rounded bg-ui-800 px-1.5 py-0.5 text-xs text-ui-300">{role}</span>
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-1 w-44 rounded-lg border border-ui-700 bg-ui-900 py-1 shadow-lg shadow-black/30">
          <Link
            href="/portal/profile"
            onClick={() => setOpen(false)}
            className="block w-full px-4 py-2 text-left text-sm text-ui-200 hover:bg-ui-800"
          >
            My Profile
          </Link>
          <hr className="my-1 border-ui-700" />
          <button
            onClick={logout}
            className="w-full px-4 py-2 text-left text-sm text-ui-200 hover:bg-ui-800"
          >
            Sign Out
          </button>
        </div>
      )}
    </div>
  );
}
