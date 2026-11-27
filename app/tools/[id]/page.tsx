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
  Low: "bg-green-900/40 text-green-300",
  Medium: "bg-yellow-900/40 text-yellow-300",
  High: "bg-orange-900/40 text-orange-300",
  Critical: "bg-red-900/40 text-red-300",
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
        <h1 className="text-2xl font-bold text-forest-50">Tool Not Found</h1>
        <Link href="/tools" className="mt-4 inline-block text-sm font-medium text-forest-300 underline">
          &larr; Back to Tool Library
        </Link>
      </div>
    );
  }

  return (
    <div>
      <Link href="/tools" className="mb-6 inline-block text-sm font-medium text-forest-200 hover:text-forest-50">
        &larr; Back to Tool Library
      </Link>

      <div className="rounded-lg border border-forest-700 bg-forest-900 p-6 shadow-sm shadow-black/20">
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-forest-50">{tool.model}</h1>
            <p className="mt-1 text-forest-200">{tool.manufacturerName}</p>
          </div>
          <div className="flex gap-2">
            <Link href={`/tools/${tool.id}/edit`} className="rounded-lg border border-forest-600 px-3 py-1.5 text-sm font-medium text-forest-200 hover:bg-forest-800">
              Edit
            </Link>
            <Link href={`/tools/${tool.id}/actions`} className="rounded-lg bg-forest-500 px-3 py-1.5 text-sm font-medium text-forest-950 hover:bg-forest-400">
              Actions
            </Link>
          </div>
        </div>

        <p className="mb-6 text-forest-100">{tool.description}</p>

        <div className="mb-6 grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-forest-400">Type</span>
            <p className="font-medium text-forest-100">{tool.toolTypeName}</p>
          </div>
          <div>
            <span className="text-forest-400">Amortization</span>
            <p className="font-medium text-forest-100">{tool.amortizationRateName}</p>
          </div>
          {tool.metadata && (
            <div>
              <span className="text-forest-400">Metadata</span>
              <p className="font-medium text-forest-100">{tool.metadata}</p>
            </div>
          )}
        </div>

        {tool.scarcityByLocation.length > 0 && (
          <div>
            <h2 className="mb-3 text-lg font-semibold text-forest-100">Scarcity by Location</h2>
            <div className="overflow-hidden rounded-lg border border-forest-700">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-forest-800 text-left text-forest-200">
                    <th className="px-4 py-2 font-medium">Location</th>
                    <th className="px-4 py-2 font-medium">Scarcity Level</th>
                  </tr>
                </thead>
                <tbody>
                  {tool.scarcityByLocation.map((s) => (
                    <tr key={s.locationId} className="border-t border-forest-700">
                      <td className="px-4 py-2 text-forest-100">{s.locationName}</td>
                      <td className="px-4 py-2">
                        <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${scarcityColors[s.scarcityLevelName] ?? "bg-forest-800 text-forest-100"}`}>
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