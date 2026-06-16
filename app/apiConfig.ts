// Resolve the backend base URL used for server-side fetches.
// In production API_URL must be set explicitly so the app can never silently
// fall back to a plaintext http://localhost endpoint; the localhost default is
// for local development only.
export function resolveApiUrl(): string {
  const url = process.env.API_URL;
  if (url) return url;
  if (process.env.NODE_ENV === "production") {
    throw new Error("API_URL environment variable must be set in production");
  }
  return "http://localhost:5000";
}

export const API_URL = resolveApiUrl();
