"use client";

import Link from "next/link";
import { useFetchJson } from "@lib/useFetchJson";
import type { PagedResult, Loan } from "@lib/types";

export default function LoansPage() {
  const { data, loading } = useFetchJson<PagedResult<Loan>>("/api/proxy/loans?pageSize=50");

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-forest-50">Active Loans</h1>
      {loading ? (
        <p className="py-12 text-center text-forest-400">Loading...</p>
      ) : data && data.items.length > 0 ? (
        <div className="overflow-hidden rounded-lg border border-forest-700">
          <table className="w-full text-sm">
            <thead className="text-left text-forest-200">
              <tr>
                <th className="px-4 py-2 font-medium">Item ID</th>
                <th className="px-4 py-2 font-medium">Tool</th>
                <th className="px-4 py-2 font-medium">Serial</th>
                <th className="px-4 py-2 font-medium">Holder</th>
                <th className="px-4 py-2 font-medium">Last Borrowed</th>
                <th className="px-4 py-2 font-medium">Loan Count</th>
                <th className="px-4 py-2 font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {data.items.map((l) => (
                <tr key={l.id} className="border-t border-forest-700 hover:bg-forest-800">
                  <td className="px-4 py-2 text-forest-400">{l.id}</td>
                  <td className="px-4 py-2 font-medium text-forest-50">{l.toolModel}</td>
                  <td className="px-4 py-2 text-forest-200">{l.serialNumber}</td>
                  <td className="px-4 py-2 text-forest-200">{l.currentHolderName || "—"}</td>
                  <td className="px-4 py-2 text-forest-200">{l.lastBorrowedDate ? new Date(l.lastBorrowedDate).toLocaleDateString() : "—"}</td>
                  <td className="px-4 py-2 text-forest-200">{l.loanCount}</td>
                  <td className="px-4 py-2"><Link href={`/portal/loans/${l.id}`} className="text-forest-300 hover:underline">View</Link></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="py-12 text-center text-forest-400">No active loans.</p>
      )}
    </div>
  );
}