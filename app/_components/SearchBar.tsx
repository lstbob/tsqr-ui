"use client";

import { useCallback, useRef } from "react";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function SearchBar({ value, onChange, placeholder = "Search..." }: SearchBarProps) {
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      clearTimeout(timer.current);
      timer.current = setTimeout(() => onChange(e.target.value), 300);
    },
    [onChange],
  );

  return (
    <input
      type="text"
      defaultValue={value}
      onChange={handleChange}
      placeholder={placeholder}
      className="w-full rounded-lg border border-forest-600 bg-forest-950 px-4 py-2 text-sm text-forest-50 outline-none placeholder:text-forest-500 focus:border-forest-400 focus:ring-1 focus:ring-forest-400"
    />
  );
}
