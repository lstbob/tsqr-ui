"use client";

import { useState } from "react";
import Link from "next/link";
import { useFetchJson } from "@lib/useFetchJson";
import type { PagedResult, SoupEvent } from "@lib/types";

const statusOptions = [
  { value: "", label: "All Statuses" },
  { value: "1", label: "Planned" },
  { value: "2", label: "Active" },
  { value: "3", label: "Completed" },
  { value: "4", label: "Cancelled" },
];

export default function EventsPage() {
  const [status, setStatus] = useState("");

  const params = new URLSearchParams();
  if (status) params.set("status", status);
  params.set("pageSize", "50");
  const { data, loading } = useFetchJson<PagedResult<SoupEvent>>(`/api/proxy/soup-kitchen/events?${params}`);

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-ui-50">Events</h1>
        <Link href="/soup-kitchen/events/new" className="rounded-lg bg-ui-50 px-4 py-2 text-sm font-semibold text-ui-950 hover:bg-ui-200">
          New Event
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
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {data.items.map((event) => (
            <Link
              key={event.id}
              href={`/soup-kitchen/events/${event.id}`}
              className="block rounded-lg border border-ui-700 bg-ui-900 p-5 shadow-sm shadow-black/20 transition hover:shadow-md hover:shadow-black/30 hover:border-ui-500"
            >
              <h3 className="font-semibold text-ui-50">{event.name}</h3>
              <p className="mt-1 text-sm text-ui-200 line-clamp-2">{event.description}</p>
              <div className="mt-3 flex items-center justify-between text-xs text-ui-400">
                <span>{event.eventDate ? new Date(event.eventDate).toLocaleDateString() : "—"}</span>
                <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                  event.statusName === "Planned" ? "bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300" :
                  event.statusName === "Active" ? "bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300" :
                  event.statusName === "Completed" ? "bg-ui-800 text-ui-100" :
                  "bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300"
                }`}>{event.statusName}</span>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <p className="py-12 text-center text-ui-400">No events found.</p>
      )}
    </div>
  );
}
