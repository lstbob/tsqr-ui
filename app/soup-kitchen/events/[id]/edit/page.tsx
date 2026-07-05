"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function EditEventPage({ params }: { params: Promise<{ id: string }> }) {
  return <EditEventForm id={params} />;
}

function EditEventForm({ id }: { id: Promise<{ id: string }> }) {
  const router = useRouter();
  const [eventId, setEventId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    id.then(({ id }) => setEventId(id));
  }, [id]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const fd = new FormData(e.currentTarget);
    const body = { ...Object.fromEntries(fd.entries()), id: eventId };

    try {
      const res = await fetch("/api/proxy/soup-kitchen/events/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.message || "Failed to update event");
        setLoading(false);
        return;
      }
      router.push(`/soup-kitchen/events/${eventId}`);
      router.refresh();
    } catch {
      setError("Network error");
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl">
      <h1 className="mb-6 text-2xl font-bold text-zinc-900">Edit Event</h1>
      <form onSubmit={handleSubmit} className="space-y-4 rounded-lg border border-zinc-200 bg-white p-6 shadow-sm">
        <Field label="Event Name" name="name" required />
        <Field label="Description" name="description" required textarea />
        <Field label="Date" name="eventDate" type="datetime-local" required />
        <Field label="Location" name="location" required />
        <Field label="Max Guests" name="maxGuests" type="number" />
        <SelectField label="Status" name="status" options={[
          { value: "1", label: "Planned" },
          { value: "2", label: "Active" },
          { value: "3", label: "Completed" },
          { value: "4", label: "Cancelled" },
        ]} />
        {error && <p className="rounded-lg bg-red-50 px-4 py-2 text-sm text-red-600">{error}</p>}
        <button type="submit" disabled={loading} className="rounded-lg bg-emerald-700 px-6 py-2.5 text-sm font-semibold text-white hover:bg-emerald-800 disabled:opacity-50">
          {loading ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
}

function Field({ label, name, type = "text", required, textarea }: { label: string; name: string; type?: string; required?: boolean; textarea?: boolean }) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-zinc-700">{label}{required && " *"}</label>
      {textarea ? (
        <textarea name={name} required={required} rows={3} className="w-full rounded-lg border border-zinc-300 px-4 py-2 text-sm outline-none focus:border-emerald-500" />
      ) : (
        <input type={type} name={name} required={required} className="w-full rounded-lg border border-zinc-300 px-4 py-2 text-sm outline-none focus:border-emerald-500" />
      )}
    </div>
  );
}

function SelectField({ label, name, options }: { label: string; name: string; options: { value: string; label: string }[] }) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-zinc-700">{label}</label>
      <select name={name} className="w-full rounded-lg border border-zinc-300 px-4 py-2 text-sm outline-none focus:border-emerald-500">
        {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </div>
  );
}
