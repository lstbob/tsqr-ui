"use client";

import { useState } from "react";
import Link from "next/link";
import { useFetchJson } from "@lib/useFetchJson";
import type { LearningDeck, LearningPage } from "@lib/types";
import Pagination from "../../_components/Pagination";

const PAGE_SIZE = 20;

export default function DecksPage() {
  const [page, setPage] = useState(1);
  const [reload, setReload] = useState(0);
  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const { data, loading } = useFetchJson<LearningPage<LearningDeck>>(
    `/api/proxy/learning/decks?page=${page}&pageSize=${PAGE_SIZE}&r=${reload}`,
  );
  const decks = data && Array.isArray(data.items) ? data : null;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const res = await fetch("/api/proxy/learning/decks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim() }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => null);
        setError(body?.message || "Could not create the deck.");
      } else {
        setName("");
        setPage(1);
        setReload((n) => n + 1);
      }
    } catch {
      setError("Network error");
    }
    setSaving(false);
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-ui-50">Decks</h1>
      </div>

      <form onSubmit={handleSubmit} className="mb-6 max-w-2xl space-y-3 rounded-lg border border-ui-700 bg-ui-900 p-6 shadow-sm shadow-black/20">
        <label htmlFor="deck-name" className="block text-sm font-medium text-ui-100">New deck</label>
        <input
          id="deck-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          maxLength={200}
          placeholder="Deck name"
          className="w-full rounded-lg border border-ui-600 px-4 py-2 text-sm outline-none focus:border-ui-400"
        />
        {error && <p className="rounded-lg bg-red-50 dark:bg-red-900/30 px-4 py-2 text-sm text-red-700 dark:text-red-300">{error}</p>}
        <button type="submit" disabled={saving || name.trim() === ""} className="rounded-lg bg-ui-50 px-6 py-2.5 text-sm font-semibold text-ui-950 hover:bg-ui-200 disabled:opacity-50">
          {saving ? "Creating..." : "Create deck"}
        </button>
      </form>

      {loading ? (
        <p className="py-12 text-center text-ui-400">Loading...</p>
      ) : decks && decks.items.length > 0 ? (
        <>
          <div className="overflow-x-auto rounded-lg border border-ui-700 bg-ui-900 shadow-sm shadow-black/20">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-ui-700 text-ui-400">
                <tr>
                  <th className="px-4 py-2 font-medium">Name</th>
                  <th className="px-4 py-2 font-medium">Cards</th>
                  <th className="px-4 py-2 font-medium">Due</th>
                </tr>
              </thead>
              <tbody className="text-ui-100">
                {decks.items.map((deck) => (
                  <tr key={deck.id} className="border-b border-ui-800 last:border-0">
                    <td className="px-4 py-2">
                      <Link href={`/learning/decks/${deck.id}`} className="font-medium text-ui-50 underline">{deck.name}</Link>
                    </td>
                    <td className="px-4 py-2">{deck.cardCount}</td>
                    <td className="px-4 py-2">{deck.dueCount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Pagination page={decks.page} pageSize={decks.pageSize} totalCount={decks.totalCount} onPageChange={setPage} />
        </>
      ) : (
        <p className="py-12 text-center text-ui-400">No decks found.</p>
      )}
    </div>
  );
}
