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
      <h1 className="mb-6 text-2xl font-bold text-forest-50">Inventory</h1>

      <div className="mb-4">
        <select value={status} onChange={(e) => setStatus(e.target.value)} className="rounded-lg border border-forest-600 px-3 py-2 text-sm">
          {statusOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
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
                <tr key={item.id} className="border-t border-forest-700 hover:bg-forest-800">
                  <td className="px-4 py-2 text-forest-400">{item.id}</td>
                  <td className="px-4 py-2 font-medium text-forest-50">{item.toolModel}</td>
                  <td className="px-4 py-2 text-forest-200">{item.serialNumber}</td>
                  <td className="px-4 py-2">
                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                      item.statusName === "Available" ? "bg-green-900/40 text-green-300" :
                      item.statusName === "Reserved" ? "bg-yellow-900/40 text-yellow-300" :
                      item.statusName === "Loaned" ? "bg-blue-900/40 text-blue-300" :
                      item.statusName === "UnderMaintenance" ? "bg-orange-900/40 text-orange-300" :
                      "bg-red-900/40 text-red-300"
                    }`}>{item.statusName}</span>
                  </td>
                  <td className="px-4 py-2 text-forest-200">{item.conditionName}</td>
                  <td className="px-4 py-2 text-forest-200">{item.currentHolderName || "—"}</td>
                  <td className="px-4 py-2"><Link href={`/portal/inventory/${item.id}`} className="text-forest-300 hover:underline">Manage</Link></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="py-12 text-center text-forest-400">No inventory items found.</p>
      )}
    </div>
  );
}