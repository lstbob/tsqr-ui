"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NewReservationPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const fd = new FormData(e.currentTarget);
    const body = {
      itemId: Number(fd.get("itemId")),
      memberId: Number(fd.get("memberId")),
      reservationDate: fd.get("reservationDate"),
    };

    try {
      const res = await fetch("/api/proxy/reservations/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.message || "Failed to create reservation");
        setLoading(false);
        return;
      }
      router.push("/portal/reservations");
      router.refresh();
    } catch {
      setError("Network error");
      setLoading(false);
    }
  }

  return (
    <div className="max-w-xl">
      <h1 className="mb-6 text-2xl font-bold text-zinc-900">New Reservation</h1>
      <form onSubmit={handleSubmit} className="space-y-4 rounded-lg border border-zinc-200 bg-white p-6 shadow-sm">
        <div>
          <label className="mb-1 block text-sm font-medium text-zinc-700">Item ID *</label>
          <input type="number" name="itemId" required className="w-full rounded-lg border border-zinc-300 px-4 py-2 text-sm outline-none focus:border-emerald-500" />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-zinc-700">Member ID *</label>
          <input type="number" name="memberId" required className="w-full rounded-lg border border-zinc-300 px-4 py-2 text-sm outline-none focus:border-emerald-500" />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-zinc-700">Reservation Date *</label>
          <input type="date" name="reservationDate" required className="w-full rounded-lg border border-zinc-300 px-4 py-2 text-sm outline-none focus:border-emerald-500" />
        </div>
        {error && <p className="rounded-lg bg-red-50 px-4 py-2 text-sm text-red-600">{error}</p>}
        <button type="submit" disabled={loading} className="rounded-lg bg-emerald-700 px-6 py-2.5 text-sm font-semibold text-white hover:bg-emerald-800 disabled:opacity-50">
          {loading ? "Creating..." : "Create Reservation"}
        </button>
      </form>
    </div>
  );
}