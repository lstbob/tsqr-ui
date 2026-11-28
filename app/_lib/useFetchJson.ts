"use client";

import { useEffect, useState } from "react";

export function useFetchJson<T>(url: string | null): { data: T | null; loading: boolean } {
  const [state, setState] = useState<{ url: string | null; data: T | null }>({ url: null, data: null });

  useEffect(() => {
    if (!url) return;
    let cancelled = false;
    fetch(url)
      .then((r) => r.json() as Promise<T>)
      .then((d) => {
        if (!cancelled) setState({ url, data: d });
      })
      .catch(() => {
        if (!cancelled) setState({ url, data: null });
      });
    return () => {
      cancelled = true;
    };
  }, [url]);

  return {
    data: state.url === url ? state.data : null,
    loading: url !== null && state.url !== url,
  };
}
