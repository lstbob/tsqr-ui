"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams.get("from") || "/portal";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Login failed");
        setLoading(false);
        return;
      }

      router.push(from);
      router.refresh();
    } catch {
      setError("Network error. Please try again.");
      setLoading(false);
    }
  }

  return (
    <div className="rounded-xl border border-ui-700 bg-ui-900 p-8 shadow-sm shadow-black/20">
      <h1 className="text-2xl font-bold text-ui-50">Sign In</h1>
      <p className="mt-1 text-sm text-ui-200">Access your TownsSquare account</p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-ui-100">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
            className="w-full rounded-lg border border-ui-600 bg-ui-950 px-4 py-2 text-sm text-ui-50 outline-none placeholder:text-ui-600 focus:border-ui-400 focus:ring-1 focus:ring-ui-400"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-ui-100">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
            className="w-full rounded-lg border border-ui-600 bg-ui-950 px-4 py-2 text-sm text-ui-50 outline-none placeholder:text-ui-600 focus:border-ui-400 focus:ring-1 focus:ring-ui-400"
          />
        </div>
        {error && (
          <p className="rounded-lg bg-red-50 dark:bg-red-900/30 px-4 py-2 text-sm text-red-700 dark:text-red-300">{error}</p>
        )}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-ui-50 px-4 py-2.5 text-sm font-semibold text-ui-950 shadow-sm shadow-black/20 transition hover:bg-ui-200 disabled:opacity-50"
        >
          {loading ? "Signing in..." : "Sign In"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-ui-200">
        Don&apos;t have an account?{" "}
        <a href="/register" className="font-medium text-ui-300 hover:underline">Create one</a>
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="rounded-xl border border-ui-700 bg-ui-900 p-8 shadow-sm shadow-black/20"><p className="text-ui-500">Loading...</p></div>}>
      <LoginForm />
    </Suspense>
  );
}