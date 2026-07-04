"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const statusOptions = [
  { value: "", label: "All Statuses" },
  { value: "1", label: "Available" },
  { value: "2", label: "Reserved" },
  { value: "3", label: "Loaned" },
  { value: "4", label: "Under Maintenance" },
  { value: "5", label: "Lost" },
];

export default function InventoryPage() {
  const [data, setData] = useState<{ items: any[] } | null>(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("");

  useEffect(() => {
    const params = new URLSearchParams();
    if (status) params.set("status", status);
    params.set("pageSize", "50");
    setLoading(true);
    fetch(`/api/proxy/inventory?${params}`)
      .then((r) => r.json())
      .then((d) => { setData(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, [status]);

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-zinc-900">Inventory</h1>

      <div className="mb-4">
        <select value={status} onChange={(e) => setStatus(e.target.value)} className="rounded-lg border border-zinc-300 px-3 py-2 text-sm">
          {statusOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      </div>

      {loading ? (
        <p className="py-12 text-center text-zinc-400">Loading...</p>
      ) : data && data.items.length > 0 ? (
        <div className="overflow-hidden rounded-lg border border-zinc-200">
          <table className="w-full text-sm">
            <thead className="bg-zinc-50 text-left text-zinc-500">
              <tr>
                <th className="px-4 py-2 font-medium">ID</th>
                <th className="px-4 py-2 font-medium">Tool</th>
                <th className="px-4 py-2 font-medium">Serial</th>
                <th className="px-4 py-2 font-medium">Status</th>
                <th className="px-4 py-2 font-medium">Condition</th>
                <th className="px-4 py-2 font-medium">Holder</th>
                <th className="px-4 py-2 font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {data.items.map((item) => (
                <tr key={item.id} className="border-t border-zinc-100 hover:bg-zinc-50">
                  <td className="px-4 py-2 text-zinc-400">{item.id}</td>
                  <td className="px-4 py-2 font-medium text-zinc-900">{item.toolModel}</td>
                  <td className="px-4 py-2 text-zinc-600">{item.serialNumber}</td>
                  <td className="px-4 py-2">
                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                      item.statusName === "Available" ? "bg-green-100 text-green-700" :
                      item.statusName === "Reserved" ? "bg-yellow-100 text-yellow-700" :
                      item.statusName === "Loaned" ? "bg-blue-100 text-blue-700" :
                      item.statusName === "UnderMaintenance" ? "bg-orange-100 text-orange-700" :
                      "bg-red-100 text-red-700"
                    }`}>{item.statusName}</span>
                  </td>
                  <td className="px-4 py-2 text-zinc-600">{item.conditionName}</td>
                  <td className="px-4 py-2 text-zinc-600">{item.currentHolderName || "—"}</td>
                  <td className="px-4 py-2"><Link href={`/portal/inventory/${item.id}`} className="text-emerald-700 hover:underline">Manage</Link></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="py-12 text-center text-zinc-400">No inventory items found.</p>
      )}
    </div>
  );
}