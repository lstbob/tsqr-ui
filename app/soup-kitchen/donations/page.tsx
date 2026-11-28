"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useFetchJson } from "@lib/useFetchJson";
import type { PagedResult, Donation } from "@lib/types";

export default function DonationsPage() {
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
  const { data, loading } = useFetchJson<PagedResult<Donation>>(`/api/proxy/soup-kitchen/donations?${params}`);

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-ui-50">Donations</h1>
        <Link href="/soup-kitchen/donations/record" className="rounded-lg bg-ui-50 px-4 py-2 text-sm font-semibold text-ui-950 hover:bg-ui-200">
          Record Donation
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
                <th className="px-4 py-2 font-medium">Donor</th>
                <th className="px-4 py-2 font-medium">Item</th>
                <th className="px-4 py-2 font-medium">Quantity</th>
                <th className="px-4 py-2 font-medium">Event</th>
                <th className="px-4 py-2 font-medium">Date</th>
              </tr>
            </thead>
            <tbody>
              {data.items.map((d) => (
                <tr key={d.id} className="border-t border-ui-700 hover:bg-ui-800">
                  <td className="px-4 py-2 font-medium text-ui-50">{d.donorName}</td>
                  <td className="px-4 py-2 text-ui-200">{d.item}</td>
                  <td className="px-4 py-2 text-ui-200">{d.quantity}</td>
                  <td className="px-4 py-2 text-ui-200">{d.eventName}</td>
                  <td className="px-4 py-2 text-ui-200">{d.donationDate ? new Date(d.donationDate).toLocaleDateString() : "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="py-12 text-center text-ui-400">No donations found.</p>
      )}
    </div>
  );
}
