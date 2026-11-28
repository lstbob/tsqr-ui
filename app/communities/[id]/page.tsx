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
      return "bg-yellow-100 dark:bg-yellow-900/40 text-yellow-700 dark:text-yellow-300";
    case "Active":
      return "bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300";
    case "Suspended":
      return "bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300";
    case "Archived":
      return "bg-gray-800 text-gray-300";
    default:
      return "bg-ui-800 text-ui-100";
  }
}

export default async function CommunityDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const community = await getCommunity(id) as Community | null;

  if (!community) {
    return (
      <div className="py-16 text-center">
        <h1 className="text-2xl font-bold text-ui-50">Community Not Found</h1>
        <Link href="/communities/browse" className="mt-4 inline-block text-sm font-medium text-ui-300 underline">
          &larr; Back to Browse
        </Link>
      </div>
    );
  }

  return (
    <div>
      <Link href="/communities/browse" className="mb-6 inline-block text-sm font-medium text-ui-200 hover:text-ui-50">
        &larr; Back to Browse
      </Link>

      <div className="rounded-lg border border-ui-700 bg-ui-900 p-6 shadow-sm shadow-black/20">
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-ui-50">{community.name}</h1>
            <p className="mt-1 text-ui-200">
              <span className="font-medium text-ui-100">{community.country}</span>
              {" → "}
              <span className="font-medium text-ui-100">{community.city}</span>
              {" → "}
              <span className="font-medium text-ui-100">{community.neighbourhood}</span>
            </p>
          </div>
          <div className="flex gap-2">
            <Link href={`/communities/${community.id}/edit`} className="rounded-lg border border-ui-600 px-3 py-1.5 text-sm font-medium text-ui-200 hover:bg-ui-800">
              Edit
            </Link>
          </div>
        </div>

        <p className="mb-6 text-ui-100">{community.description}</p>

        <div className="mb-6 grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-ui-400">Status</span>
            <p className="mt-0.5">
              <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${statusBadgeClass(community.statusName)}`}>
                {community.statusName}
              </span>
            </p>
          </div>
          <div>
            <span className="text-ui-400">Contact Email</span>
            <p className="font-medium text-ui-100">{community.contactEmail || "—"}</p>
          </div>
          <div>
            <span className="text-ui-400">Contact Phone</span>
            <p className="font-medium text-ui-100">{community.contactPhone || "—"}</p>
          </div>
          <div>
            <span className="text-ui-400">Created At</span>
            <p className="font-medium text-ui-100">{community.createdAt ? new Date(community.createdAt).toLocaleString() : "—"}</p>
          </div>
        </div>

        {community.statusName === "PendingConfirmation" && <ConfirmButton id={community.id} />}
      </div>
    </div>
  );
}
