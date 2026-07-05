import Link from "next/link";
import { cookies } from "next/headers";
import { getGatewayUrl, ACCESS_TOKEN_COOKIE } from "@lib/config";
import ConfirmButton from "./ConfirmButton";

interface Community {
  id: number;
  name: string;
  description: string;
  neighbourhood: string;
  city: string;
  country: string;
  contactEmail: string;
  contactPhone: string;
  status: number;
  statusName: string;
  createdAt: string;
}

async function getCommunity(id: string) {
  const cookieStore = await cookies();
  const token = cookieStore.get(ACCESS_TOKEN_COOKIE)?.value;
  try {
    const res = await fetch(`${getGatewayUrl()}/api/communities/${id}`, {
      cache: "no-store",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

function statusBadgeClass(statusName: string) {
  switch (statusName) {
    case "PendingConfirmation":
      return "bg-yellow-100 text-yellow-700";
    case "Active":
      return "bg-green-100 text-green-700";
    case "Suspended":
      return "bg-red-100 text-red-700";
    case "Archived":
      return "bg-gray-100 text-gray-700";
    default:
      return "bg-zinc-100 text-zinc-700";
  }
}

export default async function CommunityDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const community = await getCommunity(id) as Community | null;

  if (!community) {
    return (
      <div className="py-16 text-center">
        <h1 className="text-2xl font-bold text-zinc-900">Community Not Found</h1>
        <Link href="/communities/browse" className="mt-4 inline-block text-sm font-medium text-emerald-700 underline">
          &larr; Back to Browse
        </Link>
      </div>
    );
  }

  return (
    <div>
      <Link href="/communities/browse" className="mb-6 inline-block text-sm font-medium text-zinc-500 hover:text-zinc-900">
        &larr; Back to Browse
      </Link>

      <div className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm">
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-zinc-900">{community.name}</h1>
            <p className="mt-1 text-zinc-500">
              <span className="font-medium text-zinc-700">{community.country}</span>
              {" → "}
              <span className="font-medium text-zinc-700">{community.city}</span>
              {" → "}
              <span className="font-medium text-zinc-700">{community.neighbourhood}</span>
            </p>
          </div>
          <div className="flex gap-2">
            <Link href={`/communities/${community.id}/edit`} className="rounded-lg border border-zinc-300 px-3 py-1.5 text-sm font-medium text-zinc-600 hover:bg-zinc-50">
              Edit
            </Link>
          </div>
        </div>

        <p className="mb-6 text-zinc-700">{community.description}</p>

        <div className="mb-6 grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-zinc-400">Status</span>
            <p className="mt-0.5">
              <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${statusBadgeClass(community.statusName)}`}>
                {community.statusName}
              </span>
            </p>
          </div>
          <div>
            <span className="text-zinc-400">Contact Email</span>
            <p className="font-medium text-zinc-800">{community.contactEmail || "—"}</p>
          </div>
          <div>
            <span className="text-zinc-400">Contact Phone</span>
            <p className="font-medium text-zinc-800">{community.contactPhone || "—"}</p>
          </div>
          <div>
            <span className="text-zinc-400">Created At</span>
            <p className="font-medium text-zinc-800">{community.createdAt ? new Date(community.createdAt).toLocaleString() : "—"}</p>
          </div>
        </div>

        {community.statusName === "PendingConfirmation" && <ConfirmButton id={community.id} />}
      </div>
    </div>
  );
}
