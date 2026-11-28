"use client";

interface StatsCardProps {
  label: string;
  value: number;
  icon: string;
}

export default function StatsCard({ label, value, icon }: StatsCardProps) {
  return (
    <div className="flex items-center gap-4 rounded-lg border border-ui-700 bg-ui-900 p-5 shadow-sm shadow-black/20">
      <span className="text-3xl">{icon}</span>
      <div>
        <p className="text-2xl font-bold text-ui-50">{value}</p>
        <p className="text-sm text-ui-400">{label}</p>
      </div>
    </div>
  );
}
