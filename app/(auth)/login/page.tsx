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
    <div className="rounded-xl border border-forest-700 bg-forest-900 p-8 shadow-sm shadow-black/20">
      <h1 className="text-2xl font-bold text-forest-50">Sign In</h1>
      <p className="mt-1 text-sm text-forest-200">Access your TownsSquare account</p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-forest-100">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
            className="w-full rounded-lg border border-forest-600 bg-forest-950 px-4 py-2 text-sm text-forest-50 outline-none placeholder:text-forest-600 focus:border-forest-400 focus:ring-1 focus:ring-forest-400"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-forest-100">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
            className="w-full rounded-lg border border-forest-600 bg-forest-950 px-4 py-2 text-sm text-forest-50 outline-none placeholder:text-forest-600 focus:border-forest-400 focus:ring-1 focus:ring-forest-400"
          />
        </div>
        {error && (
          <p className="rounded-lg bg-red-900/30 px-4 py-2 text-sm text-red-300">{error}</p>
        )}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-forest-500 px-4 py-2.5 text-sm font-semibold text-forest-950 shadow-sm shadow-black/20 transition hover:bg-forest-400 disabled:opacity-50"
        >
          {loading ? "Signing in..." : "Sign In"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-forest-200">
        Don&apos;t have an account?{" "}
        <a href="/register" className="font-medium text-forest-300 hover:underline">Create one</a>
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="rounded-xl border border-forest-700 bg-forest-900 p-8 shadow-sm shadow-black/20"><p className="text-forest-500">Loading...</p></div>}>
      <LoginForm />
    </Suspense>
  );
}