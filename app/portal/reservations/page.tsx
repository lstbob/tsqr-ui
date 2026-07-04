"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const statusOptions = [
  { value: "", label: "All Statuses" },
  { value: "1", label: "Pending" },
  { value: "2", label: "Confirmed" },
  { value: "3", label: "Active" },
  { value: "4", label: "Cancelled" },
  { value: "5", label: "Completed" },
];

export default function ReservationsPage() {
  const [data, setData] = useState<{ items: any[] } | null>(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("");

  useEffect(() => {
    const params = new URLSearchParams();
    if (status) params.set("status", status);
    params.set("pageSize", "50");
    setLoading(true);
    fetch(`/api/proxy/reservations?${params}`)
      .then((r) => r.json())
      .then((d) => { setData(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, [status]);

  async function postAction(endpoint: string, resId: number, label: string) {
    try {
      const res = await fetch(`/api/proxy/reservations/${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reservationId: resId }),
      });
      if (res.ok) {
        const params = new URLSearchParams();
        if (status) params.set("status", status);
        params.set("pageSize", "50");
        fetch(`/api/proxy/reservations?${params}`).then((r) => r.json()).then(setData);
      }
    } catch {}
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-zinc-900">Reservations</h1>
        <Link href="/portal/reservations/new" className="rounded-lg bg-emerald-700 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-800">
          New Reservation
        </Link>
      </div>

      <div className="mb-4">
        <select value={status} onChange={(e) => setStatus(e.target.value)} className="rounded-lg border border-zinc-300 px-3 py-2 text-sm">
          {statusOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      </div>

      {loading ? (
        <p className="py-12 text-center text-zinc-400">Loading...</p>
      ) : data && data.items.length > 0 ? (
        <div className="space-y-3">
          {data.items.map((r) => (
            <div key={r.id} className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-semibold text-zinc-900">#{r.id} — {r.toolModel}</p>
                  <p className="text-sm text-zinc-500">Serial: {r.itemSerialNumber} | Member: {r.memberName}</p>
                  <p className="text-sm text-zinc-500">Reserved: {new Date(r.reservationDate).toLocaleDateString()} → Expires: {new Date(r.expiryDate).toLocaleDateString()}</p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                    r.statusName === "Pending" ? "bg-yellow-100 text-yellow-700" :
                    r.statusName === "Active" ? "bg-blue-100 text-blue-700" :
                    r.statusName === "Completed" ? "bg-green-100 text-green-700" :
                    "bg-zinc-100 text-zinc-600"
                  }`}>{r.statusName}</span>
                  {r.statusName === "Pending" && (
                    <div className="flex gap-1">
                      <button onClick={() => postAction("activate", r.id, "Activate")} className="rounded bg-blue-600 px-2 py-1 text-xs text-white hover:bg-blue-700">Activate</button>
                      <button onClick={() => postAction("cancel", r.id, "Cancel")} className="rounded bg-red-600 px-2 py-1 text-xs text-white hover:bg-red-700">Cancel</button>
                    </div>
                  )}
                  {r.statusName === "Active" && (
                    <div className="flex gap-1">
                      <button onClick={() => postAction("confirm-pickup", r.id, "Confirm")} className="rounded bg-green-600 px-2 py-1 text-xs text-white hover:bg-green-700">Confirm Pickup</button>
                      <button onClick={() => postAction("complete", r.id, "Complete")} className="rounded bg-emerald-700 px-2 py-1 text-xs text-white hover:bg-emerald-800">Complete</button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="py-12 text-center text-zinc-400">No reservations found.</p>
      )}
    </div>
  );
}