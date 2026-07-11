"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AddMealPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [events, setEvents] = useState<{ id: number; name: string }[]>([]);

  useEffect(() => {
    fetch("/api/proxy/soup-kitchen/events?pageSize=100")
      .then((r) => r.json())
      .then((d) => setEvents(d.items || []))
      .catch(() => {});
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const fd = new FormData(e.currentTarget);
    const body = Object.fromEntries(fd.entries());

    try {
      const res = await fetch("/api/proxy/soup-kitchen/meals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.message || "Failed to add meal");
        setLoading(false);
        return;
      }
      router.push("/soup-kitchen/meals");
      router.refresh();
    } catch {
      setError("Network error");
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl">
      <h1 className="mb-6 text-2xl font-bold text-forest-50">Add Meal</h1>
      <form onSubmit={handleSubmit} className="space-y-4 rounded-lg border border-forest-700 bg-forest-900 p-6 shadow-sm shadow-black/20">
        <SelectField label="Event" name="eventId" options={events.map((e) => ({ value: String(e.id), label: e.name }))} required />
        <Field label="Meal Name" name="name" required />
        <Field label="Description" name="description" textarea />
        <SelectField label="Category" name="category" options={[
          { value: "1", label: "Soup" },
          { value: "2", label: "Main Dish" },
          { value: "3", label: "Side Dish" },
          { value: "4", label: "Dessert" },
          { value: "5", label: "Beverage" },
          { value: "6", label: "Bread" },
        ]} required />
        <Field label="Quantity Needed" name="quantityNeeded" type="number" />
        <Field label="Quantity Prepared" name="quantityPrepared" type="number" />
        {error && <p className="rounded-lg bg-red-900/30 px-4 py-2 text-sm text-red-300">{error}</p>}
        <button type="submit" disabled={loading} className="rounded-lg bg-forest-500 px-6 py-2.5 text-sm font-semibold text-white hover:bg-forest-400 disabled:opacity-50">
          {loading ? "Adding..." : "Add Meal"}
        </button>
      </form>
    </div>
  );
}

function Field({ label, name, type = "text", required, textarea }: { label: string; name: string; type?: string; required?: boolean; textarea?: boolean }) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-forest-100">{label}{required && " *"}</label>
      {textarea ? (
        <textarea name={name} required={required} rows={3} className="w-full rounded-lg border border-forest-600 px-4 py-2 text-sm outline-none focus:border-forest-400" />
      ) : (
        <input type={type} name={name} required={required} className="w-full rounded-lg border border-forest-600 px-4 py-2 text-sm outline-none focus:border-forest-400" />
      )}
    </div>
  );
}

function SelectField({ label, name, options, required }: { label: string; name: string; options: { value: string; label: string }[]; required?: boolean }) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-forest-100">{label}{required && " *"}</label>
      <select name={name} required={required} className="w-full rounded-lg border border-forest-600 px-4 py-2 text-sm outline-none focus:border-forest-400">
        {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </div>
  );
}
