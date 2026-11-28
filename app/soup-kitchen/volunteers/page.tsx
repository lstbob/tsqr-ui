"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useFetchJson } from "@lib/useFetchJson";
import type { PagedResult, Volunteer } from "@lib/types";

const roleOptions = [
  { value: "", label: "All Roles" },
  { value: "1", label: "Cook" },
  { value: "2", label: "Server" },
  { value: "3", label: "Cleaner" },
  { value: "4", label: "Organizer" },
  { value: "5", label: "Driver" },
  { value: "6", label: "Other" },
];

export default function VolunteersPage() {
  const [events, setEvents] = useState<{ id: number; name: string }[]>([]);
  const [eventId, setEventId] = useState("");
  const [role, setRole] = useState("");

  useEffect(() => {
    fetch("/api/proxy/soup-kitchen/events?pageSize=100")
      .then((r) => r.json())
      .then((d) => setEvents(d.items || []))
      .catch(() => {});
  }, []);

  const params = new URLSearchParams();
  if (eventId) params.set("eventId", eventId);
  if (role) params.set("role", role);
  params.set("pageSize", "50");
  const { data, loading } = useFetchJson<PagedResult<Volunteer>>(`/api/proxy/soup-kitchen/volunteers?${params}`);

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-ui-50">Volunteers</h1>
        <Link href="/soup-kitchen/volunteers/register" className="rounded-lg bg-ui-50 px-4 py-2 text-sm font-semibold text-ui-950 hover:bg-ui-200">
          Register Volunteer
        </Link>
      </div>

      <div className="mb-4 flex gap-3">
        <select value={eventId} onChange={(e) => setEventId(e.target.value)} className="rounded-lg border border-ui-600 px-3 py-2 text-sm">
          <option value="">All Events</option>
          {events.map((e) => <option key={e.id} value={String(e.id)}>{e.name}</option>)}
        </select>
        <select value={role} onChange={(e) => setRole(e.target.value)} className="rounded-lg border border-ui-600 px-3 py-2 text-sm">
          {roleOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
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
                <th className="px-4 py-2 font-medium">Event</th>
                <th className="px-4 py-2 font-medium">Role</th>
                <th className="px-4 py-2 font-medium">Status</th>
                <th className="px-4 py-2 font-medium">Hours</th>
              </tr>
            </thead>
            <tbody>
              {data.items.map((v) => (
                <tr key={v.id} className="border-t border-ui-700 hover:bg-ui-800">
                  <td className="px-4 py-2 font-medium text-ui-50">{v.memberName}</td>
                  <td className="px-4 py-2 text-ui-200">{v.eventName}</td>
                  <td className="px-4 py-2 text-ui-200">{v.roleName}</td>
                  <td className="px-4 py-2">
                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                      v.statusName === "Confirmed" ? "bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300" :
                      v.statusName === "Pending" ? "bg-yellow-100 dark:bg-yellow-900/40 text-yellow-700 dark:text-yellow-300" :
                      "bg-ui-800 text-ui-100"
                    }`}>{v.statusName}</span>
                  </td>
                  <td className="px-4 py-2 text-ui-200">{v.hoursScheduled ?? "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="py-12 text-center text-ui-400">No volunteers found.</p>
      )}
    </div>
  );
}
