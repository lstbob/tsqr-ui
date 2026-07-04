"use client";

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
        className="flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm hover:bg-zinc-100"
      >
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-600 text-xs font-bold text-white">
          {name.charAt(0).toUpperCase()}
        </div>
        <span className="font-medium text-zinc-700">{name}</span>
        <span className="rounded bg-zinc-100 px-1.5 py-0.5 text-xs text-zinc-500">{role}</span>
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-1 w-44 rounded-lg border border-zinc-200 bg-white py-1 shadow-lg">
          <button
            onClick={logout}
            className="w-full px-4 py-2 text-left text-sm text-zinc-600 hover:bg-zinc-50"
          >
            Sign Out
          </button>
        </div>
      )}
    </div>
  );
}