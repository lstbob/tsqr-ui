"use client";

import { Suspense, useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import ToolCard from "../_components/ToolCard";
import SearchBar from "../_components/SearchBar";
import FilterDropdown from "../_components/FilterDropdown";
import Pagination from "../_components/Pagination";

interface ToolItem {
  id: number;
  model: string;
  description: string;
  toolType: number;
  toolTypeName: string;
  amortizationRate: number;
  amortizationRateName: string;
  manufacturerId: number;
  manufacturerName: string;
}

interface PagedResult {
  items: ToolItem[];
  totalCount: number;
  page: number;
  pageSize: number;
}

interface Manufacturer {
  id: number;
  name: string;
}

const toolTypeOptions = [
  { value: "1", label: "Hand Tool" },
  { value: "2", label: "Power Tool" },
  { value: "3", label: "Gardening Tool" },
  { value: "4", label: "Construction Tool" },
  { value: "5", label: "Specialty Tool" },
  { value: "6", label: "Other" },
];

function ToolsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const q = searchParams.get("q") ?? "";
  const type = searchParams.get("type") ?? "";
  const manufacturerId = searchParams.get("manufacturerId") ?? "";
  const page = parseInt(searchParams.get("page") ?? "1", 10);

  const [data, setData] = useState<PagedResult | null>(null);
  const [manufacturers, setManufacturers] = useState<Manufacturer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/manufacturers")
      .then((r) => r.json())
      .then(setManufacturers)
      .catch(() => {});
  }, []);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (type) params.set("type", type);
    if (manufacturerId) params.set("manufacturerId", manufacturerId);
    params.set("page", String(page));

    fetch(`/api/tools?${params.toString()}`)
      .then((r) => r.json())
      .then((d) => { setData(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, [q, type, manufacturerId, page]);

  const setParam = useCallback(
    (key: string, value: string) => {
      const p = new URLSearchParams(searchParams.toString());
      if (value) p.set(key, value);
      else p.delete(key);
      if (key !== "page") p.set("page", "1");
      router.push(`/tools?${p.toString()}`);
    },
    [router, searchParams],
  );

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-zinc-900">Tool Library</h1>

      <div className="mb-6 flex flex-col gap-3 sm:flex-row">
        <div className="flex-1">
          <SearchBar value={q} onChange={(v) => setParam("q", v)} placeholder="Search tools..." />
        </div>
        <FilterDropdown
          value={type}
          onChange={(v) => setParam("type", v)}
          options={toolTypeOptions}
          placeholder="All Types"
        />
        <FilterDropdown
          value={manufacturerId}
          onChange={(v) => setParam("manufacturerId", v)}
          options={manufacturers.map((m) => ({ value: String(m.id), label: m.name }))}
          placeholder="All Manufacturers"
        />
      </div>

      {loading ? (
        <p className="py-12 text-center text-zinc-400">Loading...</p>
      ) : data && data.items.length > 0 ? (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {data.items.map((tool) => (
              <ToolCard
                key={tool.id}
                id={tool.id}
                model={tool.model}
                description={tool.description}
                manufacturerName={tool.manufacturerName}
                toolTypeName={tool.toolTypeName}
                amortizationRateName={tool.amortizationRateName}
              />
            ))}
          </div>
          <Pagination
            page={data.page}
            pageSize={data.pageSize}
            totalCount={data.totalCount}
            onPageChange={(p) => setParam("page", String(p))}
          />
        </>
      ) : (
        <p className="py-12 text-center text-zinc-400">No tools found.</p>
      )}
    </div>
  );
}

export default function ToolsPage() {
  return (
    <Suspense fallback={<p className="py-12 text-center text-zinc-400">Loading...</p>}>
      <ToolsContent />
    </Suspense>
  );
}
