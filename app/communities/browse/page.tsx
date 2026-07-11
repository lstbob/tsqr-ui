"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface Community {
  id: number;
  name: string;
  neighbourhood: string;
  city: string;
  country: string;
  status: number;
  statusName: string;
}

function statusBadgeClass(statusName: string) {
  switch (statusName) {
    case "PendingConfirmation":
      return "bg-yellow-900/40 text-yellow-300";
    case "Active":
      return "bg-green-900/40 text-green-300";
    case "Suspended":
      return "bg-red-900/40 text-red-300";
    case "Archived":
      return "bg-gray-800 text-gray-300";
    default:
      return "bg-forest-800 text-forest-100";
  }
}

export default function BrowseCommunitiesPage() {
  const [data, setData] = useState<{ items: Community[] } | null>(null);
  const [loading, setLoading] = useState(true);
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");

  useEffect(() => {
    const params = new URLSearchParams();
    if (country) params.set("country", country);
    if (city) params.set("city", city);
    params.set("pageSize", "50");
    setLoading(true);
    fetch(`/api/proxy/communities?${params}`)
      .then((r) => r.json())
      .then((d) => { setData(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, [country, city]);

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-forest-50">Browse Communities</h1>
      </div>

      <div className="mb-4 flex gap-3">
        <input
          type="text"
          placeholder="Search by country..."
          value={country}
          onChange={(e) => setCountry(e.target.value)}
          className="rounded-lg border border-forest-600 px-3 py-2 text-sm outline-none focus:border-forest-400"
        />
        <input
          type="text"
          placeholder="Search by city..."
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="rounded-lg border border-forest-600 px-3 py-2 text-sm outline-none focus:border-forest-400"
        />
      </div>

      {loading ? (
        <p className="py-12 text-center text-forest-400">Loading...</p>
      ) : data && data.items && data.items.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {data.items.map((c: Community) => (
            <Link
              key={c.id}
              href={`/communities/${c.id}`}
              className="block rounded-lg border border-forest-700 bg-forest-900 p-5 shadow-sm shadow-black/20 transition hover:shadow-md hover:shadow-black/30 hover:border-forest-500"
            >
              <h3 className="font-semibold text-forest-50">{c.name}</h3>
              <p className="mt-1 text-sm text-forest-200">
                {c.neighbourhood}, {c.city}, {c.country}
              </p>
              <div className="mt-3">
                <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${statusBadgeClass(c.statusName)}`}>
                  {c.statusName}
                </span>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <p className="py-12 text-center text-forest-400">No communities found.</p>
      )}
    </div>
  );
}
