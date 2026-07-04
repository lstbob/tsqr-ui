"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ToolActionsPage({ params }: { params: Promise<{ id: string }> }) {
  return <ToolActionsContent id={params} />;
}

function ToolActionsContent({ id }: { id: Promise<{ id: string }> }) {
  const router = useRouter();
  const [toolId, setToolId] = useState("");
  const [loading, setLoading] = useState("");
  const [error, setError] = useState("");
  const [inventory, setInventory] = useState<{ id: number; serialNumber: string; statusName: string; currentHolderName: string | null }[]>([]);

  id.then(({ id }) => {
    setToolId(id);
    fetch(`/api/proxy/inventory?toolId=${id}&pageSize=50`)
      .then((r) => r.json())
      .then((d) => setInventory(d.items || []))
      .catch(() => {});
  });

  async function postAction(endpoint: string, body: Record<string, unknown>, label: string) {
    setLoading(label);
    setError("");
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
        router.refresh();
      }
    } catch {
      setError("Network error");
    }
    setLoading("");
  }

  return (
    <div className="max-w-2xl">
      <h1 className="mb-6 text-2xl font-bold text-zinc-900">Tool Actions — ID {toolId}</h1>
      {error && <p className="mb-4 rounded-lg bg-red-50 px-4 py-2 text-sm text-red-600">{error}</p>}

      {inventory.length > 0 && (
        <div className="mb-6 rounded-lg border border-zinc-200 bg-white p-4 shadow-sm">
          <h2 className="mb-3 font-semibold text-zinc-800">Inventory Items</h2>
          <div className="space-y-2">
            {inventory.map((item) => (
              <div key={item.id} className="flex items-center justify-between rounded border border-zinc-100 px-3 py-2">
                <div>
                  <span className="font-mono text-sm">#{item.id} — {item.serialNumber}</span>
                  <span className="ml-2 rounded bg-zinc-100 px-2 py-0.5 text-xs">{item.statusName}</span>
                  {item.currentHolderName && <span className="ml-2 text-xs text-zinc-500">held by {item.currentHolderName}</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="space-y-6">
        <ActionCard title="Loan Tool" description="Issue this tool to a member.">
          <form onSubmit={(e) => {
            e.preventDefault();
            const fd = new FormData(e.currentTarget);
            postAction("tools/loan", { itemId: Number(fd.get("itemId")), memberId: Number(fd.get("memberId")) }, "Loaning tool");
          }} className="flex gap-2">
            <input name="itemId" type="number" placeholder="Item ID" className="rounded border border-zinc-300 px-3 py-1.5 text-sm" />
            <input name="memberId" type="number" placeholder="Member ID" className="rounded border border-zinc-300 px-3 py-1.5 text-sm" />
            <button type="submit" disabled={!!loading} className="rounded bg-amber-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-amber-700 disabled:opacity-50">Loan</button>
          </form>
        </ActionCard>

        <ActionCard title="Return Tool" description="Mark a loaned tool as returned.">
          <form onSubmit={(e) => {
            e.preventDefault();
            const fd = new FormData(e.currentTarget);
            postAction("tools/return", { itemId: Number(fd.get("itemId")), returnedCondition: Number(fd.get("returnedCondition")) }, "Returning tool");
          }} className="flex gap-2">
            <input name="itemId" type="number" placeholder="Item ID" className="rounded border border-zinc-300 px-3 py-1.5 text-sm" />
            <select name="returnedCondition" className="rounded border border-zinc-300 px-3 py-1.5 text-sm">
              <option value="1">New</option><option value="2">Good</option>
              <option value="3">Fair</option><option value="4">Repaired</option><option value="5">Poor</option>
            </select>
            <button type="submit" disabled={!!loading} className="rounded bg-green-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-50">Return</button>
          </form>
        </ActionCard>

        <ActionCard title="Mark for Repair" description="Report a tool needs maintenance.">
          <form onSubmit={(e) => {
            e.preventDefault();
            const fd = new FormData(e.currentTarget);
            postAction("tools/mark-for-repair", { itemId: Number(fd.get("itemId")), reportedById: Number(fd.get("reportedById")), description: fd.get("description") }, "Marking for repair");
          }} className="flex flex-col gap-2">
            <div className="flex gap-2">
              <input name="itemId" type="number" placeholder="Item ID" className="rounded border border-zinc-300 px-3 py-1.5 text-sm" />
              <input name="reportedById" type="number" placeholder="Reporter ID" className="rounded border border-zinc-300 px-3 py-1.5 text-sm" />
            </div>
            <textarea name="description" placeholder="Issue description..." rows={2} className="rounded border border-zinc-300 px-3 py-1.5 text-sm" />
            <button type="submit" disabled={!!loading} className="self-start rounded bg-orange-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-orange-700 disabled:opacity-50">Mark for Repair</button>
          </form>
        </ActionCard>

        <ActionCard title="Complete Repair" description="Mark a repair as finished.">
          <form onSubmit={(e) => {
            e.preventDefault();
            const fd = new FormData(e.currentTarget);
            postAction("tools/complete-repair", { recordId: Number(fd.get("recordId")), itemId: Number(fd.get("itemId")), completedById: Number(fd.get("completedById")), newCondition: Number(fd.get("newCondition")) }, "Completing repair");
          }} className="flex flex-wrap gap-2">
            <input name="recordId" type="number" placeholder="Record ID" className="rounded border border-zinc-300 px-3 py-1.5 text-sm" />
            <input name="itemId" type="number" placeholder="Item ID" className="rounded border border-zinc-300 px-3 py-1.5 text-sm" />
            <input name="completedById" type="number" placeholder="Repairer ID" className="rounded border border-zinc-300 px-3 py-1.5 text-sm" />
            <select name="newCondition" className="rounded border border-zinc-300 px-3 py-1.5 text-sm">
              <option value="1">New</option><option value="2">Good</option>
              <option value="3">Fair</option><option value="4">Repaired</option><option value="5">Poor</option>
            </select>
            <button type="submit" disabled={!!loading} className="rounded bg-green-700 px-3 py-1.5 text-sm font-medium text-white hover:bg-green-800 disabled:opacity-50">Complete Repair</button>
          </form>
        </ActionCard>

        <ActionCard title="Mark as Lost" description="Report a tool as lost.">
          <form onSubmit={(e) => {
            e.preventDefault();
            const fd = new FormData(e.currentTarget);
            postAction("tools/mark-lost", { itemId: Number(fd.get("itemId")), reporterId: Number(fd.get("reporterId")) }, "Marking lost");
          }} className="flex gap-2">
            <input name="itemId" type="number" placeholder="Item ID" className="rounded border border-zinc-300 px-3 py-1.5 text-sm" />
            <input name="reporterId" type="number" placeholder="Reporter ID" className="rounded border border-zinc-300 px-3 py-1.5 text-sm" />
            <button type="submit" disabled={!!loading} className="rounded bg-red-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50">Mark Lost</button>
          </form>
        </ActionCard>
      </div>
    </div>
  );
}

function ActionCard({ title, description, children }: { title: string; description: string; children: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm">
      <h3 className="font-semibold text-zinc-900">{title}</h3>
      <p className="mb-3 text-sm text-zinc-500">{description}</p>
      {children}
    </div>
  );
}