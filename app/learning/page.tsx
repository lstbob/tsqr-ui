"use client";

import Link from "next/link";
import { useFetchJson } from "@lib/useFetchJson";
import type { LearningStats } from "@lib/types";
import ModuleCard from "../_components/ModuleCard";

export default function LearningHome() {
  const { data, loading } = useFetchJson<LearningStats>("/api/proxy/learning/stats");
  const stats = data && Array.isArray(data.calibration) ? data : null;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-ui-50">Learning</h1>
        <p className="mt-1 text-ui-200">Remember more of what you learn. Practise with recall, spaced reviews and mixed topics.</p>
      </div>

      {loading ? (
        <p className="py-12 text-center text-ui-400">Loading...</p>
      ) : stats ? (
        <>
          <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-4">
            <StatCard label="Decks" value={stats.totalDecks} />
            <StatCard label="Cards" value={stats.totalCards} />
            <StatCard label="Due now" value={stats.dueNow} />
            <StatCard label="Reviews" value={stats.totalReviews} />
          </div>

          <div className="mb-8 flex flex-wrap items-center gap-4">
            <Link href="/learning/practice" className="rounded-lg bg-ui-50 px-4 py-2 text-sm font-semibold text-ui-950 hover:bg-ui-200">
              Start practice
            </Link>
            <p className="text-sm text-ui-200">{stats.dueNow === 1 ? "1 card is due." : `${stats.dueNow} cards are due.`}</p>
          </div>

          <h2 className="mb-3 text-lg font-semibold text-ui-100">Confidence and accuracy</h2>
          <div className="mb-2 overflow-x-auto rounded-lg border border-ui-700 bg-ui-900 shadow-sm shadow-black/20">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-ui-700 text-ui-400">
                <tr>
                  <th className="px-4 py-2 font-medium">Confidence</th>
                  <th className="px-4 py-2 font-medium">Reviews</th>
                  <th className="px-4 py-2 font-medium">Correct</th>
                  <th className="px-4 py-2 font-medium">Accuracy</th>
                </tr>
              </thead>
              <tbody className="text-ui-100">
                {stats.calibration.map((row) => (
                  <tr key={row.confidence} className="border-b border-ui-800 last:border-0">
                    <td className="px-4 py-2">{row.confidenceName}</td>
                    <td className="px-4 py-2">{row.reviews}</td>
                    <td className="px-4 py-2">{row.correct}</td>
                    <td className="px-4 py-2">{row.reviews === 0 ? "–" : `${Math.round((row.correct / row.reviews) * 100)}%`}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mb-8 text-sm text-ui-300">If your accuracy is lower than your confidence, practise that material more.</p>
        </>
      ) : (
        <p className="py-12 text-center text-ui-400">Could not load your statistics.</p>
      )}

      <h2 className="mb-4 text-lg font-semibold text-ui-100">Quick Access</h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <ModuleCard href="/learning/practice" title="Practice" description="Answer the cards that are due." />
        <ModuleCard href="/learning/decks" title="Decks" description="Create decks and add cards." />
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg border border-ui-700 bg-ui-900 p-5 shadow-sm shadow-black/20">
      <p className="text-2xl font-bold text-ui-50">{value}</p>
      <p className="text-sm text-ui-400">{label}</p>
    </div>
  );
}
