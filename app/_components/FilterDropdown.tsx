"use client";

interface FilterOption {
  value: string;
  label: string;
}

interface FilterDropdownProps {
  value: string;
  onChange: (value: string) => void;
  options: FilterOption[];
  placeholder?: string;
}

export default function FilterDropdown({
  value,
  onChange,
  options,
  placeholder = "All",
}: FilterDropdownProps) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="rounded-lg border border-ui-600 bg-ui-950 px-3 py-2 text-sm text-ui-50 outline-none focus:border-ui-400 focus:ring-1 focus:ring-ui-400"
    >
      <option value="" className="bg-ui-900">{placeholder}</option>
      {options.map((opt) => (
        <option key={opt.value} value={opt.value} className="bg-ui-900">
          {opt.label}
        </option>
      ))}
    </select>
  );
}
