"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const memberStatusOptions = [
  { value: "", label: "All Statuses" },
  { value: "1", label: "Active" },
  { value: "2", label: "Suspended" },
  { value: "3", label: "Banned" },
];

export default function MembersPage() {
  const [data, setData] = useState<{ items: any[]; totalCount: number; page: number; pageSize: number } | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (status) params.set("status", status);
    params.set("page", String(page));
    setLoading(true);
    fetch(`/api/proxy/members?${params}`)
      .then((r) => r.json())
      .then((d) => { setData(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, [search, status, page]);

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-forest-50">Members</h1>
        <Link href="/portal/members/register" className="rounded-lg bg-forest-500 px-4 py-2 text-sm font-semibold text-forest-950 hover:bg-forest-400">
          Register Member
        </Link>
      </div>

      <div className="mb-4 flex gap-3">
        <input
          type="text"
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          className="flex-1 rounded-lg border border-forest-600 px-4 py-2 text-sm outline-none focus:border-forest-400"
        />
        <select value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }} className="rounded-lg border border-forest-600 px-3 py-2 text-sm">
          {memberStatusOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      </div>

      {loading ? (
        <p className="py-12 text-center text-forest-400">Loading...</p>
      ) : data && data.items.length > 0 ? (
        <div className="overflow-hidden rounded-lg border border-forest-700">
          <table className="w-full text-sm">
            <thead className="text-left text-forest-200">
              <tr>
                <th className="px-4 py-2 font-medium">ID</th>
                <th className="px-4 py-2 font-medium">Name</th>
                <th className="px-4 py-2 font-medium">Email</th>
                <th className="px-4 py-2 font-medium">Status</th>
                <th className="px-4 py-2 font-medium">Membership</th>
                <th className="px-4 py-2 font-medium">Verified</th>
                <th className="px-4 py-2 font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {data.items.map((m) => (
                <tr key={m.id} className="border-t border-forest-700 hover:bg-forest-800">
                  <td className="px-4 py-2 text-forest-400">{m.id}</td>
                  <td className="px-4 py-2 font-medium text-forest-50">{m.fullName}</td>
                  <td className="px-4 py-2 text-forest-200">{m.email}</td>
                  <td className="px-4 py-2">
                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                      m.statusName === "Active" ? "bg-green-900/40 text-green-300" :
                      m.statusName === "Suspended" ? "bg-yellow-900/40 text-yellow-300" :
                      "bg-red-900/40 text-red-300"
                    }`}>{m.statusName}</span>
                  </td>
                  <td className="px-4 py-2 text-forest-200">{m.membershipTypeName || "—"}</td>
                  <td className="px-4 py-2">{m.isVerified ? "✓" : "—"}</td>
                  <td className="px-4 py-2">
                    <Link href={`/portal/members/${m.id}`} className="text-forest-300 hover:underline">View</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="py-12 text-center text-forest-400">No members found.</p>
      )}
    </div>
  );
}