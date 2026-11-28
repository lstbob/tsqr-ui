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
  "Hand Tool": "bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300",
  "Power Tool": "bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300",
  "Gardening Tool": "bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300",
  "Construction Tool": "bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300",
  "Specialty Tool": "bg-rose-900/40 text-rose-300",
};

export default function ToolCard({
  id, model, description, manufacturerName, toolTypeName, amortizationRateName,
}: ToolCardProps) {
  const colorClass = typeColors[toolTypeName] ?? "bg-ui-800 text-ui-100";

  return (
    <Link
      href={`/tools/${id}`}
      className="block rounded-lg border border-ui-700 bg-ui-900 p-5 shadow-sm shadow-black/20 transition hover:shadow-md hover:shadow-black/30 hover:border-ui-500"
    >
      <div className="mb-2 flex items-start justify-between gap-2">
        <h3 className="font-semibold text-ui-50 truncate">{model}</h3>
        <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium ${colorClass}`}>
          {toolTypeName}
        </span>
      </div>
      <p className="mb-3 line-clamp-2 text-sm text-ui-200">{description}</p>
      <div className="flex items-center justify-between text-xs text-ui-400">
        <span>{manufacturerName}</span>
        <span>{amortizationRateName} amortization</span>
      </div>
    </Link>
  );
}
