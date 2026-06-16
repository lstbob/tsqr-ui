import type { NextConfig } from "next";

// In production API_URL must be set explicitly so the rewrite target can never
// silently fall back to a plaintext http://localhost endpoint.
const API_URL =
  process.env.API_URL ??
  (process.env.NODE_ENV === "production"
    ? (() => {
        throw new Error("API_URL environment variable must be set in production");
      })()
    : "http://localhost:5000");

const nextConfig: NextConfig = {
  output: "standalone",
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${API_URL}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
