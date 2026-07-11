"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterToolPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [manufacturers, setManufacturers] = useState<{ id: number; name: string }[]>([]);

  if (manufacturers.length === 0) {
    fetch("/api/proxy/manufacturers")
      .then((r) => r.json())
      .then(setManufacturers)
      .catch(() => {});
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const fd = new FormData(e.currentTarget);
    const body = Object.fromEntries(fd.entries());

    try {
      const res = await fetch("/api/proxy/tools/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.message || "Failed to register tool");
        setLoading(false);
        return;
      }
      router.push("/tools");
      router.refresh();
    } catch {
      setError("Network error");
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl">
      <h1 className="mb-6 text-2xl font-bold text-forest-50">Register New Tool</h1>
      <form onSubmit={handleSubmit} className="space-y-4 rounded-lg border border-forest-700 bg-forest-900 p-6 shadow-sm shadow-black/20">
        <Field label="Model" name="model" required />
        <Field label="Description" name="description" required textarea />
        <SelectField label="Manufacturer" name="manufacturerId" options={manufacturers.map((m) => ({ value: String(m.id), label: m.name }))} required />
        <SelectField label="Tool Type" name="toolType" options={[
          { value: "1", label: "Hand Tool" }, { value: "2", label: "Power Tool" },
          { value: "3", label: "Gardening Tool" }, { value: "4", label: "Construction Tool" },
          { value: "5", label: "Specialty Tool" }, { value: "6", label: "Other" },
        ]} required />
        <SelectField label="Amortization Rate" name="amortizationRate" options={[
          { value: "1", label: "Low" }, { value: "2", label: "Medium" }, { value: "3", label: "High" },
        ]} required />
        <Field label="Owner ID (member)" name="ownerId" type="number" required />
        <Field label="Serial Number" name="serialNumber" required />
        <SelectField label="Initial Condition" name="initialCondition" options={[
          { value: "1", label: "New" }, { value: "2", label: "Good" }, { value: "3", label: "Fair" },
          { value: "4", label: "Repaired" }, { value: "5", label: "Poor" },
        ]} required />
        <Field label="Metadata (JSON, optional)" name="metadata" />
        {error && <p className="rounded-lg bg-red-900/30 px-4 py-2 text-sm text-red-300">{error}</p>}
        <button type="submit" disabled={loading} className="rounded-lg bg-forest-500 px-6 py-2.5 text-sm font-semibold text-forest-950 hover:bg-forest-400 disabled:opacity-50">
          {loading ? "Registering..." : "Register Tool"}
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