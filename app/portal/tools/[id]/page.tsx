import Link from "next/link";
import { cookies } from "next/headers";
import { getGatewayUrl, ACCESS_TOKEN_COOKIE } from "@lib/config";

interface ToolDetail {
  id: number;
  model: string;
  description: string;
  manufacturerId: number;
  manufacturerName: string;
  toolType: number;
  toolTypeName: string;
  amortizationRate: number;
  amortizationRateName: string;
  metadata: string | null;
  scarcityByLocation: { locationId: number; locationName: string; scarcityLevel: number; scarcityLevelName: string }[];
}

const scarcityColors: Record<string, string> = {
  Low: "bg-green-100 text-green-700",
  Medium: "bg-yellow-100 text-yellow-700",
  High: "bg-orange-100 text-orange-700",
  Critical: "bg-red-100 text-red-700",
};

async function getTool(id: string) {
  const cookieStore = await cookies();
  const token = cookieStore.get(ACCESS_TOKEN_COOKIE)?.value;
  try {
    const res = await fetch(`${getGatewayUrl()}/api/tools/${id}`, {
      cache: "no-store",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export default async function ToolDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const tool = await getTool(id) as ToolDetail | null;

  if (!tool) {
    return (
      <div className="py-16 text-center">
        <h1 className="text-2xl font-bold text-zinc-900">Tool Not Found</h1>
        <Link href="/portal/tools" className="mt-4 inline-block text-sm font-medium text-emerald-700 underline">
          &larr; Back to Tool Library
        </Link>
      </div>
    );
  }

  return (
    <div>
      <Link href="/portal/tools" className="mb-6 inline-block text-sm font-medium text-zinc-500 hover:text-zinc-900">
        &larr; Back to Tool Library
      </Link>

      <div className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm">
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-zinc-900">{tool.model}</h1>
            <p className="mt-1 text-zinc-500">{tool.manufacturerName}</p>
          </div>
          <div className="flex gap-2">
            <Link href={`/portal/tools/${tool.id}/edit`} className="rounded-lg border border-zinc-300 px-3 py-1.5 text-sm font-medium text-zinc-600 hover:bg-zinc-50">
              Edit
            </Link>
            <Link href={`/portal/tools/${tool.id}/actions`} className="rounded-lg bg-emerald-700 px-3 py-1.5 text-sm font-medium text-white hover:bg-emerald-800">
              Actions
            </Link>
          </div>
        </div>

        <p className="mb-6 text-zinc-700">{tool.description}</p>

        <div className="mb-6 grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-zinc-400">Type</span>
            <p className="font-medium text-zinc-800">{tool.toolTypeName}</p>
          </div>
          <div>
            <span className="text-zinc-400">Amortization</span>
            <p className="font-medium text-zinc-800">{tool.amortizationRateName}</p>
          </div>
          {tool.metadata && (
            <div>
              <span className="text-zinc-400">Metadata</span>
              <p className="font-medium text-zinc-800">{tool.metadata}</p>
            </div>
          )}
        </div>

        {tool.scarcityByLocation.length > 0 && (
          <div>
            <h2 className="mb-3 text-lg font-semibold text-zinc-800">Scarcity by Location</h2>
            <div className="overflow-hidden rounded-lg border border-zinc-200">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-zinc-50 text-left text-zinc-500">
                    <th className="px-4 py-2 font-medium">Location</th>
                    <th className="px-4 py-2 font-medium">Scarcity Level</th>
                  </tr>
                </thead>
                <tbody>
                  {tool.scarcityByLocation.map((s) => (
                    <tr key={s.locationId} className="border-t border-zinc-100">
                      <td className="px-4 py-2 text-zinc-800">{s.locationName}</td>
                      <td className="px-4 py-2">
                        <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${scarcityColors[s.scarcityLevelName] ?? "bg-zinc-100 text-zinc-700"}`}>
                          {s.scarcityLevelName}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}