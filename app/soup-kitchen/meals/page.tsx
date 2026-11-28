"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useFetchJson } from "@lib/useFetchJson";
import type { PagedResult, Meal } from "@lib/types";

const categoryOptions = [
  { value: "", label: "All Categories" },
  { value: "1", label: "Soup" },
  { value: "2", label: "Main Dish" },
  { value: "3", label: "Side Dish" },
  { value: "4", label: "Dessert" },
  { value: "5", label: "Beverage" },
  { value: "6", label: "Bread" },
];

export default function MealsPage() {
  const [events, setEvents] = useState<{ id: number; name: string }[]>([]);
  const [eventId, setEventId] = useState("");
  const [category, setCategory] = useState("");

  useEffect(() => {
    fetch("/api/proxy/soup-kitchen/events?pageSize=100")
      .then((r) => r.json())
      .then((d) => setEvents(d.items || []))
      .catch(() => {});
  }, []);

  const params = new URLSearchParams();
  if (eventId) params.set("eventId", eventId);
  if (category) params.set("category", category);
  params.set("pageSize", "50");
  const { data, loading } = useFetchJson<PagedResult<Meal>>(`/api/proxy/soup-kitchen/meals?${params}`);

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-ui-50">Meals</h1>
        <Link href="/soup-kitchen/meals/add" className="rounded-lg bg-ui-50 px-4 py-2 text-sm font-semibold text-ui-950 hover:bg-ui-200">
          Add Meal
        </Link>
      </div>

      <div className="mb-4 flex gap-3">
        <select value={eventId} onChange={(e) => setEventId(e.target.value)} className="rounded-lg border border-ui-600 px-3 py-2 text-sm">
          <option value="">All Events</option>
          {events.map((e) => <option key={e.id} value={String(e.id)}>{e.name}</option>)}
        </select>
        <select value={category} onChange={(e) => setCategory(e.target.value)} className="rounded-lg border border-ui-600 px-3 py-2 text-sm">
          {categoryOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      </div>

      {loading ? (
        <p className="py-12 text-center text-ui-400">Loading...</p>
      ) : data && data.items.length > 0 ? (
        <div className="space-y-3">
          {data.items.map((meal) => (
            <div key={meal.id} className="rounded-lg border border-ui-700 bg-ui-900 p-4 shadow-sm shadow-black/20">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-semibold text-ui-50">{meal.name}</p>
                  <p className="text-sm text-ui-200">{meal.description}</p>
                  <p className="mt-1 text-xs text-ui-400">Event: {meal.eventName}</p>
                </div>
                <div className="text-right text-sm">
                  <span className={`rounded-full px-2 py-0.5 text-xs font-medium bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300`}>
                    {meal.categoryName}
                  </span>
                  <p className="mt-1 text-ui-200">{meal.quantityPrepared ?? 0} / {meal.quantityNeeded ?? 0} prepared</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="py-12 text-center text-ui-400">No meals found.</p>
      )}
    </div>
  );
}
