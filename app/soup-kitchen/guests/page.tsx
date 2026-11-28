"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useFetchJson } from "@lib/useFetchJson";
import type { PagedResult, Guest } from "@lib/types";

export default function GuestsPage() {
  const [events, setEvents] = useState<{ id: number; name: string }[]>([]);
  const [eventId, setEventId] = useState("");

  useEffect(() => {
    fetch("/api/proxy/soup-kitchen/events?pageSize=100")
      .then((r) => r.json())
      .then((d) => setEvents(d.items || []))
      .catch(() => {});
  }, []);

  const params = new URLSearchParams();
  if (eventId) params.set("eventId", eventId);
  params.set("pageSize", "50");
  const { data, loading } = useFetchJson<PagedResult<Guest>>(`/api/proxy/soup-kitchen/guests?${params}`);

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-ui-50">Guests</h1>
        <Link href="/soup-kitchen/guests/register" className="rounded-lg bg-ui-50 px-4 py-2 text-sm font-semibold text-ui-950 hover:bg-ui-200">
          Register Guest
        </Link>
      </div>

      <div className="mb-4">
        <select value={eventId} onChange={(e) => setEventId(e.target.value)} className="rounded-lg border border-ui-600 px-3 py-2 text-sm">
          <option value="">All Events</option>
          {events.map((e) => <option key={e.id} value={String(e.id)}>{e.name}</option>)}
        </select>
      </div>

      {loading ? (
        <p className="py-12 text-center text-ui-400">Loading...</p>
      ) : data && data.items.length > 0 ? (
        <div className="overflow-hidden rounded-lg border border-ui-700">
          <table className="w-full text-sm">
            <thead className="text-left text-ui-200">
              <tr>
                <th className="px-4 py-2 font-medium">Name</th>
                <th className="px-4 py-2 font-medium">Contact</th>
                <th className="px-4 py-2 font-medium">Guests</th>
                <th className="px-4 py-2 font-medium">Event</th>
                <th className="px-4 py-2 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {data.items.map((g) => (
                <tr key={g.id} className="border-t border-ui-700 hover:bg-ui-800">
                  <td className="px-4 py-2 font-medium text-ui-50">{g.name}</td>
                  <td className="px-4 py-2 text-ui-200">{g.contactInfo || "—"}</td>
                  <td className="px-4 py-2 text-ui-200">{g.guestCount}</td>
                  <td className="px-4 py-2 text-ui-200">{g.eventName}</td>
                  <td className="px-4 py-2">
                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                      g.statusName === "Confirmed" ? "bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300" :
                      g.statusName === "Pending" ? "bg-yellow-100 dark:bg-yellow-900/40 text-yellow-700 dark:text-yellow-300" :
                      "bg-ui-800 text-ui-100"
                    }`}>{g.statusName}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="py-12 text-center text-ui-400">No guests found.</p>
      )}
    </div>
  );
}
