"use client";

interface StatsCardProps {
  label: string;
  value: number;
  icon: string;
}

export default function StatsCard({ label, value, icon }: StatsCardProps) {
  return (
    <div className="flex items-center gap-4 rounded-lg border border-zinc-200 bg-white p-5 shadow-sm">
      <span className="text-3xl">{icon}</span>
      <div>
        <p className="text-2xl font-bold text-zinc-900">{value}</p>
        <p className="text-sm text-zinc-500">{label}</p>
      </div>
    </div>
  );
}
