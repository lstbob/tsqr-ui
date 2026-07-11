"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function GuestsPage() {
  const [data, setData] = useState<{ items: any[] } | null>(null);
  const [events, setEvents] = useState<{ id: number; name: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [eventId, setEventId] = useState("");

  useEffect(() => {
    fetch("/api/proxy/soup-kitchen/events?pageSize=100")
      .then((r) => r.json())
      .then((d) => setEvents(d.items || []))
      .catch(() => {});
  }, []);

  useEffect(() => {
    const params = new URLSearchParams();
    if (eventId) params.set("eventId", eventId);
    params.set("pageSize", "50");
    setLoading(true);
    fetch(`/api/proxy/soup-kitchen/guests?${params}`)
      .then((r) => r.json())
      .then((d) => { setData(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, [eventId]);

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-forest-50">Guests</h1>
        <Link href="/soup-kitchen/guests/register" className="rounded-lg bg-forest-500 px-4 py-2 text-sm font-semibold text-white hover:bg-forest-400">
          Register Guest
        </Link>
      </div>

      <div className="mb-4">
        <select value={eventId} onChange={(e) => setEventId(e.target.value)} className="rounded-lg border border-forest-600 px-3 py-2 text-sm">
          <option value="">All Events</option>
          {events.map((e) => <option key={e.id} value={String(e.id)}>{e.name}</option>)}
        </select>
      </div>

      {loading ? (
        <p className="py-12 text-center text-forest-400">Loading...</p>
      ) : data && data.items.length > 0 ? (
        <div className="overflow-hidden rounded-lg border border-forest-700">
          <table className="w-full text-sm">
            <thead className="text-left text-forest-200">
              <tr>
                <th className="px-4 py-2 font-medium">Name</th>
                <th className="px-4 py-2 font-medium">Contact</th>
                <th className="px-4 py-2 font-medium">Guests</th>
                <th className="px-4 py-2 font-medium">Event</th>
                <th className="px-4 py-2 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {data.items.map((g: any) => (
                <tr key={g.id} className="border-t border-forest-700 hover:bg-forest-800">
                  <td className="px-4 py-2 font-medium text-forest-50">{g.name}</td>
                  <td className="px-4 py-2 text-forest-200">{g.contactInfo || "—"}</td>
                  <td className="px-4 py-2 text-forest-200">{g.guestCount}</td>
                  <td className="px-4 py-2 text-forest-200">{g.eventName}</td>
                  <td className="px-4 py-2">
                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                      g.statusName === "Confirmed" ? "bg-green-900/40 text-green-300" :
                      g.statusName === "Pending" ? "bg-yellow-900/40 text-yellow-300" :
                      "bg-forest-800 text-forest-100"
                    }`}>{g.statusName}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="py-12 text-center text-forest-400">No guests found.</p>
      )}
    </div>
  );
}
