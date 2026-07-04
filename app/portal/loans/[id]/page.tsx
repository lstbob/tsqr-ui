"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";

export default function LoanDetailPage() {
  const params = useParams();
  const id = params.id;
  const [item, setItem] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [result, setResult] = useState("");

  useEffect(() => {
    fetch(`/api/proxy/loans/${id}`)
      .then((r) => r.json())
      .then((d) => { setItem(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, [id]);

  async function markNotReturned() {
    setActionLoading(true);
    try {
      const res = await fetch("/api/proxy/loans/mark-not-returned", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ loanId: Number(id) }),
      });
      if (res.ok) setResult("Marked as not returned.");
      else setResult("Action failed.");
    } catch {
      setResult("Network error");
    }
    setActionLoading(false);
  }

  if (loading) return <p className="py-12 text-center text-zinc-400">Loading...</p>;
  if (!item) return <p className="py-12 text-center text-zinc-400">Loan not found.</p>;

  return (
    <div className="max-w-2xl">
      <h1 className="mb-6 text-2xl font-bold text-zinc-900">Loan Details — Item #{item.id}</h1>
      <div className="mb-6 rounded-lg border border-zinc-200 bg-white p-6 shadow-sm">
        <dl className="grid grid-cols-2 gap-4 text-sm">
          <div><dt className="text-zinc-400">Tool</dt><dd className="font-medium text-zinc-800">{item.toolModel}</dd></div>
          <div><dt className="text-zinc-400">Serial Number</dt><dd className="font-medium text-zinc-800">{item.serialNumber}</dd></div>
          <div><dt className="text-zinc-400">Current Holder</dt><dd className="font-medium text-zinc-800">{item.currentHolderName || "—"}</dd></div>
          <div><dt className="text-zinc-400">Original Owner</dt><dd className="font-medium text-zinc-800">{item.originalOwnerName || "—"}</dd></div>
          <div><dt className="text-zinc-400">Last Borrowed</dt><dd className="font-medium text-zinc-800">{item.lastBorrowedDate ? new Date(item.lastBorrowedDate).toLocaleDateString() : "—"}</dd></div>
          <div><dt className="text-zinc-400">Loan Count</dt><dd className="font-medium text-zinc-800">{item.loanCount}</dd></div>
          <div><dt className="text-zinc-400">Condition</dt><dd className="font-medium text-zinc-800">{item.conditionName}</dd></div>
          <div><dt className="text-zinc-400">Under Repair</dt><dd className="font-medium text-zinc-800">{item.isUnderRepair ? "Yes" : "No"}</dd></div>
        </dl>
      </div>
      {result && <p className="mb-4 rounded-lg bg-zinc-100 px-4 py-2 text-sm text-zinc-700">{result}</p>}
      <h2 className="mb-3 text-lg font-semibold text-zinc-800">Actions</h2>
      <button onClick={markNotReturned} disabled={actionLoading} className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50">
        {actionLoading ? "..." : "Mark as Not Returned"}
      </button>
    </div>
  );
}