import Link from "next/link";

interface ToolCardProps {
  id: number;
  model: string;
  description: string;
  manufacturerName: string;
  toolTypeName: string;
  amortizationRateName: string;
}

const typeColors: Record<string, string> = {
  "Hand Tool": "bg-blue-100 text-blue-700",
  "Power Tool": "bg-amber-100 text-amber-700",
  "Gardening Tool": "bg-green-100 text-green-700",
  "Construction Tool": "bg-purple-100 text-purple-700",
  "Specialty Tool": "bg-rose-100 text-rose-700",
};

export default function ToolCard({
  id, model, description, manufacturerName, toolTypeName, amortizationRateName,
}: ToolCardProps) {
  const colorClass = typeColors[toolTypeName] ?? "bg-zinc-100 text-zinc-700";

  return (
    <Link
      href={`/tools/${id}`}
      className="block rounded-lg border border-zinc-200 bg-white p-5 shadow-sm transition hover:shadow-md hover:border-zinc-300"
    >
      <div className="mb-2 flex items-start justify-between gap-2">
        <h3 className="font-semibold text-zinc-900 truncate">{model}</h3>
        <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium ${colorClass}`}>
          {toolTypeName}
        </span>
      </div>
      <p className="mb-3 line-clamp-2 text-sm text-zinc-500">{description}</p>
      <div className="flex items-center justify-between text-xs text-zinc-400">
        <span>{manufacturerName}</span>
        <span>{amortizationRateName} amortization</span>
      </div>
    </Link>
  );
}
