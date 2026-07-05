"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const statusOptions = [
  { value: "", label: "All Statuses" },
  { value: "1", label: "Planned" },
  { value: "2", label: "Active" },
  { value: "3", label: "Completed" },
  { value: "4", label: "Cancelled" },
];

export default function EventsPage() {
  const [data, setData] = useState<{ items: any[] } | null>(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("");

  useEffect(() => {
    const params = new URLSearchParams();
    if (status) params.set("status", status);
    params.set("pageSize", "50");
    setLoading(true);
    fetch(`/api/proxy/soup-kitchen/events?${params}`)
      .then((r) => r.json())
      .then((d) => { setData(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, [status]);

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-zinc-900">Events</h1>
        <Link href="/soup-kitchen/events/new" className="rounded-lg bg-emerald-700 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-800">
          New Event
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
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {data.items.map((event: any) => (
            <Link
              key={event.id}
              href={`/soup-kitchen/events/${event.id}`}
              className="block rounded-lg border border-zinc-200 bg-white p-5 shadow-sm transition hover:shadow-md hover:border-zinc-300"
            >
              <h3 className="font-semibold text-zinc-900">{event.name}</h3>
              <p className="mt-1 text-sm text-zinc-500 line-clamp-2">{event.description}</p>
              <div className="mt-3 flex items-center justify-between text-xs text-zinc-400">
                <span>{event.eventDate ? new Date(event.eventDate).toLocaleDateString() : "—"}</span>
                <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                  event.statusName === "Planned" ? "bg-blue-100 text-blue-700" :
                  event.statusName === "Active" ? "bg-green-100 text-green-700" :
                  event.statusName === "Completed" ? "bg-zinc-100 text-zinc-700" :
                  "bg-red-100 text-red-700"
                }`}>{event.statusName}</span>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <p className="py-12 text-center text-zinc-400">No events found.</p>
      )}
    </div>
  );
}
