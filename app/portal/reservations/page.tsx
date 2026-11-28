"use client";

import { useState } from "react";
import Link from "next/link";
import { useFetchJson } from "@lib/useFetchJson";
import type { PagedResult, Reservation } from "@lib/types";

const statusOptions = [
  { value: "", label: "All Statuses" },
  { value: "1", label: "Pending" },
  { value: "2", label: "Confirmed" },
  { value: "3", label: "Active" },
  { value: "4", label: "Cancelled" },
  { value: "5", label: "Completed" },
];

export default function ReservationsPage() {
  const [status, setStatus] = useState("");
  const [refresh, setRefresh] = useState(0);

  const params = new URLSearchParams();
  if (status) params.set("status", status);
  params.set("pageSize", "50");
  if (refresh) params.set("refresh", String(refresh));
  const { data, loading } = useFetchJson<PagedResult<Reservation>>(`/api/proxy/reservations?${params}`);

  async function postAction(endpoint: string, resId: number) {
    try {
      const res = await fetch(`/api/proxy/reservations/${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reservationId: resId }),
      });
      if (res.ok) setRefresh((n) => n + 1);
    } catch {}
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-ui-50">Reservations</h1>
        <Link href="/portal/reservations/new" className="rounded-lg bg-ui-50 px-4 py-2 text-sm font-semibold text-ui-950 hover:bg-ui-200">
          New Reservation
        </Link>
      </div>

      <div className="mb-4">
        <select value={status} onChange={(e) => setStatus(e.target.value)} className="rounded-lg border border-ui-600 px-3 py-2 text-sm">
          {statusOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      </div>

      {loading ? (
        <p className="py-12 text-center text-ui-400">Loading...</p>
      ) : data && data.items.length > 0 ? (
        <div className="space-y-3">
          {data.items.map((r) => (
            <div key={r.id} className="rounded-lg border border-ui-700 bg-ui-900 p-4 shadow-sm shadow-black/20">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-semibold text-ui-50">#{r.id} — {r.toolModel}</p>
                  <p className="text-sm text-ui-200">Serial: {r.itemSerialNumber} | Member: {r.memberName}</p>
                  <p className="text-sm text-ui-200">Reserved: {new Date(r.reservationDate).toLocaleDateString()} → Expires: {new Date(r.expiryDate).toLocaleDateString()}</p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                    r.statusName === "Pending" ? "bg-yellow-100 dark:bg-yellow-900/40 text-yellow-700 dark:text-yellow-300" :
                    r.statusName === "Active" ? "bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300" :
                    r.statusName === "Completed" ? "bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300" :
                    "bg-ui-800 text-ui-100"
                  }`}>{r.statusName}</span>
                  {r.statusName === "Pending" && (
                    <div className="flex gap-1">
                      <button onClick={() => postAction("activate", r.id)} className="rounded bg-blue-800 px-2 py-1 text-xs text-blue-100 hover:bg-blue-600">Activate</button>
                      <button onClick={() => postAction("cancel", r.id)} className="rounded bg-red-800 px-2 py-1 text-xs text-red-100 hover:bg-red-600">Cancel</button>
                    </div>
                  )}
                  {r.statusName === "Active" && (
                    <div className="flex gap-1">
                      <button onClick={() => postAction("confirm-pickup", r.id)} className="rounded bg-green-800 px-2 py-1 text-xs text-green-100 hover:bg-green-600">Confirm Pickup</button>
                      <button onClick={() => postAction("complete", r.id)} className="rounded bg-ui-50 px-2 py-1 text-xs text-ui-950 hover:bg-ui-200">Complete</button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="py-12 text-center text-ui-400">No reservations found.</p>
      )}
    </div>
  );
}