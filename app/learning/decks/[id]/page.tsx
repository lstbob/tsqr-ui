"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useFetchJson } from "@lib/useFetchJson";
import type { LearningCard, LearningDeck, LearningPage } from "@lib/types";
import Pagination from "../../../_components/Pagination";

const PAGE_SIZE = 20;

export default function DeckDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [page, setPage] = useState(1);
  const [reload, setReload] = useState(0);
  const [cue, setCue] = useState("");
  const [expectedAnswer, setExpectedAnswer] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const { data: deckData, loading: deckLoading } = useFetchJson<LearningDeck>(`/api/proxy/learning/decks/${id}?r=${reload}`);
  const { data: cardData, loading: cardsLoading } = useFetchJson<LearningPage<LearningCard>>(
    `/api/proxy/learning/decks/${id}/cards?page=${page}&pageSize=${PAGE_SIZE}&r=${reload}`,
  );
  const deck = deckData && typeof deckData.name === "string" ? deckData : null;
  const cards = cardData && Array.isArray(cardData.items) ? cardData : null;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const res = await fetch("/api/proxy/learning/cards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ deckId: Number(id), cue: cue.trim(), expectedAnswer: expectedAnswer.trim() }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => null);
        setError(body?.message || "Could not add the card.");
      } else {
        setCue("");
        setExpectedAnswer("");
        setPage(1);
        setReload((n) => n + 1);
      }
    } catch {
      setError("Network error");
    }
    setSaving(false);
  }

  if (deckLoading) return <p className="py-12 text-center text-ui-400">Loading...</p>;

  if (!deck) {
    return (
      <div className="py-16 text-center">
        <h1 className="text-2xl font-bold text-ui-50">Deck not found.</h1>
        <Link href="/learning/decks" className="mt-4 inline-block text-sm font-medium text-ui-300 underline">
          &larr; Back to Decks
        </Link>
      </div>
    );
  }

  return (
    <div>
      <Link href="/learning/decks" className="mb-6 inline-block text-sm font-medium text-ui-200 hover:text-ui-50">
        &larr; Back to Decks
      </Link>

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-ui-50">{deck.name}</h1>
        <p className="mt-1 text-ui-200">{deck.cardCount} cards, {deck.dueCount} due.</p>
      </div>

      <form onSubmit={handleSubmit} className="mb-6 max-w-2xl space-y-4 rounded-lg border border-ui-700 bg-ui-900 p-6 shadow-sm shadow-black/20">
        <h2 className="text-lg font-semibold text-ui-100">Add a card</h2>
        <div>
          <label htmlFor="card-cue" className="mb-1 block text-sm font-medium text-ui-100">Cue (the question)</label>
          <textarea id="card-cue" value={cue} onChange={(e) => setCue(e.target.value)} required maxLength={1000} rows={3} className="w-full rounded-lg border border-ui-600 px-4 py-2 text-sm outline-none focus:border-ui-400" />
        </div>
        <div>
          <label htmlFor="card-answer" className="mb-1 block text-sm font-medium text-ui-100">Expected answer</label>
          <textarea id="card-answer" value={expectedAnswer} onChange={(e) => setExpectedAnswer(e.target.value)} required maxLength={2000} rows={3} className="w-full rounded-lg border border-ui-600 px-4 py-2 text-sm outline-none focus:border-ui-400" />
        </div>
        {error && <p className="rounded-lg bg-red-50 dark:bg-red-900/30 px-4 py-2 text-sm text-red-700 dark:text-red-300">{error}</p>}
        <button type="submit" disabled={saving || cue.trim() === "" || expectedAnswer.trim() === ""} className="rounded-lg bg-ui-50 px-6 py-2.5 text-sm font-semibold text-ui-950 hover:bg-ui-200 disabled:opacity-50">
          {saving ? "Adding..." : "Add card"}
        </button>
      </form>

      {cardsLoading ? (
        <p className="py-12 text-center text-ui-400">Loading...</p>
      ) : cards && cards.items.length > 0 ? (
        <>
          <div className="overflow-x-auto rounded-lg border border-ui-700 bg-ui-900 shadow-sm shadow-black/20">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-ui-700 text-ui-400">
                <tr>
                  <th className="px-4 py-2 font-medium">Cue</th>
                  <th className="px-4 py-2 font-medium">Answer</th>
                  <th className="px-4 py-2 font-medium">Box</th>
                  <th className="px-4 py-2 font-medium">Next review</th>
                  <th className="px-4 py-2 font-medium">Reviews</th>
                  <th className="px-4 py-2 font-medium">Lapses</th>
                </tr>
              </thead>
              <tbody className="text-ui-100">
                {cards.items.map((card) => (
                  <tr key={card.id} className="border-b border-ui-800 align-top last:border-0">
                    <td className="px-4 py-2">{card.cue}</td>
                    <td className="px-4 py-2">{card.expectedAnswer}</td>
                    <td className="px-4 py-2">{card.box}</td>
                    <td className="px-4 py-2">{new Date(card.dueAt).toLocaleDateString()}</td>
                    <td className="px-4 py-2">{card.reviewCount}</td>
                    <td className="px-4 py-2">{card.lapseCount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Pagination page={cards.page} pageSize={cards.pageSize} totalCount={cards.totalCount} onPageChange={setPage} />
        </>
      ) : (
        <p className="py-12 text-center text-ui-400">No cards found.</p>
      )}
    </div>
  );
}
