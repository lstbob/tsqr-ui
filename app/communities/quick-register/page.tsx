"use client";

import { useState } from "react";

export default function QuickRegisterPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);
    const fd = new FormData(e.currentTarget);
    const body = Object.fromEntries(fd.entries());

    try {
      const res = await fetch("/api/proxy/communities/quick-register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.message || "Registration failed");
        setLoading(false);
        return;
      }
      setSuccess(true);
      setLoading(false);
    } catch {
      setError("Network error");
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="mx-auto max-w-lg py-16 text-center">
        <div className="rounded-lg border border-green-800 bg-green-900/30 p-8">
          <h2 className="text-xl font-bold text-green-300">Registration Submitted</h2>
          <p className="mt-2 text-green-300">
            Thank you! Your community registration has been received. An admin needs to review and approve it before it becomes active.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-6 text-2xl font-bold text-forest-50">Quick Register</h1>
      <p className="mb-6 text-sm text-forest-200">
        Register a new neighbourhood community. An admin will review and approve your submission.
      </p>
      <form onSubmit={handleSubmit} className="space-y-4 rounded-lg border border-forest-700 bg-forest-900 p-6 shadow-sm shadow-black/20">
        <Field label="Country Name" name="country" required />
        <Field label="City Name" name="city" required />
        <Field label="Neighbourhood Name" name="neighbourhood" required />
        <Field label="Community Name" name="name" required />
        <Field label="Description" name="description" required textarea />
        <Field label="Contact Email" name="contactEmail" type="email" required />
        <Field label="Contact Phone" name="contactPhone" type="tel" />
        {error && <p className="rounded-lg bg-red-900/30 px-4 py-2 text-sm text-red-300">{error}</p>}
        <button type="submit" disabled={loading} className="rounded-lg bg-forest-500 px-6 py-2.5 text-sm font-semibold text-white hover:bg-forest-400 disabled:opacity-50">
          {loading ? "Submitting..." : "Submit Registration"}
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
