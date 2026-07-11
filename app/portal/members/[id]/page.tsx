"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";

export default function MemberDetailPage() {
  const params = useParams();
  const id = params.id;
  const [member, setMember] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState("");
  const [error, setError] = useState("");
  const [actionResult, setActionResult] = useState("");

  useEffect(() => {
    fetch(`/api/proxy/members/${id}`)
      .then((r) => r.json())
      .then((d) => { setMember(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, [id]);

  async function postAction(endpoint: string, body: Record<string, unknown>, label: string) {
    setActionLoading(label);
    setError("");
    setActionResult("");
    try {
      const res = await fetch(`/api/proxy/${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.message || `${label} failed`);
      } else {
        setActionResult(`${label} succeeded.`);
        // Refresh
        fetch(`/api/proxy/members/${id}`).then((r) => r.json()).then(setMember);
      }
    } catch {
      setError("Network error");
    }
    setActionLoading("");
  }

  if (loading) return <p className="py-12 text-center text-forest-400">Loading...</p>;
  if (!member) return <p className="py-12 text-center text-forest-400">Member not found.</p>;

  return (
    <div className="max-w-3xl">
      <h1 className="mb-6 text-2xl font-bold text-forest-50">{member.fullName}</h1>
      <div className="mb-6 rounded-lg border border-forest-700 bg-forest-900 p-6 shadow-sm shadow-black/20">
        <dl className="grid grid-cols-2 gap-4 text-sm">
          <div><dt className="text-forest-400">ID</dt><dd className="font-medium text-forest-100">{member.id}</dd></div>
          <div><dt className="text-forest-400">Email</dt><dd className="font-medium text-forest-100">{member.email}</dd></div>
          <div><dt className="text-forest-400">Phone</dt><dd className="font-medium text-forest-100">{member.phoneNumber}</dd></div>
          <div><dt className="text-forest-400">Age</dt><dd className="font-medium text-forest-100">{member.age}</dd></div>
          <div><dt className="text-forest-400">Address</dt><dd className="font-medium text-forest-100">{member.address}</dd></div>
          <div><dt className="text-forest-400">Status</dt><dd><span className={`rounded-full px-2 py-0.5 text-xs font-medium ${member.statusName === "Active" ? "bg-green-900/40 text-green-300" : member.statusName === "Suspended" ? "bg-yellow-900/40 text-yellow-300" : "bg-red-900/40 text-red-300"}`}>{member.statusName}</span></dd></div>
          <div><dt className="text-forest-400">Membership</dt><dd className="font-medium text-forest-100">{member.membershipTypeName || "—"}</dd></div>
          <div><dt className="text-forest-400">Verified</dt><dd className="font-medium text-forest-100">{member.isVerified ? "Yes" : "No"}</dd></div>
          {member.startDate && <div><dt className="text-forest-400">Start Date</dt><dd className="font-medium text-forest-100">{new Date(member.startDate).toLocaleDateString()}</dd></div>}
          {member.endDate && <div><dt className="text-forest-400">End Date</dt><dd className="font-medium text-forest-100">{new Date(member.endDate).toLocaleDateString()}</dd></div>}
        </dl>
      </div>

      {error && <p className="mb-4 rounded-lg bg-red-900/30 px-4 py-2 text-sm text-red-300">{error}</p>}
      {actionResult && <p className="mb-4 rounded-lg bg-green-900/30 px-4 py-2 text-sm text-green-300">{actionResult}</p>}

      <h2 className="mb-3 text-lg font-semibold text-forest-100">Administrative Actions</h2>
      <div className="flex flex-wrap gap-2">
        {!member.isVerified && (
          <button onClick={() => postAction("members/verify", { memberId: member.id, adminId: 1 }, "Verify")} disabled={!!actionLoading} className="rounded-lg bg-green-800 px-4 py-2 text-sm font-medium text-green-100 hover:bg-green-600 disabled:opacity-50">
            {actionLoading === "Verify" ? "..." : "Verify Member"}
          </button>
        )}
        {member.statusName === "Active" && (
          <button onClick={() => postAction("members/suspend", { memberId: member.id }, "Suspend")} disabled={!!actionLoading} className="rounded-lg bg-yellow-800 px-4 py-2 text-sm font-medium text-yellow-100 hover:bg-yellow-600 disabled:opacity-50">
            {actionLoading === "Suspend" ? "..." : "Suspend"}
          </button>
        )}
        {member.statusName !== "Banned" && (
          <button onClick={() => postAction("members/ban", { memberId: member.id }, "Ban")} disabled={!!actionLoading} className="rounded-lg bg-red-800 px-4 py-2 text-sm font-medium text-red-100 hover:bg-red-600 disabled:opacity-50">
            {actionLoading === "Ban" ? "..." : "Ban"}
          </button>
        )}
        {(member.statusName === "Suspended" || member.statusName === "Banned") && (
          <button onClick={() => postAction("members/reinstate", { memberId: member.id }, "Reinstate")} disabled={!!actionLoading} className="rounded-lg bg-green-800 px-4 py-2 text-sm font-medium text-green-100 hover:bg-green-600 disabled:opacity-50">
            {actionLoading === "Reinstate" ? "..." : "Reinstate"}
          </button>
        )}
      </div>
    </div>
  );
}