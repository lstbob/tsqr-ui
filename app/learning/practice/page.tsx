"use client";

import { useState } from "react";
import Link from "next/link";
import { useFetchJson } from "@lib/useFetchJson";
import type { PracticeCard, ReviewOutcome } from "@lib/types";

const confidenceOptions = [
  { value: 1, label: "Low" },
  { value: 2, label: "Medium" },
  { value: 3, label: "High" },
];

const primaryButton = "rounded-lg bg-ui-50 px-6 py-2.5 text-sm font-semibold text-ui-950 hover:bg-ui-200 disabled:opacity-50";
const secondaryButton = "rounded-lg border border-ui-600 px-6 py-2.5 text-sm font-semibold text-ui-100 hover:bg-ui-800 disabled:opacity-50";

type Step = "answer" | "revealed" | "reviewed";

async function post<T>(url: string, body: unknown): Promise<T> {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const json = await res.json().catch(() => null);
  if (!res.ok) throw new Error(json?.message || "The request failed.");
  return json as T;
}

function daysUntil(dueAt: string) {
  const days = Math.floor((new Date(dueAt).getTime() - Date.now()) / 86_400_000);
  return Math.max(1, days);
}

export default function PracticePage() {
  const { data, loading } = useFetchJson<PracticeCard[]>("/api/proxy/learning/practice/queue?limit=20");
  const queue = Array.isArray(data) ? data : null;

  const [index, setIndex] = useState(0);
  const [step, setStep] = useState<Step>("answer");
  const [givenAnswer, setGivenAnswer] = useState("");
  const [confidence, setConfidence] = useState<number | null>(null);
  const [expected, setExpected] = useState("");
  const [nextDays, setNextDays] = useState(1);
  const [correctCount, setCorrectCount] = useState(0);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  if (loading) return <p className="py-12 text-center text-ui-400">Loading...</p>;
  if (!queue) return <p className="py-12 text-center text-ui-400">Could not load the cards.</p>;

  if (queue.length === 0) {
    return (
      <div className="py-16 text-center">
        <p className="text-ui-100">No cards are due. Come back later.</p>
        <Link href="/learning/decks" className="mt-4 inline-block text-sm font-medium text-ui-300 underline">Go to Decks</Link>
      </div>
    );
  }

  if (index >= queue.length) {
    return (
      <div className="py-16 text-center">
        <h1 className="text-2xl font-bold text-ui-50">Session done. You got {correctCount} of {queue.length} right.</h1>
        <div className="mt-6 flex justify-center gap-6 text-sm font-medium text-ui-300">
          <Link href="/learning" className="underline">Learning home</Link>
          <Link href="/learning/decks" className="underline">Decks</Link>
        </div>
      </div>
    );
  }

  const card = queue[index];

  async function reveal() {
    setBusy(true);
    setError("");
    try {
      const result = await post<{ expectedAnswer: string }>(`/api/proxy/learning/cards/${card.cardId}/reveal`, { givenAnswer });
      setExpected(result.expectedAnswer);
      setStep("revealed");
    } catch (e) {
      setError(e instanceof Error ? e.message : "The request failed.");
    }
    setBusy(false);
  }

  async function review(wasCorrect: boolean) {
    setBusy(true);
    setError("");
    try {
      const outcome = await post<ReviewOutcome>(`/api/proxy/learning/cards/${card.cardId}/reviews`, { givenAnswer, confidence, wasCorrect });
      setNextDays(daysUntil(outcome.dueAt));
      if (wasCorrect) setCorrectCount((n) => n + 1);
      setStep("reviewed");
    } catch (e) {
      setError(e instanceof Error ? e.message : "The request failed.");
    }
    setBusy(false);
  }

  function nextCard() {
    setIndex((n) => n + 1);
    setStep("answer");
    setGivenAnswer("");
    setConfidence(null);
    setExpected("");
    setError("");
  }

  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <p className="text-sm text-ui-400">Card {index + 1} of {queue.length}</p>
        <h1 className="mt-1 text-2xl font-bold text-ui-50">{card.deckName}</h1>
      </div>

      <div className="space-y-4 rounded-lg border border-ui-700 bg-ui-900 p-6 shadow-sm shadow-black/20">
        <p className="whitespace-pre-wrap text-lg text-ui-50">{card.cue}</p>

        {step === "answer" && (
          <>
            <div>
              <label htmlFor="given-answer" className="mb-1 block text-sm font-medium text-ui-100">Your answer</label>
              <textarea id="given-answer" value={givenAnswer} onChange={(e) => setGivenAnswer(e.target.value)} rows={4} className="w-full rounded-lg border border-ui-600 px-4 py-2 text-sm outline-none focus:border-ui-400" />
            </div>
            <div>
              <p className="mb-1 text-sm font-medium text-ui-100">How sure are you?</p>
              <div className="flex gap-2">
                {confidenceOptions.map((o) => (
                  <button
                    key={o.value}
                    type="button"
                    onClick={() => setConfidence(o.value)}
                    aria-pressed={confidence === o.value}
                    className={
                      confidence === o.value
                        ? "rounded-lg bg-ui-50 px-4 py-2 text-sm font-semibold text-ui-950"
                        : "rounded-lg border border-ui-600 px-4 py-2 text-sm text-ui-100 hover:bg-ui-800"
                    }
                  >
                    {o.label}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}

        {step !== "answer" && (
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <p className="mb-1 text-sm font-medium text-ui-400">Your answer</p>
              <p className="whitespace-pre-wrap text-ui-100">{givenAnswer}</p>
            </div>
            <div>
              <p className="mb-1 text-sm font-medium text-ui-400">Expected answer</p>
              <p className="whitespace-pre-wrap text-ui-100">{expected}</p>
            </div>
          </div>
        )}

        {error && <p className="rounded-lg bg-red-50 dark:bg-red-900/30 px-4 py-2 text-sm text-red-700 dark:text-red-300">{error}</p>}

        {step === "answer" && (
          <button type="button" onClick={reveal} disabled={busy || givenAnswer.trim() === "" || confidence === null} className={primaryButton}>
            Show answer
          </button>
        )}

        {step === "revealed" && (
          <div className="flex gap-3">
            <button type="button" onClick={() => review(true)} disabled={busy} className={primaryButton}>I was right</button>
            <button type="button" onClick={() => review(false)} disabled={busy} className={secondaryButton}>I was wrong</button>
          </div>
        )}

        {step === "reviewed" && (
          <div className="space-y-3">
            <p className="text-ui-100">Next review in {nextDays} {nextDays === 1 ? "day" : "days"}.</p>
            <button type="button" onClick={nextCard} className={primaryButton}>Next card</button>
          </div>
        )}
      </div>
    </div>
  );
}
