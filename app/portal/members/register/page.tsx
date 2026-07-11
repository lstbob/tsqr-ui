"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function RegisterMemberPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const fd = new FormData(e.currentTarget);
    const body: Record<string, unknown> = {
      firstName: fd.get("firstName"),
      middleName: fd.get("middleName") || "",
      lastName: fd.get("lastName"),
      age: Number(fd.get("age")),
      address: fd.get("address"),
      email: fd.get("email"),
      phoneNumber: fd.get("phoneNumber"),
      status: Number(fd.get("status")),
    };
    const mt = fd.get("membershipType");
    if (mt) {
      body.membershipType = Number(mt);
      body.membershipStartDate = new Date().toISOString().split("T")[0];
    }

    try {
      const res = await fetch("/api/proxy/members/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.message || "Failed to register member");
        setLoading(false);
        return;
      }
      router.push("/portal/members");
      router.refresh();
    } catch {
      setError("Network error");
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl">
      <h1 className="mb-6 text-2xl font-bold text-forest-50">Register New Member</h1>
      <form onSubmit={handleSubmit} className="space-y-4 rounded-lg border border-forest-700 bg-forest-900 p-6 shadow-sm shadow-black/20">
        <div className="grid grid-cols-3 gap-4">
          <Field label="First Name" name="firstName" required />
          <Field label="Middle Name" name="middleName" />
          <Field label="Last Name" name="lastName" required />
        </div>
        <Field label="Age" name="age" type="number" required />
        <Field label="Address" name="address" required />
        <Field label="Email" name="email" type="email" required />
        <Field label="Phone Number" name="phoneNumber" required />
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-forest-100">Status</label>
            <select name="status" className="w-full rounded-lg border border-forest-600 px-4 py-2 text-sm">
              <option value="1">Active</option>
              <option value="2">Suspended</option>
              <option value="3">Banned</option>
            </select>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-forest-100">Membership Type</label>
            <select name="membershipType" className="w-full rounded-lg border border-forest-600 px-4 py-2 text-sm">
              <option value="">None</option>
              <option value="1">Regular</option>
              <option value="2">Repairman</option>
              <option value="3">Location Coordinator</option>
              <option value="4">Admin</option>
            </select>
          </div>
        </div>
        {error && <p className="rounded-lg bg-red-900/30 px-4 py-2 text-sm text-red-300">{error}</p>}
        <button type="submit" disabled={loading} className="rounded-lg bg-forest-500 px-6 py-2.5 text-sm font-semibold text-forest-950 hover:bg-forest-400 disabled:opacity-50">
          {loading ? "Registering..." : "Register Member"}
        </button>
      </form>
    </div>
  );
}

function Field({ label, name, type = "text", required }: { label: string; name: string; type?: string; required?: boolean }) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-forest-100">{label}{required && " *"}</label>
      <input type={type} name={name} required={required} className="w-full rounded-lg border border-forest-600 px-4 py-2 text-sm outline-none focus:border-forest-400" />
    </div>
  );
}