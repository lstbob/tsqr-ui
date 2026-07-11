"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";

export default function InventoryManagePage() {
  const params = useParams();
  const id = params.id;
  const [item, setItem] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState("");
  const [error, setError] = useState("");
  const [result, setResult] = useState("");

  useEffect(() => {
    fetch(`/api/proxy/inventory/${id}`)
      .then((r) => r.json())
      .then((d) => { setItem(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, [id]);

  async function postAction(endpoint: string, body: Record<string, unknown>, label: string) {
    setActionLoading(label);
    setError("");
    setResult("");
    try {
      const res = await fetch(`/api/proxy/${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.message || `${label} failed`);
      } else {
        setResult(`${label} succeeded.`);
        fetch(`/api/proxy/inventory/${id}`).then((r) => r.json()).then(setItem);
      }
    } catch {
      setError("Network error");
    }
    setActionLoading("");
  }

  if (loading) return <p className="py-12 text-center text-forest-400">Loading...</p>;
  if (!item) return <p className="py-12 text-center text-forest-400">Item not found.</p>;

  return (
    <div className="max-w-2xl">
      <h1 className="mb-6 text-2xl font-bold text-forest-50">Manage Item #{item.id}</h1>
      <div className="mb-6 rounded-lg border border-forest-700 bg-forest-900 p-6 shadow-sm shadow-black/20">
        <dl className="grid grid-cols-2 gap-4 text-sm">
          <div><dt className="text-forest-400">Tool</dt><dd className="font-medium text-forest-100">{item.toolModel}</dd></div>
          <div><dt className="text-forest-400">Serial</dt><dd className="font-medium text-forest-100">{item.serialNumber}</dd></div>
          <div><dt className="text-forest-400">Status</dt><dd><span className="rounded bg-forest-800 px-2 py-0.5 text-xs">{item.statusName}</span></dd></div>
          <div><dt className="text-forest-400">Condition</dt><dd className="font-medium text-forest-100">{item.conditionName}</dd></div>
          <div><dt className="text-forest-400">Holder</dt><dd className="font-medium text-forest-100">{item.currentHolderName || "—"}</dd></div>
          <div><dt className="text-forest-400">Under Repair</dt><dd className="font-medium text-forest-100">{item.isUnderRepair ? "Yes" : "No"}</dd></div>
        </dl>
      </div>

      {error && <p className="mb-4 rounded-lg bg-red-900/30 px-4 py-2 text-sm text-red-300">{error}</p>}
      {result && <p className="mb-4 rounded-lg bg-green-900/30 px-4 py-2 text-sm text-green-300">{result}</p>}

      <h2 className="mb-3 text-lg font-semibold text-forest-100">Actions</h2>
      <div className="space-y-3">
        {item.statusName === "Loaned" && (
          <button onClick={() => postAction("tools/return", { itemId: item.id, returnedCondition: item.condition }, "Return tool")} disabled={!!actionLoading} className="rounded-lg bg-green-800 px-4 py-2 text-sm font-medium text-green-100 hover:bg-green-600 disabled:opacity-50">
            {actionLoading === "Return tool" ? "..." : "Return Tool"}
          </button>
        )}
        {!item.isUnderRepair && item.statusName !== "Lost" && (
          <button onClick={() => postAction("tools/mark-for-repair", { itemId: item.id, reportedById: 1, description: "Reported from inventory management" }, "Mark for repair")} disabled={!!actionLoading} className="block rounded-lg bg-orange-800 px-4 py-2 text-sm font-medium text-orange-100 hover:bg-orange-600 disabled:opacity-50">
            {actionLoading === "Mark for repair" ? "..." : "Mark for Repair"}
          </button>
        )}
        {item.isUnderRepair && (
          <button onClick={() => postAction("tools/complete-repair", { recordId: 0, itemId: item.id, completedById: 1, newCondition: item.condition }, "Complete repair")} disabled={!!actionLoading} className="block rounded-lg bg-green-800 px-4 py-2 text-sm font-medium text-green-100 hover:bg-green-600 disabled:opacity-50">
            {actionLoading === "Complete repair" ? "..." : "Complete Repair"}
          </button>
        )}
        {item.statusName !== "Lost" && (
          <button onClick={() => postAction("tools/mark-lost", { itemId: item.id, reporterId: 1 }, "Mark lost")} disabled={!!actionLoading} className="block rounded-lg bg-red-800 px-4 py-2 text-sm font-medium text-red-100 hover:bg-red-600 disabled:opacity-50">
            {actionLoading === "Mark lost" ? "..." : "Mark as Lost"}
          </button>
        )}
      </div>
    </div>
  );
}