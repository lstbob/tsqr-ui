"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function EditCommunityPage({ params }: { params: Promise<{ id: string }> }) {
  return <EditCommunityForm id={params} />;
}

function EditCommunityForm({ id }: { id: Promise<{ id: string }> }) {
  const router = useRouter();
  const [communityId, setCommunityId] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState("");
  const [community, setCommunity] = useState<any>(null);

  useEffect(() => {
    id.then(async ({ id: resolvedId }) => {
      setCommunityId(resolvedId);
      try {
        const res = await fetch(`/api/proxy/communities/${resolvedId}`);
        if (!res.ok) throw new Error("Not found");
        const data = await res.json();
        setCommunity(data);
      } catch {
        setError("Failed to load community");
      }
      setFetching(false);
    });
  }, [id]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const fd = new FormData(e.currentTarget);
    const body = {
      id: Number(communityId),
      name: fd.get("name"),
      description: fd.get("description"),
      contactEmail: fd.get("contactEmail"),
      contactPhone: fd.get("contactPhone"),
    };

    try {
      const res = await fetch("/api/proxy/communities", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.message || "Failed to update community");
        setLoading(false);
        return;
      }
      router.push(`/communities/${communityId}`);
      router.refresh();
    } catch {
      setError("Network error");
      setLoading(false);
    }
  }

  if (fetching) {
    return <p className="py-12 text-center text-forest-400">Loading...</p>;
  }

  if (error && !community) {
    return (
      <div className="py-16 text-center">
        <h1 className="text-2xl font-bold text-forest-50">{error}</h1>
      </div>
    );
  }

  return (
    <div className="max-w-2xl">
      <h1 className="mb-6 text-2xl font-bold text-forest-50">Edit Community</h1>
      <form onSubmit={handleSubmit} className="space-y-4 rounded-lg border border-forest-700 bg-forest-900 p-6 shadow-sm shadow-black/20">
        <div className="rounded-lg px-4 py-3 text-sm text-forest-200">
          <span className="font-medium text-forest-100">{community?.country}</span>
          {" → "}
          <span className="font-medium text-forest-100">{community?.city}</span>
          {" → "}
          <span className="font-medium text-forest-100">{community?.neighbourhood}</span>
          <p className="mt-1 text-xs text-forest-400">Location is fixed after registration.</p>
        </div>
        <Field label="Community Name" name="name" defaultValue={community?.name} required />
        <Field label="Description" name="description" defaultValue={community?.description} required textarea />
        <Field label="Contact Email" name="contactEmail" type="email" defaultValue={community?.contactEmail} required />
        <Field label="Contact Phone" name="contactPhone" type="tel" defaultValue={community?.contactPhone} />
        {error && <p className="rounded-lg bg-red-900/30 px-4 py-2 text-sm text-red-300">{error}</p>}
        <button type="submit" disabled={loading} className="rounded-lg bg-forest-500 px-6 py-2.5 text-sm font-semibold text-white hover:bg-forest-400 disabled:opacity-50">
          {loading ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
}

function Field({ label, name, type = "text", required, textarea, defaultValue }: { label: string; name: string; type?: string; required?: boolean; textarea?: boolean; defaultValue?: string }) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-forest-100">{label}{required && " *"}</label>
      {textarea ? (
        <textarea name={name} required={required} rows={3} defaultValue={defaultValue} className="w-full rounded-lg border border-forest-600 px-4 py-2 text-sm outline-none focus:border-forest-400" />
      ) : (
        <input type={type} name={name} required={required} defaultValue={defaultValue} className="w-full rounded-lg border border-forest-600 px-4 py-2 text-sm outline-none focus:border-forest-400" />
      )}
    </div>
  );
}
